// ============================================================
//  反馈功能
// ============================================================

function openFeedback() {
    document.getElementById('feedbackModal').classList.add('show');
}

function submitFeedback() {
    const type = document.getElementById('feedbackType').value;
    const content = document.getElementById('feedbackContent').value.trim();
    const contact = document.getElementById('feedbackContact').value.trim();
    const profile = getProfile();

    if (!content) { alert('请填写反馈内容'); return; }

    const feedback = getFeedback();
    feedback.unshift({
        id: generateId(),
        type: type,
        content: content,
        contact: contact || '未填写',
        author: profile.name,
        time: new Date().toISOString()
    });
    saveFeedback(feedback);

    document.getElementById('feedbackContent').value = '';
    document.getElementById('feedbackContact').value = '';
    closeModal('feedbackModal');
    alert('✅ 感谢您的反馈！');

    // 通知设置检查
    const settings = getSettings();
    if (settings.notifications) {
        console.log(`📝 收到反馈: ${type} - ${content.substring(0, 30)}...`);
    }
}