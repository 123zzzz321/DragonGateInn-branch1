const createCheckInTransaction=require('../../../transaction/checkInTransaction/createCheckInTransaction');
const branchRegisterTransaction=require('../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');
const checkoutTransaction=require('../../../transaction/checkInTransaction/checkoutTransaction');
const addConsumeTransaction=require('../../../transaction/checkInTransaction/addConsumeTransaction');

const SingletonFactory=require('../../../util/SingletonFactory');
const { room } = require('../../../branchResource/room/room.js');
const {person}=require('../../../branchResource/checkIn/checkIn.js')
const allRoomManager=require('../../../branchResource/room/allRoomManager');
const allCheckInManager=require('../../../branchResource/checkIn/allCheckInManager');

const {recordDataChangeManager}=require('../../../global/betweenMemoryDatabase/RecordDataChange/recordDataChange')


describe('createCheckInTransaction',()=>{
    it('createCheckInTransaction',async()=>{


        const newBranchRegisterTransaction=new branchRegisterTransaction();
        const newBranchAccount= newBranchRegisterTransaction.execute().resultContent;

        SingletonFactory.getInstance(allRoomManager)
            .getOneManagerByBranchId(newBranchAccount.getID())
            .addRoom(new room("testRoom"));

        const curCreateCheckInTransaction=new createCheckInTransaction();
        const newCheckIn=
             curCreateCheckInTransaction.execute(newBranchAccount.getID(),'testRoom',[new person('name1','id1')])
             .resultContent;
        expect(SingletonFactory.getInstance(allCheckInManager)
            .getOneManagerByBranchId(newBranchAccount.getID())
            .getOneObjectById(newCheckIn.getID()))
            .toBe(newCheckIn);

        const curAddConsumeTransaction=new addConsumeTransaction();
        curAddConsumeTransaction.execute(newCheckIn.getID(),100);
        expect(SingletonFactory.getInstance(allCheckInManager)
            .getOneManagerByBranchId(newBranchAccount.getID())
            .getOneObjectById(newCheckIn.getID())
            .getConsumeNumber()).toBe(100);
        
        const curCheckoutTransaction=new checkoutTransaction();
        curCheckoutTransaction.execute(newCheckIn.getID());
        expect(SingletonFactory.getInstance(allCheckInManager)
            .getOneManagerByBranchId(newBranchAccount.getID())
            .getOneObjectById(newCheckIn.getID())
            .getIsCheckedOut()).toBe(true);

       
    })
})
