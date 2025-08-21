import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import { useAuthStore } from '@/stores/authStore'
import type { ApiResponse } from '@/types'

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 添加认证token
    const token = useAuthStore.getState().token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response
    
    // 如果是文件下载，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }
    
    // 检查业务状态码
    if (data.code === 200) {
      return data
    } else {
      message.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  (error) => {
    // 处理HTTP错误状态码
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          message.error('登录已过期，请重新登录')
          useAuthStore.getState().logout()
          break
        case 403:
          message.error('没有权限访问该资源')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器内部错误')
          break
        default:
          message.error(data?.message || `请求失败 (${status})`)
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络')
    } else {
      message.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

// 通用请求方法
export const request = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return api.get(url, config)
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return api.post(url, data, config)
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return api.put(url, data, config)
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return api.delete(url, config)
  },
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return api.patch(url, data, config)
  },
  
  // 文件上传
  upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    })
  },
  
  // 文件下载
  download: (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return api.get(url, {
      ...config,
      responseType: 'blob',
    })
  },
}

export default api
