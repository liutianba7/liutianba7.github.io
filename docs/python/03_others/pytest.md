# Pytest - Python 测试框架

## 一、简介

Pytest 是 Python 最流行的测试框架，简洁强大，支持参数化测试、夹具（fixtures）等高级功能。

### 1.1 安装

```bash
pip install pytest
pip install pytest-cov       # 覆盖率插件
pip install pytest-xdist     # 并行测试
```

### 1.2 特点

- 语法简洁，无需继承测试类
- 自动发现测试文件和测试函数
- 强大的夹具系统
- 丰富的插件生态
- 详细的断言信息

---

## 二、基础用法

### 2.1 编写测试

```python
# test_calc.py

def add(a, b):
    return a + b

def test_add():
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

def test_add_floats():
    result = add(0.1, 0.2)
    assert result == pytest.approx(0.3)  # 浮点数近似比较
```

### 2.2 运行测试

```bash
# 运行当前目录所有测试
pytest

# 运行指定文件
pytest test_calc.py

# 运行指定测试函数
pytest test_calc.py::test_add

# 运行指定类中的测试
pytest test_calc.py::TestCalculator::test_add

# 显示详细信息
pytest -v
pytest -vv  # 更详细

# 显示 print 输出
pytest -s

# 只运行失败的测试
pytest --lf

# 遇到失败即停止
pytest -x

# 并行运行
pytest -n 4
```

### 2.3 测试发现规则

- 文件名以 `test_*.py` 或 `*_test.py`
- 类名以 `Test` 开头（不含 `__init__`）
- 函数名以 `test_` 开头

---

## 三、断言

### 3.1 基本断言

```python
def test_assertions():
    # 相等性
    assert 1 == 1
    assert 1 != 2

    # 比较
    assert 1 < 2
    assert 1 <= 2
    assert 2 > 1
    assert 2 >= 1

    # 包含
    assert 1 in [1, 2, 3]
    assert 'a' not in 'xyz'

    # 布尔值
    assert True
    assert not False

    # 类型
    assert isinstance(1, int)
```

### 3.2 异常断言

```python
import pytest

def divide(a, b):
    if b == 0:
        raise ValueError("Division by zero")
    return a / b

def test_divide_by_zero():
    with pytest.raises(ValueError) as excinfo:
        divide(1, 0)
    assert "Division by zero" in str(excinfo.value)

def test_divide_by_zero_match():
    with pytest.raises(ValueError, match="Division by zero"):
        divide(1, 0)
```

### 3.3 警告断言

```python
import warnings

def test_warning():
    with pytest.warns(UserWarning):
        warnings.warn("This is a warning", UserWarning)

def test_warning_match():
    with pytest.warns(UserWarning, match="warning"):
        warnings.warn("This is a warning", UserWarning)
```

---

## 四、夹具（Fixtures）

### 4.1 基本夹具

```python
import pytest

@pytest.fixture
def sample_data():
    return [1, 2, 3, 4, 5]

def test_sum(sample_data):
    assert sum(sample_data) == 15

def test_len(sample_data):
    assert len(sample_data) == 5
```

### 4.2 夹具作用域

```python
@pytest.fixture(scope="function")  # 默认，每个测试函数调用一次
def func_fixture():
    return "function"

@pytest.fixture(scope="class")  # 每个测试类调用一次
def class_fixture():
    return "class"

@pytest.fixture(scope="module")  # 每个模块调用一次
def module_fixture():
    return "module"

@pytest.fixture(scope="session")  # 每个会话调用一次
def session_fixture():
    return "session"

@pytest.fixture(scope="package")  # 每个包调用一次
def package_fixture():
    return "package"
```

### 4.3 夹具清理

```python
@pytest.fixture
def database():
    # setup
    db = connect_database()
    yield db
    # teardown
    db.close()

@pytest.fixture
def temp_file():
    # setup
    file = open("temp.txt", "w")
    yield file
    # teardown
    file.close()
    import os
    os.remove("temp.txt")
```

### 4.4 夹具依赖

```python
@pytest.fixture
def db_connection():
    return {"connection": "active"}

@pytest.fixture
def db_cursor(db_connection):
    return {"cursor": "ready", "connection": db_connection}

def test_cursor(db_cursor):
    assert db_cursor["cursor"] == "ready"
```

### 4.5 自动使用夹具

