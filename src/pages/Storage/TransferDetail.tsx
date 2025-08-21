import React from 'react'
import { Card, Descriptions, Table, Button, Space, Tag, Drawer, Steps, Timeline, Progress } from 'antd'
import { 
  ArrowLeftOutlined, 
  PrinterOutlined, 
  FullscreenOutlined, 
  EditOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatDateTime, formatMoney, getCurrentPeriod } from '@/utils'
import { TRANSFER_TYPE_CONFIG, TRANSPORT_METHOD_CONFIG, URGENCY_LEVEL_CONFIG } from '@/constants'
import type { TransferOrder, TransferDetail } from '@/types'

const StorageTransferDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // 获取移库单详情（模拟）
  const { data: transferOrder, isLoading } = useQuery({
    queryKey: ['transfer-detail', id],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟移库单详情数据
      const mockData: TransferOrder = {
        id: Number(id),
        transferNo: 'TR202508060001',
        transferType: 'SHIP_SCHEDULE_TRANSFER',
        sourceWarehouseId: 1,
        sourceWarehouse: { 
          id: 1, 
          warehouseName: '码头1号仓库', 
          warehouseCode: 'WH001',
          address: '港口区码头路1号'
        } as any,
        targetWarehouseId: 2,
        targetWarehouse: { 
          id: 2, 
          warehouseName: '码头2号仓库', 
          warehouseCode: 'WH002',
          address: '港口区码头路2号'
        } as any,
        transferDate: '2025-08-20T09:00:00',
        planTransferDate: '2025-08-20T09:00:00',
        actualTransferDate: undefined,
        status: 'UNDER_REVIEW',
        transferReason: '船期调整，COSCO2025080601船期提前，货物需要从1号码头转移到2号码头',
        urgencyLevel: 'HIGH',
        shipScheduleNo: 'COSCO2025080601',
        berthNo: '2号泊位',
        operatorId: 1,
        operator: { id: 1, name: '张三', phone: '13800138001' } as any,
        approvedBy: undefined,
        approver: undefined,
        approvedTime: undefined,
        isArchived: false,
        periodMonth: '2025-08',
        transportMethod: 'CRANE',
        estimatedDuration: 4,
        actualDuration: undefined,
        remarks: '需要协调起重机作业时间，注意货物安全，优先处理危险品',
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
          },
          {
            id: 2,
            transferOrderId: Number(id),
            materialId: 2,
            materialCode: 'MAT002',
            materialName: '钢材',
            specification: 'Q235B 螺纹钢 直径25mm',
            sourceStorageArea: 'A区-03-12',
            targetStorageArea: 'B区-01-15',
            quantity: 500,
            transferredQuantity: 0,
            unitPrice: 4500,
            amount: 2250000,
            packageType: '捆装',
            weight: 12500,
            volume: 15.6,
            specialRequirements: '防锈处理，避免雨淋',
            createdBy: 1,
            createdTime: '2025-08-20T08:00:00',
            version: 1
          },
          {
            id: 3,
            transferOrderId: Number(id),
            materialId: 3,
            materialCode: 'MAT003',
            materialName: '机械设备',
            specification: '港口起重机配件',
            sourceStorageArea: 'A区-05-20',
            targetStorageArea: 'B区-03-25',
            quantity: 8,
            transferredQuantity: 0,
            unitPrice: 15000,
            amount: 120000,
            packageType: '木箱包装',
            weight: 3200,
            volume: 8.5,
            specialRequirements: '精密设备，防震防潮',
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
  })

  // 状态配置
  const statusConfig = {
    'PENDING': { color: 'default', text: '待处理' },
    'UNDER_REVIEW': { color: 'warning', text: '审核中' },
    'APPROVED': { color: 'success', text: '已审核' },
    'IN_TRANSFER': { color: 'processing', text: '移库中' },
    'COMPLETED': { color: 'success', text: '已完成' },
    'REJECTED': { color: 'error', text: '已驳回' },
    'CANCELLED': { color: 'default', text: '已取消' },
  }

  // 移库明细表格列
  const detailColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
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
      title: '源货区',
      dataIndex: 'sourceStorageArea',
      key: 'sourceStorageArea',
      width: 120,
    },
    {
      title: '目标货区',
      dataIndex: 'targetStorageArea',
      key: 'targetStorageArea',
      width: 120,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '已移库',
      dataIndex: 'transferredQuantity',
      key: 'transferredQuantity',
      width: 80,
      render: (value: number, record: TransferDetail) => (
        <Space direction="vertical" size={0}>
          <span style={{ color: value > 0 ? '#52c41a' : '#999' }}>
            {value?.toLocaleString() || 0}
          </span>
          <Progress 
            percent={Math.round((value || 0) / record.quantity * 100)} 
            size="small" 
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: '重量(kg)',
      dataIndex: 'weight',
      key: 'weight',
      width: 100,
      render: (value: number) => value ? `${value.toLocaleString()}kg` : '-',
    },
    {
      title: '体积(m³)',
      dataIndex: 'volume',
      key: 'volume',
      width: 100,
      render: (value: number) => value ? `${value}m³` : '-',
    },
    {
      title: '包装方式',
      dataIndex: 'packageType',
      key: 'packageType',
      width: 100,
    },
    {
      title: '特殊要求',
      dataIndex: 'specialRequirements',
      key: 'specialRequirements',
      width: 150,
      render: (value: string) => value ? (
        <Tag color="orange" icon={<WarningOutlined />}>
          {value}
        </Tag>
      ) : '-',
    },
  ]

  const currentPeriod = getCurrentPeriod()
  const isPeriodLocked = transferOrder ? transferOrder.periodMonth < currentPeriod : false

  // 移库进度步骤
  const getTransferSteps = () => {
    const steps = [
      { title: '创建申请', description: '移库申请已创建' },
      { title: '审核中', description: '等待审核批准' },
      { title: '已审核', description: '审核通过，准备移库' },
      { title: '移库中', description: '正在执行移库操作' },
      { title: '已完成', description: '移库操作完成' },
    ]

    let current = 0
    switch (transferOrder?.status) {
      case 'PENDING':
        current = 0
        break
      case 'UNDER_REVIEW':
        current = 1
        break
      case 'APPROVED':
        current = 2
        break
      case 'IN_TRANSFER':
        current = 3
        break
      case 'COMPLETED':
        current = 4
        break
      case 'REJECTED':
      case 'CANCELLED':
        current = 1
        steps[1] = { title: '已驳回', description: '审核未通过' }
        break
    }

    return { steps, current }
  }

  const { steps, current } = getTransferSteps()

  const DetailContent = () => (
    <div style={{ padding: isFullscreen ? 24 : 0 }}>
      {/* 移库进度 */}
      <Card 
        title="移库进度" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Steps 
          current={current} 
          status={transferOrder?.status === 'REJECTED' || transferOrder?.status === 'CANCELLED' ? 'error' : 'process'}
          items={steps}
        />
      </Card>

      {/* 移库单信息 */}
      <Card 
        title="移库单信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="移库单号">
            {transferOrder?.transferNo}
          </Descriptions.Item>
          <Descriptions.Item label="移库类型">
            {transferOrder && (
              <Tag color={TRANSFER_TYPE_CONFIG[transferOrder.transferType]?.color}>
                {TRANSFER_TYPE_CONFIG[transferOrder.transferType]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="移库状态">
            {transferOrder && (
              <Tag color={statusConfig[transferOrder.status]?.color}>
                {statusConfig[transferOrder.status]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="源仓库">
            {transferOrder?.sourceWarehouse?.warehouseName}
          </Descriptions.Item>
          <Descriptions.Item label="目标仓库">
            {transferOrder?.targetWarehouse?.warehouseName}
          </Descriptions.Item>
          <Descriptions.Item label="紧急程度">
            {transferOrder && (
              <Tag 
                color={URGENCY_LEVEL_CONFIG[transferOrder.urgencyLevel]?.color}
                icon={transferOrder.urgencyLevel === 'HIGH' ? <WarningOutlined /> : undefined}
              >
                {URGENCY_LEVEL_CONFIG[transferOrder.urgencyLevel]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="计划移库时间">
            {transferOrder?.planTransferDate && formatDateTime(transferOrder.planTransferDate)}
          </Descriptions.Item>
          <Descriptions.Item label="实际移库时间">
            {transferOrder?.actualTransferDate ? 
              formatDateTime(transferOrder.actualTransferDate) : 
              <Tag color="orange">未开始</Tag>
            }
          </Descriptions.Item>
          <Descriptions.Item label="运输方式">
            {transferOrder && (
              <Tag 
                color={TRANSPORT_METHOD_CONFIG[transferOrder.transportMethod]?.color}
                icon={<TruckOutlined />}
              >
                {TRANSPORT_METHOD_CONFIG[transferOrder.transportMethod]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="预计耗时">
            <Space>
              <ClockCircleOutlined />
              <span>{transferOrder?.estimatedDuration}小时</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="实际耗时">
            {transferOrder?.actualDuration ? (
              <Space>
                <ClockCircleOutlined style={{ color: '#52c41a' }} />
                <span>{transferOrder.actualDuration}小时</span>
              </Space>
            ) : (
              <Tag color="orange">进行中</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="船期号">
            {transferOrder?.shipScheduleNo || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="泊位号">
            {transferOrder?.berthNo || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="操作员">
            {transferOrder?.operator?.name}
          </Descriptions.Item>
          <Descriptions.Item label="审核人">
            {transferOrder?.approver?.name || <Tag color="orange">待审核</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="移库原因" span={isFullscreen ? 3 : 2}>
            {transferOrder?.transferReason}
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={isFullscreen ? 3 : 2}>
            {transferOrder?.remarks}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 移库明细 */}
      <Card 
        title="移库明细" 
        size={isFullscreen ? 'default' : 'small'}
        extra={
          <Button type="link" size="small">
            复制
          </Button>
        }
      >
        <Table
          columns={detailColumns}
          dataSource={transferOrder?.details || []}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 1200 }}
          summary={(pageData) => {
            const totalQuantity = pageData.reduce((sum, record) => sum + record.quantity, 0)
            const totalWeight = pageData.reduce((sum, record) => sum + (record.weight || 0), 0)
            const totalVolume = pageData.reduce((sum, record) => sum + (record.volume || 0), 0)
            const totalAmount = pageData.reduce((sum, record) => sum + record.amount, 0)
            
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={6}>
                  <strong>合计</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong>{totalQuantity.toLocaleString()}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3}>
                  <strong>{totalWeight.toLocaleString()}kg</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <strong>{totalVolume}m³</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} colSpan={2}>
                  <strong>价值: ¥{formatMoney(totalAmount)}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />
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
                onClick={() => navigate('/storage/transfer')}
              >
                返回
              </Button>
              移库单详情
            </Space>
          }
          loading={isLoading}
          extra={
            <Space>
              {!isPeriodLocked && ['PENDING', 'UNDER_REVIEW', 'REJECTED'].includes(transferOrder?.status || '') && (
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/storage/transfer/edit/${id}`)}
                >
                  修改
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
        title="移库单详情"
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

export default StorageTransferDetail
