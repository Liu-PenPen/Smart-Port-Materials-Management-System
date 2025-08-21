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
  Descriptions
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  SearchOutlined,
  UploadOutlined,
  FileTextOutlined,
  DollarOutlined,
  BankOutlined,
  CreditCardOutlined,
  CalculatorOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { formatMoney } from '@/utils'
import dayjs from 'dayjs'
import type { PurchaseSettlement, MaterialPurchase } from '@/types'

const { TextArea } = Input
const { Option } = Select

const PurchaseSettlementForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [form] = Form.useForm()
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<MaterialPurchase | null>(null)
  const [invoiceAmount, setInvoiceAmount] = useState<number>(0)

  // 获取结算单详情（编辑时）
  const { data: settlement, isLoading } = useQuery({
    queryKey: ['settlement-form', id],
    queryFn: async () => {
      if (!isEdit) return null
      
      // 模拟获取结算单数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockData: PurchaseSettlement = {
        id: Number(id),
        settlementNo: 'ST202508200001',
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
        settlementDate: '2025-08-20',
        totalAmount: 125000,
        paidAmount: 0,
        remainingAmount: 125000,
        status: 'PENDING',
        paymentMethod: 'TRANSFER',
        invoiceNo: 'INV202508200001',
        invoiceDate: '2025-08-20',
        invoiceAmount: 125000,
        actualAmount: 125000,
        amountDifference: 0,
        remarks: '预付30%，剩余货到付款',
        createdBy: 1,
        createdTime: '2025-08-20T10:00:00',
        version: 1
      }
      
      return mockData
    },
    enabled: isEdit,
  })

  // 模拟已批准的采购单数据
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
      paymentTerms: '预付30%，货到付70%'
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
      paymentTerms: '30天账期'
    } as any,
    {
      id: 3,
      purchaseNo: 'PO202508190001',
      purchaseDate: '2025-08-19',
      purchaseType: 'CENTRALIZED',
      totalAmount: 250000,
      status: 'ORDERED',
      supplier: {
        id: 3,
        supplierName: '青岛港务机械制造有限公司',
        supplierCode: 'SUP003'
      } as any,
      contractNo: 'CT202508190001',
      deliveryDate: '2025-09-15',
      paymentTerms: '预付30%，货到付70%'
    } as any
  ]

  // 初始化表单数据
  React.useEffect(() => {
    if (settlement) {
      form.setFieldsValue({
        settlementNo: settlement.settlementNo,
        settlementDate: settlement.settlementDate ? dayjs(settlement.settlementDate) : null,
        purchaseId: settlement.purchaseId,
        paymentMethod: settlement.paymentMethod,
        invoiceNo: settlement.invoiceNo,
        invoiceDate: settlement.invoiceDate ? dayjs(settlement.invoiceDate) : null,
        invoiceAmount: settlement.invoiceAmount,
        differenceReason: settlement.differenceReason,
        remarks: settlement.remarks,
      })
      
      // 设置选中的采购单
      const purchase = mockPurchases.find(p => p.id === settlement.purchaseId)
      if (purchase) {
        setSelectedPurchase(purchase)
      }
      
      setInvoiceAmount(settlement.invoiceAmount || 0)
    } else {
      // 新建时的默认值
      form.setFieldsValue({
        settlementDate: dayjs(),
        paymentMethod: 'TRANSFER',
      })
    }
  }, [settlement, form])

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
      title: '付款条件',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
      width: 150,
      ellipsis: true,
    },
  ]

  // 处理选择采购单
  const handleSelectPurchase = (purchase: MaterialPurchase) => {
    setSelectedPurchase(purchase)
    form.setFieldsValue({ 
      purchaseId: purchase.id,
      invoiceAmount: purchase.totalAmount
    })
    setInvoiceAmount(purchase.totalAmount)
    setPurchaseModalVisible(false)
  }

  // 处理发票金额变化
  const handleInvoiceAmountChange = (value: number | null) => {
    const amount = value || 0
    setInvoiceAmount(amount)
    
    // 计算金额差异
    if (selectedPurchase) {
      const difference = amount - selectedPurchase.totalAmount
      form.setFieldsValue({ amountDifference: difference })
    }
  }

  // 保存结算单
  const saveMutation = useMutation({
    mutationFn: async (values: any) => {
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('保存结算单数据:', values)
      return { success: true }
    },
    onSuccess: () => {
      message.success(isEdit ? '修改成功' : '创建成功')
      navigate('/cargo/purchase-settlement')
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

      const amountDifference = invoiceAmount - selectedPurchase.totalAmount
      
      const submitData = {
        ...values,
        purchaseId: selectedPurchase.id,
        totalAmount: selectedPurchase.totalAmount,
        paidAmount: 0,
        remainingAmount: selectedPurchase.totalAmount,
        actualAmount: invoiceAmount,
        amountDifference,
        status: 'PENDING',
      }

      saveMutation.mutate(submitData)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const amountDifference = selectedPurchase ? invoiceAmount - selectedPurchase.totalAmount : 0

  return (
    <div className="page-container">
      <Card
        title={
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/cargo/purchase-settlement')}
            >
              返回
            </Button>
            {isEdit ? '编辑结算单' : '新建结算单'}
          </Space>
        }
        loading={isLoading}
        extra={
          <Space>
            <Button onClick={() => navigate('/cargo/purchase-settlement')}>
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
            settlementDate: dayjs(),
            paymentMethod: 'TRANSFER',
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="settlementNo"
                  label="结算单号"
                  rules={[{ required: true, message: '请输入结算单号' }]}
                >
                  <Input placeholder="系统自动生成" disabled={isEdit} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="settlementDate"
                  label="结算日期"
                  rules={[{ required: true, message: '请选择结算日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="paymentMethod"
                  label="付款方式"
                  rules={[{ required: true, message: '请选择付款方式' }]}
                >
                  <Select placeholder="请选择付款方式">
                    <Option value="CASH">
                      <Space>
                        <DollarOutlined />
                        现金
                      </Space>
                    </Option>
                    <Option value="TRANSFER">
                      <Space>
                        <BankOutlined />
                        转账
                      </Space>
                    </Option>
                    <Option value="CHECK">
                      <Space>
                        <FileTextOutlined />
                        支票
                      </Space>
                    </Option>
                    <Option value="CREDIT">
                      <Space>
                        <CreditCardOutlined />
                        信用
                      </Space>
                    </Option>
                  </Select>
                </Form.Item>
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
                  <Descriptions.Item label="付款条件">
                    {selectedPurchase.paymentTerms}
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
                <p>请选择要结算的采购单</p>
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

          {/* 发票信息 */}
          <Card title="发票信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="invoiceNo"
                  label="发票号"
                  rules={[{ required: true, message: '请输入发票号' }]}
                >
                  <Input placeholder="请输入发票号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="invoiceDate"
                  label="发票日期"
                  rules={[{ required: true, message: '请选择发票日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
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
                    parser={(value) => Number(value!.replace(/\¥\s?|(,*)/g, '')) as any}
                    onChange={handleInvoiceAmountChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* 金额对比 */}
            {selectedPurchase && (
              <Card size="small" style={{ backgroundColor: '#f5f5f5' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>采购金额</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                        ¥{formatMoney(selectedPurchase.totalAmount)}
                      </div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>发票金额</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                        ¥{formatMoney(invoiceAmount)}
                      </div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>金额差异</div>
                      <div style={{ 
                        fontSize: '18px', 
                        fontWeight: 'bold',
                        color: amountDifference === 0 ? '#52c41a' : 
                              amountDifference > 0 ? '#ff4d4f' : '#1890ff'
                      }}>
                        {amountDifference === 0 ? '无差异' : 
                         `${amountDifference > 0 ? '+' : ''}¥${formatMoney(Math.abs(amountDifference))}`}
                      </div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>差异比例</div>
                      <div style={{ 
                        fontSize: '18px', 
                        fontWeight: 'bold',
                        color: amountDifference === 0 ? '#52c41a' : '#ff4d4f'
                      }}>
                        {selectedPurchase.totalAmount > 0 ? 
                         `${((Math.abs(amountDifference) / selectedPurchase.totalAmount) * 100).toFixed(2)}%` : '0%'}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}

            {/* 差异说明 */}
            {amountDifference !== 0 && (
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Form.Item
                    name="differenceReason"
                    label="金额差异说明"
                    rules={[{ required: true, message: '请说明金额差异原因' }]}
                  >
                    <TextArea 
                      rows={3} 
                      placeholder="请详细说明发票金额与采购金额不一致的原因"
                      maxLength={500}
                      showCount
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Card>

          {/* 附件和备注 */}
          <Card title="附件和备注" size="small">
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
                    支持上传发票、合同、付款凭证等相关文件
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="remarks"
                  label="结算备注"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="请输入结算备注"
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

export default PurchaseSettlementForm
