# yiwuhire.com Budarina 风格换肤 — 设计文档

日期:2026-07-13
状态:已获用户确认

## 目标

把 yiwuhire.com 从当前的苹果官网风整体换肤成 budarina.design 的 Framer 风格:
超大黑体标题、米白底、悬浮胶囊毛玻璃导航、入场动画(淡入+上移+模糊消散+交错)、
鼠标跟随 3D 视差卡片、无限跑马灯、金句逐词浮现。

## 用户已确认的决策

1. **范围**:整体换肤。页面结构与全部双语文案不动。
2. **配色**:Budarina 米白底 (#f4f4f4) + 黑色标题,但保留双轨语义色
   (郑和蓝、马可波罗橙),色值调鲜;青柠绿只用于点缀。
3. **3D**:不引入 Spline/WebGL 场景,全部用 CSS 3D 动效实现。

## 实现路径

方案 A(已选):就地改造现有 vanilla HTML/CSS/JS,零依赖、零构建,
GitHub Pages 部署方式与 data.js 双语系统原样保留。

## 具体设计

### 设计令牌
- 背景 `#f4f4f4`,卡片纯白、圆角 24px,主文字 `#111`。
- 郑和蓝:文字/标签用可读的深蓝,按钮/渐变用鲜蓝;马可波罗橙同理
  (文字保持 ≥4.5:1 对比度,亮色只用于大面积元素)。
- 青柠绿 `#cdeb8b` 仅用于 hero 公告 pill(如后续需要)。

### 字体
- 英文大标题:Archivo Black(SIL OFL 开源),woff2 latin 子集自托管于
  `fonts/`,不走 Google CDN(国内访客不卡)。
- 中文标题回退 PingFang SC / 微软雅黑,font-weight 800。
- 正文维持系统字体栈。

### 导航
悬浮胶囊:sticky + 上边距、圆角 16px、毛玻璃 backdrop-filter、细阴影。
品牌名前加 logo 方块(蓝→橙渐变发光描边)。因 renderCopy 会重写
data-copy 元素的 textContent,logo 方块必须放在 data-copy 元素外面。

### 动效
- 入场:`.reveal` 升级为 淡入 + translateY(36px) + blur(8px) 消散,
  hero 区各元素按 CSS transition-delay 交错;卡片网格
  (hero 双卡、compare 列、yiwu 三点、closing 按钮)子元素交错(JS 设 --i)。
- 3D 倾斜:鼠标跟随 rotateX/rotateY(≤8°)+ scale(1.02) + 扫光,
  应用于 .track-card 与 .service-card;仅 (hover:hover) and (pointer:fine)
  且非 reduced-motion 时启用。
- 跑马灯:hero 下方新增无限横滚关键词带,内容来自 data.js
  (marqueeItems,双语,跟随语言切换),aria-hidden 装饰性,两端渐隐遮罩。
- 金句逐词浮现:storyQuote 英文按词、中文按字拆 span,进入视口交错浮现;
  语言切换后重拆;reduced-motion 时不拆。

### 视觉
- 标题字号:hero clamp(40px, 8.5vw, 108px) 行高 0.95;section h2
  clamp(36px, 5.5vw, 64px);中文行高放宽(沿用现有 zh-CN 规则)。
- 按钮:圆角 14px 圆角矩形(非胶囊),hover scale + 阴影加深。
- 取消 section 交替底色,白卡片直接浮在米白页面上。
- manifesto 保留深色编辑式断章,文字改纯色大字。

### 不动的东西
页面结构、全部双语文案键、申请弹窗逻辑、BGM 播放器逻辑、
SEO/结构化数据/noscript、无障碍属性。

### 性能与无障碍
- 动效只用 transform/opacity/filter,不触发布局。
- `prefers-reduced-motion: reduce`:入场直接到位、跑马灯停、倾斜禁用。
- 触屏设备禁用 3D 倾斜。

### 验证
本地起静态服务,在浏览器面板检查:英文/中文、桌面/手机宽度、
reduced-motion,分别截图确认;弹窗、语言切换、BGM 回归测试。
先本地提交,用户确认截图后再 push 上线(GitHub Pages 从 main 发布)。
