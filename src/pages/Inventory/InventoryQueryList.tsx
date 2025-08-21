import React, { useState } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  DatePicker, 
  Tag, 
  Statistic, 
  Row, 
  Col,
  Modal,
  Form,
  message,
  Tooltip,
  Progress,
  Badge
} from 'antd'
import { 
  SearchOutlined, 
  ReloadOutlined, 
  ExportOutlined,
  EyeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
  DollarOutlined,
  BarChartOutlined,
  FilterOutlined
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { formatMoney, formatDate } from '@/utils'
import type { InventoryItem } from '@/types'
import dayjs from 'dayjs'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const InventoryQueryList: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: '',
    warehouse: '',
    status: '',
    dateRange: null as any,
  })
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  // 获取库存数据（模拟）
  const { data: inventoryData, isLoading, refetch } = useQuery({
    queryKey: ['inventory-query', searchParams],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟库存数据
      const mockData = {
        total: 156,
        items: [
          {
            id: 1,
            materialCode: 'MAT001',
            materialName: '钢丝绳',
            specification: '直径20mm 长度100m 抗拉强度1770MPa',
            category: '钢材',
            unit: '根',
            warehouseLocation: '港口仓库A区-A01-001',
            currentStock: 25,
            safetyStock: 10,
            maxStock: 50,
            unitPrice: 1500,
            totalValue: 37500,
            lastInDate: '2025-08-20',
            lastOutDate: '2025-08-18',
            status: 'NORMAL',
            supplier: '中远海运港口设备有限公司',
            remarks: '库存正常，质量良好'
          },
          {
            id: 2,
            materialCode: 'MAT002',
            materialName: '液压油',
            specification: '46号抗磨液压油 200L',
            category: '油料',
            unit: '桶',
            warehouseLocation: '港口仓库B区-B02-015',
            currentStock: 8,
            safetyStock: 15,
            maxStock: 40,
            unitPrice: 800,
            totalValue: 6400,
            lastInDate: '2025-08-19',
            lastOutDate: '2025-08-20',
            status: 'LOW_STOCK',
            supplier: '中石化润滑油有限公司',
            remarks: '库存不足，需要补货'
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
            unitPrice: 1200,
            totalValue: 54000,
            lastInDate: '2025-08-15',
            lastOutDate: '2025-08-17',
            status: 'OVERSTOCK',
            supplier: 'SKF轴承有限公司',
            remarks: '库存充足，可能存在积压'
          },
          {
            id: 4,
            materialCode: 'MAT004',
            materialName: '电缆',
            specification: 'YJV22-0.6/1KV-3×120+1×70',
            category: '电气设备',
            unit: '米',
            warehouseLocation: '港口仓库C区-C01-005',
            currentStock: 0,
            safetyStock: 100,
            maxStock: 500,
            unitPrice: 85,
            totalValue: 0,
            lastInDate: '2025-08-10',
            lastOutDate: '2025-08-20',
            status: 'OUT_OF_STOCK',
            supplier: '远东电缆有限公司',
            remarks: '库存为零，急需补货'
          },
          {
            id: 5,
            materialCode: 'MAT005',
            materialName: '螺栓',
            specification: 'M16×80 8.8级高强度螺栓',
            category: '标准件',
            unit: '个',
            warehouseLocation: '港口仓库A区-A02-012',
            currentStock: 1200,
            safetyStock: 500,
            maxStock: 2000,
            unitPrice: 12,
            totalValue: 14400,
            lastInDate: '2025-08-18',
            lastOutDate: '2025-08-19',
            status: 'NORMAL',
            supplier: '东明标准件有限公司',
            remarks: '库存正常'
          }
        ] as InventoryItem[]
      }
      
      return mockData
    },
  })

  // 库存状态配置
  const stockStatusConfig = {
    'NORMAL': { color: 'success', text: '正常', icon: <CheckCircleOutlined /> },
    'LOW_STOCK': { color: 'warning', text: '库存不足', icon: <WarningOutlined /> },
    'OVERSTOCK': { color: 'processing', text: '库存过多', icon: <ExclamationCircleOutlined /> },
    'OUT_OF_STOCK': { color: 'error', text: '缺货', icon: <ExclamationCircleOutlined /> },
  }

  // 计算库存统计
  const getInventoryStats = () => {
    if (!inventoryData?.items) return { total: 0, normal: 0, lowStock: 0, overstock: 0, outOfStock: 0, totalValue: 0 }
    
    const stats = inventoryData.items.reduce((acc, item) => {
      acc.total += 1
      acc.totalValue += item.totalValue
      
      switch (item.status) {
        case 'NORMAL':
          acc.normal += 1
          break
        case 'LOW_STOCK':
          acc.lowStock += 1
          break
        case 'OVERSTOCK':
          acc.overstock += 1
          break
        case 'OUT_OF_STOCK':
          acc.outOfStock += 1
          break
      }
      
      return acc
    }, { total: 0, normal: 0, lowStock: 0, overstock: 0, outOfStock: 0, totalValue: 0 })
    
    return stats
  }

  const stats = getInventoryStats()

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
      title: '规格型号',
      dataIndex: 'specification',
      key: 'specification',
      width: 200,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (value: string) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: '库位',
      dataIndex: 'warehouseLocation',
      key: 'warehouseLocation',
      width: 180,
      ellipsis: true,
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 100,
      render: (value: number, record: InventoryItem) => (
        <Space>
          <span style={{ 
            fontWeight: 'bold',
            color: record.status === 'OUT_OF_STOCK' ? '#ff4d4f' : 
                   record.status === 'LOW_STOCK' ? '#faad14' : '#52c41a'
          }}>
            {value.toLocaleString()}
          </span>
          <span style={{ color: '#999' }}>{record.unit}</span>
        </Space>
      ),
    },
    {
      title: '库存状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: string) => {
        const config = stockStatusConfig[value as keyof typeof stockStatusConfig]
        return config ? (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        ) : value
      },
    },
    {
      title: '库存占用率',
      key: 'stockRate',
      width: 120,
      render: (_, record: InventoryItem) => {
        const rate = Math.round((record.currentStock / record.maxStock) * 100)
        return (
          <Progress
            percent={rate}
            size="small"
            strokeColor={
              rate < 30 ? '#ff4d4f' :
              rate < 60 ? '#faad14' :
              rate < 90 ? '#52c41a' : '#1890ff'
            }
            format={(percent) => `${percent}%`}
          />
        )
      },
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (value: number) => `¥${formatMoney(value)}`,
    },
    {
      title: '库存价值',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 120,
      render: (value: number) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          ¥{formatMoney(value)}
        </span>
      ),
    },
    {
      title: '最后入库',
      dataIndex: 'lastInDate',
      key: 'lastInDate',
      width: 120,
      render: (value: string) => value ? formatDate(value) : '-',
    },
    {
      title: '最后出库',
      dataIndex: 'lastOutDate',
      key: 'lastOutDate',
      width: 120,
      render: (value: string) => value ? formatDate(value) : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right' as const,
      render: (_, record: InventoryItem) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
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
  const handleViewDetail = (item: InventoryItem) => {
    setSelectedItem(item)
    setDetailModalVisible(true)
  }

  // 导出数据
  const handleExport = () => {
    message.success('导出功能开发中...')
  }

  return (
    <div className="page-container">
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存品种"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<InboxOutlined />}
              suffix="种"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存总价值"
              value={stats.totalValue}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
              formatter={(value) => `¥${formatMoney(Number(value))}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预警品种"
              value={stats.lowStock + stats.outOfStock}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<WarningOutlined />}
              suffix="种"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常库存"
              value={stats.normal}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
              suffix="种"
            />
          </Card>
        </Col>
      </Row>

      {/* 库存状态分布 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Badge status="success" />
              <span style={{ marginLeft: 8 }}>正常库存: {stats.normal}</span>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Badge status="warning" />
              <span style={{ marginLeft: 8 }}>库存不足: {stats.lowStock}</span>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Badge status="processing" />
              <span style={{ marginLeft: 8 }}>库存过多: {stats.overstock}</span>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Badge status="error" />
              <span style={{ marginLeft: 8 }}>缺货: {stats.outOfStock}</span>
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
              placeholder="物料分类"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilter('category', value)}
            >
              <Option value="钢材">钢材</Option>
              <Option value="油料">油料</Option>
              <Option value="机械配件">机械配件</Option>
              <Option value="电气设备">电气设备</Option>
              <Option value="标准件">标准件</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="仓库位置"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilter('warehouse', value)}
            >
              <Option value="A区">港口仓库A区</Option>
              <Option value="B区">港口仓库B区</Option>
              <Option value="C区">港口仓库C区</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="库存状态"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilter('status', value)}
            >
              <Option value="NORMAL">正常</Option>
              <Option value="LOW_STOCK">库存不足</Option>
              <Option value="OVERSTOCK">库存过多</Option>
              <Option value="OUT_OF_STOCK">缺货</Option>
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
                    category: '',
                    warehouse: '',
                    status: '',
                    dateRange: null,
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

      {/* 库存列表 */}
      <Card
        title={
          <Space>
            <InboxOutlined />
            库存查询
            <Tag color="blue">{inventoryData?.total || 0} 条记录</Tag>
          </Space>
        }
        extra={
          <Space>
            <Button
              icon={<BarChartOutlined />}
              onClick={() => navigate('/inventory/analysis')}
            >
              库存分析
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={inventoryData?.items || []}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1600 }}
          pagination={{
            total: inventoryData?.total || 0,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          rowClassName={(record) => {
            if (record.status === 'OUT_OF_STOCK') return 'row-error'
            if (record.status === 'LOW_STOCK') return 'row-warning'
            return ''
          }}
        />
      </Card>

      {/* 详情Modal */}
      <Modal
        title="库存详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedItem && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="基本信息" size="small">
                  <p><strong>物料编码：</strong>{selectedItem.materialCode}</p>
                  <p><strong>物料名称：</strong>{selectedItem.materialName}</p>
                  <p><strong>规格型号：</strong>{selectedItem.specification}</p>
                  <p><strong>物料分类：</strong>{selectedItem.category}</p>
                  <p><strong>计量单位：</strong>{selectedItem.unit}</p>
                  <p><strong>供应商：</strong>{selectedItem.supplier}</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="库存信息" size="small">
                  <p><strong>库位：</strong>{selectedItem.warehouseLocation}</p>
                  <p><strong>当前库存：</strong>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: selectedItem.status === 'OUT_OF_STOCK' ? '#ff4d4f' : 
                             selectedItem.status === 'LOW_STOCK' ? '#faad14' : '#52c41a'
                    }}>
                      {selectedItem.currentStock} {selectedItem.unit}
                    </span>
                  </p>
                  <p><strong>安全库存：</strong>{selectedItem.safetyStock} {selectedItem.unit}</p>
                  <p><strong>最大库存：</strong>{selectedItem.maxStock} {selectedItem.unit}</p>
                  <p><strong>库存状态：</strong>
                    {(() => {
                      const config = stockStatusConfig[selectedItem.status as keyof typeof stockStatusConfig]
                      return config ? (
                        <Tag color={config.color} icon={config.icon}>
                          {config.text}
                        </Tag>
                      ) : selectedItem.status
                    })()}
                  </p>
                </Card>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title="价值信息" size="small">
                  <p><strong>单价：</strong>¥{formatMoney(selectedItem.unitPrice)}</p>
                  <p><strong>库存价值：</strong>
                    <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                      ¥{formatMoney(selectedItem.totalValue)}
                    </span>
                  </p>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="出入库信息" size="small">
                  <p><strong>最后入库：</strong>{selectedItem.lastInDate ? formatDate(selectedItem.lastInDate) : '-'}</p>
                  <p><strong>最后出库：</strong>{selectedItem.lastOutDate ? formatDate(selectedItem.lastOutDate) : '-'}</p>
                </Card>
              </Col>
            </Row>
            
            {selectedItem.remarks && (
              <Card title="备注信息" size="small" style={{ marginTop: 16 }}>
                <p>{selectedItem.remarks}</p>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default InventoryQueryList
