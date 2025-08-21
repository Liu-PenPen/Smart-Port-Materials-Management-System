import React, { useRef, useState } from 'react'
import { Button, Tag, Space, message, Modal, Input, Form } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ImportOutlined,
  LockOutlined
} from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { formatMoney, formatDateTime, getCurrentPeriod } from '@/utils'
import type { InboundOrder } from '@/types'

const StorageInboundList: React.FC = () => {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>()
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<InboundOrder | null>(null)
  const [rejectForm] = Form.useForm()

  // 入库单服务API（模拟）
  const inboundService = {
    getInboundOrders: async (params: any) => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))

      // 模拟入库单数据
      const mockData: InboundOrder[] = [
        {
          id: 1,
          inboundNo: 'IN202508060001',
          warehouseId: 1,
          warehouse: { id: 1, warehouseName: '码头1号仓库', warehouseCode: 'WH001' } as any,
          supplierId: 1,
          supplier: { id: 1, supplierName: '北京港口设备有限公司', supplierCode: 'SUP001' } as any,
          purchaseOrderId: 1,
          actualInboundDate: '2025-08-20T14:30:00',
          invoiceInboundDate: '2025-08-20',
          invoiceNo: 'INV202508001',
          invoiceDate: '2025-08-20',
          invoiceAmount: 15000.00,
          status: 'UNDER_REVIEW',
          warehouseKeeperId: 1,
          warehouseKeeper: { id: 1, name: '张三' } as any,
          isArchived: false,
          periodMonth: '2025-08',
          remarks: '港口设备维修物资入库',
          details: [
            {
              id: 1,
              inboundOrderId: 1,
              materialId: 1,
              materialCode: 'MAT001',
              materialName: '钢丝绳',
              specification: '直径20mm 长度100m',
              quantity: 5,
              unitPrice: 1500.00,
              amount: 7500.00,
              storageArea: 'A区-01',
              createdBy: 1,
              createdTime: '2025-08-20T14:30:00',
              version: 1
            }
          ],
          createdBy: 1,
          createdTime: '2025-08-20T10:00:00',
          version: 1
        },
        {
          id: 2,
          inboundNo: 'IN202508060002',
          warehouseId: 2,
          warehouse: { id: 2, warehouseName: '码头2号仓库', warehouseCode: 'WH002' } as any,
          supplierId: 2,
          supplier: { id: 2, supplierName: '上海海运物资公司', supplierCode: 'SUP002' } as any,
          purchaseOrderId: 2,
          actualInboundDate: '2025-08-19T16:45:00',
          invoiceInboundDate: undefined, // 发票未到
          invoiceNo: undefined,
          invoiceDate: undefined,
          invoiceAmount: 0, // 0元入库
          status: 'PENDING',
          warehouseKeeperId: 2,
          warehouseKeeper: { id: 2, name: '李四' } as any,
          isArchived: false,
          periodMonth: '2025-08',
          remarks: '发票未到，先行入库',
          details: [
            {
              id: 2,
              inboundOrderId: 2,
              materialId: 2,
              materialCode: 'MAT002',
              materialName: '液压油',
              specification: '46号抗磨液压油 200L',
              quantity: 10,
              unitPrice: 0, // 0元入库
              amount: 0,
              storageArea: 'B区-05',
              createdBy: 1,
              createdTime: '2025-08-19T16:45:00',
              version: 1
            }
          ],
          createdBy: 1,
          createdTime: '2025-08-19T10:00:00',
          version: 1
        },
        {
          id: 3,
          inboundNo: 'IN202508060003',
          warehouseId: 1,
          warehouse: { id: 1, warehouseName: '码头1号仓库', warehouseCode: 'WH001' } as any,
          supplierId: 3,
          supplier: { id: 3, supplierName: '青岛港务机械厂', supplierCode: 'SUP003' } as any,
          purchaseOrderId: 3,
          actualInboundDate: '2025-08-18T11:20:00',
          invoiceInboundDate: '2025-08-18',
          invoiceNo: 'INV202508003',
          invoiceDate: '2025-08-18',
          invoiceAmount: 8500.00,
          status: 'APPROVED',
          warehouseKeeperId: 1,
          warehouseKeeper: { id: 1, name: '张三' } as any,
          isArchived: false,
          periodMonth: '2025-08',
          remarks: '起重机配件入库',
          details: [],
          createdBy: 1,
          createdTime: '2025-08-18T10:00:00',
          version: 1
        }
      ]

      // 简单的搜索过滤
      let filteredData = mockData
      if (params.inboundNo) {
        filteredData = filteredData.filter(item =>
          item.inboundNo.includes(params.inboundNo)
        )
      }
      if (params.status) {
        filteredData = filteredData.filter(item =>
          item.status === params.status
        )
      }
      if (params.supplierId) {
        filteredData = filteredData.filter(item =>
          item.supplierId === params.supplierId
        )
      }

      return {
        data: filteredData,
        success: true,
        total: filteredData.length,
      }
    },

    approveInbound: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    rejectInbound: async (id: number, reason: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`驳回入库单 ${id}，原因：${reason}`)
      return { success: true }
    },

    deleteInbound: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    checkPeriodLock: async (periodMonth: string) => {
      // 模拟检查期间锁定
      await new Promise(resolve => setTimeout(resolve, 300))
      // 假设2025-07及之前的月份已锁定
      const lockedPeriods = ['2025-07', '2025-06', '2025-05']
      return { isLocked: lockedPeriods.includes(periodMonth) }
    }
  }

  // 审核通过
  const approveMutation = useMutation({
    mutationFn: inboundService.approveInbound,
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
      inboundService.rejectInbound(id, reason),
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

  // 删除入库单
  const deleteMutation = useMutation({
    mutationFn: inboundService.deleteInbound,
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('删除失败')
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

  // 表格列配置
  const columns: ProColumns<InboundOrder>[] = [
    {
      title: '入库单号',
      dataIndex: 'inboundNo',
      key: 'inboundNo',
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
      title: '供应商',
      dataIndex: ['supplier', 'supplierName'],
      key: 'supplierId',
      width: 150,
      valueType: 'select',
      request: async () => [
        { label: '北京港口设备有限公司', value: 1 },
        { label: '上海海运物资公司', value: 2 },
        { label: '青岛港务机械厂', value: 3 },
      ],
    },
    {
      title: '入库状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'PENDING': { text: '待处理' },
        'UNDER_REVIEW': { text: '审核中' },
        'APPROVED': { text: '已审核' },
        'REJECTED': { text: '已驳回' },
        'CONFIRMED': { text: '已确认' },
        'ARCHIVED': { text: '已归档' },
      },
      render: (_, record) => {
        const config = statusConfig[record.status]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '入库金额',
      dataIndex: 'invoiceAmount',
      key: 'invoiceAmount',
      width: 120,
      hideInSearch: true,
      render: (value: number) => {
        if (value === 0) {
          return <Tag color="orange">0元入库</Tag>
        }
        return `¥${formatMoney(value)}`
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
      title: '入库日期',
      dataIndex: 'actualInboundDate',
      key: 'actualInboundDate',
      width: 150,
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: '期间',
      dataIndex: 'periodMonth',
      key: 'periodMonth',
      width: 100,
      hideInSearch: true,
      render: (value: string, record) => {
        const currentPeriod = getCurrentPeriod()
        const isLocked = value < currentPeriod // 简单判断是否锁定
        return (
          <Space>
            <span>{value}</span>
            {isLocked && <LockOutlined style={{ color: '#ff4d4f' }} title="期间已锁定" />}
          </Space>
        )
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 250,
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
            onClick={() => navigate(`/storage/inbound/${record.id}`)}
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
          ['PENDING', 'UNDER_REVIEW', 'REJECTED'].includes(record.status) && !isPeriodLocked && (
            <Button
              key="edit"
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/storage/inbound/edit/${record.id}`)}
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
          isPeriodLocked && (
            <Tag key="locked" color="red" icon={<LockOutlined />}>
              已锁定
            </Tag>
          ),
        ].filter(Boolean)
      },
    },
  ]

  // 处理审核通过
  const handleApprove = (record: InboundOrder) => {
    Modal.confirm({
      title: '确认审核',
      content: `确定要审核通过入库单"${record.inboundNo}"吗？`,
      onOk: () => approveMutation.mutate(record.id),
    })
  }

  // 处理审核驳回
  const handleReject = (record: InboundOrder) => {
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

  // 处理删除
  const handleDelete = (record: InboundOrder) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除入库单"${record.inboundNo}"吗？删除后不可恢复。`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  return (
    <div className="page-container">
      <ProTable<InboundOrder>
        headerTitle="入库管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 1400 }}
        toolBarRender={() => [
          <Button
            key="import"
            icon={<ImportOutlined />}
            onClick={() => message.info('导入功能开发中')}
          >
            导入
          </Button>,
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
            onClick={() => navigate('/storage/inbound/new')}
          >
            新建入库单
          </Button>,
        ]}
        request={async (params) => {
          return await inboundService.getInboundOrders({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            inboundNo: params.inboundNo,
            status: params.status,
            supplierId: params.supplierId,
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
        title="驳回入库单"
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
          <p>入库单号：<strong>{currentRecord?.inboundNo}</strong></p>
          <p>仓库：{currentRecord?.warehouse?.warehouseName}</p>
          <p>供应商：{currentRecord?.supplier?.supplierName}</p>
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
              placeholder="请详细说明驳回原因，如：物资质量不合格、数量不符、单据信息错误等"
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
                type={rejectForm.getFieldValue('category') === '质量问题' ? 'primary' : 'default'}
                onClick={() => rejectForm.setFieldValue('category', '质量问题')}
              >
                质量问题
              </Button>
              <Button
                type={rejectForm.getFieldValue('category') === '数量不符' ? 'primary' : 'default'}
                onClick={() => rejectForm.setFieldValue('category', '数量不符')}
              >
                数量不符
              </Button>
              <Button
                type={rejectForm.getFieldValue('category') === '单据错误' ? 'primary' : 'default'}
                onClick={() => rejectForm.setFieldValue('category', '单据错误')}
              >
                单据错误
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

export default StorageInboundList
