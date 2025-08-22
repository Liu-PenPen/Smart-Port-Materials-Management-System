"""
智慧港航AI助手 - 主服务文件
"""
import json
from datetime import datetime
from typing import Dict, List, Any, Optional

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    import uvicorn
except ImportError as e:
    print(f"缺少依赖: {e}")
    print("请运行: pip install fastapi uvicorn pydantic")
    exit(1)

# AI配置
AI_CONFIG = {
    "api_key": "sk-reoHRL3C7a1VeXLgMYgbZ9p3aqUeuQUUKduSzBSrsmiO9DUS",
    "base_url": "https://api.chatfire.cn/v1",
    "model": "gpt-3.5-turbo"
}

# 初始化AI客户端
try:
    from openai import OpenAI
    
    ai_client = OpenAI(
        api_key=AI_CONFIG["api_key"],
        base_url=AI_CONFIG["base_url"]
    )
    AI_AVAILABLE = True
    print(f"✅ AI客户端初始化成功 - {AI_CONFIG['base_url']}")
    print(f"🤖 使用模型: {AI_CONFIG['model']}")
except ImportError as e:
    AI_AVAILABLE = False
    ai_client = None
    print(f"⚠️ OpenAI库未安装: {e}")
except Exception as e:
    AI_AVAILABLE = False
    ai_client = None
    print(f"❌ AI客户端初始化失败: {e}")

# 创建FastAPI应用
app = FastAPI(
    title="智慧港航AI助手",
    description="基于第三方AI的港口物资管理智能问答服务",
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

# 港口物资数据
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
    "transactions": [
        {"id": "TXN001", "type": "入库", "material": "起重机", "quantity": 2, "location": "A码头", "operator": "张三", "date": "2024-01-15"},
        {"id": "TXN002", "type": "出库", "material": "叉车", "quantity": 3, "location": "A码头", "operator": "李四", "date": "2024-01-15"},
        {"id": "TXN003", "type": "入库", "material": "安全帽", "quantity": 50, "location": "1号仓库", "operator": "王五", "date": "2024-01-14"},
    ]
}

def build_system_prompt() -> str:
    """构建AI系统提示词"""
    return f"""
你是智慧港航AI智能助手，专门为港口物资管理系统提供服务。

## 系统数据
### 物资信息
{json.dumps(MOCK_DATA['materials'], ensure_ascii=False, indent=2)}

### 交易记录
{json.dumps(MOCK_DATA['transactions'], ensure_ascii=False, indent=2)}

## 回答格式要求
请使用美观的Markdown格式回答，包括：

### 📊 数据展示格式
- 使用表格展示结构化数据
- 使用列表展示要点信息
- 使用适当的emoji图标增强可读性
- 使用标题和分段组织内容

### 📋 表格格式示例
对于交易记录，使用表格格式：
| 交易ID | 类型 | 物资 | 数量 | 地点 | 操作员 | 日期 |
|--------|------|------|------|------|------|------|
| TXN001 | 入库 | 起重机 | 2台 | A码头 | 张三 | 2024-01-15 |

### 📝 列表格式示例
对于库存概况，使用分类列表：
## 📦 库存概况
- **🏗️ 机械设备**: 起重机15台、叉车28台
- **🛡️ 安全用品**: 安全帽150顶、防护服80套
- **🔧 工具设备**: 扳手45把、电钻25台

### 🎯 重要提示
- 交易记录必须使用表格格式展示
- 库存信息使用分类列表展示
- 分析结果使用标题分段组织
- 适当使用emoji增强可读性

## 回答规则
1. **准确性**: 基于提供的数据给出准确回答
2. **格式化**: 使用Markdown格式美化展示
3. **结构化**: 用表格、列表等方式组织信息
4. **可读性**: 添加emoji和标题提升阅读体验
5. **专业性**: 保持港口物资管理的专业术语

请始终使用Markdown格式回答，让信息展示更加美观和易读。
"""

