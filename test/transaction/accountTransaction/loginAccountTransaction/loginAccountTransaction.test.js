const loginAccountTransaction=require('../../../../transaction/accountTransaction/loginTransaction/loginCustomerTransaction');
const customerRegisterTransaction=require('../../../../transaction/accountTransaction/registerTransaction/customerRegisterTransaction');
const customerAccount=require('../../../../account/customerAccount');


const loginBranchTransaction=require('../../../../transaction/accountTransaction/loginTransaction/loginBranchTransaction');
const branchRegisterTransaction=require('../../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');
const branchAccount=require('../../../../account/branchAccount');

const loginHeadquarterTransaction=require('../../../../transaction/accountTransaction/loginTransaction/loginHeadquarterTransaction');
const headquarterRegisterTransaction=require('../../../../transaction/accountTransaction/registerTransaction/headquarterRegisterTransaction');
const headquarterAccount=require('../../../../account/headquarterAccount');

const loginCustomerByPhoneTransaction=require('../../../../transaction/accountTransaction/loginTransaction/loginCustomerByPhoneTransaction');

describe('客户登录事务',function(){
    it('登录客户',function(){
        let registerTransaction=new customerRegisterTransaction();
        const account= registerTransaction.execute('138000000000','123456').resultContent;

        let curTransaction=new loginAccountTransaction();
        expect(curTransaction.execute(account.getID(),account.getPassword()).successBool).toBe(true);

    });

    it('登录客户通过手机号',function(){
        let registerTransaction=new customerRegisterTransaction();
        const account= registerTransaction.execute('138000000001','123456').resultContent;

        let curTransaction=new loginCustomerByPhoneTransaction();
        expect(curTransaction.execute(account. getPhoneString(),account.getPassword()).successBool).toBe(true);
    })

    it('登录分店',function(){
        let registerTransaction=new branchRegisterTransaction();
        const account= registerTransaction.execute().resultContent;

        let curTransaction=new loginBranchTransaction();
        expect(curTransaction.execute(account.getID(),account.getPassword()).successBool).toBe(true);
    })

    it('登录总部账号',function(){
        let registerTransaction=new headquarterRegisterTransaction();
        const account= registerTransaction.execute('100000000000','123456').resultContent;

        let curTransaction=new loginHeadquarterTransaction();
        expect(curTransaction.execute(account.getID(),account.getPassword()).successBool).toBe(true);
    })
});
