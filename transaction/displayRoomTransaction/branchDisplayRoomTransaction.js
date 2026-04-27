const transaction = require('../transaction');
const allDisplayRoomManager=require('../../branchResource/displayRoom/allDisplayRoomManager');
const SingletonFactory=require('../../util/SingletonFactory');
const assert=require('assert');

/**
 * 分店展示房间事务基础类
 */
class branchDisplayRoomTransaction extends transaction{
    constructor(){
        super();
    }

    /**
     * 执行事务
     * @param {...any} args 事务参数
     * @returns {transactionResult} 事务执行结果
     */
    execute(...args){
        super.execute(...args);
    }

    /**
     * 检查分店参数是否符合要求
     * @param {Array} args 事务参数
     * @returns {boolean} 是否符合要求
     */
    checkBranchArg(args){
        return args.length > 0 && typeof args[0] === 'string';
    }

    /**
     * 检查分店是否存在
     * @param {string} branchId 分店ID
     * @returns {boolean} 是否存在
     */
    checkBranchExist(branchId){
        // 这里简化处理，实际应该检查分店是否真的存在
        return branchId && typeof branchId === 'string';
    }

    /**
     * 获取需要修改的分店展示房间管理器
     * @param {string} branchId 分店ID
     * @returns {branchDisplayRoomManager} 分店展示房间管理器
     */
    getNeedChangeBranchDisplayRoomManager(branchId){
        const displayRoomManager = SingletonFactory.getInstance(allDisplayRoomManager);
        if (!displayRoomManager.getOneManagerByBranchId(branchId)) {
            displayRoomManager.addNewBranchManager(branchId);
        }
        return displayRoomManager.getOneManagerByBranchId(branchId);
    }
}

module.exports=branchDisplayRoomTransaction;