import React, { useEffect, useMemo, useState } from 'react';
import { BankOutlined, ExpandOutlined, HomeOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Card, Col, DatePicker, Descriptions, Empty, Form, Modal, Row, Select, Space, Tag, Typography } from 'antd';
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
  const [branchLoading, setBranchLoading] = useState(true);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [detailRoom, setDetailRoom] = useState(null);
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();

  useEffect(() => {
    const fetchBranches = async () => {
      setBranchLoading(true);
      try {
        setBranches(await getAllBranches());
      } catch (error) {
        message.error(error.message);
      } finally {
        setBranchLoading(false);
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
          loading={branchLoading}
          options={branches.map((branch) => ({
            label: `${branch.branchName} · ${branch.address}`,
            value: branch.branchId,
          }))}
        />
      </div>

      {!selectedBranch ? (
        <Card className="soft-card">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                请选择一个分店开始浏览房间
                <br />
                {branches.length === 0 && !branchLoading && <Text type="secondary">暂无可用分店</Text>}
              </span>
            }
          />
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
                  <Space style={{ width: '100%' }} direction="vertical" size={8}>
                    <Button block onClick={() => setDetailRoom(room)}>
                      查看详情
                    </Button>
                    <Button type="primary" block onClick={() => setBookingRoom(room)}>
                      预订这间房
                    </Button>
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="soft-card" loading={loading}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                该分店当前没有可预订房间
                <br />
                <Text type="secondary">请尝试选择其他分店或稍后再试</Text>
              </span>
            }
          />
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

      <Modal
        title={detailRoom ? `房间 ${detailRoom.roomId} 详情` : '房间详情'}
        open={Boolean(detailRoom)}
        onCancel={() => setDetailRoom(null)}
        footer={[
          <Button key="close" onClick={() => setDetailRoom(null)}>
            关闭
          </Button>,
          detailRoom && (
            <Button key="book" type="primary" onClick={() => { setDetailRoom(null); setBookingRoom(detailRoom); }}>
              立即预订
            </Button>
          ),
        ]}
      >
        {detailRoom && selectedBranchInfo && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="房间号">{detailRoom.roomId}</Descriptions.Item>
            <Descriptions.Item label="所属分店">{selectedBranchInfo.branchName}</Descriptions.Item>
            <Descriptions.Item label="地址">{selectedBranchInfo.address}</Descriptions.Item>
            <Descriptions.Item label="房型">{formatRoomType(detailRoom.roomType)}</Descriptions.Item>
            <Descriptions.Item label="面积">
              <Space>
                <ExpandOutlined />
                {detailRoom.roomType?.area || '-'} ㎡
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="床型">{detailRoom.roomType?.bedType?.typeString || '-'}</Descriptions.Item>
            <Descriptions.Item label="床位数量">{detailRoom.roomType?.bedType?.numInt || '-'} 人</Descriptions.Item>
            <Descriptions.Item label="窗户">
              <Space>
                <HomeOutlined />
                {detailRoom.roomType?.windowBool ? '有窗' : '无窗'}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="房间状态">
              <Tag color="green">可预订</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="价格">
              <Text strong style={{ fontSize: 18, color: '#1f8f63' }}>
                {formatCurrency(detailRoom.price)}
              </Text>
              <Text type="secondary"> / 晚</Text>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default CustomerBrowseRooms;
