const branchDisplayRoomManager=require('./branchDisplayRoomManager');
const {allBranchManager}=require('../template/allBranchManager');

/**
 * 所有分店的展出房间管理类
 */
class allDisplayRoomManager extends allBranchManager{
    constructor(){
        super();
    }

    /**
     * 添加分店的展出房间管理类
     * @param {string} branchIdString 分店的编号
     */
    addNewBranchManager(branchIdString){
        super.addNewBranchManager(new branchDisplayRoomManager(branchIdString));
    }

    /**
     * 根据展出房间编号返回展出房间的引用类型对象
     * @param {string} branchId 分店的编号
     * @param {string} displayRoomId 展出房间的编号
     * @returns {displayRoom} 展出房间的引用类型对象
     */
    getOneDisplayRoomById(branchId, displayRoomId){
        const branchManager = super.getOneManagerByBranchId(branchId);
        if (branchManager) {
            return branchManager.getOneDisplayRoomById(displayRoomId);
        }
        return null;
    }

    /**
     * 添加展出房间
     * @param {string} branchId 分店的编号
     * @param {displayRoom} newDisplayRoom 新展出房间的引用类型对象
     */
    addDisplayRoom(branchId, newDisplayRoom){
        const branchManager = super.getOneManagerByBranchId(branchId);
        if (!branchManager) {
            this.addNewBranchManager(branchId);
        }
        const targetBranchManager = super.getOneManagerByBranchId(branchId);
        if (targetBranchManager) {
            targetBranchManager.addDisplayRoom(newDisplayRoom);
        }
    }

    /**
     * 获取所有可用的展出房间
     * @returns {displayRoom[]} 所有可用的展出房间的引用类型对象数组
     */
    getAllActiveDisplayRoom()
    {
        return super.getAllObjectList().filter(displayRoom=>displayRoom.getActiveState().getIsActive());
    }

    /**
     * 获取所有展出房间
     * @returns {displayRoom[]} 所有展出房间的引用类型对象数组
     */
    getAllDisplayRoom()
    {
        return super.getAllObjectList();
    }
}

module.exports=allDisplayRoomManager;