"""
简化的AI后端服务器 - 避免复杂依赖
"""
import json
import re
from datetime import datetime
from typing import Dict, List, Any, Optional

try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    import uvicorn
except ImportError as e:
    print(f"缺少依赖: {e}")
    print("请运行: pip install fastapi uvicorn pydantic")
    exit(1)

# 创建FastAPI应用
app = FastAPI(
    title="港口物资管理AI助手",
    description="智能港口物资管理系统的AI问答服务",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    message_id: str
    response: str
    data: Optional[Any] = None
    suggestions: List[str] = []
    session_id: str
    timestamp: str

class QuickAction(BaseModel):
    id: str
    title: str
    query: str
    description: str
    category: str = "inventory"
    icon: str = "QuestionCircleOutlined"

# 模拟数据
MOCK_DATA = {
    "materials": [
        {"name": "起重机", "category": "machinery", "quantity": 15, "location": "A码头"},
        {"name": "叉车", "category": "machinery", "quantity": 28, "location": "A码头"},
        {"name": "安全帽", "category": "safety", "quantity": 150, "location": "1号仓库"},
        {"name": "扳手", "category": "tools", "quantity": 45, "location": "工具仓库"},
        {"name": "监控摄像头", "category": "electronics", "quantity": 32, "location": "B码头"},
        {"name": "拖车", "category": "machinery", "quantity": 12, "location": "C码头"},
        {"name": "防护服", "category": "safety", "quantity": 80, "location": "2号仓库"},
        {"name": "电钻", "category": "tools", "quantity": 25, "location": "工具仓库"},
    ],
    "warehouses": [
        {"name": "1号仓库", "capacity": 1000, "current": 750},
        {"name": "2号仓库", "capacity": 1200, "current": 890},
        {"name": "工具仓库", "capacity": 500, "current": 320},
        {"name": "设备仓库", "capacity": 800, "current": 650},
    ],
    "ports": [
        {"name": "A码头", "capacity": 5000, "current": 3200},
        {"name": "B码头", "capacity": 4500, "current": 2800},
        {"name": "C码头", "capacity": 6000, "current": 4100},
    ],
    "transactions": [
        {"id": "TXN001", "type": "入库", "material": "起重机", "quantity": 2, "location": "A码头", "operator": "张三", "date": "2024-01-15", "time": "09:30"},
        {"id": "TXN002", "type": "出库", "material": "叉车", "quantity": 3, "location": "A码头", "operator": "李四", "date": "2024-01-15", "time": "14:20"},
        {"id": "TXN003", "type": "入库", "material": "安全帽", "quantity": 50, "location": "1号仓库", "operator": "王五", "date": "2024-01-14", "time": "10:15"},
        {"id": "TXN004", "type": "出库", "material": "扳手", "quantity": 8, "location": "工具仓库", "operator": "赵六", "date": "2024-01-14", "time": "16:45"},
        {"id": "TXN005", "type": "入库", "material": "监控摄像头", "quantity": 10, "location": "B码头", "operator": "钱七", "date": "2024-01-13", "time": "11:30"},
        {"id": "TXN006", "type": "出库", "material": "防护服", "quantity": 15, "location": "2号仓库", "operator": "孙八", "date": "2024-01-13", "time": "15:20"},
        {"id": "TXN007", "type": "入库", "material": "拖车", "quantity": 1, "location": "C码头", "operator": "周九", "date": "2024-01-12", "time": "08:45"},
        {"id": "TXN008", "type": "出库", "material": "电钻", "quantity": 5, "location": "工具仓库", "operator": "吴十", "date": "2024-01-12", "time": "13:10"},
        {"id": "TXN009", "type": "入库", "material": "起重机", "quantity": 1, "location": "A码头", "operator": "张三", "date": "2024-01-11", "time": "09:00"},
        {"id": "TXN010", "type": "出库", "material": "安全帽", "quantity": 20, "location": "1号仓库", "operator": "李四", "date": "2024-01-11", "time": "14:30"},
    ]
}

# AI查询处理
def process_query(message: str) -> Dict[str, Any]:
    """处理用户查询"""
    message = message.strip().lower()
    
    # 码头查询
    if "码头" in message and ("多少" in message or "有" in message):
        port_name = None
        for char in "abcde":
            if f"{char}码头" in message:
                port_name = f"{char.upper()}码头"
                break
        
        if port_name:
            materials = [m for m in MOCK_DATA["materials"] if m["location"] == port_name]
            total_quantity = sum(m["quantity"] for m in materials)
            return {
                "response": f"根据查询结果，{port_name}共有 {len(materials)} 种物资，总数量为 {total_quantity} 件。",
                "data": materials,
                "suggestions": ["查看其他码头库存", "库存总览", "搜索特定物资"]
            }
    
    # 仓库查询
    if "仓库" in message and ("多少" in message or "有" in message):
        warehouse_name = None
        for w in MOCK_DATA["warehouses"]:
            if w["name"] in message:
                warehouse_name = w["name"]
                break
        
        if warehouse_name:
            materials = [m for m in MOCK_DATA["materials"] if m["location"] == warehouse_name]
            total_quantity = sum(m["quantity"] for m in materials)
            return {
                "response": f"根据查询结果，{warehouse_name}共有 {len(materials)} 种物资，总数量为 {total_quantity} 件。",
                "data": materials,
                "suggestions": ["查看其他仓库", "库存总览", "搜索特定物资"]
            }
    
    # 物资搜索
    if "搜索" in message or "查找" in message:
        search_term = message.replace("搜索", "").replace("查找", "").strip()
        results = [m for m in MOCK_DATA["materials"] if search_term in m["name"]]
        if results:
            return {
                "response": f"找到 {len(results)} 条相关记录。",
                "data": results,
                "suggestions": ["查看详细信息", "库存总览", "相关物资推荐"]
            }
        else:
            return {
                "response": f"没有找到包含 '{search_term}' 的物资。",
                "data": [],
                "suggestions": ["尝试其他关键词", "查看所有物资", "库存总览"]
            }
    
    # 库存总览
    if "库存" in message and ("总览" in message or "汇总" in message or "统计" in message):
        total_materials = len(MOCK_DATA["materials"])
        total_quantity = sum(m["quantity"] for m in MOCK_DATA["materials"])
        return {
            "response": f"库存总览：共有 {total_materials} 种物资，总数量 {total_quantity} 件。",
            "data": {
                "total_materials": total_materials,
                "total_quantity": total_quantity,
                "warehouses": len(MOCK_DATA["warehouses"]),
                "ports": len(MOCK_DATA["ports"])
            },
            "suggestions": ["查看具体仓库", "查看码头信息", "搜索特定物资"]
        }

    # 出库记录查询
    if "出库" in message:
        if "今天" in message or "今日" in message:
            outbound_records = [t for t in MOCK_DATA["transactions"] if t["type"] == "出库" and t["date"] == "2024-01-15"]
        elif "昨天" in message:
            outbound_records = [t for t in MOCK_DATA["transactions"] if t["type"] == "出库" and t["date"] == "2024-01-14"]
        elif "最近" in message:
            outbound_records = [t for t in MOCK_DATA["transactions"] if t["type"] == "出库"][:5]
        else:
            outbound_records = [t for t in MOCK_DATA["transactions"] if t["type"] == "出库"]

        total_outbound = sum(t["quantity"] for t in outbound_records)
        return {
            "response": f"找到 {len(outbound_records)} 条出库记录，总出库数量 {total_outbound} 件。",
            "data": outbound_records,
            "suggestions": ["查看入库记录", "今天的出库记录", "最近的交易记录"]
        }

    # 入库记录查询
    if "入库" in message:
        if "今天" in message or "今日" in message:
            inbound_records = [t for t in MOCK_DATA["transactions"] if t["type"] == "入库" and t["date"] == "2024-01-15"]
        elif "昨天" in message:
            inbound_records = [t for t in MOCK_DATA["transactions"] if t["type"] == "入库" and t["date"] == "2024-01-14"]
        elif "最近" in message:
            inbound_records = [t for t in MOCK_DATA["transactions"] if t["type"] == "入库"][:5]
        else:
            inbound_records = [t for t in MOCK_DATA["transactions"] if t["type"] == "入库"]

        total_inbound = sum(t["quantity"] for t in inbound_records)
        return {
            "response": f"找到 {len(inbound_records)} 条入库记录，总入库数量 {total_inbound} 件。",
            "data": inbound_records,
            "suggestions": ["查看出库记录", "今天的入库记录", "最近的交易记录"]
        }

    # 交易记录查询
    if "交易" in message or "记录" in message:
        if "今天" in message or "今日" in message:
            transactions = [t for t in MOCK_DATA["transactions"] if t["date"] == "2024-01-15"]
        elif "昨天" in message:
            transactions = [t for t in MOCK_DATA["transactions"] if t["date"] == "2024-01-14"]
        elif "最近" in message:
            transactions = MOCK_DATA["transactions"][:8]
        else:
            transactions = MOCK_DATA["transactions"]

        return {
            "response": f"找到 {len(transactions)} 条交易记录。",
            "data": transactions,
            "suggestions": ["查看出库记录", "查看入库记录", "今天的交易"]
        }

    # 特定物资的出入库查询
    for material in MOCK_DATA["materials"]:
        material_name = material["name"]
        if material_name in message and ("出库" in message or "入库" in message or "记录" in message):
            material_transactions = [t for t in MOCK_DATA["transactions"] if t["material"] == material_name]
            if material_transactions:
                return {
                    "response": f"{material_name}的交易记录：找到 {len(material_transactions)} 条记录。",
                    "data": material_transactions,
                    "suggestions": [f"查看{material_name}库存", "所有交易记录", "最近的出库"]
                }

    # 操作员查询
    if "操作员" in message or "谁" in message:
        operators = list(set(t["operator"] for t in MOCK_DATA["transactions"]))
        return {
            "response": f"系统中有 {len(operators)} 位操作员：{', '.join(operators)}",
            "data": [{"operator": op, "transactions": len([t for t in MOCK_DATA["transactions"] if t["operator"] == op])} for op in operators],
            "suggestions": ["查看具体操作员记录", "最近的交易", "出库记录"]
        }
    
    # 默认回复
    return {
        "response": "我理解您的问题，但需要更具体的信息。您可以询问码头库存、仓库信息或搜索特定物资。",
        "data": None,
        "suggestions": ["A码头有多少物品？", "库存总览", "搜索起重机", "1号仓库信息"]
    }

# API路由
@app.get("/")
async def root():
    return {
        "message": "港口物资管理AI助手API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/chat/message", response_model=ChatResponse)
async def chat_message(request: ChatRequest):
    try:
        # 生成ID
        message_id = f"msg_{int(datetime.now().timestamp())}"
        session_id = request.session_id or f"session_{int(datetime.now().timestamp())}"
        
        # 处理查询
        result = process_query(request.message)
        
        return ChatResponse(
            message_id=message_id,
            response=result["response"],
            data=result["data"],
            suggestions=result["suggestions"],
            session_id=session_id,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat/quick-actions")
async def quick_actions():
    actions = [
        QuickAction(
            id="inventory_summary",
            title="库存总览",
            query="库存总览",
            description="查看整体库存统计信息"
        ),
        QuickAction(
            id="recent_outbound",
            title="最近出库",
            query="最近的出库记录",
            description="查看最近的出库记录"
        ),
        QuickAction(
            id="recent_inbound",
            title="最近入库",
            query="最近的入库记录",
            description="查看最近的入库记录"
        ),
        QuickAction(
            id="today_transactions",
            title="今日交易",
            query="今天的交易记录",
            description="查看今天的所有交易"
        ),
        QuickAction(
            id="port_a_inventory",
            title="A码头库存",
            query="A码头有多少物品",
            description="查看A码头的物资库存"
        ),
        QuickAction(
            id="search_crane",
            title="搜索起重机",
            query="搜索起重机",
            description="查找起重机相关信息"
        )
    ]
    return actions

@app.get("/api/chat/suggestions")
async def suggestions():
    return {
        "suggestions": [
            "A码头有多少物品？",
            "库存总览",
            "最近的出库记录",
            "今天的入库记录",
            "搜索起重机",
            "1号仓库有多少设备？",
            "起重机的出入库记录",
            "今天的交易记录",
            "查看操作员信息",
            "昨天的出库情况"
        ]
    }

@app.get("/api/chat/status")
async def status():
    return {
        "status": "healthy",
        "ai_service": True,
        "database": True,
        "vector_db": True,
        "cache": True,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    print("🚀 启动港口物资管理AI助手后端服务...")
    print("📍 服务地址: http://localhost:8001")
    print("📚 API文档: http://localhost:8001/docs")
    print("=" * 50)

    try:
        uvicorn.run(
            "simple_server:app",
            host="0.0.0.0",
            port=8001,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"启动失败: {e}")
        print("尝试不使用reload模式...")
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8001,
            log_level="info"
        )
