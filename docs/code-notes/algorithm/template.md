# Java & Python 算法模板

> 双语言算法模板，包含常用 API 对比和核心算法实现

------

## 目录

1. [常用 API 对比](#一常用-api-对比)
2. [基础算法](#二基础算法)
3. [数据结构](#三数据结构)
4. [搜索](#四搜索)
5. [图论](#五图论)
6. [动态规划](#六动态规划)
7. [数学](#七数学)
8. [贪心](#八贪心)

------

## 一、常用 API 对比

### 1.1 字符串操作

| 场景         | Java                                                         | Python                     |
| ------------ | ------------------------------------------------------------ | -------------------------- |
| 数组转字符串 | `String.join(" ", list)`                                     | `" ".join(map(str, list))` |
| 带括号拼接   | `new StringJoiner(", ", "[", "]")`                           | `f"[{', '.join(items)}]"`  |
| 流式处理     | `Arrays.stream(arr).mapToObj(String::valueOf).collect(Collectors.joining(" "))` | `" ".join(map(str, arr))`  |
| 大量拼接     | `StringBuilder`                                              | `"".join(parts)`           |

```java
// Java: int[] 转字符串
String res = Arrays.stream(path)
    .mapToObj(String::valueOf)
    .collect(Collectors.joining(" "));
# Python: list 转字符串
res = " ".join(map(str, path))
```

### 1.2 Map/Dict 操作

| 操作         | Java (HashMap)                            | Python (dict)            |
| ------------ | ----------------------------------------- | ------------------------ |
| 查值(带默认) | `map.getOrDefault(k, 0)`                  | `d.get(k, 0)`            |
| 计数更新     | `map.merge(k, 1, Integer::sum)`           | `d[k] = d.get(k, 0) + 1` |
| 检查Key      | `map.containsKey(k)`                      | `k in d`                 |
| 遍历         | `for (Map.Entry<K,V> e : map.entrySet())` | `for k, v in d.items()`  |

```java
// Java merge 一行计数
map.merge(key, 1, Integer::sum);

// 传统写法
map.put(key, map.getOrDefault(key, 0) + 1);
# Python 计数
from collections import defaultdict
d = defaultdict(int)
d[key] += 1
```

### 1.3 数组/列表操作

| 操作     | Java                        | Python           |
| -------- | --------------------------- | ---------------- |
| 反转数组 | `Collections.reverse(list)` | `list.reverse()` |
| 排序     | `Arrays.sort(arr)`          | `list.sort()`    |
| 填充     | `Arrays.fill(arr, val)`     | `[val] * n`      |
| 拷贝     | `Arrays.copyOf(arr, n)`     | `arr[:]`         |

```java
// Java 数组反转（手写双指针）
void reverse(int[] arr, int l, int r) {
    while (l < r) {
        int t = arr[l]; arr[l] = arr[r]; arr[r] = t;
        l++; r--;
    }
}
```

### 1.4 队列与栈

| 操作     | Java (Deque)                            | Python (deque)                               |
| -------- | --------------------------------------- | -------------------------------------------- |
| 初始化   | `Deque<Integer> q = new ArrayDeque<>()` | `from collections import deque; q = deque()` |
| 队尾添加 | `addLast(x)` / `offerLast(x)`           | `append(x)`                                  |
| 队头弹出 | `pollFirst()`                           | `popleft()`                                  |
| 队尾弹出 | `pollLast()`                            | `pop()`                                      |
| 查看队头 | `peekFirst()`                           | `q[0]`                                       |
| 查看队尾 | `peekLast()`                            | `q[-1]`                                      |

### 1.5 堆（优先队列）

```java
// Java 小根堆
PriorityQueue<Integer> heap = new PriorityQueue<>();
heap.offer(x);      // 添加
heap.poll();        // 弹出最小
heap.peek();        // 查看最小

// 大根堆
PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
# Python 小根堆
import heapq
heap = []
heapq.heappush(heap, x)   # 添加
heapq.heappop(heap)       # 弹出最小
heap[0]                   # 查看最小

# 大根堆：存负数
heapq.heappush(heap, -x)
max_val = -heap[0]

# 堆化
heapq.heapify(arr)

# LeetCode 对象比较：注入 __lt__
ListNode.__lt__ = lambda s, o: s.val < o.val
```

### 1.6 双端队列

```java
Deque<Integer> dq = new ArrayDeque<>();
dq.addFirst(x);     // 队头添加
dq.addLast(x);      // 队尾添加
dq.pollFirst();     // 队头弹出
dq.pollLast();      // 队尾弹出
from collections import deque
dq = deque()
dq.appendleft(x)    # 队头添加
dq.append(x)        # 队尾添加
dq.popleft()        # 队头弹出
dq.pop()            # 队尾弹出
```

------

## 二、基础算法

### 2.1 快读快写（Java）

```java
static class FastReader {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    StringTokenizer st;

    String next() {
        while (st == null || !st.hasMoreElements()) {
            try { st = new StringTokenizer(br.readLine()); }
            catch (IOException e) { e.printStackTrace(); }
        }
        return st.nextToken();
    }
    int nextInt() { return Integer.parseInt(next()); }
    long nextLong() { return Long.parseLong(next()); }
    double nextDouble() { return Double.parseDouble(next()); }
}

static FastReader sc = new FastReader();
static PrintWriter out = new PrintWriter(new OutputStreamWriter(System.out));
```

### 2.2 快速排序

```java
// 模板：分治 + 双指针
void quickSort(int[] q, int l, int r) {
    if (l >= r) return;
    int x = q[l + r >> 1], i = l - 1, j = r + 1;
    while (i < j) {
        do i++; while (q[i] < x);
        do j--; while (q[j] > x);
        if (i < j) { int t = q[i]; q[i] = q[j]; q[j] = t; }
    }
    quickSort(q, l, j);
    quickSort(q, j + 1, r);
}
def quick_sort(q, l, r):
    if l >= r: return
    x = q[(l + r) >> 1]
    i, j = l - 1, r + 1
    while i < j:
        i += 1
        while q[i] < x: i += 1
        j -= 1
        while q[j] > x: j -= 1
        if i < j: q[i], q[j] = q[j], q[i]
    quick_sort(q, l, j)
    quick_sort(q, j + 1, r)
```

### 2.3 归并排序

```java
void mergeSort(int[] q, int l, int r) {
    if (l >= r) return;
    int mid = l + r >> 1;
    mergeSort(q, l, mid);
    mergeSort(q, mid + 1, r);

    int[] tmp = new int[r - l + 1];
    int i = l, j = mid + 1, k = 0;
    while (i <= mid && j <= r) {
        if (q[i] <= q[j]) tmp[k++] = q[i++];
        else tmp[k++] = q[j++];
    }
    while (i <= mid) tmp[k++] = q[i++];
    while (j <= r) tmp[k++] = q[j++];

    for (i = l, j = 0; i <= r; i++, j++) q[i] = tmp[j];
}
```

### 2.4 二分查找

```java
// 找第一个 >= target 的位置
int lowerBound(int[] arr, int target) {
    int l = 0, r = arr.length;
    while (l < r) {
        int mid = l + r >> 1;
        if (arr[mid] >= target) r = mid;
        else l = mid + 1;
    }
    return l;
}

// 找第一个 > target 的位置
int upperBound(int[] arr, int target) {
    int l = 0, r = arr.length;
    while (l < r) {
        int mid = l + r >> 1;
        if (arr[mid] > target) r = mid;
        else l = mid + 1;
    }
    return l;
}
import bisect
pos = bisect.bisect_left(arr, x)   # >= x 的第一个位置
pos = bisect.bisect_right(arr, x)  # > x 的第一个位置
```

### 2.5 高精度

```python
# Python 自带高精度，直接运算即可
a = int(input())
b = int(input())
print(a + b)
print(a - b)
print(a * b)
print(a // b)
print(a % b)
// Java 使用 BigInteger
import java.math.BigInteger;
BigInteger a = new BigInteger(sc.next());
BigInteger b = new BigInteger(sc.next());
System.out.println(a.add(b));
System.out.println(a.subtract(b));
System.out.println(a.multiply(b));
System.out.println(a.divide(b));
System.out.println(a.mod(b));
```

### 2.6 前缀和与差分

```java
// 一维前缀和
int[] s = new int[n + 1];
for (int i = 1; i <= n; i++) s[i] = s[i - 1] + a[i];
// 查询 [l, r] 的和
int sum = s[r] - s[l - 1];

// 二维前缀和
int[][] s = new int[n + 1][m + 1];
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + a[i][j];
// 查询 (x1,y1) 到 (x2,y2) 的和
int sum = s[x2][y2] - s[x1 - 1][y2] - s[x2][y1 - 1] + s[x1 - 1][y1 - 1];
```

### 2.7 KMP 字符串匹配

```java
// ne[i] 表示模式串 p[1~i] 的最长相等前后缀长度
void build(String p, int[] ne) {
    int n = p.length();
    for (int i = 1, j = 0; i < n; i++) {
        while (j > 0 && p.charAt(i) != p.charAt(j)) j = ne[j - 1];
        if (p.charAt(i) == p.charAt(j)) j++;
        ne[i] = j;
    }
}

int kmp(String s, String p, int[] ne) {
    int n = s.length(), m = p.length();
    for (int i = 0, j = 0; i < n; i++) {
        while (j > 0 && s.charAt(i) != p.charAt(j)) j = ne[j - 1];
        if (s.charAt(i) == p.charAt(j)) j++;
        if (j == m) return i - m + 1; // 匹配成功
    }
    return -1;
}
```

------

## 三、数据结构

### 3.1 链表

**Java 静态数组模拟** 

```java
static int N = 100010;
static int[] e = new int[N], ne = new int[N];
static int head = -1, idx = 0;

// 头插
void addToHead(int x) {
    e[idx] = x; ne[idx] = head; head = idx++;
}

// 在 k 后插入
void add(int k, int x) {
    e[idx] = x; ne[idx] = ne[k]; ne[k] = idx++;
}

// 删除 k 后的节点
void remove(int k) {
    ne[k] = ne[ne[k]];
}
```

**Java 动态实现**

```java
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}
```

**Python**

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
```

### 3.2 栈

```java
// 数组模拟
int[] stk = new int[N];
int tt = 0;  // 栈顶指针

stk[++tt] = x;      // 入栈
int t = stk[tt--];  // 出栈
int t = stk[tt];    // 查看栈顶

// 推荐：ArrayDeque
Deque<Integer> stack = new ArrayDeque<>();
stack.push(x);
int top = stack.peek();
int val = stack.pop();
stack = []
stack.append(x)     # 入栈
top = stack[-1]     # 查看栈顶
val = stack.pop()   # 出栈
```

### 3.3 单调栈

```java
// 找到左边第一个小于当前元素的值
Deque<Integer> stk = new ArrayDeque<>();
for (int x : arr) {
    while (!stk.isEmpty() && stk.peek() >= x) stk.pop();
    int leftMin = stk.isEmpty() ? -1 : stk.peek();
    stk.push(x);
}
```

### 3.4 单调队列（滑动窗口最值）

```java
// 窗口大小为 k，求每个窗口最大值
Deque<Integer> q = new ArrayDeque<>(); // 存下标
for (int i = 0; i < n; i++) {
    while (!q.isEmpty() && i - k + 1 > q.peekFirst()) q.pollFirst();
    while (!q.isEmpty() && a[q.peekLast()] <= a[i]) q.pollLast();
    q.offerLast(i);
    if (i >= k - 1) System.out.print(a[q.peekFirst()] + " ");
}
```

### 3.5 Trie 树

```java
static int N = 100010, idx = 0;
static int[][] son = new int[N][26];
static int[] cnt = new int[N];

void insert(String s) {
    int p = 0;
    for (int i = 0; i < s.length(); i++) {
        int u = s.charAt(i) - 'a';
        if (son[p][u] == 0) son[p][u] = ++idx;
        p = son[p][u];
    }
    cnt[p]++;
}

int query(String s) {
    int p = 0;
    for (int i = 0; i < s.length(); i++) {
        int u = s.charAt(i) - 'a';
        if (son[p][u] == 0) return 0;
        p = son[p][u];
    }
    return cnt[p];
}
```

### 3.6 并查集

```java
static int[] p = new int[N];

void init(int n) {
    for (int i = 1; i <= n; i++) p[i] = i;
}

int find(int x) {
    if (p[x] != x) p[x] = find(p[x]);
    return p[x];
}

void union(int a, int b) {
    p[find(a)] = find(b);
}
p = list(range(n + 1))

def find(x):
    if p[x] != x:
        p[x] = find(p[x])  # 路径压缩
    return p[x]

def union(a, b):
    p[find(a)] = find(b)
```

------

## 四、搜索

### 4.1 BFS 模板

```java
// 最短路、连通块等
int bfs() {
    Queue<int[]> q = new ArrayDeque<>();
    boolean[][] vis = new boolean[n][m];

    q.offer(new int[]{sx, sy});
    vis[sx][sy] = true;

    int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};
    int dist = 0;

    while (!q.isEmpty()) {
        int sz = q.size();
        for (int i = 0; i < sz; i++) {
            int[] cur = q.poll();
            int x = cur[0], y = cur[1];

            if (x == ex && y == ey) return dist;

            for (int j = 0; j < 4; j++) {
                int nx = x + dx[j], ny = y + dy[j];
                if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
                if (vis[nx][ny] || g[nx][ny] == '#') continue;

                vis[nx][ny] = true;
                q.offer(new int[]{nx, ny});
            }
        }
        dist++;
    }
    return -1;
}
from collections import deque

def bfs():
    q = deque([(sx, sy)])
    vis = [[False] * m for _ in range(n)]
    vis[sx][sy] = True

    dx, dy = [-1, 0, 1, 0], [0, 1, 0, -1]
    dist = 0

    while q:
        for _ in range(len(q)):
            x, y = q.popleft()
            if x == ex and y == ey:
                return dist

            for i in range(4):
                nx, ny = x + dx[i], y + dy[i]
                if not (0 <= nx < n and 0 <= ny < m): continue
                if vis[nx][ny] or g[nx][ny] == '#': continue

                vis[nx][ny] = True
                q.append((nx, ny))
        dist += 1
    return -1
```

### 4.2 DFS 模板

```java
// 回溯、连通块、全排列等
void dfs(int u) {
    if (u == n) {
        // 到达边界，处理结果
        return;
    }

    for (int i = 0; i < n; i++) {
        if (!vis[i]) {
            vis[i] = true;
            path[u] = i;
            dfs(u + 1);
            vis[i] = false;  // 回溯
        }
    }
}
```

------

## 五、图论

### 5.1 图的存储

```java
// 邻接表
List<int[]>[] g = new List[n + 1];
for (int i = 1; i <= n; i++) g[i] = new ArrayList<>();

// 加边 (带权)
g[a].add(new int[]{b, w});

// 遍历
for (int[] e : g[u]) {
    int v = e[0], w = e[1];
}
# 邻接表
g = [[] for _ in range(n + 1)]
g[a].append((b, w))

# 遍历
for v, w in g[u]:
    pass
```

### 5.2 Dijkstra 最短路

```java
// 堆优化 O((n+m)logn)
long[] dist = new long[n + 1];
Arrays.fill(dist, Long.MAX_VALUE);
dist[1] = 0;

PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[1], b[1]));
pq.offer(new long[]{1, 0});

while (!pq.isEmpty()) {
    long[] cur = pq.poll();
    int u = (int)cur[0];
    long d = cur[1];

    if (d > dist[u]) continue;

    for (int[] e : g[u]) {
        int v = e[0], w = e[1];
        if (dist[v] > dist[u] + w) {
            dist[v] = dist[u] + w;
            pq.offer(new long[]{v, dist[v]});
        }
    }
}
import heapq

dist = [float('inf')] * (n + 1)
dist[1] = 0
pq = [(0, 1)]  # (距离, 节点)

while pq:
    d, u = heapq.heappop(pq)
    if d > dist[u]: continue

    for v, w in g[u]:
        if dist[v] > dist[u] + w:
            dist[v] = dist[u] + w
            heapq.heappush(pq, (dist[v], v))
```

### 5.3 SPFA（带负权边）

```java
long[] dist = new long[n + 1];
Arrays.fill(dist, Long.MAX_VALUE);
dist[1] = 0;

Queue<Integer> q = new ArrayDeque<>();
boolean[] inq = new boolean[n + 1];
q.offer(1); inq[1] = true;

while (!q.isEmpty()) {
    int u = q.poll(); inq[u] = false;

    for (int[] e : g[u]) {
        int v = e[0], w = e[1];
        if (dist[v] > dist[u] + w) {
            dist[v] = dist[u] + w;
            if (!inq[v]) {
                q.offer(v);
                inq[v] = true;
            }
        }
    }
}
```

### 5.4 Floyd 全源最短路

```java
long[][] d = new long[n + 1][n + 1];
// 初始化
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= n; j++)
        d[i][j] = (i == j) ? 0 : INF;

// 读入边
for (...) d[a][b] = Math.min(d[a][b], w);

// Floyd
for (int k = 1; k <= n; k++)
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
d = [[float('inf')] * (n + 1) for _ in range(n + 1)]
for i in range(1, n + 1): d[i][i] = 0

for k in range(1, n + 1):
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            d[i][j] = min(d[i][j], d[i][k] + d[k][j])
```

### 5.5 最小生成树

**Kruskal**

```java
// 按边权排序 + 并查集
Edge[] edges = new Edge[m];
// ... 读入边

Arrays.sort(edges, (a, b) -> a.w - b.w);

int cnt = 0, res = 0;
for (Edge e : edges) {
    if (find(e.a) != find(e.b)) {
        union(e.a, e.b);
        res += e.w;
        cnt++;
    }
}
// cnt == n - 1 则有解
```

**Prim**

```java
int[] dist = new int[n + 1];
boolean[] vis = new boolean[n + 1];
Arrays.fill(dist, INF);
dist[1] = 0;

int res = 0;
for (int i = 0; i < n; i++) {
    int t = -1;
    for (int j = 1; j <= n; j++)
        if (!vis[j] && (t == -1 || dist[j] < dist[t]))
            t = j;

    if (dist[t] == INF) return -1; // 不连通
    vis[t] = true;
    res += dist[t];

    for (int[] e : g[t]) {
        int v = e[0], w = e[1];
        if (!vis[v] && w < dist[v]) dist[v] = w;
    }
}
```

### 5.6 拓扑排序

```java
int[] din = new int[n + 1]; // 入度
List<Integer> topo = new ArrayList<>();
Queue<Integer> q = new ArrayDeque<>();

for (int i = 1; i <= n; i++)
    if (din[i] == 0) q.offer(i);

while (!q.isEmpty()) {
    int u = q.poll();
    topo.add(u);
    for (int v : g[u]) {
        if (--din[v] == 0) q.offer(v);
    }
}

// topo.size() == n 则无环
```

------

## 六、动态规划

### 6.1 01 背包

```java
// 一维优化：逆序
int[] f = new int[V + 1];
for (int i = 0; i < n; i++) {
    for (int j = V; j >= v[i]; j--) {
        f[j] = Math.max(f[j], f[j - v[i]] + w[i]);
    }
}
f = [0] * (V + 1)
for i in range(n):
    for j in range(V, v[i] - 1, -1):
        f[j] = max(f[j], f[j - v[i]] + w[i])
```

### 6.2 完全背包

```java
// 一维：正序
for (int i = 0; i < n; i++) {
    for (int j = v[i]; j <= V; j++) {
        f[j] = Math.max(f[j], f[j - v[i]] + w[i]);
    }
}
```

### 6.3 最长公共子序列 (LCS)

```java
int[][] f = new int[n + 1][m + 1];
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= m; j++) {
        if (a[i] == b[j]) f[i][j] = f[i - 1][j - 1] + 1;
        else f[i][j] = Math.max(f[i - 1][j], f[i][j - 1]);
    }
}
```

### 6.4 最长上升子序列 (LIS)

```java
// O(n^2)
int[] f = new int[n];
int res = 0;
for (int i = 0; i < n; i++) {
    f[i] = 1;
    for (int j = 0; j < i; j++)
        if (a[j] < a[i])
            f[i] = Math.max(f[i], f[j] + 1);
    res = Math.max(res, f[i]);
}

// O(nlogn)：贪心 + 二分
int[] q = new int[n + 1];
int len = 0;
for (int x : a) {
    int l = 1, r = len;
    while (l <= r) {
        int mid = l + r >> 1;
        if (q[mid] >= x) r = mid - 1;
        else l = mid + 1;
    }
    q[l] = x;
    if (l > len) len++;
}
```

### 6.5 区间 DP

```java
// 石子合并
int[][] f = new int[n + 1][n + 1];
int[][] s = new int[n + 1][n + 1]; // 前缀和

for (int len = 2; len <= n; len++) {
    for (int i = 1; i + len - 1 <= n; i++) {
        int j = i + len - 1;
        f[i][j] = INF;
        for (int k = i; k < j; k++) {
            f[i][j] = Math.min(f[i][j], f[i][k] + f[k + 1][j] + s[j] - s[i - 1]);
        }
    }
}
```

### 6.6 状态压缩 DP

```java
// 状压：用二进制表示状态
int[] f = new int[1 << n];
Arrays.fill(f, INF);
f[0] = 0;

for (int i = 0; i < 1 << n; i++) {
    for (int j = 0; j < n; j++) {
        if ((i >> j & 1) == 0) { // j 不在当前状态中
            f[i | (1 << j)] = Math.min(f[i | (1 << j)], f[i] + cost);
        }
    }
}
```

------

## 七、数学

### 7.1 质数

```java
// 试除法判质数 O(sqrt(n))
boolean isPrime(int x) {
    if (x < 2) return false;
    for (int i = 2; i <= x / i; i++)
        if (x % i == 0) return false;
    return true;
}

// 埃氏筛 O(nloglogn)
boolean[] st = new boolean[n + 1];
int[] primes = new int[n];
int cnt = 0;

for (int i = 2; i <= n; i++) {
    if (!st[i]) {
        primes[cnt++] = i;
        for (int j = i + i; j <= n; j += i) st[j] = true;
    }
}
```

### 7.2 最大公约数

```java
int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

// 最小公倍数
long lcm(long a, long b) {
    return a / gcd(a, b) * b;
}
import math
math.gcd(a, b)
(a * b) // math.gcd(a, b)  # lcm
```

### 7.3 快速幂

```java
long qmi(long a, long k, long p) {
    long res = 1 % p;
    while (k > 0) {
        if ((k & 1) == 1) res = res * a % p;
        a = a * a % p;
        k >>= 1;
    }
    return res;
}
def qmi(a, k, p):
    res = 1 % p
    while k:
        if k & 1: res = res * a % p
        a = a * a % p
        k >>= 1
    return res
```

------

## 八、贪心

```java
// 区间选点：按右端点排序，选右端点
Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
int res = 0, ed = Integer.MIN_VALUE;
for (int[] seg : intervals) {
    if (ed < seg[0]) {
        res++;
        ed = seg[1];
    }
}

// 区间覆盖：按左端点排序
Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
int res = 0, st = start, i = 0;
while (st < end) {
    int ed = st;
    while (i < n && intervals[i][0] <= st) {
        ed = Math.max(ed, intervals[i][1]);
        i++;
    }
    if (ed == st) return -1; // 无法覆盖
    res++;
    st = ed;
}
```

------

## 附录

### Python 递归深度设置

```python
import sys
sys.setrecursionlimit(3000)  # 默认 1000
```

------

*整理日期：2026年 | 适用于算法竞赛和面试准备*