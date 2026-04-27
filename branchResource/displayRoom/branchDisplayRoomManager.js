const assert=require('assert');

const { branchManager } = require('../template/allBranchManager');
const { displayRoom } = require('./displayRoom');

//管理单个分店的展出房间
class branchDisplayRoomManager extends branchManager{
    constructor(branchIdString){
        super(branchIdString);
    }

    /**
     * 添加展出房间
     * @param {displayRoom} newDisplayRoom 新展出房间的引用类型对象
     */
    addDisplayRoom(newDisplayRoom){
        assert(newDisplayRoom instanceof displayRoom);

        //检查展出房间编号是否已存在
        if(this.getOneDisplayRoomById(newDisplayRoom.getID())!=null){
            throw new Error("展出房间编号已存在");
        }
        
        this.addObject(newDisplayRoom);
    }

    /**
     * 根据展出房间编号返回展出房间的引用类型对象
     * @param {string} displayRoomId 展出房间的编号
     * @returns {displayRoom} 展出房间的引用类型对象
     */
    getOneDisplayRoomById(displayRoomId){
        return super.getOneObjectById(displayRoomId);
    }

    /**
     * 设置展出房间为不可用
     * @param {string} displayRoomId 展出房间的编号
     */
    setOneDisplayRoomDisable(displayRoomId) {
        assert(typeof displayRoomId==='string');
        const targetDisplayRoom = this.getOneDisplayRoomById(displayRoomId);
        if (targetDisplayRoom) targetDisplayRoom.setDisable();
    }

    /**
     * 设置展出房间为可用
     * @param {string} displayRoomId 展出房间的编号
     */
    setOneDisplayRoomEnable(displayRoomId) {
        assert(typeof displayRoomId==='string');
        const targetDisplayRoom = this.getOneDisplayRoomById(displayRoomId);
        if (targetDisplayRoom) targetDisplayRoom.setEnable();
    }

    /**
     * 设置展出房间的评估价格
     * @param {string} displayRoomId 展出房间的编号
     * @param {number} price 评估价格
     */
    setOneDisplayRoomAppraisePrice(displayRoomId, price) {
        assert(typeof displayRoomId==='string');
        assert(typeof price === 'number');
        const targetDisplayRoom = this.getOneDisplayRoomById(displayRoomId);
        if (targetDisplayRoom) targetDisplayRoom.setAppraisePrice(price);
    }

    /**
     * 获取所有可用的展出房间
     * @returns {displayRoom[]} 所有可用的展出房间的引用类型对象数组
     */
    getAllActiveDisplayRoom()
    {
        return this.objectList.filter(displayRoom=>displayRoom.getActiveState().getIsActive());
    }

    /**
     * 获取所有展出房间
     * @returns {displayRoom[]} 所有展出房间的引用类型对象数组
     */
    getAllDisplayRoom()
    {
        return this.objectList;
    }
}

module.exports=branchDisplayRoomManager;