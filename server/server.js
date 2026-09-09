const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化数据文件
if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify([], null, 2));
}

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..')));

// ============ API 路由 ============

// 读取数据
function readPosts() {
    try {
        const data = fs.readFileSync(POSTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('读取数据失败:', err);
        return [];
    }
}

// 写入数据
function writePosts(posts) {
    try {
        fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
        return true;
    } catch (err) {
        console.error('写入数据失败:', err);
        return false;
    }
}

// 生成ID
function generateId() {
    return Date.now();
}

// 格式化时间
function formatTime(iso) {
    return new Date(iso).toLocaleString('zh-CN');
}

// ============ API 接口 ============

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '反馈服务正常',
        time: new Date().toISOString()
    });
});

// 获取所有帖子
app.get('/api/posts', (req, res) => {
    const posts = readPosts();
    res.json({
        success: true,
        data: posts,
        total: posts.length
    });
});

// 获取单个帖子
app.get('/api/posts/:id', (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.id === parseFloat(req.params.id));
    if (post) {
        res.json({ success: true, data: post });
    } else {
        res.status(404).json({ success: false, message: '帖子不存在' });
    }
});

// 创建帖子
app.post('/api/posts', (req, res) => {
    const { title, content, category, author, avatar } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({ 
            success: false, 
            message: '标题和内容不能为空' 
        });
    }

    const posts = readPosts();
    const newPost = {
        id: generateId(),
        title: title.trim(),
        content: content.trim(),
        category: category || '💬 讨论',
        author: author || '游客',
        avatar: avatar || '👤',
        time: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        comments: []
    };

    posts.unshift(newPost);
    writePosts(posts);

    res.json({
        success: true,
        message: '发布成功',
        data: newPost
    });
});

// 删除帖子
app.delete('/api/posts/:id', (req, res) => {
    const id = parseFloat(req.params.id);
    let posts = readPosts();
    const post = posts.find(p => p.id === id);
    
    if (!post) {
        return res.status(404).json({ 
            success: false, 
            message: '帖子不存在' 
        });
    }

    posts = posts.filter(p => p.id !== id);
    writePosts(posts);

    res.json({
        success: true,
        message: '删除成功'
    });
});

// 点赞/取消点赞
app.post('/api/posts/:id/like', (req, res) => {
    const id = parseFloat(req.params.id);
    const { username } = req.body;
    
    if (!username) {
        return res.status(400).json({
            success: false,
            message: '请提供用户名'
        });
    }

    const posts = readPosts();
    const post = posts.find(p => p.id === id);
    
    if (!post) {
        return res.status(404).json({
            success: false,
            message: '帖子不存在'
        });
    }

    const idx = post.likedBy.indexOf(username);
    if (idx >= 0) {
        post.likedBy.splice(idx, 1);
        post.likes--;
    } else {
        post.likedBy.push(username);
        post.likes++;
    }

    writePosts(posts);

    res.json({
        success: true,
        data: {
            likes: post.likes,
            liked: idx < 0
        }
    });
});

// 添加评论
app.post('/api/posts/:id/comments', (req, res) => {
    const id = parseFloat(req.params.id);
    const { text, author, avatar } = req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({
            success: false,
            message: '评论内容不能为空'
        });
    }

    const posts = readPosts();
    const post = posts.find(p => p.id === id);
    
    if (!post) {
        return res.status(404).json({
            success: false,
            message: '帖子不存在'
        });
    }

    const comment = {
        id: generateId(),
        author: author || '游客',
        avatar: avatar || '👤',
        text: text.trim(),
        time: new Date().toISOString()
    };

    post.comments.push(comment);
    writePosts(posts);

    res.json({
        success: true,
        message: '评论成功',
        data: comment
    });
});

// 删除评论
app.delete('/api/posts/:postId/comments/:commentId', (req, res) => {
    const postId = parseFloat(req.params.postId);
    const commentId = parseFloat(req.params.commentId);

    const posts = readPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        return res.status(404).json({
            success: false,
            message: '帖子不存在'
        });
    }

    const commentIdx = post.comments.findIndex(c => c.id === commentId);
    if (commentIdx === -1) {
        return res.status(404).json({
            success: false,
            message: '评论不存在'
        });
    }

    post.comments.splice(commentIdx, 1);
    writePosts(posts);

    res.json({
        success: true,
        message: '删除评论成功'
    });
});

// 获取统计信息
app.get('/api/stats', (req, res) => {
    const posts = readPosts();
    let comments = 0, likes = 0;
    for (const p of posts) {
        comments += p.comments.length;
        likes += p.likes;
    }
    res.json({
        success: true,
        data: {
            posts: posts.length,
            comments: comments,
            likes: likes
        }
    });
});

// ============ 启动服务 ============
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 服务已启动！`);
    console.log(`📡 地址: http://0.0.0.0:${PORT}`);
    console.log(`📁 数据存储: ${POSTS_FILE}`);
    console.log(`🌐 前端: http://10.10.100.75/nav/index.html`);
});
