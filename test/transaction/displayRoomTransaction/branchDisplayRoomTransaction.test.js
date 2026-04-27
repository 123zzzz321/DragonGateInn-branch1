const branchAddDisplayRoomTransaction=require('../../../transaction/displayRoomTransaction/branchAddDisplayRoomTransaction');
const branchDisableDisplayRoomTransaction=require('../../../transaction/displayRoomTransaction/branchDisableDisplayRoomTransaction');
const branchEnableDisplayRoomTransaction=require('../../../transaction/displayRoomTransaction/branchEnableDisplayRoomTransaction');

const { displayRoom } = require('../../../branchResource/displayRoom/displayRoom');
const { RoomLayout, BedInRoom } = require('../../../branchResource/room/room');
const SingletonFactory = require('../../../util/SingletonFactory');
const allDisplayRoomManager=require('../../../branchResource/displayRoom/allDisplayRoomManager');

const branchRegisterTransaction=require('../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');
const {recordDataChangeManager}=require('../../../global/betweenMemoryDatabase/RecordDataChange/recordDataChange')

describe('分店可以进行的展示房间事务',()=>{
    it('添加展示房间',async()=>{

        const registerTransaction=new branchRegisterTransaction();
        const newBranchAccount= registerTransaction.execute().resultContent;

        const transaction=new branchAddDisplayRoomTransaction();
        const newDisplayRoom= transaction.execute(newBranchAccount.getID(),  
            {area:100,windowBool:true,typeString:'double',numId:1},1000000).resultContent;


        expect(SingletonFactory.getInstance(allDisplayRoomManager).getAllObjectList().length).toBe(1);

        expect(SingletonFactory.getInstance(allDisplayRoomManager)
                .getOneDisplayRoomById(newBranchAccount.getID(), newDisplayRoom.getID()))
                .toBe(newDisplayRoom);
    });

    it('下架展示房间',async()=>{
        
        const registerTransaction=new branchRegisterTransaction();
        const newBranchAccount= registerTransaction.execute().resultContent;

        const addTransaction=new branchAddDisplayRoomTransaction();
        const newDisplayRoom= addTransaction.execute(newBranchAccount.getID(),  
            {area:100,windowBool:true,typeString:'double',numId:1},1000000).resultContent;

        const disableTransaction=new branchDisableDisplayRoomTransaction();
        disableTransaction.execute(newBranchAccount.getID(), newDisplayRoom.getID());


        expect(SingletonFactory.getInstance(allDisplayRoomManager)
                .getOneDisplayRoomById(newBranchAccount.getID(), newDisplayRoom.getID())
                .getActiveState()
                .getActiveBool())
                .toBe(false);
    });

    it('重新上架展示房间',async()=>{

        const registerTransaction=new branchRegisterTransaction();
        const newBranchAccount= registerTransaction.execute().resultContent;

        
        const addTransaction=new branchAddDisplayRoomTransaction();
        const newDisplayRoom= addTransaction.execute(newBranchAccount.getID(),  
            {area:100,windowBool:true,typeString:'double',numId:1},1000000).resultContent;

        // 先下架
        const disableTransaction=new branchDisableDisplayRoomTransaction();
        disableTransaction.execute(newBranchAccount.getID(), newDisplayRoom.getID());


        expect(SingletonFactory.getInstance(allDisplayRoomManager)
                .getOneDisplayRoomById(newBranchAccount.getID(), newDisplayRoom.getID())
                .getActiveState()
                .getActiveBool())
                .toBe(false);

        // 再上架
        const enableTransaction=new branchEnableDisplayRoomTransaction();
        enableTransaction.execute(newBranchAccount.getID(), newDisplayRoom.getID());

        expect(SingletonFactory.getInstance(allDisplayRoomManager)
                .getOneDisplayRoomById(newBranchAccount.getID(), newDisplayRoom.getID())
                .getActiveState()
                .getActiveBool())
                .toBe(true);
    });
});