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
  Modal,
  Alert,
  Switch,
  Tooltip
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  PlusOutlined, 
  DeleteOutlined,
  SearchOutlined,
  ScanOutlined,
  QuestionCircleOutlined,
  LockOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { getCurrentPeriod } from '@/utils'
import type { InboundOrder, InboundDetail, Material, Warehouse, Supplier, PurchaseOrder } from '@/types'

const { TextArea } = Input
const { Option } = Select

const StorageInboundForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [form] = Form.useForm()
  const [materialModalVisible, setMaterialModalVisible] = useState(false)
  const [inboundDetails, setInboundDetails] = useState<InboundDetail[]>([])
  const [isZeroAmountInbound, setIsZeroAmountInbound] = useState(false)

  // 获取入库单详情（编辑时）
  const { data: inboundOrder, isLoading } = useQuery({
    queryKey: ['inbound-form', id],
    queryFn: async () => {
      if (!isEdit) return null
      
      // 模拟获取入库单数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockData: InboundOrder = {
        id: Number(id),
        inboundNo: 'IN202508060001',
        warehouseId: 1,
        supplierId: 1,
        purchaseOrderId: 1,
        actualInboundDate: '2025-08-20T14:30:00',
        invoiceInboundDate: '2025-08-20',
        invoiceNo: 'INV202508001',
        invoiceDate: '2025-08-20',
        invoiceAmount: 15000.00,
        status: 'UNDER_REVIEW',
        warehouseKeeperId: 1,
        isArchived: false,
        periodMonth: '2025-08',
        remarks: '港口设备维修物资入库',
        details: [
          {
            id: 1,
            inboundOrderId: Number(id),
            materialId: 1,
            materialCode: 'MAT001',
            materialName: '钢丝绳',
            specification: '直径20mm 长度100m',
            quantity: 5,
            unitPrice: 1500.00,
            amount: 7500.00,
            storageArea: 'A区-01',
            createdBy: 1,
            createdTime: '2025-08-20T14:30:00',
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

  const mockSuppliers: Supplier[] = [
    { id: 1, supplierName: '北京港口设备有限公司', supplierCode: 'SUP001' } as Supplier,
    { id: 2, supplierName: '上海海运物资公司', supplierCode: 'SUP002' } as Supplier,
    { id: 3, supplierName: '青岛港务机械厂', supplierCode: 'SUP003' } as Supplier,
  ]

  const mockPurchaseOrders: PurchaseOrder[] = [
    { id: 1, purchaseNo: 'PO202508001', totalAmount: 15000.00 } as PurchaseOrder,
    { id: 2, purchaseNo: 'PO202508002', totalAmount: 8500.00 } as PurchaseOrder,
    { id: 3, purchaseNo: 'PO202508003', totalAmount: 12000.00 } as PurchaseOrder,
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

  // 检查期间锁定
  const currentPeriod = getCurrentPeriod()
  const selectedPeriod = Form.useWatch('periodMonth', form) || currentPeriod
  const isPeriodLocked = selectedPeriod < currentPeriod

  // 初始化表单数据
  React.useEffect(() => {
    if (inboundOrder) {
      const isZeroAmount = inboundOrder.invoiceAmount === 0
      setIsZeroAmountInbound(isZeroAmount)
      
      form.setFieldsValue({
        inboundNo: inboundOrder.inboundNo,
        warehouseId: inboundOrder.warehouseId,
        supplierId: inboundOrder.supplierId,
        purchaseOrderId: inboundOrder.purchaseOrderId,
        actualInboundDate: dayjs(inboundOrder.actualInboundDate),
        invoiceInboundDate: inboundOrder.invoiceInboundDate ? dayjs(inboundOrder.invoiceInboundDate) : null,
        invoiceNo: inboundOrder.invoiceNo,
        invoiceDate: inboundOrder.invoiceDate ? dayjs(inboundOrder.invoiceDate) : null,
        invoiceAmount: inboundOrder.invoiceAmount,
        periodMonth: inboundOrder.periodMonth,
        remarks: inboundOrder.remarks,
        isZeroAmountInbound: isZeroAmount,
      })
      setInboundDetails(inboundOrder.details || [])
    } else {
      // 新建时的默认值
      form.setFieldsValue({
        periodMonth: currentPeriod,
        actualInboundDate: dayjs(),
        invoiceAmount: 0,
        isZeroAmountInbound: false,
      })
    }
  }, [inboundOrder, form, currentPeriod])

  // 入库明细表格列
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
      title: '入库数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (value: number, record: InboundDetail, index: number) => (
        <InputNumber
          value={value}
          min={0}
          precision={3}
          onChange={(newValue) => {
            const newDetails = [...inboundDetails]
            newDetails[index].quantity = newValue || 0
            newDetails[index].amount = (newValue || 0) * newDetails[index].unitPrice
            setInboundDetails(newDetails)
            updateTotalAmount(newDetails)
          }}
        />
      ),
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (value: number, record: InboundDetail, index: number) => (
        <InputNumber
          value={value}
          min={0}
          precision={2}
          disabled={isZeroAmountInbound}
          formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
          onChange={(newValue) => {
            const newDetails = [...inboundDetails]
            newDetails[index].unitPrice = newValue || 0
            newDetails[index].amount = newDetails[index].quantity * (newValue || 0)
            setInboundDetails(newDetails)
            updateTotalAmount(newDetails)
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
      title: '货区',
      dataIndex: 'storageArea',
      key: 'storageArea',
      width: 120,
      render: (value: string, record: InboundDetail, index: number) => (
        <Input
          value={value}
          placeholder="如：A区-01"
          onChange={(e) => {
            const newDetails = [...inboundDetails]
            newDetails[index].storageArea = e.target.value
            setInboundDetails(newDetails)
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: InboundDetail, index: number) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            const newDetails = inboundDetails.filter((_, i) => i !== index)
            setInboundDetails(newDetails)
            updateTotalAmount(newDetails)
          }}
        >
          删除
        </Button>
      ),
    },
  ]

  // 更新总金额
  const updateTotalAmount = (details: InboundDetail[]) => {
    if (!isZeroAmountInbound) {
      const totalAmount = details.reduce((sum, item) => sum + item.amount, 0)
      form.setFieldValue('invoiceAmount', totalAmount)
    }
  }

  // 添加物料
  const handleAddMaterial = (material: Material) => {
    const newDetail: InboundDetail = {
      id: Date.now(), // 临时ID
      inboundOrderId: Number(id) || 0,
      materialId: material.id,
      materialCode: material.materialCode,
      materialName: material.materialName,
      specification: material.specification || '',
      quantity: 1,
      unitPrice: isZeroAmountInbound ? 0 : 0,
      amount: 0,
      storageArea: '',
      createdBy: 1,
      createdTime: new Date().toISOString(),
      version: 1
    }
    const newDetails = [...inboundDetails, newDetail]
    setInboundDetails(newDetails)
    updateTotalAmount(newDetails)
    setMaterialModalVisible(false)
  }

  // 处理0元入库切换
  const handleZeroAmountChange = (checked: boolean) => {
    setIsZeroAmountInbound(checked)
    if (checked) {
      // 切换为0元入库，清空价格相关字段
      form.setFieldsValue({
        invoiceAmount: 0,
        invoiceInboundDate: null,
        invoiceNo: '',
        invoiceDate: null,
      })
      // 更新明细中的单价和金额
      const newDetails = inboundDetails.map(item => ({
        ...item,
        unitPrice: 0,
        amount: 0
      }))
      setInboundDetails(newDetails)
    }
  }

  // 保存入库单
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      
      if (inboundDetails.length === 0) {
        message.error('请至少添加一条入库明细')
        return
      }

      if (isPeriodLocked) {
        message.error('该期间已锁定，不允许保存')
        return
      }

      const inboundData = {
        ...values,
        actualInboundDate: values.actualInboundDate?.format('YYYY-MM-DD HH:mm:ss'),
        invoiceInboundDate: values.invoiceInboundDate?.format('YYYY-MM-DD'),
        invoiceDate: values.invoiceDate?.format('YYYY-MM-DD'),
        details: inboundDetails,
      }

      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      message.success(isEdit ? '修改成功' : '创建成功')
      navigate('/storage/inbound')
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
              onClick={() => navigate('/storage/inbound')}
            >
              返回
            </Button>
            {isEdit ? '修改入库单' : '新建入库单'}
          </Space>
        }
        loading={isLoading}
        extra={
          <Space>
            <Button onClick={() => navigate('/storage/inbound')}>
              取消
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={handleSave}
              disabled={isPeriodLocked}
            >
              保存
            </Button>
          </Space>
        }
      >
        {/* 期间锁定警告 */}
        {isPeriodLocked && (
          <Alert
            message="期间已锁定"
            description={`${selectedPeriod} 期间已生成报表并锁定，不允许新增或修改入库单据。`}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            periodMonth: currentPeriod,
            actualInboundDate: dayjs(),
            invoiceAmount: 0,
            isZeroAmountInbound: false,
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="inboundNo"
                  label="入库单号"
                  rules={[{ required: true, message: '请输入入库单号' }]}
                >
                  <Input placeholder="系统自动生成" disabled={isEdit} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="warehouseId"
                  label="入库仓库"
                  rules={[{ required: true, message: '请选择入库仓库' }]}
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
                  name="supplierId"
                  label="供应商"
                  rules={[{ required: true, message: '请选择供应商' }]}
                >
                  <Select placeholder="请选择供应商">
                    {mockSuppliers.map(supplier => (
                      <Option key={supplier.id} value={supplier.id}>
                        {supplier.supplierName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="purchaseOrderId"
                  label="采购单号"
                >
                  <Select placeholder="请选择采购单" allowClear>
                    {mockPurchaseOrders.map(po => (
                      <Option key={po.id} value={po.id}>
                        {po.purchaseNo}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="actualInboundDate"
                  label="实际入库日期"
                  rules={[{ required: true, message: '请选择入库日期' }]}
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
                  name="periodMonth"
                  label={
                    <Space>
                      期间月份
                      {isPeriodLocked && <LockOutlined style={{ color: '#ff4d4f' }} />}
                    </Space>
                  }
                  rules={[{ required: true, message: '请选择期间月份' }]}
                >
                  <Input placeholder="YYYY-MM" disabled />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 发票信息 */}
          <Card 
            title={
              <Space>
                发票信息
                <Form.Item 
                  name="isZeroAmountInbound" 
                  valuePropName="checked"
                  style={{ margin: 0 }}
                >
                  <Switch 
                    checkedChildren="0元入库" 
                    unCheckedChildren="正常入库"
                    onChange={handleZeroAmountChange}
                  />
                </Form.Item>
                <Tooltip title="发票未到时可选择0元入库，后续发票到达后进行成本调整">
                  <QuestionCircleOutlined style={{ color: '#999' }} />
                </Tooltip>
              </Space>
            } 
            size="small" 
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="invoiceInboundDate"
                  label="发票入库日期"
                  rules={isZeroAmountInbound ? [] : [{ required: true, message: '请选择发票入库日期' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    disabled={isZeroAmountInbound}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="invoiceNo"
                  label="发票号码"
                  rules={isZeroAmountInbound ? [] : [{ required: true, message: '请输入发票号码' }]}
                >
                  <Input 
                    placeholder="请输入发票号码" 
                    disabled={isZeroAmountInbound}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="invoiceDate"
                  label="发票日期"
                  rules={isZeroAmountInbound ? [] : [{ required: true, message: '请选择发票日期' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    disabled={isZeroAmountInbound}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="invoiceAmount"
                  label="发票金额"
                  rules={[{ required: true, message: '请输入发票金额' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    precision={2}
                    formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                    disabled={isZeroAmountInbound}
                  />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="remarks"
                  label="备注"
                >
                  <TextArea 
                    rows={2} 
                    placeholder="请输入备注信息，如入库原因、质量检验情况等"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 入库明细 */}
          <Card 
            title="入库明细" 
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
              dataSource={inboundDetails}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 900 }}
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
                    <Table.Summary.Cell index={2} colSpan={2} />
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

export default StorageInboundForm
