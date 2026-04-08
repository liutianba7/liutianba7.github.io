# FastAPI 笔记

> 📖 官方文档：[FastAPI 官方文档（中文）](https://fastapi.tiangolo.com/zh/)

## 1. 快速入门

> 📖 官方文档：[First Steps - 第一步](https://fastapi.tiangolo.com/zh/tutorial/first-steps/)

### 1.1 安装

=== "pip"

    ```bash title="安装 FastAPI"
    pip install "fastapi[standard]"
    ```

=== ":material-rocket-launch: uv"

    ```bash title="安装 FastAPI (推荐)"
    uv add "fastapi[standard]"
    ```

`[standard]` 会自动安装 uvicorn、pydantic 等常用依赖。

### 1.2 第一个程序

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
```

### 1.3 启动方式

**方式一：FastAPI CLI（推荐开发环境）**
```bash
fastapi dev main.py
```

- 自动开启热重载（Hot Reload）
- 启动后访问 `http://127.0.0.1:8000/docs` 查看交互式文档

**方式二：Uvicorn（更灵活）**
```bash
uvicorn main:app --reload
```

- `main`：文件名 `main.py`
- `app`：变量名 `app = FastAPI()`
- `--reload`：开发模式，代码变动自动生效

### 1.4 自动文档

FastAPI 自动生成两个交互式文档：

- **Swagger UI**：`http://127.0.0.1:8000/docs`
- **ReDoc**：`http://127.0.0.1:8000/redoc`

---

## 2. 路径操作与参数

> 📖 官方文档：[Path Parameters](https://fastapi.tiangolo.com/zh/tutorial/path-params/) | [Query Parameters](https://fastapi.tiangolo.com/zh/tutorial/query-params/) | [Request Body](https://fastapi.tiangolo.com/zh/tutorial/body/)

### 2.1 路由基础

路由 = **路径 (Path)** + **HTTP 方法 (Operation)** + **处理函数 (Function)**

```python
@app.get("/hello")           # 装饰器：定义方法和路径
async def say_hello():       # 函数：业务逻辑
    return {"message": "你好，FastAPI"}
```

### 2.2 路径参数 (Path Parameters)

> 📖 官方文档：[Path Parameters - 路径参数](https://fastapi.tiangolo.com/zh/tutorial/path-params/)

使用 `{}` 包裹变量名，FastAPI 自动提取并传递给函数：

```python
@app.get("/users/{user_id}")
async def get_user(user_id: int):  # 类型注解自动校验
    return {"user_id": user_id}
```

- 访问 `/users/10` → `{"user_id": 10}`
- 访问 `/users/foo` → 自动报错（非整数）

⭐ **路由匹配顺序**：更具体的路径写在前面

```python
@app.get("/users/me")              # 具体的写上面
async def read_user_me():
    return {"user_id": "当前登录用户"}

@app.get("/users/{user_id}")       # 通用的写下面
async def read_user(user_id: str):
    return {"user_id": user_id}
```

### 2.3 查询参数 (Query Parameters)

> 📖 官方文档：[Query Parameters - 查询参数](https://fastapi.tiangolo.com/zh/tutorial/query-params/)

URL 中 `?` 后面的键值对，函数参数中不属于路径占位符的变量自动识别为查询参数：

```python
@app.get("/items/")
async def read_items(skip: int = 0, limit: int = 10):
    # 访问示例：/items/?skip=20&limit=50
    return {"skip": skip, "limit": limit}
```

- 有默认值 → 可选参数
- 无默认值 → 必选参数
- `Optional[str] = None` → 可选且默认为 None

### 2.4 参数校验详解

> 📖 官方文档：[Path Params Numeric Validations](https://fastapi.tiangolo.com/zh/tutorial/path-params-numeric-validations/) | [Query Params and String Validations](https://fastapi.tiangolo.com/zh/tutorial/query-params-str-validations/)

#### 2.4.1 校验参数一览

!!! tip "Python 3.10+ 推荐"
    更推荐使用 `Annotated` 写法，详见 [2.4.4 Annotated 写法](#244-annotated-写法)。

| 参数 | 说明 | 适用类型 |
|------|------|----------|
| `gt` / `ge` | 大于 / 大于等于 | 数字 |
| `lt` / `le` | 小于 / 小于等于 | 数字 |
| `min_length` | 最小长度 | 字符串/列表 |
| `max_length` | 最大长度 | 字符串/列表 |
| `pattern` | 正则匹配 | 字符串 |
| `alias` | 参数别名 | 所有 |
| `title` | 参数标题（文档显示） | 所有 |
| `description` | 参数描述 | 所有 |

#### 2.4.2 路径参数校验 `Path()`

```python
from fastapi import FastAPI, Path

@app.get("/items/{item_id}")
async def read_items(
    item_id: int = Path(..., title="项目ID", ge=1, le=1000)
):
    return {"item_id": item_id}
```

- `...` (Ellipsis) 表示必填（路径参数本身就是必填，写上是为了符合语法规范）
- `*` 可用于强制后续参数使用关键字形式：`async def read_items(*, item_id: int = Path(...))`

#### 2.4.3 查询参数校验 `Query()`

```python
from fastapi import Query

@app.get("/items/")
async def read_items(
    q: str | None = Query(
        default=None,
        min_length=3,
        max_length=50,
        pattern="^fixedquery$",
        description="搜索关键词"
    )
):
    return {"q": q}
```

**指定别名**（解决 Python 变量名不支持中划线问题）：

```python
@app.get("/users/")
async def read_users(
    user_id: str = Query(None, alias="user-id")
):
    # 客户端访问：/users/?user-id=123
    return {"user_id": user_id}
```

#### 2.4.4 Annotated 写法

> 📖 官方文档：[Annotated 参数](https://fastapi.tiangolo.com/zh/tutorial/query-params-str-validations/#_1)

新版本推荐使用 `Annotated` 进行数据校验，相比直接使用 `Query()` 有以下优势：

| 写法 | 优点 | 缺点 |
|------|------|------|
| `q: str = Query(...)` | 简洁 | 默认值和校验规则分离，IDE 提示不友好 |
| `q: Annotated[str, Query(...)]` | 类型信息完整，IDE 提示准确 | 需要额外导入 `Annotated` |

**基本用法**：

```python
from typing import Annotated
from fastapi import Query

# 校验规则放在 Annotated 中，默认值放在参数最后
@app.get('/items/')
async def read_items(
    skip: Annotated[int, Query(ge=0, description='跳过的记录数')] = 0,
    limit: Annotated[int, Query(le=100, description='返回的最大数量')] = 10,
):
    return {'skip': skip, 'limit': limit}
```

**新旧写法对比**：

```python
# 旧写法：默认值在 Query 中，类型与校验分离
q: str = Query(default=None, min_length=3, max_length=50)

# 新写法：类型、校验、默认值位置清晰
q: Annotated[str | None, Query(min_length=3, max_length=50)] = None
```

**完整示例**（包含常用校验参数）：

```python
@app.get("/users/")
async def read_users(
    user_id: Annotated[str | None, Query(
        alias="user-id",           # 别名：解决参数名含中划线问题
        min_length=3,              # 最小长度
        max_length=50,             # 最大长度
        pattern="^[a-zA-Z0-9]+$",  # 正则匹配
        description="用户唯一标识", # API 文档描述
        deprecated=True,           # 标记为已废弃
    )] = None,
):
    return {"user_id": user_id}
```

> ⚠️ **注意**：`Annotated` 中的 `Query()` **不能有 `default` 参数**，默认值必须写在参数列表最后。

#### 2.4.5 [自定义校验逻辑](https://fastapi.tiangolo.com/zh/tutorial/query-params-str-validations/#custom-validation)

有些情况下你需要做一些无法通过上述参数完成的**自定义校验**。这些情况下，你可以使用**自定义校验函数**，该函数会在正常校验之后应用（例如，在先校验值是 `str` 之后）。

```
# 自定义校验逻辑
app = FastAPI()

def is_even(value: int):
    if value % 2 != 0:
        raise ValueError('必须是偶数')
    return value

@app.get('/items/')
async def get_person(
        q:Annotated[int, AfterValidator(is_even)]
):
    return {'q' : q}
```

### 2.5 请求体参数 (Request Body)

> 📖 官方文档：[Request Body - 请求体](https://fastapi.tiangolo.com/zh/tutorial/body/) | [Body - Multiple Parameters](https://fastapi.tiangolo.com/zh/tutorial/body-multiple-params/) | [Body - Fields](https://fastapi.tiangolo.com/zh/tutorial/body-fields/)

POST/PUT 请求通常使用 JSON 格式的请求体，需定义 Pydantic 模型：

```python
from pydantic import BaseModel, Field

class Book(BaseModel):
    title: str
    author: str
    price: float
    is_published: bool | None = None  # 可选字段

@app.post("/books/")
async def create_book(book: Book):
    return {"message": "书籍已创建", "data": book}
```

- **自动解析**：JSON → Python 对象，可通过 `book.title` 访问
- **自动校验**：类型不符自动拦截报错

**使用 `Field` 进行字段校验**：

```python
class Book(BaseModel):
    title: str = Field(..., min_length=2, max_length=20, title="书名")
    price: float = Field(..., gt=0, description="价格必须大于零")
    tags: list[str] = Field(default=[], max_items=3)
```

### 2.6 表单数据 (Form Data)

> 📖 官方文档：[Request Forms - 表单数据](https://fastapi.tiangolo.com/zh/tutorial/request-forms/)

接收 HTML 表单提交的数据（非 JSON）：

```python
from fastapi import Form

@app.post("/login/")
async def login(username: str = Form(...), password: str = Form(...)):
    return {"username": username}
```

⭐ **Form vs Body**：

- `Form`：`Content-Type: application/x-www-form-urlencoded`
- `Body`（Pydantic）：`Content-Type: application/json`

### 2.7 文件上传

> 📖 官方文档：[Request Files - 文件上传](https://fastapi.tiangolo.com/zh/tutorial/request-files/)

#### 2.7.1 单文件上传

```python
from fastapi import FastAPI, File, UploadFile

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # UploadFile 提供文件名、类型等信息
    content = await file.read()
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(content)
    }
```

#### 2.7.2 多文件上传

```python
@app.post("/upload-many/")
async def upload_many(files: list[UploadFile] = File(...)):
    return {"filenames": [f.filename for f in files]}
```

#### 2.7.3 保存上传文件

```python
import shutil

@app.post("/upload-save/")
async def upload_save(file: UploadFile = File(...)):
    save_path = f"./uploads/{file.filename}"
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"saved": save_path}
```

### 2.8 请求头参数 (Header)

> 📖 官方文档：[Header Parameters - 请求头参数](https://fastapi.tiangolo.com/zh/tutorial/header-params/)

```python
from fastapi import Header

@app.get("/items/")
async def read_items(
    user_agent: str | None = Header(None),
    token: str = Header(None, alias="Authorization")
):
    return {"User-Agent": user_agent, "Token": token}
```

⭐ 注意：必须显式使用 `Header()`，否则会被误认为查询参数。

### 2.9 Cookie 参数

> 📖 官方文档：[Cookie Parameters - Cookie 参数](https://fastapi.tiangolo.com/zh/tutorial/cookie-params/)

```python
from fastapi import Cookie

@app.get("/items/")
async def read_items(session_id: str | None = Cookie(None)):
    return {"session_id": session_id}
```

---

## 3. 响应处理

> 📖 官方文档：[Response Model](https://fastapi.tiangolo.com/zh/tutorial/response-model/) | [Response Status Code](https://fastapi.tiangolo.com/zh/tutorial/response-status-code/) | [Custom Response](https://fastapi.tiangolo.com/zh/advanced/custom-response/)

### 3.1 响应模型 (response_model) ⭐⭐⭐

FastAPI 杀手锏，用于：

- **过滤敏感数据**（如密码字段）
- **数据转换**（ORM → JSON）
- **自动校验**（确保返回数据符合预期）

```python
from pydantic import BaseModel, EmailStr

class UserIn(BaseModel):
    username: str
    password: str      # 输入时需要密码
    email: EmailStr

class UserOut(BaseModel):
    username: str
    email: EmailStr    # 响应时不含密码

@app.post("/user/", response_model=UserOut)
async def create_user(user: UserIn):
    # FastAPI 自动过滤掉 password 字段
    return user
```

### 3.2 响应状态码

```python
from fastapi import status

@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(name: str):
    return {"name": name}
```

常用状态码：

- `200`：成功（默认）
- `201`：创建成功
- `204`：无内容（删除成功）
- `400`：请求错误
- `401`：未授权
- `404`：资源不存在
- `500`：服务器错误

### 3.3 响应类型 (response_class)

| 响应类                 | 用途      | Content-Type       |
| ------------------- | ------- | ------------------ |
| `JSONResponse` (默认) | JSON 数据 | `application/json` |
| `HTMLResponse`      | HTML 页面 | `text/html`        |
| `PlainTextResponse` | 纯文本     | `text/plain`       |
| `RedirectResponse`  | URL 跳转  | 状态码 3xx            |
| `FileResponse`      | 文件下载    | 自动识别               |
| `StreamingResponse` | 流式响应    | 自定义                |

#### JSONResponse

默认响应类型，但需要自定义状态码或响应头时需显式使用：

```python
from fastapi.responses import JSONResponse

@app.get("/json")
async def get_json():
    # 自定义状态码和响应头
    return JSONResponse(
        content={"message": "Hello", "data": [1, 2, 3]},
        status_code=200,
        headers={
            "X-Custom-Header": "Custom-Value",
            "X-Request-Id": "12345"
        }
    )
```

⭐ **适用场景**：需要自定义响应头（如 CORS、认证信息）或返回非默认状态码时。

#### HTMLResponse

返回动态生成的 HTML 内容，适合模板渲染或简单页面：

```python
from fastapi.responses import HTMLResponse

@app.get("/html", response_class=HTMLResponse)
async def get_html():
    html_content = """
    <!DOCTYPE html>
    <html>
    <head><title>Demo</title></head>
    <body>
        <h1>Hello FastAPI</h1>
        <p>动态生成的 HTML 内容</p>
    </body>
    </html>
    """
    return html_content  # response_class 已指定，直接返回字符串
```

⭐ **适用场景**：动态生成 HTML 片段、返回错误页面、配合模板引擎（如 Jinja2）。

#### PlainTextResponse

返回纯文本，`Content-Type: text/plain`：

```python
from fastapi.responses import PlainTextResponse

@app.get("/text", response_class=PlainTextResponse)
async def get_text():
    return """日志输出示例
========================
1. 第一行
2. 第二行
"""
```

⭐ **适用场景**：返回日志文件、配置文件内容、纯文本消息。

#### RedirectResponse

URL 重定向，关键在于状态码的选择：

| 状态码 | 类型 | 适用场景 |
|-----|------|---------|
| `301` | 永久重定向 | URL 结构变更，SEO 友好 |
| `302` | 临时重定向 | 旧标准，浏览器可能改为 GET |
| `303` | 临时重定向 | POST 后重定向到 GET（经典 PRG 模式） |
| `307` | 临时重定向 | **保留原请求方法和 body** |
| `308` | 永久重定向 | **保留原请求方法和 body** |

```python
from fastapi.responses import RedirectResponse

@app.get("/redirect")
async def redirect_to_json():
    # 307: 临时重定向，保留原请求方法（GET 还是 GET，POST 还是 POST）
    return RedirectResponse(url="/json", status_code=307)

@app.post("/redirect-after-post")
async def redirect_after_post():
    # 303: POST 后重定向为 GET（防止表单重复提交）
    return RedirectResponse(url="/success", status_code=303)
```

⭐ **核心区别**：`307/308` 严格保留原请求方法，`302/303` 可能改变方法。

#### FileResponse

直接返回文件供下载，自动处理 `Content-Type` 和文件名：

```python
from fastapi.responses import FileResponse

@app.get("/download")
async def download_file():
    return FileResponse(
        path="./data/report.pdf",        # 文件路径
        filename="月度报告.pdf",           # 下载时显示的文件名
        media_type="application/pdf"     # 可选，默认自动推断
    )
```

⭐ **特性**：

- 支持断点续传（Range 请求）
- 自动设置 `Content-Disposition` 头
- 适合小文件，大文件推荐 `StreamingResponse`

### 3.4 StreamingResponse 流式响应

> 📖 官方文档：[Custom Response - StreamingResponse](https://fastapi.tiangolo.com/zh/advanced/custom-response/#streamingresponse)

流式响应通过生成器（Generator）逐块返回数据，避免一次性加载全部内容到内存。

#### 3.4.1 基本用法

使用 `async` 生成器函数作为 `content` 参数：

```python
from fastapi.responses import StreamingResponse

async def generate_data():
    """生成器：逐块产出数据"""
    for i in range(10):
        yield f"数据块 {i}\n".encode("utf-8")  # 必须返回 bytes

@app.get("/stream")
async def stream_data():
    return StreamingResponse(
        content=generate_data(),
        media_type="text/plain",
        headers={"X-Stream-Type": "demo"}
    )
```

⭐ **关键细节**：

- `content` 必须是**异步生成器**（`async def` + `yield`）
- `yield` 返回 `bytes` 类型（编码后）
- 可自定义 `media_type` 和响应头

#### 3.4.2 大文件流式下载

大文件下载的核心问题：**一次性读取会撑爆内存**。解决方案是使用**迭代器逐块读取**：

```python
async def file_iterator(file_path: str, chunk_size: int = 1024):
    """文件迭代器：逐块读取，避免内存溢出"""
    with open(file_path, "rb") as f:
        while chunk := f.read(chunk_size):  # 每次只读 chunk_size 字节
            yield chunk

@app.get("/stream/file")
async def stream_large_file():
    return StreamingResponse(
        content=file_iterator("./large_file.zip"),
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": "attachment; filename=large_file.zip"
        }
    )
```

⭐ **实现思路**：

- 使用 `while chunk := f.read(chunk_size)` 循环读取
- `chunk_size` 可根据文件大小调整（通常 1KB - 64KB）
- 内存占用恒定，与文件大小无关 

#### 3.4.3 SSE 实时推送（Server-Sent Events）

SSE 是一种**单向实时推送**技术，服务端持续向客户端发送消息，客户端通过 `EventSource` API 接收。

**SSE 协议格式**（必须严格遵守）：

```
data: 消息内容\n\n
```

每条消息以 `data:` 开头，以两个换行符 `\n\n` 结束。

```python
@app.get("/stream/sse")
async def sse_stream():
    async def sse_generator():
        messages = ["第一条消息", "第二条消息", "第三条消息"]
        for msg in messages:
            # SSE 格式: data: 内容\n\n
            yield f"data: {msg}\n\n".encode("utf-8")

    return StreamingResponse(
        content=sse_generator(),
        media_type="text/event-stream",  # SSE 专用 MIME
        headers={
            "Cache-Control": "no-cache",   # 禁止缓存
            "Connection": "keep-alive"     # 保持连接
        }
    )
```

**客户端接收示例**：

```javascript
const eventSource = new EventSource('/stream/sse');

eventSource.onmessage = (event) => {
    console.log('收到消息:', event.data);
};

eventSource.onerror = (error) => {
    console.error('连接错误:', error);
    eventSource.close();
};
```

⭐ **SSE vs WebSocket**：

| 特性   | SSE           | WebSocket |
| ---- | ------------- | --------- |
| 方向   | 单向（服务端 → 客户端） | 双向        |
| 协议   | HTTP          | WS（独立协议）  |
| 断线重连 | **浏览器自动重连**   | 需手动实现     |
| 适用场景 | 推送通知、实时数据     | 聊天、游戏     |

---

## 4. 异常处理

> 📖 官方文档：[Handling Errors - 异常处理](https://fastapi.tiangolo.com/zh/tutorial/handling-errors/)

向客户端返回错误提示时，通常使用 **4XX（400-499）HTTP 状态码**，表示客户端发生了错误（如权限不足、资源不存在等）。

### 4.1 HTTPException

`HTTPException` 是包含 API 相关数据的常规 Python 异常，**不能 return，只能 raise**。

!!! tip "核心区别：return vs raise"
    - `return`：正常结束，返回 200 OK
    - `raise HTTPException`：立即中断，后续代码不执行，返回指定错误响应

**基本用法**：

```python
from fastapi import FastAPI, HTTPException

app = FastAPI()
items = {"foo": "The Foo Wrestlers"}

@app.get("/items/{item_id}")
async def read_item(item_id: str):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item": items[item_id]}
```

**响应结果**：

- 请求 `/items/foo` → 状态码 200，响应：`{"item": "The Foo Wrestlers"}`
- 请求 `/items/bar`（不存在）→ 状态码 404，响应：`{"detail": "Item not found"}`

!!! note "detail 参数"
    `detail` 参数可传递**任意 JSON 可序列化数据**，不仅限于 `str`：

    ```python
    raise HTTPException(
        status_code=404,
        detail={"error": "not_found", "item_id": item_id, "suggestions": ["foo", "bar"]}
    )
    ```

    FastAPI 会自动将其转换为 JSON。

**自定义响应头**（如 OAuth2 认证失败）：

```python
@app.get("/secure-data")
async def get_secure_data(token: str | None = None):
    if not token:
        raise HTTPException(
            status_code=401,
            detail="未授权",
            headers={"WWW-Authenticate": "Bearer"}  # OAuth2 标准响应头
        )
    return {"data": "秘密内容"}
```

### 4.2 自定义异常处理器

当需要统一处理业务异常时，可以定义自定义异常并注册全局处理器。

**定义业务异常**：

```python
class UnicornException(Exception):
    def __init__(self, name: str):
        self.name = name
```

**注册处理器（两种写法）**：

```python
from fastapi import Request
from fastapi.responses import JSONResponse

# 写法一：装饰器（推荐）
@app.exception_handler(UnicornException)
async def unicorn_exception_handler(request: Request, exc: UnicornException):
    return JSONResponse(
        status_code=418,
        content={"message": f"Oops! {exc.name} did something."}
    )

# 写法二：函数式注册
# app.add_exception_handler(UnicornException, unicorn_exception_handler)
```

**触发异常**：

```python
@app.get("/unicorns/{name}")
async def read_unicorn(name: str):
    if name == "yolo":
        raise UnicornException(name=name)
    return {"unicorn_name": name}
```

请求 `/unicorns/yolo` 时，返回状态码 418，响应：`{"message": "Oops! yolo did something."}`

!!! warning "异常处理器的执行时机"
    异常处理器会捕获**整个应用**中触发的该类型异常，包括：

    - 路径操作函数内部
    - 依赖函数内部
    - 中间件内部

    因此，`raise` 异常后，后续代码不会执行。

### 4.3 覆盖默认异常处理器

FastAPI 内置了默认异常处理器，用于处理 `HTTPException` 和请求验证错误。可以用自定义处理器覆盖它们。

#### 4.3.1 请求验证异常处理器

当请求包含无效数据时，FastAPI 内部触发 `RequestValidationError`。

**默认响应格式**：

```json
{
    "detail": [
        {
            "loc": ["path", "item_id"],
            "msg": "value is not a valid integer",
            "type": "type_error.integer"
        }
    ]
}
```

**自定义处理器**（返回纯文本格式）：

```python
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # 提取错误信息，格式化输出
    message = "Validation errors:"
    for error in exc.errors():
        message += f"\nField: {error['loc']}, Error: {error['msg']}"
    return PlainTextResponse(message, status_code=400)
```

!!! tip "exc.body 获取原始请求体"
    `RequestValidationError` 包含接收到的原始请求体，可用于调试：

    ```python
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={
                "detail": exc.errors(),  # 错误详情
                "body": exc.body         # 原始请求体
            }
        )
    ```

    这样客户端能看到发送的数据和具体的错误位置。

#### 4.3.2 HTTPException 处理器

覆盖 `HTTPException` 处理器时，需要使用 **Starlette 的 HTTPException**：

```python
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import PlainTextResponse

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)
```

!!! warning "为什么用 StarletteHTTPException？"
    FastAPI 的 `HTTPException` 继承自 Starlette 的 `HTTPException`，但有以下区别：

    | 版本 | detail 参数 |
    |-----|------------|
    | FastAPI `HTTPException` | 支持任意 JSON 可序列化数据 |
    | Starlette `HTTPException` | 仅支持字符串 |

    注册处理器时必须用 **StarletteHTTPException**，才能捕获：

    - FastAPI 代码触发的 `HTTPException`
    - Starlette 内部触发的 `HTTPException`
    - 第三方插件触发的 `HTTPException`

#### 4.3.3 复用默认处理器

如果想在自定义处理后仍使用 FastAPI 的默认处理器，可以导入并调用：

```python
from fastapi.exception_handlers import (
    http_exception_handler,
    request_validation_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    # 先记录日志等自定义处理
    print(f"HTTP error occurred: {repr(exc)}")
    # 再调用默认处理器返回响应
    return await http_exception_handler(request, exc)

@app.exception_handler(RequestValidationError)
async def custom_validation_handler(request: Request, exc: RequestValidationError):
    # 先记录日志
    print(f"Validation error: {exc}")
    # 再调用默认处理器
    return await request_validation_exception_handler(request, exc)
```

---

## 5. 依赖注入

> 📖 官方文档：[Dependencies - 依赖注入](https://fastapi.tiangolo.com/zh/tutorial/dependencies/) | [Dependencies with yield](https://fastapi.tiangolo.com/zh/tutorial/dependencies/dependencies-with-yield/) | [Global Dependencies](https://fastapi.tiangolo.com/zh/tutorial/dependencies/global-dependencies/)

依赖注入是一种设计模式：**"你的函数需要什么，就声明什么，FastAPI 负责帮你取来。"**

**核心优势**：

| 优势 | 说明 |
|-----|------|
| 减少重复代码 | 公共逻辑（如数据库连接、认证）只需编写一次 |
| 解耦 | 业务逻辑与资源获取分离 |
| 易于测试 | 可轻松替换依赖（如 Mock 数据库） |
| 自动文档 | 依赖的参数自动出现在 OpenAPI 文档中 |

### 5.1 基础用法

> 📖 官方文档：[First Steps](https://fastapi.tiangolo.com/zh/tutorial/dependencies/first-steps/)

**依赖函数**：一个普通的 Python 函数，返回值会注入到路径操作中。

```python
from fastapi import Depends

# 依赖函数：返回公共参数
async def common_params(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

# 使用依赖：params 会被注入 common_params 的返回值
@app.get("/items/")
async def read_items(params: dict = Depends(common_params)):
    return params
```

!!! tip "依赖注入的工作流程"
    1. 请求到达 `/items/`
    2. FastAPI 调用 `common_params(skip=0, limit=10)`
    3. 返回值 `{"skip": 0, "limit": 10}` 赋给 `params`
    4. 路径操作函数执行

#### Annotated 写法（推荐）

> 📖 官方文档：[Annotated 写法](https://fastapi.tiangolo.com/zh/tutorial/dependencies/#annotated)

使用 `Annotated` 可以让类型信息更完整，IDE 提示更准确：

```python
from typing import Annotated
from fastapi import Depends

async def common_params(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

# Annotated 写法：类型和依赖在类型注解中
@app.get("/items/")
async def read_items(params: Annotated[dict, Depends(common_params)]):
    return params
```

**新旧写法对比**：

| 写法 | 优点 | 缺点 |
|-----|------|-----|
| `params: dict = Depends(func)` | 简洁 | 默认值和依赖混在一起 |
| `params: Annotated[dict, Depends(func)]` | 类型完整、IDE 提示准确 | 需要额外导入 Annotated |

!!! note "Annotated 中的默认值"
    依赖的默认值在**依赖函数**中定义，不需要在路径操作函数中再设置默认值。

### 5.2 类作为依赖

> 📖 官方文档：[Classes as Dependencies](https://fastapi.tiangolo.com/zh/tutorial/dependencies/classes-as-dependencies/)

使用类可以让依赖有更好的类型提示和结构：

```python
from typing import Annotated
from fastapi import Depends

class CommonParams:
    def __init__(self, skip: int = 0, limit: int = 10):
        self.skip = skip
        self.limit = limit

@app.get("/items/")
async def read_items(params: Annotated[CommonParams, Depends()]):
    # Depends() 不传参数 = 自动使用 CommonParams 作为依赖
    return {"skip": params.skip, "limit": params.limit}
```

!!! tip "Depends() 不传参数时"
    `Depends()` 不传参数时，FastAPI 会**自动使用参数的类型注解**（这里是 `CommonParams`）作为依赖类。

### 5.3 子依赖（依赖链）

> 📖 官方文档：[Sub-dependencies](https://fastapi.tiangolo.com/zh/tutorial/dependencies/sub-dependencies/)

依赖可以依赖其他依赖，形成依赖链：

```python
from typing import Annotated
from fastapi import Depends

# 第一层依赖
def get_query(q: str | None = None):
    return q

# 第二层依赖：依赖 get_query
def get_query_or_empty(q: Annotated[str, Depends(get_query)]):
    return q or "empty"

# 路径操作：依赖 get_query_or_empty
@app.get("/items/")
async def read_items(query: Annotated[str, Depends(get_query_or_empty)]):
    return {"query": query}
```

**依赖链执行顺序**：`get_query` → `get_query_or_empty` → `read_items`

### 5.4 yield 依赖（资源清理）

> 📖 官方文档：[Dependencies with yield](https://fastapi.tiangolo.com/zh/tutorial/dependencies/dependencies-with-yield/)

当依赖需要**资源清理**（如关闭数据库连接、释放文件句柄）时，使用 `yield`：

```python
from typing import Annotated, Generator
from fastapi import Depends

# yield 依赖：请求结束后自动清理资源
async def get_db():
    db = DatabaseSession()
    try:
        yield db  # 注入到路径操作
    finally:
        await db.close()  # 请求结束后自动执行

@app.get("/users/")
async def read_users(db: Annotated[DatabaseSession, Depends(get_db)]):
    return db.query(User).all()
    # 请求结束后，db.close() 自动执行
```

!!! warning "yield 依赖的执行时机"
    - `yield` 之前的代码：**请求前**执行
    - `yield` 的值：注入到路径操作
    - `yield` 之后的代码（finally）：**响应返回后**执行

**常用场景**：

| 场景 | 示例 |
|-----|------|
| 数据库连接 | `yield session` → `session.close()` |
| 文件操作 | `yield file` → `file.close()` |
| 事务管理 | `yield` → `commit/rollback` |

### 5.5 路径装饰器依赖

> 📖 官方文档：[Dependencies in path operation decorators](https://fastapi.tiangolo.com/zh/tutorial/dependencies/dependencies-in-path-operation-decorators/)

当依赖只用于验证（不需要返回值），可以放在装饰器的 `dependencies` 参数中：

```python
from fastapi import Depends, HTTPException, Header

async def verify_token(x_token: str = Header()):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")

# 装饰器依赖：只验证，不注入返回值
@app.get("/items/", dependencies=[Depends(verify_token)])
async def read_items():
    return [{"item": "Foo"}, {"item": "Bar"}]
```

!!! note "路径依赖 vs 参数依赖"
    - **参数依赖**：返回值注入到函数参数中
    - **路径依赖**：只执行验证，不注入返回值

#### 全局依赖

对整个应用生效的依赖：

```python
from fastapi import Depends, FastAPI

async def verify_token(x_token: str = Header()):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="Invalid token")

# 全局依赖：所有路由都需要验证
app = FastAPI(dependencies=[Depends(verify_token)])

@app.get("/items/")  # 自动应用 verify_token
async def read_items():
    return [{"item": "Foo"}]
```

### 5.6 依赖覆盖（测试用）

> 📖 官方文档：[Testing Dependencies with Overrides](https://fastapi.tiangolo.com/zh/advanced/testing-dependencies/)

测试时可以替换依赖，例如用 Mock 数据库替换真实数据库：

```python
from fastapi import FastAPI, Depends
from fastapi.testclient import TestClient

app = FastAPI()

# 生产环境依赖
async def get_db():
    return RealDatabase()

# Mock 依赖
async def override_get_db():
    return MockDatabase()

app.dependency_overrides[get_db] = override_get_db

# 测试
client = TestClient(app)
response = client.get("/users/")  # 使用 MockDatabase

# 清除覆盖
app.dependency_overrides = {}
```

!!! tip "依赖覆盖的应用场景"
    - 单元测试：Mock 数据库、外部服务
    - 集成测试：使用测试数据库
    - 开发环境：使用本地配置

---

## 6. 中间件

> 📖 官方文档：[Middleware - 中间件](https://fastapi.tiangolo.com/zh/tutorial/middleware/) | [Advanced Middleware](https://fastapi.tiangolo.com/zh/advanced/middleware/)

中间件是一个函数，在每个**请求到达路径操作之前**、每个**响应返回之前**执行。可以用于：

- 请求预处理（添加状态、认证检查、日志记录）
- 响应后处理（修改响应头、添加处理时间）
- 直接拦截请求（认证失败直接返回错误）

### 6.1 HTTP 中间件

> 📖 官方文档：[创建中间件](https://fastapi.tiangolo.com/zh/tutorial/middleware/#create-a-middleware)

**基本用法**：使用 `@app.middleware("http")` 装饰器注册中间件。

```python
import time
from fastapi import FastAPI, Request

app = FastAPI()

@app.middleware("http")
async def add_process_time(request: Request, call_next):
    # === 请求前：记录开始时间 ===
    start_time = time.perf_counter()

    # === 执行下一层（路径操作或其他中间件）===
    response = await call_next(request)

    # === 响应后：计算处理时间，添加响应头 ===
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = str(process_time)

    return response
```

!!! tip "call_next 的核心作用"
    `call_next` 是一个函数，调用后会执行下一层（路径操作或其他中间件）。

    - **必须 `await`**：因为路径操作可能是异步的
    - **返回 Response**：可修改响应头或完全替换响应
    - **不调用则拦截**：直接返回响应，不执行路径操作

#### 中间件能做什么

| 时机 | 能做的事 | 示例 |
|-----|---------|-----|
| 请求前 | 读取/修改请求头、添加状态、日志记录 | `request.state.user = user` |
| 响应后 | 修改响应头、添加处理时间、日志记录 | `response.headers["X-Time"] = time` |
| 拦截请求 | 直接返回响应（不调用 `call_next`） | 认证失败返回 401 |

**拦截请求示例**（认证检查）：

```python
from fastapi.responses import JSONResponse

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    # 检查 Authorization 头
    token = request.headers.get("Authorization")
    if not token or token != "valid-token":
        # 拦截：直接返回错误，不执行路径操作
        return JSONResponse(
            status_code=401,
            content={"detail": "未授权"}
        )

    # 通过：继续执行下一层
    response = await call_next(request)
    return response
```

#### 注册顺序与执行顺序（洋葱模型）

!!! note "注册顺序决定执行顺序"
    - **先注册的中间件在"外层"**：前置最先执行，后置最晚执行
    - **后注册的中间件在"内层"**：前置晚执行，后置早执行

```python
# 注册顺序：m1 先注册，m2 后注册
@app.middleware("http")
async def m1(request, call_next):
    print("m1 前置")           # ② 第二执行
    response = await call_next(request)
    print("m1 后置")           # ④ 第四执行
    return response

@app.middleware("http")
async def m2(request, call_next):
    print("m2 前置")           # ① 最先执行
    response = await call_next(request)
    print("m2 后置")           # ⑤ 最后执行
    return response
```

执行顺序：`m2 前置 → m1 前置 → 业务逻辑 → m1 后置 → m2 后置`

**图解**：

```
请求 → [m2 前置] → [m1 前置] → [路径操作] → [m1 后置] → [m2 后置] → 响应
        ↓           ↓           ↓            ↓            ↓
      外层        内层        核心         内层         外层
```

#### 两种注册方式

| 方式 | 语法 | 适用场景 |
|-----|------|---------|
| 装饰器 | `@app.middleware("http")` | 自定义中间件（推荐） |
| 函数式 | `app.add_middleware(SomeMiddleware)` | 内置/第三方中间件 |

### 6.2 CORS 跨域

> 📖 官方文档：[CORS (Cross-Origin Resource Sharing)](https://fastapi.tiangolo.com/zh/tutorial/cors/)

CORS（跨域资源共享）是浏览器安全机制，默认阻止跨域请求。使用 `CORSMiddleware` 允许指定源访问。

**基本配置**：

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**参数详解**：

| 参数                  | 说明                        | 示例                                            |
| ------------------- | ------------------------- | --------------------------------------------- |
| `allow_origins`     | 允许的源（协议+域名+端口）            | `["http://localhost:3000"]` 或 `["*"]`         |
| `allow_methods`     | 允许的 HTTP 方法               | `["GET", "POST"]` 或 `["*"]`                   |
| `allow_headers`     | 允许的请求头                    | `["Content-Type", "Authorization"]` 或 `["*"]` |
| `allow_credentials` | 允许携带 Cookie/Authorization | `True` / `False`                              |
| `expose_headers`    | 客户端可访问的响应头                | `["X-Custom-Header"]`                         |
| `max_age`           | 预检请求缓存时间（秒）               | `600`                                         |

!!! warning "allow_credentials 与 allow_origins 的冲突"
    当 `allow_credentials=True` 时，`allow_origins` **不能是 `["*"]`**，必须明确指定源列表：

    ```python
    # ❌ 错误：不允许
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True  # 冲突！浏览器会拒绝
    )

    # ✓ 正确：明确指定源
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "https://example.com"],
        allow_credentials=True
    )
    ```

    这是浏览器 CORS 规范的限制，不是 FastAPI 的问题。

!!! tip "生产环境最佳实践"
    - **不要用 `["*"]`**：明确指定允许的源，防止安全漏洞
    - **按需开放方法**：只开放必要的方法（如 `["GET", "POST"]`）
    - **限制请求头**：只开放必要的请求头
    - **使用环境变量**：通过配置管理允许的源

    ```python
    import os

    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv("ALLOWED_ORIGINS", "").split(","),
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Content-Type", "Authorization"],
    )
    ```

### 6.3 其他内置中间件

> 📖 官方文档：[其他中间件](https://fastapi.tiangolo.com/zh/advanced/middleware/)

#### TrustedHostMiddleware（防止 Host 头攻击）

限制请求的 `Host` 头，防止 Host 头注入攻击：

```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["example.com", "*.example.com", "localhost"]
)
```

请求 `Host` 不在允许列表时，返回 **400 Bad Request**。

#### HTTPSRedirectMiddleware（强制 HTTPS）

自动将 HTTP 请求重定向到 HTTPS：

```python
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

app.add_middleware(HTTPSRedirectMiddleware)
```

!!! warning "仅用于生产环境"
    本地开发时不要启用，否则 `http://localhost` 也会被重定向到 HTTPS。

#### GZipMiddleware（响应压缩）

自动压缩响应，减少传输数据量：

```python
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)  # 最小压缩大小（字节）
```

- `minimum_size=1000`：响应体小于 1000 字节时不压缩
- 自动设置 `Content-Encoding: gzip`
- 适用于大 JSON 响应、HTML 页面

---

## 7. 数据库操作 (SQLAlchemy 2.0 异步)

> 📖 官方文档：[SQL (Relational) Databases](https://fastapi.tiangolo.com/zh/tutorial/sql-databases/) | SQLAlchemy 官方：[Async ORM](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)

SQLAlchemy 2.0 引入了全新的异步 ORM 支持，配合 FastAPI 可以构建高性能异步应用。

### 7.1 安装

```bash
# SQLAlchemy + 异步支持
pip install "sqlalchemy[asyncio]"

# 数据库异步驱动（根据数据库选择一个）
pip install aiomysql      # MySQL
pip install asyncpg       # PostgreSQL（推荐）
pip install aiosqlite     # SQLite
```

=== ":material-rocket-launch: uv"

    ```bash
    uv add "sqlalchemy[asyncio]" aiomysql
    ```

=== "pip"

    ```bash
    pip install "sqlalchemy[asyncio]" aiomysql
    ```

### 7.2 Engine 与连接配置

> 📖 官方文档：[Establishing Connectivity - the Engine](https://docs.sqlalchemy.org/en/20/tutorial/engine.html)

#### Engine 是什么？

**Engine** 是 SQLAlchemy 应用的**核心对象**，它是连接数据库的"总入口"。每个 SQLAlchemy 应用都需要一个 Engine。

!!! tip "Engine 的两大职责"
    1. **连接工厂**：根据配置创建数据库连接
    2. **连接池**：管理和复用数据库连接，避免频繁创建/销毁

Engine 通常是**全局单例**，整个应用生命周期只创建一次。

```
┌─────────────────────────────────────────────────┐
│                    Engine                        │
│  ┌──────────────┐      ┌─────────────────────┐  │
│  │ 连接工厂      │ ──→  │     Connection Pool │  │
│  │ (create)     │      │  ┌───┬───┬───┬───┐  │  │
│  └──────────────┘      │  │ c │ c │ c │ c │  │  │
│                        │  └───┴───┴───┴───┘  │  │
│                        └─────────────────────┘  │
└─────────────────────────────────────────────────┘
                              ↓
                         数据库
```

#### 懒加载（Lazy Initialization）

!!! note "Engine 创建时不会立即连接"
    `create_engine()` 返回的 Engine 对象在创建时**不会立即连接数据库**。只有在第一次执行数据库操作时，才会真正建立连接。

    这种设计称为**懒加载**，好处是：

    - 启动更快
    - 数据库不可用时不会立即报错
    - 按需创建资源

#### 连接 URL 格式

连接 URL 告诉 Engine **如何连接数据库**，包含三个关键信息：

```
mysql+aiomysql://user:pass@host:port/database?charset=utf8mb4
  ↓      ↓                    ↓        ↓
类型    驱动              认证信息    数据库名
```

| 组成部分 | 说明 | 示例 |
|---------|------|------|
| 数据库类型 | 使用哪种数据库 | `mysql`、`postgresql`、`sqlite` |
| DBAPI 驱动 | 使用哪个 Python 驱动 | `aiomysql`、`asyncpg`、`aiosqlite` |
| 数据库位置 | 主机、端口、数据库名 | `localhost:3306/mydb` |

**不同数据库的连接 URL**：

| 数据库 | 连接 URL 格式 |
|-------|--------------|
| MySQL | `mysql+aiomysql://user:pass@host:port/db?charset=utf8mb4` |
| PostgreSQL | `postgresql+asyncpg://user:pass@host:port/db` |
| SQLite | `sqlite+aiosqlite:///./database.db` |
| SQLite（内存） | `sqlite+aiosqlite:///:memory:` |

#### 创建 Engine

```python
from sqlalchemy.ext.asyncio import create_async_engine

# 数据库连接 URL
DATABASE_URL = "mysql+aiomysql://root:password@localhost:3306/mydb?charset=utf8mb4"

# 创建异步引擎
engine = create_async_engine(
    DATABASE_URL,
    echo=False,              # 是否打印 SQL 日志
    pool_size=10,            # 连接池大小
    max_overflow=20,         # 最大溢出连接数
    pool_recycle=3600,       # 连接回收时间（秒）
    pool_pre_ping=True       # 使用前检测连接可用性
)
```

**引擎参数详解**：

| 参数 | 说明 | 推荐值 |
|-----|------|-------|
| `echo` | 打印 SQL 日志到控制台 | 开发 `True`，生产 `False` |
| `pool_size` | 连接池保持的连接数 | 5-20 |
| `max_overflow` | 超出 pool_size 后的最大额外连接 | 10-30 |
| `pool_recycle` | 连接回收时间（秒） | 3600（MySQL 防止 8h 断连） |
| `pool_pre_ping` | 使用前检测连接是否有效 | `True`（推荐开启） |
| `pool_timeout` | 获取连接的超时时间（秒） | 30 |

!!! tip "为什么需要 pool_recycle？"
    MySQL 默认会断开 8 小时未活动的连接（`wait_timeout=28800`）。连接池中的连接可能已失效，使用时会报错。设置 `pool_recycle=3600` 可以每小时回收连接，避免此问题。

!!! warning "pool_size 与 max_overflow 的关系"
    - `pool_size=10`：连接池始终保持 10 个连接
    - `max_overflow=20`：高峰期最多额外创建 20 个连接
    - **总最大连接数** = `pool_size + max_overflow` = 30

    超出 pool_size 的连接在使用完后会被**销毁**，不会保留在池中。

### 7.3 会话管理

> 📖 官方文档：[Session Basics](https://docs.sqlalchemy.org/en/20/orm/session.html) | [Working with Transactions](https://docs.sqlalchemy.org/en/20/tutorial/dbapi_transactions.html)

#### Connection vs Session

SQLAlchemy 有两层数据库交互对象：

| 特性                | `engine.connect()` (Connection) | `Session(engine)` (Session) |
| ----------------- | ------------------------------- | --------------------------- |
| **层级**            | Core 层（底层）                      | ORM 层（高层）                   |
| **用途**            | 直接执行 SQL                        | ORM 操作 + 也可执行原生 SQL         |
| **Connection 持有** | 整个 context manager 期间持有         | **事务结束后释放**，下次需要时重新获取       |
| **对象状态管理**        | 无                               | 有 identity map、延迟加载等 ORM 特性 |

!!! tip "Session 内部使用 Connection"
    Session 是 ORM 层的封装，内部**使用 Connection 来执行 SQL**。当 Session 结束事务后，它不持有 Connection，下次需要执行 SQL 时会从 Engine 获取新的 Connection。

    这种设计让 Session 可以跨多个事务工作，而 Connection 只服务于单个事务上下文。

#### 两种事务模式

SQLAlchemy 支持两种事务管理模式：

| 模式 | 写法 | 特点 |
|-----|------|------|
| **commit as you go** | `with engine.connect() as conn:` + `conn.commit()` | 手动提交，灵活控制 |
| **begin once** | `with engine.begin() as conn:` | 成功自动 COMMIT，异常自动 ROLLBACK |

```python
# commit as you go（手动提交）
with engine.connect() as conn:
    conn.execute(text("INSERT INTO ..."))
    conn.commit()  # 手动提交

# begin once（自动提交/回滚）
with engine.begin() as conn:
    conn.execute(text("INSERT INTO ..."))
    # 成功：自动 COMMIT
    # 异常：自动 ROLLBACK
```

!!! note "FastAPI + ORM 推荐使用 commit as you go"
    在 FastAPI 中配合 `yield` 依赖，我们使用 **commit as you go** 模式：

    - 请求前：创建 Session
    - 业务逻辑执行：无异常则成功
    - 响应后：手动 commit 或 rollback

#### 创建异步会话工厂

```python
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession
from typing import AsyncGenerator

# 创建异步会话工厂
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,  # 异步环境必须关闭
    autocommit=False,
    autoflush=False
)

# ORM 基类
class Base(DeclarativeBase):
    pass
```

!!! warning "为什么必须设置 expire_on_commit=False？"
    SQLAlchemy 默认在 `commit()` 后会过期所有对象的属性，下次访问时会触发**延迟加载**（Lazy Load）。

    但在异步环境中：
    
    1. 延迟加载需要同步 IO，会阻塞事件循环
    2. 会话可能已关闭，无法加载数据

    设置 `expire_on_commit=False` 后，`commit()` 后对象属性仍然可用，无需额外查询。

#### 获取数据库会话（依赖注入）

```python
from fastapi import Depends

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """获取数据库会话的依赖函数"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()  # 成功则自动提交
        except Exception:
            await session.rollback()  # 失败则回滚
            raise
```

!!! note "get_db 使用 yield 的原因"
    这是 FastAPI 的 yield 依赖模式，对应 **commit as you go** 事务模式：

    - `yield` 之前：请求前执行，创建 Session
    - `yield session`：注入到路径操作函数
    - `yield` 之后：响应后执行，commit 或 rollback

!!! tip "async with 自动管理 Session 生命周期"
    `async with AsyncSessionLocal() as session` 会自动：

    1. 从 Engine 获取 Connection
    2. 开始事务（BEGIN implicit）
    3. 退出时关闭 Session（释放 Connection）

    不需要显式调用 `session.close()`，`async with` 会自动处理。

### 7.4 定义模型

> 📖 官方文档：[ORM Declarative Models](https://docs.sqlalchemy.org/en/20/orm/declarative_tables.html) | [mapped_column() API](https://docs.sqlalchemy.org/en/20/orm/mapping_api.html#sqlalchemy.orm.mapped_column)

SQLAlchemy 2.0 引入了全新的 `mapped_column()` 构造和 `Mapped[T]` 类型注解系统，替代传统 `Column()` 写法，实现**类型驱动**的模型定义。

#### 7.4.1 mapped_column() 基础

!!! info "核心定位"
    `mapped_column()` 是 SQLAlchemy 2.0 取代 `Column()` 的新构造，专为 Declarative ORM 设计，增加了类型推导、延迟加载等便捷特性。

```python
from sqlalchemy import String, Integer
from sqlalchemy.orm import DeclarativeBase, mapped_column

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "user"

    # 传统写法（仍可使用）
    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(50), nullable=False)
```

!!! warning "使用限制"
    `mapped_column()` **仅在 Declarative 类映射中有效**。构建 Core `Table` 对象或 Imperative Table 配置时，仍需使用 `Column()`。

#### 7.4.2 Mapped 类型推导

`Mapped[T]` 类型注解能自动推导列的 **datatype** 和 **nullability**，大幅简化模型定义：

```python
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

class Book(Base):
    __tablename__ = "books"

    # 主键自增：primary_key=True 隐含 NOT NULL
    id: Mapped[int] = mapped_column(primary_key=True)

    # 类型推导：int → Integer, str → String
    price: Mapped[float]  # 自动生成 mapped_column(Float())

    # 可空字段：| None 推导为 nullable=True
    description: Mapped[str | None] = mapped_column(Text)

    # 需指定长度时显式传递类型参数
    title: Mapped[str] = mapped_column(String(100), index=True)

    # 时间字段：datetime → DateTime
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
```

!!! tip "省略 mapped_column() 的魔法"
    当只有 `Mapped[...]` 注解而没有赋值时，Declarative 会**自动生成**一个空 `mapped_column()`，并根据注解推导类型和可空性。这类似 Python dataclass 的写法风格。

**推导规则表**：

| 推导维度 | 规则 | 示例结果 |
|---------|------|---------|
| **Datatype** | Python 类型映射到 SQLAlchemy 类型 | `int` → `Integer`, `str` → `String` |
| **Nullability** | `T | None` 或 `Optional[T]` → `NULL` | `Mapped[str | None]` → 可空列 |
| **NOT NULL** | 无 `| None` 或 `primary_key=True` → `NOT NULL` | `Mapped[int]` 主键 → 不可空 |

**默认类型映射**（官方文档）：

| Python 类型 | SQLAlchemy 类型 |
|-------------|----------------|
| `bool` | `Boolean()` |
| `bytes` | `LargeBinary()` |
| `datetime.date` | `Date()` |
| `datetime.datetime` | `DateTime()` |
| `datetime.time` | `Time()` |
| `float` | `Float()` |
| `int` | `Integer()` |
| `str` | `String()` |
| `uuid.UUID` | `Uuid()` |

!!! note "nullable 覆盖规则"
    `mapped_column(nullable=...)` 参数优先级高于类型注解。可以定义 Python 层可空但数据库层不可空的字段：
    ```python
    # Python 可空，数据库 NOT NULL（用于初始化阶段允许 None）
    data: Mapped[str | None] = mapped_column(nullable=False)
    ```

#### 7.4.3 Annotated 类型别名

使用 `Annotated` 定义可复用的列配置，是官方推荐的**最佳实践**：

```python
from typing import Annotated
from sqlalchemy import String, func
from sqlalchemy.orm import mapped_column
from datetime import datetime

# 定义可复用的列配置别名
intpk = Annotated[int, mapped_column(primary_key=True)]
str50 = Annotated[str, mapped_column(String(50))]
timestamp = Annotated[datetime, mapped_column(nullable=False, server_default=func.now())]

class User(Base):
    __tablename__ = "users"

    id: Mapped[intpk]           # 自动应用 primary_key=True
    name: Mapped[str50]         # 自动应用 String(50)
    created_at: Mapped[timestamp]  # 自动应用 server_default

class Book(Base):
    __tablename__ = "books"

    id: Mapped[intpk]           # 复用同一配置
    title: Mapped[str50]
```

!!! success "Annotated 的优势"
    - **复用**：一次定义，多处使用（如统一主键风格）
    - **简洁**：模型定义更清晰，减少重复代码
    - **覆盖**：可在具体字段上用显式 `mapped_column()` 覆盖配置：
    ```python
    # 在 intpk 基础上添加外键约束
    owner_id: Mapped[intpk] = mapped_column(ForeignKey("users.id"))
    ```

#### 7.4.4 特殊类型映射

**Python enum.Enum 自动映射**：

```python
import enum

class Status(enum.Enum):
    PENDING = "pending"
    RECEIVED = "received"
    COMPLETED = "completed"

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[intpk]
    status: Mapped[Status]  # 自动生成 Enum(Status) 列！
```

!!! tip "enum 自动转换"
    Python `enum.Enum` 类型会自动映射为 SQLAlchemy `Enum()` 类型，无需手动指定。PostgreSQL 会创建原生 `ENUM` 类型，其他数据库使用 `VARCHAR` 存储。

**typing.Literal 支持**（SQLAlchemy 2.0.1+）：

```python
from typing import Literal

StatusLiteral = Literal["pending", "received", "completed"]

class Order(Base):
    __tablename__ = "orders"
    status: Mapped[StatusLiteral]  # 同样映射为 Enum
```

#### 7.4.5 表级配置

使用 `__table_args__` 定义表级约束和数据库特定参数：

```python
from sqlalchemy import UniqueConstraint, Index, ForeignKeyConstraint

class Book(Base):
    __tablename__ = "books"

    id: Mapped[intpk]
    title: Mapped[str50]
    author: Mapped[str50]

    # 方式一：元组形式（约束）
    __table_args__ = (
        UniqueConstraint("title", "author", name="uq_book_title_author"),
        Index("ix_book_author", "author"),
    )

    # 方式二：字典形式（数据库参数）
    __table_args__ = {"mysql_engine": "InnoDB"}

    # 方式三：混合（约束 + 参数）
    __table_args__ = (
        UniqueConstraint("title"),
        {"mysql_engine": "InnoDB", "schema": "my_schema"},
    )
```

!!! note "约束命名建议"
    为约束添加 `name` 参数（如 `name="uq_book_title"`），便于迁移工具（Alembic）识别和管理。

#### 7.4.6 关系映射

```python
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

class User(Base):
    __tablename__ = "users"

    id: Mapped[intpk]
    name: Mapped[str50]

    # 一对多关系：一个用户有多本书
    books: Mapped[list["Book"]] = relationship(back_populates="owner")

class Book(Base):
    __tablename__ = "books"

    id: Mapped[intpk]
    title: Mapped[str50]

    # 外键
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    # 反向关系（使用字符串避免循环引用）
    owner: Mapped["User"] = relationship(back_populates="books")
```

!!! tip "关系定义要点"
    - `Mapped[list["Book"]]`：一对多用 `list`，双引号避免未定义类报错
    - `back_populates`：双向关系必须指定，确保双方能互相访问
    - `ForeignKey`：外键列需显式指定关联表和列

### 7.5 启动时建表

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时：创建所有表
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # 关闭时：清理资源（如需要）

app = FastAPI(lifespan=lifespan)
```

!!! warning "生产环境建议"
    生产环境推荐使用 **Alembic** 进行数据库迁移，而不是自动建表。自动建表不会处理列修改、索引变更等情况。

### 7.6 查询操作

> 📖 官方文档：[ORM Querying](https://docs.sqlalchemy.org/en/20/orm/queryguide/index.html)

#### 7.6.1 select() 核心概念

SQLAlchemy 2.0 使用 `select()` 构造 SQL 查询语句，遵循 **"先构造，后执行"** 模式：

```
select(Model)          → 构造 SELECT 语句（不执行）
db.execute(stmt)       → 执行 SQL，返回 Result 对象
result.scalars().all() → 从 Result 提取 ORM 对象
```

!!! tip "select() 只构造不执行"
    `select(Book)` 只是构造了一个 `Select` 对象，**不会立即查询数据库**。只有调用 `await db.execute(stmt)` 时才真正执行 SQL。

**完整查询流程**：

```python
from sqlalchemy import select

# ① 构造 SELECT 语句
stmt = select(Book).where(Book.author == "鲁迅")

# ② 执行 SQL，返回 Result 对象
result = await db.execute(stmt)

# ③ 从 Result 提取 ORM 对象
books = result.scalars().all()  # list[Book]
```

#### 7.6.2 Result 取值方法详解

`db.execute()` 返回的是 `Result` 对象，需要调用特定方法提取数据：

| 方法 | 返回值 | 适用场景 |
|-----|-------|---------|
| `scalars().all()` | `list[Model]` | 查询多行，返回 ORM 对象列表 |
| `scalars().first()` | `Model \| None` | 查询一行，返回第一个或 None |
| `scalar_one()` | `Model` | 必须**恰好一条**，否则抛异常 |
| `scalar_one_or_none()` | `Model \| None` | 最多一条，多条抛异常 |
| `all()` | `list[Row]` | 返回原始 Row 对象（多列查询时用） |
| `scalar()` | 单个值 | 聚合查询（count、sum 等） |

!!! warning "scalars() vs scalar() 区别"
    - `scalars()`：提取 ORM 对象，返回可迭代对象，需再调用 `.all()` 或 `.first()`
    - `scalar()`：直接返回单个值（如 `count(*)` 的结果），一步到位

```python
# 查询多条 → scalars().all()
result = await db.execute(select(Book))
books = result.scalars().all()  # [Book1, Book2, ...]

# 查询单条 → scalar_one_or_none()
result = await db.execute(select(Book).where(Book.id == 1))
book = result.scalar_one_or_none()  # Book | None

# 聚合查询 → scalar()
result = await db.execute(select(func.count(Book.id)))
total = result.scalar()  # int
```

#### 7.6.3 基本查询示例

```python
from typing import Annotated
from sqlalchemy import select, func, or_, and_
from fastapi import Depends

# 查询所有
@app.get("/books/")
async def list_books(db: Annotated[AsyncSession, Depends(get_db)]):
    stmt = select(Book)
    result = await db.execute(stmt)
    books = result.scalars().all()
    return books

# 条件查询
@app.get("/books/{book_id}")
async def get_book(book_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    stmt = select(Book).where(Book.id == book_id)
    result = await db.execute(stmt)
    book = result.scalar_one_or_none()
    if not book:
        raise HTTPException(status_code=404, detail="书籍不存在")
    return book
```

#### 7.6.4 查询条件分类

**条件过滤**：

```python
# 多条件 AND（逗号分隔）
stmt = select(Book).where(Book.author == "鲁迅", Book.price > 50)

# 多条件 AND（显式 and_）
stmt = select(Book).where(and_(Book.author == "鲁迅", Book.price > 50))

# OR 条件
stmt = select(Book).where(or_(Book.price > 100, Book.author == "Gemini"))

# IN 查询
stmt = select(Book).where(Book.id.in_([1, 2, 3]))
stmt = select(Book).where(Book.author.not_in(["匿名", "未知"]))
```

**模糊查询**：

```python
# contains：包含子串
stmt = select(Book).where(Book.title.contains("Python"))

# like：SQL LIKE 语法
stmt = select(Book).where(Book.title.like("%Python%"))

# ilike：不区分大小写的 LIKE
stmt = select(Book).where(Book.title.ilike("%python%"))

# startswith / endswith
stmt = select(Book).where(Book.title.startswith("Python"))
stmt = select(Book).where(Book.title.endswith("入门"))
```

**排序与分页**：

```python
# 排序
stmt = select(Book).order_by(Book.price.desc(), Book.id.asc())

# 简单分页
stmt = select(Book).offset((page - 1) * size).limit(size)
```

**完整分页示例**（含总数）：

```python
@app.get("/books/")
async def list_books(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Annotated[AsyncSession, Depends(get_db)]
):
    # 查询总数
    count_stmt = select(func.count(Book.id))
    total = (await db.execute(count_stmt)).scalar()

    # 分页查询
    stmt = select(Book).offset((page - 1) * size).limit(size)
    books = (await db.execute(stmt)).scalars().all()

    return {
        "total": total,
        "page": page,
        "size": size,
        "items": books
    }
```

**聚合查询**：

```python
# COUNT
total = (await db.execute(select(func.count(Book.id)))).scalar()

# AVG
avg_price = (await db.execute(select(func.avg(Book.price)))).scalar()

# SUM
total_price = (await db.execute(select(func.sum(Book.price)))).scalar()

# GROUP BY
from sqlalchemy import func
stmt = (
    select(Book.author, func.count(Book.id).label("count"))
    .group_by(Book.author)
)
result = await db.execute(stmt)
for row in result:
    print(f"{row.author}: {row.count} 本书")
```

**关联查询（JOIN）**：

```python
# 隐式 JOIN（通过 relationship）
stmt = select(Book).where(Book.owner.has(User.name == "张三"))

# 显式 JOIN
stmt = select(Book).join(User).where(User.name == "张三")

# LEFT JOIN
stmt = select(Book).join(User, isouter=True)

# SELECT 多表
stmt = select(Book, User).join(User).where(User.name == "张三")
result = await db.execute(stmt)
for book, user in result:
    print(f"{book.title} - {user.name}")
```

### 7.7 新增操作

#### 7.7.1 新增流程

```
db.add(obj)          → 对象进入 Session（待保存状态）
                       此时数据库无数据！
await db.commit()    → 事务提交，SQL 执行，数据写入数据库
await db.refresh()   → 重新查询，获取数据库生成的字段
```

!!! tip "add() 不等于写入数据库"
    `db.add(obj)` 只是将对象标记为"待保存"，此时 SQL 还没执行。只有 `await db.commit()` 后，数据才真正写入数据库。

```python
from pydantic import BaseModel

class BookCreate(BaseModel):
    title: str
    author: str
    price: float

@app.post("/books/", response_model=Book)
async def create_book(
    book_in: BookCreate,
    db: Annotated[AsyncSession, Depends(get_db)]
):
    # ① 创建 ORM 对象
    new_book = Book(**book_in.model_dump())

    # ② 加入 Session
    db.add(new_book)

    # ③ 提交事务
    await db.commit()

    # ④ 刷新获取数据库生成的字段
    await db.refresh(new_book)

    return new_book
```

#### 7.7.2 何时需要 refresh？

!!! note "refresh 获取数据库生成的字段"
    `await db.refresh(obj)` 会重新从数据库查询该对象，获取：
    
    - 自增主键 ID
    - `server_default` 字段（如 `created_at`）
    - 数据库触发器生成的字段

    **不需要 refresh 的情况**：所有字段都是 Python 层设置的，没有数据库默认值。

```python
class Book(Base):
    __tablename__ = "books"

    id: Mapped[intpk]  # 自增主键 → 需要 refresh 获取
    title: Mapped[str50]
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now()  # 数据库默认值 → 需要 refresh 获取
    )
```

#### 7.7.3 批量新增

```python
# 方式一：多次 add
books = [Book(title="书1"), Book(title="书2"), Book(title="书3")]
for book in books:
    db.add(book)
await db.commit()

# 方式二：add_all（推荐）
books = [Book(title="书1"), Book(title="书2"), Book(title="书3")]
db.add_all(books)
await db.commit()
```

!!! warning "批量新增的性能"
    `add_all()` 会一次性将所有对象加入 Session，比循环 `add()` 更高效。但实际 SQL 仍然是逐条 INSERT。如需极致性能，可使用 `insert().values([...])` 批量插入：

    ```python
    from sqlalchemy import insert

    stmt = insert(Book).values([
        {"title": "书1", "author": "A"},
        {"title": "书2", "author": "B"},
    ])
    await db.execute(stmt)
    await db.commit()
    ```

### 7.8 更新操作

#### 7.8.1 方式对比

| 方式 | 适用场景 | 优点 | 缺点 |
|------|----------|------|------|
| **先查后改** | 单条更新、需要业务逻辑校验 | 可验证存在性、可审计、触发 ORM 事件 | 两次 SQL（SELECT + UPDATE） |
| **批量 update** | 批量更新、无复杂逻辑 | 一次 SQL，高性能 | 不加载对象、不触发 ORM 事件 |

#### 7.8.2 先查后改（推荐）

```python
from sqlalchemy import select

class BookUpdate(BaseModel):
    title: str | None = None
    price: float | None = None

@app.put("/books/{book_id}")
async def update_book(
    book_id: int,
    book_in: BookUpdate,
    db: Annotated[AsyncSession, Depends(get_db)]
):
    # ① 先查询
    stmt = select(Book).where(Book.id == book_id)
    result = await db.execute(stmt)
    db_book = result.scalar_one_or_none()

    if not db_book:
        raise HTTPException(status_code=404, detail="书籍不存在")

    # ② 部分更新：只更新传入的字段
    update_data = book_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)

    # ③ 提交
    await db.commit()
    await db.refresh(db_book)
    return db_book
```

!!! tip "exclude_unset=True 的作用"
    Pydantic 的 `model_dump(exclude_unset=True)` 只返回**用户实际传入的字段**，忽略未传入的字段：

    ```python
    class BookUpdate(BaseModel):
        title: str | None = None
        price: float | None = None

    # 用户只传了 {"price": 100}
    book_in.model_dump()                      # {"title": None, "price": 100}
    book_in.model_dump(exclude_unset=True)    # {"price": 100} ← 只有这个！

    # 如果不用 exclude_unset，title 会被错误地设为 None
    ```

#### 7.8.3 批量更新

使用 `update()` 构造 UPDATE 语句，适合批量更新：

```python
from sqlalchemy import update

# 批量更新：将所有鲁迅的书涨价 10 元
stmt = (
    update(Book)
    .where(Book.author == "鲁迅")
    .values(price=Book.price + 10)  # 支持表达式
)
result = await db.execute(stmt)
await db.commit()

print(f"更新了 {result.rowcount} 条记录")
```

**高级用法**：

```python
# 使用 RETURNING 返回更新后的数据（PostgreSQL/SQLite）
stmt = (
    update(Book)
    .where(Book.author == "鲁迅")
    .values(price=Book.price + 10)
    .returning(Book)
)
result = await db.execute(stmt)
updated_books = result.scalars().all()
```

!!! warning "批量更新不触发 ORM 事件"
    `update()` 是 Core 层操作，直接生成 SQL 执行，**不会触发 ORM 的属性事件**（如 `@event.listens_for`）。如果需要在更新时执行额外逻辑，必须用"先查后改"方式。

### 7.9 删除操作

#### 7.9.1 方式对比

| 方式 | 适用场景 | 特点 |
|------|----------|------|
| **先查后删** | 单条删除、需要业务逻辑 | 触发 ORM 事件、级联删除 |
| **直接 delete** | 批量删除、性能优先 | 不加载对象、不触发 ORM 事件 |

#### 7.9.2 先查后删

```python
@app.delete("/books/{book_id}")
async def delete_book(book_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    # ① 先查询
    stmt = select(Book).where(Book.id == book_id)
    result = await db.execute(stmt)
    db_book = result.scalar_one_or_none()

    if not db_book:
        raise HTTPException(status_code=404, detail="书籍不存在")

    # ② 删除
    await db.delete(db_book)

    # ③ 提交
    await db.commit()
    return {"message": "删除成功"}
```

#### 7.9.3 直接删除

```python
from sqlalchemy import delete

# 删除单条
stmt = delete(Book).where(Book.id == book_id)
result = await db.execute(stmt)
await db.commit()

# 检查是否删除成功
if result.rowcount == 0:
    raise HTTPException(status_code=404, detail="书籍不存在")

# 批量删除
stmt = delete(Book).where(Book.author == "匿名")
result = await db.execute(stmt)
await db.commit()
print(f"删除了 {result.rowcount} 条记录")
```

!!! tip "rowcount 检查删除结果"
    `result.rowcount` 返回受影响的行数：
    
    - `0`：没有匹配的记录，删除失败
    - `> 0`：删除成功

#### 7.9.4 级联删除

当删除一条记录时，需要自动删除其关联数据，可在模型中配置级联删除：

```python
class User(Base):
    __tablename__ = "users"

    id: Mapped[intpk]
    name: Mapped[str50]

    # 级联删除：删除用户时自动删除其所有书籍
    books: Mapped[list["Book"]] = relationship(
        back_populates="owner",
        cascade="all, delete-orphan"  # 关键配置
    )

class Book(Base):
    __tablename__ = "books"

    id: Mapped[intpk]
    title: Mapped[str50]
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    owner: Mapped["User"] = relationship(back_populates="books")
```

!!! warning "级联删除的两种方式"
    - **ORM 级联**（`cascade="all, delete-orphan"`）：`db.delete(user)` 时 SQLAlchemy 自动删除关联的 books
    - **数据库级联**（`ForeignKey(..., ondelete="CASCADE")`）：数据库层面自动删除，性能更高

    推荐使用数据库级联：

    ```python
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    ```

### 7.10 事务管理

> 📖 官方文档：[Transactions](https://docs.sqlalchemy.org/en/20/orm/session_transaction.html)

#### 自动事务（推荐）

`get_db` 依赖中已配置自动提交/回滚：

```python
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()  # 自动提交
        except Exception:
            await session.rollback()  # 自动回滚
            raise
```

#### 手动事务控制

```python
# 方式一：使用 begin()
async with db.begin():
    db.add(book1)
    db.add(book2)
    # 自动 commit 或 rollback

# 方式二：嵌套事务（SAVEPOINT）
async with db.begin_nested():
    db.add(book)
    # 可以在内部再次 rollback
```

### 7.11 原生 SQL

```python
from sqlalchemy import text

# 执行原生 SQL
sql = text("SELECT * FROM books WHERE author = :author AND price > :min_price")
result = await db.execute(sql, {"author": "鲁迅", "min_price": 50})
rows = result.all()  # 返回 Row 对象列表

# 转换为字典
for row in rows:
    print(row._mapping)  # {'id': 1, 'title': '...', ...}
```

!!! warning "原生 SQL 注意事项"
    - 使用 `:param` 占位符（不是 `%s` 或 `?`）
    - 参数通过字典传递，防止 SQL 注入
    - 返回的是 `Row` 对象，不是 ORM 模型

### 7.12 数据库迁移（Alembic）

> 📖 官方文档：[Alembic](https://alembic.sqlalchemy.org/)

生产环境推荐使用 Alembic 管理数据库版本和迁移。

**安装和初始化**：

```bash
pip install alembic
alembic init alembic
```

**配置 `alembic/env.py`**：

```python
from models import Base
target_metadata = Base.metadata
```

**生成和执行迁移**：

```bash
# 自动生成迁移脚本
alembic revision --autogenerate -m "添加书籍表"

# 执行迁移
alembic upgrade head

# 回滚
alembic downgrade -1
```

---

## 8. 进阶特性

> 📖 官方文档：[Background Tasks](https://fastapi.tiangolo.com/zh/tutorial/background-tasks/) | [WebSockets](https://fastapi.tiangolo.com/zh/advanced/websockets/) | [Lifespan Events](https://fastapi.tiangolo.com/zh/advanced/events/) | [Static Files](https://fastapi.tiangolo.com/zh/tutorial/static-files/)

### 8.1 后台任务 (BackgroundTasks)

> 📖 官方文档：[Background Tasks - 后台任务](https://fastapi.tiangolo.com/zh/tutorial/background-tasks/)

在不阻塞响应的情况下执行后台操作（如发送邮件、日志记录）：

```python
from fastapi import BackgroundTasks

def send_email(email: str, message: str):
    # 模拟发送邮件
    print(f"发送邮件到 {email}: {message}")

@app.post("/send-notification/")
async def send_notification(
    email: str,
    background_tasks: BackgroundTasks
):
    # 响应立即返回，邮件在后台发送
    background_tasks.add_task(send_email, email, "您有新消息")
    return {"message": "通知已发送"}
```

### 8.2 WebSocket 实时通信

> 📖 官方文档：[WebSockets](https://fastapi.tiangolo.com/zh/advanced/websockets/)

```python
from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"收到: {data}")
    except WebSocketDisconnect:
        print("客户端断开连接")
```

**广播消息示例**：

```python
from fastapi import FastAPI, WebSocket
from typing import List

app = FastAPI()
active_connections: List[WebSocket] = []

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            # 广播给所有连接
            for conn in active_connections:
                await conn.send_text(data)
    except WebSocketDisconnect:
        active_connections.remove(websocket)
```

### 8.3 生命周期事件 (Lifespan)

> 📖 官方文档：[Lifespan Events - 生命周期事件](https://fastapi.tiangolo.com/zh/advanced/events/)

在应用启动/关闭时执行特定逻辑：

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # === 启动时 ===
    print("应用启动")
    await init_database()

    yield  # 应用运行

    # === 关闭时 ===
    print("应用关闭")
    await close_database()

app = FastAPI(lifespan=lifespan)
```

### 8.4 静态文件托管

> 📖 官方文档：[Static Files - 静态文件](https://fastapi.tiangolo.com/zh/tutorial/static-files/)

```python
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static"), name="static")
```

访问 `http://127.0.0.1:8000/static/images/logo.png`

---

## 9. 安全认证

> 📖 官方文档：[Security Intro](https://fastapi.tiangolo.com/zh/tutorial/security/intro/) | [OAuth2 with Password (and hashing), Bearer with JWT tokens](https://fastapi.tiangolo.com/zh/tutorial/security/oauth2-jwt/)

### 9.1 密码加密

```python
import bcrypt

class PwdContext:
    def hash(self, password: str) -> str:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    def verify(self, plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )

pwd_context = PwdContext()
```

### 9.2 OAuth2 密码流 + JWT

> 📖 官方文档：[OAuth2 with JWT](https://fastapi.tiangolo.com/zh/tutorial/security/oauth2-jwt/)

```python
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta

# 配置
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # 验证用户
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    # 生成 Token
    access_token = create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    # 解析 Token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="无效 Token")
    except JWTError:
        raise HTTPException(status_code=401, detail="无效 Token")

    return {"username": username}
```

### 9.3 依赖封装（推荐）

将认证逻辑封装为依赖，便于复用：

```python
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401)
    except JWTError:
        raise HTTPException(status_code=401)

    user = await get_user_by_username(username)
    if user is None:
        raise HTTPException(status_code=401)
    return user

@app.get("/protected")
async def protected_route(user: User = Depends(get_current_user)):
    return {"message": f"你好, {user.username}"}
```

---

## 10. 项目工程化

> 📖 官方文档：[Bigger Applications](https://fastapi.tiangolo.com/zh/tutorial/bigger-applications/) | [Testing](https://fastapi.tiangolo.com/zh/tutorial/testing/)

### 10.1 项目架构

```
my_fastapi_app/
├── app/
│   ├── main.py              # 入口：初始化 App，挂载路由
│   ├── config/              # 配置
│   │   ├── database.py      # 数据库配置
│   │   └── security.py      # 安全配置
│   ├── models/              # SQLAlchemy ORM 模型
│   │   ├── user.py
│   │   └── book.py
│   ├── schemas/             # Pydantic 模型 (Request/Response DTO)
│   │   ├── user.py
│   │   └── book.py
│   ├── crud/                # 数据库操作封装
│   │   ├── user.py
│   │   └── book.py
│   ├── api/                 # 路由层
│   │   ├── v1/
│   │   │   ├── api.py       # 路由汇总
│   │   │   └── endpoints/
│   │   │       ├── users.py
│   │   │       └── books.py
│   ├── utils/               # 工具函数
│   └── core/                # 核心逻辑
├── tests/                   # 测试
├── alembic/                 # 数据库迁移
├── .env                     # 环境变量
└── requirements.txt
```

### 10.2 模块化路由 (APIRouter)

> 📖 官方文档：[Bigger Applications - 多文件应用](https://fastapi.tiangolo.com/zh/tutorial/bigger-applications/)

```python
# app/api/v1/endpoints/books.py
from fastapi import APIRouter

router = APIRouter()

@router.post("/", response_model=BookOut)
async def create_book(book_in: BookCreate, db: AsyncSession = Depends(get_db)):
    return await crud_book.create(db, book_in)

@router.get("/{book_id}", response_model=BookOut)
async def get_book(book_id: int, db: AsyncSession = Depends(get_db)):
    return await crud_book.get(db, book_id)
```

```python
# app/api/v1/api.py
from fastapi import APIRouter
from app.api.v1.endpoints import books, users

api_router = APIRouter()
api_router.include_router(books.router, prefix="/books", tags=["图书"])
api_router.include_router(users.router, prefix="/users", tags=["用户"])
```

```python
# app/main.py
from app.api.v1.api import api_router

app = FastAPI()
app.include_router(api_router, prefix="/api/v1")
```

### 10.3 封装通用返回

```python
from typing import TypeVar, Generic
from pydantic import BaseModel

T = TypeVar("T")

class Result(BaseModel, Generic[T]):
    code: int
    message: str
    data: T | None = None

    @classmethod
    def success(cls, data: T | None = None):
        return cls(code=200, message="success", data=data)

    @classmethod
    def error(cls, code: int, message: str):
        return cls(code=code, message=message, data=None)

# 使用
@app.get("/books/{book_id}", response_model=Result[BookOut])
async def get_book(book_id: int):
    book = await crud_book.get(book_id)
    if not book:
        return Result.error(404, "书籍不存在")
    return Result.success(book)
```

### 10.4 测试编写

> 📖 官方文档：[Testing - 测试](https://fastapi.tiangolo.com/zh/tutorial/testing/)

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_book():
    response = client.post("/books/", json={
        "title": "Test Book",
        "author": "Test Author",
        "price": 99.9
    })
    assert response.status_code == 201
    assert response.json()["title"] == "Test Book"

def test_get_book():
    response = client.get("/books/1")
    assert response.status_code == 200
```

---

## 速查表

| 需求 | 用法 |
|------|------|
| 路径参数 | `@app.get("/items/{id}")` + `id: int` |
| 查询参数 | `skip: int = 0` 或 `Query()` |
| 请求体 JSON | Pydantic `BaseModel` |
| 表单数据 | `Form(...)` |
| 文件上传 | `UploadFile = File(...)` |
| 请求头 | `Header(...)` |
| Cookie | `Cookie(...)` |
| 响应模型 | `response_model=SomeModel` |
| 状态码 | `status_code=201` |
| 异常抛出 | `raise HTTPException(status_code, detail)` |
| 依赖注入 | `Depends(dependency_func)` |
| 中间件 | `@app.middleware("http")` |
| 后台任务 | `BackgroundTasks.add_task()` |
| WebSocket | `@app.websocket("/ws")` |
| 静态文件 | `app.mount("/static", StaticFiles(...))` |
| 跨域 | `CORSMiddleware` |