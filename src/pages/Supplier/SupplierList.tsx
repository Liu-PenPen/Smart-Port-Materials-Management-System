import React, { useRef } from 'react'
import { Button, Tag, Space, message, Modal } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supplierService } from '@/services/supplierService'
import type { Supplier } from '@/types'

const SupplierList: React.FC = () => {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>()
  const queryClient = useQueryClient()

  // 删除供应商
  const deleteMutation = useMutation({
    mutationFn: supplierService.deleteSupplier,
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('删除失败')
    },
  })

  // 批量更新状态
  const batchStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: 'ACTIVE' | 'INACTIVE' }) =>
      supplierService.batchUpdateStatus(ids, status),
    onSuccess: () => {
      message.success('操作成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('操作失败')
    },
  })

  // 表格列配置
  const columns: ProColumns<Supplier>[] = [
    {
      title: '供应商编码',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      width: 120,
      copyable: true,
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      ellipsis: true,
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'socialCreditCode',
      key: 'socialCreditCode',
      width: 180,
      copyable: true,
      hideInSearch: true,
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      valueType: 'select',
      valueEnum: {
        ACTIVE: { text: '启用', status: 'Success' },
        INACTIVE: { text: '停用', status: 'Error' },
      },
      render: (_, record) => (
        <Tag color={record.status === 'ACTIVE' ? 'green' : 'red'}>
          {record.status === 'ACTIVE' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 150,
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
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
          onClick={() => navigate(`/supplier/${record.id}`)}
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
        >
          删除
        </Button>,
      ],
    },
  ]

  // 处理删除
  const handleDelete = (record: Supplier) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除供应商"${record.supplierName}"吗？`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  // 处理批量操作
  const handleBatchAction = (selectedRows: Supplier[], action: string) => {
    const ids = selectedRows.map(row => row.id)
    
    if (action === 'enable') {
      batchStatusMutation.mutate({ ids, status: 'ACTIVE' })
    } else if (action === 'disable') {
      batchStatusMutation.mutate({ ids, status: 'INACTIVE' })
    }
  }

  // 导出数据
  const handleExport = async () => {
    try {
      const response = await supplierService.exportSuppliers({})
      // 处理文件下载
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `供应商列表_${new Date().toISOString().slice(0, 10)}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      message.success('导出成功')
    } catch (error) {
      message.error('导出失败')
    }
  }

  return (
    <div className="page-container">
      <ProTable<Supplier>
        headerTitle="供应商管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button
            key="export"
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            导出
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/supplier/new')}
          >
            新建供应商
          </Button>,
        ]}
        request={async (params) => {
          // 模拟网络延迟
          await new Promise(resolve => setTimeout(resolve, 500))

          // 模拟供应商数据
          const mockSuppliers: Supplier[] = [
            {
              id: 1,
              supplierCode: 'SUP001',
              supplierName: '北京科技有限公司',
              socialCreditCode: '91110000123456789X',
              supplyContent: '办公用品、电脑设备',
              companyAddress: '北京市朝阳区科技园区',
              contactPerson: '张经理',
              contactPhone: '13800138001',
              businessLicense: '',
              status: 'ACTIVE',
              companyId: 1,
              createdBy: 1,
              createdTime: '2024-01-01T10:00:00',
              version: 1
            },
            {
              id: 2,
              supplierCode: 'SUP002',
              supplierName: '上海工贸集团',
              socialCreditCode: '91310000987654321A',
              supplyContent: '机械设备、维修材料',
              companyAddress: '上海市浦东新区工业园',
              contactPerson: '李总',
              contactPhone: '13800138002',
              businessLicense: '',
              status: 'ACTIVE',
              companyId: 1,
              createdBy: 1,
              createdTime: '2024-01-02T10:00:00',
              version: 1
            },
            {
              id: 3,
              supplierCode: 'SUP003',
              supplierName: '广州物流公司',
              socialCreditCode: '91440000456789123B',
              supplyContent: '物流服务、包装材料',
              companyAddress: '广州市天河区物流园',
              contactPerson: '王主任',
              contactPhone: '13800138003',
              businessLicense: '',
              status: 'INACTIVE',
              companyId: 1,
              createdBy: 1,
              createdTime: '2024-01-03T10:00:00',
              version: 1
            }
          ]

          // 简单的搜索过滤
          let filteredData = mockSuppliers
          if (params.supplierName) {
            filteredData = filteredData.filter(item =>
              item.supplierName.includes(params.supplierName)
            )
          }
          if (params.supplierCode) {
            filteredData = filteredData.filter(item =>
              item.supplierCode.includes(params.supplierCode)
            )
          }
          if (params.status) {
            filteredData = filteredData.filter(item =>
              item.status === params.status
            )
          }

          return {
            data: filteredData,
            success: true,
            total: filteredData.length,
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: () => {
            // 可以在这里处理选中行的变化
          },
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选择 {selectedRowKeys.length} 项
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={({ selectedRows }) => (
          <Space size={16}>
            <a onClick={() => handleBatchAction(selectedRows, 'enable')}>
              批量启用
            </a>
            <a onClick={() => handleBatchAction(selectedRows, 'disable')}>
              批量停用
            </a>
          </Space>
        )}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </div>
  )
}

export default SupplierList
