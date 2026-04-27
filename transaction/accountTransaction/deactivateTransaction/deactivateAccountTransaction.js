const assert=require('assert');

const transaction=require('../../transaction');
const accountManager=require('../../../accountManager/accountManager');

/**
 * 账户停用事务
 */
class DeactivateAccountTransaction extends transaction{
    constructor(curAccountManager){
        super();
        assert(curAccountManager instanceof accountManager);
        this.accountManager=curAccountManager;
    }

    /**
     * 执行停用账户事务
     * @param {...string} args 需要停用的账户ID
     */
    execute(...args){
        super.execute(...args);
        
        assert(args.length===1);
        const accountId=args[0];

        if(!this.accountManager.getOneAccountByID(accountId)){
            return this.packageResult(false,null,"账户不存在");
        }

        this.accountManager.setDisableAccount(accountId);

        //在数据库中记录下这个变更
        this.changeDatabase('update',this.accountManager.getOneAccountByID(accountId));

        return this.packageResult(true,null,"账户停用成功");
    }
}

module.exports=DeactivateAccountTransaction;