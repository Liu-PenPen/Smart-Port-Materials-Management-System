import React from 'react'
import { Card, Descriptions, Button, Space, Tag, Drawer, Table, Steps, Timeline } from 'antd'
import { 
  ArrowLeftOutlined, 
  PrinterOutlined, 
  FullscreenOutlined, 
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatMoney, formatDate } from '@/utils'
import { MATERIAL_REQUEST_STATUS_CONFIG, URGENCY_LEVEL_CONFIG } from '@/constants'
import type { MaterialRequest, MaterialRequestDetail } from '@/types'

const MaterialRequestDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  // 获取物资申请详情（模拟）
  const { data: request, isLoading } = useQuery({
    queryKey: ['material-request-detail', id],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟物资申请详情数据
      const mockData: MaterialRequest = {
        id: Number(id),
        requestNo: 'MR202508200001',
        requestDepartmentId: 1,
        requestDepartment: { 
          id: 1, 
          departmentName: '码头作业部', 
          departmentCode: 'DOCK_OPS',
          companyId: 1
        } as any,
        requesterId: 1,
        requester: { 
          id: 1, 
          name: '张工程师', 
          phone: '13800138001',
          email: 'zhang@port.com'
        } as any,
        requestDate: '2025-08-20',
        status: 'SUBMITTED',
        urgencyLevel: 'HIGH',
        expectedDeliveryDate: '2025-08-25',
        totalAmount: 125000,
        approvalStatus: 'PENDING',
        remarks: '港口起重机维修急需配件，请优先处理',
        details: [
          {
            id: 1,
            requestId: Number(id),
            materialId: 1,
            material: { id: 1, materialName: '钢丝绳', materialCode: 'MAT001' } as any,
            materialCode: 'MAT001',
            materialName: '钢丝绳',
            specification: '直径20mm 长度100m 抗拉强度1770MPa',
            unit: '根',
            quantity: 5,
            estimatedPrice: 1500,
            amount: 7500,
            purpose: '起重机主钢丝绳更换',
            urgencyLevel: 'HIGH',
            expectedDeliveryDate: '2025-08-25',
            remarks: '需要符合港口安全标准',
            createdBy: 1,
            createdTime: '2025-08-20T09:00:00',
            version: 1
          },
          {
            id: 2,
            requestId: Number(id),
            materialId: 2,
            material: { id: 2, materialName: '液压油', materialCode: 'MAT002' } as any,
            materialCode: 'MAT002',
            materialName: '液压油',
            specification: '46号抗磨液压油 200L',
            unit: '桶',
            quantity: 10,
            estimatedPrice: 800,
            amount: 8000,
            purpose: '起重机液压系统维护',
            urgencyLevel: 'HIGH',
            expectedDeliveryDate: '2025-08-25',
            remarks: '需要环保型液压油',
            createdBy: 1,
            createdTime: '2025-08-20T09:00:00',
            version: 1
          },
          {
            id: 3,
            requestId: Number(id),
            materialId: 3,
            material: { id: 3, materialName: '轴承', materialCode: 'MAT003' } as any,
            materialCode: 'MAT003',
            materialName: '轴承',
            specification: '深沟球轴承 6320 内径100mm',
            unit: '个',
            quantity: 8,
            estimatedPrice: 1200,
            amount: 9600,
            purpose: '起重机回转机构维修',
            urgencyLevel: 'MEDIUM',
            expectedDeliveryDate: '2025-08-25',
            remarks: '需要原厂配件',
            createdBy: 1,
            createdTime: '2025-08-20T09:00:00',
            version: 1
          }
        ],
        createdBy: 1,
        createdTime: '2025-08-20T09:00:00',
        version: 1
      }
      
      return mockData
    },
  })

  // 申请明细表格列
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
      title: '预估单价',
      dataIndex: 'estimatedPrice',
      key: 'estimatedPrice',
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
      title: '用途',
      dataIndex: 'purpose',
      key: 'purpose',
      width: 150,
      ellipsis: true,
    },
    {
      title: '紧急程度',
      dataIndex: 'urgencyLevel',
      key: 'urgencyLevel',
      width: 100,
      render: (value: string) => {
        const config = URGENCY_LEVEL_CONFIG[value]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '期望交货日期',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      width: 120,
      render: (value: string) => formatDate(value),
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true,
    },
  ]

  // 获取申请进度步骤
  const getRequestSteps = () => {
    const steps = [
      { title: '创建申请', description: '申请已创建' },
      { title: '提交审核', description: '等待审核' },
      { title: '审核完成', description: '审核结果' },
      { title: '转入采购', description: '进入采购流程' },
    ]

    let current = 0
    let status: 'wait' | 'process' | 'finish' | 'error' = 'process'

    switch (request?.status) {
      case 'DRAFT':
        current = 0
        break
      case 'SUBMITTED':
        current = 1
        break
      case 'APPROVED':
        current = 3
        status = 'finish'
        break
      case 'REJECTED':
        current = 2
        status = 'error'
        steps[2] = { title: '审核驳回', description: '申请被驳回' }
        break
      case 'CANCELLED':
        current = 1
        status = 'error'
        steps[1] = { title: '申请取消', description: '申请已取消' }
        break
      default:
        current = 0
    }

    return { steps, current, status }
  }

  const { steps, current, status } = getRequestSteps()

  // 生成时间线数据
  const getTimelineItems = () => {
    const items = [
      {
        color: 'green',
        dot: <CheckOutlined />,
        children: (
          <div>
            <p><strong>申请创建</strong></p>
            <p>创建人：{request?.requester?.name}</p>
            <p>创建时间：{request?.createdTime && formatDate(request.createdTime)}</p>
          </div>
        ),
      },
    ]

    if (request?.status !== 'DRAFT') {
      items.push({
        color: 'blue',
        dot: <FileTextOutlined />,
        children: (
          <div>
            <p><strong>提交审核</strong></p>
            <p>提交时间：{request?.createdTime && formatDate(request.createdTime)}</p>
          </div>
        ),
      })
    }

    if (request?.approvedTime) {
      const isApproved = request.approvalStatus === 'APPROVED'
      items.push({
        color: isApproved ? 'green' : 'red',
        dot: isApproved ? <CheckOutlined /> : <CloseOutlined />,
        children: (
          <div>
            <p><strong>{isApproved ? '审核通过' : '审核驳回'}</strong></p>
            <p>审核人：{request.approver?.name}</p>
            <p>审核时间：{formatDate(request.approvedTime)}</p>
            {request.rejectionReason && (
              <p style={{ color: '#ff4d4f' }}>驳回原因：{request.rejectionReason}</p>
            )}
          </div>
        ),
      })
    } else if (request?.status === 'SUBMITTED') {
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

    return items
  }

  const DetailContent = () => (
    <div style={{ padding: isFullscreen ? 24 : 0 }}>
      {/* 申请进度 */}
      <Card 
        title="申请进度" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Steps current={current} status={status} items={steps} />
      </Card>

      {/* 申请基本信息 */}
      <Card 
        title="申请基本信息" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Descriptions 
          column={isFullscreen ? 3 : 2} 
          size={isFullscreen ? 'default' : 'small'}
        >
          <Descriptions.Item label="申请单号">
            {request?.requestNo}
          </Descriptions.Item>
          <Descriptions.Item label="申请状态">
            {request && (
              <Tag color={MATERIAL_REQUEST_STATUS_CONFIG[request.status]?.color}>
                {MATERIAL_REQUEST_STATUS_CONFIG[request.status]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="紧急程度">
            {request && (
              <Tag color={URGENCY_LEVEL_CONFIG[request.urgencyLevel]?.color}>
                {URGENCY_LEVEL_CONFIG[request.urgencyLevel]?.text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="申请部门">
            {request?.requestDepartment?.departmentName}
          </Descriptions.Item>
          <Descriptions.Item label="申请人">
            <Space>
              <UserOutlined />
              {request?.requester?.name}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {request?.requester?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="申请日期">
            {request?.requestDate && formatDate(request.requestDate)}
          </Descriptions.Item>
          <Descriptions.Item label="期望交货日期">
            {request?.expectedDeliveryDate && formatDate(request.expectedDeliveryDate)}
          </Descriptions.Item>
          <Descriptions.Item label="申请总金额">
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
              ¥{request?.totalAmount && formatMoney(request.totalAmount)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="审批状态">
            {request?.approvalStatus === 'PENDING' && (
              <Tag color="warning" icon={<ClockCircleOutlined />}>待审批</Tag>
            )}
            {request?.approvalStatus === 'APPROVED' && (
              <Tag color="success" icon={<CheckOutlined />}>已批准</Tag>
            )}
            {request?.approvalStatus === 'REJECTED' && (
              <Tag color="error" icon={<CloseOutlined />}>已驳回</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="审批人">
            {request?.approver?.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="审批时间">
            {request?.approvedTime ? formatDate(request.approvedTime) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="申请说明" span={isFullscreen ? 3 : 2}>
            {request?.remarks}
          </Descriptions.Item>
          {request?.rejectionReason && (
            <Descriptions.Item label="驳回原因" span={isFullscreen ? 3 : 2}>
              <span style={{ color: '#ff4d4f' }}>{request.rejectionReason}</span>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 申请明细 */}
      <Card 
        title="申请明细" 
        style={{ marginBottom: 16 }}
        size={isFullscreen ? 'default' : 'small'}
      >
        <Table
          columns={detailColumns}
          dataSource={request?.details || []}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 1200 }}
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
                <Table.Summary.Cell index={4} colSpan={4} />
              </Table.Summary.Row>
            )
          }}
        />
      </Card>

      {/* 申请时间线 */}
      <Card 
        title="申请时间线" 
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
                onClick={() => navigate('/cargo/material-request')}
              >
                返回
              </Button>
              物资申请详情
            </Space>
          }
          loading={isLoading}
          extra={
            <Space>
              {request?.status === 'DRAFT' && (
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/cargo/material-request/edit/${id}`)}
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
        title="物资申请详情"
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

export default MaterialRequestDetailPage
