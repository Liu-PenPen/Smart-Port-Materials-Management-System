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
        content: '您好！我是港口物资管理AI助手，可以帮您查询库存、物资信息等。请问有什么可以帮助您的吗？',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [visible, sessionId])

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  const generateMessageId = () => {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  const loadQuickActions = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/chat/quick-actions')
      if (response.ok) {
        const actions = await response.json()
        setQuickActions(actions)
      }
    } catch (error) {
      console.error('加载快捷操作失败:', error)
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
            <Paragraph className="message-text">
              {message.content}
            </Paragraph>
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
        return <Empty description="暂无数据" size="small" />
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
      destroyOnClose
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
