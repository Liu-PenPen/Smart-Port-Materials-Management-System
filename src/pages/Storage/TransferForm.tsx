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
  Radio,
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
  WarningOutlined,
  TruckOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { getCurrentPeriod } from '@/utils'
import { TRANSFER_TYPE_CONFIG, TRANSPORT_METHOD_CONFIG, URGENCY_LEVEL_CONFIG } from '@/constants'
import type { TransferOrder, TransferDetail, Material, Warehouse } from '@/types'

const { TextArea } = Input
const { Option } = Select

const StorageTransferForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [form] = Form.useForm()
  const [materialModalVisible, setMaterialModalVisible] = useState(false)
  const [transferDetails, setTransferDetails] = useState<TransferDetail[]>([])

  // 获取移库单详情（编辑时）
  const { data: transferOrder, isLoading } = useQuery({
    queryKey: ['transfer-form', id],
    queryFn: async () => {
      if (!isEdit) return null
      
      // 模拟获取移库单数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockData: TransferOrder = {
        id: Number(id),
        transferNo: 'TR202508060001',
        transferType: 'SHIP_SCHEDULE_TRANSFER',
        sourceWarehouseId: 1,
        targetWarehouseId: 2,
        transferDate: '2025-08-20T09:00:00',
        planTransferDate: '2025-08-20T09:00:00',
        actualTransferDate: undefined,
        status: 'UNDER_REVIEW',
        transferReason: '船期调整，货物需要转移到2号码头',
        urgencyLevel: 'HIGH',
        shipScheduleNo: 'COSCO2025080601',
        berthNo: '2号泊位',
        operatorId: 1,
        approvedBy: undefined,
        approver: undefined,
        approvedTime: undefined,
        isArchived: false,
        periodMonth: '2025-08',
        transportMethod: 'CRANE',
        estimatedDuration: 4,
        actualDuration: undefined,
        remarks: '需要协调起重机作业时间',
        details: [
          {
            id: 1,
            transferOrderId: Number(id),
            materialId: 1,
            materialCode: 'MAT001',
            materialName: '集装箱',
            specification: '20英尺标准集装箱',
            sourceStorageArea: 'A区-01-05',
            targetStorageArea: 'B区-02-08',
            quantity: 15,
            transferredQuantity: 0,
            unitPrice: 0,
            amount: 0,
            packageType: '集装箱',
            weight: 24000,
            volume: 33.2,
            specialRequirements: '危险品，需要特殊处理',
            createdBy: 1,
            createdTime: '2025-08-20T08:00:00',
            version: 1
          }
        ],
        createdBy: 1,
        createdTime: '2025-08-20T08:00:00',
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
    { id: 4, warehouseName: '危险品仓库', warehouseCode: 'WH004' } as Warehouse,
    { id: 5, warehouseName: '冷藏仓库', warehouseCode: 'WH005' } as Warehouse,
  ]

  const mockMaterials: Material[] = [
    {
      id: 1,
      materialCode: 'MAT001',
      materialName: '集装箱',
      specification: '20英尺标准集装箱',
      unit: '个',
      status: 'ACTIVE'
    } as Material,
    {
      id: 2,
      materialCode: 'MAT002',
      materialName: '钢材',
      specification: 'Q235B 螺纹钢',
      unit: '吨',
      status: 'ACTIVE'
    } as Material,
    {
      id: 3,
      materialCode: 'MAT003',
      materialName: '机械设备',
      specification: '港口起重机配件',
      unit: '台',
      status: 'ACTIVE'
    } as Material,
  ]

  // 检查期间锁定
  const currentPeriod = getCurrentPeriod()
  const selectedPeriod = Form.useWatch('periodMonth', form) || currentPeriod
  const isPeriodLocked = selectedPeriod < currentPeriod

  // 监听移库类型变化
  const transferType = Form.useWatch('transferType', form)
  const sourceWarehouseId = Form.useWatch('sourceWarehouseId', form)
  const targetWarehouseId = Form.useWatch('targetWarehouseId', form)

  // 初始化表单数据
  React.useEffect(() => {
    if (transferOrder) {
      form.setFieldsValue({
        transferNo: transferOrder.transferNo,
        transferType: transferOrder.transferType,
        sourceWarehouseId: transferOrder.sourceWarehouseId,
        targetWarehouseId: transferOrder.targetWarehouseId,
        planTransferDate: dayjs(transferOrder.planTransferDate),
        transferReason: transferOrder.transferReason,
        urgencyLevel: transferOrder.urgencyLevel,
        shipScheduleNo: transferOrder.shipScheduleNo,
        berthNo: transferOrder.berthNo,
        transportMethod: transferOrder.transportMethod,
        estimatedDuration: transferOrder.estimatedDuration,
        periodMonth: transferOrder.periodMonth,
        remarks: transferOrder.remarks,
      })
      setTransferDetails(transferOrder.details || [])
    } else {
      // 新建时的默认值
      form.setFieldsValue({
        periodMonth: currentPeriod,
        planTransferDate: dayjs(),
        urgencyLevel: 'MEDIUM',
        transportMethod: 'FORKLIFT',
        estimatedDuration: 2,
      })
    }
  }, [transferOrder, form, currentPeriod])

  // 移库明细表格列
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
      width: 180,
    },
    {
      title: '源货区',
      dataIndex: 'sourceStorageArea',
      key: 'sourceStorageArea',
      width: 120,
      render: (value: string, record: TransferDetail, index: number) => (
        <Input
          value={value}
          placeholder="如：A区-01-05"
          onChange={(e) => {
            const newDetails = [...transferDetails]
            newDetails[index].sourceStorageArea = e.target.value
            setTransferDetails(newDetails)
          }}
        />
      ),
    },
    {
      title: '目标货区',
      dataIndex: 'targetStorageArea',
      key: 'targetStorageArea',
      width: 120,
      render: (value: string, record: TransferDetail, index: number) => (
        <Input
          value={value}
          placeholder="如：B区-02-08"
          onChange={(e) => {
            const newDetails = [...transferDetails]
            newDetails[index].targetStorageArea = e.target.value
            setTransferDetails(newDetails)
          }}
        />
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (value: number, record: TransferDetail, index: number) => (
        <InputNumber
          value={value}
          min={0}
          precision={0}
          onChange={(newValue) => {
            const newDetails = [...transferDetails]
            newDetails[index].quantity = newValue || 0
            setTransferDetails(newDetails)
          }}
        />
      ),
    },
    {
      title: '重量(kg)',
      dataIndex: 'weight',
      key: 'weight',
      width: 100,
      render: (value: number, record: TransferDetail, index: number) => (
        <InputNumber
          value={value}
          min={0}
          precision={1}
          onChange={(newValue) => {
            const newDetails = [...transferDetails]
            newDetails[index].weight = newValue || 0
            setTransferDetails(newDetails)
          }}
        />
      ),
    },
    {
      title: '体积(m³)',
      dataIndex: 'volume',
      key: 'volume',
      width: 100,
      render: (value: number, record: TransferDetail, index: number) => (
        <InputNumber
          value={value}
          min={0}
          precision={2}
          onChange={(newValue) => {
            const newDetails = [...transferDetails]
            newDetails[index].volume = newValue || 0
            setTransferDetails(newDetails)
          }}
        />
      ),
    },
    {
      title: '包装方式',
      dataIndex: 'packageType',
      key: 'packageType',
      width: 120,
      render: (value: string, record: TransferDetail, index: number) => (
        <Select
          value={value}
          style={{ width: '100%' }}
          onChange={(newValue) => {
            const newDetails = [...transferDetails]
            newDetails[index].packageType = newValue
            setTransferDetails(newDetails)
          }}
        >
          <Option value="散装">散装</Option>
          <Option value="袋装">袋装</Option>
          <Option value="箱装">箱装</Option>
          <Option value="集装箱">集装箱</Option>
          <Option value="托盘">托盘</Option>
          <Option value="捆装">捆装</Option>
          <Option value="木箱包装">木箱包装</Option>
        </Select>
      ),
    },
    {
      title: '特殊要求',
      dataIndex: 'specialRequirements',
      key: 'specialRequirements',
      width: 150,
      render: (value: string, record: TransferDetail, index: number) => (
        <Input
          value={value}
          placeholder="如：防潮、防震等"
          onChange={(e) => {
            const newDetails = [...transferDetails]
            newDetails[index].specialRequirements = e.target.value
            setTransferDetails(newDetails)
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: TransferDetail, index: number) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            const newDetails = transferDetails.filter((_, i) => i !== index)
            setTransferDetails(newDetails)
          }}
        >
          删除
        </Button>
      ),
    },
  ]

  // 添加物料
  const handleAddMaterial = (material: Material) => {
    const newDetail: TransferDetail = {
      id: Date.now(), // 临时ID
      transferOrderId: Number(id) || 0,
      materialId: material.id,
      materialCode: material.materialCode,
      materialName: material.materialName,
      specification: material.specification || '',
      sourceStorageArea: '',
      targetStorageArea: '',
      quantity: 1,
      transferredQuantity: 0,
      unitPrice: 0,
      amount: 0,
      packageType: '散装',
      weight: 0,
      volume: 0,
      specialRequirements: '',
      createdBy: 1,
      createdTime: new Date().toISOString(),
      version: 1
    }
    setTransferDetails([...transferDetails, newDetail])
    setMaterialModalVisible(false)
  }

  // 保存移库单
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      
      if (transferDetails.length === 0) {
        message.error('请至少添加一条移库明细')
        return
      }

      if (isPeriodLocked) {
        message.error('该期间已锁定，不允许保存')
        return
      }

      // 验证源仓库和目标仓库
      if (transferType !== 'AREA_TRANSFER' && values.sourceWarehouseId === values.targetWarehouseId) {
        message.error('源仓库和目标仓库不能相同')
        return
      }

      const transferData = {
        ...values,
        planTransferDate: values.planTransferDate?.format('YYYY-MM-DD HH:mm:ss'),
        details: transferDetails,
      }

      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      message.success(isEdit ? '修改成功' : '创建成功')
      navigate('/storage/transfer')
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
              onClick={() => navigate('/storage/transfer')}
            >
              返回
            </Button>
            {isEdit ? '修改移库单' : '新建移库单'}
          </Space>
        }
        loading={isLoading}
        extra={
          <Space>
            <Button onClick={() => navigate('/storage/transfer')}>
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
            description={`${selectedPeriod} 期间已生成报表并锁定，不允许新增或修改移库单据。`}
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
            planTransferDate: dayjs(),
            urgencyLevel: 'MEDIUM',
            transportMethod: 'FORKLIFT',
            estimatedDuration: 2,
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="transferNo"
                  label="移库单号"
                  rules={[{ required: true, message: '请输入移库单号' }]}
                >
                  <Input placeholder="系统自动生成" disabled={isEdit} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="transferType"
                  label="移库类型"
                  rules={[{ required: true, message: '请选择移库类型' }]}
                >
                  <Select placeholder="请选择移库类型">
                    <Option value="WAREHOUSE_TRANSFER">仓库间移库</Option>
                    <Option value="AREA_TRANSFER">货区调整</Option>
                    <Option value="SHIP_SCHEDULE_TRANSFER">船期调整</Option>
                    <Option value="EMERGENCY_TRANSFER">紧急移库</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="urgencyLevel"
                  label="紧急程度"
                  rules={[{ required: true, message: '请选择紧急程度' }]}
                >
                  <Radio.Group>
                    <Radio.Button value="LOW">低</Radio.Button>
                    <Radio.Button value="MEDIUM">中</Radio.Button>
                    <Radio.Button value="HIGH">高</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="sourceWarehouseId"
                  label="源仓库"
                  rules={[{ required: true, message: '请选择源仓库' }]}
                >
                  <Select placeholder="请选择源仓库">
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
                  name="targetWarehouseId"
                  label="目标仓库"
                  rules={[{ required: true, message: '请选择目标仓库' }]}
                >
                  <Select 
                    placeholder="请选择目标仓库"
                    disabled={transferType === 'AREA_TRANSFER'}
                  >
                    {mockWarehouses
                      .filter(w => transferType === 'AREA_TRANSFER' || w.id !== sourceWarehouseId)
                      .map(warehouse => (
                        <Option key={warehouse.id} value={warehouse.id}>
                          {warehouse.warehouseName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="planTransferDate"
                  label="计划移库时间"
                  rules={[{ required: true, message: '请选择计划移库时间' }]}
                >
                  <DatePicker 
                    showTime 
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 移库详情 */}
          <Card title="移库详情" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="transportMethod"
                  label="运输方式"
                  rules={[{ required: true, message: '请选择运输方式' }]}
                >
                  <Select>
                    <Option value="FORKLIFT">叉车运输</Option>
                    <Option value="CRANE">起重机</Option>
                    <Option value="TRUCK">卡车运输</Option>
                    <Option value="CONVEYOR">传送带</Option>
                    <Option value="MANUAL">人工搬运</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="estimatedDuration"
                  label="预计耗时(小时)"
                  rules={[{ required: true, message: '请输入预计耗时' }]}
                >
                  <InputNumber
                    min={0.1}
                    max={24}
                    step={0.5}
                    precision={1}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="periodMonth"
                  label="期间月份"
                  rules={[{ required: true, message: '请选择期间月份' }]}
                >
                  <Input placeholder="YYYY-MM" disabled />
                </Form.Item>
              </Col>
            </Row>

            {/* 船期相关信息 */}
            {transferType === 'SHIP_SCHEDULE_TRANSFER' && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="shipScheduleNo"
                    label="船期号"
                    rules={[{ required: true, message: '请输入船期号' }]}
                  >
                    <Input placeholder="如：COSCO2025080601" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="berthNo"
                    label="泊位号"
                    rules={[{ required: true, message: '请输入泊位号' }]}
                  >
                    <Input placeholder="如：2号泊位" />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="transferReason"
                  label="移库原因"
                  rules={[{ required: true, message: '请输入移库原因' }]}
                >
                  <TextArea 
                    rows={2} 
                    placeholder="请详细说明移库原因，如船期调整、库存优化、设备故障等"
                    maxLength={500}
                    showCount
                  />
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
                    rows={2} 
                    placeholder="请输入备注信息，如特殊要求、注意事项等"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 移库明细 */}
          <Card 
            title="移库明细" 
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
              dataSource={transferDetails}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 1400 }}
              summary={(pageData) => {
                const totalQuantity = pageData.reduce((sum, record) => sum + record.quantity, 0)
                const totalWeight = pageData.reduce((sum, record) => sum + (record.weight || 0), 0)
                const totalVolume = pageData.reduce((sum, record) => sum + (record.volume || 0), 0)
                
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={5}>
                      <strong>合计</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>{totalQuantity.toLocaleString()}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <strong>{totalWeight.toLocaleString()}kg</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <strong>{totalVolume}m³</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} colSpan={3} />
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

export default StorageTransferForm
