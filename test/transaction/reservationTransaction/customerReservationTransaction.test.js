const SingletonFactory=require('../../../util/SingletonFactory');

const customerReservateTransaction=require('../../../transaction/reservationTransaction/customerReservateTransaction');
const cancelReservationTransaction=require('../../../transaction/reservationTransaction/cancelReservationTransaction');
const confirmReservationTransaction=require('../../../transaction/reservationTransaction/confirmReservationTransaction');
const customerRegisterTransaction=require('../../../transaction/accountTransaction/registerTransaction/customerRegisterTransaction');
const branchRegisterTransaction=require('../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');

const allReservationManager=require('../../../branchResource/reservation/allReservationManager');

const {reservationState}=require('../../../branchResource/reservation/reservation');
describe('顾客的预订房间事务',()=>{
    it('顾客的预订房间事务的执行',()=>{
        let newCustomerRegisterTransaction=new customerRegisterTransaction();
        const customerId=newCustomerRegisterTransaction.execute('138000000000','123456').resultContent.getID();

        let newBranchRegisterTransaction=new branchRegisterTransaction();
        const branchId=newBranchRegisterTransaction.execute().resultContent.getID();

        let newCustomerReservateTransaction=new customerReservateTransaction();
        const reservation=newCustomerReservateTransaction.execute(customerId,branchId,
        {area:100,windowBool:true,bedType:{typeString:'double',numId:1}}).resultContent;
        
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
        {area:100,windowBool:true,bedType:{typeString:'double',numId:1}}).resultContent;

        
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
        {area:100,windowBool:true,bedType:{typeString:'double',numId:1}}).resultContent;

        
        let newCustomerConfirmTransaction=new confirmReservationTransaction();
        newCustomerConfirmTransaction.execute(reservation.getID());
        expect(SingletonFactory.getInstance(allReservationManager).getAllObjectList()
            .find(object=>object.getID()==reservation.getID())  
            .getState())
            .toBe(reservationState.state.confirmed);
    })
})
