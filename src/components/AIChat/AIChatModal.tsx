import React, { useState, useRef, useEffect } from 'react'
import {
  Modal, Input, Button, List, Typography, Tag, Space,
  Spin, Alert, Divider, Card, Empty, Tooltip
} from 'antd'
import {
  SendOutlined,
  UserOutlined,
  ClearOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import './AIChatModal.css'

const { Text, Paragraph } = Typography
const { TextArea } = Input

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  data?: any
  chartData?: {
    image: string
    title: string
    type: string
  }
}

interface InspectionItem {
  id: string
  area: string
  type: 'environment' | 'equipment' | 'safety' | 'material'
  status: 'normal' | 'warning' | 'critical'
  description: string
  timestamp: Date
  inspector?: string
  images?: string[]
  recommendations?: string[]
}

interface InspectionReport {
  id: string
  title: string
  date: Date
  inspector: string
  areas: string[]
  totalItems: number
  normalCount: number
  warningCount: number
  criticalCount: number
  items: InspectionItem[]
  summary: string
}

interface QuickAction {
  id: string
  title: string
  query: string
  description: string
}

interface AIChatModalProps {
  visible: boolean
  onClose: () => void
}

const AIChatModal: React.FC<AIChatModalProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [quickActions, setQuickActions] = useState<QuickAction[]>([])
  const [inspectionData, setInspectionData] = useState<InspectionItem[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 初始化会话
  useEffect(() => {
    if (visible && !sessionId) {
      setSessionId(generateSessionId())
      loadQuickActions()
      // 添加欢迎消息
      const welcomeMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: `您好！我是智慧港航物资管理AI助手，现在支持以下功能：

## 🤖 AI智能分析
- 基于 PandasAI 的智能数据分析
- 专业的物资管理建议和洞察
- 支持复杂查询，如"给我一些物资管理的建议"

## 🔍 智能巡检
- 全区域巡检、仓库专项巡检
- 设备安全巡检、码头环境巡检

## 📊 数据分析 & 图表可视化
- 库存统计分析、趋势分析
- 异常数据分析、价值分布分析
- 支持图表生成：柱状图、饼图、折线图、直方图
- 支持自然语言查询，如"生成各区域物资数量的柱状图"

## 💬 智能对话
- 物资信息查询、库存管理咨询
- 操作指导、问题解答

您可以直接输入问题或点击下方快捷按钮开始使用！`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [visible, sessionId])

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
  }

  const generateMessageId = () => {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
  }

  //Markdown 组件
  const markdownComponents: Components = {
    img: ({ src, alt, title }) => {
      return (
        <span style={{ display: 'block', margin: '16px 0', textAlign: 'center' }}>
          <img
            src={src}
            alt={alt}
            title={title}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f0f0f0',
              display: 'block',
              margin: '0 auto'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            onLoad={() => {
              console.log('图片加载成功:', src?.substring(0, 50) + '...');
            }}
          />
          {title && (
            <span style={{
              display: 'block',
              marginTop: '8px',
              fontSize: '14px',
              color: '#666',
              fontStyle: 'italic'
            }}>
              {title}
            </span>
          )}
        </span>
      )
    },
    // 修复段落问题
    p: ({ children }) => {
      return <div style={{ marginBottom: '16px' }}>{children}</div>
    }
  }

  // 智能巡检功能
  const performSmartInspection = async (area?: string) => {
    try {
      // 模拟智能巡检数据生成
      const inspectionItems: InspectionItem[] = generateInspectionData(area)
      setInspectionData(inspectionItems)

      // 生成巡检报告
      const report = generateInspectionReport(inspectionItems, area)
      return report
    } catch (error) {
      console.error('智能巡检失败:', error)
      throw error
    }
  }

  // 生成模拟巡检数据
  const generateInspectionData = (area?: string): InspectionItem[] => {
    const areas = area ? [area] : ['A区仓库', 'B区仓库', 'C区码头', '设备区', '办公区']
    const inspectionTypes = ['environment', 'equipment', 'safety', 'material'] as const

    const items: InspectionItem[] = []

    areas.forEach(currentArea => {
      // 每个区域生成3-6个巡检项目
      const itemCount = Math.floor(Math.random() * 4) + 3

      for (let i = 0; i < itemCount; i++) {
        const type = inspectionTypes[Math.floor(Math.random() * inspectionTypes.length)]
        const status = getRandomStatus()

        items.push({
          id: `inspection_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          area: currentArea,
          type,
          status,
          description: getInspectionDescription(currentArea, type, status),
          timestamp: new Date(),
          inspector: 'AI智能巡检系统',
          recommendations: getRecommendations(type, status)
        })
      }
    })

    return items
  }

  // 获取随机状态（大部分正常，少部分异常）
  const getRandomStatus = (): 'normal' | 'warning' | 'critical' => {
    const rand = Math.random()
    if (rand < 0.7) return 'normal'
    if (rand < 0.9) return 'warning'
    return 'critical'
  }

  // 获取巡检描述
  const getInspectionDescription = (area: string, type: string, status: string): string => {
    const descriptions = {
      environment: {
        normal: `${area}环境状况良好，温湿度适宜`,
        warning: `${area}湿度偏高，需要注意通风`,
        critical: `${area}温度异常，可能影响物资保存`
      },
      equipment: {
        normal: `${area}设备运行正常，性能良好`,
        warning: `${area}设备运行声音异常，建议检查`,
        critical: `${area}设备故障指示灯亮起，需要立即维修`
      },
      safety: {
        normal: `${area}安全设施完好，符合规范`,
        warning: `${area}安全标识部分模糊，需要更新`,
        critical: `${area}发现安全隐患，存在火灾风险`
      },
      material: {
        normal: `${area}物资摆放整齐，标识清晰`,
        warning: `${area}部分物资标识不清，需要重新标记`,
        critical: `${area}发现过期物资，需要立即处理`
      }
    }

    return descriptions[type as keyof typeof descriptions]?.[status as keyof typeof descriptions.environment] || '巡检项目'
  }

  // 获取建议
  const getRecommendations = (type: string, status: string): string[] => {
    if (status === 'normal') return []

    const recommendations = {
      environment: {
        warning: ['加强通风', '监控温湿度变化'],
        critical: ['立即调整环境参数', '检查空调系统', '转移敏感物资']
      },
      equipment: {
        warning: ['安排设备检查', '记录异常情况'],
        critical: ['立即停止使用', '联系维修人员', '启用备用设备']
      },
      safety: {
        warning: ['更新安全标识', '加强安全培训'],
        critical: ['立即排除隐患', '疏散相关区域', '联系安全部门']
      },
      material: {
        warning: ['重新标记物资', '整理摆放'],
        critical: ['立即处理过期物资', '检查其他物资', '更新库存记录']
      }
    }

    return recommendations[type as keyof typeof recommendations]?.[status as keyof typeof recommendations.environment] || []
  }

  // 生成巡检报告
  const generateInspectionReport = (items: InspectionItem[], area?: string): string => {
    const normalCount = items.filter(item => item.status === 'normal').length
    const warningCount = items.filter(item => item.status === 'warning').length
    const criticalCount = items.filter(item => item.status === 'critical').length

    const areaText = area ? `${area}` : '全区域'

    let report = `# 🔍 ${areaText}智能巡检报告\n\n`
    report += `**巡检时间**: ${new Date().toLocaleString()}\n`
    report += `**巡检方式**: AI智能巡检系统\n`
    report += `**巡检范围**: ${areaText}\n\n`

    // 总体概况
    report += `## 📊 巡检概况\n\n`
    report += `| 状态 | 数量 | 占比 |\n`
    report += `|------|------|------|\n`
    report += `| ✅ 正常 | ${normalCount} | ${((normalCount/items.length)*100).toFixed(1)}% |\n`
    report += `| ⚠️ 警告 | ${warningCount} | ${((warningCount/items.length)*100).toFixed(1)}% |\n`
    report += `| 🚨 严重 | ${criticalCount} | ${((criticalCount/items.length)*100).toFixed(1)}% |\n`
    report += `| 📋 总计 | ${items.length} | 100% |\n\n`

    // 详细巡检结果
    report += `## 📋 详细巡检结果\n\n`

    const groupedByArea = items.reduce((acc, item) => {
      if (!acc[item.area]) acc[item.area] = []
      acc[item.area].push(item)
      return acc
    }, {} as Record<string, InspectionItem[]>)

    Object.entries(groupedByArea).forEach(([areaName, areaItems]) => {
      report += `### 📍 ${areaName}\n\n`

      areaItems.forEach(item => {
        const statusIcon = item.status === 'normal' ? '✅' : item.status === 'warning' ? '⚠️' : '🚨'
        const typeIcon = getTypeIcon(item.type)

        report += `**${statusIcon} ${typeIcon} ${getTypeName(item.type)}**\n`
        report += `- ${item.description}\n`

        if (item.recommendations && item.recommendations.length > 0) {
          report += `- **建议措施**: ${item.recommendations.join('、')}\n`
        }
        report += `\n`
      })
    })

    // 总结和建议
    report += `## 📝 巡检总结\n\n`

    if (criticalCount > 0) {
      report += `🚨 **发现 ${criticalCount} 个严重问题，需要立即处理！**\n\n`
    }

    if (warningCount > 0) {
      report += `⚠️ **发现 ${warningCount} 个警告项目，建议及时关注。**\n\n`
    }

    if (normalCount === items.length) {
      report += `✅ **所有巡检项目状态良好，请继续保持！**\n\n`
    }

    // 下次巡检建议
    report += `## 🔄 下次巡检建议\n\n`
    if (criticalCount > 0) {
      report += `- 建议 **24小时内** 重新巡检严重问题区域\n`
    }
    if (warningCount > 0) {
      report += `- 建议 **3天内** 重新检查警告项目\n`
    }
    report += `- 建议 **7天后** 进行下次全面巡检\n`

    return report
  }

  // 获取类型图标
  const getTypeIcon = (type: string): string => {
    const icons = {
      environment: '🌡️',
      equipment: '⚙️',
      safety: '🛡️',
      material: '📦'
    }
    return icons[type as keyof typeof icons] || '📋'
  }

  // 获取类型名称
  const getTypeName = (type: string): string => {
    const names = {
      environment: '环境检查',
      equipment: '设备检查',
      safety: '安全检查',
      material: '物资检查'
    }
    return names[type as keyof typeof names] || '其他检查'
  }

  const loadQuickActions = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/chat/quick-actions')
      let actions: QuickAction[] = []

      if (response.ok) {
        actions = await response.json()
      }

      // 添加智能巡检快捷操作
      const inspectionActions: QuickAction[] = [
        {
          id: 'inspection_all',
          title: '🔍 全区域巡检',
          description: '对所有区域进行智能巡检',
          query: '请进行全区域智能巡检'
        },
        {
          id: 'inspection_warehouse',
          title: '📦 仓库巡检',
          description: '对仓库区域进行专项巡检',
          query: '请对仓库区域进行巡检'
        },
        {
          id: 'inspection_equipment',
          title: '⚙️ 设备巡检',
          description: '对设备区域进行安全巡检',
          query: '请对设备区进行巡检'
        },
        {
          id: 'inspection_dock',
          title: '🚢 码头巡检',
          description: '对码头区域进行环境巡检',
          query: '请对C区码头进行巡检'
        }
      ]

      // 添加数据分析快捷操作
      const analysisActions: QuickAction[] = [
        {
          id: 'analysis_inventory',
          title: '📊 库存统计',
          description: '统计各区域的库存情况',
          query: '统计各区域的物资库存数量'
        },
        {
          id: 'analysis_trend',
          title: '📈 趋势分析',
          description: '分析最近的物资流动趋势',
          query: '分析最近30天的物资流动趋势'
        },
        {
          id: 'analysis_abnormal',
          title: '⚠️ 异常分析',
          description: '查看异常状态的记录',
          query: '分析异常状态的记录和原因'
        },
        {
          id: 'analysis_value',
          title: '💰 价值分析',
          description: '分析物资总价值分布',
          query: '分析各类物资的总价值分布'
        }
      ]

      // 添加 AI 智能分析快捷操作
      const aiActions: QuickAction[] = [
        {
          id: 'ai_advice',
          title: '🤖 管理建议',
          description: 'AI 提供专业的物资管理建议',
          query: '给我一些物资管理的建议'
        },
        {
          id: 'ai_focus',
          title: '🎯 重点关注',
          description: 'AI 分析需要重点关注的物资',
          query: '哪些物资需要重点关注？'
        },
        {
          id: 'ai_optimize',
          title: '⚡ 优化建议',
          description: 'AI 提供物资配置优化方案',
          query: '如何优化物资配置？'
        },
        {
          id: 'ai_risk',
          title: '⚠️ 风险分析',
          description: 'AI 分析潜在风险和解决方案',
          query: '分析当前物资管理的潜在风险'
        }
      ]

      // 添加图表分析快捷操作
      const chartActions: QuickAction[] = [
        {
          id: 'chart_area',
          title: '📊 区域图表',
          description: '生成各区域物资数量柱状图',
          query: '生成各区域物资数量的柱状图'
        },
        {
          id: 'chart_material',
          title: '🥧 物资饼图',
          description: '生成物资类型分布饼图',
          query: '生成物资类型分布的饼图'
        },
        {
          id: 'chart_trend',
          title: '📈 趋势图表',
          description: '生成操作趋势折线图',
          query: '生成每日操作趋势的折线图'
        },
        {
          id: 'chart_value',
          title: '💹 价值分布',
          description: '生成物资价值分布直方图',
          query: '生成物资价值分布图'
        }
      ]

      // 合并所有快捷操作：原有操作、巡检操作、数据分析操作、AI操作、图表操作
      setQuickActions([...actions, ...inspectionActions, ...analysisActions, ...aiActions, ...chartActions])
    } catch (error) {
      console.error('加载快捷操作失败:', error)
      // 如果网络请求失败，至少提供核心功能的快捷操作
      const fallbackActions: QuickAction[] = [
        {
          id: 'ai_advice',
          title: '🤖 管理建议',
          description: 'AI 提供专业的物资管理建议',
          query: '给我一些物资管理的建议'
        },
        {
          id: 'inspection_all',
          title: '🔍 全区域巡检',
          description: '对所有区域进行智能巡检',
          query: '请进行全区域智能巡检'
        },
        {
          id: 'analysis_inventory',
          title: '📊 库存统计',
          description: '统计各区域的库存情况',
          query: '统计各区域的物资库存数量'
        },
        {
          id: 'chart_area',
          title: '📊 区域图表',
          description: '生成各区域物资数量柱状图',
          query: '生成各区域物资数量的柱状图'
        }
      ]
      setQuickActions(fallbackActions)
    }
  }

  const sendMessage = async (message: string) => {
    if (!message.trim() || loading) return

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      // 检查是否是智能巡检请求
      if (isInspectionRequest(message)) {
        const area = extractAreaFromMessage(message)
        const report = await performSmartInspection(area)

        const assistantMessage: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: report,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])
        return
      }

      // 检查是否是数据分析请求
      if (isDataAnalysisRequest(message)) {
        const analysisResult = await performDataAnalysis(message)

        const assistantMessage: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: analysisResult.content,
          timestamp: new Date(),
          chartData: analysisResult.chartData
        }

        setMessages(prev => [...prev, assistantMessage])
        return
      }

      const response = await fetch('http://localhost:8001/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          session_id: sessionId
        })
      })

      if (response.ok) {
        const result = await response.json()

        const assistantMessage: ChatMessage = {
          id: result.message_id,
          role: 'assistant',
          content: result.response,
          timestamp: new Date(result.timestamp),
          data: result.data
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('请求失败')
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: '抱歉，服务暂时不可用，请稍后再试。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  // 检查是否是巡检请求
  const isInspectionRequest = (message: string): boolean => {
    const inspectionKeywords = ['巡检', '检查', '巡查', '检测', '巡视', 'inspection']
    return inspectionKeywords.some(keyword =>
      message.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  // 从消息中提取区域信息
  const extractAreaFromMessage = (message: string): string | undefined => {
    const areaKeywords = ['A区', 'B区', 'C区', '设备区', '办公区', '仓库', '码头']
    const foundArea = areaKeywords.find(area => message.includes(area))
    return foundArea
  }

  // 检查是否是数据分析请求
  const isDataAnalysisRequest = (message: string): boolean => {
    const analysisKeywords = [
      '分析', '统计', '查询', '报告', '趋势', '对比', '汇总',
      '最多', '最少', '平均', '总计', '排行', '排名', '占比',
      '库存', '物资', '数据', '图表', '可视化'
    ]
    return analysisKeywords.some(keyword =>
      message.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  // 执行数据分析
  const performDataAnalysis = async (query: string): Promise<{content: string, chartData?: any}> => {
    try {
      const response = await fetch('http://localhost:5000/api/data/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query
        })
      })

      if (!response.ok) {
        throw new Error('数据分析服务不可用')
      }

      const result = await response.json()

      if (result.success) {
        const formattedContent = formatAnalysisResult(result)
        const chartData = result.has_chart && result.chart_data ? {
          image: result.chart_data.image,
          title: result.chart_data.title,
          type: result.chart_data.type
        } : undefined

        return { content: formattedContent, chartData }
      } else {
        return { content: `数据分析遇到问题：${result.error}` }
      }
    } catch (error) {
      console.error('数据分析失败:', error)
      return { content: `抱歉，数据分析服务暂时不可用。请稍后重试。\n\n您可以尝试以下查询：\n- "统计各区域的物资数量"\n- "分析最近的库存趋势"\n- "查看异常状态的记录"` }
    }
  }

  // 格式化分析结果
  const formatAnalysisResult = (result: any): string => {
    const { result: analysisResult, query, data_summary, analysis_type, has_chart, chart_data } = result
    const chart = chart_data 

    let formattedResult = `## 📊 数据分析结果\n\n`
    formattedResult += `**查询**: ${query}\n`
    if (analysis_type) {
      formattedResult += `**分析类型**: ${analysis_type}\n`
    }
    if (has_chart && chart) {
      formattedResult += `**图表**: 已生成 ${getChartTypeName(chart.type)}\n\n`
    } else {
      formattedResult += `\n`
    }

    if (typeof analysisResult === 'string') {
      formattedResult += `**结果**: ${analysisResult}\n\n`
    } else if (typeof analysisResult === 'object') {
      formattedResult += `**结果**: \n\`\`\`json\n${JSON.stringify(analysisResult, null, 2)}\n\`\`\`\n\n`
    } else {
      formattedResult += `**结果**: ${String(analysisResult)}\n\n`
    }

    if (data_summary) {
      formattedResult += `### 📋 数据概览\n`
      formattedResult += `- 总记录数: ${data_summary.total_records}\n`
      formattedResult += `- 数据时间范围: ${data_summary.date_range}\n`
      formattedResult += `- 物资种类: ${data_summary.materials_count}\n`
      formattedResult += `- 区域数量: ${data_summary.areas_count}\n\n`
    }

    formattedResult += `💡 **提示**: 您可以继续询问更多数据分析问题，比如：\n`
    formattedResult += `- "显示各区域的物资分布"\n`
    formattedResult += `- "分析异常状态的原因"\n`
    formattedResult += `- "统计最近一周的操作记录"`

    // 如果有图表，添加图表显示
    if (has_chart && chart) {
      if (chart.data === 'text_chart' && chart.text_chart) {
        formattedResult += `\n### 📊 ${chart.title}\n\n\`\`\`\n${chart.text_chart}\`\`\`\n\n`
      } else if (chart.image) {
        // 先添加标题和说明文字
        formattedResult += `\n### 📈 ${chart.title}\n\n`
        formattedResult += `> 💡 **图表说明**: 这是基于您的数据生成的专业可视化图表，支持高清显示和详细数据标注。\n\n`
      } else if (chart.data && chart.data !== 'text_chart') {
        // 兼容旧格式
        formattedResult += `\n### 📈 ${chart.title}\n\n![${chart.title || '数据图表'}](data:image/png;base64,${chart.data})\n\n`
        formattedResult += `> 💡 **图表说明**: 这是基于您的数据生成的专业可视化图表，支持高清显示和详细数据标注。\n\n`
      } else {
 
      }
    } else {
      console.log('❌ 没有图表数据或 has_chart 为 false')
    }

    return formattedResult
  }

  // 获取图表类型中文名称
  const getChartTypeName = (type: string): string => {
    const typeNames = {
      'bar': '柱状图',
      'pie': '饼图',
      'line': '折线图',
      'scatter': '散点图',
      'hist': '直方图'
    }
    return typeNames[type as keyof typeof typeNames] || '图表'
  }

  const handleSend = () => {
    sendMessage(inputValue)
  }

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.query)
  }

  const clearChat = () => {
    setMessages([])
    const welcomeMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: '对话已清空。有什么可以帮助您的吗？',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user'
    
    return (
      <div key={message.id} className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
        <div className="message-avatar">
          {isUser ? <UserOutlined /> : <span>🤖</span>}
        </div>
        <div className="message-content">
          <div className="message-bubble">
            <div className="message-text">
              {isUser ? (
                <Paragraph>{message.content}</Paragraph>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            {message.data && (
              <div className="message-data">
                {renderMessageData(message.data)}
              </div>
            )}
            {message.chartData && (
              <div className="message-chart" style={{ margin: '16px 0', textAlign: 'center' }}>
                <img
                  src={message.chartData.image}
                  alt={message.chartData.title}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #f0f0f0'
                  }}
                  onError={(e) => {
                    console.error('图表图片加载失败:', message.chartData?.image?.substring(0, 100));
                  }}
                  onLoad={() => {
                    console.log('图表图片加载成功:', message.chartData?.title);
                  }}
                />
              </div>
            )}
          </div>
          <Text type="secondary" className="message-time">
            {message.timestamp.toLocaleTimeString()}
          </Text>
        </div>
      </div>
    )
  }

  const renderMessageData = (data: any) => {
    if (!data) return null

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return <Empty description="暂无数据" />
      }

      return (
        <Card size="small" className="data-card">
          <List
            size="small"
            dataSource={data.slice(0, 5)} // 限制显示数量
            renderItem={(item: any, index) => (
              <List.Item key={index}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  {item.material_name && (
                    <Text strong>{item.material_name}</Text>
                  )}
                  {item.quantity && (
                    <Text>数量: {item.quantity} {item.unit || '件'}</Text>
                  )}
                  {item.location && (
                    <Text type="secondary">位置: {item.location}</Text>
                  )}
                  {item.category && (
                    <Tag color="blue">{item.category}</Tag>
                  )}
                </Space>
              </List.Item>
            )}
          />
          {data.length > 5 && (
            <Text type="secondary">还有 {data.length - 5} 条数据...</Text>
          )}
        </Card>
      )
    }

    if (typeof data === 'object') {
      return (
        <Card size="small" className="data-card">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 8 }}>
              <Text strong>{key}: </Text>
              <Text>{String(value)}</Text>
            </div>
          ))}
        </Card>
      )
    }

    return <Text code>{JSON.stringify(data)}</Text>
  }

  return (
    <Modal
      title={
        <Space>
          {/* <RobotOutlined style={{ color: '#1890ff' }} /> */}
          🤖
          <span>智慧港航AI智能助手</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="ai-chat-modal"
    >
      <div className="chat-container">
        {/* 快捷操作 */}
        {quickActions.length > 0 && messages.length <= 1 && (
          <div className="quick-actions">
            <Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
              <ThunderboltOutlined /> 快捷查询：
            </Text>
            <Space wrap>
              {quickActions.map(action => (
                <Tooltip key={action.id} title={action.description}>
                  <Button 
                    size="small" 
                    onClick={() => handleQuickAction(action)}
                    disabled={loading}
                  >
                    {action.title}
                  </Button>
                </Tooltip>
              ))}
            </Space>
            <Divider />
          </div>
        )}

        {/* 消息列表 */}
        <div className="messages-container">
          {messages.map(renderMessage)}
          {loading && (
            <div className="message assistant-message">
              <div className="message-avatar">
                {/* <RobotOutlined /> */}
                🤖
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <Spin size="small" />
                  <Text style={{ marginLeft: 8 }}>正在思考...</Text>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="input-container">
          <div className="input-actions">
            <Tooltip title="清空对话">
              <Button 
                icon={<ClearOutlined />} 
                size="small" 
                onClick={clearChat}
                disabled={loading}
              />
            </Tooltip>
          </div>
          
          <div className="input-area">
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="请输入您的问题，例如：A码头有多少物品？"
              autoSize={{ minRows: 1, maxRows: 4 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!inputValue.trim() || loading}
              className="send-button"
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AIChatModal
