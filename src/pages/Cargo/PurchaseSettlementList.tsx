import React, { useRef, useState } from 'react'
import { Button, Tag, Space, message, Modal, Progress, Tooltip, InputNumber, Input } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExportOutlined,
  EyeOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  BankOutlined,
  PayCircleOutlined
} from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { formatMoney, formatDate } from '@/utils'
import { SETTLEMENT_STATUS_CONFIG } from '@/constants'
import type { PurchaseSettlement } from '@/types'

const { TextArea } = Input

const PurchaseSettlementList: React.FC = () => {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>()
  const [paymentModalVisible, setPaymentModalVisible] = useState(false)
  const [currentSettlement, setCurrentSettlement] = useState<PurchaseSettlement | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentRemarks, setPaymentRemarks] = useState<string>('')

  // 采购结算服务API（模拟）
  const settlementService = {
    getSettlements: async (params: any) => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟采购结算数据
      const mockData: PurchaseSettlement[] = [
        {
          id: 1,
          settlementNo: 'ST202508200001',
          purchaseId: 1,
          purchase: {
            id: 1,
            purchaseNo: 'PO202508200001',
            supplier: {
              id: 1,
              supplierName: '中远海运港口设备有限公司',
              supplierCode: 'SUP001'
            }
          } as any,
          settlementDate: '2025-08-20',
          totalAmount: 125000,
          paidAmount: 37500,
          remainingAmount: 87500,
          status: 'PARTIAL',
          paymentMethod: 'TRANSFER',
          invoiceNo: 'INV202508200001',
          invoiceDate: '2025-08-20',
          invoiceAmount: 125000,
          remarks: '预付30%，剩余货到付款',
          attachments: ['contract.pdf', 'invoice.pdf'],
          createdBy: 1,
          createdTime: '2025-08-20T10:00:00',
          version: 1
        },
        {
          id: 2,
          settlementNo: 'ST202508200002',
          purchaseId: 2,
          purchase: {
            id: 2,
            purchaseNo: 'PO202508200002',
            supplier: {
              id: 2,
              supplierName: '上海振华重工股份有限公司',
              supplierCode: 'SUP002'
            }
          } as any,
          settlementDate: '2025-08-21',
          totalAmount: 85000,
          paidAmount: 0,
          remainingAmount: 85000,
          status: 'PENDING',
          paymentMethod: 'TRANSFER',
          invoiceNo: 'INV202508210001',
          invoiceDate: '2025-08-21',
          invoiceAmount: 85000,
          remarks: '30天账期付款',
          attachments: ['invoice.pdf'],
          createdBy: 2,
          createdTime: '2025-08-21T09:00:00',
          version: 1
        },
        {
          id: 3,
          settlementNo: 'ST202508190001',
          purchaseId: 3,
          purchase: {
            id: 3,
            purchaseNo: 'PO202508190001',
            supplier: {
              id: 3,
              supplierName: '青岛港务机械制造有限公司',
              supplierCode: 'SUP003'
            }
          } as any,
          settlementDate: '2025-08-19',
          totalAmount: 250000,
          paidAmount: 250000,
          remainingAmount: 0,
          status: 'COMPLETED',
          paymentMethod: 'TRANSFER',
          invoiceNo: 'INV202508190001',
          invoiceDate: '2025-08-19',
          invoiceAmount: 250000,
          remarks: '已全额付款',
          attachments: ['contract.pdf', 'invoice.pdf', 'payment_receipt.pdf'],
          createdBy: 1,
          createdTime: '2025-08-19T14:00:00',
          version: 1
        }
      ]

      // 简单的搜索过滤
      let filteredData = mockData
      if (params.settlementNo) {
        filteredData = filteredData.filter(item => 
          item.settlementNo.includes(params.settlementNo)
        )
      }
      if (params.status) {
        filteredData = filteredData.filter(item => 
          item.status === params.status
        )
      }
      if (params.purchaseNo) {
        filteredData = filteredData.filter(item => 
          item.purchase?.purchaseNo.includes(params.purchaseNo)
        )
      }

      return {
        data: filteredData,
        success: true,
        total: filteredData.length,
      }
    },
    
    makePayment: async (id: number, amount: number, remarks: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    completeSettlement: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    deleteSettlement: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    }
  }

  // 付款操作
  const paymentMutation = useMutation({
    mutationFn: ({ id, amount, remarks }: { id: number; amount: number; remarks: string }) =>
      settlementService.makePayment(id, amount, remarks),
    onSuccess: () => {
      message.success('付款成功')
      setPaymentModalVisible(false)
      setCurrentSettlement(null)
      setPaymentAmount(0)
      setPaymentRemarks('')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('付款失败')
    },
  })

  // 完成结算
  const completeMutation = useMutation({
    mutationFn: settlementService.completeSettlement,
    onSuccess: () => {
      message.success('结算完成')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('操作失败')
    },
  })

  // 删除结算
  const deleteMutation = useMutation({
    mutationFn: settlementService.deleteSettlement,
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('删除失败')
    },
  })

  // 表格列配置
  const columns: ProColumns<PurchaseSettlement>[] = [
    {
      title: '结算单号',
      dataIndex: 'settlementNo',
      key: 'settlementNo',
      width: 150,
      copyable: true,
      fixed: 'left',
    },
    {
      title: '采购单号',
      dataIndex: ['purchase', 'purchaseNo'],
      key: 'purchaseNo',
      width: 150,
      copyable: true,
    },
    {
      title: '供应商',
      dataIndex: ['purchase', 'supplier', 'supplierName'],
      key: 'supplierName',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '结算日期',
      dataIndex: 'settlementDate',
      key: 'settlementDate',
      width: 120,
      hideInSearch: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: '结算金额',
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
      title: '已付金额',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      width: 120,
      hideInSearch: true,
      render: (value: number) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ¥{formatMoney(value)}
        </span>
      ),
    },
    {
      title: '剩余金额',
      dataIndex: 'remainingAmount',
      key: 'remainingAmount',
      width: 120,
      hideInSearch: true,
      render: (value: number) => (
        <span style={{ 
          fontWeight: 'bold', 
          color: value > 0 ? '#ff4d4f' : '#52c41a' 
        }}>
          ¥{formatMoney(value)}
        </span>
      ),
    },
    {
      title: '付款进度',
      key: 'paymentProgress',
      width: 120,
      hideInSearch: true,
      render: (_, record) => {
        const percentage = record.totalAmount > 0 
          ? Math.round((record.paidAmount / record.totalAmount) * 100) 
          : 0
        return (
          <Progress
            percent={percentage}
            size="small"
            strokeColor={percentage === 100 ? '#52c41a' : '#1890ff'}
            format={(percent) => `${percent}%`}
          />
        )
      },
    },
    {
      title: '结算状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'PENDING': { text: '待结算' },
        'PARTIAL': { text: '部分结算' },
        'COMPLETED': { text: '已完成' },
      },
      render: (_, record) => {
        const config = SETTLEMENT_STATUS_CONFIG[record.status]
        const icon = record.status === 'PENDING' ? <ClockCircleOutlined /> :
                    record.status === 'PARTIAL' ? <PayCircleOutlined /> :
                    record.status === 'COMPLETED' ? <CheckOutlined /> : undefined
        return <Tag color={config.color} icon={icon}>{config.text}</Tag>
      },
    },
    {
      title: '付款方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      hideInSearch: true,
      render: (value: string) => {
        const methodConfig = {
          'CASH': { icon: <DollarOutlined />, text: '现金', color: 'green' },
          'TRANSFER': { icon: <BankOutlined />, text: '转账', color: 'blue' },
          'CHECK': { icon: <FileTextOutlined />, text: '支票', color: 'orange' },
          'CREDIT': { icon: <CreditCardOutlined />, text: '信用', color: 'purple' },
        }
        const config = methodConfig[value as keyof typeof methodConfig]
        return config ? (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        ) : value
      },
    },
    {
      title: '发票号',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '发票日期',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      width: 120,
      hideInSearch: true,
      render: (value: string) => value ? formatDate(value) : '-',
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
          onClick={() => navigate(`/cargo/purchase-settlement/${record.id}`)}
        >
          详情
        </Button>,
        record.status !== 'COMPLETED' && (
          <Button
            key="payment"
            type="link"
            size="small"
            icon={<DollarOutlined />}
            onClick={() => handlePayment(record)}
          >
            付款
          </Button>
        ),
        record.status === 'PARTIAL' && record.remainingAmount === 0 && (
          <Button
            key="complete"
            type="link"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => handleComplete(record)}
            loading={completeMutation.isPending}
          >
            完成结算
          </Button>
        ),
        record.status === 'PENDING' && record.paidAmount === 0 && (
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

  // 处理付款
  const handlePayment = (record: PurchaseSettlement) => {
    setCurrentSettlement(record)
    setPaymentAmount(record.remainingAmount)
    setPaymentRemarks('')
    setPaymentModalVisible(true)
  }

  // 处理完成结算
  const handleComplete = (record: PurchaseSettlement) => {
    Modal.confirm({
      title: '完成结算',
      content: `确定要完成结算单"${record.settlementNo}"吗？完成后将无法再次修改。`,
      onOk: () => completeMutation.mutate(record.id),
    })
  }

  // 处理删除
  const handleDelete = (record: PurchaseSettlement) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除结算单"${record.settlementNo}"吗？删除后不可恢复。`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  // 确认付款
  const handleConfirmPayment = () => {
    if (!currentSettlement) return
    
    if (paymentAmount <= 0) {
      message.error('付款金额必须大于0')
      return
    }
    
    if (paymentAmount > currentSettlement.remainingAmount) {
      message.error('付款金额不能超过剩余金额')
      return
    }

    paymentMutation.mutate({
      id: currentSettlement.id,
      amount: paymentAmount,
      remarks: paymentRemarks
    })
  }

  return (
    <div className="page-container">
      <ProTable<PurchaseSettlement>
        headerTitle="物资采购结算"
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
            onClick={() => navigate('/cargo/purchase-settlement/new')}
          >
            新建结算
          </Button>,
        ]}
        request={async (params) => {
          return await settlementService.getSettlements({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            settlementNo: params.settlementNo,
            status: params.status,
            purchaseNo: params.purchaseNo,
          })
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      {/* 付款Modal */}
      <Modal
        title="付款操作"
        open={paymentModalVisible}
        onOk={handleConfirmPayment}
        onCancel={() => {
          setPaymentModalVisible(false)
          setCurrentSettlement(null)
          setPaymentAmount(0)
          setPaymentRemarks('')
        }}
        confirmLoading={paymentMutation.isPending}
        width={500}
      >
        {currentSettlement && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <p><strong>结算单号：</strong>{currentSettlement.settlementNo}</p>
              <p><strong>供应商：</strong>{currentSettlement.purchase?.supplier?.supplierName}</p>
              <p><strong>结算总额：</strong>¥{formatMoney(currentSettlement.totalAmount)}</p>
              <p><strong>已付金额：</strong>¥{formatMoney(currentSettlement.paidAmount)}</p>
              <p><strong>剩余金额：</strong>¥{formatMoney(currentSettlement.remainingAmount)}</p>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>
                <strong>付款金额：</strong>
              </label>
              <InputNumber
                style={{ width: '100%' }}
                value={paymentAmount}
                onChange={(value) => setPaymentAmount(value || 0)}
                min={0}
                max={currentSettlement.remainingAmount}
                precision={2}
                formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\¥\s?|(,*)/g, '')}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>
                <strong>付款备注：</strong>
              </label>
              <TextArea
                value={paymentRemarks}
                onChange={(e) => setPaymentRemarks(e.target.value)}
                rows={3}
                placeholder="请输入付款备注"
                maxLength={200}
                showCount
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PurchaseSettlementList
