"use strict";

var startAccountManager = require('../../global/startManager/startAccountManager.js');

var SingletonFactory = require('../../util/SingletonFactory.js');

var OracleAccessLayer = require('../../db/OracleAccessLayer.js');

var _require = require('../../branchResource/room/room'),
    room = _require.room,
    RoomLayout = _require.RoomLayout;

var activeState = require('../../util/activeState');

describe('startAccountManager', function () {
  it('should initialize all account managers', function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
          case "end":
            return _context.stop();
        }
      }
    });
  });
});