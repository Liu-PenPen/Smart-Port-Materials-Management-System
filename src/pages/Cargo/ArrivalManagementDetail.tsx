import React from 'react'
import { Card, Descriptions, Button, Space, Tag, Drawer, Table, Steps, Timeline, Progress, Statistic, Row, Col, message } from 'antd'
import { 
  ArrowLeftOutlined, 
  PrinterOutlined, 
  FullscreenOutlined, 
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  TruckOutlined,
  InboxOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  ShopOutlined,
  CalculatorOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatMoney, formatDate } from '@/utils'
import { ARRIVAL_STATUS_CONFIG, QUALITY_STATUS_CONFIG } from '@/constants'
import type { ArrivalManagement, ArrivalDetail } from '@/types'

const ArrivalManagementDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // 获取到货管理详情（模拟）
  const { data: arrival, isLoading } = useQuery({
    queryKey: ['arrival-management-detail', id],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟到货管理详情数据
      const mockData: ArrivalManagement = {
        id: Number(id),
        arrivalNo: 'AR202508200001',
        purchaseId: 1,
        purchase: {
          id: 1,
          purchaseNo: 'PO202508200001',
          purchaseDate: '2025-08-20',
          totalAmount: 125000,
          preparer: { id: 1, name: '采购员张三' } as any,
          contractNo: 'CT202508200001',
          deliveryDate: '2025-08-30',
          paymentTerms: '货到付款'
        } as any,
        arrivalDate: '2025-08-20',
        supplierId: 1,
        supplier: {
          id: 1,
          supplierName: '中远海运港口设备有限公司',
          supplierCode: 'SUP001',
          contactPerson: '李经理',
          contactPhone: '021-12345678',
          address: '上海市浦东新区港口大道123号'
        } as any,
        receiverId: 1,
        receiver: { 
          id: 1, 
          name: '仓管员张三', 
          phone: '13800138001',
          email: 'zhangsan@port.com'
        } as any,
        status: 'ACCEPTED',
        totalQuantity: 23,
        acceptedQuantity: 23,
        rejectedQuantity: 0,
        qualityStatus: 'QUALIFIED',
        invoiceNo: 'INV202508200001',
        invoiceDate: '2025-08-20',
        invoiceAmount: 125000,
        actualAmount: 125000,
        amountDifference: 0,
        remarks: '货物质量良好，全部验收通过。包装完整，无破损。',
        details: [
          {
            id: 1,
            arrivalId: Number(id),
            materialId: 1,
            material: { 
              id: 1, 
              materialName: '钢丝绳', 
              materialCode: 'MAT001'
            } as any,
            materialCode: 'MAT001',
            materialName: '钢丝绳',
            specification: '直径20mm 长度100m 抗拉强度1770MPa',
            unit: '根',
            orderedQuantity: 5,
            arrivedQuantity: 5,
            acceptedQuantity: 5,
            rejectedQuantity: 0,
            unitPrice: 1500,
            amount: 7500,
            actualUnitPrice: 1500,
            actualAmount: 7500,
            qualityStatus: 'QUALIFIED',
            inspectionResult: '质量检验合格，符合技术要求',
            remarks: '包装良好，无破损',
            createdBy: 1,
            createdTime: '2025-08-20T14:00:00',
            version: 1
          },
          {
            id: 2,
            arrivalId: Number(id),
            materialId: 2,
            material: { 
              id: 2, 
              materialName: '液压油', 
              materialCode: 'MAT002'
            } as any,
            materialCode: 'MAT002',
            materialName: '液压油',
            specification: '46号抗磨液压油 200L',
            unit: '桶',
            orderedQuantity: 10,
            arrivedQuantity: 10,
            acceptedQuantity: 10,
            rejectedQuantity: 0,
            unitPrice: 800,
            amount: 8000,
            actualUnitPrice: 800,
            actualAmount: 8000,
            qualityStatus: 'QUALIFIED',
            inspectionResult: '液压油质量合格，粘度符合标准',
            remarks: '密封良好，无泄漏',
            createdBy: 1,
            createdTime: '2025-08-20T14:00:00',
            version: 1
          },
          {
            id: 3,
            arrivalId: Number(id),
            materialId: 3,
            material: { 
              id: 3, 
              materialName: '轴承', 
              materialCode: 'MAT003'
            } as any,
            materialCode: 'MAT003',
            materialName: '轴承',
            specification: '深沟球轴承 6320 内径100mm',
            unit: '个',
            orderedQuantity: 8,
            arrivedQuantity: 8,
            acceptedQuantity: 8,
            rejectedQuantity: 0,
            unitPrice: 1200,
            amount: 9600,
            actualUnitPrice: 1200,
            actualAmount: 9600,
            qualityStatus: 'QUALIFIED',
            inspectionResult: '轴承质量优良，精度符合要求',
            remarks: '原厂包装，质保证书齐全',
            createdBy: 1,
            createdTime: '2025-08-20T14:00:00',
            version: 1
          }
        ],
        createdBy: 1,
        createdTime: '2025-08-20T14:00:00',
        version: 1
      }
      
      return mockData
    },
  })

  // 获取到货进度步骤
  const getArrivalSteps = () => {
    const steps = [
      { title: '货物到达', description: '货物已到达港口' },
      { title: '质量检验', description: '进行质量检验' },
      { title: '验收确认', description: '验收结果确认' },
      { title: '入库完成', description: '货物入库完成' },
    ]

    let current = 0
    let status: 'wait' | 'process' | 'finish' | 'error' = 'process'

    switch (arrival?.status) {
      case 'ARRIVED':
        current = 0
        break
      case 'INSPECTED':
        current = 1
        break
      case 'ACCEPTED':
        current = 3
        status = 'finish'
        break
      case 'REJECTED':
        current = 2
        status = 'error'
        steps[2] = { title: '验收拒收', description: '货物被拒收' }
        break
      default:
        current = 0
    }

    return { steps, current, status }
  }

  const { steps, current, status } = getArrivalSteps()

  // 生成时间线数据
  const getTimelineItems = () => {
    const items = [
      {
        color: 'green',
        dot: <TruckOutlined />,
        children: (
          <div>
            <p><strong>货物到达</strong></p>
            <p>到货日期：{arrival?.arrivalDate && formatDate(arrival.arrivalDate)}</p>
            <p>收货人：{arrival?.receiver?.name}</p>
            <p>总数量：{arrival?.totalQuantity}</p>
          </div>
        ),
      },
    ]

    if (arrival?.status !== 'ARRIVED') {
      items.push({
        color: 'blue',
        dot: <SafetyCertificateOutlined />,
        children: (
          <div>
            <p><strong>质量检验</strong></p>
            <p>检验状态：{arrival && QUALITY_STATUS_CONFIG[arrival.qualityStatus]?.text}</p>
            <p>验收数量：{arrival?.acceptedQuantity}</p>
            {arrival?.rejectedQuantity > 0 && (
              <p style={{ color: '#ff4d4f' }}>拒收数量：{arrival.rejectedQuantity}</p>
            )}
          </div>
        ),
      })
    }

    if (arrival?.status === 'ACCEPTED') {
      items.push({
        color: 'green',
        dot: <CheckOutlined />,
        children: (
          <div>
            <p><strong>验收完成</strong></p>
            <p>验收状态：已验收</p>
            <p>验收数量：{arrival?.acceptedQuantity}</p>
            <p>质量状态：{arrival && QUALITY_STATUS_CONFIG[arrival.qualityStatus]?.text}</p>
          </div>
        ),
      })

      items.push({
        color: 'green',
        dot: <InboxOutlined />,
        children: (
          <div>
            <p><strong>入库完成</strong></p>
            <p>入库时间：{arrival?.createdTime && formatDate(arrival.createdTime)}</p>
            <p>入库数量：{arrival?.acceptedQuantity}</p>
          </div>
        ),
      })
    } else if (arrival?.status === 'REJECTED') {
      items.push({
        color: 'red',
        dot: <CloseOutlined />,
        children: (
          <div>
            <p><strong>货物拒收</strong></p>
            <p>拒收数量：{arrival?.rejectedQuantity}</p>
            <p>拒收原因：{arrival?.remarks}</p>
          </div>
        ),
      })
    }

    return items
  }

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
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '验收数量',
      dataIndex: 'acceptedQuantity',
      key: 'acceptedQuantity',
      width: 100,
      render: (value: number) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          {value.toLocaleString()}
        </span>
      ),
    },
    {
      title: '拒收数量',
      dataIndex: 'rejectedQuantity',
      key: 'rejectedQuantity',
      width: 100,
      render: (value: number) => (
        <span style={{ color: value > 0 ? '#ff4d4f' : '#999', fontWeight: value > 0 ? 'bold' : 'normal' }}>
          {value.toLocaleString()}
        </span>
      ),
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
      title: '质量状态',
      dataIndex: 'qualityStatus',
      key: 'qualityStatus',
      width: 100,
      render: (value: string) => {
        const config = QUALITY_STATUS_CONFIG[value]
        const icon = value === 'QUALIFIED' ? <CheckOutlined /> :
                    value === 'UNQUALIFIED' ? <WarningOutlined /> :
                    value === 'PARTIAL' ? <ExclamationCircleOutlined /> : undefined
        return <Tag color={config.color} icon={icon}>{config.text}</Tag>
      },
    },
    {
      title: '检验结果',
      dataIndex: 'inspectionResult',
      key: 'inspectionResult',
      ellipsis: true,
    },
  ]

  const DetailContent = () => (
    <div style={{ padding: isFullscreen ? 24 : 0 }}>
      {/* 到货进度 */}
      <Card 
        title="到货进度" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Steps current={current} status={status} items={steps} />
      </Card>

      {/* 到货概览 */}
      <Card 
        title="到货概览" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="总数量"
              value={arrival?.totalQuantity || 0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CalculatorOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="验收数量"
              value={arrival?.acceptedQuantity || 0}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="拒收数量"
              value={arrival?.rejectedQuantity || 0}
              valueStyle={{ color: arrival?.rejectedQuantity === 0 ? '#52c41a' : '#ff4d4f' }}
              prefix={<CloseOutlined />}
            />
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>验收率</div>
              <Progress
                type="circle"
                size={80}
                percent={arrival?.totalQuantity ? Math.round((arrival.acceptedQuantity / arrival.totalQuantity) * 100) : 0}
                strokeColor={arrival?.rejectedQuantity === 0 ? '#52c41a' : '#1890ff'}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 到货基本信息 */}
      <Card 
        title="到货基本信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="到货单号">
            {arrival?.arrivalNo}
          </Descriptions.Item>
          <Descriptions.Item label="到货状态">
            {arrival && (
              <Tag color={ARRIVAL_STATUS_CONFIG[arrival.status]?.color}>
                {ARRIVAL_STATUS_CONFIG[arrival.status]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="质量状态">
            {arrival && (
              <Tag color={QUALITY_STATUS_CONFIG[arrival.qualityStatus]?.color}>
                {QUALITY_STATUS_CONFIG[arrival.qualityStatus]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="采购单号">
            {arrival?.purchase?.purchaseNo}
          </Descriptions.Item>
          <Descriptions.Item label="采购日期">
            {arrival?.purchase?.purchaseDate && formatDate(arrival.purchase.purchaseDate)}
          </Descriptions.Item>
          <Descriptions.Item label="到货日期">
            {arrival?.arrivalDate && formatDate(arrival.arrivalDate)}
          </Descriptions.Item>
          <Descriptions.Item label="收货人">
            <Space>
              <UserOutlined />
              {arrival?.receiver?.name}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {arrival?.receiver?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="合同号">
            {arrival?.purchase?.contractNo}
          </Descriptions.Item>
          <Descriptions.Item label="到货备注" span={isFullscreen ? 3 : 2}>
            {arrival?.remarks}
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
            {arrival?.supplier?.supplierCode}
          </Descriptions.Item>
          <Descriptions.Item label="供应商名称">
            {arrival?.supplier?.supplierName}
          </Descriptions.Item>
          <Descriptions.Item label="联系人">
            {arrival?.supplier?.contactPerson}
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {arrival?.supplier?.contactPhone}
          </Descriptions.Item>
          <Descriptions.Item label="供应商地址" span={isFullscreen ? 3 : 2}>
            {arrival?.supplier?.address}
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
            {arrival?.invoiceNo || <Tag color="orange">未录入</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="发票日期">
            {arrival?.invoiceDate ? formatDate(arrival.invoiceDate) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="发票金额">
            {arrival?.invoiceAmount ? (
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                ¥{formatMoney(arrival.invoiceAmount)}
              </span>
            ) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="实际金额">
            {arrival?.actualAmount ? (
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                ¥{formatMoney(arrival.actualAmount)}
              </span>
            ) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="金额差异">
            {arrival?.amountDifference !== undefined ? (
              <span style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: arrival.amountDifference === 0 ? '#52c41a' : 
                      arrival.amountDifference > 0 ? '#ff4d4f' : '#1890ff'
              }}>
                {arrival.amountDifference === 0 ? '无差异' : 
                 `${arrival.amountDifference > 0 ? '+' : ''}¥${formatMoney(Math.abs(arrival.amountDifference))}`}
              </span>
            ) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="差异说明" span={isFullscreen ? 3 : 2}>
            {arrival?.differenceReason || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 到货明细 */}
      <Card 
        title="到货明细" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Table
          columns={detailColumns}
          dataSource={arrival?.details || []}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 1400 }}
          summary={(pageData) => {
            const totalOrdered = pageData.reduce((sum, record) => sum + record.orderedQuantity, 0)
            const totalArrived = pageData.reduce((sum, record) => sum + record.arrivedQuantity, 0)
            const totalAccepted = pageData.reduce((sum, record) => sum + record.acceptedQuantity, 0)
            const totalRejected = pageData.reduce((sum, record) => sum + record.rejectedQuantity, 0)
            const totalAmount = pageData.reduce((sum, record) => sum + record.amount, 0)
            
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
                  <strong style={{ color: totalRejected > 0 ? '#ff4d4f' : '#999' }}>
                    {totalRejected.toLocaleString()}
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} />
                <Table.Summary.Cell index={6}>
                  <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                    ¥{formatMoney(totalAmount)}
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} colSpan={2} />
              </Table.Summary.Row>
            )
          }}
        />
      </Card>

      {/* 到货时间线 */}
      <Card 
        title="到货时间线" 
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
                onClick={() => navigate('/cargo/arrival-management')}
              >
                返回
              </Button>
              到货管理详情
            </Space>
          }
          loading={isLoading}
          extra={
            <Space>
              {arrival?.status === 'ARRIVED' && (
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/cargo/arrival-management/edit/${id}`)}
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
        title="到货管理详情"
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

export default ArrivalManagementDetailPage
