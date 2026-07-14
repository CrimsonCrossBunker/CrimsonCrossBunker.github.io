---
sidebar_position: 5
title: 依赖与兼容
description: 声明 MOD 依赖和冲突，使用 mod_interactions，并保护 ID 与存档兼容性。
---

# 依赖与兼容

:::info[本课目标]
**完成标志**：加载器能确定顺序，跨 MOD 内容只在目标组合中出现，更新后旧存档不会因随意改 ID 失效
:::

## 依赖不是“推荐搭配”

`dependencies` 表示“缺少它就不能正确加载”，加载器会先加载依赖：

```json
{
  "type": "MOD_INFO",
  "id": "survivor_toolkit",
  "name": "幸存者工具箱",
  "dependencies": [ "dda", "another_required_mod" ]
}
```

- 依赖项使用对方 `MOD_INFO.id`，区分大小写；
- CCB 当前核心内容 ID 是 `dda`；
- 不要把可选联动写成硬依赖；
- 不能依赖自己，也不要形成 A → B → A 的循环；
- 发布 README 同时写出依赖名称、ID、获取位置和已验证版本。

`version` 只是信息字段，当前加载器不会根据版本字符串自动判断兼容范围。

## 声明冲突

当前 `mod_manager.cpp` 支持 `conflicts`：

```json
{
  "type": "MOD_INFO",
  "id": "survivor_toolkit",
  "name": "幸存者工具箱",
  "dependencies": [ "dda" ],
  "conflicts": [ "another_total_conversion" ]
}
```

只有两个 MOD 确实不能同时工作时才声明冲突。能通过兼容文件、独立 ID 或较小行为调整解决的问题，不应为了省维护直接互斥。

## 可选兼容：mod_interactions

CCB 当前 [`doc/MOD_COMPATIBILITY.md`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/MOD_COMPATIBILITY.md) 与加载代码支持按“另一个已启用 MOD 的 ID”动态加载目录。

假设：

- 当前 MOD：`survivor_toolkit`；
- 可选联动对象：`mindovermatter`。

目录结构：

```text
survivor_toolkit/
├── modinfo.json
├── items.json
└── mod_interactions/
    └── mindovermatter/
        └── mom_compat.json
```

`mom_compat.json` 只在 `mindovermatter` 已加载时读取。一般内容先加载，所有 MOD 的 `mod_interactions` 兼容内容随后加载。

### 精确规则

- `mod_interactions` 目录中的普通文件在第一阶段被忽略；
- 只有名字与已加载 MOD ID **完全一致**的直接子目录会加载；
- 文件可使用当前对象类型允许的继承、扩展或新定义；
- 不支持 `mindovermatter/xedra_evolved/` 这种“同时要求两个 MOD”的多层条件目录；
- 加载来源内部会组合成类似 `survivor_toolkit#mindovermatter` 的标识，因此普通 MOD ID 禁止包含 `#`。

需要三个 MOD 同时存在的联动，应重新设计为其中一个兼容层只依赖已知对象，或明确建立专门兼容 MOD；不要假装多层目录受支持。

## 避免 ID 冲突

所有自有对象使用稳定前缀：

```text
MOD ID: survivor_toolkit
对象前缀: st_

st_practice_beacon
st_recipe_group_tools
st_eoc_initialize
```

不要使用过短的 `test_item`、`new_monster`。在发布前对 CCB 核心、内置 MOD 和计划兼容的第三方 MOD 搜索相同 ID。

## 更新时保护存档

### 安全程度从高到低

1. 调整描述、显示名或不持久化的数值；
2. 给现有对象增加兼容字段；
3. 修改会影响已生成实例的数据；
4. 删除或重命名已经进入存档的 ID；
5. 移除世界依赖的整个 MOD。

修改稳定 ID 前先研究当前对象类型的迁移机制。CCB 核心有 `data/core/mod_migrations.json` 等迁移设施，但并非所有对象和第三方发布方式都有自动迁移。没有明确迁移路径时，保留旧对象为 obsolete/兼容壳，或把破坏性变化放进明确的大版本并提供操作说明。

### 测试升级路径

准备至少两份世界：

- **新世界**：验证当前版本从零加载；
- **升级世界**：用上一发布版创建并保存，再换到新版本加载。

检查角色物品、地图、车辆、任务、怪物、配方解锁和跨 MOD 对象。测试使用副本，不在唯一存档上直接升级。

## CCB 与 CDDA 的兼容边界

CCB 会同步一部分 CDDA 数据结构，但也有自有功能和 MOD API：

- 标称支持 CCB 时，以当前 CCB `master` 和发布版测试；
- 不要因为某字段在 CDDA 新版存在，就假设目标 CCB 版本已经包含；
- 也不要因为第三方 CDDA 教程未提到，就忽略 CCB 已有能力；
- 同时支持两个项目时，用各自实际加载测试证明，不只写“理论兼容”；
- CCB 专属字段应在 README 明确标记，避免 CDDA 玩家误装。

## 组合测试矩阵

| 组合 | 必测 |
|---|---|
| `dda + 当前 MOD` | 基础加载与玩法 |
| `dda + 每个硬依赖 + 当前 MOD` | 依赖顺序 |
| `dda + 可选对象 + 当前 MOD` | `mod_interactions` 内容 |
| 当前 MOD + 声明冲突对象 | 选择界面正确阻止或提示 |
| 上一版存档 + 新版 MOD | 升级兼容 |
| 干净 CCB 安装 + 发布包 | 安装说明和打包结构 |

下一课：[测试与发布](./test-and-publish)
