# 智慧港航AI助手

## 📋 项目简介

基于第三方AI的港口物资管理智能问答服务，使用FastAPI构建，提供自然语言查询和智能分析功能。

## 🚀 快速开始

### 环境要求

- Python 3.8+
- pip 或 conda

### 安装依赖

```bash
cd ai-backend
pip install -r requirements.txt
```

### 启动服务

```bash
# 方式1: 使用启动脚本
python run.py

# 方式2: 直接启动
python main.py
```

服务启动后，访问以下地址：

- **API服务**: http://localhost:8001
- **API文档**: http://localhost:8001/docs
- **健康检查**: http://localhost:8001/health

## 📚 API文档

### 聊天接口

#### 发送消息
```
POST /api/chat/message
```

请求体：
```json
{
  "message": "A码头有多少物品？",
  "session_id": "optional_session_id",
  "context": {}
}
```

响应：
```json
{
  "message_id": "msg_xxx",
  "response": "根据查询结果，A码头共有...",
  "data": [...],
  "suggestions": ["查看其他码头", "库存总览"],
  "session_id": "session_xxx",
  "timestamp": "2024-01-01T12:00:00"
}
```

#### 获取快捷操作
```
GET /api/chat/quick-actions
```

#### 获取系统状态
```
GET /api/chat/status
```

## 🛠️ 开发指南

### 项目结构

```
ai-backend/
├── main.py              # 主服务文件（包含所有功能）
├── run.py               # 启动脚本
├── requirements.txt     # Python依赖
├── README.md           # 项目说明
└── package.json        # 项目信息
```

### 扩展功能

#### 修改数据源
在 `main.py` 中修改 `MOCK_DATA` 来更新港口数据：

```python
MOCK_DATA = {
    "materials": [
        # 添加更多物资数据
    ],
    "transactions": [
        # 添加更多交易记录
    ]
}
```

#### 连接真实数据库
替换模拟数据为真实数据库查询：

```python
def build_system_prompt() -> str:
    real_data = get_data_from_database()
    return f"基于以下数据回答: {real_data}"
```

## 🔧 配置说明

### AI配置

在 `main.py` 中的 `AI_CONFIG` 配置第三方AI服务：

```python
AI_CONFIG = {
    "api_key": "your_api_key_here",
    "base_url": "https://api.chatfire.cn/v1",
    "model": "gpt-3.5-turbo"
}
```

### 数据配置

当前使用模拟数据，包括：

- 📦 8种物资（起重机、叉车、安全帽等）
- 🏢 多个存储位置（A/B/C码头、各仓库）
- 📋 交易记录（入库、出库操作）

## 🧪 测试

```bash
# 运行测试
pytest

# 运行特定测试
pytest tests/test_ai_service.py

# 生成测试覆盖率报告
pytest --cov=app tests/
```

## 📝 日志

日志文件位置：`logs/ai_service.log`

日志级别可通过环境变量 `LOG_LEVEL` 配置。

## 🚀 部署

### Docker部署

```bash
# 构建镜像
docker build -t ai-backend .

# 运行容器
docker run -p 8001:8001 ai-backend
```

### 生产环境

```bash
# 安装生产依赖
pip install gunicorn

# 启动生产服务器
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8001
```

## 🤝 贡献

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持

如有问题，请联系：

- 邮箱: contact@839590955@qq.com
- GitHub: https://github.com/Liu-PenPen/Smart-Port-Materials-Management-System

---

**小花花团队打造** ❤️
