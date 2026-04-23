"use strict";

var OracleAccessLayer = require('../db/OracleAccessLayer');

describe('OracleAccessLayer', function () {
  it('should connect to Oracle database', function _callee() {
    var accessLayer;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accessLayer = new OracleAccessLayer({
              user: 'system',
              password: '123456',
              connectString: 'localhost:1521/hellooracle'
            });
            _context.next = 3;
            return regeneratorRuntime.awrap(accessLayer.connect());

          case 3:
            expect(accessLayer.connection).toBeDefined();

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  });
});