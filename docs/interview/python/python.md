# Python 基础

### 基础概念

#### 1. Python 的特点

Python 是一门**解释型、动态类型、面向对象**的高级编程语言，主要有以下特点：

（1）**简洁易读**：语法设计注重可读性，代码简洁，接近自然语言，降低了学习门槛。

（2）**动态类型**：变量不需要声明类型，类型在运行时自动推断，开发效率高。

（3）**跨平台**：Python 代码可以在 Windows、Linux、Mac 等多个操作系统上运行，无需修改。

（4）**丰富的生态**：拥有大量第三方库，覆盖 Web 开发、数据分析、机器学习、自动化等领域。

（5）**自动内存管理**：内置垃圾回收机制，开发者无需手动管理内存。

#### 2. Python 的优势与劣势

**优势：**

- 开发效率高，语法简洁，代码量少
- 生态强大，"人生苦短，我用 Python"正是得益于其丰富的库
- 适合快速原型开发和脚本编写
- 在数据科学、AI 领域几乎是首选语言

**劣势：**

- **运行速度慢**：解释型语言，执行效率远低于 C/C++、Java
- **并发性能受限**：GIL（全局解释器锁）限制了多线程的并行执行能力
- **移动端支持弱**：在移动应用开发领域几乎没有优势
#### 3. Python 解释器类型

Python 有多种解释器实现，最常用的是 CPython：

| 解释器 | 说明 |
| ------ | ---- |
| **CPython** | 官方默认解释器，用 C 实现，最稳定、生态最完善 |
| **PyPy** | 使用 JIT 技术，执行速度更快，适合长期运行的程序 |
| **Jython** | 运行在 JVM 上，可调用 Java 类库 |
| **IronPython** | 运行在 .NET 平台上，可调用 C# 类库 |

日常开发中主要使用 CPython，如果对性能有特殊要求，可以尝试 PyPy。

#### 4. Python 的运行原理⭐️

Python 是解释型语言，但并非"逐行解释执行"。实际流程如下：

1. **编译阶段**：Python 源代码（`.py` 文件）先被编译为**字节码**（Bytecode），存储在 `.pyc` 文件中（位于 `__pycache__` 目录）
2. **解释阶段**：Python 解释器（CPython）逐条解释字节码并执行

所以 Python 是"先编译后解释"的模式，字节码是中间产物，这加快了后续执行速度（无需每次重新编译）。

```
.py 源代码 → 编译 → .pyc 字节码 → 解释器执行 → 机器指令
```

#### 5. Python 2 与 Python 3 的主要区别

Python 3 是 Python 2 的重大升级，不兼容 Python 2。主要区别：

| 区别点 | Python 2 | Python 3 |
| ------ | -------- | -------- |
| print | `print "hello"`（语句） | `print("hello")`（函数） |
| 整数除法 | `5/2 = 2`（向下取整） | `5/2 = 2.5`（真除法），`5//2 = 2`（取整） |
| 字符串 | 默认 `str` 是字节串，`unicode` 是文本 | 默认 `str` 是文本（Unicode），`bytes` 是字节串 |
| 编码 | 默认 ASCII，容易中文乱码 | 默认 UTF-8，支持中文 |
| range | `range()` 返回列表，`xrange()` 返回迭代器 | `range()` 返回迭代器，更高效 |
| 输入函数 | `raw_input()` | `input()` |

目前 Python 2 已停止维护，所有新项目都应使用 Python 3。

#### 6. Python 的内存管理机制概述

Python 的内存管理分为三层：

1. **栈内存**：存储局部变量、函数调用栈帧等，由系统自动管理
2. **堆内存**：存储对象实例，由 Python 的内存管理器负责分配和回收
3. **垃圾回收**：自动回收不再使用的对象，主要通过**引用计数** + **标记清除/分代回收**实现

具体机制在"内存管理与垃圾回收"章节详细展开。

---

### 数据类型

#### 1. Python 基本数据类型

Python 的基本数据类型分为以下几类：

| 类型 | 说明 | 示例 |
| ---- | ---- | ---- |
| int | 整数（无大小限制） | `42`, `-1`, `0b1010` |
| float | 浮点数（64位双精度） | `3.14`, `1e-5` |
| str | 字符串（Unicode） | `"hello"`, `'世界'` |
| bool | 布尔值 | `True`, `False` |
| NoneType | 空值 | `None` |

注意：Python 的 `int` 没有大小限制，可以表示任意大的整数（不像 Java 的 int 有 32 位限制）。

#### 2. 可变类型 vs 不可变类型⭐️

这是 Python 中非常重要的概念：

| 类型分类 | 特点 | 示例 |
| -------- | ---- | ---- |
| **不可变类型** | 创建后值不可修改，修改会创建新对象 | int, float, str, tuple, frozenset |
| **可变类型** | 创建后可原地修改内容，对象身份不变 | list, dict, set |

**不可变类型示例：**
```python
a = "hello"
a += " world"  # 实际创建了新字符串对象，a 指向新对象
print(a)  # "hello world"
```

**可变类型示例：**
```python
lst = [1, 2, 3]
lst.append(4)  # 原地修改，lst 还是同一个对象
print(lst)  # [1, 2, 3, 4]
```

**为什么这个区别重要？**

- 不可变类型可以作为字典的键、集合的元素（因为哈希值稳定）
- 可变类型不能作为字典键或集合元素
- 函数参数传递时，可变类型可能被函数内部修改（副作用）

#### 3. 列表、元组、字典、集合的区别⭐️

