const assert = require('assert');


const branchAccount = require('../../account/branchAccount');
const customerAccount = require('../../account/customerAccount');
const headquarterAccount = require('../../account/headquarterAccount');

const {checkIn,person,checkInFactory}=require('../../branchResource/checkIn/checkIn');
const {reservationState,reservation,reservationFactory}=require('../../branchResource/reservation/reservation');
const {room,RoomLayout,BedInRoom}=require('../../branchResource/room/room');
const {displayRoom}=require('../../branchResource/displayRoom/displayRoom');
const activeState = require('../../util/activeState');

class convertTypeToDBRow{
    constructor(options = {}) {
        this.converters = new Map();
        this.flattenArrays = options.flattenArrays ;
        this.dateFormat = options.dateFormat || 'datetime';
        this._registerDefaultConverters();
    }

      /**
     * 注册类对应的构造数据库中表的各个字段
     * @param {function} classType 要构造的类型
     * @param {function} converterFn 将类型里面各个成员变量构造成对象
     */
    registerConverter(classType, converterFn) {
        assert(typeof classType === 'function', 'classType must be a constructor function');
        assert(typeof converterFn === 'function', 'converterFn must be a function');
        this.converters.set(classType, converterFn);
    }


    /**
     * 注册默认的转换器,都是项目里需要使用的，
     * 作为数据库里的一行里的字段的数据类型
     */
    _registerDefaultConverters() {
        this.registerConverter(activeState, (instance) => {
            return instance.getActiveBool() ? 1 : 0;
        });

        this.registerConverter(person, (instance) => {
            return {
                NAME: instance.name,
                IDENTITYCARD: instance.identityCard,
            };
        });

        this.registerConverter(BedInRoom, (instance) => {
            return {
                TYPESTRING: instance.typeString,
                NUMINT: instance.numInt
            };
        });

        this.registerConverter(RoomLayout, (instance) => {
            return {
                AREAREAL: instance.areaReal,
                WINDOWBOOL: instance.windowBool ? 1 : 0,
                BEDTYPE: this.convertToDBRow(instance.bedType)
            };
        });

        this.registerConverter(reservationState, (instance) => {
            return instance.getState();
        });


        this.registerConverter(branchAccount,(instance)=>{
            return{
                ID: instance.getID(),
                PASSWORD: instance.getPassword(),
                ACTIVESTATE: this.convertToDBRow(instance.getActiveState())
            };
        });

        this.registerConverter(headquarterAccount,(instance)=>{
            return{
                ID: instance.getID(),
                PASSWORD: instance.getPassword(),
                ACTIVESTATE: this.convertToDBRow(instance.getActiveState())
            };
        });

        this.registerConverter(customerAccount,(instance)=>{
            return{
                ID: instance.getID(),
                PASSWORD: instance.getPassword(),
                PHONE: instance.getPhoneString(),
                ACTIVESTATE: this.convertToDBRow(instance.getActiveState())
            };
        });

        this.registerConverter(checkIn,(instance)=>{
             return {
            ID: instance.getID(),
            BRANCHID: instance.getBranchId(),
            ROOMID: instance.getRoomId(),
            CHECKINDATE: instance.getCheckInDate(),
            CHECKOUTDATE: instance.getCheckOutDate(),
            PERSON: this.convertToDBRow(instance.getPerson()),
            RESERVATIONID: instance.getReservationId(),
            CONSUMENUMBER: instance.getConsumeNumber(),
        };
        });

        this.registerConverter(reservation,(instance)=>{
             return {
            ID: instance.getID(),
            BRANCHID: instance.getBranchId(),
            CUSTOMERID: instance.getCustomerId(),
            ROOMLAYOUT: this.convertToDBRow(instance.getRoomLayout()),
            CREATERESERVATIONDATE: instance.getcreateReservationDate(),
            RESERVATIONSTATE: this.convertToDBRow(instance.getState()),
            };
        });

        this.registerConverter(room,(instance)=>{
            return {
            ID: instance.getID(),
            ROOMLAYOUT: this.convertToDBRow(instance.getRoomType()),
            ACTIVESTATE: this.convertToDBRow(instance.getActiveState()),
            ISEMPTYBOOL: instance.getEmpty() ? 1 : 0,
            BRANCHID: instance.getBranchId(),
            PRICEREAL: instance.getPrice(),
        };
        });

        this.registerConverter(displayRoom,(instance)=>{
            return {
            ID: instance.getID(),
            BRANCHID: instance.getBranchId(),
            ROOMLAYOUT: this.convertToDBRow(instance.getRoomLayout()),
            APPRAISEPRICE: instance.getAppraisePrice(),
            ACTIVESTATE: this.convertToDBRow(instance.getActiveState()),
        };
        });
    }


  
    /**
     * 对通用类型（也就是没有在这文件里预先定义的类）
     * 将类实例转换为数据库中的一行的行
     * @param {Object} instance - 类的实例
     * @returns {Object} 数据库中的一行的行
     */
    convertToDBRow(instance) {
        if (instance === null || instance === undefined) {
            return null;
        }

        if (this.converters.has(instance.constructor)) {

            const result = this.converters.get(instance.constructor)(instance);
            if (result instanceof Object && !(result instanceof Date) && !Array.isArray(result)) {
                return this._flattenObject(result);
            }
            return result;
        }

        if (instance instanceof Date) {
            return this._formatDate(instance);
        }

        if (Array.isArray(instance)) {
            return this._convertArray(instance);
        }

        if (instance instanceof Object) {
            return this._convertComplexObject(instance);
        }

        return instance;
    }

    /**
     * 将数组转换为数据库中的一行的字段
     * @param {Array} arr - 数组
     * @returns {Array} 数据库中的一行的字段
     */
    _convertArray(arr) {
        if (!this.flattenArrays) {
            return JSON.stringify(arr);
        }
        return arr.map(item => this.convertToDBRow(item));
    }

    /**
     * 将对象转换为数据库中的一行的字段
     * @param {Object} obj - 对象
     * @returns {Object} 数据库中的一行的字段
     */
    _convertComplexObject(obj) {
        const result = {};

        Object.keys(obj)
            .filter(key => key !== 'constructor')
            .forEach(key => {
                result[key] = this.convertToDBRow(obj[key]);
            });

        return result;
    }
    /**
     * 将嵌套的对象展开，转换为字段前的前缀
     * @param {Object} obj - 对象
     * @returns {Object} 数据库中的一行的字段
     */
    _flattenObject(obj, prefix = '') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {

            const newKey = prefix ? `${prefix}_${key}` : key;

            if (Array.isArray(value)) {
                result[newKey] = this._convertArray(value);
            } 
            else if (value instanceof Date) {
                result[newKey] = this._formatDate(value);
            } 
            else if (value instanceof Object && !this.converters.has(value.constructor)) {
                Object.assign(result, this._flattenObject(value, newKey));
            } 
            else {
                result[newKey] = value;
            }
        }
        return result;
    }

    /**
     * 将日期转换为数据库中的一行的字段
     * @param {Date} date - 日期
     * @returns {string} 数据库中的一行的字段
     */
    _formatDate(date) {
        if (this.dateFormat === 'timestamp') {
            return date.getTime();
        } else if (this.dateFormat === 'date') {
            return date.toISOString().split('T')[0];
        } else if (this.dateFormat === 'datetime') {
            return date.toISOString();
        }
        return date;
    }

    //外部可以使用的接口
    convert(instance) {
        return this.convertToDBRow(instance);
    }
}

module.exports = convertTypeToDBRow;