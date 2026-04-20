const branchRegisterTransaction=require('../../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');
const SingletonFactory=require('../../../../util/SingletonFactory');
const branchAccountManager=require('../../../../accountManager/branchAccountManager');
const allRoomManager=require('../../../../branchResource/room/allRoomManager');

describe('分点账号注册事务',function(){
    it('注册分点账号',function(){
        let transaction=new branchRegisterTransaction();
        const newBranchAccount=transaction.execute().resultContent;

        expect(SingletonFactory.getInstance(branchAccountManager)
            .getOneAccountByID(newBranchAccount.getID())).toBeDefined();
        
        // 检查房间管理器是否添加成功
        expect(SingletonFactory.getInstance(allRoomManager)
            .getOneManagerByBranchId(newBranchAccount.getID())).toBeDefined();
    })
})
