---
sidebar_position: 3
title: 添加物品与配方
description: 用当前 CCB 数据中的真实字段建立物品、配方、ID 引用和可维护目录。
---

# 添加物品与配方

:::info[本课目标]
**完成标志**：MOD 通过加载检查，调试菜单能生成“练习信标”，制作菜单能找到并完成对应配方
:::

本课只建立一个小而完整的垂直切片：一个物品、一条配方和一次游戏内验证。掌握 ID 与引用后，怪物、职业、地图、对话和 EOC 也遵循相同的“查当前例子—少量修改—立即加载”循环。

## 1. 先研究当前数据

不要从记忆猜字段。进入与目标版本一致的 CCB 源码目录，先搜索：

```bash
rg -n '"type": "GENERIC"' data/json data/mods
rg -n '"id": "plastic_chunk"|"id": "scrap"' data/json
rg -n '"subcategory": "CSC_OTHER_OTHER"' data/json/recipes data/mods
```

这三个搜索分别确认：

- 当前 `GENERIC` 物品的写法；
- 配方组件 `plastic_chunk` 和 `scrap` 仍存在；
- 配方分类 `CSC_OTHER_OTHER` 仍被当前数据使用。

再阅读：

- [`doc/JSON/ITEM.md`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/JSON/ITEM.md)
- [`doc/JSON/ITEM_CRAFT_AND_DISASSEMBLY.md`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/doc/JSON/ITEM_CRAFT_AND_DISASSEMBLY.md)
- 同目录中一个最接近目标行为、仍由当前游戏加载的对象。

## 2. 拆分文件

```text
survivor_toolkit/
├── modinfo.json
├── items.json
└── recipes.json
```

加载器会递归读取 MOD 内容目录中的 JSON，文件名不决定对象类型。按功能拆分只是为了让搜索、审查和排错更容易；不要把数千行互不相关的对象全部放进 `modinfo.json`。

## 3. 添加物品

在 `items.json` 写入：

```json
[
  {
    "type": "GENERIC",
    "id": "st_practice_beacon",
    "name": { "str": "练习信标" },
    "description": "一个用于验证 MOD 是否正确加载的简单信标。",
    "weight": "250 g",
    "volume": "250 ml",
    "material": [ "plastic" ],
    "symbol": "!",
    "color": "light_cyan"
  }
]
```

### 字段为什么这样写

| 字段 | 说明 |
|---|---|
| `type` | 决定使用哪个加载器；`GENERIC` 是没有工具、食物或护甲专用行为的普通物品 |
| `id` | 其他对象引用的稳定标识；`st_` 是本 MOD 前缀 |
| `name` | 可翻译名称对象；不要把内部 ID 当作显示名 |
| `description` | 玩家检查物品时看到的说明 |
| `weight`、`volume` | 使用当前代码支持的带单位字符串 |
| `material` | 引用当前材料 ID；它会影响燃烧、耐久等行为 |
| `symbol`、`color` | Terminal 显示与无贴图回退 |

### ID 规则

- 给全部自有 ID 使用一致短前缀，例如 `st_`；
- 只使用 ASCII 字母、数字和下划线最稳妥；
- 发布后不要仅为“更好看”修改 ID，存档和其他 MOD 可能已经引用；
- 显示名可以翻译或调整，ID 不应该跟着翻译；
- 引用不存在或重复定义时，优先修复第一条加载错误。

## 4. 添加配方

在 `recipes.json` 写入：

```json
[
  {
    "type": "recipe",
    "result": "st_practice_beacon",
    "category": "CC_OTHER",
    "subcategory": "CSC_OTHER_OTHER",
    "skill_used": "fabrication",
    "difficulty": 0,
    "time": "5 m",
    "autolearn": true,
    "components": [
      [ [ "plastic_chunk", 1 ] ],
      [ [ "scrap", 1 ] ]
    ]
  }
]
```

### 读懂 components 的嵌套

`components` 最外层的每一项都必须满足；同一项内是可以替代的方案。

```json
{
  "components": [
    [ [ "plastic_chunk", 1 ], [ "plastic_sheet", 1 ] ],
    [ [ "scrap", 1 ] ]
  ]
}
```

上例表示“一个塑料块**或**一张塑料片”再加“一块废金属”。不要随意删掉括号层级，否则语义会从“且”变成“或”，或直接无法解析。

### 配方字段检查

- `result` 必须引用已加载物品；
- `category` 和 `subcategory` 必须是当前制作菜单中的有效 ID；
- `skill_used` 引用技能 ID；
- `time` 使用时间单位；
- `autolearn: true` 适合教学；正式内容应评估解锁条件和技能等级；
- 组件 ID 与数量必须真实存在且符合预期单位。

## 5. 加载后实际验证

1. 运行[命令行 MOD 检查](./debugging)。
2. 新建只启用 `dda` 与 `survivor_toolkit` 的世界。
3. 使用调试菜单的“生成物品”搜索 `st_practice_beacon`。
4. 检查名称、说明、重量、体积、材质、符号和颜色。
5. 给角色塑料块和废金属，打开制作菜单搜索“练习信标”。
6. 完成制作，确认耗时与材料消耗符合定义。
7. 保存、退出、重新加载，确认物品仍可读取。

“能在调试菜单生成”只证明物品加载；“配方能显示并完成”才覆盖了配方分类、解锁、组件与结果引用。

## 6. 从一个对象扩展到完整 MOD

| 想添加 | 当前文档入口 | 建议先搜索 |
|---|---|---|
| 食物、工具、枪械、护甲 | `doc/JSON/ITEM.md` 及物品专题 | 同 `type`、相似现有物品 ID |
| 怪物与怪物组 | `doc/JSON/MONSTERS.md` | `data/json/monsters/` |
| 地图与建筑 | `doc/JSON/MAPGEN.md` | `mapgen`、`overmap_special` |
| 职业与场景 | `doc/JSON/JSON_INFO.md` 对应章节 | 当前 `profession`、`scenario` |
| 对话、任务、EOC | NPC、Mission、EOC 专题 | 当前 talk topic、mission、EOC ID |
| 修改现有对象 | `doc/JSON/JSON_INHERITANCE.md` | `copy-from`、`relative`、`extend` |

:::warning[不要整份复制核心对象]
为了改一个字段而复制完整核心对象，会冻结旧值并制造兼容负担。当前类型支持继承或增量修改时，优先只表达差异；如果加载器不支持，再依据当前代码选择方案。
:::

## 7. 翻译与文本

内置 CCB 内容以项目当前翻译规则为准。第三方 MOD 若需要多语言：

- 为可翻译字段使用对应类型支持的翻译对象；
- 为歧义文本添加 `//~` 上下文；
- 保留占位符、颜色标签和变量；
- 按 `doc/TRANSLATING_MOD.md` 提取 `.pot`、维护 `.po` 并编译 `.mo`；
- 不把普通 MOD 翻译混入 CCB 主项目的 Transifex 资源。

下一课：[调试与验证](./debugging)
