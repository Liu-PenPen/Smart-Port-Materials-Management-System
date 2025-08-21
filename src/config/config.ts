// 系统配置
export const HOME_URL = '/'

// API配置
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.example.com' 
  : 'http://localhost:3000'

// 系统设置
export const SYSTEM_CONFIG = {
  title: '智慧港口物资管理系统',
  version: '1.0.0',
  copyright: '© 2025 港口物资管理系统',
}

// 分页配置
export const PAGE_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
}

// 文件上传配置
export const UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  acceptTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
}
