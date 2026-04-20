const assert=require('assert');

const branchManager=require('../../../accountManager/branchAccountManager');
const branchAccount=require('../../../account/branchAccount');
const transaction=require('../../transaction');
const accountApplication=require('../../../accountManager/accountApplication');
const allRoomManager=require('../../../branchResource/room/allRoomManager');
const allReservationManager=require('../../../branchResource/reservation/allReservationManager');
const allCheckInManager=require('../../../branchResource/checkIn/allCheckInManager');
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

        //为这个分点增加一个房间管理器
        transaction.getManager(allRoomManager).addNewBranchManager(newBranchAccount.getID());

        //为这个分点增加一个预约管理器
        transaction.getManager(allReservationManager).addNewBranchManager(newBranchAccount.getID());

        //为这个分点增加一个入住登记管理器
        transaction.getManager(allCheckInManager).addNewBranchManager(newBranchAccount.getID());



        // 返回新申请的分店账号
        return this.packageResult(true,newBranchAccount,"注册成功");

    }
}

module.exports=branchRegisterTransaction;