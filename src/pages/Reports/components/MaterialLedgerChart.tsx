import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface MaterialLedgerChartProps {
  data?: {
    months: string[]
    inbound: number[]
    outbound: number[]
    total: number
    trend: number
  }
}

const MaterialLedgerChart: React.FC<MaterialLedgerChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts>()

  const defaultData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月'],
    inbound: [120, 132, 101, 134, 90, 230],
    outbound: [80, 98, 87, 106, 78, 165],
    total: 1250000,
    trend: 18.5
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
        legend: {
          data: ['入库', '出库'],
          textStyle: {
            color: '#ffffff',
            fontSize: 10
          },
          top: '5%'
        },
        xAxis: {
          type: 'category',
          data: chartData.months,
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
            lineStyle: {
              color: '#4a90e2'
            }
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
            name: '入库',
            type: 'bar',
            data: chartData.inbound,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#52c41a' },
                { offset: 1, color: '#389e0d' }
              ])
            },
            barWidth: '35%'
          },
          {
            name: '出库',
            type: 'bar',
            data: chartData.outbound,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#1890ff' },
                { offset: 1, color: '#096dd9' }
              ])
            },
            barWidth: '35%'
          }
        ],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#00d4ff',
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
          <span className="value">¥{(chartData.total / 10000).toFixed(1)}</span>
          <span className="unit">万</span>
        </div>
        <div className="chart-trend" style={{ color: chartData.trend > 0 ? '#52c41a' : '#ff4d4f' }}>
          {chartData.trend > 0 ? '+' : ''}{chartData.trend}%
        </div>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '150px' }} />
    </div>
  )
}

export default MaterialLedgerChart
