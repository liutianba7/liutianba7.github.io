# Python 基础知识

## 一、基础语法

### 1.1 变量与数据类型

Python 是**动态类型语言**，变量无需声明类型。

```python
# 数字类型
age = 25          # int
price = 99.9      # float
is_valid = True   # bool

# 字符串
name = "Python"
multi_line = """
多行字符串
"""

# 类型转换
str(123)      # "123"
int("456")    # 456
float("3.14") # 3.14
```

### 1.2 运算符

```python
# 算术运算符
10 + 3   # 13 加
10 - 3   # 7  减
10 * 3   # 30 乘
10 / 3   # 3.333... 除
10 // 3  # 3  整除
10 % 3   # 1  取余
10 ** 2  # 100 幂运算

# 比较运算符
==  !=  >  <  >=  <=

# 逻辑运算符
and  or  not

# 成员运算符
in  not in
```

---

## 二、流程控制

### 2.1 条件语句

```python
score = 85

if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("不及格")

# 三元表达式
result = "及格" if score >= 60 else "不及格"
```

### 2.2 循环语句

```python
# for 循环
for i in range(5):
    print(i)  # 0 1 2 3 4

# 遍历列表
fruits = ["苹果", "香蕉", "橙子"]
for fruit in fruits:
    print(fruit)

# while 循环
count = 0
while count < 3:
    print(count)
    count += 1

# 循环控制
break     # 跳出循环
continue  # 跳过本次迭代
```

---

## 三、数据结构

### 3.1 列表 (List) - 可变有序序列

```python
# 创建与访问
lst = [1, 2, 3, 4, 5]
lst[0]      # 1 (第一个)
lst[-1]     # 5 (最后一个)
lst[1:3]    # [2, 3] (切片)

# 常用方法
lst.append(6)       # 末尾添加
lst.insert(0, 0)    # 指定位置插入
lst.remove(3)       # 删除元素
lst.pop()           # 弹出末尾元素
lst.sort()          # 排序
lst.reverse()       # 反转
len(lst)            # 长度

# 列表推导式
squares = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]
evens = [x for x in range(10) if x % 2 == 0]
```

### 3.2 元组 (Tuple) - 不可变有序序列

```python
tup = (1, 2, 3)
tup[0]        # 1
tup[1:]       # (2, 3)

# 解包
a, b, c = tup
a, *rest = (1, 2, 3, 4)  # a=1, rest=[2,3,4]
```

### 3.3 字典 (Dict) - 键值对映射

```python
# 创建与访问
person = {"name": "张三", "age": 25}
person["name"]              # "张三"
person.get("job", "无")     # "无" (默认值)

# 常用方法
person["city"] = "北京"     # 添加
person.update({"age": 26})  # 更新
person.pop("city")          # 删除
person.keys()               # 所有键
person.values()             # 所有值
person.items()              # 所有键值对

# 字典推导式
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

### 3.4 集合 (Set) - 无序不重复元素

```python
s = {1, 2, 3, 3}    # {1, 2, 3} 自动去重

# 常用方法
s.add(4)            # 添加
s.remove(1)         # 删除
s1 & s2             # 交集
s1 | s2             # 并集
s1 - s2             # 差集
```

---

### 3.5 推导式

推导式（Comprehension）是一种**简洁的语法**，用于从一个可迭代对象快速创建新的列表、集合或字典。它将循环和条件判断压缩成一行代码，比传统的 `for` 循环更 Pythonic。

**基本结构**：`[表达式 for 变量 in 可迭代对象 if 条件]`

```python
# 列表推导式 → 生成 list
[表达式 for x in 可迭代对象]                    # 基础形式
[表达式 for x in 可迭代对象 if 条件]            # 带过滤
[表达式 for x in 可迭代对象 for y in 可迭代对象] # 嵌套（双重循环）

# 集合推导式 → 生成 set（自动去重）
{表达式 for x in 可迭代对象 if 条件}

# 字典推导式 → 生成 dict
{键表达式: 值表达式 for x in 可迭代对象 if 条件}

# 生成器表达式 → 生成 generator（惰性求值，省内存）
(表达式 for x in 可迭代对象 if 条件)
```

**核心理解**：
- `for` 前面的部分是**要生成的元素**
- `for...in` 是**遍历源数据**
- `if` 是**过滤条件**（可选）

## 四 、函数

在 Python 中，**函数是第一类对象（First-Class Object）**，这意味着函数可以像普通变量一样被赋值、传递、返回，甚至可以动态添加属性。

### 4.1 函数的本质是对象

```python
def greet(name):
    """这是一个问候函数"""
    return f"你好, {name}!"

# 函数是对象，有自己的属性和方法
print(type(greet))          # <class 'function'>
print(greet.__name__)       # 'greet'（函数名）
print(greet.__doc__)        # '这是一个问候函数'（文档字符串）

# 函数可以赋值给变量
say_hello = greet
print(say_hello("张三"))    # 你好, 张三!

# 函数可以作为参数传递
def execute(func, arg):
    return func(arg)

execute(greet, "李四")      # 你好, 李四!

# 函数可以作为返回值
def get_greeter():
    return greet

f = get_greeter()
f("王五")                   # 你好, 王五!

# 函数可以存储在数据结构中
funcs = [greet, lambda x: f"再见, {x}"]
for f in funcs:
    print(f("赵六"))
```

### 4.2 动态添加属性

既然函数是对象，就可以像对象一样动态添加属性：

```python
def counter():
    counter.count += 1      # 访问函数属性
    return counter.count

# 动态添加属性（初始化）
counter.count = 0

counter()   # 1
counter()   # 2
counter()   # 3
print(counter.count)  # 3

# 甚至可以添加不同类型的属性
counter.data = {"name": "计数器"}
counter.history = []

def advanced_counter():
    advanced_counter.count += 1
    advanced_counter.history.append(advanced_counter.count)
    return advanced_counter.count

advanced_counter.count = 0
advanced_counter.history = []

advanced_counter()  # 1
advanced_counter()  # 2
print(advanced_counter.history)  # [1, 2]
```

**注意**：这种用法不如闭包和类直观，但展示了 Python 的灵活性。

### 4.3 闭包（Closure）

**什么是闭包？**

闭包是其实就是：inner 函数会记住它使用的外层作用域中的变量，它会将每个用到的变量都封装为一个一个的闭包单元，然后存到当前这个 inner 函数的 `__closure__` 属性中。这样即使外部函数执行完毕了，这些变量也不会丢失。 

也可以这样说，闭包其实就是内层函数 inner + 被内层函数使用的外层变量。

```python
def outer(x):           # 外部函数
    def inner():        # 内部函数
        return x + 1    # 内部函数引用了外部变量 x
    return inner        # 返回内部函数（闭包）

f = outer(10)           # outer 执行完毕，但 x=10 被保留了
print(f())              # 11（还能访问到 x=10！）
```

**产生闭包的条件**

（1）要有函数嵌套

（2）【内层函数】要用到【外层函数】的变量

（3）【外层函数】要返回【内层函数】（有了这个条件，闭包才能活下来，不然虽然能产生必要，但你拿不到）


**为什么能记住？**

Python 检测到 `inner` 使用了外部变量 `x`，会把 `x` 保存在一个特殊的 **cell** 对象中，绑定到 `inner` 的 `__closure__` 属性：

```python
def make_multiplier(factor):
    def multiply(x):
        return x * factor    # 引用了 factor
    return multiply

times3 = make_multiplier(3)

# 查看闭包保存的外部变量 times3.__closure__ 是一个元组，里面的元素可以叫做闭包单元
print(times3.__closure__)              # (<cell at 0x...: int object at 0x...>,)
print(times3.__closure__[0].cell_contents)  # 3（保存的 factor 值）
print(times3.__code__.co_freevars)     # ('factor',)  引用的外部变量名
```

**闭包的优点**

1. **状态保持（记忆化）**：不用全局变量，也不用写类，就能在多次调用之间保存数据

2. **函数定制/柯里化**：先传一部分参数，把环境固定住，得到一个定制版函数（工厂模式）

3. **数据隐藏（封装）**：外层变量对外不可见，只能通过内层函数访问，实现简单的私有化

4. **是装饰器的基础**：装饰器的核心就是利用闭包在不修改原函数的情况下增强功能

5. **代码简洁**：比类更轻量，比全局变量更安全，适合简单的状态管理场景

**闭包的缺点**

1. **内存占用**：闭包会长期持有外部变量的引用，如果这些变量很大（比如大列表、大对象），可能导致内存无法及时释放，造成内存浪费

2. **循环引用风险**：如果闭包中引用的对象又反过来引用闭包本身，可能形成循环引用，导致垃圾回收困难

3. **调试困难**：闭包中保存的变量不像类属性那样直观，需要通过 `__closure__` 查看，定位问题时比较麻烦

4. **可读性一般**：嵌套函数加上 `nonlocal` 等关键字，比直接的类和对象方式更难理解，团队代码 review 时需要更多解释成本

5. **延迟绑定的坑**：在循环中创建闭包时容易出现共享同一个变量的 bug（见下面的例子），新手容易踩坑

```python 
# 缺点示例：闭包长期持有大对象

def make_big_data_handler(big_data):
    """big_data 会被闭包长期引用，即使不需要了也不会释放"""
    def handler():
        return len(big_data)  # 持有 big_data 的引用
    return handler

huge_list = list(range(10000000))  # 大列表
handler = make_big_data_handler(huge_list)

# 现在 huge_list 理论上可以释放了，但因为 handler 持有引用，内存无法回收
# 解决办法：用完 handler 后显式 del handler，或改用类
```

### 4.4 装饰器

**什么是装饰器？**

装饰器是一种**可调用对象**（通常是函数），它接收一个函数作为参数，并返回一个新函数。

装饰器可以在**不修改原函数代码**的前提下，增强或改变原函数的功能。

**核心原理**：装饰器本质是利用**闭包**和**高阶函数**实现的。

```python
import time  
def timeDecorator(func):  
    def wrapper(*args, **kwargs):  
        # 统计时间  
        start = time.time()  
        res = func(*args, **kwargs)  
        elapsed = time.time() - start  
  
        print(f"方法{func.__name__}执行了{elapsed:.4f}秒")  
        return res  
    return wrapper  
@timeDecorator  
def add(x, y):  
    time.sleep(1)  
    return x + y  
add(10, 20)


# 带参数的装饰器

如果想让装饰器本身接收参数（如 `@retry(times=3)`），需要**三层嵌套**：

```python
def repeat(times):                    # 第一层：接收装饰器参数
    def decorator(func):              # 第二层：接收被装饰函数
        def wrapper(*args, **kwargs): # 第三层：包装函数
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(times=3)
def greet(name):
    print(f"Hello, {name}")

greet("Alice")
# Hello, Alice
# Hello, Alice
# Hello, Alice

# 等价于: greet = repeat(times=3)(greet)
```

**结构解析**：
- 第一层 `repeat(times)`：接收装饰器的配置参数，返回真正的装饰器
- 第二层 `decorator(func)`：接收被装饰的函数，返回包装函数
- 第三层 `wrapper(*args, **kwargs)`：执行实际的逻辑

**另一个例子：带日志级别的装饰器**

```python
def log(level="INFO"):
    def decorator(func):
        def wrapper(*args, **kwargs):
            print(f"[{level}] 调用 {func.__name__}")
            result = func(*args, **kwargs)
            print(f"[{level}] {func.__name__} 返回 {result}")
            return result
        return wrapper
    return decorator

@log(level="DEBUG")
def add(a, b):
    return a + b

add(1, 2)
# [DEBUG] 调用 add
# [DEBUG] add 返回 3
```

**三层嵌套的理解技巧**：

```
@repeat(times=3)
def greet(): ...

执行流程：
1. repeat(times=3) → 返回 decorator 函数
2. decorator(greet) → 返回 wrapper 函数
3. greet = wrapper（被重新赋值）
```


### 4.5 参数类型详解

```python
# 位置参数 & 关键字参数 & 默认值
def func(a, b, c=0):
    return a + b + c

func(1, 2)           # 位置参数
func(a=1, b=2)       # 关键字参数
func(1, 2, c=3)      # 混合使用

# 可变位置参数 *args（接收为元组）
def sum_all(*args):
    return sum(args)

sum_all(1, 2, 3, 4)  # 10
sum_all()            # 0

# 可变关键字参数 **kwargs（接收为字典）
def show_info(**kwargs):
    for k, v in kwargs.items():
        print(f"{k}: {v}")

show_info(name="张三", age=25)

# 参数顺序规则：位置 → 默认 → *args → 关键字 → **kwargs
def full_func(pos1, pos2, default="x", *args, key1, key2, **kwargs):
    print(f"位置: {pos1}, {pos2}")
    print(f"默认: {default}")
    print(f"可变位置: {args}")
    print(f"仅限关键字: {key1}, {key2}")
    print(f"可变关键字: {kwargs}")

full_func(1, 2, 3, 4, 5, key1="a", key2="b", extra="c")
```

### 4.6 Lambda 表达式

```python
# 匿名函数（单行表达式）
square = lambda x: x ** 2
print(square(5))  # 25

# 常用场景：作为高阶函数的参数
nums = [3, 1, 4, 1, 5]
sorted(nums, key=lambda x: -x)  # 降序 [5, 4, 3, 1, 1]

# 与 map/filter/reduce 配合
from functools import reduce

nums = [1, 2, 3, 4, 5]
list(map(lambda x: x * 2, nums))      # [2, 4, 6, 8, 10]
list(filter(lambda x: x > 3, nums))   # [4, 5]
reduce(lambda x, y: x + y, nums)      # 15

# Lambda 也是对象，可以传递
operations = {
    "add": lambda a, b: a + b,
    "mul": lambda a, b: a * b
}
operations["add"](3, 4)  # 7
```

### 4.7 内置高阶函数

高阶函数的意义： 

1）**代码复用性**：将通用逻辑（遍历、过滤、映射）提取出来，专注业务逻辑

2）**声明式编程**：描述"做什么"而非"怎么做"，代码更简洁、可读性更高

3）**函数组合**：简单函数可以像积木一样组合，构建复杂的数据处理流程

```python
# 映射：对可迭代对象每个元素应用函数
map(function, iterable, ...) → iterator

# 过滤：保留满足条件的元素
filter(function, iterable) → iterator

# 排序：返回排序后的新列表（原列表不变）
sorted(iterable, key=None, reverse=False) → list

# 归约：对序列进行累积计算（functools模块）
reduce(function, iterable[, initializer]) → value
# res = reduce(lambda x,y:x + y, arr, 0)

# 枚举：带索引遍历，返回 (index, value) 元组
enumerate(iterable, start=0) → iterator

# 拉链：并行聚合多个可迭代对象
zip(*iterables, strict=False) → iterator

# 逻辑判断：任一/全部为真
any(iterable) → bool  # 任一元素为真则返回True
all(iterable) → bool  # 所有元素为真则返回True
```

### 4.8 四种作用域

Python 中变量的访问权限由**作用域（Scope）**决定，遵循 LEGB 规则（从内到外查找）：

| 作用域    | 英文            | 范围            | 生命周期           |
| ------ | ------------- | ------------- | -------------- |
| **局部** | Local (L)     | 函数内部          | 函数执行期间         |
| **嵌套** | Enclosing (E) | 嵌套函数的外层函数     | 外层函数执行期间       |
| **全局** | Global (G)    | 模块级别（文件顶层）    | 程序运行期间         |
| **内置** | Built-in (B)  | Python 内置命名空间 | Python 解释器启动期间 |

**LEGB 查找顺序**：Local → Enclosing → Global → Built-in

