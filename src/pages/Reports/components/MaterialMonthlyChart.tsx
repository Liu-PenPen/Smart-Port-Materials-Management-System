import React from 'react'

interface MaterialMonthlyChartProps {
  data?: {
    categories: string[]
    series: Array<{ name: string; data: number[]; color: string }>
    total: number
    trend: number
  }
}

const MaterialMonthlyChart: React.FC<MaterialMonthlyChartProps> = ({ data }) => {
  const defaultData = {
    categories: ['钢材', '水泥', '设备', '工具'],
    series: [
      { name: '库存', data: [45, 32, 28, 15], color: '#1890ff' },
      { name: '在途', data: [12, 8, 6, 3], color: '#52c41a' },
      { name: '预订', data: [8, 5, 4, 2], color: '#faad14' }
    ],
    total: 389,
    trend: 5.2
  }

  const chartData = data || defaultData

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-value">
          <span className="value">{chartData.total}</span>
          <span className="unit">项</span>
        </div>
        <div className="chart-trend" style={{ color: chartData.trend > 0 ? '#52c41a' : '#ff4d4f' }}>
          {chartData.trend > 0 ? '+' : ''}{chartData.trend}%
        </div>
      </div>
      <div className="monthly-summary">
        {chartData.categories.map((category, index) => {
          const totalForCategory = chartData.series.reduce((sum, s) => sum + s.data[index], 0)
          return (
            <div key={category} className="monthly-item">
              <div className="monthly-label">{category}</div>
              <div className="monthly-value">{totalForCategory}项</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MaterialMonthlyChart
