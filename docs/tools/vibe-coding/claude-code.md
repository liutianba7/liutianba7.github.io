---
title: Claude Code 学习笔记
description: 从入门到实践，系统学习 Claude Code 的使用、CLAUDE.md 配置与 Skills 技能系统
---

# Claude Code 学习笔记

---

## 第一章：认识 Claude Code

### 1.1 什么是 Claude Code

**Claude Code** 是 Anthropic 推出的**终端原生（Terminal-Native）AI 编码代理工具**，它把 Claude 的能力直接带到命令行中，让你在不离开终端的情况下完成整个开发工作流。

与 Claude 其他形态的关系：

| 形态 | 定位 | 适用场景 |
|------|------|---------|
| **Claude Code（CLI）** | 终端自主 Agent | 复杂编码任务、多文件重构、Git 工作流 |
| **Claude.ai（Web）** | 对话助手 | 问答、代码片段生成、文档理解 |
| **VS Code 扩展** | IDE 内联助手 | 编辑器内补全、代码审查 |

> 如果说 Web 端 Claude 是"顾问"，那 Claude Code 就是**能直接上手干活的工程师**——它不只是回答问题，而是读代码、写代码、跑命令、提交 PR，一整套流程都能自主完成。

!!! tip "核心定位"

    Claude Code 的核心理念是 **Agentic Coding**——不再是"你问一句它答一句"的对话模式，而是给它一个目标，让它自主规划、执行、验证、修正，直到达成目标。

---

### 1.2 核心能力一览

**代码库全量感知**

Claude Code 能读取整个代码库（不限于单个文件），理解项目结构、模块依赖关系、配置文件等全局上下文。这意味着它知道 `UserService` 在哪里定义、`config.yaml` 里有什么配置、测试框架用的是 pytest 还是 Jest。

**多文件编辑**

一次请求即可跨多个文件进行修改 —— 重构接口、迁移组件、批量修改导入路径，都不需要你手动一个个打开文件。

**Shell 命令执行 & Git 工作流**

Claude Code 可以直接在终端中执行命令、运行测试、查看输出，并根据结果自动修正代码。同时它内置了完整的 Git 工作流支持：

- `claude commit` —— 自动生成规范的 commit message
- `claude pr create` —— 创建 Pull Request
- 自动处理分支、合并等操作

**Agent Teams**（v2.0+，2025.12）

多 Agent 并行协作 —— 主 Agent 可以将子任务分发给多个子 Agent 并行执行，每个子 Agent 拥有独立的上下文窗口和工具权限，最后汇总结果。

!!! tip "Agent Teams 的典型场景"

    比如重构一个大型模块：一个子 Agent 负责重构核心逻辑，另一个子 Agent 负责同步更新单元测试，第三个子 Agent 负责更新文档——三者并行推进，效率倍增。

**Computer Use**（2026.03）

Claude Code 可以直接**从 CLI 操控你的电脑** —— 打开浏览器截图验证 UI、启动桌面应用测试、拖拽文件等。这为实现**全无人值守的自主开发**铺平了道路。

!!! warning "Computer Use 安全机制"

    - 单会话锁定（单个会话只能控制一个屏幕）
    - 每个应用首次访问需授权
    - 按 Esc 键可立即停止
    - 终端窗口本身不会被截图（避免泄露敏感信息）

---

### 1.3 安装与初始化

**前置条件**

- Node.js 18+（推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理版本）
- 一个 Anthropic API Key 或 Claude Pro/Max 订阅

**安装**

=== "npm（推荐）"

    ```bash
    npm install -g @anthropic-ai/claude-code
    ```

=== "直接运行（无需安装）"

    ```bash
    npx @anthropic-ai/claude-code
    ```

**初次运行与认证**

```bash
# 启动会话
claude

# 首次运行会提示登录 Anthropic 账号
# 按提示完成 OAuth 认证即可
```

!!! tip "配置 API Key"

    如果你使用的是 API Key 模式，可以通过环境变量配置：

    ```bash
    export ANTHROPIC_API_KEY="your-api-key-here"
    ```

    或者使用 `claude config set` 持久化配置。

**快速初始化项目**

```bash
# 进入你的项目目录
cd my-project

# 启动 Claude Code
claude

# 在对话中运行 /init
# Claude 会自动分析项目结构，生成一个 CLAUDE.md 文件
```

`/init` 命令会帮你做三件事：

1. 扫描项目目录结构
2. 检测项目使用的语言、框架、构建工具
3. 生成包含构建命令、测试命令、项目结构概览的 `CLAUDE.md` 文件

