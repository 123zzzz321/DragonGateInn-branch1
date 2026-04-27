const assert=require('assert');

const transaction=require('../../transaction');
const customerAccount=require('../../../account/customerAccount');
const customerAccountManager=require('../../../accountManager/customerAccountManager');
const accountApplication=require('../../../accountManager/accountApplication');

/**
 * 客户注册事务
 * @extends transaction
 */
class customerRegisterTransaction extends transaction{
    constructor(){
        super();
    }

    /**
     * 执行注册事务
     * @param {...string} args 注册事务的参数，包括顾客的手机号和密码
     * @param {...string} args[0] 顾客的手机号
     * @param {...string} args[1] 顾客的密码
     */
    execute(...args){
        super.execute(...args);
        
        assert(args.length===2);
        assert(args[0]!==null && typeof args[0]==='string');
        assert(args[1]!==null && typeof args[1]==='string');


        const [phoneString,password]=args;

         if(transaction.getManager(customerAccountManager).getCustomAccountByPhoneString(phoneString)!==undefined){
            throw new Error('注册顾客账户时，使用的手机号已存在');
        }
        
       
        
        const newCustomerAccount=
            new customerAccount(transaction.getManager(accountApplication).getRandomAccount(),password,phoneString)
        
        transaction.getManager(customerAccountManager)
            .addOneNewAccount(newCustomerAccount);       
            
        //记录下这个变更
        this.changeDatabase('insert',newCustomerAccount);
        
        return this.packageResult(true,newCustomerAccount,"注册成功");
    }
}

module.exports=customerRegisterTransaction;
