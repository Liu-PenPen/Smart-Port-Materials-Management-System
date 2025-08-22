# 港口物资管理AI助手后端服务

## 📋 项目简介

这是港口物资管理系统的AI问答后端服务，基于FastAPI构建，提供智能查询和数据检索功能。

## 🚀 快速开始

### 环境要求

- Python 3.8+
- pip 或 conda

### 安装依赖

```bash
# 进入后端目录
cd ai-backend

# 安装Python依赖
pip install -r requirements.txt
```

### 配置环境

```bash
# 复制环境变量配置文件
cp .env.example .env

# 编辑配置文件（可选）
# 注意：默认配置使用模拟数据，无需额外配置
```

### 启动服务

```bash
# 启动开发服务器
python run.py

# 或者使用uvicorn直接启动
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
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
├── app/
│   ├── api/                    # API路由
│   │   └── chat.py            # 聊天API
│   ├── models/                # 数据模型
│   │   ├── chat_models.py     # 聊天相关模型
│   │   └── data_models.py     # 业务数据模型
│   ├── services/              # 业务服务
│   │   ├── ai_service.py      # AI服务
│   │   └── mock_data_service.py # 模拟数据服务
│   ├── config.py              # 配置管理
│   └── main.py                # 主应用
├── requirements.txt           # Python依赖
├── .env.example              # 环境变量示例
└── run.py                    # 启动脚本
```

### 添加新的查询模式

在 `app/services/ai_service.py` 中的 `_init_query_patterns` 方法中添加新的模式：

```python
{
    "pattern": r"你的正则表达式",
    "type": QueryType.YOUR_TYPE,
    "extractor": self._your_extractor_method
}
```

### 扩展数据源

修改 `app/services/mock_data_service.py` 或创建新的数据服务来连接真实数据库。

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `API_HOST` | API服务主机 | `0.0.0.0` |
| `API_PORT` | API服务端口 | `8001` |
| `DEBUG` | 调试模式 | `True` |
| `USE_MOCK_DATA` | 使用模拟数据 | `True` |
| `CORS_ORIGINS` | 允许的跨域源 | `["http://localhost:3000"]` |

### 模拟数据

当前版本使用模拟数据进行演示，包括：

- 📦 物资数据（起重机、叉车、安全帽等）
- 🏢 仓库数据（1-5号仓库、设备仓库等）
- 📊 库存数据（随机生成的库存信息）
- 📋 交易记录（入库、出库、移库等）
- 🚢 码头数据（A-E码头）
- 🏭 供应商数据

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
