# HTTP 协议

> 官方文档：[RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) | [RFC 9112 — HTTP/1.1](https://www.rfc-editor.org/rfc/rfc9112)

HTTP（HyperText Transfer Protocol）是应用层的**请求-响应协议**，基于 TCP，无状态。客户端发一个请求，服务端回一个响应，每次请求相互独立。

## 请求报文

```
GET /api/users?page=1 HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer xxx

```

	一个请求包含四部分：**方法 + URL + 请求头 + 请求体**。

**常用方法**

| 方法 | 语义 | 幂等 |
|------|------|------|
| `GET` | 查询资源 | 是 |
| `POST` | 创建资源 | 否 |
| `PUT` | 全量更新 | 是 |
| `PATCH` | 部分更新 | 否 |
| `DELETE` | 删除资源 | 是 |

> [!tip] 幂等是什么意思
> 同一个请求发一次和发 N 次，效果一样。GET、PUT、DELETE 都是幂等的，POST 不是——多次提交可能创建多条记录。

**常见请求头**

| 请求头             | 作用         | 示例                               |
| --------------- | ---------- | -------------------------------- |
| `Host`          | 目标服务器域名    | `Host: example.com`              |
| `Content-Type`  | 请求体数据格式    | `Content-Type: application/json` |
| `Authorization` | 身份认证       | `Authorization: Bearer xxx`      |
| `Accept`        | 期望的响应格式    | `Accept: application/json`       |
| `User-Agent`    | 客户端信息      | `User-Agent: Mozilla/5.0`        |
| `Cookie`        | 携带的 Cookie | `Cookie: session_id=abc123`      |

## 响应报文

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 45

{"id": 1, "name": "张三"}
```

一个响应包含三部分：**状态行 + 响应头 + 响应体**。

**常见状态码**

| 状态码 | 含义 | 场景 |
|--------|------|------|
| `200` | 成功 | 请求正常处理 |
| `201` | 已创建 | POST 成功创建资源 |
| `204` | 无内容 | DELETE 成功，没有返回体 |
| `301` | 永久重定向 | 旧 URL → 新 URL |
| `304` | 未修改 | 浏览器缓存命中，不返回内容 |
| `400` | 请求错误 | 参数格式不对 |
| `401` | 未认证 | 没登录或 Token 过期 |
| `403` | 无权限 | 登录了但没有操作权限 |
| `404` | 未找到 | 资源不存在 |
| `500` | 服务器错误 | 后端代码报错了 |
| `502` | 网关错误 | Nginx 后面的服务挂了 |
| `503` | 服务不可用 | 服务过载或正在维护 |

## Content-Type（重点）

`Content-Type` 声明**消息体的数据格式**，格式为 `类型/子类型`（如 `application/json`、`text/html`），告诉对方"我发的是什么"或"你该按什么格式解析"。日常开发最容易踩坑——设错了服务端就解析不出参数。

> [!info] 在 FastAPI 中为什么用 `media_type`？
> `Content-Type` 是 HTTP 响应头的**名字**，`media_type` 是头的**值**（如 `text/html`）。Starlette（FastAPI 底层框架）用 `media_type` 命名更精确——它只负责设置这个值，FastAPI 会自动把它塞到 `Content-Type` 响应头里。

### 按场景分类

**前后端 API 交互**

| Content-Type                        | 数据格式            | 示例                               |
| ----------------------------------- | --------------- | -------------------------------- |
| `application/json`                  | JSON 文本         | `{"name": "张三"}`                 |
| `application/x-www-form-urlencoded` | `key=value&...` | `name=%E5%BC%A0%E4%B8%89&age=25` |

`application/json` 是最常用的 API 交互格式。`x-www-form-urlencoded` 是 HTML 表单的默认格式，和 GET 的 query string 格式一样，只不过放在请求体里。

> [!warning] 常见踩坑
> 用 Postman 测试 POST 接口时，如果选了 `form-data` 但后端用 `request.json()` 解析，会拿不到数据——Content-Type 不匹配。

**文件操作**

| Content-Type | 场景 | 关键特征 |
|-------------|------|---------|
| `multipart/form-data` | **文件上传** | 用 `boundary` 分隔符把请求体切成多段，每段可有不同的 Content-Type |
| `application/octet-stream` | **文件下载** | 告诉浏览器"这是二进制流，请当作文件下载" |

文件上传示例：

```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="photo.jpg"
Content-Type: image/jpeg

（二进制文件内容）
------WebKitFormBoundary
Content-Disposition: form-data; name="description"

我的照片
------WebKitFormBoundary--
```

文件下载示例：

```
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="report.pdf"

（二进制流）
```

**其他类型**

| Content-Type | 场景 |
|-------------|------|
| `text/html` | 返回网页，浏览器自动渲染 |
| `text/plain` | 纯文本，调试接口时常用 |
| `text/event-stream` | SSE 流式推送（见下方） |

## HTTP/1.1 vs HTTP/2 vs HTTP/3

| 维度 | HTTP/1.1 | HTTP/2 | HTTP/3 |
|------|----------|--------|--------|
| 传输层 | TCP | TCP | **QUIC（基于 UDP）** |
| 多路复用 | ❌ 队头阻塞 | ✅ 二进制分帧 | ✅ 彻底解决队头阻塞 |
| 头部压缩 | ❌ | ✅ HPACK | ✅ QPACK |
| 服务端推送 | 支持 | 支持 | 已废弃 |
| 连接建立 | 慢（TCP + TLS） | 同上 | 快（0-RTT 握手） |

> [!note] 实际建议
> 现在新项目基本都走 HTTP/2 或 HTTP/3。HTTP/1.1 的时代基本过去了，但面试和日常调试还是会经常遇到。

## HTTP 的妙用：SSE

SSE 是 HTTP 协议的一个巧妙应用——不发明新协议，纯粹靠声明 HTTP 响应头实现流式推送。大模型流式输出（OpenAI、Anthropic）默认都用 SSE。

详细说明见：[[SSE]]
