"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var assert = require('assert');

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

var convertDBRowToType =
/*#__PURE__*/
function () {
  function convertDBRowToType() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, convertDBRowToType);

    this.converters = new Map();
    this.flattenArrays = options.flattenArrays;
    this.dateFormat = options.dateFormat || 'datetime';

    this._registerDefaultConverters();
  }

  _createClass(convertDBRowToType, [{
    key: "_registerDefaultConverters",
    value: function _registerDefaultConverters() {
      this.registerConverter('activeState', function (instance) {
        return instance.getActiveBool() ? 1 : 0;
      });
    }
  }, {
    key: "registerConverter",
    value: function registerConverter(className, converterFn) {
      assert(typeof className === 'string', 'className must be a string');
      assert(typeof converterFn === 'function', 'converterFn must be a function');
      this.converters.set(className, converterFn);
    }
  }]);

  return convertDBRowToType;
}();