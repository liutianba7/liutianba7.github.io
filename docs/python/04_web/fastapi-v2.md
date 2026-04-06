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

| 响应类 | 用途 | Content-Type |
|--------|------|--------------|
| `JSONResponse` (默认) | JSON 数据 | `application/json` |
| `HTMLResponse` | HTML 页面 | `text/html` |
| `PlainTextResponse` | 纯文本 | `text/plain` |
| `RedirectResponse` | URL 跳转 | 状态码 3xx |
| `FileResponse` | 文件下载 | 自动识别 |
| `StreamingResponse` | 流式响应 | 自定义 |

```python
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse

@app.get("/html", response_class=HTMLResponse)
async def get_html():
    return "<h1>Hello FastAPI</h1>"

@app.get("/file")
async def get_file():
    return FileResponse("./data/report.pdf")

@app.get("/redirect")
async def redirect():
    return RedirectResponse(url="/html")
```

---

## 4. 异常处理

> 📖 官方文档：[Handling Errors - 异常处理](https://fastapi.tiangolo.com/zh/tutorial/handling-errors/)

### 4.1 HTTPException

```python
from fastapi import FastAPI, HTTPException

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id == 0:
        raise HTTPException(status_code=400, detail="ID 不能为 0")
    return {"item_id": item_id}
```

⭐ **return vs raise**：

- `return`：正常结束，返回 200 OK
- `raise HTTPException`：立即中断，返回指定错误

**自定义响应头**（如 OAuth2 认证失败）：

```python
@app.get("/secure-data")
async def get_secure_data(token: str | None = None):
    if not token:
        raise HTTPException(
            status_code=401,
            detail="未授权",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return {"data": "秘密内容"}
```

### 4.2 自定义异常 + 全局处理器

**定义业务异常**：

```python
class BusinessException(Exception):
    def __init__(self, code: int, message: str):
        self.code = code
        self.message = message
```

**编写处理器**：

```python
from fastapi import Request
from fastapi.responses import JSONResponse

async def business_exception_handler(request: Request, exc: BusinessException):
    return JSONResponse(
        status_code=200,
        content={"code": exc.code, "message": exc.message, "data": None}
    )
```

**注册到 App**：

```python
app = FastAPI()
app.add_exception_handler(BusinessException, business_exception_handler)
```

**兜底处理器**（捕获所有未处理异常）：

```python
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"code": 500, "message": "服务器内部错误"}
    )
```

---

## 5. 依赖注入

> 📖 官方文档：[Dependencies - 依赖注入](https://fastapi.tiangolo.com/zh/tutorial/dependencies/) | [Classes as Dependencies](https://fastapi.tiangolo.com/zh/tutorial/dependencies/classes-as-dependencies/) | [Sub-dependencies](https://fastapi.tiangolo.com/zh/tutorial/dependencies/sub-dependencies/)

### 5.1 核心概念

**"你的函数需要什么，就声明什么，FastAPI 负责帮你取来。"**

优点：

- 减少重复代码
- 解耦业务逻辑与资源获取
- 方便测试（可替换依赖）

### 5.2 基础用法

```python
from fastapi import Depends

# 依赖函数
async def common_params(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

# 使用依赖
@app.get("/items/")
async def read_items(params: dict = Depends(common_params)):
    return params
```

### 5.3 类作为依赖

```python
class CommonParams:
    def __init__(self, skip: int = 0, limit: int = 10):
        self.skip = skip
        self.limit = limit

@app.get("/items/")
async def read_items(params: CommonParams = Depends()):
    # Depends() 不传参数 = 自动使用 CommonParams 作为依赖
    return {"skip": params.skip, "limit": params.limit}
```

### 5.4 子依赖（依赖链）

```python
def get_query(q: str | None = None):
    return q

def get_query_or_empty(q: str = Depends(get_query)):
    return q or "empty"

@app.get("/items/")
async def read_items(query: str = Depends(get_query_or_empty)):
    return {"query": query}
```

---

## 6. 中间件

> 📖 官方文档：[Middleware - 中间件](https://fastapi.tiangolo.com/zh/tutorial/middleware/)

### 6.1 HTTP 中间件

中间件在每个请求到达路径操作前、响应返回前执行：

```python
import time
from fastapi import FastAPI, Request

app = FastAPI()

@app.middleware("http")
async def add_process_time(request: Request, call_next):
    # === 请求前 ===
    start_time = time.perf_counter()

    # === 执行路径操作 ===
    response = await call_next(request)

    # === 响应后 ===
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = str(process_time)

    return response
```

⭐ **中间件执行顺序**（洋葱模型）：

```python
@app.middleware("http")
async def m1(request, call_next):
    print("m1 前置")
    response = await call_next(request)
    print("m1 后置")
    return response

@app.middleware("http")
async def m2(request, call_next):
    print("m2 前置")
    response = await call_next(request)
    print("m2 后置")
    return response
```

执行顺序：`m2 前置 → m1 前置 → 业务逻辑 → m1 后置 → m2 后置`

### 6.2 CORS 跨域

> 📖 官方文档：[CORS (Cross-Origin Resource Sharing)](https://fastapi.tiangolo.com/zh/tutorial/middleware/#cors-middleware)

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # 允许的源
    allow_credentials=True,        # 允许携带 Cookie
    allow_methods=["*"],           # 允许的方法
    allow_headers=["*"],           # 允许的请求头
)
```

---

## 7. 数据库操作 (SQLAlchemy 2.0 异步)

> 📖 官方文档：[SQL (Relational) Databases](https://fastapi.tiangolo.com/zh/tutorial/sql-databases/) | SQLAlchemy 官方：[Async ORM](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)

### 7.1 安装

```bash
pip install sqlalchemy[asyncio]   # SQLAlchemy + 异步支持
pip install aiomysql              # MySQL 异步驱动
pip install asyncpg               # PostgreSQL 异步驱动
pip install aiosqlite             # SQLite 异步驱动
```

### 7.2 异步引擎与会话配置

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator

# 数据库连接 URL
DATABASE_URL = "mysql+aiomysql://root:password@localhost:3306/mydb?charset=utf8mb4"

# 创建异步引擎
async_engine = create_async_engine(
    DATABASE_URL,
    echo=False,              # 生产环境关闭 SQL 日志
    pool_size=10,            # 连接池大小
    max_overflow=20,         # 最大溢出连接数
    pool_recycle=3600,       # 连接回收时间（防止 MySQL 8h 断连）
    pool_pre_ping=True       # 使用前检测连接可用性
)

# 创建异步会话工厂
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,  # 异步必须关闭
    autocommit=False,
    autoflush=False
)

# ORM 基类
class Base(DeclarativeBase):
    pass

# 依赖：获取数据库会话
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

### 7.3 定义模型

```python
from sqlalchemy.orm import Mapped, mapped_column

class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(nullable=False)
    author: Mapped[str] = mapped_column(index=True)
    price: Mapped[float] = mapped_column(default=0.0)
    is_published: Mapped[bool] = mapped_column(default=False)
```

### 7.4 启动时建表

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)
```

### 7.5 查询操作

```python
from sqlalchemy import select, func, or_, and_

# 查询所有
stmt = select(Book)
result = await db.execute(stmt)
books = result.scalars().all()

# 条件查询
stmt = select(Book).where(Book.id == 1)
book = (await db.execute(stmt)).scalar_one_or_none()

# 多条件
stmt = select(Book).where(Book.author == "鲁迅", Book.price > 50)

# 模糊查询
stmt = select(Book).where(Book.title.contains("Python"))
stmt = select(Book).where(Book.title.like("%Python%"))

# IN 查询
stmt = select(Book).where(Book.id.in_([1, 2, 3]))

# 排序
stmt = select(Book).order_by(Book.price.desc())

# 分页
stmt = select(Book).offset(10).limit(5)

# OR 条件
stmt = select(Book).where(
    or_(Book.price > 100, Book.author == "Gemini")
)

# 聚合查询
stmt = select(func.count(Book.id))
total = (await db.execute(stmt)).scalar()

stmt = select(func.avg(Book.price))
avg_price = (await db.execute(stmt)).scalar()
```

### 7.6 新增操作

```python
# 方式一：直接实例化
new_book = Book(title="Python入门", author="作者", price=99.9)
db.add(new_book)
await db.commit()
await db.refresh(new_book)  # 获取数据库生成的 ID

# 方式二：Pydantic → ORM（推荐）
class BookCreate(BaseModel):
    title: str
    author: str
    price: float

@app.post("/books/")
async def create_book(book_in: BookCreate, db: AsyncSession = Depends(get_db)):
    new_book = Book(**book_in.model_dump())
    db.add(new_book)
    await db.commit()
    await db.refresh(new_book)
    return new_book
```

### 7.7 更新操作

```python
from sqlalchemy import update

# 方式一：先查后改（推荐）
@app.put("/books/{book_id}")
async def update_book(book_id: int, book_in: BookUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Book).where(Book.id == book_id))
    db_book = result.scalar_one_or_none()

    if not db_book:
        raise HTTPException(status_code=404, detail="书籍不存在")

    # 部分更新：只更新传入的字段
    update_data = book_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if isinstance(value, str) and not value.strip():
            continue
        setattr(db_book, key, value)

    await db.commit()
    await db.refresh(db_book)
    return db_book

# 方式二：批量更新（不先查询）
stmt = update(Book).where(Book.author == "鲁迅").values(price=Book.price + 10)
await db.execute(stmt)
await db.commit()
```

### 7.8 删除操作

```python
from sqlalchemy import delete

# 方式一：先查后删
@app.delete("/books/{book_id}")
async def delete_book(book_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Book).where(Book.id == book_id))
    db_book = result.scalar_one_or_none()

    if not db_book:
        raise HTTPException(status_code=404, detail="书籍不存在")

    await db.delete(db_book)
    await db.commit()
    return {"message": "删除成功"}

# 方式二：直接删除
stmt = delete(Book).where(Book.id == book_id)
await db.execute(stmt)
await db.commit()
```

### 7.9 原生 SQL

```python
from sqlalchemy import text

sql = text("SELECT * FROM books WHERE author = :author AND price > :min_price")
result = await db.execute(sql, {"author": "鲁迅", "min_price": 50})
rows = result.all()  # 返回 Row 对象，不是 ORM 模型
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