import React, { useRef, useState } from 'react'
import { Button, Tag, Space, message, Modal, Popconfirm, Progress } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  RollbackOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { formatMoney, formatDate, getCurrentPeriod } from '@/utils'
import { MATERIAL_REQUEST_STATUS_CONFIG, URGENCY_LEVEL_CONFIG } from '@/constants'
import type { MaterialRequest } from '@/types'

const MaterialRequestList: React.FC = () => {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>()

  // 物资申请服务API（模拟）
  const requestService = {
    getRequests: async (params: any) => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟物资申请数据
      const mockData: MaterialRequest[] = [
        {
          id: 1,
          requestNo: 'MR202508200001',
          requestDepartmentId: 1,
          requestDepartment: { id: 1, departmentName: '码头作业部', departmentCode: 'DOCK_OPS' } as any,
          requesterId: 1,
          requester: { id: 1, name: '张工程师', phone: '13800138001' } as any,
          requestDate: '2025-08-20',
          status: 'SUBMITTED',
          urgencyLevel: 'HIGH',
          expectedDeliveryDate: '2025-08-25',
          totalAmount: 125000,
          approvalStatus: 'PENDING',
          remarks: '港口起重机维修急需配件',
          details: [
            {
              id: 1,
              requestId: 1,
              materialId: 1,
              materialCode: 'MAT001',
              materialName: '钢丝绳',
              specification: '直径20mm 长度100m',
              unit: '根',
              quantity: 5,
              estimatedPrice: 1500,
              amount: 7500,
              purpose: '起重机维修',
              urgencyLevel: 'HIGH',
              expectedDeliveryDate: '2025-08-25'
            } as any
          ],
          createdBy: 1,
          createdTime: '2025-08-20T09:00:00',
          version: 1
        },
        {
          id: 2,
          requestNo: 'MR202508200002',
          requestDepartmentId: 2,
          requestDepartment: { id: 2, departmentName: '设备维护部', departmentCode: 'MAINTENANCE' } as any,
          requesterId: 2,
          requester: { id: 2, name: '李主任', phone: '13800138002' } as any,
          requestDate: '2025-08-20',
          status: 'APPROVED',
          urgencyLevel: 'MEDIUM',
          expectedDeliveryDate: '2025-08-30',
          totalAmount: 85000,
          approvalStatus: 'APPROVED',
          approvedBy: 3,
          approver: { id: 3, name: '王部长' } as any,
          approvedTime: '2025-08-20T14:30:00',
          remarks: '定期维护用品采购',
          details: [],
          createdBy: 2,
          createdTime: '2025-08-20T10:00:00',
          version: 1
        },
        {
          id: 3,
          requestNo: 'MR202508200003',
          requestDepartmentId: 3,
          requestDepartment: { id: 3, departmentName: '安全管理部', departmentCode: 'SAFETY' } as any,
          requesterId: 3,
          requester: { id: 3, name: '赵经理', phone: '13800138003' } as any,
          requestDate: '2025-08-19',
          status: 'REJECTED',
          urgencyLevel: 'LOW',
          expectedDeliveryDate: '2025-09-05',
          totalAmount: 25000,
          approvalStatus: 'REJECTED',
          approvedBy: 3,
          approver: { id: 3, name: '王部长' } as any,
          approvedTime: '2025-08-20T11:00:00',
          rejectionReason: '预算不足，建议下月申请',
          remarks: '安全防护用品补充',
          details: [],
          createdBy: 3,
          createdTime: '2025-08-19T15:00:00',
          version: 1
        }
      ]

      // 简单的搜索过滤
      let filteredData = mockData
      if (params.requestNo) {
        filteredData = filteredData.filter(item => 
          item.requestNo.includes(params.requestNo)
        )
      }
      if (params.status) {
        filteredData = filteredData.filter(item => 
          item.status === params.status
        )
      }
      if (params.requestDepartmentId) {
        filteredData = filteredData.filter(item => 
          item.requestDepartmentId === params.requestDepartmentId
        )
      }

      return {
        data: filteredData,
        success: true,
        total: filteredData.length,
      }
    },
    
    approveRequest: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`批准申请 ${id}`)
      return { success: true }
    },

    rejectRequest: async (id: number, reason: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`驳回申请 ${id}，原因：${reason}`)
      return { success: true }
    },

    withdrawRequest: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`撤回申请 ${id}`)
      return { success: true }
    },

    deleteRequest: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    }
  }

  // 批准申请
  const approveMutation = useMutation({
    mutationFn: requestService.approveRequest,
    onSuccess: () => {
      message.success('批准成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('批准失败')
    },
  })

  // 驳回申请
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      requestService.rejectRequest(id, reason),
    onSuccess: () => {
      message.success('驳回成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('驳回失败')
    },
  })

  // 撤回申请
  const withdrawMutation = useMutation({
    mutationFn: requestService.withdrawRequest,
    onSuccess: () => {
      message.success('撤回成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('撤回失败')
    },
  })

  // 删除申请
  const deleteMutation = useMutation({
    mutationFn: requestService.deleteRequest,
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('删除失败')
    },
  })

  // 表格列配置
  const columns: ProColumns<MaterialRequest>[] = [
    {
      title: '申请单号',
      dataIndex: 'requestNo',
      key: 'requestNo',
      width: 150,
      copyable: true,
      fixed: 'left',
    },
    {
      title: '申请部门',
      dataIndex: ['requestDepartment', 'departmentName'],
      key: 'requestDepartmentId',
      width: 120,
      valueType: 'select',
      request: async () => [
        { label: '码头作业部', value: 1 },
        { label: '设备维护部', value: 2 },
        { label: '安全管理部', value: 3 },
        { label: '技术部', value: 4 },
      ],
    },
    {
      title: '申请人',
      dataIndex: ['requester', 'name'],
      key: 'requesterId',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '申请日期',
      dataIndex: 'requestDate',
      key: 'requestDate',
      width: 120,
      hideInSearch: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'DRAFT': { text: '草稿' },
        'SUBMITTED': { text: '已提交' },
        'APPROVED': { text: '已批准' },
        'REJECTED': { text: '已驳回' },
        'CANCELLED': { text: '已取消' },
      },
      render: (_, record) => {
        const config = MATERIAL_REQUEST_STATUS_CONFIG[record.status]
        const icon = record.status === 'SUBMITTED' ? <ClockCircleOutlined /> :
                    record.status === 'APPROVED' ? <CheckOutlined /> :
                    record.status === 'REJECTED' ? <CloseOutlined /> :
                    record.status === 'CANCELLED' ? <ExclamationCircleOutlined /> : undefined
        return <Tag color={config.color} icon={icon}>{config.text}</Tag>
      },
    },
    {
      title: '紧急程度',
      dataIndex: 'urgencyLevel',
      key: 'urgencyLevel',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        const config = URGENCY_LEVEL_CONFIG[record.urgencyLevel]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '期望交货日期',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      width: 120,
      hideInSearch: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: '申请金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      hideInSearch: true,
      render: (value: number) => `¥${formatMoney(value)}`,
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 100,
      hideInSearch: true,
      render: (value: string, record) => {
        if (value === 'PENDING') {
          return <Tag color="warning" icon={<ClockCircleOutlined />}>待审批</Tag>
        } else if (value === 'APPROVED') {
          return (
            <Space direction="vertical" size={0}>
              <Tag color="success" icon={<CheckOutlined />}>已批准</Tag>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {record.approver?.name} {record.approvedTime && formatDate(record.approvedTime)}
              </span>
            </Space>
          )
        } else if (value === 'REJECTED') {
          return (
            <Space direction="vertical" size={0}>
              <Tag color="error" icon={<CloseOutlined />}>已驳回</Tag>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {record.approver?.name} {record.approvedTime && formatDate(record.approvedTime)}
              </span>
            </Space>
          )
        }
        return '-'
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 200,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="detail"
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/cargo/material-request/${record.id}`)}
        >
          详情
        </Button>,
        record.status === 'DRAFT' && (
          <Button
            key="edit"
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/cargo/material-request/edit/${record.id}`)}
          >
            编辑
          </Button>
        ),
        record.status === 'SUBMITTED' && record.approvalStatus === 'PENDING' && (
          <Space key="approval">
            <Button
              type="link"
              size="small"
              onClick={() => handleApprove(record)}
              loading={approveMutation.isPending}
            >
              批准
            </Button>
            <Button
              type="link"
              size="small"
              danger
              onClick={() => handleReject(record)}
              loading={rejectMutation.isPending}
            >
              驳回
            </Button>
          </Space>
        ),
        record.status === 'SUBMITTED' && (
          <Button
            key="withdraw"
            type="link"
            size="small"
            icon={<RollbackOutlined />}
            onClick={() => handleWithdraw(record)}
            loading={withdrawMutation.isPending}
          >
            撤回
          </Button>
        ),
        record.status === 'DRAFT' && (
          <Popconfirm
            key="delete"
            title="确认删除"
            description="确定要删除这个申请吗？删除后不可恢复。"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={deleteMutation.isPending}
            >
              删除
            </Button>
          </Popconfirm>
        ),
      ].filter(Boolean),
    },
  ]

  // 处理批准
  const handleApprove = (record: MaterialRequest) => {
    Modal.confirm({
      title: '批准申请',
      content: `确定要批准申请单"${record.requestNo}"吗？`,
      onOk: () => approveMutation.mutate(record.id),
    })
  }

  // 处理驳回
  const handleReject = (record: MaterialRequest) => {
    let reason = ''
    Modal.confirm({
      title: '驳回申请',
      content: (
        <div>
          <p>确定要驳回申请单"{record.requestNo}"吗？</p>
          <textarea
            placeholder="请输入驳回原因"
            style={{ width: '100%', height: 80, marginTop: 8 }}
            onChange={(e) => reason = e.target.value}
          />
        </div>
      ),
      onOk: () => {
        if (!reason.trim()) {
          message.error('请输入驳回原因')
          return Promise.reject()
        }
        return rejectMutation.mutateAsync({ id: record.id, reason })
      },
    })
  }

  // 处理撤回
  const handleWithdraw = (record: MaterialRequest) => {
    Modal.confirm({
      title: '撤回申请',
      content: `确定要撤回申请单"${record.requestNo}"吗？撤回后可以重新编辑。`,
      onOk: () => withdrawMutation.mutate(record.id),
    })
  }

  return (
    <div className="page-container">
      <ProTable<MaterialRequest>
        headerTitle="物资申请管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 1400 }}
        toolBarRender={() => [
          <Button
            key="export"
            icon={<ExportOutlined />}
            onClick={() => message.info('导出功能开发中')}
          >
            导出
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/cargo/material-request/new')}
          >
            新建申请
          </Button>,
        ]}
        request={async (params) => {
          return await requestService.getRequests({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            requestNo: params.requestNo,
            status: params.status,
            requestDepartmentId: params.requestDepartmentId,
          })
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </div>
  )
}

export default MaterialRequestList