---

### 1.4 基础使用

**会话管理**

| 操作 | 命令 | 说明 |
|------|------|------|
| 启动会话 | `claude` | 在当前目录启动新会话 |
| 暂停退出 | `Ctrl+C` / `/exit` | 保存会话状态后退出 |
| 恢复会话 | `claude --resume` | 恢复上次未完成的会话 |
| 指定模型 | `claude --model opus` | 使用 Opus 模型启动 |

**常用 Slash 命令**

| 命令 | 作用 | 使用场景 |
|------|------|---------|
| `/clear` | 清空对话上下文 | 开始新任务，避免旧上下文干扰 |
| `/compact` | 压缩上下文 | 上下文快满时，压缩节省 token |
| `/resume` | 恢复上次会话 | 中断后继续未完成的工作 |
| `/status` | 查看当前会话状态 | 了解当前上下文使用情况 |
| `/cost` | 查看 token 消耗 | 估算本次会话的费用 |
| `/commit` | 生成 commit message | 一键生成符合规范的提交信息 |
| `/plan` | 进入规划模式 | 让 Claude 先出方案再执行 |
| `/diff` | 查看修改差异 | 审查 Claude 做的修改 |
| `/rewind` | 回退到上一步 | 取消上一次操作 |
| `/memory` | 编辑记忆内容 | 查看或更新 CLAUDE.md |
| `/doctor` | 诊断问题 | 排查配置或连接问题 |

!!! tip "在终端外使用"

    Claude Code 也可以用在 CI/CD 场景：

    ```bash
    # 非交互模式（静默执行）
    claude --print "Add error handling to all API routes"

    # 指定输出格式
    claude --output json --print "List all TODO comments"
    ```

---

### 1.5 cc-switch —— 多供应商切换工具

由于 Claude Code 官方只支持通过 Anthropic 官方 API 或订阅使用，社区中涌现了一批名为 **cc-switch** 的工具，用于**切换不同的 API 供应商或配置文件**。

**项目推荐**

