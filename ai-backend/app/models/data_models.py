"""
港口物资管理系统数据模型
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class MaterialCategory(str, Enum):
    """物资分类"""
    MACHINERY = "machinery"  # 机械设备
    ELECTRONICS = "electronics"  # 电子设备
    CONSUMABLES = "consumables"  # 消耗品
    TOOLS = "tools"  # 工具
    SAFETY = "safety"  # 安全用品
    OFFICE = "office"  # 办公用品
    MAINTENANCE = "maintenance"  # 维修用品


class MaterialStatus(str, Enum):
    """物资状态"""
    AVAILABLE = "available"  # 可用
    RESERVED = "reserved"  # 预留
    IN_USE = "in_use"  # 使用中
    MAINTENANCE = "maintenance"  # 维修中
    DAMAGED = "damaged"  # 损坏
    EXPIRED = "expired"  # 过期


class TransactionType(str, Enum):
    """交易类型"""
    INBOUND = "inbound"  # 入库
    OUTBOUND = "outbound"  # 出库
    TRANSFER = "transfer"  # 移库
    ADJUSTMENT = "adjustment"  # 调整


class Material(BaseModel):
    """物资模型"""
    id: str = Field(..., description="物资ID")
    name: str = Field(..., description="物资名称")
    category: MaterialCategory = Field(..., description="物资分类")
    description: Optional[str] = Field(default=None, description="物资描述")
    unit: str = Field(..., description="计量单位")
    specifications: Optional[Dict[str, Any]] = Field(default=None, description="规格参数")
    supplier_id: Optional[str] = Field(default=None, description="供应商ID")
    created_at: datetime = Field(default_factory=datetime.now, description="创建时间")
    updated_at: datetime = Field(default_factory=datetime.now, description="更新时间")


class Warehouse(BaseModel):
    """仓库模型"""
    id: str = Field(..., description="仓库ID")
    name: str = Field(..., description="仓库名称")
    location: str = Field(..., description="仓库位置")
    capacity: int = Field(..., description="仓库容量")
    current_usage: int = Field(default=0, description="当前使用量")
    manager: Optional[str] = Field(default=None, description="仓库管理员")
    description: Optional[str] = Field(default=None, description="仓库描述")


class Inventory(BaseModel):
    """库存模型"""
    id: str = Field(..., description="库存ID")
    material_id: str = Field(..., description="物资ID")
    warehouse_id: str = Field(..., description="仓库ID")
    quantity: int = Field(..., description="库存数量")
    reserved_quantity: int = Field(default=0, description="预留数量")
    available_quantity: int = Field(..., description="可用数量")
    status: MaterialStatus = Field(..., description="物资状态")
    location_detail: Optional[str] = Field(default=None, description="具体位置")
    last_updated: datetime = Field(default_factory=datetime.now, description="最后更新时间")


class Transaction(BaseModel):
    """交易记录模型"""
    id: str = Field(..., description="交易ID")
    type: TransactionType = Field(..., description="交易类型")
    material_id: str = Field(..., description="物资ID")
    warehouse_id: str = Field(..., description="仓库ID")
    quantity: int = Field(..., description="数量")
    operator: str = Field(..., description="操作员")
    timestamp: datetime = Field(default_factory=datetime.now, description="交易时间")
    reference_no: Optional[str] = Field(default=None, description="参考单号")
    notes: Optional[str] = Field(default=None, description="备注")


class Supplier(BaseModel):
    """供应商模型"""
    id: str = Field(..., description="供应商ID")
    name: str = Field(..., description="供应商名称")
    contact_person: str = Field(..., description="联系人")
    phone: str = Field(..., description="联系电话")
    email: Optional[str] = Field(default=None, description="邮箱")
    address: str = Field(..., description="地址")
    rating: float = Field(default=0.0, description="评级")
    status: str = Field(default="active", description="状态")


class Port(BaseModel):
    """码头模型"""
    id: str = Field(..., description="码头ID")
    name: str = Field(..., description="码头名称")
    location: str = Field(..., description="码头位置")
    capacity: int = Field(..., description="码头容量")
    current_load: int = Field(default=0, description="当前负载")
    status: str = Field(default="operational", description="运营状态")
    manager: Optional[str] = Field(default=None, description="码头管理员")


class InventoryAlert(BaseModel):
    """库存预警模型"""
    id: str = Field(..., description="预警ID")
    material_id: str = Field(..., description="物资ID")
    warehouse_id: str = Field(..., description="仓库ID")
    alert_type: str = Field(..., description="预警类型")
    threshold: int = Field(..., description="预警阈值")
    current_quantity: int = Field(..., description="当前数量")
    severity: str = Field(..., description="严重程度")
    created_at: datetime = Field(default_factory=datetime.now, description="创建时间")
    resolved: bool = Field(default=False, description="是否已解决")


class MaterialRequest(BaseModel):
    """物资申请模型"""
    id: str = Field(..., description="申请ID")
    material_id: str = Field(..., description="物资ID")
    quantity: int = Field(..., description="申请数量")
    requester: str = Field(..., description="申请人")
    department: str = Field(..., description="申请部门")
    purpose: str = Field(..., description="用途")
    priority: str = Field(default="normal", description="优先级")
    status: str = Field(default="pending", description="申请状态")
    created_at: datetime = Field(default_factory=datetime.now, description="申请时间")
    approved_at: Optional[datetime] = Field(default=None, description="批准时间")
    approver: Optional[str] = Field(default=None, description="批准人")


class PurchaseOrder(BaseModel):
    """采购订单模型"""
    id: str = Field(..., description="订单ID")
    supplier_id: str = Field(..., description="供应商ID")
    material_id: str = Field(..., description="物资ID")
    quantity: int = Field(..., description="采购数量")
    unit_price: float = Field(..., description="单价")
    total_amount: float = Field(..., description="总金额")
    status: str = Field(default="pending", description="订单状态")
    order_date: datetime = Field(default_factory=datetime.now, description="订单日期")
    expected_delivery: Optional[datetime] = Field(default=None, description="预期交付日期")
    actual_delivery: Optional[datetime] = Field(default=None, description="实际交付日期")
