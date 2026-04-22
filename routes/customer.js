const express = require('express');
const {
  branches,
  getBranchById,
  getBranchName,
  getNextId,
  reservations,
  requireUser,
  rooms,
  checkIns,
  getRoomById,
} = require('./mockData');

const router = express.Router();

router.get('/dashboard', (req, res) => {
  const user = requireUser(req, res, 'customer');
  if (!user) {
    return;
  }

  const customerReservations = reservations.filter((item) => item.customerId === user.customerId);
  const customerCheckIns = checkIns.filter((item) => item.customerId === user.customerId);

  res.json({
    customerInfo: {
      customerId: user.customerId,
      customerName: user.customerName || user.username,
    },
    totalReservations: customerReservations.length,
    activeReservations: customerReservations.filter((item) => item.status !== 'canceled').length,
    totalCheckIns: customerCheckIns.length,
    activeCheckIns: customerCheckIns.filter((item) => item.status === 'checked-in').length,
    recentReservations: customerReservations.slice(-5).reverse(),
    upcomingReservations: customerReservations.filter((item) => item.status !== 'canceled').slice(-5).reverse(),
  });
});

router.get('/branches', (_req, res) => {
  res.json(branches);
});

router.get('/branches/:branchId/rooms', (req, res) => {
  const availableRooms = rooms.filter(
    (room) => room.branchId === req.params.branchId && room.isAvailable && room.isEmpty,
  );

  res.json(
    availableRooms.map((room) => ({
      ...room,
      branchName: getBranchName(room.branchId),
    })),
  );
});

router.post('/reservations', (req, res) => {
  const user = requireUser(req, res, 'customer');
  if (!user) {
    return;
  }

  const { branchId, roomId, checkInDate, checkOutDate } = req.body;
  const branch = getBranchById(branchId);
  const room = getRoomById(roomId, branchId);

  if (!branch || !room || !room.isAvailable || !room.isEmpty) {
    return res.status(400).json({ message: '房间当前不可预订' });
  }

  const reservation = {
    reservationId: getNextId('RES', reservations, 'reservationId'),
    customerId: user.customerId,
    customerName: user.customerName || user.username,
    customerPhone: user.customerPhone || '',
    branchId,
    branchName: branch.branchName,
    roomId,
    roomType: room.roomType,
    checkInDate,
    checkOutDate,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  reservations.push(reservation);
  res.json(reservation);
});

router.get('/reservations', (req, res) => {
  const user = requireUser(req, res, 'customer');
  if (!user) {
    return;
  }

  res.json(
    reservations
      .filter((item) => item.customerId === user.customerId)
      .slice()
      .reverse(),
  );
});

router.post('/reservations/:id/cancel', (req, res) => {
  const user = requireUser(req, res, 'customer');
  if (!user) {
    return;
  }

  const reservation = reservations.find(
    (item) => item.reservationId === req.params.id && item.customerId === user.customerId,
  );

  if (!reservation) {
    return res.status(404).json({ message: '预订记录不存在' });
  }

  reservation.status = 'canceled';
  return res.json({ success: true });
});

router.get('/checkins', (req, res) => {
  const user = requireUser(req, res, 'customer');
  if (!user) {
    return;
  }

  res.json(checkIns.filter((item) => item.customerId === user.customerId));
});

module.exports = router;
