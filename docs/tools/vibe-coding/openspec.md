---
title: OpenSpec 学习笔记
description: 系统学习 OpenSpec —— 专为 AI 编程设计的规范驱动开发（SDD）框架，让 AI 从"随性编码"走向"规范驱动"
---

# OpenSpec 学习笔记

---

## 第一章：认识 OpenSpec

### 1.1 为什么需要 OpenSpec

你有没有这样的经历：让 AI 助手"帮我实现一个用户认证功能"，结果它生成了一大段代码——

- 用了你没用过的框架
- 遗漏了你提的关键需求
- 添加了你根本不需要的功能
- 代码看起来很美，但跑起来全是坑

这不是 AI 不够聪明，而是**上下文缺失**导致的。AI 不知道你的项目约定、架构决策和历史背景，只能靠"猜"来完成你的需求。

!!! quote "Vibe Coding 的局限性"

    Vibe Coding（随性编码）对于快速原型验证或许尚可接受，但要构建**严肃的、生产级别的软件系统**，显然远远不够。我们需要一种能将传统软件工程的严谨性与 AI 的强大能力相结合的方法论。

### 1.2 什么是 Spec-Driven Development

**Spec-Driven Development（SDD，规范驱动开发）** 是一种开发范式：**先写规范，再写代码**。

GitHub 在 2025 年 9 月的一篇博文中给出了 SDD 的定义：

> Instead of coding first and writing docs later, in spec-driven development, you start with a (you guessed it) spec. This is a contract for how your code should behave and becomes the source of truth your tools and AI agents use to generate, test, and validate code. The result is less guesswork, fewer surprises, and higher-quality code.

翻译过来就是：

> 在规范驱动开发中，你不是先写代码再补文档，而是**从规范开始**。规范是代码行为的契约，是 AI 工具用于生成、测试和验证代码的**唯一真理源**。结果就是：更少的猜测、更少的意外、更高质量的代码。

SDD 与传统开发流程的对比：

| 维度 | 传统 Vibe Coding | SDD 规范驱动开发 |
|------|-----------------|-----------------|
| **起点** | 模糊的对话需求 | 结构化的规范文档 |
| **过程** | 让 AI 自由发挥 | 按已批准的规范执行 |
| **可复现性** | 相同提示可能得到不同结果 | 相同规范 → 相同结果 |
| **可追溯性** | 需求散落在聊天记录中 | 规范的变更历史完整可查 |
| **验证标准** | 人肉测试几个用例 | 规范即测试标准 |
| **维护成本** | 变更时需重写对话历史 | 更新规范即可 |

### 1.3 什么是 OpenSpec

