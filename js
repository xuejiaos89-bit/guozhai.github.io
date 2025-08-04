// 配置部分 ==================================
const CONFIG = {
    // Google Sheets配置（需先发布表格）
    SHEET_ID: '1XqOt6kiE1gW1JQoXXXXXX', // 替换为你的表格ID
    SHEET_NAME: 'announcements',
    
    // 图片配置（GitHub路径）
    IMAGE_PATH: 'https://raw.githubusercontent.com/[用户名]/[仓库名]/main/images/rate.png',
    
    // 自动刷新间隔（毫秒）
    REFRESH_INTERVAL: 3600000 // 1小时
};

// 主逻辑 ===================================
function loadAllContent() {
    // 加载国债图片（带时间戳避免缓存）
    document.getElementById('bond-image').src = 
        `${CONFIG.IMAGE_PATH}?t=${Date.now()}`;
    
    // 加载公告信息
    fetch(`https://opensheet.elk.sh/${CONFIG.SHEET_ID}/${CONFIG.SHEET_NAME}`)
        .then(response => {
            if (!response.ok) throw new Error('网络响应不正常');
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('announcements');
            container.innerHTML = data.map(item => `
                <div class="announcement">
                    <h5>${item.title}</h5>
                    <a href="${item.link}" target="_blank">查看完整公告 →</a>
                    <div class="text-muted small mt-1">${item.date || ''}</div>
                </div>
            `).join('');
            
            document.getElementById('update-time').textContent = 
                new Date().toLocaleString();
        })
        .catch(error => {
            console.error('加载公告失败:', error);
            document.getElementById('announcements').innerHTML = `
                <div class="alert alert-warning">
                    公告加载失败，请稍后刷新重试
                </div>
            `;
        });
}

// 初始化加载
document.addEventListener('DOMContentLoaded', loadAllContent);

// 定时刷新
setInterval(loadAllContent, CONFIG.REFRESH_INTERVAL);
