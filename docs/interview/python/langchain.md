# LangChain 面试题

## 一、基础概念

### 1. LangChain 是什么？解决了什么问题？

LangChain 是一个开源框架，使用 LangChain 能够轻松构建完全自定义的、由 LLM 驱动的智能体和应用程序

**核心解决的问题**：

1. **模型切换困难** → 提供统一接口，轻松在不同模型供应商（OpenAI、Claude、Qwen 等）之间切换
2. **组件组合复杂** → 通过链（Chain）机制，将模型、提示词、解析器等组件轻松串联
3. **状态管理缺失** → 提供 Memory 组件管理对话历史
4. **外部数据连接** → 通过 RAG 技术连接私有数据源
5. **工具调用能力** → Agent 可以调用外部工具和 API

**六大核心组件**：

官网列出的 core component 实际有七个，分别为：Models、Agents、Messages、Tools、Memory、Streaming、Structured output

| 组件 | 作用 |
|------|------|
| **Models** | 模型调用（LLM、Chat Models、Embeddings） |
| **Prompts** | 提示词模板管理 |
| **Memory** | 对话历史记忆 |
| **Retrieval** | 外部数据检索（RAG） |
| **Chains** | 组件串联执行 |
| **Agents** | 自主决策与工具调用 |

---

### 2. Runnable 接口是什么？有什么作用？

**Runnable** 是 LangChain 中的一套标准化协议（本质是一个抽象类），它为大部分组件（智能体、
模型、提示词、解析器）提供了统一的调用方式。

**设计理念**：

> 只要两个组件都实现了 Runnable 接口，且输入输出类型匹配，它们就能无缝对接。

**四大核心方法**：

| 方法 | 执行模式 | 适用场景 |
|------|----------|----------|
| `invoke()` | 同步执行 | 单次请求，最基础的调用方式 |
| `ainvoke()` | 异步执行 | 高并发场景，通过 `await` 提高性能 |
| `batch()` | 批量执行 | 同时处理多个输入，内部自动并行 |
| `stream()` | 流式执行 | 实时返回数据片段，"打字机"效果 |

### 3. invoke / stream / batch 三种调用方式的区别？

- **invoke**：同步单次调用，一次性返回完整结果，适合简单查询和后台任务
- **stream**：流式调用，逐块返回数据，首字节响应快，适合聊天界面的打字机效果
- **batch**：批量调用，并行处理多个输入。

---

### 4. 同步调用和异步调用的区别？

同步调用就是即使当前进行的是 io 操作，也不会释放cpu，而是阻塞等待，直到获取结果。

而异步调用遇到 io 操作等不需要 cpu 的场景下，会挂起当前协程，然后释放 cpu，之后 cpu 就可以执行其他任务了。

**异步示例**：

```python
import asyncio

async def main():
    # 并发调用多个请求
    results = await asyncio.gather(
        chain.ainvoke({"input": "问题1"}),
        chain.ainvoke({"input": "问题2"}),
        chain.ainvoke({"input": "问题3"})
    )
    return results

# 运行异步函数
asyncio.run(main())
```

**何时使用异步**：

- Web 服务器（FastAPI、Flask 异步模式）
- 需要同时调用多个 LLM
- 高并发场景

---

### 5. LCEL（LangChain Expression Language）是什么？

**LCEL** 是 LangChain 的表达式语言，核心是 **管道符 `|`**，用于将组件串联成链。

**特点**：

1. **声明式**：代码即配置，直观易读
2. **自动继承**：任何通过 `|` 构建的链自动支持同步、异步、批量、流式
3. **类型安全**：输入输出类型匹配才能连接

**经典结构**：

```python
chain = prompt | model | output_parser
```

**工作原理**：

```
prompt (输出: PromptValue)
    ↓ |
model (输入: PromptValue, 输出: AIMessage)
    ↓ |
output_parser (输入: AIMessage, 输出: str)
```

---

### 6. LangChain 0.3 和 1.0+ 版本的主要变化？

最大变化是 Agent 的构建方式：0.3 版本使用 AgentExecutor + create_xxx_agent 的组合，而 1.0+ 版本推荐使用 LangGraph 图结构来构建 Agent，状态管理也从手动管理变为强制使用 TypedDict 定义状态类型。

总体来说，新版本更强调使用 LangGraph 来构建复杂应用，同时对旧版本保持大部分兼容性，迁移时 Agent 相关功能建议优先迁移到 LangGraph。

