import React, { useState } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Button, 
  Space, 
  Statistic, 
  Progress,
  Table,
  Tag,
  Tooltip,
  message,
  Tabs,
  Alert
} from 'antd'
import { 
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ReloadOutlined,
  ExportOutlined,
  DollarOutlined,
  InboxOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { formatMoney, formatDate } from '@/utils'
import type { InventoryAnalysis } from '@/types'
import dayjs from 'dayjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
)

const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const InventoryAnalysisList: React.FC = () => {
  const [analysisParams, setAnalysisParams] = useState({
    dateRange: [dayjs().subtract(6, 'month'), dayjs()] as any,
    warehouse: '',
    category: '',
    analysisType: 'ABC',
  })

  // 获取库存分析数据（模拟）
  const { data: analysisData, isLoading, refetch } = useQuery({
    queryKey: ['inventory-analysis', analysisParams],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟分析数据
      const mockData: InventoryAnalysis = {
        summary: {
          totalValue: 25800000,
          totalItems: 156,
          turnoverRate: 4.2,
          averageAge: 45,
          deadStockValue: 1200000,
          deadStockItems: 12,
          lowStockItems: 8,
          overstockItems: 15,
        },
        abcAnalysis: {
          aItems: {
            count: 31,
            percentage: 20,
            value: 20640000,
            valuePercentage: 80,
          },
          bItems: {
            count: 47,
            percentage: 30,
            value: 3870000,
            valuePercentage: 15,
          },
          cItems: {
            count: 78,
            percentage: 50,
            value: 1290000,
            valuePercentage: 5,
          },
        },
        turnoverAnalysis: [
          { month: '2025-02', turnoverRate: 3.8, value: 24500000 },
          { month: '2025-03', turnoverRate: 4.1, value: 25200000 },
          { month: '2025-04', turnoverRate: 4.3, value: 25600000 },
          { month: '2025-05', turnoverRate: 4.0, value: 25100000 },
          { month: '2025-06', turnoverRate: 4.5, value: 26200000 },
          { month: '2025-07', turnoverRate: 4.2, value: 25800000 },
          { month: '2025-08', turnoverRate: 4.2, value: 25800000 },
        ],
        categoryAnalysis: [
          { category: '钢材', value: 8500000, percentage: 33, items: 45, turnover: 5.2 },
          { category: '机械配件', value: 6200000, percentage: 24, items: 38, turnover: 4.8 },
          { category: '电气设备', value: 4800000, percentage: 19, items: 28, turnover: 3.9 },
          { category: '油料', value: 3200000, percentage: 12, items: 22, turnover: 6.1 },
          { category: '标准件', value: 2100000, percentage: 8, items: 18, turnover: 4.5 },
          { category: '其他', value: 1000000, percentage: 4, items: 5, turnover: 2.8 },
        ],
        ageAnalysis: [
          { ageRange: '0-30天', items: 68, percentage: 44, value: 12800000 },
          { ageRange: '31-60天', items: 42, percentage: 27, value: 8200000 },
          { ageRange: '61-90天', items: 28, percentage: 18, value: 3500000 },
          { ageRange: '91-180天', items: 12, percentage: 8, value: 1100000 },
          { ageRange: '180天以上', items: 6, percentage: 3, value: 200000 },
        ],
        topItems: [
          {
            materialCode: 'MAT001',
            materialName: '钢丝绳',
            category: '钢材',
            value: 2500000,
            turnover: 6.2,
            age: 25,
            status: 'A类物料',
          },
          {
            materialCode: 'MAT015',
            materialName: '起重机电机',
            category: '机械配件',
            value: 1800000,
            turnover: 4.8,
            age: 35,
            status: 'A类物料',
          },
          {
            materialCode: 'MAT008',
            materialName: '变频器',
            category: '电气设备',
            value: 1200000,
            turnover: 3.9,
            age: 42,
            status: 'A类物料',
          },
          {
            materialCode: 'MAT022',
            materialName: '液压缸',
            category: '机械配件',
            value: 980000,
            turnover: 5.1,
            age: 28,
            status: 'A类物料',
          },
          {
            materialCode: 'MAT005',
            materialName: '螺栓',
            category: '标准件',
            value: 850000,
            turnover: 8.5,
            age: 15,
            status: 'B类物料',
          },
        ],
        deadStockItems: [
          {
            materialCode: 'MAT045',
            materialName: '旧型号轴承',
            category: '机械配件',
            value: 450000,
            age: 285,
            lastMovement: '2024-11-15',
            reason: '型号淘汰',
          },
          {
            materialCode: 'MAT067',
            materialName: '老式电缆',
            category: '电气设备',
            value: 320000,
            age: 245,
            lastMovement: '2024-12-20',
            reason: '规格不符',
          },
          {
            materialCode: 'MAT089',
            materialName: '过期润滑油',
            category: '油料',
            value: 180000,
            age: 195,
            lastMovement: '2025-01-10',
            reason: '已过期',
          },
        ],
      }
      
      return mockData
    },
  })

  // 处理参数变化
  const handleParamChange = (key: string, value: any) => {
    setAnalysisParams(prev => ({ ...prev, [key]: value }))
  }

  // 导出分析报告
  const handleExport = () => {
    message.success('分析报告导出功能开发中...')
  }

  // ABC分析图表数据
  const abcChartData = {
    labels: ['A类物料', 'B类物料', 'C类物料'],
    datasets: [
      {
        label: '物料数量',
        data: [
          analysisData?.abcAnalysis.aItems.count || 0,
          analysisData?.abcAnalysis.bItems.count || 0,
          analysisData?.abcAnalysis.cItems.count || 0,
        ],
        backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
        borderWidth: 2,
      },
    ],
  }

  // 周转率趋势图表数据
  const turnoverChartData = {
    labels: analysisData?.turnoverAnalysis.map(item => item.month.substring(5)) || [],
    datasets: [
      {
        label: '库存周转率',
        data: analysisData?.turnoverAnalysis.map(item => item.turnoverRate) || [],
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        tension: 0.4,
      },
    ],
  }

  // 分类分析图表数据
  const categoryChartData = {
    labels: analysisData?.categoryAnalysis.map(item => item.category) || [],
    datasets: [
      {
        data: analysisData?.categoryAnalysis.map(item => item.value) || [],
        backgroundColor: [
          '#ff6b6b',
          '#4ecdc4',
          '#45b7d1',
          '#96ceb4',
          '#feca57',
          '#ff9ff3',
        ],
        borderWidth: 2,
      },
    ],
  }

  // 库龄分析图表数据
  const ageChartData = {
    labels: analysisData?.ageAnalysis.map(item => item.ageRange) || [],
    datasets: [
      {
        label: '物料数量',
        data: analysisData?.ageAnalysis.map(item => item.items) || [],
        backgroundColor: [
          '#52c41a',
          '#1890ff',
          '#faad14',
          '#ff7a45',
          '#ff4d4f',
        ],
        borderWidth: 1,
      },
    ],
  }

  // 高价值物料表格列
  const topItemsColumns = [
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 150,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (value: string) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: '库存价值',
      dataIndex: 'value',
      key: 'value',
      width: 120,
      render: (value: number) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          ¥{formatMoney(value)}
        </span>
      ),
    },
    {
      title: '周转率',
      dataIndex: 'turnover',
      key: 'turnover',
      width: 100,
      render: (value: number) => (
        <span style={{ 
          color: value >= 5 ? '#52c41a' : value >= 3 ? '#faad14' : '#ff4d4f' 
        }}>
          {value}
        </span>
      ),
    },
    {
      title: '库龄(天)',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      render: (value: number) => (
        <span style={{ 
          color: value <= 30 ? '#52c41a' : value <= 60 ? '#faad14' : '#ff4d4f' 
        }}>
          {value}
        </span>
      ),
    },
    {
      title: 'ABC分类',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: string) => {
        const color = value.includes('A') ? 'red' : value.includes('B') ? 'orange' : 'green'
        return <Tag color={color}>{value}</Tag>
      },
    },
  ]

  // 呆滞库存表格列
  const deadStockColumns = [
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 150,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (value: string) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: '库存价值',
      dataIndex: 'value',
      key: 'value',
      width: 120,
      render: (value: number) => (
        <span style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
          ¥{formatMoney(value)}
        </span>
      ),
    },
    {
      title: '库龄(天)',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      render: (value: number) => (
        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
          {value}
        </span>
      ),
    },
    {
      title: '最后流动',
      dataIndex: 'lastMovement',
      key: 'lastMovement',
      width: 120,
      render: (value: string) => formatDate(value),
    },
    {
      title: '呆滞原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 120,
      render: (value: string) => <Tag color="red">{value}</Tag>,
    },
  ]

  return (
    <div className="page-container">
      {/* 分析参数 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <RangePicker
              value={analysisParams.dateRange}
              onChange={(dates) => handleParamChange('dateRange', dates)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="仓库"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleParamChange('warehouse', value)}
            >
              <Option value="A区">港口仓库A区</Option>
              <Option value="B区">港口仓库B区</Option>
              <Option value="C区">港口仓库C区</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="物料分类"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleParamChange('category', value)}
            >
              <Option value="钢材">钢材</Option>
              <Option value="机械配件">机械配件</Option>
              <Option value="电气设备">电气设备</Option>
              <Option value="油料">油料</Option>
              <Option value="标准件">标准件</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              value={analysisParams.analysisType}
              style={{ width: '100%' }}
              onChange={(value) => handleParamChange('analysisType', value)}
            >
              <Option value="ABC">ABC分析</Option>
              <Option value="TURNOVER">周转率分析</Option>
              <Option value="AGE">库龄分析</Option>
              <Option value="CATEGORY">分类分析</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button 
                type="primary" 
                icon={<BarChartOutlined />}
                onClick={() => refetch()}
                loading={isLoading}
              >
                分析
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => {
                  setAnalysisParams({
                    dateRange: [dayjs().subtract(6, 'month'), dayjs()],
                    warehouse: '',
                    category: '',
                    analysisType: 'ABC',
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

      {/* 分析概览 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存总价值"
              value={analysisData?.summary.totalValue || 0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DollarOutlined />}
              formatter={(value) => `¥${formatMoney(Number(value))}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存周转率"
              value={analysisData?.summary.turnoverRate || 0}
              valueStyle={{ 
                color: (analysisData?.summary.turnoverRate || 0) >= 4 ? '#52c41a' : '#faad14' 
              }}
              prefix={<DollarOutlined />}
              suffix="次/年"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均库龄"
              value={analysisData?.summary.averageAge || 0}
              valueStyle={{ 
                color: (analysisData?.summary.averageAge || 0) <= 45 ? '#52c41a' : '#ff4d4f' 
              }}
              prefix={<ClockCircleOutlined />}
              suffix="天"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="呆滞库存"
              value={analysisData?.summary.deadStockValue || 0}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<WarningOutlined />}
              formatter={(value) => `¥${formatMoney(Number(value))}`}
            />
          </Card>
        </Col>
      </Row>

      {/* 库存健康度 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>库存周转率</div>
              <Progress
                type="circle"
                size={80}
                percent={Math.min(((analysisData?.summary.turnoverRate || 0) / 6) * 100, 100)}
                strokeColor={
                  (analysisData?.summary.turnoverRate || 0) >= 5 ? '#52c41a' :
                  (analysisData?.summary.turnoverRate || 0) >= 3 ? '#faad14' : '#ff4d4f'
                }
                format={() => `${analysisData?.summary.turnoverRate || 0}`}
              />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>库存健康度</div>
              <Progress
                type="circle"
                size={80}
                percent={85}
                strokeColor="#52c41a"
                format={() => '良好'}
              />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>呆滞率</div>
              <Progress
                type="circle"
                size={80}
                percent={Math.round(((analysisData?.summary.deadStockItems || 0) / (analysisData?.summary.totalItems || 1)) * 100)}
                strokeColor="#ff4d4f"
                format={(percent) => `${percent}%`}
              />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>预警率</div>
              <Progress
                type="circle"
                size={80}
                percent={Math.round((((analysisData?.summary.lowStockItems || 0) + (analysisData?.summary.overstockItems || 0)) / (analysisData?.summary.totalItems || 1)) * 100)}
                strokeColor="#faad14"
                format={(percent) => `${percent}%`}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 分析图表 */}
      <Tabs defaultActiveKey="abc" style={{ marginBottom: 16 }}>
        <TabPane tab="ABC分析" key="abc">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="ABC分类分布" size="small">
                <div style={{ height: 300 }}>
                  <Pie data={abcChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="ABC分析统计" size="small">
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b' }}>
                        {analysisData?.abcAnalysis.aItems.count || 0}
                      </div>
                      <div style={{ color: '#666' }}>A类物料</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        价值占比 {analysisData?.abcAnalysis.aItems.valuePercentage || 0}%
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ecdc4' }}>
                        {analysisData?.abcAnalysis.bItems.count || 0}
                      </div>
                      <div style={{ color: '#666' }}>B类物料</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        价值占比 {analysisData?.abcAnalysis.bItems.valuePercentage || 0}%
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#45b7d1' }}>
                        {analysisData?.abcAnalysis.cItems.count || 0}
                      </div>
                      <div style={{ color: '#666' }}>C类物料</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        价值占比 {analysisData?.abcAnalysis.cItems.valuePercentage || 0}%
                      </div>
                    </div>
                  </Col>
                </Row>
                <Alert
                  message="ABC分析建议"
                  description="A类物料需要重点管控，B类物料适度管控，C类物料简化管理。建议对A类物料实施精细化库存管理。"
                  type="info"
                  showIcon
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="周转率分析" key="turnover">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="库存周转率趋势" size="small">
                <div style={{ height: 300 }}>
                  <Line data={turnoverChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="周转率评价" size="small">
                <div style={{ padding: '20px 0' }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 8 }}>
                      当前周转率: {analysisData?.summary.turnoverRate || 0} 次/年
                    </div>
                    <Progress
                      percent={Math.min(((analysisData?.summary.turnoverRate || 0) / 6) * 100, 100)}
                      strokeColor={
                        (analysisData?.summary.turnoverRate || 0) >= 5 ? '#52c41a' :
                        (analysisData?.summary.turnoverRate || 0) >= 3 ? '#faad14' : '#ff4d4f'
                      }
                    />
                  </div>
                  <Alert
                    message="周转率评价"
                    description={
                      (analysisData?.summary.turnoverRate || 0) >= 5 ? 
                      "周转率良好，库存管理效率较高" :
                      (analysisData?.summary.turnoverRate || 0) >= 3 ?
                      "周转率一般，有优化空间" :
                      "周转率偏低，需要优化库存结构"
                    }
                    type={
                      (analysisData?.summary.turnoverRate || 0) >= 5 ? 'success' :
                      (analysisData?.summary.turnoverRate || 0) >= 3 ? 'warning' : 'error'
                    }
                    showIcon
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="分类分析" key="category">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="分类价值分布" size="small">
                <div style={{ height: 300 }}>
                  <Doughnut data={categoryChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="分类详细统计" size="small">
                <Table
                  columns={[
                    { title: '分类', dataIndex: 'category', key: 'category' },
                    { 
                      title: '价值', 
                      dataIndex: 'value', 
                      key: 'value',
                      render: (value: number) => `¥${formatMoney(value)}`
                    },
                    { 
                      title: '占比', 
                      dataIndex: 'percentage', 
                      key: 'percentage',
                      render: (value: number) => `${value}%`
                    },
                    { 
                      title: '周转率', 
                      dataIndex: 'turnover', 
                      key: 'turnover',
                      render: (value: number) => (
                        <span style={{ 
                          color: value >= 5 ? '#52c41a' : value >= 3 ? '#faad14' : '#ff4d4f' 
                        }}>
                          {value}
                        </span>
                      )
                    },
                  ]}
                  dataSource={analysisData?.categoryAnalysis || []}
                  rowKey="category"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="库龄分析" key="age">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="库龄分布" size="small">
                <div style={{ height: 300 }}>
                  <Bar data={ageChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="库龄健康度" size="small">
                <div style={{ padding: '20px 0' }}>
                  {analysisData?.ageAnalysis.map((item, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>{item.ageRange}</span>
                        <span>{item.items} 种 ({item.percentage}%)</span>
                      </div>
                      <Progress
                        percent={item.percentage}
                        strokeColor={
                          index === 0 ? '#52c41a' :
                          index === 1 ? '#1890ff' :
                          index === 2 ? '#faad14' :
                          index === 3 ? '#ff7a45' : '#ff4d4f'
                        }
                        showInfo={false}
                      />
                    </div>
                  ))}
                  <Alert
                    message="库龄建议"
                    description="建议重点关注90天以上的库存，考虑促销或处置措施。"
                    type="warning"
                    showIcon
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 详细分析表格 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card 
            title={
              <Space>
                <FireOutlined />
                高价值物料 TOP5
              </Space>
            } 
            size="small"
          >
            <Table
              columns={topItemsColumns}
              dataSource={analysisData?.topItems || []}
              rowKey="materialCode"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title={
              <Space>
                <WarningOutlined />
                呆滞库存
              </Space>
            } 
            size="small"
          >
            <Table
              columns={deadStockColumns}
              dataSource={analysisData?.deadStockItems || []}
              rowKey="materialCode"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default InventoryAnalysisList
