/**
 * 棋盘管理器
 * 处理棋盘渲染和状态管理
 *
 * @author authorZhao
 * @license MIT
 */

const BoardManager = {
    // 棋盘尺寸配置
    COLS: 4,
    ROWS: 5,

    // 格子尺寸 (像素) - 桌面端
    CELL_SIZE_DESKTOP: 70,
    // 格子尺寸 (像素) - 移动端
    CELL_SIZE_MOBILE: 60,

    // 棋盘内容偏移
    BOARD_OFFSET: 0,

    // 棋盘DOM元素
    boardElement: null,

    // 获取当前格子尺寸
    get CELL_SIZE() {
        return window.innerWidth <= 500 ? this.CELL_SIZE_MOBILE : this.CELL_SIZE_DESKTOP;
    },

    // 当前棋子列表
    pieces: [],

    // 当前选中的棋子
    selectedPiece: null,

    // 初始化
    init(boardId) {
        this.boardElement = document.getElementById(boardId);
        this.pieces = [];
        this.selectedPiece = null;
    },

    // 清空棋盘
    clear() {
        if (this.boardElement) {
            this.boardElement.innerHTML = '';
        }
        this.pieces = [];
        this.selectedPiece = null;
    },

    // 加载关卡
    loadLevel(levelData) {
        this.clear();

        if (!levelData || !levelData.pieces) return;

        for (const pieceData of levelData.pieces) {
            const piece = new Piece(
                pieceData.type,
                pieceData.x,
                pieceData.y,
                pieceData.id
            );
            this.pieces.push(piece);
        }

        this.render();
    },

    // 渲染棋盘
    render() {
        if (!this.boardElement) return;

        this.boardElement.innerHTML = '';

        for (const piece of this.pieces) {
            const element = piece.createElement(this.CELL_SIZE, this.BOARD_OFFSET);
            this.boardElement.appendChild(element);
        }
    },

    // 获取所有棋子占用的格子
    getOccupiedCells() {
        const occupied = new Set();
        for (const piece of this.pieces) {
            for (const cell of piece.getOccupiedCells()) {
                occupied.add(`${cell.x},${cell.y}`);
            }
        }
        return occupied;
    },

    // 获取指定位置的棋子
    getPieceAt(x, y) {
        for (const piece of this.pieces) {
            if (piece.containsCell(x, y)) {
                return piece;
            }
        }
        return null;
    },

    // 选中棋子
    selectPiece(piece) {
        // 取消之前的选中
        if (this.selectedPiece) {
            this.selectedPiece.setSelected(false);
        }

        // 选中新棋子
        this.selectedPiece = piece;
        if (piece) {
            piece.setSelected(true);
            // 播放选中音效
            AudioManager.play('select');

            // 播放选中特效
            if (piece.element) {
                const rect = piece.element.getBoundingClientRect();
                const boardRect = this.boardElement.getBoundingClientRect();
                const x = rect.left - boardRect.left + rect.width / 2;
                const y = rect.top - boardRect.top + rect.height / 2;
                EffectsManager.playSelectEffect(x, y);
            }
        }
    },

    // 取消选中
    deselectPiece() {
        if (this.selectedPiece) {
            this.selectedPiece.setSelected(false);
            this.selectedPiece = null;
        }
    },

    // 尝试移动选中的棋子
    moveSelectedPiece(direction) {
        if (!this.selectedPiece) return false;

        const dx = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
        const dy = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;

        return this.movePiece(this.selectedPiece, dx, dy);
    },

    // 移动棋子
    movePiece(piece, dx, dy) {
        if (!piece) return false;

        const newX = piece.x + dx;
        const newY = piece.y + dy;

        // 检查边界
        if (!piece.canMoveTo(newX, newY)) {
            piece.playInvalidAnimation();
            return false;
        }

        // 检查碰撞
        const occupied = this.getOccupiedCells();
        let blocked = false;

        for (let px = 0; px < piece.width && !blocked; px++) {
            for (let py = 0; py < piece.height && !blocked; py++) {
                const checkX = newX + px;
                const checkY = newY + py;
                const key = `${checkX},${checkY}`;

                // 排除当前棋子占用的格子
                if (!piece.containsCell(checkX, checkY) && occupied.has(key)) {
                    blocked = true;
                }
            }
        }

        if (blocked) {
            piece.playInvalidAnimation();
            return false;
        }

        // 执行移动
        piece.x = newX;
        piece.y = newY;
        piece.updateElementPosition(this.CELL_SIZE, this.BOARD_OFFSET, true);

        // 播放移动音效
        AudioManager.play('move');

        return true;
    },

    // 检查是否胜利 (曹操在底部中间)
    checkWin() {
        for (const piece of this.pieces) {
            if (piece.type === 'cao') {
                // 曹操需要在位置 (1, 3) 即底部中间出口
                return piece.x === 1 && piece.y === 3;
            }
        }
        return false;
    },

    // 获取曹操棋子
    getCaoPiece() {
        return this.pieces.find(p => p.type === 'cao');
    },

    // 从像素坐标转换为格子坐标
    pixelToCell(pixelX, pixelY) {
        const x = Math.floor(pixelX / this.CELL_SIZE);
        const y = Math.floor(pixelY / this.CELL_SIZE);
        return { x, y };
    },

    // 从格子坐标转换为像素坐标
    cellToPixel(cellX, cellY) {
        return {
            x: cellX * this.CELL_SIZE,
            y: cellY * this.CELL_SIZE
        };
    },

    // 获取棋子可移动的方向
    getValidMovesForPiece(piece) {
        if (!piece) return [];
        return piece.getValidMoves(this.getOccupiedCells());
    },

    // 序列化当前状态
    serialize() {
        return this.pieces.map(p => p.serialize());
    },

    // 从序列化数据恢复
    deserialize(data) {
        this.pieces = data.map(d => Piece.fromData(d));
        this.render();
    },

    // 克隆当前状态
    cloneState() {
        return this.pieces.map(p => p.clone());
    },

    // 恢复状态
    restoreState(state) {
        this.pieces = state.map(p => p.clone());
        this.render();
    }
};

// 导出
window.BoardManager = BoardManager;