| 类型 | 可变性 | 有序性 | 是否可哈希 | 主要特点 |
| ---- | ------ | ------ | ---------- | -------- |
| list | 可变 | 有序 | ❌ | 动态数组，增删改查灵活 |
| tuple | 不可变 | 有序 | ✅ | 不可变序列，可作为字典键 |
| dict | 可变 | 无序（3.7+有序） | ❌（键需可哈希） | 键值对映射，查找效率高 |
| set | 可变 | 无序 | ❌ | 唯一元素集合，自动去重 |

**使用场景：**

- **列表**：需要频繁增删元素、元素有序时使用
- **元组**：数据不可变、需要作为字典键、函数返回多个值时使用
- **字典**：需要快速查找、键值映射时使用
- **集合**：需要去重、集合运算（交集、并集）时使用

**字典查找效率高的原因？**
字典基于哈希表实现，查找时间复杂度为 O(1)，而列表查找需要遍历，复杂度为 O(n)。

#### 4. 深拷贝 vs 浅拷贝⭐️⭐️

与 Java 类似，Python 也存在深拷贝和浅拷贝的区别。

**浅拷贝**：只复制对象本身，内部的引用类型仍指向原对象。

**深拷贝**：递归复制所有层级，创建完全独立的新对象。

```python
import copy

# 浅拷贝示例
lst1 = [[1, 2], [3, 4]]
lst2 = copy.copy(lst1)  # 或 lst1[:]
lst2[0][0] = 100
print(lst1)  # [[100, 2], [3, 4]]  ← 嵌套列表被修改了！

# 深拷贝示例
lst3 = copy.deepcopy(lst1)
lst3[0][0] = 200
print(lst1)  # 不受影响，完全独立
```

| 对比项 | 浅拷贝 | 深拷贝 |
| ------ | ------ | ------ |
| 外层对象 | 新对象 | 新对象 |
| 嵌套对象 | 共享引用 | 全新副本 |
| 修改影响 | 嵌套部分互相影响 | 完全独立 |
| 性能开销 | 小 | 大 |

**常见浅拷贝方式：**

- `copy.copy(obj)`
- `list[:]` 切片
- `dict.copy()`
- `list(other_list)` 构造函数

**深拷贝方式：**

- `copy.deepcopy(obj)`

#### 5. 类型转换与隐式转换规则

**显式类型转换：**
```python
int("42")       # 42
float("3.14")   # 3.14
str(100)        # "100"
list("abc")     # ['a', 'b', 'c']
tuple([1,2,3])  # (1, 2, 3)
set([1,1,2])    # {1, 2}
```

**隐式类型转换规则：**
```python
# int + float → float
result = 5 + 2.5   # 7.5（float）

# bool参与运算时，True=1，False=0
result = True + 1  # 2
result = False * 5  # 0
```

注意：Python 不会自动将字符串和数字相加（会报错），需要显式转换。

---

### 函数

#### 0. 函数的本质⭐️

在 Python 中，**函数本质上是一个对象**。函数是 `function` 类型的实例，拥有自己的属性和方法，可以像普通对象一样被传递、赋值、存储，甚至动态添加属性。

```python
def greet():
    print("Hello World")

# 函数是对象，可以查看其类型
print(type(greet))  # <class 'function'>

# 函数有内置属性
print(greet.__name__)  # "greet"（函数名）
print(greet.__code__)  # 函数的字节码对象

# 函数可以动态添加属性
greet.author = "张三"
greet.version = "1.0"
print(greet.author)  # "张三"

# 函数可以赋值给变量
my_func = greet
my_func()  # "Hello World"

# 函数可以作为参数传递
def execute(func):
    func()

execute(greet)  # "Hello World"

# 函数可以作为返回值
def get_func():
    return greet

f = get_func()
f()  # "Hello World"
```

**函数的常见内置属性：**

| 属性 | 说明 |
| ---- | ---- |
| `__name__` | 函数名 |
| `__code__` | 函数的字节码对象 |
| `__defaults__` | 默认参数值（元组） |
| `__kwdefaults__` | 关键字参数默认值 |
| `__annotations__` | 类型注解字典 |
| `__doc__` | 函数文档字符串 |
| `__module__` | 函数所属模块 |

#### 1. 函数参数类型⭐️

Python 函数支持多种参数类型，灵活度很高：

```python
def example(a, b=10, *args, **kwargs):
    print(f"a={a}, b={b}, args={args}, kwargs={kwargs}")
```

| 参数类型 | 说明 | 示例 |
| -------- | ---- | ---- |
| 位置参数 | 必须按顺序传入 | `a` |
| 默认参数 | 有默认值，可不传 | `b=10` |
| 可变位置参数 | 接收多余位置参数，形成元组 | `*args` |
| 可变关键字参数 | 接收多余关键字参数，形成字典 | `**kwargs` |

**调用示例：**
```python
example(1)                      # a=1, b=10, args=(), kwargs={}
example(1, 2)                   # a=1, b=2, args=(), kwargs={}
example(1, 2, 3, 4)             # a=1, b=2, args=(3, 4), kwargs={}
example(1, name="ltb", age=25)  # a=1, b=10, args=(), kwargs={'name': 'ltb', 'age': 25}
```

**注意事项：**

- 默认参数必须放在位置参数之后
- `*args` 必须在默认参数之后，`**kwargs` 必须在最后
- 默认参数不要使用可变类型（如 `[]`），否则会有累积效应

