import React from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
// import { request } from '@/services/api' // 暂时注释，使用模拟登录
import type { User } from '@/types'
import './index.css'

interface LoginForm {
  username: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  const handleLogin = async (values: LoginForm) => {
    setLoading(true)
    try {
      // 模拟登录验证
      if (values.username === 'admin' && values.password === '123456') {
        // 模拟用户数据
        const mockUser: User = {
          id: 1,
          username: 'admin',
          name: '系统管理员',
          email: 'admin@example.com',
          phone: '13800138000',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          status: 'ACTIVE',
          roles: [
            {
              id: 1,
              roleCode: 'ADMIN',
              roleName: '系统管理员',
              description: '系统管理员角色',
              permissions: []
            }
          ],
          companyId: 1,
          departmentId: 1,
          createdBy: 1,
          createdTime: new Date().toISOString(),
          version: 1
        }

        const mockToken = 'mock-jwt-token-' + Date.now()

        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000))

        login(mockUser, mockToken)
        message.success('登录成功')
        navigate('/dashboard')
      } else {
        message.error('用户名或密码错误')
      }
    } catch (error) {
      console.error('登录失败:', error)
      message.error('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <img src="/logo.svg" alt="Logo" className="login-logo" />
          <h1 className="login-title">智慧港口物资管理</h1>
          <p className="login-subtitle">Agent Port Material Management System</p>
        </div>
        
        <Card className="login-card">
          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          
          <div className="login-footer">
            <p>默认账号：admin / 123456</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Login
