# LangGraph 八股文

## 一、LangGraph 概述

### 1. LangGraph 是什么？它的核心定位是什么？

**LangGraph** 是专注于 **Agent 编排（orchestration）** 的低层框架。

核心定位：

- 专注于 **Agent 编排**，而非 Chain 的顺序执行
- 提供 **有状态、多角色** 的工作流编排能力
- 支持 **循环图** 结构（突破 DAG 限制）

---

### 2. LangGraph解决了什么痛点？

!!! tip "参考答案"
    
    LangChain 推出 LangGraph 主要是为了解决四个痛点：
    
    第一，Chain 天然是 DAG，只能顺序执行，难以处理复杂编排；
    
    第二，Agent 执行是黑盒，无法精细干预；
    
    第三，缺乏状态管理能力；
    
    第四，不支持持续执行、断点续跑等；

    LangGraph 通过提供循环图、显式状态管理、精细流程控制和持久化执行，弥补了这些不足。

### 3. LangGraph vs LangChain：两者是什么关系？各自适用场景？

| 维度 | LangChain | LangGraph |
|------|-----------|-----------|
| **定位** | 高层抽象，快速构建 LLM 应用 | 低层编排，精细控制工作流 |
| **执行模型** | DAG（有向无环图） | 循环图（允许循环） |
| **状态管理** | 隐式传递 | 显式 State 共享 |
| **流程控制** | 固定链式调用 | 动态路由、条件分支 |
| **适用场景** | 简单问答、固定流程 | 复杂 Agent、多轮对话、协作工作流 |

**关系**：LangGraph 是 LangChain 生态的一部分，两者可配合使用。LangGraph 底层仍可使用 LangChain 的 Chain、Tool 等组件。

!!! tip "参考答案"
    LangChain 和 LangGraph 的定位不同：LangChain 是高层抽象，用于快速构建 LLM 应用，执行模型是 DAG；LangGraph 是低层编排，用于精细控制工作流，支持循环图和显式状态管理。两者关系是：LangGraph 是 LangChain 生态的一部分，可以配合使用。适用场景上，LangChain 适合简单问答、固定流程；LangGraph 适合复杂 Agent、多轮对话、协作工作流。

### 4. LangGraph 的核心优势有哪些？

主要看前三个就行

| 优势 | 说明 |
|------|------|
| **Durable Execution** | 故障恢复、断点续跑、长时间运行 |
| **Human-in-the-loop** | 可随时中断、人工审核、修改后继续 |
| **Comprehensive Memory** | 短期会话记忆 + 跨会话长期记忆 |
| **Debugging with LangSmith** | 可视化追踪、状态转换、运行时指标 |
| **Production-ready** | 专为有状态工作流设计的可扩展架构 |

!!! tip "提示"
    主要特性是前三个： durable execution、human-in-the-loop、comprehensive memory。
    
### 5. 什么场景下应该选择 LangGraph 而不是 LangChain？

| 场景 | 为什么选 LangGraph |
|------|-------------------|
| **多轮对话 Agent** | 需维护对话状态和上下文记忆 |
| **复杂工作流** | 循环执行、条件分支、动态路由 |
| **人工审核流程** | 关键节点需人工确认或修改 |
| **长期运行任务** | 需故障恢复、断点续跑 |
| **Multi-Agent 协作** | 多 Agent 间有依赖或通信 |

!!! tip "参考答案"
    判断标准很简单：需要精细控制流程、维护状态、人工介入时，选 LangGraph。典型场景有 5 类：多轮对话 Agent、复杂工作流（循环执行、条件分支、动态路由）、人工审核流程、长期运行任务、Multi-Agent 协作。举个例子，做一个客服 Agent，需要根据用户问题动态路由到不同专家 Agent，还要维护对话历史，这种情况下 LangChain 的 Chain 就很难处理，而 LangGraph 可以用条件边实现动态路由，用 State 维护对话状态。

## 二、State（状态管理）

### 1. State 在 LangGraph 中是什么？

**State** 是图中所有节点共享的数据结构，代表应用的当前快照。

### 2. LangGraph 支持哪几种 State 定义方式？

支持三种定义方式：

