import React from 'react'

interface FinancialReportChartProps {
  data?: {
    months: string[]
    values: number[]
    budget: number[]
    total: number
    trend: number
  }
}

const FinancialReportChart: React.FC<FinancialReportChartProps> = ({ data }) => {
  const defaultData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月'],
    values: [2500, 2800, 2200, 3100, 2900, 3500],
    budget: [3000, 3000, 3000, 3000, 3000, 3000],
    total: 25000000,
    trend: 12.8
  }

  const chartData = data || defaultData
  const currentValue = chartData.values[chartData.values.length - 1]
  const currentBudget = chartData.budget[chartData.budget.length - 1]
  const utilizationRate = ((currentValue / currentBudget) * 100).toFixed(1)

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-value">
          <span className="value">¥{(chartData.total / 10000).toFixed(0)}</span>
          <span className="unit">万</span>
        </div>
        <div className="chart-trend" style={{ color: chartData.trend > 0 ? '#ff4d4f' : '#52c41a' }}>
          {chartData.trend > 0 ? '+' : ''}{chartData.trend}%
        </div>
      </div>
      <div className="financial-summary">
        <div className="financial-item">
          <div className="financial-label">本月支出</div>
          <div className="financial-value">{currentValue}万</div>
        </div>
        <div className="financial-item">
          <div className="financial-label">预算额度</div>
          <div className="financial-value">{currentBudget}万</div>
        </div>
        <div className="financial-item">
          <div className="financial-label">预算使用率</div>
          <div className="financial-value" style={{ color: parseFloat(utilizationRate) > 90 ? '#ff4d4f' : '#722ed1' }}>
            {utilizationRate}%
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialReportChart
