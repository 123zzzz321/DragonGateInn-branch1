const activeState=require('../../util/activeState');
const assert=require('assert');
const {RoomLayout,BedInRoom}=require('../room/room');
const randomGenerator=require('../../util/randomIdGenerator');

/**
 * 展出房间的编号生成器
 */
const randomDisplayRoomIdGenerator=new randomGenerator();

/**
 * 展出房间类
 */
class displayRoom{
    constructor(id, branchId, roomLayout=new RoomLayout(0, false, new BedInRoom("单人床", 1)), appraisePrice=0){
        //资源唯一标识符
        this.id=id;

        randomDisplayRoomIdGenerator.occupyId(this.id);

        //发布该资源的分店ID
        this.branchId=branchId;

        //房间户型信息
        assert(roomLayout instanceof RoomLayout);
        this.roomLayout=roomLayout;

        //资源的评估价格
        assert(typeof appraisePrice === 'number');
        this.appraisePrice=appraisePrice;

        //该展出是否启用
        this.activeState=new activeState(true);
    }

    /**
     * 获取资源唯一标识符
     * @returns {string} 资源唯一标识符
     */
    getID(){
        return this.id;
    }

    /**
     * 获取发布该资源的分店ID
     * @returns {string} 发布该资源的分店ID
     */
    getBranchId(){
        return this.branchId;
    }

    /**
     * 获取房间户型信息
     * @returns {RoomLayout} 房间户型信息
     */
    getRoomLayout(){
        return this.roomLayout;
    }

    /**
     * 获取资源的评估价格
     * @returns {number} 资源的评估价格
     */
    getAppraisePrice(){
        return this.appraisePrice;
    }

    /**
     * 设置资源的评估价格
     * @param {number} price 资源的评估价格
     */
    setAppraisePrice(price){
        assert(typeof price === 'number');
        this.appraisePrice=price;
    }

    /**
     * 获取该展出是否启用
     * @returns {activeState} 该展出是否启用
     */
    getActiveState(){
        return this.activeState;
    }

    /**
     * 设置展出为不可用
     */
    setDisable(){
        this.activeState.setDisable();
    }

    /**
     * 设置展出为可用
     */
    setEnable(){
        this.activeState.setEnable();
    }
}

/**
 * 展出房间工厂函数
 */
function displayFactory(branchId, roomLayout, appraisePrice=0){
    return new displayRoom(randomDisplayRoomIdGenerator.generateId(), branchId, roomLayout, appraisePrice);
}

module.exports.displayRoom=displayRoom;
module.exports.displayFactory=displayFactory;