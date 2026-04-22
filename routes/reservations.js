const express = require('express');
const { getNextId, reservations } = require('./mockData');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(reservations.slice().reverse());
});

router.post('/', (req, res) => {
  const reservation = {
    reservationId: getNextId('RES', reservations, 'reservationId'),
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...req.body,
  };

  reservations.push(reservation);
  res.json(reservation);
});

router.put('/:id', (req, res) => {
  const reservation = reservations.find((item) => item.reservationId === req.params.id);
  if (!reservation) {
    return res.status(404).json({ message: '预订记录不存在' });
  }

  Object.assign(reservation, req.body);
  return res.json(reservation);
});

router.post('/:id/cancel', (req, res) => {
  const reservation = reservations.find((item) => item.reservationId === req.params.id);
  if (!reservation) {
    return res.status(404).json({ message: '预订记录不存在' });
  }

  reservation.status = 'canceled';
  return res.json({ success: true });
});

module.exports = router;
