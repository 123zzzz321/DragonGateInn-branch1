import React, { useEffect, useState } from 'react';
import { Card, Col, Progress, Row, Select, Statistic, Table, Typography, message } from 'antd';
import { getHeadquartersDashboardData } from '../../services/headquartersService';
import { formatDateTime } from '../../utils/formatters';

const { Title, Paragraph } = Typography;

function HeadquartersDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [branchId, setBranchId] = useState();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setDashboard(await getHeadquartersDashboardData(branchId));
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchDashboard();
  }, [branchId]);

  const branchColumns = [
    { title: '分店', dataIndex: 'branchName', key: 'branchName' },
    { title: '总房间', dataIndex: 'totalRooms', key: 'totalRooms' },
    { title: '可用', dataIndex: 'availableRooms', key: 'availableRooms' },
    { title: '入住中', dataIndex: 'occupiedRooms', key: 'occupiedRooms' },
    {
      title: '入住率',
      dataIndex: 'occupancyRate',
      key: 'occupancyRate',
      render: (value) => <Progress percent={value} size="small" />,
    },
    { title: '待确认预订', dataIndex: 'pendingReservations', key: 'pendingReservations' },
  ];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <Title level={2}>总部概览</Title>
          <Paragraph>统计面板、分店管理和账户管理现在都基于统一 mock 数据，字段不再互相冲突。</Paragraph>
        </div>
        <Select
          allowClear
          placeholder="按分店筛选"
          style={{ width: 220 }}
          value={branchId}
          onChange={setBranchId}
          options={(dashboard?.branchStats || []).map((item) => ({
            label: item.branchName,
            value: item.branchId,
          }))}
        />
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card className="soft-card">
            <Statistic title="分店数" value={dashboard?.branchCount || 0} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="soft-card">
            <Statistic title="总房间数" value={dashboard?.totalRooms || 0} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="soft-card">
            <Statistic title="可用房间" value={dashboard?.availableRooms || 0} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="soft-card">
            <Statistic title="在住人数" value={dashboard?.totalCheckIns || 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} xl={14}>
          <Card className="soft-card" title="分店经营情况">
            <Table rowKey="branchId" columns={branchColumns} dataSource={dashboard?.branchStats || []} pagination={false} />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card className="soft-card" title="最近预订 / 入住">
            <div className="summary-list">
              {(dashboard?.recentReservations || []).map((item) => (
                <div key={item.reservationId} className="summary-item">
                  <strong>{item.branchName}</strong>
                  <span>{item.customerName} · 预订 {item.roomId}</span>
                  <span>{formatDateTime(item.createdAt)}</span>
                </div>
              ))}
              {(dashboard?.recentCheckIns || []).map((item) => (
                <div key={item.checkInId} className="summary-item">
                  <strong>{item.branchName}</strong>
                  <span>{item.customerName} · 入住 {item.roomId}</span>
                  <span>{formatDateTime(item.checkInDate)}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HeadquartersDashboard;
