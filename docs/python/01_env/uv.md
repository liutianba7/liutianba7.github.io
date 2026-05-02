# uv - 高速 Python 包管理器

⭐⭐⭐uv也太爽了吧！！！！

## 一、uv 简介

uv 是 Astral 团队开发的下一代 Python 包管理器，用 Rust 编写，速度极快。`uv` 遵循的是现代 Web 开发和 Node.js (npm) 的逻辑——**“环境跟着项目走”**。这和 Conda（环境统一放在 `anaconda/envs` 下）完全不同。

| **维度**     | **Conda (全家桶式)**          | **uv (项目隔离式)**                               |
| ------------ | ----------------------------- | ------------------------------------------------- |
| **存储位置** | 集中在 `envs/` 目录下，需起名 | 默认在项目根目录 `.venv`，无需起名                |
| **激活方式** | `conda activate my_env`       | `source .venv/bin/activate` (或 PyCharm 自动识别) |
| **可移植性** | 较差，迁移需导出 yml          | 极强，删掉 `.venv` 重建只需 1 秒                  |
| **清理难度** | 容易忘记删，越积越多          | 删项目文件夹时，环境随之消失                      |

### 1.1 特点

- **极快的速度**：比 pip 快 10-100 倍
- **统一工具**：替代 pip、pip-tools、pipx、poetry、pyenv、virtualenv
- **兼容性好**：兼容 pip 命令和 PyPI 生态

### 1.2 安装

uv 默认安装在了C:\Users\liutianba7\.local\bin

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex

# 使用 pip 安装
pip install uv

# 验证安装成功
uv --version
```

### 1.3 配置下载路径

`uv` 主要有两类东西占用空间：**Python 解释器本体**（Interpreters）和**包缓存**（Cache）。可以通过设置 **环境变量** 来永久修改它们的位置。

`UV_PYTHON_INSTALL_DIR`：**Python 解释器**下载后的存放地

`UV_CACHE_DIR`：**所有 Python 包**（如 torch, fastapi）的全局缓存


---

## 二、常用命令

### 2.1 项目管理

最好还是用 uv add | remove 来下载，管理依赖，因为这样不会存在：一个依赖下载的时候，下载了 1（本体） + 4（间接依赖）个依赖，但是通过 `uv pip uninstall xxx `删除的时候，只会删除那一个依赖。

更加详细的依赖管理可以参考 [uv依赖管理](https://docs.astral.sh/uv/concepts/projects/dependencies/#multiple-sources)
```bash
# 初始化新项目
uv init myproject
cd myproject

# 初始化已有项目
uv init

# 添加依赖
uv add requests
uv add "flask>=2.0"

# 添加开发依赖
uv add --dev pytest
uv add -d black ruff

# 移除依赖
uv remove requests

# 同步依赖（根据 pyproject.toml / uv.lock）
uv sync

# 安装所有依赖（包括 dev）
uv sync --all-groups
```

### 2.2 虚拟环境

```bash
# 创建虚拟环境
uv venv [env_name]

# 删除虚拟环境
手动删除 .venv 文件夹就行

# 指定 Python 版本创建
uv venv --python 3.11
uv venv --python 3.12 myenv

# 激活环境
source .venv/bin/activate  # Linux/macOS
.venv\Scripts\activate     # Windows
```

### 2.3 运行脚本

```bash
# 直接运行脚本（自动管理临时环境）
uv run script.py

# 运行带内联依赖的脚本
uv run --with requests script.py

# 运行模块
uv run -m http.server 8000
```

### 2.4 包安装（pip 兼容模式）

```bash
# 安装包
uv pip install requests
uv pip install -r requirements.txt

# 卸载包
uv pip uninstall requests

# 列出已安装的包
uv pip list

# 导出依赖
uv pip freeze > requirements.txt
```

### 2.5 uv add 和 pip 的区别

| 操作 | pip | uv add |
|------|-----|--------|
| 安装包 | ✅ 安装到虚拟环境 | ✅ 安装到虚拟环境 |
| 记录依赖 | ❌ 需手动 `pip freeze > requirements.txt` | ✅ 自动写入 `pyproject.toml` |
| 锁定版本 | ❌ 无 | ✅ 自动生成 `uv.lock` |
| 团队同步 | 需共享 `requirements.txt`，再 `pip install -r` | 直接 `uv sync` |

**团队协作流程：**

```bash
# 开发者 A 添加依赖
uv add requests    # 自动更新 pyproject.toml + uv.lock

# 开发者 B 拉取代码后同步
uv sync            # 根据 uv.lock 安装完全一致的版本
```

💡 `uv sync` 会严格按照 `uv.lock` 安装，确保团队成员依赖版本完全一致，避免"在我机器上能跑"的问题


---

## 三、Python 版本管理

uv 的 python 版本管理比起 conda，更加现代化，更加优秀！

`uv python install 3.13` 下载到 `D:\...\Uv\Interpreters` 里的那个 Python。它是**只读**的、纯净的“种子”。

每个项目文件夹下运行 `uv venv` 创建的 `.venv`。它们是**独立**的、可随意折腾的“沙盒”。

```bash
# 列出可用的 Python 版本
uv python list

# 安装 Python 版本
uv python install 3.11
uv python install 3.12

# 卸载 Python 版本
uv python uninstall 3.13

# 查看已安装的 Python
uv python list --only-installed

# 设置项目 Python 版本
uv python pin 3.11

# 查找 Python 解释器
uv python find 3.11
```

---

## 四、工具安装（替代 pipx）

```bash
# 安装全局工具
uv tool install black
uv tool install ruff

# 运行工具（不安装）
uv tool run black .
uvx black .  # 简写形式

# 列出已安装的工具
uv tool list

# 卸载工具
uv tool uninstall black
```

---

## 五、vs 传统工具对比

| 功能 | pip/venv | uv |
|------|----------|-----|
| 安装速度 | 慢 | 极快 |
| 依赖解析 | 逐个解析 | 全局解析 |
| 锁文件 | 需要 pip-tools | 内置 uv.lock |
| Python 版本管理 | 需要 pyenv | 内置支持 |
| 项目初始化 | 手动 | uv init |
| 工具安装 | 需要 pipx | 内置 uv tool |

---

## 六、最佳实践

### 6.1 新项目推荐结构

```bash
uv init myproject
cd myproject
# 自动生成:
# ├── .python-version
# ├── pyproject.toml
# ├── uv.lock
# ├── .venv/
# └── src/
#     └── myproject/
#         └── __init__.py
```

### 6.2 从 pip 迁移

```bash
# 1. 创建新环境
uv venv

# 2. 从 requirements.txt 安装
uv pip install -r requirements.txt

# 3. 或初始化项目并迁移
uv init
uv add $(cat requirements.txt)
```

### 6.3 日常开发流程

```bash
# 添加新依赖
uv add pandas

# 运行测试
uv run pytest

# 运行项目
uv run python main.py

# 格式化代码
uv tool run ruff format .
```