/**
 * 主入口文件
 * 初始化游戏
 *
 * @author authorZhao
 * @license MIT
 */

(function() {
    'use strict';

    // DOM 加载完成后初始化
    document.addEventListener('DOMContentLoaded', () => {
        console.log('华容道游戏初始化中...');

        // 初始化游戏
        Game.init();

        // 初始化UI
        UI.init();

        console.log('华容道游戏初始化完成!');

        // 添加首次交互后的音频解锁
        const unlockAudio = () => {
            // 某些浏览器需要用户交互后才能播放音频
            // 尝试播放并暂停背景音乐来解锁
            const audio = AudioManager.audioObjects.bgm;
            if (audio) {
                audio.play().then(() => {
                    audio.pause();
                }).catch(() => {});
            }

            // 移除监听器
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };

        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
        document.addEventListener('keydown', unlockAudio);
    });

    // 暴露一些全局方法供外部调用
    window.KlotskiGame = {
        // 设置棋子图片
        setPieceImage: setPieceImage,

        // 设置音频
        setSound: (name, url) => AudioManager.setSound(name, url),

        // 播放背景音乐
        playBGM: () => AudioManager.playBGM(),

        // 暂停背景音乐
        pauseBGM: () => AudioManager.pauseBGM(),

        // 切换静音
        toggleMute: () => AudioManager.toggleMute(),

        // 开始指定关卡
        startLevel: (levelId) => {
            UI.startGame(levelId);
        },

        // 重置所有进度
        resetProgress: () => {
            LevelManager.resetProgress();
            UI.renderLevelGrid();
        },

        // 获取当前状态
        getState: () => ({
            currentLevel: Game.currentLevel?.id,
            moveCount: Game.moveCount,
            state: Game.state
        })
    };
})();

/**
 * 资源配置说明
 *
 * 要添加图片资源，在加载游戏后调用:
 * KlotskiGame.setPieceImage('cao', 'assets/images/cao.png');
 * KlotskiGame.setPieceImage('guan', 'assets/images/guan.png');
 * KlotskiGame.setPieceImage('jiang', 'assets/images/jiang.png');
 * KlotskiGame.setPieceImage('bing', 'assets/images/bing.png');
 *
 * 要添加音频资源，调用:
 * KlotskiGame.setSound('bgm', 'assets/audio/bgm.mp3');
 * KlotskiGame.setSound('move', 'assets/audio/move.mp3');
 * KlotskiGame.setSound('select', 'assets/audio/select.mp3');
 * KlotskiGame.setSound('win', 'assets/audio/win.mp3');
 * KlotskiGame.setSound('click', 'assets/audio/click.mp3');
 */
