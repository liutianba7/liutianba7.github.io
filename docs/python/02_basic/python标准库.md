## pathlib — 面向对象的路径操作

> 官方文档：[pathlib — Object-oriented filesystem paths](https://docs.python.org/3/library/pathlib.html)

用面向对象的方式处理文件和目录路径，跨平台兼容，替代传统的 `os.path` 字符串拼接。核心类是 `Path`，分为 `PurePath`（纯路径计算，不访问文件系统）和 `Path`（实际操作文件系统）两大类。

### 路径构建

用 `/` 运算符拼接路径，自动处理不同操作系统的分隔符。

```python
from pathlib import Path

# 拼接路径
p = Path("data") / "subdir" / "file.txt"
# 结果: data/subdir/file.txt  (Windows 下自动转为 \)

# 从字符串创建
absolute = Path("/home/user/docs")       # 绝对路径
relative = Path("./config.yaml")         # 相对路径
```

### 路径信息查询

```python
p.exists()          # 文件/目录是否存在
p.is_file()         # 是否为文件
p.is_dir()          # 是否为目录
p.parent            # 父目录: data/subdir
p.parents           # 所有祖先目录的迭代器
p.name              # 文件名: file.txt
p.stem              # 不带扩展名: file
p.suffix            # 扩展名: .txt
p.resolve()         # 转为绝对路径（解析符号链接）
```

### 目录遍历

```python
# 列出当前目录所有条目
for item in Path(".").iterdir():
    print(item.name)

# 递归查找所有 .py 文件
for py_file in Path(".").glob("**/*.py"):
    print(py_file)

# rglob 等价于 glob("**/*")
Path(".").rglob("*.md")
```

### 文件读写

一行代码完成读写，无需手动 `open/close`。

```python
# 文本
content = p.read_text(encoding="utf-8")
p.write_text("hello world")

# 二进制
data = p.read_bytes()
p.write_bytes(b"\x00\x01")
```

### 创建与删除

```python
# 创建目录（parents=True 自动创建父目录）
p.parent.mkdir(parents=True, exist_ok=True)

p.touch()           # 创建空文件
p.unlink()          # 删除文件
p.rmdir()           # 删除空目录
```

---

## re — 正则表达式

> 官方文档：[re — Regular expression operations](https://docs.python.org/3/library/re.html)

提供正则表达式匹配、提取、替换功能。核心函数有 `match`（从头匹配）、`search`（任意位置匹配）、`findall`（查找所有）、`sub`（替换）。频繁使用的模式建议用 `re.compile()` 预编译提升性能。

### 常用正则语法速查

**字符类**

| 语法       | 含义                 | 示例                   |
| -------- | ------------------ | -------------------- |
| `\d`     | 数字                 | `\d\d\d` → `123`     |
| `\w`     | 字母、数字、下划线          | `\w+` → `hello`      |
| `\s`     | 空白字符（空格、制表符、换行）    | `a\sb` → `a b`       |
| `.`      | 任意字符（除换行外）         | `a.c` → `abc`, `a#c` |
| `[abc]`  | 字符集合，匹配其中之一        | `[aeiou]` → 任一元音字母   |
| `[a-z]`  | 字符范围               | `[A-Z]` → 任一大写字母     |
| `[^abc]` | 否定集合，匹配**不**在其中的字符 | `[^0-9]` → 非数字       |

**量词**

| 语法      | 含义       | 示例                               |
| ------- | -------- | -------------------------------- |
| `*`     | 0 次或多次   | `ab*c` → `ac`, `abc`, `abbbc`    |
| `+`     | 1 次或多次   | `ab+c` → `abc`, `abbc`（不匹配 `ac`） |
| `?`     | 0 次或 1 次 | `ab?c` → `ac`, `abc`             |
| `{n}`   | 恰好 n 次   | `\d{4}` → `2024`                 |
| `{n,m}` | n 到 m 次  | `\d{2,4}` → `12`, `123`, `1234`  |
| `{n,}`  | 至少 n 次   | `a{2,}` → `aa`, `aaa`, `aaaa`... |

> 量词默认**贪婪**匹配（尽可能多），在后面加 `?` 变为**非贪婪**：`.*?`、`+?`

**边界与分组**

| 语法              | 含义            |
| --------------- | ------------- |
| `^`             | 字符串开头         |
| `$`             | 字符串结尾         |
| `\b`            | 单词边界          |
| `()`            | 捕获分组，提取子匹配    |
| `(?P<name>...)` | 命名分组          |
| `(?:...)`       | 非捕获分组（只分组不提取） |
| `a\|b`          | 选择，匹配 a 或 b   |

### 匹配与搜索

```python
import re

# search：在字符串任意位置查找，返回第一个匹配对象
result = re.search(r"\d+", "订单号 12345")
print(result.group())   # 12345

# match：仅从字符串开头匹配
result = re.match(r"hello", "hello world")
print(result.group())   # hello

# fullmatch：要求整个字符串完全匹配
result = re.fullmatch(r"\d{4}", "2024")
print(bool(result))     # True
```

### 提取与分组

```python
# findall：返回所有匹配结果的列表
phones = re.findall(r"\d{11}", "电话:13800138000, 13900139000")
# ['13800138000', '13900139000']

# 分组提取：用 () 捕获子模式
m = re.search(r"(\d{4})-(\d{2})-(\d{2})", "今天是 2024-03-15")
print(m.group(1))   # 2024
print(m.group(2))   # 03
print(m.groups())   # ('2024', '03', '15')

# 命名分组：可读性更好
m = re.search(r"(?P<year>\d{4})-(?P<month>\d{2})", "2024-03")
print(m.group("year"))   # 2024
```

### 替换

```python
# sub：替换所有匹配项
text = re.sub(r"\s+", "-", "hello   world  python")
# 'hello-world-python'

# subn：返回替换后的字符串和替换次数
text, count = re.subn(r"apple", "orange", "apple and apple")
# ('orange and orange', 2)

# 用函数做动态替换
def upper(match):
    return match.group().upper()

re.sub(r"[a-z]+", upper, "hello world")
# 'HELLO WORLD'
```

### 分割

```python
# split：按正则分割字符串
re.split(r"[,;]\s*", "apple, banana; cherry")
# ['apple', 'banana', 'cherry']
```

### 预编译模式

```python
# 频繁使用的模式建议预编译，避免重复解析
EMAIL_RE = re.compile(r"^[\w.-]+@[\w.-]+\.\w+$")

emails = ["user@example.com", "invalid", "test@site.org"]
for e in emails:
    if EMAIL_RE.match(e):
        print(f"{e} ✓")
```

### 常用标志

```python
# re.IGNORECASE：忽略大小写
re.findall(r"python", "Python PYTHON python", re.IGNORECASE)
# ['Python', 'PYTHON', 'python']

# re.MULTILINE：^ 和 $ 匹配每行的开头结尾
re.findall(r"^\d", "1. 第一\n2. 第二", re.MULTILINE)
# ['1', '2']

# re.DOTALL：. 可以匹配换行符
re.search(r"a.*b", "a\nb", re.DOTALL)
```

---

## sys — Python 运行时系统

> 官方文档：[sys — System-specific parameters and functions](https://docs.python.org/3/library/sys.html)

提供对 Python 解释器本身变量和函数的访问，用于控制运行时行为、获取环境信息、处理命令行参数等。

### 命令行参数

```python
import sys

# sys.argv 是命令行参数列表，第一个元素是脚本名
# python script.py arg1 arg2
print(sys.argv)   # ['script.py', 'arg1', 'arg2']
```

### 标准输入输出

```python
# 标准输出 / 错误输出
sys.stdout.write("hello\n")
sys.stderr.write("error occurred\n")

# 标准输入（逐行读取，Ctrl+D/Z 结束）
for line in sys.stdin:
    print(f"你输入了: {line.strip()}")
```

### 模块搜索路径

```python
# sys.path 是 Python 查找模块的目录列表
print(sys.path)

# 临时添加模块路径
sys.path.insert(0, "/my/custom/modules")
```

### 退出程序

```python
# 正常退出，状态码 0
sys.exit(0)

# 异常退出，状态码非 0
sys.exit(1)
sys.exit("出错了：缺少配置文件")  # 直接打印错误信息后退出
```

### 平台信息

```python
sys.platform        # 'win32' / 'linux' / 'darwin'
sys.version         # Python 版本字符串
sys.version_info    # 版本元组: sys.version_info(major=3, minor=12, ...)

# 根据操作系统做不同处理
if sys.platform == "win32":
    print("Windows 系统")
elif sys.platform == "linux":
    print("Linux 系统")
```

### Python 版本检查

```python
# 要求 Python 3.8+
if sys.version_info < (3, 8):
    sys.exit("需要 Python 3.8 或更高版本")
```

---

## os — 操作系统接口

> 官方文档：[os — Miscellaneous operating system interfaces](https://docs.python.org/3/library/os.html)

提供与操作系统交互的统一接口，包括文件系统操作、环境变量管理、进程执行等，跨平台兼容（Windows/Linux/macOS）。

### 环境变量

```python
import os

# 读取环境变量（不存在返回 None）
os.getenv("PATH")

# 不存在时给默认值
os.getenv("HOME", "/tmp")

# 设置环境变量
os.environ["API_KEY"] = "secret123"

# 删除环境变量
del os.environ["API_KEY"]
```

### 工作目录

```python
# 获取当前工作目录
os.getcwd()   # '/home/user/projects'

# 切换工作目录
os.chdir("/tmp")
```

### 目录操作

```python
# 创建目录
os.mkdir("new_dir")                        # 创建单级目录
os.makedirs("a/b/c", exist_ok=True)        # 递归创建，已存在不报错

# 删除目录
os.rmdir("empty_dir")                      # 只能删除空目录
os.removedirs("a/b/c")                     # 递归删除空目录链

# 列出目录内容
os.listdir(".")                            # 返回文件名列表

# 高效遍历（推荐，返回 DirEntry 对象）
with os.scandir(".") as entries:
    for entry in entries:
        if entry.is_file():
            print(entry.name, entry.stat().st_size)
```

### 文件操作

```python
# 重命名 / 移动
os.rename("old.txt", "new.txt")

# 删除文件
os.remove("temp.txt")

# 获取文件信息
stat = os.stat("file.txt")
stat.st_size       # 文件大小（字节）
stat.st_mtime      # 最后修改时间（时间戳）

# 检查文件权限
os.access("file.txt", os.R_OK)   # 是否可读
os.access("file.txt", os.W_OK)   # 是否可写
os.access("file.txt", os.X_OK)   # 是否可执行
```

### os.path 路径工具

```python
import os.path

# 拼接与拆分
os.path.join("data", "sub", "file.txt")          # 'data/sub/file.txt'
os.path.split("/data/file.txt")                  # ('/data', 'file.txt')
os.path.splitext("archive.tar.gz")               # ('archive.tar', '.gz')

# 判断类型
os.path.exists("file.txt")                       # 是否存在
os.path.isfile("file.txt")                       # 是否为文件
os.path.isdir("/data")                           # 是否为目录
os.path.isabs("/data/file.txt")                  # 是否为绝对路径

# 其他常用
os.path.abspath("./file.txt")                    # 转绝对路径
os.path.getsize("file.txt")                      # 文件大小
os.path.getmtime("file.txt")                     # 最后修改时间戳
```

### 进程管理

```python
# 执行 shell 命令，返回退出状态码
os.system("ls -l")

# 执行命令并读取输出（返回类文件对象）
with os.popen("git log --oneline -5") as f:
    output = f.read()
    print(output)
```

## asyncio — 异步IO标准库

> 官方文档：[asyncio — Asynchronous I/O](https://docs.python.org/3/library/asyncio.html)

Python内置的异步IO框架，基于协程（async/await）和事件循环，适合IO密集型场景（爬虫、API服务、大模型并发调用），比多线程更轻量，单线程可同时跑上千个协程，上下文切换开销极低。

### 核心概念

- **协程**：用`async/await`语法定义的轻量级执行单元，比线程轻量得多
- **事件循环**：asyncio的核心调度器，负责轮询协程状态，切换执行
- **Task**：事件循环调度的最小单位，将协程包装为可并发执行的任务

### 基础用法

```python
import asyncio

# 定义协程函数
async def hello():
    print("hello")
    await asyncio.sleep(1)  # 异步等待，不会阻塞其他协程
    print("world")

# 运行协程（Python 3.7+ 推荐写法）
asyncio.run(hello())
```

### 并发任务（核心场景）

用`asyncio.gather`同时运行多个协程，自动并发调度，总耗时等于最长任务耗时而非总和：
```python
async def task(name, delay):
    await asyncio.sleep(delay)
    print(f"task {name} finished")

async def main():
    # 同时启动3个任务，总耗时3秒，而非2+1+3=6秒
    await asyncio.gather(
        task("A", 2),
        task("B", 1),
        task("C", 3)
    )

asyncio.run(main())
```

### 常用工具函数
```python
# 异步等待，替代time.sleep（time.sleep会阻塞整个事件循环）
await asyncio.sleep(1)

# 给任务加超时，超时抛出TimeoutError
try:
    async with asyncio.timeout(5):
        await long_time_task()
except asyncio.TimeoutError:
    print("任务超时")

# 等待多个任务完成，支持按条件返回
done, pending = await asyncio.wait(tasks, timeout=10)
```

### 兼容同步代码（run_in_executor）

当必须使用没有异步版本的同步阻塞库时，用`run_in_executor`将任务丢到线程池/进程池中执行，避免卡住整个事件循环：

```python
import time
import asyncio

def sync_blocking_task():
    # 同步阻塞函数，比如time.sleep、普通requests请求
    time.sleep(2)
    return "同步任务执行完成"

async def main():
    loop = asyncio.get_running_loop()
    # 第一个参数传None使用默认线程池，也可传入自定义ThreadPoolExecutor控制并发
    result = await loop.run_in_executor(None, sync_blocking_task)
    print(result)

asyncio.run(main())
```

> [!warning] 核心避坑
> 协程内**绝对不能运行同步阻塞代码**（比如`time.sleep`、普通`requests`、同步文件读写），否则会卡住整个事件循环，所有任务都会暂停。必须用对应异步库替代：
> - HTTP请求：`aiohttp` 替代 `requests`
> - 文件读写：`aiofiles` 替代 普通open
> - 数据库访问：用对应异步驱动（如`asyncpg`替代`psycopg2`）
