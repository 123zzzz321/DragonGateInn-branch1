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

function generateMonthlyRevenue(timeRange = 12) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const displayMonths = months.slice(-timeRange);
  return displayMonths.map((month, index) => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 30000,
    lastYear: Math.floor(Math.random() * 40000) + 25000,
  }));
}

function generateOccupancyTrend(timeRange = 7) {
  const days = [];
  for (let i = timeRange - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      rate: Math.floor(Math.random() * 30) + 60,
    });
  }
  return days;
}

function generateBranchRevenue() {
  return branches.map((branch) => ({
    name: branch.branchName.replace('分店', ''),
    revenue: Math.floor(Math.random() * 80000) + 40000,
    rooms: rooms.filter((r) => r.branchId === branch.branchId).length,
  }));
}

function calculateTotalRevenue(timeRange = 30) {
  let total = 0;
  for (let i = 0; i < timeRange; i++) {
    total += Math.floor(Math.random() * 15000) + 5000;
  }
  return total;
}

router.get('/dashboard', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  const { branchId, timeRange = 7 } = req.query;
  const timeRangeNum = parseInt(timeRange, 10) || 7;
  const scopedRooms =
    branchId && branchId !== 'all' ? rooms.filter((room) => room.branchId === branchId) : rooms;
  const scopedReservations =
    branchId && branchId !== 'all'
      ? reservations.filter((item) => item.branchId === branchId)
      : reservations;
  const scopedCheckIns =
    branchId && branchId !== 'all'
      ? checkIns.filter((item) => item.branchId === branchId)
      : checkIns;

  const branchStats = branches.map((branch) => {
    const branchRooms = rooms.filter((room) => room.branchId === branch.branchId);
    const totalRooms = branchRooms.length;
    const occupiedRooms = branchRooms.filter((room) => !room.isEmpty).length;

    return {
      branchId: branch.branchId,
      branchName: branch.branchName,
      totalRooms,
      availableRooms: branchRooms.filter((room) => room.isAvailable && room.isEmpty).length,
      occupiedRooms,
      occupancyRate: totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
      pendingReservations: reservations.filter(
        (item) => item.branchId === branch.branchId && item.status === 'pending',
      ).length,
      currentCheckIns: checkIns.filter(
        (item) => item.branchId === branch.branchId && item.status === 'checked-in',
      ).length,
    };
  });

  res.json({
    totalRooms: scopedRooms.length,
    availableRooms: scopedRooms.filter((room) => room.isAvailable && room.isEmpty).length,
    occupiedRooms: scopedRooms.filter((room) => !room.isEmpty).length,
    pendingReservations: scopedReservations.filter((item) => item.status === 'pending').length,
    totalCheckIns: scopedCheckIns.filter((item) => item.status === 'checked-in').length,
    branchCount: branches.length,
    branchStats,
    recentReservations: scopedReservations.slice(-5).reverse(),
    recentCheckIns: scopedCheckIns.slice(-5).reverse(),
    monthlyRevenue: generateMonthlyRevenue(timeRangeNum > 30 ? 12 : 6),
    occupancyTrend: generateOccupancyTrend(timeRangeNum),
    branchRevenue: generateBranchRevenue(),
    totalRevenue: calculateTotalRevenue(timeRangeNum),
    totalReservations: scopedReservations.length,
    avgOccupancyRate: scopedRooms.length > 0 
      ? Math.round((scopedRooms.filter((room) => !room.isEmpty).length / scopedRooms.length) * 100) 
      : 0,
  });
});

router.get('/branches', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  res.json(branches);
});

router.post('/branches', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  const branch = {
    branchId: getNextId('BR', branches, 'branchId'),
    branchName: req.body.branchName,
    address: req.body.address,
    phone: req.body.phone,
    status: req.body.status || 'active',
  };

  branches.push(branch);
  res.json(branch);
});

router.put('/branches/:id', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  const branch = branches.find((item) => item.branchId === req.params.id);
  if (!branch) {
    return res.status(404).json({ message: '分店不存在' });
  }

  Object.assign(branch, req.body);
  return res.json(branch);
});

router.post('/branches/:id/disable', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  const branch = branches.find((item) => item.branchId === req.params.id);
  if (!branch) {
    return res.status(404).json({ message: '分店不存在' });
  }

  branch.status = 'inactive';
  return res.json({ success: true });
});

router.get('/rooms', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  const { branchId, status } = req.query;
  let data = rooms.slice();

  if (branchId) {
    data = data.filter((room) => room.branchId === branchId);
  }

  if (status === 'available') {
    data = data.filter((room) => room.isAvailable && room.isEmpty);
  } else if (status === 'occupied') {
    data = data.filter((room) => !room.isEmpty);
  }

  res.json(
    data.map((room) => ({
      ...room,
      branchName: getBranchName(room.branchId),
    })),
  );
});

router.get('/reservations', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  const { branchId, status } = req.query;
  let data = reservations.slice();

  if (branchId) {
    data = data.filter((item) => item.branchId === branchId);
  }
  if (status) {
    data = data.filter((item) => item.status === status);
  }

  res.json(data.reverse());
});

router.get('/checkins', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  const { branchId, status } = req.query;
  let data = checkIns.slice();

  if (branchId) {
    data = data.filter((item) => item.branchId === branchId);
  }
  if (status) {
    data = data.filter((item) => item.status === status);
  }

  res.json(data.reverse());
});

module.exports = router;
