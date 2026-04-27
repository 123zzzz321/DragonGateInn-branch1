const SingletonFactory=require('../util/SingletonFactory');
const assert=require('assert');

const {recordDataChangeManager}=require('../global/betweenMemoryDatabase/RecordDataChange/recordDataChange');
const databaseChangeManager=SingletonFactory.getInstance(recordDataChangeManager);
/**
 * 事务类
 * 管理系统内所有用户可以进行的改变系统状态的行为，
 * 包括账户相关（分派新账户，登录账户，修改账户信息）
 *     房间管理（添加房间，下架房间）
 *     营业相关（添加顾客预约，登记入住）+
 */
class transaction{
    constructor(){
        /**
         * 事务发生的时间
         * @type {string}
         */
        this.date=null;


    }

    /**
     * 包装事务执行结果
     * @param {boolean} isSuccess 是否成功
     * @param {*} resultContent 执行结果
     * @param {string} message 执行结果的提示信息
     * @returns {transactionResult} 事务执行结果对象
     */
    packageResult(isSuccess,resultContent,message){
        assert(typeof isSuccess === 'boolean',"isSuccess is not boolean");
     
        return new transactionResult(isSuccess,resultContent,message);
    }

    /**
     * 执行事务
     */
    execute(...args){
        // 记录执行时间
        this.date = new Date();
    }

    /**
     * 获取管理器实例,默认是从单例工厂中取得管理器实例
     * @param {string} managerType 管理器类型
     * @returns {object} 管理器实例
     */
    static getManager(managerType){
        return SingletonFactory.getInstance(managerType);
    }

    /**
     * 需要改变数据库时，记录下这个更改
     * @param {*} changeType 变更类型
     * @param {*} changeData 变更数据
     */
    changeDatabase(changeType,changeData){
        databaseChangeManager.createChange(changeType,changeData);
    }
}

/**
 * 事务执行结果类
 */
class transactionResult{
    constructor(isSuccess,resultContent,message){
        this.successBool=isSuccess;
        this.resultContent=resultContent;
        this.message=message;
    }
}

module.exports=transaction; 
