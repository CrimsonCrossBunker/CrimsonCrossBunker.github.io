---
sidebar_position: 2
title: 提交 Issue
description: 从检索、复现和导出存档开始，提交一份能被开发者处理的 CCB Bug 或功能建议。
---

# 提交 Issue

:::info[本课目标]
**完成标志**：维护者不用反复追问版本、存档和复现条件，就能判断问题类型并开始复现或讨论
:::

CCB 的 Issue 只在 [CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/issues) 提交。游戏 Bug 和功能建议使用不同模板；翻译、一般提问和只需直接修改的错别字有各自入口。

## 先选择正确入口

| 你遇到的情况 | 正确入口 |
|---|---|
| 游戏崩溃、存档异常、机制没有按设计工作 | [问题反馈 / Bug Report](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/issues/new?template=bug_report.yaml) |
| 想改变现有设计、增加机制或内容 | [功能建议 / Feature Request](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/issues/new?template=feature_request.yaml) |
| 在线翻译、术语或校对 | [CCB Transifex 项目](https://app.transifex.com/Cataclysm-Cleanwater-Bomb/cataclysm-cleanwater-bomb/dashboard/) |
| 能直接修复的错别字或小型 JSON 修改 | 直接提交 [PR](./pull-requests)，无需先建 Issue |
| 安装、玩法或一般使用问题 | 先到[社区](/community)提问 |
| 网站文档有误 | 到[网站仓库](https://github.com/CrimsonCrossBunker/CrimsonCrossBunker.github.io/issues)反馈或直接修改 |

:::warning[“和我预期不同”不一定是 Bug]
如果程序行为符合当前设计，而你希望它改变，这是功能建议。崩溃、数据丢失、明显违反既定规则或无法完成原本支持的操作，才更可能是 Bug。
:::

## 提交前的五项检查

1. **更新版本**：尽量在最新 CCB 测试版本复现。版本过旧的问题可能已经修复。
2. **搜索重复**：分别搜索关键词、报错文本、物品名和机制名；找到相同 Issue 时补充信息，不要重开。
3. **缩小 MOD 范围**：在备份存档后，确认问题是否由第三方 MOD 引起。能在只启用核心内容的世界复现最有价值。
4. **准备最小复现**：把存档停在“加载后按几步就出现问题”的状态，删除无关步骤。
5. **保护隐私**：上传前检查日志、路径、截图和存档文件名，不要包含令牌、密码或不愿公开的个人信息。

## Bug：按模板逐项准备

CCB 当前 Bug 模板位于仓库的 [`.github/ISSUE_TEMPLATE/bug_report.yaml`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/.github/ISSUE_TEMPLATE/bug_report.yaml)。以下字段都应具体填写。

### 1. 标题

标题写“对象 + 错误行为 + 触发条件”，不要只写“有 Bug”“救命”或整段报错。

```text
好：装填 5.56 弹匣后切换射击模式会崩溃
差：枪坏了
```

### 2. 问题描述

先用一两句话说明实际发生了什么，再说明影响。不要把原因猜测当作事实；如果你有定位线索，把它放在补充说明。

```text
实际：角色给 M4A1 装入 STANAG 弹匣后，按 F 切换射击模式，游戏立即退出。
影响：该存档中稳定复现，无法继续使用这把武器。
```

### 3. 导出存档

按当前模板提示，在游戏中打开 `ESC` 菜单，按 `d` 导出用于 GitHub 问题反馈的存档压缩包。理想的存档应满足：

- 加载后已经位于问题发生地点；
- 所需物品、角色状态和时间条件已经准备好；
- 只需执行复现步骤，不需要先走很远或等待很多天；
- 压缩包保持原样上传，不只截取单个存档文件。

如果问题与存档无关或无需存档即可稳定复现，填写 `N/A`，同时把复现步骤写得更完整。

### 4. 复现步骤

每一步只写一个动作，并从可重复的初始状态开始：

```text
1. 使用附件中的存档进入角色。
2. 打开物品栏，给 M4A1 装入 STANAG 弹匣。
3. 退出物品栏并按 F。
4. 选择“切换射击模式”。
5. 游戏退出并生成 crash.log。
```

同时注明复现频率，例如“5/5 次”“只在雨天出现”“首次加载正常，第二次加载出现”。

### 5. 期望行为

写出可以验证的结果，并说明依据：

```text
期望：武器切换到连发模式，游戏继续运行。相同武器在未装弹匣时可以正常切换。
```

### 6. 版本与配置

照模板完整提供：

- 操作系统与版本；
- CCB 游戏版本或完整 Git 提交；
- Tiles 图块版或 Terminal 终端版；
- 游戏语言；
- 已加载 MOD 的完整列表。

不要只写“最新版”。“最新版”会随时间变化，提交哈希或游戏显示的版本字符串才可追溯。

### 7. 日志、截图和补充材料

崩溃问题优先上传 `config/crash.log`、`config/debug.log` 和可复现存档。界面、贴图或地图问题附一张能看到上下文的完整截图；不要只截最后一个弹窗。

日志很长时作为文件上传，不要把几千行直接粘贴进正文。若你已经二分到某个 MOD、提交或设置，写清测试方法与结果。

## 功能建议：先描述问题，再提出方案

CCB 当前建议模板位于 [`feature_request.yaml`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/.github/ISSUE_TEMPLATE/feature_request.yaml)，核心不是“列愿望”，而是让社区判断需求、收益和实现范围。

### 必填内容

1. **问题是什么**：谁在什么场景遇到什么限制，现状为何不足。
2. **希望的方案**：描述玩家能观察到的行为，不必先写成具体代码。
3. **替代方案**：说明临时绕过方式、较小范围方案或为什么现有机制不够。
4. **补充依据**：原型图、现实资料、相似机制、数值样例或概念验证。

一个可讨论的建议应当具体、可实现并符合 CCB 方向。大型系统可以先写最小可交付阶段，不要把多个互不依赖的愿望塞进一个 Issue。

## 提交之后

- 关注 GitHub 通知，维护者询问信息时直接补充到原 Issue。
- 收到“无法复现”时，重新在最新版本验证并补充最小存档，不要只回复“我这里就是有”。
- 找到重复 Issue 时，把新证据补到原 Issue，并允许维护者关闭重复项。
- 准备自己实现时留言说明范围，再按[PR 教程](./pull-requests)建立独立分支。
- 行为或范围发生变化时编辑首帖，让后来者不用翻完整讨论才能理解结论。

Issue 的类型、状态、技术栈和模块标签见[标签与分流规则](./labels)。

## 维护依据

本页按 CCB 当前仓库的 [`ISSUES.md`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/ISSUES.md)、[Issue 分流说明](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/ISSUE_TRIAGE.md)和 [Issue 模板](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/tree/master/.github/ISSUE_TEMPLATE)编写。字段发生冲突时，以 GitHub 新建 Issue 页面实际显示的模板为准。
