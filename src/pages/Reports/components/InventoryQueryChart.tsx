import React, { useEffect, useRef, useMemo } from 'react'
import * as echarts from 'echarts'

interface InventoryQueryChartProps {
  data?: {
    categories: string[]
    values: number[]
    trend: number
  }
}

const InventoryQueryChart: React.FC<InventoryQueryChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  const defaultData = useMemo(() => ({
    categories: ['钢材', '水泥', '设备', '工具', '配件'],
    values: [156, 89, 67, 45, 32],
    trend: 12.5
  }), [])

  const chartData = data || defaultData

  // 初始化图表 - 只在组件挂载时执行一次
  useEffect(() => {
    if (!chartRef.current) return

    // 只在没有实例时创建
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    // 监听窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, []) // 空依赖数组，只在挂载时执行

  // 更新图表数据 - 当数据变化时执行
  useEffect(() => {
    if (!chartInstance.current) return

    const option = {
      backgroundColor: 'transparent',
      animation: false, // 禁用动画避免闪烁
      grid: {
        top: '12%',
        left: '5%',
        right: '10%',
        bottom: '0%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.categories,
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
          type: 'bar',
          data: chartData.values,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#00d4ff' },
              { offset: 1, color: '#0066cc' }
            ])
          },
          barWidth: '50%',
          label: {
            show: true,
            position: 'top',
            color: '#ffffff',
            fontSize: 8
          }
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

    // 使用 setOption 更新数据，而不是重新创建实例
    chartInstance.current.setOption(option, true) // 第二个参数 true 表示不合并，完全替换
  }, [])

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-value">
          <span className="value">{chartData.values.reduce((a, b) => a + b, 0)}</span>
          <span className="unit">种</span>
        </div>
        <div className="chart-trend" style={{ color: chartData.trend > 0 ? '#52c41a' : '#ff4d4f' }}>
          {chartData.trend > 0 ? '+' : ''}{chartData.trend}%
        </div>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '120px' }} />
    </div>
  )
}

export default InventoryQueryChart
