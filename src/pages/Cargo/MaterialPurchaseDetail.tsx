import React from 'react'
import { Card, Descriptions, Button, Space, Tag, Drawer, Table, Steps, Timeline, Progress, message } from 'antd'
import { 
  ArrowLeftOutlined, 
  PrinterOutlined, 
  FullscreenOutlined, 
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  FileTextOutlined,
  UserOutlined,
  ShopOutlined,
  DollarOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatMoney, formatDate } from '@/utils'
import { PURCHASE_TYPE_CONFIG, PURCHASE_STATUS_CONFIG } from '@/constants'
import type { MaterialPurchase, MaterialPurchaseDetail } from '@/types'

const MaterialPurchaseDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // 获取物资采购详情（模拟）
  const { data: purchase, isLoading } = useQuery({
    queryKey: ['material-purchase-detail', id],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟物资采购详情数据
      const mockData: MaterialPurchase = {
        id: Number(id),
        purchaseNo: 'PO202508200001',
        purchaseDate: '2025-08-20',
        purchaseType: 'URGENT',
        preparerId: 1,
        preparer: { 
          id: 1, 
          name: '采购员张三', 
          phone: '13800138001',
          email: 'zhangsan@port.com'
        } as any,
        totalAmount: 125000,
        status: 'APPROVED',
        approvalStatus: 'APPROVED',
        approvedBy: 2,
        approver: { 
          id: 2, 
          name: '采购部长王经理',
          phone: '13800138002'
        } as any,
        approvedTime: '2025-08-20T14:30:00',
        supplierId: 1,
        supplier: { 
          id: 1, 
          supplierName: '中远海运港口设备有限公司',
          supplierCode: 'SUP001',
          contactPerson: '李经理',
          contactPhone: '021-12345678',
          address: '上海市浦东新区港口大道123号'
        } as any,
        contractNo: 'CT202508200001',
        deliveryDate: '2025-08-30',
        paymentTerms: '货到付款',
        attachments: ['采购合同.pdf', '技术规格书.pdf', '报价单.pdf'],
        remarks: '港口起重机维修急需配件采购，请优先处理，确保按期交货',
        details: [
          {
            id: 1,
            purchaseId: Number(id),
            materialId: 1,
            material: { 
              id: 1, 
              materialName: '钢丝绳', 
              materialCode: 'MAT001',
              unit: '根'
            } as any,
            materialCode: 'MAT001',
            materialName: '钢丝绳',
            specification: '直径20mm 长度100m 抗拉强度1770MPa 符合GB 8918-2006标准',
            unit: '根',
            quantity: 5,
            unitPrice: 1500,
            amount: 7500,
            supplierId: 1,
            supplier: { 
              id: 1, 
              supplierName: '中远海运港口设备有限公司' 
            } as any,
            quotationPrice: 1600,
            remarks: '需要符合港口安全标准，提供质量证书',
            createdBy: 1,
            createdTime: '2025-08-20T09:00:00',
            version: 1
          },
          {
            id: 2,
            purchaseId: Number(id),
            materialId: 2,
            material: { 
              id: 2, 
              materialName: '液压油', 
              materialCode: 'MAT002',
              unit: '桶'
            } as any,
            materialCode: 'MAT002',
            materialName: '液压油',
            specification: '46号抗磨液压油 200L 符合ISO VG46标准',
            unit: '桶',
            quantity: 10,
            unitPrice: 800,
            amount: 8000,
            supplierId: 1,
            supplier: { 
              id: 1, 
              supplierName: '中远海运港口设备有限公司' 
            } as any,
            quotationPrice: 850,
            remarks: '需要环保型液压油，提供MSDS安全数据表',
            createdBy: 1,
            createdTime: '2025-08-20T09:00:00',
            version: 1
          },
          {
            id: 3,
            purchaseId: Number(id),
            materialId: 3,
            material: { 
              id: 3, 
              materialName: '轴承', 
              materialCode: 'MAT003',
              unit: '个'
            } as any,
            materialCode: 'MAT003',
            materialName: '轴承',
            specification: '深沟球轴承 6320 内径100mm 外径215mm 厚度47mm',
            unit: '个',
            quantity: 8,
            unitPrice: 1200,
            amount: 9600,
            supplierId: 1,
            supplier: { 
              id: 1, 
              supplierName: '中远海运港口设备有限公司' 
            } as any,
            quotationPrice: 1300,
            remarks: '需要原厂配件，提供原厂质保证书',
            createdBy: 1,
            createdTime: '2025-08-20T09:00:00',
            version: 1
          }
        ],
        requestIds: [1, 2],
        createdBy: 1,
        createdTime: '2025-08-20T09:00:00',
        version: 1
      }
      
      return mockData
    },
  })

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
      width: 250,
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
      render: (value: number) => `¥${formatMoney(value)}`,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (value: number) => `¥${formatMoney(value)}`,
    },
    {
      title: '报价',
      dataIndex: 'quotationPrice',
      key: 'quotationPrice',
      width: 120,
      render: (value: number, record) => {
        const savings = value - record.unitPrice
        const savingsPercent = ((savings / value) * 100).toFixed(1)
        return (
          <Space direction="vertical" size={0}>
            <span>¥{formatMoney(value)}</span>
            {savings > 0 && (
              <span style={{ fontSize: '12px', color: '#52c41a' }}>
                节省 ¥{formatMoney(savings)} ({savingsPercent}%)
              </span>
            )}
          </Space>
        )
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true,
    },
  ]

  // 获取采购进度步骤
  const getPurchaseSteps = () => {
    const steps = [
      { title: '创建采购', description: '采购单已创建' },
      { title: '提交审核', description: '等待审核' },
      { title: '审核完成', description: '审核结果' },
      { title: '下单采购', description: '向供应商下单' },
      { title: '采购完成', description: '采购流程完成' },
    ]

    let current = 0
    let status: 'wait' | 'process' | 'finish' | 'error' = 'process'

    switch (purchase?.status) {
      case 'DRAFT':
        current = 0
        break
      case 'SUBMITTED':
        current = 1
        break
      case 'APPROVED':
        current = 2
        status = 'finish'
        break
      case 'REJECTED':
        current = 2
        status = 'error'
        steps[2] = { title: '审核驳回', description: '采购被驳回' }
        break
      case 'ORDERED':
        current = 3
        status = 'finish'
        break
      case 'COMPLETED':
        current = 4
        status = 'finish'
        break
      default:
        current = 0
    }

    return { steps, current, status }
  }

  const { steps, current, status } = getPurchaseSteps()

  // 生成时间线数据
  const getTimelineItems = () => {
    const items = [
      {
        color: 'green',
        dot: <CheckOutlined />,
        children: (
          <div>
            <p><strong>采购单创建</strong></p>
            <p>编制人：{purchase?.preparer?.name}</p>
            <p>创建时间：{purchase?.createdTime && formatDate(purchase.createdTime)}</p>
          </div>
        ),
      },
    ]

    if (purchase?.status !== 'DRAFT') {
      items.push({
        color: 'blue',
        dot: <FileTextOutlined />,
        children: (
          <div>
            <p><strong>提交审核</strong></p>
            <p>提交时间：{purchase?.createdTime && formatDate(purchase.createdTime)}</p>
          </div>
        ),
      })
    }

    if (purchase?.approvedTime) {
      const isApproved = purchase.approvalStatus === 'APPROVED'
      items.push({
        color: isApproved ? 'green' : 'red',
        dot: isApproved ? <CheckOutlined /> : <CloseOutlined />,
        children: (
          <div>
            <p><strong>{isApproved ? '审核通过' : '审核驳回'}</strong></p>
            <p>审核人：{purchase.approver?.name}</p>
            <p>审核时间：{formatDate(purchase.approvedTime)}</p>
          </div>
        ),
      })
    } else if (purchase?.status === 'SUBMITTED') {
      items.push({
        color: 'gray',
        dot: <ClockCircleOutlined />,
        children: (
          <div>
            <p><strong>等待审核</strong></p>
          </div>
        ),
      })
    }

    if (purchase?.status === 'ORDERED') {
      items.push({
        color: 'blue',
        dot: <TruckOutlined />,
        children: (
          <div>
            <p><strong>已下单</strong></p>
            <p>供应商：{purchase.supplier?.supplierName}</p>
            <p>合同号：{purchase.contractNo}</p>
          </div>
        ),
      })
    }

    if (purchase?.status === 'COMPLETED') {
      items.push({
        color: 'green',
        dot: <CheckOutlined />,
        children: (
          <div>
            <p><strong>采购完成</strong></p>
            <p>完成时间：{purchase?.createdTime && formatDate(purchase.createdTime)}</p>
          </div>
        ),
      })
    }

    return items
  }

  const DetailContent = () => (
    <div style={{ padding: isFullscreen ? 24 : 0 }}>
      {/* 采购进度 */}
      <Card 
        title="采购进度" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Steps current={current} status={status} items={steps} />
      </Card>

      {/* 采购基本信息 */}
      <Card 
        title="采购基本信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="采购单号">
            {purchase?.purchaseNo}
          </Descriptions.Item>
          <Descriptions.Item label="采购类型">
            {purchase && (
              <Tag color={PURCHASE_TYPE_CONFIG[purchase.purchaseType]?.color}>
                {PURCHASE_TYPE_CONFIG[purchase.purchaseType]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="采购状态">
            {purchase && (
              <Tag color={PURCHASE_STATUS_CONFIG[purchase.status]?.color}>
                {PURCHASE_STATUS_CONFIG[purchase.status]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="编制人">
            <Space>
              <UserOutlined />
              {purchase?.preparer?.name}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {purchase?.preparer?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="采购日期">
            {purchase?.purchaseDate && formatDate(purchase.purchaseDate)}
          </Descriptions.Item>
          <Descriptions.Item label="采购总金额">
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
              ¥{purchase?.totalAmount && formatMoney(purchase.totalAmount)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="审批状态">
            {purchase?.approvalStatus === 'PENDING' && (
              <Tag color="warning" icon={<ClockCircleOutlined />}>待审批</Tag>
            )}
            {purchase?.approvalStatus === 'APPROVED' && (
              <Tag color="success" icon={<CheckOutlined />}>已批准</Tag>
            )}
            {purchase?.approvalStatus === 'REJECTED' && (
              <Tag color="error" icon={<CloseOutlined />}>已驳回</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="审批人">
            {purchase?.approver?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="审批时间">
            {purchase?.approvedTime ? formatDate(purchase.approvedTime) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="采购说明" span={isFullscreen ? 3 : 2}>
            {purchase?.remarks}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 供应商信息 */}
      <Card 
        title={
          <Space>
            <ShopOutlined />
            供应商信息
          </Space>
        } 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="供应商编号">
            {purchase?.supplier?.supplierCode}
          </Descriptions.Item>
          <Descriptions.Item label="供应商名称">
            {purchase?.supplier?.supplierName}
          </Descriptions.Item>
          <Descriptions.Item label="联系人">
            {purchase?.supplier?.contactPerson}
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {purchase?.supplier?.contactPhone}
          </Descriptions.Item>
          <Descriptions.Item label="合同号">
            {purchase?.contractNo}
          </Descriptions.Item>
          <Descriptions.Item label="交货日期">
            {purchase?.deliveryDate && formatDate(purchase.deliveryDate)}
          </Descriptions.Item>
          <Descriptions.Item label="付款条件" span={isFullscreen ? 3 : 2}>
            {purchase?.paymentTerms}
          </Descriptions.Item>
          <Descriptions.Item label="供应商地址" span={isFullscreen ? 3 : 2}>
            {purchase?.supplier?.address}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 采购明细 */}
      <Card 
        title="采购明细" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Table
          columns={detailColumns}
          dataSource={purchase?.details || []}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 1200 }}
          summary={(pageData) => {
            const totalQuantity = pageData.reduce((sum, record) => sum + record.quantity, 0)
            const totalAmount = pageData.reduce((sum, record) => sum + record.amount, 0)
            const totalQuotation = pageData.reduce((sum, record) => sum + (record.quotationPrice * record.quantity), 0)
            const totalSavings = totalQuotation - totalAmount
            
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
                <Table.Summary.Cell index={4}>
                  <Space direction="vertical" size={0}>
                    <strong>¥{formatMoney(totalQuotation)}</strong>
                    {totalSavings > 0 && (
                      <span style={{ fontSize: '12px', color: '#52c41a' }}>
                        节省 ¥{formatMoney(totalSavings)}
                      </span>
                    )}
                  </Space>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} />
              </Table.Summary.Row>
            )
          }}
        />
      </Card>

      {/* 附件信息 */}
      {purchase?.attachments && purchase.attachments.length > 0 && (
        <Card 
          title="附件信息" 
          style={{ marginBottom: 16 }}
          size={isFullscreen ? 'default' : 'small'}
        >
          <Space wrap>
            {purchase.attachments.map((attachment, index) => (
              <Button
                key={index}
                type="link"
                icon={<FileTextOutlined />}
                onClick={() => message.info(`下载附件：${attachment}`)}
              >
                {attachment}
              </Button>
            ))}
          </Space>
        </Card>
      )}

      {/* 采购时间线 */}
      <Card 
        title="采购时间线" 
        size={isFullscreen ? 'default' : 'small'}
      >
        <Timeline items={getTimelineItems()} />
      </Card>
    </div>
  )

  return (
    <>
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
              物资采购详情
            </Space>
          }
          loading={isLoading}
          extra={
            <Space>
              {purchase?.status === 'DRAFT' && (
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/cargo/material-purchase/edit/${id}`)}
                >
                  编辑
                </Button>
              )}
              <Button 
                icon={<PrinterOutlined />}
                onClick={() => window.print()}
              >
                打印
              </Button>
              <Button 
                icon={<FullscreenOutlined />}
                onClick={() => setIsFullscreen(true)}
              >
                全屏查看
              </Button>
            </Space>
          }
        >
          <DetailContent />
        </Card>
      </div>

      {/* 全屏抽屉 */}
      <Drawer
        title="物资采购详情"
        placement="right"
        size="large"
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        extra={
          <Space>
            <Button 
              icon={<PrinterOutlined />}
              onClick={() => window.print()}
            >
              打印
            </Button>
            <Button 
              type="primary"
              onClick={() => setIsFullscreen(false)}
            >
              确定
            </Button>
          </Space>
        }
        styles={{
          body: { padding: 0 }
        }}
      >
        <DetailContent />
      </Drawer>
    </>
  )
}

export default MaterialPurchaseDetailPage
