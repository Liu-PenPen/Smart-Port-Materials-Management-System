"""
对话相关的数据模型
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    """消息角色"""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class QueryType(str, Enum):
    """查询类型"""
    COUNT = "count"
    SUM = "sum"
    LIST = "list"
    COMPARE = "compare"
    TREND = "trend"
    GENERAL = "general"


class ChatMessage(BaseModel):
    """聊天消息模型"""
    id: str = Field(..., description="消息ID")
    role: MessageRole = Field(..., description="消息角色")
    content: str = Field(..., description="消息内容")
    timestamp: datetime = Field(default_factory=datetime.now, description="时间戳")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="元数据")


class QueryIntent(BaseModel):
    """查询意图模型"""
    type: QueryType = Field(..., description="查询类型")
    entities: List[str] = Field(default=[], description="实体列表")
    parameters: Dict[str, Any] = Field(default={}, description="查询参数")
    confidence: float = Field(default=0.0, description="置信度")
    filters: Optional[Dict[str, Any]] = Field(default=None, description="过滤条件")


class DataSource(BaseModel):
    """数据源信息"""
    table: str = Field(..., description="数据表名")
    fields: List[str] = Field(..., description="字段列表")
    description: str = Field(..., description="数据源描述")


class QueryResult(BaseModel):
    """查询结果模型"""
    success: bool = Field(..., description="查询是否成功")
    data: Any = Field(..., description="查询数据")
    count: Optional[int] = Field(default=None, description="结果数量")
    source: Optional[DataSource] = Field(default=None, description="数据源")
    query_time: float = Field(..., description="查询耗时(秒)")
    error: Optional[str] = Field(default=None, description="错误信息")


class AIResponse(BaseModel):
    """AI响应模型"""
    message: str = Field(..., description="回复消息")
    query_result: Optional[QueryResult] = Field(default=None, description="查询结果")
    suggestions: List[str] = Field(default=[], description="建议问题")
    confidence: float = Field(default=0.0, description="回答置信度")
    processing_time: float = Field(..., description="处理耗时(秒)")


class ChatRequest(BaseModel):
    """聊天请求模型"""
    message: str = Field(..., description="用户消息", min_length=1, max_length=1000)
    session_id: Optional[str] = Field(default=None, description="会话ID")
    context: Optional[Dict[str, Any]] = Field(default=None, description="上下文信息")


class ChatResponse(BaseModel):
    """聊天响应模型"""
    message_id: str = Field(..., description="消息ID")
    response: str = Field(..., description="AI回复")
    data: Optional[Any] = Field(default=None, description="相关数据")
    suggestions: List[str] = Field(default=[], description="建议问题")
    session_id: str = Field(..., description="会话ID")
    timestamp: datetime = Field(default_factory=datetime.now, description="响应时间")


class ConversationHistory(BaseModel):
    """对话历史模型"""
    session_id: str = Field(..., description="会话ID")
    messages: List[ChatMessage] = Field(default=[], description="消息列表")
    created_at: datetime = Field(default_factory=datetime.now, description="创建时间")
    updated_at: datetime = Field(default_factory=datetime.now, description="更新时间")


class QuickAction(BaseModel):
    """快捷操作模型"""
    id: str = Field(..., description="操作ID")
    title: str = Field(..., description="操作标题")
    query: str = Field(..., description="查询语句")
    description: str = Field(..., description="操作描述")
    category: str = Field(..., description="分类")
    icon: Optional[str] = Field(default=None, description="图标")


class SystemStatus(BaseModel):
    """系统状态模型"""
    status: str = Field(..., description="系统状态")
    ai_service: bool = Field(..., description="AI服务状态")
    database: bool = Field(..., description="数据库状态")
    vector_db: bool = Field(..., description="向量数据库状态")
    cache: bool = Field(..., description="缓存状态")
    timestamp: datetime = Field(default_factory=datetime.now, description="检查时间")