```python
# ❌ 错误示范：默认参数用可变类型
def bad_func(lst=[]):
    lst.append(1)
    return lst

print(bad_func())  # [1]
print(bad_func())  # [1, 1]  ← 第二次调用累积了！
```

#### 2. lambda 表达式

lambda 是匿名函数的简洁写法，适用于简单函数：

```python
# 语法：lambda 参数: 表达式
add = lambda x, y: x + y
print(add(3, 5))  # 8

# 常用于排序、过滤等场景
students = [('Alice', 85), ('Bob', 90), ('Charlie', 78)]
students.sort(key=lambda x: x[1], reverse=True)  # 按成绩降序
print(students)  # [('Bob', 90), ('Alice', 85), ('Charlie', 78)]
```

#### 3. 装饰器⭐️⭐️

装饰器是 Python 的高级特性，用于在不修改原函数代码的情况下，增强函数功能。

**本质**：装饰器是一个函数，接收一个函数作为参数，返回一个新的函数。

**基本结构：**
```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("函数执行前")
        result = func(*args, **kwargs)
        print("函数执行后")
        return result
    return wrapper

@my_decorator
def say_hello(name):
    print(f"Hello, {name}")

say_hello("ltb")
# 输出：
# 函数执行前
# Hello, ltb
# 函数执行后
```

**常见应用场景：**

- 日志记录
- 性能计时
- 权限校验
- 缓存结果

**带参数的装饰器：**
```python
def repeat(n):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet():
    print("Hi!")

greet()  # 打印 3 次 "Hi!"
```

#### 4. 闭包

闭包是指：**内部函数引用了外部函数的变量，并且外部函数返回内部函数**。

```python
def outer(x):
    def inner(y):
        return x + y  # inner 引用了 outer 的变量 x
    return inner

add5 = outer(5)  # add5 是一个闭包，"记住"了 x=5
print(add5(3))   # 8
print(add5(10))  # 15
```

闭包的特点：

- 内部函数"记住"了外部函数的环境变量
- 延长了变量的生命周期（即使 outer 已执行完毕）
- 常用于数据封装、延迟计算、装饰器实现

#### 5. 函数式编程工具

Python 提供了三个常用的函数式编程工具：

**map**：对序列每个元素应用函数，返回迭代器
```python
nums = [1, 2, 3, 4]
result = list(map(lambda x: x ** 2, nums))
print(result)  # [1, 4, 9, 16]
```

**filter**：过滤满足条件的元素
```python
nums = [1, 2, 3, 4, 5, 6]
result = list(filter(lambda x: x % 2 == 0, nums))
print(result)  # [2, 4, 6]
```

**reduce**：累积计算（需导入）
```python
from functools import reduce
nums = [1, 2, 3, 4]
result = reduce(lambda x, y: x + y, nums)
print(result)  # 10（累加）
```

---

### 面向对象

#### 1. 类与对象、self 的含义⭐️

Python 中类是对象的模板，对象是类的实例。

```python
class Person:
    def __init__(self, name, age):
        self.name = name  # 实例属性
        self.age = age

    def introduce(self):
        print(f"我是{self.name}, {self.age}岁")

p = Person("张三", 25)  # 创建对象
p.introduce()
```

**self 的含义**：

- `self` 代表当前实例对象本身
- 在实例方法中，Python 自动传入 `self`（调用时无需手动传）
- 通过 `self` 可以访问实例属性和其他实例方法

#### 2. 继承、封装、多态

**继承**：子类继承父类的属性和方法
```python
class Animal:
    def speak(self):
        print("动物叫声")

class Dog(Animal):
    def speak(self):  # 重写父类方法
        print("汪汪汪")

dog = Dog()
dog.speak()  # "汪汪汪"
```

**封装**：通过访问控制隐藏内部实现

- Python 没有 `private` 关键字，通过命名约定实现：
  - `_var`：约定为内部使用（实际上仍可访问）
  - `__var`：名称重整（Name Mangling），更难直接访问

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # 私有属性（名称重整）

    def get_balance(self):
        return self.__balance  # 通过方法访问

account = BankAccount(1000)
print(account.get_balance())  # 1000
print(account.__balance)      # ❌ AttributeError
print(account._BankAccount__balance)  # 1000（强制访问）
```

**多态**：同一方法在不同对象上有不同行为
```python
class Cat(Animal):
    def speak(self):
        print("喵喵喵")

def make_sound(animal):
    animal.speak()  # 多态：不同对象调用同一方法，行为不同

make_sound(Dog())  # "汪汪汪"
make_sound(Cat())  # "喵喵喵"
```

#### 3. 魔法方法⭐️

魔法方法（Magic Methods）是以双下划线开头和结尾的特殊方法，用于实现类的特殊行为：

| 魔法方法 | 说明 | 使用场景 |
| -------- | ---- | -------- |
| `__init__` | 构造函数，初始化对象 | 创建对象时自动调用 |
| `__str__` | 对象的字符串表示 | `print(obj)` 或 `str(obj)` 时调用 |
| `__repr__` | 对象的正式字符串表示 | `repr(obj)`，调试时显示 |
| `__eq__` | 判断相等 | `obj1 == obj2` 时调用 |
| `__len__` | 获取长度 | `len(obj)` 时调用 |
| `__call__` | 使对象可调用 | `obj()` 时调用 |
| `__getitem__` | 索引访问 | `obj[key]` 时调用 |
| `__setitem__` | 索引赋值 | `obj[key] = value` 时调用 |

**示例：**
```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def __str__(self):
        return f"{self.name}: {self.score}分"

    def __eq__(self, other):
        return self.score == other.score

