import React, { useRef, useState } from 'react'
import { Button, Tag, Space, message, Modal, Popconfirm, Upload, Tooltip } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExportOutlined,
  EyeOutlined,
  UploadOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { formatMoney, formatDate } from '@/utils'
import { GROUP_SUPPLIER_STATUS_CONFIG } from '@/constants'
import type { GroupSupplier } from '@/types'

const GroupSupplierList: React.FC = () => {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>()

  // 集采供应商服务API（模拟）
  const groupSupplierService = {
    getGroupSuppliers: async (params: any) => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟集采供应商数据
      const mockData: GroupSupplier[] = [
        {
          id: 1,
          supplierCode: 'GS001',
          supplierName: '中远海运港口设备有限公司',
          socialCreditCode: '91110000123456789A',
          companyAddress: '北京市朝阳区建国门外大街1号',
          contactPerson: '张经理',
          contactPhone: '010-12345678',
          contactEmail: 'zhang@cosco.com',
          businessLicense: 'BL202501001',
          licenseExpiryDate: '2026-12-31',
          registeredCapital: 50000000,
          businessScope: '港口设备制造、销售、维修',
          status: 'ACTIVE',
          isUsed: true,
          managedBy: 1,
          manager: { id: 1, name: '李部长' } as any,
          supplyCatalog: [],
          remarks: '集团重要合作伙伴',
          createdBy: 1,
          createdTime: '2025-01-01T10:00:00',
          version: 1
        },
        {
          id: 2,
          supplierCode: 'GS002',
          supplierName: '上海振华重工（集团）股份有限公司',
          socialCreditCode: '91310000987654321B',
          companyAddress: '上海市浦东新区东方路3261号',
          contactPerson: '王总监',
          contactPhone: '021-87654321',
          contactEmail: 'wang@zpmc.com',
          businessLicense: 'BL202501002',
          licenseExpiryDate: '2027-06-30',
          registeredCapital: 100000000,
          businessScope: '港口机械设备制造、安装、维护',
          status: 'ACTIVE',
          isUsed: true,
          managedBy: 1,
          manager: { id: 1, name: '李部长' } as any,
          supplyCatalog: [],
          remarks: '起重机械主要供应商',
          createdBy: 1,
          createdTime: '2025-01-02T10:00:00',
          version: 1
        },
        {
          id: 3,
          supplierCode: 'GS003',
          supplierName: '青岛港务机械制造有限公司',
          socialCreditCode: '91370200456789123C',
          companyAddress: '青岛市黄岛区港务路88号',
          contactPerson: '刘工程师',
          contactPhone: '0532-88888888',
          contactEmail: 'liu@qdport.com',
          businessLicense: 'BL202501003',
          licenseExpiryDate: '2025-12-31',
          registeredCapital: 30000000,
          businessScope: '港口装卸设备、配件制造',
          status: 'SUSPENDED',
          isUsed: false,
          managedBy: 1,
          manager: { id: 1, name: '李部长' } as any,
          supplyCatalog: [],
          remarks: '执照即将到期，暂停合作',
          createdBy: 1,
          createdTime: '2025-01-03T10:00:00',
          version: 1
        }
      ]

      // 简单的搜索过滤
      let filteredData = mockData
      if (params.supplierName) {
        filteredData = filteredData.filter(item => 
          item.supplierName.includes(params.supplierName)
        )
      }
      if (params.status) {
        filteredData = filteredData.filter(item => 
          item.status === params.status
        )
      }
      if (params.socialCreditCode) {
        filteredData = filteredData.filter(item => 
          item.socialCreditCode.includes(params.socialCreditCode)
        )
      }

      return {
        data: filteredData,
        success: true,
        total: filteredData.length,
      }
    },
    
    deleteGroupSupplier: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    exportGroupSuppliers: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    }
  }

  // 删除供应商
  const deleteMutation = useMutation({
    mutationFn: groupSupplierService.deleteGroupSupplier,
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('删除失败')
    },
  })

  // 导出数据
  const exportMutation = useMutation({
    mutationFn: groupSupplierService.exportGroupSuppliers,
    onSuccess: () => {
      message.success('导出成功')
    },
    onError: () => {
      message.error('导出失败')
    },
  })

  // 表格列配置
  const columns: ProColumns<GroupSupplier>[] = [
    {
      title: '供应商编号',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      width: 120,
      copyable: true,
      fixed: 'left',
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 200,
      ellipsis: true,
      render: (text: string, record) => (
        <Space>
          <BankOutlined style={{ color: '#1890ff' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '社会信用编码',
      dataIndex: 'socialCreditCode',
      key: 'socialCreditCode',
      width: 180,
      copyable: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        'ACTIVE': { text: '正常' },
        'INACTIVE': { text: '停用' },
        'SUSPENDED': { text: '暂停' },
        'BLACKLISTED': { text: '黑名单' },
      },
      render: (_, record) => {
        const config = GROUP_SUPPLIER_STATUS_CONFIG[record.status]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
      hideInSearch: true,
      render: (text: string, record) => (
        <Space>
          <span>{text}</span>
          <Tooltip title={`电话: ${record.contactPhone}`}>
            <PhoneOutlined style={{ color: '#52c41a' }} />
          </Tooltip>
          {record.contactEmail && (
            <Tooltip title={`邮箱: ${record.contactEmail}`}>
              <MailOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: '注册资本',
      dataIndex: 'registeredCapital',
      key: 'registeredCapital',
      width: 120,
      hideInSearch: true,
      render: (value: number) => value ? `¥${formatMoney(value)}` : '-',
    },
    {
      title: '营业执照',
      dataIndex: 'businessLicense',
      key: 'businessLicense',
      width: 180,
      hideInSearch: true,
      render: (text: string, record) => (
        <Space>
          <SafetyCertificateOutlined style={{ color: '#fa8c16' }} />
          <span>{text}</span>
          {record.licenseExpiryDate && (
            <Tag color={new Date(record.licenseExpiryDate) < new Date() ? 'red' : 'green'}>
              {formatDate(record.licenseExpiryDate)}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: '管理部门',
      dataIndex: ['manager', 'name'],
      key: 'managedBy',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '使用状态',
      dataIndex: 'isUsed',
      key: 'isUsed',
      width: 100,
      hideInSearch: true,
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'default'}>
          {value ? '已使用' : '未使用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 280,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="detail"
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/channel/group-supplier/${record.id}`)}
        >
          详情
        </Button>,
        <Button
          key="edit"
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => navigate(`/channel/group-supplier/edit/${record.id}`)}
        >
          编辑
        </Button>,
        <Button
          key="catalog"
          type="link"
          size="small"
          icon={<FileTextOutlined />}
          onClick={() => navigate(`/channel/group-supplier/${record.id}/catalog`)}
        >
          供应清单
        </Button>,
        !record.isUsed && (
          <Popconfirm
            key="delete"
            title="确认删除"
            description="确定要删除这个供应商吗？删除后不可恢复。"
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

  // 处理文件上传
  const handleUpload = (file: File) => {
    message.info('文件上传功能开发中')
    return false // 阻止自动上传
  }

  return (
    <div className="page-container">
      <ProTable<GroupSupplier>
        headerTitle="集采供应商"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 1400 }}
        toolBarRender={() => [
          <Upload
            key="import"
            accept=".xlsx,.xls"
            beforeUpload={handleUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>
              导入
            </Button>
          </Upload>,
          <Button
            key="export"
            icon={<ExportOutlined />}
            onClick={() => exportMutation.mutate()}
            loading={exportMutation.isPending}
          >
            导出
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/channel/group-supplier/new')}
          >
            新建供应商
          </Button>,
        ]}
        request={async (params) => {
          return await groupSupplierService.getGroupSuppliers({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            supplierName: params.supplierName,
            status: params.status,
            socialCreditCode: params.socialCreditCode,
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

export default GroupSupplierList
