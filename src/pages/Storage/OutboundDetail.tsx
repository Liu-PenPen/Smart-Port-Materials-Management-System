import React from 'react'
import { Card, Descriptions, Table, Button, Space, Tag, Drawer } from 'antd'
import { ArrowLeftOutlined, PrinterOutlined, FullscreenOutlined, CloseOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatMoney, formatDateTime } from '@/utils'
import type { OutboundOrder, OutboundDetail } from '@/types'

const StorageOutboundDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // 获取出库单详情（模拟）
  const { data: outboundOrder, isLoading } = useQuery({
    queryKey: ['outbound-detail', id],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟出库单详情数据
      const mockData: OutboundOrder = {
        id: Number(id),
        outboundNo: 'OUT202508060002',
        warehouseId: 1,
        warehouse: { 
          id: 1, 
          warehouseName: '码头1号仓库', 
          warehouseCode: 'WH001',
          address: '港口区码头路1号'
        } as any,
        actualOutboundDate: '2025-08-20T13:39:57',
        invoiceOutboundDate: '2025-08-20',
        status: 'UNDER_REVIEW',
        outboundType: 'NORMAL',
        warehouseKeeperId: 1,
        warehouseKeeper: { id: 1, name: '张三', phone: '13800138001' } as any,
        isArchived: false,
        equipmentCode: 'EQ001',
        usageType: 'PRODUCTION',
        usageDepartmentId: 1,
        usageDepartment: { id: 1, departmentName: '生产部', departmentCode: 'PROD001' } as any,
        recipientId: 1,
        recipient: { id: 1, name: '李四', phone: '13800138002' } as any,
        periodMonth: '2025-08',
        remarks: '紧急出库，用于码头装卸设备维修',
        details: [
          {
            id: 1,
            outboundOrderId: Number(id),
            materialId: 1,
            materialCode: 'MAT001',
            materialName: '钢丝绳',
            specification: '直径20mm 长度100m',
            quantity: 2,
            unitPrice: 1500.00,
            amount: 3000.00,
            createdBy: 1,
            createdTime: '2025-08-20T13:39:57',
            version: 1
          },
          {
            id: 2,
            outboundOrderId: Number(id),
            materialId: 2,
            materialCode: 'MAT002',
            materialName: '液压油',
            specification: '46号抗磨液压油 200L',
            quantity: 5,
            unitPrice: 800.00,
            amount: 4000.00,
            createdBy: 1,
            createdTime: '2025-08-20T13:39:57',
            version: 1
          },
          {
            id: 3,
            outboundOrderId: Number(id),
            materialId: 3,
            materialCode: 'MAT003',
            materialName: '轴承',
            specification: '深沟球轴承 6308',
            quantity: 10,
            unitPrice: 120.00,
            amount: 1200.00,
            createdBy: 1,
            createdTime: '2025-08-20T13:39:57',
            version: 1
          }
        ],
        createdBy: 1,
        createdTime: '2025-08-20T10:00:00',
        version: 1
      }
      
      return mockData
    },
  })

  // 状态配置
  const statusConfig = {
    'OUTBOUND_PROCESSING': { color: 'processing', text: '出库中' },
    'UNDER_REVIEW': { color: 'warning', text: '审核中' },
    'APPROVED': { color: 'success', text: '已审核' },
    'REJECTED': { color: 'error', text: '已驳回' },
    'COMPLETED': { color: 'default', text: '已完成' },
  }

  // 出库类型配置
  const outboundTypeConfig = {
    'NORMAL': { color: 'blue', text: '正常出库' },
    'URGENT': { color: 'red', text: '紧急出库' },
    'TRANSFER': { color: 'orange', text: '移库出库' },
    'RETURN': { color: 'green', text: '退库出库' },
  }

  // 领用类型配置
  const usageTypeConfig = {
    'PRODUCTION': { text: '生产用' },
    'MAINTENANCE': { text: '维修用' },
    'OFFICE': { text: '办公用' },
    'OTHER': { text: '其他' },
  }

  // 出库明细表格列
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
      title: '出库数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '已出库数量',
      dataIndex: 'quantity',
      key: 'outboundQuantity',
      width: 120,
      render: (value: number) => (
        <span style={{ color: '#52c41a' }}>{value.toLocaleString()}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Button type="link" size="small">
          编辑
        </Button>
      ),
    },
  ]

  const DetailContent = () => (
    <div style={{ padding: isFullscreen ? 24 : 0 }}>
      {/* 出库单信息 */}
      <Card 
        title="出库单信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="单据状态">
            {outboundOrder && (
              <Tag color={statusConfig[outboundOrder.status]?.color}>
                {statusConfig[outboundOrder.status]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="出库编号">
            {outboundOrder?.outboundNo}
          </Descriptions.Item>
          <Descriptions.Item label="销售单号">
            SL202508060001
          </Descriptions.Item>
          <Descriptions.Item label="仓库">
            {outboundOrder?.warehouse?.warehouseName}
          </Descriptions.Item>
          <Descriptions.Item label="物资编码">
            {outboundOrder?.details?.[0]?.materialCode}
          </Descriptions.Item>
          <Descriptions.Item label="实际出库日期">
            {outboundOrder?.actualOutboundDate && formatDateTime(outboundOrder.actualOutboundDate)}
          </Descriptions.Item>
          <Descriptions.Item label="发票出库日期">
            {outboundOrder?.invoiceOutboundDate}
          </Descriptions.Item>
          <Descriptions.Item label="规格型号">
            {outboundOrder?.details?.[0]?.specification}
          </Descriptions.Item>
          <Descriptions.Item label="数量">
            {outboundOrder?.details?.reduce((sum, item) => sum + item.quantity, 0)}
          </Descriptions.Item>
          <Descriptions.Item label="单价">
            ¥{outboundOrder?.details?.[0]?.unitPrice && formatMoney(outboundOrder.details[0].unitPrice)}
          </Descriptions.Item>
          <Descriptions.Item label="金额">
            ¥{outboundOrder?.details?.reduce((sum, item) => sum + item.amount, 0) && 
              formatMoney(outboundOrder.details.reduce((sum, item) => sum + item.amount, 0))}
          </Descriptions.Item>
          <Descriptions.Item label="仓库管理员">
            {outboundOrder?.warehouseKeeper?.name}
          </Descriptions.Item>
          <Descriptions.Item label="归档标识">
            {outboundOrder?.isArchived ? '已归档' : '未归档'}
          </Descriptions.Item>
          <Descriptions.Item label="使用设备">
            {outboundOrder?.equipmentCode}
          </Descriptions.Item>
          <Descriptions.Item label="领用类型">
            {outboundOrder?.usageType && usageTypeConfig[outboundOrder.usageType]?.text}
          </Descriptions.Item>
          <Descriptions.Item label="领用部门">
            {outboundOrder?.usageDepartment?.departmentName}
          </Descriptions.Item>
          <Descriptions.Item label="领用人">
            {outboundOrder?.recipient?.name}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 出库明细 */}
      <Card 
        title="出库明细" 
        size={isFullscreen ? 'default' : 'small'}
        extra={
          <Button type="link" size="small">
            复制
          </Button>
        }
      >
        <Table
          columns={detailColumns}
          dataSource={outboundOrder?.details || []}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 800 }}
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
                onClick={() => navigate('/storage/outbound')}
              >
                返回
              </Button>
              出库单详情
            </Space>
          }
          loading={isLoading}
          extra={
            <Space>
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
        title="出库单详情"
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

export default StorageOutboundDetail
