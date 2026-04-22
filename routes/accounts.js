const express = require('express');
const { requireUser, toPublicUser, users } = require('./mockData');

const router = express.Router();

router.get('/', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  res.json(users.map(toPublicUser));
});

router.post('/', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  const { username, password, email, accountType, status = 'active' } = req.body;

  if (!username || !password || !accountType) {
    return res.status(400).json({ message: '请填写完整账户信息' });
  }

  if (users.some((item) => item.username === username)) {
    return res.status(400).json({ message: '用户名已存在' });
  }

  const id = users.length + 1;
  const newUser = {
    id,
    username,
    password,
    email: email || `${username}@dragongateinn.test`,
    accountType,
    status,
  };

  if (accountType === 'customer') {
    newUser.customerId = `CUST${String(id).padStart(3, '0')}`;
    newUser.customerName = username;
    newUser.customerPhone = '';
  }

  if (accountType === 'branch') {
    newUser.branchId = `BR${String(id).padStart(3, '0')}`;
  }

  users.push(newUser);
  res.json(toPublicUser(newUser));
});

router.put('/:id', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  const index = users.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: '账户不存在' });
  }

  const current = users[index];
  users[index] = {
    ...current,
    username: req.body.username ?? current.username,
    password: req.body.password || current.password,
    email: req.body.email ?? current.email,
    accountType: req.body.accountType ?? current.accountType,
    status: req.body.status ?? current.status,
  };

  return res.json(toPublicUser(users[index]));
});

router.post('/:id/deactivate', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  const account = users.find((item) => item.id === Number(req.params.id));
  if (!account) {
    return res.status(404).json({ message: '账户不存在' });
  }

  account.status = 'disabled';
  return res.json({ success: true });
});

router.put('/:id/enable', (req, res) => {
  const user = requireUser(req, res, 'headquarter');
  if (!user) {
    return;
  }

  const account = users.find((item) => item.id === Number(req.params.id));
  if (!account) {
    return res.status(404).json({ message: '账户不存在' });
  }

  account.status = 'active';
  return res.json({ success: true });
});

module.exports = router;