| 方式 | 适用场景 | 代码示例 |
|------|----------|----------|
| **TypedDict** | 大多数场景（最常用） | `class State(TypedDict):` |
| **dataclass** | 需要默认值时 | `@dataclass class State:` |
| **Pydantic** | 需要参数校验时 | `class State(BaseModel):` |

```python
# TypedDict（最常用）
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    count: int

# dataclass（需要默认值）
@dataclass
class State:
    messages: list = field(default_factory=list)
    retries: int = 3

# Pydantic（需要校验）
class AgentState(BaseModel):
    name: str = Field(..., max_length=10)
    age: int = Field(..., gt=0)
```

!!! warning "注意"
    LangChain 的 create_agent 工厂函数不支持 Pydantic 定义的 State。

### 3. TypedDict、dataclass、Pydantic 三种方式各适用什么场景？

| 方式 | 适用场景 | 优点 | 局限 |
|------|----------|------|------|
| **TypedDict** | 大多数场景 | 简洁、类型检查 | 不支持默认值 |
| **dataclass** | 需要默认值 | 支持默认值、类型检查 | 稍 verbose |
| **Pydantic** | 需要参数校验 | 自动校验、序列化 | `create_agent` 不支持 |

!!! tip "参考答案"
    默认用 TypedDict，需要默认值用 dataclass，需要校验用 Pydantic（但避开 create_agent）。

### 4. 什么是 Reducer？它的函数签名是什么？

**Reducer** 是定义 State 中每个键如何被更新的函数。

**函数签名**：

```python
reducer(current_value, new_value) -> merged_value
```
!!! tip "参考答案"
    Reducer 是定义 State 中每个键如何被更新的函数，函数签名是 `reducer(current_value, new_value) -> merged_value`。每个 State 字段都对应一个 Reducer，决定该字段如何被更新。

### 5. Reducer 的默认行为是什么？如何自定义 Reducer？

**默认行为**：直接覆盖（Replace）

```python
class State(TypedDict):
    name: str  # 默认 Reducer 是直接覆盖
    messages: list  # 也是直接覆盖
```

**自定义 Reducer**：使用 `Annotated[type, reducer]`

```python
def custom_reducer(current: list, new: list) -> list:
    """去重合并"""
    return current + [x for x in new if x not in current]

class State(TypedDict):
    items: Annotated[list[str], custom_reducer]
```

!!! tip "参考答案"
    Reducer 的默认行为是直接覆盖。自定义 Reducer 可以使用 Annotated[type, reducer] 语法，比如 `Annotated[list[str], custom_reducer]`。LangGraph 还内置了一些常用 Reducer，如 operator.add、add_messages、merge_dicts 等。

### 6. 内置 Reducer 有哪些？

| Reducer | 说明 | 示例 |
|---------|------|------|
| `operator.add` | 列表追加/数值累加 | `Annotated[list, operator.add]` |
| `add_messages` | 消息追加（LangGraph 内置） | `Annotated[list[Message], add_messages]` |
| `operator.mul` | 数值累乘 | `Annotated[int, operator.mul]` |
| `merge_dicts` | 字典合并 | `Annotated[dict, merge_dicts]` |

!!! tip "参考答案"
    LangGraph 内置的 Reducer 有：operator.add（列表追加/数值累加）、add_messages（消息追加，LangGraph 内置）、operator.mul（数值累乘）、merge_dicts（字典合并）。使用时可以用 Annotated[type, reducer] 语法指定，比如 `Annotated[list, operator.add]`。

### 7. 如何绕过 Reducer 直接覆盖 State？

使用 **`Overwrite`** 类型可绕过 Reducer 直接覆盖：

```python
from langgraph.graph import Overwrite

class State(TypedDict):
    bar: Annotated[list[str], operator.add]  # 配置了追加策略

def force_overwrite_node(state: State):
    return {"bar": Overwrite(["new_value"])}  # 强制覆盖，不追加
```

**适用场景**：某些节点需要重置某个字段，而不是按 Reducer 逻辑累积。

!!! tip "参考答案"
    使用 Overwrite 类型可以绕过 Reducer 直接覆盖 State。比如某个字段配置了 `operator.add` 追加策略，但某节点需要强制覆盖而非追加，可以返回 `{"bar": Overwrite(["new_value"])}`。适用场景是某些节点需要重置某个字段，而不是按 Reducer 逻辑累积。

