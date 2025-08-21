// 通用类型定义
export interface BaseEntity {
  id: number
  createdBy: number
  createdTime: string
  updatedBy?: number
  updatedTime?: string
  version?: number
}

export interface PaginationParams {
  current: number
  pageSize: number
  total?: number
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

export interface PageResult<T = any> {
  records: T[]
  total: number
  current: number
  size: number
}

// 用户相关类型
export interface User extends BaseEntity {
  username: string
  name: string
  email?: string
  phone?: string
  avatar?: string
  status: 'ACTIVE' | 'INACTIVE'
  roles: Role[]
  companyId: number
  departmentId: number
}

export interface Role {
  id: number
  roleCode: string
  roleName: string
  description?: string
  permissions: Permission[]
}

export interface Permission {
  id: number
  permissionCode: string
  permissionName: string
  resourceType: string
  actionType: string
}

// 供应商类型
export interface Supplier extends BaseEntity {
  supplierCode: string
  supplierName: string
  socialCreditCode?: string
  supplyContent?: string
  companyAddress?: string
  contactPerson?: string
  contactPhone?: string
  businessLicense?: string
  status: 'ACTIVE' | 'INACTIVE'
  companyId: number
}

export interface SupplierEvaluation extends BaseEntity {
  evaluationYear: number
  supplierId: number
  workAreaId: number
  serviceQualityScore?: number
  serviceAttitudeScore?: number
  serviceTimelinessScore?: number
  totalScore?: number
  evaluationResult?: string
  isLocked: boolean
  lockedBy?: number
  lockedTime?: string
  summaryScore?: number
  summaryTime?: string
  summaryBy?: number
}

// 物资类型
export interface Material extends BaseEntity {
  materialCode: string
  materialName: string
  materialTypeId: number
  specification?: string
  unit: string
  pinyinCode?: string
  auxiliaryName?: string
  barcode?: string
  qrCode?: string
  status: 'ACTIVE' | 'INACTIVE'
}

export interface MaterialType {
  id: number
  typeCode: string
  typeName: string
  parentId?: number
  children?: MaterialType[]
}

// 仓库类型
export interface Warehouse extends BaseEntity {
  warehouseCode: string
  warehouseName: string
  companyId: number
  level: string
  address?: string
  status: 'ACTIVE' | 'INACTIVE'
  locations: Location[]
}

export interface Location extends BaseEntity {
  locationCode: string
  locationName: string
  warehouseId: number
  status: 'ACTIVE' | 'INACTIVE'
}

// 申请单类型
export interface Application extends BaseEntity {
  applicationNo: string
  departmentId: number
  applicantId: number
  applicationDate: string
  purpose?: string
  supplyDeadline?: string
  status: ApplicationStatus
  workflowId?: number
  currentApproverId?: number
  remarks?: string
  details: ApplicationDetail[]
}

export type ApplicationStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'DEPT_APPROVED' 
  | 'PURCHASE_APPROVED' 
  | 'IN_PROCUREMENT' 
  | 'COMPLETED' 
  | 'REJECTED' 
  | 'CANCELLED'

export interface ApplicationDetail extends BaseEntity {
  applicationId: number
  materialId: number
  quantity: number
  estimatedPrice?: number
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  remarks?: string
  material?: Material
}

// 采购单类型
export interface PurchaseOrder extends BaseEntity {
  purchaseNo: string
  applicationDate: string
  purchaseType: 'NORMAL' | 'URGENT' | 'CENTRALIZED'
  purchaserId: number
  supplierId: number
  totalAmount: number
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  workflowId?: number
  attachments?: Attachment[]
  remarks?: string
  details: PurchaseDetail[]
}

export interface PurchaseDetail extends BaseEntity {
  purchaseOrderId: number
  materialId: number
  quantity: number
  unitPrice: number
  quotedPrice?: number
  amount: number
  material?: Material
}

// 入库单类型
export interface InboundOrder extends BaseEntity {
  inboundNo: string
  warehouseId: number
  warehouse?: Warehouse
  supplierId: number
  supplier?: Supplier
  purchaseOrderId?: number
  purchaseOrder?: PurchaseOrder
  actualInboundDate: string
  invoiceInboundDate?: string
  invoiceNo?: string
  invoiceDate?: string
  invoiceAmount: number
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CONFIRMED' | 'ARCHIVED'
  warehouseKeeperId: number
  warehouseKeeper?: User
  isArchived: boolean
  periodMonth: string
  amountAdjustmentLog?: any
  remarks?: string
  details: InboundDetail[]
}

export interface InboundDetail extends BaseEntity {
  inboundOrderId: number
  materialId: number
  material?: Material
  locationId?: number
  location?: Location
  materialCode: string
  materialName: string
  specification?: string
  quantity: number
  unitPrice: number
  amount: number
  storageArea?: string // 货区
}

// 出库单类型
export interface OutboundOrder extends BaseEntity {
  outboundNo: string
  warehouseId: number
  warehouse?: Warehouse
  actualOutboundDate: string
  invoiceOutboundDate?: string
  status: 'OUTBOUND_PROCESSING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  outboundType: 'NORMAL' | 'URGENT' | 'TRANSFER' | 'RETURN'
  warehouseKeeperId: number
  warehouseKeeper?: User
  isArchived: boolean
  equipmentCode?: string
  usageType: 'PRODUCTION' | 'MAINTENANCE' | 'OFFICE' | 'OTHER'
  usageDepartmentId: number
  usageDepartment?: Department
  recipientId: number
  recipient?: User
  periodMonth: string
  remarks?: string
  details: OutboundDetail[]
}

export interface OutboundDetail extends BaseEntity {
  outboundOrderId: number
  materialId: number
  material?: Material
  locationId?: number
  location?: Location
  materialCode: string
  materialName: string
  specification?: string
  quantity: number
  unitPrice: number
  amount: number
}

// 库存类型
export interface Inventory extends BaseEntity {
  warehouseId: number
  materialId: number
  locationId?: number
  quantity: number
  unitCost: number
  totalCost: number
  lastInboundDate?: string
  lastOutboundDate?: string
  warehouse?: Warehouse
  material?: Material
  location?: Location
}

export interface InventoryAlert extends BaseEntity {
  companyId: number
  warehouseId: number
  materialId: number
  minQuantity: number
  maxQuantity: number
  status: 'ACTIVE' | 'INACTIVE'
  warehouse?: Warehouse
  material?: Material
}

// 附件类型
export interface Attachment {
  id: number
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadTime: string
  uploadBy: number
}

// 审批记录类型
export interface ApprovalRecord extends BaseEntity {
  businessType: string
  businessId: number
  workflowInstanceId: number
  nodeCode: string
  nodeName: string
  approverId: number
  approverName: string
  approvalTime: string
  approvalResult: 'APPROVED' | 'REJECTED' | 'PENDING'
  comments?: string
}

// 公司组织类型
export interface Company {
  id: number
  companyCode: string
  companyName: string
  parentCompanyId?: number
  companyType: 'GROUP' | 'SUBSIDIARY' | 'BRANCH'
  status: 'ACTIVE' | 'INACTIVE'
  children?: Company[]
}

export interface Department {
  id: number
  departmentCode: string
  departmentName: string
  companyId: number
  parentDepartmentId?: number
  status: 'ACTIVE' | 'INACTIVE'
  children?: Department[]
}

// 集采供应商类型
export interface GroupSupplier extends BaseEntity {
  supplierCode: string
  supplierName: string
  socialCreditCode: string
  companyAddress: string
  contactPerson: string
  contactPhone: string
  contactEmail?: string
  businessLicense: string
  licenseExpiryDate?: string
  registeredCapital?: number
  businessScope?: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLACKLISTED'
  isUsed: boolean // 是否已使用，用于控制删除
  managedBy: number // 管理部门ID（集团设备部）
  manager?: User
  supplyCatalog: SupplyCatalogItem[] // 供应清单
  remarks?: string
}

// 供应清单项
export interface SupplyCatalogItem extends BaseEntity {
  groupSupplierId: number
  materialCategoryId: number
  materialCategory?: MaterialCategory
  materialId?: number
  material?: Material
  materialName: string
  specification?: string
  unit: string
  unitPrice: number
  minOrderQuantity?: number
  deliveryDays: number // 交货周期（天）
  qualityStandard?: string
  isMainSupplier: boolean // 是否主供应商
  effectiveDate: string
  expiryDate?: string
  status: 'ACTIVE' | 'INACTIVE'
}

// 供应商年度考核
export interface SupplierAnnualAssessment extends BaseEntity {
  assessmentYear: string
  groupSupplierId: number
  groupSupplier?: GroupSupplier
  overallScore: number
  assessmentResult: 'EXCELLENT' | 'GOOD' | 'QUALIFIED' | 'UNQUALIFIED'
  isQualified: boolean
  assessmentStatus: 'DRAFT' | 'AREA_SUBMITTED' | 'HEADQUARTERS_REVIEWING' | 'COMPLETED'
  headquartersReviewBy?: number
  headquartersReviewer?: User
  headquartersReviewTime?: string
  finalRemarks?: string
  areaAssessments: AreaAssessment[] // 各作业区评分
}

// 作业区评分
export interface AreaAssessment extends BaseEntity {
  annualAssessmentId: number
  areaId: number
  area?: Department
  assessorId: number
  assessor?: User
  serviceQualityScore: number // 服务质量评分
  serviceAttitudeScore: number // 服务态度评分
  serviceTimelinessScore: number // 服务时效评分
  totalScore: number // 总分
  weight: number // 权重
  weightedScore: number // 加权分数
  assessmentDate: string
  canModify: boolean // 是否允许修改
  remarks?: string
  assessmentDetails: AssessmentDetail[] // 详细评分项
}

// 评分详细项
export interface AssessmentDetail extends BaseEntity {
  areaAssessmentId: number
  criteriaId: number
  criteria?: AssessmentCriteria
  score: number
  maxScore: number
  remarks?: string
}

// 考核标准
export interface AssessmentCriteria extends BaseEntity {
  criteriaCode: string
  criteriaName: string
  category: 'QUALITY' | 'ATTITUDE' | 'TIMELINESS' | 'OTHER'
  maxScore: number
  weight: number
  description?: string
  isActive: boolean
}

// 物资申请
export interface MaterialRequest extends BaseEntity {
  requestNo: string
  requestDepartmentId: number
  requestDepartment?: Department
  requesterId: number
  requester?: User
  requestDate: string
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  expectedDeliveryDate: string
  totalAmount: number
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  approvedBy?: number
  approver?: User
  approvedTime?: string
  rejectionReason?: string
  remarks?: string
  details: MaterialRequestDetail[]
}

// 物资申请明细
export interface MaterialRequestDetail extends BaseEntity {
  requestId: number
  materialId: number
  material?: Material
  materialCode: string
  materialName: string
  specification: string
  unit: string
  quantity: number
  estimatedPrice: number
  amount: number
  purpose: string
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  expectedDeliveryDate: string
  remarks?: string
}

// 物资采购
export interface MaterialPurchase extends BaseEntity {
  purchaseNo: string
  purchaseDate: string
  purchaseType: 'NORMAL' | 'URGENT' | 'CENTRALIZED' | 'SPECIAL'
  preparerId: number
  preparer?: User
  totalAmount: number
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'ORDERED' | 'COMPLETED'
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  approvedBy?: number
  approver?: User
  approvedTime?: string
  supplierId?: number
  supplier?: Supplier
  contractNo?: string
  deliveryDate?: string
  paymentTerms?: string
  attachments?: string[]
  remarks?: string
  details: MaterialPurchaseDetail[]
  requestIds: number[] // 关联的申请单ID
}

// 物资采购明细
export interface MaterialPurchaseDetail extends BaseEntity {
  purchaseId: number
  materialId: number
  material?: Material
  materialCode: string
  materialName: string
  specification: string
  unit: string
  quantity: number
  unitPrice: number
  amount: number
  supplierId?: number
  supplier?: Supplier
  quotationPrice?: number
  remarks?: string
}

// 采购结算
export interface PurchaseSettlement extends BaseEntity {
  settlementNo: string
  purchaseId: number
  purchase?: MaterialPurchase
  settlementDate: string
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  status: 'PENDING' | 'PARTIAL' | 'COMPLETED'
  paymentMethod: 'CASH' | 'TRANSFER' | 'CHECK' | 'CREDIT'
  invoiceNo?: string
  invoiceDate?: string
  invoiceAmount?: number
  remarks?: string
  attachments?: string[]
}

// 到货管理
export interface ArrivalManagement extends BaseEntity {
  arrivalNo: string
  purchaseId: number
  purchase?: MaterialPurchase
  arrivalDate: string
  supplierId: number
  supplier?: Supplier
  receiverId: number
  receiver?: User
  status: 'ARRIVED' | 'INSPECTED' | 'ACCEPTED' | 'REJECTED'
  totalQuantity: number
  acceptedQuantity: number
  rejectedQuantity: number
  qualityStatus: 'QUALIFIED' | 'UNQUALIFIED' | 'PARTIAL'
  invoiceNo?: string
  invoiceDate?: string
  invoiceAmount?: number
  actualAmount?: number
  amountDifference?: number
  differenceReason?: string
  remarks?: string
  details: ArrivalDetail[]
}

// 到货明细
export interface ArrivalDetail extends BaseEntity {
  arrivalId: number
  materialId: number
  material?: Material
  materialCode: string
  materialName: string
  specification: string
  unit: string
  orderedQuantity: number
  arrivedQuantity: number
  acceptedQuantity: number
  rejectedQuantity: number
  unitPrice: number
  amount: number
  actualUnitPrice?: number
  actualAmount?: number
  qualityStatus: 'QUALIFIED' | 'UNQUALIFIED' | 'PARTIAL'
  inspectionResult?: string
  remarks?: string
}

// 物资追踪
export interface MaterialTracking extends BaseEntity {
  trackingNo: string
  materialId: number
  material?: Material
  batchNo?: string
  serialNo?: string
  barcode?: string
  qrCode?: string
  currentLocation: string
  currentStatus: 'IN_TRANSIT' | 'ARRIVED' | 'INSPECTED' | 'STORED' | 'ISSUED' | 'CONSUMED'
  supplierId?: number
  supplier?: Supplier
  purchaseId?: number
  purchase?: MaterialPurchase
  arrivalId?: number
  arrival?: ArrivalManagement
  warehouseId?: number
  warehouse?: Warehouse
  storageLocation?: string
  quantity: number
  unit: string
  trackingHistory: TrackingHistory[]
}

// 追踪历史
export interface TrackingHistory extends BaseEntity {
  trackingId: number
  operationType: 'PURCHASE' | 'ARRIVAL' | 'INSPECTION' | 'STORAGE' | 'ISSUE' | 'TRANSFER' | 'CONSUME'
  operationDate: string
  operatorId: number
  operator?: User
  location: string
  status: string
  quantity?: number
  remarks?: string
}

// 期间锁定类型
export interface PeriodLock {
  id: number
  companyId: number
  periodMonth: string
  lockType: 'INBOUND' | 'OUTBOUND' | 'ALL'
  isLocked: boolean
  lockedBy?: number
  lockedTime?: string
  unlockReason?: string
  unlockedBy?: number
  unlockedTime?: string
}

// 移库单类型
export interface TransferOrder extends BaseEntity {
  transferNo: string
  transferType: 'WAREHOUSE_TRANSFER' | 'AREA_TRANSFER' | 'SHIP_SCHEDULE_TRANSFER' | 'EMERGENCY_TRANSFER'
  sourceWarehouseId: number
  sourceWarehouse?: Warehouse
  targetWarehouseId: number
  targetWarehouse?: Warehouse
  transferDate: string
  planTransferDate?: string
  actualTransferDate?: string
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'IN_TRANSFER' | 'COMPLETED' | 'REJECTED' | 'CANCELLED'
  transferReason: string
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  shipScheduleNo?: string // 船期号
  berthNo?: string // 泊位号
  operatorId: number
  operator?: User
  approvedBy?: number
  approver?: User
  approvedTime?: string
  isArchived: boolean
  periodMonth: string
  transportMethod: 'FORKLIFT' | 'CRANE' | 'TRUCK' | 'CONVEYOR' | 'MANUAL'
  estimatedDuration: number // 预计耗时（小时）
  actualDuration?: number // 实际耗时（小时）
  remarks?: string
  details: TransferDetail[]
}

// 移库明细类型
export interface TransferDetail extends BaseEntity {
  transferOrderId: number
  materialId: number
  material?: Material
  materialCode: string
  materialName: string
  specification?: string
  sourceLocationId?: number
  sourceLocation?: Location
  targetLocationId?: number
  targetLocation?: Location
  sourceStorageArea: string // 源货区
  targetStorageArea: string // 目标货区
  quantity: number
  transferredQuantity?: number // 已移库数量
  unitPrice: number
  amount: number
  packageType?: string // 包装方式
  weight?: number // 重量
  volume?: number // 体积
  specialRequirements?: string // 特殊要求
}

// 库存查询
export interface InventoryItem {
  id: number
  materialCode: string
  materialName: string
  specification: string
  category: string
  unit: string
  warehouseLocation: string
  currentStock: number
  safetyStock: number
  maxStock: number
  unitPrice: number
  totalValue: number
  lastInDate?: string
  lastOutDate?: string
  status: string
  supplier?: string
  remarks?: string
}

// 库存预警
export interface InventoryAlert {
  id: number
  materialCode: string
  materialName: string
  specification: string
  category: string
  unit: string
  warehouseLocation: string
  currentStock: number
  safetyStock: number
  maxStock: number
  alertType: string
  urgency: string
  status: string
  alertDate: string
  expectedOutDate?: string
  suggestedPurchase: number
  unitPrice: number
  totalValue: number
  supplier?: string
  lastPurchaseDate?: string
  averageConsumption: number
  remarks?: string
}

// 库存分析
export interface InventoryAnalysis {
  summary: {
    totalValue: number
    totalItems: number
    turnoverRate: number
    averageAge: number
    deadStockValue: number
    deadStockItems: number
    lowStockItems: number
    overstockItems: number
  }
  abcAnalysis: {
    aItems: {
      count: number
      percentage: number
      value: number
      valuePercentage: number
    }
    bItems: {
      count: number
      percentage: number
      value: number
      valuePercentage: number
    }
    cItems: {
      count: number
      percentage: number
      value: number
      valuePercentage: number
    }
  }
  turnoverAnalysis: Array<{
    month: string
    turnoverRate: number
    value: number
  }>
  categoryAnalysis: Array<{
    category: string
    value: number
    percentage: number
    items: number
    turnover: number
  }>
  ageAnalysis: Array<{
    ageRange: string
    items: number
    percentage: number
    value: number
  }>
  topItems: Array<{
    materialCode: string
    materialName: string
    category: string
    value: number
    turnover: number
    age: number
    status: string
  }>
  deadStockItems: Array<{
    materialCode: string
    materialName: string
    category: string
    value: number
    age: number
    lastMovement: string
    reason: string
  }>
}
