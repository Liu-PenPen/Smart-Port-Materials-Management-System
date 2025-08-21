import React, { createContext, useContext, useState, useEffect } from 'react'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'

const { darkAlgorithm, defaultAlgorithm } = theme

// 主题配置接口
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  primaryColor: string
}

// 主题上下文
interface ThemeContextType {
  themeConfig: ThemeConfig
  setThemeConfig: (config: ThemeConfig) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 自定义Hook来使用主题
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    mode: 'light',
    primaryColor: '#1890ff'
  })

  const [isDark, setIsDark] = useState(false)

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (themeConfig.mode === 'auto') {
        setIsDark(mediaQuery.matches)
        updateBodyTheme(mediaQuery.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    // 初始化检查
    if (themeConfig.mode === 'auto') {
      setIsDark(mediaQuery.matches)
      updateBodyTheme(mediaQuery.matches)
    }

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeConfig.mode])

  // 更新主题配置
  useEffect(() => {
    let newIsDark = false
    
    if (themeConfig.mode === 'dark') {
      newIsDark = true
    } else if (themeConfig.mode === 'auto') {
      newIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    setIsDark(newIsDark)
    updateBodyTheme(newIsDark)
  }, [themeConfig])

  // 更新body的主题属性
  const updateBodyTheme = (dark: boolean) => {
    const body = document.body
    const root = document.documentElement
    
    if (dark) {
      body.setAttribute('data-theme', 'dark')
      body.style.background = '#141414'
      body.style.color = '#ffffff'
      root.style.setProperty('--background-color', '#141414')
      root.style.setProperty('--text-color', '#ffffff')
      root.style.setProperty('--border-color', '#303030')
    } else {
      body.setAttribute('data-theme', 'light')
      body.style.background = '#f0f2f5'
      body.style.color = '#000000'
      root.style.setProperty('--background-color', '#f0f2f5')
      root.style.setProperty('--text-color', '#000000')
      root.style.setProperty('--border-color', '#d9d9d9')
    }
    
    // 设置主题色
    root.style.setProperty('--ant-primary-color', themeConfig.primaryColor)
    root.style.setProperty('--primary-color', themeConfig.primaryColor)
  }

  // Ant Design主题配置
  const antdTheme = {
    algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
    token: {
      colorPrimary: themeConfig.primaryColor,
      borderRadius: 6,
    },
    components: {
      Layout: {
        siderBg: isDark ? '#001529' : '#001529', // 侧边栏保持深色
        triggerBg: isDark ? '#002140' : '#002140',
        headerBg: isDark ? '#1f1f1f' : '#ffffff',
        bodyBg: isDark ? '#141414' : '#f0f2f5',
      },
      Card: {
        colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
      },
      Table: {
        colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
        headerBg: isDark ? '#262626' : '#fafafa',
      },
      Input: {
        colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
      },
      Select: {
        colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
      },
      Button: {
        colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
      },
      Modal: {
        contentBg: isDark ? '#1f1f1f' : '#ffffff',
        headerBg: isDark ? '#1f1f1f' : '#ffffff',
      },
      Drawer: {
        colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
      },
      Dropdown: {
        colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
      },
      Tooltip: {
        colorBgSpotlight: isDark ? '#1f1f1f' : 'rgba(0, 0, 0, 0.85)',
      }
    }
  }

  return (
    <ThemeContext.Provider value={{ themeConfig, setThemeConfig, isDark }}>
      <ConfigProvider
        locale={zhCN}
        theme={antdTheme}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
