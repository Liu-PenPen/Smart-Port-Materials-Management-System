"""
AI服务模块 - 处理自然语言查询和生成回答
"""
import re
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
from app.models.chat_models import QueryIntent, QueryType, AIResponse, QueryResult
from app.services.mock_data_service import mock_data_service


class AIService:
    """AI服务类"""
    
    def __init__(self):
        self.query_patterns = self._init_query_patterns()
        self.quick_actions = self._init_quick_actions()
    
    def _init_query_patterns(self) -> List[Dict[str, Any]]:
        """初始化查询模式"""
        return [
            {
                "pattern": r"(.+)码头有多少(.+)",
                "type": QueryType.COUNT,
                "extractor": self._extract_port_inventory
            },
            {
                "pattern": r"(.+)仓库有多少(.+)",
                "type": QueryType.COUNT,
                "extractor": self._extract_warehouse_inventory
            },
            {
                "pattern": r"(.+)的库存是多少",
                "type": QueryType.COUNT,
                "extractor": self._extract_material_inventory
            },
            {
                "pattern": r"库存总览|库存汇总|库存统计",
                "type": QueryType.LIST,
                "extractor": self._extract_inventory_summary
            },
            {
                "pattern": r"搜索(.+)|查找(.+)|(.+)在哪里",
                "type": QueryType.LIST,
                "extractor": self._extract_material_search
            },
            {
                "pattern": r"最近(.+)天的交易记录",
                "type": QueryType.LIST,
                "extractor": self._extract_recent_transactions
            }
        ]
    
    def _init_quick_actions(self) -> List[Dict[str, str]]:
        """初始化快捷操作"""
        return [
            {
                "id": "inventory_summary",
                "title": "库存总览",
                "query": "库存总览",
                "description": "查看整体库存统计信息"
            },
            {
                "id": "port_a_inventory",
                "title": "A码头库存",
                "query": "A码头有多少物品",
                "description": "查看A码头的物资库存"
            },
            {
                "id": "low_stock",
                "title": "库存不足",
                "query": "库存不足的物资",
                "description": "查看库存不足的物资列表"
            },
            {
                "id": "recent_transactions",
                "title": "最近交易",
                "query": "最近7天的交易记录",
                "description": "查看最近的交易记录"
            }
        ]
    
    async def process_query(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> AIResponse:
        """处理用户查询"""
        start_time = datetime.now()
        
        try:
            # 1. 解析查询意图
            intent = self._parse_intent(user_input)
            
            # 2. 执行查询
            query_result = await self._execute_query(intent, user_input)
            
            # 3. 生成回答
            response_message = self._generate_response(intent, query_result, user_input)
            
            # 4. 生成建议
            suggestions = self._generate_suggestions(intent, query_result)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return AIResponse(
                message=response_message,
                query_result=query_result,
                suggestions=suggestions,
                confidence=intent.confidence,
                processing_time=processing_time
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            return AIResponse(
                message=f"抱歉，处理您的查询时出现了错误：{str(e)}",
                query_result=None,
                suggestions=["请尝试重新表述您的问题", "查看库存总览", "联系系统管理员"],
                confidence=0.0,
                processing_time=processing_time
            )
    
    def _parse_intent(self, user_input: str) -> QueryIntent:
        """解析用户意图"""
        user_input = user_input.strip()
        
        for pattern_info in self.query_patterns:
            pattern = pattern_info["pattern"]
            match = re.search(pattern, user_input, re.IGNORECASE)
            
            if match:
                return QueryIntent(
                    type=pattern_info["type"],
                    entities=list(match.groups()) if match.groups() else [],
                    parameters={"extractor": pattern_info["extractor"]},
                    confidence=0.9
                )
        
        # 如果没有匹配到特定模式，返回通用查询
        return QueryIntent(
            type=QueryType.GENERAL,
            entities=[],
            parameters={"query": user_input},
            confidence=0.5
        )
    
    async def _execute_query(self, intent: QueryIntent, user_input: str) -> QueryResult:
        """执行查询"""
        start_time = datetime.now()
        
        try:
            if "extractor" in intent.parameters:
                extractor = intent.parameters["extractor"]
                data = extractor(intent.entities, user_input)
            else:
                # 通用查询处理
                data = self._handle_general_query(user_input)
            
            query_time = (datetime.now() - start_time).total_seconds()
            
            return QueryResult(
                success=True,
                data=data,
                count=len(data) if isinstance(data, list) else 1,
                query_time=query_time
            )
            
        except Exception as e:
            query_time = (datetime.now() - start_time).total_seconds()
            return QueryResult(
                success=False,
                data=None,
                query_time=query_time,
                error=str(e)
            )
    
    def _extract_port_inventory(self, entities: List[str], user_input: str) -> List[Dict[str, Any]]:
        """提取码头库存信息"""
        if not entities:
            return []
        
        port_name = entities[0].strip()
        # 由于模拟数据中码头和仓库是分开的，这里简化处理
        # 实际应用中需要根据码头找到对应的仓库
        if "A" in port_name.upper():
            return mock_data_service.get_inventory_by_warehouse("1号仓库")
        elif "B" in port_name.upper():
            return mock_data_service.get_inventory_by_warehouse("2号仓库")
        else:
            return mock_data_service.get_inventory_by_warehouse("1号仓库")
    
    def _extract_warehouse_inventory(self, entities: List[str], user_input: str) -> List[Dict[str, Any]]:
        """提取仓库库存信息"""
        if not entities:
            return []
        
        warehouse_name = entities[0].strip()
        return mock_data_service.get_inventory_by_warehouse(warehouse_name)
    
    def _extract_material_inventory(self, entities: List[str], user_input: str) -> List[Dict[str, Any]]:
        """提取物资库存信息"""
        if not entities:
            return []
        
        material_name = entities[0].strip()
        return mock_data_service.search_materials(material_name)
    
    def _extract_inventory_summary(self, entities: List[str], user_input: str) -> Dict[str, Any]:
        """提取库存汇总信息"""
        return mock_data_service.get_inventory_summary()
    
    def _extract_material_search(self, entities: List[str], user_input: str) -> List[Dict[str, Any]]:
        """提取物资搜索信息"""
        # 从所有实体中找到非空的作为搜索关键词
        search_term = ""
        for entity in entities:
            if entity and entity.strip():
                search_term = entity.strip()
                break
        
        if not search_term:
            # 如果没有提取到实体，尝试从用户输入中提取关键词
            keywords = ["搜索", "查找", "在哪里"]
            for keyword in keywords:
                if keyword in user_input:
                    search_term = user_input.replace(keyword, "").strip()
                    break
        
        if search_term:
            return mock_data_service.search_materials(search_term)
        return []
    
    def _extract_recent_transactions(self, entities: List[str], user_input: str) -> List[Dict[str, Any]]:
        """提取最近交易记录"""
        # 简化处理，返回最近的交易记录
        transactions = mock_data_service.get_transactions()
        # 按时间排序，取最近的10条
        sorted_transactions = sorted(transactions, key=lambda x: x.timestamp, reverse=True)[:10]
        
        result = []
        for txn in sorted_transactions:
            material = next((m for m in mock_data_service.materials if m.id == txn.material_id), None)
            warehouse = next((w for w in mock_data_service.warehouses if w.id == txn.warehouse_id), None)
            
            result.append({
                "transaction_id": txn.id,
                "type": txn.type.value,
                "material_name": material.name if material else "未知物资",
                "warehouse_name": warehouse.name if warehouse else "未知仓库",
                "quantity": txn.quantity,
                "operator": txn.operator,
                "timestamp": txn.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            })
        
        return result
    
    def _handle_general_query(self, user_input: str) -> Dict[str, Any]:
        """处理通用查询"""
        return {
            "message": "我理解您的问题，但需要更具体的信息才能提供准确的答案。",
            "suggestions": [
                "请尝试询问具体的码头或仓库库存",
                "查看库存总览",
                "搜索特定物资"
            ]
        }
    
    def _generate_response(self, intent: QueryIntent, query_result: QueryResult, user_input: str) -> str:
        """生成回答"""
        if not query_result.success:
            return f"抱歉，查询失败：{query_result.error}"
        
        data = query_result.data
        
        if intent.type == QueryType.COUNT:
            if isinstance(data, list) and data:
                total_items = len(data)
                total_quantity = sum(item.get("quantity", 0) for item in data)
                return f"根据查询结果，共有 {total_items} 种物资，总数量为 {total_quantity} 件。"
            else:
                return "没有找到相关的库存信息。"
        
        elif intent.type == QueryType.LIST:
            if "total_items" in data:  # 库存汇总
                return f"库存总览：共有 {data['total_items']} 个库存项目，总数量 {data['total_quantity']} 件，其中 {data['low_stock_items']} 项库存不足。"
            elif isinstance(data, list):
                if data:
                    return f"找到 {len(data)} 条相关记录。"
                else:
                    return "没有找到相关记录。"
        
        elif intent.type == QueryType.GENERAL:
            if isinstance(data, dict) and "message" in data:
                return data["message"]
        
        return "查询完成，请查看详细数据。"
    
    def _generate_suggestions(self, intent: QueryIntent, query_result: QueryResult) -> List[str]:
        """生成建议问题"""
        base_suggestions = [
            "查看库存总览",
            "A码头有多少物品？",
            "搜索起重机",
            "最近7天的交易记录"
        ]
        
        if intent.type == QueryType.COUNT and query_result.success:
            base_suggestions.extend([
                "查看其他码头的库存",
                "查看库存不足的物资"
            ])
        
        return base_suggestions[:4]  # 限制建议数量
    
    def get_quick_actions(self) -> List[Dict[str, str]]:
        """获取快捷操作"""
        return self.quick_actions


# 全局AI服务实例
ai_service = AIService()
