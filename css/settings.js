// ============================================================
//  设置功能
// ============================================================

let refreshTimer = null;

function openSettings() {
    const settings = getSettings();
    document.getElementById('darkMode').checked = settings.darkMode;
    document.getElementById('notifications').checked = settings.notifications;
    document.getElementById('fontSize').value = settings.fontSize;
    document.getElementById('autoRefresh').value = settings.autoRefresh;
    document.getElementById('defaultCategory').value = settings.defaultCategory;
    document.getElementById('settingsModal').classList.add('show');
}

function applySettings() {
    const settings = {
        darkMode: document.getElementById('darkMode').checked,
        notifications: document.getElementById('notifications').checked,
        fontSize: document.getElementById('fontSize').value,
        autoRefresh: document.getElementById('autoRefresh').value,
        defaultCategory: document.getElementById('defaultCategory').value
    };
    saveSettings(settings);

    // 应用主题
    applyTheme(settings);

    // 设置默认分类
    document.getElementById('postCategory').value = settings.defaultCategory;

    // 重新设置自动刷新
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
    if (settings.autoRefresh !== 'off') {
        refreshTimer = setInterval(() => {
            if (document.getElementById('postsTab').style.display !== 'none') {
                renderPosts();
            }
        }, parseInt(settings.autoRefresh) * 1000);
    }

    // 应用字体大小
    applyFontSize(settings.fontSize);
}

function applyTheme(settings) {
    document.body.style.background = settings.darkMode ?
        'linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e)' :
        'linear-gradient(135deg, #0f0c29, #302b63, #24243e)';
}

function applyFontSize(size) {
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    document.body.style.fontSize = sizes[size] || '16px';
}

function clearAllData() {
    if (!confirm('⚠️ 确定要清除所有数据吗？此操作不可恢复！')) return;
    if (!confirm('再次确认：所有帖子、评论、设置都将被删除！')) return;

    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK);

    alert('✅ 数据已清除，页面将刷新');
    location.reload();
}

// 模态框关闭
function closeModal(id) {
    document.getElementById(id).classList.remove('show');
}

// 点击遮罩关闭
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.modal-overlay').forEach(el => {
        el.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
});