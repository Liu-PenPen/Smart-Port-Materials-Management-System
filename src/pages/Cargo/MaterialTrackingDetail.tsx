import React from 'react'
import { Card, Descriptions, Button, Space, Tag, Drawer, Table, Steps, Timeline, Progress, Statistic, Row, Col, message } from 'antd'
import { 
  ArrowLeftOutlined, 
  PrinterOutlined, 
  FullscreenOutlined, 
  EditOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  InboxOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
  EnvironmentOutlined,
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CarOutlined,
  HomeOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatMoney, formatDate } from '@/utils'
import { TRACKING_STATUS_CONFIG, LOCATION_TYPE_CONFIG } from '@/constants'
import type { MaterialTracking } from '@/types'

const MaterialTrackingDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // 获取物资追踪详情（模拟）
  const { data: tracking, isLoading } = useQuery({
    queryKey: ['material-tracking-detail', id],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟物资追踪详情数据
      const mockData: MaterialTracking = {
        id: Number(id),
        trackingNo: 'TK202508200001',
        materialId: 1,
        material: {
          id: 1,
          materialName: '钢丝绳',
          materialCode: 'MAT001',
          specification: '直径20mm 长度100m 抗拉强度1770MPa',
          unit: '根'
        } as any,
        purchaseId: 1,
        purchase: {
          id: 1,
          purchaseNo: 'PO202508200001',
          purchaseDate: '2025-08-20',
          supplier: {
            id: 1,
            supplierName: '中远海运港口设备有限公司',
            supplierCode: 'SUP001'
          } as any
        } as any,
        arrivalId: 1,
        arrival: {
          id: 1,
          arrivalNo: 'AR202508200001',
          arrivalDate: '2025-08-20'
        } as any,
        quantity: 5,
        currentLocation: '港口仓库A区',
        currentStatus: 'IN_WAREHOUSE',
        startDate: '2025-08-20',
        expectedEndDate: '2025-08-30',
        actualEndDate: '2025-08-25',
        responsiblePerson: '仓管员张三',
        contactPhone: '13800138001',
        remarks: '物资已安全到达指定位置，状态良好',
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
            remarks: '货物包装完好，准备运输',
            createdBy: 1,
            createdTime: '2025-08-20T08:00:00',
            version: 1
          },
          {
            id: 2,
            trackingId: Number(id),
            recordDate: '2025-08-20T12:00:00',
            location: '运输途中',
            locationType: 'TRANSIT',
            status: 'IN_TRANSIT',
            description: '货物运输中，预计下午到达',
            operator: '运输司机李师傅',
            contactInfo: '13900139001',
            remarks: '运输车辆：沪A12345，GPS定位正常',
            createdBy: 1,
            createdTime: '2025-08-20T12:00:00',
            version: 1
          },
          {
            id: 3,
            trackingId: Number(id),
            recordDate: '2025-08-20T14:00:00',
            location: '港口大门',
            locationType: 'PORT_GATE',
            status: 'ARRIVED',
            description: '货物到达港口，正在办理入港手续',
            operator: '门卫王师傅',
            contactInfo: '021-87654321',
            remarks: '车辆检查完毕，货物完好无损',
            createdBy: 1,
            createdTime: '2025-08-20T14:00:00',
            version: 1
          },
          {
            id: 4,
            trackingId: Number(id),
            recordDate: '2025-08-20T15:00:00',
            location: '港口仓库A区',
            locationType: 'WAREHOUSE',
            status: 'IN_WAREHOUSE',
            description: '货物已入库，完成验收',
            operator: '仓管员张三',
            contactInfo: '13800138001',
            remarks: '货物质量检验合格，已分配库位A-01-001',
            createdBy: 1,
            createdTime: '2025-08-20T15:00:00',
            version: 1
          }
        ],
        createdBy: 1,
        createdTime: '2025-08-20T08:00:00',
        version: 1
      }
      
      return mockData
    },
  })

  // 获取追踪进度步骤
  const getTrackingSteps = () => {
    const steps = [
      { title: '货物发出', description: '从供应商发出' },
      { title: '运输中', description: '货物运输途中' },
      { title: '到达港口', description: '货物到达港口' },
      { title: '入库完成', description: '货物入库完成' },
    ]

    let current = 0
    let status: 'wait' | 'process' | 'finish' | 'error' = 'process'

    switch (tracking?.currentStatus) {
      case 'SHIPPED':
        current = 0
        break
      case 'IN_TRANSIT':
        current = 1
        break
      case 'ARRIVED':
        current = 2
        break
      case 'IN_WAREHOUSE':
        current = 3
        status = 'finish'
        break
      case 'DELIVERED':
        current = 3
        status = 'finish'
        steps[3] = { title: '配送完成', description: '货物配送完成' }
        break
      default:
        current = 0
    }

    return { steps, current, status }
  }

  const { steps, current, status } = getTrackingSteps()

  // 生成时间线数据
  const getTimelineItems = () => {
    if (!tracking?.records) return []

    return tracking.records.map((record) => {
      let color = 'blue'
      let icon = <ClockCircleOutlined />

      switch (record.status) {
        case 'SHIPPED':
          color = 'green'
          icon = <TruckOutlined />
          break
        case 'IN_TRANSIT':
          color = 'blue'
          icon = <CarOutlined />
          break
        case 'ARRIVED':
          color = 'orange'
          icon = <EnvironmentOutlined />
          break
        case 'IN_WAREHOUSE':
          color = 'green'
          icon = <InboxOutlined />
          break
        case 'DELIVERED':
          color = 'green'
          icon = <CheckOutlined />
          break
        default:
          color = 'gray'
      }

      return {
        color,
        dot: icon,
        children: (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong>{record.description}</strong>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {formatDate(record.recordDate, 'MM-DD HH:mm')}
              </span>
            </div>
            <p>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              位置：{record.location}
            </p>
            <p>
              <UserOutlined style={{ marginRight: 4 }} />
              操作人：{record.operator}
            </p>
            {record.contactInfo && (
              <p>
                <span style={{ marginRight: 4 }}>📞</span>
                联系方式：{record.contactInfo}
              </p>
            )}
            {record.remarks && (
              <p style={{ color: '#666', fontSize: '12px' }}>
                备注：{record.remarks}
              </p>
            )}
          </div>
        ),
      }
    })
  }

  // 追踪记录表格列
  const recordColumns = [
    {
      title: '记录时间',
      dataIndex: 'recordDate',
      key: 'recordDate',
      width: 150,
      render: (value: string) => formatDate(value, 'MM-DD HH:mm'),
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
      title: '联系方式',
      dataIndex: 'contactInfo',
      key: 'contactInfo',
      width: 120,
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
      {/* 追踪进度 */}
      <Card 
        title="物流进度" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Steps current={current} status={status} items={steps} />
      </Card>

      {/* 追踪概览 */}
      <Card 
        title="追踪概览" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="追踪数量"
              value={tracking?.quantity || 0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<InboxOutlined />}
              suffix={tracking?.material?.unit}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="追踪天数"
              value={tracking?.startDate && tracking?.actualEndDate ? 
                Math.ceil((new Date(tracking.actualEndDate).getTime() - new Date(tracking.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 
                tracking?.startDate ? 
                Math.ceil((new Date().getTime() - new Date(tracking.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
              }
              valueStyle={{ color: '#52c41a' }}
              prefix={<CalendarOutlined />}
              suffix="天"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="记录数量"
              value={tracking?.records?.length || 0}
              valueStyle={{ color: '#faad14' }}
              prefix={<FileTextOutlined />}
              suffix="条"
            />
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>完成进度</div>
              <Progress
                type="circle"
                size={80}
                percent={tracking?.currentStatus === 'IN_WAREHOUSE' || tracking?.currentStatus === 'DELIVERED' ? 100 :
                        tracking?.currentStatus === 'ARRIVED' ? 75 :
                        tracking?.currentStatus === 'IN_TRANSIT' ? 50 :
                        tracking?.currentStatus === 'SHIPPED' ? 25 : 0}
                strokeColor={tracking?.currentStatus === 'IN_WAREHOUSE' || tracking?.currentStatus === 'DELIVERED' ? '#52c41a' : '#1890ff'}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 追踪基本信息 */}
      <Card 
        title="追踪基本信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="追踪单号">
            {tracking?.trackingNo}
          </Descriptions.Item>
          <Descriptions.Item label="当前状态">
            {tracking && (
              <Tag color={TRACKING_STATUS_CONFIG[tracking.currentStatus as keyof typeof TRACKING_STATUS_CONFIG]?.color}>
                {TRACKING_STATUS_CONFIG[tracking.currentStatus as keyof typeof TRACKING_STATUS_CONFIG]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="当前位置">
            <Space>
              <EnvironmentOutlined />
              {tracking?.currentLocation}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="开始日期">
            {tracking?.startDate && formatDate(tracking.startDate)}
          </Descriptions.Item>
          <Descriptions.Item label="预计完成">
            {tracking?.expectedEndDate && formatDate(tracking.expectedEndDate)}
          </Descriptions.Item>
          <Descriptions.Item label="实际完成">
            {tracking?.actualEndDate ? formatDate(tracking.actualEndDate) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="负责人">
            <Space>
              <UserOutlined />
              {tracking?.responsiblePerson}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {tracking?.contactPhone}
          </Descriptions.Item>
          <Descriptions.Item label="追踪数量">
            {tracking?.quantity} {tracking?.material?.unit}
          </Descriptions.Item>
          <Descriptions.Item label="追踪备注" span={isFullscreen ? 3 : 2}>
            {tracking?.remarks}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 物料信息 */}
      <Card 
        title="物料信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="物料编码">
            {tracking?.material?.materialCode}
          </Descriptions.Item>
          <Descriptions.Item label="物料名称">
            {tracking?.material?.materialName}
          </Descriptions.Item>
          <Descriptions.Item label="规格型号">
            {tracking?.material?.specification}
          </Descriptions.Item>
          <Descriptions.Item label="计量单位">
            {tracking?.material?.unit}
          </Descriptions.Item>
          <Descriptions.Item label="采购单号">
            {tracking?.purchase?.purchaseNo}
          </Descriptions.Item>
          <Descriptions.Item label="到货单号">
            {tracking?.arrival?.arrivalNo}
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
            {tracking?.purchase?.supplier?.supplierCode}
          </Descriptions.Item>
          <Descriptions.Item label="供应商名称">
            {tracking?.purchase?.supplier?.supplierName}
          </Descriptions.Item>
          <Descriptions.Item label="采购日期">
            {tracking?.purchase?.purchaseDate && formatDate(tracking.purchase.purchaseDate)}
          </Descriptions.Item>
          <Descriptions.Item label="到货日期">
            {tracking?.arrival?.arrivalDate && formatDate(tracking.arrival.arrivalDate)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 追踪记录 */}
      <Card 
        title="追踪记录" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Table
          columns={recordColumns}
          dataSource={tracking?.records || []}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 追踪时间线 */}
      <Card 
        title="追踪时间线" 
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
                onClick={() => navigate('/cargo/material-tracking')}
              >
                返回
              </Button>
              物资追踪详情
            </Space>
          }
          loading={isLoading}
          extra={
            <Space>
              {tracking?.currentStatus !== 'DELIVERED' && (
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/cargo/material-tracking/edit/${id}`)}
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
        title="物资追踪详情"
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

export default MaterialTrackingDetailPage