s1 = Student("张三", 90)
s2 = Student("李四", 90)
print(s1)        # "张三: 90分"
print(s1 == s2)  # True（比较成绩）
```

#### 4. 类方法、静态方法、实例方法⭐️

| 方法类型 | 定义方式 | 调用方式 | 能访问的内容 |
| -------- | -------- | -------- | ------------ |
| 实例方法 | `def method(self):` | `obj.method()` | 实例属性、类属性 |
| 类方法 | `@classmethod def method(cls):` | `obj.method()` 或 `Class.method()` | 类属性 |
| 静态方法 | `@staticmethod def method():` | `obj.method()` 或 `Class.method()` | 不能访问实例或类属性（除非显式传入） |

```python
class MyClass:
    class_var = "类属性"

    def __init__(self):
        self.instance_var = "实例属性"

    def instance_method(self):
        print(self.instance_var)  # 可访问实例属性
        print(self.class_var)     # 可访问类属性

    @classmethod
    def class_method(cls):
        print(cls.class_var)      # 只能访问类属性

    @staticmethod
    def static_method():
        print("静态方法，独立于实例和类")

obj = MyClass()
obj.instance_method()   # 通过实例调用
MyClass.class_method()  # 通过类调用
MyClass.static_method()
```

**使用场景：**

- 实例方法：需要操作实例数据时
- 类方法：需要操作类级别数据、或作为工厂方法创建实例
- 静态方法：与类相关但不需要访问类或实例数据的工具方法

#### 5. 属性访问控制（@property）

`@property` 用于将方法变成属性访问，实现对属性的封装控制：

```python
class Person:
    def __init__(self, age):
        self._age = age

    @property
    def age(self):
        return self._age  # getter

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("年龄不能为负")
        self._age = value  # setter

p = Person(25)
print(p.age)    # 25（像属性一样访问）
p.age = 30      # 通过 setter 设置
p.age = -1      # ❌ ValueError
```

好处：

- 隐藏内部实现，调用者无需知道是方法还是属性
- 可以添加验证逻辑
- 代码更优雅

#### 6. 抽象类（ABC 模块）

Python 通过 `abc` 模块实现抽象类：

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def speak(self):
        pass  # 抽象方法，子类必须实现

class Dog(Animal):
    def speak(self):
        print("汪汪汪")

# animal = Animal()  # ❌ 不能实例化抽象类
dog = Dog()          # ✅ 子类实现抽象方法后可实例化
dog.speak()
```

#### 7. 多继承与 MRO⭐️

Python 支持多继承，但可能导致方法调用冲突。MRO（Method Resolution Order）决定了方法查找顺序。

```python
class A:
    def method(self):
        print("A")

class B:
    def method(self):
        print("B")

class C(A, B):  # 多继承
    pass

c = C()
c.method()  # 输出 "A"（按 MRO 查找）

print(C.__mro__)  # (C, A, B, object)
```

MRO 采用 **C3 算法**，保证：

- 子类优先于父类
- 多个父类按定义顺序查找
- 保持单调性（不会出现先查 A 再查 B 又查 A 的情况）

#### 8. __new__ vs __init__⭐️

| 方法 | 作用 | 返回值 | 调用时机 |
| ---- | ---- | ------ | -------- |
| `__new__` | 创建对象实例 | 返回新对象 | 先调用，负责分配内存 |
| `__init__` | 初始化对象属性 | 无返回值 | 后调用，负责初始化数据 |

```python
class MyClass:
    def __new__(cls, *args, **kwargs):
        print("创建对象")
        instance = super().__new__(cls)
        return instance

    def __init__(self, value):
        print("初始化对象")
        self.value = value

obj = MyClass(10)
# 输出：
# 创建对象
# 初始化对象
```

`__new__` 常用于：

- 控制对象创建过程（如单例模式）
- 继承不可变类型（如 str、int）时自定义创建逻辑

---

### 异常处理

#### 1. 异常体系结构

Python 异常以 `BaseException` 为根类，主要分支：

```
BaseException
 ├── SystemExit          # sys.exit() 触发
 ├── KeyboardInterrupt   # Ctrl+C 中断
 ├── GeneratorExit       # 生成器关闭
 └── Exception           # 常见异常的基类 ⭐️
      ├── StopIteration
      ├── ArithmeticError
      │    ├── ZeroDivisionError
      ├── LookupError
      │    ├── IndexError
      │    ├── KeyError
      ├── TypeError
      ├── ValueError
      ├── AttributeError
      ├── IOError / OSError
      ├── RuntimeError
      ...
```

我们日常处理的异常大多继承自 `Exception`。

#### 2. try-except-finally-else 执行流程⭐️

```python
try:
    # 可能抛出异常的代码
    result = 10 / 2
except ZeroDivisionError as e:
    # 处理特定异常
    print("除零错误:", e)
except Exception as e:
    # 处理其他异常
    print("其他错误:", e)
else:
    # 无异常时执行（可选）
    print("执行成功:", result)
finally:
    # 无论是否异常都执行（可选）
    print("清理工作")
```

执行顺序：

- `try` 正常 → 执行 `else` → 执行 `finally`
- `try` 异常 → 匹配 `except` → 执行 `finally`
- `try` 异常且无匹配 `except` → 异常向上抛出 → 执行 `finally`

#### 3. 自定义异常

自定义异常通常继承 `Exception`：

