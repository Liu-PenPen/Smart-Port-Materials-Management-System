"""
智慧港航AI助手启动脚本
"""
import os
import sys

def main():
    """主函数"""
    print("🚀 启动智慧港航AI助手...")

    try:
        # 直接运行主文件
        os.system("python main.py")
    except KeyboardInterrupt:
        print("\n👋 服务已停止")
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
