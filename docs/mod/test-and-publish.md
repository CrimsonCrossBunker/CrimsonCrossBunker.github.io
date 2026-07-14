---
sidebar_position: 6
title: 测试与发布
description: 完成验证矩阵、README、许可、干净发布包，以及申请进入 CCB 内置 MOD。
---

# 测试与发布

:::info[本课目标]
**完成标志**：发布包在干净 CCB 中按 README 一次安装成功，命令行检查和实际玩法通过，依赖、版本、许可与反馈入口完整
:::

## 发布前总检查

### 自动与加载

- [ ] JSON 使用项目风格，没有编辑器自动重排无关内容；
- [ ] `--check-mods <mod id>` 成功；
- [ ] 每个硬依赖可发现，没有循环依赖；
- [ ] 最小 `dda + 当前 MOD` 世界可创建；
- [ ] 所有 `mod_interactions` 组合分别测试；
- [ ] `debug.log` 没有由当前 MOD 引起的错误。

### 游戏行为

- [ ] 新物品、怪物和 NPC 能通过调试菜单生成；
- [ ] 配方、生成、地图、任务或解锁能通过正常玩法到达；
- [ ] 保存、退出和重载后状态正确；
- [ ] 时间、地图加载或怪物实例相关行为用新实例/新区块测试；
- [ ] 上一发布版存档副本可以升级，或 README 明确说明不兼容。

### 发布质量

- [ ] `modinfo.json` 的作者、维护者、版本、依赖、冲突和分类准确；
- [ ] README 写明只支持 CCB 还是也支持 CDDA；
- [ ] 许可证允许分发全部代码、文本和素材；
- [ ] 没有存档、日志、缓存、令牌、绝对路径或整个游戏本体；
- [ ] 压缩包解压后不会多套一层错误目录；
- [ ] 在一份干净游戏中完全按公开 README 重装过。

## 推荐发布结构

```text
survivor_toolkit/
├── modinfo.json
├── items.json
├── recipes.json
├── mod_interactions/
├── lang/
├── README.md
├── CHANGELOG.md
└── LICENSE
```

不是每个 MOD 都需要兼容目录、翻译或独立更新日志，但 `modinfo.json`、内容、README 和许可应当齐全。

## README 必须让陌生玩家完成安装

建议包含：

1. **MOD 做什么**：一句话定位和详细范围；
2. **支持版本**：CCB 发布号、测试日期或提交，不写含糊的“最新版”；
3. **安装**：压缩包内哪一层放进哪个 `mods/`；
4. **启用**：新世界还是旧世界、需要哪些依赖；
5. **兼容**：冲突、可选联动、CCB 专属字段；
6. **升级与卸载**：是否需要迁移，能否从存档安全移除；
7. **已知限制**：不支持的组合和未完成内容；
8. **反馈**：Issue 地址、应附日志与存档；
9. **作者与许可**：代码、文本、图片、音频分别说明来源；
10. **验证记录**：测试过的平台与组合。

## 版本与更新日志

`MOD_INFO.version` 不会被加载器比较，所以版本策略由作者维护。推荐使用清晰、可排序的版本，并在发布页说明：

- 新内容；
- Bug 修复；
- 兼容或依赖变化；
- 存档迁移要求；
- 已删除或重命名的 ID；
- CCB 基线变化。

破坏旧存档或依赖的更新必须醒目标出，不要只埋在提交记录里。

## 许可与素材

发布者必须有权分发每个文件。README 或许可证中分别记录：

- 自己创作的代码和文本；
- 移植内容的原作者、来源提交和许可；
- 图片、音效与字体的作者和许可；
- 修改后的素材是否要求相同方式共享；
- 第三方依赖是否需要附带许可证文本。

“网上找到的”“AI 生成的”“朋友发的”都不是完整来源说明。准备向 CCB 主仓库贡献时，还必须满足 CCB 当前贡献和 CC-BY-SA 3.0 要求。

## 发布后维护

- 保留可复现的旧发布包和更新日志；
- 用 Issue 模板要求版本、依赖、日志和最小存档；
- CCB 更新后先跑加载检查，再宣布兼容；
- ID、依赖或安装路径变化时同步 README；
- 暂停维护时公开说明，并允许社区接手或 Fork。

## 申请进入 CCB 内置 MOD

随游戏发布的 MOD 位于 `data/mods/`，会增加全项目 CI、发布和长期兼容负担。先阅读 CCB 当前 [`doc/IN_REPO_MODS.md`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/IN_REPO_MODS.md)。

### 基本条件

- 有明确的维护者/curator，并在 `maintainers` 使用真实 GitHub 用户名；
- 内容有清晰主题和设计边界，不是无目标的“杂物包”；
- 依赖也在仓库内，并获得依赖维护者认可；
- 有测试、文档、许可和持续响应 Bug/审查的计划；
- 接受进入仓库后其他贡献者也可以改进内容；
- 不保证核心开发者替无人维护的 MOD 长期修复。

### 内置 MOD 维护者责任

- 判断新内容是否符合 MOD 设计；
- 至少回应相关 Bug，不要求独自修复全部问题；
- 对进入该 MOD 的 PR 进行 Approve 或 Request Changes；
- 跟进核心 JSON API 变化；
- 长期无法维护时明确交接。

无人维护、持续造成维护负担或用途已经消失的 MOD 可能被标为 `obsolete`，从新世界选择列表移除。修改其他内置 MOD 的 modmod 仍要有独立目标和维护者，并按当前规则放入 `rebalance` 分类。

## 提交内置 MOD PR

1. 从最新 CCB `master` 建立独立分支；
2. 把目录放入 `data/mods/<mod>/`；
3. 运行指定 MOD 检查和仓库级 JSON/组合检查；
4. 添加 README、许可、维护者和必要测试；
5. PR `Summary` 使用 `Mods "..."`；
6. 在 Purpose 中说明设计目标、为何适合内置、维护计划和依赖批准；
7. 在 Testing 中列出新世界、升级世界和组合矩阵；
8. 按[完整 PR 教程](/docs/contribute/pull-requests)提交。

路径审查人会按游戏仓库当前 `.github/reviewers.yml` 自动请求；没有自动分配时，在 PR 中说明目标模块和建议审查者，不要反复私信催促。

## 维护依据

- [MOD 基础](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/MODDING.md)
- [内置 MOD 规则](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/IN_REPO_MODS.md)
- [MOD 兼容加载](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/MOD_COMPATIBILITY.md)
- [MOD 翻译](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/TRANSLATING_MOD.md)
- [测试修改](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/TESTING_YOUR_CHANGES.md)
