---
sidebar_position: 5
title: 提交贡献
description: 整理提交、同步主分支、填写验证记录并响应审查。
---

# 提交贡献

:::info[本课目标]
**完成标志**：PR 只包含目标改动，CI 可理解，审查者能按描述复现验证
:::

## 提交前检查

- `git diff` 中没有调试输出、临时文件或无关格式变化。
- 改动遵循根目录 `CONTRIBUTING.md` 和邻近代码风格。
- 运行了与改动风险匹配的构建、测试和格式检查。
- 用户可见行为、文档或迁移需求已经同步处理。

## 同步最新主分支

```bash
git fetch upstream
git rebase upstream/master
```

解决冲突后重新运行相关验证。已经推送过的个人功能分支可用 `git push --force-with-lease` 更新；不要对其他人共享的分支使用普通强制推送。

## PR 描述

CCB 的当前贡献规范要求 PR 包含 `Summary`。同时写清目的、实现方式与实际完成的测试；不要声称运行了没有运行的检查。

```markdown
#### Summary
Bugfixes "修复……"

#### Purpose of change
描述用户问题或维护需求。

#### Describe the solution
描述关键行为和必要取舍。

#### Testing
- 本地构建命令
- 自动测试结果
- 游戏内复现步骤与结果
```

类别和模板可能更新，提交前以仓库当前 `CONTRIBUTING.md` 和 PR 模板为准。

第一次提交或需要 Fork、关闭关键词、Draft、CI 与 rebase 的逐步说明时，阅读[完整 PR 提交教程](/docs/contribute/pull-requests)。自动分类与模块标签见[标签与分流规则](/docs/contribute/labels)。

## 审查与 CI

把 CI 失败分成两类：由当前改动引起的失败应修复；基础设施或主分支已有问题应提供证据并说明。响应审查时优先更新代码或解释设计依据，不要只回复“已改”而不给出改动位置和验证。

## 上游同步任务

同步 CDDA 改动是维护工作，不是普通功能开发的必需步骤。执行同步时应按 CCB 维护者确定的范围和分组进行，保留 CCB 有意差异，并分别验证冲突解决后的构建与行为。
