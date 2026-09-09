// ============================================================
//  服务数据与渲染
// ============================================================

const SERVICES = {
    '📋 项目开发': [
        { id: 'qasystem', icon: '📋', name: '硕日售前技术支持系统', url: 'http://10.10.100.75:8100', port: '8100',
            container: 'qasystem' },
        { id: 'taskmanage', icon: '📅', name: '月度任务管理系统', url: 'http://10.10.100.75:8300', port: '8300',
            container: 'taskmanage0907' }
    ],
    '📊 监控 & 可视化': [
        { id: 'grafana', icon: '📈', name: 'Grafana', url: 'http://10.10.100.75:3000', port: '3000',
            container: 'grafana' },
        { id: 'prometheus', icon: '📊', name: 'Prometheus', url: 'http://10.10.100.75:9090', port: '9090',
            container: 'prometheus' },
        { id: 'node-exporter', icon: '🖥️', name: 'Node Exporter', url: 'http://10.10.100.75:9100', port: '9100',
            container: 'node-exporter' },
        { id: 'mysql-exporter', icon: '📉', name: 'MySQL Exporter', url: 'http://10.10.100.75:9104', port: '9104',
            container: 'mysqld-exporter' }
    ],
    '🗄️ 数据库': [
        { id: 'pgvector', icon: '🐘', name: 'PostgreSQL 16 (PGVector)', url: 'http://10.10.100.75:5432', port: '5432',
            container: 'pgvector' },
        { id: 'mysql57', icon: '🐬', name: 'MySQL 5.7', url: 'http://10.10.100.75:3306', port: '3306',
            container: 'mysql57' },
        { id: 'redis', icon: '🔴', name: 'Redis', url: 'http://10.10.100.75:6379', port: '6379', container: 'redis' }
    ],
    '🛠️ 管理 & 工具': [
        { id: 'dozzle', icon: '📋', name: 'Dozzle', url: 'http://10.10.100.75:9999', port: '9999', container: 'dozzle' }
    ]
};

function renderServicesMini() {
    const container = document.getElementById('serviceMiniGrid');
    if (!container) return;

    let html = '';
    for (const group in SERVICES) {
        for (const svc of SERVICES[group]) {
            html += `
                <div class="service-mini-card" onclick="window.open('${svc.url}', '_blank')">
                    <div class="icon">${svc.icon}</div>
                    <div class="name">${svc.name}</div>
                    <div style="font-size:11px;color:#718096;">${svc.port}</div>
                </div>
            `;
        }
    }
    container.innerHTML = html;
}