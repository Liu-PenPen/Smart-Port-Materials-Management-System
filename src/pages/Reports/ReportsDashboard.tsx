import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import {
  InboxOutlined,
  WarningOutlined,
  DollarOutlined,
  TruckOutlined,
  FileTextOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
  AlertOutlined,
  BankOutlined,
  ContainerOutlined,
  HomeOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatMoney } from '@/utils'
import { HOME_URL } from '@/config/config'
// import dataScreenTitle from './images/dataScreen-title.png'
import {
  InventoryQueryChart,
  InventoryAlertChart,
  RequisitionStatsChart,
  OutboundQueryChart,
  MaterialLedgerChart,
  FinancialReportChart,
  MaterialMonthlyChart,
  InventoryAgeChart,
  CostAnalysisChart,
  PortOverviewChart,
  CategoryDistributionChart
} from './components'
import SystemConfigDrawer, { SystemConfig } from './components/SystemConfigDrawer'
import './ReportsDashboard.css'

const ReportsDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const dataScreenRef = useRef<HTMLDivElement>(null)

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 浏览器监听 resize 事件
  const resize = () => {
    // CSS已经处理了背景图片的自适应，这里只需要处理特殊逻辑
    if (dataScreenRef.current) {
      // 强制重新计算布局
      dataScreenRef.current.style.display = 'none'
      dataScreenRef.current.offsetHeight // 触发重排
      dataScreenRef.current.style.display = 'flex'
    }
  }

  // 处理返回首页
  const handleToHome = () => {
    navigate(HOME_URL)
  }

  useLayoutEffect(() => {
    // 为浏览器绑定事件
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  // 处理系统配置变化
  const handleConfigChange = (config: SystemConfig) => {
    setSystemConfig(config)

    // 根据配置应用样式变化
    if (dataScreenRef.current) {
      const container = dataScreenRef.current

      // 紧凑模式
      if (config.compactMode) {
        container.classList.add('compact-mode')
      } else {
        container.classList.remove('compact-mode')
      }

      // 全屏模式
      if (config.fullScreenMode) {
        container.classList.add('fullscreen-mode')
      } else {
        container.classList.remove('fullscreen-mode')
      }

      // 背景效果
      if (!config.showBackground) {
        container.classList.add('no-background')
      } else {
        container.classList.remove('no-background')
      }

      // 动画效果
      if (!config.showAnimations) {
        container.classList.add('no-animations')
      } else {
        container.classList.remove('no-animations')
      }
    }
  }

  // 获取驾驶舱数据（模拟）
  const { data: dashboardData } = useQuery({
    queryKey: ['reports-dashboard'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        overview: {
          totalValue: 25800000,
          totalItems: 156,
          alertItems: 12,
          turnoverRate: 4.2,
          monthlyInbound: 1250000,
          monthlyOutbound: 980000,
          pendingRequests: 8,
          lowStockItems: 15,
        },
        trends: {
          inventoryTrend: [85, 88, 82, 90, 87, 92, 89],
          costTrend: [120, 135, 128, 142, 138, 155, 148],
          turnoverTrend: [3.8, 4.1, 4.3, 4.0, 4.5, 4.2, 4.2],
        },
        categories: [
          { name: '钢材', value: 8500000, percentage: 33, status: 'normal' },
          { name: '机械配件', value: 6200000, percentage: 24, status: 'warning' },
          { name: '电气设备', value: 4800000, percentage: 19, status: 'normal' },
          { name: '油料', value: 3200000, percentage: 12, status: 'alert' },
          { name: '标准件', value: 2100000, percentage: 8, status: 'normal' },
          { name: '其他', value: 1000000, percentage: 4, status: 'normal' },
        ],
        alerts: [
          { type: 'critical', count: 3, message: '紧急缺货预警' },
          { type: 'warning', count: 9, message: '库存不足预警' },
          { type: 'info', count: 5, message: '库存过多提醒' },
        ]
      }
    },
  })

  // 报表模块配置
  const reportModules = [
    {
      id: 'inventory-query',
      title: '库存查询',
      icon: <InboxOutlined />,
      description: '实时库存查询统计',
      path: '/inventory',
      color: '#1890ff',
      component: <InventoryQueryChart />
    },
    {
      id: 'inventory-alert',
      title: '库存预警及预计采购分析',
      icon: <WarningOutlined />,
      description: '库存预警与采购分析',
      path: '/inventory/alert',
      color: '#ff4d4f',
      component: <InventoryAlertChart />
    },
    {
      id: 'requisition-stats',
      title: '领用查询统计',
      icon: <ShoppingCartOutlined />,
      description: '物资领用统计分析',
      path: '/reports/requisition',
      color: '#52c41a',
      component: <RequisitionStatsChart />
    },
    {
      id: 'outbound-query',
      title: '出库领用查询',
      icon: <TruckOutlined />,
      description: '出库领用明细查询',
      path: '/reports/outbound',
      color: '#faad14',
      component: <OutboundQueryChart />
    },
    {
      id: 'material-ledger',
      title: '物资出入明细账目',
      icon: <FileTextOutlined />,
      description: '物资出入库明细账',
      path: '/reports/ledger',
      color: '#722ed1',
      component: <MaterialLedgerChart />
    },
    {
      id: 'financial-report',
      title: '财务资金月报表',
      icon: <BankOutlined />,
      description: '财务资金月度报表',
      path: '/reports/financial',
      color: '#13c2c2',
      component: <FinancialReportChart />
    },
    {
      id: 'material-monthly',
      title: '物资明细月报表',
      icon: <ContainerOutlined />,
      description: '物资明细月度报表',
      path: '/reports/material-monthly',
      color: '#eb2f96',
      component: <MaterialMonthlyChart />
    },
    {
      id: 'age-analysis',
      title: '库龄分析表',
      icon: <ClockCircleOutlined />,
      description: '库存库龄分析报表',
      path: '/inventory/analysis',
      color: '#f5222d',
      component: <InventoryAgeChart />
    },
    {
      id: 'cost-analysis',
      title: '成本分类分析报表',
      icon: <PieChartOutlined />,
      description: '成本分类分析报表',
      path: '/reports/cost-analysis',
      color: '#fa8c16',
      component: <CostAnalysisChart />
    }
  ]

  // 处理模块点击
  const handleModuleClick = (module: any) => {
    navigate(module.path)
  }

  return (
    <div className="dataScreen-container">
      <div className="dataScreen" ref={dataScreenRef}>
        <div className="dataScreen-header">
          <div className="header-lf">
            <span className="header-screening" onClick={handleToHome}>
              首页
            </span>
          </div>
          <div className="header-ct">
            <div className="header-ct-title">
              <span>智慧港口物资管理</span>
              <div className="header-ct-warning">
                系统预警信息（{dashboardData?.alerts.reduce((sum, alert) => sum + alert.count, 0) || 0}条）
              </div>
            </div>
          </div>
          <div className="header-rg">
            <span className="header-download">统计报告</span>
            <div className="header-time">
              {currentTime.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
        </div>

        <div className="dataScreen-main">
          <div className="dataScreen-lf">
            {reportModules.slice(0, 3).map((module, moduleIndex) => (
              <div
                key={module.id}
                className={`dataScreen-${moduleIndex === 0 ? 'top' : moduleIndex === 1 ? 'center' : 'bottom'}`}
                onClick={() => handleModuleClick(module)}
              >
                <div className="dataScreen-main-title">
                  <span>{module.title}</span>
                  <img src="/images/dataScreen-title.png" alt="" />
                </div>
                <div className="dataScreen-main-chart">
                  {module.component}
                </div>
              </div>
            ))}

          </div>
          <div className="dataScreen-ct">
            <div className="dataScreen-map">
              <div className="dataScreen-map-title">港口物资管理全景</div>
              <PortOverviewChart data={{
                totalItems: dashboardData?.overview.totalItems || 0,
                totalValue: dashboardData?.overview.totalValue || 0,
                alertItems: dashboardData?.overview.alertItems || 0,
                portName: '福州江阴港',
                portNameEn: 'Fuzhou Jiangyin Port'
              }} />
            </div>
            <div className="dataScreen-cb">
              <div className="dataScreen-main-title">
                <span>库存分布统计</span>
                <img src="/images/dataScreen-title.png" alt="" />
              </div>
              <div className="dataScreen-main-chart">
                <CategoryDistributionChart data={{
                  categories: dashboardData?.categories || [],
                  totalValue: dashboardData?.overview.totalValue || 0
                }} />
              </div>
            </div>
          </div>

          <div className="dataScreen-rg">
            {reportModules.slice(3, 6).map((module, moduleIndex) => (
              <div
                key={module.id}
                className={`dataScreen-${moduleIndex === 0 ? 'top' : moduleIndex === 1 ? 'center' : 'bottom'}`}
                onClick={() => handleModuleClick(module)}
              >
                <div className="dataScreen-main-title">
                  <span>{module.title}</span>
                  <img src="/images/dataScreen-title.png" alt="" />
                </div>
                <div className="dataScreen-main-chart">
                  {module.component}
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsDashboard
