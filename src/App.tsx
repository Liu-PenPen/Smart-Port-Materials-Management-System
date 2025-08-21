import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Space, Button, Tooltip } from 'antd'
import {
  DashboardOutlined,
  InboxOutlined,
  BankOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  ImportOutlined,
  ExportOutlined,
  AppstoreOutlined,
  AlertOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  ContainerOutlined,
  SwapOutlined,
  TeamOutlined,
  TrophyOutlined,
  SearchOutlined,
  AccountBookOutlined,
  SmileTwoTone,
  SkinOutlined
  
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate, useLocation } from 'react-router-dom'
import SystemConfigDrawer, { SystemConfig } from '@/components/SystemConfigDrawer'
import { useTheme } from '@/components/ThemeProvider'
import Footer from '@/components/Footer'
import '@/components/SystemConfigDrawer.css'
import '@/components/Footer.css'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import SupplierList from '@/pages/Supplier/SupplierList'
import SupplierForm from '@/pages/Supplier/SupplierForm'
import MaterialList from '@/pages/Material/MaterialList'
import MaterialForm from '@/pages/Material/MaterialForm'
import ApplicationList from '@/pages/Application/ApplicationList'
import ApplicationForm from '@/pages/Application/ApplicationForm'
import PurchaseList from '@/pages/Purchase/PurchaseList'
import PurchaseForm from '@/pages/Purchase/PurchaseForm'
import StorageInboundList from '@/pages/Storage/InboundList'
import StorageInboundDetail from '@/pages/Storage/InboundDetail'
import StorageInboundForm from '@/pages/Storage/InboundForm'
import StorageOutboundList from '@/pages/Storage/OutboundList'
import StorageOutboundDetail from '@/pages/Storage/OutboundDetail'
import StorageOutboundForm from '@/pages/Storage/OutboundForm'
import StorageTransferList from '@/pages/Storage/TransferList'
import StorageTransferDetail from '@/pages/Storage/TransferDetail'
import StorageTransferForm from '@/pages/Storage/TransferForm'

// 渠道管理
import GroupSupplierList from '@/pages/Channel/GroupSupplierList'
import GroupSupplierDetail from '@/pages/Channel/GroupSupplierDetail'
import GroupSupplierForm from '@/pages/Channel/GroupSupplierForm'
import SupplyCatalogManage from '@/pages/Channel/SupplyCatalogManage'
import SupplierAssessmentList from '@/pages/Channel/SupplierAssessmentList'
import SupplierAssessmentDetail from '@/pages/Channel/SupplierAssessmentDetail'
import SupplierAssessmentForm from '@/pages/Channel/SupplierAssessmentForm'

// 货物管理
import MaterialRequestList from '@/pages/Cargo/MaterialRequestList'
import MaterialRequestDetail from '@/pages/Cargo/MaterialRequestDetail'
import MaterialPurchaseList from '@/pages/Cargo/MaterialPurchaseList'
import MaterialPurchaseDetail from '@/pages/Cargo/MaterialPurchaseDetail'
import MaterialPurchaseForm from '@/pages/Cargo/MaterialPurchaseForm'
import PurchaseSettlementList from '@/pages/Cargo/PurchaseSettlementList'
import PurchaseSettlementDetail from '@/pages/Cargo/PurchaseSettlementDetail'
import PurchaseSettlementForm from '@/pages/Cargo/PurchaseSettlementForm'
import ArrivalManagementList from '@/pages/Cargo/ArrivalManagementList'
import ArrivalManagementDetail from '@/pages/Cargo/ArrivalManagementDetail'
import ArrivalManagementForm from '@/pages/Cargo/ArrivalManagementForm'
import MaterialTrackingList from '@/pages/Cargo/MaterialTrackingList'
import MaterialTrackingDetail from '@/pages/Cargo/MaterialTrackingDetail'
import MaterialTrackingForm from '@/pages/Cargo/MaterialTrackingForm'

