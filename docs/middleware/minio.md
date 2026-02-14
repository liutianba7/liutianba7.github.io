### **基础概念**

- **对象（Object）** 

  对象是实际的数据单元，例如我们上传的一个图片。

- **存储桶（Bucket）**

  存储桶是用于组织对象的命名空间，类似于文件夹。每个存储桶可以包含多个对象。

- **端点（Endpoint）** 

  端点是MinIO服务器的网络地址，用于访问存储桶和对象，例如`http://192.168.10.101:9000`

  **注意：**

  `9000`为MinIO的API的默认端口，前边配置的`9001`以为管理页面端口。

- **Access Key 和 Secret Key**

  **Access Key**是用于标识和验证访问者身份的唯一标识符，相当于用户名。

  **Secret Key**是与**Access Key**关联的密码，用于验证访问者的身份。

### **MinIO管理页面操作**

#### 登录

管理页面的地址为http://192.168.10.101:9001，登录的用户名和密码为部署时在`EnvironmentFile`文件中配置的如下参数

```ini
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
```

#### 创建 bucket

<p align='center'>
    <img src="../assets/imgs/middleware/minio/minio1.png" style="width: 700px; height: 300px; object-fit: cover;" />
</p>


#### 上传图片

找到目标桶

<p align='center'>
    <img src="../assets/imgs/middleware/minio/minio2.png" style="width: 700px; height: 300px; object-fit: cover;"/>
</p>
上传图片

<p align='center'>
    <img src="../assets/imgs/middleware/minio/minio3.png" style="width: 700px; height: 300px; object-fit: cover;" />
</p>


#### 找到图片

由于MinIO提供了HTTP访问功能，所以可以通过浏览器直接访问对象。对象URL为MinIO的`Endpoint`+`对象的存储路径`，例如下图中的图片对象的URL为 : [http:192.168.10.101:9000/test/公寓-外观.jpg](http:192.168.10.101:9000/test/公寓-外观.jpg)。

<p align='center'>
    <img src="../assets/imgs/middleware/minio/minio4.png" style="width: 700px; height: 300px; object-fit: cover;" />
</p>


#### 访问权限

不出意外的话，使用浏览器访问上述URL，会得到如下响应，很显然是没有访问权限。

```xml
<Error>
    <Code>AccessDenied</Code>
    <Message>Access Denied.</Message>
    <Key>公寓-外观.jpg</Key>
    <BucketName>test</BucketName>
    <Resource>/test/公寓-外观.jpg</Resource>
    <RequestId>177BC92022FC5684</RequestId>
    <HostId>dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8</HostId>
</Error>
```

若想继续访问图片，需要修改图片**所在桶**的访问权限，如下图所示

<p align='center'>
    <img src="../assets/imgs/middleware/minio/minio5.png" style="width: 700px; height: 300px; object-fit: cover;" />
</p>



如上图所示，可选的访问权限共有三个选项，分别是`Private`、`Public`和`Custom`，具体说明如下

- `Private`

  只允许桶的所有者对该桶进行读写。

- `Public`

  允许所有人对该桶进行读写。

- `Custom`

  自定义访问权限。

若想将权限设置为只允许所有者写，但允许所有人读，就需要自定义访问权限。自定义访问权限，需要使用一个规定格式的JSON字符串进行描述，具体格式可参考[官方文档](https://min.io/docs/minio/linux/administration/identity-access-management/policy-based-access-control.html#policy-document-structure)。

例如以下JSON字符串表达的含义是：允许(`Allow`)所有人(`*`)读取(`s3:GetObject`)指定桶(`test`)的所有内容。

```json
{
  "Statement" : [ {
    "Action" : "s3:GetObject",
    "Effect" : "Allow",
    "Principal" : "*",
    "Resource" : "arn:aws:s3:::test/*"
  } ],
  "Version" : "2012-10-17"
}
```

将`test`桶访问权限设置为`Custom`，并添加上述内容,改成自己的桶名！

重新访问[http:192.168.10.101:9000/test/公寓-外观.jpg](http:192.168.10.101:9000/test/公寓-外观.jpg)，观察是否正常。

### **MinIO Java SDK**

MinIO提供了多种语言的SDK供开发者使用，本项目需要用到Java SDK，下面通过一个简单案例熟悉一下其基本用法，具体内容可参考[官方文档](https://www.minio.org.cn/docs/minio/linux/developers/java/minio-java.html#)。

1. **创建一个Maven项目**

2. **引入如下依赖**

   ```xml
   <dependency>
       <groupId>io.minio</groupId>
       <artifactId>minio</artifactId>
       <version>8.5.3</version>
   </dependency>
   ```

3. **编写如下内容**

   ```java
   package person.ltb;
   
   
   import io.minio.*;
   import io.minio.errors.*;
   
   import java.io.IOException;
   import java.security.InvalidKeyException;
   import java.security.NoSuchAlgorithmException;
   
   public class Minio {
       public static void main(String[] args) throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
           // 连接参数
           String endpoint = "http://43.143.165.110:9000";
           String accessKey = "minioadmin";
           String accessSecret = "minioadmin";
   
   
           // 创建MinioClient对象
           MinioClient minioClient = MinioClient.builder()
                   .endpoint(endpoint)
                   .credentials(accessKey, accessSecret)
                   .build();
   
           // 如果桶不存在，就去创建一个新桶
           String bucketName = "lease";
           boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
   
           if (!found) {
               // 创建桶
               minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
               String policy = """
                        {
                             "Statement" : [ {
                               "Action" : "s3:GetObject",
                               "Effect" : "Allow",
                               "Principal" : "*",
                               "Resource" : "arn:aws:s3:::hello-minio/*"
                             } ],
                             "Version" : "2012-10-17"
                       }
                       """;
   
               minioClient.setBucketPolicy(SetBucketPolicyArgs.builder().bucket(bucketName).config(policy).build());
           } else {
               System.out.println("Bucket already exists.");
           }
   
           // 上传一张图片
           minioClient.uploadObject(
                   UploadObjectArgs.builder()
                           .bucket(bucketName)
                           .object("test.png")
                           .filename("C:\\Users\\xx\\Pictures\\sy\\1.png")
                           .build()
           );
   
           // 拼接访问地址
           String url = endpoint + "/" + bucketName + "/" + "test.png";
   
           System.out.println(url);
       }
   }
   
   ```

4. **运行测试**

   运行上述代码，然后查看MinIO管理页面，观察是否上传成功。