import React, { useRef, useState } from 'react'
import { Button, Tag, Space, message, Modal, Form, Input, Select, InputNumber, DatePicker, Switch } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExportOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  StarOutlined
} from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { formatMoney, formatDate } from '@/utils'
import type { SupplyCatalogItem, Material, MaterialCategory } from '@/types'

const { Option } = Select
const { TextArea } = Input

const SupplyCatalogManage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const actionRef = useRef<ActionType>()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<SupplyCatalogItem | null>(null)
  const [form] = Form.useForm()

  // 获取供应商信息
  const { data: supplier } = useQuery({
    queryKey: ['supplier-info', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return {
        id: Number(id),
        supplierName: '中远海运港口设备有限公司',
        supplierCode: 'GS001'
      }
    },
  })

  // 供应清单服务API（模拟）
  const catalogService = {
    getCatalogItems: async (params: any) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockData: SupplyCatalogItem[] = [
        {
          id: 1,
          groupSupplierId: Number(id),
          materialCategoryId: 1,
          materialCategory: { id: 1, categoryName: '港口机械' } as any,
          materialId: 1,
          material: { id: 1, materialName: '门式起重机', materialCode: 'MAT001' } as any,
          materialName: '门式起重机',
          specification: '40吨双梁门式起重机 跨度35米',
          unit: '台',
          unitPrice: 2500000,
          minOrderQuantity: 1,
          deliveryDays: 180,
          qualityStandard: 'GB/T 14406-2017',
          isMainSupplier: true,
          effectiveDate: '2025-01-01',
          expiryDate: '2025-12-31',
          status: 'ACTIVE',
          createdBy: 1,
          createdTime: '2025-01-01T10:00:00',
          version: 1
        },
        {
          id: 2,
          groupSupplierId: Number(id),
          materialCategoryId: 2,
          materialCategory: { id: 2, categoryName: '配件耗材' } as any,
          materialId: 2,
          material: { id: 2, materialName: '钢丝绳', materialCode: 'MAT002' } as any,
          materialName: '钢丝绳',
          specification: '直径20mm 长度100m 抗拉强度1770MPa',
          unit: '根',
          unitPrice: 1500,
          minOrderQuantity: 10,
          deliveryDays: 15,
          qualityStandard: 'GB 8918-2006',
          isMainSupplier: false,
          effectiveDate: '2025-01-01',
          expiryDate: '2025-12-31',
          status: 'ACTIVE',
          createdBy: 1,
          createdTime: '2025-01-01T10:00:00',
          version: 1
        },
        {
          id: 3,
          groupSupplierId: Number(id),
          materialCategoryId: 3,
          materialCategory: { id: 3, categoryName: '维修工具' } as any,
          materialId: 3,
          material: { id: 3, materialName: '液压扳手', materialCode: 'MAT003' } as any,
          materialName: '液压扳手',
          specification: '最大扭矩5000N·m 工作压力70MPa',
          unit: '套',
          unitPrice: 25000,
          minOrderQuantity: 1,
          deliveryDays: 30,
          qualityStandard: 'ISO 6789',
          isMainSupplier: true,
          effectiveDate: '2025-01-01',
          expiryDate: '2026-12-31',
          status: 'ACTIVE',
          createdBy: 1,
          createdTime: '2025-01-01T10:00:00',
          version: 1
        }
      ]

      let filteredData = mockData
      if (params.materialName) {
        filteredData = filteredData.filter(item => 
          item.materialName.includes(params.materialName)
        )
      }
      if (params.materialCategoryId) {
        filteredData = filteredData.filter(item => 
          item.materialCategoryId === params.materialCategoryId
        )
      }
      if (params.isMainSupplier !== undefined) {
        filteredData = filteredData.filter(item => 
          item.isMainSupplier === params.isMainSupplier
        )
      }

      return {
        data: filteredData,
        success: true,
        total: filteredData.length,
      }
    },
    
    saveCatalogItem: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    deleteCatalogItem: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    }
  }

  // 模拟物料类别数据
  const mockCategories = [
    { id: 1, categoryName: '港口机械' },
    { id: 2, categoryName: '配件耗材' },
    { id: 3, categoryName: '维修工具' },
    { id: 4, categoryName: '安全设备' },
    { id: 5, categoryName: '电气设备' },
  ]

  // 模拟物料数据
  const mockMaterials = [
    { id: 1, materialName: '门式起重机', materialCode: 'MAT001', unit: '台' },
    { id: 2, materialName: '钢丝绳', materialCode: 'MAT002', unit: '根' },
    { id: 3, materialName: '液压扳手', materialCode: 'MAT003', unit: '套' },
    { id: 4, materialName: '安全帽', materialCode: 'MAT004', unit: '个' },
    { id: 5, materialName: '变频器', materialCode: 'MAT005', unit: '台' },
  ]

  // 保存清单项
  const saveMutation = useMutation({
    mutationFn: catalogService.saveCatalogItem,
    onSuccess: () => {
      message.success('保存成功')
      setModalVisible(false)
      setEditingItem(null)
      form.resetFields()
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('保存失败')
    },
  })

  // 删除清单项
  const deleteMutation = useMutation({
    mutationFn: catalogService.deleteCatalogItem,
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('删除失败')
    },
  })

  // 表格列配置
  const columns: ProColumns<SupplyCatalogItem>[] = [
    {
      title: '物料类别',
      dataIndex: ['materialCategory', 'categoryName'],
      key: 'materialCategoryId',
      width: 120,
      valueType: 'select',
      request: async () => mockCategories.map(cat => ({ label: cat.categoryName, value: cat.id })),
    },
    {
      title: '物料编码',
      dataIndex: ['material', 'materialCode'],
      key: 'materialCode',
      width: 120,
      hideInSearch: true,
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
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      hideInSearch: true,
      render: (value: number) => `¥${formatMoney(value)}`,
    },
    {
      title: '最小订购量',
      dataIndex: 'minOrderQuantity',
      key: 'minOrderQuantity',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '交货周期',
      dataIndex: 'deliveryDays',
      key: 'deliveryDays',
      width: 100,
      hideInSearch: true,
      render: (value: number) => `${value}天`,
    },
    {
      title: '主供应商',
      dataIndex: 'isMainSupplier',
      key: 'isMainSupplier',
      width: 100,
      valueType: 'select',
      valueEnum: {
        true: { text: '是' },
        false: { text: '否' },
      },
      render: (_, record) => (
        <Tag color={record.isMainSupplier ? 'gold' : 'default'} icon={record.isMainSupplier ? <StarOutlined /> : undefined}>
          {record.isMainSupplier ? '主供应商' : '备选'}
        </Tag>
      ),
    },
    {
      title: '有效期',
      key: 'validity',
      width: 180,
      hideInSearch: true,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontSize: '12px' }}>开始：{formatDate(record.effectiveDate)}</span>
          <span style={{ fontSize: '12px' }}>结束：{record.expiryDate ? formatDate(record.expiryDate) : '长期有效'}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      hideInSearch: true,
      render: (value: string) => (
        <Tag color={value === 'ACTIVE' ? 'green' : 'default'}>
          {value === 'ACTIVE' ? '有效' : '无效'}
        </Tag>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 150,
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>,
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
        </Button>,
      ],
    },
  ]

  // 处理新建
  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    form.setFieldsValue({
      groupSupplierId: Number(id),
      status: 'ACTIVE',
      isMainSupplier: false,
      effectiveDate: dayjs(),
    })
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (item: SupplyCatalogItem) => {
    setEditingItem(item)
    form.setFieldsValue({
      ...item,
      effectiveDate: dayjs(item.effectiveDate),
      expiryDate: item.expiryDate ? dayjs(item.expiryDate) : null,
    })
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (item: SupplyCatalogItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除物料"${item.materialName}"吗？删除后不可恢复。`,
      onOk: () => deleteMutation.mutate(item.id),
    })
  }

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const submitData = {
        ...values,
        id: editingItem?.id,
        effectiveDate: values.effectiveDate?.format('YYYY-MM-DD'),
        expiryDate: values.expiryDate?.format('YYYY-MM-DD'),
      }
      saveMutation.mutate(submitData)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  return (
    <div className="page-container">
      <ProTable<SupplyCatalogItem>
        headerTitle={
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/channel/group-supplier')}
            >
              返回
            </Button>
            <span>{supplier?.supplierName} - 供应清单</span>
          </Space>
        }
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 1200 }}
        toolBarRender={() => [
          <Button
            key="export"
            icon={<ExportOutlined />}
            onClick={() => message.info('导出功能开发中')}
          >
            导出清单
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加物料
          </Button>,
        ]}
        request={async (params) => {
          return await catalogService.getCatalogItems({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            materialName: params.materialName,
            materialCategoryId: params.materialCategoryId,
            isMainSupplier: params.isMainSupplier,
          })
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      {/* 编辑Modal */}
      <Modal
        title={editingItem ? '编辑供应清单' : '添加供应清单'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false)
          setEditingItem(null)
          form.resetFields()
        }}
        confirmLoading={saveMutation.isPending}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="groupSupplierId" hidden>
            <Input />
          </Form.Item>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="materialCategoryId"
              label="物料类别"
              rules={[{ required: true, message: '请选择物料类别' }]}
            >
              <Select placeholder="请选择物料类别">
                {mockCategories.map(cat => (
                  <Option key={cat.id} value={cat.id}>{cat.categoryName}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="materialId"
              label="物料"
              rules={[{ required: true, message: '请选择物料' }]}
            >
              <Select placeholder="请选择物料">
                {mockMaterials.map(material => (
                  <Option key={material.id} value={material.id}>
                    {material.materialCode} - {material.materialName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="specification"
            label="规格型号"
            rules={[{ required: true, message: '请输入规格型号' }]}
          >
            <TextArea rows={2} placeholder="请输入详细的规格型号" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="unit"
              label="单位"
              rules={[{ required: true, message: '请输入单位' }]}
            >
              <Input placeholder="如：台、个、套" />
            </Form.Item>

            <Form.Item
              name="unitPrice"
              label="单价（元）"
              rules={[{ required: true, message: '请输入单价' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                placeholder="请输入单价"
              />
            </Form.Item>

            <Form.Item
              name="minOrderQuantity"
              label="最小订购量"
              rules={[{ required: true, message: '请输入最小订购量' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                precision={0}
                placeholder="请输入最小订购量"
              />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="deliveryDays"
              label="交货周期（天）"
              rules={[{ required: true, message: '请输入交货周期' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                precision={0}
                placeholder="请输入交货周期"
              />
            </Form.Item>

            <Form.Item
              name="qualityStandard"
              label="质量标准"
            >
              <Input placeholder="如：GB/T 14406-2017" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="effectiveDate"
              label="生效日期"
              rules={[{ required: true, message: '请选择生效日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="expiryDate"
              label="失效日期"
            >
              <DatePicker style={{ width: '100%' }} placeholder="不选择表示长期有效" />
            </Form.Item>

            <Form.Item
              name="isMainSupplier"
              label="主供应商"
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </div>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="ACTIVE">有效</Option>
              <Option value="INACTIVE">无效</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SupplyCatalogManage
