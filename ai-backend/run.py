"""
AI后端服务启动脚本
"""
import os
import sys
import uvicorn
from app.main import app
from app.config import get_settings

def main():
    """主函数"""
    settings = get_settings()
    
    # 创建必要的目录
    os.makedirs("logs", exist_ok=True)
    os.makedirs("chroma_db", exist_ok=True)
    
    print("🚀 启动港口物资管理AI助手后端服务...")
    print(f"📍 服务地址: http://{settings.api_host}:{settings.api_port}")
    print(f"📚 API文档: http://{settings.api_host}:{settings.api_port}/docs")
    print(f"🔧 调试模式: {'开启' if settings.debug else '关闭'}")
    print("=" * 50)
    
    try:
        uvicorn.run(
            app,
            host=settings.api_host,
            port=settings.api_port,
            reload=settings.debug,
            log_level=settings.log_level.lower(),
            access_log=True
        )
    except KeyboardInterrupt:
        print("\n👋 服务已停止")
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
