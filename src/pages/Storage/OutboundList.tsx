import React, { useRef, useState } from 'react'
import { Button, Tag, Space, message, Modal, Input, Form } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { getStatusConfig } from '@/utils'
import type { OutboundOrder } from '@/types'

const StorageOutboundList: React.FC = () => {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>()
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<OutboundOrder | null>(null)
  const [rejectForm] = Form.useForm()

  // 出库单服务API（模拟）
  const outboundService = {
    getOutboundOrders: async (params: any) => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟出库单数据
      const mockData: OutboundOrder[] = [
        {
          id: 1,
          outboundNo: 'OUT202508060002',
          warehouseId: 1,
          warehouse: { id: 1, warehouseName: '码头1号仓库', warehouseCode: 'WH001' } as any,
          actualOutboundDate: '2025-08-20T13:39:57',
          invoiceOutboundDate: '2025-08-20',
          status: 'UNDER_REVIEW',
          outboundType: 'NORMAL',
          warehouseKeeperId: 1,
          warehouseKeeper: { id: 1, name: '张三' } as any,
          isArchived: false,
          equipmentCode: 'EQ001',
          usageType: 'PRODUCTION',
          usageDepartmentId: 1,
          usageDepartment: { id: 1, departmentName: '生产部' } as any,
          recipientId: 1,
          recipient: { id: 1, name: '李四' } as any,
          periodMonth: '2025-08',
          remarks: '紧急出库',
          details: [],
          createdBy: 1,
          createdTime: '2025-08-20T10:00:00',
          version: 1
        },
        {
          id: 2,
          outboundNo: 'OUT202508060003',
          warehouseId: 2,
          warehouse: { id: 2, warehouseName: '码头2号仓库', warehouseCode: 'WH002' } as any,
          actualOutboundDate: '2025-08-19T15:20:30',
          invoiceOutboundDate: '2025-08-19',
          status: 'OUTBOUND_PROCESSING',
          outboundType: 'URGENT',
          warehouseKeeperId: 2,
          warehouseKeeper: { id: 2, name: '王五' } as any,
          isArchived: false,
          equipmentCode: 'EQ002',
          usageType: 'MAINTENANCE',
          usageDepartmentId: 2,
          usageDepartment: { id: 2, departmentName: '维修部' } as any,
          recipientId: 2,
          recipient: { id: 2, name: '赵六' } as any,
          periodMonth: '2025-08',
          remarks: '设备维修用料',
          details: [],
          createdBy: 1,
          createdTime: '2025-08-19T10:00:00',
          version: 1
        },
        {
          id: 3,
          outboundNo: 'OUT202508060004',
          warehouseId: 1,
          warehouse: { id: 1, warehouseName: '码头1号仓库', warehouseCode: 'WH001' } as any,
          actualOutboundDate: '2025-08-18T09:15:45',
          invoiceOutboundDate: '2025-08-18',
          status: 'APPROVED',
          outboundType: 'NORMAL',
          warehouseKeeperId: 1,
          warehouseKeeper: { id: 1, name: '张三' } as any,
          isArchived: false,
          equipmentCode: 'EQ003',
          usageType: 'OFFICE',
          usageDepartmentId: 3,
          usageDepartment: { id: 3, departmentName: '办公室' } as any,
          recipientId: 3,
          recipient: { id: 3, name: '孙七' } as any,
          periodMonth: '2025-08',
          remarks: '办公用品领用',
          details: [],
          createdBy: 1,
          createdTime: '2025-08-18T10:00:00',
          version: 1
        }
      ]

      // 简单的搜索过滤
      let filteredData = mockData
      if (params.outboundNo) {
        filteredData = filteredData.filter(item => 
          item.outboundNo.includes(params.outboundNo)
        )
      }
      if (params.status) {
        filteredData = filteredData.filter(item => 
          item.status === params.status
        )
      }
      if (params.outboundType) {
        filteredData = filteredData.filter(item => 
          item.outboundType === params.outboundType
        )
      }

      return {
        data: filteredData,
        success: true,
        total: filteredData.length,
      }
    },
    
    approveOutbound: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },
    
    rejectOutbound: async (id: number, reason: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`驳回出库单 ${id}，原因：${reason}`)
      return { success: true }
    }
  }

  // 审核通过
  const approveMutation = useMutation({
    mutationFn: outboundService.approveOutbound,
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
      outboundService.rejectOutbound(id, reason),
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

  // 表格列配置
  const columns: ProColumns<OutboundOrder>[] = [
    {
      title: '出库单号',
      dataIndex: 'outboundNo',
      key: 'outboundNo',
      width: 150,
      copyable: true,
      fixed: 'left',
    },
    {
      title: '仓库',
      dataIndex: ['warehouse', 'warehouseName'],
      key: 'warehouseId',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '出库类型',
      dataIndex: 'outboundType',
      key: 'outboundType',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'NORMAL': { text: '正常出库' },
        'URGENT': { text: '紧急出库' },
        'TRANSFER': { text: '移库出库' },
        'RETURN': { text: '退库出库' },
      },
      render: (_, record) => {
        const config = outboundTypeConfig[record.outboundType]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '出库状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'OUTBOUND_PROCESSING': { text: '出库中' },
        'UNDER_REVIEW': { text: '审核中' },
        'APPROVED': { text: '已审核' },
        'REJECTED': { text: '已驳回' },
        'COMPLETED': { text: '已完成' },
      },
      render: (_, record) => {
        const config = statusConfig[record.status]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '仓库管理员',
      dataIndex: ['warehouseKeeper', 'name'],
      key: 'warehouseKeeperId',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '领用部门',
      dataIndex: ['usageDepartment', 'departmentName'],
      key: 'usageDepartmentId',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '领用人',
      dataIndex: ['recipient', 'name'],
      key: 'recipientId',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '出库日期',
      dataIndex: 'actualOutboundDate',
      key: 'actualOutboundDate',
      width: 150,
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 250,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="detail"
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/storage/outbound/${record.id}`)}
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
        ['OUTBOUND_PROCESSING', 'UNDER_REVIEW'].includes(record.status) && (
          <Button
            key="edit"
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/storage/outbound/edit/${record.id}`)}
          >
            修改
          </Button>
        ),
      ].filter(Boolean),
    },
  ]

  // 处理审核通过
  const handleApprove = (record: OutboundOrder) => {
    Modal.confirm({
      title: '确认审核',
      content: `确定要审核通过出库单"${record.outboundNo}"吗？`,
      onOk: () => approveMutation.mutate(record.id),
    })
  }

  // 处理审核驳回
  const handleReject = (record: OutboundOrder) => {
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

  return (
    <div className="page-container">
      <ProTable<OutboundOrder>
        headerTitle="出库管理"
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
            onClick={() => navigate('/storage/outbound/new')}
          >
            新建出库单
          </Button>,
        ]}
        request={async (params) => {
          return await outboundService.getOutboundOrders({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            outboundNo: params.outboundNo,
            status: params.status,
            outboundType: params.outboundType,
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
        title="驳回出库单"
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
          <p>出库单号：<strong>{currentRecord?.outboundNo}</strong></p>
          <p>仓库：{currentRecord?.warehouse?.warehouseName}</p>
          <p>领用部门：{currentRecord?.usageDepartment?.departmentName}</p>
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
              placeholder="请详细说明驳回原因，如：物资库存不足、申请信息不完整、审批流程不符合规定等"
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
                type={rejectForm.getFieldValue('category') === '库存不足' ? 'primary' : 'default'}
                onClick={() => rejectForm.setFieldValue('category', '库存不足')}
              >
                库存不足
              </Button>
              <Button
                type={rejectForm.getFieldValue('category') === '信息错误' ? 'primary' : 'default'}
                onClick={() => rejectForm.setFieldValue('category', '信息错误')}
              >
                信息错误
              </Button>
              <Button
                type={rejectForm.getFieldValue('category') === '流程不符' ? 'primary' : 'default'}
                onClick={() => rejectForm.setFieldValue('category', '流程不符')}
              >
                流程不符
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

export default StorageOutboundList
