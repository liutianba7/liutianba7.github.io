# LangChain 面试题

## 一、基础概念

### 1. LangChain 是什么？

LangChain 是一个开源框架，使用 LangChain 能够轻松构建完全自定义的、由 LLM 驱动的智能体和应用程序

**核心组件**：

官网列出的 core component 有七个，分别为：Models、Agents、Messages、Tools、Memory、Streaming、Structured output

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

> 只要两个组件都实现了 Runnable 接口，且输入输出类型匹配，它们就可以通过 LCEL 快速的搭建到一块。

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

**tool calling** 是 LangChain 中一个核心功能，它可以让 model 调用外部工具。

### 9. 什么是 mcp？

`mcp` 是一个开源的协议，它标准化了一些应用如何提供给 model 工具和资源，在 LangChain 中，agent 或者 model 可以通过 langchain-mcp-adapter 去获取 mcp server 提供的工具和资源的。

---

## 二、模型调用

### 1. LangChain 中如何创建和调用 LLM？

**LangChain** 中创建 model 的方式有 3 种：

1. **init_chat_model**：通过 `init_chat_model` 创建 model，这是最推荐的写法
2. **provider 原生方式**：通过 Provider 原生方式创建 model,例如：ChatDeepSeek, ChatTongyi, ChatZhipuAI, ChatOllama... 
3. **OpenAI 兼容方式**：通过 ChatOpenAi 创建 model

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

### 1. LangChain 中 | 管道符？

管道符 `|` 用于串联组件，前一个的输出自动成为下一个的输入。本质是重写了 `__or__()` 方法，返回 RunnableSequence 对象。典型用法是 prompt | model | output_parser，数据从用户输入经过模板、模型、解析器，最终得到结构化输出。

### 2. 顺序链、分支链、并行链的区别和实现？

**一句话回答**：三种链的区别在于**执行方式**和**数据流向**不同。

| 类型 | 执行方式 | 数据流向 | 实现方式 |
|------|----------|----------|---------|
| **顺序链** | 串行执行 | 前一个输出→下一个输入 | `a | b | c` |
| **并行链** | 同时执行 | 同一输入→多个分支 | `RunnableParallel` |
| **分支链** | 条件选择 | 根据路由决定走哪条路 | `RunnableBranch` |

**代码实现**：
```python
# 顺序链：依次执行
chain = prompt | model | parser

# 并行链：同时执行多个任务，结果合并为字典
from langchain_core.runnables import RunnableParallel
parallel = RunnableParallel({
    "summary": summary_chain,
    "keywords": keyword_chain,
    "sentiment": sentiment_chain
})
# 输入同时传给三个链，输出：{"summary":..., "keywords":..., "sentiment":...}

# 分支链：根据条件选择执行路径
from langchain_core.runnables import RunnableBranch
branch = RunnableBranch(
    (lambda x: x["topic"] == "math", math_chain),      # 条件 1
    (lambda x: x["topic"] == "code", code_chain),      # 条件 2
    default_chain                                      # 默认
)
```

### 3. RunnableParallel 的作用？

**RunnableParallel** 用于并行执行多个 Runnable，结果合并为字典输出，适合需要同时生成多种内容的场景。

### 4. RunnablePassthrough 的作用？

**RunnablePassthrough** 用于透传数据，将输入原样传递给下一级，常用于 RAG 中保留用户原始问题。

### 5. RunnableLambda（函数链）的作用？

`RunnableLambda` 的作用是将普通函数包装成 `Runnable`，让它能融入管道链中。

核心用途是在链中插入自定义逻辑，比如数据处理、格式转换、调用外部 API 等。包装后的 函数自动支持 invoke、stream 等统一调用方式。

### 6. 如何在链中传递和转换数据？

在链中传递数据，就是满足前一个组件的输出符合下一个组件的输入，之后按照链的起点，传入数据即可。

而转换数据则可以通过 `RunnableLambda` 函数在链中插入自定义的逻辑去实现。

## 六、Memory

### 1. LangChain Memory 的作用和实现方式？

