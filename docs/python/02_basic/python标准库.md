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

Python 内置的异步 I/O 框架，基于事件循环 + 协程（`async/await`），适合 IO 密集型场景（爬虫、API 服务、大模型并发调用）。比多线程更轻量，单线程可同时跑上千个协程，上下文切换开销极低。

事件循环是 asyncio 的发动机，不理解它，async 代码就是黑魔法。

---

### 1. 先讲一个故事：咖啡店老板

先忘掉代码，想象一个咖啡店：

!!! note "同步老板"
    接单 → 做咖啡 → 等咖啡机完成 → 端给顾客 → 接下一单

    咖啡机工作时他干等着，后面排队的人全得等。这就是**同步阻塞**。

!!! note "异步老板"
    接单 → 按下咖啡机 → **立刻接下一单** → 哪台咖啡机响了就去端

    咖啡机等待时他做别的事，这就是**事件循环的核心思想**。

**映射到 asyncio：**

| 现实 | asyncio 对应 |
|------|-------------|
| 老板的大脑 | **事件循环** (Event Loop) |
| 每张订单 | **协程** (Coroutine) |
| 咖啡机 | I/O 操作（网络请求、文件读写、数据库查询） |
| 按下咖啡机按钮 | `await` — 发起 I/O 并让出控制权 |
| 咖啡机响了去端 | I/O 完成后的回调恢复 |

> 关键认知：事件循环**不是并行**（不是同时做多件事），而是**并发**（在等待一件事时去做另一件事）。

---

### 2. 事件循环解剖：它到底在"循环"什么

事件循环内部维护两个核心数据结构：

- **就绪队列**（Ready Queue）：可以立刻执行的协程
- **等待队列**（Waiting Queue）：正在等待 I/O 完成的协程

**一次事件循环迭代的伪代码：**

```python
# 事件循环的核心逻辑（不是真实源码，但展示了本质）
while True:
    # 1. 执行所有就绪的任务
    while ready_queue:
        task = ready_queue.popleft()
        task.step()         # 运行到下一个 await，可能遇到 I/O 等待
        if task.is_waiting:
            waiting_queue.append(task)  # 移到等待队列
        elif task.is_done:
            pass                        # 任务结束，移除

    # 2. 轮询 I/O：检查哪些等待的任务完成了
    for task in waiting_queue:
        if io_is_done(task):
            task.is_waiting = False
            ready_queue.append(task)    # 移回就绪队列，等待下次调度

    # 3. 如果全空了，退出
    if not ready_queue and not waiting_queue:
        break
```

**事件循环的生命周期：**

```python
# 高级 API（Python 3.7+ 推荐，一条龙服务）
asyncio.run(main())  # 创建循环 → 运行 → 关闭

# 等价于低级的做法：
loop = asyncio.new_event_loop()
try:
    loop.run_until_complete(main())
finally:
    loop.close()
```

!!! tip "Python 3.10+ 注意"
    从 Python 3.10 开始，`asyncio.get_event_loop()` 已被标记为 deprecation。推荐直接用 `asyncio.run()` 或 `asyncio.get_running_loop()`（只能在协程内调用）。

---

### 3. await 的秘密：控制权交接的艺术

`await` 是理解异步的关键。它的本质是：**"我要等 I/O，你先跑别的，I/O 好了叫我。"**

**逐行跟踪 asyncio.gather：**

```python
import asyncio

async def task(name, delay):
    print(f"[{name}] 开始")
    await asyncio.sleep(delay)   # ★ 交出控制权
    print(f"[{name}] 结束，耗时 {delay}s")
    return name

async def main():
    # gather 内部依次执行：
    # 1. 把三个协程都提交到事件循环
    # 2. 自己 await 等待它们全部完成
    results = await asyncio.gather(
        task("A", 2),
        task("B", 1),
        task("C", 3)
    )
    print(f"全部完成: {results}")

asyncio.run(main())
```

**执行过程时间线（关键！）：**

