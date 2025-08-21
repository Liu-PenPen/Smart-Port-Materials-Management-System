// 系统常量定义

// API 响应状态码
export const API_CODE = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const

// 分页默认配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true,
  SHOW_TOTAL: (total: number, range: [number, number]) =>
    `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
} as const

// 表单验证规则
export const FORM_RULES = {
  REQUIRED: { required: true, message: '此字段为必填项' },
  EMAIL: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: '请输入正确的邮箱格式',
  },
  PHONE: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号格式',
  },
  SOCIAL_CREDIT_CODE: {
    pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
    message: '请输入正确的统一社会信用代码',
  },
  POSITIVE_NUMBER: {
    pattern: /^[1-9]\d*(\.\d+)?$/,
    message: '请输入大于0的数字',
  },
  NON_NEGATIVE_NUMBER: {
    pattern: /^\d+(\.\d+)?$/,
    message: '请输入大于等于0的数字',
  },
} as const

// 业务状态枚举
export const BUSINESS_STATUS = {
  // 通用状态
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  
  // 申请状态
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  DEPT_APPROVED: 'DEPT_APPROVED',
  PURCHASE_APPROVED: 'PURCHASE_APPROVED',
  IN_PROCUREMENT: 'IN_PROCUREMENT',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  
  // 审批状态
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  
  // 单据状态
  CONFIRMED: 'CONFIRMED',
  ARCHIVED: 'ARCHIVED',

  // 出库状态
  OUTBOUND_PROCESSING: 'OUTBOUND_PROCESSING',
  UNDER_REVIEW: 'UNDER_REVIEW',
} as const

// 状态标签配置
export const STATUS_CONFIG = {
  [BUSINESS_STATUS.ACTIVE]: { color: 'green', text: '启用' },
  [BUSINESS_STATUS.INACTIVE]: { color: 'red', text: '停用' },
  [BUSINESS_STATUS.DRAFT]: { color: 'default', text: '草稿' },
  [BUSINESS_STATUS.SUBMITTED]: { color: 'processing', text: '已提交' },
  [BUSINESS_STATUS.DEPT_APPROVED]: { color: 'warning', text: '部门审批' },
  [BUSINESS_STATUS.PURCHASE_APPROVED]: { color: 'success', text: '采购审批' },
  [BUSINESS_STATUS.IN_PROCUREMENT]: { color: 'processing', text: '采购中' },
  [BUSINESS_STATUS.COMPLETED]: { color: 'success', text: '已完成' },
  [BUSINESS_STATUS.REJECTED]: { color: 'error', text: '已拒绝' },
  [BUSINESS_STATUS.CANCELLED]: { color: 'default', text: '已取消' },
  [BUSINESS_STATUS.PENDING]: { color: 'warning', text: '待审批' },
  [BUSINESS_STATUS.APPROVED]: { color: 'success', text: '已审批' },
  [BUSINESS_STATUS.CONFIRMED]: { color: 'success', text: '已确认' },
  [BUSINESS_STATUS.ARCHIVED]: { color: 'default', text: '已归档' },
  [BUSINESS_STATUS.OUTBOUND_PROCESSING]: { color: 'processing', text: '出库中' },
  [BUSINESS_STATUS.UNDER_REVIEW]: { color: 'warning', text: '审核中' },
} as const



// 出库类型
export const OUTBOUND_TYPE = {
  NORMAL: 'NORMAL',
  URGENT: 'URGENT',
  TRANSFER: 'TRANSFER',
  RETURN: 'RETURN',
} as const

export const OUTBOUND_TYPE_CONFIG = {
  [OUTBOUND_TYPE.NORMAL]: { color: 'blue', text: '正常出库' },
  [OUTBOUND_TYPE.URGENT]: { color: 'red', text: '紧急出库' },
  [OUTBOUND_TYPE.TRANSFER]: { color: 'orange', text: '移库出库' },
  [OUTBOUND_TYPE.RETURN]: { color: 'green', text: '退库出库' },
} as const

// 移库类型
export const TRANSFER_TYPE = {
  WAREHOUSE_TRANSFER: 'WAREHOUSE_TRANSFER',
  AREA_TRANSFER: 'AREA_TRANSFER',
  SHIP_SCHEDULE_TRANSFER: 'SHIP_SCHEDULE_TRANSFER',
  EMERGENCY_TRANSFER: 'EMERGENCY_TRANSFER',
} as const

export const TRANSFER_TYPE_CONFIG = {
  [TRANSFER_TYPE.WAREHOUSE_TRANSFER]: { color: 'blue', text: '仓库间移库' },
  [TRANSFER_TYPE.AREA_TRANSFER]: { color: 'green', text: '货区调整' },
  [TRANSFER_TYPE.SHIP_SCHEDULE_TRANSFER]: { color: 'purple', text: '船期调整' },
  [TRANSFER_TYPE.EMERGENCY_TRANSFER]: { color: 'red', text: '紧急移库' },
} as const

// 运输方式
export const TRANSPORT_METHOD = {
  FORKLIFT: 'FORKLIFT',
  CRANE: 'CRANE',
  TRUCK: 'TRUCK',
  CONVEYOR: 'CONVEYOR',
  MANUAL: 'MANUAL',
} as const

export const TRANSPORT_METHOD_CONFIG = {
  [TRANSPORT_METHOD.FORKLIFT]: { color: 'blue', text: '叉车运输' },
  [TRANSPORT_METHOD.CRANE]: { color: 'orange', text: '起重机' },
  [TRANSPORT_METHOD.TRUCK]: { color: 'green', text: '卡车运输' },
  [TRANSPORT_METHOD.CONVEYOR]: { color: 'purple', text: '传送带' },
  [TRANSPORT_METHOD.MANUAL]: { color: 'default', text: '人工搬运' },
} as const

// 紧急程度
export const URGENCY_LEVEL = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const

export const URGENCY_LEVEL_CONFIG = {
  [URGENCY_LEVEL.LOW]: { color: 'default', text: '一般' },
  [URGENCY_LEVEL.MEDIUM]: { color: 'warning', text: '紧急' },
  [URGENCY_LEVEL.HIGH]: { color: 'error', text: '特急' },
} as const


// 领用类型
export const USAGE_TYPE = {
  PRODUCTION: 'PRODUCTION',
  MAINTENANCE: 'MAINTENANCE',
  OFFICE: 'OFFICE',
  OTHER: 'OTHER',
} as const

export const USAGE_TYPE_CONFIG = {
  [USAGE_TYPE.PRODUCTION]: { color: 'blue', text: '生产用' },
  [USAGE_TYPE.MAINTENANCE]: { color: 'orange', text: '维修用' },
  [USAGE_TYPE.OFFICE]: { color: 'green', text: '办公用' },
  [USAGE_TYPE.OTHER]: { color: 'default', text: '其他' },
} as const

// 预警级别
export const ALERT_LEVEL = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const

export const ALERT_LEVEL_CONFIG = {
  [ALERT_LEVEL.LOW]: { color: 'yellow', text: '轻微' },
  [ALERT_LEVEL.MEDIUM]: { color: 'orange', text: '中等' },
  [ALERT_LEVEL.HIGH]: { color: 'red', text: '严重' },
} as const

// 公司类型
export const COMPANY_TYPE = {
  GROUP: 'GROUP',
  SUBSIDIARY: 'SUBSIDIARY',
  BRANCH: 'BRANCH',
} as const

export const COMPANY_TYPE_CONFIG = {
  [COMPANY_TYPE.GROUP]: { text: '集团' },
  [COMPANY_TYPE.SUBSIDIARY]: { text: '子公司' },
  [COMPANY_TYPE.BRANCH]: { text: '分公司' },
} as const

// 文件类型
export const FILE_TYPE = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
} as const

// 文件大小限制（字节）
export const FILE_SIZE_LIMIT = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  ARCHIVE: 50 * 1024 * 1024, // 50MB
} as const

// 日期格式
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
} as const

// 数字格式
export const NUMBER_FORMAT = {
  MONEY_PRECISION: 2,
  QUANTITY_PRECISION: 3,
  RATE_PRECISION: 4,
} as const

// 缓存键名
export const CACHE_KEYS = {
  USER_INFO: 'user_info',
  PERMISSIONS: 'permissions',
  MENU_CONFIG: 'menu_config',
  DICT_DATA: 'dict_data',
} as const

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_SETTINGS: 'user_settings',
  THEME_CONFIG: 'theme_config',
} as const

// 操作类型
export const OPERATION_TYPE = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  QUERY: 'QUERY',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
} as const

// 权限动作
export const PERMISSION_ACTION = {
  VIEW: 'VIEW',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  APPROVE: 'APPROVE',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
} as const

// 数据范围
export const DATA_SCOPE = {
  ALL: 'ALL',
  COMPANY: 'COMPANY',
  DEPARTMENT: 'DEPARTMENT',
  SELF: 'SELF',
} as const

// 报表类型
export const REPORT_TYPE = {
  INVENTORY: 'INVENTORY',
  PURCHASE: 'PURCHASE',
  OUTBOUND: 'OUTBOUND',
  FINANCIAL: 'FINANCIAL',
  ANALYSIS: 'ANALYSIS',
} as const

// 导出格式
export const EXPORT_FORMAT = {
  EXCEL: 'EXCEL',
  PDF: 'PDF',
  CSV: 'CSV',
} as const

// 集采供应商状态
export const GROUP_SUPPLIER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  BLACKLISTED: 'BLACKLISTED',
} as const

export const GROUP_SUPPLIER_STATUS_CONFIG = {
  [GROUP_SUPPLIER_STATUS.ACTIVE]: { color: 'green', text: '正常' },
  [GROUP_SUPPLIER_STATUS.INACTIVE]: { color: 'default', text: '停用' },
  [GROUP_SUPPLIER_STATUS.SUSPENDED]: { color: 'orange', text: '暂停' },
  [GROUP_SUPPLIER_STATUS.BLACKLISTED]: { color: 'red', text: '黑名单' },
} as const

// 考核结果
export const ASSESSMENT_RESULT = {
  EXCELLENT: 'EXCELLENT',
  GOOD: 'GOOD',
  QUALIFIED: 'QUALIFIED',
  UNQUALIFIED: 'UNQUALIFIED',
} as const

export const ASSESSMENT_RESULT_CONFIG = {
  [ASSESSMENT_RESULT.EXCELLENT]: { color: 'green', text: '优秀' },
  [ASSESSMENT_RESULT.GOOD]: { color: 'blue', text: '良好' },
  [ASSESSMENT_RESULT.QUALIFIED]: { color: 'orange', text: '合格' },
  [ASSESSMENT_RESULT.UNQUALIFIED]: { color: 'red', text: '不合格' },
} as const

// 考核状态
export const ASSESSMENT_STATUS = {
  DRAFT: 'DRAFT',
  AREA_SUBMITTED: 'AREA_SUBMITTED',
  HEADQUARTERS_REVIEWING: 'HEADQUARTERS_REVIEWING',
  COMPLETED: 'COMPLETED',
} as const

export const ASSESSMENT_STATUS_CONFIG = {
  [ASSESSMENT_STATUS.DRAFT]: { color: 'default', text: '草稿' },
  [ASSESSMENT_STATUS.AREA_SUBMITTED]: { color: 'processing', text: '作业区已提交' },
  [ASSESSMENT_STATUS.HEADQUARTERS_REVIEWING]: { color: 'warning', text: '总部审核中' },
  [ASSESSMENT_STATUS.COMPLETED]: { color: 'success', text: '已完成' },
} as const

// 考核标准类别
export const ASSESSMENT_CRITERIA_CATEGORY = {
  QUALITY: 'QUALITY',
  ATTITUDE: 'ATTITUDE',
  TIMELINESS: 'TIMELINESS',
  OTHER: 'OTHER',
} as const

export const ASSESSMENT_CRITERIA_CATEGORY_CONFIG = {
  [ASSESSMENT_CRITERIA_CATEGORY.QUALITY]: { color: 'blue', text: '服务质量' },
  [ASSESSMENT_CRITERIA_CATEGORY.ATTITUDE]: { color: 'green', text: '服务态度' },
  [ASSESSMENT_CRITERIA_CATEGORY.TIMELINESS]: { color: 'orange', text: '服务时效' },
  [ASSESSMENT_CRITERIA_CATEGORY.OTHER]: { color: 'purple', text: '其他' },
} as const

// 物资申请状态
export const MATERIAL_REQUEST_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const

export const MATERIAL_REQUEST_STATUS_CONFIG = {
  [MATERIAL_REQUEST_STATUS.DRAFT]: { color: 'default', text: '草稿' },
  [MATERIAL_REQUEST_STATUS.SUBMITTED]: { color: 'processing', text: '已提交' },
  [MATERIAL_REQUEST_STATUS.APPROVED]: { color: 'success', text: '已批准' },
  [MATERIAL_REQUEST_STATUS.REJECTED]: { color: 'error', text: '已驳回' },
  [MATERIAL_REQUEST_STATUS.CANCELLED]: { color: 'default', text: '已取消' },
} as const



// 采购类型
export const PURCHASE_TYPE = {
  NORMAL: 'NORMAL',
  URGENT: 'URGENT',
  CENTRALIZED: 'CENTRALIZED',
  SPECIAL: 'SPECIAL',
} as const

export const PURCHASE_TYPE_CONFIG = {
  [PURCHASE_TYPE.NORMAL]: { color: 'blue', text: '常规采购' },
  [PURCHASE_TYPE.URGENT]: { color: 'red', text: '紧急采购' },
  [PURCHASE_TYPE.CENTRALIZED]: { color: 'purple', text: '集中采购' },
  [PURCHASE_TYPE.SPECIAL]: { color: 'orange', text: '专项采购' },
} as const

// 采购状态
export const PURCHASE_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ORDERED: 'ORDERED',
  COMPLETED: 'COMPLETED',
} as const

export const PURCHASE_STATUS_CONFIG = {
  [PURCHASE_STATUS.DRAFT]: { color: 'default', text: '草稿' },
  [PURCHASE_STATUS.SUBMITTED]: { color: 'processing', text: '已提交' },
  [PURCHASE_STATUS.APPROVED]: { color: 'success', text: '已批准' },
  [PURCHASE_STATUS.REJECTED]: { color: 'error', text: '已驳回' },
  [PURCHASE_STATUS.ORDERED]: { color: 'warning', text: '已下单' },
  [PURCHASE_STATUS.COMPLETED]: { color: 'success', text: '已完成' },
} as const

// 结算状态
export const SETTLEMENT_STATUS = {
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  COMPLETED: 'COMPLETED',
} as const

export const SETTLEMENT_STATUS_CONFIG = {
  [SETTLEMENT_STATUS.PENDING]: { color: 'warning', text: '待结算' },
  [SETTLEMENT_STATUS.PARTIAL]: { color: 'processing', text: '部分结算' },
  [SETTLEMENT_STATUS.COMPLETED]: { color: 'success', text: '已完成' },
} as const

// 到货状态
export const ARRIVAL_STATUS = {
  ARRIVED: 'ARRIVED',
  INSPECTED: 'INSPECTED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const

export const ARRIVAL_STATUS_CONFIG = {
  [ARRIVAL_STATUS.ARRIVED]: { color: 'processing', text: '已到货' },
  [ARRIVAL_STATUS.INSPECTED]: { color: 'warning', text: '已检验' },
  [ARRIVAL_STATUS.ACCEPTED]: { color: 'success', text: '已验收' },
  [ARRIVAL_STATUS.REJECTED]: { color: 'error', text: '已拒收' },
} as const

// 质量状态
export const QUALITY_STATUS = {
  QUALIFIED: 'QUALIFIED',
  UNQUALIFIED: 'UNQUALIFIED',
  PARTIAL: 'PARTIAL',
} as const

export const QUALITY_STATUS_CONFIG = {
  [QUALITY_STATUS.QUALIFIED]: { color: 'success', text: '合格' },
  [QUALITY_STATUS.UNQUALIFIED]: { color: 'error', text: '不合格' },
  [QUALITY_STATUS.PARTIAL]: { color: 'warning', text: '部分合格' },
} as const

// 物资追踪状态
export const TRACKING_STATUS = {
  SHIPPED: 'SHIPPED',
  IN_TRANSIT: 'IN_TRANSIT',
  ARRIVED: 'ARRIVED',
  IN_WAREHOUSE: 'IN_WAREHOUSE',
  DELIVERED: 'DELIVERED',
} as const

export const TRACKING_STATUS_CONFIG = {
  [TRACKING_STATUS.SHIPPED]: { color: 'blue', text: '已发货' },
  [TRACKING_STATUS.IN_TRANSIT]: { color: 'processing', text: '运输中' },
  [TRACKING_STATUS.ARRIVED]: { color: 'warning', text: '已到达' },
  [TRACKING_STATUS.IN_WAREHOUSE]: { color: 'success', text: '已入库' },
  [TRACKING_STATUS.DELIVERED]: { color: 'green', text: '已配送' },
} as const

// 位置类型
export const LOCATION_TYPE = {
  SUPPLIER: 'SUPPLIER',
  TRANSIT: 'TRANSIT',
  PORT_GATE: 'PORT_GATE',
  WAREHOUSE: 'WAREHOUSE',
  CUSTOMER: 'CUSTOMER',
} as const

export const LOCATION_TYPE_CONFIG = {
  [LOCATION_TYPE.SUPPLIER]: { color: 'blue', text: '供应商' },
  [LOCATION_TYPE.TRANSIT]: { color: 'processing', text: '运输中' },
  [LOCATION_TYPE.PORT_GATE]: { color: 'orange', text: '港口大门' },
  [LOCATION_TYPE.WAREHOUSE]: { color: 'green', text: '仓库' },
  [LOCATION_TYPE.CUSTOMER]: { color: 'purple', text: '客户' },
} as const

// 操作类型
export const TRACKING_OPERATION_TYPE = {
  PURCHASE: 'PURCHASE',
  ARRIVAL: 'ARRIVAL',
  INSPECTION: 'INSPECTION',
  STORAGE: 'STORAGE',
  ISSUE: 'ISSUE',
  TRANSFER: 'TRANSFER',
  CONSUME: 'CONSUME',
} as const

export const TRACKING_OPERATION_TYPE_CONFIG = {
  [TRACKING_OPERATION_TYPE.PURCHASE]: { color: 'blue', text: '采购' },
  [TRACKING_OPERATION_TYPE.ARRIVAL]: { color: 'green', text: '到货' },
  [TRACKING_OPERATION_TYPE.INSPECTION]: { color: 'orange', text: '检验' },
  [TRACKING_OPERATION_TYPE.STORAGE]: { color: 'purple', text: '入库' },
  [TRACKING_OPERATION_TYPE.ISSUE]: { color: 'red', text: '出库' },
  [TRACKING_OPERATION_TYPE.TRANSFER]: { color: 'cyan', text: '转移' },
  [TRACKING_OPERATION_TYPE.CONSUME]: { color: 'default', text: '消耗' },
} as const