### 8. Reducer 初始值陷阱是什么？如何解决？

**问题**：非覆盖型 Reducer（如 `operator.mul`）与默认初始值运算会产生意外结果。

```python
class State(TypedDict):
    age: Annotated[float, operator.mul]  # float 默认值 0.0

app.invoke({'age': 1})  # 结果：age = 0.0 ❌
# 原因：0.0 * 1 = 0.0
```

**解决方案**：

| 方案 | 说明 |
|------|------|
| 不用 Annotated | 直接 `age: float`，节点返回什么就是什么 |
| 使用 Overwrite | `app.invoke({'age': Overwrite(1)})` |
| 自定义 Reducer | 处理初始值特殊情况 |

!!! tip "参考答案"
    Reducer 初始值陷阱是指：非覆盖型 Reducer（如 operator.mul）与默认初始值运算会产生意外结果。比如 `Annotated[float, operator.mul]`，float 默认值是 0.0，传入 1 后结果是 0.0 * 1 = 0.0。解决方案有三种：第一，不用 Annotated，直接声明类型；第二，使用 Overwrite 包裹初始值；第三，自定义 Reducer 处理初始值。注意累加型 reducer 没问题（0 + x = x），但累乘型必须特殊处理。

### 9. 什么是 Private State？为什么需要 Input/Output Schema 分离？

**Private State**：仅内部节点使用的状态，不暴露给图的输入/输出。

**Schema 分离的原因**：

- 内部节点传递的信息不需要出现在图的输入/输出中
- 图的输入/输出 Schema 与内部 Schema 不同
- 输出只包含少数关键字段，隐藏内部细节

**定义方式**：

```python
class PrivateState(TypedDict):
    bar: str  # 仅内部使用

class InputState(TypedDict):
    user_input: str

class OutputState(TypedDict):
    graph_output: str

class OverallState(TypedDict):
    foo: str
    user_input: str
    graph_output: str

# 创建图时指定 input/output schema
builder = StateGraph(OverallState, input_schema=InputState, output_schema=OutputState)
```

!!! tip "参考答案"
    Private State 是仅内部节点使用的状态，不暴露给图的输入/输出。Input/Output Schema 分离的原因是：内部节点传递的信息不需要出现在图的输入/输出中；图的输入/输出 Schema 可能与内部 Schema 不同；输出只包含少数关键字段，可以隐藏内部细节。实现方式是在创建 StateGraph 时指定 input_schema 和 output_schema 参数。

### 10. 图的 State Schema 是如何整合的？节点能写入哪些字段？

**整合规则**：

1. 图的 State 是**所有定义 Schema 的合集**（OverallState + PrivateState + InputState + OutputState）
2. **节点可写入图中任何已定义的字段**：即使节点输入 Schema 不包含某字段，只要该字段在图的某个 Schema 中定义过，节点就能写入
3. **新 Schema 自动注册**：只要 Schema 类定义存在，节点就能使用，LangGraph 自动注册

**示例**：

```python
class PrivateState(TypedDict):
    internal_data: str

class OverallState(TypedDict):
    user_input: str
    output: str

builder = StateGraph(OverallState)

def node_1(state: OverallState):
    # 可写入 PrivateState 中定义的字段
    return {"internal_data": "hello"}  # ✅ 合法

def node_2(state: OverallState):
    # 可写入 OverallState 中定义的字段
    return {"output": "world"}  # ✅ 合法
```

!!! tip "参考答案"
    图的 State Schema 整合规则有三点：第一，图的 State 是所有定义 Schema 的合集；第二，节点可写入图中任何已定义的字段，即使节点输入 Schema 不包含某字段，只要该字段在图的某个 Schema 中定义过，节点就能写入；第三，新 Schema 自动注册，只要 Schema 类定义存在，LangGraph 会自动注册。

## 三、Node（节点）

### 1. Node 在 LangGraph 中是什么？本质是什么？

**Node（节点）** 是图中的处理单元，本质是一个 **Python 函数**（同步或异步）。它接收当前 State，执行计算或副作用（如调用 LLM、API），返回 State 的部分更新。Node 会被转换为 RunnableLambda，自动获得 batch、async、tracing 支持。


