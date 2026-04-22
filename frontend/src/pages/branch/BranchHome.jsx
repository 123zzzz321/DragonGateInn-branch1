import React, { useEffect, useState } from 'react';
import { ApartmentOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Typography, message } from 'antd';
import { getBranchDashboardData } from '../../services/branchService';

const { Title, Paragraph } = Typography;

function BranchHome() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDashboard(await getBranchDashboardData());
      } catch (error) {
        message.error(error.message || '获取分店概览失败');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <Title level={2}>分店工作台</Title>
          <Paragraph>这里汇总当前分店的房态、预订和入住情况，便于前台快速处理业务。</Paragraph>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="soft-card">
            <Statistic title="可用房间" value={dashboard?.availableRooms || 0} prefix={<ApartmentOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="soft-card">
            <Statistic title="待确认预订" value={dashboard?.pendingReservations || 0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="soft-card">
            <Statistic title="当前入住" value={dashboard?.todayCheckIns || 0} prefix={<TeamOutlined />} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default BranchHome;
