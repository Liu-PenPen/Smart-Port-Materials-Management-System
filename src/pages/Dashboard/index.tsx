import React from 'react'
import { Row, Col, Card, Statistic, Table, Progress, Tag } from 'antd'
import { 
  ShoppingCartOutlined, 
  InboxOutlined, 
  ExportOutlined,
  AlertOutlined,
  DollarOutlined
} from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import ReactECharts from 'echarts-for-react'
import { useQuery } from '@tanstack/react-query'
// import { request } from '@/services/api' // 暂时注释，使用模拟数据
import './index.css'

interface DashboardData {
  statistics: {
    totalApplications: number
    pendingApprovals: number
    totalInventoryValue: number
    alertCount: number
    monthlyPurchase: number
    monthlyOutbound: number
  }
  recentApplications: any[]
  inventoryAlerts: any[]
  purchaseTrend: any[]
  categoryDistribution: any[]
}

const Dashboard: React.FC = () => {
  // 获取仪表板数据（模拟数据）
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 返回模拟数据
      const mockData: DashboardData = {
        statistics: {
          totalApplications: 156,
          pendingApprovals: 23,
          totalInventoryValue: 2580.5,
          alertCount: 8,
          monthlyPurchase: 450.2,
          monthlyOutbound: 320.8
        },
        recentApplications: [
          {
            id: 1,
            applicationNo: 'APP202401001',
            applicantName: '张三',
            applicationDate: '2024-01-15',
            status: 'SUBMITTED'
          },
          {
            id: 2,
            applicationNo: 'APP202401002',
            applicantName: '李四',
            applicationDate: '2024-01-14',
            status: 'APPROVED'
          },
          {
            id: 3,
            applicationNo: 'APP202401003',
            applicantName: '王五',
            applicationDate: '2024-01-13',
            status: 'DRAFT'
          }
        ],
        inventoryAlerts: [
          {
            id: 1,
            materialName: '办公用纸A4',
            currentQuantity: 50,
            minQuantity: 100,
            alertLevel: 'HIGH'
          },
          {
            id: 2,
            materialName: '打印机墨盒',
            currentQuantity: 8,
            minQuantity: 10,
            alertLevel: 'MEDIUM'
          },
          {
            id: 3,
            materialName: '文件夹',
            currentQuantity: 15,
            minQuantity: 20,
            alertLevel: 'LOW'
          }
        ],
        purchaseTrend: [
          { month: '2023-07', amount: 380.5 },
          { month: '2023-08', amount: 420.3 },
          { month: '2023-09', amount: 350.8 },
          { month: '2023-10', amount: 480.2 },
          { month: '2023-11', amount: 520.6 },
          { month: '2023-12', amount: 450.2 }
        ],
        categoryDistribution: [
          { name: '办公用品', value: 35 },
          { name: '设备器材', value: 28 },
          { name: '维修材料', value: 22 },
          { name: '其他', value: 15 }
        ]
      }

      return mockData
    },
  })

  // 采购趋势图配置
  const purchaseTrendOption = {
    title: {
      text: '月度采购趋势',
      left: 'center',
      textStyle: { fontSize: 14 }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>{a}: ¥{c}'
    },
    xAxis: {
      type: 'category',
      data: dashboardData?.purchaseTrend?.map(item => item.month) || []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '¥{value}'
      }
    },
    series: [{
      name: '采购金额',
      type: 'line',
      smooth: true,
      data: dashboardData?.purchaseTrend?.map(item => item.amount) || [],
      itemStyle: { color: '#1890ff' },
      areaStyle: { opacity: 0.3 }
    }]
  }

  // 物资分类分布图配置
  const categoryDistributionOption = {
    title: {
      text: '物资分类分布',
      left: 'center',
      textStyle: { fontSize: 14 }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a}<br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: '物资分类',
      type: 'pie',
      radius: ['40%', '70%'],
      data: dashboardData?.categoryDistribution || [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }

  // 最近申请列表列配置
  const applicationColumns = [
    {
      title: '申请单号',
      dataIndex: 'applicationNo',
      key: 'applicationNo',
      width: 120,
    },
    {
      title: '申请人',
      dataIndex: 'applicantName',
      key: 'applicantName',
      width: 100,
    },
    {
      title: '申请日期',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const statusMap = {
          'DRAFT': { color: 'default', text: '草稿' },
          'SUBMITTED': { color: 'processing', text: '已提交' },
          'APPROVED': { color: 'success', text: '已审批' },
          'REJECTED': { color: 'error', text: '已拒绝' },
        }
        const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
  ]

  // 库存预警列表列配置
  const alertColumns = [
    {
      title: '物资名称',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: '当前库存',
      dataIndex: 'currentQuantity',
      key: 'currentQuantity',
      width: 100,
    },
    {
      title: '预警下限',
      dataIndex: 'minQuantity',
      key: 'minQuantity',
      width: 100,
    },
    {
      title: '预警级别',
      dataIndex: 'alertLevel',
      key: 'alertLevel',
      width: 100,
      render: (level: string) => {
        const levelMap = {
          'HIGH': { color: 'red', text: '严重' },
          'MEDIUM': { color: 'orange', text: '中等' },
          'LOW': { color: 'yellow', text: '轻微' },
        }
        const config = levelMap[level as keyof typeof levelMap] || { color: 'default', text: level }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
  ]

  return (
    <div className="dashboard-container">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="dashboard-stats">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="本月申请"
              value={dashboardData?.statistics.totalApplications || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审批"
              value={dashboardData?.statistics.pendingApprovals || 0}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="库存总值"
              value={dashboardData?.statistics.totalInventoryValue || 0}
              prefix={<InboxOutlined />}
              precision={2}
              suffix="万元"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="库存预警"
              value={dashboardData?.statistics.alertCount || 0}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className="dashboard-charts">
        <Col xs={24} lg={16}>
          <ProCard title="采购趋势分析" loading={isLoading}>
            <ReactECharts 
              option={purchaseTrendOption} 
              style={{ height: '300px' }}
              opts={{ renderer: 'svg' }}
            />
          </ProCard>
        </Col>
        <Col xs={24} lg={8}>
          <ProCard title="物资分类分布" loading={isLoading}>
            <ReactECharts 
              option={categoryDistributionOption} 
              style={{ height: '300px' }}
              opts={{ renderer: 'svg' }}
            />
          </ProCard>
        </Col>
      </Row>

      {/* 数据表格区域 */}
      <Row gutter={[16, 16]} className="dashboard-tables">
        <Col xs={24} lg={12}>
          <ProCard title="最近申请" loading={isLoading}>
            <Table
              columns={applicationColumns}
              dataSource={dashboardData?.recentApplications || []}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </ProCard>
        </Col>
        <Col xs={24} lg={12}>
          <ProCard title="库存预警" loading={isLoading}>
            <Table
              columns={alertColumns}
              dataSource={dashboardData?.inventoryAlerts || []}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </ProCard>
        </Col>
      </Row>

      {/* 快捷操作区域 */}
      <Row gutter={[16, 16]} className="dashboard-actions">
        <Col span={24}>
          <ProCard title="快捷操作">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8} md={6}>
                <Card 
                  hoverable 
                  className="action-card"
                  onClick={() => window.location.href = '/cargo/material-request/new'}
                >
                  <div className="action-content">
                    <ShoppingCartOutlined className="action-icon" />
                    <div className="action-text">新建申请</div>
                  </div>
                </Card>
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Card 
                  hoverable 
                  className="action-card"
                  onClick={() => window.location.href = '/cargo/material-purchase/new'}
                >
                  <div className="action-content">
                    <ShoppingCartOutlined className="action-icon" />
                    <div className="action-text">创建采购</div>
                  </div>
                </Card>
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Card 
                  hoverable 
                  className="action-card"
                  onClick={() => window.location.href = '/inventory'}
                >
                  <div className="action-content">
                    <InboxOutlined className="action-icon" />
                    <div className="action-text">库存查询</div>
                  </div>
                </Card>
              </Col>
              <Col xs={12} sm={8} md={6}>
                <Card
                  hoverable
                  className="action-card"
                  onClick={() => window.location.href = '/reports/dashboard'}
                >
                  <div className="action-content">
                    <DollarOutlined className="action-icon" />
                    <div className="action-text">驾驶舱</div>
                  </div>
                </Card>
              </Col>
            </Row>
          </ProCard>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
