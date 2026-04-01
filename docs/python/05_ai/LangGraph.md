## LangGraph 概述

### LangGraph 是什么？

LangGraph is very low-level, and focused entirely on agent **orchestration**.

### LangGraph 与 LangChain

LangChain 的 Chain 天然是顺序执行的（DAG），即使有分支链也难以处理复杂编排；而 Agent 虽能实现 ReAct 模式，但执行过程是黑盒，无法精细干预。

为解决这些局限，LangGraph 应运而生——它专注于 **Agent 编排（orchestration）**，提供循环图、状态管理、人工介入等底层能力，让我们尽可能的掌控 Agent 的执行流程。

### LangGraph 核心优势

 LangGraph is focused on the underlying capabilities important for agent orchestration: durable execution, streaming, human-in-the-loop, and more.

- [Durable execution](https://docs.langchain.com/oss/python/langgraph/durable-execution)：故障恢复、断点续跑、长时间运行
- [Human-in-the-loop](https://docs.langchain.com/oss/python/langgraph/interrupts)：随时检查和修改 Agent 状态
- [Comprehensive memory](https://docs.langchain.com/oss/python/concepts/memory)：短期推理记忆 + 跨会话长期记忆
- [Debugging with LangSmith](https://docs.langchain.com/langsmith/home)：可视化追踪、状态转换、运行时指标
- [Production-ready deployment](https://docs.langchain.com/langsmith/deployment):：专为有状态工作流设计的可扩展架构


### LangGraph 的实用场景

LangChain 适合流程固定、逻辑简单的场景；LangGraph 适用于：

- **多轮对话 Agent**：需维护对话状态和上下文记忆
- **复杂工作流**：循环执行、条件分支、动态路由
- **人工审核流程**：关键节点需人工确认或修改
- **长期运行任务**：需故障恢复、断点续跑
- **Multi-Agent 协作**：多 Agent 间有依赖或通信

> 一句话：需要**精细控制流程、维护状态、人工介入**时，选 LangGraph。

### LangGraph HelloWorld

这个案例不涉及 Agent、ChatModel，只展示 LangGraph 核心概念。从案例可看出：Graph 的输入是一个 **State 字典**，每个节点接收上一节点返回的 State 更新，并返回部分更新合并到 State 中。

更多可参考：[官方入门案例](https://docs.langchain.com/oss/python/langgraph/quickstart) 

``` python
from langgraph.graph import StateGraph  
from langgraph.constants import START, END  
from typing import TypedDict  
  
# 定义共享状态  
class HelloState(TypedDict):  
    name: str  
  
# 定义节点（函数）  
def hello(state: HelloState) -> HelloState:  
    return {  
    "name": f"Hello, {state['name']}!"  
    }  
  
def add_emoji(state: HelloState) -> HelloState:  
    return {  
    "name": f"{state['name']} 😊"  
    }  
  
# 创建图  
graph = StateGraph(HelloState)  
  
# 添加节点  
graph.add_node('hello', hello)  
graph.add_node('add_emoji', add_emoji)  
  
# 添加边  
graph.add_edge(START, 'hello')  
graph.add_edge('hello', 'add_emoji')  
graph.add_edge('add_emoji', END)  
  
# 编译图  
app = graph.compile()  
  
resp = app.invoke({"name": "liutianba7"})  
print(resp)
```

## [LangGraph 核心概念](https://docs.langchain.com/oss/python/langgraph/graph-api)

### State

State 是图中各节点共享的数据结构，贯穿整个执行流程。

``` python
from typing import TypedDict, Annotated
from langgraph.graph import add_messages

# 基础定义
class State(TypedDict):
    name: str
    count: int

# 使用 Annotated + Reducer（自动合并）
class State(TypedDict):
    messages: Annotated[list, add_messages]  # 自动追加消息

```

- State 通过 `TypedDict` 定义类型
- 节点返回**部分更新**，自动合并到 State 中
- `Annotated[type, reducer]` 可指定合并策略（如 `add_messages` 追加消息）


### Node

节点是图中的处理单元，本质上是一个**函数**。

``` python
def my_node(state: State) -> dict:
    # 读取 state
    name = state["name"]
    # 返回部分更新
    return {"name": f"Hello, {name}"}
```

- 输入：当前 State
- 输出：State 的部分更新
- 函数名即节点名，或通过 `add_node('name', func)` 指定

### Edge

边定义节点之间的执行顺序和条件。

**普通边**：固定跳转

```python
graph.add_edge('node_a', 'node_b')  # A → B
```

**条件边**：动态路由

```python
def route_fn(state: State) -> str:
    return 'node_b' if state['count'] > 5 else 'node_c'

graph.add_conditional_edges('node_a', route_fn)
```

### Graph

图的构建流程：**定义 State → 添加节点 → 添加边 → 编译执行**

``` python
from langgraph.graph import StateGraph, START, END

# 1. 创建图
graph = StateGraph(State)

# 2. 添加节点
graph.add_node('node_a', node_a_func)
graph.add_node('node_b', node_b_func)

# 3. 添加边
graph.add_edge(START, 'node_a')
graph.add_edge('node_a', 'node_b')
graph.add_edge('node_b', END)

# 4. 编译
app = graph.compile()

# 5. 执行
result = app.invoke({"name": "test"})

```

## LangGraph 图的构建

- `StateGraph(state_schema)` — 创建图
- `add_node(name, func)` — 添加节点
- `add_edge(from, to)` — 添加普通边
- `add_conditional_edges(from, route_fn)` — 添加条件边
- `set_entry_point(name)` — 设置入口节点
- `set_conditional_entry_point(route_fn)` — 条件入口
- `compile()` — 编译图


## LangGraph State

### State 是什么？

[`State`](https://docs.langchain.com/oss/python/langgraph/graph-api#state): A shared data structure that represents the current snapshot of your application. It can be any data type, but is typically defined using a shared state schema.

### State 定义方式

LangGraph 支持使用 `TypedDict` 、[`dataclass`](https://docs.python.org/3/library/dataclasses.html)、`Pydantic BaseModel`去定义 State。

!!! warning "注意"
    LangChain 的 `create_agent` 工厂函数不支持 Pydantic State 定义

#### TypedDict

``` python
class AgentState(TypedDict):  
    messages: Annotated[list[AnyMessage], operator.add]  
    llm_calls: int
```

#### Dataclass

如何 State 需要默认值，则使用 `dataclass` 定义 State

``` python
@dataclass
class StateWithDefaults:
    messages: list = field(default_factory=list)  # 默认空列表
    retries: int = 3  # 默认值
    status: str = "pending"
```

#### Pydantic

如果需要做参数校验，则使用 `pydantic` 这种方式定义 State

``` python
class PydanticState(BaseModel):  
    name: str = Field(..., description='name', max_length=10)  
    age: int = Field(..., description='age', gt=0)
```


### State Multiple schemas

通常所有节点共享同一个 State Schema，但有时需要更精细的控制：

- 内部节点传递的信息不需要出现在图的输入/输出中
- 图的输入/输出 Schema 与内部 Schema 不同
- 输出只包含少数关键字段

**Private State（私有状态）** ：定义私有 Schema，用于内部节点通信，不会暴露给图的输入/输出：

```python
class PrivateState(TypedDict):
    bar: str  # 仅内部使用
```

**Input / Output Schema** ：定义显式的输入、输出 Schema，约束图的输入和输出：

```python
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

!!! tip "关键细节"
    0. 图的 State 是**所有定义 Schema 的合集**。
    1. **节点可写入图中定义过的 state channel**：即使节点输入 Schema 不包含某字段，节点仍可写入图中定义的其他 state channel（如 `node_1` 写入 `foo`）
    2. **节点可声明新的 state channel**：只要 Schema 定义存在，节点就能使用未在 `StateGraph` 初始化中传入的 Schema（如 `PrivateState`）

!!! summary "总结"
    1. 写入：只要字段在**图的某个 Schema** 中定义过，节点就能写
    2. 新增：只要 Schema **类定义存在**，节点就能用它，LangGraph 自动注册



### State Reducer

在 `LangGraph` 中，描述 `State` 每个键如何被更新的函数就是 `Reducer`，`State` 中的每个键都会对应一个 `Reducer`。
#### Reducer 默认行为

不指定 Reducer 时，默认**直接覆盖**：

```python
class AgentState(TypedDict):  
    name: str # 默认 Reducer 是覆盖  
    messages: Annotated[list[AnyMessage]] #  默认 Reducer 是覆盖
```

#### Reducer 内置

使用 `Annotated[type, reducer]` 指定合并策略：

``` python
from operator import add

# 定义整个图的 State Schemaclass AgentState(TypedDict):  
    name: Annotated[str, operator.add] # 追加策略
    messages: Annotated[list[AnyMessage], operator.add] # 追加策略

```

- `operator.add` — 列表追加、数值累加
- `add_messages` — 消息追加（LangGraph 内置）
- `merge_dicts` — 字典合并

#### Reducer 自定义

编写自己的合并函数，接收 `(current_value, new_value)` 返回合并结果：

```python
def custom_reducer(current: list, new: list) -> list:
    """自定义合并逻辑：去重合并"""
    return current + [x for x in new if x not in current]

class State(TypedDict):
    items: Annotated[list[str], custom_reducer]

# 输入：{"items": ["a", "b"]}
# Node 返回 {"items": ["b", "c"]}
# 结果：{"items": ["a", "b", "c"]}  ← b 已存在，不重复添加
```

!!! tip "Reducer 函数签名"
    `reducer(current_value, new_value) -> merged_value`

#### Reducer 强制覆盖

某些场景需要绕过 Reducer 直接覆盖，使用 `Overwrite` 类型：

```python
from langgraph.graph import Overwrite

# 假设 bar 配置了追加策略
class State(TypedDict):
    bar: Annotated[list[str], add]

# 但某节点想强制覆盖而非追加
def force_overwrite_node(state: State):
    return {"bar": Overwrite(["new_value"])}  # 直接覆盖，绕过 add reducer
```

!!! note "使用场景"
    In some cases, you may want to bypass a reducer and directly overwrite a state value. LangGraph provides the [`Overwrite`](https://reference.langchain.com/python/langgraph/types/) type for this purpose. [Learn how to use `Overwrite` here](https://docs.langchain.com/oss/python/langgraph/use-graph-api#bypass-reducers-with-overwrite).

#### Reducer State 初始值陷阱  
  
**问题**：LangGraph 会为 State 字段赋予初始值，我们传入的值本质上是覆盖了原有的初始值。但是对于**非覆盖 Reducer**（如 `operator.mul`）来说，就会出现一些问题。  
  
```python  
class AgentState(TypedDict):  
    age: Annotated[float, operator.mul]  # float 默认值是 0.0  
    
app.invoke({'age': 1})  # 结果：age = 0.0 ❌  
# 原因：0.0 * 1 = 0.0  
```  
  
**解决方案**：  

1. **方案 1**：不用 Annotated，直接 `age: float`，节点返回什么就是什么  
2. **方案 2**：使用 `Overwrite(1)` 包裹初始值，避免与默认值进行 reducer 操作  
3. **方案 3**：使用自定义 `Reducer`
  
!!! tip "累加型 reducer（`operator.add`）没问题（`0 + x = x`），但累乘型（`operator.mul`）会得到 0（`0.0 * x = 0.0`），必须特殊处理这个初始值。"

---
## LangGraph Node

### Node 概述

[`Nodes`](https://docs.langchain.com/oss/python/langgraph/graph-api#nodes)是编码 Agent 逻辑的 Python 函数（同步或异步），接收当前 State，执行计算或副作用，返回更新后的 State。Node 函数的参数如下：

1. `state`—The [state](https://docs.langchain.com/oss/python/langgraph/graph-api#state) of the graph
2. `config`—A [`RunnableConfig`](https://reference.langchain.com/python/langchain-core/runnables/config/RunnableConfig) object that contains configuration information like `thread_id` and tracing information like `tags`
3. `runtime`—A `Runtime` object that contains [runtime `context`](https://docs.langchain.com/oss/python/langgraph/graph-api#runtime-context) and other information like `store`, `stream_writer`, and `execution_info`

### Node 定义方式

**基础节点**：只接收 state

```python
def plain_node(state: State):
    return state  # 返回更新
```

**带 config 的节点**：

```python
def node_with_config(state: State, config: RunnableConfig):
    thread_id = config["configurable"]["thread_id"]
    return {"results": f"Hello, {state['input']}!"}
```

**带 runtime 的节点**：

```python
def node_with_runtime(state: State, runtime: Runtime):
    user_id = runtime.context.user_id  # 获取运行时上下文
    return {"results": f"Hello, {state['input']}!"}
```

!!! tip "幕后机制"
    函数会被转换为 `RunnableLambda`，自动获得 batch、async、tracing 支持

### Node 特殊节点

**START**：入口节点，表示用户输入进入图的起点

```python
from langgraph.graph import START
graph.add_edge(START, "node_a")  # 指定首个执行的节点
```

**END**：终止节点，表示流程结束

```python
from langgraph.graph import END
graph.add_edge("node_a", END)  # node_a 执行完毕后结束
```


### [Node 缓存](https://docs.langchain.com/oss/python/langgraph/use-graph-api#add-node-caching)

LangGraph 支持基于输入的节点缓存，相同输入再次执行时直接返回缓存值，无需重复计算。

**使用缓存的步骤**：

1. 编译图时指定 cache
2. 添加节点时指定 `cache_policy`

**CachePolicy 参数**：

| 参数         | 说明                              |
| ---------- | ------------------------------- |
| `key_func` | 生成缓存 key 的函数，默认对输入做 pickle hash |
| `ttl`      | 缓存过期时间（秒），不指定则永不过期              |

**示例**：

```python
from langgraph.cache.memory import InMemoryCache
from langgraph.types import CachePolicy

def expensive_node(state: State):
    time.sleep(2)  # 耗时计算
    return {"result": state["x"] * 2}

# 添加节点时指定缓存策略
builder.add_node("expensive_node", expensive_node, cache_policy=CachePolicy(ttl=3))

# 编译时指定缓存
graph = builder.compile(cache=InMemoryCache())

# 第一次执行：耗时 2s
graph.invoke({"x": 5})  # {'result': 10}

# 第二次执行（3s 内）：命中缓存，立即返回
graph.invoke({"x": 5})  # {'result': 10, '__metadata__': {'cached': True}}
```

!!! tip "适用场景"
    耗时计算节点（如 LLM 调用、数据处理），相同输入频繁执行时启用缓存可显著提升性能。


### [Node 异常重试](https://docs.langchain.com/oss/python/langgraph/use-graph-api#add-retry-policies)

LangGraph 支持为节点配置重试策略，适用于 API 调用、数据库查询、LLM 调用等可能失败的操作。

**基本用法**：

```python
from langgraph.types import RetryPolicy

builder.add_node("node_name", node_function, retry_policy=RetryPolicy())
```

[**RetryPolicy 参数**](https://reference.langchain.com/python/langgraph/types/RetryPolicy)：

| 参数             | 说明                                |
| -------------- | --------------------------------- |
| `max_attempts` | 最大重试次数                            |
| `retry_on`     | 触发重试的异常条件，默认使用 `default_retry_on` |
| `wait`         | 重试等待策略                            |

!!! tip "retry_on"
    retry_on：List of exception classes that should trigger a retry, or a callable that returns `True` for exceptions that should trigger a retry.

**默认重试策略**：默认重试除了以下异常外的所有异常

- `ValueError`、`TypeError`、`ArithmeticError`
- `ImportError`、`LookupError`、`NameError`
- `SyntaxError`、`RuntimeError`、`ReferenceError`
- `StopIteration`、`StopAsyncIteration`、`OSError`

对于 HTTP 库（requests、httpx），仅对 **5xx 状态码**重试。

**获取重试信息**：通过 `runtime.execution_info` 可获取当前重试状态：

```python
from langgraph.runtime import Runtime

def my_node(state: State, runtime: Runtime):
    info = runtime.execution_info
    if info.node_attempt > 1:
    # 重试时使用备用方案
    return {"result": call_fallback_api()}
    return {"result": call_primary_api()}

builder.add_node("my_node", my_node, retry_policy=RetryPolicy(max_attempts=3))
```

**execution_info 属性**：

| 属性                        | 说明                              |
| ------------------------- | ------------------------------- |
| `node_attempt`            | 当前执行尝试次数（1-indexed），首次为 1，重试时递增 |
| `node_first_attempt_time` | 第一次尝试的 Unix 时间戳（秒），重试期间保持不变     |

!!! tip "适用场景"
    外部 API 调用、LLM 调用、数据库查询等不稳定操作，配置重试策略可提高可靠性。


## LangGraph Edge

[Edges](https://docs.langchain.com/oss/python/langgraph/graph-api#normal-edges) define how the logic is routed and how the graph decides to stop. This is a big part of how your agents work and how different nodes communicate with each other. There are a few key types of edges:
### Edge 类型

| 类型 | 说明 |
|------|------|
| **Normal Edge** | 固定从一个节点到下一个节点 |
| **Conditional Edge** | 调用函数决定下一步去哪个节点 |
| **Entry Point** | 用户输入进入图的第一个节点 |
| **Conditional Entry Point** | 调用函数决定第一个执行的节点 |

!!! tip "并行执行"
    一个节点可以有多个出边，所有目标节点将在下一个 superstep 中**并行执行**。

### Normal Edge

固定路由，A → B：

```python
graph.add_edge("node_a", "node_b")
```

### Conditional Edge

动态路由，根据函数返回值决定下一个节点：

```python
def routing_function(state: State) -> str:
    return "node_b" if state["success"] else "node_c"

# 基本用法：返回值即为节点名
graph.add_conditional_edges("node_a", routing_function)

# 可选：映射返回值到节点名
graph.add_conditional_edges("node_a", routing_function, {True: "node_b", False: "node_c"})
```

### Entry Point

图的入口，指定第一个执行的节点：

```python
from langgraph.graph import START

graph.add_edge(START, "node_a")
```

### Conditional Entry Point

根据逻辑动态决定入口节点：

```python
from langgraph.graph import START

graph.add_conditional_edges(START, routing_function)
graph.add_conditional_edges(START, routing_function, {True: "node_b", False: "node_c"})
```

!!! note "Command 替代方案"
    如果想在同一个函数中**同时更新状态和路由**，可使用 [`Command`](https://docs.langchain.com/oss/python/langgraph/graph-api#command) 替代条件边。


## LangGraph Send

默认情况下，节点和边在编译前就已定义，且所有节点共享同一个 State。但某些场景下：

- 边的数量**预先未知**（如动态生成的列表长度）
- 需要**不同版本的 State** 同时存在（如 Map-Reduce 模式）

`Send` 用于支持这种动态分发模式，从条件边返回 `Send` 对象，将不同 State 发送到同一节点。

### Send 参数

```python
Send(node_name, state_dict)
```

| 参数           | 说明                          |
| ------------ | --------------------------- |
| `node_name`  | 目标节点名称                      |
| `state_dict` | 传递给该节点的 State（可以是不同的 State） |

### 示例：Map-Reduce 模式

```python
from langgraph.types import Send

def continue_to_jokes(state: OverallState):
    # 动态生成多个 Send，每个 subject 发送到 generate_joke 节点
    return [Send("generate_joke", {"subject": s}) for s in state['subjects']]

graph.add_conditional_edges("node_a", continue_to_jokes)
```

!!! tip "适用场景"
    Map-Reduce 模式：一个节点生成列表，后续节点并行处理列表中的每个元素（元素数量预先未知）。
