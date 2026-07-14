---
sidebar_position: 1
title: MOD 教程总览
description: 以 CCB 当前代码和 JSON 为准，从零创建、调试、兼容并发布一个 MOD。
---

# MOD 制作教程

:::info[路线档案]
**适合**：想添加物品、配方、怪物、地图、职业、对话或规则的创作者　·　**前置**：会编辑文本文件　·　**最终成果**：一个能独立加载、验证和发布的 CCB MOD
:::

CCB 的大量内容由 JSON 定义。多数 MOD 不需要修改 C++ 或重新编译游戏；游戏会扫描内置 `data/mods/`、安装目录 `mods/` 和用户目录下的 MOD，并加载其中的 `modinfo.json` 与内容 JSON。

## 完整学习路线

| 课程 | 你会完成 |
|---|---|
| [创建第一个 MOD](./first-mod) | 选择安装位置，写出由当前代码支持的 `MOD_INFO` |
| [添加物品与配方](./content) | 理解 ID、引用、单位、文件拆分与查找现有例子 |
| [调试与验证](./debugging) | 使用 `--check-mods`、独立用户目录、日志和调试菜单 |
| [依赖与兼容](./compatibility) | 处理依赖、冲突、跨 MOD 交互和存档稳定性 |
| [测试与发布](./test-and-publish) | 制作发布包，说明版本与许可，满足内置 MOD 维护要求 |

## MOD、核心数据和 C++ 的边界

| 需求 | 优先方案 |
|---|---|
| 新物品、配方、怪物、职业、场景、地图、任务、对话 | JSON MOD |
| 调整数值、继承现有对象、增删 flags | JSON 的 `copy-from`、`relative`、`proportional`、`extend/delete` |
| 只在另一个 MOD 启用时加载兼容内容 | `mod_interactions/<对方 mod id>/` |
| 新增当前 JSON 不支持的底层能力 | 先讨论 C++ / JSON API 改动 |
| 修改渲染后端、性能热路径或系统级输入 | C++ 与平台代码 |

不要先假设“这个只能改源码”。先在当前 `data/json/`、`data/mods/` 和 `doc/JSON/` 搜索相似行为；很多看似引擎级的机制已经开放为 JSON。

## 事实来源的优先级

CCB 会选择性同步上游，旧教程可能已经过时。发生冲突时按以下顺序判断：

1. **当前 CCB 代码**：加载器实际读取了什么字段；
2. **当前 CCB 内置数据**：最新版本确实加载成功的例子；
3. **当前 CCB 仓库文档**：`doc/JSON/`、`doc/MODDING.md` 等；
4. 本站教程；
5. 第三方文章、视频和旧版 CDDA 教程。

本站在关键章节直接链接 CCB `master` 文件，方便发现变化。若网站与代码不一致，请按[提交 Issue](/docs/contribute/issues)反馈页面、代码位置和当前行为。

## 仓库地图

| CCB 路径 | 用途 |
|---|---|
| `src/mod_manager.cpp`、`src/mod_manager.h` | MOD 扫描、元数据字段、分类、依赖与冲突 |
| `data/mods/dda/modinfo.json` | CCB 当前核心模组 ID 和内容路径 |
| `data/json/` | 核心游戏对象，可搜索当前字段范例 |
| `data/mods/` | 随游戏发布的 MOD 和跨 MOD 兼容范例 |
| `doc/MODDING.md` | MOD 基础与常见内容例子 |
| `doc/JSON/JSON_INFO.md` | JSON 总入口 |
| `doc/JSON/*.md` | 物品、怪物、地图、EOC、对话等专题 |
| `doc/MOD_COMPATIBILITY.md` | `mod_interactions` 规则 |
| `doc/TRANSLATING_MOD.md` | MOD gettext 提取与编译 |
| `tools/load_all_mods.sh` | 仓库内 MOD 组合加载检查 |

## 开始前准备

- 使用能显示 JSON 语法错误、UTF-8 和括号匹配的编辑器；
- 准备一份与目标 CCB 版本一致的游戏；
- 新建专用测试世界，不用重要存档试验；
- 为 MOD 选择不会与别人冲突的短 ID 前缀；
- 每增加一个小功能就加载验证，不要最后一次性排几十个错误。

:::warning[不要在发布包里覆盖核心文件]
第三方 MOD 应放在自己的目录，通过 JSON 合并、继承和兼容机制扩展游戏。直接覆盖 `data/json/` 会让更新、卸载、复现和多人协作都变得困难。
:::

从[创建第一个 MOD](./first-mod)开始。
