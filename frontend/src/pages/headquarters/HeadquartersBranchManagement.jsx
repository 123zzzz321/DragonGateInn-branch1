import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, Typography, message } from 'antd';
import { createBranch, deleteBranch, getAllBranches, updateBranch } from '../../services/headquartersService';

const { Title, Paragraph } = Typography;

function HeadquartersBranchManagement() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [form] = Form.useForm();

  const fetchBranches = async () => {
    setLoading(true);
    try {
      setBranches(await getAllBranches());
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingBranch) {
        await updateBranch(editingBranch.branchId, values);
        message.success('分店信息已更新');
      } else {
        await createBranch(values);
        message.success('分店已创建');
      }
      setModalOpen(false);
      form.resetFields();
      fetchBranches();
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    { title: '分店 ID', dataIndex: 'branchId', key: 'branchId' },
    { title: '名称', dataIndex: 'branchName', key: 'branchName' },
    { title: '地址', dataIndex: 'address', key: 'address' },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'active' ? 'green' : 'orange'}>{status === 'active' ? '运营中' : '停用'}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div className="table-actions">
          <Button
            type="link"
            onClick={() => {
              setEditingBranch(record);
              form.setFieldsValue(record);
              setModalOpen(true);
            }}
          >
            编辑
          </Button>
          <Button type="link" danger onClick={() => deleteBranch(record.branchId).then(fetchBranches)}>
            停用
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <Title level={2}>分店管理</Title>
          <Paragraph>这里的新增/停用会直接反映到总部概览的数据统计中。</Paragraph>
        </div>
        <Button
          type="primary"
          onClick={() => {
            setEditingBranch(null);
            form.resetFields();
            form.setFieldsValue({ status: 'active' });
            setModalOpen(true);
          }}
        >
          新增分店
        </Button>
      </div>

      <Card className="soft-card">
        <Table rowKey="branchId" columns={columns} dataSource={branches} loading={loading} />
      </Card>

      <Modal
        title={editingBranch ? '编辑分店' : '新增分店'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="分店名称" name="branchName" rules={[{ required: true, message: '请输入分店名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="地址" name="address" rules={[{ required: true, message: '请输入地址' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="电话" name="phone" rules={[{ required: true, message: '请输入电话' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
            <Select options={[{ label: '运营中', value: 'active' }, { label: '停用', value: 'inactive' }]} />
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

export default HeadquartersBranchManagement;
