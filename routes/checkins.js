const express = require('express');
const { checkIns, getNextId } = require('./mockData');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(checkIns.slice().reverse());
});

router.post('/', (req, res) => {
  const checkIn = {
    checkInId: getNextId('CHK', checkIns, 'checkInId'),
    checkInDate: new Date().toISOString(),
    checkOutDate: null,
    consumeAmount: 0,
    status: 'checked-in',
    ...req.body,
  };

  checkIns.push(checkIn);
  res.json(checkIn);
});

router.post('/:id/checkout', (req, res) => {
  const checkIn = checkIns.find((item) => item.checkInId === req.params.id);
  if (!checkIn) {
    return res.status(404).json({ message: '入住记录不存在' });
  }

  checkIn.status = 'checked-out';
  checkIn.checkOutDate = new Date().toISOString();
  return res.json({ success: true });
});

module.exports = router;
