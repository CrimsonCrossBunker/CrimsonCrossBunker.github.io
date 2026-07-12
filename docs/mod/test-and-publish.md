---
sidebar_position: 4
title: 测试与发布
description: 检查 JSON、验证玩法、处理兼容性并制作干净的发布包。
---

# 测试与发布

:::info[本课目标]
**完成标志**：MOD 能在干净世界加载，新增内容可生成和使用，发布包不包含存档或缓存
:::

## 最小测试闭环

1. 关闭游戏后修改 JSON，再重新启动。
2. 新建只启用核心内容和当前 MOD 的测试世界。
3. 使用调试菜单生成新增对象，确认名称、说明和行为。
4. 通过正常玩法验证配方、生成和解锁条件。
5. 查看日志，修复所有由当前 MOD 引起的错误和警告。

从源码开发时，还可以使用游戏程序的 MOD 检查参数；具体参数以当前构建的 `--help` 和仓库 `doc/cataclysm-tiles.6` 为准。仓库维护者可运行 `tools/load_all_mods.sh` 做更广的组合加载检查。

## 格式与兼容

- 使用仓库提供的 JSON 格式工具，不要用通用美化器重排整个数据集。
- 不复制核心对象只为修改一个字段；优先使用 `copy-from`、extend/delete 等继承机制。
- 不随意修改已经进入玩家存档的 ID。删除或改名时研究对象迁移机制。
- 跨 MOD 交互参考 `doc/MOD_COMPATIBILITY.md`，明确声明依赖，不假定加载顺序。
- 可翻译内容参考 `doc/TRANSLATING_MOD.md`。

## 发布包

发布压缩包应打开后直接看到 MOD 文件夹，文件夹中至少有 `modinfo.json`、内容 JSON、README 和许可证。README 写明：支持的 CCB 版本、安装位置、依赖、更新说明、问题反馈方式。

```text
survivor_toolkit/
├── modinfo.json
├── items.json
├── recipes.json
├── README.md
└── LICENSE
```

不要打包存档、游戏日志、编辑器缓存或整个游戏本体。发布前在一份干净的 CCB 中按 README 重装一次。

## 贡献进 CCB 仓库

若希望成为随游戏发布的内置 MOD，先阅读 `doc/IN_REPO_MODS.md`，确认维护责任、许可和内容定位，再按[代码贡献流程](/docs/contribute/code)提交 PR。