**OpenSpec** 是由 [Fission AI](https://github.com/Fission-AI) 开发的一款**轻量级规范驱动开发（SDD）框架和 CLI 工具**，专为 AI 辅助编程场景设计。

!!! tip "核心定位"

    OpenSpec 的本质不是让 AI 变得更聪明，而是给 AI 编程助手套上**"规范的笼头"**——在人类开发者与 AI 编码助手之间建立一个**持久化的共识层**。

**关键数据：**

- 2025 年底开源，2026 年初在 AI 编程社区迅速走红
- GitHub 已获 **46.8k+ Star**（截至 2026 年 5 月）
- 支持 Claude Code、Cursor、GitHub Copilot、Windsurf 等主流 AI 编程工具

**OpenSpec 的四个核心理念：**

1. **先对齐** —— 起草变更提案，明确需求，锁定范围
2. **再规划** —— 审查与对齐规格，直到人类和 AI 达成一致
3. **后编码** —— 按照已批准的规范实现任务
4. **必归档** —— 完成后更新主规范，保持可追溯

!!! info "Brownfield-first（存量项目优先）"

    OpenSpec 不仅适用于从零开始的项目（0→1），更擅长在**已有项目**（1→n）中进行功能演进。它通过 `specs/` 和 `changes/` 两个核心目录，将"真理源"与"提议变更"清晰分离。

### 1.4 与其他工具的对比

| 工具 | 定位 | 特点 |
|------|------|------|
| **OpenSpec** | 轻量级 SDD 框架 | 轻量、工具无关、Brownfield-first |
| **Spec Kit**（GitHub） | 全功能规范框架 | 功能全面但体积庞大，有严格的阶段门控 |
| **Kiro**（AWS） | 全栈 AI IDE | 功能强大但绑定特定 IDE 和 Claude 模型 |
| **Cursor Plan 模式** | 内置规划模式 | 单一工具内嵌，不可跨工具使用 |
| **无规范的 AI 编码** | 纯对话驱动 | 模糊提示 + 不可预测的结果 |

---

## 第二章：使用指南

### 2.1 安装与初始化

**前置条件**

- **Node.js** 20.19.0 或更高版本

**安装**

=== "npm（推荐）"

    ```bash
    npm install -g @fission-ai/openspec@latest
    ```

=== "pnpm"

    ```bash
    pnpm install -g @fission-ai/openspec@latest
    ```

**验证安装**

```bash
openspec --version
```

**在项目中初始化**

```bash
cd your-project
openspec init
```

初始化过程会引导你：

1. 选择使用的 AI 工具（Claude Code、Cursor、Copilot 等）
2. 自动配置对应的斜杠命令
3. 创建 `openspec/` 目录结构
4. 生成 `AGENTS.md` 文件（AI 助手操作指南）

!!! tip "验证初始化"

    ```bash
    # 查看生成的配置
    openspec list
    ```

    如果 AI 助手没有立即显示新的斜杠命令，请**重启它**。

### 2.2 目录结构

初始化完成后，项目会生成以下目录结构：

```
your-project/
└── openspec/
    ├── specs/               # 真理源规范（已构建完成的内容）
    │   └── [capability]/
    │       └── spec.md      # 某个功能模块的规范
    ├── changes/             # 变更提案（待实施的内容）
    │   ├── [change-name]/   # 单个变更的完整目录
    │   │   ├── proposal.md  # 变更说明（需求描述）
    │   │   ├── tasks.md     # 实施任务清单
    │   │   ├── design.md    # 技术设计方案（可选）
    │   │   └── specs/       # 本次变更带来的规范增量
    │   └── archive/         # 已完成的变更（历史归档）
    ├── config.yaml          # OpenSpec 配置文件
    └── AGENTS.md            # AI 助手的操作指南
```

关键目录的职责：

| 目录 | 作用 | 类比 |
|------|------|------|
| `specs/` | 当前系统的**真实规范** | 已发布的产品文档 |
| `changes/` | 正在进行的**变更提案** | 待审批的 PR |
| `changes/archive/` | 已完成的**变更归档** | 已合并的 PR 历史 |
| `changes/[name]/specs/` | 本次变更的**规范增量** | PR 中的 diff |

### 2.3 核心工作流概述

OpenSpec 的工作流遵循 **4 个阶段**：

```
                   ┌──────────────────────┐
                   │  1. 起草变更提案      │
                   │  Draft Change Proposal │
                   └──────────┬───────────┘
                              │ 与 AI 共享意图
                              ▼
                   ┌──────────────────────┐
                   │  2. 审查与对齐        │
            ┌───── │  Review & Align       │ ◀──── 人类 + AI 迭代调整
            │      └──────────┬───────────┘
            │                 │ 达成一致
            │                 ▼
            │      ┌──────────────────────┐
            │      │  3. 实施变更          │
            │      │  Implement Change     │
            │      └──────────┬───────────┘
            │                 │ 代码完成
            │                 ▼
            │      ┌──────────────────────┐
            │      │  4. 归档与更新        │
            │      │  Archive & Update     │
            │      └──────────────────────┘
            │
            └── 如果需求变更，回到阶段 1
```

### 2.4 CLI 命令详解

OpenSpec 提供两套工作流配置文件（profile）：**Core（默认）** 和 **Expanded（扩展）**。

!!! tip "切换工作流"

    如需启用 Expanded 工作流：

    ```bash
    openspec config profile  # 选择 workflows
    openspec update          # 应用配置
    ```

#### Core 工作流（默认，新手首选）

Core 是安装后的默认配置，提供 4 个命令，覆盖日常开发的核心流程：

| 命令              | 用途     | 说明                                |
| --------------- | ------ | --------------------------------- |
| `/opsx:propose` | 创建变更提案 | 一步生成 proposal、specs、tasks 等全部规划制品 |
| `/opsx:explore` | 探索与调研  | 开发前梳理思路、调研方案、明确需求                 |
| `/opsx:apply`   | 执行实现   | 根据已批准的规范，让 AI 编写代码                |
| `/opsx:archive` | 归档变更   | 将完成的变更归档，更新主规范                    |

**Core 工作流示意图：**

```
/opsx:propose  →  /opsx:apply  →  /opsx:archive
     │                                  │
     └── 不满意可重复 propose ──────────┘
```

#### Expanded 工作流（进阶，更精细的控制）

Expanded 在 Core 的基础上新增了 7 个命令，提供更细粒度的控制：

| 命令 | 用途 | 说明 |
|------|------|------|
| `/opsx:new` | 新建变更脚手架 | 初始化新变更的基础目录和文件 |
| `/opsx:continue` | 逐步生成下一个制品 | 按依赖关系逐步生成 proposal → design → tasks |
| `/opsx:ff` | 快速生成全部制品 | 等同于一步到位生成所有规划制品 |
| `/opsx:verify` | 验证实现与规范是否一致 | 自动检查代码是否满足规格要求 |
| `/opsx:sync` | 同步规范增量到主规范 | 将变更的增量 specs 合并到主 specs 中 |
| `/opsx:bulk-archive` | 批量归档多个变更 | 处理多个已完成变更的归档并解决规范冲突 |
| `/opsx:onboard` | 交互式教程 | 引导熟悉完整的 OpenSpec 工作流 |

**Expanded vs Core 的对比：**

| 场景 | Core 能否处理 | Expanded 推荐 |
|------|:-----------:|:-------------:|
| 需求明确的中小变更 | ✅ 够用 | — |
| 逐个审查每个制品 | ❌ 只能一次性生成 | ✅ `/opsx:continue` |
| 验证代码是否匹配规范 | ❌ 无法自动检查 | ✅ `/opsx:verify` |
| 并行管理多个变更 | ❌ 只能逐个归档 | ✅ `/opsx:bulk-archive` |
| 控制工作流节奏 | ❌ 要么全生成，要么不生成 | ✅ 灵活控制 |

### 2.5 实战示例：厨房计时器

下面通过一个"厨房计时器"的例子，演示 OpenSpec 的完整工作流。

#### 步骤 1：编辑项目上下文

初始化后，编辑 `openspec/config.yaml`，描述项目目的和技术栈：

```yaml
# openspec/config.yaml
project:
  name: kitchen-timer
  description: 提供一个简单、高可见性的厨房计时器，用于家庭和商用厨房
  tech_stack:
    - HTML5 / CSS3
    - JavaScript (ES6)
```

#### 步骤 2：起草变更提案

在 AI 助手中输入：

```
/opsx:propose 为厨房计时器添加倒计时功能
```

AI 会自动生成：

- `proposal.md` —— 功能描述：提供 1 分钟、3 分钟、5 分钟快捷按钮
- `tasks.md` —— 任务清单：创建 UI、实现倒计时逻辑、添加声音提醒
- `specs/` —— 规范增量：倒计时行为的具体规格

#### 步骤 3：审查与对齐

人类审查 AI 生成的提案，调整细节。比如：

- 修改 `proposal.md`：增加"倒计时结束后发出蜂鸣声"
- 修改 `tasks.md`：将"发音提醒"拆分为两个子任务

#### 步骤 4：实施变更

```
/opsx:apply
```

AI 根据已批准的 `tasks.md` 和 `specs/` 编写代码。

#### 步骤 5：归档

```
/opsx:archive
```

变更被归档到 `changes/archive/`，规范增量合并到 `specs/` 中，成为新的真理源。

### 2.6 最佳实践

**1. 规范要精简**

规范不是越详细越好。好的规范应该：

- **描述行为**，而不是实现细节
- **覆盖边界情况**，而不是穷举所有路径
- **模块化拆分**，每个规范聚焦一个能力

**2. 变更粒度要适中**

- 太粗 → 任务不明确，AI 容易偏离
- 太细 → 流程繁琐，效率低下
- 推荐：**一个变更 = 一个独立功能点**

**3. 重视归档环节**

归档不只是存档，它能：

- 将增量规范合并到主规范，**持续积累项目知识**
- 为未来的变更提供参考
- 形成**可追溯的变更历史**

**4. 活用 Expanded 工作流**

当你遇到以下情况时，切换到 Expanded 模式：

- 需要**逐项审查**提案的每个部分
- 需要**验证**代码实现是否满足规范
- 需要**批量处理**多个并行变更

**5. 团队协作**

OpenSpec 的目录结构可以纳入版本控制（推荐）：

```
# .gitignore 建议
openspec/              # 纳入版本控制
openspec/changes/      # 团队可见的变更提案
```

团队成员通过 Git 共享 `openspec/`，每个人都能看到当前的变更状态和规范演进。

---

> **参考链接**
>
> - [OpenSpec GitHub 仓库](https://github.com/Fission-AI/OpenSpec) —— 官方源码与文档
> - [GitHub Blog: Spec-Driven Development](https://github.blog/engineering/devops/spec-driven-development/) —— SDD 概念起源
> - [Anthropic Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code/overview)
> - [Spec-Driven Development: 为混乱的 AI 编程增加工程纪律](https://cloud.tencent.com/developer/article/2652352)
> - [OpenSpec 进阶：从 Core 到 Expanded](https://cloud.tencent.com/developer/article/2663958)
