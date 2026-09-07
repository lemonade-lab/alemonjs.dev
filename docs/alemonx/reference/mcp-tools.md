---
title: MCP 工具参考
description: ALemonX MCP 控制面的工具分组、参数约定、确认规则与推荐调用顺序。
sidebar_position: 3
---

# MCP 工具级参考

本页是 MCP 工具索引。工具通过 stdio 或 Streamable HTTP 提供，返回文本结果和 `structuredContent`；以结构化字段为准，不要解析人类可读文本来判断状态。

## 调用约定

- 修改、安装、启动、停止、构建和发布类工具必须传 `confirm: true`。
- 先调用只读检查工具，再调用变更工具；发布前必须先执行对应的 preview/status。
- 长操作返回任务 ID，使用 `alemonjs_get_project_task` 查询到 `completed` 或 `failed`。
- 项目路径必须包含 `package.json`，并且受 `MCP_ALLOWED_ROOTS` 限制时必须位于允许根目录内。

## 工具目录

### 上下文与生态信息

| 工具                                  | 用途                                                |
| ------------------------------------- | --------------------------------------------------- |
| `resources/list` / `resources/read`   | 读取 `alemonjs://mcp/capabilities` 和服务能力说明。 |
| `alemonjs_theme`                      | 查询工作台主题或主题相关能力。                      |
| `alemonjs_list_catalog`               | 列出官方生态目录。                                  |
| `alemonjs_get_catalog_document`       | 读取目录中的文档。                                  |
| `alemonjs_get_catalog_package_config` | 获取目录包配置。                                    |
| `alemonjs_list_releases`              | 查询 ALemonX 或生态版本发布信息。                   |

### 环境与项目检查

| 工具                           | 关键参数         | 用途                                     |
| ------------------------------ | ---------------- | ---------------------------------------- |
| `alemonjs_check_environment`   | 可选项目根目录   | 检查 Node.js、Git、包管理器等。          |
| `alemonjs_project_status`      | `root`           | 汇总项目依赖、脚本、运行状态。           |
| `alemonjs_list_project_files`  | `root`、可选路径 | 列出允许读取的项目文件。                 |
| `alemonjs_read_project_file`   | `root`、`path`   | 读取单个文件；受敏感文件和大小限制保护。 |
| `alemonjs_list_local_packages` | `root`           | 查询本地可用包与受管工具。               |

### 项目与配置

| 工具                                                                           | 用途                                                             |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `alemonjs_create_project`                                                      | 创建项目；未指定路径时使用 `<workspace>/bots/<name>`，需要确认。 |
| `alemonjs_get_package_runtime_config` / `alemonjs_save_package_runtime_config` | 读取或保存运行配置，保存需要确认。                               |
| `alemonjs_get_package_manifest` / `alemonjs_save_package_manifest`             | 读取或保存包清单，保存需要确认。                                 |
| `alemonjs_write_project_file`                                                  | 写入项目文件，需要确认；服务端校验路径和大小。                   |

### 运行、构建与发布

| 工具                              | 用途                                                                                                                                |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `alemonjs_start_project_action`   | 异步执行 `install`、`build`、`dev`、`pm2`、`pm2-status`、`pm2-stop`、`npm-version`、`npm-publish`、`commit`、`git-release` 等动作。 |
| `alemonjs_stop_development`       | 停止开发进程。                                                                                                                      |
| `alemonjs_get_project_task`       | 查询异步任务详情、进度、输出和错误。                                                                                                |
| `alemonjs_get_npm_pack_preview`   | 发布前查看 npm 包内容。                                                                                                             |
| `alemonjs_get_npm_publish_status` | 查看 npm 发布准备状态。                                                                                                             |
| `alemonjs_initialize_git`         | 初始化项目 Git。                                                                                                                    |
| `alemonjs_get_git_release_status` | 查看 Git Release 状态。                                                                                                             |

### Agent、插件与系统状态

| 工具                          | 用途                                      |
| ----------------------------- | ----------------------------------------- |
| `alemonjs_list_project_tasks` | 列出项目任务，支持恢复前检查。            |
| `alemonjs_list_setup_plugins` | 列出系统插件和 Web 入口，不执行插件代码。 |
| `alemonjs_check_setup_update` | 检查工作台更新。                          |

## 推荐调用序列

```text
capabilities → project_status → list_files/read_file
→ 提出计划并获得用户批准
→ write_file 或 start_project_action(confirm=true)
→ get_project_task（直到终态）
→ project_status / preview → 汇报结果
```

MCP 服务端永久拒绝任意 Shell、`.env`/`.npmrc`、私钥证书、`.git`、`node_modules`、符号链接和超过 1 MiB 的文件操作。
