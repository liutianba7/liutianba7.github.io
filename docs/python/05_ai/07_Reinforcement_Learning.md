
## RL 基本概念

强化学习（`reinforcement learning`）讨论的问题是智能体（`agent`）怎么在复杂、不确定的环境（`environment`）中**最大化**它能获得的**奖励**。

>一个智能体，在不断试错中，学习怎样做才能获得更多奖励。

<p align='center' style='zoom:50%'>
	<img src='../../assets/imgs/python/rl/01_强化学习流程示意图.png'>
</p>


如上图，强化学习由两部分组成：**智能体**和**环境**。

- 🤖 **智能体（Agent）**：负责思考和行动，比如机器人、自动驾驶汽车、LLM
- 🌍 **环境（Environment）**：智能体所处的世界，比如游戏、真实道路、数学题、**用户**。

强化学习的过程就是智能体和环境不断交互的过程：Agent 根据当前状态选择动作，Environment 执行动作并返回新状态和奖励，Agent 利用奖励不断调整自己的策略，最终学会在各种状态下做出能够获得长期最大累计奖励的决策。

下图是一个 RL 经典的场景——**倒立摆**，在这个环境中，推车就是 **Agent**，它的输入 State 由推车位置、速度、木杆角度、木杆角速度构成，它能够执行的动作是**向左推**和**向右推**。

<p align='center' style='zoom:50%'>
	<img src='../../assets/imgs/python/rl/02_经典强化学习场景_倒立摆.png'>
</p>

 **策略**：本质上是一个函数，输入当前状态，输出的实际上是当前采取行动的概率分布，之后和 llm 一样，采取特定的采样策略采样即可：

$$
π(a∣s)=p(a_t​=a∣s_t​=s)
$$

通常，这个 $\pi$ 由于很复杂，所以通常用神经网络来拟合，这也就是深度强化学习。

**轨迹**：**轨迹**（Trajectory）是指智能体在一个完整的回合（Episode）中与环境进行交互的完整记录序列，记作  $τ$ （读作"掏"）。而一个**回合**就是当前环境状态 $S_0$、推车采取动作 $A_0$ ，然后获得奖励 $R_0$，然后转移到下一时间步，直到出发结束条件位置。

$$
\tau = (S_0, A_0, R_0, S_1, A_1, R_1, S_2, A_2, R_2, \dots)
$$

## RL 价值函数 ⭐⭐⭐

### 一、为什么需要价值函数

上一节说 RL 的目标是**最大化累计奖励**。但有个根本问题：每一步拿到的奖励 $R_t$ 只是"眼前的蝇头小利"，**它不能直接告诉智能体"在状态 $s$ 我该不该行动"、"在状态 $s$ 该做哪个动作 $a$"**。

于是需要一个东西来**算账**——把"未来能拿到的总奖励"做一个期望估计，**压缩成一个数字**，写在状态/动作头上。这个东西就是**价值函数（Value Function）**。

一句话：**价值函数回答"长远来看，这个状态（或者这个状态-动作对）值多少钱"**。所有 RL 算法——从 Q-learning 到 PPO——背后都在算这个数。

<p align='center' style='zoom:100%'>
	<img src='../../assets/imgs/python/rl/03_补充_为什么出现价值函数.png'>
</p>
---

### 二、状态价值函数 V_π(s) 

<p align='center' style='zoom:100%'>
	<img src='../../assets/imgs/python/rl/04_价值函数定义.png'>
</p>

**状态价值函数**（`state-value function`）$V_\pi(s)$ 定义为：在策略 $\pi$ 下，从状态 $s$ 出发所能获得的**期望回报**（expected return）。

$$
V_\pi(s) = \mathbb{E}_\pi\left[ G_t \mid s_t = s \right] = \mathbb{E}_\pi\left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \mid s_t = s \right]
$$

其中：

- $G_t$ 叫**回报（return）**，是带折扣的累计奖励
- $\gamma \in [0, 1)$ 是**折扣因子（discount factor）**，衡量"现在 vs 未来"的权重
- $\mathbb{E}_\pi[\cdot]$ 表示"在策略 $\pi$ 下求期望"

#### 2.1 为什么需要折扣因子 $\gamma$
<p align='center' style='zoom:100%'>
	<img src='../../assets/imgs/python/rl/05_为什么需要折扣因子.png'>
