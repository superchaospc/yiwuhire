# Molly Global · 义乌茉莉出海

**Molly Global（义乌茉莉出海）** 主页，招募计划：**义乌全球贸易合伙人（Yiwu Global Trade Creator Partner）**。

两条并列招募路线，同一套外贸供应链后端，都按真实结果分成、非坐班、非底薪。双语（中 / EN）单页。

- **语言博主 · 郑和计划**（小红书英语博主、留学生、英语老师、自由职业者等）：用你的英文/外语表达和内容能力，帮海外客户读懂义乌，带来真实询盘与订单。
- **旅游博主 · 马可波罗计划**：在原本的旅途中加一个商业任务——拍当地市场、找真实需求、连接中国供应链，把旅游内容升级成全球贸易情报。内容 → 线索 → 成交 → 城市合伙人的阶梯奖励。

两条路线各有独立申请入口（两个申请表单）。

**Two kinds of creators, one Yiwu supply chain.**

## 设计与技术

v1.2.0 起整站换肤为 Budarina 风格(超大黑体标题的现代作品集风),零依赖、零构建,纯 HTML/CSS/JS:

- 米白底 + 纯白大圆角卡片;英文大标题使用自托管 **Archivo Black**(`fonts/`,仅 latin 子集约 10KB,SIL OFL 许可),中文标题回退系统粗黑体——不请求任何第三方 CDN。
- 悬浮胶囊毛玻璃导航,品牌 logo 块带蓝→橙双轨渐变发光。
- Framer 式入场动画:淡入 + 上移 + 模糊消散,hero 与卡片网格交错浮现(IntersectionObserver,`--d`/`--i` 自定义属性控制延迟)。
- 鼠标跟随的 3D 倾斜卡片 + 扫光(仅 `hover: hover` 且 `pointer: fine` 的设备启用)。
- hero 下方双语无限跑马灯(词条在 `data.js` 的 `marqueeItems`,跟随语言切换)。
- 深色金句区逐词浮现(英文按词、中文按字拆分)。
- 所有动效尊重 `prefers-reduced-motion`,弱动效环境直接呈现最终状态。

双语文案全部集中在 `data.js`(`data-copy` 键值系统);蓝色 = 郑和计划、橙色 = 马可波罗计划的双轨语义色贯穿全站。

## 本地预览

```bash
python3 -m http.server 4173
```

打开 `http://localhost:4173/`。

## 部署

本仓库通过 GitHub Pages 部署到 [yiwuhire.com](https://yiwuhire.com/)。

当前为概念演示页：申请表单只保存在访问者当前浏览器中，不会提交到服务器。上线真实招募时，把申请入口替换为真实联系方式（微信 / WhatsApp / 邮箱 / 表单后端）即可。
