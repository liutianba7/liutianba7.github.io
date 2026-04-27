# MongoDB 基础

> 参考文档：
> - [MongoDB 官方手册](https://www.mongodb.com/zh-cn/docs/manual/)
> - [MongoDB CRUD 操作](https://www.mongodb.com/zh-cn/docs/manual/crud/)
> - [MongoDB Shell (mongosh)](https://www.mongodb.com/zh-cn/docs/mongodb-compass/current/shell/)

---

## 一、MongoDB 简介

MongoDB 是一个基于**分布式文件存储**的开源 NoSQL 数据库，使用 **C++** 编写，数据存储为 **BSON**（Binary JSON）格式。

> 📖 [MongoDB 官方手册](https://www.mongodb.com/zh-cn/docs/manual/)

!!! tip "为什么选择 MongoDB"
    - **灵活的 Schema**：集合中的文档不需要有相同的字段结构
    - **类 JSON 格式**：对前端/Node.js/Python 开发者友好
    - **原生支持分布式**：副本集（高可用）+ 分片集群（水平扩展）
    - **丰富的查询能力**：支持嵌套文档查询、数组查询、聚合管道

---

## 二、Docker 部署

> 📖 [Docker 安装参考](https://www.mongodb.com/zh-cn/docs/manual/tutorial/install-mongodb-enterprise-with-docker/)

```bash
# 拉取镜像
docker pull mongo:7.0

# 启动容器
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo:7.0 \
  --auth

# 进入 mongosh 交互模式
docker exec -it mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

!!! warning "认证模式"
    加上 `--auth` 参数后，所有操作都需要认证。默认会创建 `admin` 数据库用于认证管理。

---

## 三、核心概念

> 📖 [核心概念文档](https://www.mongodb.com/zh-cn/docs/manual/core/data-model-introduction/)

### 3.1 术语对照

| 关系型数据库 | MongoDB |
|-------------|---------|
| 数据库（Database） | 数据库（Database） |
| 表（Table） | **集合（Collection）** |
| 行（Row） | **文档（Document）** |
| 列（Column） | **字段（Field）** |
| 主键（Primary Key） | `_id`（自动生成 ObjectId） |
| 索引（Index） | 索引（Index） |

### 3.2 数据库层次

```
Server（MongoDB 实例）
├── Database（数据库）
│   ├── Collection（集合）
│   │   ├── Document（文档）
│   │   │   ├── Field（字段）: value
│   │   │   └── Field（字段）: value
│   │   └── Document
│   └── Collection
└── Database
```

### 3.3 BSON 数据类型

> 📖 [BSON 类型文档](https://www.mongodb.com/zh-cn/docs/manual/reference/bson-types/)

| 类型 | 说明 | 示例 |
|------|------|------|
| `String` | UTF-8 字符串 | `"张三"` |
| `Number` | 整数 / 浮点数 | `25`, `3.14` |
| `Boolean` | 布尔值 | `true`, `false` |
| `Array` | 数组 | `[1, 2, 3]` |
| `Object` | 嵌套文档 | `{name: "张三"}` |
| `ObjectId` | 12 字节唯一 ID | `ObjectId("507f1f...")` |
| `Date` | 日期时间 | `ISODate("2024-01-01")` |
| `null` | 空值 | `null` |

---

## 四、基础操作（CRUD）

### 4.1 插入文档

> 📖 [插入文档官方教程](https://www.mongodb.com/zh-cn/docs/manual/tutorial/insert-documents/)

```javascript
// 切换/创建数据库
use myblog

// 插入单条文档
db.users.insertOne({
    name: "张三",
    age: 25,
    email: "zhangsan@example.com",
    tags: ["Java", "Python"],
    createdAt: new Date()
})

// 插入多条文档
db.users.insertMany([
    { name: "李四", age: 28, email: "lisi@example.com" },
    { name: "王五", age: 30, email: "wangwu@example.com" },
    { name: "赵六", age: 22, email: "zhaoliu@example.com" }
])
```

!!! tip "隐式创建"
    MongoDB 不需要提前创建数据库或集合。第一次向某个集合插入文档时，数据库和集合会自动创建。

### 4.2 查询文档

> 📖 [查询文档官方教程](https://www.mongodb.com/zh-cn/docs/manual/tutorial/query-documents/)

```javascript
// 查询所有文档
db.users.find()

// 条件查询
db.users.find({ age: 25 })

// 条件查询（格式化输出）
db.users.find({ age: { $gte: 25 } }).pretty()
```

#### 常用查询操作符

| 操作符 | 含义 | 示例 |
|--------|------|------|
| `$eq` | 等于 | `{ age: { $eq: 25 } }` |
| `$ne` | 不等于 | `{ age: { $ne: 25 } }` |
| `$gt` | 大于 | `{ age: { $gt: 25 } }` |
| `$gte` | 大于等于 | `{ age: { $gte: 25 } }` |
| `$lt` | 小于 | `{ age: { $lt: 30 } }` |
| `$lte` | 小于等于 | `{ age: { $lte: 30 } }` |
| `$in` | 在数组中 | `{ age: { $in: [25, 28] } }` |
| `$nin` | 不在数组中 | `{ age: { $nin: [25, 28] } }` |
| `$regex` | 正则匹配 | `{ name: { $regex: "^张" } }` |
| `$exists` | 字段存在 | `{ email: { $exists: true } }` |

#### 逻辑操作符

```javascript
// AND：逗号分隔即可
db.users.find({ age: { $gte: 25 }, name: "李四" })

// OR
db.users.find({ $or: [
    { age: { $lt: 23 } },
    { name: "赵六" }
]})

// AND + OR 混合
db.users.find({
    age: { $gte: 25 },
    $or: [
        { tags: "Java" },
        { tags: "Python" }
    ]
})
```

#### 投影（选择返回字段）

```javascript
// 只返回 name 和 age（排除 _id）
db.users.find({}, { name: 1, age: 1, _id: 0 })
```

#### 排序、分页、计数

```javascript
// 排序（1=升序，-1=降序）
db.users.find().sort({ age: -1 })

// 跳过 + 限制
db.users.find().sort({ age: -1 }).skip(0).limit(10)

// 统计数量
db.users.countDocuments({ age: { $gte: 25 } })
```

!!! tip "查询技巧"
    查询嵌套文档字段使用点号：`db.users.find({ "address.city": "北京" })`

### 4.3 更新文档

> 📖 [更新文档官方教程](https://www.mongodb.com/zh-cn/docs/manual/tutorial/update-documents/)

```javascript
// 更新单条（第一个匹配项）
db.users.updateOne(
    { name: "张三" },
    { $set: { age: 26 } }
)

// 更新多条（所有匹配项）
db.users.updateMany(
    { age: { $lt: 25 } },
    { $set: { status: "junior" } }
)

// 替换整个文档（不包括 _id）
db.users.replaceOne(
    { name: "张三" },
    { name: "张三丰", age: 30, email: "new@example.com" }
)
```

#### 常用更新操作符

| 操作符 | 含义 |
|--------|------|
| `$set` | 设置字段值（字段不存在则新增） |
| `$unset` | 删除字段 |
| `$inc` | 字段值增加 |
| `$push` | 向数组追加元素 |
| `$pull` | 从数组中删除元素 |
| `$rename` | 重命名字段 |

```javascript
// 数组操作
db.users.updateOne(
    { name: "张三" },
    {
        $push: { tags: "Go" },      // 添加元素
        $pull: { tags: "Java" },    // 删除元素
        $inc:  { age: 1 }           // 年龄 +1
    }
)
```

### 4.4 删除文档

> 📖 [删除文档官方教程](https://www.mongodb.com/zh-cn/docs/manual/tutorial/remove-documents/)

```javascript
// 删除单条（第一个匹配项）
db.users.deleteOne({ name: "赵六" })

// 删除多条（所有匹配项）
db.users.deleteMany({ age: { $lt: 25 } })

// 删除集合中所有文档（保留索引）
db.users.deleteMany({})

// 删除整个集合（含索引）
db.users.drop()
```

---

## 五、索引基础

> 📖 [索引官方文档](https://www.mongodb.com/zh-cn/docs/manual/indexes/)

### 5.1 创建索引

```javascript
// 单字段索引
db.users.createIndex({ name: 1 })  // 1=升序，-1=降序

// 复合索引
db.users.createIndex({ name: 1, age: -1 })

// 唯一索引
db.users.createIndex({ email: 1 }, { unique: true })

// TTL 索引（自动过期删除）
db.logs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })

// 查看所有索引
db.users.getIndexes()
```

### 5.2 查看执行计划

```javascript
// 分析查询是否走索引
db.users.find({ name: "张三" }).explain("executionStats")
```

!!! tip "索引优化"
    - MongoDB 默认会为 `_id` 字段自动创建唯一索引
    - 复合索引同样遵循**最左前缀原则**
    - 索引不是越多越好，每次写入都需要更新索引树

---

## 六、与 Python 集成

> 📖 [PyMongo 官方文档](https://www.mongodb.com/zh-cn/docs/drivers/pymongo/)

```bash
pip install pymongo
```

```python
from pymongo import MongoClient

# 1. 连接数据库
client = MongoClient("mongodb://admin:admin123@localhost:27017/")
db = client["myblog"]
users = db["users"]

# 2. 插入
users.insert_one({"name": "张三", "age": 25})
users.insert_many([
    {"name": "李四", "age": 28},
    {"name": "王五", "age": 30}
])

# 3. 查询
for user in users.find({"age": {"$gte": 25}}).sort("age", -1):
    print(user["name"], user["age"])

# 4. 更新
users.update_one({"name": "张三"}, {"$set": {"age": 26}})

# 5. 删除
users.delete_one({"name": "李四"})
```

!!! warning "连接字符串"
    认证模式下的连接格式：`mongodb://用户名:密码@host:port/?authSource=admin`
