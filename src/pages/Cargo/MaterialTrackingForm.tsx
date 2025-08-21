import React, { useState } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  message,
  Row,
  Col,
  InputNumber,
  Table,
  Modal,
  DatePicker,
  Upload,
  Descriptions,
  Tag,
  TimePicker
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  SearchOutlined,
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  InboxOutlined,
  CarOutlined,
  HomeOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { formatMoney } from '@/utils'
import { TRACKING_STATUS_CONFIG, LOCATION_TYPE_CONFIG } from '@/constants'
import type { MaterialTracking, TrackingRecord, ArrivalManagement } from '@/types'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const MaterialTrackingForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [form] = Form.useForm()
  const [arrivalModalVisible, setArrivalModalVisible] = useState(false)
  const [selectedArrival, setSelectedArrival] = useState<ArrivalManagement | null>(null)
  const [trackingRecords, setTrackingRecords] = useState<TrackingRecord[]>([])
  const [recordModalVisible, setRecordModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TrackingRecord | null>(null)
  const [recordForm] = Form.useForm()

  // 获取追踪单详情（编辑时）
  const { data: tracking, isLoading } = useQuery({
    queryKey: ['tracking-form', id],
    queryFn: async () => {
      if (!isEdit) return null
      
      // 模拟获取追踪单数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockData: MaterialTracking = {
        id: Number(id),
        trackingNo: 'TK202508200001',
        materialId: 1,
        material: {
          id: 1,
          materialName: '钢丝绳',
          materialCode: 'MAT001'
        } as any,
        purchaseId: 1,
        arrivalId: 1,
        quantity: 5,
        currentLocation: '港口仓库A区',
        currentStatus: 'IN_WAREHOUSE',
        startDate: '2025-08-20',
        expectedEndDate: '2025-08-30',
        responsiblePerson: '仓管员张三',
        contactPhone: '13800138001',
        remarks: '物资追踪正常',
        records: [
          {
            id: 1,
            trackingId: Number(id),
            recordDate: '2025-08-20T08:00:00',
            location: '供应商仓库',
            locationType: 'SUPPLIER',
            status: 'SHIPPED',
            description: '货物从供应商仓库发出',
            operator: '供应商发货员',
            contactInfo: '021-12345678',
            remarks: '货物包装完好'
          } as any
        ],
        createdBy: 1,
        createdTime: '2025-08-20T08:00:00',
        version: 1
      }
      
      return mockData
    },
    enabled: isEdit,
  })

  // 模拟已验收的到货单数据
  const mockArrivals: ArrivalManagement[] = [
    {
      id: 1,
      arrivalNo: 'AR202508200001',
      arrivalDate: '2025-08-20',
      status: 'ACCEPTED',
      purchase: {
        id: 1,
        purchaseNo: 'PO202508200001',
        supplier: {
          id: 1,
          supplierName: '中远海运港口设备有限公司',
          supplierCode: 'SUP001'
        } as any
      } as any,
      totalQuantity: 23,
      acceptedQuantity: 23,
      details: [
        {
          id: 1,
          materialCode: 'MAT001',
          materialName: '钢丝绳',
          specification: '直径20mm 长度100m',
          unit: '根',
          acceptedQuantity: 5
        } as any
      ]
    } as any,
    {
      id: 2,
      arrivalNo: 'AR202508200002',
      arrivalDate: '2025-08-20',
      status: 'ACCEPTED',
      purchase: {
        id: 2,
        purchaseNo: 'PO202508200002',
        supplier: {
          id: 2,
          supplierName: '上海振华重工股份有限公司',
          supplierCode: 'SUP002'
        } as any
      } as any,
      totalQuantity: 15,
      acceptedQuantity: 15,
      details: []
    } as any
  ]

  // 初始化表单数据
  React.useEffect(() => {
    if (tracking) {
      form.setFieldsValue({
        trackingNo: tracking.trackingNo,
        arrivalId: tracking.arrivalId,
        materialId: tracking.materialId,
        quantity: tracking.quantity,
        currentLocation: tracking.currentLocation,
        currentStatus: tracking.currentStatus,
        startDate: tracking.startDate ? dayjs(tracking.startDate) : null,
        expectedEndDate: tracking.expectedEndDate ? dayjs(tracking.expectedEndDate) : null,
        actualEndDate: tracking.actualEndDate ? dayjs(tracking.actualEndDate) : null,
        responsiblePerson: tracking.responsiblePerson,
        contactPhone: tracking.contactPhone,
        remarks: tracking.remarks,
      })
      
      // 设置选中的到货单
      const arrival = mockArrivals.find(a => a.id === tracking.arrivalId)
      if (arrival) {
        setSelectedArrival(arrival)
      }
      
      setTrackingRecords(tracking.records || [])
    } else {
      // 新建时的默认值
      form.setFieldsValue({
        startDate: dayjs(),
        currentStatus: 'SHIPPED',
      })
    }
  }, [tracking, form])

  // 到货单表格列
  const arrivalColumns = [
    {
      title: '到货单号',
      dataIndex: 'arrivalNo',
      key: 'arrivalNo',
      width: 150,
    },
    {
      title: '到货日期',
      dataIndex: 'arrivalDate',
      key: 'arrivalDate',
      width: 120,
    },
    {
      title: '采购单号',
      dataIndex: ['purchase', 'purchaseNo'],
      key: 'purchaseNo',
      width: 150,
    },
    {
      title: '供应商',
      dataIndex: ['purchase', 'supplier', 'supplierName'],
      key: 'supplierName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '验收数量',
      dataIndex: 'acceptedQuantity',
      key: 'acceptedQuantity',
      width: 120,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: string) => (
        <Tag color="green">已验收</Tag>
      ),
    },
  ]

  // 追踪记录表格列
  const recordColumns = [
    {
      title: '记录时间',
      dataIndex: 'recordDate',
      key: 'recordDate',
      width: 150,
      render: (value: string) => dayjs(value).format('MM-DD HH:mm'),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: '位置类型',
      dataIndex: 'locationType',
      key: 'locationType',
      width: 120,
      render: (value: string) => {
        const config = LOCATION_TYPE_CONFIG[value as keyof typeof LOCATION_TYPE_CONFIG]
        return config ? (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        ) : value
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: string) => {
        const config = TRACKING_STATUS_CONFIG[value as keyof typeof TRACKING_STATUS_CONFIG]
        return config ? (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        ) : value
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record: TrackingRecord, index: number) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => handleEditRecord(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger
            onClick={() => handleDeleteRecord(index)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  // 处理选择到货单
  const handleSelectArrival = (arrival: ArrivalManagement) => {
    setSelectedArrival(arrival)
    form.setFieldsValue({ 
      arrivalId: arrival.id,
      purchaseId: arrival.purchase?.id
    })
    setArrivalModalVisible(false)
  }

  // 处理添加追踪记录
  const handleAddRecord = () => {
    setEditingRecord(null)
    recordForm.resetFields()
    recordForm.setFieldsValue({
      recordDate: dayjs(),
      recordTime: dayjs(),
    })
    setRecordModalVisible(true)
  }

  // 处理编辑追踪记录
  const handleEditRecord = (record: TrackingRecord) => {
    setEditingRecord(record)
    recordForm.setFieldsValue({
      ...record,
      recordDate: dayjs(record.recordDate),
      recordTime: dayjs(record.recordDate),
    })
    setRecordModalVisible(true)
  }

  // 处理删除追踪记录
  const handleDeleteRecord = (index: number) => {
    const newRecords = [...trackingRecords]
    newRecords.splice(index, 1)
    setTrackingRecords(newRecords)
    message.success('删除成功')
  }

  // 处理保存追踪记录
  const handleSaveRecord = async () => {
    try {
      const values = await recordForm.validateFields()
      
      // 合并日期和时间
      const recordDateTime = values.recordDate
        .hour(values.recordTime.hour())
        .minute(values.recordTime.minute())
        .second(0)

      const newRecord: TrackingRecord = {
        id: editingRecord?.id || Date.now(),
        trackingId: Number(id) || 0,
        recordDate: recordDateTime.toISOString(),
        location: values.location,
        locationType: values.locationType,
        status: values.status,
        description: values.description,
        operator: values.operator,
        contactInfo: values.contactInfo,
        remarks: values.remarks,
        createdBy: 1,
        createdTime: new Date().toISOString(),
        version: 1
      }

      if (editingRecord) {
        // 编辑记录
        const index = trackingRecords.findIndex(r => r.id === editingRecord.id)
        if (index >= 0) {
          const newRecords = [...trackingRecords]
          newRecords[index] = newRecord
          setTrackingRecords(newRecords)
        }
      } else {
        // 添加新记录
        setTrackingRecords([...trackingRecords, newRecord])
      }

      setRecordModalVisible(false)
      message.success(editingRecord ? '修改成功' : '添加成功')
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  // 保存追踪单
  const saveMutation = useMutation({
    mutationFn: async (values: any) => {
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('保存追踪单数据:', values)
      return { success: true }
    },
    onSuccess: () => {
      message.success(isEdit ? '修改成功' : '创建成功')
      navigate('/cargo/material-tracking')
    },
    onError: () => {
      message.error('保存失败')
    },
  })

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (!selectedArrival) {
        message.error('请选择到货单')
        return
      }

      if (trackingRecords.length === 0) {
        message.error('请至少添加一条追踪记录')
        return
      }
      
      const submitData = {
        ...values,
        arrivalId: selectedArrival.id,
        purchaseId: selectedArrival.purchase?.id,
        records: trackingRecords,
        startDate: values.startDate?.format('YYYY-MM-DD'),
        expectedEndDate: values.expectedEndDate?.format('YYYY-MM-DD'),
        actualEndDate: values.actualEndDate?.format('YYYY-MM-DD'),
      }

      saveMutation.mutate(submitData)
    } catch (error) {
      console.error('表单验证失败:', error)
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
              onClick={() => navigate('/cargo/material-tracking')}
            >
              返回
            </Button>
            {isEdit ? '编辑追踪单' : '新建追踪单'}
          </Space>
        }
        loading={isLoading}
        extra={
          <Space>
            <Button onClick={() => navigate('/cargo/material-tracking')}>
              取消
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              loading={saveMutation.isPending}
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
            startDate: dayjs(),
            currentStatus: 'SHIPPED',
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="trackingNo"
                  label="追踪单号"
                  rules={[{ required: true, message: '请输入追踪单号' }]}
                >
                  <Input placeholder="系统自动生成" disabled={isEdit} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="startDate"
                  label="开始日期"
                  rules={[{ required: true, message: '请选择开始日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="expectedEndDate"
                  label="预计完成日期"
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="currentStatus"
                  label="当前状态"
                  rules={[{ required: true, message: '请选择当前状态' }]}
                >
                  <Select placeholder="请选择当前状态">
                    <Option value="SHIPPED">
                      <Space>
                        <TruckOutlined />
                        已发货
                      </Space>
                    </Option>
                    <Option value="IN_TRANSIT">
                      <Space>
                        <CarOutlined />
                        运输中
                      </Space>
                    </Option>
                    <Option value="ARRIVED">
                      <Space>
                        <EnvironmentOutlined />
                        已到达
                      </Space>
                    </Option>
                    <Option value="IN_WAREHOUSE">
                      <Space>
                        <InboxOutlined />
                        已入库
                      </Space>
                    </Option>
                    <Option value="DELIVERED">
                      <Space>
                        <HomeOutlined />
                        已配送
                      </Space>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="currentLocation"
                  label="当前位置"
                  rules={[{ required: true, message: '请输入当前位置' }]}
                >
                  <Input placeholder="请输入当前位置" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="actualEndDate"
                  label="实际完成日期"
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="responsiblePerson"
                  label="负责人"
                  rules={[{ required: true, message: '请输入负责人' }]}
                >
                  <Input placeholder="请输入负责人" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="contactPhone"
                  label="联系电话"
                  rules={[{ required: true, message: '请输入联系电话' }]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="quantity"
                  label="追踪数量"
                  rules={[{ required: true, message: '请输入追踪数量' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1}
                    precision={0}
                    placeholder="请输入追踪数量"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 到货单信息 */}
          <Card 
            title="到货单信息" 
            size="small" 
            style={{ marginBottom: 16 }}
            extra={
              !selectedArrival && (
                <Button 
                  icon={<SearchOutlined />}
                  onClick={() => setArrivalModalVisible(true)}
                >
                  选择到货单
                </Button>
              )
            }
          >
            {selectedArrival ? (
              <div>
                <Descriptions column={3} size="small">
                  <Descriptions.Item label="到货单号">
                    {selectedArrival.arrivalNo}
                  </Descriptions.Item>
                  <Descriptions.Item label="到货日期">
                    {selectedArrival.arrivalDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="验收数量">
                    {selectedArrival.acceptedQuantity}
                  </Descriptions.Item>
                  <Descriptions.Item label="采购单号">
                    {selectedArrival.purchase?.purchaseNo}
                  </Descriptions.Item>
                  <Descriptions.Item label="供应商">
                    {selectedArrival.purchase?.supplier?.supplierName}
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag color="green">已验收</Tag>
                  </Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: 16 }}>
                  <Button 
                    icon={<SearchOutlined />}
                    onClick={() => setArrivalModalVisible(true)}
                  >
                    重新选择
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <InboxOutlined style={{ fontSize: '48px', marginBottom: 16 }} />
                <p>请选择要追踪的到货单</p>
                <Button 
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => setArrivalModalVisible(true)}
                >
                  选择到货单
                </Button>
              </div>
            )}
          </Card>

          {/* 追踪记录 */}
          <Card 
            title="追踪记录" 
            size="small"
            style={{ marginBottom: 16 }}
            extra={
              <Button 
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddRecord}
              >
                添加记录
              </Button>
            }
          >
            <Table
              columns={recordColumns}
              dataSource={trackingRecords}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 1200 }}
            />
          </Card>

          {/* 备注信息 */}
          <Card title="备注信息" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="attachments"
                  label="附件"
                >
                  <Upload>
                    <Button icon={<UploadOutlined />}>上传附件</Button>
                  </Upload>
                  <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
                    支持上传运输单据、签收凭证等相关文件
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="remarks"
                  label="追踪备注"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="请输入追踪备注"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>

        {/* 选择到货单Modal */}
        <Modal
          title="选择到货单"
          open={arrivalModalVisible}
          onCancel={() => setArrivalModalVisible(false)}
          footer={null}
          width={1000}
        >
          <Table
            columns={arrivalColumns}
            dataSource={mockArrivals.filter(arrival => arrival.status === 'ACCEPTED')}
            rowKey="id"
            size="small"
            onRow={(record) => ({
              onClick: () => handleSelectArrival(record),
              style: { cursor: 'pointer' }
            })}
            pagination={false}
          />
        </Modal>

        {/* 追踪记录Modal */}
        <Modal
          title={editingRecord ? '编辑追踪记录' : '添加追踪记录'}
          open={recordModalVisible}
          onCancel={() => setRecordModalVisible(false)}
          onOk={handleSaveRecord}
          width={600}
        >
          <Form
            form={recordForm}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="recordDate"
                  label="记录日期"
                  rules={[{ required: true, message: '请选择记录日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="recordTime"
                  label="记录时间"
                  rules={[{ required: true, message: '请选择记录时间' }]}
                >
                  <TimePicker style={{ width: '100%' }} format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="location"
                  label="位置"
                  rules={[{ required: true, message: '请输入位置' }]}
                >
                  <Input placeholder="请输入位置" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="locationType"
                  label="位置类型"
                  rules={[{ required: true, message: '请选择位置类型' }]}
                >
                  <Select placeholder="请选择位置类型">
                    <Option value="SUPPLIER">供应商</Option>
                    <Option value="TRANSIT">运输中</Option>
                    <Option value="PORT_GATE">港口大门</Option>
                    <Option value="WAREHOUSE">仓库</Option>
                    <Option value="CUSTOMER">客户</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select placeholder="请选择状态">
                    <Option value="SHIPPED">已发货</Option>
                    <Option value="IN_TRANSIT">运输中</Option>
                    <Option value="ARRIVED">已到达</Option>
                    <Option value="IN_WAREHOUSE">已入库</Option>
                    <Option value="DELIVERED">已配送</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="operator"
                  label="操作人"
                  rules={[{ required: true, message: '请输入操作人' }]}
                >
                  <Input placeholder="请输入操作人" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="描述"
              rules={[{ required: true, message: '请输入描述' }]}
            >
              <Input placeholder="请输入描述" />
            </Form.Item>

            <Form.Item
              name="contactInfo"
              label="联系方式"
            >
              <Input placeholder="请输入联系方式" />
            </Form.Item>

            <Form.Item
              name="remarks"
              label="备注"
            >
              <TextArea rows={3} placeholder="请输入备注" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  )
}

export default MaterialTrackingForm