```python
class InvalidAgeError(Exception):
    def __init__(self, age, message="年龄无效"):
        self.age = age
        self.message = message
        super().__init__(f"{message}: {age}")

def set_age(age):
    if age < 0 or age > 150:
        raise InvalidAgeError(age)
    print(f"年龄设置为 {age}")

try:
    set_age(-5)
except InvalidAgeError as e:
    print(e)  # "年龄无效: -5"
```

#### 4. 异常链与上下文

使用 `raise ... from ...` 保留异常链：

```python
try:
    int("abc")
except ValueError as e:
    raise RuntimeError("处理失败") from e

# 输出会显示：RuntimeError: 处理失败
# 原因是：ValueError: invalid literal for int() with base 10: 'abc'
```

#### 5. 常见内置异常类型

| 异常 | 说明 | 示例 |
| ---- | ---- | ---- |
| `TypeError` | 类型错误 | `"a" + 1` |
| `ValueError` | 值错误 | `int("abc")` |
| `IndexError` | 索引越界 | `lst[10]`（列表长度不足） |
| `KeyError` | 键不存在 | `dict["unknown_key"]` |
| `AttributeError` | 属性不存在 | `obj.unknown_attr` |
| `ZeroDivisionError` | 除零 | `10 / 0` |
| `FileNotFoundError` | 文件不存在 | `open("missing.txt")` |

---

### 模块与包

#### 1. 模块导入机制

**import 语句**：
```python
import math
print(math.sqrt(16))  # 4.0

from math import sqrt, pi
print(sqrt(16))  # 直接使用函数名

from math import *  # 导入所有（不推荐，污染命名空间）
```

**模块搜索路径**：
Python 按以下顺序查找模块：

1. 当前目录
2. `PYTHONPATH` 环境变量指定的目录
3. Python 安装目录的标准库
4. 第三方库目录（如 `site-packages`）

可通过 `sys.path` 查看：
```python
import sys
print(sys.path)
```

#### 2. 包的结构与 __init__.py

包是包含多个模块的目录，必须有 `__init__.py` 文件（Python 3.3+ 可以省略，但建议保留）：

```
mypackage/
 ├── __init__.py      # 包初始化文件
 ├── module1.py
 ├── module2.py
 └── subpackage/
      └── __init__.py
      └── module3.py
```

导入方式：
```python
import mypackage.module1
from mypackage import module2
from mypackage.subpackage.module3 import func
```

#### 3. 相对导入 vs 绝对导入

**绝对导入**：从顶层包开始导入
```python
from mypackage.subpackage import module3
```

**相对导入**：使用 `.` 表示当前包，`..` 表示上级包
```python
# 在 subpackage/module3.py 中
from . import module3      # 当前包
from .. import module1     # 上级包
```

相对导入只能在包内部使用，不能在顶层脚本中使用。

#### 4. __all__ 的作用

`__all__` 定义了使用 `from package import *` 时导入的内容：

```python
# __init__.py
__all__ = ["module1", "module2"]

# 调用方
from mypackage import *  # 只导入 module1 和 module2
```

#### 5. 常见标准库介绍

| 模块 | 功能 |
| ---- | ---- |
| `os` | 操作系统接口（文件、目录、路径） |
| `sys` | Python 运行时环境（路径、版本） |
| `re` | 正则表达式 |
| `json` | JSON 编解码 |
| `datetime` | 日期时间处理 |
| `collections` | 高级容器（Counter、defaultdict） |
| `itertools` | 迭代器工具 |
| `functools` | 函数工具（partial、lru_cache） |
| `random` | 随机数生成 |
| `logging` | 日志记录 |

---

### 内存管理与垃圾回收

#### 1. 引用计数机制⭐️

Python 主要通过**引用计数**管理内存。每个对象都有一个计数器，记录被引用的次数：

```python
import sys

a = [1, 2, 3]
print(sys.getrefcount(a))  # 2（a 引用 + getrefcount 参数引用）

b = a
print(sys.getrefcount(a))  # 3

del b
print(sys.getrefcount(a))  # 2
```

**引用计数增加的情况**：

- 对象被创建
- 对象被赋值给新变量
- 对象被传入函数
- 对象被放入容器

**引用计数减少的情况**：

- 变量被删除（`del`）
- 变量指向其他对象
- 函数执行结束
- 对象从容器中移除

当引用计数归零时，对象立即被回收。

**引用计数的缺点**：

- 无法处理循环引用（如 `a.b = b; b.a = a`）
- 频繁更新计数器有性能开销

#### 2. 垃圾回收算法⭐️⭐️

为解决循环引用问题，Python 引入了**标记清除（Mark-Sweep）**和**分代回收（Generational GC）**。

**标记清除**：

1. 从根对象（全局变量、栈变量等）开始遍历
2. 标记所有可达对象
3. 清除未标记的对象（不可达对象）

**分代回收**：

- 将对象分为三代：第 0 代（年轻）、第 1 代、第 2 代（老）
- 新对象放入第 0 代，经历多次回收后晋升到下一代
- 年轻代回收频率高，老年代回收频率低（因为老对象更稳定）

```python
import gc

# 查看 GC 配置
print(gc.get_threshold())  # (700, 10, 10)
# 含义：当第 0 代对象超过 700 个触发回收；
#       每 10 次第 0 代回收后触发第 1 代回收；
#       每 10 次第 1 代回收后触发第 2 代回收

# 手动触发 GC
gc.collect()
```

#### 3. GC 模块配置与调优

