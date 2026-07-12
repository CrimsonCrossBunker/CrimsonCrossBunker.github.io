---
sidebar_position: 3
title: 编译游戏
description: 按平台选择 CCB 当前支持的构建入口并验证产物。
---

# 编译游戏

:::info[本课目标]
**完成标志**：成功启动自己构建的 CCB 图形版，并能进入主菜单
:::

CCB 同时包含 Make、CMake、Visual Studio/vcpkg 和 Android Gradle/NDK 等入口。平台依赖变化较快，本页给出主路径；具体包名和选项始终以仓库 `doc/c++/COMPILING*.md` 与 CI 工作流为准。

## 先选择路径

| 环境 | 推荐入口 | 权威文档 |
|---|---|---|
| Linux / 常规本地开发 | GNU Make | `doc/c++/COMPILING.md` |
| Windows + Visual Studio | CMake + vcpkg | `doc/c++/COMPILING-VS-VCPKG.md` |
| Windows + MSYS2 | Make | `doc/c++/COMPILING-MSYS.md` |
| CMake 开发环境 | CMake | `doc/c++/COMPILING-CMAKE.md` |
| Android | Gradle + NDK | `android/`、根目录 Gradle 配置与 Android CI |

## Linux 图形版

按 `doc/c++/COMPILING.md` 安装当前发行版所需的编译器、gettext、SDL、字体与图片依赖。然后从仓库根目录构建：

```bash
make -j4 TILES=1 SOUND=1 RELEASE=1
```

日常开发通常不要使用 `RELEASE=1`，这样能保留更适合调试的构建：

```bash
make -j4 TILES=1 CCACHE=1
```

机器内存不足时降低 `-j` 后的并行数。启用 `CCACHE=1` 前先安装 ccache。

## Windows

Visual Studio 用户应完整执行 `doc/c++/COMPILING-VS-VCPKG.md`，包括 vcpkg、CMake preset/配置、运行目录与测试说明。MSYS2 用户必须在文档指定的 shell 中安装对应工具链，不要混用 MSVC、MINGW64 和 UCRT64 依赖。

## macOS 与 Android

macOS 的 Homebrew、SDL 与应用包步骤位于 `doc/c++/COMPILING.md`。Android 构建由 Gradle 调用 NDK；先确认仓库要求的 JDK、SDK、NDK 版本，再使用仓库提供的 Gradle wrapper，避免用系统全局 Gradle 替代。

## 验证构建

1. 确认运行的是刚生成的程序，而不是已下载版本。
2. 从仓库预期的工作目录启动，使程序能找到 `data/`、`gfx/` 和字体。
3. 进入主菜单并创建最小测试世界。
4. 保存完整构建命令，后续在 PR 中记录。

## 常见失败

| 失败 | 优先检查 |
|---|---|
| 找不到 SDL 或 gettext | 是否安装了当前构建路径要求的开发包，pkg-config 是否来自同一工具链 |
| 编译进程被系统终止 | 降低并行数，检查内存和临时目录空间 |
| 链接成功但运行缺数据 | 启动目录错误，或只复制了可执行文件 |
| 切换选项后出现奇怪错误 | 清理对应构建产物后重新配置，不混用两个构建目录 |

下一课：[测试与调试](./testing)
