"""
模拟数据服务 - 用于演示和测试
"""
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.models.data_models import (
    Material, Warehouse, Inventory, Transaction, Supplier,
    Port, MaterialCategory, MaterialStatus, TransactionType
)


class MockDataService:
    """模拟数据服务"""

    def __init__(self):
        self.materials = []
        self.warehouses = []
        self.inventories = []
        self.transactions = []
        self.suppliers = []
        self.ports = []
        self._generate_mock_data()

    def _generate_mock_data(self):
        """生成模拟数据"""
        self._generate_suppliers()
        self._generate_ports()
        self._generate_warehouses()
        self._generate_materials()
        self._generate_inventories()
        self._generate_transactions()

    def _generate_suppliers(self):
        """生成供应商数据"""
        supplier_names = [
            "上海港口设备有限公司", "青岛海洋机械厂", "大连重工集团",
            "天津港务机械公司", "宁波港口装备厂", "深圳海事设备公司"
        ]

        for i, name in enumerate(supplier_names):
            supplier = Supplier(
                id=f"SUP{i+1:03d}",
                name=name,
                contact_person=f"联系人{i+1}",
                phone=f"138{random.randint(10000000, 99999999)}",
                email=f"contact{i+1}@company.com",
                address=f"工业园区{random.randint(1, 100)}号",
                rating=round(random.uniform(3.5, 5.0), 1),
                status="active"
            )
            self.suppliers.append(supplier)

    def _generate_ports(self):
        """生成码头数据"""
        port_names = ["A码头", "B码头", "C码头", "D码头", "E码头"]

        for i, name in enumerate(port_names):
            port = Port(
                id=f"PORT{i+1:03d}",
                name=name,
                location=f"港区{chr(65+i)}区",
                capacity=random.randint(5000, 20000),
                current_load=random.randint(1000, 15000),
                status="operational",
                manager=f"管理员{i+1}"
            )
            self.ports.append(port)

    def _generate_warehouses(self):
        """生成仓库数据"""
        warehouse_names = [
            "1号仓库", "2号仓库", "3号仓库", "4号仓库", "5号仓库",
            "设备仓库", "工具仓库", "备件仓库", "消耗品仓库", "危险品仓库"
        ]

        for i, name in enumerate(warehouse_names):
            warehouse = Warehouse(
                id=f"WH{i+1:03d}",
                name=name,
                location=f"仓储区{chr(65+i%5)}区{i//5+1}号",
                capacity=random.randint(1000, 5000),
                current_usage=random.randint(200, 3000),
                manager=f"仓管员{i+1}",
                description=f"{name}，主要存储相关物资"
            )
            self.warehouses.append(warehouse)

    def _generate_materials(self):
        """生成物资数据"""
        material_data = [
            ("起重机", MaterialCategory.MACHINERY, "台", "港口起重设备"),
            ("叉车", MaterialCategory.MACHINERY, "台", "货物搬运设备"),
            ("拖车", MaterialCategory.MACHINERY, "台", "货物运输设备"),
            ("装载机", MaterialCategory.MACHINERY, "台", "货物装卸设备"),
            ("监控摄像头", MaterialCategory.ELECTRONICS, "个", "安防监控设备"),
            ("对讲机", MaterialCategory.ELECTRONICS, "台", "通讯设备"),
            ("计算机", MaterialCategory.ELECTRONICS, "台", "办公设备"),
            ("扳手", MaterialCategory.TOOLS, "把", "维修工具"),
            ("螺丝刀", MaterialCategory.TOOLS, "把", "维修工具"),
            ("电钻", MaterialCategory.TOOLS, "台", "电动工具"),
            ("安全帽", MaterialCategory.SAFETY, "顶", "头部防护用品"),
            ("安全带", MaterialCategory.SAFETY, "条", "高空作业防护"),
            ("防护服", MaterialCategory.SAFETY, "套", "身体防护用品"),
            ("机油", MaterialCategory.CONSUMABLES, "桶", "设备润滑油"),
            ("柴油", MaterialCategory.CONSUMABLES, "升", "设备燃料"),
            ("A4纸", MaterialCategory.OFFICE, "包", "办公用纸"),
            ("签字笔", MaterialCategory.OFFICE, "支", "书写工具"),
        ]

        for i, (name, category, unit, desc) in enumerate(material_data):
            material = Material(
                id=f"MAT{i+1:03d}",
                name=name,
                category=category,
                description=desc,
                unit=unit,
                specifications={
                    "brand": f"品牌{random.randint(1, 5)}",
                    "model": f"型号{random.randint(100, 999)}"
                },
                supplier_id=random.choice(self.suppliers).id if self.suppliers else None
            )
            self.materials.append(material)

    def _generate_inventories(self):
        """生成库存数据"""
        for material in self.materials:
            num_warehouses = random.randint(1, min(3, len(self.warehouses)))
            selected_warehouses = random.sample(self.warehouses, num_warehouses)

            for warehouse in selected_warehouses:
                quantity = random.randint(10, 500)
                reserved = random.randint(0, quantity // 4)

                inventory = Inventory(
                    id=f"INV{len(self.inventories)+1:04d}",
                    material_id=material.id,
                    warehouse_id=warehouse.id,
                    quantity=quantity,
                    reserved_quantity=reserved,
                    available_quantity=quantity - reserved,
                    status=random.choice(list(MaterialStatus)),
                    location_detail=f"{warehouse.name}-{chr(65+random.randint(0, 4))}{random.randint(1, 20):02d}",
                    last_updated=datetime.now() - timedelta(days=random.randint(0, 30))
                )
                self.inventories.append(inventory)

    def _generate_transactions(self):
        """生成交易记录"""
        operators = ["张三", "李四", "王五", "赵六", "钱七", "孙八"]

        for _ in range(100):
            transaction = Transaction(
                id=f"TXN{len(self.transactions)+1:04d}",
                type=random.choice(list(TransactionType)),
                material_id=random.choice(self.materials).id,
                warehouse_id=random.choice(self.warehouses).id,
                quantity=random.randint(1, 50),
                operator=random.choice(operators),
                timestamp=datetime.now() - timedelta(days=random.randint(0, 90)),
                reference_no=f"REF{random.randint(100000, 999999)}",
                notes=f"交易备注{random.randint(1, 100)}"
            )
            self.transactions.append(transaction)

    def get_inventory_by_warehouse(self, warehouse_name: str) -> List[Dict[str, Any]]:
        """根据仓库名称获取库存"""
        warehouse = next((w for w in self.warehouses if warehouse_name in w.name), None)
        if not warehouse:
            return []

        result = []
        for inventory in self.inventories:
            if inventory.warehouse_id == warehouse.id:
                material = next((m for m in self.materials if m.id == inventory.material_id), None)
                if material:
                    result.append({
                        "material_name": material.name,
                        "category": material.category.value,
                        "quantity": inventory.quantity,
                        "available_quantity": inventory.available_quantity,
                        "unit": material.unit,
                        "location": inventory.location_detail,
                        "status": inventory.status.value
                    })
        return result

    def search_materials(self, query: str) -> List[Dict[str, Any]]:
        """搜索物资"""
        query = query.lower()
        results = []
        for material in self.materials:
            if (query in material.name.lower() or
                query in material.description.lower() or
                query in material.category.value.lower()):

                # 获取该物资的库存信息
                total_quantity = sum(
                    inv.quantity for inv in self.inventories
                    if inv.material_id == material.id
                )

                results.append({
                    "id": material.id,
                    "name": material.name,
                    "category": material.category.value,
                    "description": material.description,
                    "unit": material.unit,
                    "total_quantity": total_quantity
                })
        return results

    def get_inventory_summary(self) -> Dict[str, Any]:
        """获取库存汇总"""
        total_items = len(self.inventories)
        total_quantity = sum(inv.quantity for inv in self.inventories)
        low_stock_items = len([inv for inv in self.inventories if inv.available_quantity < 20])

        return {
            "total_items": total_items,
            "total_quantity": total_quantity,
            "low_stock_items": low_stock_items,
            "warehouses_count": len(self.warehouses),
            "materials_count": len(self.materials)
        }


# 全局模拟数据服务实例
mock_data_service = MockDataService()
import random
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.models.data_models import (
    Material, Warehouse, Inventory, Transaction, Supplier, 
    Port, MaterialCategory, MaterialStatus, TransactionType
)


class MockDataService:
    """模拟数据服务"""
    
    def __init__(self):
        self.materials = []
        self.warehouses = []
        self.inventories = []
        self.transactions = []
        self.suppliers = []
        self.ports = []
        self._generate_mock_data()
    
    def _generate_mock_data(self):
        """生成模拟数据"""
        # 生成供应商
        self._generate_suppliers()
        
        # 生成码头
        self._generate_ports()
        
        # 生成仓库
        self._generate_warehouses()
        
        # 生成物资
        self._generate_materials()
        
        # 生成库存
        self._generate_inventories()
        
        # 生成交易记录
        self._generate_transactions()
    
    def _generate_suppliers(self):
        """生成供应商数据"""
        supplier_names = [
            "上海港口设备有限公司", "青岛海洋机械厂", "大连重工集团",
            "天津港务机械公司", "宁波港口装备厂", "深圳海事设备公司",
            "广州港机制造厂", "厦门海工装备公司", "烟台港口机械厂"
        ]
        
        for i, name in enumerate(supplier_names):
            supplier = Supplier(
                id=f"SUP{i+1:03d}",
                name=name,
                contact_person=f"联系人{i+1}",
                phone=f"138{random.randint(10000000, 99999999)}",
                email=f"contact{i+1}@{name.split('有限公司')[0].lower()}.com",
                address=f"{name.split('港口')[0]}市工业园区{random.randint(1, 100)}号",
                rating=round(random.uniform(3.5, 5.0), 1),
                status="active"
            )
            self.suppliers.append(supplier)
    
    def _generate_ports(self):
        """生成码头数据"""
        port_names = ["A码头", "B码头", "C码头", "D码头", "E码头"]
        
        for i, name in enumerate(port_names):
            port = Port(
                id=f"PORT{i+1:03d}",
                name=name,
                location=f"港区{chr(65+i)}区",
                capacity=random.randint(5000, 20000),
                current_load=random.randint(1000, 15000),
                status="operational",
                manager=f"管理员{i+1}"
            )
            self.ports.append(port)
    
    def _generate_warehouses(self):
        """生成仓库数据"""
        warehouse_names = [
            "1号仓库", "2号仓库", "3号仓库", "4号仓库", "5号仓库",
            "设备仓库", "工具仓库", "备件仓库", "消耗品仓库", "危险品仓库"
        ]
        
        for i, name in enumerate(warehouse_names):
            warehouse = Warehouse(
                id=f"WH{i+1:03d}",
                name=name,
                location=f"仓储区{chr(65+i%5)}区{i//5+1}号",
                capacity=random.randint(1000, 5000),
                current_usage=random.randint(200, 3000),
                manager=f"仓管员{i+1}",
                description=f"{name}，主要存储相关物资"
            )
            self.warehouses.append(warehouse)
    
    def _generate_materials(self):
        """生成物资数据"""
        material_data = [
            # 机械设备
            ("起重机", MaterialCategory.MACHINERY, "台", "港口起重设备"),
            ("叉车", MaterialCategory.MACHINERY, "台", "货物搬运设备"),
            ("拖车", MaterialCategory.MACHINERY, "台", "货物运输设备"),
            ("装载机", MaterialCategory.MACHINERY, "台", "货物装卸设备"),
            ("吊车", MaterialCategory.MACHINERY, "台", "重型起重设备"),
            
            # 电子设备
            ("监控摄像头", MaterialCategory.ELECTRONICS, "个", "安防监控设备"),
            ("对讲机", MaterialCategory.ELECTRONICS, "台", "通讯设备"),
            ("计算机", MaterialCategory.ELECTRONICS, "台", "办公设备"),
            ("打印机", MaterialCategory.ELECTRONICS, "台", "办公设备"),
            ("扫描枪", MaterialCategory.ELECTRONICS, "个", "条码扫描设备"),
            
            # 工具
            ("扳手", MaterialCategory.TOOLS, "把", "维修工具"),
            ("螺丝刀", MaterialCategory.TOOLS, "把", "维修工具"),
            ("电钻", MaterialCategory.TOOLS, "台", "电动工具"),
            ("切割机", MaterialCategory.TOOLS, "台", "切割工具"),
            ("焊接设备", MaterialCategory.TOOLS, "套", "焊接工具"),
            
            # 安全用品
            ("安全帽", MaterialCategory.SAFETY, "顶", "头部防护用品"),
            ("安全带", MaterialCategory.SAFETY, "条", "高空作业防护"),
            ("防护服", MaterialCategory.SAFETY, "套", "身体防护用品"),
            ("防护眼镜", MaterialCategory.SAFETY, "副", "眼部防护用品"),
            ("防护手套", MaterialCategory.SAFETY, "双", "手部防护用品"),
            
            # 消耗品
            ("机油", MaterialCategory.CONSUMABLES, "桶", "设备润滑油"),
            ("柴油", MaterialCategory.CONSUMABLES, "升", "设备燃料"),
            ("液压油", MaterialCategory.CONSUMABLES, "桶", "液压系统用油"),
            ("清洁剂", MaterialCategory.CONSUMABLES, "瓶", "设备清洁用品"),
            ("润滑脂", MaterialCategory.CONSUMABLES, "桶", "设备润滑脂"),
            
            # 办公用品
            ("A4纸", MaterialCategory.OFFICE, "包", "办公用纸"),
            ("签字笔", MaterialCategory.OFFICE, "支", "书写工具"),
            ("文件夹", MaterialCategory.OFFICE, "个", "文件整理用品"),
            ("订书机", MaterialCategory.OFFICE, "台", "办公工具"),
            ("胶带", MaterialCategory.OFFICE, "卷", "粘贴用品"),
        ]
        
        for i, (name, category, unit, desc) in enumerate(material_data):
            material = Material(
                id=f"MAT{i+1:03d}",
                name=name,
                category=category,
                description=desc,
                unit=unit,
                specifications={
                    "brand": f"品牌{random.randint(1, 5)}",
                    "model": f"型号{random.randint(100, 999)}",
                    "weight": f"{random.randint(1, 100)}kg"
                },
                supplier_id=random.choice(self.suppliers).id if self.suppliers else None
            )
            self.materials.append(material)
    
    def _generate_inventories(self):
        """生成库存数据"""
        for material in self.materials:
            # 每个物资在1-3个仓库中有库存
            num_warehouses = random.randint(1, min(3, len(self.warehouses)))
            selected_warehouses = random.sample(self.warehouses, num_warehouses)
            
            for warehouse in selected_warehouses:
                quantity = random.randint(10, 500)
                reserved = random.randint(0, quantity // 4)
                
                inventory = Inventory(
                    id=f"INV{len(self.inventories)+1:04d}",
                    material_id=material.id,
                    warehouse_id=warehouse.id,
                    quantity=quantity,
                    reserved_quantity=reserved,
                    available_quantity=quantity - reserved,
                    status=random.choice(list(MaterialStatus)),
                    location_detail=f"{warehouse.name}-{chr(65+random.randint(0, 4))}{random.randint(1, 20):02d}",
                    last_updated=datetime.now() - timedelta(days=random.randint(0, 30))
                )
                self.inventories.append(inventory)
    
    def _generate_transactions(self):
        """生成交易记录"""
        operators = ["张三", "李四", "王五", "赵六", "钱七", "孙八"]
        
        for _ in range(200):  # 生成200条交易记录
            transaction = Transaction(
                id=f"TXN{len(self.transactions)+1:04d}",
                type=random.choice(list(TransactionType)),
                material_id=random.choice(self.materials).id,
                warehouse_id=random.choice(self.warehouses).id,
                quantity=random.randint(1, 50),
                operator=random.choice(operators),
                timestamp=datetime.now() - timedelta(days=random.randint(0, 90)),
                reference_no=f"REF{random.randint(100000, 999999)}",
                notes=f"交易备注{random.randint(1, 100)}"
            )
            self.transactions.append(transaction)
    
    def get_materials(self) -> List[Material]:
        """获取所有物资"""
        return self.materials
    
    def get_warehouses(self) -> List[Warehouse]:
        """获取所有仓库"""
        return self.warehouses
    
    def get_inventories(self) -> List[Inventory]:
        """获取所有库存"""
        return self.inventories
    
    def get_transactions(self) -> List[Transaction]:
        """获取所有交易记录"""
        return self.transactions
    
    def get_suppliers(self) -> List[Supplier]:
        """获取所有供应商"""
        return self.suppliers
    
    def get_ports(self) -> List[Port]:
        """获取所有码头"""
        return self.ports
    
    def search_materials(self, query: str) -> List[Material]:
        """搜索物资"""
        query = query.lower()
        return [
            material for material in self.materials
            if query in material.name.lower() or 
               query in material.description.lower() or
               query in material.category.value.lower()
        ]
    
    def get_inventory_by_warehouse(self, warehouse_name: str) -> List[Dict[str, Any]]:
        """根据仓库名称获取库存"""
        warehouse = next((w for w in self.warehouses if warehouse_name in w.name), None)
        if not warehouse:
            return []
        
        result = []
        for inventory in self.inventories:
            if inventory.warehouse_id == warehouse.id:
                material = next((m for m in self.materials if m.id == inventory.material_id), None)
                if material:
                    result.append({
                        "material_name": material.name,
                        "category": material.category.value,
                        "quantity": inventory.quantity,
                        "available_quantity": inventory.available_quantity,
                        "unit": material.unit,
                        "location": inventory.location_detail,
                        "status": inventory.status.value
                    })
        return result
    
    def get_inventory_summary(self) -> Dict[str, Any]:
        """获取库存汇总"""
        total_items = len(self.inventories)
        total_quantity = sum(inv.quantity for inv in self.inventories)
        low_stock_items = len([inv for inv in self.inventories if inv.available_quantity < 20])
        
        return {
            "total_items": total_items,
            "total_quantity": total_quantity,
            "low_stock_items": low_stock_items,
            "warehouses_count": len(self.warehouses),
            "materials_count": len(self.materials)
        }


# 全局模拟数据服务实例
mock_data_service = MockDataService()