```python
import gc

# 禁用 GC（极端性能优化场景）
gc.disable()

# 重新启用
gc.enable()

# 手动触发回收，返回回收对象数
n = gc.collect()

# 查看当前各代对象数量
print(gc.get_count())  # (count0, count1, count2)
```

#### 4. 内存泄漏常见原因与排查

**常见内存泄漏原因**：

1. 循环引用且对象含有 `__del__` 方法
2. 全局列表/字典持续增长
3. 未关闭的文件、数据库连接
4. 使用 `ctypes` 调用 C 库时的内存管理问题

**排查方法**：
```python
import sys
import tracemalloc

# 启动内存追踪
tracemalloc.start()

# 代码执行...

# 查看内存占用前 10 的位置
snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')
for stat in top_stats[:10]:
    print(stat)
```

#### 5. 内存优化技巧

- 使用生成器替代列表处理大数据
- 及时删除不再需要的大对象
- 使用 `__slots__` 减少实例内存占用
- 避免循环引用或手动打破循环
- 使用 `weakref` 创建弱引用

```python
# __slots__ 示例：减少内存
class Point:
    __slots__ = ['x', 'y']  # 固定属性，不使用动态字典

p = Point()
p.x = 1
p.y = 2
# p.z = 3  # ❌ AttributeError（不能动态添加属性）
```

---

### 生成器与迭代器

#### 1. 迭代器协议⭐️

迭代器是实现了 `__iter__` 和 `__next__` 方法的对象：

```python
class MyIterator:
    def __init__(self, data):
        self.data = data
        self.index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.index >= len(self.data):
            raise StopIteration
        value = self.data[self.index]
        self.index += 1
        return value

for item in MyIterator([1, 2, 3]):
    print(item)  # 1, 2, 3
```

- `__iter__`：返回迭代器对象本身
- `__next__`：返回下一个元素，无更多元素时抛出 `StopIteration`

#### 2. 生成器与 yield 关键字⭐️

生成器是更简洁的迭代器，使用 `yield` 关键字：

```python
def my_generator(data):
    for item in data:
        yield item  # 每次返回一个值，暂停执行

gen = my_generator([1, 2, 3])
print(next(gen))  # 1
print(next(gen))  # 2
print(next(gen))  # 3
print(next(gen))  # ❌ StopIteration

# 或直接遍历
for item in my_generator([1, 2, 3]):
    print(item)
```

**yield 的特点**：

- 执行到 `yield` 时暂停并返回值
- 下次调用 `next()` 时从暂停处继续
- 函数结束时自动抛出 `StopIteration`

#### 3. 生成器表达式 vs 列表推导式

```python
# 列表推导式：立即生成完整列表
lst = [x ** 2 for x in range(1000000)]  # 占用大量内存

# 生成器表达式：惰性生成，逐个产出
gen = (x ** 2 for x in range(1000000))  # 内存占用极小
```

| 对比项 | 列表推导式 | 生成器表达式 |
| ------ | ---------- | ------------ |
| 语法 | `[...]` | `(...)` |
| 内存 | 全部加载 | 惰性生成 |
| 可复用 | ✅ 可多次遍历 | ❌ 只能遍历一次 |
| 适用场景 | 需要多次访问、索引 | 大数据流、单次遍历 |

#### 4. itertools 常用函数

```python
import itertools

# count：无限计数
for i in itertools.count(10, 2):  # 从10开始，步长2
    if i > 20:
        break
    print(i)  # 10, 12, 14, 16, 18, 20

# cycle：无限循环
for item in itertools.cycle(['A', 'B']):
    # 无限循环 'A', 'B', 'A', 'B'...
    pass

# repeat：重复元素
for item in itertools.repeat(10, 3):  # 重复10，共3次
    print(item)  # 10, 10, 10

# chain：连接多个迭代器
list(itertools.chain([1, 2], [3, 4]))  # [1, 2, 3, 4]

# islice：切片迭代器
list(itertools.islice(range(100), 5, 10))  # [5, 6, 7, 8, 9]
```

#### 5. 惰性求值优势

- **内存友好**：处理大数据时无需一次性加载
- **性能提升**：可以提前终止（如 `break`），节省计算
- **无限序列**：可以表示无限数据流

---

### 并发编程

#### 1. 多线程（threading 模块）⭐️

```python
import threading

def worker(n):
    for i in range(n):
        print(f"线程 {threading.current_thread().name}: {i}")

t1 = threading.Thread(target=worker, args=(5,))
t2 = threading.Thread(target=worker, args=(5,))

t1.start()
t2.start()

t1.join()  # 等待线程结束
t2.join()
```

**注意**：由于 GIL，Python 多线程无法真正并行执行 CPU 密集型任务，只适合 I/O 密集型任务。

#### 2. 多进程（multiprocessing 模块）⭐️

```python
import multiprocessing

def worker(n):
    for i in range(n):
        print(f"进程 {multiprocessing.current_process().name}: {i}")

if __name__ == '__main__':
    p1 = multiprocessing.Process(target=worker, args=(5,))
    p2 = multiprocessing.Process(target=worker, args=(5,))

    p1.start()
    p2.start()

    p1.join()
    p2.join()
```

多进程可以绕过 GIL，实现真正的并行，适合 CPU 密集型任务。

#### 3. 协程与异步编程（asyncio）⭐️⭐️

```python
import asyncio

async def fetch_data(name, delay):
    print(f"开始获取 {name}")
    await asyncio.sleep(delay)  # 模拟 I/O 等待
    print(f"完成获取 {name}")
    return f"{name} 的数据"

async def main():
    # 并发执行多个协程
    results = await asyncio.gather(
        fetch_data("A", 1),
        fetch_data("B", 2),
        fetch_data("C", 1),
    )
    print(results)

asyncio.run(main())
```

