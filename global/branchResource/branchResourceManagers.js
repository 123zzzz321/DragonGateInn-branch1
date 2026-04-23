const allRoomManager=require('../../branchResource/room/allRoomManager');
const allReservationManager=require('../../branchResource/reservation/allReservationManager');
const allCheckInManager=require('../../branchResource/checkIn/allCheckInManager');

/**
 * 分店资源管理器类
 */
const branchResourceManagers=[
    //房间管理器
    allRoomManager,
    //预约管理器
    allReservationManager,
    //入住登记管理器
    allCheckInManager
]

module.exports=branchResourceManagers;
