---
sidebar_position: 2
title: 创建第一个 MOD
description: 选择正确目录，按 CCB 当前加载器支持的字段建立 modinfo.json。
---

# 创建第一个 MOD

:::info[本课目标]
**完成标志**：重启游戏后，新建世界的 MOD 列表能找到“幸存者工具箱”，依赖自动带上 CCB 核心内容
:::

## 1. 选择安装位置

CCB 当前 `mod_manager::refresh_mod_list()` 会加载游戏 MOD 目录和用户 MOD 目录：

| 位置 | 适合 |
|---|---|
| 源码仓库 `data/mods/<目录>/` | 准备提交进 CCB 的内置 MOD |
| 游戏安装目录 `mods/<目录>/` | 便携安装、和这一份游戏一起移动 |
| `USER_DIR/mods/<目录>/` | 玩家个人 MOD，游戏更新时更不容易被覆盖 |

`USER_DIR` 的实际位置受平台、打包方式和 `--userdir` 参数影响。不能确定时，用独立用户目录启动测试，或查看当前游戏的路径与日志，不要照搬其他平台的绝对路径。

本教程使用：

```text
mods/
└── survivor_toolkit/
    └── modinfo.json
```

游戏会递归查找名为 `modinfo.json` 的文件。目录多套一层本身不一定有问题，但发布包应保持结构简单，让玩家不会安装成 `mods/survivor_toolkit/survivor_toolkit/modinfo.json` 而找不到预期内容。

## 2. 写入最小可用元数据

在 `modinfo.json` 写入：

```json
[
  {
    "type": "MOD_INFO",
    "id": "survivor_toolkit",
    "name": "幸存者工具箱",
    "authors": [ "你的名字" ],
    "maintainers": [ "你的 GitHub 用户名" ],
    "description": "用于学习 CCB JSON MOD 的小型内容包。",
    "category": "items",
    "version": "0.1.0",
    "dependencies": [ "dda" ]
  }
]
```

`type`、`id` 和 `name` 是最小必要信息。`dependencies: [ "dda" ]` 使用的是 CCB 当前核心模组 `data/mods/dda/modinfo.json` 中真实存在的 ID。

## 3. 理解每个字段

CCB 当前 `src/mod_manager.cpp` 实际读取以下字段：

| 字段 | 必需 | 作用 |
|---|---:|---|
| `type` | 是 | 必须是 `MOD_INFO`，其他对象会被元数据扫描忽略 |
| `id` | 是 | 全局唯一稳定 ID；不能包含 `#`，还要能安全用于文件夹路径 |
| `name` | 是 | MOD 列表显示名，可使用翻译对象 |
| `authors` | 否 | 内容作者列表 |
| `maintainers` | 否 | 维护兼容性的 GitHub 用户名；内置 MOD 尤其重要 |
| `description` | 否 | 选择界面的说明，可翻译 |
| `category` | 否 | MOD 选择界面分类 |
| `version` | 否 | 信息展示；加载器不替你比较版本 |
| `dependencies` | 否 | 必须先加载的 MOD ID，自动建立加载顺序 |
| `conflicts` | 否 | 不能同时启用的 MOD ID |
| `path` | 否 | 相对 `modinfo.json` 的实际内容子目录 |
| `loading_images` | 否 | Tiles 版本可用的 PNG 加载图文件名 |
| `disable_other_loading_screens` | 否 | 为 `true` 时只使用当前 MOD 的加载图 |
| `obsolete` | 否 | 旧存档仍可识别，但新世界不能选择 |
| `core` | 否 | 核心模组标记；第三方 MOD 不应使用 |

`name` 和 `description` 在代码中是翻译对象，因此既可写字符串，也可按对应 JSON 翻译格式提供上下文。字段行为有疑问时，查看 [`src/mod_manager.cpp`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/src/mod_manager.cpp) 与 [`src/mod_manager.h`](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/src/mod_manager.h)。

## 4. 选择合法分类

当前加载器只识别下列 `category`；未知值会回到“无分类”：

| ID | 适用内容 |
|---|---|
| `total_conversion` | 全面改变游戏体验的总转换 |
| `content` | 大型核心内容包 |
| `items` | 物品与配方 |
| `creatures` | 生物与 NPC |
| `misc_additions` | 其他内容扩展 |
| `buildings` | 建筑、地点与地图内容 |
| `vehicles` | 载具与载具部件 |
| `rebalance` | 重新平衡或修改其他 MOD 的 modmod |
| `magical` | 魔法相关内容 |
| `item_exclude` | 阻止物品生成 |
| `monster_exclude` | 阻止怪物生成 |
| `graphical` | 图形显示调整 |
| `accessibility` | 无障碍功能 |

分类只影响选择界面的分组，不代替依赖或冲突声明。

## 5. 使用 path 拆分元数据和内容

大型 MOD 可以把内容放进子目录：

```json
{
  "type": "MOD_INFO",
  "id": "survivor_toolkit",
  "name": "幸存者工具箱",
  "category": "items",
  "dependencies": [ "dda" ],
  "path": "data/"
}
```

```text
survivor_toolkit/
├── modinfo.json
└── data/
    ├── items.json
    └── recipes.json
```

设置 `path` 后，加载器把该相对目录视为 MOD 内容根；放在外面的其他 JSON 不会作为内容加载。小型 MOD 不需要 `path`。

## 6. 第一次发现检查

1. 完全退出并重新启动游戏，让 MOD 列表重新扫描。
2. 新建世界，找到“幸存者工具箱”。
3. 启用它，确认核心 `dda` 依赖自动加入。
4. 完成世界创建，查看是否出现加载错误。

如果没有出现：

- 文件必须确实叫 `modinfo.json`，不是 `modinfo.json.txt`；
- JSON 最外层是数组，逗号、引号和括号配对；
- `type` 大小写为 `MOD_INFO`；
- `id` 不包含 `#`，且没有与其他 MOD 重复；
- 当前游戏实际使用的安装目录或 `USER_DIR` 与你放置的位置一致；
- 查看 `debug.log` 中的搜索路径和第一条相关错误。

下一课：[添加物品与配方](./content)
