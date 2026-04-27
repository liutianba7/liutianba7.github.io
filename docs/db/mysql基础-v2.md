# MySQL 基础

> MySQL 8.0 参考文档：[MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)

---

## 一、SQL 语言分类

SQL（Structured Query Language）是用于管理关系型数据库的标准语言，按功能分为四类：

| 简称 | 全称 | 用途 | 核心关键字 |
|------|------|------|------------|
| **DDL** | Data Definition Language | 定义数据库对象（库、表、列） | `CREATE`、`ALTER`、`DROP` |
| **DML** | Data Manipulation Language | 对表中记录进行增删改 | `INSERT`、`DELETE`、`UPDATE` |
| **DQL** | Data Query Language | 查询表中记录 | `SELECT`、`FROM`、`WHERE` |
| **DCL** | Data Control Language | 定义权限与安全级别 | `GRANT`、`REVOKE` |

!!! tip "SQL 书写规范"
    1. 每条 SQL 语句以 `;` 结尾
    2. `CREATE TABLE` 使用 `()` 包裹列定义，不是 `{}`
    3. 变量名与关键字冲突时，用反引号 `` ` `` 包裹

---

## 二、DDL — 数据库与表操作

### 2.1 数据库操作

```sql
-- 查看所有数据库
SHOW DATABASES;

-- 创建数据库（推荐指定字符集）
CREATE DATABASE IF NOT EXISTS db_name
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_general_ci;

-- 切换数据库
USE db_name;

-- 删除数据库
DROP DATABASE IF EXISTS db_name;
```

!!! warning "注意"
    - `CREATE DATABASE` 是**单数**，不是 `DATABASES`
    - `DROP DATABASE` 同理，不要用 `DROP DATABASES`

### 2.2 表操作

```sql
-- 创建表
CREATE TABLE IF NOT EXISTS users (
    id   INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age  INT
);

-- 查看所有表
SHOW TABLES;

-- 查看表结构
DESC users;

-- 删除表
DROP TABLE IF EXISTS users;

-- 修改表
ALTER TABLE users ADD COLUMN email VARCHAR(100);      -- 添加列
ALTER TABLE users DROP COLUMN email;                   -- 删除列
ALTER TABLE users MODIFY COLUMN name VARCHAR(100);     -- 修改列类型
ALTER TABLE users CHANGE COLUMN name username VARCHAR(50); -- 修改列名

-- 重命名表
RENAME TABLE users TO new_users;
```

!!! info "ALTER TABLE 操作速记"
    - `ADD` — 添加列
    - `DROP` — 删除列
    - `MODIFY` — 修改列类型
    - `CHANGE` — 修改列名 + 类型

---

## 三、DML — 数据增删改

```sql
-- 新增数据（支持批量插入）
INSERT INTO users (name, age) VALUES
    ('张三', 20),
    ('李四', 25),
    ('王五', 30);

-- 删除数据
DELETE FROM users WHERE id = 1;

-- 修改数据
UPDATE users SET age = 21, name = '张三丰' WHERE id = 1;
```

!!! warning "安全提醒"
    `DELETE` 和 `UPDATE` 操作**务必加 `WHERE` 条件**，否则将影响全表数据！

---

## 四、DQL — 数据查询

### 4.1 简单查询

```sql
-- 查询所有列
SELECT * FROM users;

-- 查询指定列
SELECT name, age FROM users;

