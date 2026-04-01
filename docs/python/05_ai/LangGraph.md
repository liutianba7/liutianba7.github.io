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

