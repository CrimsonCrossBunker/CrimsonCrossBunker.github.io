---
sidebar_position: 4
title: 翻译贡献
description: 在线翻译、校对术语，以及为开发者说明字符串提取和本地验证。
---

# 翻译贡献

:::info[两条路线]
**在线译者**不需要源码或 GitHub；**开发者**负责让新增文本具备正确上下文并进入翻译模板。
:::

## 在线译者路线

CCB 使用 [Transifex 项目](https://app.transifex.com/Cataclysm-Cleanwater-Bomb/cataclysm-cleanwater-bomb/dashboard/)协作翻译。

1. 注册 Transifex 账号并申请加入目标语言团队。
2. 先阅读项目术语、已有相似词条和上下文。
3. 从短而明确的界面文本开始，不要一次认领大量陌生机制。
4. 保留占位符、标签、换行和格式控制符。
5. 提交后关注校对反馈，在实际游戏中检查显示长度和语气。

### 翻译检查表

| 检查 | 例子 |
|---|---|
| 占位符数量与顺序不丢失 | `%s`、`%d`、`{name}` |
| 游戏标签保持原样 | `<color_red>`、变量标签 |
| 同一机制使用统一术语 | 技能、状态、身体部位、物品类别 |
| 根据上下文处理词性 | 名词、按钮动作和完整句子不能机械共用译法 |
| 不翻译内部 ID | JSON 的 `id`、枚举和文件名 |

:::warning[不要只看孤立英文]
词条可能有复数、性别、上下文或格式限制。上下文不清楚时先搜索游戏内容或请求开发者补充注释，不要靠猜测定稿。
:::

## 校对路线

校对不仅是改错字，还要检查术语一致、语气、标点、界面长度和占位符。提出修改时说明使用场景和依据，避免同一个词在多个页面来回改写。

## 开发者路线

CCB 使用 gettext 流程。当前仓库中的关键入口包括：

| 文件 | 作用 |
|---|---|
| `lang/update_pot.sh` | 更新待翻译模板 |
| `lang/extract_json_strings.py` | 从 JSON 提取可翻译文本 |
| `lang/compile_mo.sh` | 编译本地翻译供游戏加载 |
| `.github/workflows/push-translation-template.yml` | 推送模板的自动化流程 |
| `.github/workflows/build-translations.yml` | 构建翻译资源 |

新增 C++ 或 JSON 文本时，按 `doc/TRANSLATING.md` 使用正确的翻译类型、复数和上下文注释。MOD 本地化另见 `doc/TRANSLATING_MOD.md`。

```bash
cd lang
./update_pot.sh
./compile_mo.sh
```

脚本依赖和参数可能变化，执行前阅读脚本帮助与仓库工作流。提交时检查生成差异，确保没有把无关的大规模模板变化混入功能 PR。

## 完成标志

- 在线贡献：词条通过格式检查，并完成至少一次上下文复核。
- 开发贡献：新增文本能被提取，本地翻译可以编译并在游戏中显示。

需要帮助时加入[翻译贡献群或 Discord](/community)。
