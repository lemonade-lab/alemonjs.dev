---
title: Agent 运维与发布报告
description: Agent、自动维护、告警、指标、灰度与回滚的生产验收和发布门禁。
sidebar_position: 3
---

# Agent 运维与发布报告

本页记录 ALemonX Agent 与 AI 运维能力进入生产前需要确认的能力、门禁和已知限制。它是发布验收参考，不等同于“开启自动修复”的授权。

## 能力摘要

- `TaskService` 统一任务创建、启动、等待、取消和恢复。
- `TaskPlan` 按 `understand → implement → verify` 串行推进，验证失败保留在当前步骤。
- `GoalRun` 支持 `queued`、`running`、终态，重启补偿和目标级互斥。
- 检查点、事件、快照和报告本地原子持久化；进程重启不会悄悄重放写操作。
- PM2 日志错误指纹去重，Incident、Todo、MaintenanceRun、项目策略和指标统一持久化。

## 自动维护状态机

```text
PM2 日志 → fingerprint 去重 → Incident triaged → AI 决策
  → auto_fix → TaskPlan/Reviewer → observing → resolved
  → 失败、复发或高风险 → todo / recovery_required
```

默认模式为 `observe`。进入 `canary` 前需要项目白名单、生产认证、SQLite、受围栏的 PM2 权限、验证契约、告警接收端和未触发紧急停止；准入报告只报告状态，不会自动启用 canary。

## 生产启用顺序

1. 设置 `ALX_DEPLOYMENT=production`，启用身份认证，确认运维数据使用 SQLite（默认 `ops.db`）。
2. 保持 `observe`，验证日志采集、事件聚合、待办和告警链路。
3. 对单个项目开启 `canary`，初始仅允许受控的 restart/reload。
4. 观察 MTTR、回滚率、误修率、告警送达率和租约异常，稳定后再由管理员扩大范围。
5. 发生异常时使用紧急停止；恢复前先处理 `recovery_required` 和待办。

查询准入状态：

```http
GET /api/v1/ops/canary-readiness?root=<机器人目录>
```

指标接口包括 `/api/v1/ops/metrics/query` 与 `/api/v1/ops/metrics/prometheus`；Webhook 通过 `ALX_OPS_WEBHOOK_URL` 配置。

## 发布检查清单

| 项目 | 必须确认                                                          |
| ---- | ----------------------------------------------------------------- |
| 权限 | 认证、角色、项目白名单和高风险人工审批可用                        |
| 执行 | PM2 写操作有租约、fencing token、预算和紧急停止保护               |
| 验证 | 每个自动写任务都有受控 `verificationCommand`、Reviewer 输出和快照 |
| 数据 | SQLite 打开成功，JSON 迁移有备份，租约/告警/游标可恢复            |
| 观测 | SSE、Webhook、Prometheus 和审计记录能够追踪一次完整任务           |
| 回滚 | 当前文件 hash 未改变时才允许快照回滚，冲突必须转人工              |

已知限制：自动维护仍是当前进程内能力；生产环境建议单主实例灰度。多实例租约具备竞争保护，但跨区域扩缩容、厂商级值班升级和远程 MCP 网关不在本版本范围内。
