import React, { useState } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Tag, 
  Statistic, 
  Row, 
  Col,
  Modal,
  Form,
  message,
  Tooltip,
  Progress,
  Badge,
  Alert,
  Divider,
  InputNumber
} from 'antd'
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined,
  EyeOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  BellOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  AlertOutlined,
  FireOutlined,
  StopOutlined
} from '@ant-design/icons'
import { useQuery, useMutation } from '@tanstack/react-query'
import { formatMoney, formatDate } from '@/utils'
import type { InventoryAlert } from '@/types'
import dayjs from 'dayjs'

const { Search } = Input
const { Option } = Select

const InventoryAlertList: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    alertType: '',
    urgency: '',
    status: '',
  })
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [settingModalVisible, setSettingModalVisible] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<InventoryAlert | null>(null)
  const [settingForm] = Form.useForm()

  // 获取库存预警数据（模拟）
  const { data: alertData, isLoading, refetch } = useQuery({
    queryKey: ['inventory-alert', searchParams],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟预警数据
      const mockData = {
        total: 12,
        items: [
          {
            id: 1,
            materialCode: 'MAT002',
            materialName: '液压油',
            specification: '46号抗磨液压油 200L',
            category: '油料',
            unit: '桶',
            warehouseLocation: '港口仓库B区-B02-015',
            currentStock: 8,
            safetyStock: 15,
            maxStock: 40,
            alertType: 'LOW_STOCK',
            urgency: 'HIGH',
            status: 'PENDING',
            alertDate: '2025-08-20T10:00:00',
            expectedOutDate: '2025-08-25',
            suggestedPurchase: 25,
            unitPrice: 800,
            totalValue: 6400,
            supplier: '中石化润滑油有限公司',
            lastPurchaseDate: '2025-07-15',
            averageConsumption: 5,
            remarks: '液压油消耗较快，建议及时补货'
          },
          {
            id: 2,
            materialCode: 'MAT004',
            materialName: '电缆',
            specification: 'YJV22-0.6/1KV-3×120+1×70',
            category: '电气设备',
            unit: '米',
            warehouseLocation: '港口仓库C区-C01-005',
            currentStock: 0,
            safetyStock: 100,
            maxStock: 500,
            alertType: 'OUT_OF_STOCK',
            urgency: 'CRITICAL',
            status: 'PENDING',
            alertDate: '2025-08-20T08:00:00',
            expectedOutDate: '2025-08-21',
            suggestedPurchase: 300,
            unitPrice: 85,
            totalValue: 0,
            supplier: '远东电缆有限公司',
            lastPurchaseDate: '2025-07-20',
            averageConsumption: 50,
            remarks: '电缆已用完，急需采购'
          },
          {
            id: 3,
            materialCode: 'MAT003',
            materialName: '轴承',
            specification: '深沟球轴承 6320 内径100mm',
            category: '机械配件',
            unit: '个',
            warehouseLocation: '港口仓库A区-A03-008',
            currentStock: 45,
            safetyStock: 20,
            maxStock: 60,
            alertType: 'OVERSTOCK',
            urgency: 'LOW',
            status: 'ACKNOWLEDGED',
            alertDate: '2025-08-19T14:00:00',
            expectedOutDate: '2025-09-15',
            suggestedPurchase: 0,
            unitPrice: 1200,
            totalValue: 54000,
            supplier: 'SKF轴承有限公司',
            lastPurchaseDate: '2025-08-10',
            averageConsumption: 2,
            remarks: '轴承库存过多，建议暂停采购'
          },
          {
            id: 4,
            materialCode: 'MAT006',
            materialName: '滤芯',
            specification: '液压油滤芯 HF6177',
            category: '滤材',
            unit: '个',
            warehouseLocation: '港口仓库B区-B01-020',
            currentStock: 12,
            safetyStock: 20,
            maxStock: 80,
            alertType: 'LOW_STOCK',
            urgency: 'MEDIUM',
            status: 'PROCESSING',
            alertDate: '2025-08-19T16:00:00',
            expectedOutDate: '2025-08-28',
            suggestedPurchase: 30,
            unitPrice: 150,
            totalValue: 1800,
            supplier: '贺德克过滤技术有限公司',
            lastPurchaseDate: '2025-07-25',
            averageConsumption: 8,
            remarks: '滤芯需要定期更换，建议提前采购'
          },
          {
            id: 5,
            materialCode: 'MAT007',
            materialName: '密封圈',
            specification: 'O型密封圈 NBR70 φ50×3',
            category: '密封件',
            unit: '个',
            warehouseLocation: '港口仓库A区-A01-015',
            currentStock: 180,
            safetyStock: 50,
            maxStock: 200,
            alertType: 'NEAR_EXPIRY',
            urgency: 'MEDIUM',
            status: 'PENDING',
            alertDate: '2025-08-20T12:00:00',
            expectedOutDate: '2025-08-30',
            suggestedPurchase: 0,
            unitPrice: 25,
            totalValue: 4500,
            supplier: '东晟密封件有限公司',
            lastPurchaseDate: '2025-06-15',
            averageConsumption: 15,
            remarks: '密封圈即将过期，需要尽快使用'
          }
        ] as InventoryAlert[]
      }
      
      return mockData
    },
  })

  // 预警类型配置
  const alertTypeConfig = {
    'LOW_STOCK': { color: 'warning', text: '库存不足', icon: <WarningOutlined /> },
    'OUT_OF_STOCK': { color: 'error', text: '缺货', icon: <StopOutlined /> },
    'OVERSTOCK': { color: 'processing', text: '库存过多', icon: <ExclamationCircleOutlined /> },
    'NEAR_EXPIRY': { color: 'orange', text: '即将过期', icon: <AlertOutlined /> },
    'SLOW_MOVING': { color: 'default', text: '呆滞库存', icon: <ExclamationCircleOutlined /> },
  }

  // 紧急程度配置
  const urgencyConfig = {
    'CRITICAL': { color: 'error', text: '紧急', icon: <FireOutlined /> },
    'HIGH': { color: 'warning', text: '高', icon: <ExclamationCircleOutlined /> },
    'MEDIUM': { color: 'processing', text: '中', icon: <WarningOutlined /> },
    'LOW': { color: 'default', text: '低', icon: <BellOutlined /> },
  }

  // 处理状态配置
  const statusConfig = {
    'PENDING': { color: 'warning', text: '待处理' },
    'ACKNOWLEDGED': { color: 'processing', text: '已确认' },
    'PROCESSING': { color: 'blue', text: '处理中' },
    'RESOLVED': { color: 'success', text: '已解决' },
    'IGNORED': { color: 'default', text: '已忽略' },
  }

  // 计算预警统计
  const getAlertStats = () => {
    if (!alertData?.items) return { total: 0, critical: 0, high: 0, medium: 0, low: 0, pending: 0 }
    
    const stats = alertData.items.reduce((acc, item) => {
      acc.total += 1
      
      switch (item.urgency) {
        case 'CRITICAL':
          acc.critical += 1
          break
        case 'HIGH':
          acc.high += 1
          break
        case 'MEDIUM':
          acc.medium += 1
          break
        case 'LOW':
          acc.low += 1
          break
      }
      
      if (item.status === 'PENDING') {
        acc.pending += 1
      }
      
      return acc
    }, { total: 0, critical: 0, high: 0, medium: 0, low: 0, pending: 0 })
    
    return stats
  }

  const stats = getAlertStats()

  // 表格列定义
  const columns = [
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
      fixed: 'left' as const,
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 150,
      fixed: 'left' as const,
    },
    {
      title: '预警类型',
      dataIndex: 'alertType',
      key: 'alertType',
      width: 120,
      render: (value: string) => {
        const config = alertTypeConfig[value as keyof typeof alertTypeConfig]
        return config ? (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        ) : value
      },
    },
    {
      title: '紧急程度',
      dataIndex: 'urgency',
      key: 'urgency',
      width: 100,
      render: (value: string) => {
        const config = urgencyConfig[value as keyof typeof urgencyConfig]
        return config ? (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        ) : value
      },
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 100,
      render: (value: number, record: InventoryAlert) => (
        <Space>
          <span style={{ 
            fontWeight: 'bold',
            color: record.alertType === 'OUT_OF_STOCK' ? '#ff4d4f' : 
                   record.alertType === 'LOW_STOCK' ? '#faad14' : '#52c41a'
          }}>
            {value.toLocaleString()}
          </span>
          <span style={{ color: '#999' }}>{record.unit}</span>
        </Space>
      ),
    },
    {
      title: '安全库存',
      dataIndex: 'safetyStock',
      key: 'safetyStock',
      width: 100,
      render: (value: number, record: InventoryAlert) => (
        <span>{value} {record.unit}</span>
      ),
    },
    {
      title: '库存缺口',
      key: 'stockGap',
      width: 100,
      render: (_, record: InventoryAlert) => {
        const gap = record.safetyStock - record.currentStock
        if (gap <= 0) return <span style={{ color: '#52c41a' }}>充足</span>
        return (
          <span style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
            -{gap} {record.unit}
          </span>
        )
      },
    },
    {
      title: '建议采购',
      dataIndex: 'suggestedPurchase',
      key: 'suggestedPurchase',
      width: 100,
      render: (value: number, record: InventoryAlert) => (
        value > 0 ? (
          <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
            {value} {record.unit}
          </span>
        ) : '-'
      ),
    },
    {
      title: '预警时间',
      dataIndex: 'alertDate',
      key: 'alertDate',
      width: 150,
      render: (value: string) => formatDate(value, 'MM-DD HH:mm'),
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: string) => {
        const config = statusConfig[value as keyof typeof statusConfig]
        return config ? (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        ) : value
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_, record: InventoryAlert) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {record.suggestedPurchase > 0 && (
            <Tooltip title="创建采购申请">
              <Button
                type="link"
                size="small"
                icon={<ShoppingCartOutlined />}
                onClick={() => handleCreatePurchase(record)}
              />
            </Tooltip>
          )}
          <Tooltip title="标记已处理">
            <Button
              type="link"
              size="small"
              onClick={() => handleMarkResolved(record)}
              disabled={record.status === 'RESOLVED'}
            >
              处理
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, keyword: value }))
  }

  // 处理筛选
  const handleFilter = (key: string, value: any) => {
    setSearchParams(prev => ({ ...prev, [key]: value }))
  }

  // 查看详情
  const handleViewDetail = (alert: InventoryAlert) => {
    setSelectedAlert(alert)
    setDetailModalVisible(true)
  }

  // 创建采购申请
  const handleCreatePurchase = (alert: InventoryAlert) => {
    message.success(`已为 ${alert.materialName} 创建采购申请`)
  }

  // 标记已处理
  const handleMarkResolved = (alert: InventoryAlert) => {
    message.success(`已标记 ${alert.materialName} 为已处理`)
  }

  // 预警设置
  const handleAlertSetting = () => {
    setSettingModalVisible(true)
  }

  // 导出数据
  const handleExport = () => {
    message.success('导出功能开发中...')
  }

  return (
    <div className="page-container">
      {/* 预警概览 */}
      <Alert
        message="库存预警概览"
        description={`当前共有 ${stats.total} 个预警，其中紧急 ${stats.critical} 个，高优先级 ${stats.high} 个，待处理 ${stats.pending} 个`}
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总预警数"
              value={stats.total}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<BellOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="紧急预警"
              value={stats.critical}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<FireOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="高优先级"
              value={stats.high}
              valueStyle={{ color: '#faad14' }}
              prefix={<ExclamationCircleOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待处理"
              value={stats.pending}
              valueStyle={{ color: '#1890ff' }}
              prefix={<WarningOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
      </Row>

      {/* 预警分布 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Badge status="error" />
              <span style={{ marginLeft: 8 }}>紧急: {stats.critical}</span>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Badge status="warning" />
              <span style={{ marginLeft: 8 }}>高: {stats.high}</span>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Badge status="processing" />
              <span style={{ marginLeft: 8 }}>中: {stats.medium}</span>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Badge status="default" />
              <span style={{ marginLeft: 8 }}>低: {stats.low}</span>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 查询表单 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Search
              placeholder="搜索物料编码/名称"
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="预警类型"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilter('alertType', value)}
            >
              <Option value="LOW_STOCK">库存不足</Option>
              <Option value="OUT_OF_STOCK">缺货</Option>
              <Option value="OVERSTOCK">库存过多</Option>
              <Option value="NEAR_EXPIRY">即将过期</Option>
              <Option value="SLOW_MOVING">呆滞库存</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="紧急程度"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilter('urgency', value)}
            >
              <Option value="CRITICAL">紧急</Option>
              <Option value="HIGH">高</Option>
              <Option value="MEDIUM">中</Option>
              <Option value="LOW">低</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="处理状态"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilter('status', value)}
            >
              <Option value="PENDING">待处理</Option>
              <Option value="ACKNOWLEDGED">已确认</Option>
              <Option value="PROCESSING">处理中</Option>
              <Option value="RESOLVED">已解决</Option>
              <Option value="IGNORED">已忽略</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                onClick={() => refetch()}
              >
                查询
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSearchParams({
                    keyword: '',
                    alertType: '',
                    urgency: '',
                    status: '',
                  })
                  refetch()
                }}
              >
                重置
              </Button>
              <Button 
                icon={<ExportOutlined />}
                onClick={handleExport}
              >
                导出
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 预警列表 */}
      <Card
        title={
          <Space>
            <BellOutlined />
            库存预警
            <Tag color="red">{alertData?.total || 0} 条预警</Tag>
          </Space>
        }
        extra={
          <Space>
            <Button 
              icon={<SettingOutlined />}
              onClick={handleAlertSetting}
            >
              预警设置
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={alertData?.items || []}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1400 }}
          pagination={{
            total: alertData?.total || 0,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          rowClassName={(record) => {
            if (record.urgency === 'CRITICAL') return 'row-error'
            if (record.urgency === 'HIGH') return 'row-warning'
            return ''
          }}
        />
      </Card>

      {/* 详情Modal */}
      <Modal
        title="预警详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedAlert && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="物料信息" size="small">
                  <p><strong>物料编码：</strong>{selectedAlert.materialCode}</p>
                  <p><strong>物料名称：</strong>{selectedAlert.materialName}</p>
                  <p><strong>规格型号：</strong>{selectedAlert.specification}</p>
                  <p><strong>物料分类：</strong>{selectedAlert.category}</p>
                  <p><strong>计量单位：</strong>{selectedAlert.unit}</p>
                  <p><strong>库位：</strong>{selectedAlert.warehouseLocation}</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="预警信息" size="small">
                  <p><strong>预警类型：</strong>
                    {(() => {
                      const config = alertTypeConfig[selectedAlert.alertType as keyof typeof alertTypeConfig]
                      return config ? (
                        <Tag color={config.color} icon={config.icon}>
                          {config.text}
                        </Tag>
                      ) : selectedAlert.alertType
                    })()}
                  </p>
                  <p><strong>紧急程度：</strong>
                    {(() => {
                      const config = urgencyConfig[selectedAlert.urgency as keyof typeof urgencyConfig]
                      return config ? (
                        <Tag color={config.color} icon={config.icon}>
                          {config.text}
                        </Tag>
                      ) : selectedAlert.urgency
                    })()}
                  </p>
                  <p><strong>预警时间：</strong>{formatDate(selectedAlert.alertDate)}</p>
                  <p><strong>处理状态：</strong>
                    {(() => {
                      const config = statusConfig[selectedAlert.status as keyof typeof statusConfig]
                      return config ? (
                        <Tag color={config.color}>
                          {config.text}
                        </Tag>
                      ) : selectedAlert.status
                    })()}
                  </p>
                </Card>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title="库存信息" size="small">
                  <p><strong>当前库存：</strong>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: selectedAlert.alertType === 'OUT_OF_STOCK' ? '#ff4d4f' : 
                             selectedAlert.alertType === 'LOW_STOCK' ? '#faad14' : '#52c41a'
                    }}>
                      {selectedAlert.currentStock} {selectedAlert.unit}
                    </span>
                  </p>
                  <p><strong>安全库存：</strong>{selectedAlert.safetyStock} {selectedAlert.unit}</p>
                  <p><strong>最大库存：</strong>{selectedAlert.maxStock} {selectedAlert.unit}</p>
                  <p><strong>平均消耗：</strong>{selectedAlert.averageConsumption} {selectedAlert.unit}/月</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="采购建议" size="small">
                  <p><strong>建议采购：</strong>
                    {selectedAlert.suggestedPurchase > 0 ? (
                      <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                        {selectedAlert.suggestedPurchase} {selectedAlert.unit}
                      </span>
                    ) : '无需采购'}
                  </p>
                  <p><strong>预计用完：</strong>{selectedAlert.expectedOutDate ? formatDate(selectedAlert.expectedOutDate) : '-'}</p>
                  <p><strong>上次采购：</strong>{selectedAlert.lastPurchaseDate ? formatDate(selectedAlert.lastPurchaseDate) : '-'}</p>
                  <p><strong>供应商：</strong>{selectedAlert.supplier}</p>
                </Card>
              </Col>
            </Row>
            
            {selectedAlert.remarks && (
              <Card title="备注信息" size="small" style={{ marginTop: 16 }}>
                <p>{selectedAlert.remarks}</p>
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* 预警设置Modal */}
      <Modal
        title="预警设置"
        open={settingModalVisible}
        onCancel={() => setSettingModalVisible(false)}
        onOk={() => {
          message.success('预警设置已保存')
          setSettingModalVisible(false)
        }}
        width={600}
      >
        <Form
          form={settingForm}
          layout="vertical"
          initialValues={{
            lowStockThreshold: 20,
            overstockThreshold: 90,
            expiryDays: 30,
            slowMovingDays: 90,
          }}
        >
          <Form.Item
            name="lowStockThreshold"
            label="库存不足阈值（%）"
            help="当库存低于安全库存的百分比时触发预警"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => Number(value!.replace('%', ''))}
            />
          </Form.Item>

          <Form.Item
            name="overstockThreshold"
            label="库存过多阈值（%）"
            help="当库存超过最大库存的百分比时触发预警"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={200}
              formatter={(value) => `${value}%`}
              parser={(value) => Number(value!.replace('%', ''))}
            />
          </Form.Item>

          <Form.Item
            name="expiryDays"
            label="即将过期天数"
            help="距离过期多少天时触发预警"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              max={365}
              addonAfter="天"
            />
          </Form.Item>

          <Form.Item
            name="slowMovingDays"
            label="呆滞库存天数"
            help="多少天没有出库记录时触发呆滞预警"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              max={365}
              addonAfter="天"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default InventoryAlertList
