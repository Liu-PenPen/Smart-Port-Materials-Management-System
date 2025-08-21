import React from 'react'

interface InventoryAgeChartProps {
  data?: {
    categories: Array<{ name: string; max: number }>
    values: number[]
    averageAge: number
    trend: number
  }
}

const InventoryAgeChart: React.FC<InventoryAgeChartProps> = ({ data }) => {
  const defaultData = {
    categories: [
      { name: '0-30天', max: 100 },
      { name: '31-60天', max: 100 },
      { name: '61-90天', max: 100 },
      { name: '91-180天', max: 100 },
      { name: '180天以上', max: 100 }
    ],
    values: [85, 65, 45, 25, 15],
    averageAge: 45,
    trend: -8.5
  }

  const chartData = data || defaultData

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-value">
          <span className="value">{chartData.averageAge}</span>
          <span className="unit">天</span>
        </div>
        <div className="chart-trend" style={{ color: chartData.trend > 0 ? '#ff4d4f' : '#52c41a' }}>
          {chartData.trend > 0 ? '+' : ''}{chartData.trend}%
        </div>
      </div>
      <div className="age-analysis">
        {chartData.categories.map((category, index) => (
          <div key={category.name} className="age-item">
            <div className="age-label">{category.name}</div>
            <div className="age-value">{chartData.values[index]}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InventoryAgeChart
