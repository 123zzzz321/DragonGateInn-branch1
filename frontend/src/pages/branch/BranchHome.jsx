import React, { useCallback, useEffect, useState } from 'react';
import { ApartmentOutlined, DownloadOutlined, FileTextOutlined, PrinterOutlined, ReloadOutlined, TeamOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Card, Col, Empty, Row, Select, Space, Statistic, Tooltip as AntdTooltip, Typography } from 'antd';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';
import { getBranchDashboardData } from '../../services/branchService';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV, printReport } from '../../utils/exportUtils';

const { Title, Paragraph } = Typography;

const timeRangeOptions = [
  { label: '近7天', value: 7 },
  { label: '近15天', value: 15 },
  { label: '近30天', value: 30 },
];

function BranchHome() {
  const [dashboard, setDashboard] = useState(null);
  const [timeRange, setTimeRange] = useState(7);
  const [loading, setLoading] = useState(true);
  const { message } = AntdApp.useApp();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setDashboard(await getBranchDashboardData(timeRange));
    } catch (error) {
      message.error(error.message || '获取分店概览失败');
    } finally {
      setLoading(false);
    }
  }, [timeRange, message]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
    message.success('数据已刷新');
  };

  const handleExport = () => {
    if (!dashboard?.roomTypeRevenue) {
      message.warning('暂无数据可导出');
      return;
    }
    const columns = [
      { title: '房型', dataIndex: 'name' },
      { title: '收入', dataIndex: 'revenue' },
      { title: '预订数', dataIndex: 'count' },
    ];
    exportToCSV(dashboard.roomTypeRevenue, '房型收入报表', columns);
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
          <div class="stat-value">${dashboard.occupancyRate || 0}%</div>
          <div class="stat-label">入住率</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${dashboard.totalReservations || 0}</div>
          <div class="stat-label">总预订数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${dashboard.availableRooms || 0}</div>
          <div class="stat-label">可用房间</div>
        </div>
      </div>
    `;
    const tableRows = (dashboard.roomTypeRevenue || [])
      .map(
        (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${formatCurrency(item.revenue)}</td>
          <td>${item.count}</td>
        </tr>
      `
      )
      .join('');
    const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>房型</th>
            <th>收入</th>
            <th>预订数</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;
    printReport(`龙门店 - ${dashboard.branchInfo?.branchName || '分店'}经营报表`, statsHtml + tableHtml);
    message.success('正在打印...');
  };

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
          <Title level={2}>分店工作台</Title>
          <Paragraph>这里汇总当前分店的房态、预订和入住情况，便于前台快速处理业务。</Paragraph>
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
            <Statistic 
              title="入住率" 
              value={dashboard?.occupancyRate || 0} 
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
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic title="待确认预订" value={dashboard?.pendingReservations || 0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic title="总房间数" value={dashboard?.totalRooms || 0} prefix={<ApartmentOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic title="可用房间" value={dashboard?.availableRooms || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic title="已入住房间" value={dashboard?.occupiedRooms || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="soft-card" loading={loading}>
            <Statistic title="今日入住" value={dashboard?.todayCheckIns || 0} prefix={<TeamOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} lg={12}>
          <Card className="soft-card" title={`近${timeRange}天收入趋势`} loading={loading}>
            {dashboard?.dailyRevenue?.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={dashboard.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" name="收入" fill="#1f8f63" fillOpacity={0.3} stroke="#1f8f63" />
                  <Bar yAxisId="right" dataKey="checkIns" name="入住数" fill="#1890ff" radius={[4, 4, 0, 0]} />
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
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={dashboard.occupancyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="rate" name="入住率" stroke="#eb2f96" strokeWidth={2} dot={{ fill: '#eb2f96' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24}>
          <Card className="soft-card" title="房型收入分布" loading={loading}>
            {dashboard?.roomTypeRevenue?.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dashboard.roomTypeRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="revenue" name="收入" fill="#1f8f63" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="count" name="预订数" fill="#faad14" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default BranchHome;