协程的特点：

- 单线程内实现并发
- 通过 `await` 主动让出控制权
- 适合大量 I/O 等待的场景（如网络请求）
- 比多线程更轻量（无线程切换开销）

#### 4. GIL（全局解释器锁）原理与影响⭐️⭐️

**GIL 是什么？**

GIL（Global Interpreter Lock）是 CPython 的一个互斥锁，确保同一时刻只有一个线程执行 Python 字节码。

**为什么需要 GIL？**

- CPython 的内存管理（引用计数）不是线程安全的
- 加锁简化了实现，避免了复杂的并发问题

**GIL 的影响：**

- 多线程无法利用多核 CPU 执行 CPU 密集型任务
- I/O 操作会释放 GIL，多线程适合 I/O 密集型任务
- 多进程可以绕过 GIL

**解决方案：**

- CPU 密集型：使用多进程
- I/O 密集型：使用多线程或协程

#### 5. 线程安全与锁机制

```python
import threading

counter = 0
lock = threading.Lock()

def increment():
    global counter
    for _ in range(10000):
        with lock:  # 使用锁保护共享资源
            counter += 1

threads = [threading.Thread(target=increment) for _ in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(counter)  # 100000（如果不加锁，结果会小于预期）
```

常用锁类型：

- `Lock`：基本互斥锁
- `RLock`：可重入锁（同一线程可多次获取）
- `Semaphore`：信号量（控制并发数量）
- `Event`：事件（线程间通知）

#### 6. 进程间通信方式

```python
import multiprocessing

# Queue：进程安全队列
def worker(q):
    q.put("来自子进程的消息")

if __name__ == '__main__':
    q = multiprocessing.Queue()
    p = multiprocessing.Process(target=worker, args=(q,))
    p.start()
    print(q.get())  # "来自子进程的消息"
    p.join()

# Pipe：管道通信（双向）
def worker(conn):
    conn.send("Hello")
    print(conn.recv())  # 接收父进程消息
    conn.close()

if __name__ == '__main__':
    parent_conn, child_conn = multiprocessing.Pipe()
    p = multiprocessing.Process(target=worker, args=(child_conn,))
    p.start()
    print(parent_conn.recv())  # "Hello"
    parent_conn.send("Hi")
    p.join()

# 共享内存：Value, Array
def worker(n):
    n.value += 1

if __name__ == '__main__':
    num = multiprocessing.Value('i', 0)  # 共享整数
    p = multiprocessing.Process(target=worker, args=(num,))
    p.start()
    p.join()
    print(num.value)  # 1
```

#### 7. concurrent.futures 模块

提供更简洁的并发接口：

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def task(n):
    return n ** 2

# 线程池
with ThreadPoolExecutor(max_workers=4) as executor:
    results = executor.map(task, range(10))
    print(list(results))  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 进程池
with ProcessPoolExecutor(max_workers=4) as executor:
    future = executor.submit(task, 10)
    print(future.result())  # 100
```

---

### 类型注解

#### 1. 类型注解语法（Python 3.5+）

```python
# 变量类型注解
name: str = "张三"
age: int = 25
scores: list[int] = [90, 85, 88]
info: dict[str, int] = {"a": 1, "b": 2}

# 函数类型注解
def greet(name: str) -> str:
    return f"Hello, {name}"

# 类属性注解
class Student:
    name: str
    age: int

    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age
```

#### 2. typing 模块常用类型

```python
from typing import List, Dict, Tuple, Set, Optional, Union, Any, Callable

# 基本容器类型（Python 3.9+ 可直接使用 list[int]）
names: List[str] = ["A", "B"]
scores: Dict[str, int] = {"A": 90}

# Optional：可能为 None
def find_user(id: int) -> Optional[str]:
    return None  # 或返回 str

# Union：多种类型
def process(value: Union[int, str]) -> int:
    return int(value)

# Callable：函数类型
def apply(func: Callable[[int], int], value: int) -> int:
    return func(value)

# Tuple：固定长度元组
point: Tuple[int, int, int] = (1, 2, 3)
```

#### 3. 类型检查工具

| 工具 | 说明 |
| ---- | ---- |
| **mypy** | 最流行的静态类型检查工具 |
| **pyright** | Microsoft 开发，速度快 |
| **pylint** | 代码检查，包含部分类型检查 |

使用示例：
```bash
pip install mypy
mypy my_script.py
```

#### 4. 泛型与类型变量

**泛型**允许编写可以处理多种类型的代码，同时保持类型安全。通过 `TypeVar` 定义类型变量，配合 `Generic` 创建泛型类。

**核心概念**：

- **TypeVar**：定义类型变量，表示一个待确定的类型
  - **Generic[T]**：声明类为泛型类，T 是类型参数
  - **类型参数传递**：实例化时指定具体类型，IDE 和类型检查器会进行类型推断

**应用场景**：容器类（如 Box、Stack）、工具函数、ORM 模型等需要处理多种类型的场景。

```python
from typing import TypeVar, Generic

T = TypeVar('T')  # 定义类型变量 T

class Box(Generic[T]):  # 声明泛型类，T 是类型参数
    def __init__(self, value: T):
        self.value = value

    def get(self) -> T:  # 返回类型与传入类型一致
        return self.value