</p>
三个作用：

1. **数学上**：保证无穷时间步下的累计奖励有限（几何级数收敛）
2. **直观上**：眼前的奖励 $R_{t+1}$ 比 $R_{t+100}$ 更有"实感"——迟到 100 步的奖励打个折
3. **避免循环**：如果所有奖励都是正数，没有 $\gamma$ 智能体可能"原地打转"刷奖励

$\gamma$ 越接近 1 → 越"有远见"；越接近 0 → 越"短视"。

#### 2.2 直觉：状态也是分"贵贱"的

<p align='center' style='zoom:100%'>
	<img src='../../assets/imgs/python/rl/06_状态也是分贵贱的.png'>
</p>

以迷宫游戏为例：

- 终点格 = +1（值 1.0）
- 起点格 ≈ +0.6（要走 4 步才能到终点，每步折扣 0.9）
- 离悬崖越近 ≈ +0.1（随时可能掉下去）
- 悬崖格 ≈ -1（掉下去就 game over）

$V_\pi(s)$ 实质上是**在告诉智能体"站在这个格子，长期来看能拿多少分"**——它是状态空间的"评分卡"。

---

### 三、动作价值函数 Q_π(s,a) 

**动作价值函数**（`action-value function`）$Q_\pi(s, a)$ 定义为：在状态 $s$ 采取动作 $a$ **之后**再按策略 $\pi$ 走，能获得的期望累计回报。

$$
Q_\pi(s, a) = \mathbb{E}_\pi\left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k} \mid s_t = s,\; a_t = a \right]
$$

对比一下：
<p align='center' style='zoom:100%'>
	<img src='../../assets/imgs/python/rl/08_价值函数两兄弟.png'>
</p>


直觉：以围棋为例，$V_\pi(s)$ 告诉你"这个局面值多少"；$Q_\pi(s, a)$ 告诉你"这个局面**下这一手**值多少"——前者是状态评分，后者是动作评分。

!!! tip "为什么 Q 比 V 更重要"
    在很多场景下，**智能体做决策时只能依赖 Q**：因为它没有"环境模型"，不知道 $a$ 之后会到哪个 $s'$。这就是著名的**Model-Free** 设置，也是 Q-learning 这类算法的立足点。

---

### 四、贝尔曼方程（Bellman Equation） 

价值函数最关键的性质是**递归**：当前状态的价值，可以**用下一状态的价值表示**。这个递推关系就是 **Bellman 方程**，是几乎所有 RL 算法的根。

#### 4.1 V 形式的贝尔曼方程

把 $G_t$ 拆成"第一步奖励 + 之后的折扣"：