Memory 的作用是**存储对话历史**，让模型拥有上下文记忆，实现多轮对话。

实现方式有两种：

- **传统方式**：在 Chain 中传入 memory 参数，每次调用自动加载/保存历史
- **新版方式（推荐）**：使用 `RunnableWithMessageHistory` 包装链，通过 `get_session_history` 回调管理历史

### 2. BaseChatMessageHistory 的常用子类？

BaseChatMessageHistory 是 LangChain 提供的**抽象基类**，用于统一不同存储后端的接口。

常用子类有三个：

- **InMemoryChatMessageHistory**：内存存储，重启丢失，适合测试和临时会话
- **RedisChatMessageHistory**：Redis 存储，持久化，支持分布式，适合生产环境
- **FileChatMessageHistory**：文件存储，简单持久化，适合本地开发

### 3. RunnableWithMessageHistory 是什么？

RunnableWithMessageHistory 是 LangChain 1.0+ 推荐的**新版记忆组件**，用于给链或模型自动添加对话历史管理功能。

核心特点：

- **包装器模式**：包装任意 Runnable，自动在调用前后处理消息历史
- **回调管理**：通过 `get_session_history` 回调函数获取/存储历史，支持任意存储后端
- **自动注入**：自动将历史消息注入到模型输入中，无需手动处理

!!! tip "面试回答思路"
    `RunnableWithMessageHistory` 是 `LangChain 1.0+` 推荐的记忆组件，用于给链或模型自动添加对话历史管理功能。它采用包装器模式，通过 `get_session_history` 回调函数管理历史，自动将历史消息注入到模型输入中。简单说就是：给链包装一层，自动管理对话历史。

### 4. 如何实现长期会话存储？

长期会话存储需要三个要素：**持久化存储**、**会话 ID 管理**、**历史记录清理**。

实现方式：

- **选存储后端**：使用 Redis/数据库等持久化存储，不用内存存储
- **会话 ID 管理**：通过 user_id/session_id 标识不同会话，可用字典或数据库表管理
- **历史清理策略**：设置最大消息数或过期时间，避免无限增长

!!! tip "面试回答思路"
    长期会话存储需要三个要素：持久化存储、会话 `ID` 管理、历史记录清理。实现方式是：选 `Redis` 或数据库作为存储后端，通过 `user_id/session_id` 区分不同会话，设置最大消息数或过期时间定期清理旧消息。简单说就是：`Redis` 存历史，`session_id` 区分用户，定期清理旧消息。

## 七、RAG

### 1. RAG 的基本原理？与微调的区别？

**一句话回答**：RAG 是**检索增强生成**，先从外部知识库检索相关信息，再让模型基于这些信息生成答案。

**核心流程**：

1. **索引阶段**：加载各种类型文件为文档 → 文档切片 → 向量化 → 存入向量数据库
2. **检索阶段**：用户问题向量化 → 相似度检索 → 返回 Top-K 相关片段
3. **生成阶段**：问题 + 检索结果 → 拼成 Prompt → 模型生成答案

**RAG 与微调的区别**：

| 维度 | RAG | 微调 |
|------|-----|------|
| **数据** | 外部知识库，实时更新 | 训练数据集，更新慢 |
| **成本** | 低，只需向量存储 | 高，需要训练算力 |
| **可解释性** | 可追溯信息来源 | 黑盒，难以追溯 |
| **适用场景** | 知识问答、文档检索 | 风格适配、任务特化 |


!!! tip "面试回答思路"
    `RAG` 是检索增强生成，核心流程是三步：索引（文档切片→向量化→存储）、检索（问题向量化→相似度检索）、生成（问题 + 检索结果→`Prompt`→模型生成）。与微调的区别：`RAG` 是开卷考试，用外部知识库，实时更新、成本低、可追溯；微调是闭关修炼，用训练数据集，更新慢、成本高、黑盒。简单说就是：**"`RAG` 查资料答题，微调靠记忆答题"**。

---

### 2. LangChain 为了实现 RAG，提供了那些核心组件？

