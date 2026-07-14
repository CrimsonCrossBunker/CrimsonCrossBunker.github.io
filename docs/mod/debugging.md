---
sidebar_position: 4
title: 调试与验证
description: 使用 CCB 当前命令行参数、隔离用户目录、日志和游戏内工具定位 MOD 问题。
---

# 调试与验证

:::info[本课目标]
**完成标志**：你能区分语法、引用、加载顺序和玩法错误，并把失败缩小到一份最小 MOD 与第一条有效日志
:::

## 验证分成四层

| 层级 | 证明什么 | 工具 |
|---|---|---|
| JSON 语法 | 括号、逗号、引号能解析 | 编辑器、项目格式工具 |
| 数据加载 | 类型、字段、ID 和引用有效 | `--check-mods`、`--jsonverify` |
| 游戏行为 | 对象可生成、配方可做、机制按预期运行 | 测试世界、调试菜单 |
| 兼容与存档 | 与依赖组合、保存重载和升级正常 | 最小组合、干净安装、旧存档副本 |

只通过第一层不代表 MOD 可用；只“启动没报错”也不代表内容实际可达。

## 1. 使用隔离用户目录

不要让测试 MOD、设置和存档污染日常游戏。CCB 当前命令行支持 `--userdir`：

```bash
./cataclysm-tiles --userdir /tmp/ccb-mod-test
```

Windows 可把路径换成单独的测试文件夹。首次启动后，把 MOD 放入该用户目录的 `mods/`。这样可以明确游戏正在扫描哪份 MOD，并能随时删除整个测试环境重来。

## 2. 检查指定 MOD

CCB 当前 `src/main.cpp` 提供：

```bash
./cataclysm-tiles --check-mods survivor_toolkit
```

有多个目标时在后面继续列出 MOD ID。若 MOD 位于独立用户目录：

```bash
./cataclysm-tiles \
  --userdir /tmp/ccb-mod-test \
  --check-mods survivor_toolkit
```

`--check-mods` 的参数是 `MOD_INFO.id`，不是显示名或目录名。依赖 ID 必须可发现；成功退出后仍要进行游戏内测试。

检查整个 CCB 数据可使用：

```bash
./cataclysm-tiles --jsonverify
```

全量验证更慢，适合准备内置 MOD PR 或修改会影响大量内容的 JSON API。命令含义以当前程序 `--help`、`src/main.cpp` 和 `doc/cataclysm-tiles.6` 为准。

## 3. 从第一条有效错误开始

加载器常在一个根错误后报告大量连锁错误。按顺序排查：

1. 找最早提到当前 MOD 文件和行号的错误；
2. 检查该对象前一行的逗号、引号与括号；
3. 确认 `type` 和字段名在当前版本存在；
4. 确认引用 ID 已由核心、依赖或当前 MOD 在正确阶段加载；
5. 修复一处后重新运行，不要同时猜改十处。

常见类别：

| 错误表现 | 可能原因 |
|---|---|
| 找不到 MOD | 路径错误、文件名错误、重复 ID、扫描了另一用户目录 |
| unknown type / member | 旧教程字段、拼写或该对象类型不读取此字段 |
| invalid id | 被引用对象不存在、依赖缺失或加载顺序错误 |
| duplicate definition | ID 冲突、同一文件被重复打包、复制了核心对象 |
| dependency cycle | MOD 互相依赖，无法形成加载顺序 |
| 世界能建但内容找不到 | 没有加入生成/配方/场景入口，或解锁条件未满足 |

## 4. 查看日志

保留当前测试产生的 `debug.log`；崩溃时同时保留 `crash.log`。报告问题时附：

- CCB 版本或提交；
- MOD 版本与 `modinfo.json`；
- 完整依赖列表；
- 执行命令；
- 第一条相关错误及其前后上下文；
- 能复现的最小文件。

不要只截最后一个弹窗。日志中的前一条错误通常更接近根因。

## 5. 游戏内测试

建立只启用核心 `dda` 与目标 MOD 的世界，然后：

1. 用调试菜单生成新增物品、怪物或 NPC；
2. 检查显示名、描述、数值和交互；
3. 用正常玩法验证生成、解锁、制作、掉落或任务路径；
4. 保存并重载；
5. 离开区域使对象卸载，再返回测试加载期行为；
6. 对时间相关机制推进时间；
7. 记录预期、实际结果和重复次数。

测试怪物修改时重新生成怪物；已经保存的实例可能保留旧状态。地图生成应在未生成区域测试，旧地图块不会自动重建。

## 6. 最小化问题

出现只在大量 MOD 组合中发生的问题时：

1. 备份世界；
2. 新建测试世界确认不是存档损坏；
3. 只保留核心与目标 MOD；
4. 逐个恢复依赖或用二分法缩小组合；
5. 把触发内容缩成最小 JSON；
6. 判断是依赖声明、`mod_interactions`、ID 冲突还是核心 API 回归。

不要直接从重要存档删除大型内容 MOD来“试试看”；缺少对象可能使存档进一步损坏。

## 7. 提交前验证记录

```markdown
### Test environment
- CCB: <完整版本或提交>
- Platform: <系统与 Tiles/Terminal>
- Mods: dda, survivor_toolkit
- User dir: clean temporary directory

### Automated
- `./cataclysm-tiles --check-mods survivor_toolkit`: passed

### Manual
- New world created
- Item spawned and inspected
- Recipe completed with both component alternatives
- Save/reload passed
```

下一课：[依赖与兼容](./compatibility)