-- 别名
SELECT name AS username, age FROM users;
```

### 4.2 条件查询

```sql
SELECT * FROM users WHERE age > 18;
```

| 运算符类型 | 示例 |
|-----------|------|
| 比较运算 | `>`、`<`、`>=`、`<=`、`=`、`!=` |
| 逻辑运算 | `AND`、`OR`、`NOT` |
| 范围查询 | `BETWEEN 10 AND 20` |
| 集合查询 | `IN ('张三', '李四')`、`NOT IN (...)` |
| 模糊匹配 | `LIKE '张%'`（`%` 匹配任意字符，`_` 匹配单个字符） |
| 空值判断 | `IS NULL`、`IS NOT NULL` |

### 4.3 排序查询

```sql
SELECT * FROM users ORDER BY age DESC;      -- 降序
SELECT * FROM users ORDER BY age ASC;       -- 升序（默认）
SELECT * FROM users ORDER BY age DESC, name ASC;  -- 多列排序
```

### 4.4 聚合函数

```sql
SELECT COUNT(*) AS total FROM users;        -- 总记录数
SELECT MAX(age) FROM users;                  -- 最大值
SELECT MIN(age) FROM users;                  -- 最小值
SELECT SUM(age) FROM users;                  -- 求和
SELECT AVG(age) FROM users;                  -- 平均值
```

!!! tip "聚合函数忽略 NULL 值"
    除 `COUNT(*)` 外，其他聚合函数会自动跳过 `NULL` 值。

### 4.5 分组查询

```sql
SELECT department, COUNT(*) AS emp_count, AVG(salary) AS avg_salary
FROM employees
WHERE status = 'active'
GROUP BY department
HAVING avg_salary > 5000;
```

| 关键字 | 作用时机 |
|--------|----------|
| `WHERE` | 分组**之前**过滤原始数据 |
| `HAVING` | 分组**之后**过滤聚合结果 |

### 4.6 分页查询

```sql
-- LIMIT offset, count
-- offset: 从第几条开始（从 0 起）
-- count:  查询多少条
SELECT * FROM users LIMIT 0, 10;   -- 第 1 页（每页 10 条）
SELECT * FROM users LIMIT 10, 10;  -- 第 2 页
SELECT * FROM users LIMIT 20, 10;  -- 第 3 页
```

### 4.7 ⚡ SQL 书写顺序 vs 执行顺序

这是面试高频考点，务必理解两者的差异：

| 书写顺序 | 执行顺序 | 说明 |
|----------|----------|------|
| `SELECT` | ⑤ | 最后才确定要返回哪些列 |
| `FROM` | ① | 首先确定从哪张表查 |
| `WHERE` | ② | 过滤原始行数据 |
| `GROUP BY` | ③ | 对过滤后的数据分组 |
| `HAVING` | ④ | 过滤分组后的结果 |
| `ORDER BY` | ⑥ | 对最终结果排序 |

```
执行流程：FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
```

!!! tip "记忆口诀"
    先**找表**（FROM），再**筛选**（WHERE），然后**分组**（GROUP BY），接着**过滤组**（HAVING），最后**取列**（SELECT）并**排序**（ORDER BY）。

---

## 五、多表查询

### 5.1 交叉连接（笛卡尔积）

```sql
SELECT * FROM t_a, t_b;  -- 产生 A × B 条记录，一般需加 WHERE 过滤
```

### 5.2 内连接（INNER JOIN）

```sql
-- 显式内连接（推荐）
SELECT * FROM A JOIN B ON A.id = B.a_id;

-- 隐式内连接（不推荐，可读性差）
SELECT * FROM A, B WHERE A.id = B.a_id;
```

> 只返回两表的**交集**部分。

### 5.3 外连接

```sql
-- 左外连接：左表全部 + 右表匹配
SELECT * FROM A LEFT JOIN B ON A.id = B.a_id;

-- 右外连接：右表全部 + 左表匹配
SELECT * FROM A RIGHT JOIN B ON A.id = B.a_id;
```

| 类型 | 结果 |
|------|------|
| `INNER JOIN` | 仅返回匹配的行（交集） |
| `LEFT JOIN` | 左表全部 + 右表匹配的，右表无匹配则补 `NULL` |
| `RIGHT JOIN` | 右表全部 + 左表匹配的，左表无匹配则补 `NULL` |

### 5.4 全外连接

MySQL **不直接支持** `FULL OUTER JOIN`，可用 `UNION` 模拟：

```sql
SELECT * FROM A LEFT JOIN B ON A.id = B.a_id
UNION
SELECT * FROM A RIGHT JOIN B ON A.id = B.a_id;
```

### 5.5 子查询

```sql
-- 标量子查询：返回单个值
SELECT * FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- 列子查询：返回一列值
SELECT * FROM products
WHERE category_id IN (SELECT cid FROM category WHERE cname IN ('家电', '化妆品'));

