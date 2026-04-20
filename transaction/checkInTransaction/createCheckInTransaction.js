const assert=require('assert');

const transaction=require('../transaction');
const allCheckInManager=require('../../branchResource/checkIn/allCheckInManager');
const {checkInFactory,person}=require('../../branchResource/checkIn/checkIn');

const branchManager=require('../../accountManager/branchAccountManager');
const allRoomManager=require('../../branchResource/room/allRoomManager');
const branchAccountManager=require('../../accountManager/branchAccountManager');

class createCheckInTransaction extends transaction{
    constructor(){
        super();
    }

    /**
     * 检查分店是否存在
     * @param {string} branchId 分店的编号
     * @returns {boolean} 分店是否存在
     */
    isBranchExist(branchId){
        return transaction.getManager(branchAccountManager).getOneAccountByID(branchId)!=null;
    }

    /**
     * 检查房间是否存在
     * @param {string} branchId 分店的编号
     * @param {string} roomId 房间的编号
     * @returns {boolean} 房间是否存在
     */
    isRoomExist(branchId,roomId){
        return transaction.getManager(allRoomManager)
            .getOneManagerByBranchId(branchId).getOneRoomById(roomId)!=null;
    }

    /**
     * 检查入住人员数组类型是否正确
     * @param {string} branchId 分店的编号
     * @param {string} roomId 房间的编号
     * @param {person[]} persons 入住人员的数组
     * @returns {boolean} 入住人员数组类型是否正确
     */
    checkPersonArg(persons){
        return persons.every((item,_) => {
          return item instanceof person;
        });
    }

    execute(...args){
        super.execute(...args);
        assert(args.length>=3,'args.length less than 3');

        const branchId=args[0];
        const roomId=args[1];
        const persons=args[2];
        let connectReservationId=null;
        if(args.length>=4)
        {
            connectReservationId=args[3];
        }
       
        if(!this.isBranchExist(branchId))
        {
            return this.packageResult(false,null,'branchId is not exist');
        }

        if(!this.isRoomExist(branchId,roomId))
        {
            return this.packageResult(false,null,'roomId is not exist');
        }
        
        if(!this.checkPersonArg(persons)){
            return this.packageResult(false,null,'person is not a person array');
        }

        //TODO:检查预约是否存在，现在还没想好怎么实现，在哪里实现

        const newCheckIn=checkInFactory(branchId,roomId,persons,connectReservationId);
        transaction.getManager(allCheckInManager)
            .getOneManagerByBranchId(branchId)
            .addNewCheckIn(newCheckIn);

        return this.packageResult(true,newCheckIn,'success');
    }
}
module.exports=createCheckInTransaction;