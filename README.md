# foodiechina888 kitchen store · 公开测试站

[测试站](https://yiwuhire.com/) · [正式站](https://foodiechina888.com/) · [当前 Release](https://github.com/superchaospc/yiwuhire/releases/tag/v2.3.0)

这个仓库发布到 yiwuhire.com。正式站使用独立仓库，只有站主明确要求同步某项改动时，才将该改动应用到 foodiechina888.com。

## v2.3.0 测试版设计

- **暖色调**：整页改用米白底和暖灰商品区，主按钮改为棕红色，与首屏插画同一色系。
- **等高商品卡**：每张图放在统一的 1:1 浅色底框里，描述最多 3 行，卡片右下角是一个圆形箭头按钮。页面上除必需的联盟声明外不出现 Amazon 字样。Best seller 改为压在图片左上角的白色胶囊标签。
- **分类分段**：“全部”视图按类目加小标题；分类栏在滚动时吸顶，筛选单一类目时隐藏小标题。
- **联盟声明**：商品区标题下和页脚都写明 “As an Amazon Associate I earn from qualifying purchases.”
- **咖啡打赏**：首屏只保留购物按钮。“Buy me a coffee” 放在 The lore 区；右下角另有咖啡杯浮动按钮，滚过首屏后出现，回到首屏或到达 The lore 区时隐藏，手机上只显示圆形图标。
- **缓存**：样式和脚本链接带 `?v=` 版本号，避免访客读到旧文件。

该设计已于 2026 年 11 月 7 日按站主要求同步至[正式站 v2.2.0](https://github.com/superchaospc/foodiechina888/releases/tag/v2.2.0)。上一版设计见 [v2.2.1](https://github.com/superchaospc/yiwuhire/releases/tag/v2.2.1)（蓝色购物按钮、浅灰商品区与白色卡片）。

## 商品目录

页面按顺序展示中餐食谱、锅具、刀具、蒸具、空气炸锅、备菜工具、餐具和调味品。每类 4 件，共 32 件。每组第一件标为 **Best seller**。桌面按类目排成四列，手机可横滑分类按钮。点击整张商品卡即可进入 Amazon 商品页。

## 维护与预览

- [index.html](index.html) 包含商品、分类、品牌主页与社交链接。增删商品时同步更新默认显示的商品总数。商品卡链接使用对应的 ASIN 和联盟标识 `weichaoshen-20`，图片使用对应 Amazon 商品主图或图书封面。
- [kitchen/shop.css](kitchen/shop.css) 控制桌面与手机布局，[kitchen/shop.js](kitchen/shop.js) 处理分类筛选、计数和咖啡杯按钮的显示时机。修改这两个文件后，把 index.html 里两处 `?v=` 版本号一起更新。头像和首页品牌插画来自 [foodiechina888 品牌仓库](https://github.com/superchaospc/foodiechina888)。
- 从仓库根目录运行 `python3 -m http.server 8000`，在浏览器打开 `http://localhost:8000/` 即可预览。GitHub Pages 从 `main` 分支的根目录发布到 [yiwuhire.com](https://yiwuhire.com/)。

## 旧版 yiwuhire 招募站备份

[旧版 Release v1.3.1](https://github.com/superchaospc/yiwuhire/releases/tag/v1.3.1) 和[备份分支](https://github.com/superchaospc/yiwuhire/tree/backup/pre-foodie-kitchen-20261106) 均指向旧站最后一次上线的提交 `98b751516abe157b571b5e552a8e1e50f2f90dc7`。源码包包含原首页、招募内容、脚本、字体、音乐和 Logo 素材。

要单独查看或继续开发旧版，在仓库根目录执行：

```sh
git fetch origin --tags
git worktree add -b restore/yiwuhire-v1.3.1 ../yiwuhire-v1.3.1 v1.3.1
cd ../yiwuhire-v1.3.1
python3 -m http.server 8001
```

打开 `http://localhost:8001/` 即可查看旧站。恢复工作位于独立分支，方便先预览再决定是否上线。
