# Molly Global · 义乌茉莉出海

**Molly Global（义乌茉莉出海）** 主页，招募计划：**义乌全球贸易合伙人（Yiwu Global Trade Creator Partner）**。

两条并列招募路线，同一套外贸供应链后端，都按真实结果分成、非坐班、非底薪。双语（中 / EN）单页。

- **语言博主 · 郑和计划**（小红书英语博主、留学生、英语老师、自由职业者等）：用你的英文/外语表达和内容能力，帮海外客户读懂义乌，带来真实询盘与订单。
- **旅游博主 · 马可波罗计划**：在原本的旅途中加一个商业任务——拍当地市场、找真实需求、连接中国供应链，把旅游内容升级成全球贸易情报。内容 → 线索 → 成交 → 城市合伙人的阶梯奖励。

两条路线各有独立申请入口（两个申请表单）。

**Two kinds of creators, one Yiwu supply chain.**

## 品牌与联系方式

v1.3.0 起品牌由 YiwuHire 更名为 **Molly Global · 义乌茉莉出海**（导航、页脚、标题、meta、结构化数据全部更新；域名仍为 yiwuhire.com）。

- **Logo「花开四海」**（由 Codex 设计）：四片茉莉花瓣组成罗盘，三蓝一橙，橙色花瓣指向海外；导航 logo（`index.html` 内联 SVG）与 `favicon.svg` 共用同一图形，鼠标悬停时罗盘旋转一圈。
- **联系方式**（页脚 + 两个申请弹窗，文案在 `data.js` 的 `contact*` 键，中英文随语言切换）：
  - 微信：shping1985
  - 邮箱：[mollysu666@gmail.com](mailto:mollysu666@gmail.com)
  - TikTok：[@mollyadventure6](https://www.tiktok.com/@mollyadventure6)
  - Instagram：[@mollysu888](https://www.instagram.com/mollysu888)
  - 小红书：[Molly茉莉全球小生意](https://www.xiaohongshu.com/user/profile/5846ffaa6a6a69493f91bce6)、[Molly外贸出海](https://www.xiaohongshu.com/user/profile/6a196a890000000001007000)

## 设计与技术

v1.2.0 起整站换肤为 Budarina 风格(超大黑体标题的现代作品集风),零依赖、零构建,纯 HTML/CSS/JS:

- 米白底 + 纯白大圆角卡片;英文大标题使用自托管 **Archivo Black**(`fonts/`,仅 latin 子集约 10KB,SIL OFL 许可),中文标题回退系统粗黑体——不请求任何第三方 CDN。
- 悬浮胶囊毛玻璃导航,左侧为「花开四海」罗盘花瓣 logo。
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

申请表单目前只保存在访问者当前浏览器中，不会提交到服务器；访客通过页脚和申请弹窗中的联系方式直接联系 Molly。

`styles.css` 与 `favicon.svg` 的引用带 `?v=` 版本号，改样式或图标后更新该参数，避免访客看到缓存的旧版本。
