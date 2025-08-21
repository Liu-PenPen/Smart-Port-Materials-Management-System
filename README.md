# 智慧港口物资管理系统

一个基于 React + Ant Design + ProComponents 的企业级物资管理系统前端项目。

## 项目特性

- 🚀 基于 React 18 + TypeScript + Vite 构建
- 🎨 使用 Ant Design 5.x + ProComponents 组件库
- 📊 集成 ECharts 图表库
- 🔄 使用 React Query 进行数据管理
- 🗂️ 使用 Zustand 进行状态管理
- 📱 响应式设计，支持移动端
- 🔐 完整的权限管理系统
- 📈 丰富的报表分析功能

## 技术栈

### 核心框架
- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具

### UI 组件
- **Ant Design 5.x** - UI 组件库
- **ProComponents** - 高级组件
- **Ant Design Icons** - 图标库

### 数据管理
- **React Query** - 服务端状态管理
- **Zustand** - 客户端状态管理
- **Axios** - HTTP 客户端

### 图表可视化
- **ECharts** - 图表库
- **echarts-for-react** - React 封装

### 工具库
- **React Router Dom** - 路由管理
- **dayjs** - 日期处理
- **lodash-es** - 工具函数
- **ahooks** - React Hooks 库

## 项目结构

```
src/
├── components/          # 公共组件
├── pages/              # 页面组件
│   ├── Dashboard/      # 工作台
│   ├── Login/          # 登录页
│   ├── Supplier/       # 供应商管理
│   ├── Material/       # 物资管理
│   ├── Warehouse/      # 仓库管理
│   ├── Application/    # 物资申请
│   ├── Purchase/       # 采购管理
│   ├── Inbound/        # 入库管理
│   ├── Outbound/       # 出库管理
│   ├── Inventory/      # 库存管理
│   └── Report/         # 报表中心
├── services/           # API 服务
├── stores/             # 状态管理
├── types/              # 类型定义
├── utils/              # 工具函数
├── constants/          # 常量定义
├── hooks/              # 自定义 Hooks
├── App.tsx             # 应用入口
└── main.tsx            # 主入口文件
```

## 功能模块

### 1. 渠道管理
- **供应商管理** - 供应商信息维护、考核管理
- **物资管理** - 物资主数据、分类管理、条码管理
- **仓库管理** - 仓库信息、货位管理

### 2. 业务流程
- **物资申请** - 申请单创建、审批流程
- **采购管理** - 采购计划、询价比价、供应商选择
- **入库管理** - 到货验收、入库确认、发票处理
- **出库管理** - 出库申请、审批、实际出库

### 3. 库存管理
- **库存查询** - 实时库存、库存明细
- **库存预警** - 上下限设置、预警通知、采购建议

### 4. 报表分析
- **库存报表** - 库存查询、库龄分析
- **采购报表** - 采购统计、供应商分析
- **财务报表** - 成本分析、资金月报
- **业务报表** - 出入库明细、领用统计

### 5. 系统管理
- **用户管理** - 用户信息、角色权限
- **组织管理** - 公司组织、部门管理
- **系统配置** - 参数设置、数据字典

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:3000

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产版本
```bash
npm run preview
# 或
yarn preview
```

## 开发指南

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 代码规范
- 使用 Prettier 进行代码格式化

### 组件开发
- 使用函数式组件 + Hooks
- 优先使用 ProComponents 高级组件
- 保持组件的单一职责原则

### 状态管理
- 服务端状态使用 React Query
- 客户端状态使用 Zustand
- 避免不必要的全局状态

### API 调用
- 统一使用 services 层封装 API
- 使用 React Query 进行缓存和错误处理
- 实现请求拦截和响应拦截

## 部署说明

### 环境变量
创建 `.env.production` 文件：
```
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=物资管理系统
```

### Docker 部署
```dockerfile
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

MIT License

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 联系方式

如有问题或建议，请联系开发团队。