# 使用时指定具体类型
int_box: Box[int] = Box(10)      # int_box.get() 返回 int
str_box: Box[str] = Box("hello")  # str_box.get() 返回 str
```

**常见泛型约束**：
```python
# 限制类型范围
T = TypeVar('T', bound=Number)      # T 必须是 Number 或其子类
K = TypeVar('K', str, bytes)        # K 只能是 str 或 bytes
```

---

### Python 新特性

#### 1. Python 3.8+ 新特性（海象运算符 :=）

海象运算符允许在表达式内部进行赋值：

```python
# 传统写法
n = len(data)
if n > 10:
    print(f"数据过长: {n}")

# 海象运算符写法
if (n := len(data)) > 10:
    print(f"数据过长: {n}")

# 在 while 循环中使用
lines = []
while (line := input("输入内容（空退出）: ")) != "":
    lines.append(line)
```

#### 2. Python 3.10+ 新特性（match-case 语句）

结构化模式匹配：

```python
def handle_command(cmd):
    match cmd:
        case ["quit"]:
            print("退出")
        case ["load", filename]:
            print(f"加载文件: {filename}")
        case ["save", filename, *options]:
            print(f"保存文件: {filename}, 选项: {options}")
        case ["move", direction] if direction in ["up", "down"]:
            print(f"移动方向: {direction}")
        case _:
            print("未知命令")

handle_command(["load", "data.txt"])  # 加载文件: data.txt
```

#### 3. Python 3.11+ 新特性

**性能大幅提升**：Python 3.11 比 3.10 快约 10-25%

**异常组与 except***：
```python
try:
    raise ExceptionGroup("多个错误", [
        ValueError("值错误"),
        TypeError("类型错误"),
    ])
except* ValueError as e:
    print(f"处理值错误: {e}")
except* TypeError as e:
    print(f"处理类型错误: {e}")
```

**更详细的错误信息**：错误回溯更精确地指向问题位置

#### 4. f-string 增强特性

Python 3.6 引入 f-string，后续版本持续增强：

```python
name = "张三"
age = 25

# 基本用法
print(f"我是{name}, {age}岁")

# 表达式
print(f"{name.upper()}")

# 格式化
print(f"{age:.2f}")
print(f"{1000:,}")  # "1,000"

# Python 3.8+: = 语法调试
print(f"{name=}, {age=}")  # "name='张三', age=25"
```

---

### 高级特性

#### 1. 推导式

```python
# 列表推导式
squares = [x ** 2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# 字典推导式
scores = {"A": 90, "B": 85, "C": 60}
passed = {k: v for k, v in scores.items() if v >= 60}

# 集合推导式
unique_lengths = {len(word) for word in ["hello", "world", "hi"]}
```

#### 2. 上下文管理器（with 语句）⭐️

用于自动管理资源的获取和释放：

```python
# 文件操作
with open("file.txt", "w") as f:
    f.write("内容")
# 文件自动关闭，无需手动 f.close()

# 自定义上下文管理器
class Timer:
    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"耗时: {time.time() - self.start}秒")

with Timer():
    # 执行代码
    time.sleep(1)
```

#### 3. 元类与类工厂

元类控制类的创建过程：

```python
class Meta(type):
    def __new__(cls, name, bases, attrs):
        print(f"创建类: {name}")
        attrs['class_id'] = name.lower()
        return super().__new__(cls, name, bases, attrs)

class MyClass(metaclass=Meta):
    pass

print(MyClass.class_id)  # "myclass"
```

#### 4. 描述器协议

描述器是实现了 `__get__`, `__set__`, `__delete__` 的对象，用于控制属性访问：

```python
class Validator:
    def __init__(self, min_value, max_value):
        self.min_value = min_value
        self.max_value = max_value

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, owner):
        return obj.__dict__[self.name]

    def __set__(self, obj, value):
        if not self.min_value <= value <= self.max_value:
            raise ValueError(f"{self.name}必须在 {self.min_value}-{self.max_value} 之间")
        obj.__dict__[self.name] = value

class Person:
    age = Validator(0, 150)

p = Person()
p.age = 25  # 正常
p.age = -1  # ❌ ValueError
```

#### 5. Python 中的反射⭐️

反射允许在运行时动态获取对象信息并操作对象：

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.__age = age  # 私有属性

    def greet(self):
        return f"Hello, {self.name}"

p = Person("张三", 25)

# 获取所有属性
print(dir(p))

# 动态获取属性
print (getattr(p, "name"))  # "张三"

# 动态设置属性
setattr(p, "name", "李四")

# 动态调用方法
method = getattr(p, "greet")
print(method())  # "Hello, 李四"

# 检查属性是否存在
print (hasattr(p, "name"))  # True

# 访问私有属性
print (getattr(p, "_Person__age"))  # 25

# 动态添加方法
setattr(p, "new_method", lambda: "新方法")
print(p.new_method())  # "新方法"
```

**常用反射函数：**

| 函数 | 说明 |
| ---- | ---- |
| `getattr(obj, name)` | 获取属性值 |
| `setattr(obj, name, value)` | 设置属性值 |
| `hasattr(obj, name)` | 检查属性是否存在 |
| `delattr(obj, name)` | 删除属性 |
| `dir(obj)` | 返回所有属性和方法列表 |
| `type(obj)` | 获取对象类型 |
| `obj.__dict__` | 获取实例属性字典 |
| `cls.__dict__` | 获取类属性和方法字典 |

**反射的应用场景：**

- 动态加载模块和调用方法
- 实现插件系统
- 序列化/反序列化（如 JSON 库）
- ORM 框架（如 SQLAlchemy）