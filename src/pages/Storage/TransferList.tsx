import React, { useRef, useState } from 'react'
import { Button, Tag, Space, message, Modal, Input, Form, Progress, Tooltip } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  SwapOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { formatDateTime, getCurrentPeriod } from '@/utils'
import { TRANSFER_TYPE_CONFIG, TRANSPORT_METHOD_CONFIG, URGENCY_LEVEL_CONFIG } from '@/constants'
import type { TransferOrder } from '@/types'

const StorageTransferList: React.FC = () => {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>()
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<TransferOrder | null>(null)
  const [rejectForm] = Form.useForm()

  // 移库单服务API（模拟）
  const transferService = {
    getTransferOrders: async (params: any) => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))

      // 模拟移库单数据
      const mockData: TransferOrder[] = [
        {
          id: 1,
          transferNo: 'TR202508060001',
          transferType: 'SHIP_SCHEDULE_TRANSFER',
          sourceWarehouseId: 1,
          sourceWarehouse: { id: 1, warehouseName: '码头1号仓库', warehouseCode: 'WH001' } as any,
          targetWarehouseId: 2,
          targetWarehouse: { id: 2, warehouseName: '码头2号仓库', warehouseCode: 'WH002' } as any,
          transferDate: '2025-08-20T09:00:00',
          planTransferDate: '2025-08-20T09:00:00',
          actualTransferDate: undefined,
          status: 'UNDER_REVIEW',
          transferReason: '船期调整，货物需要转移到2号码头',
          urgencyLevel: 'HIGH',
          shipScheduleNo: 'COSCO2025080601',
          berthNo: '2号泊位',
          operatorId: 1,
          operator: { id: 1, name: '张三' } as any,
          approvedBy: undefined,
          approver: undefined,
          approvedTime: undefined,
          isArchived: false,
          periodMonth: '2025-08',
          transportMethod: 'CRANE',
          estimatedDuration: 4,
          actualDuration: undefined,
          remarks: '需要协调起重机作业时间',
          details: [],
          createdBy: 1,
          createdTime: '2025-08-20T08:00:00',
          version: 1
        },
        {
          id: 2,
          transferNo: 'TR202508060002',
          transferType: 'WAREHOUSE_TRANSFER',
          sourceWarehouseId: 3,
          sourceWarehouse: { id: 3, warehouseName: '散货仓库', warehouseCode: 'WH003' } as any,
          targetWarehouseId: 1,
          targetWarehouse: { id: 1, warehouseName: '码头1号仓库', warehouseCode: 'WH001' } as any,
          transferDate: '2025-08-19T14:30:00',
          planTransferDate: '2025-08-19T14:30:00',
          actualTransferDate: '2025-08-19T16:45:00',
          status: 'COMPLETED',
          transferReason: '库存优化，将散货仓库物资集中到1号仓库',
          urgencyLevel: 'MEDIUM',
          shipScheduleNo: undefined,
          berthNo: undefined,
          operatorId: 2,
          operator: { id: 2, name: '李四' } as any,
          approvedBy: 1,
          approver: { id: 1, name: '王经理' } as any,
          approvedTime: '2025-08-19T13:00:00',
          isArchived: false,
          periodMonth: '2025-08',
          transportMethod: 'FORKLIFT',
          estimatedDuration: 2,
          actualDuration: 2.25,
          remarks: '移库完成，物资已重新编码',
          details: [],
          createdBy: 2,
          createdTime: '2025-08-19T12:00:00',
          version: 1
        },
        {
          id: 3,
          transferNo: 'TR202508060003',
          transferType: 'AREA_TRANSFER',
          sourceWarehouseId: 1,
          sourceWarehouse: { id: 1, warehouseName: '码头1号仓库', warehouseCode: 'WH001' } as any,
          targetWarehouseId: 1,
          targetWarehouse: { id: 1, warehouseName: '码头1号仓库', warehouseCode: 'WH001' } as any,
          transferDate: '2025-08-18T10:15:00',
          planTransferDate: '2025-08-18T10:15:00',
          actualTransferDate: undefined,
          status: 'IN_TRANSFER',
          transferReason: '货区调整，A区货物移至C区',
          urgencyLevel: 'LOW',
          shipScheduleNo: undefined,
          berthNo: undefined,
          operatorId: 3,
          operator: { id: 3, name: '王五' } as any,
          approvedBy: 1,
          approver: { id: 1, name: '王经理' } as any,
          approvedTime: '2025-08-18T09:30:00',
          isArchived: false,
          periodMonth: '2025-08',
          transportMethod: 'FORKLIFT',
          estimatedDuration: 1,
          actualDuration: undefined,
          remarks: '货区重新规划',
          details: [],
          createdBy: 3,
          createdTime: '2025-08-18T09:00:00',
          version: 1
        },
        {
          id: 4,
          transferNo: 'TR202508060004',
          transferType: 'EMERGENCY_TRANSFER',
          sourceWarehouseId: 2,
          sourceWarehouse: { id: 2, warehouseName: '码头2号仓库', warehouseCode: 'WH002' } as any,
          targetWarehouseId: 1,
          targetWarehouse: { id: 1, warehouseName: '码头1号仓库', warehouseCode: 'WH001' } as any,
          transferDate: '2025-08-17T15:20:00',
          planTransferDate: '2025-08-17T15:20:00',
          actualTransferDate: undefined,
          status: 'REJECTED',
          transferReason: '2号仓库设备故障，紧急转移危险品',
          urgencyLevel: 'HIGH',
          shipScheduleNo: undefined,
          berthNo: undefined,
          operatorId: 1,
          operator: { id: 1, name: '张三' } as any,
          approvedBy: undefined,
          approver: undefined,
          approvedTime: undefined,
          isArchived: false,
          periodMonth: '2025-08',
          transportMethod: 'TRUCK',
          estimatedDuration: 0.5,
          actualDuration: undefined,
          remarks: '驳回原因：需要先处理设备故障',
          details: [],
          createdBy: 1,
          createdTime: '2025-08-17T15:00:00',
          version: 1
        }
      ]

      // 简单的搜索过滤
      let filteredData = mockData
      if (params.transferNo) {
        filteredData = filteredData.filter(item =>
          item.transferNo.includes(params.transferNo)
        )
      }
      if (params.status) {
        filteredData = filteredData.filter(item =>
          item.status === params.status
        )
      }
      if (params.transferType) {
        filteredData = filteredData.filter(item =>
          item.transferType === params.transferType
        )
      }
      if (params.urgencyLevel) {
        filteredData = filteredData.filter(item =>
          item.urgencyLevel === params.urgencyLevel
        )
      }

      return {
        data: filteredData,
        success: true,
        total: filteredData.length,
      }
    },

    approveTransfer: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`审核通过移库单 ${id}`)
      return { success: true }
    },

    rejectTransfer: async (id: number, reason: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`驳回移库单 ${id}，原因：${reason}`)
      return { success: true }
    },

    deleteTransfer: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`删除移库单 ${id}`)
      return { success: true }
    },

    startTransfer: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`开始移库 ${id}`)
      return { success: true }
    },

    completeTransfer: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`完成移库 ${id}`)
      return { success: true }
    }
  }

  // 审核通过
  const approveMutation = useMutation({
    mutationFn: transferService.approveTransfer,
    onSuccess: () => {
      message.success('审核通过')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('审核失败')
    },
  })

  // 审核驳回
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      transferService.rejectTransfer(id, reason),
    onSuccess: () => {
      message.success('已驳回')
      setRejectModalVisible(false)
      setCurrentRecord(null)
      rejectForm.resetFields()
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('操作失败')
    },
  })

  // 删除移库单
  const deleteMutation = useMutation({
    mutationFn: transferService.deleteTransfer,
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('删除失败')
    },
  })

  // 开始移库
  const startTransferMutation = useMutation({
    mutationFn: transferService.startTransfer,
    onSuccess: () => {
      message.success('移库已开始')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('操作失败')
    },
  })

  // 完成移库
  const completeTransferMutation = useMutation({
    mutationFn: transferService.completeTransfer,
    onSuccess: () => {
      message.success('移库已完成')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('操作失败')
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

  // 表格列配置
  const columns: ProColumns<TransferOrder>[] = [
    {
      title: '移库单号',
      dataIndex: 'transferNo',
      key: 'transferNo',
      width: 150,
      copyable: true,
      fixed: 'left',
    },
    {
      title: '移库类型',
      dataIndex: 'transferType',
      key: 'transferType',
      width: 120,
      valueType: 'select',
      valueEnum: {
        'WAREHOUSE_TRANSFER': { text: '仓库间移库' },
        'AREA_TRANSFER': { text: '货区调整' },
        'SHIP_SCHEDULE_TRANSFER': { text: '船期调整' },
        'EMERGENCY_TRANSFER': { text: '紧急移库' },
      },
      render: (_, record) => {
        const config = TRANSFER_TYPE_CONFIG[record.transferType]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '源仓库',
      dataIndex: ['sourceWarehouse', 'warehouseName'],
      key: 'sourceWarehouseId',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '目标仓库',
      dataIndex: ['targetWarehouse', 'warehouseName'],
      key: 'targetWarehouseId',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '移库状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'PENDING': { text: '待处理' },
        'UNDER_REVIEW': { text: '审核中' },
        'APPROVED': { text: '已审核' },
        'IN_TRANSFER': { text: '移库中' },
        'COMPLETED': { text: '已完成' },
        'REJECTED': { text: '已驳回' },
        'CANCELLED': { text: '已取消' },
      },
      render: (_, record) => {
        const config = statusConfig[record.status]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '紧急程度',
      dataIndex: 'urgencyLevel',
      key: 'urgencyLevel',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'LOW': { text: '低' },
        'MEDIUM': { text: '中' },
        'HIGH': { text: '高' },
      },
      render: (_, record) => {
        const config = URGENCY_LEVEL_CONFIG[record.urgencyLevel]
        return (
          <Tag color={config.color} icon={record.urgencyLevel === 'HIGH' ? <WarningOutlined /> : undefined}>
            {config.text}
          </Tag>
        )
      },
    },
    {
      title: '运输方式',
      dataIndex: 'transportMethod',
      key: 'transportMethod',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        const config = TRANSPORT_METHOD_CONFIG[record.transportMethod]
        return <Tag color={config.color} icon={<TruckOutlined />}>{config.text}</Tag>
      },
    },
    {
      title: '船期号',
      dataIndex: 'shipScheduleNo',
      key: 'shipScheduleNo',
      width: 140,
      hideInSearch: true,
      render: (_, record) => record.shipScheduleNo || '-',
    },
    {
      title: '操作员',
      dataIndex: ['operator', 'name'],
      key: 'operatorId',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '进度',
      key: 'progress',
      width: 120,
      hideInSearch: true,
      render: (_, record) => {
        let percent = 0
        let status: 'normal' | 'active' | 'success' | 'exception' = 'normal'

        switch (record.status) {
          case 'PENDING':
            percent = 10
            break
          case 'UNDER_REVIEW':
            percent = 30
            status = 'active'
            break
          case 'APPROVED':
            percent = 50
            break
          case 'IN_TRANSFER':
            percent = 80
            status = 'active'
            break
          case 'COMPLETED':
            percent = 100
            status = 'success'
            break
          case 'REJECTED':
          case 'CANCELLED':
            percent = 0
            status = 'exception'
            break
        }

        return (
          <Tooltip title={`当前状态: ${statusConfig[record.status]?.text}`}>
            <Progress
              percent={percent}
              size="small"
              status={status}
              showInfo={false}
            />
          </Tooltip>
        )
      },
    },
    {
      title: '计划时间',
      dataIndex: 'planTransferDate',
      key: 'planTransferDate',
      width: 150,
      hideInSearch: true,
      render: (_, record) => record.planTransferDate ? formatDateTime(record.planTransferDate) : '-',
    },
    {
      title: '耗时',
      key: 'duration',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        if (record.actualDuration) {
          return (
            <Space>
              <ClockCircleOutlined />
              <span>{record.actualDuration}h</span>
            </Space>
          )
        } else if (record.estimatedDuration) {
          return (
            <Space>
              <ClockCircleOutlined style={{ color: '#999' }} />
              <span style={{ color: '#999' }}>预计{record.estimatedDuration}h</span>
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
      width: 280,
      fixed: 'right',
      render: (_, record) => {
        const currentPeriod = getCurrentPeriod()
        const isPeriodLocked = record.periodMonth < currentPeriod

        return [
          <Button
            key="detail"
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/storage/transfer/${record.id}`)}
          >
            详情
          </Button>,
          record.status === 'UNDER_REVIEW' && (
            <Button
              key="approve"
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record)}
              loading={approveMutation.isPending}
            >
              审核
            </Button>
          ),
          record.status === 'UNDER_REVIEW' && (
            <Button
              key="reject"
              type="link"
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleReject(record)}
              loading={rejectMutation.isPending}
            >
              驳回
            </Button>
          ),
          record.status === 'APPROVED' && (
            <Button
              key="start"
              type="link"
              size="small"
              icon={<SwapOutlined />}
              onClick={() => handleStartTransfer(record)}
              loading={startTransferMutation.isPending}
            >
              开始移库
            </Button>
          ),
          record.status === 'IN_TRANSFER' && (
            <Button
              key="complete"
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleCompleteTransfer(record)}
              loading={completeTransferMutation.isPending}
            >
              完成移库
            </Button>
          ),
          ['PENDING', 'UNDER_REVIEW', 'REJECTED'].includes(record.status) && !isPeriodLocked && (
            <Button
              key="edit"
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/storage/transfer/edit/${record.id}`)}
            >
              修改
            </Button>
          ),
          ['PENDING', 'REJECTED'].includes(record.status) && !isPeriodLocked && (
            <Button
              key="delete"
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              loading={deleteMutation.isPending}
            >
              删除
            </Button>
          ),
        ].filter(Boolean)
      },
    },
  ]

  // 处理审核通过
  const handleApprove = (record: TransferOrder) => {
    Modal.confirm({
      title: '确认审核',
      content: `确定要审核通过移库单"${record.transferNo}"吗？`,
      onOk: () => approveMutation.mutate(record.id),
    })
  }

  // 处理审核驳回
  const handleReject = (record: TransferOrder) => {
    setCurrentRecord(record)
    setRejectModalVisible(true)
  }

  // 确认驳回
  const handleConfirmReject = async () => {
    try {
      const values = await rejectForm.validateFields()
      if (currentRecord) {
        rejectMutation.mutate({
          id: currentRecord.id,
          reason: values.reason
        })
      }
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  // 处理开始移库
  const handleStartTransfer = (record: TransferOrder) => {
    Modal.confirm({
      title: '开始移库',
      content: `确定要开始执行移库单"${record.transferNo}"吗？`,
      onOk: () => startTransferMutation.mutate(record.id),
    })
  }

  // 处理完成移库
  const handleCompleteTransfer = (record: TransferOrder) => {
    Modal.confirm({
      title: '完成移库',
      content: `确定移库单"${record.transferNo}"已完成吗？`,
      onOk: () => completeTransferMutation.mutate(record.id),
    })
  }

  // 处理删除
  const handleDelete = (record: TransferOrder) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除移库单"${record.transferNo}"吗？删除后不可恢复。`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  return (
    <div className="page-container">
      <ProTable<TransferOrder>
        headerTitle="移库管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 1600 }}
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
            onClick={() => navigate('/storage/transfer/new')}
          >
            新建移库单
          </Button>,
        ]}
        request={async (params) => {
          return await transferService.getTransferOrders({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            transferNo: params.transferNo,
            status: params.status,
            transferType: params.transferType,
            urgencyLevel: params.urgencyLevel,
          })
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      {/* 驳回原因Modal */}
      <Modal
        title="驳回移库单"
        open={rejectModalVisible}
        onOk={handleConfirmReject}
        onCancel={() => {
          setRejectModalVisible(false)
          setCurrentRecord(null)
          rejectForm.resetFields()
        }}
        confirmLoading={rejectMutation.isPending}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <p>移库单号：<strong>{currentRecord?.transferNo}</strong></p>
          <p>移库类型：{currentRecord && TRANSFER_TYPE_CONFIG[currentRecord.transferType]?.text}</p>
          <p>源仓库：{currentRecord?.sourceWarehouse?.warehouseName}</p>
          <p>目标仓库：{currentRecord?.targetWarehouse?.warehouseName}</p>
        </div>

        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="reason"
            label="驳回原因"
            rules={[
              { required: true, message: '请输入驳回原因' },
              { min: 5, message: '驳回原因至少5个字符' },
              { max: 200, message: '驳回原因不能超过200个字符' }
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请详细说明驳回原因，如：运输设备不可用、目标仓库空间不足、安全风险等"
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="驳回类别"
            rules={[{ required: true, message: '请选择驳回类别' }]}
          >
            <Space wrap>
              <Button
                type={rejectForm.getFieldValue('category') === '设备问题' ? 'primary' : 'default'}
                onClick={() => rejectForm.setFieldValue('category', '设备问题')}
              >
                设备问题
              </Button>
              <Button
                type={rejectForm.getFieldValue('category') === '空间不足' ? 'primary' : 'default'}
                onClick={() => rejectForm.setFieldValue('category', '空间不足')}
              >
                空间不足
              </Button>
              <Button
                type={rejectForm.getFieldValue('category') === '安全风险' ? 'primary' : 'default'}
                onClick={() => rejectForm.setFieldValue('category', '安全风险')}
              >
                安全风险
              </Button>
              <Button
                type={rejectForm.getFieldValue('category') === '时间冲突' ? 'primary' : 'default'}
                onClick={() => rejectForm.setFieldValue('category', '时间冲突')}
              >
                时间冲突
              </Button>
              <Button
                type={rejectForm.getFieldValue('category') === '其他' ? 'primary' : 'default'}
                onClick={() => rejectForm.setFieldValue('category', '其他')}
              >
                其他
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default StorageTransferList
