const express = require('express');
const {
  branches,
  checkIns,
  getBranchName,
  getNextId,
  reservations,
  requireUser,
  rooms,
} = require('./mockData');

const router = express.Router();

const getBranchFromUser = (user) => user.branchId || 'BR001';

const normalizeRoomStatus = (room) => {
  if (!room.isAvailable) {
    return 'maintenance';
  }
  return room.isEmpty ? 'available' : 'occupied';
};

router.get('/dashboard', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  const branchRooms = rooms.filter((room) => room.branchId === branchId);
  const branchReservations = reservations.filter((item) => item.branchId === branchId);
  const branchCheckIns = checkIns.filter((item) => item.branchId === branchId);

  const today = new Date().toISOString().slice(0, 10);

  res.json({
    branchInfo: { branchId, branchName: getBranchName(branchId) },
    totalRooms: branchRooms.length,
    availableRooms: branchRooms.filter((room) => room.isAvailable && room.isEmpty).length,
    occupiedRooms: branchRooms.filter((room) => !room.isEmpty).length,
    pendingReservations: branchReservations.filter((item) => item.status === 'pending').length,
    todayCheckIns: branchCheckIns.filter((item) => item.checkInDate?.slice(0, 10) === today).length,
    todayCheckOuts: branchCheckIns.filter((item) => item.checkOutDate?.slice(0, 10) === today).length,
    recentReservations: branchReservations.slice(-5).reverse(),
    recentCheckIns: branchCheckIns.slice(-5).reverse(),
  });
});

router.get('/rooms', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  res.json(
    rooms
      .filter((room) => room.branchId === branchId)
      .map((room) => ({
        ...room,
        status: normalizeRoomStatus(room),
      })),
  );
});

router.post('/rooms', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  const { roomId, price, roomType, area, windowBool, bedType, bedCount, status = 'available' } = req.body;

  if (!roomId || !price) {
    return res.status(400).json({ message: '请填写完整房间信息' });
  }

  const nextRoom = {
    roomId,
    branchId,
    roomType: roomType || {
      area: Number(area) || 20,
      windowBool: Boolean(windowBool),
      bedType: {
        typeString: bedType || '大床',
        numInt: Number(bedCount) || 1,
      },
    },
    price: Number(price),
    isAvailable: status !== 'maintenance',
    isEmpty: status !== 'occupied',
  };

  rooms.push(nextRoom);
  res.json({ ...nextRoom, status: normalizeRoomStatus(nextRoom) });
});

router.put('/rooms/:id', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  const room = rooms.find((item) => item.roomId === req.params.id && item.branchId === branchId);

  if (!room) {
    return res.status(404).json({ message: '房间不存在' });
  }

  const { roomType, price, status } = req.body;

  if (roomType) {
    room.roomType = roomType;
  }
  if (price !== undefined) {
    room.price = Number(price);
  }
  if (status) {
    room.isAvailable = status !== 'maintenance';
    room.isEmpty = status !== 'occupied';
  }

  return res.json({ ...room, status: normalizeRoomStatus(room) });
});

router.post('/rooms/:id/availability', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  const room = rooms.find((item) => item.roomId === req.params.id && item.branchId === branchId);
  if (!room) {
    return res.status(404).json({ message: '房间不存在' });
  }

  room.isAvailable = Boolean(req.body.isAvailable);
  return res.json({ success: true });
});

router.delete('/rooms/:id', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  const index = rooms.findIndex((item) => item.roomId === req.params.id && item.branchId === branchId);
  if (index === -1) {
    return res.status(404).json({ message: '房间不存在' });
  }

  rooms.splice(index, 1);
  return res.json({ success: true });
});

router.get('/reservations', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  const { status } = req.query;
  let data = reservations.filter((item) => item.branchId === branchId);
  if (status) {
    data = data.filter((item) => item.status === status);
  }

  return res.json(data.slice().reverse());
});

router.post('/reservations/:id/confirm', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  const reservation = reservations.find(
    (item) => item.reservationId === req.params.id && item.branchId === branchId,
  );

  if (!reservation) {
    return res.status(404).json({ message: '预订记录不存在' });
  }

  reservation.status = 'confirmed';
  return res.json({ success: true });
});

router.post('/reservations/:id/cancel', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  const reservation = reservations.find(
    (item) => item.reservationId === req.params.id && item.branchId === branchId,
  );

  if (!reservation) {
    return res.status(404).json({ message: '预订记录不存在' });
  }

  reservation.status = 'canceled';
  return res.json({ success: true });
});

router.get('/checkins', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  res.json(checkIns.filter((item) => item.branchId === branchId).slice().reverse());
});

router.post('/checkins', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  const room = rooms.find((item) => item.roomId === req.body.roomId && item.branchId === branchId);

  if (!room) {
    return res.status(404).json({ message: '房间不存在' });
  }

  const person = req.body.persons?.[0];
  const newCheckIn = {
    checkInId: getNextId('CHK', checkIns, 'checkInId'),
    customerId: req.body.customerId || `WALKIN-${checkIns.length + 1}`,
    customerName: person?.name || req.body.customerName || '散客',
    branchId,
    branchName: getBranchName(branchId),
    roomId: req.body.roomId,
    reservationId: req.body.reservationId || null,
    persons: req.body.persons || [],
    checkInDate: new Date().toISOString(),
    checkOutDate: null,
    consumeAmount: 0,
    status: 'checked-in',
  };

  room.isEmpty = false;
  checkIns.push(newCheckIn);
  res.json(newCheckIn);
});

router.post('/checkins/:id/checkout', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  const checkIn = checkIns.find(
    (item) => item.checkInId === req.params.id && item.branchId === branchId,
  );

  if (!checkIn) {
    return res.status(404).json({ message: '入住记录不存在' });
  }

  checkIn.status = 'checked-out';
  checkIn.checkOutDate = new Date().toISOString();

  const room = rooms.find((item) => item.roomId === checkIn.roomId && item.branchId === branchId);
  if (room) {
    room.isEmpty = true;
  }

  return res.json({ success: true });
});

router.post('/checkins/:id/consumption', (req, res) => {
  const user = requireUser(req, res, 'branch');
  if (!user) {
    return;
  }

  const branchId = getBranchFromUser(user);
  const checkIn = checkIns.find(
    (item) => item.checkInId === req.params.id && item.branchId === branchId,
  );

  if (!checkIn) {
    return res.status(404).json({ message: '入住记录不存在' });
  }

  checkIn.consumeAmount += Number(req.body.amount || 0);
  return res.json({ success: true, consumeAmount: checkIn.consumeAmount });
});

module.exports = router;
