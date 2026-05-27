# 条形码生成器 · 微信小程序

基于 **uni-app + Vue 3 + [JsBarcode](https://github.com/lindell/JsBarcode)** 的 CODE128 条形码工具，使用 **canvas 2d** 渲染，iOS 极简蓝白中文界面，支持 iPhone / Android 微信端。

## 功能

- 实时生成 CODE128 条形码
- 保存图片到相册
- 批量生成（换行 / 空格 / 全部三种分割）
- 本地历史记录（`uni.storage`）
- 自定义 TabBar（生成 / 批量 / 历史）
- 广告位预留（`components/AdSlot`）

## 环境要求

- Node.js 18+
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 微信小程序 AppID（测试可用测试号）

## 快速开始

### 方式一：命令行（推荐）

```bash
cd barcode-uniapp
npm install
npm run dev:mp-weixin
```

用微信开发者工具导入目录：`barcode-uniapp/dist/dev/mp-weixin`（开发）或 `dist/build/mp-weixin`（构建）

### 方式二：HBuilderX

1. 用 HBuilderX 打开 `barcode-uniapp` 目录  
2. 运行 → 运行到小程序模拟器 → 微信开发者工具  

## 配置 AppID

编辑 `manifest.json` → `mp-weixin` → `appid`，填入你的小程序 AppID。

## 发布

```bash
npm run build:mp-weixin
```

上传 `dist/build/mp-weixin` 到微信公众平台。

## 接入广告

编辑 `components/AdSlot/AdSlot.vue`，将占位区域替换为：

```html
<ad unit-id="你的广告单元ID" ad-type="banner" />
```

并在微信公众平台开通流量主。

## 项目结构

```
barcode-uniapp/src/
├── components/
│   ├── AppNavBar/       # 顶部蓝色导航
│   ├── BarcodeCanvas/   # 条形码 canvas 绘制
│   ├── GradientButton/  # 底部渐变按钮
│   └── AdSlot/          # 广告位
├── custom-tab-bar/      # 自定义底部 Tab
├── pages/
│   ├── index/           # 单个生成
│   ├── batch/           # 批量生成
│   └── history/         # 历史记录
└── utils/
    ├── jsbarcode.js     # JsBarcode 适配（canvas 2d）
    ├── canvas.js        # 相册保存与 canvas 工具
    ├── history.js       # 本地缓存
    └── split.js         # 批量分割
```

## 说明

- 条形码由 **JsBarcode** 生成，格式 **CODE128**（建议英文、数字与常用符号）
- 保存相册需用户授权 `scope.writePhotosAlbum`
- 历史记录最多保留 100 条

## 隐私合规（微信审核）

- **首次启动弹窗**：`PrivacyModal` 勾选协议后方可使用
- **用户协议**：`pages/legal/agreement`（可滚动 + 底部同意按钮）
- **隐私政策**：`pages/legal/privacy`（本地缓存、相册权限、不上传数据等说明）
- 首页/历史页底部可随时查看协议链接
- 不同意可退出小程序（`exitMiniProgram`）

微信公众平台配置建议：在「设置 → 服务内容声明」中填写隐私政策链接（若使用 H5 托管可填对应 URL），并在「用户隐私保护指引」中勾选相册等实际使用权限。
