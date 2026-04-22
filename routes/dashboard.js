const express = require('express');
const { branches, checkIns, reservations, rooms } = require('./mockData');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    totalRooms: rooms.length,
    availableRooms: rooms.filter((room) => room.isAvailable && room.isEmpty).length,
    occupiedRooms: rooms.filter((room) => !room.isEmpty).length,
    pendingReservations: reservations.filter((item) => item.status === 'pending').length,
    checkIns: checkIns.filter((item) => item.status === 'checked-in').length,
    branchCount: branches.length,
    recentReservations: reservations.slice(-5).reverse(),
    recentCheckIns: checkIns.slice(-5).reverse(),
  });
});

module.exports = router;
