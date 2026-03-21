# Requests - HTTP 请求库

## 一、简介

Requests 是 Python 最流行的 HTTP 客户端库，简洁优雅的 API 设计让其成为网络请求的首选。

### 1.1 安装

```bash
pip install requests
```

### 1.2 特点

- 简洁的 API 设计
- 自动解码响应内容
- 自动处理连接池
- 支持会话、Cookie
- 完整的 HTTPS 支持

---

## 二、基本用法

### 2.1 GET 请求

```python
import requests

# 基本请求
response = requests.get('https://api.github.com')

# 带参数的请求
params = {'key': 'value', 'page': 1}
response = requests.get('https://httpbin.org/get', params=params)

# 添加请求头
headers = {'User-Agent': 'my-app'}
response = requests.get('https://httpbin.org/get', headers=headers)

# 获取响应内容
print(response.text)           # 文本内容
print(response.json())         # JSON 解析
print(response.content)        # 字节内容
print(response.status_code)    # 状态码
print(response.headers)        # 响应头
```

### 2.2 POST 请求

```python
# 表单数据
data = {'username': 'admin', 'password': '123456'}
response = requests.post('https://httpbin.org/post', data=data)

# JSON 数据
import json
json_data = {'name': 'test', 'value': 123}
response = requests.post(
    'https://httpbin.org/post',
    json=json_data  # 自动设置 Content-Type: application/json
)

# 上传文件
files = {'file': open('report.pdf', 'rb')}
response = requests.post('https://httpbin.org/post', files=files)

# 上传多个文件
files = [
    ('file1', open('file1.txt', 'rb')),
    ('file2', ('custom_name.txt', open('file2.txt', 'rb'), 'text/plain'))
]
response = requests.post('https://httpbin.org/post', files=files)
```

### 2.3 其他 HTTP 方法

```python
# PUT
requests.put('https://httpbin.org/put', data={'key': 'value'})

# DELETE
requests.delete('https://httpbin.org/delete')

# HEAD
requests.head('https://httpbin.org/get')

# OPTIONS
requests.options('https://httpbin.org/get')

# PATCH
requests.patch('https://httpbin.org/patch', data={'key': 'value'})
```

---

## 三、会话与 Cookie

### 3.1 Session 对象

```python
# Session 可以跨请求保持参数（如 Cookie）
session = requests.Session()

# 设置全局请求头
session.headers.update({'User-Agent': 'my-app'})

# 登录获取 Cookie
session.post('https://example.com/login', data={'user': 'admin', 'pass': '123'})

# 后续请求自动携带 Cookie
response = session.get('https://example.com/dashboard')

# 关闭会话
session.close()

# 使用上下文管理器
with requests.Session() as session:
    session.get('https://example.com')
```

### 3.2 Cookie 操作

```python
# 获取响应 Cookie
response = requests.get('https://httpbin.org/cookies')
print(response.cookies['cookie_name'])

# 发送 Cookie
cookies = {'user': 'admin', 'token': 'abc123'}
response = requests.get('https://httpbin.org/cookies', cookies=cookies)

# Session 级别的 Cookie
session = requests.Session()
session.cookies.set('user', 'admin')
```

---

## 四、超时与重试

### 4.1 超时设置

```python
# 连接超时和读取超时（秒）
requests.get('https://httpbin.org', timeout=5)

# 分别设置连接超时和读取超时
requests.get('https://httpbin.org', timeout=(3, 10))

# 永远等待（不推荐）
requests.get('https://httpbin.org', timeout=None)
```

### 4.2 重试机制

```python
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()

# 配置重试策略
retry_strategy = Retry(
    total=3,                    # 总重试次数
    backoff_factor=1,            # 重试间隔因子
    status_forcelist=[429, 500, 502, 503, 504],  # 触发重试的状态码
)

adapter = HTTPAdapter(max_retries=retry_strategy)
session.mount('http://', adapter)
session.mount('https://', adapter)

response = session.get('https://httpbin.org')
```

---

## 五、代理与认证

### 5.1 代理设置

```python
# HTTP 代理
proxies = {
    'http': 'http://10.10.1.10:3128',
    'https': 'http://10.10.1.10:1080',
}
requests.get('https://httpbin.org', proxies=proxies)

# SOCKS 代理（需要安装 pysocks）
proxies = {
    'http': 'socks5://user:pass@host:port',
    'https': 'socks5://user:pass@host:port',
}
requests.get('https://httpbin.org', proxies=proxies)

# 环境变量方式
# export HTTP_PROXY="http://10.10.1.10:3128"
# export HTTPS_PROXY="http://10.10.1.10:1080"
```

### 5.2 认证

```python
# Basic 认证
from requests.auth import HTTPBasicAuth
response = requests.get(
    'https://api.github.com/user',
    auth=HTTPBasicAuth('user', 'pass')
)

# 简写形式
response = requests.get('https://api.github.com/user', auth=('user', 'pass'))

# Digest 认证
from requests.auth import HTTPDigestAuth
response = requests.get('https://httpbin.org/digest-auth/auth/user/pass',
                        auth=HTTPDigestAuth('user', 'pass'))

# OAuth（需要安装 requests-oauthlib）
from requests_oauthlib import OAuth1
auth = OAuth1('client_key', 'client_secret', 'token', 'token_secret')
response = requests.get('https://api.twitter.com/1.1/account/verify_credentials.json',
                       auth=auth)
```

---

## 六、异常处理

```python
from requests.exceptions import (
    RequestException,
    Timeout,
    ConnectionError,
    HTTPError,
    TooManyRedirects
)

try:
    response = requests.get('https://httpbin.org', timeout=3)
    response.raise_for_status()  # 状态码非 2xx 抛出 HTTPError
except Timeout:
    print('请求超时')
except ConnectionError:
    print('连接错误')
except HTTPError as e:
    print(f'HTTP 错误: {e.response.status_code}')
except TooManyRedirects:
    print('重定向过多')
except RequestException as e:
    print(f'请求异常: {e}')
```

---

## 七、高级用法

### 7.1 流式下载大文件

```python
# 流式下载
response = requests.get('https://example.com/large-file.zip', stream=True)

with open('large-file.zip', 'wb') as f:
    for chunk in response.iter_content(chunk_size=8192):
        f.write(chunk)

# 显示下载进度
import os
response = requests.get('https://example.com/large-file.zip', stream=True)
total_size = int(response.headers.get('content-length', 0))

with open('large-file.zip', 'wb') as f:
    downloaded = 0
    for chunk in response.iter_content(chunk_size=8192):
        f.write(chunk)
        downloaded += len(chunk)
        print(f'Downloaded: {downloaded}/{total_size} bytes')
```

### 7.2 流式上传

```python
def generate_data():
    yield b'part1'
    yield b'part2'
    yield b'part3'

response = requests.post('https://httpbin.org/post', data=generate_data())
```

### 7.3 SSL 证书验证

```python
# 忽略 SSL 证书验证（不安全，仅用于测试）
requests.get('https://example.com', verify=False)

# 指定证书文件
requests.get('https://example.com', verify='/path/to/certfile')

# 客户端证书
requests.get('https://example.com', cert=('/path/client.cert', '/path/client.key'))
```

### 7.4 响应内容编码

```python
response = requests.get('https://example.com')

# 自动检测编码
print(response.encoding)

# 手动指定编码
response.encoding = 'utf-8'
print(response.text)

# 获取原始响应
response.raw
```