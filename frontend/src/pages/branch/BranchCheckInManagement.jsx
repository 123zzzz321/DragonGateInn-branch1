import React, { useEffect, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Card, Descriptions, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography } from 'antd';
import { addConsumption, checkOut, createCheckIn, getCheckIns } from '../../services/checkInService';
import { getRooms } from '../../services/roomService';
import { formatCurrency, formatDateTime, getCheckInStatusText } from '../../utils/formatters';

const { Title, Paragraph } = Typography;

function BranchCheckInManagement() {
  const [checkIns, setCheckIns] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [consumptionRecord, setConsumptionRecord] = useState(null);
  const [checkInForm] = Form.useForm();
  const [consumptionForm] = Form.useForm();
  const { message, modal } = AntdApp.useApp();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [checkInData, roomData] = await Promise.all([getCheckIns(), getRooms()]);
      setCheckIns(checkInData);
      setRooms(roomData.filter((room) => room.status === 'available'));
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCheckIn = async (values) => {
    try {
      await createCheckIn({
        roomId: values.roomId,
        persons: [
          {
            name: values.customerName,
            identityCard: values.identityCard,
          },
        ],
      });
      message.success('入住办理成功');
      setCheckInModalOpen(false);
      checkInForm.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleCheckOut = (checkIn) => {
    modal.confirm({
      title: '确认退房',
      icon: <ExclamationCircleOutlined />,
      content: `确定要为客户 ${checkIn.customerName} 办理退房吗？房间 ${checkIn.roomId} 将变为可用状态。`,
      okText: '确认退房',
      cancelText: '取消',
      onOk: async () => {
        try {
          await checkOut(checkIn.checkInId);
          message.success('已办理退房');
          fetchData();
        } catch (error) {
          message.error(error.message);
        }
      },
    });
  };

  const handleAddConsumption = async (values) => {
    try {
      await addConsumption(consumptionRecord.checkInId, values);
      message.success('消费已登记');
      setConsumptionRecord(null);
      consumptionForm.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    { title: '入住号', dataIndex: 'checkInId', key: 'checkInId' },
    { title: '客户', dataIndex: 'customerName', key: 'customerName' },
    { title: '房间号', dataIndex: 'roomId', key: 'roomId' },
    { title: '入住时间', dataIndex: 'checkInDate', key: 'checkInDate', render: formatDateTime },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'checked-in' ? 'blue' : 'default'}>{getCheckInStatusText(status)}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div className="table-actions">
          <Button type="link" onClick={() => setDetailRecord(record)}>
            详情
          </Button>
          {record.status === 'checked-in' ? (
            <>
              <Button type="link" onClick={() => setConsumptionRecord(record)}>
                记消费
              </Button>
              <Button type="link" danger onClick={() => handleCheckOut(record)}>
                退房
              </Button>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <Title level={2}>入住管理</Title>
          <Paragraph>入住、消费和退房都会联动更新房态，客户预订页也会感知到变化。</Paragraph>
        </div>
        <Button type="primary" onClick={() => setCheckInModalOpen(true)}>
          办理入住
        </Button>
      </div>

      <Card className="soft-card">
        <Table rowKey="checkInId" columns={columns} dataSource={checkIns} loading={loading} />
      </Card>

      <Modal title="办理入住" open={checkInModalOpen} onCancel={() => setCheckInModalOpen(false)} footer={null}>
        <Form form={checkInForm} layout="vertical" onFinish={handleCreateCheckIn}>
          <Form.Item label="客户姓名" name="customerName" rules={[{ required: true, message: '请输入客户姓名' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="身份证号" name="identityCard" rules={[{ required: true, message: '请输入身份证号' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="房间号" name="roomId" rules={[{ required: true, message: '请选择房间' }]}>
            <Select options={rooms.map((room) => ({ label: `${room.roomId} · ${formatCurrency(room.price)}`, value: room.roomId }))} />
          </Form.Item>
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setCheckInModalOpen(false)}>取消</Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Space>
        </Form>
      </Modal>

      <Modal title="入住详情" open={Boolean(detailRecord)} onCancel={() => setDetailRecord(null)} footer={null}>
        {detailRecord ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="入住号">{detailRecord.checkInId}</Descriptions.Item>
            <Descriptions.Item label="客户">{detailRecord.customerName}</Descriptions.Item>
            <Descriptions.Item label="房间号">{detailRecord.roomId}</Descriptions.Item>
            <Descriptions.Item label="入住时间">{formatDateTime(detailRecord.checkInDate)}</Descriptions.Item>
            <Descriptions.Item label="退房时间">{formatDateTime(detailRecord.checkOutDate)}</Descriptions.Item>
            <Descriptions.Item label="消费金额">{formatCurrency(detailRecord.consumeAmount)}</Descriptions.Item>
            <Descriptions.Item label="状态">{getCheckInStatusText(detailRecord.status)}</Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>

      <Modal title="登记消费" open={Boolean(consumptionRecord)} onCancel={() => setConsumptionRecord(null)} footer={null}>
        <Form form={consumptionForm} layout="vertical" onFinish={handleAddConsumption}>
          <Form.Item label="消费项目" name="description" rules={[{ required: true, message: '请输入消费项目' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="金额" name="amount" rules={[{ required: true, message: '请输入金额' }]}>
            <Space.Compact style={{ width: '100%' }}>
              <Input disabled value="¥" style={{ width: 50, textAlign: 'center' }} />
              <InputNumber min={1} style={{ width: '100%' }} />
            </Space.Compact>
          </Form.Item>
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setConsumptionRecord(null)}>取消</Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}

export default BranchCheckInManagement;
