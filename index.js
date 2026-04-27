const SingletonFactory = require('./util/SingletonFactory');
const InitManager = require('./global/betweenMemoryDatabase/InitManager/InitManager');
const server = require('./server');
const { recordDataChangeManager } = require('./global/betweenMemoryDatabase/RecordDataChange/recordDataChange');

/**
 * 应用启动函数
 */
async function startApp() {
    try {
        console.log('开始初始化系统...');
        
        // 初始化系统
        const initManager = InitManager;
        await initManager.initAllAccountManager();
        await initManager.initAllBranchResourceManager();
        
        console.log('系统初始化成功');
        
        // 启动服务器
        console.log('启动服务器...');
        const appServer = await server.start();
        
        console.log('应用启动成功');
        
        // 获取数据变更记录管理器
        const dataChangeManager = SingletonFactory.getInstance(recordDataChangeManager);
        
        // 处理程序结束事件
        function handleExit(signal) {
            console.log(`收到 ${signal} 信号，准备退出...`);
            
            // 存储变更到数据库
            dataChangeManager.changeDatabase()
                .then(() => {
                    console.log('数据变更已存储到数据库');
                    if (appServer) {
                        appServer.close(() => {
                            console.log('服务器已关闭');
                            process.exit(0);
                        });
                    } else {
                        process.exit(0);
                    }
                })
                .catch(error => {
                    console.error('存储数据变更失败:', error);
                    process.exit(1);
                });
        }
        
        // 监听退出信号
        process.on('SIGINT', handleExit);  // Ctrl+C
        process.on('SIGTERM', handleExit); // kill 命令
    } catch (error) {
        console.error('应用启动失败:', error);
        process.exit(1);
    }
}

// 启动应用
startApp();