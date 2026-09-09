// ============================================================
//  个人信息功能
// ============================================================

function openProfile() {
    const profile = getProfile();
    document.getElementById('profileName').value = profile.name;
    document.getElementById('profileAvatar').value = profile.avatar;
    document.getElementById('profileBio').value = profile.bio || '';
    document.getElementById('profileModal').classList.add('show');
}

function saveProfile() {
    const name = document.getElementById('profileName').value.trim() || '游客';
    const avatar = document.getElementById('profileAvatar').value.trim() || '👤';
    const bio = document.getElementById('profileBio').value.trim();

    const profile = { name, avatar, bio };
    saveProfile(profile);

    // 更新界面
    document.getElementById('usernameDisplay').textContent = name;
    document.getElementById('avatarDisplay').textContent = avatar;

    closeModal('profileModal');
    renderPosts();
    alert('✅ 个人信息已更新');
}