```
时间 →
main() 开始运行
 ├─ gather 提交 A, B, C 到事件循环
 ├─ await gather → main 暂停，控制权回到事件循环
 │
事件循环开始调度：
 ├─ 运行 A → 打印"[A] 开始" → await sleep(2) → A 暂停，进入等待队列
 ├─ 运行 B → 打印"[B] 开始" → await sleep(1) → B 暂停，进入等待队列
 ├─ 运行 C → 打印"[C] 开始" → await sleep(3) → C 暂停，进入等待队列
 │
 └─ 全在等待 I/O，事件循环空闲（不占 CPU！）
    │
    1 秒后 → B 的 sleep 完成 → B 恢复 → 打印"[B] 结束" → B 结束
    2 秒后 → A 的 sleep 完成 → A 恢复 → 打印"[A] 结束" → A 结束
    3 秒后 → C 的 sleep 完成 → C 恢复 → 打印"[C] 结束" → C 结束
    │
  所有任务完成 → main 恢复 → 打印"全部完成"
```

!!! note "核心要点"
    每个 `await` 都是**控制权交接点**。没有 `await`，就不会发生任务切换。这就是为什么事件循环叫做**协作式多任务**（Cooperative Multitasking）——每个协程必须主动 `await` 才能让出 CPU。

---

### 4. 三个灵魂拷问（一题一解）

#### Q1：time.sleep vs asyncio.sleep 差在哪？

```python
import time
import asyncio

async def bad():
    """❌ 错误示范：同步阻塞"""
    print("time.sleep 开始")
    time.sleep(3)   # 不交出控制权！事件循环被卡死
    print("time.sleep 结束")

async def good():
    """✅ 正确示范：异步等待"""
    print("asyncio.sleep 开始")
    await asyncio.sleep(3)  # 交出控制权，事件循环可以跑别的
    print("asyncio.sleep 结束")

async def main():
    # 同时跑两个任务
    t1 = asyncio.create_task(bad())
    t2 = asyncio.create_task(good())
    await asyncio.gather(t1, t2)

asyncio.run(main())
```

!!! danger "核心避坑"
    - `time.sleep(3)`：**不**交出控制权 → 整个事件循环卡死 3 秒，其他任务全部停摆
    - `await asyncio.sleep(3)`：交出控制权 → 事件循环去跑别的任务，3 秒后回来继续

    **根本原因：** `time.sleep` 是 C 级别的阻塞，事件循环完全不知道它在等待。而 `await asyncio.sleep` 会告诉事件循环"我要等 3 秒，你先去忙别的"。

**同理：所有同步阻塞操作都必须换成异步版本：**

| 同步（阻塞） | 异步（非阻塞） | 替代方案 |
|-------------|---------------|---------|
| `time.sleep(n)` | `await asyncio.sleep(n)` | 内置 |
| `requests.get(url)` | `await session.get(url)` | `aiohttp` / `httpx` |
| `open(file).read()` | `await async_open(file).read()` | `aiofiles` |
| `psycopg2.execute(sql)` | `await async_conn.execute(sql)` | `asyncpg` / `aiomysql` |

#### Q2：gather 是怎么"同时"跑的？

```python
async def main():
    # 方式一：顺序执行（总耗时 = 1+2+3 = 6 秒）
    await task("A", 1)
    await task("B", 2)
    await task("C", 3)

    # 方式二：并发执行（总耗时 = max(1,2,3) = 3 秒）
    await asyncio.gather(
        task("A", 1),
        task("B", 2),
        task("C", 3)
    )
```

!!! tip "区别在于何时 await"
    - **方式一（顺序）**：`await task("A")` → 等 A 跑完 → `await task("B")` → 等 B 跑完 → ... 每次 `await` 等一个，事件循环手里只有一个任务，没法切换
    - **方式二（并发）**：`gather` 把三个协程都提交到事件循环，然后**一次性 await 它们三个**。事件循环现在有三个任务，A 让出 CPU 就去跑 B，B 让出就去跑 C，来回穿梭

#### Q3：asyncio.run 背后发生了什么？

