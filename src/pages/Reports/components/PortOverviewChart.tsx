import React from 'react'
import { InboxOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons'

interface PortOverviewChartProps {
  data?: {
    totalItems: number
    totalValue: number
    alertItems: number
    portName: string
    portNameEn: string
  }
}

const PortOverviewChart: React.FC<PortOverviewChartProps> = ({ data }) => {
  const defaultData = {
    totalItems: 156,
    totalValue: 25000000,
    alertItems: 12,
    portName: '福州江阴港',
    portNameEn: 'Fuzhou Jiangyin Port'
  }

  const chartData = data || defaultData

  const formatMoney = (value: number) => {
    return (value / 10000).toFixed(1)
  }

  return (
    <div className="port-overview">
      <div className="port-image-container">
        <img src="/port-background.jpg" alt="港口全景" />
        <div className="port-overlay">
          <div className="port-title">
            <h2>{chartData.portName}</h2>
            <p>{chartData.portNameEn}</p>
          </div>
        </div>
      </div>
      <div className="port-stats-overlay">
        <div className="stat-item-overlay">
          <div className="stat-icon-overlay"><InboxOutlined /></div>
          <div className="stat-content-overlay">
            <div className="stat-value-overlay">{chartData.totalItems}</div>
            <div className="stat-label-overlay">库存品种</div>
          </div>
        </div>
        <div className="stat-item-overlay">
          <div className="stat-icon-overlay"><DollarOutlined /></div>
          <div className="stat-content-overlay">
            <div className="stat-value-overlay">¥{formatMoney(chartData.totalValue)}万</div>
            <div className="stat-label-overlay">库存总值</div>
          </div>
        </div>
        <div className="stat-item-overlay">
          <div className="stat-icon-overlay"><WarningOutlined /></div>
          <div className="stat-content-overlay">
            <div className="stat-value-overlay">{chartData.alertItems}</div>
            <div className="stat-label-overlay">预警数量</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortOverviewChart
