"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var util = require('util');

var DatabaseAccessLayer = require('./DatabaseAccessLayer');

var oracledb = require('oracledb'); // 直接导入，不再使用try-catch
// Oracle数据库访问实现类


var OracleAccessLayer =
/*#__PURE__*/
function (_DatabaseAccessLayer) {
  _inherits(OracleAccessLayer, _DatabaseAccessLayer);

  /**
   * 构造函数
   * @param {Object} config - 数据库连接配置
   */
  function OracleAccessLayer(config) {
    _classCallCheck(this, OracleAccessLayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(OracleAccessLayer).call(this, config));
  }
  /**
   * 连接数据库
   * @returns {Promise} 连接结果
   */


  _createClass(OracleAccessLayer, [{
    key: "connect",
    value: function connect() {
      return regeneratorRuntime.async(function connect$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              console.log('Oracle数据库连接中...');
              _context.next = 4;
              return regeneratorRuntime.awrap(oracledb.getConnection({
                user: this.config.user,
                password: this.config.password,
                connectString: this.config.connectString
              }));

            case 4:
              this.connection = _context.sent;
              console.log('Oracle数据库连接成功');
              return _context.abrupt("return", true);

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);
              console.error('Oracle数据库连接失败:', _context.t0);
              throw _context.t0;

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 9]]);
    }
    /**
     * 断开数据库连接
     * @returns {Promise} 断开结果
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      return regeneratorRuntime.async(function disconnect$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;

              if (!this.connection) {
                _context2.next = 7;
                break;
              }

              console.log('Oracle数据库断开连接中...');
              _context2.next = 5;
              return regeneratorRuntime.awrap(this.connection.close());

            case 5:
              this.connection = null;
              console.log('Oracle数据库断开连接成功');

            case 7:
              return _context2.abrupt("return", true);

            case 10:
              _context2.prev = 10;
              _context2.t0 = _context2["catch"](0);
              console.error('Oracle数据库断开连接失败:', _context2.t0);
              throw _context2.t0;

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[0, 10]]);
    }
    /**
     * 检查并确保数据库连接
     * @returns {Promise} 连接结果
     */

  }, {
    key: "ensureConnection",
    value: function ensureConnection() {
      return regeneratorRuntime.async(function ensureConnection$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (this.connection) {
                _context3.next = 3;
                break;
              }

              _context3.next = 3;
              return regeneratorRuntime.awrap(this.connect());

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
    /**
     * 从表中读取所有列信息（包括列名和类型）
     * @param {string} tableName - 表名
     * @returns {Promise<Array>} 列信息数组
     */

  }, {
    key: "getTableColumnInfos",
    value: function getTableColumnInfos(tableName) {
      var result;
      return regeneratorRuntime.async(function getTableColumnInfos$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return regeneratorRuntime.awrap(this.ensureConnection());

            case 3:
              console.log("\u83B7\u53D6\u8868".concat(tableName, "\u7684\u6240\u6709\u5217\u4FE1\u606F"));
              _context4.next = 6;
              return regeneratorRuntime.awrap(this.connection.execute("SELECT column_name, data_type \n                 FROM user_tab_columns \n                 WHERE table_name = UPPER(:tableName)", {
                tableName: tableName
              }));

            case 6:
              result = _context4.sent;
              return _context4.abrupt("return", result.rows.map(function (row) {
                return {
                  name: row[0],
                  type: row[1]
                };
              }));

            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](0);
              console.error('获取表列信息失败:', _context4.t0);
              throw _context4.t0;

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this, [[0, 10]]);
    }
    /**
     * 从表中读取所有行数据
     * @param {string} tableName - 表名
     * @returns {Promise<Array>} 行数据数组
     */

  }, {
    key: "getTableAllRows",
    value: function getTableAllRows(tableName) {
      var result;
      return regeneratorRuntime.async(function getTableAllRows$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return regeneratorRuntime.awrap(this.ensureConnection());

            case 3:
              console.log("\u83B7\u53D6\u8868".concat(tableName, "\u7684\u6240\u6709\u884C\u6570\u636E"));
              _context5.next = 6;
              return regeneratorRuntime.awrap(this.connection.execute("SELECT * FROM ".concat(tableName)));

            case 6:
              result = _context5.sent;
              return _context5.abrupt("return", result.rows);

            case 10:
              _context5.prev = 10;
              _context5.t0 = _context5["catch"](0);
              console.error('获取表行数据失败:', _context5.t0);
              throw _context5.t0;

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this, [[0, 10]]);
    }
    /**
     * 向表中写入数据
     * @param {string} tableName - 表名
     * @param {Object} data - 要写入的数据
     * @returns {Promise<number>} 影响的行数
     */

  }, {
    key: "insertData",
    value: function insertData(tableName, data) {
      var columns, placeholders, sql, result;
      return regeneratorRuntime.async(function insertData$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return regeneratorRuntime.awrap(this.ensureConnection());

            case 3:
              console.log("\u5411\u8868".concat(tableName, "\u63D2\u5165\u6570\u636E:"), data); // 构建INSERT语句

              columns = Object.keys(data);
              placeholders = columns.map(function (_, index) {
                return ":".concat(index + 1);
              });
              sql = "INSERT INTO ".concat(tableName, " (").concat(columns.join(', '), ") \n                        VALUES (").concat(placeholders.join(', '), ")");
              _context6.next = 9;
              return regeneratorRuntime.awrap(this.connection.execute(sql, Object.values(data), {
                autoCommit: true
              }));

            case 9:
              result = _context6.sent;
              return _context6.abrupt("return", result.rowsAffected || 1);

            case 13:
              _context6.prev = 13;
              _context6.t0 = _context6["catch"](0);
              console.error('插入数据失败:', _context6.t0);
              throw _context6.t0;

            case 17:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this, [[0, 13]]);
    }
    /**
     * 构建UPDATE语句的SET子句
     * @param {Object} data - 要修改的数据
     * @param {Object} condition - 条件
     * @returns {Object} SET和WHERE子句对象
     */

  }, {
    key: "createUpdateClause",
    value: function createUpdateClause(data, condition) {
      // 构建UPDATE语句
      var setClause = Object.keys(data).map(function (key, index) {
        return "".concat(key, " = :").concat(index + 1);
      }).join(', ');
      var whereClause = Object.keys(condition).map(function (key, index) {
        return "".concat(key, " = :").concat(Object.keys(data).length + index + 1);
      }).join(' AND ');
      return {
        setClause: setClause,
        whereClause: whereClause
      };
    }
    /**
     * 修改表中的数据
     * @param {string} tableName - 表名
     * @param {Object} data - 要修改的数据
     * @param {Object} condition - 条件
     * @returns {Promise<number>} 影响的行数
     */

  }, {
    key: "updateData",
    value: function updateData(tableName, data, condition) {
      var sql, result;
      return regeneratorRuntime.async(function updateData$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return regeneratorRuntime.awrap(this.ensureConnection());

            case 3:
              console.log("\u66F4\u65B0\u8868".concat(tableName, "\u7684\u6570\u636E:"), data, '条件:', condition);
              sql = "UPDATE ".concat(tableName, " \n                        SET ").concat(this.createUpdateClause(data, condition).setClause, " \n                        WHERE ").concat(this.createUpdateClause(data, condition).whereClause);
              _context7.next = 7;
              return regeneratorRuntime.awrap(this.connection.execute(sql, [].concat(_toConsumableArray(Object.values(data)), _toConsumableArray(Object.values(condition))), {
                autoCommit: true
              }));

            case 7:
              result = _context7.sent;
              return _context7.abrupt("return", result.rowsAffected || 0);

            case 11:
              _context7.prev = 11;
              _context7.t0 = _context7["catch"](0);
              console.error('更新数据失败:', _context7.t0);
              throw _context7.t0;

            case 15:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this, [[0, 11]]);
    }
    /**
    * 删除表中的数据
    * @param {string} tableName - 表名
    * @param {Object} condition - 条件
    * @returns {Promise<number>} 影响的行数
    */

  }, {
    key: "deleteData",
    value: function deleteData(tableName, condition) {
      var sql, result;
      return regeneratorRuntime.async(function deleteData$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return regeneratorRuntime.awrap(this.ensureConnection());

            case 3:
              console.log("\u5220\u9664\u8868".concat(tableName, "\u7684\u6570\u636E:"), condition);
              sql = "DELETE FROM ".concat(tableName, " \n            WHERE ").concat(this.createUpdateClause({}, condition).whereClause);
              _context8.next = 7;
              return regeneratorRuntime.awrap(this.connection.execute(sql, Object.values(condition), {
                autoCommit: true
              }));

            case 7:
              result = _context8.sent;
              return _context8.abrupt("return", result.rowsAffected || 0);

            case 11:
              _context8.prev = 11;
              _context8.t0 = _context8["catch"](0);
              console.error('删除数据失败:', _context8.t0);
              throw _context8.t0;

            case 15:
            case "end":
              return _context8.stop();
          }
        }
      }, null, this, [[0, 11]]);
    }
    /**
     * 创建表
     * @param {string} tableName - 表名
     * @param {Array} columns - 列信息数组
     * @returns {Promise} 创建结果
     */

  }, {
    key: "createTable",
    value: function createTable(tableName, columns) {
      var sql;
      return regeneratorRuntime.async(function createTable$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              _context9.next = 3;
              return regeneratorRuntime.awrap(this.ensureConnection());

            case 3:
              console.log("\u521B\u5EFA\u8868".concat(tableName, "\uFF0C\u5217\u4FE1\u606F:"), columns);
              sql = "CREATE TABLE ".concat(tableName, " (").concat(columns.map(function (col) {
                return "".concat(col.name, " ").concat(col.type);
              }).join(', '), ")");
              _context9.next = 7;
              return regeneratorRuntime.awrap(this.connection.execute(sql, {
                autoCommit: true
              }));

            case 7:
              return _context9.abrupt("return", true);

            case 10:
              _context9.prev = 10;
              _context9.t0 = _context9["catch"](0);
              console.error('创建表失败:', _context9.t0);
              throw _context9.t0;

            case 14:
            case "end":
              return _context9.stop();
          }
        }
      }, null, this, [[0, 10]]);
    }
  }]);

  return OracleAccessLayer;
}(DatabaseAccessLayer);

module.exports = OracleAccessLayer;