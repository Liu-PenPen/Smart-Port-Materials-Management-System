"""
启动脚本 - 解决reload问题
"""
import uvicorn

if __name__ == "__main__":
    print("🚀 启动港口物资管理AI助手后端服务...")
    print("📍 服务地址: http://localhost:8001")
    print("📚 API文档: http://localhost:8001/docs")
    print("🔄 按 Ctrl+C 停止服务")
    print("=" * 50)
    
    uvicorn.run(
        "simple_server:app",
        host="0.0.0.0",
        port=8001,
        reload=False,  # 关闭reload避免警告
        log_level="info"
    )
