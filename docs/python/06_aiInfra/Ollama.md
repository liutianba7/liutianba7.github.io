#### Ollama 介绍

**Ollama** 是一个开源的本地大语言模型（LLM）运行框架，让你能够在自己的电脑上轻松运行各种开源模型（如 Llama、Mistral、Qwen 等）。它的核心理念是：**简单、快速、隐私**。

**核心优势**：

| 优势 | 说明 |
|------|------|
| **完全本地运行** | 数据不离开本机，保护隐私 |
| **无需 GPU** | 支持 CPU 运行（有 GPU 更快） |
| **一行命令启动** | 极简的 CLI 设计 |
| **OpenAI 兼容 API** | 提供标准 HTTP 接口，方便接入各种应用 |
| **模型生态丰富** | 支持 Llama、Mistral、Qwen、DeepSeek 等主流模型 |

---

#### Ollama 安装与配置

##### 1. 下载安装

**Windows**

1. 官网下载安装包：https://ollama.com/download
2. 双击安装，默认安装到 `C:\Users\<用户名>\AppData\Local\Programs\Ollama`

**自定义安装路径（命令行安装）**：

```bash
# 使用 /DIR 参数指定安装目录
OllamaSetup.exe /DIR=D:\02_DevStack\09_AI\Ollama
```

##### 2. 配置模型存放路径

默认情况下，模型文件存放在：

- **Windows**: `C:\Users\<用户名>\.ollama\models`
- **macOS/Linux**: `~/.ollama/models`

模型文件较大（几 GB 到几十 GB），建议修改到空间充足的位置：

**Windows 设置环境变量**：

```powershell
# 方式1：PowerShell 临时设置（当前会话有效）
$env:OLLAMA_MODELS="D:\02_DevStack\09_AI\OllamaModels"

# 方式2：系统环境变量（永久有效）
# 设置 → 系统 → 关于 → 高级系统设置 → 环境变量
# 新建系统变量：OLLAMA_MODELS = D:\02_DevStack\09_AI\OllamaModels
```

注意💡：我改环境变量失效啊，但是可以直接在 ollama 的设置里边配置模型存放位置。
##### 3. 验证安装

```bash
# 查看版本
ollama --version

# 查看帮助
ollama --help
```

##### 4. 常用环境变量配置

| 环境变量 | 说明 | 示例 |
|---------|------|------|
| `OLLAMA_MODELS` | 模型文件存放路径 | `D:\OllamaModels` |
| `OLLAMA_HOST` | 服务监听地址 | `0.0.0.0`（允许外部访问） |
| `OLLAMA_PORT` | 服务端口 | `11434`（默认） |
| `OLLAMA_NUM_PARALLEL` | 并发请求数 | `4` |
| `OLLAMA_MAX_LOADED_MODELS` | 同时加载模型数 | `2` |

**配置示例（Windows 系统变量）**：

```
OLLAMA_MODELS = D:\02_DevStack\09_AI\OllamaModels
OLLAMA_HOST = 0.0.0.0
OLLAMA_PORT = 11434
```

> ⚠️ **注意**：修改环境变量后需要**重启 Ollama 服务**才能生效。

##### 5. 启动 Ollama 服务

**Windows/macOS**：
安装后自动在后台运行，系统托盘可见 Ollama 图标。

**Linux/手动启动**：

```bash
# 后台启动
ollama serve
```

**验证服务是否运行**：

```bash
# 测试 API 是否可用
curl http://localhost:11434/api/tags
```

#### Ollama 常用命令

| 命令                                    | 说明                   |
| ------------------------------------- | -------------------- |
| `ollama pull llama3`                  | 下载指定模型（例：llama3）     |
| `ollama run llama3`                   | 启动并进入该模型交互对话         |
| `ollama list`                         | 列出本机已下载的所有模型         |
| `ollama rm llama3`                    | 删除不再需要的模型以节省磁盘       |
| `ollama cp llama3 my-llama3`          | 本地复制/重命名模型           |
| `ollama show llama3`                  | 查看模型详细信息（参数、大小等）     |
| `ollama create my-model -f Modelfile` | 用自定义 Modelfile 构建新模型 |
| `ollama serve`                        | 启动后台服务，供 API 调用      |
| `ollama ps`                           | 查看当前正在运行的模型进程        |
| `ollama stop llama3`                  | 停止正在运行的模型            |
