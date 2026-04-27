const convertTypeToDBRow = require('../../db/ConvertTypBetweenDBRow/convertTypeToDBRow');


const branchAccount = require('../../account/branchAccount');
const customerAccount = require('../../account/customerAccount');
const headquarterAccount = require('../../account/headquarterAccount');

const {checkIn,person,checkInFactory}=require('../../branchResource/checkIn/checkIn');
const {reservationState,reservation,reservationFactory}=require('../../branchResource/reservation/reservation');
const {room,RoomLayout,BedInRoom}=require('../../branchResource/room/room');
const activeState = require('../../util/activeState');

const convertManager = new convertTypeToDBRow();

describe('convertTypeToDBRow',()=>{
    it('should register activeState converter',()=>{

        const newActiveState = new activeState(true);
        const dbRow = convertManager.convert(newActiveState);
        expect(dbRow).toEqual(1);
    })


    it('should convert branch account to db row',()=>{
       const newBranchAccount = new branchAccount('101','123456');
       const dbRow = convertManager.convert(newBranchAccount);
       
       expect(dbRow).toEqual({
           ID: '101',
           PASSWORD: '123456',
           ACTIVESTATE: 1,
       });
    });
    it('should convert headquarter account to db row',()=>{
       const newHeadquarterAccount = new headquarterAccount('101','123456');
       const dbRow = convertManager.convert(newHeadquarterAccount);
       
       expect(dbRow).toEqual({
           ID: '101',
           PASSWORD: '123456',
           ACTIVESTATE: 1,
       });
    });
    it('should convert customer account to db row',()=>{
       const newCustomerAccount = new customerAccount('101','123456','13800000000');
       const dbRow = convertManager.convert(newCustomerAccount);
       
       expect(dbRow).toEqual({
           ID: '101',
           PASSWORD: '123456',
           PHONE: '13800000000',
           ACTIVESTATE: 1,
       });
    });

    it('should convert checkIn to db row',()=>{
       const newCheckIn = checkInFactory('branch1','roomId1',[new person('name1','id1')]);
       const dbRow = convertManager.convert(newCheckIn);
       
       expect(dbRow).toEqual({
           ID: newCheckIn.getID(),
           BRANCHID: 'branch1',
           ROOMID: 'roomId1',
           PERSON: "[{\"name\":\"name1\",\"identityCard\":\"id1\"}]",
           CHECKINDATE: newCheckIn.getCheckInDate().toISOString(),
           CHECKOUTDATE: newCheckIn.getCheckOutDate(),
           CONSUMENUMBER: 0,
           RESERVATIONID:null,
       });
    });

    it('should convert reservation to db row',()=>{
       const newReservation = reservationFactory('customer1','branch1',
            new RoomLayout(24,true,new BedInRoom('单人床',1)));
       const dbRow = convertManager.convert(newReservation);
       
       expect(dbRow).toEqual({
            ID: newReservation.getID(),
            CREATERESERVATIONDATE: newReservation.getcreateReservationDate().toISOString(),
            BRANCHID: 'branch1',
            CUSTOMERID:'customer1',
            ROOMLAYOUT_AREAREAL: 24,
            ROOMLAYOUT_BEDTYPE_NUMINT: 1,
            ROOMLAYOUT_BEDTYPE_TYPESTRING: "单人床",
            ROOMLAYOUT_WINDOWBOOL: 1,
            RESERVATIONSTATE: "pending",
       });
    });

    it('should convert room ',()=>{
        const newRoom = new room('101','branch1');
        const dbRow = convertManager.convert(newRoom);
        
        expect(dbRow).toEqual({
            ID: '101',
            BRANCHID: 'branch1',
            ROOMLAYOUT_AREAREAL: 0,
            ROOMLAYOUT_WINDOWBOOL: 0,
            ROOMLAYOUT_BEDTYPE_TYPESTRING: "单人床",
            ROOMLAYOUT_BEDTYPE_NUMINT: 1,
            ACTIVESTATE: 1,
            ISEMPTYBOOL: 1,
            PRICEREAL: 0,
        });
    });
});
