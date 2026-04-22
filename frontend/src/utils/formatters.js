import dayjs from 'dayjs';

export const formatDate = (value) => {
  if (!value) {
    return '-';
  }
  return dayjs(value).format('YYYY-MM-DD');
};

export const formatDateTime = (value) => {
  if (!value) {
    return '-';
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm');
};

export const formatCurrency = (value) => `¥${Number(value || 0).toFixed(0)}`;

export const formatRoomType = (roomType) => {
  if (!roomType) {
    return '-';
  }

  const areaText = roomType.area ? `${roomType.area}㎡` : '面积待定';
  const windowText = roomType.windowBool ? '有窗' : '无窗';
  const bedType = roomType.bedType?.typeString || '床型待定';
  const bedCount = roomType.bedType?.numInt ? `${roomType.bedType.numInt}张` : '';

  return `${areaText} · ${windowText} · ${bedType}${bedCount}`;
};

export const getRoomStatus = (room) => {
  if (!room?.isAvailable) {
    return 'maintenance';
  }
  return room?.isEmpty ? 'available' : 'occupied';
};

export const getRoomStatusText = (status) =>
  ({
    available: '可用',
    occupied: '入住中',
    maintenance: '维护中',
  }[status] || status);

export const getReservationStatusText = (status) =>
  ({
    pending: '待确认',
    confirmed: '已确认',
    canceled: '已取消',
  }[status] || status);

export const getReservationStatusColor = (status) =>
  ({
    pending: 'gold',
    confirmed: 'green',
    canceled: 'red',
  }[status] || 'default');

export const getCheckInStatusText = (status) =>
  ({
    'checked-in': '入住中',
    'checked-out': '已退房',
  }[status] || status);
