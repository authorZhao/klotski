/**
 * 特效管理器
 * 处理游戏中的各种视觉效果
 *
 * @author authorZhao
 * @license MIT
 */

const EffectsManager = {
    // 粒子系统
    particles: [],

    // 画布上下文
    ctx: null,
    canvas: null,

    // 动画帧ID
    animationId: null,

    // 是否正在播放
    isPlaying: false,

    // 初始化
    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
        }
    },

    // 调整画布大小
    resizeCanvas() {
        if (this.canvas) {
            const parent = this.canvas.parentElement;
            if (parent) {
                this.canvas.width = parent.offsetWidth;
                this.canvas.height = parent.offsetHeight;
            }
        }
    },

    // 清除画布
    clear() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    },

    // 粒子类
    createParticle(x, y, options = {}) {
        return {
            x: x,
            y: y,
            vx: options.vx || (Math.random() - 0.5) * 10,
            vy: options.vy || (Math.random() - 0.5) * 10 - 5,
            size: options.size || Math.random() * 8 + 4,
            color: options.color || this.getRandomColor(),
            alpha: 1,
            decay: options.decay || Math.random() * 0.02 + 0.01,
            gravity: options.gravity || 0.2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            shape: options.shape || 'circle' // circle, square, star
        };
    },

    // 获取随机颜色
    getRandomColor() {
        const colors = [
            '#e94560', // 红色
            '#fbbf24', // 黄色
            '#22c55e', // 绿色
            '#3b82f6', // 蓝色
            '#a855f7', // 紫色
            '#f97316', // 橙色
            '#ec4899'  // 粉色
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // 创建爆炸粒子效果
    createExplosion(x, y, count = 30, options = {}) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = Math.random() * 8 + 4;
            const particle = this.createParticle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                ...options
            });
            this.particles.push(particle);
        }

        if (!this.isPlaying) {
            this.startAnimation();
        }
    },

    // 创建庆祝烟花效果
    createFireworks(count = 5) {
        if (!this.canvas) return;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * this.canvas.height * 0.5;
                this.createExplosion(x, y, 40, {
                    size: Math.random() * 6 + 3,
                    decay: Math.random() * 0.015 + 0.008
                });
            }, i * 300);
        }
    },

    // 创建彩带效果
    createConfetti(duration = 3000) {
        if (!this.canvas) return;

        const interval = setInterval(() => {
            const x = Math.random() * this.canvas.width;
            this.particles.push(this.createParticle(x, -10, {
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 3 + 2,
                size: Math.random() * 10 + 5,
                gravity: 0.1,
                decay: 0.003,
                shape: 'square'
            }));
        }, 50);

        setTimeout(() => clearInterval(interval), duration);

        if (!this.isPlaying) {
            this.startAnimation();
        }
    },

    // 创建星星闪烁效果
    createSparkles(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;

            setTimeout(() => {
                this.particles.push(this.createParticle(x + offsetX, y + offsetY, {
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 4 + 2,
                    decay: 0.03,
                    shape: 'star'
                }));
            }, i * 50);
        }

        if (!this.isPlaying) {
            this.startAnimation();
        }
    },

    // 绘制粒子
    drawParticle(particle) {
        if (!this.ctx) return;

        this.ctx.save();
        this.ctx.globalAlpha = particle.alpha;
        this.ctx.fillStyle = particle.color;
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);

        switch (particle.shape) {
            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                break;

            case 'square':
                this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                break;

            case 'star':
                this.drawStar(0, 0, 5, particle.size, particle.size / 2);
                break;
        }

        this.ctx.restore();
    },

    // 绘制星星
    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        if (!this.ctx) return;

        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }

        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    },

    // 更新粒子
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += particle.gravity;
        particle.rotation += particle.rotationSpeed;
        particle.alpha -= particle.decay;

        return particle.alpha > 0;
    },

    // 开始动画循环
    startAnimation() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.animate();
    },

    // 动画循环
    animate() {
        this.clear();

        // 更新和绘制所有粒子
        this.particles = this.particles.filter(particle => {
            this.drawParticle(particle);
            return this.updateParticle(particle);
        });

        // 继续动画或停止
        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.isPlaying = false;
        }
    },

    // 停止动画
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isPlaying = false;
        this.particles = [];
        this.clear();
    },

    // 过关特效
    playWinEffect() {
        if (!this.canvas) return;

        // 创建多个烟花
        this.createFireworks(8);

        // 创建彩带
        this.createConfetti(4000);
    },

    // 移动特效 (在棋子移动时)
    playMoveEffect(fromX, fromY, toX, toY) {
        // 可以添加移动轨迹效果
        // 目前简单实现
    },

    // 选中特效
    playSelectEffect(x, y) {
        this.createSparkles(x, y, 5);
    }
};

// 庆祝画布特效管理器 (用于过关界面)
const CelebrationEffects = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    isPlaying: false,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
        }
    },

    resizeCanvas() {
        if (this.canvas) {
            const parent = this.canvas.parentElement;
            if (parent) {
                this.canvas.width = parent.offsetWidth;
                this.canvas.height = parent.offsetHeight;
            }
        }
    },

    start() {
        this.particles = [];
        this.isPlaying = true;

        // 持续产生彩带
        this.generateConfetti();

        this.animate();
    },

    generateConfetti() {
        if (!this.isPlaying) return;

        if (this.canvas) {
            for (let i = 0; i < 3; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: -20,
                    vx: (Math.random() - 0.5) * 4,
                    vy: Math.random() * 3 + 2,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.2,
                    size: Math.random() * 10 + 5,
                    color: EffectsManager.getRandomColor()
                });
            }
        }

        setTimeout(() => this.generateConfetti(), 100);
    },

    animate() {
        if (!this.ctx || !this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.rotation += p.rotationSpeed;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            this.ctx.restore();

            return p.y < this.canvas.height + 50;
        });

        if (this.isPlaying) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    },

    stop() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.particles = [];
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
};

// 导出
window.EffectsManager = EffectsManager;
window.CelebrationEffects = CelebrationEffects;
