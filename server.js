const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * 启动服务器
 */
async function start() {
    // 中间件配置
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // 路由配置
    app.get('/', (req, res) => {
        res.send('Welcome to Dragon Gate Inn Management System');
    });
    
    // 健康检查
    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });
    
    // 启动服务器
    return new Promise((resolve, reject) => {
        const server = app.listen(PORT, () => {
            console.log(`服务器运行在 http://localhost:${PORT}`);
            resolve(server);
        });
        
        server.on('error', (error) => {
            reject(error);
        });
    });
}

module.exports = {
    start
};