-- 行子查询：作为伪表参与连接
SELECT *
FROM (SELECT * FROM category WHERE cname IN ('家电', '化妆品')) c
JOIN products p ON c.cid = p.category_id;
```

---

## 六、约束

### 6.1 约束定义方式

```sql
-- 方式一：列级约束（内联）
CREATE TABLE users (
    id INT PRIMARY KEY
);

-- 方式二：表级约束（外联）
CREATE TABLE category (
    cid INT,
    cname VARCHAR(10),
    PRIMARY KEY (cid)
);

-- 方式三：ALTER TABLE 添加
ALTER TABLE category ADD PRIMARY KEY (cid);
```

### 6.2 主键约束（PRIMARY KEY）

- 唯一标识一行数据，**一张表只能有一个主键**
- 主键值不能为 `NULL`

```sql
-- 单列主键
id INT PRIMARY KEY

-- 联合主键
CREATE TABLE student_course (
    student_id INT,
    course_id  INT,
    PRIMARY KEY (student_id, course_id)
);

-- 删除主键
ALTER TABLE table_name DROP PRIMARY KEY;
```

### 6.3 自增约束（AUTO_INCREMENT）

```sql
id INT PRIMARY KEY AUTO_INCREMENT
```

### 6.4 非空约束（NOT NULL）

```sql
name VARCHAR(50) NOT NULL
```

!!! warning "注意"
    `NOT NULL` 限制的是不能为 `NULL` 值，但**可以是空字符串 `''`**。

### 6.5 唯一约束（UNIQUE）

```sql
email VARCHAR(100) UNIQUE
```

| 对比项 | PRIMARY KEY | UNIQUE |
|--------|-------------|--------|
| 数量 | 一张表只能有 **1 个** | 一张表可以有 **多个** |
| NULL 值 | 不允许 | 允许（但只能有一个 `NULL`） |
| 语义 | 唯一标识一行 | 仅限制值不重复 |

### 6.6 💡 DELETE vs TRUNCATE 对比

面试高频题！

| 特性 | `DELETE FROM table` | `TRUNCATE TABLE` |
|------|---------------------|------------------|
| SQL 类型 | **DML** | **DDL** |
| 事务 | 可回滚，逐行记录日志 | **不可回滚**，整体操作 |
| 速度 | 较慢 | **极快**，直接释放数据页 |
| WHERE | ✅ 支持条件删除 | ❌ 只能删除全部 |
| 自增 ID | ❌ 不重置 | ✅ **重置为初始值** |
| 触发器 | ✅ 会触发 | ❌ 不会触发 |

!!! tip "使用建议"
    - 需要条件删除或可能回滚 → 用 `DELETE`
    - 清空全表且不需回滚 → 用 `TRUNCATE`（性能更高）

---

## 七、常用内置函数

### 7.1 字符串函数

| 函数 | 说明 |
|------|------|
| `CONCAT(s1, s2, ...)` | 拼接字符串 |
| `CONCAT_WS(separator, s1, s2, ...)` | 用分隔符拼接 |
| `UPPER(s)` / `LOWER(s)` | 大小写转换 |
| `TRIM(s)` | 去两端空格 |
| `SUBSTRING(s, pos, len)` | 截取子串 |
| `LENGTH(s)` | 返回字节长度 |
| `CHAR_LENGTH(s)` | 返回字符个数 |

### 7.2 数值函数

| 函数 | 说明 |
|------|------|
| `ABS(x)` | 绝对值 |
| `CEIL(x)` | 向上取整 |
| `FLOOR(x)` | 向下取整 |
| `ROUND(x, d)` | 四舍五入到 d 位小数 |
| `RAND()` | 返回 [0, 1) 随机数 |
| `POW(x, y)` | x 的 y 次方 |

### 7.3 日期函数

| 函数 | 说明 |
|------|------|
| `CURDATE()` | 当前日期（年月日） |
| `CURTIME()` | 当前时间（时分秒） |
| `NOW()` | 当前日期时间 |
| `DATEDIFF(d1, d2)` | d1 - d2 的天数差 |
| `DATE_FORMAT(date, format)` | 格式化日期 |

### 7.4 流程控制函数

```sql
-- IF 函数
SELECT IF(age >= 18, '成年', '未成年') AS status FROM users;