```python
# 示例：四种作用域
x = 'global'          # 全局作用域 (G)

def outer():
    y = 'enclosing'   # 嵌套作用域 (E)

    def inner():
        z = 'local'   # 局部作用域 (L)
        print(z)      # local（先找 Local）
        print(y)      # enclosing（再找 Enclosing）
        print(x)      # global（再找 Global）
        print(max)    # <built-in function max>（最后找 Built-in）

    inner()

outer()
```

#### global 关键字

在函数内部**修改**全局变量（而非创建局部变量）：

```python
count = 0

def increment():
    global count      # 声明使用全局变量
    count += 1        # 修改全局变量
    print(count)

increment()  # 1
increment()  # 2
print(count) # 2（全局变量已被修改）

# 错误示例：不写 global 会创建局部变量
def wrong_increment():
    count = 0         # 创建局部变量，不影响全局
    count += 1

wrong_increment()
print(count)          # 2（全局变量未被修改）
```

#### nonlocal 关键字

在嵌套函数中**修改**外层（非全局）变量：

```python
def outer():
    x = 'outer'       # Enclosing 作用域变量

    def inner():
        nonlocal x    # 声明使用外层变量（不是全局）
        x = 'modified' # 修改外层变量
        print(f"inner: {x}")

    inner()
    print(f"outer: {x}")  # modified（已被 inner 修改）

outer()

# nonlocal vs global 区别
# - global：跳过 Local，直接找 Global
# - nonlocal：跳过 Local，找最近的 Enclosing（不包括 Global）
```

**注意事项**：
- `global` 和 `nonlocal` 都用于**修改**外部变量，如果只是**读取**则不需要声明


- 避免滥用全局变量，会导致代码难以维护和调试


- 优先使用参数传递和返回值来传递数据

### 4.9 类型注解

类型注解就是给代码添加类型说明，可以**增强代码可读性**，也能让 **IDE 有更好的提示和检查**。Python 的类型注解是**可选的**，不会影响运行时行为（只是"提示"，不强制）。

**基本类型注解**：

```python
# 变量类型注解
name: str = "张三"
age: int = 25
score: float = 95.5
is_student: bool = True

# 函数参数和返回值注解
def greet(name: str, times: int = 1) -> str:
    return f"Hello, {name}! " * times

result: str = greet("Alice", 2)
```

**容器类型注解**（需要 `typing` 模块）：

```python
from typing import List, Dict, Set, Tuple, Sequence

# 列表
names: List[str] = ["Alice", "Bob"]
scores: List[int] = [90, 85, 92]

# 字典
user: Dict[str, int] = {"age": 25, "score": 90}

# 元组（固定长度和类型）
point: Tuple[int, int] = (10, 20)
point: Tuple[int, ...] = () #这样才是元组长度无所谓，但是每一个元素的类型都得是 int

# 集合
tags: Set[str] = {"python", "java"}

# Python 3.9+ 可以直接用内置类型
names: list[str] = ["Alice", "Bob"]       # 无需导入 typing
user: dict[str, int] = {"age": 25}
```

**可选类型和联合类型**：

```python
from typing import Optional, Union

# Optional：可能为 None
def find_user(id: int) -> Optional[str]:  # 等价于 Union[str, None]
    if id > 0:
        return "Alice"
    return None

# Union：多种可能的类型
def process(value: Union[int, str]) -> str:
    return str(value)

# Python 3.10+ 可以用 | 语法
def process(value: int | str) -> str:     # 更简洁
    return str(value)

def find_user(id: int) -> str | None:     # 等价于 Optional[str]
    ...
```

**函数类型注解详解**：

```python
from typing import Callable, Any

# Callable：函数类型
def execute(func: Callable[[int, int], int], a: int, b: int) -> int:
    return func(a, b)

# Any：任意类型（慎用，会失去类型检查的意义）
def process(data: Any) -> Any:
    return data

# ...（省略参数类型）
def foo(x: int, *args: str, **kwargs: int) -> None:
    pass

foo(1, "a", "b", key1=1, key2=2)

# 给多个返回值设置类型注解
def show(a: int, b: int) -> tuple[int, int, int]:
	return a, b, a
```

**类和自定义类型**：

```python
from typing import TypeVar, Generic

class Person:
    def __init__(self, name: str) -> None:
        self.name = name

def greet(person: Person) -> str:
    return f"Hello, {person.name}"

# 泛型（进阶）
T = TypeVar('T')

class Box(Generic[T]):
    def __init__(self, content: T) -> None:
        self.content = content

    def get(self) -> T:
        return self.content

box1: Box[int] = Box(42)
box2: Box[str] = Box("hello")
```

**类型别名**：

```python
from typing import TypeAlias

# 简化复杂类型
Vector: TypeAlias = list[float]
Matrix: TypeAlias = list[Vector]

def dot_product(a: Vector, b: Vector) -> float:
    return sum(x * y for x, y in zip(a, b))

# Python 3.10+ 可以直接用 type 关键字
type Vector = list[float]
type Matrix = list[Vector]
```

**类型注解 vs 运行时检查**：

```python
# 类型注解只是"提示"，不会阻止错误类型
def add(a: int, b: int) -> int:
    return a + b

add("hello", "world")  # 运行时不报错，返回 "helloworld"（IDE 会警告）
```

**常用 typing 类型速查**：

| 类型                         | 说明           | 示例                     |
| -------------------------- | ------------ | ---------------------- |
| `List[T]`                  | 列表           | `List[int]`            |
| `Dict[K, V]`               | 字典           | `Dict[str, int]`       |
| `Set[T]`                   | 集合           | `Set[str]`             |
| `Tuple[T1, T2]`            | 元组           | `Tuple[int, str]`      |
| `Optional[T]`              | 可选（T 或 None） | `Optional[int]`        |
| `Union[T1, T2]`            | 联合类型         | `Union[int, str]`      |
| `Any`                      | 任意类型         | `Any`                  |
| `Callable[[Args], Return]` | 函数类型         | `Callable[[int], str]` |

**注意**：类型注解是 Python 3.5+ 引入的特性，Python 3.9+ 可以直接用 `list[]`、`dict[]` 等内置泛型，Python 3.10+ 支持 `|` 联合语法。

**TypedDict**：`TypedDict` 用于为**字典**添加类型提示，指定每个键的名称和对应的类型。

基本用法

```python
from typing import TypedDict

class Person(TypedDict):
    name: str
    age: int
    email: str

# 创建符合类型的字典
p: Person = {"name": "张三", "age": 25, "email": "zhangsan@example.com"}

# 错误：缺少必填字段或类型不符
# p = {"name": "李四"}           # ❌ 缺少 age 和 email
# p = {"name": "王五", "age": "25"}  # ❌ age 应为 int
```

 可选字段（total=False）

```python
class Movie(TypedDict, total=False):
    """所有字段都是可选的"""
    title: str
    year: int
    rating: float

# 可以只提供部分字段
m1: Movie = {"title": "肖申克的救赎"}
m2: Movie = {"title": "阿甘正传", "year": 1994}
```

混合使用：必填 + 可选

```python
class Book(TypedDict):
    title: str
    author: str  # 必填

class BookOptional(Book, total=False):
    isbn: str
    pages: int   # 可选

b: BookOptional = {"title": "Python编程", "author": "张三"}
b2: BookOptional = {"title": "Python编程", "author": "张三", "isbn": "978-7-xxx"}
```

---

**Annotated**：`Annotated` 用于为**类型添加元数据**，格式为 `Annotated[类型, 元数据1, 元数据2, ...]`。

基本语法

```python
from typing import Annotated

# Annotated[实际类型, 元数据...]
name: Annotated[str, "用户姓名"] = "张三"
age: Annotated[int, "年龄范围", "0-150"] = 25
```

常见应用场景

**1. Pydantic：字段验证和描述**

```python
from pydantic import BaseModel, Field
from typing import Annotated

class User(BaseModel):
    # Field(...) 提供验证规则和描述
    name: Annotated[str, Field(min_length=2, max_length=20, description="用户名")]
    age: Annotated[int, Field(ge=0, le=150, description="年龄")]
    email: Annotated[str, Field(pattern=r"^\S+@\S+\.\S+$", description="邮箱")]

user = User(name="张三", age=25, email="zs@example.com")
```

**2. FastAPI：依赖注入和参数校验**

```python
from fastapi import FastAPI, Query, Path, Depends
from typing import Annotated

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(
    item_id: Annotated[int, Path(title="商品ID", ge=1)],
    q: Annotated[str | None, Query(max_length=50)] = None
):
    """路径参数 + 查询参数校验"""
    return {"item_id": item_id, "q": q}

# 依赖注入
def common_params(q: str = "", skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

CommonsDep = Annotated[dict, Depends(common_params)]

@app.get("/users/")
async def read_users(commons: CommonsDep):
    return commons
```

**3. LangChain：提示词变量绑定**

```python
from langchain_core.prompts import ChatPromptTemplate
from typing import Annotated

# 在 LangChain 中，Annotated 可用于标记变量用途
template = ChatPromptTemplate.from_messages([
    ("system", "你是一个{role}专家"),
    ("human", "{question}")
])

# 部分变量绑定
prompt = template.partial(role=Annotated[str, "助手角色"])
```

---

## 五、面向对象

### 5.1 类的定义

```python
class Person:
    """人类"""
    pass

# 创建对象
p = Person()
```

### 5.2 属性

#### 实例属性（成员属性）

定义在 `__init__` 方法中，每个对象独立拥有一份。可以通过 p1.xxx = xxx 为当前实例添加一个实例属性。

```python
class Person:
    def __init__(self, name, age):
        self.name = name    # 实例属性
        self.age = age      # 实例属性

p1 = Person("张三", 25)
p2 = Person("李四", 30)

print(p1.name)  # "张三"
print(p2.name)  # "李四"  (各自独立)
```

#### 类属性（静态属性）

定义在类体中，所有对象共享同一份。可以通过实例访问，也可以通过类名访问。

```python
class Person:
    species = "人类"        # 类属性
    count = 0               # 类属性

    def __init__(self, name):
        self.name = name
        Person.count += 1    # 修改类属性

p1 = Person("张三")
p2 = Person("李四")

print(p1.species)      # "人类" (通过实例访问)
print(Person.species)  # "人类" (通过类访问)
print(Person.count)    # 2

# 修改类属性（影响所有实例）
Person.species = "高等动物"
print(p1.species)      # "高等动物"
```

#### 私有属性

以 `__` 开头的属性，外部无法直接访问。

```python
class Person:
    def __init__(self, name, password):
        self.name = name
        self.__password = password  # 私有属性

    def get_password(self):
        return self.__password

p = Person("张三", "123456")
print(p.name)           # "张三"
# print(p.__password)   # 报错！无法直接访问
print(p.get_password()) # "123456" (通过方法访问)
print(p._Person__password)  # "123456" (名称重整，不推荐)
```

### 5.3 方法

#### 实例方法

第一个参数是 `self`，可访问实例属性和类属性。所有实例共享一个实例方法，默认实例方法不会在实例上出现，而是保存在了类上（有点像 js 的原型链），可以通过 p.xxx = xxx 来重写当前方法。实例方法也能通过类直接调用。

```python
class Person:
    def __init__(self, name):
        self.name = name

    def say_hello(self):          # 实例方法
        print(f"你好，我是{self.name}")

p = Person("张三")
p.say_hello()  # 通过实例调用
Person.say_hello(p) # 通过类调用
```

#### 类方法

使用 `@classmethod` 装饰器，第一个参数是 `cls`，可访问类属性。类方法通常用于实现**工厂方法**或需要访问类属性/方法的场景，无需创建实例即可调用。

```python
class Person:
    count = 0

    def __init__(self, name):
        self.name = name
        Person.count += 1

    @classmethod
    def get_count(cls):           # 类方法
        return cls.count

    @classmethod
    def create_anonymous(cls):    # 工厂方法
        return cls("匿名用户")

p1 = Person("张三")
p2 = Person("李四")

print(Person.get_count())  # 2
p3 = Person.create_anonymous()
print(p3.name)             # "匿名用户"
```

#### 静态方法

使用 `@staticmethod` 装饰器，无 `self` 和 `cls`，独立于类和实例。

```python
class MathUtils:
    PI = 3.14159

    @staticmethod
    def add(a, b):          # 静态方法
        return a + b

    @staticmethod
    def circle_area(radius):
        return MathUtils.PI * radius ** 2  # 访问类属性需用类名

print(MathUtils.add(1, 2))       # 3
print(MathUtils.circle_area(2))  # 12.56636
```

#### 属性装饰器 `@property`

将方法变成属性访问，用于实现 getter/setter。

```python
class Person:
    def __init__(self, name, age):
        self._name = name
        self._age = age

    @property
    def name(self):            # getter
        return self._name

    @property
    def age(self):            # getter
        return self._age

    @age.setter
    def age(self, value):     # setter
        if value < 0:
            raise ValueError("年龄不能为负")
        self._age = value

    @age.deleter
    def age(self):            # deleter
        print("删除年龄")
        del self._age

p = Person("张三", 25)
print(p.name)        # "张三" (像属性一样访问)
print(p.age)         # 25
p.age = 26           # 通过 setter 修改
# p.age = -1         # 抛出异常
del p.age            # 删除属性
```

### 5.4 三种方法对比

| 类型   | 装饰器             | 第一个参数  | 可访问        | 调用方式                              |
| ---- | --------------- | ------ | ---------- | --------------------------------- |
| 实例方法 | 无               | `self` | 实例属性 + 类属性 | `obj.method()`                    |
| 类方法  | `@classmethod`  | `cls`  | 类属性        | `Class.method()` 或 `obj.method()` |
| 静态方法 | `@staticmethod` | 无      | 需通过类名访问    | `Class.method()` 或 `obj.method()` |

### 5.5 继承

继承允许子类复用父类的属性和方法，并支持扩展和重写。Python 支持单继承和多继承，使用 `super()` 调用父类方法。

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(f"{self.name}在叫")

# 单继承
class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)    # 调用父类构造，不用传self，如果是 Animal.__init__，那就得传 self 了。
        self.breed = breed

    def speak(self):               # 重写方法
        print(f"{self.name}汪汪叫")

# 多继承
class Flyable:
    def fly(self):
        print("飞翔中...")

class Bird(Animal, Flyable):
    pass

dog = Dog("旺财", "金毛")
dog.speak()  # "旺财汪汪叫"

bird = Bird("小鸟")
bird.speak()  # "小鸟在叫"
bird.fly()    # "飞翔中..."
```

### 5.6 魔法方法

魔法方法（Magic Methods）是以双下划线 `__` 开头和结尾的特殊方法，用于实现对象的特定行为。它们不需要显式调用，而是在特定操作时自动触发，让你可以自定义类的行为。

常用魔法方法一览：

| 方法             | 触发时机               | 用途      |
| -------------- | ------------------ | ------- |
| `__init__`     | 创建对象后              | 初始化属性   |
| `__str__`      | `print(obj)`       | 返回字符串表示 |
| `__repr__`     | 直接输出对象             | 调试用字符串  |
| `__len__`      | `len(obj)`         | 返回长度    |
| `__getitem__`  | `obj[key]`         | 索引访问    |
| `__setitem__`  | `obj[key] = value` | 索引赋值    |
| `__delitem__`  | `del obj[key]`     | 删除索引    |
| `__contains__` | `item in obj`      | 成员判断    |
| `__iter__`     | `for x in obj`     | 迭代      |
| `__add__`      | `obj1 + obj2`      | 加法运算    |
| `__eq__`       | `obj1 == obj2`     | 相等比较    |
| `__lt__`       | `obj1 < obj2`      | 小于比较    |
| `__call__`     | `obj()`            | 可调用对象   |
| `__getattr__`  | 当访问了不存在的属性时        |         |


```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __len__(self):
        return 2

    def __call__(self, scale):
        """可调用对象"""
        return Vector(self.x * scale, self.y * scale)

