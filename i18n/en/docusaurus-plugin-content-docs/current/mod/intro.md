---
sidebar_position: 1
title: Create a MOD
description: Choose Lua Platform v1 behaviour or passive JSON data, then register your MOD in the CCB catalog.
---
# Create a CCB MOD

CCB has one executable authoring API: **Lua Platform v1**. Write new behaviour, conditions,
effects, and workflows in Lua. Passive, schema-validatable data such as item values may remain JSON.

| Goal | Start here |
|---|---|
| Write behaviour, events, conditions, interactions, or UI | [Lua Platform v1 quickstart](https://crimsoncrossbunker.github.io/CCB-Docs/en/api/lua/v1/overview/) |
| Browse or install MODs | [CCB MOD hub](/en/mods) |
| Register a community MOD from your own repository | [Community registration guide](https://github.com/CrimsonCrossBunker/CCB-MOD/blob/main/docs/register.en.md) |
| Inspect the complete API contract | [LuaLS declarations](https://github.com/CrimsonCrossBunker/Cataclysm-Cleanwater-Bomb/blob/master/data/lua/types/ccb_platform_v1.d.lua) |

A minimal Lua MOD contains only a root `main.lua`. An optional root `mod.lua` declares its ID,
version, and dependencies. It does not require `modinfo.json`, `manifest.json`, or a `lua/` directory.

Use Catapult to install catalog MODs. When publishing your own, provide a versioned ZIP, the CCB
versions you tested, the Lua API version, maintainers, and an issue tracker. The v1 registry performs
basic format checks; maintainers handle unusual compatibility and licensing cases manually.
