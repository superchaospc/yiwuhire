# foodiechina888 · The Chinese Kitchen

[打开网站](https://yiwuhire.com/) · [浏览商品](https://yiwuhire.com/#collection) · [下载旧版招募站](https://github.com/superchaospc/yiwuhire/archive/refs/tags/v1.3.1.zip)

这里是 foodiechina888 面向英文观众的中餐选品站，也是未来 foodiechina888.com 商店的公开测试版。访客可以按烹饪场景浏览商品，点击图片、品名或卡片上的说明，直接进入相应的 Amazon 美国站商品页。

## v2.0.0 商品目录

2026 年 11 月 6 日发布时共 26 件商品。

| 分类 | 件数 |
| --- | ---: |
| Cookware · 锅具与蒸具 | 2 |
| Prep tools · 备菜工具 | 4 |
| Tableware · 餐具 | 4 |
| Pantry · 调味品 | 8 |
| Cookbooks · 英文中餐食谱 | 8 |

选品考虑中餐观众的实际用途，以及商品在核对日是否进入 Amazon 美国站相关细分类前 30 名。排名会随时间变化。书卡 *A Very Chinese Cookbook* 的 “Our #1 seller of 2025” 来自本账号 2025 年 Amazon 联盟热销榜。

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
