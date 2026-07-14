---
sidebar_position: 3
title: 提交 Pull Request
description: 从 Fork、分支和提交开始，完整填写 CCB PR 模板、运行验证并完成审查。
---

# 提交 Pull Request

:::info[本课目标]
**完成标志**：PR 只解决一个问题，目标分支正确，`Summary`、测试记录与 Issue 关联完整，CI 和审查可以顺利进行
:::

CCB 的代码、JSON、内置 MOD、构建脚本和游戏文档都通过 [CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb) 的 Pull Request 合入。第一次贡献不需要组织写权限：Fork 后从自己的仓库提交即可。

## 0. 开始前确认

- 改动符合项目许可，你有权提交全部内容并保留必要署名。
- CCB 当前贡献规范不接受没有明确人类作者归属的 LLM 生成内容。
- 一个 PR 只处理一个问题及其必要测试、文档和迁移。
- 大型设计、破坏兼容性的修改或新内置 MOD 先通过 Issue 或社区确认范围。
- 从最新 `master` 开始，不在个人 `master` 上混入多个任务。

## 1. Fork、克隆和远端

在 GitHub 打开 CCB 仓库，点击 **Fork**。然后克隆你的 Fork：

```bash
git clone https://github.com/<你的账号>/Cataclysm-Cleanwater-Bomb.git
cd Cataclysm-Cleanwater-Bomb
git remote add upstream https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb.git
git remote -v
```

约定：

- `origin`：你的 Fork，可以推送；
- `upstream`：CCB 官方仓库，只用于获取最新 `master`。

## 2. 更新主分支并建立任务分支

```bash
git switch master
git pull --ff-only upstream master
git push origin master
git switch -c fix/clear-short-name
```

分支名应简短表达任务，例如 `fix/android-input-crash`、`content/add-river-tools`。不要直接从陈旧分支开始，也不要在一个分支连续提交多个无关 PR。

## 3. 修改时控制范围

随时检查：

```bash
git status -sb
git diff
```

- JSON 字段先在当前 `data/json/` 或 `data/mods/` 找仍被加载的例子。
- C++ 遵循 `doc/c++/CODE_STYLE.md`，JSON 遵循 `doc/JSON/JSON_STYLE.md`。
- 修改玩家可见行为时同步测试和必要文档。
- 不顺手格式化整个文件或提交编辑器缓存、构建产物、存档和日志。
- 移植其他分支的提交时保留原作者信息和提交历史。

## 4. 提交可审查的 Commit

只暂存本任务文件：

```bash
git add path/to/file1 path/to/file2
git diff --cached
git commit
```

提交标题用祈使语气说明结果，正文解释“为什么”。仓库的 `.gitmessage` 建议标题约 50 字符、最长不超过 72 字符，并在正文关联 Issue。

```text
Fix magazine mode switching crash

Validate the active magazine before resolving fire modes.

Fixes #123
```

审查前可以有多个有意义的提交；不要为了“看起来干净”把完全不同的逻辑塞进一个提交。

## 5. 按改动类型验证

| 改动类型 | 最低验证 |
|---|---|
| Markdown / 文本 | 链接、格式、拼写和相关文档构建 |
| JSON 内容 | 项目 JSON 格式、`--check-mods` 或游戏加载、调试菜单与正常玩法 |
| C++ 逻辑 | 受影响目标编译、相关单元测试、修改前后游戏内复现 |
| UI / 输入 / 图形 | 对应后端构建、实际交互、截图或录屏；必要时多平台 |
| 构建 / CI | 本地等价命令、受影响平台矩阵与失败边界 |
| 翻译基础设施 | 字符串提取、模板差异、目标语言编译和游戏内显示 |

常用 Make 入口包括：

```bash
make -j4
make -j4 check
make json-check
make astyle-check
```

这些命令并非每个 PR 都必须全部运行。选择能覆盖风险的检查，并在 PR 中准确记录命令与结果；不要声称运行了没有运行的测试。更完整的游戏内测试方法见 CCB 的 [`doc/TESTING_YOUR_CHANGES.md`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/TESTING_YOUR_CHANGES.md)。

## 6. 推送并创建 PR

```bash
git push -u origin fix/clear-short-name
```

在 GitHub 创建 Pull Request 时确认：

