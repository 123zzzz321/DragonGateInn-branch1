const convertDBRowToType = require('../../db/ConvertTypBetweenDBRow/convertDBRowToType');


const branchAccount = require('../../account/branchAccount');
const customerAccount = require('../../account/customerAccount');
const headquarterAccount = require('../../account/headquarterAccount');

const {checkIn,person,checkInFactory}=require('../../branchResource/checkIn/checkIn');
const {reservationState,reservation,reservationFactory}=require('../../branchResource/reservation/reservation');
const {room,RoomLayout,BedInRoom}=require('../../branchResource/room/room');
const activeState = require('../../util/activeState');

const curConvertDBRowToType =new convertDBRowToType();

describe('convertTypeToDBRow',()=>{
    it('activeState',()=>{
        const dbRow={
            ACTIVESTATE: 1,
        }
        const result = curConvertDBRowToType.convert('activeState',dbRow);
        expect(result).toEqual(new activeState(true));
    })

    it('branchAccount',()=>{
        const dbRow={
            ID: '101',
            PASSWORD: '123456',
            ACTIVESTATE: 1,
        }
        const result = curConvertDBRowToType.convert('branchAccount',dbRow);
        expect(result).toEqual(new branchAccount('101','123456'));
    })

    it('headquarterAccount',()=>{
        const dbRow={
            ID: '101',
            PASSWORD: '123456',
            ACTIVESTATE: 1,
        }
        const result = curConvertDBRowToType.convert('headquarterAccount',dbRow);
        expect(result).toEqual(new headquarterAccount('101','123456'));
    })

    it('customerAccount',()=>{
        const dbRow={
            ID: '101',
            PASSWORD: '123456',
            PHONE: '13800000000',
            ACTIVESTATE: 1,
        }
        const result = curConvertDBRowToType.convert('customerAccount',dbRow);
        expect(result).toEqual(new customerAccount('101','123456','13800000000'));
    })

    it('should convert room to DB row',()=>{
        const dbRow={
            ID: '101',
            BRANCHID: 'branch1',
            ROOMLAYOUT_AREAREAL: 0,
            ROOMLAYOUT_WINDOWBOOL: 0,
            ROOMLAYOUT_BEDTYPE_TYPESTRING: "单人床",
            ROOMLAYOUT_BEDTYPE_NUMINT: 1,
            ACTIVESTATE: 1,
            ISEMPTYBOOL: 1,
            PRICEREAL: 0,
        }
        const roomInstance = curConvertDBRowToType.convert('room',dbRow);
        expect(roomInstance).toEqual(new room('101','branch1'));
    });

    it('checkIn',()=>{
        const dbRow={
            ID: '93328245',
            BRANCHID: 'branch1',
            ROOMID: 'roomId1',
            PERSON: "[{\"name\":\"name1\",\"identityCard\":\"id1\"}]",
            CHECKINDATE: '2023-01-01T00:00:00.000Z',
            CHECKOUTDATE: null,
            CONSUMENUMBER:0,
            RESERVATIONID:null,
        }
        const result = curConvertDBRowToType.convert('checkIn',dbRow);
        //expect(result).toEqual(checkInFactory('branch1','roomId1',[new person('name1','id1')]));
    })

    it('reservation',()=>{
        const dbRow={
            ID: '93328245',
            CREATERESERVATIONDATE:'2023-01-01T00:00:00.000Z' ,
            BRANCHID: 'branch1',
            CUSTOMERID:'customer1',
            ROOMLAYOUT_AREAREAL: 24,
            ROOMLAYOUT_BEDTYPE_NUMINT: 1,
            ROOMLAYOUT_BEDTYPE_TYPESTRING: "单人床",
            ROOMLAYOUT_WINDOWBOOL: 1,
            RESERVATIONSTATE: "pending",
        }
        const result = curConvertDBRowToType.convert('reservation',dbRow);
        // expect(result).toEqual(reservationFactory('customer1','branch1',
        //     new RoomLayout(24,true,new BedInRoom('单人床',1))));
    })

})