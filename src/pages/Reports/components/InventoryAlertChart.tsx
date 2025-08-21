import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface InventoryAlertChartProps {
  data?: {
    alertCount: number
    totalCount: number
    alertLevel: 'low' | 'medium' | 'high'
  }
}

const InventoryAlertChart: React.FC<InventoryAlertChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts>()

  const defaultData = {
    alertCount: 12,
    totalCount: 156,
    alertLevel: 'medium' as const
  }

  const chartData = data || defaultData
  const alertRate = (chartData.alertCount / chartData.totalCount) * 100

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'high': return '#ff4d4f'
      case 'medium': return '#faad14'
      case 'low': return '#52c41a'
      default: return '#faad14'
    }
  }

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current)
      
      const option = {
        backgroundColor: 'transparent',
        series: [
          {
            type: 'gauge',
            center: ['50%', '45%'],
            radius: '80%',
            min: 0,
            max: 100,
            splitNumber: 5,
            axisLine: {
              lineStyle: {
                width: 8,
                color: [
                  [0.2, '#52c41a'],
                  [0.5, '#faad14'],
                  [1, '#ff4d4f']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: getAlertColor(chartData.alertLevel)
              }
            },
            axisTick: {
              distance: -15,
              length: 5,
              lineStyle: {
                color: '#ffffff'
              }
            },
            splitLine: {
              distance: -20,
              length: 10,
              lineStyle: {
                color: '#ffffff'
              }
            },
            axisLabel: {
              color: '#ffffff',
              distance: -35,
              fontSize: 10
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}%',
              color: '#ffffff',
              fontSize: 14,
              offsetCenter: [0, '90%']
            },
            data: [
              {
                value: Number(alertRate.toFixed(2)),
                name: '预警率'
              }
            ]
          }
        ]
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
          <span className="value">{chartData.alertCount}</span>
          <span className="unit">项</span>
        </div>
        <div className="chart-trend" style={{ color: getAlertColor(chartData.alertLevel) }}>
          {chartData.alertLevel === 'high' ? '高风险' : 
           chartData.alertLevel === 'medium' ? '中风险' : '低风险'}
        </div>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '120px' }} />
    </div>
  )
}

export default InventoryAlertChart
