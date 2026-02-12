/**
 * 游戏主逻辑
 *
 * @author authorZhao
 * @license MIT
 */

const Game = {
    // 当前关卡
    currentLevel: null,

    // 移动计数
    moveCount: 0,

    // 历史记录 (用于撤销)
    history: [],

    // 最大历史记录数
    maxHistory: 100,

    // 游戏状态
    state: 'idle', // idle, playing, won

    // 初始化
    init() {
        // 初始化音频管理器
        AudioManager.init();

        // 初始化棋盘管理器
        BoardManager.init('game-board');

        // 初始化特效管理器
        EffectsManager.init('effects-canvas');
        CelebrationEffects.init('celebration-canvas');

        // 初始化输入管理器
        InputManager.init('game-board');

        // 设置输入回调
        InputManager.setCallbacks({
            onMove: (direction) => this.handleMove(direction),
            onSelect: (pieceId) => this.handleSelect(pieceId),
            onDeselect: () => this.handleDeselect(),
            onUndo: () => this.undo(),
            onRestart: () => this.restart()
        });
    },

    // 加载关卡
    loadLevel(levelId) {
        const level = LevelManager.getLevel(levelId);
        if (!level) {
            console.error(`Level ${levelId} not found`);
            return;
        }

        this.currentLevel = level;
        this.moveCount = 0;
        this.history = [];
        this.state = 'playing';

        // 重置求解器
        KlotskiSolver.reset();
        this.hideHintPanel();

        // 加载棋盘
        BoardManager.loadLevel(level);

        // 更新UI
        this.updateUI();
        this.updateSolverButtons();

        // 播放背景音乐
        AudioManager.playBGM();
    },

    // 更新UI显示
    updateUI() {
        if (!this.currentLevel) return;

        // 更新关卡名称
        const levelNameEl = document.getElementById('current-level-name');
        if (levelNameEl) {
            levelNameEl.textContent = `第${this.currentLevel.id}关: ${this.currentLevel.name}`;
        }

        // 更新难度显示
        const difficultyEl = document.getElementById('current-difficulty');
        if (difficultyEl) {
            difficultyEl.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('span');
                star.className = i < this.currentLevel.difficulty ? 'star' : 'star empty';
                star.textContent = '★';
                difficultyEl.appendChild(star);
            }
        }

        // 更新步数
        const moveCountEl = document.getElementById('move-count');
        if (moveCountEl) {
            moveCountEl.textContent = this.moveCount;
        }

        // 更新最少步数
        const minStepsEl = document.getElementById('min-steps');
        if (minStepsEl) {
            minStepsEl.textContent = this.currentLevel.minSteps;
        }
    },

    // 处理棋子选择
    handleSelect(pieceId) {
        const piece = BoardManager.pieces.find(p => p.id === pieceId);
        if (piece) {
            BoardManager.selectPiece(piece);
        }
    },

    // 处理取消选择
    handleDeselect() {
        BoardManager.deselectPiece();
    },

    // 处理移动
    handleMove(direction) {
        if (this.state !== 'playing') return;

        const selectedPiece = BoardManager.selectedPiece;
        if (!selectedPiece) {
            // 如果没有选中棋子，提示用户
            return;
        }

        // 保存当前状态用于撤销
        this.saveState();

        // 尝试移动
        const success = BoardManager.moveSelectedPiece(direction);

        if (success) {
            this.moveCount++;
            this.updateUI();

            // 检查是否与求解器的下一步一致
            if (KlotskiSolver.hasSolution()) {
                const hint = KlotskiSolver.getNextHint();
                if (hint && hint.pieceId === selectedPiece.id && hint.direction === direction) {
                    // 用户按照提示移动，前进一步
                    KlotskiSolver.advanceStep();

                    // 更新提示面板
                    const nextHint = KlotskiSolver.getNextHint();
                    if (nextHint) {
                        const desc = KlotskiSolver.getMoveDescription(nextHint);
                        const progress = KlotskiSolver.getProgress();
                        this.showHintPanel(desc, progress);
                        this.highlightHintPiece(nextHint.pieceId);
                    } else {
                        this.hideHintPanel();
                    }
                }
            }

            // 检查胜利
            if (BoardManager.checkWin()) {
                this.handleWin();
            }
        } else {
            // 移动失败，移除刚保存的状态
            this.history.pop();
        }
    },

    // 保存状态
    saveState() {
        const state = {
            pieces: BoardManager.cloneState(),
            moveCount: this.moveCount
        };

        this.history.push(state);

        // 限制历史记录数量
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    },

    // 撤销
    undo() {
        if (this.history.length === 0) return;
        if (this.state !== 'playing') return;

        const state = this.history.pop();
        BoardManager.pieces = state.pieces;
        BoardManager.selectedPiece = null;
        this.moveCount = state.moveCount;

        BoardManager.render();
        this.updateUI();
    },

    // 重新开始
    restart() {
        if (!this.currentLevel) return;

        this.moveCount = 0;
        this.history = [];
        this.state = 'playing';

        // 重置求解器
        KlotskiSolver.reset();
        this.hideHintPanel();

        BoardManager.loadLevel(this.currentLevel);
        this.updateUI();
        this.updateSolverButtons();
    },

    // 处理胜利
    handleWin() {
        this.state = 'won';

        // 标记关卡完成
        LevelManager.completeLevel(this.currentLevel.id);

        // 播放胜利音效
        AudioManager.play('win');

        // 停止背景音乐
        AudioManager.pauseBGM();

        // 显示胜利界面
        this.showWinScreen();
    },

    // 显示胜利界面
    showWinScreen() {
        // 更新胜利界面数据
        document.getElementById('win-level-name').textContent =
            `第${this.currentLevel.id}关: ${this.currentLevel.name}`;
        document.getElementById('win-moves').textContent = this.moveCount;
        document.getElementById('win-min-steps').textContent = this.currentLevel.minSteps;

        // 计算评分
        const rating = this.calculateRating();
        const ratingEl = document.getElementById('win-rating');
        ratingEl.innerHTML = '';

        for (let i = 0; i < 3; i++) {
            const star = document.createElement('span');
            star.className = `rating-star ${i < rating ? '' : 'empty'}`;
            star.textContent = '★';
            ratingEl.appendChild(star);
        }

        // 检查是否有下一关
        const nextLevel = LevelManager.getNextLevel(this.currentLevel.id);
        const nextBtn = document.getElementById('btn-next-level');
        if (nextBtn) {
            nextBtn.style.display = nextLevel ? 'block' : 'none';
        }

        // 显示胜利界面
        UI.showScreen('win-screen');

        // 启动庆祝特效
        CelebrationEffects.init('celebration-canvas');
        CelebrationEffects.start();
    },

    // 计算评分 (1-3星)
    calculateRating() {
        if (!this.currentLevel) return 1;

        const ratio = this.moveCount / this.currentLevel.minSteps;

        if (ratio <= 1.2) {
            return 3; // 3星
        } else if (ratio <= 1.5) {
            return 2; // 2星
        } else {
            return 1; // 1星
        }
    },

    // 下一关
    nextLevel() {
        const next = LevelManager.getNextLevel(this.currentLevel.id);
        if (next) {
            CelebrationEffects.stop();
            this.loadLevel(next.id);
            UI.showScreen('game-screen');
        }
    },

    // 重玩当前关卡
    replay() {
        CelebrationEffects.stop();
        this.restart();
        UI.showScreen('game-screen');
    },

    // 返回选关
    backToLevels() {
        CelebrationEffects.stop();
        AudioManager.pauseBGM();
        this.state = 'idle';
        UI.showScreen('level-screen');
    },

    // 返回主菜单
    backToMenu() {
        AudioManager.pauseBGM();
        this.state = 'idle';
        UI.showScreen('menu-screen');
    },

    // ========== 求解器相关方法 ==========

    // 求解当前关卡
    solve() {
        if (this.state !== 'playing') return;

        UI.showMessage('正在计算最优解...', 0); // 不自动消失

        // 使用 setTimeout 让 UI 有时间更新
        setTimeout(() => {
            const solution = KlotskiSolver.solve(BoardManager.pieces);

            if (solution && solution.length > 0) {
                UI.hideMessage();
                UI.showMessage(`找到解法: ${solution.length} 步`, 2000);
                this.updateSolverButtons();
            } else {
                UI.hideMessage();
                UI.showMessage('未找到解法', 2000);
            }
        }, 50);
    },

    // 显示下一步提示
    showHint() {
        if (!KlotskiSolver.hasSolution()) return;

        const hint = KlotskiSolver.getNextHint();
        if (!hint) {
            UI.showMessage('已完成所有提示', 2000);
            return;
        }

        // 高亮提示的棋子
        this.highlightHintPiece(hint.pieceId);

        // 显示提示文本
        const desc = KlotskiSolver.getMoveDescription(hint);
        const progress = KlotskiSolver.getProgress();
        this.showHintPanel(desc, progress);
    },

    // 高亮提示棋子
    highlightHintPiece(pieceId) {
        // 移除之前的高亮
        document.querySelectorAll('.piece.hint-highlight').forEach(el => {
            el.classList.remove('hint-highlight');
        });

        // 添加新高亮
        const piece = BoardManager.pieces.find(p => p.id === pieceId);
        if (piece && piece.element) {
            piece.element.classList.add('hint-highlight');
        }
    },

    // 移除高亮
    clearHintHighlight() {
        document.querySelectorAll('.piece.hint-highlight').forEach(el => {
            el.classList.remove('hint-highlight');
        });
    },

    // 显示提示面板
    showHintPanel(text, progress) {
        const panel = document.getElementById('hint-panel');
        const hintText = document.getElementById('hint-text');
        const hintProgress = document.getElementById('hint-progress');

        if (panel && hintText && hintProgress) {
            hintText.textContent = text;
            hintProgress.textContent = `(${progress.current + 1}/${progress.total})`;
            panel.style.display = 'block';
        }
    },

    // 隐藏提示面板
    hideHintPanel() {
        const panel = document.getElementById('hint-panel');
        if (panel) {
            panel.style.display = 'none';
        }
        this.clearHintHighlight();
    },

    // 更新求解器按钮状态
    updateSolverButtons() {
        const hasSolution = KlotskiSolver.hasSolution();
        const isPlaying = KlotskiSolver.isAutoPlaying;

        const btnHint = document.getElementById('btn-hint');
        const btnAuto = document.getElementById('btn-auto');
        const btnStop = document.getElementById('btn-stop');

        if (btnHint) btnHint.disabled = !hasSolution || isPlaying;
        if (btnAuto) btnAuto.disabled = !hasSolution || isPlaying;
        if (btnStop) btnStop.style.display = isPlaying ? 'inline-block' : 'none';
    },

    // 开始自动还原
    startAutoPlay() {
        if (!KlotskiSolver.hasSolution()) return;
        if (KlotskiSolver.isAutoPlaying) return;

        this.updateSolverButtons();

        KlotskiSolver.startAutoPlay(
            (move) => {
                // 执行移动
                this.executeSolverMove(move);
            },
            () => {
                // 完成回调
                this.hideHintPanel();
                this.updateSolverButtons();
                if (BoardManager.checkWin()) {
                    this.handleWin();
                }
            },
            400 // 每步间隔 400ms
        );

        this.updateSolverButtons();
    },

    // 停止自动播放
    stopAutoPlay() {
        KlotskiSolver.stopAutoPlay();
        this.updateSolverButtons();
    },

    // 执行求解器移动
    executeSolverMove(move) {
        const piece = BoardManager.pieces.find(p => p.id === move.pieceId);
        if (!piece) return;

        // 选中并高亮棋子
        BoardManager.selectPiece(piece);
        this.highlightHintPiece(move.pieceId);

        // 更新提示面板
        const desc = KlotskiSolver.getMoveDescription(move);
        const progress = KlotskiSolver.getProgress();
        this.showHintPanel(desc, progress);

        // 保存状态
        this.saveState();

        // 执行移动
        const success = BoardManager.movePiece(piece, move.dx, move.dy);

        if (success) {
            this.moveCount++;
            this.updateUI();
        } else {
            this.history.pop();
        }
    },

    // 用户执行移动后，更新求解器状态
    onUserMove() {
        // 如果用户手动移动，清除当前解法
        // 可以选择重新求解或继续使用部分解法
        // 这里选择保留解法但让用户可以继续获取提示
    }
};

// 导出
window.Game = Game;
