// ============================================================
//  数据层 - localStorage 操作
// ============================================================

const STORAGE_KEYS = {
    POSTS: 'community_posts',
    SETTINGS: 'community_settings',
    PROFILE: 'community_profile',
    FEEDBACK: 'community_feedback'
};

// ---------- 帖子 ----------
function getPosts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS)) || [];
    } catch { return []; }
}

function savePosts(posts) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
}

// ---------- 设置 ----------
function getSettings() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || {
            darkMode: false,
            notifications: true,
            fontSize: 'medium',
            autoRefresh: '60',
            defaultCategory: '💬 讨论'
        };
    } catch { return { darkMode: false, notifications: true, fontSize: 'medium', autoRefresh: '60',
            defaultCategory: '💬 讨论' }; }
}

function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ---------- 个人信息 ----------
function getProfile() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE)) || {
            name: '游客',
            avatar: '👤',
            bio: ''
        };
    } catch { return { name: '游客', avatar: '👤', bio: '' }; }
}

function saveProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

// ---------- 反馈 ----------
function getFeedback() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK)) || [];
    } catch { return []; }
}

function saveFeedback(feedback) {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedback));
}

// ---------- 工具函数 ----------
function generateId() {
    return Date.now() + Math.random() * 1000;
}

function formatTime(isoString) {
    return new Date(isoString).toLocaleString('zh-CN');
}