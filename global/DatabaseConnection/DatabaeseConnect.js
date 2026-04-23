const SingletonFactory = require('../../util/SingletonFactory');
const OracleAccessLayer = require('../../db/OracleAccessLayer');

/**
 * 数据库连接配置
 */
const databaseConnctionConfig={
    user: 'STARDUST',
    password: '123456',
    connectString: 'localhost:1521/hellooracle'
}

/**
 * 数据库访问层单例，整个项目所有数据库操作都通过这个实例进行
 */
const globalDatabaseAccessLayer=SingletonFactory.getInstance(OracleAccessLayer,databaseConnctionConfig);


module.exports=globalDatabaseAccessLayer;