```
┌─────────────────────────────────────────────────────────────────────┐
│                        RAG 完整流程                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  【索引阶段】                                                        │
│                                                                     │
│   原始文档 ──→ Document Loader ──→ Text Splitter ──→ Embeddings     │
│    (PDF/HTML)      (统一加载)       (切分 chunks)    (文本→向量)     │
│                                                          │          │
│                                                          ↓          │
│                                                   Vector Store      │
│                                                   (存储向量)         │
│                                                          │          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  【检索+生成阶段】                                                   │
│                                                                     │
│   用户问题 ──→ Embeddings ──→ Vector Store ──→ Retriever            │
│                (问题→向量)  (相似度搜索)    (LCEL 适配器)             │
│                                           │                         │
│                                           ↓                         │
│                                      相关文档 chunks                  │
│                                           │                         │
│                                           ↓                         │
│                      ┌────────────────────────────────────┐         │
│                      │  Prompt + Context + Question       │         │
│                      └────────────────────────────────────┘         │
│                                           │                         │
│                                           ↓                         │
│                                        LLM ──→ 回答                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3. Document Loader 的作用和常见类型？

**一句话回答**：Document Loader 用于**加载各种类型文件**，统一转换为 LangChain 的 Document 对象。

**常见类型**：

- **文本类**：TextLoader、CSVLoader、JSONLoader、MarkdownLoader
- **办公文档**：UnstructuredPDFLoader、Docx2txtLoader、PPTXLoader
- **网页类**：WebBaseLoader（爬取网页内容）
- **数据库类**：NotionLoader、GitBookLoader、GitHubLoader

!!! tip "面试回答思路"
    `Document Loader` 的作用是加载各种类型文件，统一转换为 `Document` 对象。常见类型有：文本类（`TextLoader`、`CSVLoader`、`JSONLoader`）、办公文档（`PDFLoader`、`DocxLoader`）、网页类（`WebBaseLoader`）、数据库类（`NotionLoader`、`GitHubLoader`）。每个 `Document` 包含 `page_content` 和 `metadata`。简单说就是：**"万能文件转换器，什么格式都能读"**。

---

### 4. TextSplitter 的类型和选择策略？

**一句话回答**：TextSplitter 用于**将长文档切分成小块**，便于向量化和检索。

**常见类型**：

- **RecursiveCharacterTextSplitter**：递归按字符切分（段落→行→词），最常用
- **CharacterTextSplitter**：按单一字符切分，简单但不够灵活
- **TokenTextSplitter**：按 Token 数量切分，精确控制 Token 数，适合按模型上下文限制切分
- **SemanticChunker**：按语义相似度切分，保持段落语义完整性

!!! tip "面试回答思路"
    `TextSplitter` 的作用是将长文档切分成小块，便于向量化和检索。常见类型有：`RecursiveCharacterTextSplitter`（递归按字符切分，最通用）、`TokenTextSplitter`（按 `Token` 切分，精确控制）、`SemanticChunker`（按语义切分，质量最高）。选择策略：普通文档用递归，精确控制用 `Token`，高质量用语义。简单说就是：**"长文变短片，检索更准确"**。

---

### 5. 向量存储的作用？常见的向量数据库？

`VectorStore`用于**存储和检索向量**，支持相似度搜索，是 RAG 的核心组件。

**核心作用**：

- **存储向量**：将文本/图片等数据的向量表示持久化存储
- **相似度搜索**：快速检索与查询向量最相似的 Top-K 向量
- **索引加速**：通过 HNSW、IVF 等索引结构，实现百万级数据的毫秒级检索

**常见向量数据库**：

- **专业型**：`Milvus`（国产开源，功能最强）、`Pinecone`（全托管，最简单）、`Weaviate`（支持混合检索）
- **扩展型**：`Redis`（`RedisVL`）、`PostgreSQL`（`pgvector`）、`Elasticsearch`（`dense_vector`）
- **轻量型**：`FAISS`（Facebook 开源，内存级，适合小规模）、`Chroma`（轻量，适合原型开发）

!!! tip "面试回答思路"
    向量存储用于存储和检索向量，支持相似度搜索。核心作用是存储向量、相似度搜索、索引加速。常见向量数据库：专业型（`Milvus`、`Pinecone`、`Weaviate`）、扩展型（`RedisVL`、`pgvector`、`Elasticsearch`）、轻量型（`FAISS`、`Chroma`）。简单说就是：**"存向量，找相似，RAG 的基石"**。

---

### 6. LangChain 提供的检索器是什么？

检索器（`Retriever`）是一个接口，输入是字符串（用户问题），输出是文档列表（相关片段）。

**核心作用**：

- **`LCEL` 适配器**：将向量存储包装成 `Runnable`，可以融入管道链
- **解耦设计**：上层应用不需要关心底层检索细节（向量检索/关键词检索/混合检索）
- **灵活切换**：可以轻松切换不同的检索策略

**常见检索器类型**：

- **`VectorStoreRetriever`**：基于向量相似度检索（最常用）
- **`MultiQueryRetriever`**：生成多个角度的查询，合并检索结果
- **`ParentDocumentRetriever`**：检索小片段，返回大文档（保留上下文）
- **`MultiVectorRetriever`**：一个文档多个向量表示，提高检索命中率

**记忆口诀**：**"输入问题，输出文档，RAG 的搬运工"**

!!! tip "面试回答思路"
    检索器是一个接口，输入字符串（用户问题），输出文档列表（相关片段）。核心作用是作为 `LCEL` 适配器将向量存储包装成 `Runnable`，解耦检索细节，方便切换策略。常见类型有：`VectorStoreRetriever`（向量检索）、`MultiQueryRetriever`（多角度查询）、`ParentDocumentRetriever`（检索小片段返回大文档）。

---

### 7. 如何优化 RAG 的检索效果？

优化 RAG 的检索效果，可以从**索引质量**、**检索策略**、**后处理**三个层面优化。

!!! tip "面试回答思路"
    优化 `RAG` 检索效果从三个层面入手：索引阶段（调整切分策略、选用领域 `Embeddings`、添加元数据）、检索阶段（混合检索、多查询检索、重排序 `Rerank`）、后处理（上下文压缩、去重）。简单说就是：**"切好片、选对模型、混合检索、再重排"**。

---

## 八、Agent

### 1. Agent 是什么？

Agent 其实就是基于 LLM 构建的一个智能系统，它能够推理任务、决定使用哪些工具并迭代地寻求解决方案。

简单说就是："Agent = LLM + 规划 + 工具调用"。

---

### 2. Agent 与 LLM 的区别是什么？

!!! tip "面试回答思路"
    `LLM` 是语言模型，只能根据输入文本生成回复，是被动的问答工具。`Agent` 是基于 `LLM` 构建的智能系统，它能够推理任务、决定使用哪些工具并迭代地寻求解决方案。简单说就是：`LLM` 只能陪你聊天，`Agent` 能帮你干活。

---

### 3. React 是什么？


!!! tip "面试回答思路"
    `ReAct` 是 `Reason + Act` 的缩写，是一种 `Agent` 架构模式。核心思想是：`LLM` 先推理（思考下一步做什么），然后行动（调用工具），再观察结果，循环迭代直到完成任务。简单说就是：**"想一步，做一步，看一步"**。

---

### 4. A2A 是什么？

!!! tip "面试回答思路"
    `A2A` 是 `Agent-to-Agent` 的缩写，是一种让多个 `Agent` 协作完成任务的架构模式。核心思想是：不同专业领域的 `Agent` 通过标准化协议互相通信、分工协作，共同完成复杂任务。简单说就是：**"多个 Agent，分工协作"**。

---

### 5. React 和 A2A 的对比？

!!! tip "面试回答思路"
    `ReAct` 是单个 `Agent` 的内部工作模式（推理→行动→观察，循环迭代）。`A2A` 是多个 `Agent` 之间的协作模式（Agent 之间互相通信、分工协作）。两者的关系：`A2A` 协作中的每个 `Agent`，内部通常使用 `ReAct` 模式来工作。简单说就是：`ReAct` 是一个人怎么干活，`A2A` 是一群人怎么配合。

---