### 2. Node 函数可以接收哪些参数？

Node 函数可接收 3 种参数（可选）：

| 参数 | 说明 |
|------|------|
| **`state`** | 图的当前 State |
| **`config`** | `RunnableConfig` 对象，包含 `thread_id`、tags 等配置信息 |
| **`runtime`** | `Runtime` 对象，包含 `context`、`store`、`stream_writer`、`execution_info` 等 |

```python
# 只接收 state
def plain_node(state: State):
    return state

# 接收 state + config
def node_with_config(state: State, config: RunnableConfig):
    thread_id = config["configurable"]["thread_id"]
    return {"result": f"Hello from thread {thread_id}"}

# 接收 state + runtime
def node_with_runtime(state: State, runtime: Runtime):
    user_id = runtime.context.user_id
    return {"result": f"Hello user {user_id}"}
```

!!! tip "参考答案"
    Node 函数可接收 3 种参数：第一，state，图的当前 State；第二，config，RunnableConfig 对象，包含 thread_id、tags 等配置信息；第三，runtime，Runtime 对象，包含 context、store、stream_writer、execution_info 等。

### 3. RunnableConfig 包含哪些信息？典型用途是什么？

**RunnableConfig** 包含：

- `configurable`：用户自定义配置（如 `thread_id`）
- `tags`：用于追踪和日志的标签
- `metadata`：额外元数据
- `callbacks`：回调函数列表

**典型用途**：

- 获取 `thread_id` 实现会话隔离
- 添加 tracing 标签便于 LangSmith 调试
- 注入自定义配置信息

!!! tip "参考答案"
    RunnableConfig 包含 configurable（用户自定义配置，如 thread_id）、tags（用于追踪和日志的标签）、metadata（额外元数据）、callbacks（回调函数列表）。典型用途是获取 thread_id 实现会话隔离，添加 tracing 标签便于 LangSmith 调试，注入自定义配置信息。

### 4. Runtime 对象包含哪些信息？execution_info 的作用？

**Runtime 对象**包含：

- `context`：运行时上下文（如 `user_id`）
- `store`：持久化存储接口
- `stream_writer`：流式输出写入器
- `execution_info`：执行信息

**execution_info 属性**：

| 属性 | 说明 |
|------|------|
| `node_attempt` | 当前执行尝试次数（1-indexed），重试时递增 |
| `node_first_attempt_time` | 第一次尝试的 Unix 时间戳 |

**典型用途**：重试时获取当前重试次数

```python
def my_node(state: State, runtime: Runtime):
    info = runtime.execution_info
    if info.node_attempt > 1:
        return {"result": call_fallback()}  # 重试时使用备用方案
    return {"result": call_primary()}
```

!!! tip "参考答案"
    Runtime 对象包含 context（运行时上下文）、store（持久化存储接口）、stream_writer（流式输出写入器）、execution_info（执行信息）。execution_info 的作用是获取当前执行状态，主要有两个属性：node_attempt（当前执行尝试次数，重试时递增）和 node_first_attempt_time（第一次尝试的 Unix 时间戳）。典型用途是在重试时获取当前重试次数，根据重试次数选择不同的处理策略。

---

### 5. 什么是 START 和 END 节点？它们的作用？

**START**：入口节点常量，表示用户输入进入图的起点。

```python
from langgraph.graph import START
graph.add_edge(START, "node_a")  # 指定首个执行的节点
```

**END**：终止节点常量，表示流程结束。

```python
from langgraph.graph import END
graph.add_edge("node_a", END)  # node_a 执行完毕后结束
```

它们不是真正的节点，而是表示"开始"和"结束"的标记常量。

### 6. Node 缓存（Cache）如何使用？适用什么场景？

**使用步骤**：

1. 编译图时指定 `cache`
2. 添加节点时指定 `cache_policy`

```python
from langgraph.cache.memory import InMemoryCache
from langgraph.types import CachePolicy

def expensive_node(state: State):
    time.sleep(2)  # 耗时计算
    return {"result": state["x"] * 2}

builder.add_node("expensive_node", expensive_node,
                 cache_policy=CachePolicy(ttl=3))
graph = builder.compile(cache=InMemoryCache())

# 第一次：耗时 2s
graph.invoke({"x": 5})  # {'result': 10}

# 第二次（3s 内）：命中缓存
graph.invoke({"x": 5})  # {'result': 10, '__metadata__': {'cached': True}}
```

