import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface RequisitionStatsChartProps {
  data?: {
    dates: string[]
    values: number[]
    total: number
    trend: number
  }
}

const RequisitionStatsChart: React.FC<RequisitionStatsChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts>()

  const defaultData = {
    dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    values: [12, 8, 15, 10, 18, 6, 9],
    total: 78,
    trend: 8.5
  }

  const chartData = data || defaultData

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current)
      
      const option = {
        backgroundColor: 'transparent',
        grid: {
           top: '12%',
            left: '5%',
            right: '10%',
            bottom: '0%',
            containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.dates,
          axisLine: {
            lineStyle: {
              color: '#4a90e2'
            }
          },
          axisLabel: {
            color: '#ffffff',
            fontSize: 9
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#ffffff',
            fontSize: 9
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(74, 144, 226, 0.2)'
            }
          }
        },
        series: [
          {
            type: 'line',
            data: chartData.values,
            smooth: true,
            lineStyle: {
              color: '#52c41a',
              width: 2
            },
            itemStyle: {
              color: '#52c41a'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
              ])
            },
            symbol: 'circle',
            symbolSize: 4
          }
        ],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#52c41a',
          textStyle: {
            color: '#ffffff'
          }
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
          <span className="value">{chartData.total}</span>
          <span className="unit">单</span>
        </div>
        <div className="chart-trend" style={{ color: chartData.trend > 0 ? '#52c41a' : '#ff4d4f' }}>
          {chartData.trend > 0 ? '+' : ''}{chartData.trend}%
        </div>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '150px' }} />
    </div>
  )
}

export default RequisitionStatsChart
