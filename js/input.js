/**
 * 输入管理器
 * 处理鼠标、键盘和触摸输入
 *
 * @author authorZhao
 * @license MIT
 */

const InputManager = {
    // 是否已初始化
    initialized: false,

    // 移动回调
    onMove: null,

    // 选择回调
    onSelect: null,

    // 取消选择回调
    onDeselect: null,

    // 初始化
    init(boardId) {
        if (this.initialized) return;

        this.boardElement = document.getElementById(boardId);

        if (this.boardElement) {
            // 鼠标事件
            this.boardElement.addEventListener('click', (e) => this.handleClick(e));

            // 触摸事件
            this.boardElement.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
        }

        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // 点击空白处取消选中
        document.addEventListener('click', (e) => this.handleGlobalClick(e));

        this.initialized = true;
    },

    // 处理点击事件
    handleClick(event) {
        event.stopPropagation();

        const target = event.target.closest('.piece');
        if (!target) {
            // 点击空白处 - 尝试移动或取消选择
            this.handleEmptyClick(event);
            return;
        }

        const pieceId = target.dataset.id;
        if (!pieceId) return;

        // 触发选择回调
        if (this.onSelect) {
            this.onSelect(pieceId);
        }
    },

    // 处理空白区域点击
    handleEmptyClick(event) {
        if (!this.boardElement) return;

        const rect = this.boardElement.getBoundingClientRect();
        // 减去边框宽度，得到相对于内容区域的坐标
        const borderWidth = 8; // 与CSS中的边框宽度一致
        const x = event.clientX - rect.left - borderWidth;
        const y = event.clientY - rect.top - borderWidth;

        // 如果点击的是边框区域，忽略
        if (x < 0 || y < 0) return;

        const cell = BoardManager.pixelToCell(x, y);

        // 如果有选中的棋子，尝试向点击方向移动
        if (BoardManager.selectedPiece) {
            const piece = BoardManager.selectedPiece;

            // 检查点击的格子是否与棋子相邻（可以移动的位置）
            const validMoves = BoardManager.getValidMovesForPiece(piece);

            // 找到点击格子对应的有效移动
            for (const move of validMoves) {
                // 检查点击的格子是否在新位置范围内
                for (let px = 0; px < piece.width; px++) {
                    for (let py = 0; py < piece.height; py++) {
                        if (move.newX + px === cell.x && move.newY + py === cell.y) {
                            if (this.onMove) {
                                this.onMove(move.name);
                            }
                            return;
                        }
                    }
                }
            }

            // 如果没有匹配的有效移动，使用原来的方向判断逻辑
            const pieceCenterX = piece.x + piece.width / 2;
            const pieceCenterY = piece.y + piece.height / 2;

            const dx = cell.x - pieceCenterX;
            const dy = cell.y - pieceCenterY;

            // 判断主要方向
            if (Math.abs(dx) > Math.abs(dy)) {
                const direction = dx > 0 ? 'right' : 'left';
                if (this.onMove) {
                    this.onMove(direction);
                }
            } else if (dy !== 0) {
                const direction = dy > 0 ? 'down' : 'up';
                if (this.onMove) {
                    this.onMove(direction);
                }
            } else {
                if (this.onDeselect) {
                    this.onDeselect();
                }
            }
        }
    },

    // 处理触摸事件
    handleTouch(event) {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const fakeEvent = {
                target: document.elementFromPoint(touch.clientX, touch.clientY),
                clientX: touch.clientX,
                clientY: touch.clientY,
                stopPropagation: () => event.stopPropagation()
            };
            this.handleClick(fakeEvent);
        }
    },

    // 处理键盘事件
    handleKeyDown(event) {
        // 只在游戏界面响应键盘
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen || !gameScreen.classList.contains('active')) {
            return;
        }

        let direction = null;
        let handled = false;

        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                direction = 'up';
                handled = true;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                direction = 'down';
                handled = true;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                direction = 'left';
                handled = true;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                direction = 'right';
                handled = true;
                break;
            case 'Escape':
                // ESC 取消选择
                if (this.onDeselect) {
                    this.onDeselect();
                }
                handled = true;
                break;
            case 'z':
            case 'Z':
                // Ctrl+Z 撤销
                if (event.ctrlKey && this.onUndo) {
                    this.onUndo();
                    handled = true;
                }
                break;
            case 'r':
            case 'R':
                // R 重新开始
                if (this.onRestart) {
                    this.onRestart();
                    handled = true;
                }
                break;
        }

        if (handled) {
            event.preventDefault();
        }

        if (direction && this.onMove) {
            this.onMove(direction);
        }
    },

    // 处理全局点击
    handleGlobalClick(event) {
        // 如果点击的不是棋盘区域，取消选中
        if (this.boardElement && !this.boardElement.contains(event.target)) {
            if (this.onDeselect) {
                this.onDeselect();
            }
        }
    },

    // 设置回调
    setCallbacks(callbacks) {
        if (callbacks.onMove) this.onMove = callbacks.onMove;
        if (callbacks.onSelect) this.onSelect = callbacks.onSelect;
        if (callbacks.onDeselect) this.onDeselect = callbacks.onDeselect;
        if (callbacks.onUndo) this.onUndo = callbacks.onUndo;
        if (callbacks.onRestart) this.onRestart = callbacks.onRestart;
    },

    // 清除回调
    clearCallbacks() {
        this.onMove = null;
        this.onSelect = null;
        this.onDeselect = null;
        this.onUndo = null;
        this.onRestart = null;
    },

    // 销毁
    destroy() {
        // 移除事件监听器 (这里简化处理，实际项目中需要保存监听器引用)
        this.initialized = false;
        this.clearCallbacks();
    }
};

// 导出
window.InputManager = InputManager;
