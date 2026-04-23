"use strict";

var convertTypeToDBRow = require('../../db/InvertTypBetweenDBRow/convertTypeToDBRow');

var branchAccount = require('../../account/branchAccount');

var customerAccount = require('../../account/customerAccount');

var headquarterAccount = require('../../account/headquarterAccount');

var _require = require('../../branchResource/checkIn/checkIn'),
    checkIn = _require.checkIn,
    person = _require.person,
    checkInFactory = _require.checkInFactory;

var _require2 = require('../../branchResource/reservation/reservation'),
    reservationState = _require2.reservationState,
    reservation = _require2.reservation,
    reservationFactory = _require2.reservationFactory;

var _require3 = require('../../branchResource/room/room'),
    room = _require3.room,
    RoomLayout = _require3.RoomLayout,
    BedInRoom = _require3.BedInRoom;

var activeState = require('../../util/activeState');

var convertManager = new convertTypeToDBRow();
describe('convertTypeToDBRow', function () {
  it('should register activeState converter', function () {
    var newActiveState = new activeState(true);
    var dbRow = convertManager.convert(newActiveState);
    expect(dbRow).toEqual(1);
  });
  it('should convert branch account to db row', function () {
    var newBranchAccount = new branchAccount('101', '123456');
    var dbRow = convertManager.convert(newBranchAccount);
    expect(dbRow).toEqual({
      id: '101',
      password: '123456'
    });
  });
  it('should convert headquarter account to db row', function () {
    var newHeadquarterAccount = new headquarterAccount('101', '123456');
    var dbRow = convertManager.convert(newHeadquarterAccount);
    expect(dbRow).toEqual({
      id: '101',
      password: '123456'
    });
  });
  it('should convert customer account to db row', function () {
    var newCustomerAccount = new customerAccount('101', '123456', '13800000000');
    var dbRow = convertManager.convert(newCustomerAccount);
    expect(dbRow).toEqual({
      id: '101',
      password: '123456',
      phone: '13800000000'
    });
  });
  it('should convert checkIn to db row', function () {
    var newCheckIn = checkInFactory('branch1', 'roomId1', [new person('name1', 'id1')]);
    var dbRow = convertManager.convert(newCheckIn);
    expect(dbRow).toEqual({
      id: newCheckIn.getID(),
      branchId: 'branch1',
      roomId: 'roomId1',
      person: "[{\"name\":\"name1\",\"identityCard\":\"id1\"}]",
      checkInDate: newCheckIn.getCheckInDate().toISOString(),
      checkOutDate: newCheckIn.getCheckOutDate(),
      consumeNumber: 0,
      reservationId: null
    });
  });
  it('should convert reservation to db row', function () {
    var newReservation = reservationFactory('customer1', 'branch1', new RoomLayout(24, true, new BedInRoom('单人床', 1)));
    var dbRow = convertManager.convert(newReservation);
    expect(dbRow).toEqual({
      id: newReservation.getID(),
      createReservationDate: newReservation.getcreateReservationDate().toISOString(),
      branchId: 'branch1',
      customerId: 'customer1',
      roomLayout_areaReal: 24,
      roomLayout_bedType_numInt: 1,
      roomLayout_bedType_typeString: "单人床",
      roomLayout_windowBool: 1,
      state: "pending"
    });
  });
  it('should convert room ', function () {
    var newRoom = new room('101');
    var dbRow = convertManager.convert(newRoom);
    expect(dbRow).toEqual({
      id: '101',
      roomType_areaReal: 0,
      roomType_windowBool: 0,
      roomType_bedType_typeString: "单人床",
      roomType_bedType_numInt: 1,
      activeState: 1,
      isEmptyBool: 1,
      priceReal: 0
    });
  });
});