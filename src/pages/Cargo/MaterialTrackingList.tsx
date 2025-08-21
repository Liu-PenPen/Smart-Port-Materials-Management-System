import React, { useRef, useState } from 'react'
import { Button, Tag, Space, message, Modal, Timeline, QRCode, Drawer, Descriptions, Table } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExportOutlined,
  EyeOutlined,
  QrcodeOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
  BarcodeOutlined,
  TruckOutlined,
  InboxOutlined,
  SendOutlined,
  SwapOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { formatDate } from '@/utils'
import { TRACKING_STATUS_CONFIG, TRACKING_OPERATION_TYPE_CONFIG } from '@/constants'
import type { MaterialTracking, TrackingHistory } from '@/types'

const MaterialTrackingList: React.FC = () => {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>()
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState(false)
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false)
  const [currentTracking, setCurrentTracking] = useState<MaterialTracking | null>(null)

  // 物资追踪服务API（模拟）
  const trackingService = {
    getTrackings: async (params: any) => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟物资追踪数据
      const mockData: MaterialTracking[] = [
        {
          id: 1,
          trackingNo: 'TK202508200001',
          materialId: 1,
          material: {
            id: 1,
            materialName: '钢丝绳',
            materialCode: 'MAT001'
          } as any,
          batchNo: 'BATCH20250820001',
          serialNo: 'SN20250820001',
          barcode: '1234567890123',
          qrCode: 'QR20250820001',
          currentLocation: '港口仓库A区-01货位',
          currentStatus: 'STORED',
          supplierId: 1,
          supplier: {
            id: 1,
            supplierName: '中远海运港口设备有限公司',
            supplierCode: 'SUP001'
          } as any,
          purchaseId: 1,
          purchase: {
            id: 1,
            purchaseNo: 'PO202508200001'
          } as any,
          arrivalId: 1,
          arrival: {
            id: 1,
            arrivalNo: 'AR202508200001'
          } as any,
          warehouseId: 1,
          warehouse: {
            id: 1,
            warehouseName: '港口仓库A区'
          } as any,
          storageLocation: '01货位',
          quantity: 5,
          unit: '根',
          trackingHistory: [
            {
              id: 1,
              trackingId: 1,
              operationType: 'PURCHASE',
              operationDate: '2025-08-20T09:00:00',
              operatorId: 1,
              operator: { id: 1, name: '采购员张三' } as any,
              location: '采购部',
              status: '已采购',
              quantity: 5,
              remarks: '采购订单创建',
              createdBy: 1,
              createdTime: '2025-08-20T09:00:00',
              version: 1
            },
            {
              id: 2,
              trackingId: 1,
              operationType: 'ARRIVAL',
              operationDate: '2025-08-20T14:00:00',
              operatorId: 2,
              operator: { id: 2, name: '仓管员李四' } as any,
              location: '收货区',
              status: '已到货',
              quantity: 5,
              remarks: '货物到达港口',
              createdBy: 2,
              createdTime: '2025-08-20T14:00:00',
              version: 1
            },
            {
              id: 3,
              trackingId: 1,
              operationType: 'INSPECTION',
              operationDate: '2025-08-20T15:00:00',
              operatorId: 3,
              operator: { id: 3, name: '质检员王五' } as any,
              location: '质检区',
              status: '检验合格',
              quantity: 5,
              remarks: '质量检验通过',
              createdBy: 3,
              createdTime: '2025-08-20T15:00:00',
              version: 1
            },
            {
              id: 4,
              trackingId: 1,
              operationType: 'STORAGE',
              operationDate: '2025-08-20T16:00:00',
              operatorId: 2,
              operator: { id: 2, name: '仓管员李四' } as any,
              location: '港口仓库A区-01货位',
              status: '已入库',
              quantity: 5,
              remarks: '货物入库存储',
              createdBy: 2,
              createdTime: '2025-08-20T16:00:00',
              version: 1
            }
          ],
          createdBy: 1,
          createdTime: '2025-08-20T09:00:00',
          version: 1
        },
        {
          id: 2,
          trackingNo: 'TK202508210001',
          materialId: 2,
          material: {
            id: 2,
            materialName: '液压油',
            materialCode: 'MAT002'
          } as any,
          batchNo: 'BATCH20250821001',
          serialNo: 'SN20250821001',
          barcode: '1234567890124',
          qrCode: 'QR20250821001',
          currentLocation: '运输中',
          currentStatus: 'IN_TRANSIT',
          supplierId: 2,
          supplier: {
            id: 2,
            supplierName: '上海振华重工股份有限公司',
            supplierCode: 'SUP002'
          } as any,
          purchaseId: 2,
          purchase: {
            id: 2,
            purchaseNo: 'PO202508200002'
          } as any,
          quantity: 10,
          unit: '桶',
          trackingHistory: [
            {
              id: 5,
              trackingId: 2,
              operationType: 'PURCHASE',
              operationDate: '2025-08-21T09:00:00',
              operatorId: 1,
              operator: { id: 1, name: '采购员张三' } as any,
              location: '采购部',
              status: '已采购',
              quantity: 10,
              remarks: '采购订单创建',
              createdBy: 1,
              createdTime: '2025-08-21T09:00:00',
              version: 1
            },
            {
              id: 6,
              trackingId: 2,
              operationType: 'ARRIVAL',
              operationDate: '2025-08-21T12:00:00',
              operatorId: 4,
              operator: { id: 4, name: '物流员赵六' } as any,
              location: '运输中',
              status: '运输中',
              quantity: 10,
              remarks: '货物正在运输途中',
              createdBy: 4,
              createdTime: '2025-08-21T12:00:00',
              version: 1
            }
          ],
          createdBy: 1,
          createdTime: '2025-08-21T09:00:00',
          version: 1
        },
        {
          id: 3,
          trackingNo: 'TK202508190001',
          materialId: 3,
          material: {
            id: 3,
            materialName: '轴承',
            materialCode: 'MAT003'
          } as any,
          batchNo: 'BATCH20250819001',
          serialNo: 'SN20250819001',
          barcode: '1234567890125',
          qrCode: 'QR20250819001',
          currentLocation: '设备维护部',
          currentStatus: 'ISSUED',
          supplierId: 3,
          supplier: {
            id: 3,
            supplierName: '青岛港务机械制造有限公司',
            supplierCode: 'SUP003'
          } as any,
          purchaseId: 3,
          purchase: {
            id: 3,
            purchaseNo: 'PO202508190001'
          } as any,
          quantity: 8,
          unit: '个',
          trackingHistory: [],
          createdBy: 1,
          createdTime: '2025-08-19T09:00:00',
          version: 1
        }
      ]

      // 简单的搜索过滤
      let filteredData = mockData
      if (params.trackingNo) {
        filteredData = filteredData.filter(item => 
          item.trackingNo.includes(params.trackingNo)
        )
      }
      if (params.materialCode) {
        filteredData = filteredData.filter(item => 
          item.material?.materialCode.includes(params.materialCode)
        )
      }
      if (params.currentStatus) {
        filteredData = filteredData.filter(item => 
          item.currentStatus === params.currentStatus
        )
      }
      if (params.batchNo) {
        filteredData = filteredData.filter(item => 
          item.batchNo?.includes(params.batchNo)
        )
      }

      return {
        data: filteredData,
        success: true,
        total: filteredData.length,
      }
    },
    
    updateLocation: async (id: number, location: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },

    generateQRCode: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return { success: true, qrCode: `QR${Date.now()}` }
    },

    deleteTracking: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    }
  }

  // 更新位置
  const updateLocationMutation = useMutation({
    mutationFn: ({ id, location }: { id: number; location: string }) =>
      trackingService.updateLocation(id, location),
    onSuccess: () => {
      message.success('位置更新成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('位置更新失败')
    },
  })

  // 生成二维码
  const generateQRMutation = useMutation({
    mutationFn: trackingService.generateQRCode,
    onSuccess: () => {
      message.success('二维码生成成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('二维码生成失败')
    },
  })

  // 删除追踪记录
  const deleteMutation = useMutation({
    mutationFn: trackingService.deleteTracking,
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('删除失败')
    },
  })

  // 表格列配置
  const columns: ProColumns<MaterialTracking>[] = [
    {
      title: '追踪编号',
      dataIndex: 'trackingNo',
      key: 'trackingNo',
      width: 150,
      copyable: true,
      fixed: 'left',
    },
    {
      title: '物料编码',
      dataIndex: ['material', 'materialCode'],
      key: 'materialCode',
      width: 120,
    },
    {
      title: '物料名称',
      dataIndex: ['material', 'materialName'],
      key: 'materialName',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '批次号',
      dataIndex: 'batchNo',
      key: 'batchNo',
      width: 150,
    },
    {
      title: '序列号',
      dataIndex: 'serialNo',
      key: 'serialNo',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '条码/二维码',
      key: 'codes',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontSize: '12px' }}>
            <BarcodeOutlined /> {record.barcode}
          </span>
          <Space>
            <span style={{ fontSize: '12px' }}>
              <QrcodeOutlined /> {record.qrCode}
            </span>
            <Button
              type="link"
              size="small"
              icon={<QrcodeOutlined />}
              onClick={() => handleShowQRCode(record)}
            >
              查看
            </Button>
          </Space>
        </Space>
      ),
    },
    {
      title: '当前状态',
      dataIndex: 'currentStatus',
      key: 'currentStatus',
      width: 120,
      valueType: 'select',
      valueEnum: {
        'IN_TRANSIT': { text: '运输中' },
        'ARRIVED': { text: '已到货' },
        'INSPECTED': { text: '已检验' },
        'STORED': { text: '已入库' },
        'ISSUED': { text: '已出库' },
        'CONSUMED': { text: '已消耗' },
      },
      render: (_, record) => {
        const config = TRACKING_STATUS_CONFIG[record.currentStatus]
        const icon = record.currentStatus === 'IN_TRANSIT' ? <TruckOutlined /> :
                    record.currentStatus === 'ARRIVED' ? <InboxOutlined /> :
                    record.currentStatus === 'STORED' ? <InboxOutlined /> :
                    record.currentStatus === 'ISSUED' ? <SendOutlined /> :
                    record.currentStatus === 'CONSUMED' ? <SendOutlined /> : undefined
        return <Tag color={config?.color} icon={icon}>{config?.text}</Tag>
      },
    },
    {
      title: '当前位置',
      dataIndex: 'currentLocation',
      key: 'currentLocation',
      width: 200,
      hideInSearch: true,
      render: (value: string) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          <span>{value}</span>
        </Space>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      hideInSearch: true,
      render: (value: number, record) => `${value} ${record.unit}`,
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
      title: '采购单号',
      dataIndex: ['purchase', 'purchaseNo'],
      key: 'purchaseNo',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '仓库位置',
      key: 'warehouseLocation',
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        if (record.warehouse && record.storageLocation) {
          return (
            <Space direction="vertical" size={0}>
              <span style={{ fontSize: '12px' }}>{record.warehouse.warehouseName}</span>
              <span style={{ fontSize: '12px', color: '#999' }}>{record.storageLocation}</span>
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
          onClick={() => navigate(`/cargo/material-tracking/${record.id}`)}
        >
          详情
        </Button>,
        <Button
          key="history"
          type="link"
          size="small"
          icon={<HistoryOutlined />}
          onClick={() => handleShowHistory(record)}
        >
          历史
        </Button>,
        <Button
          key="location"
          type="link"
          size="small"
          icon={<EnvironmentOutlined />}
          onClick={() => handleUpdateLocation(record)}
        >
          更新位置
        </Button>,
        <Button
          key="qrcode"
          type="link"
          size="small"
          icon={<QrcodeOutlined />}
          onClick={() => handleGenerateQR(record)}
          loading={generateQRMutation.isPending}
        >
          生成码
        </Button>,
      ],
    },
  ]

  // 显示二维码
  const handleShowQRCode = (record: MaterialTracking) => {
    setCurrentTracking(record)
    setQrCodeModalVisible(true)
  }

  // 显示历史记录
  const handleShowHistory = (record: MaterialTracking) => {
    setCurrentTracking(record)
    setHistoryDrawerVisible(true)
  }

  // 更新位置
  const handleUpdateLocation = (record: MaterialTracking) => {
    let location = ''
    Modal.confirm({
      title: '更新位置',
      content: (
        <div>
          <p>当前位置：{record.currentLocation}</p>
          <input
            placeholder="请输入新位置"
            style={{ width: '100%', height: 32, border: '1px solid #d9d9d9', borderRadius: 6, padding: '0 8px', marginTop: 8 }}
            onChange={(e) => location = e.target.value}
          />
        </div>
      ),
      onOk: () => {
        if (!location.trim()) {
          message.error('请输入新位置')
          return Promise.reject()
        }
        return updateLocationMutation.mutateAsync({ id: record.id, location })
      },
    })
  }

  // 生成二维码
  const handleGenerateQR = (record: MaterialTracking) => {
    Modal.confirm({
      title: '生成二维码',
      content: `确定要为物料"${record.material?.materialName}"重新生成二维码吗？`,
      onOk: () => generateQRMutation.mutate(record.id),
    })
  }

  // 历史记录表格列
  const historyColumns = [
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 100,
      render: (value: string) => {
        const config = TRACKING_OPERATION_TYPE_CONFIG[value]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '操作时间',
      dataIndex: 'operationDate',
      key: 'operationDate',
      width: 150,
      render: (value: string) => formatDate(value),
    },
    {
      title: '操作人',
      dataIndex: ['operator', 'name'],
      key: 'operatorId',
      width: 100,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true,
    },
  ]

  return (
    <div className="page-container">
      <ProTable<MaterialTracking>
        headerTitle="物资追踪"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 1800 }}
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
            onClick={() => navigate('/cargo/material-tracking/new')}
          >
            新建追踪
          </Button>,
        ]}
        request={async (params) => {
          return await trackingService.getTrackings({
            current: params.current || 1,
            pageSize: params.pageSize || 20,
            trackingNo: params.trackingNo,
            materialCode: params.materialCode,
            currentStatus: params.currentStatus,
            batchNo: params.batchNo,
          })
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      {/* 二维码Modal */}
      <Modal
        title="物资二维码"
        open={qrCodeModalVisible}
        onCancel={() => {
          setQrCodeModalVisible(false)
          setCurrentTracking(null)
        }}
        footer={[
          <Button key="close" onClick={() => setQrCodeModalVisible(false)}>
            关闭
          </Button>,
          <Button key="print" type="primary" onClick={() => window.print()}>
            打印
          </Button>,
        ]}
        width={400}
      >
        {currentTracking && (
          <div style={{ textAlign: 'center' }}>
            <QRCode
              value={`${currentTracking.trackingNo}|${currentTracking.material?.materialCode}|${currentTracking.batchNo}`}
              size={200}
            />
            <div style={{ marginTop: 16 }}>
              <p><strong>追踪编号：</strong>{currentTracking.trackingNo}</p>
              <p><strong>物料编码：</strong>{currentTracking.material?.materialCode}</p>
              <p><strong>物料名称：</strong>{currentTracking.material?.materialName}</p>
              <p><strong>批次号：</strong>{currentTracking.batchNo}</p>
              <p><strong>数量：</strong>{currentTracking.quantity} {currentTracking.unit}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* 历史记录Drawer */}
      <Drawer
        title="物资流转历史"
        placement="right"
        size="large"
        open={historyDrawerVisible}
        onClose={() => {
          setHistoryDrawerVisible(false)
          setCurrentTracking(null)
        }}
      >
        {currentTracking && (
          <div>
            {/* 基本信息 */}
            <Descriptions
              title="基本信息"
              column={2}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="追踪编号">{currentTracking.trackingNo}</Descriptions.Item>
              <Descriptions.Item label="物料编码">{currentTracking.material?.materialCode}</Descriptions.Item>
              <Descriptions.Item label="物料名称">{currentTracking.material?.materialName}</Descriptions.Item>
              <Descriptions.Item label="批次号">{currentTracking.batchNo}</Descriptions.Item>
              <Descriptions.Item label="当前状态">
                <Tag color={TRACKING_STATUS_CONFIG[currentTracking.currentStatus]?.color}>
                  {TRACKING_STATUS_CONFIG[currentTracking.currentStatus]?.text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="当前位置">{currentTracking.currentLocation}</Descriptions.Item>
            </Descriptions>

            {/* 流转历史 */}
            <div>
              <h3>流转历史</h3>
              <Timeline
                items={currentTracking.trackingHistory.map((history) => ({
                  color: TRACKING_OPERATION_TYPE_CONFIG[history.operationType]?.color || 'blue',
                  children: (
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {TRACKING_OPERATION_TYPE_CONFIG[history.operationType]?.text} - {history.status}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>
                        时间：{formatDate(history.operationDate)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        操作人：{history.operator?.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        位置：{history.location}
                      </div>
                      {history.quantity && (
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          数量：{history.quantity}
                        </div>
                      )}
                      {history.remarks && (
                        <div style={{ fontSize: '12px', marginTop: 4 }}>
                          备注：{history.remarks}
                        </div>
                      )}
                    </div>
                  ),
                }))}
              />
            </div>

            {/* 详细历史表格 */}
            <div style={{ marginTop: 24 }}>
              <h3>详细记录</h3>
              <Table
                columns={historyColumns}
                dataSource={currentTracking.trackingHistory}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default MaterialTrackingList
