const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// API路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/checkins', require('./routes/checkins'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/headquarters', require('./routes/headquarters'));
app.use('/api/branch', require('./routes/branch'));
app.use('/api/customer', require('./routes/customer'));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// 前端路由 fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
