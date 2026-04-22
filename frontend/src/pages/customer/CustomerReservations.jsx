import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Modal, Table, Tag, Typography, message } from 'antd';
import { cancelReservation, getMyReservations } from '../../services/customerService';
import {
  formatDate,
  formatDateTime,
  formatRoomType,
  getReservationStatusColor,
  getReservationStatusText,
} from '../../utils/formatters';

const { Title, Paragraph } = Typography;

function CustomerReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      setReservations(await getMyReservations());
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (reservationId) => {
    try {
      await cancelReservation(reservationId);
      message.success('预订已取消');
      fetchReservations();
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    { title: '预订号', dataIndex: 'reservationId', key: 'reservationId' },
    { title: '分店', dataIndex: 'branchName', key: 'branchName' },
    { title: '房间号', dataIndex: 'roomId', key: 'roomId' },
    { title: '入住日期', dataIndex: 'checkInDate', key: 'checkInDate', render: formatDate },
    { title: '离店日期', dataIndex: 'checkOutDate', key: 'checkOutDate', render: formatDate },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getReservationStatusColor(status)}>{getReservationStatusText(status)}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div className="table-actions">
          <Button type="link" onClick={() => setCurrentReservation(record)}>
            查看详情
          </Button>
          {record.status === 'pending' ? (
            <Button type="link" danger onClick={() => handleCancel(record.reservationId)}>
              取消预订
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <Title level={2}>我的预订</Title>
          <Paragraph>这里展示客户侧的所有预订记录，分店确认或取消后会在这里实时体现。</Paragraph>
        </div>
      </div>

      <Card className="soft-card">
        <Table rowKey="reservationId" columns={columns} dataSource={reservations} loading={loading} />
      </Card>

      <Modal
        title="预订详情"
        open={Boolean(currentReservation)}
        onCancel={() => setCurrentReservation(null)}
        footer={null}
      >
        {currentReservation ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="预订号">{currentReservation.reservationId}</Descriptions.Item>
            <Descriptions.Item label="分店">{currentReservation.branchName}</Descriptions.Item>
            <Descriptions.Item label="房间号">{currentReservation.roomId}</Descriptions.Item>
            <Descriptions.Item label="房型">{formatRoomType(currentReservation.roomType)}</Descriptions.Item>
            <Descriptions.Item label="入住日期">{formatDate(currentReservation.checkInDate)}</Descriptions.Item>
            <Descriptions.Item label="离店日期">{formatDate(currentReservation.checkOutDate)}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{formatDateTime(currentReservation.createdAt)}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={getReservationStatusColor(currentReservation.status)}>
                {getReservationStatusText(currentReservation.status)}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>
    </div>
  );
}

export default CustomerReservations;
