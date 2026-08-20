# 🌤️ Weather Dashboard

一个功能完整的天气仪表板应用，可实时获取全球任何城市的天气信息。

## 📋 项目概述

Weather Dashboard 是一个现代化的天气查询应用，使用开源的 **Open-Meteo** 天气 API（无需 API 密钥）提供准确的天气数据。应用采用响应式设计，支持所有设备访问。

## ✨ 主要功能

### 🌡️ 实时天气信息
- 当前温度、体感温度和天气状况
- 详细的天气数据：
  - 湿度（Humidity）
  - 风速（Wind Speed）
  - 能见度（Visibility）
  - 气压（Pressure）
  - 紫外线指数（UV Index）

### 📅 预报功能
- **24小时预报**：逐小时的温度、降水概率和天气条件
- **7天预报**：最高最低温度、风速和降水量

### 🔍 城市搜索
- 全球城市搜索功能
- 支持多语言城市名称
- 实时搜索反馈

### 📱 响应式设计
- 桌面版、平板版、手机版完美适配
- 流畅的动画效果和过渡
- 现代化的用户界面

## 🛠️ 技术栈

- **前端**：HTML5 + CSS3 + Vanilla JavaScript
- **天气数据源**：Open-Meteo API（免费、无需认证）
- **地理编码**：Open-Meteo Geocoding API
- **图标**：Font Awesome 6.4.0

## 🚀 快速开始

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/amanmanlai-byte/Weather.git
cd Weather
```

2. 打开应用
直接在浏览器中打开 `index.html` 文件即可使用，无需任何服务器配置。

```bash
# macOS/Linux
open index.html

# Windows
start index.html
```

或者，使用简单的本地服务器：
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (http-server)
npx http-server
```

然后在浏览器访问 `http://localhost:8000`

## 📁 项目结构

```
Weather/
├── index.html          # 主页面结构
├── styles.css          # 样式表
├── script.js           # JavaScript 逻辑
└── README.md           # 项目说明文档
```

## 📖 使用说明

1. **默认加载**：打开应用时会自动显示伦敦（London）的天气
2. **搜索城市**：
   - 在搜索框中输入城市名称（例如：Tokyo、Paris、Beijing）
   - 点击搜索按钮或按 Enter 键
   - 应用会立即显示该城市的天气数据
3. **查看预报**：
   - 向下滚动查看 24 小时预报
   - 继续滚动查看 7 天天气预报

## 🌐 API 说明

### Open-Meteo API
- **优点**：
  - ✅ 完全免费，无需注册和 API 密钥
  - ✅ 全球覆盖，数据准确可靠
  - ✅ 支持历史数据（1940年以来）
  - ✅ 响应速度快，稳定性好
  - ✅ 无请求数量限制

- **官方网站**：https://open-meteo.com/
- **API 文档**：https://open-meteo.com/en/docs

## 🎨 UI 设计特点

- **现代化界面**：采用紫色渐变背景和卡片式布局
- **实时反馈**：加载状态、错误提示和动画效果
- **天气图标**：根据不同天气条件显示对应的 Font Awesome 图标
- **颜色编码**：
  - 🔵 主色调：蓝色系（用于按钮和重要信息）
  - 🟡 警告色：黄色（用于温度和太阳图标）
  - ⚡ 紫色渐变：背景主色调

## 📊 支持的天气类型

应用支持所有 WMO 天气编码标准，包括：
- 晴天、多云、阴天
- 小雨、中雨、大雨
- 冰雹、雪
- 雷暴
- 雾霾
- 等多种天气现象

## 🔧 配置选项

### 更改默认城市
编辑 `script.js` 中的最后一行：
```javascript
// 修改此处的城市名称
window.addEventListener('load', () => {
    loadWeather('你想要的城市名');
});
```

### 更改温度单位
Open-Meteo API 默认返回摄氏度。如需改为华氏度，修改 API 请求：
```javascript
// 在 fetchWeather 函数中添加参数
&temperature_unit=fahrenheit
```

## 🐛 故障排除

### 问题：显示"City not found"（城市未找到）
**解决**：确保输入的城市名称正确，可尝试英文拼写

### 问题：天气数据加载缓慢
**解决**：检查网络连接，通常加载时间在 1-3 秒

### 问题：样式显示不正确
**解决**：清除浏览器缓存或使用隐私模式打开

## 📈 潜在改进

- [ ] 添加多语言支持
- [ ] 实现天气提醒功能
- [ ] 添加地图显示
- [ ] 保存常用城市列表
- [ ] 深色模式切换
- [ ] 添加空气质量数据
- [ ] 集成更多数据源

## 📄 许可证

本项目采用 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📧 联系方式

如有任何问题或建议，欢迎通过 GitHub Issues 联系我。

---

**最后更新**：2026年8月20日

**祝您使用愉快！** 🌈