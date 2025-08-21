import dayjs from 'dayjs'

/**
 * 格式化日期
 */
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD') => {
  if (!date) return ''
  try {
    const dayjsDate = dayjs(date)
    if (!dayjsDate.isValid()) return ''
    return dayjsDate.format(format)
  } catch (error) {
    console.warn('formatDate error:', error, 'date:', date)
    return ''
  }
}

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return ''
  try {
    const dayjsDate = dayjs(date)
    if (!dayjsDate.isValid()) return ''
    return dayjsDate.format(format)
  } catch (error) {
    console.warn('formatDateTime error:', error, 'date:', date)
    return ''
  }
}

/**
 * 格式化金额
 */
export const formatMoney = (amount: number | string, precision = 2) => {
  if (amount === null || amount === undefined || amount === '') return '0.00'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
}

/**
 * 格式化数量
 */
export const formatQuantity = (quantity: number | string, precision = 3) => {
  if (quantity === null || quantity === undefined || quantity === '') return '0'
  const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  })
}

/**
 * 生成唯一ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), wait)
    }
  }
}

/**
 * 深拷贝
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * 获取文件扩展名
 */
export const getFileExtension = (filename: string) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 生成随机颜色
 */
export const generateRandomColor = () => {
  const colors = [
    '#f56a00', '#7265e6', '#ffbf00', '#00a2ae',
    '#1890ff', '#52c41a', '#fa8c16', '#eb2f96',
    '#722ed1', '#13c2c2', '#fa541c', '#2f54eb'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * 获取状态标签配置
 */
export const getStatusConfig = (status: string) => {
  const statusMap: Record<string, { color: string; text: string }> = {
    // 通用状态
    'ACTIVE': { color: 'green', text: '启用' },
    'INACTIVE': { color: 'red', text: '停用' },
    
    // 申请状态
    'DRAFT': { color: 'default', text: '草稿' },
    'SUBMITTED': { color: 'processing', text: '已提交' },
    'DEPT_APPROVED': { color: 'warning', text: '部门审批' },
    'PURCHASE_APPROVED': { color: 'success', text: '采购审批' },
    'IN_PROCUREMENT': { color: 'processing', text: '采购中' },
    'COMPLETED': { color: 'success', text: '已完成' },
    'REJECTED': { color: 'error', text: '已拒绝' },
    'CANCELLED': { color: 'default', text: '已取消' },
    
    // 审批状态
    'PENDING': { color: 'warning', text: '待审批' },
    'APPROVED': { color: 'success', text: '已审批' },
    
    // 单据状态
    'CONFIRMED': { color: 'success', text: '已确认' },
    'ARCHIVED': { color: 'default', text: '已归档' },
  }
  
  return statusMap[status] || { color: 'default', text: status }
}

/**
 * 验证身份证号
 */
export const validateIdCard = (idCard: string) => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}

/**
 * 验证手机号
 */
export const validatePhone = (phone: string) => {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证邮箱
 */
export const validateEmail = (email: string) => {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return reg.test(email)
}

/**
 * 验证统一社会信用代码
 */
export const validateSocialCreditCode = (code: string) => {
  const reg = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
  return reg.test(code)
}

/**
 * 计算两个日期之间的天数
 */
export const daysBetween = (date1: string | Date, date2: string | Date) => {
  const d1 = dayjs(date1)
  const d2 = dayjs(date2)
  return Math.abs(d1.diff(d2, 'day'))
}

/**
 * 获取当前财务期间
 */
export const getCurrentPeriod = () => {
  return dayjs().format('YYYY-MM')
}

/**
 * 获取当前年份
 */
export const getCurrentYear = () => {
  return dayjs().format('YYYY')
}

/**
 * 检查期间是否锁定
 */
export const isPeriodLocked = (period: string, lockedPeriods: string[]) => {
  return lockedPeriods.includes(period)
}

/**
 * 生成编码
 */
export const generateCode = (prefix: string, sequence: number, length = 6) => {
  const paddedSequence = sequence.toString().padStart(length, '0')
  return `${prefix}${paddedSequence}`
}

/**
 * 树形数据转换为平铺数据
 */
export const flattenTree = <T extends { children?: T[] }>(tree: T[]): T[] => {
  const result: T[] = []
  
  const traverse = (nodes: T[]) => {
    nodes.forEach(node => {
      const { children, ...rest } = node
      result.push(rest as T)
      if (children && children.length > 0) {
        traverse(children)
      }
    })
  }
  
  traverse(tree)
  return result
}

/**
 * 平铺数据转换为树形数据
 */
export const buildTree = <T extends { id: number; parentId?: number }>(
  data: T[],
  parentId?: number
): (T & { children?: T[] })[] => {
  return data
    .filter(item => item.parentId === parentId)
    .map(item => ({
      ...item,
      children: buildTree(data, item.id),
    }))
}
