import React, { useRef, useState } from 'react'
import { Button, Tag, Space, message, Modal, Progress, Tooltip, Select } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  TruckOutlined
} from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { formatMoney, formatDate, getCurrentPeriod } from '@/utils'
import { PURCHASE_TYPE_CONFIG, PURCHASE_STATUS_CONFIG } from '@/constants'
import type { MaterialPurchase } from '@/types'

const { Option } = Select

const MaterialPurchaseList: React.FC = () => {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>()

  // 物资采购服务API（模拟）
  const purchaseService = {
    getPurchases: async (params: any) => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟物资采购数据
      const mockData: MaterialPurchase[] = [
        {
          id: 1,
          purchaseNo: 'PO202508200001',
          purchaseDate: '2025-08-20',
          purchaseType: 'URGENT',
          preparerId: 1,
          preparer: { id: 1, name: '采购员张三', phone: '13800138001' } as any,
          totalAmount: 125000,
          status: 'APPROVED',
          approvalStatus: 'APPROVED',
          approvedBy: 2,
          approver: { id: 2, name: '采购部长' } as any,
          approvedTime: '2025-08-20T14:30:00',
          supplierId: 1,
          supplier: { 
            id: 1, 
            supplierName: '中远海运港口设备有限公司',
            supplierCode: 'SUP001'
          } as any,
          contractNo: 'CT202508200001',
          deliveryDate: '2025-08-30',
          paymentTerms: '货到付款',
          remarks: '港口起重机维修急需配件采购',
          details: [
            {
              id: 1,
              purchaseId: 1,
              materialId: 1,
              materialCode: 'MAT001',
              materialName: '钢丝绳',
              specification: '直径20mm 长度100m',
              unit: '根',
              quantity: 5,
              unitPrice: 1500,
              amount: 7500,
              supplierId: 1,
              quotationPrice: 1600
            } as any
          ],
          requestIds: [1, 2],
          createdBy: 1,
          createdTime: '2025-08-20T09:00:00',
          version: 1
        },
        {
          id: 2,
          purchaseNo: 'PO202508200002',
          purchaseDate: '2025-08-20',
          purchaseType: 'NORMAL',
          preparerId: 2,
          preparer: { id: 2, name: '采购员李四', phone: '13800138002' } as any,
          totalAmount: 85000,
          status: 'SUBMITTED',
          approvalStatus: 'PENDING',
          supplierId: 2,
          supplier: { 
            id: 2, 
            supplierName: '上海振华重工股份有限公司',
            supplierCode: 'SUP002'
          } as any,
          deliveryDate: '2025-09-05',
          paymentTerms: '30天账期',
          remarks: '定期维护用品采购',
          details: [],
          requestIds: [3],
          createdBy: 2,
          createdTime: '2025-08-20T10:00:00',
          version: 1
        },
        {
          id: 3,
          purchaseNo: 'PO202508190001',
          purchaseDate: '2025-08-19',
          purchaseType: 'CENTRALIZED',
          preparerId: 1,
          preparer: { id: 1, name: '采购员张三', phone: '13800138001' } as any,
          totalAmount: 250000,
          status: 'ORDERED',
          approvalStatus: 'APPROVED',
          approvedBy: 2,
          approver: { id: 2, name: '采购部长' } as any,
          approvedTime: '2025-08-19T16:00:00',
          supplierId: 3,
          supplier: { 
            id: 3, 
            supplierName: '青岛港务机械制造有限公司',
            supplierCode: 'SUP003'
          } as any,
          contractNo: 'CT202508190001',
          deliveryDate: '2025-09-15',
          paymentTerms: '预付30%，货到付70%',
          remarks: '集中采购计划',
          details: [],
          requestIds: [4, 5, 6],
          createdBy: 1,
          createdTime: '2025-08-19T09:00:00',
          version: 1
        }
      ]

      // 简单的搜索过滤
      let filteredData = mockData
      if (params.purchaseNo) {
        filteredData = filteredData.filter(item => 
          item.purchaseNo.includes(params.purchaseNo)
        )
      }
      if (params.status) {
        filteredData = filteredData.filter(item => 
          item.status === params.status
        )
      }
      if (params.purchaseType) {
        filteredData = filteredData.filter(item => 
          item.purchaseType === params.purchaseType
        )
      }

      return {
        data: filteredData,
        success: true,
        total: filteredData.length,
      }
    },
    
    approvePurchase: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    rejectPurchase: async (id: number, reason: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    orderPurchase: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    deletePurchase: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    }
  }

  // 批准采购
  const approveMutation = useMutation({
    mutationFn: purchaseService.approvePurchase,
    onSuccess: () => {
      message.success('批准成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('批准失败')
    },
  })

  // 驳回采购
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      purchaseService.rejectPurchase(id, reason),
    onSuccess: () => {
      message.success('驳回成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('驳回失败')
    },
  })

  // 下单采购
  const orderMutation = useMutation({
    mutationFn: purchaseService.orderPurchase,
    onSuccess: () => {
      message.success('下单成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('下单失败')
    },
  })

  // 删除采购
  const deleteMutation = useMutation({
    mutationFn: purchaseService.deletePurchase,
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('删除失败')
    },
  })

  // 表格列配置
  const columns: ProColumns<MaterialPurchase>[] = [
    {
      title: '采购单号',
      dataIndex: 'purchaseNo',
      key: 'purchaseNo',
      width: 150,
      copyable: true,
      fixed: 'left',
    },
    {
      title: '采购类型',
      dataIndex: 'purchaseType',
      key: 'purchaseType',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'NORMAL': { text: '常规采购' },
        'URGENT': { text: '紧急采购' },
        'CENTRALIZED': { text: '集中采购' },
        'SPECIAL': { text: '专项采购' },
      },
      render: (_, record) => {
        const config = PURCHASE_TYPE_CONFIG[record.purchaseType]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '采购日期',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      width: 120,
      hideInSearch: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: '编制人',
      dataIndex: ['preparer', 'name'],
      key: 'preparerId',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '供应商',
      dataIndex: ['supplier', 'supplierName'],
      key: 'supplierId',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '采购金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      hideInSearch: true,
      render: (value: number) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          ¥{formatMoney(value)}
        </span>
      ),
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
        'ORDERED': { text: '已下单' },
        'COMPLETED': { text: '已完成' },
      },
      render: (_, record) => {
        const config = PURCHASE_STATUS_CONFIG[record.status]
        const icon = record.status === 'SUBMITTED' ? <ClockCircleOutlined /> :
                    record.status === 'APPROVED' ? <CheckOutlined /> :
                    record.status === 'REJECTED' ? <CloseOutlined /> :
                    record.status === 'ORDERED' ? <TruckOutlined /> :
                    record.status === 'COMPLETED' ? <CheckOutlined /> : undefined
        return <Tag color={config.color} icon={icon}>{config.text}</Tag>
      },
    },
    {
      title: '合同号',
      dataIndex: 'contractNo',
      key: 'contractNo',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '交货日期',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: 120,
      hideInSearch: true,
      render: (value: string) => value ? formatDate(value) : '-',
    },
    {
      title: '付款条件',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
      width: 120,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 120,
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
          onClick={() => navigate(`/cargo/material-purchase/${record.id}`)}
        >
          详情
        </Button>,
        record.status === 'DRAFT' && (
          <Button
            key="edit"
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/cargo/material-purchase/edit/${record.id}`)}
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
        record.status === 'APPROVED' && (
          <Button
            key="order"
            type="link"
            size="small"
            icon={<ShoppingCartOutlined />}
            onClick={() => handleOrder(record)}
            loading={orderMutation.isPending}
          >
            下单
          </Button>
        ),
        record.status === 'DRAFT' && (
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
      ].filter(Boolean),
    },
  ]

  // 处理批准
  const handleApprove = (record: MaterialPurchase) => {
    Modal.confirm({
      title: '批准采购',
      content: `确定要批准采购单"${record.purchaseNo}"吗？`,
      onOk: () => approveMutation.mutate(record.id),
    })
  }

  // 处理驳回
  const handleReject = (record: MaterialPurchase) => {
    let reason = ''
    Modal.confirm({
      title: '驳回采购',
      content: (
        <div>
          <p>确定要驳回采购单"{record.purchaseNo}"吗？</p>
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

  // 处理下单
  const handleOrder = (record: MaterialPurchase) => {
    Modal.confirm({
      title: '确认下单',
      content: `确定要向供应商"${record.supplier?.supplierName}"下单吗？下单后将进入采购执行阶段。`,
      onOk: () => orderMutation.mutate(record.id),
    })
  }

  // 处理删除
  const handleDelete = (record: MaterialPurchase) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除采购单"${record.purchaseNo}"吗？删除后不可恢复。`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  return (
    <div className="page-container">
      <ProTable<MaterialPurchase>
        headerTitle="物资采购管理"
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
            onClick={() => navigate('/cargo/material-purchase/new')}
          >
            新建采购
          </Button>,
        ]}
        request={async (params) => {
          return await purchaseService.getPurchases({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            purchaseNo: params.purchaseNo,
            status: params.status,
            purchaseType: params.purchaseType,
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

export default MaterialPurchaseList
