---
sidebar_position: 3
title: 添加物品与配方
description: 通过可复查的 JSON 示例理解 ID、引用、单位和文件拆分。
---

# 添加物品与配方

:::info[本课目标]
**耗时**：约 30 分钟　·　**完成标志**：调试菜单能生成“练习信标”，制作菜单能找到对应配方
:::

把不同类型拆进独立文件，便于搜索和排错：

```text
survivor_toolkit/
├── modinfo.json
├── items.json
└── recipes.json
```

## 添加物品

在 `items.json` 中写入一个简单物品：

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

ID 加上 MOD 专属前缀可以降低冲突概率。物理量使用带单位字符串，不要复制古老教程里的裸数字写法。

## 添加制作配方

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

`result` 和组件使用其他对象的 ID。引用不存在时，游戏加载通常会直接报错，因此一次只增加少量对象并频繁测试。

## 从现有内容学习

- 物品字段：`doc/JSON/ITEM.md`
- 制作与拆解：`doc/JSON/ITEM_CRAFT_AND_DISASSEMBLY.md`
- 怪物：`doc/JSON/MONSTERS.md`
- 地图生成：`doc/JSON/MAPGEN.md`
- 对话和任务：在 `doc/JSON/` 中查找对应专题

:::tip[优先搜索，而不是猜字段]
在 CCB 仓库中用对象 `type`、字段名或相似物品 ID 搜索。一个当前仍在加载的例子，通常比旧博客更可靠。
:::

下一课：[测试与发布](./test-and-publish)
