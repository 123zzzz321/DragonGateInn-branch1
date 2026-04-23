import React, { useEffect, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Card, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography } from 'antd';
import { addRoom, deleteRoom, getRooms, updateRoom } from '../../services/roomService';
import { formatCurrency, formatRoomType, getRoomStatusText } from '../../utils/formatters';

const { Title, Paragraph } = Typography;

const statusOptions = [
  { label: '可用', value: 'available' },
  { label: '入住中', value: 'occupied' },
  { label: '维护中', value: 'maintenance' },
];

function BranchRoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form] = Form.useForm();
  const { message, modal } = AntdApp.useApp();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      setRooms(await getRooms());
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openForCreate = () => {
    setEditingRoom(null);
    form.resetFields();
    form.setFieldsValue({ windowBool: true, bedCount: 1, status: 'available' });
    setModalOpen(true);
  };

  const openForEdit = (room) => {
    setEditingRoom(room);
    form.setFieldsValue({
      roomId: room.roomId,
      area: room.roomType?.area,
      windowBool: room.roomType?.windowBool,
      bedType: room.roomType?.bedType?.typeString,
      bedCount: room.roomType?.bedType?.numInt,
      price: room.price,
      status: room.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    const payload = {
      roomId: values.roomId,
      price: values.price,
      status: values.status,
      roomType: {
        area: values.area,
        windowBool: values.windowBool,
        bedType: {
          typeString: values.bedType,
          numInt: values.bedCount,
        },
      },
    };

    try {
      if (editingRoom) {
        await updateRoom(editingRoom.roomId, payload);
        message.success('房间信息已更新');
      } else {
        await addRoom(payload);
        message.success('房间已创建');
      }
      setModalOpen(false);
      fetchRooms();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDelete = (room) => {
    modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除房间 ${room.roomId} 吗？此操作不可恢复。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteRoom(room.roomId);
          message.success('房间已删除');
          fetchRooms();
        } catch (error) {
          message.error(error.message);
        }
      },
    });
  };

  const columns = [
    { title: '房间号', dataIndex: 'roomId', key: 'roomId' },
    { title: '房型', dataIndex: 'roomType', key: 'roomType', render: formatRoomType },
    { title: '价格', dataIndex: 'price', key: 'price', render: formatCurrency },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'available' ? 'green' : status === 'occupied' ? 'blue' : 'orange'}>{getRoomStatusText(status)}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openForEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <Title level={2}>房间管理</Title>
          <Paragraph>房态字段已经和分店后端接口对齐，新增/编辑后会影响客户预订列表。</Paragraph>
        </div>
        <Button type="primary" onClick={openForCreate}>
          新增房间
        </Button>
      </div>

      <Card className="soft-card">
        <Table rowKey="roomId" columns={columns} dataSource={rooms} loading={loading} />
      </Card>

      <Modal
        title={editingRoom ? '编辑房间' : '新增房间'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="房间号" name="roomId" rules={[{ required: true, message: '请输入房间号' }]}>
            <Input disabled={Boolean(editingRoom)} />
          </Form.Item>
          <Form.Item label="面积" name="area" rules={[{ required: true, message: '请输入面积' }]}>
            <Space.Compact style={{ width: '100%' }}>
              <InputNumber min={10} style={{ width: '100%' }} />
              <Input disabled value="㎡" style={{ width: 50, textAlign: 'center' }} />
            </Space.Compact>
          </Form.Item>
          <Form.Item label="床型" name="bedType" rules={[{ required: true, message: '请选择床型' }]}>
            <Select options={[{ label: '大床', value: '大床' }, { label: '双床', value: '双床' }, { label: '套房', value: '套房' }]} />
          </Form.Item>
          <Form.Item label="床位数量" name="bedCount" rules={[{ required: true, message: '请输入床位数量' }]}>
            <InputNumber min={1} max={4} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="窗户" name="windowBool" rules={[{ required: true, message: '请选择窗户信息' }]}>
            <Select options={[{ label: '有窗', value: true }, { label: '无窗', value: false }]} />
          </Form.Item>
          <Form.Item label="价格" name="price" rules={[{ required: true, message: '请输入价格' }]}>
            <Space.Compact style={{ width: '100%' }}>
              <Input disabled value="¥" style={{ width: 50, textAlign: 'center' }} />
              <InputNumber min={0} style={{ width: '100%' }} />
            </Space.Compact>
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
            <Select options={statusOptions} />
          </Form.Item>
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setModalOpen(false)}>取消</Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}

export default BranchRoomManagement;
