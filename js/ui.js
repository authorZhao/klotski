/**
 * UI 管理器
 * 处理界面切换和UI更新
 *
 * @author authorZhao
 * @license MIT
 */

const UI = {
    // 当前显示的界面
    currentScreen: 'menu-screen',

    // 初始化
    init() {
        this.bindEvents();
        this.renderLevelGrid();
    },

    // 绑定事件
    bindEvents() {
        // 主菜单按钮
        document.getElementById('btn-start')?.addEventListener('click', () => {
            this.startGame(1);
        });

        document.getElementById('btn-select')?.addEventListener('click', () => {
            this.showScreen('level-screen');
        });

        document.getElementById('btn-help')?.addEventListener('click', () => {
            this.showScreen('help-screen');
        });

        // 选关界面
        document.getElementById('btn-back-menu')?.addEventListener('click', () => {
            this.showScreen('menu-screen');
        });

        // 游戏界面
        document.getElementById('btn-restart')?.addEventListener('click', () => {
            Game.restart();
        });

        document.getElementById('btn-undo')?.addEventListener('click', () => {
            Game.undo();
        });

        document.getElementById('btn-back-levels')?.addEventListener('click', () => {
            Game.backToLevels();
            this.renderLevelGrid(); // 刷新选关界面
        });

        // 过关界面
        document.getElementById('btn-next-level')?.addEventListener('click', () => {
            Game.nextLevel();
        });

        document.getElementById('btn-replay')?.addEventListener('click', () => {
            Game.replay();
        });

        document.getElementById('btn-back-to-levels')?.addEventListener('click', () => {
            Game.backToLevels();
            this.renderLevelGrid(); // 刷新选关界面
        });

        // 帮助界面
        document.getElementById('btn-back-from-help')?.addEventListener('click', () => {
            this.showScreen('menu-screen');
        });

        // 静音按钮
        document.getElementById('btn-mute')?.addEventListener('click', () => {
            AudioManager.toggleMute();
        });

        // 求解器按钮
        document.getElementById('btn-solve')?.addEventListener('click', () => {
            Game.solve();
        });

        document.getElementById('btn-hint')?.addEventListener('click', () => {
            Game.showHint();
        });

        document.getElementById('btn-auto')?.addEventListener('click', () => {
            Game.startAutoPlay();
        });

        document.getElementById('btn-stop')?.addEventListener('click', () => {
            Game.stopAutoPlay();
        });
    },

    // 渲染选关网格
    renderLevelGrid() {
        const grid = document.getElementById('level-grid');
        if (!grid) return;

        grid.innerHTML = '';

        const levels = LevelManager.getAllLevels();

        for (const level of levels) {
            const btn = document.createElement('button');
            btn.className = 'level-btn';

            const isUnlocked = LevelManager.isUnlocked(level.id);
            const isCompleted = LevelManager.isCompleted(level.id);

            if (!isUnlocked) {
                btn.classList.add('locked');
            }
            if (isCompleted) {
                btn.classList.add('completed');
            }

            btn.innerHTML = `
                <span class="level-num">${level.id}</span>
                <span class="level-name">${level.name}</span>
            `;

            if (isUnlocked) {
                btn.addEventListener('click', () => {
                    this.startGame(level.id);
                });
            }

            grid.appendChild(btn);
        }
    },

    // 开始游戏
    startGame(levelId) {
        Game.loadLevel(levelId);
        this.showScreen('game-screen');
    },

    // 显示指定界面
    showScreen(screenId) {
        // 隐藏所有界面
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        // 显示目标界面
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    },

    // 显示消息提示
    showMessage(message, duration = 2000) {
        // 移除之前的消息
        this.hideMessage();

        // 创建消息元素
        const msgEl = document.createElement('div');
        msgEl.id = 'game-message';
        msgEl.className = 'game-message';
        msgEl.textContent = message;

        const baseStyle = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: #fff;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1.2rem;
            z-index: 1000;
        `;

        if (duration > 0) {
            msgEl.style.cssText = baseStyle + `animation: fadeInOut ${duration}ms ease;`;

            // 添加动画样式
            if (!document.getElementById('message-style')) {
                const style = document.createElement('style');
                style.id = 'message-style';
                style.textContent = `
                    @keyframes fadeInOut {
                        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(msgEl);

            // 自动移除
            setTimeout(() => {
                msgEl.remove();
            }, duration);
        } else {
            // 不自动消失
            msgEl.style.cssText = baseStyle;
            document.body.appendChild(msgEl);
        }
    },

    // 隐藏消息
    hideMessage() {
        const msgEl = document.getElementById('game-message');
        if (msgEl) {
            msgEl.remove();
        }
    },

    // 确认对话框
    showConfirm(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.style.cssText = `
            background: #2d2d44;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 300px;
        `;

        dialog.innerHTML = `
            <p style="color: #fff; margin-bottom: 20px; font-size: 1.1rem;">${message}</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="confirm-yes" style="
                    padding: 10px 25px;
                    background: #e94560;
                    border: none;
                    border-radius: 20px;
                    color: #fff;
                    font-size: 1rem;
                    cursor: pointer;
                ">确定</button>
                <button class="confirm-no" style="
                    padding: 10px 25px;
                    background: #4a4a6a;
                    border: none;
                    border-radius: 20px;
                    color: #fff;
                    font-size: 1rem;
                    cursor: pointer;
                ">取消</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // 绑定事件
        dialog.querySelector('.confirm-yes').addEventListener('click', () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        });

        dialog.querySelector('.confirm-no').addEventListener('click', () => {
            overlay.remove();
            if (onCancel) onCancel();
        });

        // 点击背景关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                if (onCancel) onCancel();
            }
        });
    },

    // 更新撤销按钮状态
    updateUndoButton(canUndo) {
        const btn = document.getElementById('btn-undo');
        if (btn) {
            btn.disabled = !canUndo;
        }
    }
};

// 导出
window.UI = UI;
