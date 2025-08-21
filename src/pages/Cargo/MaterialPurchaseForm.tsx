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
  Divider,
  Tag
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  ShopOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { formatMoney, getCurrentPeriod } from '@/utils'
import dayjs from 'dayjs'
import { PURCHASE_TYPE_CONFIG } from '@/constants'
import type { MaterialPurchase, MaterialPurchaseDetail, MaterialRequest, Supplier } from '@/types'

const { TextArea } = Input
const { Option } = Select

const MaterialPurchaseForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const [form] = Form.useForm()
  const [purchaseDetails, setPurchaseDetails] = useState<MaterialPurchaseDetail[]>([])
  const [requestModalVisible, setRequestModalVisible] = useState(false)
  const [supplierModalVisible, setSupplierModalVisible] = useState(false)
  const [selectedRequests, setSelectedRequests] = useState<MaterialRequest[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  // 获取采购单详情（编辑时）
  const { data: purchase, isLoading } = useQuery({
    queryKey: ['purchase-form', id],
    queryFn: async () => {
      if (!isEdit) return null
      
      // 模拟获取采购单数据
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockData: MaterialPurchase = {
        id: Number(id),
        purchaseNo: 'PO202508200001',
        purchaseDate: '2025-08-20',
        purchaseType: 'URGENT',
        preparerId: 1,
        totalAmount: 125000,
        status: 'DRAFT',
        approvalStatus: 'PENDING',
        supplierId: 1,
        contractNo: 'CT202508200001',
        deliveryDate: '2025-08-30',
        paymentTerms: '货到付款',
        remarks: '港口起重机维修急需配件采购',
        details: [
          {
            id: 1,
            purchaseId: Number(id),
            materialId: 1,
            materialCode: 'MAT001',
            materialName: '钢丝绳',
            specification: '直径20mm 长度100m',
            unit: '根',
            quantity: 5,
            unitPrice: 1500,
            amount: 7500,
            supplierId: 1,
            quotationPrice: 1600,
            remarks: '需要符合港口安全标准'
          } as any
        ],
        requestIds: [1, 2],
        createdBy: 1,
        createdTime: '2025-08-20T09:00:00',
        version: 1
      }
      
      return mockData
    },
    enabled: isEdit,
  })

  // 模拟数据源
  const mockSuppliers: Supplier[] = [
    { 
      id: 1, 
      supplierName: '中远海运港口设备有限公司', 
      supplierCode: 'SUP001',
      contactPerson: '李经理',
      contactPhone: '021-12345678'
    } as Supplier,
    { 
      id: 2, 
      supplierName: '上海振华重工股份有限公司', 
      supplierCode: 'SUP002',
      contactPerson: '王经理',
      contactPhone: '021-87654321'
    } as Supplier,
    { 
      id: 3, 
      supplierName: '青岛港务机械制造有限公司', 
      supplierCode: 'SUP003',
      contactPerson: '张经理',
      contactPhone: '0532-12345678'
    } as Supplier,
  ]

  const mockRequests: MaterialRequest[] = [
    {
      id: 1,
      requestNo: 'MR202508200001',
      requestDepartment: { id: 1, departmentName: '码头作业部' } as any,
      requester: { id: 1, name: '张工程师' } as any,
      requestDate: '2025-08-20',
      status: 'APPROVED',
      totalAmount: 75000,
      details: [
        {
          id: 1,
          materialCode: 'MAT001',
          materialName: '钢丝绳',
          specification: '直径20mm 长度100m',
          unit: '根',
          quantity: 5,
          estimatedPrice: 1500,
          amount: 7500
        } as any
      ]
    } as any,
    {
      id: 2,
      requestNo: 'MR202508200002',
      requestDepartment: { id: 2, departmentName: '设备维护部' } as any,
      requester: { id: 2, name: '李主任' } as any,
      requestDate: '2025-08-20',
      status: 'APPROVED',
      totalAmount: 50000,
      details: [
        {
          id: 2,
          materialCode: 'MAT002',
          materialName: '液压油',
          specification: '46号抗磨液压油 200L',
          unit: '桶',
          quantity: 10,
          estimatedPrice: 800,
          amount: 8000
        } as any
      ]
    } as any
  ]

  // 初始化表单数据
  React.useEffect(() => {
    if (purchase) {
      form.setFieldsValue({
        purchaseNo: purchase.purchaseNo,
        purchaseDate: purchase.purchaseDate ? dayjs(purchase.purchaseDate) : null,
        purchaseType: purchase.purchaseType,
        supplierId: purchase.supplierId,
        contractNo: purchase.contractNo,
        deliveryDate: purchase.deliveryDate ? dayjs(purchase.deliveryDate) : null,
        paymentTerms: purchase.paymentTerms,
        remarks: purchase.remarks,
      })
      setPurchaseDetails(purchase.details || [])
      
      // 设置选中的供应商
      const supplier = mockSuppliers.find(s => s.id === purchase.supplierId)
      if (supplier) {
        setSelectedSupplier(supplier)
      }
    } else {
      // 新建时的默认值
      form.setFieldsValue({
        purchaseDate: dayjs(),
        purchaseType: 'NORMAL',
      })
    }
  }, [purchase, form])

  // 计算总金额
  const calculateTotalAmount = (details: MaterialPurchaseDetail[]) => {
    return details.reduce((sum, detail) => sum + detail.amount, 0)
  }

  // 采购明细表格列
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
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (value: number, record: MaterialPurchaseDetail, index: number) => (
        <InputNumber
          value={value}
          onChange={(newValue) => handlePriceChange(index, newValue || 0)}
          min={0}
          precision={2}
          formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => Number(value!.replace(/\¥\s?|(,*)/g, '')) as any}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (value: number) => `¥${formatMoney(value)}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: MaterialPurchaseDetail, index: number) => (
        <Button
          type="link"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteDetail(index)}
        >
          删除
        </Button>
      ),
    },
  ]

  // 申请单表格列
  const requestColumns = [
    {
      title: '申请单号',
      dataIndex: 'requestNo',
      key: 'requestNo',
      width: 150,
    },
    {
      title: '申请部门',
      dataIndex: ['requestDepartment', 'departmentName'],
      key: 'requestDepartment',
      width: 120,
    },
    {
      title: '申请人',
      dataIndex: ['requester', 'name'],
      key: 'requester',
      width: 100,
    },
    {
      title: '申请日期',
      dataIndex: 'requestDate',
      key: 'requestDate',
      width: 120,
    },
    {
      title: '申请金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (value: number) => `¥${formatMoney(value)}`,
    },
  ]

  // 供应商表格列
  const supplierColumns = [
    {
      title: '供应商编号',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      width: 120,
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 200,
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 120,
    },
  ]

  // 处理单价变化
  const handlePriceChange = (index: number, newPrice: number) => {
    const newDetails = [...purchaseDetails]
    newDetails[index].unitPrice = newPrice
    newDetails[index].amount = newPrice * newDetails[index].quantity
    setPurchaseDetails(newDetails)
  }

  // 处理删除明细
  const handleDeleteDetail = (index: number) => {
    const newDetails = purchaseDetails.filter((_, i) => i !== index)
    setPurchaseDetails(newDetails)
  }

  // 处理选择申请单
  const handleSelectRequests = () => {
    // 将选中的申请单明细转换为采购明细
    const newDetails: MaterialPurchaseDetail[] = []
    
    selectedRequests.forEach(request => {
      request.details?.forEach(detail => {
        newDetails.push({
          id: Date.now() + Math.random(),
          purchaseId: Number(id) || 0,
          materialId: detail.materialId,
          materialCode: detail.materialCode,
          materialName: detail.materialName,
          specification: detail.specification,
          unit: detail.unit,
          quantity: detail.quantity,
          unitPrice: detail.estimatedPrice,
          amount: detail.amount,
          supplierId: selectedSupplier?.id,
          quotationPrice: detail.estimatedPrice * 1.1, // 模拟报价
          remarks: detail.remarks
        } as MaterialPurchaseDetail)
      })
    })

    setPurchaseDetails([...purchaseDetails, ...newDetails])
    setRequestModalVisible(false)
    setSelectedRequests([])
  }

  // 处理选择供应商
  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    form.setFieldsValue({ supplierId: supplier.id })
    setSupplierModalVisible(false)
  }

  // 保存采购单
  const saveMutation = useMutation({
    mutationFn: async (values: any) => {
      // 模拟保存
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('保存采购单数据:', values)
      return { success: true }
    },
    onSuccess: () => {
      message.success(isEdit ? '修改成功' : '创建成功')
      navigate('/cargo/material-purchase')
    },
    onError: () => {
      message.error('保存失败')
    },
  })

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (purchaseDetails.length === 0) {
        message.error('请至少添加一个采购明细')
        return
      }

      if (!selectedSupplier) {
        message.error('请选择供应商')
        return
      }

      const totalAmount = calculateTotalAmount(purchaseDetails)
      
      const submitData = {
        ...values,
        totalAmount,
        supplierId: selectedSupplier.id,
        details: purchaseDetails,
      }

      saveMutation.mutate(submitData)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const totalAmount = calculateTotalAmount(purchaseDetails)

  return (
    <div className="page-container">
      <Card
        title={
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/cargo/material-purchase')}
            >
              返回
            </Button>
            {isEdit ? '编辑采购单' : '新建采购单'}
          </Space>
        }
        loading={isLoading}
        extra={
          <Space>
            <Button onClick={() => navigate('/cargo/material-purchase')}>
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
            purchaseDate: dayjs(),
            purchaseType: 'NORMAL',
          }}
        >
          {/* 基本信息 */}
          <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="purchaseNo"
                  label="采购单号"
                  rules={[{ required: true, message: '请输入采购单号' }]}
                >
                  <Input placeholder="系统自动生成" disabled={isEdit} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="purchaseDate"
                  label="采购日期"
                  rules={[{ required: true, message: '请选择采购日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="purchaseType"
                  label="采购类型"
                  rules={[{ required: true, message: '请选择采购类型' }]}
                >
                  <Select placeholder="请选择采购类型">
                    <Option value="NORMAL">常规采购</Option>
                    <Option value="URGENT">紧急采购</Option>
                    <Option value="CENTRALIZED">集中采购</Option>
                    <Option value="SPECIAL">专项采购</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="供应商"
                  rules={[{ required: true, message: '请选择供应商' }]}
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      value={selectedSupplier?.supplierName || ''}
                      placeholder="请选择供应商"
                      readOnly
                    />
                    <Button
                      icon={<SearchOutlined />}
                      onClick={() => setSupplierModalVisible(true)}
                    >
                      选择
                    </Button>
                  </Space.Compact>
                </Form.Item>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>采购总金额</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    ¥{formatMoney(totalAmount)}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* 采购明细 */}
          <Card 
            title="采购明细" 
            size="small"
            style={{ marginBottom: 16 }}
            extra={
              <Space>
                <Button 
                  icon={<SearchOutlined />}
                  onClick={() => setRequestModalVisible(true)}
                >
                  从申请单选择
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => message.info('手动添加功能开发中')}
                >
                  手动添加
                </Button>
              </Space>
            }
          >
            <Table
              columns={detailColumns}
              dataSource={purchaseDetails}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 1000 }}
              summary={(pageData) => {
                const totalQuantity = pageData.reduce((sum, record) => sum + record.quantity, 0)
                const totalAmount = pageData.reduce((sum, record) => sum + record.amount, 0)
                
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <strong>合计</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>{totalQuantity.toLocaleString()}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                    <Table.Summary.Cell index={3}>
                      <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                        ¥{formatMoney(totalAmount)}
                      </strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} />
                  </Table.Summary.Row>
                )
              }}
            />
          </Card>

          {/* 合同信息 */}
          <Card title="合同信息" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="contractNo"
                  label="合同号"
                >
                  <Input placeholder="请输入合同号" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="deliveryDate"
                  label="交货日期"
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="paymentTerms"
                  label="付款条件"
                >
                  <Input placeholder="如：货到付款、30天账期等" />
                </Form.Item>
              </Col>
            </Row>
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
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="remarks"
                  label="备注"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="请输入采购备注"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>

        {/* 选择申请单Modal */}
        <Modal
          title="选择申请单"
          open={requestModalVisible}
          onOk={handleSelectRequests}
          onCancel={() => {
            setRequestModalVisible(false)
            setSelectedRequests([])
          }}
          width={800}
          okText="确定选择"
          cancelText="取消"
        >
          <Table
            columns={requestColumns}
            dataSource={mockRequests.filter(req => req.status === 'APPROVED')}
            rowKey="id"
            size="small"
            rowSelection={{
              selectedRowKeys: selectedRequests.map(req => req.id),
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRequests(selectedRows)
              },
            }}
            pagination={false}
          />
        </Modal>

        {/* 选择供应商Modal */}
        <Modal
          title="选择供应商"
          open={supplierModalVisible}
          onCancel={() => setSupplierModalVisible(false)}
          footer={null}
          width={600}
        >
          <Table
            columns={supplierColumns}
            dataSource={mockSuppliers}
            rowKey="id"
            size="small"
            onRow={(record) => ({
              onClick: () => handleSelectSupplier(record),
              style: { cursor: 'pointer' }
            })}
            pagination={false}
          />
        </Modal>
      </Card>
    </div>
  )
}

export default MaterialPurchaseForm
