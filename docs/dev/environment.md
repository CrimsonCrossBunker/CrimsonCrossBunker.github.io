---
sidebar_position: 2
title: 准备开发环境
description: 安全建立 fork、远程仓库、功能分支和编辑器基础配置。
---

# 准备开发环境

:::info[本课目标]
**完成标志**：`git status` 显示你位于独立功能分支，并能正常读取 CCB 仓库
:::

## Fork 与克隆

在 GitHub Fork CCB 后克隆自己的仓库，并把官方仓库设置为 `upstream`：

```bash
git clone https://github.com/<你的账号>/Cataclysm-Cleanwater-Bomb.git
cd Cataclysm-Cleanwater-Bomb
git remote add upstream https://github.com/LYHGLYTX/Cataclysm-Cleanwater-Bomb.git
git fetch upstream
```

确认 `origin` 指向你的 fork，`upstream` 指向 CCB 官方仓库。

## 每个任务一个分支

```bash
git switch master
git pull --ff-only upstream master
git switch -c fix/short-description
```

不要直接在 `master` 上开发，也不要把互不相关的修复塞进同一分支。

## 先读这些文件

- 根目录 `CONTRIBUTING.md`：当前贡献要求和 PR 约定。
- `doc/c++/COMPILING*.md`：各平台的权威依赖和构建步骤。
- `.editorconfig`、`.astylerc`、`.clang-tidy`：格式与静态检查配置。
- 相关目录下的文档与邻近测试。

## 编辑器

仓库提供 VS Code 工作区和 Sublime Text 工程配置。无论使用何种编辑器，都应启用 EditorConfig，并让 C++ 工具使用项目实际的编译参数；不要让编辑器自动重排未修改的整个文件。

下一课：[编译游戏](./build)
