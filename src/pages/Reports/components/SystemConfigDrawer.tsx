import React, { useState } from 'react'
import { Drawer, Switch, Divider, Space, Typography, Button } from 'antd'
import { 
  SettingOutlined, 
  BgColorsOutlined, 
  LayoutOutlined,
  EyeOutlined,
  DashboardOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography

interface SystemConfigDrawerProps {
  visible: boolean
  onClose: () => void
  onConfigChange: (config: SystemConfig) => void
}

export interface SystemConfig {
  // 显示设置
  showBackground: boolean
  showAnimations: boolean
  showTooltips: boolean
  showLegends: boolean
  
  // 布局设置
  compactMode: boolean
  fullScreenMode: boolean
  
  // 图表设置
  chartTheme: 'dark' | 'light' | 'blue'
  chartType: 'echarts' | 'simple'
  
  // 功能开关
  autoRefresh: boolean
  soundAlerts: boolean
  dataExport: boolean
}

const SystemConfigDrawer: React.FC<SystemConfigDrawerProps> = ({
  visible,
  onClose,
  onConfigChange
}) => {
  const [config, setConfig] = useState<SystemConfig>({
    showBackground: true,
    showAnimations: true,
    showTooltips: true,
    showLegends: true,
    compactMode: false,
    fullScreenMode: false,
    chartTheme: 'dark',
    chartType: 'simple',
    autoRefresh: true,
    soundAlerts: false,
    dataExport: true
  })

  const handleConfigChange = (key: keyof SystemConfig, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const resetToDefault = () => {
    const defaultConfig: SystemConfig = {
      showBackground: true,
      showAnimations: true,
      showTooltips: true,
      showLegends: true,
      compactMode: false,
      fullScreenMode: false,
      chartTheme: 'dark',
      chartType: 'simple',
      autoRefresh: true,
      soundAlerts: false,
      dataExport: true
    }
    setConfig(defaultConfig)
    onConfigChange(defaultConfig)
  }

  return (
    <Drawer
      title={
        <Space>
          <SettingOutlined />
          <span>系统配置</span>
        </Space>
      }
      placement="right"
      width={320}
      open={visible}
      onClose={onClose}
      className="system-config-drawer"
      styles={{
        body: { 
          padding: '16px',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: '#ffffff'
        },
        header: {
          background: 'rgba(0, 0, 0, 0.8)',
          borderBottom: '1px solid rgba(24, 144, 255, 0.3)',
          color: '#ffffff'
        }
      }}
    >
      {/* 显示设置 */}
      <div className="config-section">
        <Title level={5} style={{ color: '#00d4ff', marginBottom: 16 }}>
          <EyeOutlined /> 显示设置
        </Title>
        
        <div className="config-item">
          <Text style={{ color: '#ffffff' }}>背景效果</Text>
          <Switch
            checked={config.showBackground}
            onChange={(checked) => handleConfigChange('showBackground', checked)}
            style={{ marginLeft: 'auto' }}
          />
        </div>
        
        <div className="config-item">
          <Text style={{ color: '#ffffff' }}>动画效果</Text>
          <Switch
            checked={config.showAnimations}
            onChange={(checked) => handleConfigChange('showAnimations', checked)}
            style={{ marginLeft: 'auto' }}
          />
        </div>
        
        <div className="config-item">
          <Text style={{ color: '#ffffff' }}>提示信息</Text>
          <Switch
            checked={config.showTooltips}
            onChange={(checked) => handleConfigChange('showTooltips', checked)}
            style={{ marginLeft: 'auto' }}
          />
        </div>
        
        <div className="config-item">
          <Text style={{ color: '#ffffff' }}>图例显示</Text>
          <Switch
            checked={config.showLegends}
            onChange={(checked) => handleConfigChange('showLegends', checked)}
            style={{ marginLeft: 'auto' }}
          />
        </div>
      </div>

      <Divider style={{ borderColor: 'rgba(24, 144, 255, 0.3)' }} />

      {/* 布局设置 */}
      <div className="config-section">
        <Title level={5} style={{ color: '#00d4ff', marginBottom: 16 }}>
          <LayoutOutlined /> 布局设置
        </Title>
        
        <div className="config-item">
          <Text style={{ color: '#ffffff' }}>紧凑模式</Text>
          <Switch
            checked={config.compactMode}
            onChange={(checked) => handleConfigChange('compactMode', checked)}
            style={{ marginLeft: 'auto' }}
          />
        </div>
        
        <div className="config-item">
          <Text style={{ color: '#ffffff' }}>全屏模式</Text>
          <Switch
            checked={config.fullScreenMode}
            onChange={(checked) => handleConfigChange('fullScreenMode', checked)}
            style={{ marginLeft: 'auto' }}
          />
        </div>
      </div>

      <Divider style={{ borderColor: 'rgba(24, 144, 255, 0.3)' }} />

      {/* 图表设置 */}
      <div className="config-section">
        <Title level={5} style={{ color: '#00d4ff', marginBottom: 16 }}>
          <BarChartOutlined /> 图表设置
        </Title>
        
        <div className="config-item">
          <Text style={{ color: '#ffffff' }}>图表主题</Text>
          <div className="theme-selector">
            {['dark', 'light', 'blue'].map(theme => (
              <div
                key={theme}
                className={`theme-option ${config.chartTheme === theme ? 'active' : ''}`}
                onClick={() => handleConfigChange('chartTheme', theme)}
              >
                {theme === 'dark' ? '深色' : theme === 'light' ? '浅色' : '蓝色'}
              </div>
            ))}
          </div>
        </div>
        
        <div className="config-item">
          <Text style={{ color: '#ffffff' }}>图表类型</Text>
          <div className="chart-type-selector">
            <div
              className={`chart-type-option ${config.chartType === 'simple' ? 'active' : ''}`}
              onClick={() => handleConfigChange('chartType', 'simple')}
            >
              <DashboardOutlined /> 简化版
            </div>
            <div
              className={`chart-type-option ${config.chartType === 'echarts' ? 'active' : ''}`}
              onClick={() => handleConfigChange('chartType', 'echarts')}
            >
              <LineChartOutlined /> ECharts
            </div>
          </div>
        </div>
      </div>

      <Divider style={{ borderColor: 'rgba(24, 144, 255, 0.3)' }} />

      {/* 功能开关 */}
      <div className="config-section">
        <Title level={5} style={{ color: '#00d4ff', marginBottom: 16 }}>
          <BgColorsOutlined /> 功能开关
        </Title>
        
        <div className="config-item">
          <Text style={{ color: '#ffffff' }}>自动刷新</Text>
          <Switch
            checked={config.autoRefresh}
            onChange={(checked) => handleConfigChange('autoRefresh', checked)}
            style={{ marginLeft: 'auto' }}
          />
        </div>
        
        <div className="config-item">
          <Text style={{ color: '#ffffff' }}>声音提醒</Text>
          <Switch
            checked={config.soundAlerts}
            onChange={(checked) => handleConfigChange('soundAlerts', checked)}
            style={{ marginLeft: 'auto' }}
          />
        </div>
        
        <div className="config-item">
          <Text style={{ color: '#ffffff' }}>数据导出</Text>
          <Switch
            checked={config.dataExport}
            onChange={(checked) => handleConfigChange('dataExport', checked)}
            style={{ marginLeft: 'auto' }}
          />
        </div>
      </div>

      <Divider style={{ borderColor: 'rgba(24, 144, 255, 0.3)' }} />

      {/* 操作按钮 */}
      <div className="config-actions">
        <Button 
          type="primary" 
          block 
          onClick={resetToDefault}
          style={{ 
            background: 'linear-gradient(45deg, #00d4ff, #0099cc)',
            border: 'none',
            marginBottom: 8
          }}
        >
          恢复默认设置
        </Button>
        <Button 
          block 
          onClick={onClose}
          style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(24, 144, 255, 0.3)',
            color: '#ffffff'
          }}
        >
          关闭
        </Button>
      </div>
    </Drawer>
  )
}

export default SystemConfigDrawer
