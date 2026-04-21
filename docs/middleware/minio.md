MinIO 是一个高性能、兼容 Amazon S3 协议的分布式对象存储系统。

---

## Docker 安装

```bash
mkdir -p ~/minio/data

docker run \
   -p 9000:9000 \
   -p 9001:9001 \
   --name minio \
   -v ~/minio/data:/data \
   -e "MINIO_ROOT_USER=minioadmin" \
   -e "MINIO_ROOT_PASSWORD=minioadmin" \
   quay.io/minio/minio server /data --console-address ":9001"
```

| 参数 | 说明 |
|------|------|
| `-p 9000` | API 端口，SDK 连接用 |
| `-p 9001` | Console 端口，浏览器管理页面 |
| `-v ~/minio/data:/data` | 数据持久化，容器重启不丢失 |
| `MINIO_ROOT_USER` | 管理员用户名 |
| `MINIO_ROOT_PASSWORD` | 管理员密码 |

> 完整文档：[MinIO 官方安装指南](https://min.io/docs/minio/linux/index.html)

启动后浏览器访问 `http://127.0.0.1:9001` 即可进入管理控制台。

---

## 核心概念

| 概念 | 说明 |
|------|------|
| **Bucket（桶）** | 对象的命名空间，类似文件夹 |
| **Object（对象）** | 实际的数据单元，如图片、文件 |
| **Endpoint** | MinIO 服务器的网络地址，如 `http://127.0.0.1:9000` |
| **Access Key** | 相当于用户名，标识访问者身份 |
| **Secret Key** | 相当于密码，验证访问者身份 |

---

## 访问权限

Bucket 有三种访问模式：

- **Private**：只有所有者可以读写（默认）
- **Public**：所有人可读写
- **Custom**：自定义权限策略（JSON）

最常见的场景是：**允许所有人读，只有所有者写**。自定义策略示例：

```json
{
  "Statement": [
    {
      "Action": "s3:GetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ],
  "Version": "2012-10-17"
}
```

把 `your-bucket-name` 替换成实际的桶名即可。完整权限文档：[Policy-Based Access Control](https://min.io/docs/minio/linux/administration/identity-access-management/policy-based-access-control.html)

---

## Java SDK

> 官方文档：[MinIO Java SDK](https://minio.org.cn/docs/minio/linux/developers/java/minio-java.html)

**依赖**：

```xml
<dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>8.5.17</version>
</dependency>
```

**快速示例**：

```java
import io.minio.*;

public class MinioDemo {
    public static void main(String[] args) throws Exception {
        // 1. 连接
        MinioClient client = MinioClient.builder()
                .endpoint("http://127.0.0.1:9000")
                .credentials("minioadmin", "minioadmin")
                .build();

        // 2. 创建桶（不存在时）
        String bucket = "my-bucket";
        boolean found = client.bucketExists(BucketExistsArgs.builder()
                .bucket(bucket).build());
        if (!found) {
            client.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
        }

        // 3. 上传文件
        client.uploadObject(UploadObjectArgs.builder()
                .bucket(bucket)
                .object("test.png")
                .filename("C:\\Users\\test\\Pictures\\1.png")
                .build());

        // 4. 下载文件
        client.downloadObject(DownloadObjectArgs.builder()
                .bucket(bucket)
                .object("test.png")
                .filename("C:\\Users\\test\\Downloads\\test.png")
                .build());
    }
}
```

---

## Python SDK

> 官方文档：[MinIO Python SDK](https://minio.org.cn/docs/minio/linux/developers/python/API.html)

**安装**：

```bash
pip install minio
```

**快速示例**：

```python
from minio import Minio
from minio.error import S3Error

# 1. 连接
client = Minio(
    "127.0.0.1:9000",
    access_key="minioadmin",
    secret_key="minioadmin",
    secure=False  # HTTP 设为 False，HTTPS 设为 True
)

bucket = "my-bucket"

# 2. 创建桶（不存在时）
found = client.bucket_exists(bucket)
if not found:
    client.make_bucket(bucket)

# 3. 上传文件
client.fput_object(
    bucket_name=bucket,
    object_name="test.png",
    file_path="/path/to/local/test.png"
)

# 4. 下载文件
client.fget_object(
    bucket_name=bucket,
    object_name="test.png",
    file_path="/path/to/save/test.png"
)
```
