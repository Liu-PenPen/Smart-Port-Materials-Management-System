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
  Tag
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  SearchOutlined,
  UploadOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  CheckOutlined,
  CloseOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CalculatorOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { formatMoney } from '@/utils'
import { ARRIVAL_STATUS_CONFIG, QUALITY_STATUS_CONFIG } from '@/constants'
import type { ArrivalManagement, ArrivalDetail, MaterialPurchase } from '@/types'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const ArrivalManagementForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [form] = Form.useForm()
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<MaterialPurchase | null>(null)
  const [arrivalDetails, setArrivalDetails] = useState<ArrivalDetail[]>([])

  // 获取到货单详情（编辑时）
  const { data: arrival, isLoading } = useQuery({
    queryKey: ['arrival-form', id],
    queryFn: async () => {
      if (!isEdit) return null
      
      // 模拟获取到货单数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockData: ArrivalManagement = {
        id: Number(id),
        arrivalNo: 'AR202508200001',
        purchaseId: 1,
        purchase: {
          id: 1,
          purchaseNo: 'PO202508200001',
          totalAmount: 125000,
          supplier: {
            id: 1,
            supplierName: '中远海运港口设备有限公司',
            supplierCode: 'SUP001'
          } as any
        } as any,
        arrivalDate: '2025-08-20',
        supplierId: 1,
        receiverId: 1,
        status: 'ARRIVED',
        totalQuantity: 23,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        qualityStatus: 'QUALIFIED',
        remarks: '货物已到达，等待检验',
        details: [
          {
            id: 1,
            arrivalId: Number(id),
            materialId: 1,
            materialCode: 'MAT001',
            materialName: '钢丝绳',
            specification: '直径20mm 长度100m',
            unit: '根',
            orderedQuantity: 5,
            arrivedQuantity: 5,
            acceptedQuantity: 0,
            rejectedQuantity: 0,
            unitPrice: 1500,
            amount: 7500,
            qualityStatus: 'QUALIFIED',
            inspectionResult: '',
            remarks: ''
          } as any
        ],
        createdBy: 1,
        createdTime: '2025-08-20T14:00:00',
        version: 1
      }
      
      return mockData
    },
    enabled: isEdit,
  })

  // 模拟已下单的采购单数据
  const mockPurchases: MaterialPurchase[] = [
    {
      id: 1,
      purchaseNo: 'PO202508200001',
      purchaseDate: '2025-08-20',
      purchaseType: 'URGENT',
      totalAmount: 125000,
      status: 'ORDERED',
      supplier: {
        id: 1,
        supplierName: '中远海运港口设备有限公司',
        supplierCode: 'SUP001'
      } as any,
      contractNo: 'CT202508200001',
      deliveryDate: '2025-08-30',
      details: [
        {
          id: 1,
          materialCode: 'MAT001',
          materialName: '钢丝绳',
          specification: '直径20mm 长度100m',
          unit: '根',
          quantity: 5,
          unitPrice: 1500,
          amount: 7500
        } as any
      ]
    } as any,
    {
      id: 2,
      purchaseNo: 'PO202508200002',
      purchaseDate: '2025-08-20',
      purchaseType: 'NORMAL',
      totalAmount: 85000,
      status: 'ORDERED',
      supplier: {
        id: 2,
        supplierName: '上海振华重工股份有限公司',
        supplierCode: 'SUP002'
      } as any,
      contractNo: 'CT202508200002',
      deliveryDate: '2025-09-05',
      details: []
    } as any
  ]

  // 初始化表单数据
  React.useEffect(() => {
    if (arrival) {
      form.setFieldsValue({
        arrivalNo: arrival.arrivalNo,
        arrivalDate: arrival.arrivalDate ? dayjs(arrival.arrivalDate) : null,
        purchaseId: arrival.purchaseId,
        receiverId: arrival.receiverId,
        status: arrival.status,
        qualityStatus: arrival.qualityStatus,
        invoiceNo: arrival.invoiceNo,
        invoiceDate: arrival.invoiceDate ? dayjs(arrival.invoiceDate) : null,
        invoiceAmount: arrival.invoiceAmount,
        remarks: arrival.remarks,
      })
      
      // 设置选中的采购单
      const purchase = mockPurchases.find(p => p.id === arrival.purchaseId)
      if (purchase) {
        setSelectedPurchase(purchase)
      }
      
      setArrivalDetails(arrival.details || [])
    } else {
      // 新建时的默认值
      form.setFieldsValue({
        arrivalDate: dayjs(),
        status: 'ARRIVED',
        qualityStatus: 'QUALIFIED',
      })
    }
  }, [arrival, form])

  // 采购单表格列
  const purchaseColumns = [
    {
      title: '采购单号',
      dataIndex: 'purchaseNo',
      key: 'purchaseNo',
      width: 150,
    },
    {
      title: '采购日期',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      width: 120,
    },
    {
      title: '供应商',
      dataIndex: ['supplier', 'supplierName'],
      key: 'supplierName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '采购金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (value: number) => `¥${formatMoney(value)}`,
    },
    {
      title: '合同号',
      dataIndex: 'contractNo',
      key: 'contractNo',
      width: 120,
    },
    {
      title: '交货日期',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: 120,
    },
  ]

  // 到货明细表格列
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
      ellipsis: true,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: '订购数量',
      dataIndex: 'orderedQuantity',
      key: 'orderedQuantity',
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '到货数量',
      dataIndex: 'arrivedQuantity',
      key: 'arrivedQuantity',
      width: 100,
      render: (value: number, record: ArrivalDetail, index: number) => (
        <InputNumber
          value={value}
          onChange={(newValue) => handleQuantityChange(index, 'arrivedQuantity', newValue || 0)}
          min={0}
          precision={0}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '验收数量',
      dataIndex: 'acceptedQuantity',
      key: 'acceptedQuantity',
      width: 100,
      render: (value: number, record: ArrivalDetail, index: number) => (
        <InputNumber
          value={value}
          onChange={(newValue) => handleQuantityChange(index, 'acceptedQuantity', newValue || 0)}
          min={0}
          max={record.arrivedQuantity}
          precision={0}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '拒收数量',
      dataIndex: 'rejectedQuantity',
      key: 'rejectedQuantity',
      width: 100,
      render: (value: number, record: ArrivalDetail, index: number) => (
        <InputNumber
          value={value}
          onChange={(newValue) => handleQuantityChange(index, 'rejectedQuantity', newValue || 0)}
          min={0}
          max={record.arrivedQuantity}
          precision={0}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '质量状态',
      dataIndex: 'qualityStatus',
      key: 'qualityStatus',
      width: 120,
      render: (value: string, record: ArrivalDetail, index: number) => (
        <Select
          value={value}
          onChange={(newValue) => handleQualityChange(index, newValue)}
          style={{ width: '100%' }}
        >
          <Option value="QUALIFIED">
            <Space>
              <CheckOutlined style={{ color: '#52c41a' }} />
              合格
            </Space>
          </Option>
          <Option value="UNQUALIFIED">
            <Space>
              <WarningOutlined style={{ color: '#ff4d4f' }} />
              不合格
            </Space>
          </Option>
          <Option value="PARTIAL">
            <Space>
              <ExclamationCircleOutlined style={{ color: '#faad14' }} />
              部分合格
            </Space>
          </Option>
        </Select>
      ),
    },
    {
      title: '检验结果',
      dataIndex: 'inspectionResult',
      key: 'inspectionResult',
      width: 200,
      render: (value: string, record: ArrivalDetail, index: number) => (
        <Input
          value={value}
          onChange={(e) => handleInspectionChange(index, e.target.value)}
          placeholder="请输入检验结果"
        />
      ),
    },
  ]

  // 处理选择采购单
  const handleSelectPurchase = (purchase: MaterialPurchase) => {
    setSelectedPurchase(purchase)
    form.setFieldsValue({ 
      purchaseId: purchase.id,
      supplierId: purchase.supplier?.id
    })
    
    // 将采购明细转换为到货明细
    const newDetails: ArrivalDetail[] = purchase.details?.map(detail => ({
      id: Date.now() + Math.random(),
      arrivalId: Number(id) || 0,
      materialId: detail.materialId,
      materialCode: detail.materialCode,
      materialName: detail.materialName,
      specification: detail.specification,
      unit: detail.unit,
      orderedQuantity: detail.quantity,
      arrivedQuantity: detail.quantity,
      acceptedQuantity: 0,
      rejectedQuantity: 0,
      unitPrice: detail.unitPrice,
      amount: detail.amount,
      qualityStatus: 'QUALIFIED',
      inspectionResult: '',
      remarks: ''
    } as ArrivalDetail)) || []
    
    setArrivalDetails(newDetails)
    setPurchaseModalVisible(false)
  }

  // 处理数量变化
  const handleQuantityChange = (index: number, field: 'arrivedQuantity' | 'acceptedQuantity' | 'rejectedQuantity', value: number) => {
    const newDetails = [...arrivalDetails]
    newDetails[index][field] = value
    
    // 自动调整验收和拒收数量
    if (field === 'arrivedQuantity') {
      newDetails[index].acceptedQuantity = Math.min(newDetails[index].acceptedQuantity, value)
      newDetails[index].rejectedQuantity = Math.min(newDetails[index].rejectedQuantity, value)
    } else if (field === 'acceptedQuantity') {
      newDetails[index].rejectedQuantity = newDetails[index].arrivedQuantity - value
    } else if (field === 'rejectedQuantity') {
      newDetails[index].acceptedQuantity = newDetails[index].arrivedQuantity - value
    }
    
    setArrivalDetails(newDetails)
  }

  // 处理质量状态变化
  const handleQualityChange = (index: number, value: string) => {
    const newDetails = [...arrivalDetails]
    newDetails[index].qualityStatus = value
    setArrivalDetails(newDetails)
  }

  // 处理检验结果变化
  const handleInspectionChange = (index: number, value: string) => {
    const newDetails = [...arrivalDetails]
    newDetails[index].inspectionResult = value
    setArrivalDetails(newDetails)
  }

  // 计算总数量
  const calculateTotalQuantity = (details: ArrivalDetail[]) => {
    return details.reduce((sum, detail) => sum + detail.arrivedQuantity, 0)
  }

  // 计算验收数量
  const calculateAcceptedQuantity = (details: ArrivalDetail[]) => {
    return details.reduce((sum, detail) => sum + detail.acceptedQuantity, 0)
  }

  // 计算拒收数量
  const calculateRejectedQuantity = (details: ArrivalDetail[]) => {
    return details.reduce((sum, detail) => sum + detail.rejectedQuantity, 0)
  }

  // 保存到货单
  const saveMutation = useMutation({
    mutationFn: async (values: any) => {
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('保存到货单数据:', values)
      return { success: true }
    },
    onSuccess: () => {
      message.success(isEdit ? '修改成功' : '创建成功')
      navigate('/cargo/arrival-management')
    },
    onError: () => {
      message.error('保存失败')
    },
  })

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (!selectedPurchase) {
        message.error('请选择采购单')
        return
      }

      if (arrivalDetails.length === 0) {
        message.error('请至少添加一个到货明细')
        return
      }

      const totalQuantity = calculateTotalQuantity(arrivalDetails)
      const acceptedQuantity = calculateAcceptedQuantity(arrivalDetails)
      const rejectedQuantity = calculateRejectedQuantity(arrivalDetails)
      
      const submitData = {
        ...values,
        purchaseId: selectedPurchase.id,
        supplierId: selectedPurchase.supplier?.id,
        totalQuantity,
        acceptedQuantity,
        rejectedQuantity,
        details: arrivalDetails,
        arrivalDate: values.arrivalDate?.format('YYYY-MM-DD'),
        invoiceDate: values.invoiceDate?.format('YYYY-MM-DD'),
      }

      saveMutation.mutate(submitData)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const totalQuantity = calculateTotalQuantity(arrivalDetails)
  const acceptedQuantity = calculateAcceptedQuantity(arrivalDetails)
  const rejectedQuantity = calculateRejectedQuantity(arrivalDetails)

  return (
    <div className="page-container">
      <Card
        title={
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/cargo/arrival-management')}
            >
              返回
            </Button>
            {isEdit ? '编辑到货单' : '新建到货单'}
          </Space>
        }
        loading={isLoading}
        extra={
          <Space>
            <Button onClick={() => navigate('/cargo/arrival-management')}>
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
            arrivalDate: dayjs(),
            status: 'ARRIVED',
            qualityStatus: 'QUALIFIED',
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="arrivalNo"
                  label="到货单号"
                  rules={[{ required: true, message: '请输入到货单号' }]}
                >
                  <Input placeholder="系统自动生成" disabled={isEdit} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="arrivalDate"
                  label="到货日期"
                  rules={[{ required: true, message: '请选择到货日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="status"
                  label="到货状态"
                  rules={[{ required: true, message: '请选择到货状态' }]}
                >
                  <Select placeholder="请选择到货状态">
                    <Option value="ARRIVED">已到货</Option>
                    <Option value="INSPECTED">已检验</Option>
                    <Option value="ACCEPTED">已验收</Option>
                    <Option value="REJECTED">已拒收</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>到货总数量</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {totalQuantity}
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>验收数量</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                    {acceptedQuantity}
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>拒收数量</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: rejectedQuantity > 0 ? '#ff4d4f' : '#52c41a' }}>
                    {rejectedQuantity}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* 采购单信息 */}
          <Card 
            title="采购单信息" 
            size="small" 
            style={{ marginBottom: 16 }}
            extra={
              !selectedPurchase && (
                <Button 
                  icon={<SearchOutlined />}
                  onClick={() => setPurchaseModalVisible(true)}
                >
                  选择采购单
                </Button>
              )
            }
          >
            {selectedPurchase ? (
              <div>
                <Descriptions column={3} size="small">
                  <Descriptions.Item label="采购单号">
                    {selectedPurchase.purchaseNo}
                  </Descriptions.Item>
                  <Descriptions.Item label="采购日期">
                    {selectedPurchase.purchaseDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="采购金额">
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                      ¥{formatMoney(selectedPurchase.totalAmount)}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="供应商">
                    {selectedPurchase.supplier?.supplierName}
                  </Descriptions.Item>
                  <Descriptions.Item label="合同号">
                    {selectedPurchase.contractNo}
                  </Descriptions.Item>
                  <Descriptions.Item label="交货日期">
                    {selectedPurchase.deliveryDate}
                  </Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: 16 }}>
                  <Button 
                    icon={<SearchOutlined />}
                    onClick={() => setPurchaseModalVisible(true)}
                  >
                    重新选择
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <CalculatorOutlined style={{ fontSize: '48px', marginBottom: 16 }} />
                <p>请选择要登记到货的采购单</p>
                <Button 
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => setPurchaseModalVisible(true)}
                >
                  选择采购单
                </Button>
              </div>
            )}
          </Card>

          {/* 到货明细 */}
          {arrivalDetails.length > 0 && (
            <Card 
              title={
                <Space>
                  <SafetyCertificateOutlined />
                  到货明细
                </Space>
              } 
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Table
                columns={detailColumns}
                dataSource={arrivalDetails}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 1400 }}
                summary={(pageData) => {
                  const totalOrdered = pageData.reduce((sum, record) => sum + record.orderedQuantity, 0)
                  const totalArrived = pageData.reduce((sum, record) => sum + record.arrivedQuantity, 0)
                  const totalAccepted = pageData.reduce((sum, record) => sum + record.acceptedQuantity, 0)
                  const totalRejected = pageData.reduce((sum, record) => sum + record.rejectedQuantity, 0)
                  
                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={4}>
                        <strong>合计</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <strong>{totalOrdered.toLocaleString()}</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        <strong>{totalArrived.toLocaleString()}</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>
                        <strong style={{ color: '#52c41a' }}>{totalAccepted.toLocaleString()}</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>
                        <strong style={{ color: totalRejected > 0 ? '#ff4d4f' : '#52c41a' }}>
                          {totalRejected.toLocaleString()}
                        </strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5} colSpan={2} />
                    </Table.Summary.Row>
                  )
                }}
              />
            </Card>
          )}

          {/* 发票信息 */}
          <Card title="发票信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="invoiceNo"
                  label="发票号"
                >
                  <Input placeholder="请输入发票号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="invoiceDate"
                  label="发票日期"
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="invoiceAmount"
                  label="发票金额"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    precision={2}
                    formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => Number(value!.replace(/\¥\s?|(,*)/g, '')) as any}
                  />
                </Form.Item>
              </Col>
            </Row>
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
                    支持上传到货单、发票、检验报告等相关文件
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="remarks"
                  label="到货备注"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="请输入到货备注"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>

        {/* 选择采购单Modal */}
        <Modal
          title="选择采购单"
          open={purchaseModalVisible}
          onCancel={() => setPurchaseModalVisible(false)}
          footer={null}
          width={1000}
        >
          <Table
            columns={purchaseColumns}
            dataSource={mockPurchases.filter(purchase => purchase.status === 'ORDERED')}
            rowKey="id"
            size="small"
            onRow={(record) => ({
              onClick: () => handleSelectPurchase(record),
              style: { cursor: 'pointer' }
            })}
            pagination={false}
          />
        </Modal>
      </Card>
    </div>
  )
}

export default ArrivalManagementForm