**适用场景**：耗时计算节点（如 LLM 调用、数据处理），相同输入频繁执行时。

!!! tip "参考答案"
    使用 Node 缓存分两步：第一，编译图时指定 cache；第二，添加节点时指定 cache_policy。适用场景是耗时计算节点，如 LLM 调用、数据处理，相同输入频繁执行时可以显著提升性能。

### 7. CachePolicy 的 ttl 和 key_func 参数作用？

**CachePolicy 参数**：

| 参数 | 说明 |
|------|------|
| `ttl` | 缓存过期时间（秒），不指定则永不过期 |
| `key_func` | 生成缓存 key 的函数，默认对输入做 pickle hash |

```python
# 自定义 key_func
def custom_key_func(state):
    return state["user_id"]  # 按用户 ID 生成缓存 key

CachePolicy(key_func=custom_key_func, ttl=300)  # 5 分钟过期
```

!!! tip "参考答案"
    CachePolicy 有两个参数：ttl 是缓存过期时间（秒），不指定则永不过期；key_func 是生成缓存 key 的函数，默认对输入做 pickle hash。

### 8. Node 异常重试（RetryPolicy）如何配置？

**基本用法**：

```python
from langgraph.types import RetryPolicy

builder.add_node("node_name", node_function,
                 retry_policy=RetryPolicy(max_attempts=3))
```

**RetryPolicy 参数**：

| 参数 | 说明 |
|------|------|
| `max_attempts` | 最大重试次数 |
| `retry_on` | 触发重试的异常列表或判断函数 |
| `wait` | 重试等待策略（如指数退避） |

!!! tip "参考答案"
    配置 Node 异常重试使用 RetryPolicy，基本用法是在添加节点时指定 retry_policy 参数。RetryPolicy 有三个参数：max_attempts（最大重试次数）、retry_on（触发重试的异常列表或判断函数）、wait（重试等待策略，如指数退避）。

### 9. 默认重试策略对哪些异常不重试？为什么？

**默认不重试的异常**（认为是代码逻辑错误，重试无意义）：

- `ValueError`、`TypeError`、`ArithmeticError`
- `ImportError`、`LookupError`、`NameError`
- `SyntaxError`、`RuntimeError`、`ReferenceError`
- `StopIteration`、`StopAsyncIteration`
- `OSError`（部分情况）

**HTTP 库特殊处理**：仅对 **5xx 状态码** 重试，4xx 不重试。

!!! tip "参考答案"
    默认不重试的异常包括：ValueError、TypeError、ArithmeticError、ImportError、LookupError、NameError、SyntaxError、RuntimeError、ReferenceError、StopIteration、StopAsyncIteration、OSError 等。这些异常通常表示代码 bug 或参数错误，重试不会改变结果。HTTP 库特殊处理：仅对 5xx 状态码重试，4xx 不重试。

### 10. 如何在重试时获取当前重试次数？

通过 `runtime.execution_info.node_attempt` 获取：

```python
from langgraph.runtime import Runtime
from langgraph.types import RetryPolicy

def my_node(state: State, runtime: Runtime):
    info = runtime.execution_info
    print(f"当前是第 {info.node_attempt} 次尝试")

    if info.node_attempt > 1:
        return {"result": call_fallback()}  # 重试时使用备用方案

    return {"result": call_primary_api()}

builder.add_node("my_node", my_node,
                 retry_policy=RetryPolicy(max_attempts=3))
```

`node_attempt` 从 1 开始计数，首次执行是 1，第一次重试是 2。

!!! tip "参考答案"
    通过 runtime.execution_info.node_attempt 获取当前重试次数。node_attempt 从 1 开始计数，首次执行是 1，第一次重试是 2。典型用途是在重试时根据重试次数选择不同的处理策略，比如重试时使用备用方案。

## 四、Edge（边）

### 1. Edge 有哪几种类型？