---

### 7. 什么是 LLM 和 Chat Model？有什么区别？

**LLM** 是纯文本模型，输入字符串输出字符串，本质是文本补全器，代表是 GPT-3。

**Chat Model** 是聊天模型，输入消息列表，输出 BaseMessage 对象，专为对话设计，能识别不同角色消息，更适合构建多轮对话和智能助手。代表是 GPT-4、Claude、Qwen。

### 8. 什么是 tool calling?

**tool calling** 是 LangChain 中一个核心功能，它可以让 LLM 调用外部工具。

### 9. 什么是 mcp？

`mcp` 是一个开源的协议，它标准化了一些应用如何提供给 llm 工具和资源，在 LangChain 中，agent 或者 model 可以通过 langchain-mcp-adapter 去获取 mcp server 提供的工具和资源的。

---

## 二、模型调用

### 1. LangChain 中如何创建和调用 LLM？

**LangChain** 中创建 LLM 的方式有 3 种：

1. **init_chat_model**：通过 `init_chat_model` 创建 LLM，这是最推荐的写法
2. **provider 原生方式**：通过 Provider 原生方式创建 LLM,例如：ChatDeepSeek, ChatTongyi, ChatZhipuAI, ChatOllama... 
3. **OpenAI 兼容方式**：通过 ChatOpenAi 创建 LLM

### 2. init_chat_model 与 Provider 原生创建方式的区别？

**init_chat_model** 是 LangChain 1.0+ 推荐的统一接口，代码简洁，适合快速开发和多模型切换场景。

**Provider 原生方式**（如 ChatOpenAI、ChatDeepSeek、ChatTongyi）能访问每个 provider 的专属参数和高级功能，类型提示更精确，适合生产环境需要精细控制的场景。

简单说：快速开发用 init_chat_model，生产环境需要高级配置用 Provider 原生类。

### 3. 如何获取 Token 消耗统计？usage_metadata 的作用？

调用模型后返回的 AIMessage 对象中包含 **usage_metadata** 字段，这是 LangChain 提供的标准化 Token 统计接口。

通过 `usage_metadata` 可以获取三个核心数据：**input_tokens**（输入 token 数）、**output_tokens**（输出 token 数）、**total_tokens**（总消耗 token 数）。

推荐使用 usage_metadata 而不是 response_metadata 中的 token_usage，因为它是新版本规范接口，在不同模型供应商之间保持一致。

```json
{
  'input_tokens': 11, 
  'output_tokens': 458, 
  'total_tokens': 469
}
```

---

### 4. 流式输出的实现方式？

LangChain 封装了 ChatModel 的流式输出，通过 `stream()` 方法实现。不同于 `invoke()`，`stream()` 方法会返回一个生成器，每次迭代都会返回一个 AiMessageChunk 对象。

```python
class AIMessageChunk(AIMessage, BaseMessageChunk):
    """Message chunk from an AI (yielded when streaming)."""

    # Ignoring mypy re-assignment here since we're overriding the value
    # to make sure that the chunk variant can be discriminated from the
    # non-chunk variant.
```

Agent 的流式输出比较复杂，这里参考官网的写法，每次拿到消息列表的最后一条消息进行输出。

```python
from langchain.messages import AIMessage, HumanMessage

for chunk in agent.stream({
    "messages": [{"role": "user", "content": "Search for AI news and summarize the findings"}]
}, stream_mode="values"):
    # Each chunk contains the full state at that point
    latest_message = chunk["messages"][-1]
    if latest_message.content:
        if isinstance(latest_message, HumanMessage):
            print(f"User: {latest_message.content}")
        elif isinstance(latest_message, AIMessage):
            print(f"Agent: {latest_message.content}")
    elif latest_message.tool_calls:
        print(f"Calling tools: {[tc['name'] for tc in latest_message.tool_calls]}")
```

### 三、提示词工程

### 1. 什么是提示词工程，为什么要做提示词工程

**提示词工程**是指通过精心设计、优化和精炼输入文本（Prompt），以引导大语言模型生成准确、高质量且符合预期结果的过程。

**为什么要做提示词工程**：

1. **激发模型能力**：好的提示词能充分利用模型在预训练阶段学到的知识，在海量参数空间中为模型勾勒出通往正确答案的"概率路径"
2. **减少幻觉**：通过提供上下文、示例和约束条件，降低模型胡编乱造的风险
3. **提高稳定性**：标准化的提示词模板让输出更可控、更一致
4. **无需微调**：相比 Fine-tuning，提示词工程成本低、见效快，适合快速迭代

