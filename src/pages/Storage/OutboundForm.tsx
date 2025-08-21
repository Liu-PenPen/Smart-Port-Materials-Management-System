import React, { useState } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Space, 
  Table, 
  InputNumber,
  message,
  Row,
  Col,
  Divider,
  Tag,
  Modal
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  PlusOutlined, 
  DeleteOutlined,
  SearchOutlined,
  ScanOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ProFormSelect } from '@ant-design/pro-components'
import dayjs from 'dayjs'
import type { OutboundOrder, OutboundDetail, Material, Warehouse, Department, User } from '@/types'

const { TextArea } = Input
const { Option } = Select

const StorageOutboundForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [form] = Form.useForm()
  const [materialModalVisible, setMaterialModalVisible] = useState(false)
  const [outboundDetails, setOutboundDetails] = useState<OutboundDetail[]>([])

  // 获取出库单详情（编辑时）
  const { data: outboundOrder, isLoading } = useQuery({
    queryKey: ['outbound-form', id],
    queryFn: async () => {
      if (!isEdit) return null
      
      // 模拟获取出库单数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockData: OutboundOrder = {
        id: Number(id),
        outboundNo: 'OUT202508060002',
        warehouseId: 1,
        actualOutboundDate: '2025-08-20T13:39:57',
        invoiceOutboundDate: '2025-08-20',
        status: 'OUTBOUND_PROCESSING',
        outboundType: 'NORMAL',
        warehouseKeeperId: 1,
        isArchived: false,
        equipmentCode: 'EQ001',
        usageType: 'PRODUCTION',
        usageDepartmentId: 1,
        recipientId: 1,
        periodMonth: '2025-08',
        remarks: '紧急出库，用于码头装卸设备维修',
        details: [
          {
            id: 1,
            outboundOrderId: Number(id),
            materialId: 1,
            materialCode: 'MAT001',
            materialName: '钢丝绳',
            specification: '直径20mm 长度100m',
            quantity: 2,
            unitPrice: 1500.00,
            amount: 3000.00,
            createdBy: 1,
            createdTime: '2025-08-20T13:39:57',
            version: 1
          }
        ],
        createdBy: 1,
        createdTime: '2025-08-20T10:00:00',
        version: 1
      }
      
      return mockData
    },
    enabled: isEdit,
  })

  // 模拟数据源
  const mockWarehouses: Warehouse[] = [
    { id: 1, warehouseName: '码头1号仓库', warehouseCode: 'WH001' } as Warehouse,
    { id: 2, warehouseName: '码头2号仓库', warehouseCode: 'WH002' } as Warehouse,
    { id: 3, warehouseName: '散货仓库', warehouseCode: 'WH003' } as Warehouse,
  ]

  const mockDepartments: Department[] = [
    { id: 1, departmentName: '生产部', departmentCode: 'PROD001' } as Department,
    { id: 2, departmentName: '维修部', departmentCode: 'MAINT001' } as Department,
    { id: 3, departmentName: '装卸部', departmentCode: 'LOAD001' } as Department,
  ]

  const mockUsers: User[] = [
    { id: 1, name: '张三', username: 'zhangsan' } as User,
    { id: 2, name: '李四', username: 'lisi' } as User,
    { id: 3, name: '王五', username: 'wangwu' } as User,
  ]

  const mockMaterials: Material[] = [
    {
      id: 1,
      materialCode: 'MAT001',
      materialName: '钢丝绳',
      specification: '直径20mm 长度100m',
      unit: '根',
      status: 'ACTIVE'
    } as Material,
    {
      id: 2,
      materialCode: 'MAT002',
      materialName: '液压油',
      specification: '46号抗磨液压油 200L',
      unit: '桶',
      status: 'ACTIVE'
    } as Material,
  ]

  // 初始化表单数据
  React.useEffect(() => {
    if (outboundOrder) {
      form.setFieldsValue({
        outboundNo: outboundOrder.outboundNo,
        warehouseId: outboundOrder.warehouseId,
        outboundType: outboundOrder.outboundType,
        actualOutboundDate: dayjs(outboundOrder.actualOutboundDate),
        invoiceOutboundDate: outboundOrder.invoiceOutboundDate ? dayjs(outboundOrder.invoiceOutboundDate) : null,
        equipmentCode: outboundOrder.equipmentCode,
        usageType: outboundOrder.usageType,
        usageDepartmentId: outboundOrder.usageDepartmentId,
        recipientId: outboundOrder.recipientId,
        remarks: outboundOrder.remarks,
      })
      setOutboundDetails(outboundOrder.details || [])
    }
  }, [outboundOrder, form])

  // 出库明细表格列
  const detailColumns = [
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 150,
    },
    {
      title: '规格型号',
      dataIndex: 'specification',
      key: 'specification',
      width: 200,
    },
    {
      title: '出库数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (value: number, record: OutboundDetail, index: number) => (
        <InputNumber
          value={value}
          min={0}
          precision={3}
          onChange={(newValue) => {
            const newDetails = [...outboundDetails]
            newDetails[index].quantity = newValue || 0
            newDetails[index].amount = (newValue || 0) * newDetails[index].unitPrice
            setOutboundDetails(newDetails)
          }}
        />
      ),
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (value: number, record: OutboundDetail, index: number) => (
        <InputNumber
          value={value}
          min={0}
          precision={2}
          formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
          onChange={(newValue) => {
            const newDetails = [...outboundDetails]
            newDetails[index].unitPrice = newValue || 0
            newDetails[index].amount = newDetails[index].quantity * (newValue || 0)
            setOutboundDetails(newDetails)
          }}
        />
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: OutboundDetail, index: number) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            const newDetails = outboundDetails.filter((_, i) => i !== index)
            setOutboundDetails(newDetails)
          }}
        >
          删除
        </Button>
      ),
    },
  ]

  // 添加物料
  const handleAddMaterial = (material: Material) => {
    const newDetail: OutboundDetail = {
      id: Date.now(), // 临时ID
      outboundOrderId: Number(id) || 0,
      materialId: material.id,
      materialCode: material.materialCode,
      materialName: material.materialName,
      specification: material.specification || '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      createdBy: 1,
      createdTime: new Date().toISOString(),
      version: 1
    }
    setOutboundDetails([...outboundDetails, newDetail])
    setMaterialModalVisible(false)
  }

  // 保存出库单
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      
      if (outboundDetails.length === 0) {
        message.error('请至少添加一条出库明细')
        return
      }

      const outboundData = {
        ...values,
        actualOutboundDate: values.actualOutboundDate?.format('YYYY-MM-DD HH:mm:ss'),
        invoiceOutboundDate: values.invoiceOutboundDate?.format('YYYY-MM-DD'),
        details: outboundDetails,
      }

      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      message.success(isEdit ? '修改成功' : '创建成功')
      navigate('/storage/outbound')
    } catch (error) {
      console.error('保存失败:', error)
    }
  }

  return (
    <div className="page-container">
      <Card
        title={
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/storage/outbound')}
            >
              返回
            </Button>
            {isEdit ? '修改出库单' : '新建出库单'}
          </Space>
        }
        loading={isLoading}
        extra={
          <Space>
            <Button onClick={() => navigate('/storage/outbound')}>
              取消
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={handleSave}
            >
              保存
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            outboundType: 'NORMAL',
            usageType: 'PRODUCTION',
            actualOutboundDate: dayjs(),
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="outboundNo"
                  label="出库单号"
                  rules={[{ required: true, message: '请输入出库单号' }]}
                >
                  <Input placeholder="系统自动生成" disabled={isEdit} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="warehouseId"
                  label="出库仓库"
                  rules={[{ required: true, message: '请选择出库仓库' }]}
                >
                  <Select placeholder="请选择仓库">
                    {mockWarehouses.map(warehouse => (
                      <Option key={warehouse.id} value={warehouse.id}>
                        {warehouse.warehouseName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="outboundType"
                  label="出库类型"
                  rules={[{ required: true, message: '请选择出库类型' }]}
                >
                  <Select>
                    <Option value="NORMAL">正常出库</Option>
                    <Option value="URGENT">紧急出库</Option>
                    <Option value="TRANSFER">移库出库</Option>
                    <Option value="RETURN">退库出库</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="actualOutboundDate"
                  label="实际出库日期"
                  rules={[{ required: true, message: '请选择出库日期' }]}
                >
                  <DatePicker 
                    showTime 
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="invoiceOutboundDate"
                  label="发票出库日期"
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="equipmentCode"
                  label="使用设备"
                >
                  <Input placeholder="请输入设备编码" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 领用信息 */}
          <Card title="领用信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="usageType"
                  label="领用类型"
                  rules={[{ required: true, message: '请选择领用类型' }]}
                >
                  <Select>
                    <Option value="PRODUCTION">生产用</Option>
                    <Option value="MAINTENANCE">维修用</Option>
                    <Option value="OFFICE">办公用</Option>
                    <Option value="OTHER">其他</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="usageDepartmentId"
                  label="领用部门"
                  rules={[{ required: true, message: '请选择领用部门' }]}
                >
                  <Select placeholder="请选择部门">
                    {mockDepartments.map(dept => (
                      <Option key={dept.id} value={dept.id}>
                        {dept.departmentName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="recipientId"
                  label="领用人"
                  rules={[{ required: true, message: '请选择领用人' }]}
                >
                  <Select placeholder="请选择领用人">
                    {mockUsers.map(user => (
                      <Option key={user.id} value={user.id}>
                        {user.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="remarks"
                  label="备注"
                >
                  <TextArea 
                    rows={3} 
                    placeholder="请输入备注信息，如出库原因、特殊要求等"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 出库明细 */}
          <Card 
            title="出库明细" 
            size="small"
            extra={
              <Space>
                <Button 
                  icon={<ScanOutlined />}
                  onClick={() => message.info('扫码功能开发中')}
                >
                  扫码添加
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setMaterialModalVisible(true)}
                >
                  添加物料
                </Button>
              </Space>
            }
          >
            <Table
              columns={detailColumns}
              dataSource={outboundDetails}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 800 }}
              summary={(pageData) => {
                const totalAmount = pageData.reduce((sum, record) => sum + record.amount, 0)
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={5}>
                      <strong>合计</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>¥{totalAmount.toLocaleString()}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                  </Table.Summary.Row>
                )
              }}
            />
          </Card>
        </Form>

        {/* 物料选择Modal */}
        <Modal
          title="选择物料"
          open={materialModalVisible}
          onCancel={() => setMaterialModalVisible(false)}
          footer={null}
          width={800}
        >
          <Table
            columns={[
              { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode' },
              { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
              { title: '规格型号', dataIndex: 'specification', key: 'specification' },
              { title: '单位', dataIndex: 'unit', key: 'unit' },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={() => handleAddMaterial(record)}
                  >
                    选择
                  </Button>
                ),
              },
            ]}
            dataSource={mockMaterials}
            rowKey="id"
            size="small"
            pagination={false}
          />
        </Modal>
      </Card>
    </div>
  )
}

export default StorageOutboundForm