| 类型 | 说明 |
|------|------|
| **Normal Edge** | 固定从一个节点到另一个节点 |
| **Conditional Edge** | 调用函数动态决定下一个节点 |
| **Entry Point** | 指定图的入口节点 |
| **Conditional Entry Point** | 调用函数动态决定入口节点 |

!!! tip "参考答案"
    Edge 有四种类型：Normal Edge（固定从一个节点到另一个节点）、Conditional Edge（调用函数动态决定下一个节点）、Entry Point（指定图的入口节点）、Conditional Entry Point（调用函数动态决定入口节点）。

### 2. Normal Edge 和 Conditional Edge 的区别？

| 维度 | Normal Edge | Conditional Edge |
|------|-------------|------------------|
| **路由方式** | 固定跳转 | 动态路由 |
| **定义方式** | `add_edge(from, to)` | `add_conditional_edges(from, func)` |
| **返回值** | 无 | 函数返回目标节点名 |
| **适用场景** | 固定流程 | 条件分支、动态路由 |

```python
# Normal Edge：A → B（固定）
graph.add_edge("node_a", "node_b")

# Conditional Edge：根据条件决定去 B 还是 C
def route(state):
    return "node_b" if state["success"] else "node_c"

graph.add_conditional_edges("node_a", route)
```

!!! tip "参考答案"
    Normal Edge 和 Conditional Edge 的区别有四点：第一，路由方式不同，Normal Edge 是固定跳转，Conditional Edge 是动态路由；第二，定义方式不同；第三，返回值不同；第四，适用场景不同，Normal Edge 适合固定流程，Conditional Edge 适合条件分支、动态路由。

### 3. 条件边的返回值是什么？

条件边函数返回 **目标节点的名称**（字符串）。

```python
def routing_function(state: State) -> str:
    return "node_b" if state["success"] else "node_c"

# 可映射返回值到节点名
graph.add_conditional_edges(
    "node_a",
    routing_function,
    {True: "node_b", False: "node_c"}
)
```

!!! tip "参考答案"
    条件边函数返回目标节点的名称（字符串）。也可以通过映射字典将返回值映射到节点名，比如 `{True: "node_b", False: "node_c"}`。

### 4. Entry Point 和 Conditional Entry Point 的区别？

| 维度 | Entry Point | Conditional Entry Point |
|------|-------------|------------------------|
| **目标** | 固定入口节点 | 动态决定入口节点 |
| **定义** | `add_edge(START, "node_a")` | `add_conditional_edges(START, func)` |
| **适用** | 单一入口 | 多入口、条件路由 |

```python
# Entry Point：固定从 node_a 开始
graph.add_edge(START, "node_a")

# Conditional Entry Point：根据条件决定入口
def choose_entry(state):
    return "node_b" if state["urgent"] else "node_c"

graph.add_conditional_edges(START, choose_entry)
```

!!! tip "参考答案"
    Entry Point 和 Conditional Entry Point 的区别有三点：第一，目标不同，Entry Point 是固定入口节点，Conditional Entry Point 是动态决定入口节点；第二，定义方式不同；第三，适用场景不同，Entry Point 适合单一入口，Conditional Entry Point 适合多入口、条件路由。

### 5. 一个节点可以有多个出边吗？执行行为是什么？

**可以**。一个节点可以有多个出边，所有目标节点将在下一个 **superstep** 中**并行执行**。

```python
# node_a 的出边指向 node_b 和 node_c
graph.add_edge("node_a", "node_b")
graph.add_edge("node_a", "node_c")

# 执行顺序：
# 1. node_a 执行
# 2. node_b 和 node_c 并行执行
```

!!! tip "参考答案"
    一个节点可以有多个出边，所有目标节点将在下一个 superstep 中并行执行。Superstep 是 LangGraph 的执行模型，每轮执行所有可执行的节点。

### 6. 什么是 Command？它和条件边有什么区别？

**Command** 是条件边的替代方案，可同时**更新状态和路由**。

```python
from langgraph.types import Command

def my_node(state: State):
    # 同时返回状态更新和路由决策
    return Command(
        update={"result": "processed"},  # 更新状态
        goto="next_node"  # 路由到下一节点
    )
```

**与条件边的区别**：

