# SSE（Server-Sent Events）

> 参考文档：[MDN — Server-Sent Events](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events)

SSE 是 HTTP 协议的一个**巧妙应用**——不发明新协议，纯粹靠声明 HTTP 响应头实现流式推送。

## 原理

客户端发一个普通 GET 请求，请求头声明 `Accept: text/event-stream`。服务端响应 `Content-Type: text/event-stream`，然后**保持连接不关闭**，持续往响应体里追加数据。整个过程就是一个普通的 HTTP 连接，只是响应体变成了无限流。

```
客户端请求：
  GET /stream HTTP/1.1
  Accept: text/event-stream

服务端响应：
  HTTP/1.1 200 OK
  Content-Type: text/event-stream
  Cache-Control: no-cache
  Connection: keep-alive

  data: {"msg": "第一段内容"}

  data: {"msg": "第二段内容"}

  data: [DONE]
```

## 数据格式

SSE 的消息由几个字段组成：

| 字段 | 作用 | 示例 |
|------|------|------|
| `data:` | 消息内容 | `data: {"msg": "你好"}` |
| `event:` | 事件类型（可选） | `event: chat` |
| `id:` | 消息 ID，断线重连时发给服务端 | `id: 42` |
| `retry:` | 重连间隔（毫秒） | `retry: 3000` |

不带 `event` 时，客户端收到的是默认的 `message` 事件。

```
event: chat
data: {"user": "张三", "msg": "你好"}

event: system
data: {"status": "online"}

id: 42
data: 普通消息（无 event 类型，触发 message 事件）
```

客户端可以通过 `addEventListener` 监听不同类型的事件：

```javascript
const es = new EventSource("/stream");

// 监听 chat 事件
es.addEventListener("chat", (e) => {
    const data = JSON.parse(e.data);
    console.log(data.user, data.msg);
});

// 监听 system 事件
es.addEventListener("system", (e) => {
    console.log("系统通知:", e.data);
});

// 监听所有消息（包括没写 event 的）
es.onmessage = (e) => { ... };
```

## 三个阶段

**连接建立** — 客户端发 GET，服务端返回 200 + `text/event-stream`，TCP 连接保持

**数据传输** — 服务端不断写入消息（`data:` + `event:` 等），客户端用 `EventSource` API 按事件类型分发处理

**连接关闭** — 服务端发完数据或客户端主动断开

## SSE vs WebSocket

> [!tip] 一句话
> 只需要服务端往客户端推数据 → **SSE**。需要双方实时对话 → **WebSocket**。

| 维度 | SSE | WebSocket |
|------|-----|-----------|
| 通信方向 | 单向（服务端 → 客户端） | 全双工（双向） |
| 协议 | 标准 HTTP | 独立协议（ws/wss） |
| 数据格式 | 纯文本 | 文本 + 二进制 |
| 断线重连 | 自带 | 需手动实现 |

SSE 的优势：基于 HTTP 防火墙友好、自带断线重连、实现轻量。

WebSocket 的优势：全双工双向通信、延迟更低。

## 典型场景

大模型流式输出（OpenAI、Anthropic）默认都用 SSE，因为场景就是"服务端生成 → 客户端接收"，单向推送就够了。
