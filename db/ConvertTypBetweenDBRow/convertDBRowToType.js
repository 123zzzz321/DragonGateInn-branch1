const assert = require('assert');


const branchAccount = require('../../account/branchAccount');
const customerAccount = require('../../account/customerAccount');
const headquarterAccount = require('../../account/headquarterAccount');

const {checkIn,person,checkInFactory}=require('../../branchResource/checkIn/checkIn');
const {reservationState,reservation,reservationFactory}=require('../../branchResource/reservation/reservation');
const {room,RoomLayout,BedInRoom}=require('../../branchResource/room/room');
const {displayRoom}=require('../../branchResource/displayRoom/displayRoom');
const activeState = require('../../util/activeState');


class convertDBRowToType{
    constructor(options = {}) {
        this.converters = new Map();
        this.flattenArrays = options.flattenArrays ;
        this.dateFormat = options.dateFormat || 'datetime';
        this._registerDefaultConverters();
    }

    registerConverter(className, converterFn) {
        assert(typeof className === 'string', 'className must be a string');
        assert(typeof converterFn === 'function', 'converterFn must be a function');
        this.converters.set(className, converterFn);
    }

    _registerDefaultConverters() {
       this.registerConverter('activeState',(obj)=>{
            return new activeState(
                obj.ACTIVESTATE==1?true:false
            )
       })

       this.registerConverter('person',(obj)=>{
            return new person(
                obj.NAME,
                obj.IDENTITYCARD
            );
       })

       this.registerConverter('bedType',(obj)=>{
            return new BedInRoom(
                obj.TYPESTRING,
                obj.NUMINT
            );
       })

       this.registerConverter('roomLayout',(obj)=>{
            return new RoomLayout(
                obj.AREAREAL,
                obj.WINDOWBOOL==1?true:false, 
                this.convertToType('bedType',obj.BEDTYPE)
            );
       })

       this.registerConverter('reservationState',(obj)=>{
            const state = new reservationState(); 
            state.setState(obj);
            return state;
       })

       this.registerConverter('branchAccount',(obj)=>{
            const result=new branchAccount(
               obj.ID,
               obj.PASSWORD
            );
            if (obj.ACTIVESTATE == 1) {
                result.setEnable();
            } else {
                result.setDisable();
            }
            return result;
       })

       this.registerConverter('customerAccount',(obj)=>{
            const result=new customerAccount(
               obj.ID,
               obj.PASSWORD,
               obj.PHONE
            );
            if (obj.ACTIVESTATE == 1) {
                result.setEnable();
            } else {
                result.setDisable();
            }
            return result;
       })

       this.registerConverter('headquarterAccount',(obj)=>{
            const result= new headquarterAccount(
               obj.ID,
               obj.PASSWORD
            );
            if (obj.ACTIVESTATE == 1) {
                result.setEnable();
            } else {
                result.setDisable();
            }
            return result;
       })

       this.registerConverter('checkIn',(obj)=>{
            const result = new checkIn(obj.ID);
            result.setCheckInData(
               obj.BRANCHID,
               obj.ROOMID,
               this.arrayConverter('person',obj.PERSON),
               obj.RESERVATIONID
            );
            result.checkInDate = this.DateConverter(obj.CHECKINDATE);
            result.checkOutDate = obj.CHECKOUTDATE? this.DateConverter(obj.CHECKOUTDATE):null;
            result.consumeNumber = obj.CONSUMENUMBER;
            return result;
       })

       this.registerConverter('reservation',(obj)=>{
            const result = new reservation(obj.ID);
            result.setReservationData(
               obj.CUSTOMERID,
               obj.BRANCHID,
               this.convertToType('roomLayout',obj.ROOMLAYOUT)
            );
            result.state = this.convertToType('reservationState',obj.RESERVATIONSTATE);
            result.createReservationDate = this.DateConverter(obj.CREATERESERVATIONDATE);
            result.roomLayout =this.convertToType('roomLayout',obj.ROOMLAYOUT);
            return result;
       })

       this.registerConverter('room',(obj)=>{
            const result = new room(
               obj.ID,
               obj.BRANCHID,
               this.convertToType('roomLayout',obj.ROOMLAYOUT)
            );
            if (obj.ACTIVESTATE == 1) {
                result.setEnable();
            } else {
                result.setDisable();
            }
            result.isEmptyBool = (obj.ISEMPTYBOOL == 1 || obj.ISEMPTY) == 1?true:false;
            result.priceReal = obj.PRICEREAL;
            return result;
       })

       this.registerConverter('displayRoom',(obj)=>{
            const result = new displayRoom(
               obj.ID,
               obj.BRANCHID,
               this.convertToType('roomLayout',obj.ROOMLAYOUT),
               obj.APPRAISEPRICE || 0
            );
            if (obj.ACTIVESTATE == 1) {
                result.setEnable();
            } else {
                result.setDisable();
            }
            return result;
       })
    }

    /**
     * 将数据库中的一行的行转换为类的实例
     * @param {string} className - 类的名称
     * @param {Object} obj - 数据库中的一行的行
     * @returns {Object} 类的实例
     */
    convertToType(className,obj){
        const subClassMap = new Map();
        Object.entries(obj).forEach(([key, value]) => {
            // 如果这个字段里面有以下换线分割的前缀
            // 说明这个字段是一个子对象的字段
            if(key.split('_')[0] !== key){
                //将这个字段前缀提取出来作为类名，后面的字段作为子对象的字段
                const prefix = key.split('_')[0];
                if(!subClassMap.has(prefix)){
                    subClassMap.set(prefix,{});
                }
                const subObj = subClassMap.get(prefix);
                subObj[(key.split('_').splice(1).join('_'))] = value;
                subClassMap.set(prefix, subObj);
                delete obj[key];
            }
        });

        subClassMap.forEach((subObj,subClassName)=>{
            obj[subClassName] = subObj;
        });

        if(!this.converters.get(className))
        {
            return obj;
        }

        return this.converters.get(className)(obj);
    }

    /**
     * 将数组转换为类的实例数组
     * @param {string} className - 类的名称
     * @param {Array} arr - 数组
     * @returns {Array} 类的实例数组
     */
    arrayConverter(className,obj){
        const result = [];
        JSON.parse(obj).forEach(item=>{
            result.push(this.convertToType(className,item));
        })
        return result;
    }

    /**
     * 将字符串转换为日期
     * @param {string} val - 日期字符串
     * @returns {Date} 日期
     */
    DateConverter(val) {
        // 1. 如果是时间戳 (number 类型)
        if (typeof val === 'number') {
            return new Date(val);
        }

        // 2. 如果是 'YYYY-MM-DD' 格式 (例如 "2026-04-21")
        if (typeof val === 'string' && val.includes('-')) {
            return new Date(val); 
        }

        // 3. 如果是 ISO 字符串 (例如 "2026-04-21T18:08:38.000Z")
        return new Date(val);
    }

    convert(className,obj){
        return this.convertToType(className,obj);
    }
}
module.exports = convertDBRowToType;
