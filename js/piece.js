/**
 * 棋子类
 * 定义棋子的基本属性和行为
 *
 * @author authorZhao
 * @license MIT
 */

// 棋子尺寸配置 (单位格子数)
const PIECE_SIZES = {
    cao: { width: 2, height: 2 },   // 曹操 2x2
    guan: { width: 2, height: 1 },   // 关羽 2x1 (横向)
    jiang: { width: 1, height: 2 },  // 武将 1x2 (纵向)
    bing: { width: 1, height: 1 }    // 小兵 1x1
};

// 棋子标签
const PIECE_LABELS = {
    cao: '曹操',
    guan: '关羽',
    jiang: '将',
    bing: '兵'
};

// 棋子颜色 (用于无图片时的显示)
const PIECE_COLORS = {
    cao: { bg: 'linear-gradient(135deg, #e94560 0%, #c73659 100%)', border: '#ff6b6b' },
    guan: { bg: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: '#4ade80' },
    jiang: { bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: '#60a5fa' },
    bing: { bg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', border: '#fcd34d' }
};

// 图片资源配置 (预留)
const PIECE_IMAGES = {
    cao: null,      // 后续配置: 'assets/images/cao.png'
    guan: null,     // 后续配置: 'assets/images/guan.png'
    jiang: null,    // 后续配置: 'assets/images/jiang.png'
    bing: null      // 后续配置: 'assets/images/bing.png'
};

// 设置棋子图片
function setPieceImage(type, imageUrl) {
    if (PIECE_IMAGES.hasOwnProperty(type)) {
        PIECE_IMAGES[type] = imageUrl;
    }
}

// 检查是否有图片资源
function hasPieceImage(type) {
    return PIECE_IMAGES[type] !== null;
}

class Piece {
    constructor(type, x, y, id = null) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.id = id || `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const size = PIECE_SIZES[type];
        this.width = size.width;
        this.height = size.height;

        this.element = null;
        this.selected = false;
    }

    // 获取棋子占用的所有格子
    getOccupiedCells() {
        const cells = [];
        for (let dx = 0; dx < this.width; dx++) {
            for (let dy = 0; dy < this.height; dy++) {
                cells.push({ x: this.x + dx, y: this.y + dy });
            }
        }
        return cells;
    }

    // 检查是否包含指定格子
    containsCell(x, y) {
        return x >= this.x && x < this.x + this.width &&
               y >= this.y && y < this.y + this.height;
    }

    // 检查是否可以移动到指定位置
    canMoveTo(newX, newY, boardWidth = 4, boardHeight = 5) {
        // 检查边界
        if (newX < 0 || newY < 0 ||
            newX + this.width > boardWidth ||
            newY + this.height > boardHeight) {
            return false;
        }
        return true;
    }

    // 移动到新位置
    moveTo(newX, newY) {
        if (this.canMoveTo(newX, newY)) {
            this.x = newX;
            this.y = newY;
            return true;
        }
        return false;
    }

    // 获取可移动的方向
    getValidMoves(occupiedCells) {
        const moves = [];
        const directions = [
            { dx: 0, dy: -1, name: 'up' },
            { dx: 0, dy: 1, name: 'down' },
            { dx: -1, dy: 0, name: 'left' },
            { dx: 1, dy: 0, name: 'right' }
        ];

        for (const dir of directions) {
            const newX = this.x + dir.dx;
            const newY = this.y + dir.dy;

            if (this.canMoveTo(newX, newY)) {
                // 检查新位置是否与其他棋子冲突
                let blocked = false;
                for (let dx = 0; dx < this.width && !blocked; dx++) {
                    for (let dy = 0; dy < this.height && !blocked; dy++) {
                        const checkX = newX + dx;
                        const checkY = newY + dy;
                        const key = `${checkX},${checkY}`;

                        // 排除当前棋子占用的格子
                        if (!this.containsCell(checkX, checkY) && occupiedCells.has(key)) {
                            blocked = true;
                        }
                    }
                }

                if (!blocked) {
                    moves.push({ ...dir, newX, newY });
                }
            }
        }

        return moves;
    }

    // 创建DOM元素
    createElement(cellSize, boardPadding = 0) {
        const el = document.createElement('div');
        el.className = `piece ${this.type}`;
        el.dataset.id = this.id;
        el.dataset.type = this.type;

        // 计算位置和尺寸
        const left = boardPadding + this.x * cellSize;
        const top = boardPadding + this.y * cellSize;
        const width = this.width * cellSize;
        const height = this.height * cellSize;

        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;

        // 检查是否有图片资源
        const imageUrl = PIECE_IMAGES[this.type];
        if (imageUrl) {
            // 使用图片
            el.classList.add('has-image');
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = PIECE_LABELS[this.type];
            img.draggable = false;
            el.appendChild(img);
        } else {
            // 使用颜色方块
            const inner = document.createElement('div');
            inner.className = 'piece-inner';

            const label = document.createElement('span');
            label.className = 'piece-label';
            label.textContent = PIECE_LABELS[this.type];
            inner.appendChild(label);

            el.appendChild(inner);
        }

        this.element = el;
        return el;
    }

    // 更新DOM元素位置
    updateElementPosition(cellSize, boardPadding = 0, animate = true) {
        if (!this.element) return;

        const left = boardPadding + this.x * cellSize;
        const top = boardPadding + this.y * cellSize;

        if (animate) {
            this.element.classList.add('moving');
        }

        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;

        if (animate) {
            setTimeout(() => {
                this.element?.classList.remove('moving');
            }, 150);
        }
    }

    // 设置选中状态
    setSelected(selected) {
        this.selected = selected;
        if (this.element) {
            if (selected) {
                this.element.classList.add('selected');
            } else {
                this.element.classList.remove('selected');
            }
        }
    }

    // 播放无效移动动画
    playInvalidAnimation() {
        if (this.element) {
            this.element.classList.add('invalid-move');
            setTimeout(() => {
                this.element?.classList.remove('invalid-move');
            }, 300);
        }
    }

    // 克隆棋子
    clone() {
        return new Piece(this.type, this.x, this.y, this.id);
    }

    // 序列化
    serialize() {
        return {
            type: this.type,
            x: this.x,
            y: this.y,
            id: this.id
        };
    }

    // 从数据创建
    static fromData(data) {
        return new Piece(data.type, data.x, data.y, data.id);
    }
}

// 导出
window.Piece = Piece;
window.PIECE_SIZES = PIECE_SIZES;
window.PIECE_LABELS = PIECE_LABELS;
window.PIECE_COLORS = PIECE_COLORS;
window.PIECE_IMAGES = PIECE_IMAGES;
window.setPieceImage = setPieceImage;
window.hasPieceImage = hasPieceImage;
