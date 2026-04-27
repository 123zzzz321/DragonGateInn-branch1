const assert=require('assert');

const headquarterManager=require('../../../accountManager/headquarterAccountManager');
const headquarterAccount=require('../../../account/headquarterAccount');
const transaction=require('../../transaction');


class headquarterRegisterTransaction extends transaction{
    constructor(){
        super();

    }

    execute(...args){
        super.execute(...args);
        
        assert(args.length===2);
        assert(args[0]!==null && typeof args[0]==='string');
        assert(args[1]!==null && typeof args[1]==='string');
        
        const [headquarterId,password]=args;

        const newHeadquarterAccount=
            new headquarterAccount(headquarterId,password);
        
        transaction.getManager(headquarterManager)
            .addOneNewAccount(
                newHeadquarterAccount);
                
        //记录下这个变更
        this.changeDatabase('insert',newHeadquarterAccount);
        
        return this.packageResult(true, newHeadquarterAccount, "注册成功");
    }
}
module.exports=headquarterRegisterTransaction;