/**
 * 华容道求解器
 * 使用 BFS（广度优先搜索）找到最短解法
 *
 * @author authorZhao
 * @license MIT
 */

const KlotskiSolver = {
    // 求解中状态
    isSolving: false,

    // 当前解法
    solution: [],

    // 当前解法步骤索引
    solutionIndex: 0,

    // 自动播放定时器
    autoPlayTimer: null,

    // 是否正在自动播放
    isAutoPlaying: false,

    /**
     * 求解华容道
     * @param {Array} pieces - 当前棋子状态数组
     * @returns {Array} - 移动步骤数组，每个元素为 {pieceId, direction, pieceType}
     */
    solve(pieces) {
        this.isSolving = true;

        try {
            // 将当前状态转换为标准格式
            const initialState = this.encodeState(pieces);

            // 目标状态：曹操在 (1, 3)
            const goalCheck = (state) => {
                const cao = state.pieces.find(p => p.type === 'cao');
                return cao && cao.x === 1 && cao.y === 3;
            };

            // BFS 搜索
            const result = this.bfs(initialState, goalCheck);

            if (result) {
                this.solution = result.moves;
                this.solutionIndex = 0;
                return result.moves;
            }

            return null;
        } finally {
            this.isSolving = false;
        }
    },

    /**
     * BFS 搜索
     */
    bfs(initialState, goalCheck) {
        const queue = [{
            state: initialState,
            moves: []
        }];

        const visited = new Set();
        visited.add(this.stateToString(initialState));

        let iterations = 0;
        const maxIterations = 500000; // 最大迭代次数限制

        while (queue.length > 0 && iterations < maxIterations) {
            iterations++;

            const current = queue.shift();
            const state = current.state;

            // 检查是否达到目标
            if (goalCheck(state)) {
                return {
                    moves: current.moves,
                    steps: current.moves.length
                };
            }

            // 获取所有可能的移动
            const possibleMoves = this.getAllPossibleMoves(state);

            for (const move of possibleMoves) {
                // 执行移动
                const newState = this.applyMove(state, move);

                // 生成状态字符串
                const stateStr = this.stateToString(newState);

                // 如果状态未访问过
                if (!visited.has(stateStr)) {
                    visited.add(stateStr);

                    queue.push({
                        state: newState,
                        moves: [...current.moves, move]
                    });
                }
            }
        }

        return null; // 未找到解法
    },

    /**
     * 编码状态
     */
    encodeState(pieces) {
        return {
            pieces: pieces.map(p => ({
                id: p.id,
                type: p.type,
                x: p.x,
                y: p.y,
                width: p.width,
                height: p.height
            }))
        };
    },

    /**
     * 将状态转换为字符串（用于去重）
     */
    stateToString(state) {
        // 按类型和位置排序，忽略 id
        const sorted = [...state.pieces].sort((a, b) => {
            if (a.type !== b.type) return a.type.localeCompare(b.type);
            if (a.x !== b.x) return a.x - b.x;
            return a.y - b.y;
        });

        return sorted.map(p => `${p.type}:${p.x},${p.y}`).join('|');
    },

    /**
     * 获取所有可能的移动
     */
    getAllPossibleMoves(state) {
        const moves = [];
        const occupied = this.getOccupiedCells(state);

        const directions = [
            { dx: 0, dy: -1, name: 'up' },
            { dx: 0, dy: 1, name: 'down' },
            { dx: -1, dy: 0, name: 'left' },
            { dx: 1, dy: 0, name: 'right' }
        ];

        for (const piece of state.pieces) {
            for (const dir of directions) {
                if (this.canMove(piece, dir, occupied, state.pieces)) {
                    moves.push({
                        pieceId: piece.id,
                        pieceType: piece.type,
                        direction: dir.name,
                        dx: dir.dx,
                        dy: dir.dy
                    });
                }
            }
        }

        return moves;
    },

    /**
     * 检查棋子是否可以移动
     */
    canMove(piece, dir, occupied, allPieces) {
        const newX = piece.x + dir.dx;
        const newY = piece.y + dir.dy;

        // 检查边界
        if (newX < 0 || newY < 0 ||
            newX + piece.width > 4 ||
            newY + piece.height > 5) {
            return false;
        }

        // 检查碰撞
        for (let px = 0; px < piece.width; px++) {
            for (let py = 0; py < piece.height; py++) {
                const checkX = newX + px;
                const checkY = newY + py;
                const key = `${checkX},${checkY}`;

                // 如果这个格子被其他棋子占用
                if (occupied.has(key)) {
                    // 检查是否是当前棋子自己占用的
                    const isOwn = checkX >= piece.x && checkX < piece.x + piece.width &&
                                  checkY >= piece.y && checkY < piece.y + piece.height;
                    if (!isOwn) {
                        return false;
                    }
                }
            }
        }

        return true;
    },

    /**
     * 获取所有占用的格子
     */
    getOccupiedCells(state) {
        const occupied = new Set();
        for (const piece of state.pieces) {
            for (let px = 0; px < piece.width; px++) {
                for (let py = 0; py < piece.height; py++) {
                    occupied.add(`${piece.x + px},${piece.y + py}`);
                }
            }
        }
        return occupied;
    },

    /**
     * 执行移动，返回新状态
     */
    applyMove(state, move) {
        const newPieces = state.pieces.map(p => {
            if (p.id === move.pieceId) {
                return {
                    ...p,
                    x: p.x + move.dx,
                    y: p.y + move.dy
                };
            }
            return { ...p };
        });

        return { pieces: newPieces };
    },

    /**
     * 获取下一步提示
     */
    getNextHint() {
        if (this.solution.length === 0 || this.solutionIndex >= this.solution.length) {
            return null;
        }
        return this.solution[this.solutionIndex];
    },

    /**
     * 前进到下一步
     */
    advanceStep() {
        if (this.solutionIndex < this.solution.length) {
            this.solutionIndex++;
        }
    },

    /**
     * 获取当前解法进度
     */
    getProgress() {
        return {
            current: this.solutionIndex,
            total: this.solution.length,
            remaining: this.solution.length - this.solutionIndex
        };
    },

    /**
     * 重置解法
     */
    reset() {
        this.solution = [];
        this.solutionIndex = 0;
        this.stopAutoPlay();
    },

    /**
     * 开始自动播放
     */
    startAutoPlay(onMove, onComplete, speed = 500) {
        if (this.isAutoPlaying) return;
        if (this.solution.length === 0) return;

        this.isAutoPlaying = true;

        const playNext = () => {
            if (this.solutionIndex >= this.solution.length) {
                this.isAutoPlaying = false;
                if (onComplete) onComplete();
                return;
            }

            const move = this.solution[this.solutionIndex];
            if (onMove) {
                onMove(move);
            }
            this.solutionIndex++;

            this.autoPlayTimer = setTimeout(playNext, speed);
        };

        playNext();
    },

    /**
     * 停止自动播放
     */
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
        this.isAutoPlaying = false;
    },

    /**
     * 检查是否有解法
     */
    hasSolution() {
        return this.solution.length > 0;
    },

    /**
     * 获取解法描述
     */
    getMoveDescription(move) {
        const typeNames = {
            'cao': '曹操',
            'guan': '关羽',
            'jiang': '武将',
            'bing': '小兵'
        };

        const dirNames = {
            'up': '上',
            'down': '下',
            'left': '左',
            'right': '右'
        };

        return `${typeNames[move.pieceType] || move.pieceType} 向${dirNames[move.direction]}`;
    }
};

// 导出
window.KlotskiSolver = KlotskiSolver;
