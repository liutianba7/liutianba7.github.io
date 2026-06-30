## LLM 概述

**LLM**（`Large Language Model`，大语言模型）是指在**海量无标注文本数据**上进行预训练得到的大型语言模型。通过学习大规模语料中的语言规律，模型能够理解、生成和推理自然语言文本。典型代表包括 `GPT` 系列、`DeepSeek`系列、`Qwen` 系列等。

大体现在三个方面：

- 一是**参数量大**，模型通常拥有数十亿到上万亿个参数
- 二是**预训练数据量大**，涵盖多语言、多领域的庞大语料
- 三是**能力强大**，具备跨任务的泛化与生成能力，能够在问答、摘要、翻译、编程等多种场景下展现出类似人类的语言理解和表达水平


## LLM 发展历程

> 下面用 GPT 系列来讲述 LLM 发展的历程。
### GPT 1

**GPT-1**（Generative Pre-trained Transformer-1）是 OpenAI 于 2018 年 6 月 发布的首个生成式预训练语言模型，其研究成果发表于论文《[Improving Language Understanding by Generative Pre-Training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)》。

GPT-1 系统化地验证并推广了“**预训练（Pre-training）+ 微调（Fine-tuning）**”的训练范式：模型先在大规模无标注语料上进行语言建模预训练，再利用少量有监督数据在特定任务上微调。该方法显著提升了模型的迁移能力，使单一预训练模型能够适配多种自然语言任务。

#### 1. 模型架构

GPT-1 的架构属于 **Decoder-only**，本质上就是 **Transform** 的 **Decoder** 堆叠而成，每个 **Decoder** 由 **Masked Multi Self Attention** 层、**FNN** 这两个核心子层组成，并通过 **LayerNorm** 与残差连接保持稳定的梯度传播。

<p align='center' style='zoom:60%'>
	<img src='../../assets/imgs/python/llm/01_gpt1架构图.png'>
</p>


GPT-1 的架构创新主要可以概括为三点：

- **Decoder-only 结构**：从 Encoder-Decoder 架构简化为Decoder-only 结构，以适配自回归生成任务。
- **可学习位置嵌入**：使用可学习位置嵌入，取代正弦位置编码，使模型能够在训练过程中自适应地学习词序关系。
- **权重共享机制**：输入嵌入层与输出词表权重共享，减少参数量并提升训练稳定性。


#### 2. 模型参数

| **参数项**                    | **数值** |
| -------------------------- | ------ |
| **模型层数（Layers）**           | 12     |
| **隐藏维度（Hidden Size）**      | 768    |
| **注意力头数（Attention Heads）** | 12     |
| **前馈层维度（FFN Size）**        | 3072   |
| **参数总量**                   | 1.17 亿 |


#### 3. 模型训练

GPT-1 的训练采用了“**预训练（Pre-training） + 微调（Fine-tuning）**”的两阶段范式。

预训练阶段就是在海量的未标注的文本语料上以 “Next-Token Prediction” 为目标，去训练模型，从而让模型学会通用的语言建模能力、了解广泛的世界知识、具备初步的推理能力。

<p align='center' style='zoom:60%'>
	<img src='../../assets/imgs/python/llm/02_gpt1预训练图解.png'>
</p>

在**微调阶段（Fine-tuning）**，通过在模型顶部加入轻量的**任务分类层**（Task Classifier），并在少量标注数据上进行**有监督训练**，模型能够快速适应不同任务场景。结果表明，微调后的 GPT-1 在多个 NLP 任务上显著优于从零训练的传统模型，验证了“预训练—微调”范式的有效性与通用性。



### GPT 2

GPT-2是 OpenAI 于 2019 年发布的第二代生成式预训练语言模型，相关研究发表于论文《[Language Models are Unsupervised Multitask Learners](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)》。GPT-2 延续了GPT-1的 Transformer Decoder-only 架构，但参数规模提升了10倍。
#### 1.  模型架构

GPT-2 延续了 GPT-1 的 **Transformer Decoder-only** 架构。只不过是堆叠的解码器更多了。同时，相比于 GPT-1，GPT-2采用了 Pre-LayerNorm 来缓解梯度传播不稳定的问题。具体原理在之后的 Pre-Norm 和 Post-Norm 的讲解会介绍。


<p align='center' >
	<img src='../../assets/imgs/python/llm/03_gpt2_pre_norm.png'>
</p>

#### 2. 模型参数

| **参数项**                    | **数值** |
| -------------------------- | ------ |
| **模型层数（Layers）**           | 48     |
| **隐藏维度（Hidden Size）**      | 1600   |
| **注意力头数（Attention Heads）** | 25     |
| **前馈层维度（FFN Size）**        | 6400   |
| **参数总量**                   | 15.42亿 |