| 维度 | 条件边 | Command |
|------|--------|---------|
| **状态更新** | ❌ 只能路由 | ✅ 可同时更新状态 |
| **路由** | ✅ | ✅ |
| **简洁性** | 需要单独节点更新状态 | 一个函数完成两件事 |

!!! tip "参考答案"
    Command 是条件边的替代方案，可同时更新状态和路由。与条件边的区别是：条件边只能路由，不能更新状态；Command 可同时更新状态和路由，一个函数完成两件事，更加简洁。

## 五、Send（动态分发）

### 1. Send 的使用场景是什么？为什么需要它？

**使用场景**：

- 边的数量**预先未知**（如动态生成的列表）
- 需要**不同版本的 State** 同时存在（如 Map-Reduce 模式）

默认情况下，节点和边在编译前就已定义，所有节点共享同一个 State。Send 用于支持**动态分发**模式。

!!! tip "参考答案"
    Send 的使用场景有两个：第一，边的数量预先未知，如动态生成的列表；第二，需要不同版本的 State 同时存在，如 Map-Reduce 模式。默认情况下，节点和边在编译前就已定义，所有节点共享同一个 State，而 Send 用于支持动态分发模式。

### 2. Send 对象的两个参数是什么？

```python
Send(node_name, state_dict)
```

| 参数 | 说明 |
|------|------|
| `node_name` | 目标节点名称 |
| `state_dict` | 传递给该节点的 State（可以是不同的 State） |

!!! tip "参考答案"
    Send 对象有两个参数：node_name（目标节点名称）和 state_dict（传递给该节点的 State，可以是不同的 State）。

### 3. 如何用 Send 实现 Map-Reduce 模式？

```python
from langgraph.types import Send

def continue_to_jokes(state: OverallState):
    # 动态生成多个 Send，每个 subject 发送到 generate_joke 节点
    return [
        Send("generate_joke", {"subject": s})
        for s in state['subjects']
    ]

graph.add_conditional_edges("node_a", continue_to_jokes)

# 后续添加 reduce 节点汇总结果
graph.add_edge("generate_joke", "reduce_node")
```

**执行流程**：

1. `node_a` 生成 subjects 列表
2. 条件边返回多个 Send，每个 subject 发送到 `generate_joke`
3. 所有 `generate_joke` 实例**并行执行**
4. 结果汇总到 `reduce_node`

!!! tip "参考答案"
    使用 Send 实现 Map-Reduce 模式的步骤：首先在一个节点中返回 Send 列表，每个 Send 指向同一个节点但传入不同的 State；然后所有实例并行执行；最后添加一个 reduce 节点汇总结果。执行流程是：node_a 生成 subjects 列表，条件边返回多个 Send，每个 subject 发送到 generate_joke 节点并行执行，结果汇总到 reduce_node。

## 六、Graph 构建

### 1. LangGraph 构建图的基本流程？

```python
from langgraph.graph import StateGraph, START, END

# 1. 定义 State
class State(TypedDict):
    messages: list
    count: int

# 2. 创建图
graph = StateGraph(State)

# 3. 添加节点
graph.add_node('node_a', node_a_func)
graph.add_node('node_b', node_b_func)

# 4. 添加边
graph.add_edge(START, 'node_a')
graph.add_edge('node_a', 'node_b')
graph.add_edge('node_b', END)

# 5. 编译
app = graph.compile()

# 6. 执行
result = app.invoke({"messages": [], "count": 0})
```

!!! tip "参考答案"
    LangGraph 构建图的基本流程有 6 步：第一，定义 State；第二，创建图（StateGraph）；第三，添加节点；第四，添加边（包括 START 和 END）；第五，编译（compile）；第六，执行（invoke）。

### 2. StateGraph 构造函数可以指定哪些 Schema？

```python
StateGraph(state_schema, input_schema=None, output_schema=None)
```

| 参数 | 说明 |
|------|------|
| `state_schema` | 图的整体 State Schema（必需） |
| `input_schema` | 输入 Schema，约束图的输入 |
| `output_schema` | 输出 Schema，约束图的输出 |

**示例**：

```python
class InputState(TypedDict):
    user_input: str

class OutputState(TypedDict):
    graph_output: str

class OverallState(TypedDict):
    foo: str
    user_input: str
    graph_output: str

builder = StateGraph(OverallState,
                     input_schema=InputState,
                     output_schema=OutputState)
```

