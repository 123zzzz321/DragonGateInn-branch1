const SingletonFactory=require('../../../util/SingletonFactory');

const customerReservateTransaction=require('../../../transaction/reservationTransaction/customerReservateTransaction');
const cancelReservationTransaction=require('../../../transaction/reservationTransaction/cancelReservationTransaction');
const confirmReservationTransaction=require('../../../transaction/reservationTransaction/confirmReservationTransaction');
const customerRegisterTransaction=require('../../../transaction/accountTransaction/registerTransaction/customerRegisterTransaction');
const branchRegisterTransaction=require('../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');
const branchAddDisplayRoomTransaction=require('../../../transaction/displayRoomTransaction/branchAddDisplayRoomTransaction');

const {displayRoom}=require('../../../branchResource/displayRoom/displayRoom');
const {RoomLayout,BedInRoom}=require('../../../branchResource/room/room');

const allReservationManager=require('../../../branchResource/reservation/allReservationManager');

const {reservationState}=require('../../../branchResource/reservation/reservation');
const reservateByDisplayRoomTransaction=require('../../../transaction/reservationTransaction/reservateByDisplayRoomTransaction');

const {recordDataChangeManager}=require('../../../global/betweenMemoryDatabase/RecordDataChange/recordDataChange');

describe('顾客的预订房间事务',()=>{
    it('顾客的预订房间事务的执行',()=>{
        let newCustomerRegisterTransaction=new customerRegisterTransaction();
        const customerId=newCustomerRegisterTransaction.execute('138000000000','123456').resultContent.getID();

        let newBranchRegisterTransaction=new branchRegisterTransaction();
        const branchId=newBranchRegisterTransaction.execute().resultContent.getID();

        let newCustomerReservateTransaction=new customerReservateTransaction();
        const reservation=newCustomerReservateTransaction.execute(customerId,branchId,
        {area:100,windowBool:true,typeString:'double',numId:1}).resultContent;
        
        expect(SingletonFactory.getInstance(allReservationManager).getAllObjectList()).toContain(reservation);
       
    })

    it('顾客通过展出房间列表来预定',async()=>{
       

        let newCustomerRegisterTransaction=new customerRegisterTransaction();
        const customerId=newCustomerRegisterTransaction.execute('138000000012','123456').resultContent.getID();

        let newBranchRegisterTransaction=new branchRegisterTransaction();
        const branchId=newBranchRegisterTransaction.execute().resultContent.getID();

        const dispalyTransaction=new branchAddDisplayRoomTransaction();
        const newDisplayRoom= dispalyTransaction.execute(branchId,  
            {area:100,windowBool:true,typeString:'double',numId:1},1000000).resultContent;
        

        const reservateTransaction=new reservateByDisplayRoomTransaction();
        const reservation=await reservateTransaction.execute(branchId,customerId,newDisplayRoom.getID()).resultContent;

       

        expect(SingletonFactory.getInstance(allReservationManager).getAllObjectList()).toContain(reservation);

    })

    it('顾客的取消房间事务的执行',()=>{
        // 注册顾客和分店
        let newCustomerRegisterTransaction=new customerRegisterTransaction();
        const customerId=newCustomerRegisterTransaction.execute('138100000000','123456').resultContent.getID();

        let newBranchRegisterTransaction=new branchRegisterTransaction();
        const branchId=newBranchRegisterTransaction.execute().resultContent.getID();

        //创建预约订单
        let newCustomerReservateTransaction=new customerReservateTransaction();
        const reservation=newCustomerReservateTransaction.execute(customerId,branchId,
        {area:100,windowBool:true,typeString:'double',numId:1}).resultContent;

        
        let newCustomerCancelTransaction=new cancelReservationTransaction();
        newCustomerCancelTransaction.execute(reservation.getID());
        expect(SingletonFactory.getInstance(allReservationManager).getAllObjectList()
            .find(object=>object.getID()==reservation.getID())  
            .getState())
            .toBe(reservationState.state.canceled);
    })

     it('确认预约订单事务的执行',()=>{
        // 注册顾客和分店
        let newCustomerRegisterTransaction=new customerRegisterTransaction();
        const customerId=newCustomerRegisterTransaction.execute('138200000000','123456').resultContent.getID();

        let newBranchRegisterTransaction=new branchRegisterTransaction();
        const branchId=newBranchRegisterTransaction.execute().resultContent.getID();

        //创建预约订单
        let newCustomerReservateTransaction=new customerReservateTransaction();
        const reservation=newCustomerReservateTransaction.execute(customerId,branchId,
        {area:100,windowBool:true,typeString:'double',numId:1}).resultContent;

        
        let newCustomerConfirmTransaction=new confirmReservationTransaction();
        newCustomerConfirmTransaction.execute(reservation.getID());

        expect(SingletonFactory.getInstance(allReservationManager).getAllObjectList()
            .find(object=>object.getID()==reservation.getID())  
            .getState())
            .toBe(reservationState.state.confirmed);
    })
})
