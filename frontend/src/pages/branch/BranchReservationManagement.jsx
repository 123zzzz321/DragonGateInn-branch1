import React, { useEffect, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Card, Select, Table, Tag, Typography } from 'antd';
import { cancelReservation, confirmReservation, getReservations } from '../../services/reservationService';
import {
  formatDate,
  formatRoomType,
  getReservationStatusColor,
  getReservationStatusText,
} from '../../utils/formatters';

const { Title, Paragraph } = Typography;

function BranchReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);
  const { message, modal } = AntdApp.useApp();

  const fetchReservations = async () => {
    setLoading(true);
    try {
      setReservations(await getReservations(status));
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [status]);

  const handleConfirm = (reservation) => {
    modal.confirm({
      title: '确认预订',
      icon: <ExclamationCircleOutlined />,
      content: `确定要确认客户 ${reservation.customerName} 的预订吗？房间 ${reservation.roomId} 将为其保留。`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await confirmReservation(reservation.reservationId);
          message.success('预订已确认');
          fetchReservations();
        } catch (error) {
          message.error(error.message);
        }
      },
    });
  };

  const handleCancel = (reservation) => {
    modal.confirm({
      title: '取消预订',
      icon: <ExclamationCircleOutlined />,
      content: `确定要取消客户 ${reservation.customerName} 的预订吗？此操作不可恢复。`,
      okText: '确认取消',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await cancelReservation(reservation.reservationId);
          message.success('预订已取消');
          fetchReservations();
        } catch (error) {
          message.error(error.message);
        }
      },
    });
  };

  const columns = [
    { title: '预订号', dataIndex: 'reservationId', key: 'reservationId' },
    { title: '客户', dataIndex: 'customerName', key: 'customerName' },
    { title: '房间号', dataIndex: 'roomId', key: 'roomId' },
    { title: '房型', dataIndex: 'roomType', key: 'roomType', render: formatRoomType },
    { title: '入住日期', dataIndex: 'checkInDate', key: 'checkInDate', render: formatDate },
    { title: '离店日期', dataIndex: 'checkOutDate', key: 'checkOutDate', render: formatDate },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value) => <Tag color={getReservationStatusColor(value)}>{getReservationStatusText(value)}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) =>
        record.status === 'pending' ? (
          <div className="table-actions">
            <Button type="link" onClick={() => handleConfirm(record)}>
              确认
            </Button>
            <Button type="link" danger onClick={() => handleCancel(record)}>
              取消
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <Title level={2}>预订处理</Title>
          <Paragraph>确认或取消预订后，客户端“我的预订”页面会同步更新。</Paragraph>
        </div>
        <Select
          allowClear
          placeholder="筛选状态"
          style={{ width: 180 }}
          value={status}
          onChange={setStatus}
          options={[
            { label: '待确认', value: 'pending' },
            { label: '已确认', value: 'confirmed' },
            { label: '已取消', value: 'canceled' },
          ]}
        />
      </div>

      <Card className="soft-card">
        <Table rowKey="reservationId" columns={columns} dataSource={reservations} loading={loading} />
      </Card>
    </div>
  );
}

export default BranchReservationManagement;
