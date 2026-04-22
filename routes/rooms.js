const express = require('express');
const { getBranchName, rooms } = require('./mockData');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(
    rooms.map((room) => ({
      ...room,
      branchName: getBranchName(room.branchId),
    })),
  );
});

router.post('/', (req, res) => {
  const room = {
    ...req.body,
    isAvailable: req.body.isAvailable ?? true,
    isEmpty: req.body.isEmpty ?? true,
  };

  rooms.push(room);
  res.json(room);
});

router.put('/:id', (req, res) => {
  const room = rooms.find((item) => item.roomId === req.params.id);
  if (!room) {
    return res.status(404).json({ message: '房间不存在' });
  }

  Object.assign(room, req.body);
  return res.json(room);
});

router.delete('/:id', (req, res) => {
  const index = rooms.findIndex((item) => item.roomId === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '房间不存在' });
  }

  rooms.splice(index, 1);
  return res.json({ success: true });
});

module.exports = router;
