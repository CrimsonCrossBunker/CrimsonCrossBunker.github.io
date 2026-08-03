# CCB 文档与社区站点

Cataclysm: Cleanwater Bomb（CCB）的官方文档与社区网站，基于 [Docusaurus](https://docusaurus.io/) 构建，部署于 GitHub Pages。

## 站点内容

- **新人教程** — 从下载安装到活过第一天
- **开发者教程** — 从源码编译、贡献代码流程
- **双语开发文档** — [CCB-Docs](https://crimsoncrossbunker.github.io/CCB-Docs/) 提供架构、API 与贡献者参考
- **贡献指南** — 代码 / 像素图 / 翻译 / 内容四种贡献方式
- **开发路线** — 项目愿景与当前进度
- **工作状态** — 开发日志与上游同步记录
- **社区** — Discord、Reddit、QQ 群
- **游戏资料指南** — 搜索 CCB 最新版本的物品、怪物、配方与地形数据

## 本地开发

```bash
npm install
npm start
```

启动后在浏览器打开 http://localhost:3000/，大部分改动会实时刷新。

## 验证

```bash
npm test
npm run test:navigation
npm run build
```

仓库当前没有单独的 lint 脚本；Pull Request CI 会运行上述测试和生产构建。

## 构建

```bash
npm run build
```

静态文件输出到 `build/` 目录。

## 部署

站点通过 `gh-pages` 分支发布到 GitHub Pages：

```bash
npm run deploy
```

需要提前配置好 Git SSH 或设置 `GIT_USER` 环境变量。