```python
# 你写的代码
asyncio.run(main())

# Python 内部大致等价于
def simplified_asyncio_run(main_coro):
    # 1. 创建新的事件循环
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        # 2. 把主协程包装成 Task 并运行
        return loop.run_until_complete(main_coro)
    finally:
        # 3. 清理：取消所有未完成的任务，关闭循环
        loop.close()
```

!!! warning "注意"
    每次 `asyncio.run()` 都会创建一个**全新**的事件循环。不能在 `asyncio.run()` 外部拿到事件循环对象。如果需要多个协程在不同时间点运行，应该用 `asyncio.create_task()` 而不是多次调用 `asyncio.run()`。

---

### 5. Task、Future、协程：三者的关系

这三者是层层包装的关系：

```
协程 (Coroutine)             → 可暂停的函数
      ↓ 被包装为
Task (asyncio.Task)          → 协程 + 调度信息 + 结果容器
      ↓ 继承自
Future (asyncio.Future)      → 一个"未来会有结果的占位符"
```

```python
import asyncio

async def my_coro():
    return "hello"

async def main():
    # 协程本身：只是一个可暂停的函数，调用不会执行
    coro = my_coro()        # ← 此时协程还没开始跑！

    # Task：把协程包装并提交到事件循环，立刻开始调度
    task = asyncio.create_task(my_coro())  # ← 协程已经在就绪队列里排队了

    # await：等待 Task（即 Future）的结果
    result = await task     # "hello"
```

**常用任务创建方式对比：**

```python
# 1. create_task —— 最常用，语义明确，推荐
task = asyncio.create_task(my_coro())

# 2. gather —— 批量并发，内部自动创建 Task
results = await asyncio.gather(task1, task2, task3)

# 3. ensure_future —— 兼容性更好但语义模糊，不推荐新手使用
task = asyncio.ensure_future(my_coro())
```

---

### 6. 事件循环的进阶操作

#### 手动管理事件循环

某些场景需要手动管理（例如在已有事件循环的环境中运行新循环）：

```python
loop = asyncio.new_event_loop()

# 运行单个协程直到完成
result = loop.run_until_complete(some_coro())

# 持续运行事件循环（直到 stop 被调用）
loop.run_forever()

# 停止并关闭（必须关闭以释放资源）
loop.stop()
loop.close()
```

#### 跨线程提交任务

当你在子线程中需要向主线程的事件循环提交任务时：

```python
def thread_worker(loop):
    # 在子线程中向主线程的事件循环提交任务，返回一个 concurrent.futures.Future
    future = asyncio.run_coroutine_threadsafe(async_task(), loop)
    result = future.result()  # 同步等待结果（会阻塞子线程）
```

#### 任务取消与超时

```python
async def main():
    task = asyncio.create_task(long_running())

    # 手动取消任务
    task.cancel()

    # 带超时的上下文管理器（Python 3.11+）
    try:
        async with asyncio.timeout(5):
            result = await task
    except asyncio.TimeoutError:
        print("任务超时，已自动取消")

    # 等待多个任务，支持按策略返回
    done, pending = await asyncio.wait(
        [task1, task2, task3],
        timeout=10,
        return_when=asyncio.FIRST_COMPLETED  # 任一完成就返回
    )
```

#### 兼容同步代码（run_in_executor）

当必须使用没有异步版本的同步阻塞库时，将任务丢到线程池中执行：

```python
import time
import asyncio

def sync_blocking_task():
    time.sleep(2)
    return "同步任务执行完成"

async def main():
    loop = asyncio.get_running_loop()
    # 第一个参数传 None 使用默认线程池，也可传入自定义 ThreadPoolExecutor
    result = await loop.run_in_executor(None, sync_blocking_task)
    print(result)

asyncio.run(main())
```

---

### 7. 附录：迷你事件循环实现（理解本质）

以下代码用生成器模拟协程，**不到 30 行实现一个简化版事件循环**。这是打通"任督二脉"的关键——看完就明白事件循环到底在循环什么：

```python
from collections import deque


def task(name, work_count):
    """模拟一个协程：用 yield 代替 await 来让出控制权"""
    for i in range(work_count):
        print(f"[{name}] 执行第 {i + 1} 步")
        yield          # ★ 让出控制权，等价于 await asyncio.sleep(0)
    print(f"[{name}] 完成！")


class MiniEventLoop:
    """极简事件循环 —— 展示核心调度机制"""

    def __init__(self):
        self.ready = deque()     # 就绪队列

    def add_task(self, gen):
        self.ready.append(gen)   # 注册一个生成器（模拟协程）

    def run(self):
        """启动事件循环"""
        while self.ready:
            current = self.ready.popleft()   # 取出一个就绪任务
            try:
                next(current)                # 执行到下一个 yield
                self.ready.append(current)   # 放回队列尾部，等待下次调度
            except StopIteration:
                pass                        # 任务结束，自动移除


# 运行演示
loop = MiniEventLoop()
loop.add_task(task("A", 3))
loop.add_task(task("B", 2))
loop.add_task(task("C", 1))

print("=== 事件循环启动 ===")
loop.run()
print("=== 全部完成 ===")
```

**输出：**
```
=== 事件循环启动 ===
[A] 执行第 1 步    ← 取出 A，执行一步，放回队尾
[B] 执行第 1 步    ← 取出 B，执行一步，放回队尾
[C] 执行第 1 步    ← 取出 C，执行一步，放回队尾
[A] 执行第 2 步    ← 再次轮到 A
[B] 执行第 2 步
[A] 执行第 3 步
[A] 完成！         ← A 结束，不再放回
[B] 完成！
[C] 完成！
=== 全部完成 ===
```

!!! note "从 Mini 到真实 asyncio"
    | Mini 中的概念 | 真实 asyncio 中的对应 |
    |--------------|---------------------|
    | `yield` | `await` |
    | 生成器 generator | 协程 coroutine |
    | `next(gen)` 推进执行 | 事件循环内部 `coro.send(None)` |
    | 单队列轮转 | 就绪队列 + I/O 等待队列 |
    | 无 I/O 轮询 | `select` / `epoll` / `kqueue` 系统调用 |

    真实的 asyncio 事件循环比这复杂（I/O 复用、异常处理、Callback 机制等），但**核心调度逻辑一模一样**：一个 `while` 循环 + 一个队列，不断取出任务 → 执行到暂停点 → 放回队列，如此往复。

---

### 总结：一条线串起所有概念

```
你写代码：  async def foo():          ← 定义协程（可暂停的函数）
                await bar()          ← 交出控制权，让事件循环调度别的任务

背后的机制： asyncio.run(foo())       ← 创建事件循环，启动引擎
            create_task(foo())       ← 把协程包装成 Task 丢进就绪队列
            事件循环 while 循环        ← 队列 → 推进执行 → await 挂起 → 取下一个
            await 让出控制权           ← 放到等待队列，I/O 完成再放回就绪队列
            gather 并发               ← 一次性把多个 Task 丢进队列，并发调度
```

---

## datetime — 日期与时间处理

> 官方文档：[datetime — Basic date and time types](https://docs.python.org/3/library/datetime.html)

Python 最核心的日期时间库，提供了 `date`、`time`、`datetime`、`timedelta` 四个核心类型，覆盖了绝大多数日常场景。

### 四个核心类型

```python
from datetime import date, time, datetime, timedelta

# date：只处理日期（年、月、日）
d = date(2026, 6, 29)

# time：只处理时间（时、分、秒、微秒）
t = time(14, 30, 0)

# datetime：日期 + 时间（最常用）
dt = datetime(2026, 6, 29, 14, 30, 0)

# timedelta：时间差（用于日期运算）
delta = timedelta(days=7, hours=3)
```

### 获取当前时间

```python
# 当前日期时间
now = datetime.now()

# 当前 UTC 时间（Python 3.12+ 推荐）
from datetime import timezone
utc_now = datetime.now(timezone.utc)

# 当前日期
today = datetime.now().date()
```

!!! warning "`datetime.utcnow()` 在 Python 3.12+ 已弃用"
    它返回的是无时区信息的 naive datetime，容易引发歧义。改为 `datetime.now(timezone.utc)`。

### 日期格式化 — strftime / strptime

```python
# datetime → 字符串（格式化输出）
now = datetime.now()
now.strftime("%Y-%m-%d %H:%M:%S")         # '2026-06-29 14:30:00'
now.strftime("%Y年%m月%d日 %A")             # '2026年06月29日 Monday'
now.strftime("%Y-%m-%dT%H:%M:%S%z")       # ISO 8601 格式

# 字符串 → datetime（解析）
dt = datetime.strptime("2026-06-29", "%Y-%m-%d")
dt = datetime.strptime("2026/06/29 14:30", "%Y/%m/%d %H:%M")
```

**常用格式化符号：**

| 符号 | 含义 | 示例 |
|------|------|------|
| `%Y` | 四位年份 | 2026 |
| `%m` | 两位月份（补零） | 01–12 |
| `%d` | 两位日期（补零） | 01–31 |
| `%H` | 24小时制 | 00–23 |
| `%M` | 分钟 | 00–59 |
| `%S` | 秒 | 00–59 |
| `%A` | 星期全名 | Monday |
| `%a` | 星期缩写 | Mon |
| `%B` | 月份全名 | June |
| `%b` | 月份缩写 | Jun |
| `%z` | 时区偏移 | +0800 |

### 日期运算

```python
# 加减时间
now + timedelta(days=1)          # 明天同一时间
now - timedelta(hours=3)         # 3 小时前
now + timedelta(weeks=2)         # 两周后

# 两个日期间隔天数
d1 = date(2026, 6, 29)
d2 = date(2026, 1, 1)
(d1 - d2).days                   # 179

# 日期比较：直接使用比较运算符
d1 > d2      # True
```

!!! note "timedelta 支持的关键字参数"
    `days`、`seconds`、`microseconds`、`milliseconds`、`minutes`、`hours`、`weeks`
    注意：**没有 `months` 和 `years`**（因为月/年长度不固定），需要这种运算请装 `python-dateutil`。

### 时间戳转换

```python
# datetime → 时间戳
ts = datetime.now().timestamp()       # 秒级浮点数

# 时间戳 → datetime
dt = datetime.fromtimestamp(ts)                      # 本地时间
dt = datetime.fromtimestamp(ts, tz=timezone.utc)     # UTC 时间
```

---

## time — 底层时间访问

> 官方文档：[time — Time access and conversions](https://docs.python.org/3/library/time.html)

`time` 比 `datetime` 更底层，主要用于三个场景：**暂停**、**时间戳**、**性能测量**。

### 暂停

```python
import time

time.sleep(2.5)         # 暂停 2.5 秒
time.sleep(0.1)         # 最小常用精度：0.1 秒
```

### 时间戳与格式化

```python
# 当前时间戳（秒，浮点数）
ts = time.time()             # 1759103400.123456

# 时间戳 → 结构化时间
time.localtime(ts)           # 本地时间的 struct_time
time.gmtime(ts)              # UTC 时间的 struct_time

# 结构化时间 → 字符串
time.strftime("%Y-%m-%d", time.localtime())

# 字符串 → 结构化时间
time.strptime("2026-06-29", "%Y-%m-%d")
```

### 性能测量

```python
# perf_counter：高精度单调计时器，不受系统时间调整影响
start = time.perf_counter()
# ... 执行代码 ...
elapsed = time.perf_counter() - start
print(f"耗时: {elapsed:.3f} 秒")
```

!!! tip "`time.time()` vs `time.perf_counter()`"
    - `time.time()`：返回墙上时间，NTP 同步会导致"时间倒退"
    - `time.perf_counter()`：单调递增，不受系统时间影响，**测性能用它**

---

### datetime vs time 怎么选？

| 场景 | 用哪个 |
|------|--------|
| 格式化日期、日期运算 | `datetime` ✅ |
| 记录日志时间戳 | `datetime` ✅ |
| 暂停 2 秒 | `time.sleep` ✅ |
| 测量代码执行时间 | `time.perf_counter` ✅ |
| 只需要当前时间戳 | `time.time()` ✅ |
