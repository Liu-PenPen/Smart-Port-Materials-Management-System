import React from 'react'
import { Layout, Typography, Space, Divider } from 'antd'
import { 
  CopyrightOutlined, 
  HeartFilled,
  GithubOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons'

const { Footer: AntFooter } = Layout
const { Text, Link } = Typography

interface FooterProps {
  className?: string
  style?: React.CSSProperties
}

const Footer: React.FC<FooterProps> = ({ className, style }) => {
  const currentYear = new Date().getFullYear()

  return (
    <AntFooter 
      className={`app-footer ${className || ''}`}
      style={{
        textAlign: 'center',
        background: '#f0f2f5',
        borderTop: '1px solid #e8e8e8',
        padding: '24px 16px',
        marginTop: 'auto',
        ...style
      }}
    >
      <div className="footer-content">
        {/* 主要版权信息 */}
        <div className="footer-main">
          <Space size="small" align="center">
            <CopyrightOutlined />
            <Text>{currentYear} 小花花出品</Text>
            <Divider type="vertical" />
            <Text>智慧港口物资管理系统</Text>
          </Space>
        </div>

        {/* 副标题 */}
        <div className="footer-subtitle" style={{ marginTop: 8 }}>
          <Space size="small" align="center">
            <Text type="secondary">Made with</Text>
            <HeartFilled style={{ color: '#ff4d4f' }} />
            <Text type="secondary">by xiaohuahua</Text>
          </Space>
        </div>

        {/* 联系信息 */}
        <div className="footer-contact" style={{ marginTop: 12 }}>
          <Space size="large" wrap>
            <Space size="small">
              <MailOutlined />
              <Link href="mailto:contact@839590955@qq.com">
                contact@839590955@qq.com
              </Link>
            </Space>
            <Space size="small">
              <PhoneOutlined />
              <Text type="secondary">400-888-8888</Text>
            </Space>
            <Space size="small">
              <GithubOutlined />
              <Link href="https://github.com/Liu-PenPen/Smart-Port-Materials-Management-System" target="_blank">
                GitHub
              </Link>
            </Space>
          </Space>
        </div>

        {/* 技术栈信息 */}
        <div className="footer-tech" style={{ marginTop: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Powered by 小花花团队打造
          </Text>
        </div>

        {/* 备案信息 */}
        <div className="footer-license" style={{ marginTop: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            版本 v1.0.0 | 
            <Link href="#" style={{ marginLeft: 4 }}>
              用户协议
            </Link>
            <Divider type="vertical" />
            <Link href="#">
              隐私政策
            </Link>
          </Text>
        </div>
      </div>
    </AntFooter>
  )
}

export default Footer