-- IFNULL 函数
SELECT name, IFNULL(score, 0) AS score FROM students;

-- CASE WHEN（类似 Java if-else）
SELECT
    name,
    CASE
        WHEN age <= 12 THEN '儿童'
        WHEN age <= 18 THEN '少年'
        WHEN age <= 40 THEN '中年'
        ELSE '老年'
    END AS age_group
FROM users;
```

---

## 八、数据库设计 — 三范式

> 范式（Normal Form）是数据库设计的规范，用于减少数据冗余、避免异常。

| 范式 | 要求 | 解决的问题 |
|------|------|------------|
| **1NF** | 所有字段都是**原子**的，不可再分 | 消除重复列 |
| **2NF** | 满足 1NF + 不存在非主属性对主键的**部分依赖** | 消除部分依赖 |
| **3NF** | 满足 2NF + 不存在非主属性之间的**传递依赖** | 消除传递依赖 |

!!! tip "通俗理解"
    - **1NF**：每个格子只能填一个值，不能填数组
    - **2NF**：所有非主键字段必须依赖**整个主键**（针对联合主键）
    - **3NF**：非主键字段之间不能有依赖关系，都必须直接依赖主键

> 实际开发中，为了查询性能，有时会**反范式**设计（冗余字段），需权衡利弊。

---

## 九、备份与还原

```bash
# 备份（命令行执行，不是 SQL）
mysqldump -u用户名 -p密码 数据库名 > backup.sql

# 还原（需先手动创建数据库）
mysql -u用户名 -p密码 数据库名 < backup.sql
```

!!! warning "注意"
    - 备份/还原命令末尾**不要加 `;`**
    - 还原前需先 `CREATE DATABASE`，因为备份文件中不包含建库语句
    - 也可加上 `--databases` 参数，使备份文件包含建库语句

---

## 十、JDBC 编程

JDBC（Java Database Connectivity）是 Java 操作数据库的标准 API。

### 10.1 核心四对象

| 对象 | 作用 |
|------|------|
| `DriverManager` | 驱动管理类，负责获取连接 |
| `Connection` | 数据库连接对象 |
| `Statement` | 执行 SQL 语句 |
| `ResultSet` | 处理查询结果集 |

### 10.2 基本使用

=== "依赖导入"
    ```xml
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.0.33</version>
    </dependency>
    ```

=== "获取连接 & 执行 SQL"
    ```java
    // 1. 获取连接
    String url = "jdbc:mysql://localhost:3306/test?serverTimezone=UTC";
    Connection conn = DriverManager.getConnection(url, "root", "password");

    // 2. 执行 SQL
    Statement stmt = conn.createStatement();
    stmt.executeUpdate("INSERT INTO product (pname, pdesc) VALUES ('南瓜', '好吃')");

    // 3. 查询结果
    ResultSet rs = stmt.executeQuery("SELECT * FROM product");
    while (rs.next()) {
        System.out.println(rs.getInt("pid") + " - " + rs.getString("pname"));
    }

    // 4. 释放资源（倒序关闭）
    rs.close();
    stmt.close();
    conn.close();
    ```
### 10.3 PreparedStatement（防 SQL 注入）

```java
// 使用 ? 占位符
String sql = "SELECT * FROM user WHERE username = ? AND password = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, username);  // 第 1 个 ?
ps.setString(2, password);  // 第 2 个 ?
ResultSet rs = ps.executeQuery();
```

!!! warning "安全提醒"
    - 永远不要使用 `Statement` 拼接用户输入的 SQL
    - `PreparedStatement` 通过预编译机制**防止 SQL 注入**，且性能更好（可复用执行计划）

### 10.4 批量操作

```java
// 需在 URL 中开启批量参数
// jdbc:mysql://localhost:3306/db?rewriteBatchedStatements=true

