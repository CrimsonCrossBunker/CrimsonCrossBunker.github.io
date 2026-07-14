---
sidebar_position: 4
title: macOS构建指南
description: 在 macOS 上使用 Homebrew、CMake 或者 Ninja 构建 CCB 的 SDL2 图形版。
---

# macOS ARM64 SDL2 构建指南

本文记录在 macOS 上从零构建图形化程序的过程，供大家参考和纠正喵 ^ ^

实际在 mac 上构建还是比较方便的，你可以使用纯终端来构建和运行。当然想更方便一点的话，使用Clion是更好的选择。

## 目录

1. [准备工作：安装依赖](#1-准备工作安装依赖)
2. [克隆仓库](#2-克隆仓库)
3. [构建时代码修改](#3-构建时代码修改)
4. [构建项目](#4-构建项目)
5. [获取运行时资源](#5-获取运行时资源)
6. [首次运行与配置](#6-首次运行与配置)
7. [其他问题](#7-其他问题)

---

## 1. 准备工作：安装依赖

### 1.1 Xcode

安装 Command Line Tools：

```bash
xcode-select --install
```

验证：

```bash
clang --version
# 应输出类似：Apple clang version 17.0.0 ...
```

### 1.2 Homebrew

安装：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

> **注意**：安装脚本会提示你按回车确认，并在最后提示将 Homebrew 添加到 PATH。请按照终端输出的提示操作（通常是运行一两条 `echo` 和 `eval` 命令）。

验证：

```bash
brew --version
```

### 1.3 安装构建工具和依赖库

```bash
# cmake， CLion中也有自带的cmake
brew install cmake
# 快速构建执行器，在终端下可以替代 make， CLion中也有自带的ninja
brew install ninja      

# SDL2 图形库（TILES 模式必需）
brew install sdl2       # 图形和窗口管理
brew install sdl2_image # 图片加载
brew install sdl2_ttf   # 字体渲染

# 本地化工具（可选项，中文翻译需要）
brew install gettext    # 提供 msgfmt，用于编译 .po → .mo 翻译文件
```

> 如果你后续还想构建纯终端版（CURSES 模式），则需要安装 ncurses：
> ```bash
> brew install ncurses
> ```

### 1.4 依赖说明汇总

| 包名 | 用途 | 构建模式 |
|------|------|----------|
| `cmake` | 生成构建文件 | 所有场景 |
| `ninja` | 快速并行编译 | 所有场景 |
| `sdl2` | 创建窗口、处理输入 | TILES 模式 |
| `sdl2_image` | 加载贴图资源 | TILES 模式 |
| `sdl2_ttf` | 渲染游戏内文字 | TILES 模式 |
| `gettext` | 编译中文翻译文件 | 需自编译中文的场景 |
| `ncurses` | 终端 UI | 仅 CURSES 模式 |

---

## 2. 克隆仓库

```bash
git clone https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb.git
cd Cataclysm-Cleanwater-Bomb
```

---

## 3. 构建时代码修改

在 macOS ARM64 上需要两个小改动才能成功编译。**这些改动不影响其他平台**。

### 3.1 修复一：`-mcx16` 编译器标志（所有模式都需要）

**文件**：`CMakeLists.txt`（项目根目录），约第 113-119 行

**问题**：`-mcx16` 是 x86 专属的编译器标志，用于启用 128 位 `cmpxchg16b` 原子指令。ARM64 芯片没有这条指令，传入会导致 CMake 的所有编译器检测失败，报错 `Could NOT find Threads`。

**修改方法**：将 `-mcx16` 加上架构判断，只在 x86 上启用：

```cmake
if (NOT MSVC)
    # -mcx16 enables 128-bit cmpxchg16b on x86/x86_64; unsupported on ARM64
    if (CMAKE_SYSTEM_PROCESSOR MATCHES "(x86_64|AMD64|i[3-6]86)")
        set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -mcx16")
        set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -mcx16")
    endif()
endif()
```

### 3.2 修复二：ncurses 宽字符支持（可选，仅 CURSES 终端模式模式需要）

**文件**：`src/third-party/imtui/imtui-impl-ncurses.cpp`，约第 9-10 行

**适用范围**：仅当构建 CURSES（终端）模式时需要此修复。SDL2 图形模式下该文件不会被编译，因此该修复对 TILES 模式没有影响。

**问题**：代码中使用了 `waddwstr`（宽字符版本的窗口写入函数），这需要 `NCURSES_WIDECHAR 1` 宏。但旧代码在 macOS 上禁用了这个宏（用 `#if !defined(__APPLE__)` 包裹），可能当年 macOS 自带的旧版 ncurses 不支持宽字符喵。如今 Homebrew 的 ncurses 完全支持，这个限制已经过时了喵。

> Homebrew 的 ncurses 在所有平台上都支持宽字符。通过 Homebrew 安装的 ncurses 以 `-I/opt/homebrew/opt/ncurses/include` 路径编译，其头文件完全支持 `waddwstr`。

**修改方法**：将第 9-10 行改为无条件定义：

```cpp
#define NCURSES_NOMACROS
#define NCURSES_WIDECHAR 1
```

> 如果你看到原来的代码是：
> ```cpp
> #if !defined(__APPLE__)
> #define NCURSES_WIDECHAR 1
> #endif
> ```
> 直接把 `#if` / `#endif` 删掉，只保留 `#define NCURSES_WIDECHAR 1` 这一行。

---

## 4. 构建项目

### 4.1 创建构建目录并配置 CMake

在项目根目录下执行：

```bash
cmake -B cmake-build-debug -G Ninja \
  -DCMAKE_BUILD_TYPE=Debug \
  -DTILES=ON \
  -DUSE_SDL3=OFF \
  -DSOUND=ON
```

各参数含义：

| 参数 | 说明 |
|------|------|
| `-B cmake-build-debug` | 构建目录名，所有中间文件放这里 |
| `-G Ninja` | 使用 Ninja 构建器（比 make 快） |
| `-DCMAKE_BUILD_TYPE=Debug` | Debug 模式，可执行文件输出到项目根目录 |
| `-DTILES=ON` | 启用图形界面（SDL2 窗口模式） |
| `-DUSE_SDL3=OFF` | 关闭 SDL3，使用 SDL2（见下方说明） |
| `-DSOUND=ON` | 启用音效支持（可选） |

> **注意**：TILES 模式下**不需要** `CURSES_INCLUDE_PATH` 和 `CURSES_LIBRARY` 参数。这两个参数只在 CURSES（终端）模式下使用，TILES 模式下会被 CMake 忽略（并产生 "unused" 警告）。加了也没关系，但不加更干净。

#### 为什么用 `USE_SDL3=OFF`？

SDL3 是 SDL 的新版，但 macOS 上有一个关键问题：SDL3 需要 `shadercross` 工具来编译 GPU 着色器，而这个工具目前不在 Homebrew 中。如果设为 `ON`，配置阶段会失败，错误提示找不到 `shadercross`。

SDL2 在 macOS 上实际通过 `sdl2-compat` 运行（Homebrew 当前的 sdl2 是一个兼容层，将 SDL2 API 调用转换为 SDL3 实现），功能完整可用。

### 4.2 执行编译

```bash
cmake --build cmake-build-debug --target cataclysm-tiles -j 8
```

- `--target cataclysm-tiles`：指定构建图形版可执行文件（TILES 模式下目标名是 `cataclysm-tiles`，不是 `cataclysm`）
- `-j 8`：并行编译 8 个任务，可改为 `-j $(sysctl -n hw.logicalcpu)` 使用全部核心

编译成功后，项目根目录下会出现 `cataclysm-tiles` 可执行文件。

```bash
# 验证可执行文件已生成
ls -lh cataclysm-tiles
```

### 4.3 CLion

如果你使用了 CLion IDE：

1. 用 CLion 打开项目根目录
2. 打开 **Settings → Build, Execution, Deployment → CMake**
3. 在 CMake options 中填入：
   ```
   -DTILES=ON -DUSE_SDL3=OFF -DSOUND=ON
   ```
4. 在 **Run Configuration** 中选择 Target 为 `cataclysm-tiles`（注意喵！这里不是 `cataclysm`，不要选错了喵！）
5. 点击构建按钮等待构建完毕即可喵，然后你就可以运行测试了喵。

---

## 5. 获取运行时资源

游戏运行时需要以下资源文件夹，它们必须放在**项目根目录**（也就是可执行文件所在目录）下。Debug 模式下 CMake 会把可执行文件直接输出到项目根目录，所以游戏启动时也在项目根目录下找这些资源。

### 5.1 需要哪些资源？

| 资源 | 目录 | 说明 |
|------|------|------|
| 贴图包（tilesets） | `gfx/` | 图形界面必须，否则看不到地图和角色 |
| 音效包 | `data/sound/` | 可选，SOUND=ON 时需要 |
| 中文翻译文件 | `lang/mo/zh_CN/LC_MESSAGES/cataclysm-dda.mo` | 中文界面必需喵 |
| 游戏数据 | `data/` | 仓库已包含大部分，但 mods 可能不全 |

### 5.2 从官方 Release 提取资源

可以从已发布且安装过的 `.app` 包里复制资源到本地的构建目录

```bash
# 假设你下载的官方 DMG 已挂载
# .app 内的资源路径：
#   Cataclysm.app/Contents/Resources/
#     ├── gfx/          → 贴图包
#     ├── data/sound/   → 音效
#     └── lang/mo/      → 翻译文件
```

---

## 6. 首次运行与配置

### 6.1 启动游戏

在项目根目录：

```bash
./cataclysm-tiles
```

首次启动后，游戏会在 `~/Library/Application Support/Cataclysm/` 下自动生成默认配置文件和存档目录。

注意！这里有一个小窍门喵！有的伙伴可能之前已经从官方下载了Mac版本的游戏包，并且打开运行过了！这种情况下，如果你作为开发者，又构建并且启动了另一个 cataclysm 游戏，那么这两个游戏的配置和设定文件其实是共享并且冲突的喵！

为了避免冲突，强烈建议在开发构建时，使用 `--userdir <路径>`  来手动指定一个默认的游戏配置储存位置，比如这样启动：

```
./cataclysm-tiles --userdir ./userdata
```

这样会在你开发仓库的位置创建一个 userdata 目录，用于储存游戏配置，这样就好多了喵！不会冲突了喵！

当然，使用CLion的话，也可以点击运行图标右边的三个小点，然后在 **调试/配置** 界面，更改 **cataclysm-tiles** 的 **程序实参**，加一个 `--userdir ./userdata` 进去就行了喵！

### 6.2 中文设置

启动游戏后，在主菜单中：
1. 选择 **设置 (Settings)** → **选项 (Options)** → **一般 (General)**
2. 找到 **语言 (Language)** 选项，选择 `中文 (中国)`
3. 保存并重启游戏

或者直接编辑配置文件 `~/Library/Application Support/Cataclysm/config/options.json`，将 `USE_LANG` 改为 `"zh_CN"`。

### 6.3 贴图包选择

主菜单 → 设置 → 图形，在贴图包列表中选择你喜欢的外观。默认是 `UltimateCataclysm`。

---

## 7. 其他问题

### 7.1 SDL2 窗口模式黑屏

**现象**：游戏以窗口模式启动后，画面全黑，只有切换到全屏才正常显示。

**原因**：可能是 Homebrew 当前的 `sdl2-compat`（将 SDL2 API 调用转换为 SDL3 底层实现）在窗口模式下有渲染问题。

**解决方案**：

- 首次启动后在游戏内设置中开启全屏 —— 设置 → 图形 → 全屏，选择 `fullscreen`。之后每次启动都是全屏。

### 7.2 调整窗口/字体大小

在游戏内设置 → 图形中调整，一般配合游戏内侧边栏设置一起用。
- **终端宽度/高度**：控制显示范围
- **缩放比例**：控制贴图和文字大小，不要调太大喵！显示效果会坏掉的喵！
- **字体**：图形模式下可以控制系统字体

---

> **文档版本**：v1.1
>
> **适用版本**：Cataclysm: Cleanwater Bomb，基于 CleverRaven/Cataclysm-DDA commit `221c786e7d`
>
> **最近修改**：2026-07-14 by [千远万花](https://github.com/RitaRossweiss) 
