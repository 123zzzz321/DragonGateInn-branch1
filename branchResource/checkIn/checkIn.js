const assert=require('assert');
const randomGenerator=require('../../util/randomIdGenerator');

/**
 * 入住人员
 */
class person{
    constructor(name,identityCard)
    {
        /**
         * 真实姓名
         */
        this.name=name;
        /**
         * 身份证号
         */
        this.identityCard=identityCard;
    }
}

const randomCheckInIdGenerator=new randomGenerator();

/**
 * 入住类
 */
class checkIn{
    constructor(checkInId){
        this.Id=checkInId;

        /**
         * 入住订单的编号,可以为空，表示这个顾客没有预约直接到酒店里入住
         */
        this.reservationId=null;
        //如果从数据库中读取数据的入住订单的编号，就占用这个编号
        randomCheckInIdGenerator.occupyId(this.Id);

        /**
         * 入住订单所属的店的编号
         */
        this.branchId=null;

        /**
         * 入住的日期
         */
        this.checkInDate=new Date();

        /**
         * 退房的日期（如果日期还没定义，那么说明这个顾客还没有退房）
         */
        this.checkOutDate=null;

        /**
         * 入住房间的的编号
         */
        this.roomId=null;

        /**
         * 入住人员的真实信息
         */
        this.personList=[];

        /**
         * 入住人员总消费金额
         */
        this.consumeNumber=0;
    }

    getID(){
        return this.Id;
    }

    /**
     * 设置入住订单的房间编号和入住人员的真实信息
     * @param {string} roomId 入住房间的编号
     * @param {person} person 入住人员的真实信息
     */
    setCheckInData(branchId,roomId,persons,connectReservationId=null){
        this.branchId=branchId;
        this.roomId=roomId;
        this.personList=persons;
        this.reservationId=connectReservationId;
    }

    getBranchId()
    {
        return this.branchId;
    }

    setRoomId(roomId){
        this.roomId=roomId;
    }

    getRoomId(){
        return this.roomId;
    }

    setPerson(person){
        this.personList=person;
    }

    getPerson(){
        return this.personList;
    }

    getReservationId(){
        return this.reservationId;
    }

    /**
     * 入住人员的消费记录在其入住记录上
     */
    addConsumeNumber(consumeNumber){
        this.consumeNumber+=consumeNumber;
    }

    getConsumeNumber(){
        return this.consumeNumber;
    }

    getCheckInDate(){
        return this.checkInDate;
    }

    getCheckOutDate(){
        return this.checkOutDate;
    }

    /**
     * 设置退房日期为当前日期
     */
    setCheckOutDateAsNow(){
        this.checkOutDate=new Date();
    }

    getIsCheckedOut(){
        return this.checkOutDate!==null;
    }
}



/**
 * 入住订单的工厂函数
 * @param {string} roomId 入住房间的编号
 * @param {person} person 入住人员的真实信息
 * @param {string} connectReservationId 入住订单的编号,可以为空，表示这个顾客没有预约直接到酒店里入住
 * @returns {checkIn} 入住订单对象
 */
function checkInFactory(branchId,roomId,persons,connectReservationId=null){
    assert(branchId!==null,'branchId is null');
    assert(roomId!==null,'roomId is null');
    assert(persons instanceof Array,'person is not a person array');

    persons.forEach((item)=>{
        assert(item instanceof person,'person is not a person');
    });

    const newCheckIn=new checkIn(randomCheckInIdGenerator.generateId());
    newCheckIn.setCheckInData(branchId,roomId,persons,connectReservationId);
    return newCheckIn;
}

module.exports={
 person,
 checkIn,
 checkInFactory
}   
