const branchAddRoomTransaction=require('../../../transaction/roomTransaction/branchAddRoomTransaction');
const branchDisableRoomTransaction=require('../../../transaction/roomTransaction/branchDisableRoomTransaction');
const branchOccupiedRoomTransaction=require('../../../transaction/roomTransaction/branchOccupiedRoomTransaction');
const branchEmptyRoomTransaction=require('../../../transaction/roomTransaction/branchEmptyRoomTranscation');

const { room } = require('../../../branchResource/room/room');
const SingletonFactory = require('../../../util/SingletonFactory');
const allRoomManager=require('../../../branchResource/room/allRoomManager');

const {recordDataChangeManager}=require('../../../global/betweenMemoryDatabase/RecordDataChange/recordDataChange');
const branchRegisterTransaction=require('../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');

describe('分店可以进行的房间事务',()=>{
    it('添加房间',async()=>{
        const registerTransaction=new branchRegisterTransaction();
        const newBranchAccount= registerTransaction.execute().resultContent;

        const transaction=new branchAddRoomTransaction();
        const newRoom=new room('1002',newBranchAccount.getID());
        

        SingletonFactory.getInstance(allRoomManager).addNewBranchManager(newBranchAccount.getID());
        transaction.execute(newBranchAccount.getID(),newRoom);


        expect(SingletonFactory.getInstance(allRoomManager).getAllObjectList().length).toBe(1);

        expect(SingletonFactory.getInstance(allRoomManager)
                .getOneRoomById(newBranchAccount.getID(),'1002'))
                .toBe(newRoom);
    });

    it('下架房间',async()=>{
        

        const registerTransaction=new branchRegisterTransaction();
        const newBranchAccount= registerTransaction.execute().resultContent;

        const newRoom=new room('1002',newBranchAccount.getID());
        const addRoomTransaction=new branchAddRoomTransaction();
        addRoomTransaction.execute(newBranchAccount.getID(),newRoom);

        const transaction=new branchDisableRoomTransaction();
        transaction.execute(newBranchAccount.getID(),newRoom.getID());

        
        expect(SingletonFactory.getInstance(allRoomManager)
                .getOneRoomById(newBranchAccount.getID(),newRoom.getID())
                .getActiveState()
                .getActiveBool())
                .toBe(false);

    });

    it('占据空闲房间，释放被占据的房间',async()=>{

        const registerTransaction=new branchRegisterTransaction();
        const newBranchAccount= registerTransaction.execute().resultContent;

        const newRoom=new room('1002',newBranchAccount.getID());
        const addRoomTransaction=new branchAddRoomTransaction();
        addRoomTransaction.execute(newBranchAccount.getID(),newRoom);


         const occupiedTransaction=new branchOccupiedRoomTransaction();
         SingletonFactory.getInstance(allRoomManager).addNewBranchManager(newBranchAccount.getID());
         occupiedTransaction.execute(newBranchAccount.getID(),newRoom.getID());

         
         expect(SingletonFactory.getInstance(allRoomManager)
                 .getOneRoomById(newBranchAccount.getID(),newRoom.getID())
                 .getEmpty())
                 .toBe(false);
    
         const emptyTransaction=new branchEmptyRoomTransaction();
         emptyTransaction.execute(newBranchAccount.getID(),newRoom.getID());

         

         expect(SingletonFactory.getInstance(allRoomManager)
                 .getOneRoomById(newBranchAccount.getID(),newRoom.getID())
                 .getEmpty())
                 .toBe(true);
    });

   
});
