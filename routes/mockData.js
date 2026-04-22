const users = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    email: 'admin@dragongateinn.test',
    accountType: 'headquarter',
    status: 'active',
  },
  {
    id: 2,
    username: 'branch1',
    password: '123456',
    email: 'branch1@dragongateinn.test',
    accountType: 'branch',
    status: 'active',
    branchId: 'BR001',
  },
  {
    id: 3,
    username: 'user1',
    password: '123456',
    email: 'user1@dragongateinn.test',
    accountType: 'customer',
    status: 'active',
    customerId: 'CUST001',
    customerName: '张三',
    customerPhone: '13800138000',
  },
];

const branches = [
  { branchId: 'BR001', branchName: '北京分店', address: '北京市朝阳区', phone: '010-12345678', status: 'active' },
  { branchId: 'BR002', branchName: '上海分店', address: '上海市浦东新区', phone: '021-12345678', status: 'active' },
  { branchId: 'BR003', branchName: '广州分店', address: '广州市天河区', phone: '020-12345678', status: 'active' },
];

const rooms = [
  {
    roomId: '101',
    branchId: 'BR001',
    roomType: { area: 20, windowBool: true, bedType: { typeString: '大床', numInt: 1 } },
    price: 200,
    isAvailable: true,
    isEmpty: true,
  },
  {
    roomId: '102',
    branchId: 'BR001',
    roomType: { area: 30, windowBool: true, bedType: { typeString: '双床', numInt: 2 } },
    price: 320,
    isAvailable: true,
    isEmpty: false,
  },
  {
    roomId: '201',
    branchId: 'BR002',
    roomType: { area: 25, windowBool: true, bedType: { typeString: '大床', numInt: 1 } },
    price: 260,
    isAvailable: true,
    isEmpty: true,
  },
  {
    roomId: '202',
    branchId: 'BR002',
    roomType: { area: 35, windowBool: true, bedType: { typeString: '套房', numInt: 2 } },
    price: 420,
    isAvailable: true,
    isEmpty: true,
  },
  {
    roomId: '301',
    branchId: 'BR003',
    roomType: { area: 22, windowBool: false, bedType: { typeString: '大床', numInt: 1 } },
    price: 180,
    isAvailable: true,
    isEmpty: false,
  },
  {
    roomId: '302',
    branchId: 'BR003',
    roomType: { area: 40, windowBool: true, bedType: { typeString: '双床', numInt: 2 } },
    price: 400,
    isAvailable: true,
    isEmpty: true,
  },
];

const reservations = [
  {
    reservationId: 'RES001',
    customerId: 'CUST001',
    customerName: '张三',
    customerPhone: '13800138000',
    branchId: 'BR001',
    roomId: '101',
    roomType: rooms[0].roomType,
    checkInDate: '2026-04-25',
    checkOutDate: '2026-04-27',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    reservationId: 'RES002',
    customerId: 'CUST002',
    customerName: '李四',
    customerPhone: '13800138001',
    branchId: 'BR002',
    roomId: '201',
    roomType: rooms[2].roomType,
    checkInDate: '2026-04-28',
    checkOutDate: '2026-04-30',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
];

const checkIns = [
  {
    checkInId: 'CHK001',
    customerId: 'CUST001',
    customerName: '张三',
    branchId: 'BR001',
    roomId: '102',
    reservationId: null,
    persons: [{ name: '张三', identityCard: '110101199001011234' }],
    checkInDate: new Date().toISOString(),
    checkOutDate: null,
    consumeAmount: 0,
    status: 'checked-in',
  },
];

const getBranchById = (branchId) => branches.find((branch) => branch.branchId === branchId);

const getRoomById = (roomId, branchId) =>
  rooms.find((room) => room.roomId === roomId && (!branchId || room.branchId === branchId));

const getBranchName = (branchId) => getBranchById(branchId)?.branchName || '';

const getNextId = (prefix, collection, field) =>
  `${prefix}${String(collection.length + 1).padStart(3, '0')}`;

const getUserFromRequest = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !token.startsWith('mock-token-')) {
    return null;
  }

  const userId = Number(token.replace('mock-token-', ''));
  return users.find((user) => user.id === userId) || null;
};

const requireUser = (req, res, expectedType) => {
  const user = getUserFromRequest(req);

  if (!user || user.status !== 'active') {
    res.status(401).json({ message: '未授权访问' });
    return null;
  }

  if (expectedType && user.accountType !== expectedType) {
    res.status(403).json({ message: '无权限访问此资源' });
    return null;
  }

  return user;
};

const toPublicUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  accountType: user.accountType,
  status: user.status,
  branchId: user.branchId || null,
  customerId: user.customerId || null,
  customerName: user.customerName || user.username,
  customerPhone: user.customerPhone || '',
});

module.exports = {
  users,
  branches,
  rooms,
  reservations,
  checkIns,
  getBranchById,
  getRoomById,
  getBranchName,
  getNextId,
  getUserFromRequest,
  requireUser,
  toPublicUser,
};
