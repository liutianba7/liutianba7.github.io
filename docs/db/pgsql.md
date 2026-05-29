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
