const SingletonFactory = require('../../../util/SingletonFactory');
const branchAccountManager = require('../../../accountManager/branchAccountManager');
const branchResourceManagers=require('../../../global/branchResource/branchResourceManagers');


const globalDatabaseAccessLayer = require('../../DatabaseConnection/DatabaeseConnect');

const convertDBRowToType=require('../../../db/ConvertTypBetweenDBRow/convertDBRowToType');

const {accountClassTableConfigs,getBranchResourceTableConfig}=require('../classTableConfig');


/**
 * 从数据库中读取账户数据
 * @param {string} tableName - 账户表名
 * @returns {Promise<Array>} 包含所有账户数据的数组
 */
async function readAccountDataFromDB(tableName) {
    return await globalDatabaseAccessLayer.getTableAllRows(tableName);
}

/**
 * 将账户数据写入账户管理器
 * @param {string} accountTableName - 账户表名
 * @param {Array} datas - 包含所有账户数据的数组
 */
function writeAccountDataIntoManager(classNameString,aaddDataFunc, datas) {
    const curConvertDBRowToType=new convertDBRowToType();
    datas.forEach(data => {
        aaddDataFunc(curConvertDBRowToType.convert(classNameString,data));
    });
}

/**
 * 处理一个账户配置项
 * @param {Object} config - 账户配置项
 */
async function handleOneAccountConfig(config){
    try {
            // 读取数据库中的数据
            const accountDatas = await readAccountDataFromDB(config.tableName);
            // 写入数据到管理器
            writeAccountDataIntoManager(
                config.type.name, 
                config.manager.addOneNewAccount.bind(config.manager),
                accountDatas);
            console.log(`表${config.tableName}数据加载完成`);

        } catch (error) {

            console.warn(`处理表${config.tableName}时出错:`, error.message);
        }
}

/**
 * 处理一个分店资源配置项
 * @param {Object} config - 分店资源配置项
 */
async function handleOneBranchConfig(config){   
    try {
            // 读取数据库中的数据
            const datas = await readAccountDataFromDB(config.tableName);
            // 写入数据到管理器
            writeAccountDataIntoManager(
                config.type.name, 
                config.manager.addObject.bind(config.manager),
                datas);
            console.log(`表${config.tableName}数据加载完成`);

        } catch (error) {

            console.warn(`处理表${config.tableName}时出错:`, error.message);
        }
}

/**
 * 初始化管理器（从数据库中读取数据并写入管理器）
 * @param {Array} configs - 包含所有配置项的数组
 * @param {Function} handleFunc - 处理每个配置项的函数
 */
async function initManagerFromDatabase(configs,handleFunc)
{
    try {
        console.log('开始初始化管理器...');
        
        await Promise.all(configs.map(handleFunc));

        console.log('所有管理器初始化完成');

    } catch (error) {

        console.error('初始化管理器失败:', error);

    }
}

/**
 * 初始化所有账户管理器（从数据库中读取账户数据并写入账户管理器）
 */
async function initAllAccountManager() {
    await initManagerFromDatabase(accountClassTableConfigs,handleOneAccountConfig);


    //为每个分店账号添加资源管理器
    const branchAccounts=SingletonFactory.getInstance(branchAccountManager).getAllAccountList();
     branchAccounts.forEach(branchAccount=>{
        branchResourceManagers.forEach(manager=>{
            SingletonFactory.getInstance(manager).addNewBranchManager(branchAccount.getID());
        })
     })
}


/**
 * 在调用这个函数之前需要保证已经初始化了分店账户数据
 * 初始化所有分店资源配置管理器（从数据库中读取分店资源数据并写入分店资源配置管理器）
 */
async function initAllBranchResourceManager() {
    //获取所有分店账号，不论这个账号是否被启用，或者没有被启用
    const branchAccounts=SingletonFactory.getInstance(branchAccountManager).getAllAccountList();

    //为所有分店资源管理器添加数据
    await Promise.all(
        branchAccounts.map(
            branchAccount=>initManagerFromDatabase(
                        getBranchResourceTableConfig(branchAccount.getID()),
                        handleOneBranchConfig)));
}



module.exports = {
    initAllAccountManager,
    initAllBranchResourceManager
}