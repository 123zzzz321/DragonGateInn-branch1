"use strict";

var createCheckInTransaction = require('../../../transaction/checkInTransaction/createCheckInTransaction');

var branchRegisterTransaction = require('../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');

var checkoutTransaction = require('../../../transaction/checkInTransaction/checkoutTransaction');

var addConsumeTransaction = require('../../../transaction/checkInTransaction/addConsumeTransaction');

var SingletonFactory = require('../../../util/SingletonFactory');

var _require = require('../../../branchResource/room/room.js'),
    room = _require.room;

var _require2 = require('../../../branchResource/checkIn/checkIn.js'),
    person = _require2.person;

var allRoomManager = require('../../../branchResource/room/allRoomManager');

var allCheckInManager = require('../../../branchResource/checkIn/allCheckInManager');

describe('createCheckInTransaction', function () {
  it('createCheckInTransaction', function () {
    var newBranchRegisterTransaction = new branchRegisterTransaction();
    var newBranchAccount = newBranchRegisterTransaction.execute().resultContent;
    SingletonFactory.getInstance(allRoomManager).getOneManagerByBranchId(newBranchAccount.getID()).addRoom(new room("testRoom"));
    var curCreateCheckInTransaction = new createCheckInTransaction();
    var newCheckIn = curCreateCheckInTransaction.execute(newBranchAccount.getID(), 'testRoom', [new person('name1', 'id1')]).resultContent;
    expect(SingletonFactory.getInstance(allCheckInManager).getOneManagerByBranchId(newBranchAccount.getID()).getOneObjectById(newCheckIn.getID())).toBe(newCheckIn);
    var curAddConsumeTransaction = new addConsumeTransaction();
    curAddConsumeTransaction.execute(newCheckIn.getID(), 100);
    expect(SingletonFactory.getInstance(allCheckInManager).getOneManagerByBranchId(newBranchAccount.getID()).getOneObjectById(newCheckIn.getID()).getConsumeNumber()).toBe(100);
    var curCheckoutTransaction = new checkoutTransaction();
    curCheckoutTransaction.execute(newCheckIn.getID());
    expect(SingletonFactory.getInstance(allCheckInManager).getOneManagerByBranchId(newBranchAccount.getID()).getOneObjectById(newCheckIn.getID()).getIsCheckedOut()).toBe(true);
  });
});