const assert=require('assert');

const transaction=require('../transaction')

const allReservationManager = require('../../branchResource/reservation/allReservationManager');


/**
 * 顾客取消房间的事务
 */
class concelReservationTransaction extends transaction{
    constructor(){
        super()
    }

    /**
     * 执行取消房间事务
     * @param {...any} args 顾客的取消房间事务的参数
     * @returns {any} 取消结果
     */
    execute(...args){
        super.execute(...args);
        // 执行取消房间事务
        const [reservationId]=args;
        assert(typeof reservationId==="string","预约订单ID必须是字符串");

        // 检查预约订单是否存在
        const reservation=transaction.getManager(allReservationManager)
            .getAllObjectList()
            .find(reservation=>reservation.getID()==reservationId);

        if(reservation==undefined){
            return this.packageResult(false,null,"预约订单不存在");
        }

        reservation.cancel();

        this.changeDatabase('update',reservation);
        return this.packageResult(true,null,"取消成功");
    }
}

module.exports=concelReservationTransaction;
