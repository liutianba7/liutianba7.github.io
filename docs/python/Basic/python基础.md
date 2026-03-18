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

### 6.1 文件读写

```python
# 写文件
with open("file.txt", "w", encoding="utf-8") as f:
    f.write("Hello Python\n")
    f.writelines(["第一行\n", "第二行\n"])

# 读文件
with open("file.txt", "r", encoding="utf-8") as f:
    content = f.read()          # 读取全部
    lines = f.readlines()       # 读取所有行
    line = f.readline()         # 读取一行

# 追加写入
with open("file.txt", "a", encoding="utf-8") as f:
    f.write("追加内容\n")
```

### 6.2 文件路径

```python
from pathlib import Path

# 路径操作
p = Path("data/test.txt")
p.name          # "test.txt"
p.suffix        # ".txt"
p.parent        # Path("data")
p.exists()      # 是否存在
p.is_file()     # 是否是文件

# 创建目录
Path("new_dir").mkdir(exist_ok=True)
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

### 8.2 常用内置模块

| 模块 | 功能 | 常用方法 |
|------|------|----------|
| `os` | 操作系统接口 | `os.getcwd()`, `os.listdir()` |
| `sys` | Python解释器 | `sys.version`, `sys.path` |
| `datetime` | 日期时间 | `datetime.now()`, `timedelta(days=1)` |
| `json` | JSON处理 | `json.dumps()`, `json.loads()` |
| `re` | 正则表达式 | `re.match()`, `re.findall()` |
| `random` | 随机数 | `random.randint()`, `random.choice()` |
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

```python
# 生成器函数
def countdown(n):
    while n > 0:
        yield n
        n -= 1

for i in countdown(3):
    print(i)  # 3, 2, 1

# 生成器表达式
sum(x**2 for x in range(10))

# yield from
def chain(*iterables):
    for it in iterables:
        yield from it

list(chain([1, 2], [3, 4]))  # [1, 2, 3, 4]
```

---

## 十、上下文管理器

```python
# with 语句
with open("file.txt") as f:
    data = f.read()
# 文件自动关闭

# 自定义上下文管理器
class Timer:
    def __enter__(self):
        import time
        self.start = time.time()
        return self

    def __exit__(self, *args):
        import time
        print(f"耗时: {time.time() - self.start:.2f}s")

with Timer():
    # 执行一些操作
    pass
```