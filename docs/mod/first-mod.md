---
sidebar_position: 2
title: 创建第一个 MOD
description: 建立最小目录和 modinfo.json，让 CCB 识别你的模组。
---

# 创建第一个 MOD

:::info[本课目标]
**耗时**：约 15 分钟　·　**完成标志**：新建世界时能在 MOD 列表找到“幸存者工具箱”
:::

## 选择目录

随游戏仓库维护的 MOD 位于 `data/mods/`；个人或第三方 MOD 应放在游戏安装目录的 `mods/`，或者当前平台用户目录下的 `mods/`。本教程使用：

```text
mods/
└── survivor_toolkit/
    └── modinfo.json
```

## 创建元信息

在 `modinfo.json` 写入：

```json
[
  {
    "type": "MOD_INFO",
    "id": "survivor_toolkit",
    "name": "幸存者工具箱",
    "authors": [ "你的名字" ],
    "description": "用于学习 CCB JSON MOD 的小型内容包。",
    "category": "items",
    "dependencies": [ "dda" ]
  }
]
```

- `id` 是稳定的内部标识，应保持唯一，不使用 `#`，发布后不要随意修改。
- `name` 和 `description` 是玩家看到的内容。
- `dependencies` 控制加载顺序；依赖核心游戏时使用 `dda`。
- `category` 只用于 MOD 选择界面分类。

## 在游戏里验证

1. 完全退出并重新启动游戏，让 MOD 列表重新扫描。
2. 新建世界，在 MOD 选择界面找到“幸存者工具箱”。
3. 启用它并完成世界创建。

如果没有出现，检查目录是否多套了一层、文件名是否正确，以及 JSON 最外层是否是数组。若出现加载错误，保留完整错误文本和日志中的文件路径。

下一课：[添加内容](./content)
