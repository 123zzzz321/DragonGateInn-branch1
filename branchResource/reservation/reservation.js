const assert=require('assert');
const { RoomLayout } = require('../room/room');
const randomGenerator=require('../../util/randomIdGenerator');


/**
 * 预约订单的编号生成器
 */
const randomReservationIdGenerator=new randomGenerator();
/**
 * 预约订单的状态类
 */
class reservationState{
    constructor(){
        
        /**
         * 预约订单的状态
         */
        this.state=reservationState.state.pending;
    }

    /**
     * 返回预约订单的状态
     * @returns {string} 预约订单的状态
     */
    getState(){
        return this.state;
    }

    setState(stateString){
        if(stateString ==="pending"){
            this.state=reservationState.state.pending;
        }
        else if(stateString ==="confirmed"){
            this.state=reservationState.state.confirmed;
        }
        else if(stateString ==="canceled"){
            this.state=reservationState.state.canceled;
        }
        else{
            throw new Error("预约订单的状态错误");
        }
    }

    /**
     * 改变预约订单的状态为已取消
     */
    changeToCanceled(){
        this.state=reservationState.state.canceled;
    }
    /**
     * 改变预约订单的状态为已确认
     */
    changeToConfirmed(){
        this.state=reservationState.state.confirmed;
    }
}

//预约订单的状态
reservationState.state = {
    //顾客发起了提交，但是没有主动取消，也没有到酒店入住
    pending:'pending',
    //顾客到酒店分店入住，也就是分店接受了顾客的预约
    confirmed:'confirmed',
    //顾客或者酒店分店取消了预约
    canceled:'canceled'
};
/**
 * 预约订单类
 */
class reservation{
    constructor(reservationIdString){
        /**
         * 预约订单的编号
         */
        this.reservationIdString=reservationIdString;
        //如果从数据库中读取数据的预约订单的编号，就占用这个编号
        randomReservationIdGenerator.occupyId(this.reservationIdString);

        this.createReservationDate=new Date();
        
        /**
         * 预约订单的状态,创建预约之后，默认就是pending
         */
        this.state=new reservationState();
    
        /**
         * 预约订单的顾客的编号
         */
        this.customerIdString='';
        /**
         * 预约订单的分店的编号
         */
        this.branchIdString='';
        /**
         * 预约订单的房间布局
         */
        this.roomLayout=null;

    }
    /**
     * 返回预约订单的编号
     * @returns {string} 预约订单的编号
     */
    getID(){
        return this.reservationIdString;
    }

    /**
     * 返回预约订单的状态
     * @returns {string} 预约订单的状态
     */
    getState(){
        return this.state.getState();
    }

    /**
     * 返回预约订单的顾客的编号
     * @returns {string} 预约订单的顾客的编号
     */
    getCustomerId(){
        return this.customerIdString;
    }
    /**
     * 返回预约订单的分店的编号
     * @returns {string} 预约订单的分店的编号
     */
    getBranchId(){
        return this.branchIdString;
    }
    /**
     * 返回预约订单的房间布局
     * @returns {Array} 预约订单的房间布局
     */
    getRoomLayout(){
        return this.roomLayout;
    }

    getcreateReservationDate(){
        return this.createReservationDate;
    }

    /**
     * 设置预约订单的顾客的编号，分店的编号，房间布局
     * @param {string} customerIdString 预约订单的顾客的编号
     * @param {string} branchIdString 预约订单的分店的编号
     * @param {Array} roomLayout 预约订单的房间布局
     */
    setReservationData(customerIdString,branchIdString,roomLayout){
        assert(typeof customerIdString==='string');
        assert(typeof branchIdString==='string');
        assert(roomLayout instanceof RoomLayout);

        this.customerIdString=customerIdString;
        this.branchIdString=branchIdString;
        this.roomLayout=roomLayout;
    }
    
    /**
     * 确认预约订单
     */
    confirm(){
        this.state.changeToConfirmed();
    }

    /**
     * 取消预约订单
     */
    cancel(){
        this.state.changeToCanceled();
    }
}

/**
 * 预约订单的工厂函数   
 * @param {string} customerIdString 预约订单的顾客的编号
 * @param {string} branchIdString 预约订单的分店的编号
 * @param {RoomLayout} roomLayout 预约订单的房间布局
 * @returns {reservation} 预约订单对象
 */
function reservationFactory(customerIdString,branchIdString,roomLayout){
    const newReservation=new reservation(randomReservationIdGenerator.generateId());
    newReservation.setReservationData(customerIdString,branchIdString,roomLayout);
    return newReservation;
}

module.exports.reservationState=reservationState;
module.exports.reservation=reservation;
module.exports.reservationFactory=reservationFactory;
