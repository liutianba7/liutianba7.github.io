# PostgreSQL

> 参考文档：
> - [PostgreSQL 官方文档](https://www.postgresql.org/docs/current/)
> - [PostgreSQL 中文社区](http://www.postgres.cn/docs/)
> - [菜鸟教程](https://www.runoob.com/postgresql/postgresql-tutorial.html)

---

## 一、PostgreSQL 概述

PostgreSQL 是一个**开源的对象-关系型数据库管理系统**（ORDBMS），起源于加州大学伯克利分校的 POSTGRES 项目（1986 年），历经 30+ 年发展，被誉为"**功能最强大的开源数据库**"。

!!! tip "为什么选择 PostgreSQL？"

    - **标准兼容**：几乎完全遵循 SQL:2016 标准，远超 MySQL
    - **数据类型丰富**：原生支持 JSON/JSONB、数组、区间、网络地址、UUID 等
    - **扩展性极强**：通过 Extension 机制支持全文搜索、地理空间（PostGIS）、向量检索（pgvector）
    - **并发控制**：MVCC 实现高并发读写，不会出现读写相互阻塞
    - **稳定性与可靠性**：WAL（Write-Ahead Logging）机制保证数据不丢失
    - **开源友好**：PostgreSQL 协议类 BSD/MIT，可自由商用

!!! info "定位总结"

    - **选 PostgreSQL**：需要复杂查询、地理空间、全文搜索、数据完整性要求高的场景
    - **选 MySQL**：经典 Web 应用、读写分离架构、生态工具成熟、运维简单

## 二、PostgreSQL 的安装

### 01本地安装

直接去[官方网站](https://www.postgresql.org/download/)下载即可，安装完成后将 pgsql 的 bin 目录配置到环境变量中即可，在安装过程中，会设置超级用户 postgres 的密码，切记！

### 02 docker 安装

这是最推荐的安装方式，只需运行下面的命令即可！（默认是最新版，也就是18），但是学习与开发过程，版本号最好还是手动指定一下。

``` bash
# 1. 拉取指定稳定版本的镜像 
docker pull postgres:16 

# 2. 停止并删除旧容器及残留数据卷（防止之前的配置冲突） 
docker stop pgsql && docker rm pgsql 
docker volume rm pgdata

# 3. 运行全新的容器,注意，当 pgsql 版本 >= 18，数据卷挂载不要加这个 data
docker run -d --name pgsql \
 --restart unless-stopped \ 
 -p 5432:5432 \ 
 -e POSTGRES_USER=root \ 
 -e POSTGRES_PASSWORD=liuqiang \ 
 -e POSTGRES_DB=study_db \ 
 -e TZ=Asia/Shanghai \ 
 -v pgdata:/var/lib/postgresql/data \  
 postgres:16
 
docker run -d --name pgsql -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=liuqiang -e POSTGRES_DB=study_db  -e TZ=Asia/Shanghai -v pgdata:/var/lib/postgresql/data postgres:16
 
```

之后，便可以进入当前容器，然后操作 pgsql 了

``` bash
# 进入容器
docker exec -it pgsql /bin/bash
# 连接 pgsql 
psql -h <ip地址> -U root -d xxx
```

## 三、Pgsql 基础知识

### 3.1 PostgreSQL 逻辑架构

PostgreSQL 采用 **Instance → Database → Schema → Object** 四层架构，与 MySQL 的 **Instance → Database → Object** 三层架构有本质区别。

```text
PostgreSQL 架构                          MySQL 架构
┌─────────────────────┐                ┌─────────────────────┐
│  Instance (进程集合)   │                │  Instance (进程集合)   │
│  ┌───────────────┐   │                │  ┌───────────────┐   │
│  │  Database A    │   │                │  │  Database A    │   │
│  │  ┌─────────┐   │   │                │  │  ┌─────────┐   │   │
│  │  │ Schema 1 │   │   │                │  │  │ Table   │   │   │
│  │  │ Table    │   │   │                │  │  ├─────────┤   │   │
│  │  ├─────────┤   │   │                │  │  │ Table   │   │   │
│  │  │ Schema 2 │   │   │                │  └───────────────┘   │
│  │  │ Table    │   │   │                └─────────────────────┘
│  └───────────────┘   │
└─────────────────────┘
```

**各层级说明：**

| 层级                | 说明                     | 类比                               |
| ----------------- | ---------------------- | -------------------------------- |
| **Instance（实例）**  | 一组进程和共享内存，管理所有数据库      | MySQL 的 mysqld 进程                |
| **Database（数据库）** | 独立的数据库，彼此隔离            | MySQL 的 Database                 |
| **Schema（模式）**    | 数据库内的命名空间，包含表、视图、函数等对象 | MySQL 中不存在，可类比为 Database 内的"文件夹" |
| **Object（对象）**    | 具体的表、视图、索引、函数等         | MySQL 的 Table、View 等             |

!!! tip "Schema 是 PostgreSQL 与 MySQL 最大的架构差异"

    MySQL 中 Database 直接包含 Table，实现隔离靠创建不同的 Database；而在 PostgreSQL 中，**一个 Database 内可以包含多个 Schema**，对象间的隔离粒度更细。

---

### 3.2 Schema（模式）

#### 什么是 Schema

Schema 是 PostgreSQL 中对象的**命名空间（Namespace）**，它是 Database 和 Object 之间的中间层。

```
Database "study_db"
├── Schema "public"    ← 默认 Schema
│   ├── Table "users"
│   └── Table "orders"
├── Schema "sales"
│   ├── Table "users"  ← 可以与 public.users 同名
│   └── View "monthly_report"
└── Schema "archive"
    └── Table "orders_2023"
```

#### Schema 的作用

- **组织管理**：按业务模块（sales、hr、finance）划分对象
- **权限隔离**：不同 Schema 可设置不同访问权限
- **同名共存**：不同 Schema 下可存在同名对象，互不冲突

#### 默认 Schema

| Schema               | 用途                              |
| -------------------- | ------------------------------- |
| `public`             | 默认 Schema，创建表未指定 Schema 时自动归属此处 |
| `pg_catalog`         | 系统表与系统函数所在 Schema               |
| `information_schema` | SQL 标准视图，提供元数据查询                |

!!! warning "不要直接修改 pg_catalog"
    `pg_catalog` 存储系统元数据，随意修改可能导致数据库无法启动。即使查询也建议优先使用 `information_schema`。

#### Schema 操作

```sql
-- 创建 Schema
CREATE SCHEMA sales;

-- 创建 Schema 并指定属主
CREATE SCHEMA hr AUTHORIZATION root;

-- 在指定 Schema 下创建表
CREATE TABLE sales.orders (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- 查看当前 Database 下所有 Schema
SELECT * FROM information_schema.schemata;
-- 或在 psql 中使用: \dn

-- 删除 Schema（需先清空其中的对象）
DROP SCHEMA sales;

-- 级联删除 Schema 及其所有对象
DROP SCHEMA sales CASCADE;
```

!!! tip "访问对象的完整路径"
    `Database.Schema.Object`，例如：`study_db.public.users`。在当前 Database 内，可省略 Database 名，直接写 `Schema.Object`。

---

### 3.3 search_path（搜索路径）

#### 为什么需要 search_path

当你不加 Schema 前缀访问对象时（如 `SELECT * FROM users`），PostgreSQL 需要知道**去哪个 Schema 查找**。这个查找规则由 `search_path` 控制。

```sql
-- 查看当前 search_path
SHOW search_path;

-- 输出示例
   search_path
─────────────────
 "$user", public
```

#### 搜索规则

1. 按 `search_path` 中 Schema 的**从左到右**顺序依次查找
2. 返回第一个匹配到的对象
3. 如果所有 Schema 都未找到，报错"relation not found"

![search_path 查找流程](../../assets/imgs/db/pgsql/search_path.drawio.svg)

#### 修改 search_path

```sql
-- 设置当前会话的 search_path
SET search_path TO sales, public;

-- 永久修改（修改数据库默认值）
ALTER DATABASE study_db SET search_path TO sales, public;
```

| 特殊变量 | 含义 |
|----------|------|
| `"$user"` | 当前用户名，存在同名 Schema 时匹配，否则忽略 |
| `public` | 默认 Schema，所有新建表归属此 Schema |

!!! info "search_path 与 MySQL 的区别"
    MySQL 使用 `USE database_name` 切换当前数据库；PostgreSQL 使用 `search_path` 控制对象解析顺序，且一个连接**不需要反复切换**即可访问多个 Schema 下的对象。

---

### 3.4 psql 常用命令

`psql` 是 PostgreSQL 自带的交互式命令行工具，功能非常强大。

#### 连接数据库

```bash
# 完整连接
psql -h 127.0.0.1 -p 5432 -U root -d study_db

# 简写（默认 Unix Socket 连接本地）
psql -U root -d study_db

# 连接后直接执行 SQL 并退出
psql -U root -d study_db -c "SELECT current_database();"
```

#### 常用元命令对照

| psql 命令         | 功能                | 对应 MySQL 命令                   |
| --------------- | ----------------- | ----------------------------- |
| `\l`            | 列出所有 Database     | `SHOW DATABASES`              |
| `\c dbname`     | 切换到指定 Database    | `USE dbname`                  |
| `\dt`           | 列出当前 Schema 的表    | `SHOW TABLES`                 |
| `\dt schema.*`  | 列出指定 Schema 的表    | —                             |
| `\d table_name` | 查看表结构（列、类型、约束、索引） | `DESC table_name`             |
| `\di`           | 列出索引              | `SHOW INDEX FROM`             |
| `\dn`           | 列出所有 Schema       | 无                             |
| `\du`           | 列出所有角色/用户         | `SELECT User FROM mysql.user` |
| `\dv`           | 列出视图              | 无                             |
| `\df`           | 列出函数/存储过程         | `SHOW FUNCTION STATUS`        |
| `\x`            | 切换扩展显示（行→列模式）     | 无                             |
| `\timing`       | 显示 SQL 执行耗时       | 无                             |
| `\i file.sql`   | 执行 SQL 文件         | `SOURCE file.sql`             |
| `\o output.txt` | 将查询结果输出到文件        | `SELECT ... INTO OUTFILE`     |
| `\e`            | 打开外部编辑器编写 SQL     | 无                             |
| `\q`            | 退出 psql           | `EXIT`                        |
| `\?`            | 查看所有 psql 命令帮助    | `HELP`                        |
| `\h`            | 查看 SQL 命令语法       | `HELP command`                |

```sql
-- 在 psql 内查看当前连接信息
SELECT current_database(), current_user, current_schema;
```

!!! tip "\d 系列是最常用的命令"
    - `\d` — 列出所有对象（表、视图、序列、物化视图等）
    - `\d+` — 更详细的信息（额外显示注释、表大小等）
    - `\d table_name` — 查特定表的结构
    - `\d+ table_name` — 查表结构 + 存储参数 + 注释

---

### 3.5 数据库与表的基本操作

#### 数据库操作

```sql
-- 创建数据库（可指定编码和模板）
CREATE DATABASE study_db
    ENCODING 'UTF8'
    LC_COLLATE 'zh_CN.UTF-8'
    LC_CTYPE 'zh_CN.UTF-8'
    TEMPLATE template0;

-- 查看所有数据库 \l
SELECT datname FROM pg_database;

-- 切换数据库（需在 psql 中使用 \c）
\c study_db

-- 重命名数据库
ALTER DATABASE study_db RENAME TO my_study_db;

-- 删除数据库（必须先断开连接）
DROP DATABASE study_db;
```

!!! warning "template0 vs template1"
    - `template1`：默认模板，可自定义，新建数据库时自动复制其内容
    - `template0`：纯净模板，**不可修改**，用于需要干净数据库的场景
    - 创建数据库时不指定 `TEMPLATE`，默认使用 `template1`

#### 表操作

```sql
-- 创建表
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,          -- 自增主键
    name        VARCHAR(50) NOT NULL,        -- 非空字符串
    email       VARCHAR(100) UNIQUE,         -- 唯一约束
    age         INTEGER CHECK (age > 0),     -- CHECK 约束
    status      VARCHAR(20) DEFAULT 'active',-- 默认值
    created_at  TIMESTAMPTZ DEFAULT NOW()    -- 带时区的时间戳
);

-- 查看表结构（两种方式）
\d users
SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
 WHERE table_name = 'users';
```

#### 修改表（ALTER TABLE）

PostgreSQL 的 `ALTER TABLE` 功能很丰富，覆盖列、约束、默认值、表名等维度：

```sql
-- ─── 列操作 ───

-- 添加列
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- 添加列并带默认值（大表注意锁问题）
ALTER TABLE users ADD COLUMN score INTEGER DEFAULT 0;

-- 删除列
ALTER TABLE users DROP COLUMN phone;

-- 修改列的数据类型
ALTER TABLE users ALTER COLUMN name TYPE VARCHAR(100);

-- 重命名列
ALTER TABLE users RENAME COLUMN name TO username;

-- 设置默认值
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'inactive';

-- 删除默认值
ALTER TABLE users ALTER COLUMN status DROP DEFAULT;

-- 设置 NOT NULL
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- 取消 NOT NULL（需确保列中没有 NULL 值）
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;


-- ─── 约束操作 ───

-- 添加 CHECK 约束
ALTER TABLE users ADD CONSTRAINT age_check CHECK (age >= 0 AND age <= 150);

-- 添加 UNIQUE 约束
ALTER TABLE users ADD CONSTRAINT uk_email UNIQUE (email);

-- 添加外键约束
ALTER TABLE users ADD CONSTRAINT fk_dept
    FOREIGN KEY (dept_id) REFERENCES dept(id);

-- 删除约束
ALTER TABLE users DROP CONSTRAINT age_check;

-- 添加主键
ALTER TABLE users ADD PRIMARY KEY (id);

-- 删除主键
ALTER TABLE users DROP CONSTRAINT users_pkey;


-- ─── 表级操作 ───

-- 重命名表
ALTER TABLE users RENAME TO members;

-- 移动表到另一个 Schema
ALTER TABLE members SET SCHEMA sales;

-- 启用/禁用触发器
ALTER TABLE members DISABLE TRIGGER ALL;
ALTER TABLE members ENABLE TRIGGER ALL;

-- 设置表的所属
ALTER TABLE members OWNER TO admin;
```

!!! tip "PostgreSQL ALTER TABLE 与 MySQL 的差异"

    - 修改列类型时使用 `ALTER COLUMN ... TYPE`，不是 `MODIFY COLUMN`
    - 重命名列使用 `RENAME COLUMN`，不是 `CHANGE COLUMN`
    - 约束的增删推荐显式命名（`CONSTRAINT constraint_name`），方便后续管理
    - 大表添加 `NOT NULL` 或修改类型会触发全表扫描，需在低峰期执行

#### PostgreSQL 中的自增

```sql
-- 方式一：SERIAL 伪类型（PostgreSQL 传统方式）
CREATE TABLE t1 (id SERIAL PRIMARY KEY, name TEXT);
-- 等价于：
CREATE SEQUENCE t1_id_seq;
CREATE TABLE t1 (
    id INTEGER DEFAULT nextval('t1_id_seq') PRIMARY KEY,
    name TEXT
);

-- 方式二：GENERATED AS IDENTITY（SQL 标准方式，推荐）
CREATE TABLE t2 (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT
);

-- GENERATED ALWAYS 禁止手动插入 id：
INSERT INTO t2 (id, name) VALUES (100, 'test');  -- ❌ 报错
INSERT INTO t2 (name) VALUES ('test');            -- ✅ 自动生成

-- 如果需要手动干预，使用 GENERATED BY DEFAULT：
CREATE TABLE t3 (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT
);

INSERT INTO t3 (id, name) VALUES (100, 'test');  -- ✅ 允许
```

!!! tip "推荐使用 GENERATED AS IDENTITY"
    `SERIAL` 在底层创建了独立的序列对象（Sequence），但属于 PostgreSQL 的非标准语法。`GENERATED AS IDENTITY` 是 SQL:2016 标准语法，行为更严谨，建议新项目优先使用。

#### 约束

| 约束 | 说明 | 示例 |
|------|------|------|
| `NOT NULL` | 列值不能为空 | `name VARCHAR(50) NOT NULL` |
| `UNIQUE` | 列值唯一 | `email VARCHAR(100) UNIQUE` |
| `PRIMARY KEY` | 非空 + 唯一，每表一个 | `id SERIAL PRIMARY KEY` |
| `CHECK` | 自定义条件 | `age INTEGER CHECK (age > 0 AND age < 150)` |
| `DEFAULT` | 默认值 | `status VARCHAR(20) DEFAULT 'active'` |
| `REFERENCES` | 外键约束 | `dept_id INTEGER REFERENCES dept(id)` |

---

### 3.6 PostgreSQL 特有数据类型

PostgreSQL 拥有远超 MySQL 的丰富数据类型，以下是最常用的几种。

#### JSON / JSONB

```sql
-- JSON：文本存储，保留格式（含空格、键顺序）
-- JSONB：二进制存储，更高效，支持索引
CREATE TABLE events (
    id      SERIAL PRIMARY KEY,
    payload JSONB
);

-- JSONB 支持索引（GIN 索引）
CREATE INDEX idx_events_payload ON events USING GIN (payload);

-- 插入数据
INSERT INTO events (payload) VALUES
    ('{"name": "click", "page": "/home", "duration": 120}'),
    ('{"name": "scroll", "page": "/about", "depth": 80}');

-- JSONB 查询操作
-- 按 key 提取
SELECT payload->>'name' AS event_name FROM events;

-- 条件过滤（JSONB 深度查询）
SELECT * FROM events WHERE payload @> '{"page": "/home"}';

-- 修改 JSONB 中的字段
UPDATE events SET payload = jsonb_set(payload, '{duration}', '150')
 WHERE payload->>'name' = 'click';
```

| 特性 | JSON | JSONB |
|------|------|-------|
| 存储格式 | 文本（原样保留） | 二进制（解析后） |
| 保留空格/键顺序 | ✅ | ❌ |
| 重复键处理 | 保留所有值 | 保留最后一个 |
| 索引支持 | ❌ | ✅（GIN 索引） |
| 查询性能 | 慢（需实时解析） | 快 |
| 写入性能 | 快（不解析） | 略慢（需解析） |

```txt
推荐：**始终用 JSONB**，除非你需要保留原始输入格式。
```

#### 数组（Array）

```sql
-- 定义数组列
CREATE TABLE articles (
    id      SERIAL PRIMARY KEY,
    title   VARCHAR(200),
    tags    TEXT[]  -- 字符串数组
);

-- 插入数组数据
INSERT INTO articles (title, tags) VALUES
    ('PostgreSQL 入门', ARRAY['数据库', 'PostgreSQL', '教程']),
    ('JSONB 详解',     '{JSON, PostgreSQL, 进阶}');

-- 查询
SELECT title, tags[1] AS first_tag FROM articles;  -- 索引从 1 开始

-- 数组包含查询
SELECT * FROM articles WHERE tags @> ARRAY['PostgreSQL'];

-- 数组长度
SELECT title, array_length(tags, 1) AS tag_count FROM articles;

-- 数组展开为行
SELECT title, unnest(tags) AS tag FROM articles;
```

!!! tip "PostgreSQL 数组索引从 1 开始"
    与其他编程语言不同，PostgreSQL 数组的**第一个元素索引为 1，不是 0**。`arr[1]` 取第一个元素，`arr[0]` 返回 NULL。

#### 区间类型（Range Types）

```sql
-- 常见区间类型
-- int4range  → 整数区间
-- tsrange    → 时间戳区间
-- daterange  → 日期区间
-- numrange   → 数值区间

CREATE TABLE room_bookings (
    room_id  INTEGER,
    period   TSRANGE,  -- 时间段
    EXCLUDE USING GIST (period WITH &&)  -- 禁止重叠
);

-- 插入数据
INSERT INTO room_bookings (room_id, period) VALUES
    (1, '[2024-01-01 09:00, 2024-01-01 10:00)'),
    (1, '[2024-01-01 10:00, 2024-01-01 11:00)');

-- 区间查询
SELECT * FROM room_bookings
 WHERE period @> '2024-01-01 09:30'::timestamp;

-- 区间函数
SELECT upper(period), lower(period),    -- 上下界
       isempty(period),                  -- 是否为空
       period && '[2024-01-01 10:30, 2024-01-01 11:30)'::tsrange -- 是否重叠
  FROM room_bookings;
```

| 区间边界符号 | 含义 |
|-------------|------|
| `[` | 闭区间（包含边界） |
| `)` | 开区间（不包含边界） |
| `(`, `]` | 同上，左开右闭等 |

#### UUID

```sql
-- 需要 uuid-ossp 扩展（默认已包含）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- UUID 作为主键（分布式友好）
CREATE TABLE products (
    id    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name  VARCHAR(200)
);

INSERT INTO products (name) VALUES ('MacBook Pro');
-- id 自动生成: 550e8400-e29b-41d4-a716-446655440000

-- 常用 UUID 生成函数
SELECT
    gen_random_uuid(),      -- 随机 UUID v4（推荐）
    uuid_generate_v4(),     -- 同上，来自 uuid-ossp
    uuid_generate_v1();     -- 基于时间戳的 UUID v1
```

!!! tip "UUID vs SERIAL 主键"
    - **SERIAL（整数自增）**：存储小（4字节）、性能好、可读性强，但分布式环境有冲突风险
    - **UUID**：存储略大（16字节）、全局唯一、适合分布式/微服务，但随机写入对 B-Tree 索引不友好

#### 网络地址类型

```sql
CREATE TABLE access_logs (
    id      SERIAL PRIMARY KEY,
    ip      INET,       -- IPv4 或 IPv6 地址
    subnet  CIDR,       -- 网络段
    mac     MACADDR     -- MAC 地址
);

INSERT INTO access_logs (ip, subnet, mac) VALUES
    ('192.168.1.100', '192.168.1.0/24', '08:00:2b:01:02:03');

-- 网络地址函数
SELECT
    ip,
    host(ip) AS ip_string,       -- 提取 IP 字符串
    netmask(ip) AS mask,         -- 子网掩码
    abbrev(subnet) AS cidr_str,  -- CIDR 表示
    macaddr_setsort(mac) AS sorted_mac  -- 排序用 MAC
FROM access_logs;
```

#### 枚举（ENUM）

```sql
-- 创建枚举类型
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

-- 使用枚举
CREATE TABLE orders (
    id      SERIAL PRIMARY KEY,
    status  order_status DEFAULT 'pending'
);

INSERT INTO orders (status) VALUES ('paid'), ('shipped');
INSERT INTO orders (status) VALUES ('unknown');  -- ❌ 报错！不在枚举定义中

-- 枚举排序按定义顺序，非字母序
SELECT * FROM (VALUES
    ('pending'), ('paid'), ('shipped'), ('delivered')
) AS t(status)
ORDER BY status::order_status;
-- 输出顺序: pending → paid → shipped → delivered

-- 添加新值
ALTER TYPE order_status ADD VALUE 'refunded';
```

---

### 3.7 表空间（Tablespace）

#### 什么是表空间

表空间（Tablespace）是 PostgreSQL 中**控制数据文件在磁盘上的存放位置**的机制。

```
表空间                   文件系统路径
┌─────────────────────────────────────────────┐
│ pg_default   →  $PGDATA/base/       (默认)    │
│ pg_global    →  $PGDATA/global/     (系统表)  │
│ ts_fast      →  /ssd/pg_data/       (自定义)  │
│ ts_archive   →  /hdd/archive/       (自定义)  │
└─────────────────────────────────────────────┘
```

#### 为什么需要表空间

- **性能分层**：热数据放 SSD 表空间，冷数据放 HDD 表空间
- **空间管理**：某个磁盘空间不足时，将部分表移至其他磁盘
- **I/O 隔离**：高频访问的表和索引放不同磁盘

#### 操作示例

```sql
-- 创建表空间（需要超级用户权限）
CREATE TABLESPACE ts_fast LOCATION '/ssd/pg_data';
CREATE TABLESPACE ts_archive LOCATION '/hdd/archive';

-- 将表创建到指定表空间
CREATE TABLE logs_fast (
    id      SERIAL PRIMARY KEY,
    content TEXT,
    ts      TIMESTAMPTZ DEFAULT NOW()
) TABLESPACE ts_fast;

-- 将已有表迁移到指定表空间
ALTER TABLE logs_fast SET TABLESPACE ts_archive;

-- 将索引创建到指定表空间（与表分离，提升 I/O 性能）
CREATE INDEX idx_logs_ts ON logs_fast (ts) TABLESPACE ts_fast;

-- 查看表空间
SELECT * FROM pg_tablespace;

-- 查看表所在表空间
SELECT relname, tablespace_name
  FROM pg_class c
  LEFT JOIN pg_tablespace t ON c.reltablespace = t.oid
 WHERE relname = 'logs_fast';
```

```bash
# 查看表空间对应的磁盘路径
psql -U root -d study_db -c "\db+"
```

!!! warning "表空间的注意事项"

    - 表空间的目录需要**提前创建**，且 PostgreSQL 用户需有读写权限
    - 表空间无法直接**重命名**路径，需手动迁移
    - 不要删除 `pg_default` 和 `pg_global` 这两个系统表空间
    - `DROP TABLESPACE` 前必须先清空该表空间下的所有对象

---

## 四、单表查询

> 本节基于以下示例表进行演示：

```sql
CREATE TABLE users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    email      VARCHAR(100) UNIQUE,
    age        INTEGER DEFAULT 0,
    salary     NUMERIC(10,2),
    dept_id    INTEGER,
    tags       TEXT[],
    attributes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users (name, email, age, salary, dept_id, tags, attributes) VALUES
    ('张三', 'zhangsan@example.com', 25, 12000.00, 1, ARRAY['Java', 'Python'],   '{"city": "北京", "level": "senior"}'::JSONB),
    ('李四', 'lisi@example.com',     30, 15000.00, 1, ARRAY['Python', 'Go'],     '{"city": "上海", "level": "senior"}'::JSONB),
    ('王五', 'wangwu@example.com',   28, 10000.00, 2, ARRAY['Java', 'Vue'],      '{"city": "北京", "level": "mid"}'::JSONB),
    ('赵六', 'zhaoliu@example.com',  35, 20000.00, 2, ARRAY['Go', 'K8s'],        '{"city": "深圳", "level": "lead"}'::JSONB),
    ('陈七', NULL,                   22, 8000.00,  3, ARRAY['前端'],              '{"city": "广州", "level": "junior"}'::JSONB);
```

---

### 4.1 基本查询

```sql
-- 查询所有列
SELECT * FROM users;

-- 查询指定列
SELECT name, age, salary FROM users;

-- 列别名
SELECT name AS 姓名, salary AS 薪资 FROM users;

-- 去重查询（单列）
SELECT DISTINCT dept_id FROM users;

-- 字面量列
SELECT name, '技术部' AS department FROM users;

-- LIMIT / OFFSET 分页（第 2 页，每页 2 条）
SELECT * FROM users ORDER BY id LIMIT 2 OFFSET 2;
-- OFFSET 为 2 表示跳过前 2 条，取接下来的 2 条
```

!!! tip "LIMIT / OFFSET 与 MySQL 的差异"

    - PostgreSQL **严格要求** `LIMIT` 在前，`OFFSET` 在后；MySQL 支持 `LIMIT 2 OFFSET 2` 和 `LIMIT 2, 2` 两种写法
    - 大数据量分页推荐使用**游标分页**（`WHERE id > last_id LIMIT 10`），避免 `OFFSET` 的逐条扫描开销

---

### 4.2 WHERE 条件过滤

#### 比较与逻辑运算符

```sql
-- 比较运算符
SELECT * FROM users WHERE age > 30;
SELECT * FROM users WHERE salary >= 10000;
SELECT * FROM users WHERE name <> '张三';   -- <> 等价于 !=

-- 逻辑运算符
SELECT * FROM users WHERE age > 25 AND salary < 15000;
SELECT * FROM users WHERE dept_id = 1 OR dept_id = 2;
SELECT * FROM users WHERE NOT age > 30;

-- IN / NOT IN
SELECT * FROM users WHERE dept_id IN (1, 3);
SELECT * FROM users WHERE email IS NULL;

-- BETWEEN AND
SELECT * FROM users WHERE age BETWEEN 25 AND 35;

-- LIKE / ILIKE（ILIKE 是 PostgreSQL 特有：大小写不敏感）
SELECT * FROM users WHERE name LIKE '张%';     -- ✅ 匹配"张三"
SELECT * FROM users WHERE name ILIKE 'zhang%'; -- ✅ 即使 name 是中文不匹配，但演示语法

-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE email IS NULL;
SELECT * FROM users WHERE email IS NOT NULL;
```

!!! tip "ILIKE — PostgreSQL 独有的模糊匹配"

    MySQL 中要实现大小写不敏感的模糊匹配，需要修改排序规则或使用 `LOWER()` 函数。PostgreSQL 直接提供 `ILIKE` 操作符，无需额外处理：

    ```sql
    SELECT * FROM users WHERE name ILIKE 'zhang%';
    -- 等价于：SELECT * FROM users WHERE LOWER(name) LIKE LOWER('zhang%');
    ```

#### JSONB 查询操作符

JSONB 的操作符体系非常强大，是 PostgreSQL 的核心优势之一：

```sql
-- ─── 提取操作符 ───

-- ->  按 key 提取（返回 JSON 类型）
SELECT attributes -> 'city' AS city_json FROM users;

-- ->> 按 key 提取（返回 TEXT 类型）
SELECT name, attributes ->> 'city' AS city FROM users;

-- #>  按路径提取（返回 JSON 类型）
SELECT attributes #> '{address, detail}' FROM users;

-- #>> 按路径提取（返回 TEXT 类型）
SELECT attributes #>> '{address, detail}' FROM users;

-- 示例输出
--  name  |  city
-- ───────┼───────
--  张三  │ 北京
--  李四  │ 上海


-- ─── 存在性操作符 ───

-- ?   键是否存在
SELECT * FROM users WHERE attributes ? 'city';       -- 所有包含 city 键的行

-- ?|  任意一个键存在
SELECT * FROM users WHERE attributes ?| ARRAY['city', 'country'];

-- ?&  所有键都存在
SELECT * FROM users WHERE attributes ?& ARRAY['city', 'level'];


-- ─── 包含操作符（核心） ───

-- @>  左值是否包含右值（最常用）
SELECT * FROM users WHERE attributes @> '{"city": "北京"}';

-- <@  左值是否被右值包含
SELECT * FROM users WHERE '{"city": "北京"}'::JSONB <@ attributes;

-- 多字段包含（非常实用）
SELECT * FROM users WHERE attributes @> '{"city": "北京", "level": "senior"}';


-- ─── JSONB 其他操作 ───

-- ||  合并 JSONB 对象
SELECT attributes || '{"source": "recruit"}'::JSONB AS merged FROM users;

-- -   删除 key
SELECT attributes - 'level' AS without_level FROM users;

-- jsonb_set() 更新嵌套字段
UPDATE users
   SET attributes = jsonb_set(attributes, '{level}', '"expert"')
 WHERE name = '张三';
```

| 操作符                 | 用途                     | 返回类型    |         |
| ------------------- | ---------------------- | ------- | ------- |
| `-> 'key'`          | 提取 JSON 字段（保留 JSON 格式） | JSONB   |         |
| `->> 'key'`         | 提取 JSON 字段（转为文本）       | TEXT    |         |
| `#> '{a,b}'`        | 按路径提取 JSON             | JSONB   |         |
| `#>> '{a,b}'`       | 按路径提取文本                | TEXT    |         |
| `? 'key'`           | 键是否存在                  | BOOLEAN |         |
| `?                  | ARRAY['a','b']`        | 任意一个键存在 | BOOLEAN |
| `?& ARRAY['a','b']` | 所有键都存在                 | BOOLEAN |         |
| `@> '{"k":"v"}'`    | 左值包含右值                 | BOOLEAN |         |
| `<@ '{"k":"v"}'`    | 左值被右值包含                | BOOLEAN |         |
| `\|\|`              | 合并 JSONB               | JSONB   |         |

!!! warning "JSONB 查询需要 GIN 索引"

    上述 `@>`、`?`、`?|`、`?&` 操作符在无索引时走全表扫描。数据量大时**务必创建 GIN 索引**：

    ```sql
    CREATE INDEX idx_users_attrs ON users USING GIN (attributes);
    ```

#### 数组查询操作符

```sql
-- ─── 包含操作 ───

-- @>  数组包含所有元素（顺序无关）
SELECT * FROM users WHERE tags @> ARRAY['Java'];          -- 包含 Java
SELECT * FROM users WHERE tags @> ARRAY['Java', 'Python']; -- 同时包含 Java 和 Python

-- <@  数组被包含
SELECT * FROM users WHERE ARRAY['Java', 'Python', 'Go'] <@ tags;

-- &&  数组重叠（有任意共同元素即可）
SELECT * FROM users WHERE tags && ARRAY['Go', 'K8s'];     -- 掌握 Go 或 K8s 的人


-- ─── 数组索引访问 ───

-- 索引从 1 开始
SELECT name, tags[1] AS first_skill FROM users;

-- 元素查找（ANY）
SELECT * FROM users WHERE 'Python' = ANY(tags);
```

| 操作符 | 含义 | 示例 |
|--------|------|------|
| `@>` | 包含所有指定元素 | `tags @> ARRAY['Java', 'Python']` |
| `<@` | 元素都在指定集合中 | `ARRAY['Java'] <@ tags` |
| `&&` | 有任意共同元素（重叠） | `tags && ARRAY['Go', 'K8s']` |
| `ANY()` | 单个元素是否存在 | `'Python' = ANY(tags)` |

!!! tip "数组索引从 1 开始"
    `tags[1]` 取第一个元素，`tags[0]` 返回 **NULL**，不报错。这是 PostgreSQL 数组与编程语言数组的一大差异。

---

### 4.3 排序与分页

```sql
-- 单列排序
SELECT * FROM users ORDER BY salary DESC;  -- 降序
SELECT * FROM users ORDER BY age ASC;       -- 升序（默认）

-- 多列排序
SELECT * FROM users ORDER BY dept_id ASC, salary DESC;

-- NULLS FIRST / LAST（PostgreSQL 特有）
SELECT * FROM users ORDER BY email ASC NULLS LAST;   -- NULL 排最后（默认）
SELECT * FROM users ORDER BY email ASC NULLS FIRST;  -- NULL 排最前

-- 分页
SELECT * FROM users ORDER BY id LIMIT 2 OFFSET 0;   -- 第 1 页
SELECT * FROM users ORDER BY id LIMIT 2 OFFSET 2;   -- 第 2 页
SELECT * FROM users ORDER BY id LIMIT 2 OFFSET 4;   -- 第 3 页

-- 游标分页（大数据量推荐，避免 OFFSET 性能问题）
SELECT * FROM users WHERE id > 3 ORDER BY id LIMIT 2;
```

!!! tip "NULLS 排序行为"

    PostgreSQL 默认 **NULL 值比非 NULL 值大**，因此：
    - `ORDER BY col ASC` → NULL 排在最**后**
    - `ORDER BY col DESC` → NULL 排在最**前**
    - 用 `NULLS FIRST` / `NULLS LAST` 强制控制

| 分页方式 | 适用场景 | 优缺点 |
|----------|---------|--------|
| `LIMIT + OFFSET` | 小数据集、前端任意翻页 | 简单直接，但 OFFSET 越大越慢 |
| **游标分页**（`WHERE id > last`） | 大数据量、滚动加载 | 稳定高效，但只能前后翻页 |

---

### 4.4 聚合与分组

#### 聚合函数

```sql
-- 基本聚合
SELECT COUNT(*)            AS 总人数         FROM users;
SELECT AVG(salary)         AS 平均薪资       FROM users;
SELECT SUM(salary)         AS 薪资总额       FROM users;
SELECT MAX(salary)         AS 最高薪资       FROM users;
SELECT MIN(age)            AS 最小年龄       FROM users;

-- COUNT 细节
SELECT COUNT(*)          FROM users;           -- 5（所有行）
SELECT COUNT(email)      FROM users;           -- 4（排除 email 为 NULL 的行）
SELECT COUNT(DISTINCT dept_id) FROM users;     -- 3（去重部门数）
```

#### GROUP BY 分组

```sql
-- 按部门统计
SELECT dept_id,
       COUNT(*)    AS 人数,
       AVG(salary) AS 平均薪资,
       MAX(salary) AS 最高薪资
  FROM users
 GROUP BY dept_id
 ORDER BY dept_id;

-- 按 JSONB 字段分组
SELECT attributes ->> 'city' AS 城市,
       COUNT(*)              AS 人数
  FROM users
 GROUP BY attributes ->> 'city';
```

#### HAVING 分组后过滤

```sql
-- WHERE 在分组前过滤，HAVING 在分组后过滤

-- 查询平均薪资 > 10000 的部门
SELECT dept_id,
       AVG(salary) AS avg_salary
  FROM users
 GROUP BY dept_id
HAVING AVG(salary) > 10000;

-- WHERE + HAVING 组合
-- 筛选年龄 >= 25 的员工，按部门统计，只显示人数 >= 2 的部门
SELECT dept_id,
       COUNT(*) AS 人数
  FROM users
 WHERE age >= 25              -- 分组前过滤
 GROUP BY dept_id
HAVING COUNT(*) >= 2;         -- 分组后过滤
```

| 过滤时机 | 关键字 | 作用 |
|----------|--------|------|
| 分组前 | `WHERE` | 过滤原始行，不能使用聚合函数 |
| 分组后 | `HAVING` | 过滤分组结果，只能使用聚合函数或分组列 |

!!! info "GROUP BY 的注意事项"

    - `SELECT` 中的非聚合列**必须**出现在 `GROUP BY` 中（比 MySQL 严格）
    - MySQL 中 `SELECT a, b FROM t GROUP BY a` 可能不报错，PostgreSQL **直接报错**

---

### 4.5 条件表达式

```sql
-- CASE WHEN（类似 if-else）
SELECT name,
       salary,
       CASE
           WHEN salary < 10000 THEN '初级'
           WHEN salary BETWEEN 10000 AND 15000 THEN '中级'
           WHEN salary > 15000 THEN '高级'
       END AS 职级
  FROM users;

-- CASE 简单写法（等值判断）
SELECT name,
       CASE dept_id
           WHEN 1 THEN '后端'
           WHEN 2 THEN '前端'
           WHEN 3 THEN '运维'
           ELSE '其他'
       END AS 部门
  FROM users;

-- COALESCE() — 返回第一个非 NULL 值（最常用）
SELECT name,
       COALESCE(email, '无邮箱') AS email
  FROM users;

-- NULLIF() — 若两值相等返回 NULL
SELECT NULLIF(0, 0);  -- NULL
SELECT NULLIF(0, 1);  -- 0

-- GREATEST() / LEAST() — 返回最大/最小值
SELECT GREATEST(10, 20, 5);  -- 20
SELECT LEAST(10, 20, 5);     -- 5
```

!!! tip "COALESCE 的经典场景"

    1. NULL 值替换默认值：`COALESCE(email, '无邮箱')`
    2. 多字段回退取值：`COALESCE(phone, mobile, '无联系方式')` — 按优先级依次尝试

---

### 4.6 DISTINCT ON 与 TABLESAMPLE

#### DISTINCT ON（PostgreSQL 特有）

`DISTINCT ON` 比普通 `DISTINCT` 更灵活——可以按指定列去重，同时控制返回哪一行数据：

```sql
-- DISTINCT：去重所有选择的列
SELECT DISTINCT dept_id FROM users;

-- DISTINCT ON：按 dept_id 去重，每个部门返回一条记录
-- 配合 ORDER BY 控制返回哪一条（通常配合同一列）

-- 每个部门中薪资最高的人
SELECT DISTINCT ON (dept_id)
    dept_id, name, salary
  FROM users
 ORDER BY dept_id, salary DESC, id;

-- 每个部门中年龄最小的人
SELECT DISTINCT ON (dept_id)
    dept_id, name, age
  FROM users
 ORDER BY dept_id, age ASC, id;
```

!!! warning "DISTINCT ON 的 ORDER BY 约束"

    `DISTINCT ON (expr)` 中 `ORDER BY` 的**起始列必须与 `DISTINCT ON` 中的表达式一致**，否则报错。

---

## 五、常用函数

> 参考文档：[PostgreSQL 官方文档 — 函数和操作符](https://www.postgresql.org/docs/current/functions.html)

在 PostgreSQL 中，函数就像是 **"内置的小工具"**，能帮你直接在 SQL 层把原始数据加工成最终需要的格式。

我们可以把常用的函数分为四大类：**字符串处理**、**数值计算**、**日期时间**以及**聚合处理**。

---

### 5.1 字符串处理函数（清洗数据的利器）

当文件路径、用户名格式不统一时，这些函数能帮大忙。

#### CONCAT / ||

拼接字符串：

```sql
SELECT CONCAT('Hello', ' ', 'World');  -- Hello World
SELECT 'Hello' || ' ' || 'World';      -- Hello World（|| 是 SQL 标准操作符）

-- 多字段拼接
SELECT name || ' - ' || email AS info FROM users;
```

!!! tip "CONCAT 与 || 的区别"

    - `CONCAT` 会自动忽略 `NULL` 参数，不会报错
    - `||` 操作符：只要有一个值为 `NULL`，整个结果就是 `NULL`（需配合 `COALESCE` 使用）

    ```sql
    SELECT CONCAT('a', NULL, 'b');   -- 'ab'
    SELECT 'a' || NULL || 'b';       -- NULL
    SELECT 'a' || COALESCE(NULL, '') || 'b';  -- 'ab'
    ```

#### UPPER / LOWER

```sql
SELECT UPPER('hello world');  -- HELLO WORLD
SELECT LOWER('HELLO WORLD');  -- hello world

-- 示例：统一邮箱查询
SELECT * FROM users WHERE LOWER(email) = LOWER('ZHANGSAN@EXAMPLE.COM');
```

#### SUBSTRING（截取字符串）

```sql
-- 语法：SUBSTRING(string FROM start FOR length) 或 SUBSTR(string, start, length)
SELECT SUBSTRING('PostgreSQL' FROM 1 FOR 4);  -- Post
SELECT SUBSTR('PostgreSQL', 6, 4);            -- reSQ

-- 截取邮箱的用户名部分
SELECT name,
       email,
       SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1) AS username
  FROM users
 WHERE email IS NOT NULL;
```

#### REPLACE（替换内容）

```sql
-- 将字符串中的某段内容替换为另一段
SELECT REPLACE('hello world', 'world', 'PostgreSQL');  -- hello PostgreSQL

-- 实际场景：清理数据中的特殊字符
SELECT name, REPLACE(name, ' ', '') AS cleaned_name FROM users;
```

#### COALESCE（万能默认值）

**这是日常开发中最常用的函数之一**，返回参数列表中第一个非 `NULL` 的值：

```sql
-- 基础用法：NULL 值替换
SELECT name, COALESCE(email, '无邮箱') AS email FROM users;

-- 进阶用法：多字段回退（按优先级依次尝试）
SELECT name,
       COALESCE(phone, mobile, '无联系方式') AS contact
  FROM users;
```

!!! tip "COALESCE 的常见场景"

    1. **数据显示**：查询结果中的 NULL 替换为占位文本
    2. **计算安全**：`COALESCE(amount, 0)` 防止 NULL 参与计算导致结果也为 NULL
    3. **配置回退**：`COALESCE(custom_config, default_config, 'default')` 实现多级默认值

---

### 5.2 数值计算函数

#### ROUND（四舍五入）

```sql
SELECT ROUND(123.4567);      -- 123（取整）
SELECT ROUND(123.4567, 2);   -- 123.46（保留两位小数）
SELECT ROUND(123.4567, 0);   -- 123（等同于 ROUND(123.4567)）

-- 薪资取整显示
SELECT name, salary, ROUND(salary * 0.12, 2) AS tax FROM users;
```

#### CEIL / FLOOR（向上/向下取整）

```sql
SELECT CEIL(12.3);    -- 13（向上取整）
SELECT CEIL(-12.3);   -- -12
SELECT FLOOR(12.8);   -- 12（向下取整）
SELECT FLOOR(-12.8);  -- -13

-- 实际场景：统计文件大小分级
SELECT name,
       CEIL(file_size / 1024.0 / 1024.0) AS size_mb
  FROM files;
```

#### ABS（取绝对值）

```sql
SELECT ABS(-10);     -- 10
SELECT ABS(10);      -- 10

-- 计算差值绝对值
SELECT ABS(salary - 10000) AS diff_from_10k FROM users;
```

#### 数值函数速查表

| 函数 | 说明 | 示例 | 结果 |
|------|------|------|------|
| `ROUND(n, d)` | 四舍五入，保留 d 位小数 | `ROUND(3.14159, 2)` | `3.14` |
| `CEIL(n)` | 向上取整 | `CEIL(3.14)` | `4` |
| `FLOOR(n)` | 向下取整 | `FLOOR(3.14)` | `3` |
| `ABS(n)` | 取绝对值 | `ABS(-5)` | `5` |
| `POWER(a, b)` | a 的 b 次幂 | `POWER(2, 10)` | `1024` |
| `SQRT(n)` | 平方根 | `SQRT(16)` | `4` |
| `MOD(a, b)` | 取模（余数） | `MOD(10, 3)` | `1` |
| `RANDOM()` | 返回 0.0~1.0 随机数 | `RANDOM()` | `0.23456` |

---

### 5.3 日期时间函数（时间管理的灵魂）

#### NOW / CURRENT_DATE / CURRENT_TIME

```sql
-- 获取当前时间
SELECT NOW();              -- 2026-05-30 14:30:00.123456+08（完整时间，带时区）
SELECT CURRENT_DATE;       -- 2026-05-30（仅日期）
SELECT CURRENT_TIME;       -- 14:30:00.123456+08（仅时间，带时区）
SELECT CURRENT_TIMESTAMP;  -- 同 NOW()

-- 获取当天 00:00:00
SELECT CURRENT_DATE::TIMESTAMP;                 -- 2026-05-30 00:00:00
SELECT DATE_TRUNC('day', NOW());                -- 同上，推荐
```

!!! tip "NOW() 与 CLOCK_TIMESTAMP() 的区别"

    - `NOW()`：返回**事务开始时间**，同一事务中多次调用值不变（符合 SQL 标准）
    - `CLOCK_TIMESTAMP()`：返回**实际当前时间**，每次调用值都不同

    ```sql
    SELECT NOW(), NOW();                    -- 两个值相同
    SELECT CLOCK_TIMESTAMP(), CLOCK_TIMESTAMP();  -- 两个值可能不同（微妙级差异）
    ```

#### AGE（计算时间差）

```sql
-- 语法：AGE(timestamp) → 计算从该时间到现在的差值
--        AGE(end, start) → 计算两个时间之间的差值

SELECT AGE('2026-05-30', '1998-03-15');  -- 28 years 2 mons 15 days

-- 查看用户注册了多久
SELECT name, AGE(created_at) AS active_duration FROM users;
```

`AGE` 返回的是 PostgreSQL 的 `INTERVAL` 类型，可直接用于排序和筛选：

```sql
-- 查询注册超过 1 年的用户
SELECT name, created_at
  FROM users
 WHERE AGE(CURRENT_DATE, created_at::DATE) > INTERVAL '1 year';
```

#### EXTRACT（提取年/月/日/小时）

```sql
-- 语法：EXTRACT(field FROM source)
-- field 可选: YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, DOW(星期几) 等

SELECT EXTRACT(YEAR   FROM NOW());  -- 2026
SELECT EXTRACT(MONTH  FROM NOW());  -- 5
SELECT EXTRACT(DAY    FROM NOW());  -- 30
SELECT EXTRACT(HOUR   FROM NOW());  -- 14
SELECT EXTRACT(DOW    FROM NOW());  -- 6（0=周日, 1=周一, ..., 6=周六）

-- 统计每小时数据量
SELECT EXTRACT(HOUR FROM created_at) AS hour,
       COUNT(*) AS cnt
  FROM users
 GROUP BY EXTRACT(HOUR FROM created_at)
 ORDER BY hour;
```

!!! info "EXTRACT 与 DATE_PART"

    `EXTRACT` 是 SQL 标准语法，`DATE_PART` 是 PostgreSQL 的传统语法，二者功能完全一致：

    ```sql
    SELECT EXTRACT(YEAR FROM NOW());     -- 标准写法，推荐
    SELECT DATE_PART('year', NOW());     -- 等价写法
    ```

#### DATE_TRUNC（时间截断，非常实用）

将时间截断到指定精度，是 **按时间段统计的利器**：

```sql
-- 按天/月/年 截断
SELECT DATE_TRUNC('hour', NOW());     -- 2026-05-30 14:00:00+08
SELECT DATE_TRUNC('day', NOW());      -- 2026-05-30 00:00:00+08
SELECT DATE_TRUNC('month', NOW());    -- 2026-05-01 00:00:00+08
SELECT DATE_TRUNC('year', NOW());     -- 2026-01-01 00:00:00+08

-- 按月份统计注册人数
SELECT DATE_TRUNC('month', created_at) AS month,
       COUNT(*) AS reg_count
  FROM users
 GROUP BY DATE_TRUNC('month', created_at)
 ORDER BY month;
```

#### TO_CHAR（时间格式化）

将时间转换为任意格式的字符串：

```sql
SELECT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS');   -- 2026-04-30 14:30:00
SELECT TO_CHAR(NOW(), 'YYYY-MM-DD');               -- 2026-04-30
SELECT TO_CHAR(NOW(), 'HH24:MI:SS');               -- 14:30:00
SELECT TO_CHAR(NOW(), 'Mon DD, YYYY');             -- May 30, 2026
SELECT TO_CHAR(NOW(), 'YYYY年MM月DD日');            -- 2026年05月30日

-- 实际场景：按日期格式化输出
SELECT name,
       TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS 创建时间
  FROM users;
```

| 格式模板   | 说明            | 示例         |
| ------ | ------------- | ---------- |
| `YYYY` | 四位年份          | `2026`     |
| `MM`   | 月份（01-12）     | `05`       |
| `DD`   | 日（01-31）      | `30`       |
| `HH24` | 24 小时制（00-23） | `14`       |
| `HH12` | 12 小时制（01-12） | `02`       |
| `MI`   | 分钟（00-59）     | `30`       |
| `SS`   | 秒（00-59）      | `45`       |
| `Mon`  | 缩写的月份名        | `May`      |
| `Day`  | 完整的星期名        | `Saturday` |
| `DOW`  | 星期几（0-6）      | `6`        |

#### 日期计算

```sql
-- 加减时间
SELECT NOW() + INTERVAL '1 day';         -- 明天这个时间
SELECT NOW() - INTERVAL '7 days';        -- 一周前
SELECT NOW() + INTERVAL '2 hours';       -- 两小时后
SELECT NOW() + INTERVAL '1 month';       -- 下个月

-- 日期差（天数）
SELECT DATE '2026-05-30' - DATE '2026-01-01';  -- 149（间隔天数）

-- 两个日期间的月份数
SELECT EXTRACT(YEAR FROM AGE('2026-05-30', '2024-03-15')) * 12
     + EXTRACT(MONTH FROM AGE('2026-05-30', '2024-03-15'));  -- 26 个月
```

---

### 5.4 流程控制与聚合函数

#### CASE WHEN（SQL 里的 if-else）

```sql
-- 基础用法：根据条件赋值
SELECT name,
       salary,
       CASE
           WHEN salary < 10000 THEN '初级'
           WHEN salary BETWEEN 10000 AND 15000 THEN '中级'
           WHEN salary > 15000 THEN '高级'
       END AS 职级
  FROM users;
```

=== "简单 CASE（等值判断）"

    ```sql
    SELECT name,
           CASE dept_id
               WHEN 1 THEN '后端'
               WHEN 2 THEN '前端'
               WHEN 3 THEN '运维'
               ELSE '其他'
           END AS 部门
      FROM users;
    ```

=== "搜索 CASE（范围判断）"

    ```sql
    SELECT name,
           salary,
           CASE
               WHEN salary < 10000 THEN '初级'
               WHEN salary BETWEEN 10000 AND 15000 THEN '中级'
               WHEN salary > 15000 THEN '高级'
               ELSE '未定'
           END AS 职级
      FROM users;
    ```

=== "CASE 聚合（行转列）"

    ```sql
    -- 统计每个薪资等级的人数（行转列）
    SELECT
        COUNT(*) FILTER (WHERE salary < 10000)   AS 初级,
        COUNT(*) FILTER (WHERE salary BETWEEN 10000 AND 15000) AS 中级,
        COUNT(*) FILTER (WHERE salary > 15000)  AS 高级
    FROM users;
    ```

#### STRING_AGG（PG 特色：行转字符串）

把多行结果合并成一行字符串，是 **PostgreSQL 独有的强大聚合函数**：

```sql
-- 将所有用户名拼成逗号分隔的字符串
SELECT STRING_AGG(name, ', ') AS all_names FROM users;
-- 张三, 李四, 王五, 赵六, 陈七

-- 按部门分组，拼接组内姓名
SELECT dept_id,
       STRING_AGG(name, ', ' ORDER BY salary DESC) AS 组员
  FROM users
 GROUP BY dept_id;

-- 拼接数组字段
SELECT uploader_ip,
       STRING_AGG(tags::text, ' | ') AS tag_list
  FROM file_details
 GROUP BY uploader_ip;
```

!!! tip "STRING_AGG vs MySQL 的 GROUP_CONCAT"

    `STRING_AGG` 在功能上等价于 MySQL 的 `GROUP_CONCAT`，但 PostgreSQL 的版本支持 **`ORDER BY` 子句**，可以在拼接时控制顺序，更加灵活。

#### ARRAY_AGG（行转数组）

```sql
-- 将多行结果聚合成数组
SELECT dept_id,
       ARRAY_AGG(name ORDER BY salary DESC) AS 组员列表
  FROM users
 GROUP BY dept_id;

-- 结合 unnest 实现复杂拼接
SELECT
    uploader_ip,
    array_to_string(ARRAY_AGG(unnest_tags), ', ') AS tag_list
FROM (
    SELECT uploader_ip, unnest(tags) AS unnest_tags FROM file_details
) t
GROUP BY uploader_ip;
```

#### 聚合函数速查表

| 函数 | 说明 | MySQL 对应 | PG 特有 |
|------|------|-----------|---------|
| `COUNT(*)` | 行数计数 | ✅ | ❌ |
| `SUM(col)` | 求和 | ✅ | ❌ |
| `AVG(col)` | 平均值 | ✅ | ❌ |
| `MAX(col)` | 最大值 | ✅ | ❌ |
| `MIN(col)` | 最小值 | ✅ | ❌ |
| `STRING_AGG(col, delim)` | 行转字符串 | `GROUP_CONCAT` | ✅ |
| `ARRAY_AGG(col)` | 行转数组 | ❌ | ✅ |
| `FILTER (WHERE ...)` | 条件聚合 | ❌ | ✅ |

---

### 5.5 综合实战：一起用起来

把字符串函数、数值计算、日期处理和聚合全部串联到一张报表中：

```sql
-- 员工分析报表
SELECT
    -- 字符串处理
    COALESCE(UPPER(name), '未知')                     AS 姓名大写,
    COALESCE(email, '无邮箱')                         AS 邮箱,
    -- 数值计算
    ROUND(AVG(salary), 0)                            AS 平均薪资,
    ROUND(SUM(salary), 2)                            AS 薪资总额,
    -- 日期处理
    TO_CHAR(MIN(created_at), 'YYYY-MM-DD')           AS 最早入职日,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, MIN(created_at)::DATE)) AS 最资深员工年限,
    -- 聚合
    COUNT(*)                                          AS 人数,
    STRING_AGG(name, ', ' ORDER BY salary DESC)      AS 成员列表(按薪资降序)
  FROM users
 GROUP BY dept_id
 ORDER BY 平均薪资 DESC;
```

---

## 六、多表查询

> 参考文档：[PostgreSQL 官方文档 — 表连接](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-JOIN)

在真实的业务中，数据往往分散在多张表中，我们需要通过**表之间的关系**将它们重新串联起来。

```
┌─────────────────────────────────────────────────────────┐
│                       业务世界                           │
│  ┌──────────┐     ┌──────────────┐    ┌──────────┐      │
│  │  用户表   │────→│   订单表      │←───│  商品表   │     │
│  └──────────┘     │ (中间桥梁)    │    └──────────┘      │
│                   └──────────────┘                      │
│     一对一                   一对多              多对多   │
└─────────────────────────────────────────────────────────┘
```

表与表之间存在三种核心关系：**一对一**、**一对多**、**多对多**。

!!! tip "本章示例表复用说明"
    本章使用全新的示例表（goddesses / simps / students / clubs 等），与第四章的 `users` 表示例独立，**互不影响**。

---

### 6.1 一对一关系 (1:1)

#### 概念

表 A 的一行只能对应表 B 的一行。通常用于将 **"核心高频数据"** 与 **"扩展低频数据"** 分离，提高查询效率。

#### 示例：用户 (users) 与用户详细信息 (user_profiles)

在用户系统中，账号密码是核心高频字段，而个人介绍、头像 URL、收货地址属于扩展信息。分表存储可以减少主表的行宽，提升缓存效率。

```sql
-- 主表：核心账户
CREATE TABLE users (
    id       BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL UNIQUE
);

-- 扩展表：详细资料
CREATE TABLE user_profiles (
    user_id    BIGINT PRIMARY KEY,  -- 既是主键，也是外键
    avatar_url TEXT,
    bio        TEXT,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

!!! tip "实现一对一的关键"
    在子表中，将外键字段设为 `PRIMARY KEY` 或 `UNIQUE`，确保一个用户 ID 只能在 Profile 表里出现一次。

#### ON DELETE CASCADE（定义"连坐"逻辑）

这是定义当 **主表（users）** 的数据被删除时，**从表（user_profiles）** 该如何处理的核心规则。

**CASCADE（级联）**：就像多米诺骨牌。如果 ID 为 1 的用户被删除了，数据库会自动、静默地把 `user_profiles` 里所有 `user_id = 1` 的行也删掉。

为什么用它：在"一对一"或"一对多"关系中，如果主体（用户）都不存在了，相关的详细资料或头像信息也就没有存在的意义了。使用级联可以防止数据库堆积垃圾数据。

| 选项 | 效果 | 适用场景 |
|------|------|---------|
| `CASCADE` | 主表删除，从表对应行自动删除 | 主体不存在时，附属数据无意义 |
| `RESTRICT`（默认） | 如果有关联数据，禁止删除主表行 | 保护重要数据，防止误删 |
| `SET NULL` | 主表删除，从表外键置为 NULL | 用户注销了，但想保留其评论痕迹 |
| `NO ACTION` | 与 RESTRICT 类似，但在事务结束时检查 | 复杂事务处理 |

#### 插入数据

```sql
-- 第一步：插入核心用户
INSERT INTO users (username) VALUES ('fengfeng') RETURNING id;

-- 假设上面返回的 ID 是 1
-- 第二步：插入对应的详细资料
INSERT INTO user_profiles (user_id, avatar_url, bio)
VALUES (1, 'https://example.com/avatar.png', '技术教育者，B站UP主');

-- ❌ 尝试再次为 ID 为 1 的用户插入资料（会报错！）
-- ERROR: duplicate key value violates unique constraint "user_profiles_pkey"
-- 这正是 PRIMARY KEY 设计的目的，保证了一对一的严格性
```

#### 查询数据

=== "正向联查（由用户查详情）"

    ```sql
    SELECT username, avatar_url
      FROM users
      JOIN user_profiles up ON users.id = up.user_id;
    ```

=== "反向联查（由详情查用户）"

    ```sql
    SELECT avatar_url, username
      FROM user_profiles
      LEFT JOIN users u ON u.id = user_profiles.user_id;
    ```

#### 关于外键的现实考量

!!! warning "物理外键 vs 逻辑外键"

    | 类型 | 优点 | 缺点 |
    |------|------|------|
    | **物理外键**（`FOREIGN KEY`） | 数据一致性由数据库保证 | 高并发下影响写入性能；大表 DDL 操作困难；分布式/分库分表无法使用 |
    | **逻辑外键**（仅存 ID） | 性能高，灵活，适合分布式 | 需要业务代码保证一致性 |

    **生产建议**：大部分互联网业务（尤其是高并发场景）会**去掉物理外键**，使用逻辑外键 + 业务层保证数据一致性。

---

### 6.2 一对多关系 (1:N)

#### 概念

表 A 的一行可以对应表 B 的多行，但表 B 的一行只能属于表 A 的一个实体。

```
┌─────────────────────┐                ┌──────────────────────┐
│     女神表 (1)       │                │     舔狗表 (N)        │
│  ┌─────────────────┐ │                │  ┌──────────────────┐│
│  │ 林青霞  天蝎座    │ │────────────────│  │ 阿强  │ 520.00   ││
│  │ 王祖贤  水瓶座    │ │   target_id    │  │ 小明  │ 1314.00  ││
│  └─────────────────┘ │                │  │ 旺财  │ 9.90     ││
└─────────────────────┘                │  │ 大壮  │ 8888.88  ││
                                       │  │ 铁柱  │ 0.01     ││
                                       │  └──────────────────┘│
                                       └──────────────────────┘
```

#### 示例：女神与舔狗

一位"女神"可以拥有成千上万名"舔狗"，但一名"舔狗"在特定时间内往往只能追一位女神。

```sql
-- 1. 女神表（一）
CREATE TABLE goddesses (
    id        BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name      TEXT NOT NULL,
    star_sign TEXT  -- 星座
);

-- 2. 舔狗表（多）
CREATE TABLE simps (
    id                 BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    target_id          BIGINT NOT NULL,       -- 目标女神的 ID（外键）
    nickname           TEXT NOT NULL,          -- 舔狗昵称
    contributed_amount DECIMAL(10, 2) DEFAULT 0,  -- 累计贡献金额

    -- 外键约束：如果女神号注销了，舔狗记录也级联消失
    CONSTRAINT fk_goddess
        FOREIGN KEY (target_id) REFERENCES goddesses(id) ON DELETE CASCADE
);
```

!!! tip "一对多实现要点"
    在 **"多"的一方（simps）** 添加一个字段存储 **"一"的一方（goddesses）** 的主键。

#### 插入数据

```sql
-- 插入两位女神
INSERT INTO goddesses (name, star_sign)
VALUES ('林青霞', '天蝎座'), ('王祖贤', '水瓶座')
RETURNING id, name;
-- 假设 林青霞 ID=1, 王祖贤 ID=2

-- 为 林青霞 (ID: 1) 插入忠实粉丝
INSERT INTO simps (target_id, nickname, contributed_amount) VALUES
    (1, '阿强', 520.00),
    (1, '小明', 1314.00),
    (1, '旺财', 9.90);

-- 为 王祖贤 (ID: 2) 插入忠实粉丝
INSERT INTO simps (target_id, nickname, contributed_amount) VALUES
    (2, '大壮', 8888.88),
    (2, '铁柱', 0.01);
```

#### 查询数据

=== "查看每位舔狗正在追谁"

    ```sql
    SELECT
        s.nickname          AS 舔狗,
        g.name              AS 女神,
        s.contributed_amount AS 贡献值
      FROM simps s
      JOIN goddesses g ON s.target_id = g.id
     ORDER BY s.contributed_amount DESC;
    ```

=== "查看哪位女神收到的贡献总额最高"

    ```sql
    SELECT
        g.name              AS 女神,
        COUNT(s.id)          AS 舔狗总数,
        SUM(s.contributed_amount) AS 收到总金额
      FROM goddesses g
      LEFT JOIN simps s ON g.id = s.target_id
     GROUP BY g.name
     ORDER BY 收到总金额 DESC;
    ```

=== "找出贡献金额低于 10 元的舔狗"

    ```sql
    SELECT nickname, contributed_amount
      FROM simps
     WHERE contributed_amount < 10.00;
    ```

---

### 6.3 多对多关系 (M:N)

#### 概念

表 A 的一行对应表 B 的多行，反之亦然。这种关系无法在任何一张表里通过加一个字段来解决，必须有一个 **"中间人"（关联表）** 来牵线搭桥。

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│   学生表      │     │    成员关系表      │     │   社团表      │
│──────────────│     │──────────────────│     │──────────────│
│ 枫枫  ID=1   │────→│ student_id=1     │←────│ Go语言社      │
│ 小红  ID=2   │     │ club_id=1        │     │ 篮球社        │
│ 老王  ID=3   │     │ student_id=1     │     │ 钓鱼社        │
│              │     │ club_id=2        │     │              │
│              │     │ student_id=2     │     │              │
│              │     │ club_id=2        │     │              │
│              │────→│ student_id=3     │←────│              │
│              │     │ club_id=1        │     │              │
│              │     │ student_id=3     │     │              │
│              │     │ club_id=3        │     │              │
└──────────────┘     └──────────────────┘     └──────────────┘
```

#### 示例：学生 (students) 与 社团 (clubs)

一个学生可以参加多个社团（既参加羽毛球社，又参加代码社），一个社团也可以拥有多名学生。

```sql
-- 1. 学生表（核心实体 A）
CREATE TABLE students (
    id   BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL
);

-- 2. 社团表（核心实体 B）
CREATE TABLE clubs (
    id          BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    club_name   TEXT NOT NULL UNIQUE,
    description TEXT
);

-- 3. 成员关系表（中间桥梁）
-- 这张表记录了 "谁" 参加了 "哪个" 社团
CREATE TABLE memberships (
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    club_id    BIGINT REFERENCES clubs(id) ON DELETE CASCADE,
    joined_at  TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (student_id, club_id)  -- 联合主键：防止重复加入
);
```

!!! tip "多对多实现要点"

    - 需要一张**中间表**（关联表），存储两个外键
    - 中间表通常使用**联合主键** `PRIMARY KEY (a_id, b_id)`，保证不会重复关联
    - 中间表可以带**额外字段**（如 `joined_at`、`role` 等），记录关系的属性

#### 插入数据

```sql
-- 插入学生
INSERT INTO students (name) VALUES ('枫枫'), ('小红'), ('老王') RETURNING id;
-- 假设 ID 分别是 1, 2, 3

-- 插入社团
INSERT INTO clubs (club_name, description) VALUES
    ('Go语言社', '高性能后端开发探讨'),
    ('篮球社',   '只因你太美'),
    ('钓鱼社',   '永不空军')
RETURNING id;
-- 假设 ID 分别是 1, 2, 3

-- 建立多对多关系
INSERT INTO memberships (student_id, club_id) VALUES
    (1, 1),  -- 枫枫 → Go语言社
    (1, 2),  -- 枫枫 → 篮球社
    (2, 2),  -- 小红 → 篮球社
    (3, 1),  -- 老王 → Go语言社
    (3, 3);  -- 老王 → 钓鱼社
```

#### 查询数据（两次 JOIN 跳转）

由于信息隔了两层，我们需要两次 `JOIN` 跨过中间表：

=== "查成员：某个社团里有哪些人？"

    ```sql
    SELECT
        c.club_name  AS 社团名,
        s.name       AS 成员名,
        m.joined_at  AS 入社时间
      FROM clubs c
      JOIN memberships m ON c.id = m.club_id
      JOIN students s   ON m.student_id = s.id
     WHERE c.club_name = 'Go语言社';
    ```

=== "查轨迹：某个学生参加了多少个社团？"

    ```sql
    SELECT
        s.name            AS 学生名,
        COUNT(m.club_id)  AS 参加社团数,
        STRING_AGG(c.club_name, ', ') AS 社团清单
      FROM students s
      LEFT JOIN memberships m ON s.id = m.student_id
      LEFT JOIN clubs c      ON m.club_id = c.id
     WHERE s.name = '枫枫'
     GROUP BY s.name;
    ```

=== "查热度：哪个社团人最多？"

    ```sql
    SELECT
        c.club_name,
        COUNT(m.student_id) AS 总人数
      FROM clubs c
      LEFT JOIN memberships m ON c.id = m.club_id
     GROUP BY c.club_name
     ORDER BY 总人数 DESC;
    ```

---

### 6.4 JOIN 详解（连接的四种方式）

在前面三节中，我们大量使用了 `JOIN` / `LEFT JOIN`。这里做一个系统的总结。

#### 示例数据

```sql
-- 左表：员工
CREATE TABLE emp (id INT, name TEXT);
INSERT INTO emp VALUES (1, '张三'), (2, '李四'), (3, '王五');

-- 右表：部门
CREATE TABLE dept (id INT, name TEXT);
INSERT INTO dept VALUES (1, '技术部'), (2, '市场部'), (4, '财务部');
```

#### 四种 JOIN 对比

=== "INNER JOIN（交集）"

    ```sql
    SELECT e.name AS 员工, d.name AS 部门
      FROM emp e
      JOIN dept d ON e.id = d.id;

    -- 结果：
    --  员工  │  部门
    ────────┼────────
    --  张三  │ 技术部
    --  李四  │ 市场部
    ```

    !!! tip "`JOIN` 默认就是 `INNER JOIN`"
        只返回**两表中匹配的行**。王五（id=3）和 财务部（id=4）都不在对方的表中，所以不出现。

=== "LEFT JOIN（左表全保留）"

    ```sql
    SELECT e.name AS 员工, d.name AS 部门
      FROM emp e
      LEFT JOIN dept d ON e.id = d.id;

    -- 结果：
    --  员工  │  部门
    ────────┼────────
    --  张三  │ 技术部
    --  李四  │ 市场部
    --  王五  │ NULL    ← 王五没有匹配部门，但左表数据仍保留
    ```

    **最常用的 JOIN 类型**，左表数据全部保留，右表无匹配则补 NULL。

=== "RIGHT JOIN（右表全保留）"

    ```sql
    SELECT e.name AS 员工, d.name AS 部门
      FROM emp e
      RIGHT JOIN dept d ON e.id = d.id;

    -- 结果：
    --  员工  │  部门
    ────────┼────────
    --  张三  │ 技术部
    --  李四  │ 市场部
    --  NULL  │ 财务部   ← 财务部没有匹配员工
    ```

    !!! info "RIGHT JOIN 可以改用 LEFT JOIN 实现"
        只需交换表的顺序即可：`dept LEFT JOIN emp` 等价于 `emp RIGHT JOIN dept`。多数开发者习惯只用 `LEFT JOIN`。

=== "FULL JOIN（全外连接）"

    ```sql
    SELECT e.name AS 员工, d.name AS 部门
      FROM emp e
      FULL JOIN dept d ON e.id = d.id;

    -- 结果：
    --  员工  │  部门
    ────────┼────────
    --  张三  │ 技术部
    --  李四  │ 市场部
    --  王五  │ NULL
    --  NULL  │ 财务部
    ```

    返回两表中**所有行**，不匹配的补 NULL。相当于 `LEFT JOIN` + `RIGHT JOIN` 的并集。

#### JOIN 方式速查

| JOIN 类型 | 左表保留 | 右表保留 | 不匹配时 | 场景 |
|-----------|---------|---------|---------|------|
| `INNER JOIN` | ❌ 只保留匹配 | ❌ 只保留匹配 | 丢弃 | 只需要双方都有的数据 |
| `LEFT JOIN` | ✅ 全保留 | ❌ 只保留匹配 | 右表补 NULL | **最常见**，主表全显示 |
| `RIGHT JOIN` | ❌ 只保留匹配 | ✅ 全保留 | 左表补 NULL | 少见，可被 LEFT JOIN 替代 |
| `FULL JOIN` | ✅ 全保留 | ✅ 全保留 | 双方都补 NULL | 需要两表全部数据 |

```sql
-- 实用技巧：用 LEFT JOIN 找出"在左表但不在右表"的数据
SELECT e.* FROM emp e
LEFT JOIN dept d ON e.id = d.id
WHERE d.id IS NULL;
-- 结果：王五（有员工但没有部门的）

-- 同理，FULL JOIN + WHERE 找出两表的"差集"
SELECT e.*, d.* FROM emp e
FULL JOIN dept d ON e.id = d.id
WHERE e.id IS NULL OR d.id IS NULL;
```

!!! warning "JOIN 的性能注意事项"

    - JOIN 查询一定要确保**关联字段有索引**（通常是主键或已建索引的外键）
    - 多表 JOIN 时尽量先用 WHERE 过滤再关联，减少中间结果集大小
    - `EXPLAIN ANALYZE` 是分析 JOIN 性能的利器

---

### 6.5 表关系设计总结

| 关系类型 | 实现方式 | 示例 | 中间表 |
|---------|---------|------|-------|
| **一对一 (1:1)** | 子表外键设为 PRIMARY KEY | users ↔ user_profiles | ❌ 不需要 |
| **一对多 (1:N)** | "多"的一方存"一"的一方的主键 | goddesses ↔ simps | ❌ 不需要 |
| **多对多 (M:N)** | 独立的中间表记录双方外键 | students ↔ memberships ↔ clubs | ✅ 需要 |

!!! tip "如何选择关系类型"

    问自己三个问题：

    1. A 的一条记录对应 B 的几条？ → 确定**基数**
    2. 这两张表的数据**更新频率**差异大吗？ → 决定是否分表（1:1 常用于垂直拆分）
    3. 我是否需要单独记录**关系本身的属性**？ → 决定中间表是否需要额外字段

---

## 七、索引

> 参考文档：[PostgreSQL 官方文档 — 索引](https://www.postgresql.org/docs/current/indexes.html)

在数据库中，索引就像字典的**拼音检字表**：没有它，查一个词得翻遍整本书（全表扫描）；有了它，直接定位到目标区域，效率提升几个数量级。

---

### 7.1 创建索引（核心实操）

#### 单列索引

```sql
-- 1. 创建演示表
CREATE TABLE cloud_files (
    id         BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    file_name  TEXT NOT NULL,
    file_type  VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 插入 100 万条模拟数据
INSERT INTO cloud_files (file_name, file_type)
SELECT
    'file_' || i || '.pdf',
    (ARRAY['video', 'image', 'doc'])[floor(random()*3)+1]
  FROM generate_series(1, 1000000) s(i);

-- 3. 【无索引前】全表扫描
EXPLAIN ANALYZE
SELECT * FROM cloud_files WHERE file_name = 'file_999999.pdf';
-- 输出: Seq Scan  (cost=0.00..183.00 rows=1 width=...)

-- 4. 创建 B-Tree 索引
CREATE INDEX idx_file_name ON cloud_files(file_name);

-- 5. 【有索引后】索引扫描，速度提升百倍
EXPLAIN ANALYZE
SELECT * FROM cloud_files WHERE file_name = 'file_999999.pdf';
-- 输出: Index Scan using idx_file_name  (cost=0.42..4.44 rows=1)
```

#### 索引类型一览

```sql
-- B-Tree（默认，最通用）
CREATE INDEX idx_name      ON cloud_files USING btree (file_name);

-- Hash（仅适用于 = 等值查询）
CREATE INDEX idx_name_hash ON cloud_files USING hash (file_name);

-- GIN（倒排索引，适合 数组/JSONB/全文搜索）
CREATE INDEX idx_tags ON cloud_files USING gin (tags);
CREATE INDEX idx_meta ON cloud_files USING gin (meta_data jsonb_path_ops);

-- GiST（适合 地理空间/范围类型/全文搜索）
CREATE INDEX idx_period ON room_bookings USING gist (period);

-- BRIN（适合 时序数据/天然有序的大表）
CREATE INDEX idx_created ON cloud_files USING brin (created_at);
```

#### 复合索引与唯一索引

```sql
-- 复合索引（最左匹配原则：必须从 user_id 开始查询才能用到）
CREATE INDEX idx_user_type ON cloud_files (user_id, file_type);

-- 唯一索引（防止重复，常用于文件指纹/MD5）
CREATE UNIQUE INDEX idx_file_md5 ON cloud_files (file_md5);
```

!!! tip "复合索引的"最左匹配"原则"
    索引 `(a, b, c)` 能用到索引的查询：
    
    - ✅ `WHERE a = 1`
    - ✅ `WHERE a = 1 AND b = 2`
    - ✅ `WHERE a = 1 AND b = 2 AND c = 3`
    - ✅ `WHERE a = 1 ORDER BY b`（排序也能用）
    - ❌ `WHERE b = 2`（跳过了 a，不走索引）

---

### 7.2 B-Tree vs B+Tree（与 MySQL 的核心差异）

这是 PostgreSQL 和 MySQL（InnoDB）在索引底层**最本质的区别**：

| 特性 | PostgreSQL B-Tree | MySQL InnoDB B+Tree |
|------|------------------|-------------------|
| **数据存放** | 叶子节点存 **CTID**（行指针），再通过 CTID 回表 | 叶子节点存 **完整行数据**（聚簇索引） |
| **聚簇性** | ❌ 非聚簇索引，表和索引分开存储 | ✅ 聚簇索引，数据和索引在一起 |
| **回表次数** | 每次走索引都要回表查堆表 | 聚簇索引无需回表，二级索引需回表 |
| **叶子节点链表** | ❌ 无链表，不支持区间直接跳转 | ✅ 叶子节点有双向链表，区间扫描极快 |
| **页大小** | 8KB（默认） | 16KB（默认） |

```text
PostgreSQL B-Tree                    MySQL InnoDB B+Tree
┌──────────────┐                    ┌──────────────┐
│   内节点       │   存 key + 指针     │   内节点       │  只存 key
│   key1 key2  │                    │   key1 key2  │
└──────┬───────┘                    └──────┬───────┘
       │                                   │
┌──────┴───────┐                    ┌──────┴───────┐
│   叶子节点     │  存 key + CTID     │   叶子节点     │  存 key + 完整行
│   key CTID   │                    │   key 行数据  │
│   ─────────  │                    │   ─────────  │
│   key CTID  │◄──────────────      │   key 行数据 │◄────► (双向链表)
│   key CTID  │  无叶子节点链表      │   key 行数据 │
└──────────────┘                    └──────────────┘
```

!!! info "这个差异意味着什么？"

    - PostgreSQL 的 B-Tree 是**标准的平衡树**，每次查找到叶子节点后，拿到 CTID（行指针），再去堆表（Heap）中读取实际数据
    - MySQL 的 B+Tree 的叶子节点有**双向链表**，且 InnoDB 的聚簇索引直接存行数据，所以**范围扫描**（`BETWEEN`、`>`、`<`）非常高效
    - PostgreSQL 的 MVCC 通过**堆表 + 死元组清理**实现，所以索引存 CTID 更灵活；MySQL 的 MVCC 通过 **undo log** 实现

---

### 7.3 索引的代价

天下没有免费的午餐，索引会带来三项开销：

| 代价 | 说明 |
|------|------|
| **磁盘空间** | 索引是一棵树，需要额外存储。一个 10GB 的表建满索引可能翻到 30GB |
| **写入性能** | `INSERT`/`UPDATE`/`DELETE` 时，数据库不但要改数据，还要同步更新每棵索引树 |
| **维护成本** | 频繁 DML 会产生索引碎片，偶尔需要 `REINDEX` 恢复性能 |

```sql
-- 查看当前表占用的空间（含索引）
SELECT
    pg_size_pretty(pg_total_relation_size('cloud_files')) AS 总大小,
    pg_size_pretty(pg_relation_size('cloud_files'))       AS 表大小,
    pg_size_pretty(pg_indexes_size('cloud_files'))        AS 索引大小;

-- 重建索引（清理碎片，不锁写）
REINDEX INDEX CONCURRENTLY idx_file_name;

-- 删除不再需要的索引
DROP INDEX idx_file_name;
```

---

### 7.4 索引失效的常见场景

| 场景 | 错误写法（走全表扫描） | 正确姿势 |
|------|----------------------|---------|
| **模糊查询左模糊** | `WHERE file_name LIKE '%file%'` | 只有 `LIKE 'file%'`（左前缀）能用索引 |
| **函数包裹字段** | `WHERE UPPER(file_name) = 'FILE.PDF'` | 建**函数索引**：`CREATE INDEX idx_upper ON cloud_files (UPPER(file_name))` |
| **隐式类型转换** | `WHERE id = '123'`（id 是数字） | 保持类型一致：`WHERE id = 123` |
| **复合索引跳列** | 索引 `(a, b)`，只查 `WHERE b = 1` | 复合索引必须**从最左侧开始匹配** |
| **OR 条件** | `WHERE name = 'a' OR age = 20` | 改为 `UNION ALL`，或建两个单列索引 |

!!! tip "PostgreSQL 的函数索引（Functional Index）"
    这是 PG 的一个强大特性——可以对**表达式的结果**建立索引，绕过函数包裹导致的索引失效：

    ```sql
    -- 对 UPPER 表达式建立索引
    CREATE INDEX idx_upper_name ON users (UPPER(name));

    -- 现在这个查询就能走索引了
    SELECT * FROM users WHERE UPPER(name) = 'ZHANGSAN';
    ```

    MySQL 需要生成虚拟列再加索引，PG 直接支持函数索引，简洁很多。