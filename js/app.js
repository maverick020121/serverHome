// ============================================================
//  应用初始化
// ============================================================

function init() {
    // 加载个人信息
    const profile = getProfile();
    document.getElementById('usernameDisplay').textContent = profile.name;
    document.getElementById('avatarDisplay').textContent = profile.avatar;

    // 加载设置
    const settings = getSettings();
    applyTheme(settings);
    applyFontSize(settings.fontSize);
    document.getElementById('postCategory').value = settings.defaultCategory;

    // 设置自动刷新
    if (settings.autoRefresh !== 'off') {
        refreshTimer = setInterval(() => {
            if (document.getElementById('postsTab').style.display !== 'none') {
                renderPosts();
            }
        }, parseInt(settings.autoRefresh) * 1000);
    }

    // 渲染数据
    renderPosts();
    updateStats();
    renderServicesMini();

    // 默认显示帖子Tab
    switchTab('posts');

    console.log('🚀 社区版服务导航已启动！');
    console.log(`👤 当前用户: ${profile.name}`);
    console.log(`📝 帖子数: ${getPosts().length}`);
    console.log(`📊 服务数: ${Object.values(SERVICES).reduce((acc, arr) => acc + arr.length, 0)}`);
}

function switchTab(tab) {
    document.querySelectorAll('.top-bar .nav-links button').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.top-bar .nav-links button[onclick="switchTab('${tab}')"]`);
    if (btn) btn.classList.add('active');

    if (tab === 'services') {
        document.getElementById('servicesTab').style.display = 'block';
        document.getElementById('postsTab').style.display = 'none';
        renderServicesMini();
    } else {
        document.getElementById('servicesTab').style.display = 'none';
        document.getElementById('postsTab').style.display = 'block';
        renderPosts();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
