---
sidebar_position: 1
title: MOD 制作入口
description: 选择 Lua Platform v1 行为开发或静态 JSON 内容，并把 MOD 登记到 CCB 目录。
---

# MOD 制作入口

:::info[路线档案]
**适合**：想制作 CCB MOD 的创作者　·　**前置**：会编辑文本文件　·　**最终成果**：一个能加载、验证并登记到 CCB-MOD 的 MOD
:::

CCB 当前只有一套可执行 MOD 接口：**Lua Platform v1**。新的行为、条件、效果和工作流用 Lua 编写；物品数值等静态、可校验的数据仍可使用 JSON。两种内容都不需要修改 C++ 或重新编译游戏。

| 你要做什么 | 从这里开始 |
|---|---|
| 编写行为、事件、条件、交互或 UI | [Lua Platform v1 快速上手](https://crimsoncrossbunker.github.io/CCB-Docs/api/lua/v1/overview/) |
| 添加静态物品、配方、怪物或地图数据 | [创建第一个 JSON MOD](./first-mod) |
| 找 MOD、安装 MOD | [CCB MOD 中心](/mods) |
| 登记作者仓库中的民间 MOD | [民间 MOD 登记说明](https://github.com/CrimsonCrossBunker/CCB-MOD/blob/main/docs/register.zh-Hans.md) |

## 完整学习路线

| 课程 | 你会完成 |
|---|---|
| [创建第一个 JSON MOD](./first-mod) | 选择安装位置，写出由当前代码支持的静态 `MOD_INFO` |
| [添加物品与配方](./content) | 理解 ID、引用、单位、文件拆分与查找现有例子 |
| [调试与验证](./debugging) | 使用 `--check-mods`、独立用户目录、日志和调试菜单 |
| [依赖与兼容](./compatibility) | 处理依赖、冲突、跨 MOD 交互和存档稳定性 |
| [测试与发布](./test-and-publish) | 制作发布包，说明版本与许可，满足内置 MOD 维护要求 |

## Lua、静态 JSON 和 C++ 的边界

| 需求 | 优先方案 |
|---|---|
| 新行为、条件、效果、事件和交互流程 | Lua Platform v1 |
| 只包含静态字段的物品、配方、怪物、职业和地图数据 | JSON MOD |
| 调整数值、继承现有对象、增删 flags | JSON 的 `copy-from`、`relative`、`proportional`、`extend/delete` |
| 只在另一个 MOD 启用时加载兼容内容 | `mod_interactions/<对方 mod id>/` |
| 新增当前 Platform 不支持的底层能力 | 先讨论 C++ / Lua Platform API 改动 |
| 修改渲染后端、性能热路径或系统级输入 | C++ 与平台代码 |

不要为新 MOD 使用已经移除的 Lua API v5、`game.*` 全局表、Capability Manifest 或旧 JSON 行为教程。接口细节以 CCB 的 `ccb_platform_v1.d.lua`、机器契约和测试为准。

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
