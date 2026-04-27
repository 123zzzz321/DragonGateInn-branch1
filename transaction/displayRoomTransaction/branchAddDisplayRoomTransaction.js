const assert=require('assert'); 

const branchDisplayRoomTransaction=require('./branchDisplayRoomTransaction');
const { displayRoom, displayFactory } = require('../../branchResource/displayRoom/displayRoom');
const {RoomLayout,BedInRoom}=require('../../branchResource/room/room');
/**
 * 分店添加展示房间事务
 */
class branchAddDisplayRoomTransaction extends branchDisplayRoomTransaction{
    constructor(){
        super();
    }
    
    /**
     * 第一个参数：分店id
     * 第二个参数及以后：展示房间信息
     */
    execute(...args){
        super.execute(...args); 

        const [branchId,roomLayout,appraisePrice]=args;


        /**
         * 检查分店是否存在
         */
        if(!this.checkBranchExist(branchId)){
            return this.packageResult(false,null,"分店不存在");
        }
        
        /**
         * 创建房间布局
         */
        const requireRoomLayout=new RoomLayout(roomLayout.area,roomLayout.windowBool,
            new BedInRoom(roomLayout.typeString,roomLayout.numId));

        /**
         * 创建展示房间
         */
        const newDisplayRoom=displayFactory(branchId,requireRoomLayout,appraisePrice);

       /**
         * 添加展示房间到分店的展示房间管理器
         */
        this.getNeedChangeBranchDisplayRoomManager(branchId)
            .addDisplayRoom(newDisplayRoom);
       
        /**
         * 插入数据库中的房间
         */
        this.changeDatabase('insert',newDisplayRoom);
           

        return this.packageResult(true,newDisplayRoom,"展示房间添加成功");
    }
}

module.exports=branchAddDisplayRoomTransaction;