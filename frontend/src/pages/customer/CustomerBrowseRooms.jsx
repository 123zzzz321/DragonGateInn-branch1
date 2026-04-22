import React, { useEffect, useMemo, useState } from 'react';
import { BankOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Empty, Form, Modal, Row, Select, Space, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { createReservation, getAllBranches, getAvailableRooms } from '../../services/customerService';
import { formatCurrency, formatRoomType } from '../../utils/formatters';

const { RangePicker } = DatePicker;
const { Title, Paragraph, Text } = Typography;

function CustomerBrowseRooms() {
  const [branches, setBranches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
  const [loading, setLoading] = useState(false);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranches(await getAllBranches());
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchChange = async (branchId) => {
    setSelectedBranch(branchId);
    setRooms([]);
    if (!branchId) {
      return;
    }

    setLoading(true);
    try {
      setRooms(await getAvailableRooms(branchId));
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedBranchInfo = useMemo(
    () => branches.find((branch) => branch.branchId === selectedBranch),
    [branches, selectedBranch],
  );

  const handleSubmit = async (values) => {
    try {
      await createReservation({
        branchId: selectedBranch,
        roomId: bookingRoom.roomId,
        checkInDate: values.dates[0].format('YYYY-MM-DD'),
        checkOutDate: values.dates[1].format('YYYY-MM-DD'),
      });
      message.success('预订成功，等待分店确认');
      setBookingRoom(null);
      form.resetFields();
      handleBranchChange(selectedBranch);
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <Title level={2}>浏览房间</Title>
          <Paragraph>先选分店，再查看当前可预订的房间。这里的房态会跟分店入住操作同步变化。</Paragraph>
        </div>
        <Select
          placeholder="选择分店"
          style={{ minWidth: 260 }}
          value={selectedBranch}
          onChange={handleBranchChange}
          options={branches.map((branch) => ({
            label: `${branch.branchName} · ${branch.address}`,
            value: branch.branchId,
          }))}
        />
      </div>

      {!selectedBranch ? (
        <Card className="soft-card">
          <Empty description="请选择一个分店开始浏览房间" />
        </Card>
      ) : rooms.length ? (
        <Row gutter={[16, 16]}>
          {rooms.map((room) => (
            <Col xs={24} md={12} xl={8} key={room.roomId}>
              <Card className="room-card" loading={loading}>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div className="room-cover">
                    <BankOutlined />
                  </div>
                  <div className="room-topline">
                    <Title level={4} style={{ margin: 0 }}>
                      房间 {room.roomId}
                    </Title>
                    <Tag color="green">可预订</Tag>
                  </div>
                  <Text type="secondary">{selectedBranchInfo?.branchName}</Text>
                  <Text>{formatRoomType(room.roomType)}</Text>
                  <Title level={3} style={{ margin: 0 }}>
                    {formatCurrency(room.price)}
                    <span className="unit-text"> / 晚</span>
                  </Title>
                  <Button type="primary" block onClick={() => setBookingRoom(room)}>
                    预订这间房
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="soft-card" loading={loading}>
          <Empty description="该分店当前没有可预订房间" />
        </Card>
      )}

      <Modal
        title={bookingRoom ? `预订房间 ${bookingRoom.roomId}` : '预订房间'}
        open={Boolean(bookingRoom)}
        onCancel={() => setBookingRoom(null)}
        footer={null}
      >
        {bookingRoom ? (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space direction="vertical" size={6}>
                <Text strong>{selectedBranchInfo?.branchName}</Text>
                <Text>{formatRoomType(bookingRoom.roomType)}</Text>
                <Text>{formatCurrency(bookingRoom.price)} / 晚</Text>
              </Space>
            </Card>

            <Form.Item
              label="入住日期"
              name="dates"
              rules={[{ required: true, message: '请选择入住日期' }]}
            >
              <RangePicker
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              提交预订
            </Button>
          </Form>
        ) : null}
      </Modal>
    </div>
  );
}

export default CustomerBrowseRooms;
