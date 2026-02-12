/**
 * 音频管理器
 * 预留音频接口，后续添加音频资源即可工作
 *
 * @author authorZhao
 * @license MIT
 */

const AudioManager = {
    // 音频资源配置 (预留)
    sounds: {
        bgm: null,          // 背景音乐: 'assets/audio/bgm.mp3'
        move: null,         // 移动音效: 'assets/audio/move.mp3'
        select: null,       // 选择音效: 'assets/audio/select.mp3'
        win: null,          // 胜利音效: 'assets/audio/win.mp3'
        click: null         // 点击音效: 'assets/audio/click.mp3'
    },

    // 音频对象缓存
    audioObjects: {},

    // 是否静音
    muted: false,

    // 背景音乐是否播放中
    bgmPlaying: false,

    // 初始化
    init() {
        // 从本地存储加载静音状态
        try {
            const savedMuted = localStorage.getItem('klotski_muted');
            if (savedMuted !== null) {
                this.muted = JSON.parse(savedMuted);
            }
        } catch (e) {
            console.log('Failed to load audio settings:', e);
        }

        this.updateMuteButton();
        this.preloadSounds();
    },

    // 预加载音频
    preloadSounds() {
        for (const [name, url] of Object.entries(this.sounds)) {
            if (url) {
                this.loadSound(name, url);
            }
        }
    },

    // 加载音频
    loadSound(name, url) {
        if (this.audioObjects[name]) {
            return this.audioObjects[name];
        }

        try {
            const audio = new Audio();
            audio.src = url;
            audio.preload = 'auto';

            if (name === 'bgm') {
                audio.loop = true;
                audio.volume = 0.3;
            } else {
                audio.volume = 0.5;
            }

            this.audioObjects[name] = audio;
            this.sounds[name] = url;

            return audio;
        } catch (e) {
            console.log(`Failed to load sound: ${name}`, e);
            return null;
        }
    },

    // 设置音频资源
    setSound(name, url) {
        if (this.sounds.hasOwnProperty(name)) {
            this.sounds[name] = url;
            this.audioObjects[name] = null; // 清除缓存
            if (url) {
                this.loadSound(name, url);
            }
        }
    },

    // 播放音效
    play(name) {
        if (this.muted) return;

        const audio = this.audioObjects[name];
        if (audio && this.sounds[name]) {
            try {
                // 对于非背景音乐，需要重置播放位置
                if (name !== 'bgm') {
                    audio.currentTime = 0;
                }
                audio.play().catch(e => {
                    // 忽略自动播放限制错误
                });
            } catch (e) {
                console.log(`Failed to play sound: ${name}`, e);
            }
        }
    },

    // 播放背景音乐
    playBGM() {
        if (this.bgmPlaying) return;

        const audio = this.audioObjects.bgm;
        if (audio && this.sounds.bgm && !this.muted) {
            try {
                audio.play().then(() => {
                    this.bgmPlaying = true;
                }).catch(e => {
                    // 浏览器可能阻止自动播放
                });
            } catch (e) {
                console.log('Failed to play BGM', e);
            }
        }
    },

    // 暂停背景音乐
    pauseBGM() {
        const audio = this.audioObjects.bgm;
        if (audio) {
            audio.pause();
            this.bgmPlaying = false;
        }
    },

    // 切换静音
    toggleMute() {
        this.muted = !this.muted;

        // 保存设置
        try {
            localStorage.setItem('klotski_muted', JSON.stringify(this.muted));
        } catch (e) {
            console.log('Failed to save audio settings:', e);
        }

        // 更新按钮显示
        this.updateMuteButton();

        // 处理背景音乐
        if (this.muted) {
            this.pauseBGM();
        } else if (this.bgmPlaying) {
            this.playBGM();
        }
    },

    // 更新静音按钮显示
    updateMuteButton() {
        const soundOn = document.querySelector('.sound-on');
        const soundOff = document.querySelector('.sound-off');

        if (soundOn && soundOff) {
            if (this.muted) {
                soundOn.style.display = 'none';
                soundOff.style.display = 'inline';
            } else {
                soundOn.style.display = 'inline';
                soundOff.style.display = 'none';
            }
        }
    },

    // 设置音量
    setVolume(name, volume) {
        const audio = this.audioObjects[name];
        if (audio) {
            audio.volume = Math.max(0, Math.min(1, volume));
        }
    },

    // 检查是否有音频资源
    hasSound(name) {
        return this.sounds[name] !== null;
    }
};

// 导出
window.AudioManager = AudioManager;