String sql = "INSERT INTO users (name, age) VALUES (?, ?)";
PreparedStatement ps = conn.prepareStatement(sql);

for (int i = 0; i < 1000; i++) {
    ps.setString(1, "user" + i);
    ps.setInt(2, 20 + i);
    ps.addBatch();  // 加入批次
}
ps.executeBatch();  // 一次性执行
```

!!! tip "rewriteBatchedStatements"
    MySQL 默认逐条发送 SQL，加上 `rewriteBatchedStatements=true` 后，驱动会将多条 SQL 合并为一次发送，**性能提升数十倍**。

---

## 十一、Python 与 MySQL 集成

> 参考文档：
> - [mysql-connector-python 官方文档](https://dev.mysql.com/doc/connector-python/en/)
> - [PyMySQL GitHub](https://github.com/PyMySQL/PyMySQL)
> - [SQLAlchemy 官方文档](https://docs.sqlalchemy.org/)

### 11.1 mysql-connector-python（MySQL 官方驱动）

Oracle 官方提供的纯 Python MySQL 连接器。

```bash
pip install mysql-connector-python
```

```python
import mysql.connector

# 1. 建立连接
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password",
    database="test",
    charset="utf8mb4"
)

cursor = conn.cursor()

# 2. 增删改
cursor.execute(
    "INSERT INTO users (name, age) VALUES (%s, %s)",
    ("张三", 25)
)
conn.commit()  # 必须手动提交

# 3. 查询
cursor.execute("SELECT id, name, age FROM users")
for row in cursor.fetchall():
    print(f"id: {row[0]}, name: {row[1]}, age: {row[2]}")

# 4. 关闭连接
cursor.close()
conn.close()
```

!!! warning "占位符差异"
    - `mysql-connector-python` 使用 `%s` 作为占位符（即使不是字符串）
    - 不要与 Python 的 `%` 格式化混淆，这是驱动层的参数绑定

### 11.2 PyMySQL（纯 Python 实现）

完全兼容 `MySQLdb` 接口，是纯 Python 实现，无需 C 编译。

```bash
pip install pymysql
```

```python
import pymysql

conn = pymysql.connect(
    host="localhost",
    user="root",
    password="password",
    database="test",
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor  # 返回字典格式
)

with conn.cursor() as cursor:
    # 参数化查询（防注入）
    cursor.execute("SELECT * FROM users WHERE age > %s", (18,))
    results = cursor.fetchall()
    for row in results:
        print(row["name"], row["age"])  # 字典方式访问

conn.close()
```

=== "Context Manager 用法（推荐）"
    ```python
    with pymysql.connect(host="localhost", user="root",
                         password="pwd", database="test") as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1")
            print(cursor.fetchone())
    # 自动关闭连接
    ```

=== "批量插入"
    ```python
    users = [
        ("Alice", 22),
        ("Bob", 25),
        ("Charlie", 30),
    ]
    cursor.executemany(
        "INSERT INTO users (name, age) VALUES (%s, %s)",
        users
    )
    conn.commit()
    ```

### 11.3 SQLAlchemy（Python ORM 之王）

SQLAlchemy 是 Python 生态最强大的 ORM 框架，支持声明式建模、连接池、事务管理等。

```bash
pip install sqlalchemy
```

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. 创建引擎（内置连接池）
engine = create_engine(
    "mysql+pymysql://root:password@localhost:3306/test?charset=utf8mb4",
    pool_size=5,              # 连接池大小
    max_overflow=10,          # 最大溢出连接数
    pool_recycle=3600         # 连接回收时间（秒）
)

Base = declarative_base()

# 2. 定义模型
class User(Base):
    __tablename__ = "users"

    id   = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    age  = Column(Integer)

# 3. 创建表
Base.metadata.create_all(engine)

# 4. 创建 Session
Session = sessionmaker(bind=engine)
session = Session()

# 5. CRUD 操作
# 新增
session.add(User(name="张三", age=25))
session.add_all([
    User(name="李四", age=28),
    User(name="王五", age=30)
])
session.commit()

# 查询
users = session.query(User).filter(User.age > 20).order_by(User.age.desc()).all()
for u in users:
    print(u.name, u.age)

# 修改
session.query(User).filter_by(name="张三").update({"age": 26})
session.commit()

# 删除
session.query(User).filter_by(name="李四").delete()
session.commit()

session.close()
```

