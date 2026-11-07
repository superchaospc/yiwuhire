# foodiechina888 kitchen store · 公开测试站

[测试站](https://yiwuhire.com/) · [正式站](https://foodiechina888.com/) · [当前 Release](https://github.com/superchaospc/yiwuhire/releases/tag/v2.2.2)

这个仓库发布到 yiwuhire.com。正式站使用独立仓库，只有站主明确要求同步某项改动时，才将该改动应用到 foodiechina888.com。

## v2.2.1 测试版设计

首页恢复暖色宽幅频道插画、双色标题和蓝色购物按钮。商品区采用浅灰背景、白色卡片和下划线分类导航。该设计已于 2026 年 11 月 6 日按站主要求同步至[正式站 v2.1.0](https://github.com/superchaospc/foodiechina888/releases/tag/v2.1.0)。

## 2026-11-07 测试版改版（未同步正式站）

整页改为暖色调：米白底、棕红主按钮，导航与商品区统一暖灰。商品卡改为等高布局，图片放在统一的 1:1 浅色底框里，描述限 3 行，底部加 “View on Amazon →”，Best seller 改成压在图上的胶囊标签。“全部”视图按类目分段加小标题，分类栏滚动时吸顶。商品区标题下和页脚加入 Amazon Associates 声明。“Buy me a coffee” 从首屏移到 The lore 区。样式与脚本链接带版本号，避免更新后读到旧缓存。

## 商品目录

页面按顺序展示中餐食谱、锅具、刀具、蒸具、空气炸锅、备菜工具、餐具和调味品。每类 4 件，共 32 件。每组第一件标为 **Best seller**。桌面按类目排成四列，手机可横滑分类按钮。点击整张商品卡即可进入 Amazon 商品页。

## 维护与预览

- [index.html](index.html) 包含商品、分类、品牌主页与社交链接。增删商品时同步更新默认显示的商品总数。商品卡链接使用对应的 ASIN 和联盟标识 `weichaoshen-20`，图片使用对应 Amazon 商品主图或图书封面。
- [kitchen/shop.css](kitchen/shop.css) 控制桌面与手机布局，[kitchen/shop.js](kitchen/shop.js) 处理分类筛选及筛选后的计数。头像和首页品牌插画来自 [foodiechina888 品牌仓库](https://github.com/superchaospc/foodiechina888)。
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
