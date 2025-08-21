import React from 'react'
import { Card, Descriptions, Button, Space, Tag, Drawer, Table, Steps, Timeline, Progress, Statistic, Row, Col, message } from 'antd'
import { 
  ArrowLeftOutlined, 
  PrinterOutlined, 
  FullscreenOutlined, 
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  UserOutlined,
  BankOutlined,
  CreditCardOutlined,
  PayCircleOutlined,
  CalculatorOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatMoney, formatDate } from '@/utils'
import { SETTLEMENT_STATUS_CONFIG } from '@/constants'
import type { PurchaseSettlement } from '@/types'

const PurchaseSettlementDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // 获取采购结算详情（模拟）
  const { data: settlement, isLoading } = useQuery({
    queryKey: ['purchase-settlement-detail', id],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟采购结算详情数据
      const mockData: PurchaseSettlement = {
        id: Number(id),
        settlementNo: 'ST202508200001',
        purchaseId: 1,
        purchase: {
          id: 1,
          purchaseNo: 'PO202508200001',
          purchaseDate: '2025-08-20',
          totalAmount: 125000,
          preparer: { id: 1, name: '采购员张三' } as any,
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
          paymentTerms: '预付30%，货到付70%'
        } as any,
        settlementDate: '2025-08-20',
        totalAmount: 125000,
        paidAmount: 37500,
        remainingAmount: 87500,
        status: 'PARTIAL',
        paymentMethod: 'TRANSFER',
        invoiceNo: 'INV202508200001',
        invoiceDate: '2025-08-20',
        invoiceAmount: 125000,
        actualAmount: 125000,
        amountDifference: 0,
        remarks: '预付30%，剩余货到付款。发票金额与采购金额一致。',
        attachments: ['采购合同.pdf', '发票.pdf', '付款凭证.pdf'],
        createdBy: 1,
        createdTime: '2025-08-20T10:00:00',
        version: 1
      }
      
      return mockData
    },
  })

  // 模拟付款历史记录
  const paymentHistory = [
    {
      id: 1,
      paymentDate: '2025-08-20',
      paymentAmount: 37500,
      paymentMethod: 'TRANSFER',
      paymentPerson: '财务部王会计',
      remarks: '预付款30%',
      voucherNo: 'PAY202508200001'
    },
    // 可以添加更多付款记录
  ]

  // 获取结算进度步骤
  const getSettlementSteps = () => {
    const steps = [
      { title: '创建结算', description: '结算单已创建' },
      { title: '发票录入', description: '录入发票信息' },
      { title: '开始付款', description: '执行付款操作' },
      { title: '完成结算', description: '结算流程完成' },
    ]

    let current = 0
    let status: 'wait' | 'process' | 'finish' | 'error' = 'process'

    switch (settlement?.status) {
      case 'PENDING':
        current = settlement.invoiceNo ? 1 : 0
        break
      case 'PARTIAL':
        current = 2
        break
      case 'COMPLETED':
        current = 3
        status = 'finish'
        break
      default:
        current = 0
    }

    return { steps, current, status }
  }

  const { steps, current, status } = getSettlementSteps()

  // 生成时间线数据
  const getTimelineItems = () => {
    const items = [
      {
        color: 'green',
        dot: <CheckOutlined />,
        children: (
          <div>
            <p><strong>结算单创建</strong></p>
            <p>创建时间：{settlement?.createdTime && formatDate(settlement.createdTime)}</p>
            <p>结算金额：¥{settlement?.totalAmount && formatMoney(settlement.totalAmount)}</p>
          </div>
        ),
      },
    ]

    if (settlement?.invoiceNo) {
      items.push({
        color: 'blue',
        dot: <FileTextOutlined />,
        children: (
          <div>
            <p><strong>发票信息录入</strong></p>
            <p>发票号：{settlement.invoiceNo}</p>
            <p>发票日期：{settlement.invoiceDate && formatDate(settlement.invoiceDate)}</p>
            <p>发票金额：¥{settlement.invoiceAmount && formatMoney(settlement.invoiceAmount)}</p>
            {settlement.amountDifference !== 0 && (
              <p style={{ color: settlement.amountDifference! > 0 ? '#ff4d4f' : '#52c41a' }}>
                金额差异：¥{settlement.amountDifference && formatMoney(Math.abs(settlement.amountDifference))}
              </p>
            )}
          </div>
        ),
      })
    }

    // 添加付款历史
    paymentHistory.forEach((payment) => {
      items.push({
        color: 'green',
        dot: <DollarOutlined />,
        children: (
          <div>
            <p><strong>付款操作</strong></p>
            <p>付款金额：¥{formatMoney(payment.paymentAmount)}</p>
            <p>付款日期：{formatDate(payment.paymentDate)}</p>
            <p>付款人：{payment.paymentPerson}</p>
            <p>凭证号：{payment.voucherNo}</p>
            {payment.remarks && <p>备注：{payment.remarks}</p>}
          </div>
        ),
      })
    })

    if (settlement?.status === 'COMPLETED') {
      items.push({
        color: 'green',
        dot: <CheckOutlined />,
        children: (
          <div>
            <p><strong>结算完成</strong></p>
            <p>完成时间：{settlement?.createdTime && formatDate(settlement.createdTime)}</p>
            <p>总付款金额：¥{settlement?.paidAmount && formatMoney(settlement.paidAmount)}</p>
          </div>
        ),
      })
    }

    return items
  }

  // 付款历史表格列
  const paymentColumns = [
    {
      title: '付款日期',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 120,
      render: (value: string) => formatDate(value),
    },
    {
      title: '付款金额',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
      width: 120,
      render: (value: number) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ¥{formatMoney(value)}
        </span>
      ),
    },
    {
      title: '付款方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (value: string) => {
        const methodConfig = {
          'CASH': { icon: <DollarOutlined />, text: '现金', color: 'green' },
          'TRANSFER': { icon: <BankOutlined />, text: '转账', color: 'blue' },
          'CHECK': { icon: <FileTextOutlined />, text: '支票', color: 'orange' },
          'CREDIT': { icon: <CreditCardOutlined />, text: '信用', color: 'purple' },
        }
        const config = methodConfig[value as keyof typeof methodConfig]
        return config ? (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        ) : value
      },
    },
    {
      title: '付款人',
      dataIndex: 'paymentPerson',
      key: 'paymentPerson',
      width: 120,
    },
    {
      title: '凭证号',
      dataIndex: 'voucherNo',
      key: 'voucherNo',
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true,
    },
  ]

  const DetailContent = () => (
    <div style={{ padding: isFullscreen ? 24 : 0 }}>
      {/* 结算进度 */}
      <Card 
        title="结算进度" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Steps current={current} status={status} items={steps} />
      </Card>

      {/* 结算概览 */}
      <Card 
        title="结算概览" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="结算总额"
              value={settlement?.totalAmount || 0}
              formatter={(value) => `¥${formatMoney(Number(value))}`}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CalculatorOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="已付金额"
              value={settlement?.paidAmount || 0}
              formatter={(value) => `¥${formatMoney(Number(value))}`}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="剩余金额"
              value={settlement?.remainingAmount || 0}
              formatter={(value) => `¥${formatMoney(Number(value))}`}
              valueStyle={{ color: settlement?.remainingAmount === 0 ? '#52c41a' : '#ff4d4f' }}
              prefix={<PayCircleOutlined />}
            />
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>付款进度</div>
              <Progress
                type="circle"
                size={80}
                percent={settlement?.totalAmount ? Math.round((settlement.paidAmount / settlement.totalAmount) * 100) : 0}
                strokeColor={settlement?.status === 'COMPLETED' ? '#52c41a' : '#1890ff'}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 结算基本信息 */}
      <Card 
        title="结算基本信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="结算单号">
            {settlement?.settlementNo}
          </Descriptions.Item>
          <Descriptions.Item label="结算状态">
            {settlement && (
              <Tag color={SETTLEMENT_STATUS_CONFIG[settlement.status]?.color}>
                {SETTLEMENT_STATUS_CONFIG[settlement.status]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="结算日期">
            {settlement?.settlementDate && formatDate(settlement.settlementDate)}
          </Descriptions.Item>
          <Descriptions.Item label="采购单号">
            {settlement?.purchase?.purchaseNo}
          </Descriptions.Item>
          <Descriptions.Item label="采购日期">
            {settlement?.purchase?.purchaseDate && formatDate(settlement.purchase.purchaseDate)}
          </Descriptions.Item>
          <Descriptions.Item label="采购金额">
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
              ¥{settlement?.purchase?.totalAmount && formatMoney(settlement.purchase.totalAmount)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="付款方式">
            {settlement && (() => {
              const methodConfig = {
                'CASH': { icon: <DollarOutlined />, text: '现金', color: 'green' },
                'TRANSFER': { icon: <BankOutlined />, text: '转账', color: 'blue' },
                'CHECK': { icon: <FileTextOutlined />, text: '支票', color: 'orange' },
                'CREDIT': { icon: <CreditCardOutlined />, text: '信用', color: 'purple' },
              }
              const config = methodConfig[settlement.paymentMethod as keyof typeof methodConfig]
              return config ? (
                <Tag color={config.color} icon={config.icon}>
                  {config.text}
                </Tag>
              ) : settlement.paymentMethod
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="合同号">
            {settlement?.purchase?.contractNo}
          </Descriptions.Item>
          <Descriptions.Item label="付款条件">
            {settlement?.purchase?.paymentTerms}
          </Descriptions.Item>
          <Descriptions.Item label="结算备注" span={isFullscreen ? 3 : 2}>
            {settlement?.remarks}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 供应商信息 */}
      <Card 
        title="供应商信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="供应商编号">
            {settlement?.purchase?.supplier?.supplierCode}
          </Descriptions.Item>
          <Descriptions.Item label="供应商名称">
            {settlement?.purchase?.supplier?.supplierName}
          </Descriptions.Item>
          <Descriptions.Item label="联系人">
            {settlement?.purchase?.supplier?.contactPerson}
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {settlement?.purchase?.supplier?.contactPhone}
          </Descriptions.Item>
          <Descriptions.Item label="供应商地址" span={isFullscreen ? 3 : 2}>
            {settlement?.purchase?.supplier?.address}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 发票信息 */}
      <Card 
        title="发票信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="发票号">
            {settlement?.invoiceNo || <Tag color="orange">未录入</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="发票日期">
            {settlement?.invoiceDate ? formatDate(settlement.invoiceDate) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="发票金额">
            {settlement?.invoiceAmount ? (
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                ¥{formatMoney(settlement.invoiceAmount)}
              </span>
            ) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="实际金额">
            {settlement?.actualAmount ? (
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                ¥{formatMoney(settlement.actualAmount)}
              </span>
            ) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="金额差异">
            {settlement?.amountDifference !== undefined ? (
              <span style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: settlement.amountDifference === 0 ? '#52c41a' : 
                      settlement.amountDifference > 0 ? '#ff4d4f' : '#1890ff'
              }}>
                {settlement.amountDifference === 0 ? '无差异' : 
                 `${settlement.amountDifference > 0 ? '+' : ''}¥${formatMoney(Math.abs(settlement.amountDifference))}`}
              </span>
            ) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="差异说明" span={isFullscreen ? 3 : 2}>
            {settlement?.differenceReason || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 付款历史 */}
      <Card 
        title="付款历史" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Table
          columns={paymentColumns}
          dataSource={paymentHistory}
          rowKey="id"
          pagination={false}
          size="small"
          summary={() => {
            const totalPaid = paymentHistory.reduce((sum, record) => sum + record.paymentAmount, 0)
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <strong>合计</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong style={{ color: '#52c41a', fontSize: '16px' }}>
                    ¥{formatMoney(totalPaid)}
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={4} />
              </Table.Summary.Row>
            )
          }}
        />
      </Card>

      {/* 附件信息 */}
      {settlement?.attachments && settlement.attachments.length > 0 && (
        <Card 
          title="附件信息" 
          style={{ marginBottom: 16 }}
          size={isFullscreen ? 'default' : 'small'}
        >
          <Space wrap>
            {settlement.attachments.map((attachment, index) => (
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

      {/* 结算时间线 */}
      <Card 
        title="结算时间线" 
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
                onClick={() => navigate('/cargo/purchase-settlement')}
              >
                返回
              </Button>
              采购结算详情
            </Space>
          }
          loading={isLoading}
          extra={
            <Space>
              {settlement?.status !== 'COMPLETED' && (
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/cargo/purchase-settlement/edit/${id}`)}
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
        title="采购结算详情"
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

export default PurchaseSettlementDetailPage
