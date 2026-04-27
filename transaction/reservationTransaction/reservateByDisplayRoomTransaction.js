const customerReservateTransaction=require('./customerReservateTransaction');
const allDisplayRoomManager=require('../../branchResource/displayRoom/allDisplayRoomManager');
const transaction=require('../../transaction/transaction');
/**
 * 顾客使用展示房间预约
 */
class reservateByDisplayRoomTransaction extends customerReservateTransaction{
    constructor(){
        super();
    }

    execute(...args){
        super.execute(...args);
        const [branchID, customerID, displayRoomID] = args;

        const displayRoom=transaction.getManager(allDisplayRoomManager)
                .getOneDisplayRoomById(branchID, displayRoomID);

        if(displayRoom==null){
            return this.packageResult(false,null,"展示房间不存在");
        }

        if(!displayRoom.getActiveState().getActiveBool())
        {
            return this.packageResult(false,null,"展示房间已被下架");
        }
        return super.execute(customerID,branchID,displayRoom.getRoomLayout());
    }
}

module.exports=reservateByDisplayRoomTransaction;