async def process_with_ai(user_input: str) -> Dict[str, Any]:
    """AI处理用户查询"""
    if not AI_AVAILABLE or not ai_client:
        return {
            "response": "抱歉，AI服务当前不可用。请检查网络连接或联系管理员。",
            "data": None,
            "suggestions": ["稍后重试", "检查网络连接", "联系技术支持"],
            "ai_powered": False
        }
    
    try:
        response = ai_client.chat.completions.create(
            model=AI_CONFIG["model"],
            messages=[
                {"role": "system", "content": build_system_prompt()},
                {"role": "user", "content": user_input}
            ],
            max_tokens=500,
            temperature=0.3,
            timeout=30
        )
        
        if hasattr(response, 'choices') and len(response.choices) > 0:
            ai_response = response.choices[0].message.content
            
            return {
                "response": ai_response,
                "data": None,
                "suggestions": ["查看库存总览", "最近的交易记录", "搜索特定物资"],
                "ai_powered": True
            }
        else:
            raise Exception("AI响应格式不正确")
        
    except Exception as e:
        error_str = str(e)
        if "<!DOCTYPE html>" in error_str or "<html" in error_str:
            error_msg = "AI服务配置错误，请检查API端点设置。"
        else:
            error_msg = f"AI服务暂时不可用：{str(e)[:100]}"
        
        return {
            "response": error_msg,
            "data": None,
            "suggestions": ["稍后重试", "检查网络连接", "联系技术支持"],
            "ai_powered": False
        }

# API路由
@app.get("/")
async def root():
    return {
        "message": "智慧港航AI助手API",
        "version": "1.0.0",
        "status": "running",
        "ai_status": "已连接" if AI_AVAILABLE else "不可用"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "ai_available": AI_AVAILABLE}

@app.post("/api/chat/message", response_model=ChatResponse)
async def chat_message(request: ChatRequest):
    try:
        message_id = f"msg_{int(datetime.now().timestamp())}"
        session_id = request.session_id or f"session_{int(datetime.now().timestamp())}"
        
        result = await process_with_ai(request.message)
        
        return ChatResponse(
            message_id=message_id,
            response=result["response"],
            data=result["data"],
            suggestions=result["suggestions"],
            session_id=session_id,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        return ChatResponse(
            message_id=f"msg_{int(datetime.now().timestamp())}",
            response=f"抱歉，处理您的请求时出现错误：{str(e)}",
            data=None,
            suggestions=["稍后重试", "检查网络连接", "联系技术支持"],
            session_id=request.session_id or f"session_{int(datetime.now().timestamp())}",
            timestamp=datetime.now().isoformat()
        )

@app.get("/api/chat/quick-actions")
async def quick_actions():
    return [
        QuickAction(id="inventory", title="库存总览", query="库存总览", description="查看整体库存统计"),
        QuickAction(id="analysis", title="智能分析", query="分析港口物资分布情况", description="AI分析物资状况"),
        QuickAction(id="port_a", title="A码头库存", query="A码头有多少物品", description="查看A码头物资"),
        QuickAction(id="outbound", title="出库记录", query="最近的出库记录", description="查看出库情况"),
        QuickAction(id="inbound", title="入库记录", query="最近的入库记录", description="查看入库情况"),
        QuickAction(id="search", title="搜索起重机", query="搜索起重机", description="查找设备信息")
    ]

@app.get("/api/chat/suggestions")
async def suggestions():
    return {
        "suggestions": [
            "A码头有多少物品？",
            "库存总览",
            "分析港口物资分布情况",
            "最近的出库记录",
            "给我一些库存管理建议",
            "搜索起重机",
            "港口安全设备是否充足？",
            "今天的交易记录"
        ]
    }

@app.get("/api/chat/status")
async def status():
    return {
        "status": "healthy",
        "ai_service": AI_AVAILABLE,
        "ai_type": f"第三方AI {AI_CONFIG['model']}" if AI_AVAILABLE else "AI不可用",
        "ai_provider": f"第三方AI ({AI_CONFIG['base_url']})" if AI_AVAILABLE else "无",
        "model": AI_CONFIG['model'],
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    print("🚀 启动智慧港航AI助手...")
    print(f"📍 服务地址: http://localhost:8001")
    print(f"🤖 AI状态: {'✅ 已连接' if AI_AVAILABLE else '❌ 不可用'}")
    print(f"🔗 API文档: http://localhost:8001/docs")
    print("=" * 50)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )
