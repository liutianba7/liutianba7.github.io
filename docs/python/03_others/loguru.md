# Loguru 笔记

> 让 Python 日志变简单 —— 一个函数搞定一切

## 1. 安装

=== "pip"

    ```bash
    pip install loguru
    ```

=== "uv"

    ```bash
    uv add loguru
    ```

## 2. 基本使用

```python
from loguru import logger

logger.debug("调试信息")
logger.info("普通信息")
logger.warning("警告信息")
logger.error("错误信息")
logger.success("成功信息")
```

!!! tip "开箱即用"
    无需配置 Handler、Formatter，导入即用，默认彩色输出到控制台。

## 3. 文件输出

使用 [`logger.add()`][add-docs] 配置日志输出目标。

[add-docs]: https://loguru.readthedocs.io/en/stable/api/logger.html#loguru._logger.Logger.add

```python
# 输出到文件
logger.add("app.log")

# 完整配置
logger.add(
    "logs/app_{time:YYYY-MM-DD}.log",  # 支持时间格式化
    rotation="10 MB",      # 按大小轮转
    retention="7 days",    # 保留策略
    compression="zip",     # 自动压缩
    level="INFO",          # 最低日志级别
    encoding="utf-8",      # 编码
    enqueue=True,          # 异步写入（线程安全）
)
```

### 关键参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `rotation` | 轮转条件 | `"10 MB"`, `"1 day"`, `"00:00"` |
| `retention` | 保留时长 | `"7 days"`, `"1 month"`, `"10 files"` |
| `compression` | 压缩格式 | `"zip"`, `"gz"`, `"tar.gz"` |
| `level` | 最低级别 | `"DEBUG"`, `"INFO"`, `"WARNING"` |
| `enqueue` | 异步写入 | `True`（多线程环境必开） |

!!! note "更多参数"
    完整参数说明详见 [官方文档 - File rotation][rotation-docs]

[rotation-docs]: https://loguru.readthedocs.io/en/stable/overview.html#easier-file-logging-with-rotation-retention-compression

## 4. 异常捕获

Loguru 的异常捕获功能可自动记录完整堆栈信息。详见 [官方文档 - Catching exceptions][catch-docs]

[catch-docs]: https://loguru.readthedocs.io/en/stable/overview.html#catching-exceptions

### 4.1 装饰器

```python
@logger.catch
def risky_function():
    return 1 / 0  # 自动记录完整堆栈

risky_function()
```

### 4.2 上下文管理器

```python
with logger.catch(message="处理用户请求时出错"):
    process_user_request()
```

### 4.3 手动捕获

```python
try:
    risky_operation()
except Exception:
    logger.exception("操作失败")  # 自动附加堆栈信息
```

## 5. 格式化

### 5.1 自定义格式

```python
logger.add(
    "app.log",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}"
)
```

### 5.2 常用占位符

| 占位符 | 说明 |
|--------|------|
| `{time}` | 时间戳 |
| `{level}` | 日志级别 |
| `{message}` | 日志内容 |
| `{name}` | 模块名 |
| `{function}` | 函数名 |
| `{line}` | 行号 |
| `{file}` | 文件名 |
| `{exception}` | 异常信息 |

!!! note "完整占位符列表"
    详见 [官方文档 - Record attributes][format-docs]

[format-docs]: https://loguru.readthedocs.io/en/stable/api/logger.html#record

## 6. 实战集成

### 6.1 FastAPI 集成

```python
from loguru import logger
import sys

# 配置日志
logger.add(
    "logs/app.log",
    rotation="10 MB",
    retention="7 days",
    level="INFO",
    enqueue=True,
)
```

### 6.2 替换标准 logging

```python
import logging
from loguru import logger

class InterceptHandler(logging.Handler):
    def emit(self, record):
        logger.opt(depth=1, exception=record.exc_info).log(
            record.levelname, record.getMessage()
        )

# 拦截所有标准库 logging
logging.basicConfig(handlers=[InterceptHandler()], level=logging.INFO)
```

---

## 快速参考

```python
# 最简配置
logger.add("app.log", rotation="10 MB", retention="7 days")

# 异常捕获
@logger.catch
def main():
    ...

# 多输出
logger.add(sys.stderr, level="DEBUG")  # 控制台
logger.add("app.log", level="INFO")    # 文件
```

---

**参考资料**：
- [Loguru GitHub](https://github.com/Delgan/loguru)
- [Loguru 官方文档](https://loguru.readthedocs.io)