```python
@pytest.fixture(autouse=True)
def setup_and_teardown():
    # 每个测试前执行
    print("\nSetup")
    yield
    # 每个测试后执行
    print("\nTeardown")
```

---

## 五、参数化测试

### 5.1 基本参数化

```python
@pytest.mark.parametrize("input,expected", [
    (1, 1),
    (2, 4),
    (3, 9),
    (4, 16),
])
def test_square(input, expected):
    assert input ** 2 == expected
```

### 5.2 多参数参数化

```python
@pytest.mark.parametrize("a,b,expected", [
    (1, 2, 3),
    (2, 3, 5),
    (10, 20, 30),
])
def test_add(a, b, expected):
    assert a + b == expected
```

### 5.3 参数化结合夹具

```python
@pytest.fixture
def calculator():
    return Calculator()

@pytest.mark.parametrize("a,b,expected", [
    (1, 2, 3),
    (5, 5, 10),
])
def test_calculator_add(calculator, a, b, expected):
    assert calculator.add(a, b) == expected
```

### 5.4 多层参数化

```python
@pytest.mark.parametrize("x", [1, 2])
@pytest.mark.parametrize("y", [10, 20])
def test_multiply(x, y):
    # 会运行 4 次: (1,10), (1,20), (2,10), (2,20)
    pass
```

---

## 六、标记（Markers）

### 6.1 内置标记

```python
import pytest

# 跳过测试
@pytest.mark.skip(reason="Not implemented yet")
def test_feature():
    pass

# 条件跳过
@pytest.mark.skipif(sys.version_info < (3, 8), reason="Requires Python 3.8+")
def test_new_feature():
    pass

# 预期失败
@pytest.mark.xfail(reason="Known bug")
def test_buggy_feature():
    assert 1 == 2
```

### 6.2 自定义标记

```python
# 注册标记（pytest.ini 或 pyproject.toml）
# [tool.pytest.ini_options]
# markers =
#     slow: marks tests as slow
#     integration: marks tests as integration tests

@pytest.mark.slow
def test_slow_operation():
    import time
    time.sleep(5)

@pytest.mark.integration
def test_database():
    pass

# 运行特定标记的测试
# pytest -m slow
# pytest -m "not slow"
# pytest -m "slow and integration"
```

---

## 七、测试类

```python
class TestCalculator:

    @pytest.fixture(autouse=True)
    def setup(self):
        self.calc = Calculator()

    def test_add(self):
        assert self.calc.add(1, 2) == 3

    def test_subtract(self):
        assert self.calc.subtract(5, 3) == 2

    @pytest.mark.parametrize("a,b,expected", [
        (2, 3, 6),
        (0, 5, 0),
    ])
    def test_multiply(self, a, b, expected):
        assert self.calc.multiply(a, b) == expected
```

---

## 八、覆盖率报告

```bash
# 安装
pip install pytest-cov

# 运行并生成覆盖率报告
pytest --cov=myproject
pytest --cov=myproject --cov-report=html
pytest --cov=myproject --cov-report=xml

# 显示缺失的行
pytest --cov=myproject --cov-report=term-missing
```

---

## 九、配置文件

### 9.1 pytest.ini

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*

addopts = -v --tb=short
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests

filterwarnings =
    ignore::DeprecationWarning
```

### 9.2 pyproject.toml

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = "-v --tb=short"
markers = [
    "slow: marks tests as slow",
    "integration: marks tests as integration tests",
]
```

### 9.3 conftest.py

```python
# conftest.py 用于共享夹具和钩子

import pytest

@pytest.fixture(scope="session")
def test_config():
    return {"env": "test"}

# 钩子函数
def pytest_collection_modifyitems(config, items):
    # 修改收集的测试项
    pass

def pytest_runtest_setup(item):
    # 测试运行前的钩子
    pass
```

---

## 十、常用插件

| 插件 | 功能 |
|------|------|
| `pytest-cov` | 代码覆盖率 |
| `pytest-xdist` | 并行测试 |
| `pytest-mock` | Mock 支持 |
| `pytest-asyncio` | 异步测试 |
| `pytest-django` | Django 测试 |
| `pytest-flask` | Flask 测试 |
| `pytest-benchmark` | 性能基准测试 |
| `pytest-timeout` | 测试超时 |
| `pytest-rerunfailures` | 失败重跑 |

```bash
# 安装常用插件
pip install pytest-cov pytest-xdist pytest-mock pytest-asyncio
```