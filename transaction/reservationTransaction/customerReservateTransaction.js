const transaction=require('../transaction')

const {RoomLayout,BedInRoom}=require('../../branchResource/room/room');
const customerManager=require('../../accountManager/customerAccountManager')
const branchManager=require('../../accountManager/branchAccountManager')

const {reservationFactory}=require('../../branchResource/reservation/reservation');
const allReservationManager = require('../../branchResource/reservation/allReservationManager');
/**
 * 顾客预订房间的事务
 */
class customerReservateTransaction extends transaction{
    constructor(){
        super()
    }

    /**
     * 执行预订房间事务
     * @param {...any} args 顾客的预订房间事务的参数
     * @returns {any} 预约订单
     */
    execute(...args){
        super.execute(...args);
        // 执行预订房间事务
        const [customerId,branchId,roomLayout]=args;

        // 检查顾客是否存在
        const customer=transaction.getManager(customerManager).getOneAccountByID(customerId);
        if(customer==undefined){
            return this.packageResult(false,null,"顾客不存在");
        }

        // 检查分支是否存在
        const branch=transaction.getManager(branchManager).getOneAccountByID(branchId);
        if(branch==undefined){
            return this.packageResult(false,null,"分支不存在");
        }

        if(transaction.getManager(allReservationManager)
            .getOneManagerByBranchId(branchId)===undefined){
            return this.packageResult(false,null,"该分店对应的预定管理器不存在");
        }

        //根据输入的数据创建房间布局
        const requireRoomLayout=new RoomLayout(roomLayout.area,roomLayout.windowBool,
            new BedInRoom(roomLayout.typeString,roomLayout.numId));

        //创建预约订单
        const newReservation=reservationFactory(customerId,branchId,requireRoomLayout);

        //向分店预约管理类添加预约订单
        transaction.getManager(allReservationManager)
            .getOneManagerByBranchId(branchId)
            .addNewReservation(newReservation);

        //记录下这个变更
        this.changeDatabase('insert',newReservation);
            
        return this.packageResult(true,newReservation,"预订成功");
    }
}

module.exports=customerReservateTransaction;