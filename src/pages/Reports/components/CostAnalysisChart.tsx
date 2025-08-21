import React from 'react'

interface CostAnalysisChartProps {
  data?: {
    categories: Array<{
      name: string
      value: number
      children?: Array<{ name: string; value: number }>
    }>
    turnoverRate: number
    trend: number
  }
}

const CostAnalysisChart: React.FC<CostAnalysisChartProps> = ({ data }) => {
  const defaultData = {
    categories: [
      {
        name: '直接成本',
        value: 60,
        children: [
          { name: '材料费', value: 35 },
          { name: '人工费', value: 25 }
        ]
      },
      {
        name: '间接成本',
        value: 40,
        children: [
          { name: '管理费', value: 20 },
          { name: '运输费', value: 20 }
        ]
      }
    ],
    turnoverRate: 4.2,
    trend: 12.5
  }

  const chartData = data || defaultData

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-value">
          <span className="value">{chartData.turnoverRate}</span>
          <span className="unit">次/年</span>
        </div>
        <div className="chart-trend" style={{ color: chartData.trend > 0 ? '#52c41a' : '#ff4d4f' }}>
          {chartData.trend > 0 ? '+' : ''}{chartData.trend}%
        </div>
      </div>
      <div className="cost-analysis">
        {chartData.categories.map((category) => (
          <div key={category.name} className="cost-item">
            <div className="cost-label">{category.name}</div>
            <div className="cost-value">{category.value}%</div>
          </div>
        ))}
        <div className="cost-item">
          <div className="cost-label">周转率</div>
          <div className="cost-value">{chartData.turnoverRate}次/年</div>
        </div>
      </div>
    </div>
  )
}

export default CostAnalysisChart