| 项目 | 类型 | GitHub |
|------|------|--------|
| **cc-switch**（原版） | 桌面应用（Tauri） | [farion1231/cc-switch](https://github.com/farion1231/cc-switch) |
| **cc-switch**（CLI 版） | 命令行工具 | [HoBeedzc/cc-switch](https://github.com/HoBeedzc/cc-switch) |
| **cc-switch-cli** | 全功能 CLI 工具 | [SaladDay/cc-switch-cli](https://github.com/SaladDay/cc-switch-cli) |

**核心功能**

- 管理多个 API 供应商配置（URL + Token）
- 一键切换当前使用的供应商
- 支持配置文件备份与恢复
- 部分工具还支持 MCP 管理和 Skills 管理

!!! tip "cc-switch CLI 快速上手"

    ```bash
    # 安装（以 HoBeedzc 版为例）
    npm install -g @hobeeliu/cc-switch

    # 添加一个供应商配置
    cc-switch add

    # 列出所有配置
    cc-switch list

    # 切换到指定配置
    cc-switch use <profile-name>
    ```

!!! warning "安全提醒"

    使用第三方 cc-switch 工具时，注意确认其开源代码的安全性，避免 API Key 泄露。

---

## 第二章：CLAUDE.md

### 2.1 为什么要写 CLAUDE.md

你有没有这样的困扰：

明明已经和 Claude Code 说了"代码要写注释、用英文、变量命名用驼峰"，但重新打开会话之后，它还是我行我素，完全不记得你之前的要求。

这是因为 **Claude Code 的每次会话都是无状态的**——关闭终端后，AI 的记忆就会清空，它不会记住你们对话过的任何要求。

**CLAUDE.md 就是来解决这个问题的。**

它是一个 Markdown 文件，用于写入你对 AI 的各种要求和项目规范。每次启动会话时，Claude Code 会自动读取它，就像给一个新入职的同事发了一本**员工手册**。

!!! quote ""

    CLAUDE.md 不只是一个配置文件，它其实是 **AI 编程时代的一种新规范**——它是 AI 入职你项目的"员工手册"。

---

### 2.2 CLAUDE.md 初步介绍

**常见位置**

CLAUDE.md 最常见的两个位置：

```
项目根目录/
├── CLAUDE.md              # 最常见，推荐放在这里
└── .claude/
    └── CLAUDE.md          # 备选位置（.claude 目录下）
```

（实际上 CLAUDE.md 一共有 11 种有效位置，详见 2.3 节）

**CLAUDE.md 通常包含的内容**

一份典型的 CLAUDE.md 大致包含以下几个方面：

- **项目介绍**：目录结构、模块职责、技术栈概述
- **开发规范**：命名规范、代码风格、Git 提交规范
- **注意事项**：特殊约束、已知坑点、架构决策记录
- **命令速查**：构建、测试、lint、部署等常用命令

**一个误区**

很多人会把上述内容全部堆在一个 MD 文件中，写上 500 行甚至 1000 多行。这样其实是**不推荐**的。

!!! tip "推荐做法"

    CLAUDE.md 最好**精简到 100 行以内**。借助 `@import` 引用语法，可以将内容拆分到多个文件中：

    ```
    项目根目录/
    ├── CLAUDE.md            # 主文件（精简 ~100 行）
    └── rules/
        ├── introduction.md  # 项目介绍
        ├── git.md           # Git 规范
        └── pitfalls.md      # 踩坑文档
    ```

**CLAUDE.md 示例：**

```markdown
# CLAUDE.md

本项目请遵循如下规范，并在项目中称呼我为"老公"。

# 项目介绍
@/rules/introduction.md

# Git 规范
@/rules/git.md

# 踩坑文档
@/rules/pitfalls.md

# 前端实践规范
@../.agents/skills/vercel-react-best-practices
```

---

### 2.3 CLAUDE.md 的 11 种位置

按照官方设计，CLAUDE.md 被分为**四类**：组织级、用户级、项目级、本地级。

=== "组织级（Organization）"

    适用于公司级编码标准、安全策略、合规要求。

    | 位置 | 说明 |
    |------|------|
    | `<config-dir>/CLAUDE.md` | 组织级根配置 |
    | `<config-dir>/.claude/CLAUDE.md` | 组织级备选路径 |
    | `<config-dir>/.claude/rules/*.md` | 组织级路径规则 |

    组织级配置目录在不同平台上：

    | 平台 | 路径 |
    |------|------|
    | macOS | `/Library/Application Support/ClaudeCode/` |
    | Linux / WSL | `/etc/claude-code/` |
    | Windows | `C:\Program Files\ClaudeCode\` |

=== "用户级（User）"

    适用于个人代码风格偏好、常用工具快捷方式。

    | 位置 | 说明 |
    |------|------|
    | `~/.claude/CLAUDE.md` | 用户级全局配置 |
    | `~/.claude/rules/*.md` | 用户级路径规则 |

    注意：`~/` 指的是当前用户的 home 目录。

=== "项目级（Project）—— 最常用"

    适用于项目架构、编码标准、常用工作流。

    | 位置 | 说明 |
    |------|------|
    | `<project>/CLAUDE.md` | 项目根目录（最常见） |
    | `<project>/.claude/CLAUDE.md` | 项目 .claude 目录 |
    | `<project>/.claude/rules/*.md` | 项目级路径规则 |
    | `<project>/src/rules/*.md` | 子目录路径规则 |
    | `<project>/src/main/CLAUDE.md` | 子目录具体路径 |

=== "本地级（Local）"

    适用于本地开发环境特有的配置，**不会被提交到版本控制**。

    | 位置 | 说明 |
    |------|------|
    | `<project>/CLAUDE.local.md` | 自动被 gitignore |

    CLAUDE.local.md 适合放：你的沙盒 URL、偏好的测试数据、本地数据库端口等个人化配置。

---

### 2.4 CLAUDE.md 加载顺序与优先级

**加载顺序**

Claude Code 会从**当前工作目录（CWD）开始，向上遍历目录树**，检查沿途每个目录中的 CLAUDE.md 文件。所有发现的文件会被**拼接到上下文**，而不是互相覆盖。

!!! warning "不是覆盖，是叠加"

    多份 CLAUDE.md 是**叠加关系**（append），不是覆盖关系（override）。后加载的文件内容会追加在前面文件的后面。

**优先级规则**

```
优先级低  ←──────────────────────────────────→  优先级高

组织级 → 用户级 → 根目录 → ... → 子目录 → .claude/rules/*.md → CLAUDE.local.md
```

具体来说：

1. **组织级** CLAUDE.md 最先加载（优先级最低）
2. **用户级** CLAUDE.md 其次
3. 从**根目录到 CWD** 逐级加载项目级 CLAUDE.md
4. 同一目录下：`CLAUDE.md` → `.claude/CLAUDE.md` → `.claude/rules/*.md`
5. **`CLAUDE.local.md`** 最后加载（优先级最高）

**关键细节**

| 特性 | 说明 |
|------|------|
| `.claude/rules/*.md` vs `.claude/CLAUDE.md` | rules 优先级更高（后加载） |
| `CLAUDE.local.md` | 同一目录下优先级最高 |
| 所有文件 | 拼接叠加，不覆盖 |

!!! tip "记住这张图就够了"

    如果整篇文章只记住一张图，那就是这个加载顺序：

    ```
    根 ←────────────────── CWD（当前目录）
    高 ←── 优先级 ──→ 低     高 ←── 优先级 ──→ 低
    org → user → [CLAUDE.md → .claude/CLAUDE.md → rules/*.md → CLAUDE.local.md] × 每层目录
    ```

**注意事项**

CLAUDE.md 的加载顺序是通过**提示词约束**来实现的，而不是程序级硬约束。所以 AI 有时可能不完全遵守（比如被越狱的情况）。相信后续 AI 能力越来越强之后，约束会越来越稳定。

---

### 2.5 `.claude/rules/*.md` —— 路径规则系统

你在 2.3 和 2.4 节多次看到 `.claude/rules/*.md` 这个路径，那它到底是干什么的？

#### 它是什么

`.claude/rules/*.md` 是 **路径作用域规则文件**——每个规则文件通过 YAML frontmatter 中的 `paths` 字段声明自己匹配哪些文件路径，只有当 Claude 当前处理的文件路径匹配时，该规则才会被加载。

!!! tip "一句话理解"

    `CLAUDE.md` 是**全局员工手册**（所有人入职都得读），而 `.claude/rules/*.md` 是**岗位说明书**（干前端的人不需要看后端的规范）。

#### 与 CLAUDE.md 的核心区别

| 对比维度 | `CLAUDE.md` | `.claude/rules/*.md` |
|---------|-------------|---------------------|
| **加载时机** | 会话启动时全部加载 | 按路径匹配，**按需加载** |
| **token 消耗** | 固定消耗（内容多就贵） | **不匹配就不加载**，0 消耗 |
| **作用范围** | 整个项目全局适用 | 限定到特定目录/文件模式 |
| **组织结构** | 单个文件或 `@import` 拆分 | 多文件，每个文件管一块 |

#### 怎么用 —— 实战示例

假设你的项目是 monorepo，包含前端、后端、脚本三部分：

```
my-monorepo/
├── .claude/
│   └── rules/
│       ├── frontend.md          # 只对前端代码生效
│       ├── backend.md           # 只对后端代码生效
│       └── commit-prompt.md     # 对 Git 操作生效
├── frontend/
│   └── src/**/*.tsx
├── backend/
│   └── src/main/java/**/*.java
└── scripts/
    └── *.py
```

**frontend.md：**

```yaml
---
description: Vue 3 + TypeScript 前端编码规范
paths:
  - frontend/src/**/*.ts
  - frontend/src/**/*.tsx
  - frontend/src/**/*.vue
---
# 前端规范
- 使用 Composition API，不使用 Options API
- 组件文件名使用 PascalCase，如 `UserProfile.vue`
- Tailwind 优先，避免写原生 CSS
- 所有 API 调用走 `useRequest` 封装
```

**backend.md：**

```yaml
---
description: Spring Boot 后端编码规范
paths:
  - backend/src/main/java/**/*.java
  - backend/src/main/resources/**/*.yml
---
# 后端规范
- Controller 层只做参数校验和路由转发
- Service 层必须写单元测试
- 数据库查询使用 MyBatis Plus，不写原生 SQL
```

**commit-prompt.md：**

```yaml
---
description: Git commit 规范
paths:
  - .git/HEAD
  - .git/index
---
# Git 提交流程
1. `git diff --cached` 查看暂存区
2. 按 Conventional Commits 规范生成 message
3. 格式：`type(scope): description`
```

!!! tip "`paths` 匹配技巧"

    `paths` 使用的是 glob 模式匹配，常用模式：

    | 模式 | 匹配目标 |
    |------|---------|
    | `src/**/*.ts` | src 下所有 .ts 文件（含子目录）|
    | `**/*.test.ts` | 项目中所有测试文件 |
    | `docker-compose*.yml` | 所有 docker-compose 文件 |
    | `!src/generated/**` | **排除**自动生成的目录 |
    | `.git/HEAD` | Git 操作时触发（commit/merge 等）|

#### 多层级叠加

不同层级目录下的 rules 会叠加生效。加载时找到**所有**匹配当前文件路径的规则文件，拼接到一起：

```
项目根目录/.claude/rules/global.md        # paths: ["**/*.java"]
项目根目录/module-a/.claude/rules/module-a.md  # paths: ["module-a/**/*.java"]
```

当你在 `module-a/` 下编辑 Java 文件时，**两个规则文件都会被加载**。

#### 使用场景总结

- **按语言/框架拆分**：Java 规则、Python 规则、前端规则互不干扰
- **按目录拆分**：每个模块有自己的编码约定
- **按操作类型拆分**：编码规则 vs Git 提交流程 vs 部署检查
- **团队级 + 个人级叠加**：项目级 rules（入版本控制）+ 用户级 rules（`~/.claude/rules/`，个人偏好）

!!! warning "CLAUDE.md vs rules 的定位选择"

    可以用这个标准来判断：

    - 这条规范**所有文件都适用** → 放 `CLAUDE.md`
    - 这条规范**只在特定目录/文件适用** → 放 `.claude/rules/*.md` 并用 `paths` 限定
    - 可以无脑全放 CLAUDE.md，但项目大了之后 token 浪费很可观

---

### 2.6 进阶用法

#### @import 引用语法

CLAUDE.md 支持通过 `@` 符号引用其他文件，将内容拆分管理：

```markdown
# 引用项目内文件
@/rules/introduction.md       # 绝对路径（从项目根目录）
@../shared/config.md          # 相对路径

# 引用目录（等同于引用目录下的所有文件）
@/rules/

# 引用 Skills
@../.agents/skills/vercel-react-best-practices
```

!!! tip "引用限制"

    - **递归深度上限**：5 层（`MAX_INCLUDE_DEPTH = 5`）
    - 不存在的 `@import` 不会报错，会**静默忽略**
    - 这对于把大文件拆分成小模块非常有用

#### 动态注入语法

CLAUDE.md 支持通过 `` !`command` `` 语法在加载时执行 Shell 指令，将结果动态注入：

```markdown
# CLAUDE.md

## 项目规范
...

## 当前时间
!`date '+%Y-%m-%d %H:%M:%S %Z'`

## 当前分支
!`git branch --show-current`
```

这在你需要**动态信息**（如时间、分支名、环境变量）时非常有用。

#### HTML 注释剥离

块级 HTML 注释会在加载时被悄悄删除，AI 看不到：

```markdown
<!-- 这段是给人类看的开发说明，不希望 AI 看到 -->
<!-- 比如：TODO 清单、遗留问题、内部备注 -->

# 项目规范
...
```

!!! tip "实用场景"

    可以在 CLAUDE.md 里写一些**纯给协作者看的注释**，AI 在读取时会自动忽略这些内容。

#### 单文件字符上限

CLAUDE.md 单文件有 **40000 字符** 的软上限。超过这个大小的文件仍然会被加载，但会被标记为"大文件"单独处理。

---

### 2.7 写 CLAUDE.md 的小技巧

**技巧一：简洁清晰**

不要写多余的话。你越简洁清晰，AI 越容易理解。同一个意思：

```
❌ 我建议你在进行代码编写的时候，尽可能地使用清晰明确的命名方式

✅ 变量命名使用驼峰风格
```

**技巧二：用"称呼"测试 AI 是否记得规则**

可以在 CLAUDE.md 中写上：

```markdown
请在后续的对话中用"老公"来称呼我
```

如果 AI 在长上下文中忘记了，说明它在长对话中出现了"规则漂移"——这是检验 CLAUDE.md 约束力的一种有趣方式。

**技巧三：渐进式披露**

不要把所有信息都塞到 CLAUDE.md 中。CLAUDE.md 最好只保持 **100 行以内**，详细内容用 `@import` 拆分到子文件中。

**技巧四：不要依赖 `/init` 自动化生成**

`/init` 生成的 CLAUDE.md 只是一个**粗糙的模板**。真正好用的 CLAUDE.md 需要你**自己花时间去思考和沉淀**——只有你最了解项目的痛点和规范。

**技巧五：官方建议的添加时机**

可以把 CLAUDE.md 当成记录那些你原本需要反复解释内容的地方。以下情况适合添加：

- Claude **第二次**犯同样的错误
- 代码审查发现了 Claude 本该了解的代码库事项
- 你在本次会话中输入了和上次相同的纠正或澄清
- 新队友也需要同样的上下文才能高效工作

---

### 2.8 热门项目推荐：andrej-karpathy-skills

在 CLAUDE.md 领域，有一个 GitHub 项目非常值得关注：

> **andrej-karpathy-skills** —— 124k+ star 的 CLAUDE.md 单文件项目
>
> GitHub 地址：<https://github.com/forrestchang/andrej-karpathy-skills>

这个项目的核心只有**一个 CLAUDE.md 文件**，却获得了超过 12 万 Star。它的内容是 Karpathy 风格的行为准则，用于减少常见 LLM 编码错误。

**核心准则速览：**

```markdown
# CLAUDE.md  
  
用于减少常见 LLM 编码错误的行为准则。可根据需要与项目特定指令合并使用。  
  
权衡：这些准则更偏向谨慎而不是速度。对于非常简单的任务，请自行判断。  
  
## 1. 写代码前先思考  
  
不要假设。不要掩盖困惑。把权衡说清楚。  
  
在实现之前：  
  
明确说明你的假设。如果不确定，就提问。    
如果存在多种理解方式，把它们列出来，不要默默选择其中一种。    
如果有更简单的方案，要说出来。必要时应提出反对意见。    
如果有不清楚的地方，就停下来。说明哪里令人困惑，然后提问。  
  
## 2. 简单优先  
  
用最少的代码解决问题。不要做 speculative 的东西。  
  
不要实现用户没有要求的功能。    
不要为只用一次的代码抽象。    
不要添加未被要求的“灵活性”或“可配置性”。    
不要为不可能发生的场景添加错误处理。    
如果你写了 200 行，但其实 50 行就能解决，那就重写。    
问问自己：“资深工程师会不会觉得这过度复杂？”如果会，那就简化。  
  
## 3. 精确修改  
  
只改必须改的地方。只清理你自己造成的问题。  
  
编辑现有代码时：  
  
不要顺手“改进”相邻代码、注释或格式。    
不要重构没有坏掉的东西。    
匹配现有风格，即使你自己会用不同方式写。    
如果发现无关的死代码，提出来，但不要删除它。  
  
当你的修改产生了孤立代码时：  
  
删除因你的修改而变成未使用的 import、变量或函数。    
不要删除原本就存在的死代码，除非用户要求。  
  
检验标准：每一行被修改的代码都应该能直接追溯到用户的请求。  
  
## 4. 目标驱动执行  
  
定义成功标准。循环处理，直到验证通过。  
  
把任务转化为可验证的目标：  
  
“添加校验” → “为非法输入写测试，然后让测试通过”    
“修复 bug” → “写一个能复现 bug 的测试，然后让测试通过”    
“重构 X” → “确保重构前后测试都通过”  
  
对于多步骤任务，先给出一个简短计划：  
  
1. [步骤] → 验证：[检查项]  
2. [步骤] → 验证：[检查项]  
3. [步骤] → 验证：[检查项]  
  
强成功标准能让你独立循环推进。弱标准，比如“让它能用”，会导致不断需要澄清。  
  
如果这些准则有效，你会看到：diff 中不必要的修改更少，因为过度复杂导致的重写更少，澄清问题会发生在实现之前，而不是犯错之后。
```

!!! tip "使用建议"

    这个 CLAUDE.md 文件可以直接作为你项目 CLAUDE.md 的**基础模板**，再结合你的项目特色进行定制。其核心思想是**让 AI 更谨慎、更专注、更精确**。

---

> **参考链接**
>
> - [Anthropic Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code/overview)
> - [CLAUDE.md: The Complete Guide (2026)](https://www.morphllm.com/claude-md-guide)
> - [Anthropic 帮助中心 — 为 Claude 提供上下文](https://support.claude.com/zh-CN/articles/14553240-%E4%B8%BAclaude%E6%8F%90%E4%BE%9B%E4%B8%8A%E4%B8%8B%E6%96%87-claude-md%E5%92%8C%E6%9B%B4%E5%A5%BD%E7%9A%84%E6%8F%90%E7%A4%BA%E8%AF%8D)
> - [Claude Code Extensions: MCP, Skills, Agents & Hooks](https://www.morphllm.com/claude-code-extensions)
> - [cc-switch (GitHub)](https://github.com/farion1231/cc-switch)
> - [cc-switch CLI (GitHub)](https://github.com/HoBeedzc/cc-switch)
> - [andrej-karpathy-skills (GitHub)](https://github.com/forrestchang/andrej-karpathy-skills)
> - [Claude Code 泄露源码分析](https://github.com/NanmiCoder/cc-haha)
