/**
 * 华容道关卡数据
 *
 * @author authorZhao
 * @license MIT
 *
 * 棋盘大小: 4列 x 5行
 * 坐标原点: 左上角 (0, 0)
 *
 * 棋子类型:
 * - cao: 曹操 (2x2)
 * - guan: 关羽 (2x1 横向)
 * - jiang: 武将 (1x2 纵向)
 * - bing: 小兵 (1x1)
 */

const LEVELS = [
    {
        id: 1,
        name: "横刀立马",
        difficulty: 1,
        minSteps: 81,
        pieces: [
            { type: 'cao', x: 1, y: 0 },
            { type: 'guan', x: 1, y: 2 },
            { type: 'jiang', x: 0, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 2, id: 'j3' },
            { type: 'jiang', x: 3, y: 2, id: 'j4' },
            { type: 'bing', x: 0, y: 4, id: 'b1' },
            { type: 'bing', x: 1, y: 3, id: 'b2' },
            { type: 'bing', x: 2, y: 3, id: 'b3' },
            { type: 'bing', x: 3, y: 4, id: 'b4' }
        ]
    },
    {
        id: 2,
        name: "指挥若定",
        difficulty: 2,
        minSteps: 70,
        pieces: [
            { type: 'cao', x: 1, y: 0 },
            { type: 'guan', x: 1, y: 2 },
            { type: 'jiang', x: 0, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 3, id: 'j3' },
            { type: 'jiang', x: 3, y: 3, id: 'j4' },
            { type: 'bing', x: 0, y: 2, id: 'b1' },
            { type: 'bing', x: 3, y: 2, id: 'b2' },
            { type: 'bing', x: 1, y: 3, id: 'b3' },
            { type: 'bing', x: 2, y: 3, id: 'b4' }
        ]
    },
    {
        id: 3,
        name: "将拥曹营",
        difficulty: 2,
        minSteps: 72,
        pieces: [
            { type: 'cao', x: 1, y: 0 },
            { type: 'guan', x: 0, y: 4 },
            { type: 'jiang', x: 0, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 2, id: 'j3' },
            { type: 'jiang', x: 3, y: 2, id: 'j4' },
            { type: 'bing', x: 1, y: 2, id: 'b1' },
            { type: 'bing', x: 2, y: 2, id: 'b2' },
            { type: 'bing', x: 2, y: 4, id: 'b3' },
            { type: 'bing', x: 3, y: 4, id: 'b4' }
        ]
    },
    {
        id: 4,
        name: "齐头并进",
        difficulty: 1,
        minSteps: 60,
        pieces: [
            { type: 'cao', x: 0, y: 0 },
            { type: 'guan', x: 0, y: 2 },
            { type: 'jiang', x: 2, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 2, y: 2, id: 'j3' },
            { type: 'jiang', x: 3, y: 2, id: 'j4' },
            { type: 'bing', x: 0, y: 4, id: 'b1' },
            { type: 'bing', x: 1, y: 4, id: 'b2' },
            { type: 'bing', x: 2, y: 4, id: 'b3' },
            { type: 'bing', x: 3, y: 4, id: 'b4' }
        ]
    },
    {
        id: 5,
        name: "兵分三路",
        difficulty: 2,
        minSteps: 68,
        pieces: [
            { type: 'cao', x: 1, y: 0 },
            { type: 'guan', x: 1, y: 2 },
            { type: 'jiang', x: 0, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 3, id: 'j3' },
            { type: 'jiang', x: 3, y: 3, id: 'j4' },
            { type: 'bing', x: 0, y: 2, id: 'b1' },
            { type: 'bing', x: 1, y: 3, id: 'b2' },
            { type: 'bing', x: 2, y: 3, id: 'b3' },
            { type: 'bing', x: 3, y: 2, id: 'b4' }
        ]
    },
    {
        id: 6,
        name: "层层设防",
        difficulty: 3,
        minSteps: 65,
        pieces: [
            { type: 'cao', x: 1, y: 0 },
            { type: 'guan', x: 1, y: 2 },
            { type: 'jiang', x: 0, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 2, id: 'j3' },
            { type: 'jiang', x: 3, y: 2, id: 'j4' },
            { type: 'bing', x: 0, y: 4, id: 'b1' },
            { type: 'bing', x: 1, y: 4, id: 'b2' },
            { type: 'bing', x: 2, y: 4, id: 'b3' },
            { type: 'bing', x: 3, y: 4, id: 'b4' }
        ]
    },
    {
        id: 7,
        name: "水泄不通",
        difficulty: 3,
        minSteps: 80,
        pieces: [
            { type: 'cao', x: 0, y: 0 },
            { type: 'guan', x: 2, y: 2 },
            { type: 'jiang', x: 2, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 2, id: 'j3' },
            { type: 'jiang', x: 3, y: 2, id: 'j4' },
            { type: 'bing', x: 0, y: 4, id: 'b1' },
            { type: 'bing', x: 1, y: 4, id: 'b2' },
            { type: 'bing', x: 2, y: 4, id: 'b3' },
            { type: 'bing', x: 3, y: 4, id: 'b4' }
        ]
    },
    {
        id: 8,
        name: "插翅难飞",
        difficulty: 4,
        minSteps: 75,
        pieces: [
            { type: 'cao', x: 1, y: 0 },
            { type: 'guan', x: 0, y: 2 },
            { type: 'jiang', x: 0, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 2, y: 2, id: 'j3' },
            { type: 'jiang', x: 3, y: 2, id: 'j4' },
            { type: 'bing', x: 0, y: 4, id: 'b1' },
            { type: 'bing', x: 1, y: 4, id: 'b2' },
            { type: 'bing', x: 2, y: 4, id: 'b3' },
            { type: 'bing', x: 3, y: 4, id: 'b4' }
        ]
    },
    {
        id: 9,
        name: "左右布兵",
        difficulty: 2,
        minSteps: 62,
        pieces: [
            { type: 'cao', x: 1, y: 0 },
            { type: 'guan', x: 1, y: 2 },
            { type: 'jiang', x: 0, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 2, id: 'j3' },
            { type: 'jiang', x: 3, y: 2, id: 'j4' },
            { type: 'bing', x: 1, y: 4, id: 'b1' },
            { type: 'bing', x: 2, y: 4, id: 'b2' },
            { type: 'bing', x: 0, y: 4, id: 'b3' },
            { type: 'bing', x: 3, y: 4, id: 'b4' }
        ]
    },
    {
        id: 10,
        name: "前挡后阻",
        difficulty: 3,
        minSteps: 70,
        pieces: [
            { type: 'cao', x: 1, y: 1 },
            { type: 'guan', x: 1, y: 3 },
            { type: 'jiang', x: 0, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 3, id: 'j3' },
            { type: 'jiang', x: 3, y: 3, id: 'j4' },
            { type: 'bing', x: 1, y: 0, id: 'b1' },
            { type: 'bing', x: 2, y: 0, id: 'b2' },
            { type: 'bing', x: 0, y: 2, id: 'b3' },
            { type: 'bing', x: 3, y: 2, id: 'b4' }
        ]
    },
    {
        id: 11,
        name: "兵临城下",
        difficulty: 2,
        minSteps: 58,
        pieces: [
            { type: 'cao', x: 1, y: 0 },
            { type: 'guan', x: 2, y: 2 },
            { type: 'jiang', x: 0, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 2, id: 'j3' },
            { type: 'jiang', x: 3, y: 2, id: 'j4' },
            { type: 'bing', x: 0, y: 4, id: 'b1' },
            { type: 'bing', x: 1, y: 4, id: 'b2' },
            { type: 'bing', x: 2, y: 4, id: 'b3' },
            { type: 'bing', x: 3, y: 4, id: 'b4' }
        ]
    },
    {
        id: 12,
        name: "遥相呼应",
        difficulty: 3,
        minSteps: 72,
        pieces: [
            { type: 'cao', x: 1, y: 0 },
            { type: 'guan', x: 1, y: 2 },
            { type: 'jiang', x: 0, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 2, id: 'j3' },
            { type: 'jiang', x: 3, y: 3, id: 'j4' },
            { type: 'bing', x: 0, y: 4, id: 'b1' },
            { type: 'bing', x: 1, y: 3, id: 'b2' },
            { type: 'bing', x: 2, y: 3, id: 'b3' },
            { type: 'bing', x: 3, y: 2, id: 'b4' }
        ]
    },
    {
        id: 13,
        name: "峰回路转",
        difficulty: 4,
        minSteps: 85,
        pieces: [
            { type: 'cao', x: 0, y: 0 },
            { type: 'guan', x: 2, y: 3 },
            { type: 'jiang', x: 2, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 2, id: 'j3' },
            { type: 'jiang', x: 1, y: 2, id: 'j4' },
            { type: 'bing', x: 0, y: 4, id: 'b1' },
            { type: 'bing', x: 1, y: 4, id: 'b2' },
            { type: 'bing', x: 2, y: 4, id: 'b3' },
            { type: 'bing', x: 3, y: 4, id: 'b4' }
        ]
    },
    {
        id: 14,
        name: "纵横交错",
        difficulty: 4,
        minSteps: 78,
        pieces: [
            { type: 'cao', x: 1, y: 0 },
            { type: 'guan', x: 0, y: 3 },
            { type: 'jiang', x: 0, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 2, id: 'j3' },
            { type: 'jiang', x: 3, y: 2, id: 'j4' },
            { type: 'bing', x: 2, y: 3, id: 'b1' },
            { type: 'bing', x: 3, y: 3, id: 'b2' },
            { type: 'bing', x: 1, y: 4, id: 'b3' },
            { type: 'bing', x: 2, y: 4, id: 'b4' }
        ]
    },
    {
        id: 15,
        name: "四面楚歌",
        difficulty: 5,
        minSteps: 100,
        pieces: [
            { type: 'cao', x: 1, y: 1 },
            { type: 'guan', x: 1, y: 3 },
            { type: 'jiang', x: 0, y: 0, id: 'j1' },
            { type: 'jiang', x: 3, y: 0, id: 'j2' },
            { type: 'jiang', x: 0, y: 3, id: 'j3' },
            { type: 'jiang', x: 3, y: 3, id: 'j4' },
            { type: 'bing', x: 0, y: 2, id: 'b1' },
            { type: 'bing', x: 3, y: 2, id: 'b2' },
            { type: 'bing', x: 1, y: 0, id: 'b3' },
            { type: 'bing', x: 2, y: 0, id: 'b4' }
        ]
    }
];

