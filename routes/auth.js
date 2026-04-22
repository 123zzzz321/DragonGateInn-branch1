const express = require('express');
const { getNextId, requireUser, toPublicUser, users } = require('./mockData');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password, accountType } = req.body;

  const user = users.find(
    (item) =>
      item.username === username &&
      item.password === password &&
      item.accountType === accountType &&
      item.status === 'active',
  );

  if (!user) {
    return res.status(401).json({ message: '用户名、密码或账户类型错误' });
  }

  return res.json({
    ...toPublicUser(user),
    token: `mock-token-${user.id}`,
  });
});

router.post('/register', (req, res) => {
  const { username, password, accountType } = req.body;

  if (!username || !password || !accountType) {
    return res.status(400).json({ message: '请填写完整注册信息' });
  }

  if (users.some((item) => item.username === username)) {
    return res.status(400).json({ message: '用户名已存在' });
  }

  const id = Number(getNextId('', users, 'id')) || users.length + 1;
  const newUser = {
    id,
    username,
    password,
    email: `${username}@dragongateinn.test`,
    accountType,
    status: 'active',
  };

  if (accountType === 'customer') {
    newUser.customerId = `CUST${String(id).padStart(3, '0')}`;
    newUser.customerName = username;
    newUser.customerPhone = '';
  }

  users.push(newUser);
  return res.json({ message: '注册成功' });
});

router.post('/logout', (_req, res) => {
  res.json({ message: '退出成功' });
});

router.get('/me', (req, res) => {
  const user = requireUser(req, res);
  if (!user) {
    return;
  }

  res.json({
    ...toPublicUser(user),
    token: `mock-token-${user.id}`,
  });
});

module.exports = router;
