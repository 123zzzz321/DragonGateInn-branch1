"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DatabaseAccessLayer = require('../DatabaseAccessLayer');

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
    roomLayout = _require3.roomLayout,
    bedInRoom = _require3.bedInRoom;

var convertTypeToDBRow = function convertTypeToDBRow() {
  _classCallCheck(this, convertTypeToDBRow);
};