$$
V_\pi(s) = \sum_a \pi(a \mid s) \sum_{s', r} p(s', r \mid s, a) \left[ r + \gamma V_\pi(s') \right]
$$

读法：$V_\pi(s)$ = 在状态 $s$ 用策略 $\pi$ 选动作 $a$ → 进入 $s'$ 拿立即奖励 $r$ → 加上折扣后的下一状态价值。
#### 4.2 Q 形式的贝尔曼方程

$$
Q_\pi(s, a) = \sum_{s', r} p(s', r \mid s, a) \left[ r + \gamma \sum_{a'} \pi(a' \mid s') Q_\pi(s', a') \right]
$$

#### 4.3 备份图（Backup Diagram）

<p align='center' style='zoom:100%'>
	<img src='../../assets/imgs/python/rl/09_贝尔曼方程备份图.png'>
</p>

之所以叫"备份图"（backup diagram）：每个圆点（状态）的价值，是**从下一时间步往回"备份"**——综合所有可能的 $(a, s', r)$ 加权求和得到。这张图能解释几乎所有 DP 类和 TD 类算法的"信息流向"。

!!! note "一句话总结 Bellman 方程"
    > **当前价值 = 即时奖励的期望 + 折扣后下一状态价值的期望**。
    > 本质是把"无穷级数求和"用"递推"代替，复杂度直接从 $O(T)$ 降到 $O(1)$ 一步。

---

### 五、V 和 Q 的关系 

<p align='center' style='zoom:100%'>
	<img src='../../assets/imgs/python/rl/10_V与Q的关系.png'>
</p>

两个价值函数之间可以互相换算，**记住这两条式子就够用**：

$$
Q_\pi(s, a) = \mathbb{E}\left[ R_{t+1} + \gamma V_\pi(s_{t+1}) \mid s_t = s, a_t = a \right]
$$

$$
V_\pi(s) = \sum_a \pi(a \mid s) \, Q_\pi(s, a)
$$

读法：

- **Q → V**：状态价值是"在状态 $s$ 按策略 $\pi$ 选动作"的期望 Q 值
- **V → Q**：动作价值是"做完动作拿到的奖励 + 折扣后下一状态的价值"

!!! tip "速记法"
    状态不挑动作 → 用 $V$；状态挑了动作 → 用 $Q$。挑不挑动作，**差一条 $\pi(a|s)$**。

---

### 六、最优价值函数 V* 和 Q* 

智能体的终极问题不是"在某个固定策略下值多少"，而是"**最优情况下**能值多少"。

<p align='center' style='zoom:80%'>
	<img src='../../assets/imgs/python/rl/11.最优价值函数v，q.png'>
</p>

#### 6.1 定义

$$
V^*(s) = \max_\pi V_\pi(s)
$$

$$
Q^*(s, a) = \max_\pi Q_\pi(s, a)
$$

- $V^*(s)$：在状态 $s$ 永远做最优决策，能拿到的最大期望回报
- $Q^*(s, a)$：在状态 $s$ 做动作 $a$、之后永远做最优决策，能拿到的最大期望回报

#### 6.2 最优贝尔曼方程（Bellman Optimality Equation）

$$
V^*(s) = \max_a \sum_{s', r} p(s', r \mid s, a) \left[ r + \gamma V^*(s') \right]
$$

$$
Q^*(s, a) = \sum_{s', r} p(s', r \mid s, a) \left[ r + \gamma \max_{a'} Q^*(s', a') \right]
$$

唯一区别是把求和换成了 $\max$。这两条式子是**所有 value-based 算法的理论基础**——DQN、Double DQN、Dueling DQN 都在试图逼近这个 $\max$。

#### 6.3 Q* 与最优策略

知道 $Q^*$ 之后，**最优策略一句话就能写出来**：

$$
\pi^*(a \mid s) = \begin{cases} 1, & a = \arg\max_a Q^*(s, a) \\ 0, & \text{otherwise} \end{cases}
$$

这就是为什么 Q-learning 这类算法的目标那么明确：**只要学出 $Q^*$，策略自动出来**。

---

### 七、优势函数 A(s,a) 

**优势函数**（`advantage function`）衡量的是"在状态 $s$ 下，**做动作 $a$ 比平均好多少**"：

$$
A_\pi(s, a) = Q_\pi(s, a) - V_\pi(s)
$$

- $A > 0$：这个动作比平均水平好，应该鼓励
- $A < 0$：这个动作比平均水平差，应该抑制
- $A = 0$：和平均水平一样

<p align='center' style='zoom:60%'>
	<img src='../../assets/imgs/python/rl/12_优势函数的定义.png'>
</p>

#### 为什么 PPO/A2C 这些算法都离不开 A

在策略梯度中：

$$
\nabla J(\theta) = \mathbb{E}\left[ \nabla \log \pi_\theta(a|s) \cdot \underbrace{A_\pi(s, a)}_{\text{决定方向}} \right]
$$

- 用 $R_t$（原始奖励）：方差大、噪声多
- 用 $Q$（动作价值）：包含 baseline，方差大
- 用 $A$（优势）：**扣掉了 baseline**，方差最小

!!! tip "Baseline 的本质"
    把 V 当 baseline 减掉，并不会改变梯度的期望（数学上是无偏的），但能**大幅降低方差**。这是 RL 中最重要的方差缩减技巧之一。

---

### 八、价值函数到底有什么用 

最后盘一下，价值函数在 RL 体系里扮演的三个角色：

<p align='center' style='zoom:60%'>
	<img src='../../assets/imgs/python/rl/13_价值函数再强化学习中的应用.png'>
</p>

!!! note "扩展阅读"
    - [Sutton & Barto,《Reinforcement Learning: An Introduction》](https://incompleteideas.net/book/the-book.html) 第 3 章（必读神书）
    - [Spinning Up — Key Concepts in RL](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html)（OpenAI 的 RL 入门）
    - [[Reinforcement Learning]] 中其他章节（MDP、策略梯度等）