!!! tip "SQLAlchemy 核心概念"
    - **Engine**：连接池 + 方言适配器，不是连接
    - **Session**：工作单元（Unit of Work），跟踪对象状态变化
    - **Model**：Python 类 ↔ 数据库表的映射

=== "原生 SQL 执行"
    ```python
    # 在 SQLAlchemy 中执行原生 SQL
    from sqlalchemy import text

    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM users WHERE age > :age"), {"age": 20})
        for row in result:
            print(row)
    ```

=== "事务管理"
    ```python
    from sqlalchemy.exc import SQLAlchemyError

    session = Session()
    try:
        session.add(User(name="测试", age=20))
        session.commit()
    except SQLAlchemyError:
        session.rollback()
        raise
    finally:
        session.close()
    ```

### 11.4 Python 数据库编程最佳实践

!!! tip "最佳实践清单"
    1. **永远使用参数化查询**，禁止字符串拼接 SQL
    2. **及时关闭连接**，或使用 `with` 上下文管理器
    3. **使用连接池**（SQLAlchemy 内置 / DBUtils）
    4. **大查询用游标迭代**，避免 `fetchall()` 内存爆炸
    5. **生产环境务必配置 `charset=utf8mb4`**，支持 emoji 和生僻字

```python
# 流式游标（适合大数据量查询）
cursor = conn.cursor(pymysql.cursors.SSCursor)  # Server-Side Cursor
cursor.execute("SELECT * FROM large_table")
for row in cursor:  # 逐行读取，不占内存
    process(row)
cursor.close()
```

---

## 十二、连接池（HikariCP）

### 12.1 为什么需要连接池？

每次创建/销毁数据库连接都很耗时。连接池预先创建一批连接，用完归还，由池管理生命周期。

