import React, { useEffect, useMemo, useState } from 'react';
import {
  ApartmentOutlined,
  DashboardOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge, Button, ConfigProvider, Drawer, Layout, Menu, Spin, Typography, message } from 'antd';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import BranchCheckInManagement from './pages/branch/BranchCheckInManagement';
import BranchHome from './pages/branch/BranchHome';
import BranchReservationManagement from './pages/branch/BranchReservationManagement';
import BranchRoomManagement from './pages/branch/BranchRoomManagement';
import CustomerBrowseRooms from './pages/customer/CustomerBrowseRooms';
import CustomerHome from './pages/customer/CustomerHome';
import CustomerReservations from './pages/customer/CustomerReservations';
import HeadquartersAccountManagement from './pages/headquarters/HeadquartersAccountManagement';
import HeadquartersBranchManagement from './pages/headquarters/HeadquartersBranchManagement';
import HeadquartersDashboard from './pages/headquarters/HeadquartersDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { getCurrentUser, logout } from './services/authService';
import useStore from './store/useStore';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const roleMenus = {
  customer: [
    { key: '/customer/home', label: '首页', icon: <HomeOutlined /> },
    { key: '/customer/browse-rooms', label: '浏览房间', icon: <ApartmentOutlined /> },
    { key: '/customer/reservations', label: '我的预订', icon: <FileTextOutlined /> },
  ],
  branch: [
    { key: '/branch/home', label: '工作台', icon: <HomeOutlined /> },
    { key: '/branch/room-management', label: '房间管理', icon: <ApartmentOutlined /> },
    { key: '/branch/reservation-management', label: '预订处理', icon: <FileTextOutlined /> },
    { key: '/branch/checkin-management', label: '入住管理', icon: <TeamOutlined /> },
  ],
  headquarter: [
    { key: '/headquarters/dashboard', label: '经营概览', icon: <DashboardOutlined /> },
    { key: '/headquarters/branch-management', label: '分店管理', icon: <ApartmentOutlined /> },
    { key: '/headquarters/account-management', label: '账户管理', icon: <UserOutlined /> },
  ],
};

const roleTitles = {
  customer: 'Dragon Gate Inn 客户中心',
  branch: 'Dragon Gate Inn 分店后台',
  headquarter: 'Dragon Gate Inn 总部后台',
};

function AppShell({ isMobile, menuOpen, setMenuOpen, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = roleMenus[user.accountType] || [];
  const activeKey = items.find((item) => location.pathname.startsWith(item.key))?.key || items[0]?.key;

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={activeKey ? [activeKey] : []}
      items={items}
      onClick={({ key }) => {
        navigate(key);
        setMenuOpen(false);
      }}
      style={{ height: '100%', borderInlineEnd: 0 }}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="app-header">
        <div className="app-brand">
          {isMobile ? <Button type="text" icon={<MenuOutlined />} onClick={() => setMenuOpen(true)} /> : null}
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {roleTitles[user.accountType]}
            </Title>
            <Text type="secondary">模拟数据已统一，页面操作会同步反映到对应接口。</Text>
          </div>
        </div>
        <div className="app-user">
          <Badge color="#1f8f63" text={user.username} />
          <Button icon={<LogoutOutlined />} onClick={onLogout}>
            退出登录
          </Button>
        </div>
      </Header>

      <Layout>
        {!isMobile ? (
          <Sider width={240} theme="light" className="app-sider">
            {menu}
          </Sider>
        ) : null}
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>

      <Drawer
        title="导航菜单"
        placement="left"
        width={260}
        onClose={() => setMenuOpen(false)}
        open={isMobile && menuOpen}
        bodyStyle={{ padding: 0 }}
      >
        {menu}
      </Drawer>
    </Layout>
  );
}

function ProtectedRoute({ requiredRole }) {
  const user = useStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.accountType !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const clearUser = useStore((state) => state.clearUser);

  useEffect(() => {
    const bootstrap = async () => {
      const currentUser = useStore.getState().user;
      if (!currentUser?.token) {
        setLoading(false);
        return;
      }

      try {
        const nextUser = await getCurrentUser();
        setUser(nextUser);
      } catch {
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [clearUser, setUser]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      message.success('已退出登录');
    } catch (error) {
      message.error(error.message);
    }
  };

  const homeRedirect = useMemo(() => {
    if (!user) {
      return '/login';
    }
    return {
      customer: '/customer/home',
      branch: '/branch/home',
      headquarter: '/headquarters/dashboard',
    }[user.accountType];
  }, [user]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text type="secondary">正在检查登录状态...</Text>
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1f8f63',
          borderRadius: 14,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute requiredRole="customer" />}>
            <Route element={<AppShell isMobile={isMobile} menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} onLogout={handleLogout} />}>
              <Route path="/customer/home" element={<CustomerHome />} />
              <Route path="/customer/browse-rooms" element={<CustomerBrowseRooms />} />
              <Route path="/customer/reservations" element={<CustomerReservations />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute requiredRole="branch" />}>
            <Route element={<AppShell isMobile={isMobile} menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} onLogout={handleLogout} />}>
              <Route path="/branch/home" element={<BranchHome />} />
              <Route path="/branch/room-management" element={<BranchRoomManagement />} />
              <Route path="/branch/reservation-management" element={<BranchReservationManagement />} />
              <Route path="/branch/checkin-management" element={<BranchCheckInManagement />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute requiredRole="headquarter" />}>
            <Route element={<AppShell isMobile={isMobile} menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user} onLogout={handleLogout} />}>
              <Route path="/headquarters/dashboard" element={<HeadquartersDashboard />} />
              <Route path="/headquarters/branch-management" element={<HeadquartersBranchManagement />} />
              <Route path="/headquarters/account-management" element={<HeadquartersAccountManagement />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to={homeRedirect || '/login'} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
