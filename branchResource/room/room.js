const activeState=require('../../util/activeState');
const assert=require('assert');

//床铺的情况，某种类型的床有几张
class BedInRoom{
    constructor(typeString,numInt){
        //床的类型
        this.typeString=typeString;
        //有几张床
        this.numInt=numInt;

    }

    getBedType(){
        return this.typeString;
    }

    getBedNum(){
        return this.numInt;
    }

}


//酒店房间的户型
class RoomLayout{
    constructor(area,windowBool,bedType){
        //房间的面积
        this.areaReal = area;
        //是否有窗户
        this.windowBool=windowBool;
        //房间床铺的情况
        assert(bedType instanceof BedInRoom);
        this.bedType=bedType;
    }

    getArea(){
        return this.areaReal;
    }

    getWindowBool(){
        return this.windowBool;
    }

    getBedType(){
        return this.bedType;
    }
}

/**
 * 酒店房间类
 */
class room{
    constructor(id,branchId,roomType=new RoomLayout(0,false,new BedInRoom("单人床",1))){
        //房间编号
        this.id=id;

        //房间所属的酒店的编号
        this.branchId=branchId;

        //房间的户型
        assert(roomType instanceof RoomLayout); 
        this.roomType=roomType;

        //房间是否可以出租，是否被下架
        this.activeState=new activeState(true);

        //房间是否为空闲
        this.isEmptyBool=true;

        //房间的价格
        this.priceReal=0;
    }

    /**
     * 获取房间的编号
     * @returns {string} 房间的编号
     */
    getID(){
        return this.id;
    }

    /**
     * 获取房间所属的酒店的编号
     * @returns {string} 房间的所属的酒店的编号
     */
    getBranchId(){
        return this.branchId;
    }
    

    /**
     * 获取房间的户型
     * @returns {RoomLayout} 房间的户型
     */
    getRoomType(){
        return this.roomType;
    }


    /**
     * 获取房间是否可以出租
     * @returns {activeState} 房间的是否可以出租
     */
    getActiveState(){
        return this.activeState;
    }

    /**
     * 设置房间为不可出租
     */
    setDisable(){
        this.activeState.setDisable();
    }

    /**
     * 设置房间为可出租
     */
    setEnable(){
        this.activeState.setEnable();
    }

    /**
     * 设置房间为空闲
     */
    setEmpty(){
        this.isEmptyBool=true;
    }

    /**
     * 设置房间被占用
     * @param {boolean} isOccupied 是否被占用
     */
    setOccupied(){
        this.isEmptyBool=false;
    }

    /**
     * 获取房间是否为空闲
     * @returns {boolean} 房间是否为空闲
     */
    getEmpty()
    {
        return this.isEmptyBool;
    }

    /**
     * 获取房间的价格
     * @returns {number} 房间的的价格
     */
    getPrice(){
        return this.priceReal;
    }

    /**
     * 设置房间的价格
     * @param {number} price 房间的的价格
     */
    setPrice(price){
        this.priceReal=price;
    }
}

module.exports.room=room;   
module.exports.RoomLayout=RoomLayout;
module.exports.BedInRoom=BedInRoom;
