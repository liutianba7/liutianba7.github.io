# Python 处理 YAML 配置文件

> PyYAML 做基础读写，OmegaConf 做高级配置管理

## 1. PyYAML

> 详见 [PyYAML 官方文档](https://pyyaml.org/wiki/PyYAMLDocumentation)。

Python 中最常用的 YAML 处理库，**包名是 `pyyaml`，导入时用 `yaml`**。

=== "pip"

    ```bash
    pip install pyyaml
    ```

=== "uv"

    ```bash
    uv add pyyaml
    ```

### 读取 YAML

```python
import yaml

with open("config.yaml", "r", encoding="utf-8") as f:
    data = yaml.safe_load(f)
```

返回 `dict` 或 `list`（顶层 YAML 为列表时）。

### 写入 YAML

```python
import yaml

data = {"name": "Alice", "hobbies": ["reading", "coding"], "age": 30}

with open("output.yaml", "w", encoding="utf-8") as f:
    yaml.dump(data, f, allow_unicode=True, default_flow_style=False)
```

常用参数：

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `allow_unicode` | `False` | 设为 `True` 才能正确写入中文 |
| `default_flow_style` | `None` | 设为 `False` 使用块状格式（更易读） |
| `sort_keys` | `True` | 设为 `False` 保持字典原始顺序 |
| `width` | `1000` | 长行换行宽度，设为 `-1` 禁止换行 |

### 安全警告

!!! danger "`yaml.load()` 有远程代码执行风险"
    `yaml.load()` 会实例化 YAML 中的 `!!python/object` 等标签，**执行任意 Python 代码**。
    始终使用 `yaml.safe_load()`，它只支持标准 YAML 类型（`!!str`、`!!int`、`!!list` 等）。

    ```python
    yaml.safe_load(content)   # ✅ 安全
    yaml.load(content, Loader=yaml.SafeLoader)  # ✅ 等价写法
    yaml.load(content)        # ❌ 危险，不要使用
    ```

### 多文档处理

YAML 文件可用 `---` 分隔多个文档：

```python
import yaml

# 读取多个文档
with open("multi.yaml", "r") as f:
    docs = list(yaml.safe_load_all(f))

# 写入多个文档
with open("multi.yaml", "w") as f:
    yaml.dump_all([doc1, doc2, doc3], f, allow_unicode=True)
```

### YAML 字符串

```python
import yaml

s = """
server:
  host: localhost
  port: 8080
"""
data = yaml.safe_load(s)
# {'server': {'host': 'localhost', 'port': 8080}}
```

---

## 2. OmegaConf

> 详见 [OmegaConf 官方文档](https://omegaconf.readthedocs.io/)。

高级分层配置管理库，[Hydra](https://hydra.cc/) 框架的底层。支持变量插值、配置合并、类型安全等特性。

=== "pip"

    ```bash
    pip install omegaconf
    ```

=== "uv"

    ```bash
    uv add omegaconf
    ```

### 创建配置

OmegaConf 对象不是普通 dict/list，而是 `DictConfig` / `ListConfig`，支持属性访问和字典访问两种风格。

```python
from omegaconf import OmegaConf

# 从字典创建
conf = OmegaConf.create({"server": {"host": "localhost", "port": 80}})

# 从 YAML 字符串创建
conf = OmegaConf.create("""
server:
  host: localhost
  port: 80
""")

# 从 YAML 文件加载
conf = OmegaConf.load("config.yaml")

# 从命令行参数创建（模拟 sys.argv）
import sys
sys.argv = ["program.py", "server.port=82"]
conf = OmegaConf.from_cli()
# server: {port: 82}
```

!!! tip "OmegaConf vs 原生 dict"
    OmegaConf 对象看起来像 dict，但底层是 `DictConfig`，支持插值、类型检查、只读锁定等高级功能。
    需要转回原生 dict 时用 `OmegaConf.to_container(conf)`。

### 访问与操作

```python
from omegaconf import OmegaConf

conf = OmegaConf.create({
    "server": {"host": "localhost", "port": 80},
    "users": ["alice", "bob"],
})

# 属性访问
conf.server.port          # 80

# 字典访问
conf["server"]["host"]    # "localhost"

# 列表访问
conf.users[0]             # "alice"

# 带默认值
conf.get("missing", "default_value")  # "default_value"

# 修改已有值
conf.server.port = 8080

# 添加新值
conf.server.hostname = "my-server"
```

#### 必选值 `???`

用 `"???"` 标记**必须填写**的配置项，访问未设置的必选值会抛异常：

```python
conf = OmegaConf.create({"log": {"file": "???"}})

conf.log.file  # 抛出 MissingMandatoryValue 异常
```

### 序列化

```python
from omegaconf import OmegaConf

conf = OmegaConf.create({"foo": 10, "bar": 20})

# 保存/加载 YAML 文件
OmegaConf.save(conf, "config.yaml")
loaded = OmegaConf.load("config.yaml")

# 转为普通 dict
d = OmegaConf.to_container(conf)

# 转为普通 dict 并解析插值
d = OmegaConf.to_container(conf, resolve=True)
```

### 变量插值（核心特性）

插值在**访问时懒解析**，支持引用配置中任意节点的值：

```python
conf = OmegaConf.create("""
server:
  host: localhost
  port: 80

client:
  url: http://${server.host}:${server.port}/
  server_port: ${server.port}
""")

conf.client.url          # "http://localhost:80/"
conf.client.server_port  # 80（类型为 int，继承自引用节点）
```

#### 相对插值

```python
# . 表示当前节点，.. 表示父节点
conf = OmegaConf.create("""
a:
  value: 10
  b:
    ref: ${..value}
""")
conf.a.b.ref  # 10
```

#### 环境变量插值

```python
import os
os.environ["DB_HOST"] = "db.example.com"

conf = OmegaConf.create({
    "database": {"host": "${oc.env:DB_HOST}"}
})
conf.database.host  # "db.example.com"
```

带默认值：`${oc.env:DB_HOST,localhost}`

### 自定义 Resolver

通过 `register_new_resolver` 注册自定义插值函数：

```python
from omegaconf import OmegaConf

OmegaConf.register_new_resolver("add", lambda *nums: sum(nums))

conf = OmegaConf.create({"total": "${add:1,2,3}"})
conf.total  # 6
```

### 配置合并

将多个配置文件合并为一个，**后面的覆盖前面的**，列表会**合并**而非替换：

```python
from omegaconf import OmegaConf

base = OmegaConf.load("base.yaml")     # server.port: 80
prod = OmegaConf.load("prod.yaml")     # server.host: prod.example.com
cli  = OmegaConf.from_cli()            # server.port: 8080

# 合并（列表合并，标量覆盖）
conf = OmegaConf.merge(base, prod, cli)
# server: {host: prod.example.com, port: 8080}
```

!!! tip "unsafe_merge 性能更快"
    `OmegaConf.unsafe_merge()` 速度更快，但**会销毁输入配置**，合并后不能再使用原始对象。

### 配置标志

#### 只读（Read-only）

```python
conf = OmegaConf.create({"a": {"b": 10}})
OmegaConf.set_readonly(conf, True)

conf.a.b = 20  # 抛出 ReadonlyConfigError

# 临时解除只读
from omegaconf import read_write
with read_write(conf):
    conf.a.b = 20  # 成功
```

#### 结构（Struct）

默认 OmegaConf 允许创建不存在的键。开启 struct 后**禁止新增未定义的键**：

```python
conf = OmegaConf.create({"a": {"aa": 10}})
OmegaConf.set_struct(conf, True)

conf.a.bb = 20  # 抛出 ConfigAttributeError

# 临时允许新增
from omegaconf import open_dict
with open_dict(conf):
    conf.a.bb = 20  # 成功
```

### Structured Configs（类型安全）

配合 `dataclass` 实现**运行时类型校验**：

```python
from dataclasses import dataclass
from omegaconf import OmegaConf

@dataclass
class MyConfig:
    port: int = 80
    host: str = "localhost"

conf = OmegaConf.structured(MyConfig)
# port: 80
# host: localhost

conf.port = 443      # ✅
conf.port = "443"    # ✅ 字符串 "443" 可转为 int
conf.port = "oops"   # ❌ ValidationError
```

### 常用工具函数

| 函数                                          | 说明                                        |
| ------------------------------------------- | ----------------------------------------- |
| `OmegaConf.to_container(cfg, resolve=True)` | 转为普通 dict，resolve 解析插值                    |
| `OmegaConf.to_object(cfg)`                  | 转为 dict，structured config 转为 dataclass 实例 |
| `OmegaConf.resolve(cfg)`                    | 原地解析所有插值                                  |
| `OmegaConf.select(cfg, "a.b.c")`            | 用点路径选择节点                                  |
| `OmegaConf.update(cfg, "a.b.c", value)`     | 用点路径更新节点                                  |
| `OmegaConf.is_missing(cfg, "key")`          | 检查是否为 `???`                               |
| `OmegaConf.is_interpolation(cfg, "key")`    | 检查是否为插值                                   |
| `OmegaConf.missing_keys(cfg)`               | 返回所有缺失键的集合                                |

### 选择指南

!!! tip "何时用什么"
    - **简单读写 YAML 文件** → PyYAML
    - **需要变量插值 `${key}`、多文件合并、命令行参数覆盖、类型安全** → OmegaConf
