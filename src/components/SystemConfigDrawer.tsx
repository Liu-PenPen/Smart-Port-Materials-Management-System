import React, { useState } from 'react'
import { Drawer, Switch, Divider, Space, Typography, Button, Select, Radio } from 'antd'
import { 
  SettingOutlined, 
  BgColorsOutlined, 
  LayoutOutlined,
  EyeOutlined,
  DashboardOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  SkinOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

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
  colorWeakness: boolean

  // 布局设置
  compactMode: boolean
  fullScreenMode: boolean
  sidebarCollapsed: boolean

  // 主题设置
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string

  // 功能开关
  autoRefresh: boolean
  soundAlerts: boolean
  dataExport: boolean
  realTimeUpdate: boolean
  showFooter: boolean
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
    }
    setConfig(defaultConfig)
    onConfigChange(defaultConfig)
  }

  const primaryColors = [
    { label: '拂晓蓝', value: '#1890ff' },
    { label: '薄暮', value: '#722ed1' },
    { label: '火山', value: '#fa541c' },
    { label: '日暮', value: '#faad14' },
    { label: '明青', value: '#13c2c2' },
    { label: '极光绿', value: '#52c41a' },
    { label: '极客蓝', value: '#2f54eb' },
    { label: '酱紫', value: '#eb2f96' }
  ]

  return (
    <Drawer
      title={
        <Space>
          <SettingOutlined />
          <span>系统配置</span>
        </Space>
      }
      placement="right"
      width={360}
      open={visible}
      onClose={onClose}
      className="system-config-drawer"
    >
      {/* 显示设置 */}
      <div className="config-section">
        <Title level={5} style={{ marginBottom: 16, color: '#1890ff' }}>
          <EyeOutlined /> 显示设置
        </Title>
        
        <div className="config-item">
          <Text>背景效果</Text>
          <Switch
            checked={config.showBackground}
            onChange={(checked) => handleConfigChange('showBackground', checked)}
          />
        </div>
        
        <div className="config-item">
          <Text>动画效果</Text>
          <Switch
            checked={config.showAnimations}
            onChange={(checked) => handleConfigChange('showAnimations', checked)}
          />
        </div>
        
        <div className="config-item">
          <Text>提示信息</Text>
          <Switch
            checked={config.showTooltips}
            onChange={(checked) => handleConfigChange('showTooltips', checked)}
          />
        </div>
        
        <div className="config-item">
          <Text>图例显示</Text>
          <Switch
            checked={config.showLegends}
            onChange={(checked) => handleConfigChange('showLegends', checked)}
          />
        </div>
      </div>

      <Divider />

      {/* 布局设置 */}
      <div className="config-section">
        <Title level={5} style={{ marginBottom: 16, color: '#1890ff' }}>
          <LayoutOutlined /> 布局设置
        </Title>
        
        <div className="config-item">
          <Text>紧凑模式</Text>
          <Switch
            checked={config.compactMode}
            onChange={(checked) => handleConfigChange('compactMode', checked)}
          />
        </div>
        
        <div className="config-item">
          <div>
            <Text>全屏模式</Text>
          </div>
          <Switch
            checked={config.fullScreenMode}
            onChange={(checked) => handleConfigChange('fullScreenMode', checked)}
          />
        </div>
        
        <div className="config-item">
          <Text>侧边栏收起</Text>
          <Switch
            checked={config.sidebarCollapsed}
            onChange={(checked) => handleConfigChange('sidebarCollapsed', checked)}
          />
        </div>
      </div>

      <Divider />

      {/* 主题设置 */}
      <div className="config-section">
        <Title level={5} style={{ marginBottom: 16, color: '#1890ff' }}>
          <SkinOutlined /> 主题设置
        </Title>
        
        <div className="config-item">
          <Text>主题模式</Text>
          <Radio.Group
            value={config.theme}
            onChange={(e) => handleConfigChange('theme', e.target.value)}
            size="small"
          >
            <Radio.Button value="light">浅色</Radio.Button>
            <Radio.Button value="dark">深色</Radio.Button>
            <Radio.Button value="auto">自动</Radio.Button>
          </Radio.Group>
        </div>
       
        <div className="config-item">
          <Text>主题色</Text>
          <Select
            value={config.primaryColor}
            onChange={(value) => handleConfigChange('primaryColor', value)}
            style={{ width: 120 }}
            size="small"
          >
            {primaryColors.map(color => (
              <Option key={color.value} value={color.value}>
                <Space>
                  <div 
                    style={{ 
                      width: 12, 
                      height: 12, 
                      backgroundColor: color.value, 
                      borderRadius: 2 
                    }} 
                  />
                  {color.label}
                </Space>
              </Option>
            ))}
          </Select>
        </div>

         {/* 色弱模式 */}
         <div className="config-item">
          <Text>色弱模式</Text>
          <Switch
            checked={config.colorWeakness}
            onChange={(checked) => handleConfigChange('colorWeakness', checked)}
          />
        </div>
      </div>

      <Divider />

      {/* 功能开关 */}
      <div className="config-section">
        <Title level={5} style={{ marginBottom: 16, color: '#1890ff' }}>
          <ThunderboltOutlined /> 功能开关
        </Title>
        
        <div className="config-item">
          <Text>自动刷新</Text>
          <Switch
            checked={config.autoRefresh}
            onChange={(checked) => handleConfigChange('autoRefresh', checked)}
          />
        </div>
        
        <div className="config-item">
          <Text>实时更新</Text>
          <Switch
            checked={config.realTimeUpdate}
            onChange={(checked) => handleConfigChange('realTimeUpdate', checked)}
          />
        </div>

        <div className="config-item">
          <Text>页脚显示</Text>
          <Switch
            checked={config.showFooter}
            onChange={(checked) => handleConfigChange('showFooter', checked)}
          />
        </div>

      </div>

      {/* 操作按钮 */}
      <div className="config-actions">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button 
            type="primary" 
            block 
            onClick={resetToDefault}
            icon={<SettingOutlined />}
          >
            恢复默认设置
          </Button>
          <Button 
            block 
            onClick={onClose}
          >
            关闭
          </Button>
        </Space>
      </div>
    </Drawer>
  )
}

export default SystemConfigDrawer
