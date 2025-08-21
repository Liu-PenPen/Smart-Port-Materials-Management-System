import React, { useRef } from 'react'
import { Button, Tag, Space, message, Modal } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined, QrcodeOutlined } from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { request } from '@/services/api'
import { getStatusConfig } from '@/utils'
import type { Material, PageResult } from '@/types'

const MaterialList: React.FC = () => {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>()

  // 物资服务API
  const materialService = {
    getMaterials: (params: any) => 
      request.get<PageResult<Material>>('/materials', { params }),
    deleteMaterial: (id: number) => 
      request.delete(`/materials/${id}`),
    batchUpdateStatus: (ids: number[], status: string) =>
      request.post('/materials/batch-status', { ids, status }),
    exportMaterials: (params: any) =>
      request.download('/materials/export', { params }),
  }

  // 删除物资
  const deleteMutation = useMutation({
    mutationFn: materialService.deleteMaterial,
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
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
      materialService.batchUpdateStatus(ids, status),
    onSuccess: () => {
      message.success('操作成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('操作失败')
    },
  })

  // 表格列配置
  const columns: ProColumns<Material>[] = [
    {
      title: '物资编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
      copyable: true,
      fixed: 'left',
    },
    {
      title: '物资名称',
      dataIndex: 'materialName',
      key: 'materialName',
      ellipsis: true,
      fixed: 'left',
      width: 200,
    },
    {
      title: '规格型号',
      dataIndex: 'specification',
      key: 'specification',
      ellipsis: true,
      hideInSearch: true,
      width: 150,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '物资类型',
      dataIndex: ['materialType', 'typeName'],
      key: 'materialTypeId',
      width: 120,
      valueType: 'select',
      request: async () => {
        // 获取物资类型选项
        const response = await request.get('/material-types/options')
        return response.data.map((item: any) => ({
          label: item.typeName,
          value: item.id,
        }))
      },
    },
    {
      title: '拼音码',
      dataIndex: 'pinyinCode',
      key: 'pinyinCode',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '条形码',
      dataIndex: 'barcode',
      key: 'barcode',
      width: 120,
      hideInSearch: true,
      render: (text) => text ? (
        <Space>
          <span>{text}</span>
          <QrcodeOutlined style={{ color: '#1890ff' }} />
        </Space>
      ) : '-',
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
      render: (_, record) => {
        const config = getStatusConfig(record.status)
        return <Tag color={config.color}>{config.text}</Tag>
      },
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
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => navigate(`/material/${record.id}`)}
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
  const handleDelete = (record: Material) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除物资"${record.materialName}"吗？`,
      onOk: () => deleteMutation.mutate(record.id),
    })
  }

  // 处理批量操作
  const handleBatchAction = (selectedRows: Material[], action: string) => {
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
      const response = await materialService.exportMaterials({})
      // 处理文件下载
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `物资列表_${new Date().toISOString().slice(0, 10)}.xlsx`)
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
      <ProTable<Material>
        headerTitle="物资管理"
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
            onClick={handleExport}
          >
            导出
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/material/new')}
          >
            新建物资
          </Button>,
        ]}
        request={async (params) => {
          // 模拟网络延迟
          await new Promise(resolve => setTimeout(resolve, 500))

          // 模拟物资数据
          const mockMaterials: Material[] = [
            {
              id: 1,
              materialCode: 'MAT001',
              materialName: '办公用纸A4',
              materialTypeId: 1,
              specification: '70g/m² 500张/包',
              unit: '包',
              pinyinCode: 'BGYZA4',
              auxiliaryName: 'A4纸',
              barcode: '1234567890123',
              qrCode: '',
              status: 'ACTIVE',
              createdBy: 1,
              createdTime: '2024-01-01T10:00:00',
              version: 1
            },
            {
              id: 2,
              materialCode: 'MAT002',
              materialName: '打印机墨盒',
              materialTypeId: 2,
              specification: 'HP CF217A 黑色',
              unit: '个',
              pinyinCode: 'DYJMH',
              auxiliaryName: '墨盒',
              barcode: '1234567890124',
              qrCode: '',
              status: 'ACTIVE',
              createdBy: 1,
              createdTime: '2024-01-02T10:00:00',
              version: 1
            },
            {
              id: 3,
              materialCode: 'MAT003',
              materialName: '文件夹',
              materialTypeId: 1,
              specification: 'A4 塑料材质',
              unit: '个',
              pinyinCode: 'WJJ',
              auxiliaryName: '资料夹',
              barcode: '1234567890125',
              qrCode: '',
              status: 'ACTIVE',
              createdBy: 1,
              createdTime: '2024-01-03T10:00:00',
              version: 1
            },
            {
              id: 4,
              materialCode: 'MAT004',
              materialName: '计算器',
              materialTypeId: 2,
              specification: '科学计算器 12位数',
              unit: '台',
              pinyinCode: 'JSQ',
              auxiliaryName: '计算机',
              barcode: '1234567890126',
              qrCode: '',
              status: 'INACTIVE',
              createdBy: 1,
              createdTime: '2024-01-04T10:00:00',
              version: 1
            }
          ]

          // 简单的搜索过滤
          let filteredData = mockMaterials
          if (params.materialName) {
            filteredData = filteredData.filter(item =>
              item.materialName.includes(params.materialName)
            )
          }
          if (params.materialCode) {
            filteredData = filteredData.filter(item =>
              item.materialCode.includes(params.materialCode)
            )
          }
          if (params.materialTypeId) {
            filteredData = filteredData.filter(item =>
              item.materialTypeId === params.materialTypeId
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

export default MaterialList