v1 = Vector(1, 2)
v2 = Vector(3, 4)

print(v1)          # Vector(1, 2)
print(v1 + v2)     # Vector(4, 6)
print(v1 == v2)    # False
print(len(v1))     # 2
v3 = v1(10)        # 调用 __call__
print(v3)          # Vector(10, 20)
```

### 5.7 isinstance 和 issubclass

Python 提供两个内置函数用于类型检查：

- `isinstance(obj, class)`：检查对象是否是指定类（或其子类）的实例

- `issubclass(class, classinfo)`：检查类是否是另一个类的子类

```python
class Animal:
    pass

class Dog(Animal):
    pass

dog = Dog()

# isinstance 检查实例类型
print(isinstance(dog, Dog))      # True
print(isinstance(dog, Animal))   # True（继承链）
print(isinstance(dog, object))   # True（所有类继承自 object）

# 支持元组，检查多个类型
print(isinstance(dog, (Dog, int)))  # True

# issubclass 检查继承关系
print(issubclass(Dog, Animal))   # True
print(issubclass(Dog, object))   # True
print(issubclass(Animal, Dog))   # False（反向不成立）
```

**与 type() 的区别**：`type()` 只返回对象的直接类型，不考虑继承；`isinstance()` 会检查整个继承链。

### 5.8 三种权限

Python 通过命名约定实现三种访问权限（非强制，靠约定）：

| 权限 | 命名规则 | 访问范围 | 示例 |
|------|----------|----------|------|
| 公有 | 无下划线前缀 | 类内外均可访问 | `name` |
| 保护 | 单下划线前缀 `_` | 类内及子类可访问（约定） | `_name` |
| 私有 | 双下划线前缀 `__` | 仅类内可访问（名称改写） | `__name` |

```python
class Person:
    def __init__(self, name, age, salary):
        self.name = name           # 公有属性
        self._age = age            # 保护属性（约定）
        self.__salary = salary     # 私有属性（名称改写为 _Person__salary）

    def __secret(self):            # 私有方法
        return f"工资：{self.__salary}"

    def get_info(self):
        return f"{self.name}, {self._age}, {self.__secret()}"

p = Person("张三", 25, 10000)

# 访问测试
print(p.name)        # 张三 ✓ 公有可直接访问
print(p._age)        # 25 ✓ 保护可访问（但不该这么做）
# print(p.__salary)  # × 报错：AttributeError

# 私有属性的实际存储名
print(p._Person__salary)  # 10000（不推荐强行访问）
```


**要点**：
- 私有属性和方法会被 Python **名称改写（Name Mangling）**，变为 `_类名__属性名`

- 保护属性是**约定俗成**，实际仍可访问

- Python 理念："我们都是成年人"（约定优于强制）

### 5.9 抽象类

抽象类是不能实例化的类，用于定义子类必须实现的接口。Python 通过 `abc` 模块实现抽象基类。

```python
from abc import ABC, abstractmethod

class Animal(ABC):                    # 继承 ABC 成为抽象类
    @abstractmethod                   # 抽象方法装饰器
    def speak(self):                  # 抽象方法，无具体实现
        pass

    @abstractmethod
    def move(self):
        pass

    def breathe(self):                # 普通方法可以有实现
        print("呼吸中...")

class Dog(Animal):                    # 子类必须实现所有抽象方法
    def speak(self):
        print("汪汪叫")

    def move(self):
        print("用四条腿跑")

# animal = Animal()  # × 报错：不能实例化抽象类
dog = Dog()          # ✓
dog.speak()          # 汪汪叫
dog.breathe()        # 呼吸中...
```

**要点**：
- 抽象类继承 `ABC`（Abstract Base Class）

- 抽象方法用 `@abstractmethod` 装饰

- 子类必须实现所有抽象方法，否则无法实例化

- 抽象类可以有普通方法（带实现）

### 5.10 类装饰器

除了用函数实现装饰器，还可以用**类来实现装饰器**。类装饰器通过 `__init__` 接收被装饰的函数，`__call__` 实现装饰逻辑。

**基本结构**：

```python
class SayHello:  
    def __init__(self, msg):  
        self.msg = msg  
  
    def __call__(self,func):  
        def wrapper(*args, **kwargs):  
            print(f'要执行{self.msg}了')  
            res = func(*args, **kwargs)  
            return res  
        return wrapper  
  
@SayHello('加法')  
def add(x, y):  
    res = x + y  
    return res  
  
