# 🔮 玄机占卜平台

一个功能完整的在线占卜平台，支持多种占卜方式，集成AI智能解读。

## ✨ 功能特性

- 🃏 **塔罗牌占卜** — 单牌/三牌/凯尔特十字牌阵
- ☯️ **周易八卦** — 传统六爻占卜 + AI解读
- ♈ **星座运势** — 十二星座每日运势
- 🔮 **八字命理** — 生辰八字五行分析
- 📝 **姓名测试** — 姓名五行数理分析
- 📅 **每日运势** — 综合运势 + 幸运数字颜色
- 💎 **VIP会员** — 分级功能权限
- 🔐 **管理后台** — 用户/订单/记录管理

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite + Tailwind CSS + Framer Motion |
| 后端 | Node.js 18 + Express |
| AI | 自定义AI引擎（支持多模型） |
| 数据库 | SQLite |
| 部署 | Docker + Nginx |
| 国际化 | i18next (中/英) |

## 🚀 快速开始

### Docker部署（推荐）

```bash
git clone https://github.com/ajieonline/divination-platform.git
cd divination-platform
docker-compose up -d
```

- 前端: http://localhost
- 后端API: http://localhost:3000
- 管理后台: http://localhost/admin (admin/admin123)

### 本地开发

```bash
# 前端
cd client && npm install && npm run dev

# 后端
cd server && npm install && node server.js
```

## 📁 项目结构

```
divination-platform/
├── client/              # 前端 (Vite + React)
│   ├── src/pages/      # 页面组件
│   ├── src/components/ # 公共组件
│   ├── src/i18n/       # 国际化
│   └── src/admin/      # 管理后台
├── server/              # 后端 (Node.js)
│   ├── server.js       # 主服务
│   ├── ai-engine.js    # AI引擎
│   └── payment-engine.js # 支付引擎
└── docker-compose.yml
```

## 📄 License

MIT
