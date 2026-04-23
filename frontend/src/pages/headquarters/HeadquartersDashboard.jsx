import React, { useCallback, useEffect, useState } from 'react';
import { DownloadOutlined, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Card, Col, Empty, Progress, Row, Select, Space, Statistic, Table, Tooltip as AntdTooltip, Typography } from 'antd';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';
import { getHeadquartersDashboardData } from '../../services/headquartersService';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { exportToCSV, printReport } from '../../utils/exportUtils';

const { Title, Paragraph } = Typography;

const COLORS = ['#1f8f63', '#52c41a', '#1890ff', '#faad14', '#eb2f96'];

const timeRangeOptions = [
  { label: '近7天', value: 7 },
  { label: '近15天', value: 15 },
  { label: '近30天', value: 30 },
  { label: '近90天', value: 90 },
];

function HeadquartersDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [branchId, setBranchId] = useState();
  const [timeRange, setTimeRange] = useState(7);
  const [loading, setLoading] = useState(true);
  const { message } = AntdApp.useApp();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      setDashboard(await getHeadquartersDashboardData(branchId, timeRange));
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [branchId, timeRange, message]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleRefresh = () => {
    fetchDashboard();
    message.success('数据已刷新');
  };

  const handleExport = () => {
    if (!dashboard?.branchStats) {
      message.warning('暂无数据可导出');
      return;
    }
    const columns = [
      { title: '分店名称', dataIndex: 'branchName' },
      { title: '总房间数', dataIndex: 'totalRooms' },
      { title: '可用房间', dataIndex: 'availableRooms' },
      { title: '入住中', dataIndex: 'occupiedRooms' },
      { title: '入住率(%)', dataIndex: 'occupancyRate' },
      { title: '待确认预订', dataIndex: 'pendingReservations' },
    ];
    exportToCSV(dashboard.branchStats, '分店经营报表', columns);
    message.success('导出成功');
  };

  const handlePrint = () => {
    if (!dashboard) {
      message.warning('暂无数据可打印');
      return;
    }
    const statsHtml = `
      <div class="stat-row">
        <div class="stat-item">
          <div class="stat-value">${formatCurrency(dashboard.totalRevenue || 0)}</div>
          <div class="stat-label">总收入</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${dashboard.branchCount || 0}</div>
          <div class="stat-label">分店数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${dashboard.avgOccupancyRate || 0}%</div>
          <div class="stat-label">平均入住率</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${dashboard.totalReservations || 0}</div>
          <div class="stat-label">总预订数</div>
        </div>
      </div>
    `;
    const tableRows = (dashboard.branchStats || [])
      .map(
        (item) => `
        <tr>
          <td>${item.branchName}</td>
          <td>${item.totalRooms}</td>
          <td>${item.availableRooms}</td>
          <td>${item.occupiedRooms}</td>
          <td>${item.occupancyRate}%</td>
          <td>${item.pendingReservations}</td>
        </tr>
      `
      )
      .join('');
    const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>分店名称</th>
            <th>总房间数</th>
            <th>可用房间</th>
            <th>入住中</th>
            <th>入住率</th>
            <th>待确认预订</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;
    printReport('龙门店 - 总部经营报表', statsHtml + tableHtml);
    message.success('正在打印...');
  };

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

  const hasRecentActivity = (dashboard?.recentReservations?.length > 0 || dashboard?.recentCheckIns?.length > 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: 0, color: entry.color }}>
              {entry.name}: {entry.name.includes('收入') || entry.name.includes('revenue') ? formatCurrency(entry.value) : entry.value + (entry.name.includes('率') ? '%' : '')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <Title level={2}>总部概览</Title>
          <Paragraph>统计面板、分店管理和账户管理现在都基于统一 mock 数据，字段不再互相冲突。</Paragraph>
        </div>
        <Space>
          <AntdTooltip title="刷新数据">
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} />
          </AntdTooltip>
          <AntdTooltip title="导出报表">
            <Button icon={<DownloadOutlined />} onClick={handleExport} />
          </AntdTooltip>
          <AntdTooltip title="打印报表">
            <Button icon={<PrinterOutlined />} onClick={handlePrint} />
          </AntdTooltip>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ width: 120 }}
            options={timeRangeOptions}
          />
          <Select
            allowClear
            placeholder="按分店筛选"
            style={{ width: 180 }}
            value={branchId}
            onChange={setBranchId}
            loading={loading}
            options={(dashboard?.branchStats || []).map((item) => ({
              label: item.branchName,
              value: item.branchId,
            }))}
          />
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic 
              title="总收入" 
              value={dashboard?.totalRevenue || 0} 
              prefix="¥" 
              valueStyle={{ color: '#1f8f63' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic title="分店数" value={dashboard?.branchCount || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic 
              title="平均入住率" 
              value={dashboard?.avgOccupancyRate || 0} 
              suffix="%" 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic title="总预订数" value={dashboard?.totalReservations || 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic title="总房间数" value={dashboard?.totalRooms || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic title="可用房间" value={dashboard?.availableRooms || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic title="在住人数" value={dashboard?.totalCheckIns || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic title="待确认预订" value={dashboard?.pendingReservations || 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} lg={12}>
          <Card className="soft-card" title="月度收入趋势" loading={loading}>
            {dashboard?.monthlyRevenue?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={dashboard.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="今年收入" fill="#1f8f63" fillOpacity={0.3} stroke="#1f8f63" />
                  <Line type="monotone" dataKey="lastYear" name="去年收入" stroke="#faad14" strokeDasharray="5 5" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="soft-card" title={`入住率趋势（近${timeRange}天）`} loading={loading}>
            {dashboard?.occupancyTrend?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dashboard.occupancyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="rate" name="入住率" stroke="#1890ff" strokeWidth={2} dot={{ fill: '#1890ff' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} lg={12}>
          <Card className="soft-card" title="分店收入对比" loading={loading}>
            {dashboard?.branchRevenue?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dashboard.branchRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="revenue" name="收入" fill="#1f8f63" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="soft-card" title="最近预订 / 入住" loading={loading}>
            {hasRecentActivity ? (
              <div className="summary-list" style={{ maxHeight: 250, overflow: 'auto' }}>
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
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无最近活动" />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24}>
          <Card className="soft-card" title="分店经营情况" loading={loading}>
            {(dashboard?.branchStats?.length > 0) ? (
              <Table rowKey="branchId" columns={branchColumns} dataSource={dashboard.branchStats} pagination={false} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无分店数据" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HeadquartersDashboard;
