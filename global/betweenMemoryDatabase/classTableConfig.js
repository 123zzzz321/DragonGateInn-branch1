const branchAccount = require('../../account/branchAccount');
const customerAccount = require('../../account/customerAccount');
const headquarterAccount = require('../../account/headquarterAccount');

const branchAccountManager = require('../../accountManager/branchAccountManager');
const customerAccountManager = require('../../accountManager/customerAccountManager');
const headquarterAccountManager = require('../../accountManager/headquarterAccountManager');

const {checkIn,person,checkInFactory}=require('../../branchResource/checkIn/checkIn');
const {reservationState,reservation,reservationFactory}=require('../../branchResource/reservation/reservation');
const {room,RoomLayout,BedInRoom}=require('../../branchResource/room/room');
const {displayRoom}=require('../../branchResource/displayRoom/displayRoom');

const allCheckInManager=require('../../branchResource/checkIn/allCheckInManager');
const allReservationManager=require('../../branchResource/reservation/allReservationManager');  
const allRoomManager=require('../../branchResource/room/allRoomManager');
const allDisplayRoomManager=require('../../branchResource/displayRoom/allDisplayRoomManager');

const SingletonFactory=require('../../util/SingletonFactory');

// 建立表名、账户类型和管理器的映射关系
const accountClassTableConfigs = [
    {
        tableName: 'BRANCH_ACCOUNT' ,
        type: branchAccount,
        manager: SingletonFactory.getInstance(branchAccountManager)
    },
    {
        tableName: 'CUSTOMER_ACCOUNT' ,
        type: customerAccount,
        manager: SingletonFactory.getInstance(customerAccountManager)
    },
    {
        tableName: 'HEADQUARTER_ACCOUNT' ,
        type: headquarterAccount,
        manager: SingletonFactory.getInstance(headquarterAccountManager)
    }
];




const branchResourceTableConfig=[
    {
        tableName: 'CHECKIN' ,
        type: checkIn,
        manager: SingletonFactory.getInstance(allCheckInManager)
    },
    {
        tableName: 'RESERVATION' ,
        type: reservation,
        manager: SingletonFactory.getInstance(allReservationManager)
    },
    {
        tableName: 'ROOM' ,
        type: room,
        manager: SingletonFactory.getInstance(allRoomManager)
    },
    {
        tableName: 'DISPLAYROOM' ,
        type: displayRoom,
        manager: SingletonFactory.getInstance(allDisplayRoomManager)
    }
]

function getBranchResourceTableConfig(branchId){
    return branchResourceTableConfig.map(item=>{
        const result={
            tableName: item.tableName + '_' + branchId,
            type: item.type,
            manager: item.manager
        }
        if(typeof item.manager.getOneManagerByBranchId !== 'function'){
            console.log(item.manager);  
        }
        result.manager=item.manager.getOneManagerByBranchId(branchId);

       
        return result;
    })
}
module.exports.accountClassTableConfigs=accountClassTableConfigs;
module.exports.getBranchResourceTableConfig=getBranchResourceTableConfig;