add(10, 20)
```

**类装饰器 vs 函数装饰器**：

| 特性 | 函数装饰器 | 类装饰器 |
|------|------------|----------|
| 实现方式 | 嵌套函数 + 闭包 | `__init__` + `__call__` |
| 状态保存 | 用闭包或函数属性 | 用实例属性（更直观） |
| 可扩展性 | 需多层嵌套 | 可继承、可添加方法 |
| 理解难度 | 闭包较抽象 | 面向对象，更易理解 |

**带参数的类装饰器**：

需要再多一层，用 `__init__` 接收参数，返回一个真正的装饰器：

```python
class Retry:
    """带参数的类装饰器：失败时重试"""

    def __init__(self, times=3, delay=1):
        self.times = times
        self.delay = delay

    def __call__(self, func):
        # 返回包装函数（这才是真正的装饰逻辑）
        def wrapper(*args, **kwargs):
            for i in range(self.times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if i == self.times - 1:
                        raise
                    time.sleep(self.delay)
                    print(f"重试第{i+1}次...")
        return wrapper

@Retry(times=3, delay=0.5)
def fetch_data():
    import random
    if random.random() < 0.7:
        raise Exception("网络错误")
    return "数据"

fetch_data()
```

## 六、文件操作

**纯文本文件**：以字符为单位存储，人类可直接阅读。如 `.txt`、`.py`、`.md`、`.json` 等。

**二进制文件**：以字节为单位存储，人类无法直接阅读。如图片 `.jpg`、视频 `.mp4`、音频 `.mp3`、可执行文件等。

> **本质说明**：所有文件在磁盘上都是以**二进制**形式存储的。区分文本和二进制只是在**读写时的解析方式**不同。

| 对比项       | 纯文本文件              | 二进制文件                |
| --------- | ------------------ | -------------------- |
| **打开模式**  | `"r"`、`"w"`、`"a"`  | `"rb"`、`"wb"`、`"ab"` |
| **读写单位**  | 字符串 (`str`)        | 字节 (`bytes`)         |
| **编码**    | 需要指定 `encoding`    | 无需编码                 |
| **适用场景**  | 配置文件、日志、代码         | 图片、视频、网络传输           |
| **换行符处理** | 自动转换 `\n` ↔ `\r\n` | 不转换，原样读写             |

```python
# 纯文本文件 - 指定编码
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()          # 返回 str

# 二进制文件 - 不指定编码
with open("image.jpg", "rb") as f:
    data = f.read()             # 返回 bytes
    print(type(data))           # <class 'bytes'>
```

**文本与二进制转换**：

```python
# 字符串 → 字节（编码）
text = "你好"
byte_data = text.encode("utf-8")    # b'\xe4\xbd\xa0\xe5\xa5\xbd'

# 字节 → 字符串（解码）
byte_data = b'\xe4\xbd\xa0\xe5\xa5\xbd'
text = byte_data.decode("utf-8")    # "你好"

# 常用编码
"中文".encode("utf-8")      # 3字节/中文，国际通用
"中文".encode("gbk")        # 2字节/中文，中文系统兼容
"中文".encode("latin-1")    # 报错！latin-1不支持中文
```

### 6.1 打开模式详解

**文本模式 (`t`) vs 二进制模式 (`b`)**

默认模式为 `t`（文本模式），可省略不写。两者的核心区别在于数据的编码解码处理：

| 对比项 | 文本模式 (`rt`/`wt`/`at`) | 二进制模式 (`rb`/`wb`/`ab`) |
|--------|--------------------------|---------------------------|
| **返回类型** | `str`（字符串） | `bytes`（字节） |
| **编码处理** | 自动解码：文件字节 → 字符串（需要指定`encoding`） | 无编码：直接返回原始字节 |
| **换行符** | 自动转换 `\r\n` → `\n`（读取时） | 不转换，原样读写 |
| **适用场景** | 文本文件、配置文件、日志 | 图片、视频、网络数据、zip |

```python
# 文本模式：返回字符串，自动解码
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(type(content))    # <class 'str'>

# 二进制模式：返回字节，原始数据
with open("data.txt", "rb") as f:
    data = f.read()
    print(type(data))       # <class 'bytes'>
    print(data)             # b'Hello\xe4\xb8\xad\xe6\x96\x87'
                            # 可见ASCII直接显示，非ASCII显示为\x 十六进制
```

**`bytes` 对象的显示规则**：

Python 为了让你能直观地查看二进制数据，在显示 `bytes` 时做了以下处理：

- **可打印 ASCII 字符**（32-126，如字母、数字、空格）：直接显示为字符
- **不可见字符**（如 `\n` `\t`）：显示为转义序列
- **非 ASCII 字节**（128-255，如中文UTF-8编码）：显示为 `\xHH` 十六进制

```python
data = b"Hello\n\xe4\xb8\xad\xe6\x96\x87"  # Hello + 换行 + "中文"的UTF-8编码
print(data)
# b'Hello\n\xe4\xb8\xad\xe6\x96\x87'
#  ↑可打印  ↑转义    ↑\x 十六进制显示
```

**常用模式速查表**：

| 模式       | 含义         | 文件存在                 | 文件不存在                  |
| -------- | ---------- | -------------------- | ---------------------- |
| `r`/`rt` | 只读（文本）     | 正常打开                 | 报错 `FileNotFoundError` |
| `rb`     | 只读（二进制）    | 正常打开                 | 报错                     |
| `w`/`wt` | 只写，覆盖（文本）  | **清空内容**             | 创建新文件                  |
| `wb`     | 只写，覆盖（二进制） | **清空内容**             | 创建新文件                  |
| `a`/`at` | 只写，追加（文本）  | 保留内容，末尾追加            | 创建新文件                  |
| `ab`     | 只写，追加（二进制） | 保留内容，末尾追加            | 创建新文件                  |
| `x`      | 独占创建       | 报错 `FileExistsError` | 创建新文件                  |
| `r+`     | 读写（文本）     | 正常打开，指针在开头           | 报错                     |
| `w+`     | 读写，覆盖      | **清空内容**             | 创建新文件                  |
| `a+`     | 读写，追加      | 保留内容，指针在末尾           | 创建新文件                  |
| `b`      | 二进制修饰符     | 与上述模式组合使用            | -                      |

### 6.2 文件读写操作

**基本操作流程**：

```python
# 完整流程（不推荐）
f = open("data.txt", "r", encoding="utf-8")  # 1. 打开
try:
    content = f.read()                       # 2. 操作
finally:
    f.close()                                # 3. 关闭（必须执行！）

# 使用 with 语句（推荐）- 自动关闭，即使发生异常
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
# 离开 with 块，自动调用 f.close()
```

**写入操作**：

```python
# write() - 写入字符串
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n")
    f.write("第二行\n")

# writelines() - 写入多行（不会自动加换行符）
lines = ["第一行\n", "第二行\n", "第三行\n"]
with open("output.txt", "w", encoding="utf-8") as f:
    f.writelines(lines)

# 追加模式
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("日志记录\n")
 
# print 重定向到文件
with open("output.txt", "w", encoding="utf-8") as f:
    print("Hello", "World", sep="-", file=f)  # 输出: Hello-World
```

**读取操作**：

```python
# read(size) - 读取指定字节/字符数
with open("data.txt", "r", encoding="utf-8") as f:
    chunk = f.read(1024)        # 读取前 1024 个字符
    rest = f.read()             # 读取剩余全部

# readline() - 读取一行（包含换行符）
with open("data.txt", "r", encoding="utf-8") as f:
    line1 = f.readline()        # "第一行\n"
    line2 = f.readline()        # "第二行\n"

# readlines() - 读取所有行，返回列表
with open("data.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()       # ['第一行\n', '第二行\n', ...]

# 迭代文件对象 - 逐行读取（内存友好）
with open("data.txt", "r", encoding="utf-8") as f:
    for line in f:              # 每次只读一行
        print(line.strip())     # strip() 去除首尾空白和换行

# 使用列表推导式处理
with open("data.txt", "r", encoding="utf-8") as f:
    lines = [line.strip() for line in f if line.strip()]
```

### 6.3 文件指针定位

```python
# seek(offset, whence) - 移动文件指针
# whence: 0(开头,默认), 1(当前位置), 2(末尾)

with open("data.txt", "r+", encoding="utf-8") as f:
    f.seek(0)           # 移到开头
    f.seek(0, 2)        # 移到末尾
    f.seek(-10, 1)      # 从当前位置后退10字节（二进制模式）

    pos = f.tell()      # 获取当前指针位置

    f.truncate(100)     # 截断文件到100字节
```

### 6.4 大文件处理策略

```python
# 问题：直接 read() 会耗尽内存
with open("huge_file.txt", "r") as f:
    data = f.read()     # ❌ 文件太大时会内存溢出

# 策略1：分块读取
def read_in_chunks(file_path, chunk_size=8192):
    with open(file_path, "r", encoding="utf-8") as f:
        while chunk := f.read(chunk_size):
            yield chunk

for chunk in read_in_chunks("huge_file.txt"):
    process(chunk)

# 策略2：逐行处理（推荐）
with open("huge_file.txt", "r", encoding="utf-8") as f:
    for line in f:      # 内存中只保留一行
        process(line)

# 策略3：使用生成器表达式
with open("huge_file.txt", "r", encoding="utf-8") as f:
    results = (process(line) for line in f)
```

### 6.5 文件路径操作

**`pathlib` 模块（推荐）**：

```python
from pathlib import Path

# 创建路径对象
p = Path("/home/user/docs/file.txt")    # Linux/Mac
p = Path("C:/Users/user/docs/file.txt") # Windows
p = Path("data") / "subdir" / "file.txt" # 自动处理分隔符

# 路径属性
p.name          # "file.txt"        文件名
p.stem          # "file"            文件名（无后缀）
p.suffix        # ".txt"            后缀
p.suffixes      # [".tar", ".gz"]   多个后缀
p.parent        # Path(".../docs")  父目录
p.parents[0]    # 父目录
p.parents[1]    # 祖父目录
p.parts         # ('/', 'home', 'user', 'docs', 'file.txt')

# 路径判断
p.exists()      # 是否存在
p.is_file()     # 是否是文件
p.is_dir()      # 是否是目录
p.is_absolute() # 是否是绝对路径

# 路径操作
p.resolve()     # 转为绝对路径，解析符号链接
p.absolute()    # 转为绝对路径
p.relative_to(Path("/home"))  # 计算相对路径

# 文件操作
p.read_text(encoding="utf-8")   # 读取文本
p.read_bytes()                  # 读取二进制
p.write_text("内容")            # 写入文本
p.write_bytes(b"内容")          # 写入二进制

# 目录操作
Path("new_dir").mkdir(parents=True, exist_ok=True)  # 创建目录
Path("empty_dir").rmdir()       # 删除空目录
Path("file.txt").unlink()       # 删除文件

# 遍历目录
for f in Path(".").iterdir():   # 迭代当前目录
    print(f)

for f in Path(".").glob("*.py"):        # 匹配模式
    print(f)

for f in Path(".").rglob("**/*.py"):    # 递归匹配
    print(f)
```

**`os.path` 模块（传统方式）**：

```python
import os

# 路径拼接
path = os.path.join("folder", "subfolder", "file.txt")

# 路径分解
dirname = os.path.dirname(path)     # "folder/subfolder"
basename = os.path.basename(path)   # "file.txt"
split = os.path.splitext(path)      # ("folder/subfolder/file", ".txt")

# 判断
os.path.exists(path) # 可以是目录，也可以是文件
os.path.isfile(path) 
os.path.isdir(path)
os.path.isabs(path)

# 绝对路径
abs_path = os.path.abspath(path)

# 目录操作
os.mkdir('') # 只能创建单级目录
os.makedirs  # 可以创建多级目录
os.rmdir(path) # 只能删除空目录
os.removedirs(path) # 递归删除空目录 

# 扫描路径
res = os.scan(path) # 返回的是一个迭代器
res = os.word(path) # 返回的是一个生成器

```

### 6.6 JSON 文件操作

```python
import json

# Python 对象 → JSON 字符串
data = {"name": "张三", "age": 25, "hobbies": ["编程", "阅读"]}
json_str = json.dumps(data, ensure_ascii=False, indent=2)
print(json_str)
# {
#   "name": "张三",
#   "age": 25,
#   "hobbies": ["编程", "阅读"]
# }

# JSON 字符串 → Python 对象
obj = json.loads(json_str)

# 写入 JSON 文件
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 读取 JSON 文件
with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 自定义编码器
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

person = Person("李四", 30)
json_str = json.dumps(person, default=lambda o: o.__dict__)
```

### 6.7 CSV 文件操作

```python
import csv

# 写入 CSV
with open("data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["姓名", "年龄", "城市"])      # 表头
    writer.writerow(["张三", 25, "北京"])
    writer.writerow(["李四", 30, "上海"])
    writer.writerows([                              # 批量写入
        ["王五", 28, "广州"],
        ["赵六", 35, "深圳"]
    ])

# 读取 CSV
with open("data.csv", "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)  # ['张三', '25', '北京']

# 使用字典方式
with open("data.csv", "w", newline="", encoding="utf-8") as f:
    fieldnames = ["姓名", "年龄", "城市"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerow({"姓名": "张三", "年龄": 25, "城市": "北京"})

with open("data.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["姓名"], row["年龄"])  # 通过字段名访问
```

### 6.8 文件编码处理

```python
# 自动检测编码
import chardet

with open("unknown.txt", "rb") as f:
    raw_data = f.read()
    result = chardet.detect(raw_data)
    print(result)       # {'encoding': 'UTF-8-SIG', 'confidence': 0.99}

    encoding = result["encoding"]
    text = raw_data.decode(encoding)

# 处理 BOM (Byte Order Mark)
with open("utf8_with_bom.txt", "r", encoding="utf-8-sig") as f:
    content = f.read()  # 自动去除 BOM

# 写入带 BOM 的文件
with open("utf8_with_bom.txt", "w", encoding="utf-8-sig") as f:
    f.write("内容")     # 自动添加 BOM
```

---

## 七、异常处理

异常是程序运行时发生的错误事件。Python 使用 `try-except` 语句来捕获和处理异常，防止程序因错误而崩溃。

**异常传播机制**：如果异常没有被当前代码块所捕获，那该异常就会沿着**调用链**，逐层传递给其调用者。

> **调用链**：就是函数之间的调用关系。当 A 函数调用 B 函数，B 函数调用 C 函数，这就形成了一条调用链 `A → B → C`。如果 C 中发生异常但没有处理，异常会回传到 B；如果 B 也没处理，继续回传到 A；如果所有调用者都没有处理，最终成为**未处理异常**，程序终止运行。

```python

def func_c():

return 1 / 0 # 异常发生点

def func_b():

return func_c() # 调用 c，异常回传到这里

def func_a():

return func_b() # 调用 b，异常继续回传

try:

func_a() # 调用 a，最终在这里捕获异常

except ZeroDivisionError:

print("捕获了除零错误") # 成功捕获！

# 调用链：func_a() → func_b() → func_c() → 1/0(异常)
# 异常传播：1/0 → func_c → func_b → func_a → try-except(捕获)
```

**异常处理的核心结构**：

```python
try:
    # 尝试执行可能出错的代码
    result = 10 / 0
except ZeroDivisionError as e:
    # 捕获特定异常并处理
    print(f"除零错误: {e}")
except Exception as e:
    # 捕获其他所有异常
    print(f"未知错误: {e}")
else:
    # 没有异常时执行（可选）
    print(f"结果: {result}")
finally:
    # 无论是否异常都会执行（常用于资源释放）
    print("清理资源...")
```

**主动抛出异常 - raise**：

```python
# 抛出内置异常
def divide(a, b):
    if b == 0:
        raise ZeroDivisionError("除数不能为零")
    return a / b

# 抛出自定义异常
class ValidationError(Exception):
    """自定义验证异常"""
    pass

def validate_age(age):
    if age < 0:
        raise ValidationError(f"年龄不能为负数: {age}")
    if age > 150:
        raise ValidationError(f"年龄不合理: {age}")
    return age
```

**异常链 - from**

```python
# 在捕获异常后抛出新的异常，保留原始异常信息
def read_config(path):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError as e:
        # 抛出新的异常，但保留原始异常信息
        raise ConfigError(f"配置文件不存在: {path}") from e
    except json.JSONDecodeError as e:
        raise ConfigError(f"配置文件格式错误: {path}") from e

# 使用 from None 可以隐藏原始异常
def parse_data(data):
    try:
        return int(data)
    except ValueError:
        raise ParseError("无法解析数据") from None
```

**自定义异常类**：

```python
# 继承 Exception 创建自定义异常
class BusinessError(Exception):
    """业务逻辑异常基类"""
    def __init__(self, message, code=None):
        super().__init__(message)
        self.code = code

class NotFoundError(BusinessError):
    """资源不存在"""
    def __init__(self, resource, resource_id):
        message = f"{resource} (id={resource_id}) 不存在"
        super().__init__(message, code=404)

class PermissionDeniedError(BusinessError):
    """权限不足"""
    def __init__(self, action):
        message = f"没有权限执行: {action}"
        super().__init__(message, code=403)

# 使用
def get_user(user_id):
    if not has_permission("view_user"):
        raise PermissionDeniedError("查看用户")
    user = db.query(User, id=user_id)
    if not user:
        raise NotFoundError("用户", user_id)
    return user
```

**常见内置异常**：

| 异常                  | 触发场景              |
| ------------------- | ----------------- |
| `SyntaxError`       | 语法错误              |
| `NameError`         | 使用了未定义的变量         |
| `TypeError`         | 类型错误（如字符串 + 数字）   |
| `ValueError`        | 值错误（如 int("abc")） |
| `KeyError`          | 字典中不存在该键          |
| `IndexError`        | 列表索引超出范围          |
| `AttributeError`    | 对象没有该属性           |
| `ZeroDivisionError` | 除以零               |
| `FileNotFoundError` | 文件不存在             |
| `ImportError`       | 导入模块失败            |
| `RuntimeError`      | 通用运行时错误           |

**断言 - assert**：

```python
# assert 用于调试时检查条件，条件为 False 时抛出 AssertionError
def factorial(n):
    assert n >= 0, "n 必须是非负整数"
    assert isinstance(n, int), "n 必须是整数"
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# 注意：assert 可以被 Python 的 -O 选项禁用，不要用于关键检查
```

---
## 八、模块与包

**模块（Module）** 是一个包含 Python 代码的 `.py` 文件。模块让你能够将代码逻辑分割成独立的单元，每个模块可以包含函数、类、变量等，实现**代码复用**和**命名空间隔离**。

**包（Package）** 是多个模块的集合，表现为包含 `__init__.py` 文件的目录。包允许你按层次组织模块，避免命名冲突。

**`__init__.py` - 包的初始化文件**

`__init__.py` 是包的核心文件，在**包被导入时自动执行**，主要作用：

1. **标识包**：让 Python 识别这是一个包（Python 3.3+ 允许没有，但不推荐）

2. **初始化逻辑**：执行包的初始化代码（如配置加载、资源初始化）

3. **简化导入**：在 `__init__.py` 中导入子模块，让外部使用更简洁

4. **控制公开接口**：通过 `__all__` 控制 `from package import *` 的行为

```python
# utils/__init__.py
"""工具包初始化"""

# 1. 包的初始化逻辑
print("utils 包被加载")

# 2. 批量导入子模块，简化外部使用
from .file_helper import read_file, write_file
from .string_helper import format_str, parse_json

# 3. 控制 from utils import * 的行为
__all__ = [
    'read_file', 'write_file',      # 从 file_helper 导入的
    'format_str', 'parse_json',     # 从 string_helper 导入的
    'Config',                        # 当前文件定义的
]

# 4. 可以在 __init__.py 中定义包级别的工具
class Config:
    """包配置类"""
    DEBUG = False

def setup():
    """包初始化函数"""
    print("utils 包初始化完成")
```

```python
# main.py - 外部使用
import utils          # 自动执行 utils/__init__.py
utils.read_file()     # 直接使用，无需 utils.file_helper.read_file()
utils.Config.DEBUG    # 访问包级别的类

# 或者
from utils import *   # 只导入 __all__ 中列出的内容
read_file()           # 直接使用
```

```
my_project/                 ← 项目目录
├── main.py                 ← 入口文件
├── utils/                  ← 包（目录 + __init__.py）
│   ├── __init__.py         ← 包初始化文件
│   ├── file_helper.py      ← 模块1
│   └── string_helper.py    ← 模块2 
└── config.py               ← 模块
```

### 8.1 导入模块

```python
# 导入方式
import os
import sys as system
from datetime import datetime, timedelta
from collections import *

# 查看模块
dir(os)       # 所有属性和方法
help(os.path) # 帮助文档
```

### 8.2 常用标准库模块

标准库模块就是随着 python 一起安装的模块，而一些标准库模块是用 c 实现的，这些可以被称为内置模块。

| 模块         | 功能        | 常用方法                                  |
| ---------- | --------- | ------------------------------------- |
| `os`       | 操作系统接口    | `os.getcwd()`, `os.listdir()`         |
| `sys`      | Python解释器 | `sys.version`, `sys.path`             |
| `datetime` | 日期时间      | `datetime.now()`, `timedelta(days=1)` |
| `json`     | JSON处理    | `json.dumps()`, `json.loads()`        |
| `re`       | 正则表达式     | `re.match()`, `re.findall()`          |
| `random`   | 随机数       | `random.randint()`, `random.choice()` |
| `copy`     | 拷贝对象用的    | `copy.copy()`，`copy.deepcopy()`       |
| `time`     | 操作时间的     | `time.time()`,  `time.strftime()`     |
| `math`     | 数学运算相关    |                                       |


### 8.3 `__all__` 和 `__name__` 属性

**`__all__`：控制 `from module import *` 导入的内容**

默认情况下，`from module import *` 会导入模块中所有不以 `_` 开头的名称。使用 `__all__` 可以精确控制哪些名称会被导出。

```python
# mymodule.py
__all__ = ['public_func', 'public_var']  # 白名单：只有这些会被导入

def public_func():
    return "公开的函数"

def _private_func():       # 以下划线开头，默认不会导入
    return "私有的函数"

def another_func():        # 没有下划线，但不在 __all__ 中
    return "另一个函数"

public_var = 42
_private_var = "私有变量"
```

```python
from mymodule import *

public_func()      # ✓ 可以访问
public_var         # ✓ 可以访问

# _private_func()  # × 不可访问
# another_func()   # × 不可访问（虽然没下划线，但不在 __all__）
```

**`__name__`：模块的身份标识**

```python
# 1. 当模块被直接运行时，__name__ == "__main__"
# 2. 当模块被导入时，__name__ == "模块名"

# mymodule.py
def hello():
    print(f"模块名: {__name__}")

# 这行代码只在直接运行此文件时执行
# 被导入时不执行
if __name__ == "__main__":
    hello()
    print("直接运行此模块")

# main.py（导入 mymodule）
import mymodule    # mymodule.__name__ == "mymodule"
```

---

## 九、生成器与迭代器

### 9.1 可迭代对象与迭代器

**可迭代对象（Iterable）**

能被 `for` 循环遍历的对象称为可迭代对象。可迭代对象实现了 `__iter__()` 方法，调用 `iter()` 函数时会自动触发该方法。

```python
# 常见的可迭代对象
list, tuple, str, dict, set, range, 文件对象

# 检查是否是可迭代对象
from collections.abc import Iterable
isinstance([1, 2, 3], Iterable)  # True
```

**迭代器（Iterator）**

迭代器是可迭代对象的"升级版"，它记住了遍历的位置。迭代器实现了两个方法：

- `__iter__()`：返回自身

- `__next__()`：返回下一个值，没有则抛出 `StopIteration`

迭代器是一次性的，状态只会向前推进，且不会自动重置！

```python
# 从可迭代对象获取迭代器
lst = [1, 2, 3]
it = iter(lst)      # 调用 __iter__() 得到迭代器

next(it)            # 1
next(it)            # 2
next(it)            # 3
next(it)            # StopIteration 异常
```

**迭代器的核心优势**：

| 优势       | 说明                                   | 典型场景         |
| -------- | ------------------------------------ | ------------ |
| **惰性计算** | 用时才生成数据，而非一次性全部创建                    | 处理大量数据时节省内存  |
| **无限序列** | 可以表示理论上无限的数据流                        | 斐波那契数列、实时数据流 |
| **统一接口** | 任何实现 `__iter__` 和 `__next__` 的对象都可迭代 | 自定义数据结构的遍历   |
| **状态保持** | 每次 `next()` 从上一次位置继续                 | 逐行读取大文件、分页查询 |

```python
# 对比：列表 vs 迭代器处理大数据

# 列表：一次性加载所有数据到内存
nums_list = [x**2 for x in range(10000000)]  # 占用 ~80MB 内存
for n in nums_list:
    if n > 1000:
        break  # 只用了前几个，但全部数据都已加载

# 迭代器：惰性生成，按需取用
nums_iter = (x**2 for x in range(10000000))  # 几乎不占内存
for n in nums_iter:
    if n > 1000:
        break  # 只计算了用到的元素
```

```python
# 无限序列：迭代器可以表示无限数据流
class InfiniteCounter:
    """无限计数器 - 用迭代器实现无限序列"""
    def __init__(self, start=0):
        self.n = start

    def __iter__(self):
        return self

    def __next__(self):
        current = self.n
        self.n += 1
        return current

# 使用：取多少由调用方决定，而非生成方
counter = InfiniteCounter()
for _ in range(10):
    print(next(counter))  # 取前10个，迭代器本身无限
```

``` python
class Fibo:  
    def __init__(self, total):  
        self.total = total  
        self.index = 0  
        self.pre = 1  
        self.cur = 1  
  
  
    def __iter__(self):  
        self.index = 0  
        self.pre = 1  
        self.cur = 1  
        return self  
  
    def __next__(self):  
        if self.index >= self.total:  
            raise StopIteration  
  
        if self.index < 2:  
            value = 1  
        else:  
            value = self.pre + self.cur  
            self.pre = self.cur  
            self.cur = value  
  
        self.index += 1  
        return value  
  
f1 = Fibo(10)  
for i in f1:  
    print(i)
```
### 9.2 生成器（Generator）

生成器是一种特殊的迭代器，使用 `yield` 关键字实现，可以**暂停和恢复执行**。相比普通迭代器，生成器代码更简洁，无需手动实现 `__iter__` 和 `__next__`。

---

**生成器函数**：

包含 `yield` 关键字的函数称为**生成器函数**。调用时不会立即执行，而是返回一个生成器对象。

**执行机制**：

| 步骤 | 行为 | 状态变化 |
|------|------|----------|
| **调用函数** | `gen = my_generator()` | 创建生成器对象，**函数体未执行** |
| **首次 `next()`** | 开始执行函数体 | 运行到第一个 `yield` 处 |
| **遇到 `yield`** | 暂停执行，保存上下文 | 记录暂停位置，返回 `yield` 后的值 |
| **后续 `next()`** | 从暂停处恢复执行 | 继续运行到下一个 `yield` |

```python
def my_generator(n):
    """生成器函数：包含 yield 关键字"""
    print(f"开始执行，n={n}")   # 第1次 next() 执行到这里
    for i in range(n):
        yield i * 2            # 暂停！保存位置，返回 i*2
        print(f"恢复执行，i={i}")  # 第2次 next() 从这里继续

# 1. 调用生成器函数 → 返回生成器对象（函数体未执行！）
gen = my_generator(3)
print(type(gen))              # <class 'generator'>

# 2. 第1次 next() → 开始执行，遇到 yield 暂停，返回 0
result = next(gen)            # 输出: 开始执行，n=3
print(result)                 # 0

# 3. 第2次 next() → 从 yield 后继续，打印后再次遇到 yield，返回 2
result = next(gen)            # 输出: 恢复执行，i=0
print(result)                 # 2

# 4. 第3次 next() → 从 yield 后继续，打印后再次遇到 yield，返回 4
result = next(gen)            # 输出: 恢复执行，i=1
print(result)                 # 4

# 5. 第4次 next() → 循环结束，抛出 StopIteration
result = next(gen)            # 输出: 恢复执行，i=2 → StopIteration
```

**核心要点**：
- `yield` 既是**暂停点**（保存执行位置），又是**返回值**（表达式结果作为 `next()` 的返回值）
- 每次 `next()` 调用是**单向**的：执行 → 遇 `yield` 暂停 → 返回；下次从暂停处继续
- 生成器对象同时实现了 `__iter__` 和 `__next__`，所以既是可迭代对象，也是迭代器

**生成器对象**：

生成器对象是一种特殊的迭代器，本质是 yield 关键字自动实现了迭代器协议

```python
def countdown(n):
    """倒计时生成器"""
    while n > 0:
        yield n           # 暂停并返回当前 n
        n -= 1            # 下次从这里继续

# 创建生成器对象（函数体未执行）
gen = countdown(3)

# 逐步迭代
next(gen)                 # 3  ← 第一次执行到 yield，返回 3
next(gen)                 # 2  ← 从 n-=1 后继续，再次 yield
next(gen)                 # 1
next(gen)                 # StopIteration（循环结束）

# 循环迭代
for res in gen:  
    print(res)
```

**生成器对象的方法**：

```python
gen = countdown(5)

# send() - 向生成器发送数据，唤醒时 yield 接收该值
def accumulator():
    total = 0
    while True:
        value = yield total   # 接收 send() 的值
        if value is None:
            break
        total += value

acc = accumulator()
next(acc)                 # 必须先发 None 启动（或 send(None)）
acc.send(10)              # total = 10, 返回 10
acc.send(20)              # total = 30, 返回 30
acc.send(30)              # total = 60, 返回 60

# throw() - 向生成器抛出异常
gen.throw(ValueError, "手动终止")

# close() - 关闭生成器，释放资源
gen.close()               # 生成器不再可用
```

**生成器表达式**（类比列表推导式）：

```python
# 列表推导式：一次性生成所有数据，占用内存
squares = [x**2 for x in range(1000000)]  # 占用大量内存

# 生成器表达式：惰性求值，节省内存
squares = (x**2 for x in range(1000000))  # 几乎不占内存

# 使用
sum(x**2 for x in range(10))              # 285
```

**生成器的优势**：

```python
# 1. 惰性计算：用时才生成，节省内存
def fib(n):  
    a, b = 0, 1  
    for _ in range(n):  
        yield b  
        a, b = b, a + b  

# 取前10个，无需存储全部
for x in fib(1000000):  # 内存友好
    print(x)

# 2. 支持无限序列
def infinite_counter(start=0):
    """无限计数器"""
    while True:
        yield start
        start += 1 

counter = infinite_counter()
next(counter)             # 0
next(counter)             # 1
# ... 永远可以继续
```

### 9.3 yield from - 委托子生成器

`yield from` 用于将一个生成器的输出委托给另一个生成器，简化嵌套结构。人话就是能把一个可迭代对象的每一个元素以次 yield 出去。

```python
def get_list():  
    nums = [i for i in range(10)]  
    # 简写  
    yield from nums  
    # 本质上  
    for i in nums:  
        yield i  
  
gen = get_list()  
for g in gen:  
    print(g)
```

### 9.4 send() - 生成器的双向通信

`send()` 方法允许调用者**向生成器发送数据**，实现双向通信。这是普通迭代器不具备的能力。

**执行机制**：

```python
# 调用流程
gen.send(value)  # 将 value 发送给生成器
                 # 生成器在 yield 处接收值，然后继续执行
```

```python
def accumulator():
    """累加器：接收外部传入的值并累加"""
    total = 0
    while True:
        # yield 在这里有两个作用：
        # 1. 暂停并返回 total（作为 send 的返回值）
        # 2. 接收 send() 发送的值，赋值给 received
        received = yield total
        if received is None:
            break
        total += received

# 使用步骤
acc = accumulator()

# 第1步：必须先调用 next() 或 send(None) 启动生成器
# 此时执行到 yield total，返回 0，暂停
next(acc)              # 返回 0，received 暂时未赋值

# 第2步：send(10) 唤醒生成器，10 赋值给 received，继续执行到下一个 yield
acc.send(10)           # received = 10, total = 10, 返回 10

# 第3步：继续发送值
acc.send(20)           # received = 20, total = 30, 返回 30
acc.send(30)           # received = 30, total = 60, 返回 60

# 第4步：发送 None 结束生成器
acc.send(None)         # 触发 break，生成器结束，抛出 StopIteration
```

**执行流程图解**：

```
                    调用者                          生成器
                      │                              │
    next(acc) ────────┼────────────────────────────→│
                      │                              ↓
                      │                        执行到 yield total
                      │                        返回 0，暂停
                      │←─────────────────────────────┤
                      │                              │
    acc.send(10) ────→│                              │
                      │                         10 赋值给 received
                      │                              ↓
                      │                        total += 10
                      │                        执行到 yield total
                      │                        返回 10，暂停
                      │←─────────────────────────────┤
                      │                              │
    acc.send(20) ────→│                         20 赋值给 received
                      │                              ↓
                      │                        ...继续...
```

**重要规则**：

```python
# ❌ 错误：第一次不能直接 send 非 None 值
acc = accumulator()
acc.send(10)           # TypeError: can't send non-None value to a just-started generator

# ✅ 正确：必须先 send(None) 或 next()
acc = accumulator()
acc.send(None)         # OK，启动生成器
acc.send(10)           # OK，现在可以发送值了
```
### 9.5 自定义迭代器

**示例一**：可迭代对象和迭代器分开写

```python
"""  
手写迭代器示例  
  
迭代器模式涉及两个核心概念：  
1. 可迭代对象(Iterable): 实现 __iter__() 方法，返回一个迭代器  
2. 迭代器(Iterator): 实现 __iter__() 和 __next__() 方法  
  
for 循环的工作原理：  
    for item in iterable:        等价于：  
        iter_obj = iter(iterable)  # 调用 __iter__()        while True:            try:                item = next(iter_obj)  # 调用 __next__()            except StopIteration:                break"""  
  
class Person:  
    """  
    可迭代对象(Iterable)  
  
    只需要实现 __iter__() 方法，返回一个迭代器对象  
    这样 Person 的实例就可以被 for 循环遍历  
    """  
    def __init__(self, name, age, gender):  
        """初始化 Person 对象，存储三个属性"""  
        self.name = name  
        self.age = age  
        self.gender = gender  
  
    def __iter__(self):  
        """  
        返回一个迭代器对象  
  
        当执行 for x in person 时，Python 会自动调用此方法  
        返回的迭代器负责实际的遍历逻辑  
        """        return PersonIterator(self)  
  
  
class PersonIterator:  
    """  
    迭代器(Iterator)  
  
    迭代器需要实现两个方法：  
    - __iter__(): 返回迭代器自身  
    - __next__(): 返回下一个元素，没有更多元素时抛出 StopIteration    """  
    def __init__(self, p):  
        """  
        初始化迭代器  
  
        Args:            p: 要遍历的 Person 对象  
        """        self.p = p                      # 保存对 Person 对象的引用  
        self.idx = 0                     # 当前遍历的索引位置  
        self.attrs = [p.name, p.age, p.gender]  # 要遍历的属性列表  
  
    def __iter__(self):  
        """  
        返回迭代器自身  
  
        这让迭代器本身也是可迭代的，可以在任何需要可迭代对象的地方使用        例如：iter(iterator) 返回 iterator 本身  
        """        return self  
  
    def __next__(self):  
        
        # 检查是否还有元素可遍历  
        if self.idx >= len(self.attrs):  
            # 遍历结束，抛出 StopIteration 告诉 for 循环停止  
            raise StopIteration  
  
        # 获取当前元素  
        temp = self.attrs[self.idx]  
        # 移动索引到下一个位置  
        self.idx += 1  
        # 返回当前元素  
        return temp
```

**示例二**：合并写法（类同时实现 `__iter__` 和 `__next__`）

将可迭代对象和迭代器合二为一，代码更精简。但需要注意：**每次迭代前要重置索引**，否则只能遍历一次。

```python
class Person:
    """既是可迭代对象，又是迭代器"""

    def __init__(self, name, age, gender):
        self.name = name
        self.age = age
        self.gender = gender
        self._index = 0

    def __iter__(self):
        # ⚠️ 关键：重置索引，支持多次迭代
        self._index = 0
        return self

    def __next__(self):
        attrs = [self.name, self.age, self.gender]
        if self._index >= len(attrs):
            raise StopIteration
        value = attrs[self._index]
        self._index += 1
        return value


# 测试：可以多次迭代
p = Person('张三', 25, '男')

for item in p:
    print(item)  # 张三, 25, 男

for item in p:
    print(item)  # 张三, 25, 男（如果没有重置，这里不会执行）
```

**示例三** ：用生成器实现遍历自定义类
``` python
class Person:  
    def __init__(self, name, age, gender):  
        self.name = name  
        self.age = age  
        self.gender = gender  
  
    # 这里返回的是一个生成器,所以在通过 for 遍历的时候，就可以拿到这个生成器，然后就是调用生成器的 next() 方法！  
    def __iter__(self):  
        yield from [self.name, self.age, self.gender]  
  
  
p = Person('xx', 11, 1)  
for k in p:  
    print(k)
```

---

## 十、上下文管理器

**上下文管理器**（Context Manager）是一种用于管理资源的对象，它定义了在进入和退出某段代码块时需要执行的设置和清理操作。最典型的应用是**文件操作**，确保文件在使用后正确关闭，无论是否发生异常。

**核心作用**：

- 资源获取与释放（文件、锁、数据库连接等）
- 异常处理封装
- 代码结构清晰（将设置和清理逻辑集中管理）

### 10.1 with 语句基础

`with` 语句是上下文管理器的语法糖，它保证了资源的正确初始化和清理。

```python
# 传统方式：需要手动关闭，容易忘记或异常时遗漏
f = open("data.txt", "r")
try:
    data = f.read()
finally:
    f.close()           # 确保关闭，但代码冗长

# with 语句：自动管理资源
with open("data.txt", "r") as f:
    data = f.read()
# 离开 with 块，自动调用 f.close()，即使发生异常也会执行
```

**执行流程**：

```
进入 with 语句
    ↓
调用 __enter__() 方法，返回值赋给 as 后的变量
    ↓
执行 with 代码块内的逻辑
    ↓
无论是否发生异常，调用 __exit__() 方法进行清理
```

### 10.2 自定义上下文管理器

通过实现 `__enter__` 和 `__exit__` 两个魔法方法，可以创建自定义的上下文管理器。

`__exit__` 返回真，代表异常已经处理，返回 false，则如果又异常，会成为一个未处理异常，从而验证调用链去传递。

```python
class DatabaseConnection:
    """数据库连接上下文管理器"""

    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.conn = None

    def __enter__(self):
        """进入上下文时执行，返回值赋给 as 变量"""
        print(f"[ENTER] 连接数据库 {self.host}:{self.port}")
        self.conn = f"Connection({self.host}:{self.port})"
        return self.conn    # 返回连接对象

    def __exit__(self, exc_type, exc_val, exc_tb):
        """退出上下文时执行，负责清理资源

        参数说明：
            exc_type: 异常类型（没有异常时为 None）
            exc_val:  异常对象（没有异常时为 None）
            exc_tb:   异常 traceback（没有异常时为 None）

        返回值：True 表示异常已处理，不再向外传播；False 表示继续抛出异常
        """
        print(f"[EXIT] 关闭数据库连接")
        self.conn = None

        if exc_type is not None:
            print(f"[EXIT] 发生异常: {exc_type.__name__}: {exc_val}")
            # return True  # 如果返回 True，异常被吞掉

        return False        # 返回 False，异常继续传播

# 使用
with DatabaseConnection("localhost", 3306) as conn:
    print(f"执行查询: {conn}")
# 输出:
# [ENTER] 连接数据库 localhost:3306
# 执行查询: Connection(localhost:3306)
# [EXIT] 关闭数据库连接
```

### 10.3 contextlib 模块

`contextlib` 提供了更简洁的方式创建上下文管理器，无需定义类。

**@contextmanager 装饰器**：

```python
from contextlib import contextmanager

@contextmanager
def managed_resource(name):
    """使用生成器实现上下文管理器"""
    # __enter__ 部分：设置资源
    print(f"[SETUP] 初始化资源: {name}")
    resource = f"Resource({name})"

    try:
        yield resource      # yield 返回值赋给 as 变量
    finally:
        # __exit__ 部分：清理资源
        print(f"[CLEANUP] 释放资源: {name}")

# 使用
with managed_resource("database") as res:
    print(f"使用资源: {res}")
# 输出:
# [SETUP] 初始化资源: database
# 使用资源: Resource(database)
# [CLEANUP] 释放资源: database
```

**异常处理**：

```python
@contextmanager
def safe_operation(name):
    print(f"[START] {name}")
    try:
        yield name
    except Exception as e:
        print(f"[ERROR] 捕获异常: {e}")
        # 可以选择处理或重新抛出
        raise   # 重新抛出
    finally:
        print(f"[END] {name}")

# 使用
with safe_operation("危险操作") as op:
    print(f"执行 {op}")
    # raise ValueError("出错了!")  # 异常会被捕获
```

**ExitStack - 管理多个上下文**：

```python
from contextlib import ExitStack

# 同时管理多个资源
with ExitStack() as stack:
    file1 = stack.enter_context(open("file1.txt"))
    file2 = stack.enter_context(open("file2.txt"))
    conn = stack.enter_context(DatabaseConnection("host", 3306))

    # 使用所有资源...
    data = file1.read()
# 所有资源按进入顺序的逆序自动关闭
```

### 10.4 async 异步上下文管理器

Python 3.5+ 支持异步上下文管理器，使用 `async with`。

```python
class AsyncDatabase:
    """异步上下文管理器"""

    async def __aenter__(self):
        print("[ASYNC] 异步连接数据库")
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("[ASYNC] 异步关闭连接")
        return False

# 使用
async def main():
    async with AsyncDatabase() as db:
        print("执行异步查询")

# asyncio.run(main())
```

**@asynccontextmanager**：

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def async_timer(label):
    import asyncio
    start = asyncio.get_event_loop().time()
    try:
        yield
    finally:
        elapsed = asyncio.get_event_loop().time() - start
        print(f"[{label}] 耗时: {elapsed:.4f}s")

# 使用
async with async_timer("异步操作"):
    await asyncio.sleep(1)
```

## 十一、多进程|线程开发

Python 提供了多种并发编程方式：**多线程**、**多进程**和**异步编程**。理解它们的区别和适用场景是编写高效并发程序的关键。

### 11.1 核心概念对比

| 特性 | 多线程 (`threading`) | 多进程 (`multiprocessing`) | 异步 (`asyncio`) |
|------|---------------------|---------------------------|-----------------|
| **执行方式** | 同一进程内多线程 | 多个独立进程 | 单线程事件循环 |
| **GIL 影响** | 受 GIL 限制 | 不受 GIL 限制 | 不受 GIL 限制 |
| **适用场景** | I/O 密集型（网络、文件） | CPU 密集型（计算） | I/O 密集型，高并发 |
| **内存占用** | 低（共享内存） | 高（独立内存） | 低（单线程） |
| **切换开销** | 低 | 高 | 极低（协程切换） |
| **数据共享** | 共享内存（需同步） | 需显式通信（Queue/Pipe） | 单线程安全 |

### 11.2 GIL（全局解释器锁）

**GIL**（Global Interpreter Lock）是 CPython 解释器的机制，确保同一时刻一个进程下面只有一个线程执行 Python 字节码。如果没有全局解释器锁，就会出现内存泄漏的问题！ 

```python
"""
GIL 的影响：
- 多线程无法并行执行 CPU 密集型任务
- I/O 操作会释放 GIL，所以多线程适合 I/O 密集型
- 多进程可以绕过 GIL，实现真正的并行计算
"""

import threading
import multiprocessing
import time

def cpu_task(n):
    """CPU 密集型任务"""
    count = 0
    for i in range(n):
        count += i * i
    return count

def io_task(n):
    """I/O 密集型任务"""
    time.sleep(n)   # 模拟 I/O 等待

# 测试：多线程 vs 多进程 执行 CPU 密集型任务
if __name__ == "__main__":
    N = 10_000_000

    # 单线程
    start = time.time()
    cpu_task(N)
    cpu_task(N)
    print(f"单线程: {time.time() - start:.2f}s")

    # 多线程（受 GIL 限制，不会更快）
    start = time.time()
    t1 = threading.Thread(target=cpu_task, args=(N,))
    t2 = threading.Thread(target=cpu_task, args=(N,))
    t1.start(); t2.start()
    t1.join(); t2.join()
    print(f"多线程: {time.time() - start:.2f}s")  # 可能比单线程还慢！

    # 多进程（真正并行，利用多核）
    start = time.time()
    p1 = multiprocessing.Process(target=cpu_task, args=(N,))
    p2 = multiprocessing.Process(target=cpu_task, args=(N,))
    p1.start(); p2.start()
    p1.join(); p2.join()
    print(f"多进程: {time.time() - start:.2f}s")  # 明显更快
```

### 11.3 多线程（threading）

适合 **I/O 密集型** 任务：网络请求、文件读写、数据库操作等。

#### 创建线程

Python 提供两种方式创建线程：**函数方式**（简单场景）和**继承方式**（复杂场景）。

**方式一：函数方式（推荐简单场景）**

```python
import threading
import time

def worker(name, count):
    """线程要执行的函数"""
    for i in range(count):
        print(f"线程 {name}: 第 {i+1} 次执行")
        time.sleep(0.5)

# 创建线程
# target: 目标函数
# args: 位置参数（元组）
# kwargs: 关键字参数（字典）
# name: 线程名称（可选）
# daemon: 是否守护线程（可选）
t1 = threading.Thread(target=worker, args=("Worker-1", 3), name="T1")
t2 = threading.Thread(target=worker, args=("Worker-2", 3), name="T2")

# 启动线程
# start() 会在新线程中调用 target 函数
t1.start()
t2.start()

# 等待线程结束
# join(timeout=None): 阻塞当前线程，直到目标线程完成或超时
# 如果不 join，主线程可能先结束，子线程会被强制终止
t1.join()  # 等待 t1 完成
t2.join()  # 等待 t2 完成

print("所有线程执行完毕")
```

**方式二：继承 Thread 类（适合复杂逻辑）**

```python
import threading

class DownloadThread(threading.Thread):
    """自定义线程类：实现文件下载"""

    def __init__(self, url, filename):
        # 必须调用父类构造
        super().__init__()  # 或 threading.Thread.__init__(self)
        self.url = url
        self.filename = filename
        self.result = None  # 用于存储返回值

    def run(self):
        """
        重写 run 方法：线程启动后执行的内容
        start() 方法会内部调用 run()
        """
        print(f"[{self.name}] 开始下载: {self.url}")
        # 模拟下载...
        import time
        time.sleep(1)
        self.result = f"{self.filename} 下载完成"
        print(f"[{self.name}] 下载结束")

# 使用自定义线程
dl = DownloadThread("https://example.com/file.zip", "file.zip")
dl.start()
dl.join()
print(dl.result)  # 获取执行结果
```

#### 线程生命周期与管理

```python
import threading
import time

def task():
    time.sleep(2)

t = threading.Thread(target=task, name="MyThread")

# 线程状态查询
print(t.is_alive())   # False，尚未启动
print(t.name)         # MyThread
print(t.ident)        # None，尚未分配线程ID

# 启动后状态变化
t.start()
print(t.is_alive())   # True，正在运行
print(t.ident)        # 140735... 系统分配的线程ID

# 设置/修改线程名
t.name = "NewName"

# 等待完成
t.join()
print(t.is_alive())   # False，已结束
```

#### 获取当前线程信息

```python
import threading

def show_info():
    """获取当前线程的相关信息"""
    current = threading.current_thread()
    print(f"当前线程名: {current.name}")
    print(f"线程ID: {current.ident}")
    print(f"是否守护: {current.daemon}")

# 主线程信息
print(f"主线程: {threading.current_thread().name}")
print(f"活跃线程数: {threading.active_count()}")
print(f"所有线程列表: {threading.enumerate()}")
```

#### 多线程执行流程示例

```python
import threading
import time

def fetch_url(url):
    """模拟网络请求"""
    print(f"[{threading.current_thread().name}] 开始请求: {url}")
    time.sleep(1)  # 模拟 I/O 等待
    print(f"[{threading.current_thread().name}] 请求完成: {url}")
    return f"Data of {url}"

# 单线程顺序执行（慢）
urls = ["url1", "url2", "url3"]
start = time.time()
for url in urls:
    fetch_url(url)
print(f"单线程耗时: {time.time() - start:.2f}s\n")

# 多线程并发执行（快）
threads = []
start = time.time()
for url in urls:
    t = threading.Thread(target=fetch_url, args=(url,))
    threads.append(t)
    t.start()  # 立即启动，不等待

# 所有线程启动后，再统一等待
for t in threads:
    t.join()  # 等待每个线程完成
print(f"多线程耗时: {time.time() - start:.2f}s")
```

#### 线程池（生产环境推荐）

手动创建线程在简单场景够用，但生产环境推荐使用 **线程池**：

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def fetch_url(url):
    time.sleep(1)
    return f"Result of {url}"

urls = ["url1", "url2", "url3", "url4", "url5"]

# 使用线程池
with ThreadPoolExecutor(max_workers=3) as executor:  # 最多3个线程同时运行
    # 方式1: submit 提交单个任务（返回 Future）
    future = executor.submit(fetch_url, "url0")
    result = future.result()  # 阻塞等待结果
    print(result)

    # 方式2: 批量提交，用 as_completed 谁完成先处理谁
    futures = {executor.submit(fetch_url, url): url for url in urls}
    for future in as_completed(futures):
        url = futures[future]
        try:
            print(f"{url}: {future.result()}")
        except Exception as e:
            print(f"{url} 出错: {e}")

    # 方式3: map 批量提交（保持输入顺序返回结果）
    results = executor.map(fetch_url, urls)
    for url, result in zip(urls, results):
        print(f"{url}: {result}")
```

#### 线程同步机制

```python
import threading

# 共享数据
counter = 0
lock = threading.Lock()     # 互斥锁
# rlock = threading.RLock() # 可重入锁（递归锁）
# sem = threading.Semaphore(3)  # 信号量，限制并发数
# event = threading.Event()     # 事件，用于线程间通信
# cond = threading.Condition()  # 条件变量

def increment():
    global counter
    for _ in range(100000):
        # 加锁保护临界区
        with lock:
            counter += 1

# 测试
threads = [threading.Thread(target=increment) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()
print(f"Counter: {counter}")  # 1000000
```

#### 死锁演示

``` python
# 死锁示例与避免
lock_a = threading.Lock()
lock_b = threading.Lock()

def thread_a():
    with lock_a:
        with lock_b:  # 可能导致死锁
            print("Thread A")

def thread_b():
    with lock_b:
        with lock_a:  # 可能导致死锁
            print("Thread B")

# 解决：使用 RLock 或统一的加锁顺序
# 或使用 threading.local() 避免共享状态
```
### 11.4 多进程（multiprocessing）

适合 **CPU 密集型** 任务：计算、图像处理、数据分析等。多进程可以绕过 GIL，实现真正的并行计算。
#### 创建进程

与线程类似，进程也有**函数方式**和**继承方式**两种创建方法。

**方式一：函数方式（推荐）**

```python
import multiprocessing
import os
import time

def cpu_worker(n):
    """CPU 密集型任务"""
    pid = os.getpid()  # 获取当前进程ID
    result = sum(i * i for i in range(n))
    print(f"进程 {pid} 计算完成: {result}")
    return result

# 必须在 if __name__ == "__main__": 中创建进程
# 原因：Windows/macOS 需要重新导入主模块来启动子进程
if __name__ == "__main__":
    # 创建进程
    # target: 目标函数
    # args: 位置参数（元组）
    # name: 进程名称
    p1 = multiprocessing.Process(target=cpu_worker, args=(1000000,), name="Worker-1")
    p2 = multiprocessing.Process(target=cpu_worker, args=(2000000,), name="Worker-2")

    # 启动进程
    p1.start()
    p2.start()

    # 等待进程完成
    p1.join()
    p2.join()

    print("所有进程执行完毕")
```

**方式二：继承 Process 类**

```python
import multiprocessing
import os

class DataProcessor(multiprocessing.Process):
    """自定义进程类"""

    def __init__(self, data, name=None):
        super().__init__(name=name)
        self.data = data
        self.result = None

    def run(self):
        """进程执行的内容"""
        print(f"[{self.name}] PID={os.getpid()} 开始处理数据")
        # 模拟处理...
        import time
        time.sleep(1)
        self.result = sum(self.data)
        print(f"[{self.name}] 处理完成: {self.result}")

if __name__ == "__main__":
    processor = DataProcessor([1, 2, 3, 4, 5], name="Processor-1")
    processor.start()
    processor.join()
    print(f"结果: {processor.result}")  # 注意：无法直接获取，需要通过 Queue
```

#### 进程生命周期与管理

```python
import multiprocessing
import os
import time

def task():
    time.sleep(2)
    print(f"子进程 {os.getpid()} 结束")

if __name__ == "__main__":
    p = multiprocessing.Process(target=task, name="MyProcess")

    # 进程状态
    print(f"进程名称: {p.name}")
    print(f"是否存活: {p.is_alive()}")  # False，尚未启动
    print(f"PID: {p.pid}")              # None

    # 启动
    p.start()
    print(f"启动后 PID: {p.pid}")       # 分配进程ID
    print(f"是否存活: {p.is_alive()}")  # True

    # 设置为守护进程（主进程结束时子进程也结束）
    # p.daemon = True  # 必须在 start() 前设置

    # 等待完成（可设置超时）
    p.join(timeout=5)  # 最多等待5秒

    if p.is_alive():
        print("进程仍在运行，强制终止")
        p.terminate()   # 强制终止
        p.join()

    print(f"退出码: {p.exitcode}")  # 0 表示正常退出，负数为信号终止
```

#### 获取进程信息

```python
import multiprocessing
import os

def show_info():
    """显示当前进程信息"""
    print(f"当前进程 PID: {os.getpid()}")
    print(f"父进程 PID: {os.getppid()}")
    print(f"进程名称: {multiprocessing.current_process().name}")

if __name__ == "__main__":
    print("=== 主进程 ===")
    show_info()

    print("\n=== 子进程 ===")
    p = multiprocessing.Process(target=show_info, name="ChildProcess")
    p.start()
    p.join()

    # 查看所有子进程
    print(f"\n子进程列表: {multiprocessing.active_children()}")
    print(f"CPU 核心数: {multiprocessing.cpu_count()}")
```

#### 进程间通信

由于进程有独立的内存空间，不能直接共享数据，必须通过特定机制通信。

**Queue（队列）- 先进先出**

```python
from multiprocessing import Process, Queue
import os

def producer(q, items):
    """生产者：向队列放数据"""
    for item in items:
        q.put(item)
        print(f"[生产者 PID={os.getpid()}] 放入: {item}")
 
def consumer(q, count):
    """消费者：从队列取数据"""
    for _ in range(  ):
        item = q.get()  # 阻塞等待
        print(f"[消费者 PID={os.getpid()}] 取出: {item}")

if __name__ == "__main__":
    # 创建队列
    q = Queue(maxsize=10)  # 可选：设置最大容量

    items = ["A", "B", "C", "D", "E"]

    p1 = Process(target=producer, args=(q, items))
    p2 = Process(target=consumer, args=(q, len(items)))

    p1.start()
    p2.start()
    p1.join()
    p2.join()

    print("处理完成")
```

**Pipe（管道）- 双向通信**

```python
from multiprocessing import Process, Pipe

def worker(conn):
    """子进程：通过管道通信"""
    # 接收数据
    msg = conn.recv()
    print(f"子进程收到: {msg}")

    # 发送响应
    conn.send(f"收到你的消息: {msg}")
    conn.close()

if __name__ == "__main__":
    # 创建管道，返回两个连接对象
    parent_conn, child_conn = Pipe()

    p = Process(target=worker, args=(child_conn,))
    p.start()

    # 父进程发送
    parent_conn.send("Hello Process")

    # 接收响应
    response = parent_conn.recv()
    print(f"父进程收到: {response}")

    p.join()
```

**共享内存 - Value 和 Array**

```python
from multiprocessing import Process, Value, Array, Lock
import os

def increment(counter, lock):
    """对共享计数器递增"""
    for _ in range(1000):
        with lock:  # 必须加锁保护
            counter.value += 1

def modify_array(arr):
    """修改共享数组"""
    for i in range(len(arr)):
        arr[i] = os.getpid()

if __name__ == "__main__":
    # 共享变量（类型码: 'i'=int, 'd'=double, 'f'=float, 'c'=char）
    counter = Value('i', 0)      # 共享整数
    lock = Lock()

    # 共享数组（类型码 + 初始值/长度）
    shared_arr = Array('i', [0, 0, 0, 0, 0])  # 5个整数的共享数组

    # 启动多个进程修改共享数据
    processes = [
        Process(target=increment, args=(counter, lock))
        for _ in range(10)
    ]

    for p in processes:
        p.start()
    for p in processes:
        p.join()

    print(f"最终计数: {counter.value}")  # 10000
    print(f"共享数组: {list(shared_arr)}")
```

#### 进程池（推荐）

手动管理进程比较繁琐，推荐使用 **Pool** 或 **ProcessPoolExecutor**。

```python
from multiprocessing import Pool
import os

def square(n):
    """计算平方"""
    print(f"PID={os.getpid()} 处理 {n}")
    return n ** 2

if __name__ == "__main__":
    numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    # 创建进程池（默认进程数 = CPU 核心数）
    with Pool(processes=4) as pool:
        # 方式1: map（阻塞，保持顺序）
        results = pool.map(square, numbers)
        print(f"map 结果: {results}")

        # 方式2: map_async（非阻塞）
        async_result = pool.map_async(square, numbers)
        results = async_result.get()  # 等待并获取结果
        print(f"map_async 结果: {results}")

        # 方式3: apply_async（单个任务）
        result = pool.apply_async(square, args=(100,))
        print(f"单个结果: {result.get()}")

        # 方式4: imap（迭代器，可边处理边获取）
        for result in pool.imap(square, numbers):
            print(f"得到: {result}")

    print("所有任务完成")
```

### 11.5 concurrent.futures 统一接口

`concurrent.futures` 提供了高层次的统一接口，用**线程池** (`ThreadPoolExecutor`) 和 **进程池** (`ProcessPoolExecutor`) 简化并发编程。

| 类 | 适用场景 | 底层实现 |
|----|---------|---------|
| `ThreadPoolExecutor` | I/O 密集型任务 | `threading` |
| `ProcessPoolExecutor` | CPU 密集型任务 | `multiprocessing` |

**核心优势**：

- 统一的 API 接口，线程/进程切换只需改类名

- 自动管理线程/进程池的生命周期

- 通过 `Future` 对象获取异步执行结果

#### 基础用法对比

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import time
import threading
import os

def io_task(n):
    """I/O 密集型任务"""
    time.sleep(1)  # 模拟 I/O
    return f"线程 {threading.current_thread().name} 完成任务 {n}"

def cpu_task(n):
    """CPU 密集型任务"""
    total = sum(i * i for i in range(n))
    return f"进程 {os.getpid()} 计算结果: {total}"

# 线程池 - I/O 密集型
print("=== 线程池 ===")
with ThreadPoolExecutor(max_workers=3) as executor:
    result = executor.submit(io_task, 1)
    print(result.result())

# 进程池 - CPU 密集型（Windows 需要 if __name__ == "__main__"）
if __name__ == "__main__":
    print("=== 进程池 ===")
    with ProcessPoolExecutor(max_workers=3) as executor:
        result = executor.submit(cpu_task, 100000)
        print(result.result())
```

#### 三种提交任务方式

| 方式 | 方法 | 特点 | 适用场景 |
|------|------|------|---------|
| **单任务** | `submit(fn, *args)` | 返回 Future，可单独控制 | 需要跟踪单个任务 |
| **批量-保序** | `map(fn, iterable)` | 按输入顺序返回结果 | 需要结果与输入一一对应 |
| **批量-抢先** | `as_completed(futures)` | 谁完成谁先处理 | 需要快速响应完成的任务 |

**方式一：submit - 提交单个任务**

```python
from concurrent.futures import ThreadPoolExecutor

def task(n):
    return n * n

with ThreadPoolExecutor(max_workers=3) as executor:
    # submit 返回 Future 对象
    future = executor.submit(task, 5)

    # Future 不是结果，是结果的"凭证"
    print(future)  # <Future at ... state=running>

    # result() 阻塞等待结果
    result = future.result()
    print(result)  # 25

    # 批量提交，保存 Future 列表
    futures = [executor.submit(task, i) for i in range(10)]
    results = [f.result() for f in futures]
    print(results)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

**方式二：map - 批量提交（保持顺序）**：map 本身是不阻塞的，它返回的是一个生成器，遍历这个生成器是阻塞的。 

```python
from concurrent.futures import ThreadPoolExecutor
import time

def process(item):
    time.sleep(0.1)  # 模拟处理
    return item ** 2

items = [1, 2, 3, 4, 5]

with ThreadPoolExecutor(max_workers=3) as executor:
    # map 返回迭代器，按输入顺序产出结果
    # 注意：map 会等待所有任务完成，整体是阻塞的
    results = executor.map(process, items)

    # 遍历时按 items 的顺序返回
    for item, result in zip(items, results):
        print(f"{item} -> {result}")
    # 输出: 1 -> 1, 2 -> 4, 3 -> 9 ...（严格按顺序）

    # 带超时的 map
    results = executor.map(process, items, timeout=5)
```

**方式三：as_completed - 谁先完成谁先处理**

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def fetch_data(url):
    """模拟网络请求，不同 URL 耗时不同"""
    delays = {"url1": 0.3, "url2": 0.1, "url3": 0.2}
    time.sleep(delays.get(url, 0.1))
    return f"{url} 的数据"

urls = ["url1", "url2", "url3"]

with ThreadPoolExecutor(max_workers=3) as executor:
    # 提交所有任务，建立 url -> Future 的映射
    future_to_url = {executor.submit(fetch_data, url): url for url in urls}

    # as_completed 按完成顺序产出 Future
    for future in as_completed(future_to_url):
        url = future_to_url[future]  # 获取对应的 url
        try:
            data = future.result()
            print(f"✓ {url} 先完成: {data}")
        except Exception as e:
            print(f"✗ {url} 出错: {e}")

    # 输出顺序：url2, url3, url1（按完成时间）
```

#### Future 对象详解

`Future` 代表**尚未完成的异步执行结果**，类似 JavaScript 的 Promise。

```python
from concurrent.futures import ThreadPoolExecutor
import time

def task(n):
    time.sleep(1)
    return n * 2

with ThreadPoolExecutor() as executor:
    future = executor.submit(task, 5)

    # 状态查询（非阻塞）
    print(future.done())      # False，尚未完成
    print(future.running())   # True，正在运行
    print(future.cancelled()) # False，未被取消

    # 尝试取消（仅对未开始的任务有效）
    # future.cancel()  # 返回 True/False

    # 获取结果（阻塞）
    result = future.result()           # 等待直到完成，返回结果
    result = future.result(timeout=5)  # 最多等待5秒，超时抛 TimeoutError

    # 获取异常
    exception = future.exception()     # 无异常返回 None，有异常返回异常对象

    # 添加回调（任务完成后自动调用）
    def on_complete(fut):
        print(f"任务完成！结果: {fut.result()}")

    future = executor.submit(task, 10)
    future.add_done_callback(on_complete)

    time.sleep(2)  # 等待回调执行
```

#### 高级用法

**带上下文管理器的优雅写法**：

```python
from concurrent.futures import ThreadPoolExecutor
import time

def worker(item):
    time.sleep(0.1)
    return item ** 2

# with 语句自动关闭 executor
def process_items(items):
    with ThreadPoolExecutor(max_workers=5) as executor:
        # 使用 map 批量处理
        results = list(executor.map(worker, items))
        return results

results = process_items(range(100))
```

**异常处理**：

```python
from concurrent.futures import ThreadPoolExecutor

def risky_task(n):
    if n == 5:
        raise ValueError(f"出错了: {n}")
    return n * n

with ThreadPoolExecutor(max_workers=3) as executor:
    futures = [executor.submit(risky_task, i) for i in range(10)]

    for i, future in enumerate(futures):
        try:
            result = future.result()
            print(f"任务 {i}: {result}")
        except Exception as e:
            print(f"任务 {i} 异常: {e}")

    # map 方式的异常处理
    try:
        for i, result in enumerate(executor.map(risky_task, range(10))):
            print(f"任务 {i}: {result}")
    except Exception as e:
        print(f"捕获异常: {e}")  # 遇到第一个异常就会停止
```

**回调函数与链式处理**：

```python
from concurrent.futures import ThreadPoolExecutor

def fetch(url):
    return f"数据-{url}"

def process(data):
    return data.upper()

def save(result):
    print(f"保存: {result}")
    return "保存成功"

with ThreadPoolExecutor() as executor:
    # 链式处理：fetch -> process -> save
    future = executor.submit(fetch, "example.com")

    def process_callback(fut):
        data = fut.result()
        return executor.submit(process, data)

    def save_callback(fut):
        result = fut.result()
        return executor.submit(save, result)

    future.add_done_callback(process_callback)

    # 实际应用中建议使用 asyncio 或第三方库如 aio-libs
```

### 11.6 异步编程（asyncio）

适合 **高并发 I/O**，使用单线程事件循环处理大量连接。

```python
import asyncio

# 基础协程
async def say_hello():
    print("Hello")
    await asyncio.sleep(1)  # 非阻塞等待
    print("World")

# 运行协程
asyncio.run(say_hello())

# 并发执行多个协程
async def main():
    await asyncio.gather(
        say_hello(),
        say_hello(),
        say_hello()
    )

asyncio.run(main())

# 创建任务
async def task_example():
    task1 = asyncio.create_task(say_hello())
    task2 = asyncio.create_task(say_hello())

    # 等待所有完成
    await task1
    await task2

    # 或者
    await asyncio.gather(task1, task2)

# 实际应用：并发 HTTP 请求
import aiohttp

async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main():
    urls = ["https://python.org", "https://github.com"]
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

# asyncio.run(main())
```

### 11.7 选择指南

```python
"""
选择并发方案的原则：

1. CPU 密集型（计算、数据处理）
   → 多进程 (multiprocessing / ProcessPoolExecutor)

2. I/O 密集型（网络、文件）且连接数少
   → 多线程 (threading / ThreadPoolExecutor)

3. I/O 密集型且连接数多（成千上万个）
   → 异步 (asyncio)

4. 混合场景
   → asyncio + 线程池/进程池（loop.run_in_executor）
"""

import asyncio
from concurrent.futures import ThreadPoolExecutor
import requests

# asyncio + 线程池（处理阻塞操作）
async def fetch_with_threadpool(urls):
    loop = asyncio.get_event_loop()

    with ThreadPoolExecutor(max_workers=10) as executor:
        # 在线程池中运行阻塞操作
        futures = [
            loop.run_in_executor(executor, requests.get, url)
            for url in urls
        ]
        responses = await asyncio.gather(*futures)
        return [r.text for r in responses]

# 实际对比示例
import time
import threading
import multiprocessing

def task(n):
    """模拟任务"""
    total = 0
    for i in range(n):
        total += i
    return total

if __name__ == "__main__":
    N = 5
    task_size = 5000000

    # 单线程
    start = time.time()
    for _ in range(N):
        task(task_size)
    print(f"单线程: {time.time() - start:.2f}s")

    # 多线程（GIL 限制，不会更快）
    start = time.time()
    threads = [threading.Thread(target=task, args=(task_size,)) for _ in range(N)]
    for t in threads: t.start()
    for t in threads: t.join()
    print(f"多线程: {time.time() - start:.2f}s")

    # 多进程（真正并行）
    start = time.time()
    processes = [multiprocessing.Process(target=task, args=(task_size,)) for _ in range(N)]
    for p in processes: p.start()
    for p in processes: p.join()
    print(f"多进程: {time.time() - start:.2f}s")
```

### 11.8 经典代码

```python
"""
最佳实践：

1. 始终使用 if __name__ == "__main__": 保护多进程代码
2. 优先使用 ThreadPoolExecutor / ProcessPoolExecutor 而非手动创建
3. 避免共享状态，使用 Queue/Pipe 进行进程间通信
4. 注意线程安全问题，使用 Lock 保护临界区
5. 设置合理的 workers 数量（通常等于 CPU 核心数）
6. 使用 context managers 管理资源
"""

```

#### 1. 多个线程顺序打印

思路是：每个线程独享一个 condition，从而实现线程的精确唤醒。

``` python
from threading import Thread, Condition, RLock  
  
def print_letter(letter, current_index, conditions, lock, times=5):  
    # 当前线程对应的等待队列  
    con = conditions[current_index % 4]  
  
    for i in range(times):  
        with con:  
            # 先让自己休眠，等待唤醒  
            con.wait()  
            # 打印字母  
            print(letter)  
            # 唤醒下一个线程（需要先获取下一个 condition 的锁）  
            with conditions[(current_index + 1) % 4]:  
                conditions[(current_index + 1) % 4].notify()  
  
  
if __name__ == '__main__':  
    lock = RLock()  
    conditions = [Condition(lock) for _ in range(4)]  
  
    threads = [  
        Thread(target=print_letter, args=(letter, index, conditions, lock))  
        for index, letter in enumerate('abcd')  
    ]  
  
    for thread in threads:  
        thread.start()  
  
    # 手动唤醒第一个线程，开启逻辑（必须在 join 之前，且需要获取锁）  
    with conditions[0]:  
        conditions[0].notify()  
  
    for thread in threads:  
        thread.join()  
  
    print('Done')
```


#### 2. 死锁演示

``` python
import threading  
import time  
from threading import Lock, Thread  
  
lock1 = Lock()  
lock2 = Lock()  
  
def f1():  
    with lock1:  
        print(f'{threading.current_thread().name}抢到了 lock1，尝试获取 lock2')  
        time.sleep(1)  
        with lock2:  
            print(f'{threading.current_thread().name}抢到了 lock2')  
  
  
def f2():  
    with lock2:  
        print(f'{threading.current_thread().name}抢到了 lock2，尝试获取 lock1')  
        time.sleep(1)  
        with lock1:  
            print(f'{threading.current_thread().name}抢到了 lock1')  
  
t1 = Thread(target=f1, name='t1')  
t2 = Thread(target=f2, name='t2')  
  
t1.start()  
t2.start()  
  
t1.join()  
t2.join()  
  
print('main thread end')
```

#### 3. 生产者消费者

**生产者-消费者模式**是一种经典的并发设计模式，用于解决生产数据和消费数据速度不匹配的问题。

**核心组件**：

- **生产者**：负责生成数据，放入队列
- **消费者**：负责从队列取出数据，进行处理
- **缓冲区**：通常是队列，用于解耦生产者和消费者

**为什么需要这个模式**：

1. **解耦**：生产者不需要知道消费者是谁，反之亦然
2. **削峰填谷**：消费者处理能力不足时，数据在队列中缓存
3. **并发**：多个生产者和消费者可以并行工作

**基础实现 - 使用 Queue**：内置同步，代码简洁，生产环境首选

```python
# 打印锁，防止输出混乱  
print_lock = threading.Lock()  
  
# 创建有限容量的队列（缓冲区）  
buffer = queue.Queue(maxsize=10)  
  
# 产品编号计数器（线程安全）  
idx_counter = itertools.count()  
  
def safe_print(msg):  
    """线程安全的打印函数"""  
    with print_lock:  
        print(msg)  
  
def producer(name):  
    """生产者：不断生产数据"""  
    for i in range(20):  
        item = f"产品-{next(idx_counter)}"  
        # put(block=True): 队列满时阻塞等待  
        buffer.put(item)  
        safe_print(f"[{name}] 生产了 {item}，队列大小: {buffer.qsize()}")  
  
        # 模拟生产时间  
        time.sleep(random.uniform(0.1, 0.5))  
  
    safe_print(f"[{name}] 生产结束")  
  
def consumer(name):  
    """消费者：不断消费数据"""  
    while True:  
        try:  
            item = buffer.get(timeout=1)  
            safe_print(f'[{name}] 消费了 {item}，队列大小: {buffer.qsize()}')  
            time.sleep(random.uniform(0.1, 0.5))  
            buffer.task_done()  
        except queue.Empty:  
            safe_print(f'[{name}] 队列为空，退出')  
            break  
  
# 创建线程  
producers = [threading.Thread(target=producer, args=(f"生产者-{i}",)) for i in range(2)]  
consumers = [threading.Thread(target=consumer, args=(f"消费者-{i}",)) for i in range(3)]  
  
# 启动  
for p in producers:  
    p.start()  
for c in consumers:  
    c.start()  
  
# 等待所有生产者完成  
for p in producers:  
    p.join()  
  
safe_print("所有生产者已完成")  
  
# 等待队列中所有项目被处理  
buffer.join()  
safe_print("所有项目已处理完毕")
```

**使用 Condition 实现（更底层控制）**：更加像 java 版本，上边的写法有点恶心啊。

```python
import threading  
from threading import Thread, Lock, Condition  
  
lock = Lock()  
buffer = []  
capacity = 5  
not_full = Condition(lock)  
not_empty = Condition(lock)  
idx = 0  
  
def produce():  
    for i in range(100):  
        global idx  
        with not_full:  
            while len(buffer) == capacity:  
                print("Buffer is full")  
                not_full.wait()  
  
            buffer.append(idx)  
            print(f'{threading.current_thread().name} 生产了产品 {idx}，当前缓冲区有 {len(buffer)}/{capacity} 个产品')  
            idx += 1  
            not_empty.notify()  
  
  
def consume():  
    while True:  
        with not_empty:  
            while len(buffer) == 0:  
                print("Buffer is empty")  
                not_empty.wait()  
  
            val = buffer.pop(0)  
            print(f'{threading.current_thread().name} 消费了产品 {val}, 当前缓冲区有 {len(buffer)}/{capacity} 个产品')  
            not_full.notify()  
  
  
p1 = Thread(target=produce, name='p1')  
c1 = Thread(target=consume, name='c1')  
p1.start()  
c1.start()
```

**使用 Semaphore 实现（控制并发数）**：

```python
import threading
import time
import random

class SemaphoreBuffer:
    """使用信号量实现的生产者-消费者"""

    def __init__(self, capacity):
        self.capacity = capacity
        self.buffer = []
        self.mutex = threading.Semaphore(1)       # 互斥锁
        self.empty = threading.Semaphore(capacity)  # 空位数量
        self.full = threading.Semaphore(0)          # 已占用数量

    def put(self, item):
        """放入数据"""
        self.empty.acquire()   # 获取一个空位（没有就等待）
        self.mutex.acquire()   # 进入临界区

        self.buffer.append(item)
        print(f"生产: {item}")

        self.mutex.release()   # 离开临界区
        self.full.release()    # 增加一个已占用位

    def get(self):
        """取出数据"""
        self.full.acquire()    # 获取一个已占用位（没有就等待）
        self.mutex.acquire()   # 进入临界区

        item = self.buffer.pop(0)
        print(f"消费: {item}")

        self.mutex.release()   # 离开临界区
        self.empty.release()   # 增加一个空位
        return item

# 使用与 Condition 版本相同
```

**最佳实践 - 使用 concurrent.futures**：

```python
from concurrent.futures import ThreadPoolExecutor
import time

def process_data(item):
    """消费者逻辑"""
    time.sleep(0.5)
    return f"处理完成: {item}"

def main():
    items = [f"数据-{i}" for i in range(20)]

    # ThreadPoolExecutor 内部已经实现了生产者-消费者模式
    with ThreadPoolExecutor(max_workers=4) as executor:
        # 提交任务（生产者行为）
        futures = [executor.submit(process_data, item) for item in items]

        # 获取结果（消费者行为）
        results = [f.result() for f in futures]

    return results

if __name__ == "__main__":
    results = main()
    print(f"完成 {len(results)} 项处理")
```

## 十二、协程

#### 协程是什么？

**协程**（Coroutine）是一种**用户态的轻量级线程**，由程序员控制调度，而非操作系统内核。它允许函数在执行过程中**暂停**（挂起）并在稍后**恢复**，实现**协作式多任务**。

本质上，协程就是一个可以被挂起，挂起后还可以恢复执行的函数。

**与线程/进程的区别**：

| 对比项      | 进程        | 线程          | 协程          |
| -------- | --------- | ----------- | ----------- |
| **调度者**  | 操作系统内核    | 操作系统内核      | 用户程序（事件循环）  |
| **切换成本** | 高（需切换页表）  | 中（需切换栈）     | 极低（纯代码切换）   |
| **内存占用** | 高（独立内存空间） | 中（共享内存）     | 极低（几 KB 栈）  |
| **数据安全** | 进程间隔离     | 需加锁保护       | 单线程安全       |
| **适用场景** | CPU 密集型   | I/O 密集型（少量） | I/O 密集型（大量） |

#### 基础语法

Python 使用 `async` 和 `await` 关键字定义和使用协程。`async` 修饰的函数叫做写成函数，调用协程函数，不会立即执行代码，而是会返回一个协程对象（coroutine）

```python
import asyncio

# async def 定义协程函数
async def say_hello():
    print("Hello")
    # await 暂停协程，等待异步操作完成
    # await 后面必须是 Awaitable 对象（协程、任务、Future）
    await asyncio.sleep(1)  # 模拟 I/O 操作
    print("World")

# 协程函数调用不会立即执行，而是返回协程对象
coro = say_hello()
print(type(coro))  # <class 'coroutine'> 

# 运行协程
asyncio.run(say_hello())  # Python 3.7+ 推荐方式
```

**asyncio.run() 执行流程**：

```
asyncio.run(main())
    ↓
创建事件循环（Event Loop）
    ↓
运行 main() 直到完成
    ↓
遇到 await → 挂起当前协程，执行其他就绪协程
    ↓
所有协程完成
    ↓
关闭事件循环
```

#### await 关键字

`await` 是协程的核心关键字，用于**挂起当前协程**，等待异步操作完成。

**执行机制**：

| 阶段 | 行为 | 说明 |
|------|------|------|
| **挂起** | 暂停当前协程执行 | 保存当前执行状态（上下文） |
| **等待** | 事件循环调度其他任务 | `await` 后的对象进入事件循环执行 |
| **恢复** | 异步操作完成 | 事件循环恢复之前挂起的协程，从暂停处继续 |

```python
import asyncio

async def task(name, delay):
    print(f"[{name}] 步骤1: 开始")
    await asyncio.sleep(delay)  # ← 挂起点
    print(f"[{name}] 步骤2: 继续执行")  # ← 恢复后从这里继续
    return f"{name} 完成"

async def main():
    # await 只能在 async def 函数内部使用
    result = await task("A", 1)
    print(result)

asyncio.run(main())
```

**await 可以接的对象**（必须是 Awaitable）：协程对象 | Future 对象 | Task 对象

```python
import asyncio

async def coroutine_func():
    """协程函数"""
    await asyncio.sleep(0.1)
    return "协程结果"

async def main():
    # 1. 另一个协程
    result = await coroutine_func()

    # 2. Task 对象
    task = asyncio.create_task(coroutine_func())
    result = await task

    # 3. Future 对象
    future = asyncio.Future()
    future.set_result("Future 结果")
    result = await future

    # ❌ 错误：await 后面不能是普通函数
    # await time.sleep(1)  # TypeError!

asyncio.run(main())
```

**事件循环调度原理**：

```
协程 A: await asyncio.sleep(2)          协程 B: await asyncio.sleep(1)
    ↓                                        ↓
挂起 A，注册定时器（2秒后唤醒）         挂起 B，注册定时器（1秒后唤醒）
    ↓                                        ↓
               ↓ 事件循环检查 ↓
               ↓
         1秒到了 → 唤醒 B 执行 → B 完成
               ↓
         2秒到了 → 唤醒 A 执行 → A 完成
```

**关键特性**：

```python
import asyncio

async def main():
    # 1. await 不会阻塞整个程序，只挂起当前协程
    print("开始")
    await asyncio.sleep(1)  # 这 1 秒内，其他协程可以运行
    print("结束")

    # 2. 多个 await 是顺序执行
    await asyncio.sleep(1)  # 等待 1 秒
    await asyncio.sleep(1)  # 再等待 1 秒（总共 2 秒）

    # 3. 要并发执行，需要使用 gather 或 create_task
    await asyncio.gather(
        asyncio.sleep(1),
        asyncio.sleep(1)
    )  # 总共约 1 秒

asyncio.run(main())
```

**常见错误**：

```python
import asyncio

# ❌ 错误1：在普通函数中使用 await
def normal_func():
    await asyncio.sleep(1)  # SyntaxError!

# ✅ 正确：只能在 async def 函数中使用
async def async_func():
    await asyncio.sleep(1)

# ❌ 错误2：忘记 await
coro = async_func()  # 这只是创建协程对象，不会执行！

# ✅ 正确：必须 await
coro = async_func()
await coro
# 或直接
await async_func()

# ❌ 错误3：await 非 Awaitable 对象
await "hello"  # TypeError: object str can't be used in 'await' expression
```

#### 并发执行协程

**asyncio.gather()** - 并发运行多个协程：

```python
import asyncio

async def task(name, delay):
    print(f"[{name}] 开始")
    await asyncio.sleep(delay)  # 挂起，不阻塞其他协程
    print(f"[{name}] 完成")
    return f"{name} 的结果"

async def main():
    # 顺序执行（慢）
    print("=== 顺序执行 ===")
    await task("A", 1)
    await task("B", 1)
    await task("C", 1)  # 共 3 秒

    # 并发执行（快）
    print("\n=== 并发执行 ===")
    # gather() 同时启动所有协程，等待全部完成
    results = await asyncio.gather(
        task("A", 1), 
        task("B", 1),
        task("C", 1)
    )
    print(f"结果: {results}")  # ['A 的结果', 'B 的结果', 'C 的结果']
    # 总共约 1 秒

asyncio.run(main())
```

**asyncio.create_task()** - 创建一个可以被事件循环调度的任务：

```python
import asyncio

async def background_task(name):
    for i in range(3):
        await asyncio.sleep(1)
        print(f"[{name}] 进度 {i+1}/3")
    return f"{name} 完成"

async def main():
    # create_task() 立即在后台启动协程
    task1 = asyncio.create_task(background_task("任务1"))
    task2 = asyncio.create_task(background_task("任务2"))

    print("任务已启动，继续执行其他代码...")
    await asyncio.sleep(0.5)  # 模拟其他工作

    # await 任务等待其完成
    result1 = await task1
    result2 = await task2
    print(f"{result1}, {result2}")

asyncio.run(main())
```

#### 等待多个协程的不同方式

| 函数 | 作用 | 返回时机 |
|------|------|---------|
| `gather()` | 并发执行全部 | 全部完成 |
| `wait()` | 等待满足条件 | 指定条件 |
| `wait_for()` | 带超时等待 | 完成或超时 |
| `as_completed()` | 谁完成先处理谁 | 逐个返回 |

```python
import asyncio

async def task(name, delay):
    await asyncio.sleep(delay)
    return f"{name} 完成"

async def main():
    tasks = [
        task("A", 3),
        task("B", 1),
        task("C", 2)
    ]

    # wait_for - 带超时
    try:
        result = await asyncio.wait_for(task("A", 5), timeout=2)
    except asyncio.TimeoutError:
        print("超时！")

    # wait - 等待指定条件
    done, pending = await asyncio.wait(
        [asyncio.create_task(t) for t in tasks],
        return_when=asyncio.FIRST_COMPLETED  # 任意一个完成
    )
    print(f"已完成: {[t.result() for t in done]}")

    # as_completed - 按完成顺序处理
    for coro in asyncio.as_completed(tasks):
        result = await coro
        print(f"先完成: {result}")

asyncio.run(main())
```

#### 实际应用 - 并发 HTTP 请求

如果想支持协程，不能用 `requests` 了，必须使用 `aiohttp`。

```python
import asyncio  
import time  
import os  
  
import aiohttp  
import requests  
  
save_dir = './images'  
  
  
def ensure_dir():  
    """确保目录存在"""  
    if not os.path.exists(save_dir):  
        os.mkdir(save_dir)  
  
  
# ============ 同步版本 ============
def download_sync(urls):  
    print("\n=== 同步下载 ===")  
    ensure_dir()  
    st = time.time()  
    for i, url in enumerate(urls):  
        print('Downloading:', url)  
        resp = requests.get(url)  
        with open(os.path.join(save_dir, f'img_sync_{i}.png'), 'wb') as f:  
            f.write(resp.content)  
  
    return time.time() - st  
  
  
# ============ 异步版本 ============
async def download_async(url, cli, idx):  
    print('Downloading:', url)  
    async with cli.get(url) as res:  
        data = await res.read()  
    with open(os.path.join(save_dir, f'img_async_{idx}.png'), 'wb') as f:  
        f.write(data)  
  
async def main_async(urls):  
    print("\n=== 异步下载 ===")  
    ensure_dir()  
    st = time.time()  
    async with aiohttp.ClientSession() as cli:  
        await asyncio.gather(*[download_async(url, cli, i) for i, url in enumerate(urls)])  
    return time.time() - st  
  
  
async def main():  
    urls = [  
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000',  
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000',  
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000'  
    ]  
  
    # 同步下载  
    sync_time = download_sync(urls)  
    print(f'同步总耗时：{sync_time:.2f}s')  
  
    # 异步下载  
    async_time = await main_async(urls)  
    print(f'异步总耗时：{async_time:.2f}s')  
  
    print(f'\n异步比同步快了：{(sync_time - async_time):.2f}s ({(sync_time/async_time-1)*100:.1f}%)')  
  
  
if __name__ == '__main__':  
    asyncio.run(main())
```

#### 协程与同步代码交互

**run_in_executor()** - 在线程池中运行同步代码：

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

# 模拟阻塞的同步函数
def blocking_io(filename):
    """阻塞的 I/O 操作（如读取大文件）"""
    with open(filename, 'r') as f:
        return f.read()

async def main():
    loop = asyncio.get_event_loop()

    # 在线程池中运行阻塞操作，不阻塞事件循环
    with ThreadPoolExecutor() as executor:
        content = await loop.run_in_executor(
            executor,       # 线程池（None 表示默认）
            blocking_io,    # 同步函数
            'data.txt'      # 参数
        )
        print(f"文件内容: {content[:100]}...")

asyncio.run(main())
```

#### 协程装饰器与上下文管理器

协程装饰器就是用来装饰 async 函数的装饰器。

@asynccontextmanager 装饰器：它能把一个简单的异步生成器（带有 yield 的函数）转换成一个上下文管理器。

```python
import asyncio
from contextlib import asynccontextmanager

# 异步装饰器
from functools import wraps

def async_timer(func):
    """异步函数计时装饰器"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = await func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"{func.__name__} 耗时: {elapsed:.2f}s")
        return result
    return wrapper

@async_timer
async def slow_task():
    await asyncio.sleep(1)
    return "Done"

# 异步上下文管理器
@asynccontextmanager
async def async_database():
    """异步数据库连接上下文"""
    print("连接数据库...")
    await asyncio.sleep(0.1)  # 模拟连接
    db = {"connected": True}
    try:
        yield db
    finally:
        print("关闭数据库...")
        await asyncio.sleep(0.1)

async def main():
    async with async_database() as db:
        print(f"使用数据库: {db}")

asyncio.run(main())
```

#### 最佳实践

```python
import asyncio

# 1. 始终使用 asyncio.run() 作为主入口
async def main():
    # 协程代码
    pass

if __name__ == "__main__":
    asyncio.run(main())

# 2. 批量创建任务限制并发数
async def limited_tasks():
    semaphore = asyncio.Semaphore(10)  # 最多10个并发

    async def task(n):
        async with semaphore:
            await asyncio.sleep(1)
            print(f"任务 {n} 完成")

    await asyncio.gather(*[task(i) for i in range(100)])

# 3. 正确处理异常
async def safe_task():
    try:
        await asyncio.wait_for(risky_operation(), timeout=5)
    except asyncio.TimeoutError:
        print("超时")
    except Exception as e:
        print(f"错误: {e}")

# 4. 取消长时间运行的任务
task = asyncio.create_task(long_running())
await asyncio.sleep(5)
task.cancel()
try:
    await task
except asyncio.CancelledError:
    print("任务已取消")
```
