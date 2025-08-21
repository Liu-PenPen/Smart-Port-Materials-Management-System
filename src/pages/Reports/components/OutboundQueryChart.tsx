import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface OutboundQueryChartProps {
  data?: {
    categories: Array<{ name: string; value: number; color: string }>
    total: number
    trend: number
  }
}

const OutboundQueryChart: React.FC<OutboundQueryChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts>()

  const defaultData = {
    categories: [
      { name: '正常出库', value: 65, color: '#52c41a' },
      { name: '紧急出库', value: 25, color: '#faad14' },
      { name: '退库', value: 10, color: '#ff4d4f' }
    ],
    total: 950000,
    trend: 15.2
  }

  const chartData = data || defaultData

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current)
      
      const option = {
        backgroundColor: 'transparent',
        series: [
          {
            type: 'pie',
            radius: ['60%', '90%'],
            center: ['50%', '50%'],
            data: chartData.categories.map(item => ({
              value: item.value,
              name: item.name,
              itemStyle: {
                color: item.color
              }
            })),
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#00d4ff',
          textStyle: {
            color: '#ffffff'
          },
          formatter: '{a} <br/>{b}: {c}% ({d}%)'
        }
      }

      chartInstance.current.setOption(option)
    }

    return () => {
      chartInstance.current?.dispose()
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-value">
          <span className="value">¥{(chartData.total / 10000).toFixed(1)}</span>
          <span className="unit">万</span>
        </div>
        <div className="chart-trend" style={{ color: chartData.trend > 0 ? '#52c41a' : '#ff4d4f' }}>
          {chartData.trend > 0 ? '+' : ''}{chartData.trend}%
        </div>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '120px' }} />
      <div className="chart-legend">
        {chartData.categories.map((item, index) => (
          <div key={index} className="legend-item-small">
            <div className="legend-color-small" style={{ backgroundColor: item.color }}></div>
            <span className="legend-text-small">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OutboundQueryChart
