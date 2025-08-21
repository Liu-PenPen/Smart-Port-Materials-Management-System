import React, { useRef, useState } from 'react'
import { Button, Tag, Space, message, Modal, Progress, Tooltip, InputNumber, Input, Form } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  TruckOutlined,
  InboxOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { formatMoney, formatDate } from '@/utils'
import { ARRIVAL_STATUS_CONFIG, QUALITY_STATUS_CONFIG } from '@/constants'
import type { ArrivalManagement } from '@/types'

const { TextArea } = Input

const ArrivalManagementList: React.FC = () => {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>()
  const [inspectionModalVisible, setInspectionModalVisible] = useState(false)
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false)
  const [currentArrival, setCurrentArrival] = useState<ArrivalManagement | null>(null)
  const [inspectionForm] = Form.useForm()
  const [invoiceForm] = Form.useForm()

  // 到货管理服务API（模拟）
  const arrivalService = {
    getArrivals: async (params: any) => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟到货管理数据
      const mockData: ArrivalManagement[] = [
        {
          id: 1,
          arrivalNo: 'AR202508200001',
          purchaseId: 1,
          purchase: {
            id: 1,
            purchaseNo: 'PO202508200001',
            totalAmount: 125000
          } as any,
          arrivalDate: '2025-08-20',
          supplierId: 1,
          supplier: {
            id: 1,
            supplierName: '中远海运港口设备有限公司',
            supplierCode: 'SUP001'
          } as any,
          receiverId: 1,
          receiver: { id: 1, name: '仓管员张三', phone: '13800138001' } as any,
          status: 'ACCEPTED',
          totalQuantity: 15,
          acceptedQuantity: 15,
          rejectedQuantity: 0,
          qualityStatus: 'QUALIFIED',
          invoiceNo: 'INV202508200001',
          invoiceDate: '2025-08-20',
          invoiceAmount: 125000,
          actualAmount: 125000,
          amountDifference: 0,
          remarks: '货物质量良好，全部验收通过',
          details: [],
          createdBy: 1,
          createdTime: '2025-08-20T14:00:00',
          version: 1
        },
        {
          id: 2,
          arrivalNo: 'AR202508210001',
          purchaseId: 2,
          purchase: {
            id: 2,
            purchaseNo: 'PO202508200002',
            totalAmount: 85000
          } as any,
          arrivalDate: '2025-08-21',
          supplierId: 2,
          supplier: {
            id: 2,
            supplierName: '上海振华重工股份有限公司',
            supplierCode: 'SUP002'
          } as any,
          receiverId: 2,
          receiver: { id: 2, name: '仓管员李四', phone: '13800138002' } as any,
          status: 'INSPECTED',
          totalQuantity: 20,
          acceptedQuantity: 18,
          rejectedQuantity: 2,
          qualityStatus: 'PARTIAL',
          invoiceNo: undefined,
          invoiceDate: undefined,
          invoiceAmount: undefined,
          actualAmount: 0,
          amountDifference: undefined,
          differenceReason: undefined,
          remarks: '部分货物质量不符合要求，已拒收2件',
          details: [],
          createdBy: 2,
          createdTime: '2025-08-21T10:00:00',
          version: 1
        },
        {
          id: 3,
          arrivalNo: 'AR202508220001',
          purchaseId: 3,
          purchase: {
            id: 3,
            purchaseNo: 'PO202508190001',
            totalAmount: 250000
          } as any,
          arrivalDate: '2025-08-22',
          supplierId: 3,
          supplier: {
            id: 3,
            supplierName: '青岛港务机械制造有限公司',
            supplierCode: 'SUP003'
          } as any,
          receiverId: 1,
          receiver: { id: 1, name: '仓管员张三', phone: '13800138001' } as any,
          status: 'ARRIVED',
          totalQuantity: 50,
          acceptedQuantity: 0,
          rejectedQuantity: 0,
          qualityStatus: 'QUALIFIED',
          invoiceNo: undefined,
          invoiceDate: undefined,
          invoiceAmount: undefined,
          actualAmount: 0,
          remarks: '货物已到达，等待检验',
          details: [],
          createdBy: 1,
          createdTime: '2025-08-22T09:00:00',
          version: 1
        }
      ]

      // 简单的搜索过滤
      let filteredData = mockData
      if (params.arrivalNo) {
        filteredData = filteredData.filter(item => 
          item.arrivalNo.includes(params.arrivalNo)
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
    
    inspectArrival: async (id: number, data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    acceptArrival: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    rejectArrival: async (id: number, reason: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    updateInvoice: async (id: number, data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    deleteArrival: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    }
  }

  // 检验操作
  const inspectionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      arrivalService.inspectArrival(id, data),
    onSuccess: () => {
      message.success('检验完成')
      setInspectionModalVisible(false)
      setCurrentArrival(null)
      inspectionForm.resetFields()
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('检验失败')
    },
  })

  // 验收操作
  const acceptMutation = useMutation({
    mutationFn: arrivalService.acceptArrival,
    onSuccess: () => {
      message.success('验收成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('验收失败')
    },
  })

  // 拒收操作
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      arrivalService.rejectArrival(id, reason),
    onSuccess: () => {
      message.success('拒收成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('拒收失败')
    },
  })

  // 更新发票
  const invoiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      arrivalService.updateInvoice(id, data),
    onSuccess: () => {
      message.success('发票信息更新成功')
      setInvoiceModalVisible(false)
      setCurrentArrival(null)
      invoiceForm.resetFields()
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('更新失败')
    },
  })

  // 删除到货记录
  const deleteMutation = useMutation({
    mutationFn: arrivalService.deleteArrival,
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('删除失败')
    },
  })

  // 表格列配置
  const columns: ProColumns<ArrivalManagement>[] = [
    {
      title: '到货单号',
      dataIndex: 'arrivalNo',
      key: 'arrivalNo',
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
      dataIndex: ['supplier', 'supplierName'],
      key: 'supplierName',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '到货日期',
      dataIndex: 'arrivalDate',
      key: 'arrivalDate',
      width: 120,
      hideInSearch: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: '收货人',
      dataIndex: ['receiver', 'name'],
      key: 'receiverId',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '到货状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'ARRIVED': { text: '已到货' },
        'INSPECTED': { text: '已检验' },
        'ACCEPTED': { text: '已验收' },
        'REJECTED': { text: '已拒收' },
      },
      render: (_, record) => {
        const config = ARRIVAL_STATUS_CONFIG[record.status]
        const icon = record.status === 'ARRIVED' ? <TruckOutlined /> :
                    record.status === 'INSPECTED' ? <SafetyCertificateOutlined /> :
                    record.status === 'ACCEPTED' ? <CheckOutlined /> :
                    record.status === 'REJECTED' ? <CloseOutlined /> : undefined
        return <Tag color={config.color} icon={icon}>{config.text}</Tag>
      },
    },
    {
      title: '质量状态',
      dataIndex: 'qualityStatus',
      key: 'qualityStatus',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        const config = QUALITY_STATUS_CONFIG[record.qualityStatus]
        const icon = record.qualityStatus === 'QUALIFIED' ? <CheckOutlined /> :
                    record.qualityStatus === 'UNQUALIFIED' ? <WarningOutlined /> :
                    record.qualityStatus === 'PARTIAL' ? <ExclamationCircleOutlined /> : undefined
        return <Tag color={config.color} icon={icon}>{config.text}</Tag>
      },
    },
    {
      title: '数量统计',
      key: 'quantityStats',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontSize: '12px' }}>
            总数量：<strong>{record.totalQuantity}</strong>
          </span>
          <span style={{ fontSize: '12px', color: '#52c41a' }}>
            验收：<strong>{record.acceptedQuantity}</strong>
          </span>
          {record.rejectedQuantity > 0 && (
            <span style={{ fontSize: '12px', color: '#ff4d4f' }}>
              拒收：<strong>{record.rejectedQuantity}</strong>
            </span>
          )}
        </Space>
      ),
    },
    {
      title: '验收进度',
      key: 'acceptanceProgress',
      width: 120,
      hideInSearch: true,
      render: (_, record) => {
        const percentage = record.totalQuantity > 0 
          ? Math.round((record.acceptedQuantity / record.totalQuantity) * 100) 
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
      title: '发票信息',
      key: 'invoiceInfo',
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        if (record.invoiceNo) {
          return (
            <Space direction="vertical" size={0}>
              <span style={{ fontSize: '12px' }}>
                发票号：{record.invoiceNo}
              </span>
              <span style={{ fontSize: '12px' }}>
                金额：¥{record.invoiceAmount && formatMoney(record.invoiceAmount)}
              </span>
              {record.amountDifference !== 0 && (
                <span style={{ 
                  fontSize: '12px', 
                  color: record.amountDifference! > 0 ? '#ff4d4f' : '#52c41a' 
                }}>
                  差额：¥{record.amountDifference && formatMoney(Math.abs(record.amountDifference))}
                </span>
              )}
            </Space>
          )
        }
        return <Tag color="orange">未录入发票</Tag>
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
          onClick={() => navigate(`/cargo/arrival-management/${record.id}`)}
        >
          详情
        </Button>,
        record.status === 'ARRIVED' && (
          <Button
            key="inspect"
            type="link"
            size="small"
            icon={<SafetyCertificateOutlined />}
            onClick={() => handleInspection(record)}
          >
            检验
          </Button>
        ),
        record.status === 'INSPECTED' && (
          <Space key="acceptance">
            <Button
              type="link"
              size="small"
              onClick={() => handleAccept(record)}
              loading={acceptMutation.isPending}
            >
              验收
            </Button>
            <Button
              type="link"
              size="small"
              danger
              onClick={() => handleReject(record)}
              loading={rejectMutation.isPending}
            >
              拒收
            </Button>
          </Space>
        ),
        !record.invoiceNo && (
          <Button
            key="invoice"
            type="link"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => handleInvoice(record)}
          >
            录入发票
          </Button>
        ),
        record.status === 'ARRIVED' && (
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

  // 处理检验
  const handleInspection = (record: ArrivalManagement) => {
    setCurrentArrival(record)
    inspectionForm.setFieldsValue({
      totalQuantity: record.totalQuantity,
      acceptedQuantity: record.totalQuantity,
      rejectedQuantity: 0,
      qualityStatus: 'QUALIFIED',
      inspectionResult: '',
      remarks: ''
    })
    setInspectionModalVisible(true)
  }

  // 处理验收
  const handleAccept = (record: ArrivalManagement) => {
    Modal.confirm({
      title: '确认验收',
      content: `确定要验收到货单"${record.arrivalNo}"吗？验收后货物将入库。`,
      onOk: () => acceptMutation.mutate(record.id),
    })
  }

  // 处理拒收
  const handleReject = (record: ArrivalManagement) => {
    let reason = ''
    Modal.confirm({
      title: '拒收货物',
      content: (
        <div>
          <p>确定要拒收到货单"{record.arrivalNo}"吗？</p>
          <textarea
            placeholder="请输入拒收原因"
            style={{ width: '100%', height: 80, marginTop: 8 }}
            onChange={(e) => reason = e.target.value}
          />
        </div>
      ),
      onOk: () => {
        if (!reason.trim()) {
          message.error('请输入拒收原因')
          return Promise.reject()
        }
        return rejectMutation.mutateAsync({ id: record.id, reason })
      },
    })
  }

  // 处理发票录入
  const handleInvoice = (record: ArrivalManagement) => {
    setCurrentArrival(record)
    invoiceForm.setFieldsValue({
      invoiceNo: '',
      invoiceDate: '',
      invoiceAmount: record.purchase?.totalAmount || 0,
      differenceReason: ''
    })
    setInvoiceModalVisible(true)
  }

  // 处理删除
  const handleDelete = (record: ArrivalManagement) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除到货单"${record.arrivalNo}"吗？删除后不可恢复。`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  // 确认检验
  const handleConfirmInspection = async () => {
    try {
      const values = await inspectionForm.validateFields()
      if (!currentArrival) return

      inspectionMutation.mutate({
        id: currentArrival.id,
        data: values
      })
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  // 确认发票录入
  const handleConfirmInvoice = async () => {
    try {
      const values = await invoiceForm.validateFields()
      if (!currentArrival) return

      const purchaseAmount = currentArrival.purchase?.totalAmount || 0
      const amountDifference = values.invoiceAmount - purchaseAmount

      invoiceMutation.mutate({
        id: currentArrival.id,
        data: {
          ...values,
          actualAmount: values.invoiceAmount,
          amountDifference
        }
      })
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  return (
    <div className="page-container">
      <ProTable<ArrivalManagement>
        headerTitle="到货管理"
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
            onClick={() => navigate('/cargo/arrival-management/new')}
          >
            新建到货
          </Button>,
        ]}
        request={async (params) => {
          return await arrivalService.getArrivals({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            arrivalNo: params.arrivalNo,
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

      {/* 检验Modal */}
      <Modal
        title="货物检验"
        open={inspectionModalVisible}
        onOk={handleConfirmInspection}
        onCancel={() => {
          setInspectionModalVisible(false)
          setCurrentArrival(null)
          inspectionForm.resetFields()
        }}
        confirmLoading={inspectionMutation.isPending}
        width={600}
      >
        <Form form={inspectionForm} layout="vertical">
          <Form.Item
            name="totalQuantity"
            label="到货总数量"
            rules={[{ required: true, message: '请输入到货总数量' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} precision={0} />
          </Form.Item>
          
          <Form.Item
            name="acceptedQuantity"
            label="验收数量"
            rules={[{ required: true, message: '请输入验收数量' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} precision={0} />
          </Form.Item>
          
          <Form.Item
            name="rejectedQuantity"
            label="拒收数量"
            rules={[{ required: true, message: '请输入拒收数量' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} precision={0} />
          </Form.Item>
          
          <Form.Item
            name="qualityStatus"
            label="质量状态"
            rules={[{ required: true, message: '请选择质量状态' }]}
          >
            <select style={{ width: '100%', height: 32, border: '1px solid #d9d9d9', borderRadius: 6, padding: '0 8px' }}>
              <option value="QUALIFIED">合格</option>
              <option value="UNQUALIFIED">不合格</option>
              <option value="PARTIAL">部分合格</option>
            </select>
          </Form.Item>
          
          <Form.Item
            name="inspectionResult"
            label="检验结果"
          >
            <TextArea rows={3} placeholder="请输入检验结果" />
          </Form.Item>
          
          <Form.Item
            name="remarks"
            label="备注"
          >
            <TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 发票录入Modal */}
      <Modal
        title="发票信息录入"
        open={invoiceModalVisible}
        onOk={handleConfirmInvoice}
        onCancel={() => {
          setInvoiceModalVisible(false)
          setCurrentArrival(null)
          invoiceForm.resetFields()
        }}
        confirmLoading={invoiceMutation.isPending}
        width={500}
      >
        {currentArrival && (
          <div>
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
              <p><strong>到货单号：</strong>{currentArrival.arrivalNo}</p>
              <p><strong>采购金额：</strong>¥{currentArrival.purchase?.totalAmount && formatMoney(currentArrival.purchase.totalAmount)}</p>
            </div>
            
            <Form form={invoiceForm} layout="vertical">
              <Form.Item
                name="invoiceNo"
                label="发票号"
                rules={[{ required: true, message: '请输入发票号' }]}
              >
                <Input placeholder="请输入发票号" />
              </Form.Item>
              
              <Form.Item
                name="invoiceDate"
                label="发票日期"
                rules={[{ required: true, message: '请选择发票日期' }]}
              >
                <Input type="date" />
              </Form.Item>
              
              <Form.Item
                name="invoiceAmount"
                label="发票金额"
                rules={[{ required: true, message: '请输入发票金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\¥\s?|(,*)/g, '')}
                />
              </Form.Item>
              
              <Form.Item
                name="differenceReason"
                label="金额差异说明"
              >
                <TextArea rows={3} placeholder="如发票金额与采购金额不一致，请说明原因" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ArrivalManagementList
