import { request } from './api'
import type { Supplier, SupplierEvaluation, PageResult, PaginationParams } from '@/types'

// 供应商相关API
export const supplierService = {
  // 获取供应商列表
  getSuppliers: (params: PaginationParams & {
    supplierName?: string
    supplierCode?: string
    status?: string
    companyId?: number
  }) => {
    return request.get<PageResult<Supplier>>('/suppliers', { params })
  },

  // 获取供应商详情
  getSupplier: (id: number) => {
    return request.get<Supplier>(`/suppliers/${id}`)
  },

  // 创建供应商
  createSupplier: (data: Omit<Supplier, 'id' | 'createdBy' | 'createdTime' | 'version'>) => {
    return request.post<Supplier>('/suppliers', data)
  },

  // 更新供应商
  updateSupplier: (id: number, data: Partial<Supplier>) => {
    return request.put<Supplier>(`/suppliers/${id}`, data)
  },

  // 删除供应商（软删除，改为停用状态）
  deleteSupplier: (id: number) => {
    return request.delete(`/suppliers/${id}`)
  },

  // 批量操作
  batchUpdateStatus: (ids: number[], status: 'ACTIVE' | 'INACTIVE') => {
    return request.post('/suppliers/batch-status', { ids, status })
  },

  // 检查供应商编码是否存在
  checkSupplierCode: (code: string, excludeId?: number) => {
    return request.get<boolean>('/suppliers/check-code', { 
      params: { code, excludeId } 
    })
  },

  // 获取供应商选项（用于下拉选择）
  getSupplierOptions: (companyId?: number) => {
    return request.get<Array<{ value: number; label: string; code: string }>>('/suppliers/options', {
      params: { companyId }
    })
  },

  // 导出供应商数据
  exportSuppliers: (params: any) => {
    return request.download('/suppliers/export', { params })
  },

  // 导入供应商数据
  importSuppliers: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.upload('/suppliers/import', formData)
  },
}

// 供应商考核相关API
export const supplierEvaluationService = {
  // 获取考核列表
  getEvaluations: (params: PaginationParams & {
    evaluationYear?: number
    supplierId?: number
    workAreaId?: number
    isLocked?: boolean
  }) => {
    return request.get<PageResult<SupplierEvaluation>>('/supplier-evaluations', { params })
  },

  // 获取考核详情
  getEvaluation: (id: number) => {
    return request.get<SupplierEvaluation>(`/supplier-evaluations/${id}`)
  },

  // 创建考核记录
  createEvaluation: (data: Omit<SupplierEvaluation, 'id' | 'createdBy' | 'createdTime'>) => {
    return request.post<SupplierEvaluation>('/supplier-evaluations', data)
  },

  // 更新考核记录
  updateEvaluation: (id: number, data: Partial<SupplierEvaluation>) => {
    return request.put<SupplierEvaluation>(`/supplier-evaluations/${id}`, data)
  },

  // 锁定考核记录
  lockEvaluation: (id: number) => {
    return request.post(`/supplier-evaluations/${id}/lock`)
  },

  // 汇总考核结果
  summaryEvaluations: (evaluationYear: number, supplierIds: number[]) => {
    return request.post('/supplier-evaluations/summary', {
      evaluationYear,
      supplierIds
    })
  },

  // 获取考核统计
  getEvaluationStats: (evaluationYear: number) => {
    return request.get('/supplier-evaluations/stats', {
      params: { evaluationYear }
    })
  },
}
