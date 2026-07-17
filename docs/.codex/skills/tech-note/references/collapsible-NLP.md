## NLP 概述

## NLP 文本表示

### 什么是文本预处理？

### 文本处理的流程 ⭐⭐⭐


### 文本处理的基本方式

#### 1. 分词 ⭐⭐⭐

##### 中文分词


####  2. 命名实体识别 - NER

#### 3. 词性标注 - POS


### 文本表示 ⭐⭐⭐

#### 1. one-hot

#### 2. word2vec

#### 3. word Embedding

### 文本的数据分析


### 文本特征处理 ⭐⭐⭐

### 文本数据增强方式


## NLP 传统序列模型 ⭐⭐

### RNN

#### 1. 概述

#### 2. RNN 结构

#### 3. 输入结构

#### 4. 输出结构


#### 5. PyTorch API

#### 6. RNN 的训练过程

#### 7. RNN 总结

### LSTM

#### 1. 概述


#### 2. LSTM 结构

##### 遗忘门 (Forget Gate)


##### 输入门 (Input Gate)

##### 更新细胞状态


##### 输出门 (Output Gate)

#### 3. 输入结构

#### 4. 输出结构

#### 6. PyTorch API

#### 7. LSTM 总结


### GRU

#### 1. 概述

#### 2. GRU 结构

##### 更新门 (Update Gate)

##### 重置门 (Reset Gate)


##### 候选隐状态

##### 最终隐状态

#### 3. 输入结构

#### 4. 输出结构


#### 5. PyTorch API

#### 6. GRU 总结


## NLP Seq2Seq 模型

### Seq2Seq 概述

### Seq2Seq 结构

#### 编码器

#### 解码器

### Seq2Seq 局限性


## NLP 注意力机制

### 注意力机制概述

### 注意力机制工作原理



##### 第一步：计算注意力分数 $e_{t,i}$


##### 第二步：softmax 归一化得到注意力权重 $\alpha_{t,i}$


##### 第三步：加权求和得到上下文向量 $c_t$

##### 第四步：结合上下文向量预测输出


##### 和自注意力的区别

### 注意力评分函数

## NLP Transformer ⭐⭐⭐🚀

### 1. Transformer 概述


### 2. Transformer 整体架构

#### 编码器

#### 解码器

### 3. self attention

#### 概述


#### 2. 直观理解


#### 3. QKV 计算过程

##### 第一步：对每个 token 生成 Q, K, V

##### 第二步：计算注意力分数


##### 第三步：通过 softmax 得到注意力权重


##### 第四步：加权求和得到输出


#### 4. 矩阵形式的整体计算

#### 5. PyTorch 手动实现


#### 6. 掩码自注意力 (Masked Self-Attention)


#### 7. 多头注意力机制

### 4. Transformer 训练与推理机制

#### 训练阶段


#### 推理阶段

### 5. Transformer 实现

#### Pytorch Api

#### Pytorch 手撕

### 6. 核心设计思路

#### 为什么需要位置编码？


#### 为什么要缩放点积？


#### 为什么需要多头注意力？



### 7. Transformer 关键创新点


## NLP 预训练模型

### 预训练概述


### 主流预训练模型讲解

#### GPT

##### 1. 模型结构

##### 2. 预训练


##### 3. 微调

#### BERT

##### 1. 模型结构

##### 2. 预训练

##### 3. **微调**

#### T5


##### 模型结构

##### 预训练

##### 微调


## NLP Hugging Face

### Hugging Face 介绍

### Hugging Face 构成


#### Hugging Face Hub


#### Hugging Face Libraries

### Hugging Face API

#### Quick Start

##### 0. 登录与安装


##### 1. 三个基类

##### 2. AutoClass 自动加载

##### 3. 推理：分词 → 生成 → 解码

##### 4. Pipeline：最省事的推理方式

##### 5. Trainer：完整的训练与评估闭环

#### PretrainedModel

##### AutoModel


##### AutoModelForXXX


##### 模型输入输出详解

#### Tokenizer

##### 概述

##### 加载 Tokenizer


###### 1）在线加载

###### 2）从本地路径加载

##### 使用 Tokenizer


###### 1）分词：tokenizer.tokenize()


###### 2）token → ID：tokenizer.convert_tokens_to_ids()


###### 3）ID → token：tokenizer.convert_ids_to_tokens()


###### 4）编码：tokenizer.encode()


###### 5）解码：tokenizer.decode()

###### 6）一站式接口：tokenizer()（最推荐）

###### 7）批量处理

##### 与预训练模型配合使用

#### Datasets

##### 概述

###### 查看数据集

###### 加载在线数据

##### 预处理数据集


###### 1）删除列：.remove_columns()


###### 2）过滤行：.filter()


###### 3）划分数据集：.train_test_split()


###### 4）编码数据：.map()（核心重点）⭐⭐⭐


##### 保存数据集

###### Arrow 格式（推荐）

###### CSV 和 JSON 格式

##### 集成 DataLoader

