import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import relativeTime from 'dayjs/plugin/relativeTime'
import ThemeProvider from './components/ThemeProvider'
import App from './App.tsx'
import './index.css'

// 扩展dayjs插件
dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(relativeTime)

// 设置dayjs中文
dayjs.locale('zh-cn')

// 创建QueryClient实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