> HikariCP 是 Spring Boot 2.0+ 默认的连接池，以**性能极致**著称。
> 参考：[HikariCP GitHub](https://github.com/brettwooldridge/HikariCP)

### 12.2 Spring Boot 中的配置

=== "依赖"
    ```xml
    <!-- Spring Boot JDBC Starter 自动引入 HikariCP -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jdbc</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    ```

=== "application.yml"
    ```yaml
    spring:
      datasource:
        url: jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8
        username: root
        password: password
        driver-class-name: com.mysql.cj.jdbc.Driver
        hikari:
          pool-name: MyHikariPool
          maximum-pool-size: 20          # 最大连接数（默认 10）
          minimum-idle: 5                # 最小空闲连接
          idle-timeout: 30000            # 空闲超时（毫秒）
          max-lifetime: 1800000          # 连接最大存活时间（30 分钟）
          connection-timeout: 20000      # 获取连接超时（毫秒）
          auto-commit: true              # 是否自动提交
    ```

!!! info "starter 的作用"
    `spring-boot-starter-jdbc` **不是替代驱动**，而是提供一套完整的、生产就绪的数据访问基础设施（连接池 + 模板类 + 自动配置），让开发者聚焦业务。

> 对于 **MySQL 8+**，不需要配置 `connection-test-query`（Hikari 会用更高效的方式检测连接有效性）。

---

## 十三、事务

### 13.1 事务的概念

事务（Transaction）是一组**逻辑上不可分割**的数据库操作，要么全部成功，要么全部失败。

### 13.2 ACID 特性

| 特性 | 全称 | 说明 |
|------|------|------|
| **A** | Atomicity（原子性） | 操作要么全做，要么全不做，不会停在中间状态 |
| **C** | Consistency（一致性） | 事务前后数据必须保持一致性状态 |
| **I** | Isolation（隔离性） | 并发事务互不干扰，中间状态对其他事务不可见 |
| **D** | Durability（持久性） | 事务一旦提交，修改永久生效（通过 redo log 保证） |

### 13.3 JDBC 事务管理

```java
Connection conn = null;
try {
    conn = dataSource.getConnection();
    conn.setAutoCommit(false);  // 开启事务

    // 转账操作
    stmt.executeUpdate("UPDATE account SET money = money - 100 WHERE name = 'A'");
    // 假设此处发生异常
    stmt.executeUpdate("UPDATE account SET money = money + 100 WHERE name = 'B'");

    conn.commit();  // 提交事务
    System.out.println("转账成功");
} catch (Exception e) {
    if (conn != null) {
        conn.rollback();  // 回滚事务
    }
    System.out.println("转账失败: " + e.getMessage());
} finally {
    if (conn != null) conn.close();
}
```

### 13.4 ThreadLocal 在事务中的应用

`ThreadLocal` 为每个线程保存独立的变量副本，实现线程安全。

```java
// ThreadLocal 管理 Connection
private static ThreadLocal<Connection> TL = new ThreadLocal<>();

public static Connection getConnection() {
    Connection conn = TL.get();
    if (conn == null) {
        conn = dataSource.getConnection();
        TL.set(conn);
    }
    return conn;
}

public static void remove() {
    Connection conn = TL.get();
    if (conn != null) conn.close();
    TL.remove();  // 必须清理，防止内存泄漏
}
```

!!! warning "内存泄漏风险"
    使用 `ThreadLocal` 存储 Connection 时，**务必在 finally 中调用 `remove()`**，否则在线程池场景下会导致连接泄漏和内存溢出。

> `ThreadLocal` 不是"解决并发"的工具，而是"规避并发"的设计技巧 —— 通过让每个线程独占资源，从根本上避免竞争。

### 13.5 隔离级别与并发问题

#### 并发问题

| 问题 | 描述 | 示例 |
|------|------|------|
| **脏读** | 读到了其他事务**未提交**的数据 | A 改了数据但还没提交，B 就读到了 |
| **不可重复读** | 同一事务内，多次读取**同一行**结果不一致 | 其他事务 `UPDATE` 并提交了 |
| **幻读** | 同一事务内，多次查询**范围**结果不一致 | 其他事务 `INSERT` 了新行 |

#### 四种隔离级别

| 隔离级别 | 脏读 | 不可重复读 | 幻读 | 性能 |
|----------|:----:|:----------:|:----:|:----:|
| `READ UNCOMMITTED` | ❌ 存在 | ❌ 存在 | ❌ 存在 | 最高 |
| `READ COMMITTED` | ✅ 解决 | ❌ 存在 | ❌ 存在 | 较高 |
| `REPEATABLE READ` | ✅ 解决 | ✅ 解决 | ⚠️ 可能存在* | 较低 |
| `SERIALIZABLE` | ✅ 解决 | ✅ 解决 | ✅ 解决 | 最低 |

!!! info "MySQL 默认隔离级别"
    MySQL InnoDB 默认使用 `REPEATABLE READ`，通过 **MVCC（多版本并发控制）** 和 **Gap Lock（间隙锁）** 在很大程度上解决了幻读问题。

```sql
-- 查看当前隔离级别
SELECT @@transaction_isolation;

-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

*\* MySQL 8.0 中 REPEATABLE READ 已通过 MVCC + Gap Lock 解决大部分幻读场景。*
