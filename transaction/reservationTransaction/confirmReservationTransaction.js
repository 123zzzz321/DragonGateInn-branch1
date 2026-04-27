const assert=require('assert');

const transaction=require('../transaction')

const allReservationManager = require('../../branchResource/reservation/allReservationManager');


/**
 * 顾客确认预约订单的事务
 */
class confirmReservationTransaction extends transaction{
    constructor(){
        super()
    }

    /**
     * 执行确认预约订单事务
     * @param {...any} args 确认预约订单事务的参数
     * @returns {any} 确认结果
     */
    execute(...args){
        super.execute(...args);
        // 执行确认预约订单事务
        const [reservationId]=args;
        assert(typeof reservationId==="string","预约订单ID必须是字符串");

        // 检查预约订单是否存在
        const reservation=transaction.getManager(allReservationManager)
            .getAllObjectList()
            .find(reservation=>reservation.getID()==reservationId);

        if(reservation==undefined){
            return this.packageResult(false,null,"预约订单不存在");
        }
        
        // 确认预约订单
        reservation.confirm();

        this.changeDatabase('update',reservation);
        return this.packageResult(true,null,"确认成功");
    }
}

module.exports=confirmReservationTransaction;
