import React, { useEffect, useState } from 'react';
import { ApartmentOutlined, FileTextOutlined, RiseOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row, Statistic, Table, Typography, message } from 'antd';
import { Link } from 'react-router-dom';
import { getCustomerDashboard } from '../../services/customerService';
import { formatDate, getReservationStatusColor, getReservationStatusText } from '../../utils/formatters';

const { Title, Paragraph } = Typography;

function CustomerHome() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setDashboard(await getCustomerDashboard());
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchDashboard();
  }, []);

  const columns = [
    { title: '预订号', dataIndex: 'reservationId', key: 'reservationId' },
    { title: '分店', dataIndex: 'branchName', key: 'branchName' },
    { title: '入住日期', dataIndex: 'checkInDate', key: 'checkInDate', render: formatDate },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <span style={{ color: status === 'confirmed' ? '#1f8f63' : '#b7791f' }}>{getReservationStatusText(status)}</span>,
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <Title level={2}>客户首页</Title>
          <Paragraph>这里汇总你的预订和入住状态，数据来自同一套后端 mock 存储。</Paragraph>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="soft-card">
            <Statistic title="累计预订" value={dashboard?.totalReservations || 0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="soft-card">
            <Statistic title="有效预订" value={dashboard?.activeReservations || 0} prefix={<RiseOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="soft-card">
            <Statistic title="入住记录" value={dashboard?.totalCheckIns || 0} prefix={<ApartmentOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} md={10}>
          <Card className="soft-card" title="快捷操作">
            <div className="cta-stack">
              <Link to="/customer/browse-rooms">
                <Button type="primary" block size="large">
                  立即浏览房间
                </Button>
              </Link>
              <Link to="/customer/reservations">
                <Button block size="large">
                  查看我的预订
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={14}>
          <Card className="soft-card" title="最近预订">
            {dashboard?.recentReservations?.length ? (
              <Table columns={columns} dataSource={dashboard.recentReservations} rowKey="reservationId" pagination={false} />
            ) : (
              <Empty description="暂时还没有预订记录" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CustomerHome;
