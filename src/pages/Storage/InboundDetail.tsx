import React from 'react'
import { Card, Descriptions, Table, Button, Space, Tag, Drawer, Alert } from 'antd'
import { ArrowLeftOutlined, PrinterOutlined, FullscreenOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatMoney, formatDateTime, getCurrentPeriod } from '@/utils'
import type { InboundOrder, InboundDetail } from '@/types'

const StorageInboundDetail: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // 获取入库单详情（模拟）
  const { data: inboundOrder, isLoading } = useQuery({
    queryKey: ['inbound-detail', id],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟入库单详情数据
      const mockData: InboundOrder = {
        id: Number(id),
        inboundNo: 'IN202508060001',
        warehouseId: 1,
        warehouse: { 
          id: 1, 
          warehouseName: '码头1号仓库', 
          warehouseCode: 'WH001',
          address: '港口区码头路1号'
        } as any,
        supplierId: 1,
        supplier: { 
          id: 1, 
          supplierName: '北京港口设备有限公司', 
          supplierCode: 'SUP001',
          contactPerson: '王经理',
          contactPhone: '13800138001'
        } as any,
        purchaseOrderId: 1,
        purchaseOrder: {
          id: 1,
          purchaseNo: 'PO202508001',
          totalAmount: 15000.00
        } as any,
        actualInboundDate: '2025-08-20T14:30:00',
        invoiceInboundDate: '2025-08-20',
        invoiceNo: 'INV202508001',
        invoiceDate: '2025-08-20',
        invoiceAmount: 15000.00,
        status: 'UNDER_REVIEW',
        warehouseKeeperId: 1,
        warehouseKeeper: { id: 1, name: '张三', phone: '13800138001' } as any,
        isArchived: false,
        periodMonth: '2025-08',
        remarks: '港口设备维修物资入库，质量检验合格',
        details: [
          {
            id: 1,
            inboundOrderId: Number(id),
            materialId: 1,
            materialCode: 'MAT001',
            materialName: '钢丝绳',
            specification: '直径20mm 长度100m 抗拉强度1770MPa',
            quantity: 5,
            unitPrice: 1500.00,
            amount: 7500.00,
            storageArea: 'A区-01货位',
            createdBy: 1,
            createdTime: '2025-08-20T14:30:00',
            version: 1
          },
          {
            id: 2,
            inboundOrderId: Number(id),
            materialId: 2,
            materialCode: 'MAT002',
            materialName: '液压油',
            specification: '46号抗磨液压油 200L 粘度46cSt',
            quantity: 3,
            unitPrice: 800.00,
            amount: 2400.00,
            storageArea: 'B区-05货位',
            createdBy: 1,
            createdTime: '2025-08-20T14:30:00',
            version: 1
          },
          {
            id: 3,
            inboundOrderId: Number(id),
            materialId: 3,
            materialCode: 'MAT003',
            materialName: '轴承',
            specification: '深沟球轴承 6308 内径40mm 外径90mm',
            quantity: 20,
            unitPrice: 120.00,
            amount: 2400.00,
            storageArea: 'C区-12货位',
            createdBy: 1,
            createdTime: '2025-08-20T14:30:00',
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
    'PENDING': { color: 'default', text: '待处理' },
    'UNDER_REVIEW': { color: 'warning', text: '审核中' },
    'APPROVED': { color: 'success', text: '已审核' },
    'REJECTED': { color: 'error', text: '已驳回' },
    'CONFIRMED': { color: 'processing', text: '已确认' },
    'ARCHIVED': { color: 'default', text: '已归档' },
  }

  // 入库明细表格列
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
      width: 250,
    },
    {
      title: '入库数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (value: number) => {
        if (value === 0) {
          return <Tag color="orange">0元</Tag>
        }
        return `¥${formatMoney(value)}`
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (value: number) => {
        if (value === 0) {
          return <Tag color="orange">0元入库</Tag>
        }
        return `¥${formatMoney(value)}`
      },
    },
    {
      title: '货区',
      dataIndex: 'storageArea',
      key: 'storageArea',
      width: 120,
    },
  ]

  const currentPeriod = getCurrentPeriod()
  const isPeriodLocked = inboundOrder ? inboundOrder.periodMonth < currentPeriod : false
  const isZeroAmountInbound = inboundOrder?.invoiceAmount === 0

  const DetailContent = () => (
    <div style={{ padding: isFullscreen ? 24 : 0 }}>
      {/* 0元入库提示 */}
      {isZeroAmountInbound && (
        <Alert
          message="0元入库单据"
          description="此单据为发票未到的0元入库，后续发票到达后需要进行成本调整。"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="link">
              成本调整说明
            </Button>
          }
        />
      )}

      {/* 期间锁定提示 */}
      {isPeriodLocked && (
        <Alert
          message="期间已锁定"
          description={`${inboundOrder?.periodMonth} 期间已生成报表并锁定，不允许修改此期间的入库单据。`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 入库单信息 */}
      <Card 
        title="入库单信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="单据状态">
            {inboundOrder && (
              <Tag color={statusConfig[inboundOrder.status]?.color}>
                {statusConfig[inboundOrder.status]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="入库编号">
            {inboundOrder?.inboundNo}
          </Descriptions.Item>
          <Descriptions.Item label="采购单号">
            {inboundOrder?.purchaseOrder?.purchaseNo}
          </Descriptions.Item>
          <Descriptions.Item label="仓库">
            {inboundOrder?.warehouse?.warehouseName}
          </Descriptions.Item>
          <Descriptions.Item label="物资编码">
            {inboundOrder?.details?.[0]?.materialCode}
          </Descriptions.Item>
          <Descriptions.Item label="实际入库日期">
            {inboundOrder?.actualInboundDate && formatDateTime(inboundOrder.actualInboundDate)}
          </Descriptions.Item>
          <Descriptions.Item label="发票入库日期">
            {inboundOrder?.invoiceInboundDate || <Tag color="orange">发票未到</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="发票号码">
            {inboundOrder?.invoiceNo || <Tag color="orange">发票未到</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="发票日期">
            {inboundOrder?.invoiceDate || <Tag color="orange">发票未到</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="规格型号">
            {inboundOrder?.details?.[0]?.specification}
          </Descriptions.Item>
          <Descriptions.Item label="数量">
            {inboundOrder?.details?.reduce((sum, item) => sum + item.quantity, 0)}
          </Descriptions.Item>
          <Descriptions.Item label="单价">
            {inboundOrder?.details?.[0]?.unitPrice !== undefined && 
              (inboundOrder.details[0].unitPrice === 0 ? 
                <Tag color="orange">0元</Tag> : 
                `¥${formatMoney(inboundOrder.details[0].unitPrice)}`
              )
            }
          </Descriptions.Item>
          <Descriptions.Item label="金额">
            {inboundOrder?.invoiceAmount !== undefined &&
              (inboundOrder.invoiceAmount === 0 ? 
                <Tag color="orange">0元入库</Tag> : 
                `¥${formatMoney(inboundOrder.invoiceAmount)}`
              )
            }
          </Descriptions.Item>
          <Descriptions.Item label="货区">
            {inboundOrder?.details?.[0]?.storageArea}
          </Descriptions.Item>
          <Descriptions.Item label="供应商">
            {inboundOrder?.supplier?.supplierName}
          </Descriptions.Item>
          <Descriptions.Item label="仓库管理员">
            {inboundOrder?.warehouseKeeper?.name}
          </Descriptions.Item>
          <Descriptions.Item label="归档标识">
            {inboundOrder?.isArchived ? '已归档' : '未归档'}
          </Descriptions.Item>
          <Descriptions.Item label="期间月份">
            <Space>
              <span>{inboundOrder?.periodMonth}</span>
              {isPeriodLocked && <Tag color="red">已锁定</Tag>}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={isFullscreen ? 3 : 2}>
            {inboundOrder?.remarks}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 入库明细 */}
      <Card 
        title="入库明细" 
        size={isFullscreen ? 'default' : 'small'}
        extra={
          <Button type="link" size="small">
            复制
          </Button>
        }
      >
        <Table
          columns={detailColumns}
          dataSource={inboundOrder?.details || []}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 800 }}
          summary={(pageData) => {
            const totalAmount = pageData.reduce((sum, record) => sum + record.amount, 0)
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={6}>
                  <strong>合计</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong>
                    {totalAmount === 0 ? 
                      <Tag color="orange">0元入库</Tag> : 
                      `¥${formatMoney(totalAmount)}`
                    }
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
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
                onClick={() => navigate('/storage/inbound')}
              >
                返回
              </Button>
              入库单详情
            </Space>
          }
          loading={isLoading}
          extra={
            <Space>
              {!isPeriodLocked && ['PENDING', 'UNDER_REVIEW', 'REJECTED'].includes(inboundOrder?.status || '') && (
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/storage/inbound/edit/${id}`)}
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
        title="入库单详情"
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

export default StorageInboundDetail