// 关卡管理器
const LevelManager = {
    levels: LEVELS,
    completedLevels: new Set(),

    // 从本地存储加载进度
    loadProgress() {
        try {
            const saved = localStorage.getItem('klotski_progress');
            if (saved) {
                this.completedLevels = new Set(JSON.parse(saved));
            }
        } catch (e) {
            console.log('Failed to load progress:', e);
        }
    },

    // 保存进度到本地存储
    saveProgress() {
        try {
            localStorage.setItem('klotski_progress', JSON.stringify([...this.completedLevels]));
        } catch (e) {
            console.log('Failed to save progress:', e);
        }
    },

    // 获取关卡
    getLevel(id) {
        return this.levels.find(l => l.id === id);
    },

    // 获取所有关卡
    getAllLevels() {
        return this.levels;
    },

    // 标记关卡完成
    completeLevel(id) {
        this.completedLevels.add(id);
        this.saveProgress();
    },

    // 检查关卡是否完成
    isCompleted(id) {
        return this.completedLevels.has(id);
    },

    // 检查关卡是否解锁
    isUnlocked(id) {
        if (id === 1) return true;
        return this.completedLevels.has(id - 1);
    },

    // 获取下一个关卡
    getNextLevel(id) {
        const nextId = id + 1;
        if (nextId <= this.levels.length) {
            return this.getLevel(nextId);
        }
        return null;
    },

    // 重置所有进度
    resetProgress() {
        this.completedLevels.clear();
        this.saveProgress();
    }
};

// 初始化时加载进度
LevelManager.loadProgress();
