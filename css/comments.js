// ============================================================
//  评论功能
// ============================================================

function addComment(postId) {
    const input = document.getElementById(`comment_${postId}`);
    const text = input.value.trim();
    if (!text) return;

    const profile = getProfile();
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    post.comments.push({
        id: generateId(),
        author: profile.name,
        avatar: profile.avatar,
        text: text,
        time: new Date().toISOString()
    });

    savePosts(posts);
    input.value = '';
    renderPosts();
    updateStats();

    // 通知设置检查
    const settings = getSettings();
    if (settings.notifications) {
        // 简单通知
        console.log(`💬 新评论: ${text}`);
    }
}

function deleteComment(postId, commentId) {
    if (!confirm('确定删除这条评论吗？')) return;
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    post.comments = post.comments.filter(c => c.id !== commentId);
    savePosts(posts);
    renderPosts();
    updateStats();
}
