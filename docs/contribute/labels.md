---
sidebar_position: 4
title: 标签与分流规则
description: CCB Issue 与 PR 的类型、状态、技术栈、模块标签，以及自动分类和维护规则。
---

# Issue 与 PR 标签规则

:::info[标签的目的]
标签不是给贡献者“打分”，而是回答四个问题：**这是什么、现在到哪一步、影响哪里、需要什么能力**。
:::

Issue 提交者通常不需要自己添加标签。先把模板填写完整，维护者和自动化会按下面的规则分流。PR 作者最重要的分类动作，是正确填写 `#### Summary` 并保持改动范围单一。

## 四个维度

| 维度 | 回答的问题 | 例子 |
|---|---|---|
| 类型 | 这是 Bug、功能、文档还是翻译？ | `bug`、`<Enhancement / Feature>`、`<Documentation>`、`Translation` |
| 状态 | 是否确认、重复、无效或需要帮助？ | `duplicate`、`invalid`、`stale`、`help wanted` |
| 技术栈 | 修改主要使用什么格式或语言？ | `[C++]`、`[JSON]`、`[Markdown]`、`[Python]` |
| 模块 | 影响游戏的哪个系统？ | `Map / Mapgen`、`Vehicles`、`NPC / Factions`、`Mods` |

一个 Issue 或 PR 可以同时拥有多个维度的标签。例如，一个车辆 JSON Bug 修复可以同时属于 `<Bugfix>`、`[JSON]` 和 `Vehicles`。

## Issue 分流

### 第一步：Bug 还是建议

- **Bug**：程序没有按当前设计工作，包括崩溃、数据丢失、明显逻辑错误和受支持操作失败。
- **功能建议**：希望改变当前设计、增加内容或提供新的交互方式。
- **问题咨询**：需要解释或更多信息，但尚未证明是代码缺陷；可使用 `question`，一般使用问题优先去社区。
- **文档问题**：规则或教程错误，可使用 `documentation`；网站问题优先进入网站仓库。

### 第二步：判断有效性和影响

Bug 至少要有可复现步骤、实际结果、期望结果和版本信息。分流优先级遵循 CCB 的 [`doc/ISSUE_TRIAGE.md`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/ISSUE_TRIAGE.md)：

1. 崩溃；
2. 存档或地图数据丢失；
3. 因 Bug 导致角色死亡或物品丢失；
4. 严重不一致或数量级错误；
5. 明显妨碍操作的 UX 问题；
6. 小型不一致、数值差异和错字。

功能建议不按 Bug 优先级排序，而检查它是否**具体、可实现、与 CCB 方向相关**。小到直接修改更省事的内容，不长期占用 Issue，直接提交 PR。

### 当前通用状态标签

| 标签 | 何时使用 | 后续动作 |
|---|---|---|
| `duplicate` | 已有相同 Issue 或 PR | 链接原讨论，把新证据合并过去 |
| `invalid` | 不成立、信息证明不是项目问题或不符合入口 | 说明原因，必要时引导到正确渠道 |
| `wontfix` | 问题成立，但项目决定不实现 | 记录设计或维护原因 |
| `stale` | 长期没有新信息或活动 | 有新证据时可恢复讨论 |
| `good first issue` | 边界清楚、风险较低、适合首次贡献 | 应提供文件或验收线索 |
| `help wanted` | 已确认且希望社区协助 | 说明需要的技能和完成标准 |
| `question` | 仍需信息或属于咨询 | 补充证据后重新分类 |

:::note[迁移后的标签一致性]
仓库的 Bug 模板和评论命令配置仍包含 `(S1 - Need confirmation)`、`(S2 - Confirmed)` 等阶段名，而迁移后 GitHub 当前可选标签未必全部包含这些名称。若自动标签没有出现，维护者应按实际标签和本页语义人工分流，不要求报告者删除或重建 Issue。
:::

## PR 的 Summary 自动分类

`.github/labeler.yml` 会读取 PR 正文和文件路径。当前 `Summary` 到标签的直接映射如下：

| Summary 分类 | 自动标签 |
|---|---|
| `Features` | `<Enhancement / Feature>` |
| `Interface` | `Info / User Interface` |
| `Mods` | `Mods` |
| `Balance` | `Game: Balance` |
| `Bugfixes` | `<Bugfix>` |
| `Performance` | `Code: Performance` |
| `Infrastructure` | `Code: Infrastructure / Style / Static Analysis` |
| `Build` | `Code: Build` |
| `I18N` | `Translation` |

