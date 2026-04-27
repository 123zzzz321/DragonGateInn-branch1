const assert=require('assert');

const branchManager=require('../../../accountManager/branchAccountManager');
const branchAccount=require('../../../account/branchAccount');
const transaction=require('../../transaction');
const accountApplication=require('../../../accountManager/accountApplication');

const branchResourceManagers=require('../../../global/branchResource/branchResourceManagers');

/**
 * 进行注册分店账号的事务
 * @extends transaction
 */
class branchRegisterTransaction extends transaction{
    constructor(){
        super();
    }

    /**
     * 获取一个分店账号
     * @param {...string} args 
     */
    execute(...args){
        super.execute(...args);
        
        assert(args.length===0);

        //添加这个分店的账户 到分店账号管理器

        const newBranchAccount=
            new branchAccount(transaction.getManager(accountApplication).getRandomAccount()
                ,transaction.getManager(accountApplication).getInitPassword());
        transaction.getManager(branchManager).addOneNewAccount(
            newBranchAccount);

        //为这个分店增加所有的资源管理器
        branchResourceManagers.forEach(manager=>{
            transaction.getManager(manager).addNewBranchManager(newBranchAccount.getID());
        })

        //记录下这个变更
        this.changeDatabase('insert',newBranchAccount);
        //创建这个分店管理的表格
        this.changeDatabase('createBranchResourceTable',newBranchAccount);
        
        // 返回新申请的分店账号
        return this.packageResult(true,newBranchAccount,"注册成功");

    }
}

module.exports=branchRegisterTransaction;