import React, { useState, useRef, useEffect } from 'react'
import {
  Modal, Input, Button, List, Typography, Tag, Space,
  Spin, Alert, Divider, Card, Empty, Tooltip
} from 'antd'
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ClearOutlined,
  QuestionCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './AIChatModal.css'

const { Text, Paragraph } = Typography
const { TextArea } = Input

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  data?: any
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
        content: `您好！我是智慧港航物资管理AI助手，可以帮您查询库存、物资信息、智能巡检等。请问有什么可以帮助您的吗？`,
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

      // 合并原有快捷操作和巡检操作
      setQuickActions([...actions, ...inspectionActions])
    } catch (error) {
      console.error('加载快捷操作失败:', error)
      // 如果网络请求失败，至少提供巡检快捷操作
      const fallbackActions: QuickAction[] = [
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
          {isUser ? <UserOutlined /> : <RobotOutlined />}
        </div>
        <div className="message-content">
          <div className="message-bubble">
            <div className="message-text">
              {isUser ? (
                <Paragraph>{message.content}</Paragraph>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
          <RobotOutlined style={{ color: '#1890ff' }} />
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
                <RobotOutlined />
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
