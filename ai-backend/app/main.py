"""
FastAPI主应用
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from app.config import get_settings
from app.api.chat import router as chat_router

# 获取配置
settings = get_settings()

# 创建FastAPI应用
app = FastAPI(
    title="港口物资管理AI助手",
    description="智能港口物资管理系统的AI问答服务",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(chat_router)


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "港口物资管理AI助手API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "service": "ai-backend",
        "version": "1.0.0"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """全局异常处理"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc) if settings.debug else "服务器内部错误"
        }
    )


if __name__ == "__main__":
    # 创建日志目录
    os.makedirs("logs", exist_ok=True)
    
    # 启动应用
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