- **base repository**：`CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb`；
- **base branch**：`master`；
- **head repository**：你的 Fork；
- **compare branch**：本任务分支。

尚未完成但希望提前讨论时创建 **Draft PR**。只有代码、描述和验证都已准备好时再点击 **Ready for review**。

## 7. 正确填写 PR 模板

仓库当前模板位于 [`.github/pull_request_template.md`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/.github/pull_request_template.md)。保留所有 `####` 标题。

### Summary：必须精确一行

```markdown
#### Summary
Bugfixes "修复装入弹匣后切换射击模式导致的崩溃"
```

可选分类及用途：

| 分类 | 使用场景 |
|---|---|
| `Features` | 新增玩家能做或能经历的机制 |
| `Content` | 新物品、怪物、地点、载具等内容 |
| `Interface` | 菜单、输入、显示和交互流程 |
| `Mods` | 内置 MOD 内容或 MOD 能力 |
| `Balance` | 数值、成本、收益和系统配合 |
| `Bugfixes` | 修复原本不符合设计的行为 |
| `Performance` | 行为不变但减少耗时或资源 |
| `Infrastructure` | 重构、工具、静态分析和维护设施 |
| `Build` | 编译、打包、依赖和平台构建 |
| `I18N` | 本地化能力和翻译基础设施 |
| `None` | 不进入更新日志的微小修改或文档调整；不加引号和描述 |

分类语义以仓库的 [Changelog Guidelines](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/CHANGELOG_GUIDELINES.md) 为准。

### Purpose of change

写明现状、影响和目标。若 PR 完全解决 Issue，使用 GitHub 识别的英文关闭关键词：

```markdown
Fixes #123
```

可用 `close/closes/closed`、`fix/fixes/fixed`、`resolve/resolves/resolved`。中文“修复 #123”不会自动关闭 Issue。

### Describe the solution

说明关键数据流、行为变化、兼容处理和有意不做的范围。不要只写“修了”或逐行复述 diff。

### Describe alternatives you've considered

列出考虑过的其他方案、为何不采用，以及未来可以继续的方向。小修复也可写“未考虑其他方案”，并说明原因。

### Testing

记录可复查的命令和手动步骤：

```markdown
- `make -j4 TILES=1`：通过
- `tests/cata_test "[magazine]"`：通过
- 加载附件存档，重复切换半自动/连发 10 次：未崩溃
- Windows 11，Tiles，提交 abcdef1
```

### Additional context

放截图、性能数据、迁移说明、已知限制或后续任务链接。不要把关键验收条件只放在这里。

## 8. 处理 CI 和审查

1. 先打开失败检查，定位第一条属于当前改动的有效错误。
2. 在本地复现，修改后重新运行相关验证。
3. 推送到同一分支，PR 会自动更新，不要关闭重开。
4. 回复审查时说明改了什么、在哪个提交、如何验证；不认同建议时给出代码或行为依据。
5. 修改范围后同步更新 PR 首帖和测试记录。
6. 所有讨论解决、CI 通过后，由有合并权限的维护者完成合并。

如果官方 `master` 在审查期间前进：

```bash
git fetch upstream
git rebase upstream/master
git push --force-with-lease
```

只对自己的功能分支使用 `--force-with-lease`；不要对共享分支或官方分支普通强推。

## 9. 合并之后

- 确认关联 Issue 已正确关闭或更新。
- 删除个人功能分支，不删除仍被其他 PR 使用的分支。
- 若玩家需要迁移、发布说明或文档更新，确认它们已经一并完成。
- CI 通过不等于实际行为必然正确；收到回归反馈时继续在原 Issue 或新 Issue 跟进。

## 常见退回原因

- `Summary` 缺失、分类拼错或不止一行；
- PR 同时包含多个无关改动；
- 没有复现步骤或测试只写“应该可以”；
- 修改 `.po/.pot`，但没有说明为何绕过 Transifex 自动流程；
- JSON 只通过语法检查，没有实际加载；
- 从旧 `master` 开发，混入大量上游差异；
- 粘贴他人或 LLM 内容，没有可接受的作者与许可来源。

PR 标签如何由 `Summary` 和文件路径自动添加，见[标签与分流规则](./labels)。
