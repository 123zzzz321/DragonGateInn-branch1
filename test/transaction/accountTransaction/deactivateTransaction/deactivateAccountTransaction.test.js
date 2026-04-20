const transaction=require('../../../../transaction/transaction');


const branchRegisterTransaction=require('../../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');
const customerRegisterTransaction=require('../../../../transaction/accountTransaction/registerTransaction/customerRegisterTransaction');


const deactivateBranchTransaction=require('../../../../transaction/accountTransaction/deactivateTransaction/deactivateBranchTranaction');
const deactivateCustomerTransaction=require('../../../../transaction/accountTransaction/deactivateTransaction/deactivateCustomerTransaction');


const branchAccountManager=require('../../../../accountManager/branchAccountManager');
const customerAccountManager=require('../../../../accountManager/customerAccountManager');
describe('停用账号事务',()=>{
    it('停用分点账号',()=>{
        const curBranchRegisterTransaction=new branchRegisterTransaction();
        const branchAccount=curBranchRegisterTransaction.execute().resultContent;


        const curDeactivateAccountTransaction=new deactivateBranchTransaction();
        curDeactivateAccountTransaction.execute(branchAccount.getID());
        expect(transaction.getManager(branchAccountManager).getActiveAccountList().includes(branchAccount)).toBe(false);
    });

    it('停用客户账号',()=>{
        const curCustomerRegisterTransaction=new customerRegisterTransaction();
        curCustomerRegisterTransaction.execute('13801234517','123456');
        const customerAccount=transaction.getManager(customerAccountManager).getCustomAccountByPhoneString('13801234517');

        const curDeactivateAccountTransaction=new deactivateCustomerTransaction();
        curDeactivateAccountTransaction.execute(customerAccount.getID());
        expect(transaction.getManager(customerAccountManager).getActiveAccountList().includes(customerAccount)).toBe(false);

    });
});
