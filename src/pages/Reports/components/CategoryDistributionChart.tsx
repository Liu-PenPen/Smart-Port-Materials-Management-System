import React from 'react'

interface CategoryDistributionChartProps {
  data?: {
    categories: Array<{
      name: string
      value: number
      percentage: number
    }>
    totalValue: number
  }
}

const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({ data }) => {
  const defaultData = {
    categories: [
      { name: '钢材', value: 8500000, percentage: 34 },
      { name: '水泥', value: 6250000, percentage: 25 },
      { name: '设备', value: 5000000, percentage: 20 },
      { name: '工具', value: 5250000, percentage: 21 }
    ],
    totalValue: 25000000
  }

  const chartData = data || defaultData

  const formatMoney = (value: number) => {
    return (value / 10000).toFixed(1)
  }

  return (
    <div className="category-chart-container">
      <div className="category-chart-center">
        <div className="chart-center-value">¥{formatMoney(chartData.totalValue)}万</div>
        <div className="chart-center-label">库存总价值</div>
      </div>
      <div className="category-legend">
        {chartData.categories.map((category, index) => (
          <div key={category.name} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: `hsl(${index * 90}, 70%, 60%)` }}
            ></div>
            <div className="legend-info">
              <div className="legend-name">{category.name}</div>
              <div className="legend-value">¥{formatMoney(category.value)}万</div>
              <div className="legend-percent">{category.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryDistributionChart
