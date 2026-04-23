const startAccountManager = require('../../../global/betweenMemoryDatabase/InitManager/InitManager.js');
const SingletonFactory = require('../../../util/SingletonFactory.js');
const OracleAccessLayer = require('../../../db/OracleAccessLayer.js');

const {room,RoomLayout} = require('../../../branchResource/room/room.js');
const activeState = require('../../../util/activeState.js');

const branchAccountManager = require('../../../accountManager/branchAccountManager.js');

const allRoomManager=require('../../../branchResource/room/allRoomManager');
const allReservationManager=require('../../../branchResource/reservation/allReservationManager');
const allCheckInManager=require('../../../branchResource/checkIn/allCheckInManager');   


describe('startAccountManager', () => {
    it('should initialize all  managers', async () => {
        await startAccountManager.initAllAccountManager();
        
        const curBranchAccountManager=SingletonFactory.getInstance(branchAccountManager);
        expect(curBranchAccountManager.getAllAccountList().length).toBe(1);

        await startAccountManager.initAllBranchResourceManager();

        expect(SingletonFactory.getInstance(allRoomManager).getAllManagers().length).toBe(1);
        expect(SingletonFactory.getInstance(allReservationManager).getAllManagers().length).toBe(1);
        expect(SingletonFactory.getInstance(allCheckInManager).getAllManagers().length).toBe(1);

     
        expect(SingletonFactory.getInstance(allCheckInManager)
            .getOneManagerByBranchId('93328245').getAllObjectList().length).toBe(1);
    });


   
});