!!! tip "参考答案"
    StateGraph 构造函数可以指定三个 Schema：state_schema（图的整体 State Schema，必需）、input_schema（输入 Schema，约束图的输入）、output_schema（输出 Schema，约束图的输出）。

### 3. compile() 方法的作用？编译后返回什么？

**compile()** 方法将图编译为可执行的 `RunnableGraph`。

**作用**：

- 验证图结构完整性（无死循环、所有节点可达）
- 初始化执行引擎
- 配置缓存、持久化等特性

**返回值**：`CompiledGraph` 对象，支持：

- `invoke(input)`：同步执行
- `ainvoke(input)`：异步执行
- `stream(input)`：流式输出
- `get_state(thread_id)`：获取指定线程的状态

!!! tip "参考答案"
    compile() 方法将图编译为可执行的 RunnableGraph。它的作用是验证图结构完整性、初始化执行引擎、配置缓存和持久化等特性。返回值是 CompiledGraph 对象，支持 invoke（同步执行）、ainvoke（异步执行）、stream（流式输出）、get_state（获取指定线程的状态）等方法。

## 七、高级特性

### 1. 什么是 Durable Execution？它支持哪些能力？

**Durable Execution（持久化执行）** 是指工作流可以在故障后恢复、支持长时间运行。

支持的能力：

- **故障恢复**：进程崩溃后可从断点继续
- **断点续跑**：长时间任务可暂停后继续
- **状态持久化**：State 自动保存到存储
- **时间旅行**：可查看历史任意时刻的状态

!!! tip "参考答案"
    Durable Execution（持久化执行）是指工作流可以在故障后恢复、支持长时间运行。它支持的能力有：故障恢复（进程崩溃后可从断点继续）、断点续跑（长时间任务可暂停后继续）、状态持久化（State 自动保存到存储）、时间旅行（可查看历史任意时刻的状态）。适用场景是需要运行数小时甚至数天的长期任务。

### 2. Human-in-the-loop 是什么？如何实现？

**Human-in-the-loop** 是指在工作流中引入人工审核节点，让人可以在关键节点检查、修改状态后再继续。

**实现方式**：

1. 在需要人工介入的节点前设置**中断点**
2. 使用 `interrupt()` 函数暂停执行
3. 人工检查/修改状态后，调用 `continue()` 恢复

```python
from langgraph.types import interrupt

def review_node(state: State):
    # 暂停执行，等待人工审核
    decision = interrupt({
        "type": "review",
        "data": state["pending_content"]
    })

    if decision["approve"]:
        return {"status": "approved"}
    else:
        return {"status": "rejected"}
```

!!! tip "参考答案"
    Human-in-the-loop 是指在工作流中引入人工审核节点，让人可以在关键节点检查、修改状态后再继续。实现方式是：在需要人工介入的节点前设置中断点，使用 interrupt() 函数暂停执行，人工检查/修改状态后，调用 continue() 恢复。

### 3. LangGraph 的 Memory 机制是什么？

LangGraph 提供两层记忆：

**1. 短期记忆（Thread Memory）**

- 基于 `thread_id` 的会话内记忆
- 存储在 State 的 `messages` 字段
- 会话结束即消失

**2. 长期记忆（Cross-Thread Memory）**

- 跨会话的持久化记忆
- 通过 `Store` 接口存取
- 可用于用户偏好、历史经验等

```python
def memory_node(state: State, runtime: Runtime):
    # 写入长期记忆
    runtime.store.put(
        ("user", state["user_id"]),
        "preference",
        {"theme": "dark"}
    )

    # 读取长期记忆
    pref = runtime.store.get(("user", state["user_id"]), "preference")

    return {"theme": pref["theme"]}
```

!!! tip "参考答案"
    LangGraph 提供两层记忆机制：第一层是短期记忆（Thread Memory），基于 thread_id 的会话内记忆，存储在 State 的 messages 字段，会话结束即消失；第二层是长期记忆（Cross-Thread Memory），跨会话的持久化记忆，通过 Store 接口存取，可用于用户偏好、历史经验等。