**常用技巧**：详细描述任务、角色设定、使用分隔符、指定步骤、提供示例（Few-shot）、基于文档问答（RAG）。

---

### 2. LangChain 中的提示词工程

**LangChain** 主要提供了 `PromptTemplate` 和 `ChatPromptTemplate` 两种提示词模板，分别适用于文本和聊天模型。

### 2. format 和 invoke 方法的区别？

format 方法将提示词模板填充为字符串，invoke 方法则会得到一个 PromptValue 对象，该对象可以根据下游不同的模型类型自动转换为 str 或者 list[BaseMessage]

```python
class PromptValue(Serializable, ABC):
    """Base abstract class for inputs to any language model.

    `PromptValues` can be converted to both LLM (pure text-generation) inputs and
    chat model inputs.
    """
```

## 四、输出解析

### 1. OutputParser 的核心作用是什么？

**OutputParser** 的作用是解析模型输出，将模型输出转换为结构化数据，LangChain 提供了多种输出解析器，如 StrOutputParser、PydanticOutputParser、TypedDictOutputParser 等。 

下面是一个 JsonOutputParser 的例子：

```python
class Person(BaseModel):
    name: str=Field(..., description="姓名")
    age: int=Field(..., description="年龄")
    event: str=Field(..., description="事件")

parser = JsonOutputParser(pydantic_object=Person)

prompt_template = ChatPromptTemplate.from_messages([
    ('system','你是一个新闻助手，请按照指定格式返回一个人的介绍：{format_instructions}'),
    ('human', '请介绍{input}'),
])

model = init_chat_model(
    model="glm-5",
    api_key=os.getenv("dashscope_api_key"),
    model_provider='openai',
    base_url=os.getenv("BASE_URL"),
    streaming=True
)

chain = prompt_template | model | parser

resp = chain.invoke(
    input={
        "input": "雷军",
        'format_instructions':parser.get_format_instructions()
    }
)

print(resp)
```

### 2. 如何让 LLM | ChatModel | Agent 输出结构化数据？

**ChatModel**

（1）通过 model.with_structured_output() 得到一个结构化输出的 ChatModel

（2）将 OutputParser 的 get_format_instructions() 注入到 prompt 中 

**Agent**

LangChain 1.0+ 的 `create_agent` 支持直接传入 `response_format` 参数，Agent 会自动按照指定 schema 输出。

---

### 3. Pydantic 与 TypedDict 在结构化输出中的选择？

**Pydantic BaseModel**（推荐首选）：功能更强，支持字段验证、类型检查、默认值、nested 结构，适合复杂场景和生产环境。

**TypedDict**（轻量级备选）：语法简单，适合简单的扁平结构和快速原型，但缺乏验证能力，功能相对有限。

**一句话总结**：简单场景用 TypedDict，复杂场景或生产环境用 Pydantic。

---

## 五、链式调用

### 1. LangChain 中 | 管道符的工作原理？

### 2. 顺序链、分支链、并行链的区别和实现？

### 3. RunnableParallel 的作用？

**RunnableParallel** 用于并行执行多个 Runnable，结果合并为字典输出，适合需要同时生成多种内容的场景。

### 4. RunnablePassthrough 的作用？

**RunnablePassthrough** 用于透传数据，将输入原样传递给下一级，常用于 RAG 中保留用户原始问题。

### 5. RunnableLambda（函数链）的应用场景？

### 6. 如何在链中传递和转换数据？

## 六、Memory

### 1. LangChain Memory 的作用和实现方式？

### 2. BaseChatMessageHistory 的常用子类？

### 3. RunnableWithMessageHistory 是什么？

### 4. 如何实现长期会话存储？

## 七、RAG

### 1. RAG 的基本原理？与微调的区别？

### 2. RAG 的核心组件有哪些？

### 3. Document Loader 的作用和常见类型？

### 4. TextSplitter 的类型和选择策略？

### 5. 向量存储的作用？常见的向量数据库？

### 6. 检索器的工作原理？

### 7. 如何优化 RAG 的检索效果？

## 八、Agent

### 1. Agent 是什么？

### 2. Agent 与 LLM 的区别是什么？

### 3. React 是什么？

### 4. A2A 是什么？