`Content` 和 `None` 当前没有仅凭 Summary 添加的直接标签；它们仍可能按文件路径获得模块、`[JSON]`、`<Documentation>` 等标签。正文中出现有效英文关闭关键词和 Issue 编号时，也可能自动添加 `<Bugfix>`。

:::warning[不要为“触发标签”修改分类]
`Summary` 应描述更新日志类别，不是为了凑标签。分类正确但自动标签缺失时，由维护者修正自动化或手动加标签。
:::

## 按文件自动添加的技术标签

| 触发文件 | 标签 |
|---|---|
| `*.cpp`、`*.h` | `[C++]` |
| `*.json` | `[JSON]` |
| `*.md` | `[Markdown]`、通常还有 `<Documentation>` |
| `*.py` | `[Python]` |
| `tests/**`、`data/mods/TEST_DATA/**` | `Code: Tests` |
| `.github/**`、`utilities/**`、`tools/**` | `Code: Tooling` |
| `build-data/**`、`build-scripts/**`、Make/CMake 文件 | `Code: Build` |
| `lang/**` 或翻译相关路径 | `Translation` |
| `gfx/**`、`sound/**` | `SDL: Tiles / Sound` |
| 非测试、非核心的 `data/mods/**` | `Mods` |

## 模块标签

维护者根据 Issue 内容添加模块标签；PR 多数由文件路径自动获得。当前主要分组包括：

- **角色与世界**：`Character / World Generation`、`Scenarios`、`Spawn`、`Lore`；
- **地图与环境**：`Map / Mapgen`、`Fields / Furniture / Terrain / Traps`、`Mechanics: Weather`；
- **角色系统**：`Mutations / Traits / Professions/ Hobbies`、`Limbs`、`Bionics`；
- **战斗与物品**：`Melee`、`Martial Arts`、`Items: Ammo / Guns`、`Items: Armor / Clothing`、`Items: Containers` 等；
- **内容系统**：`Monsters`、`NPC / Factions`、`Missions`、`Vehicles`、`Crafting / Construction / Recipes`；
- **引擎与界面**：`Info / User Interface`、`Code: Performance`、`Code: Build`、`ImGui`；
- **MOD**：通用 `Mods`，以及 `Mods: Magiclysm`、`Mods: Path of Immortals` 等内置 MOD 专属标签。

完整且会随仓库变化的路径匹配表，以 [`.github/labeler.yml`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/.github/labeler.yml) 为准。

## 评论命令

仓库当前配置识别以下评论命令：

| 命令 | 预期用途 |
|---|---|
| `/confirm` | 把 Bug 标记为已确认并移除 stale |
| `/duplicate` | 标记重复 |
| `/invalid` | 标记无效 |
| `/good-first-issue` | 标记适合首次贡献 |
| `/help-wanted` | 请求社区协助 |
| PR 中的 `/retry` 或 `/rerun` | 重跑失败的 GitHub Actions 作业 |

这些命令会改变 Issue、PR 或 Actions 状态，应由维护者或确认有权限的协作者使用。执行后必须检查实际标签和工作流结果；命令文字不是审查结论的替代品。

## 新建或修改标签的规则

维护者准备新增标签时，应同时回答：

1. 它属于类型、状态、技术栈还是模块？
2. 现有标签为什么不能表达同一含义？
3. 谁负责添加和移除？
4. 是否需要在 `.github/labeler.yml`、Issue 模板或评论命令中自动化？
5. 名称、大小写和说明是否与实际 GitHub 标签完全一致？
6. 旧标签如何迁移，开放 Issue 是否需要批量更新？

避免创建只服务单个临时任务、与现有标签重叠或没有维护规则的标签。自动化引用的标签必须先在仓库中存在。

## 维护依据

- [Issue 分流原则](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/ISSUE_TRIAGE.md)
- [Issue 模板](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/tree/master/.github/ISSUE_TEMPLATE)
- [PR 标签匹配](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/.github/labeler.yml)
- [评论命令关键词](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/.github/comment-commands.yml)
- [评论命令工作流](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/.github/workflows/comment-commands.yml)