#### 3. 模型训练

GPT-2 的训练仍采用 **自回归语言建模（Autoregressive Language Modeling）** 目标，即在给定前文的条件下预测下一个词（Next Token Prediction），以学习文本的语法与语义规律。  

模型使用了 OpenAI 构建的 **WebText** 数据集，规模约 **40GB**，包含约 **800 万篇网页内容**，涵盖新闻、小说、科技、娱乐、社交等多个领域，为模型提供了更广泛的语言风格与知识来源。


### GPT 3

GPT-3是 OpenAI 于 2020 年 5 月发布的第三代生成式预训练语言模型，研究成果发表于论文《[Language Models are Few-Shot Learners](https://arxiv.org/pdf/2005.14165)》。

GPT-3 的核心创新在于首次系统提出并验证了“**上下文学习（In-Context Learning）**” 的概念：模型在使用阶段无需额外训练，仅依靠输入文本中的任务描述及少量示例即可理解并完成任。


#### 1.  模型架构

GPT-3 延续了 **Transformer Decoder-only** 架构，但参数规模较 GPT-2 提升约百倍，达到了1750亿。

架构方面，与 GPT-2 相比，GPT-3 的主要区别在于在各个 **Transformer Block** 中交替使用**稠密注意力**（Dense Attention）和**局部带状稀疏注意力**（Locally Banded Sparse Attention）模式。

<p align='center' style='zoom:70%'>
	<img src='../../assets/imgs/python/llm/04_gpt3_稠密+稀疏注意力机制.png'>
</p>

#### 2. 模型参数

| **参数项**                    | **数值** |
| -------------------------- | ------ |
| **模型层数（Layers）**           | 96     |
| **隐藏维度（Hidden Size）**      | 12288  |
| **注意力头数（Attention Heads）** | 96     |
| **前馈层维度（FFN Size）**        | 49152  |
| **参数总量**                   | 1750 亿 |


#### 3. 模型训练

GPT-3 依旧采用 自回归语言建模（Autoregressive Language Modeling） 方式进行训练。训练数据约 570GB，包含约3000亿token，覆盖新闻、百科、文学与学术等领域。

模型在数千块 **NVIDIA V100 GPU** 上进行分布式并行训练，耗时数周完成。



### InstructGPT

InstructGPT 是 OpenAI 于 2022 年初推出的生成式预训练语言模型，是 GPT-3 的改进版本，也是后续 ChatGPT 的直接前身。其研究成果发表于论文《[Training language models to follow instructions with human feedback](https://arxiv.org/pdf/2203.02155)》。

GPT-3 再文本生成方面取得了巨大的成功，但是 GPT-3 在很多时候，无法给出很好的回答，这是因为 GPT-3 在训练过程中的目的是 “next token prediction”，所以，GPT-3 可能无法很好的理解人类指令的含义。

InstructGPT 在 GPT-3 基础上引入**指令对齐训练**，从而使模型能够更准确地理解并执行人类指令。

#### 1. 模型架构

InstructGPT延续了GPT-3的架构。只是新增了额外的训练阶段

#### 2. 模型训练

InstructGPT 的训练以 GPT-3 的预训练语言模型为基础，进一步采用了**三阶段训练范式**，具体步骤如下图所示：

<p align='center' style='zoom:70%'>
	<img src='../../assets/imgs/python/llm/05_instructgpt_三阶段训练范式.png'>
</p>

**1、监督微调**（Supervised Fine-tuning, SFT）

在第一阶段，OpenAI 收集了由人工标注者撰写的高质量 “**指令-回答**” 样本，组成训练数据集。这些样本覆盖常见的用户指令及对应的理想响应，具有较高的语言质量。

在训练过程中，模型在这些“指令-回答”对上进行监督微调，训练目标仍为“给定前文预测下一个词”。
<p align='center' style='zoom:70%'>
	<img src='../../assets/imgs/python/llm/05_instructgpt_sft.png'>
</p>

2、**奖励模型（Reward Model, RM）**

第二阶段构建奖励模型，用于后续强化学习过程中的反馈评估器，具体过程如下：

（1）使用经过 SFT 微调后的模型，针对同一条指令生成多个候选回答

（2）工标注者根据回答的质量、相关性、礼貌性、有用性等维度，对这些回答进行排序

（3）利用排序结果训练一个奖励模型，使其能够为任意给定回答输出一个偏好评分


3、**强化学习（Reinforcement Learning from Human Feedback, RLHF）**

这一阶段的核心目标是：**通过人类偏好引导模型输出更加符合人类意图的回答**。它以第二阶段训练好的**奖励模型**为评分工具，使用**强化学习算法**（PPO），对第一步经过SFT微调的语言模型进行进一步优化。


##### 3. 模型能力

InstructGPT 相较于原始的 GPT-3，在多个维度上表现出更优的能力，主要体现在以下几个方面：

- **指令理解能力增强**
- **输出质量更贴合人类偏好**
- **无关、虚假或有害内容减**


### ChatGpt

ChatGPT 是 OpenAI 于 2022 年 11 月发布的一种具备对话能力的大型语言模型。它支持连续的自然语言交互，能够回答后续问题、承认错误、质疑用户前提、拒绝不当请求，在用户体验与安全性方面取得显著改进。


#### 1. 模型架构

ChatGPT 是与 InstructGPT 同一技术路线下的兄弟模型，架构设计与 InstructGPT 类似，但具体细节未公开。

#### 2. 模型训练

ChatGPT 的训练方法采用与 InstructGPT 相同的人类反馈强化学习（RLHF）策略，其核心区别在于**数据集的设计与处理方式。**

为了更好的处理多轮对话这样的场景，ChatGPT 使用了**特别构建的对话格式数据集**。至于训练的目标，还是 "next token prediction“，如下图：

<p align='center' style='zoom:70%'>
	<img src='../../assets/imgs/python/llm/06_chatgpt训练.png'>
</p>

## LLM 架构

### LLM 基础架构

大型语言模型（LLM）大多基于 **Transformer** 架构构建，其中最常见的是 **Decoder-only** 架构。这一架构最早由 GPT 系列采用，并逐渐成为当前大多数主流模型的标准设计。LLM 的核心能力——理解语言、建模上下文、生成文本，都源于 Transformer 的模块化结构与高度可扩展性。

从整体上看，一个典型的 LLM 可以分为 **输入层**、**Transformer Block** 堆叠层和 **输出层** 三个部分：

<p align='center' style='zoom:70%'>
	<img src='../../assets/imgs/python/llm/07_llm基础架构.png'>
</p>



### LLM 架构演进


模型真正的演进主要体现在内部组件层面，包括**注意力机制**、**前馈网络**、**归一化**与**残差结构**以及**位置编码**等模块的持续改进。

#### 位置编码

由于 Transformer 的自注意力机制（Self-Attention）并不包含序列顺序信息，模型无法仅依靠注意力计算来判断 token 在序列中的相对位置。因此，需要向输入中显式加入位置编码（Position Encoding），以补充序列的位置信息。

##### 正余弦位置编码

**1）概述**

正余弦位置编码（Sinusoidal Positional Encoding）是原始 [Transformer](https://arxiv.org/abs/1706.03762) 中采用的位置编码方式，它通过一组预定义的正弦与余弦函数为每个序列位置生成唯一向量：

$$
\begin{aligned}
PE(pos, 2i) &= \sin\left(\frac{pos}{10000^{2i/d}}\right) \\[4pt]
PE(pos, 2i+1) &= \cos\left(\frac{pos}{10000^{2i/d}}\right)
\end{aligned}
$$

其中：

- $pos$：Token 的绝对位置
- $i$：维度对的索引
- $d$：总维度

**2）特点**

!!! tip "特点"

    - **无需训练**：编码由固定函数生成，不引入任何可学习参数，使用简单，不会随训练发生漂移。
    - **隐含相对位置信息**：正余弦位置编码的结构使其能够携带 token 之间的相对位置信息。

    下面对 **隐含相对位置信息** 这一特性做详细解释。

    正余弦位置编码的各维度是按频率成对排列的，每一对由同一频率对应的正弦值和余弦值组成。从位置 $m$ 和位置 $n$ 的位置编码中，任意选取一对频率为 $\omega$ 的维度进行观察：

    $$
    \begin{aligned}
    PE_{\omega}(m) &= \begin{pmatrix} \sin(\omega m) & \cos(\omega m) \end{pmatrix} \\[4pt]
    PE_{\omega}(n) &= \begin{pmatrix} \sin(\omega n) & \cos(\omega n) \end{pmatrix}
    \end{aligned}
    $$

    在 Transformer 中，注意力权重由 $q$ 向量与 $k$ 向量的内积决定：

    $$
    AttentionScore_{m,n} = q_m k_n^{\mathsf{T}}
    $$

    考察这两组位置编码分量的内积：

    $$
    PE_{\omega}(m) PE_{\omega}(n)^{\mathsf{T}} = \sin(\omega m)\sin(\omega n) + \cos(\omega m)\cos(\omega n)
    $$

    利用三角恒等式可得：

    $$
    PE_{\omega}(m) PE_{\omega}(n)^{\mathsf{T}} = \cos\bigl(\omega (m - n)\bigr)
    $$

    这一结果直接反映了位置 $m$ 与位置 $n$ 之间的相对位置关系，且其他频率的维度也具备相同的形式。因此，在采用正余弦位置编码的情况下，两个 token 的注意力评分中会包含相对位置信息。

**3）缺陷**

!!! warning "缺陷"

    尽管正余弦位置编码具有良好的数学结构，其向量间的内积可直接反映相对位置关系，但在实际的 Transformer 注意力计算中，这种优势并不能完全有效发挥。

    注意力计算中，评分为 $score(m,n) = q_m k_n^{\mathsf{T}}$，其中：

    $$
    \begin{aligned}
    q_m &= (e_m + PE_m) W_Q \\
    k_n &= (e_n + PE_n) W_K
    \end{aligned}
    $$

    代入并令 $A = W_Q W_K^{\mathsf{T}}$，展开可得：

    $$
    score(m,n) = e_m A e_n^{\mathsf{T}} + e_m A PE_n^{\mathsf{T}} + PE_m A e_n^{\mathsf{T}} + PE_m A PE_n^{\mathsf{T}}
    $$

    其中，仅有最后一项 $PE_m A PE_n^{\mathsf{T}}$ 明确体现了位置编码之间的相互作用，是唯一直接与相对位置相关的部分。但由于矩阵 $A = W_Q W_K^{\mathsf{T}}$ 是可学习参数，会在训练中不断变化，原本正余弦编码所具备的几何结构难以稳定保持。模型必须通过额外的学习来重新塑造或校正这种相对位置信息，而这种重建过程往往并不可靠，导致正余弦位置编码在理论上的优势无法在实践中完全体现。

##### 可学习位置编码

**1）概述**

可学习位置编码（Learned Positional Embedding）是另一种常见的位置编码方式，曾广泛应用于早期的 Transformer 预训练模型（如 [BERT](https://arxiv.org/abs/1810.04805)、GPT-1/2 等）中。在这种方法中，模型为序列中的每个位置分配一个独立的可训练向量，这些向量在训练过程中与模型的其他参数一同更新，使模型能够从实际任务数据中自动学习位置表示。

**2）特点**

!!! tip "特点"

    - **灵活性高**：位置向量完全由数据驱动学习，不受固定数学函数约束，能够更贴合训练语料的分布特点。
    - **训练方式简单**：其优化方式与词向量一致，实现成本低，不需要额外的结构设计，便于直接集成到 Transformer 中。

**3）缺陷**

!!! warning "缺陷"

    - **缺乏长度外推能力**：可学习位置编码只在训练过的位置范围内定义，超出最大序列长度的位置没有对应的嵌入，导致模型无法在推理阶段处理更长的输入序列。
    - **参数量随序列长度线性增长**：位置向量数量与最大序列长度成正比，当需要支持长上下文时，参数开销迅速增大。

##### 旋转位置编码 ⭐⭐⭐

**1）概述**

**旋转位置编码**（Rotary Position Embedding，**RoPE**）由国内研究者苏剑林在 [RoFormer](https://arxiv.org/abs/2104.09864) 论文中提出。与传统将**位置编码与词向量相加**的方式不同，RoPE 直接作用于 $q$ 和 $k$ 向量本身，使注意力计算能够更好地体现 token 之间的相对位置关系。在实践中，RoPE 表现稳定，尤其适用于长序列建模，因此已成为当前 LLM 普遍采用的位置编码方案。



**2）原理**


RoPE 的设计目标是让注意力得分能够直接体现 token 之间的相对位置差，可表示为：

$$
score(m,n) = func(q_m,\; k_n,\; m-n)
$$

即注意力评分仅依赖于第 $m$ 个位置的 query 向量 $q_m$、第 $n$ 个位置的 key 向量 $k_n$，以及两者之间的相对位置差 $m-n$。

为实现这一目标，RoPE 将 $q$ 和 $k$ 向量按维度**两两分组**，把每一对**相邻维度**视为一个**二维子向量**，并对每个**二维子向量施加与位置及维度相关的旋转**，如下图所示：

<p align='center' >
	<img src='../../assets/imgs/python/llm/08_repo示例图.png'>
</p>


位置 $m$ 的 token，其 $q$ 和 $k$ 向量的第 $i$ 对二维子向量会旋转 $m \cdot \theta_i$ 的角度，$\theta_i$ 的定义如下：

$$
\theta_i = 10000^{-2i/d}
$$

其中 $d$ 表示 $q$ 和 $k$ 向量的维度。

下面以位置 $m$ 对位置 $n$ 的注意力评分为例，说明 RoPE 是如何实现其设计目标的。

位置 $m$ 的 $q$ 向量中的第 $i$ 对二维子向量 $q_{m,i}$ 需要旋转 $m\theta_i$ 度，其旋转由如下二维旋转矩阵实现：

$$
R(m\theta_i) = \begin{pmatrix}
\cos(m\theta_i) & \sin(m\theta_i) \\[4pt]
-\sin(m\theta_i) & \cos(m\theta_i)
\end{pmatrix}
$$

旋转后的子向量为：

$$
q_{m,i}' = q_{m,i} \, R(m\theta_i)
$$

位置 $n$ 的 $k$ 向量中的第 $i$ 对二维子向量 $k_{n,i}$ 需要旋转 $n\theta_i$ 度，其旋转矩阵为：

$$
R(n\theta_i) = \begin{pmatrix}
\cos(n\theta_i) & \sin(n\theta_i) \\[4pt]
-\sin(n\theta_i) & \cos(n\theta_i)
\end{pmatrix}
$$

旋转后的子向量为：

$$
k_{n,i}' = k_{n,i} \, R(n\theta_i)
$$

位置 $m$ 对位置 $n$ 的注意力评分中，第 $i$ 对二维子向量的贡献为：

$$
\begin{aligned}
q_{m,i}' (k_{n,i}')^{\mathsf{T}}
&= \bigl(q_{m,i} R(m\theta_i)\bigr) \bigl(k_{n,i} R(n\theta_i)\bigr)^{\mathsf{T}} \\
&= q_{m,i} \, R(m\theta_i) \, R(n\theta_i)^{\mathsf{T}} \, k_{n,i}^{\mathsf{T}}
\end{aligned}
$$

二维旋转矩阵满足如下重要性质：

$$
R(m\theta_i) \, R(n\theta_i)^{\mathsf{T}} = R\bigl((m-n)\theta_i\bigr)
$$

（该性质可通过旋转矩阵的代数运算推导：由于旋转矩阵是正交矩阵，满足 $R(\alpha)^{\mathsf{T}} = R(-\alpha)$，从而 $R(m\theta) R(n\theta)^{\mathsf{T}} = R(m\theta) R(-n\theta) = R((m-n)\theta)$。）

代入上式可得：

$$
q_{m,i}' (k_{n,i}')^{\mathsf{T}} = q_{m,i} \, R\bigl((m-n)\theta_i\bigr) \, k_{n,i}^{\mathsf{T}}
$$

可以看到，第 $i$ 对二维子向量的注意力贡献仅依赖 $q_{m,i}$、$k_{n,i}$ 和 $(m-n)$。对所有二维子向量求和后，即可得到完整的注意力得分满足：

$$
score(m,n) = func(q_m,\; k_n,\; m-n)
$$

这说明 RoPE 在数学结构上保证了注意力机制能够自然表达 token 之间的相对位置信息，从而实现其设计目标。

**3）特点**

!!! tip "特点"

    - **显式编码相对位置信息**：旋转后注意力得分天然依赖 $m-n$，直接表达相对位置关系。
    - **零参数且训练稳定**：无需学习位置向量，结构固定，不随训练破坏几何性质。
    - **更容易外推**：数学结构不依赖训练长度，可在推理中处理更长序列。（注意：若推理文本长度与训练文本长度之间存在较大差距，仍会存在外推问题。）


#### Attention

注意力机制（Attention）是 Transformer 中最核心的模块，用于刻画序列中不同位置之间的依赖关系，决定模型在生成下一个 token 时应如何利用上下文。其能力直接影响模型的语义理解、长程依赖建模与文本生成质量。

随着模型规模不断扩大、推理序列越来越长，传统的多头注意力逐渐暴露出工程瓶颈。为解决这些问题，业界提出了一系列改进结构，在保持模型能力的同时显著提升了推理效率。

##### 1. MHA（Multi-Head Attention）

**概述**

MHA 是 [Transformer](https://arxiv.org/abs/1706.03762) 最初采用的注意力机制。其通过将输入分别映射为多组 Query、Key、Value，并在多个注意力头上并行计算注意力分布，使模型能够从不同子空间捕捉序列关系，从而提升表达能力。

**KV Cache**

在自回归生成过程中，模型需逐 token 生成输出。每生成一个新 token，都要与所有历史 token 进行注意力计算。如果每一步都从头计算历史序列的 Key 和 Value，将造成巨大的重复计算开销。

KV Cache 正是为解决这一问题而引入的核心优化：在**推理阶段**将历史 token 的 **Key 和 Value** 缓存下来，供后续步骤直接使用。生成下一个 token 时，只需计算当前 token 的 Q、K、V，再与缓存的 K/V 做一次注意力匹配即可，大幅减少了不必要的计算量。

> **类比**：KV Cache 相当于记笔记而不是每次都重新查资料——把算过的结果存下来，避免重复劳动。

**MHA 的瓶颈**

!!! warning "MHA 的瓶颈"

    KV Cache 虽减少了重复计算，但需持续保存过往 token 的 Key 和 Value。序列越长、层数越多，缓存量不断累积。在 MHA 中，**每个注意力头都独立生成并存储一组 K/V**，使得缓存规模在原有基础上进一步放大——这正是 MHA 在大模型推理中的主要瓶颈。

##### 2. MQA（Multi-Query Attention）

**概述**

MQA（Multi-Query Attention，多查询注意力）由 Google 在 2019 年论文 [Fast Transformer Decoding: One Write-Head is All You Need](https://arxiv.org/abs/1911.02150) 中提出，旨在减少推理阶段 KV Cache 的存储与内存带宽开销。

**核心思想**

让多个注意力头**共享同一套 Key 和 Value**，而不是像 MHA 那样为每个头分别维护独立的 K/V。

!!! tip "核心优势"

    - **KV Cache 大幅缩减**：所有头共享一套 K/V，缓存量级从 $H$ 套降为 $1$ 套（$H$ 为注意力头数）。
    - **内存带宽压力骤降**：只需加载一份 K/V，显著减少显存读取瓶颈。
    - **推理速度显著提升**：上述优化直接加速解码过程，实测可在几乎不损失精度的情况下使解码速度提升数倍。

!!! warning "代价"

    共享机制会略微削弱注意力头的表达能力，精度略逊于传统 MHA。但在实际应用中，这种损失非常小，整体收益远大于代价。

##### 3. GQA（Group-Query Attention）

**概述**

GQA（Group-Query Attention，分组查询注意力）由 Google 在论文 [GQA: Training Generalized Multi-Query Transformer Layers](https://arxiv.org/abs/2305.13245) 中提出，是在 MQA 基础上的进一步改进方案，旨在弥补 MQA 因所有头共享同一套 K/V 而造成的表达能力下降。

**核心思想**

将注意力头划分为多个组（Group），**每组内部的多个 Query 共享同一套 Key 和 Value**，而不同组之间则使用独立的 K/V。

!!! tip "优势"

    - **相比 MHA**：不再为每个头维护独立 K/V，KV Cache 存储需求大幅降低。
    - **相比 MQA**：不是所有头共享唯一 K/V，而是分组共享，注意力头间保持更高的多样性和表达能力。

GQA 在 **推理效率** 和 **表达能力** 之间实现了更优平衡，因此被当前主流大模型广泛采用（如 Llama 2/3、Mistral、Gemma 等），在长序列推理和高并发场景中表现出色。

---

**小结对比**

| 方案 | K/V 共享方式 | KV Cache 量级 | 表达能力 | 典型模型 |
|------|-------------|--------------|---------|---------|
| MHA | 每头独立 | $H$ 套 | 最高 | Transformer 原始版 |
| MQA | 所有头共享 | $1$ 套 | 略降 | PaLM |
| GQA | 分组内共享 | $G$ 套 | 接近 MHA | Llama 2/3, Mistral |

#### Feed Forward Network

前馈网络（Feed-Forward Network, FFN）是 Transformer Block 中继注意力之后的第二大核心组件，用于对每个 token 的表示进行独立的非线性变换。其典型的「升维 → 激活 → 降维」结构，使模型能够在每个位置上学习高维特征，是 Transformer 表达能力的重要来源。

FFN 的演进主要集中在 **激活函数** 和 **整体结构** 两个方向。

##### 1. 激活函数演进

激活函数为 FFN 引入非线性，是提升模型表达能力与稳定性的关键模块。随着模型规模不断扩大，激活函数从简单的线性截断逐步演进到平滑非线性，再到具备门控能力的结构化形式。

**1）ReLU**

ReLU（Rectified Linear Unit）是深度学习早期广泛应用的激活函数：

$$
\text{ReLU}(x) = \max(0, x)
$$

!!! tip "优势"
    - 正区间梯度恒为 1，有效缓解梯度消失问题
    - 计算极简，只需一次比较操作

!!! warning "缺陷"
    - 负区间梯度恒为零，引发 **"死亡神经元"** 现象——神经元一旦进入负区间可能永久失活
    - 非线性较弱，在深层 Transformer 中难以提供足够的梯度平滑性与稳定性

由于上述缺陷，ReLU 在现代大型语言模型中已基本退出主流。

**2）GELU**

GELU（Gaussian Error Linear Unit）由 [Hendrycks & Gimpel, 2016](https://arxiv.org/abs/1606.08415) 提出，是早期 Transformer 预训练模型（BERT、GPT-2/3 等）广泛采用的激活函数。

核心思想是不再硬性截断，而是通过随输入大小平滑变化的缩放系数来柔性控制激活强度：

$$
\text{GELU}(x) = x \cdot \Phi(x)
$$

其中 $\Phi(x)$ 表示标准正态分布的累积分布函数。

- $x$ 越大，$\Phi(x) \to 1$，输出趋近于 $x$
- $x$ 越小，$\Phi(x) \to 0$，输出逐渐衰减为 $0$
- 在 $x \approx 0$ 附近平滑过渡

!!! tip "相比 ReLU 的优势"
    - 全域连续可导，深层网络中梯度传播更稳定
    - 不会出现「神经元死亡」问题

**3）SiLU / Swish**

SiLU（Sigmoid Linear Unit）使用 sigmoid 函数对线性输入进行加权，得到柔和的非线性变换：

$$
\text{SiLU}(x) = x \cdot \sigma(x)
$$

[Swish](https://arxiv.org/abs/1710.05941) 可视为 SiLU 的一般化形式：

$$
\text{Swish}(x) = x \cdot \sigma(\beta x)
$$

当 $\beta = 1$ 时，Swish 与 SiLU 完全等价。虽然原论文提出让 $\beta$ 可学习，但实际收益有限，主流实现通常固定 $\beta = 1$。因此在工程实践中 Swish 与 SiLU 往往混用。

!!! tip "特点"

    得益于连续可导的结构，SiLU 在深层网络训练中具有良好的优化稳定性，与 GELU 经验性能相近。

**4）GLU 及其变体**

GLU（Gated Linear Unit）及其变体是当前 LLM 中最主流的 FFN 结构。与 ReLU、GELU 等单路激活不同，GLU 类结构采用 **「主分支 × 门控分支」** 的双分支设计，通过门控机制对信息流进行更加细致的筛选：

<p align='center'>
	<img src='../../assets/imgs/python/llm/09_gelu与传统单路激活函数.png'>
</p>


$$
\text{FFN}_{GLU}(x) = \bigl(\text{gate}(x W_{\text{gate}}) \odot x W_{\text{up}}\bigr) W_{\text{down}}
$$

其中 $\odot$ 表示逐元素相乘。门控分支所用的激活函数不同，形成了多种 GLU 变体：

| 变体 | 门控函数 | 典型应用 |
|------|---------|---------|
| GLU | $\sigma(x)$（Sigmoid） | 早期门控实验 |
| GEGLU | $\text{GELU}(x)$ | T5 |
| **SwiGLU** | $\text{SiLU}(x)$ | **Llama, Qwen, DeepSeek, Mistral** |

!!! tip "SwiGLU — 当前主流选择"

    在众多变体中，**SwiGLU**（使用 SiLU 作为门控函数）在性能与训练稳定性方面表现最优，已成为当前主流 LLM（Llama 2/3、Qwen、DeepSeek、Mistral 等）的默认 FFN 结构。

##### 2. MoE（Mixture of Experts）

**概述**

MoE（Mixture of Experts，混合专家模型）是在 FFN 基础上的一种结构扩展。其核心思想是：使用**多个并行的 FFN 专家**替代单一 FFN 层，并通过 **Router（路由器）** 根据输入 Token 的特征选择少量最合适的专家参与计算。不同类型的输入由擅长处理该类模式的专家负责，显著增强模型的表达能力。

<p align='center'>
	<img src='../../assets/imgs/python/llm/10_moe整体结构.png'>
</p>

MoE 已成为当前主流大语言模型（如 Mixtral 8x7B、DeepSeek-V2、Qwen2-MoE 等）广泛采用的关键结构。

**工作流程**
<p align='center'>
	<img src='../../assets/imgs/python/llm/11_moe工作流程.png'>
</p>

1. **路由得分计算**：Router 接收 Token 的隐藏表示，通过线性映射为所有专家生成一组得分。
2. **选择 Top-k 专家**：选取得分最高的 $k$ 个专家（通常 $k=2$），其余专家本次不参与计算。
3. **计算路由权重**：对被选中的专家得分执行 softmax，得到归一化权重，表示各专家的贡献比例。
4. **专家执行前向计算**：被激活的专家分别对输入 Token 进行独立 FFN 计算，生成各自的输出。
5. **加权合并输出**：将所有激活专家的输出按路由权重加权求和，得到 Token 在 MoE 层的最终表示。

!!! tip "核心优势"

    - **高容量、低计算**：稀疏激活机制使每次前向传播仅有 $k$ 个专家参与计算。在不增加实际计算量的前提下，大幅提升模型总参数量（模型容量），实现「高容量、低计算」的效率结构。
    - **专家分工，增强泛化**：Router 动态分配机制促使专家自动形成功能分化，每个专家专注于学习特定模式或数据子集，显著增强模型的表达能力和泛化性能。
    - **天然适合分布式扩展**：专家模块相互独立，可轻松分布到大规模计算集群的不同设备上并行运行，极大提升模型的可扩展性。



#### 残差连接与归一化

残差连接（Residual Connection）与归一化（Normalization）是 Transformer 稳定训练的两大基础机制。残差连接为**深层网络提供恒等映射的梯度捷径**，防止梯度消失；归一化则控制**激活值的分布范围**，防止数值不稳定。二者协同作用，使 Transformer 能够堆叠数十甚至上百层。

随着模型深度与规模增加，归一化方式及其放置位置经历了持续的优化演进。

##### 1. RMSNorm

**概述**

RMSNorm（Root Mean Square Normalization）是对传统 LayerNorm 的一种简化变体，由 [Zhang & Sennrich, 2019](https://arxiv.org/abs/1910.07467) 提出。它去除了均值标准化操作，仅基于输入特征的均方根（RMS）进行缩放，在保持归一化效果的同时降低计算复杂度。

**核心公式**

$$
\text{RMSNorm}(x) = \frac{x}{\text{RMS}(x)} \cdot \gamma
$$

其中：

$$
\text{RMS}(x) = \sqrt{\frac{1}{d} \sum_{i=1}^{d} x_i^2 + \epsilon}
$$

- $x \in \mathbb{R}^d$：输入向量
- $\gamma$：可学习的缩放参数
- $\epsilon$：防止除零的微小常数

!!! tip "为什么可以去掉均值？"

    实践表明，均值项在深层 Transformer 中对稳定性贡献有限，去除均值不仅不会影响模型性能，反而能带来更稳定、更高效的归一化形式。目前，**RMSNorm 已成为主流 LLM 中最常用的归一化方式**（如 Llama、Qwen、DeepSeek 等均采用 RMSNorm）。

##### 2. 归一化放置位置

归一化层的放置位置会显著影响训练稳定性与梯度传播效率。随着架构演进，主要形成了 **Post Norm** 和 **Pre Norm** 两种方案。

**1）Post Norm**

Post Norm 是原始 [Transformer](https://arxiv.org/abs/1706.03762) 采用的归一化方式，在子层计算完成并与残差相加**之后**进行归一化：

$$
y = \text{Norm}\bigl(x + F(x)\bigr)
$$

!!! warning "核心问题：削弱恒等梯度路径"

    标准残差结构 $y = x + F(x)$ 的反向传播为：

    $$
    \frac{\partial y}{\partial x} = 1 + \frac{\partial F(x)}{\partial x}
    $$

    其中的 **"1"** 是一条不改变梯度方向和大小的恒等映射路径，为深层网络提供了稳定的「直通」梯度通道。

    而在 Post Norm 中，反向传播变为：

    $$
    \frac{\partial y}{\partial x} = \frac{\partial \,\text{Norm}(z)}{\partial z} \cdot \left(1 + \frac{\partial F(x)}{\partial x}\right), \quad z = x + F(x)
    $$

    归一化操作对输入进行缩放，梯度回流时也被相应扰动，原本应保持恒等的梯度路径不再为 1。在深层 Transformer 中，这种扰动会层层累积，使训练更加不稳定。因此，**Post Norm 在现代大规模模型中已基本不再使用**。

**2）Pre Norm**

Pre Norm 是当前大多数大语言模型采用的主流方式。在进入子层之前先对输入进行归一化，再执行子模块计算并与残差相加：

$$
y = x + F\bigl(\text{Norm}(x)\bigr)
$$

!!! tip "保留恒等梯度路径"

    Pre Norm 的设计充分保留了残差连接的关键特性：

    $$
    \frac{\partial y}{\partial x} = 1 + \frac{\partial F(\text{Norm}(x))}{\partial x}
    $$

    归一化位于 $F$ 内部，不影响残差路径上的梯度回传。正因如此，**Pre Norm 已成为现代 LLM 的事实标准**（GPT-3、Llama 系列、Qwen 等均采用此方案）。

---

**小结对比**

| 方案 | 结构 | 恒等梯度路径 | 训练稳定性 | 典型模型 |
|------|------|-------------|-----------|---------|
| Post Norm | $y = \text{Norm}(x + F(x))$ | 被扰动 ❌ | 不稳定 | 原始 Transformer |
| Pre Norm | $y = x + F(\text{Norm}(x))$ | 完整保留 ✅ | 稳定 | GPT-3, Llama, Qwen |
