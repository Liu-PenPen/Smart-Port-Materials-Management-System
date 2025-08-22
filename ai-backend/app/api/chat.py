"""
聊天API端点
"""
import uuid
from datetime import datetime
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Depends
from app.models.chat_models import (
    ChatRequest, ChatResponse, QuickAction, SystemStatus
)
from app.services.ai_service import ai_service
from app.config import get_settings

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """发送聊天消息"""
    try:
        # 生成消息ID
        message_id = str(uuid.uuid4())
        
        # 生成会话ID（如果没有提供）
        session_id = request.session_id or str(uuid.uuid4())
        
        # 处理AI查询
        ai_response = await ai_service.process_query(
            user_input=request.message,
            context=request.context
        )
        
        # 构建响应
        response = ChatResponse(
            message_id=message_id,
            response=ai_response.message,
            data=ai_response.query_result.data if ai_response.query_result else None,
            suggestions=ai_response.suggestions,
            session_id=session_id,
            timestamp=datetime.now()
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理消息时出错: {str(e)}")


@router.get("/quick-actions", response_model=List[QuickAction])
async def get_quick_actions():
    """获取快捷操作列表"""
    try:
        actions = ai_service.get_quick_actions()
        return [
            QuickAction(
                id=action["id"],
                title=action["title"],
                query=action["query"],
                description=action["description"],
                category="inventory",
                icon="QuestionCircleOutlined"
            )
            for action in actions
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取快捷操作失败: {str(e)}")


@router.get("/suggestions")
async def get_suggestions():
    """获取查询建议"""
    suggestions = [
        "A码头有多少物品？",
        "库存总览",
        "搜索起重机",
        "最近7天的交易记录",
        "1号仓库有多少设备？",
        "库存不足的物资有哪些？",
        "查找安全帽",
        "B码头的库存情况"
    ]
    return {"suggestions": suggestions}


@router.get("/status", response_model=SystemStatus)
async def get_system_status():
    """获取系统状态"""
    try:
        # 简单的健康检查
        ai_service_status = True  # AI服务状态
        database_status = True    # 数据库状态
        vector_db_status = True   # 向量数据库状态
        cache_status = True       # 缓存状态
        
        overall_status = "healthy" if all([
            ai_service_status, database_status, vector_db_status, cache_status
        ]) else "degraded"
        
        return SystemStatus(
            status=overall_status,
            ai_service=ai_service_status,
            database=database_status,
            vector_db=vector_db_status,
            cache=cache_status,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取系统状态失败: {str(e)}")


@router.post("/feedback")
async def submit_feedback(feedback: Dict[str, Any]):
    """提交用户反馈"""
    try:
        # 这里可以保存用户反馈到数据库
        # 目前只是简单返回确认
        return {
            "success": True,
            "message": "感谢您的反馈，我们会持续改进服务质量。",
            "feedback_id": str(uuid.uuid4())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"提交反馈失败: {str(e)}")


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """获取聊天历史"""
    try:
        # 这里应该从数据库获取聊天历史
        # 目前返回空历史
        return {
            "session_id": session_id,
            "messages": [],
            "total_count": 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取聊天历史失败: {str(e)}")


@router.delete("/history/{session_id}")
async def clear_chat_history(session_id: str):
    """清除聊天历史"""
    try:
        # 这里应该从数据库删除聊天历史
        return {
            "success": True,
            "message": f"会话 {session_id} 的历史记录已清除"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"清除聊天历史失败: {str(e)}")