// 库存管理
import InventoryQueryList from '@/pages/Inventory/InventoryQueryList'
import InventoryAlertList from '@/pages/Inventory/InventoryAlertList'
import InventoryAnalysisList from '@/pages/Inventory/InventoryAnalysisList'
import ReportCenter from '@/pages/Report/ReportCenter'
import ReportsDashboard from '@/pages/Reports/ReportsDashboard'

// 路由守卫组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

const { Header, Sider, Content } = Layout

// 主布局组件
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { themeConfig, setThemeConfig } = useTheme()

  // 系统配置状态
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    showBackground: true,
    showAnimations: true,
    showTooltips: true,
    showLegends: true,
    colorWeakness: false,
    compactMode: false,
    fullScreenMode: false,
    sidebarCollapsed: false,
    theme: 'light',
    primaryColor: '#1890ff',
    autoRefresh: true,
    soundAlerts: false,
    dataExport: true,
    realTimeUpdate: true,
    showFooter: true
  })

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement ||
        (document as any).mozFullScreenElement
      )

      // 如果全屏状态与配置不一致，更新配置
      if (isFullscreen !== systemConfig.fullScreenMode) {
        setSystemConfig(prev => ({
          ...prev,
          fullScreenMode: isFullscreen
        }))
      }
    }

    // 添加全屏状态变化监听器
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)

    return () => {
      // 清理监听器
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
    }
  }, [systemConfig.fullScreenMode])

  // 处理系统配置变化
  const handleConfigChange = (config: SystemConfig) => {
    setSystemConfig(config)

    // 应用配置变化
    const body = document.body

    // 侧边栏收起
    setSidebarCollapsed(config.sidebarCollapsed)

    // 主题切换 - 使用新的主题系统
    setThemeConfig({
      mode: config.theme,
      primaryColor: config.primaryColor
    })

    // 紧凑模式
    if (config.compactMode) {
      body.classList.add('compact-mode')
    } else {
      body.classList.remove('compact-mode')
    }

    // 全屏模式
    if (config.fullScreenMode) {
      body.classList.add('fullscreen-mode')
    } else {
      body.classList.remove('fullscreen-mode')
    }

    // 动画效果
    if (!config.showAnimations) {
      body.classList.add('no-animations')
    } else {
      body.classList.remove('no-animations')
    }

    // 色弱模式
    if (config.colorWeakness) {
      body.classList.add('color-weakness')
    } else {
      body.classList.remove('color-weakness')
    }

    // 全屏模式 - 使用浏览器全屏API
    if (config.fullScreenMode) {
      enterFullscreen()
    } else {
      exitFullscreen()
    }

    // 页脚显示控制已通过条件渲染实现，无需额外处理
  }

  // 进入全屏模式
  const enterFullscreen = () => {
    const element = document.documentElement
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if ((element as any).webkitRequestFullscreen) {
      // Safari
      (element as any).webkitRequestFullscreen()
    } else if ((element as any).msRequestFullscreen) {
      // IE/Edge
      (element as any).msRequestFullscreen()
    } else if ((element as any).mozRequestFullScreen) {
      // Firefox
      (element as any).mozRequestFullScreen()
    }
  }

  // 退出全屏模式
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      // Safari
      (document as any).webkitExitFullscreen()
    } else if ((document as any).msExitFullscreen) {
      // IE/Edge
      (document as any).msExitFullscreen()
    } else if ((document as any).mozCancelFullScreen) {
      // Firefox
      (document as any).mozCancelFullScreen()
    }
  }

  // 菜单项配置
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '工作台',
    },
    {
      key: 'master-data',
      icon: <AppstoreOutlined />,
      label: '渠道管理',
      children: [
        {
          key: '/supplier',
          icon: <TeamOutlined />,
          label: '供应商管理',
        },
        {
          key: '/channel/group-supplier',
          icon: <BankOutlined />,
          label: '集采供应商',
        },
        {
          key: '/channel/supplier-assessment',
          icon: <TrophyOutlined />,
          label: '供应商年度考核',
        },
      ],
    },
    {
      key: 'cargo',
      icon: <ContainerOutlined />,
      label: '货物管理',
      children: [
        {
          key: '/cargo/material-request',
          icon: <FileTextOutlined />,
          label: '物资申请',
        },
        {
          key: '/cargo/material-purchase',
          icon: <ShoppingCartOutlined />,
          label: '物资采购',
        },
        {
          key: '/cargo/purchase-settlement',
          icon: <AccountBookOutlined />,
          label: '物资采购结算',
        },
        {
          key: '/cargo/arrival-management',
          icon: <InboxOutlined />,
          label: '到货管理',
        },
        {
          key: '/cargo/material-tracking',
          icon: <SearchOutlined />,
          label: '物资追踪',
        },
      ],
    },
    {
      key: 'storage',
      icon: <ContainerOutlined />,
      label: '仓储管理',
      children: [
        {
          key: '/storage/inbound',
          icon: <ImportOutlined />,
          label: '入库管理',
        },
        {
          key: '/storage/outbound',
          icon: <ExportOutlined />,
          label: '出库管理',
        },
        {
          key: '/storage/transfer',
          icon: <SwapOutlined />,
          label: '移库管理',
        },
      ],
    },
    {
      key: 'inventory',
      icon: <InboxOutlined />,
      label: '库存管理',
      children: [
        {
          key: '/inventory',
          icon: <InboxOutlined />,
          label: '库存查询',
        },
        {
          key: '/inventory/alert',
          icon: <AlertOutlined />,
          label: '库存预警',
        },
      ],
    },
    {
      key: '/reports/dashboard',
      icon: <BarChartOutlined />,
      label: '报表中心',
    },
  ]

  // 用户菜单
  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="dark"
        width={256}
        collapsedWidth={80}
        collapsed={sidebarCollapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          transition: 'all 0.2s',
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: sidebarCollapsed ? 24 : 18,
          fontWeight: 'bold',
          padding: sidebarCollapsed ? '0 8px' : '0 16px'
        }}>
          {sidebarCollapsed ? '🚢' : '🚢智慧港口物资管理'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          inlineCollapsed={sidebarCollapsed}
          onClick={({ key }) => {
            if (key.startsWith('/')) {
              navigate(key)
            }
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: sidebarCollapsed ? 80 : 256, transition: 'margin-left 0.2s' }}>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <div></div>
          <Space>
            {/* 系统配置按钮 */}
            <Tooltip title="系统配置">
              <span
                onClick={() => setConfigDrawerVisible(true)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <SkinOutlined style={{ fontSize: 20 }}/>
                {/* <SmileTwoTone style={{ fontSize: 24 }} /> */}
              </span>
            </Tooltip>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserOutlined />} src={user?.avatar} />
                <span>{user?.name || '用户'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{
          margin: 0,
          minHeight: 'calc(100vh - 64px - 120px)',
          background: '#f0f2f5',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ flex: 1 }}>
            {children}
          </div>
        </Content>

        {/* 页脚 */}
        {systemConfig.showFooter && <Footer />}
      </Layout>

      {/* 系统配置抽屉 */}
      <SystemConfigDrawer
        visible={configDrawerVisible}
        onClose={() => setConfigDrawerVisible(false)}
        onConfigChange={handleConfigChange}
      />
    </Layout>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* 渠道管理 */}
                  <Route path="/supplier" element={<SupplierList />} />
                  <Route path="/supplier/new" element={<SupplierForm />} />
                  <Route path="/supplier/:id" element={<SupplierForm />} />

                  {/* 集采供应商 */}
                  <Route path="/channel/group-supplier" element={<GroupSupplierList />} />
                  <Route path="/channel/group-supplier/new" element={<GroupSupplierForm />} />
                  <Route path="/channel/group-supplier/edit/:id" element={<GroupSupplierForm />} />
                  <Route path="/channel/group-supplier/:id" element={<GroupSupplierDetail />} />
                  <Route path="/channel/group-supplier/:id/catalog" element={<SupplyCatalogManage />} />

                  {/* 供应商年度考核 */}
                  <Route path="/channel/supplier-assessment" element={<SupplierAssessmentList />} />
                  <Route path="/channel/supplier-assessment/new" element={<SupplierAssessmentForm />} />
                  <Route path="/channel/supplier-assessment/edit/:id" element={<SupplierAssessmentForm />} />
                  <Route path="/channel/supplier-assessment/:id" element={<SupplierAssessmentDetail />} />

                  {/* 货物管理 */}
                  <Route path="/cargo/material-request" element={<MaterialRequestList />} />
                  <Route path="/cargo/material-request/:id" element={<MaterialRequestDetail />} />
                  <Route path="/cargo/material-purchase" element={<MaterialPurchaseList />} />
                  <Route path="/cargo/material-purchase/new" element={<MaterialPurchaseForm />} />
                  <Route path="/cargo/material-purchase/edit/:id" element={<MaterialPurchaseForm />} />
                  <Route path="/cargo/material-purchase/:id" element={<MaterialPurchaseDetail />} />
                  <Route path="/cargo/purchase-settlement" element={<PurchaseSettlementList />} />
                  <Route path="/cargo/purchase-settlement/new" element={<PurchaseSettlementForm />} />
                  <Route path="/cargo/purchase-settlement/edit/:id" element={<PurchaseSettlementForm />} />
                  <Route path="/cargo/purchase-settlement/:id" element={<PurchaseSettlementDetail />} />
                  <Route path="/cargo/arrival-management" element={<ArrivalManagementList />} />
                  <Route path="/cargo/arrival-management/new" element={<ArrivalManagementForm />} />
                  <Route path="/cargo/arrival-management/edit/:id" element={<ArrivalManagementForm />} />
                  <Route path="/cargo/arrival-management/:id" element={<ArrivalManagementDetail />} />
                  <Route path="/cargo/material-tracking" element={<MaterialTrackingList />} />
                  <Route path="/cargo/material-tracking/new" element={<MaterialTrackingForm />} />
                  <Route path="/cargo/material-tracking/edit/:id" element={<MaterialTrackingForm />} />
                  <Route path="/cargo/material-tracking/:id" element={<MaterialTrackingDetail />} />

                  <Route path="/material" element={<MaterialList />} />
                  <Route path="/material/new" element={<MaterialForm />} />
                  <Route path="/material/:id" element={<MaterialForm />} />
                  {/* 业务流程 */}
                  <Route path="/application" element={<ApplicationList />} />
                  <Route path="/application/new" element={<ApplicationForm />} />
                  <Route path="/application/:id" element={<ApplicationForm />} />
                  
                  <Route path="/purchase" element={<PurchaseList />} />
                  <Route path="/purchase/new" element={<PurchaseForm />} />
                  <Route path="/purchase/:id" element={<PurchaseForm />} />

                  {/* 仓储管理 */}
                  <Route path="/storage/inbound" element={<StorageInboundList />} />
                  <Route path="/storage/inbound/new" element={<StorageInboundForm />} />
                  <Route path="/storage/inbound/edit/:id" element={<StorageInboundForm />} />
                  <Route path="/storage/inbound/:id" element={<StorageInboundDetail />} />
                  <Route path="/storage/outbound" element={<StorageOutboundList />} />
                  <Route path="/storage/outbound/new" element={<StorageOutboundForm />} />
                  <Route path="/storage/outbound/edit/:id" element={<StorageOutboundForm />} />
                  <Route path="/storage/outbound/:id" element={<StorageOutboundDetail />} />
                  <Route path="/storage/transfer" element={<StorageTransferList />} />
                  <Route path="/storage/transfer/new" element={<StorageTransferForm />} />
                  <Route path="/storage/transfer/edit/:id" element={<StorageTransferForm />} />
                  <Route path="/storage/transfer/:id" element={<StorageTransferDetail />} />
                  
                  {/* 库存管理 */}
                  <Route path="/inventory" element={<InventoryQueryList />} />
                  <Route path="/inventory/alert" element={<InventoryAlertList />} />
                  <Route path="/inventory/analysis" element={<InventoryAnalysisList />} />
                  
                  {/* 报表中心 */}
                  <Route path="/report" element={<ReportCenter />} />
                  <Route path="/reports/dashboard" element={<ReportsDashboard />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
