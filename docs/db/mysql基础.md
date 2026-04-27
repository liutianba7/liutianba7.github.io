# mysql 基础

## 一、数据库基础

#### 1. 数据库语言类型

- 数据定义语言：简称DDL(Data Definition Language)，用来定义数据库对象：数据库，表，列等。关键字：create，alter，drop等

- 数据操作语言：简称DML(Data Manipulation Language)，用来对数据库中表的记录进行操作。关键字：insert，delete，update等

- 数据控制语言：简称DCL(Data Control Language)，用来定义数据库的访问权限和安全级别，及创建用户。

- 数据查询语言：简称DQL(Data Query Language)，用来查询数据库中表的记录。关键字：select，from，where等


#### 2. sql

``` 
1. sql语句以 ; 作为结尾
2. create table 后面的内容要以 () 来包裹，而不是{}
3. 变量名如果和 mysql 冲突了，用 `` 来包裹
```

##### 2.1 DDL

1. 数据库

``` sql
show databases;
create databases xxx;
use databasea;
drop databases xxx;
```


2. 表

``` sql
create table t_name(
	字段名 类型 [约束]
)

create table if not exists t_name(	
	id int primary key,
	...
	...
);

# 查看表
show tabels;
desc t_name;

# 删除表
drop table t_name;

# 修改表
alter table t_name [add | drop | modify | change]
remane table t_name to t_new_name

```


##### 2.2 DML

1. 新增数据

```sql
insert into t_name (field1, field2, ...) 
values
	(fa1, fa2, ...),
	(...)
	...
	(fa1, fa2);
```


2. 删除数据

``` sql
delete from t_name 
where 子条件
```

3. 修改数据

```sql
update t_name set field = x, field = x where 子条件
```

4. 查询数据

```sql
selete f1, f2, ... from t_name where 子条件
```

##### 2.3 DCL

	我们现在默认使用的都是root用户，超级管理员，拥有全部的权限。但是，一个公司里面的数据库服务器上面可能同时运行着很多个项目的数据库。所以，我们应该根据不同的项目建立不同的用户，分配不同的权限来管理和维护数据库。

1. 创建用户

``` sql
CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';

1.用户名:创建的用户名
2.主机名:指定该用户在哪个主机上可以登录,如果是本地用户,可以用'localhost',如果想让该用户可以任意远程主机登录,可以使用通配符%
3.密码:该用户登录的密码,密码可以为空,如果为空,该用户可以不输入密码就可以登录mysql
```

2. 授权用户

```sql 
GRANT 权限1, 权限2... ON 数据库名.表名 TO '用户名'@'主机名';

a.GRANT:授权关键字
b.授予用户的权限,比如  'select' 'insert' 'update'等,如果要授予所有的权限,使用 'ALL'
c.数据库名.表名:该用户操作哪个数据库的哪些表,如果要授予该用户对所有数据库和表的相关操作权限,就可以用*表示: *.*
d.'用户名'@'主机名':给哪个用户分配权限
```

```sql
eg:给user1用户分配对test这个数据库操作的权限
GRANT CREATE,ALTER,DROP,INSERT,UPDATE,DELETE,SELECT ON test.* TO 'user1'@'localhost';

eg:给user2用户分配对所有数据库操作的权限
grant all on test.* to 'user1'@ '%'
```

3. 撤销权限

``` sql
REVOKE  权限1, 权限2... ON 数据库.表名 FROM '用户名'@'主机名';

eg:撤销user1用户对test操作的权限
revoke all on test.* from 'user1' @ 'localhost'
```

4. 查看权限

``` mysql
SHOW GRANTS FOR '用户名'@'主机名';
```

5. 删除用户

``` sql
DROP USER '用户名'@'主机名';
```


6. 修改密码

``` sql
# 修改管理员密码
mysqladmin -uroot -p password 新密码  -- 新密码不需要加上引号
输入老密码
# 修改普通用户密码
1. 先登录
set password for '用户名'@'主机名' = password('新密码');
```


#### 3. 约束

```sql
# 第一种方式
create table if not exists t_name(
	tid int primary key
)

# 第二种方式:constraint域
CREATE TABLE category(
  cid INT,
  cname VARCHAR(10),
  cdesc VARCHAR(10),
  PRIMARY KEY (cid)
);

# 第三种方式
ALTER TABLE category ADD PRIMARY KEY (cid);

```

##### 3.1 主键约束

``` sql
# 正常
primary key

# 联合主键
CREATE TABLE person(
  xing VARCHAR(10),
  ming VARCHAR(10),
  age INT,
  sex VARCHAR(2),
  PRIMARY KEY (xing,ming)
);

# 删除主键约束
alter table drop primary key;
```


##### 3.2 自增长约束

``` sql
auto_increment
```

知识点：delete 与 truncat 的区别

| **特性**      | **DELETE FROM table_name [WHERE condition]**      | **TRUNCATE TABLE table_name**                                |
| ------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| **SQL 类型**  | **DML** (数据操作语言)                            | **DDL** (数据定义语言)                                       |
| **事务处理**  | 可以回滚 (**Rollback**)。每删除一行都会记录日志。 | 无法回滚。操作被视为一个整体的 DDL 事务。                    |
| **速度**      | 较慢。需要逐行删除并记录日志。                    | **极快。** 释放表占用的整个存储空间。                        |
| **WHERE子句** | **支持。** 可以根据条件删除部分数据。             | **不支持。** 只能删除表中的所有数据。                        |
| **自增ID**    | **不重置。** 下次插入时会继续使用旧的最大 ID 值。 | **重置。** 自增列（如 `AUTO_INCREMENT`）的值会被重置为起始值（通常是 1）。 |
| **操作方式**  | 逐行删除数据，并保留表结构和空间（直到被重用）。  | 释放整个表数据页，相当于重建了一个空表。                     |
| **触发器**    | 会触发 `DELETE` 相关的触发器。                    | 不会触发 `DELETE` 相关的触发器。                             |

##### 3.3 非空约束

``` sql
NOT NULL
注：不能为空指不能等于 NULL， 空串可以
```

##### 3.4 唯一约束

``` mysql
1.关键字:UNIQUE
2.特点:
  a.被unique修饰的列中的数据,必须是唯一的,不能重复
3.唯一约束和主键约束区别:
  a.一个表中只能有一个主键约束
  b.一个表中能有多个唯一约束
  c.主键约束可以代表一条数据,相当于人得身份证号
  d.唯一约束只能限制数据不重复,不能完全代表一条数据
```


#### 4. 数据库的备份与还原

备份：

```
mysqldump  -u用户名 -p密码 数据库名>生成的脚本文件路径
生成的脚本文件路径:指定备份的路径,写路径时最后要指明备份的sql文件名,命令后不要加;
```

还原：

```
mysql  -uroot  -p密码 数据库名 < 文件路径
注意:我们利用命令备份出来的sql文件中没有单独创建数据库的语句,所以如果利用命令去还原的话,需要我们自己手动先创建对应的库
    命令后不要加;
```

#### 5. 数据库三范式

依赖：知道了某个属性集的值，就能确定另一个属性集的值。

一范式：所有字段都是原子的，不可再分的

二范式：满足 1NF， 同时不存在非主属性对主键的部分依赖

三范式：满足 2NF， 并且不存在非主属之间的传递依赖

	表中的任何非主键字段都不能依赖于另一个非主键字段。它们必须直接依赖于主键。

## 二、单表查询

#### 1. 简单查询

``` sql
select * from t_name where ...;
# 给列起别名
select field1 as new_field_name ... 
```


#### 2. 条件查询

``` sql
select * from 表名 where 条件
select 列名,列名 from 表名 where 条件

比较运算符： > < >= <= = 
逻辑运算符： and or not
特殊运算符：in, not in, between ... and  ..., like, not like, is null, is not null
```

#### 3. 排序查询


``` sql
1.关键字: order by asc|desc

2.语法:
select 列名 from 表名 order by 排序列名 asc|desc

3.排序规则:
a.asc(默认):升序
b.desc:降序

4.问题:
先查询,还是先排序?   -> 先查询,查询出结果来,最后对结果进行排序
书写sql语句关键字的顺序
select 
from 
where 
group by 
having 
order by

执行顺序:
from 
where 
group by 
having 
select 
order by

先定位到要查询哪个表,然后根据什么条件去查,表确定好了,条件也确定好了,开始利用select查询
查询得出一个结果,在针对这个结果进行一个排序
```

#### 4. 聚合查询

``` sql
1.需要用到聚合函数
2.函数:对指定列的数据进行操作的 -> 纵向查询
3.聚合函数:
  count(*) 统计总记录数
  sum(列名) 对指定列求和
  avg(列名) 对指定列求平均值
  max(列名) 对指定列求最大值
  min(列名) 对指定列求最小值
```


#### 5. 分组查询

``` sql
select 聚合函数(列名) from 表名 group by 分组列 having 条件

where在分组查询之前执行
having在分组查询之后执行
```


#### 6. 分页查询

```
select * from 表名 limit m,n
```


## 三、多表查询

#### 1. 交叉查询

``` sql
select * from t_a, t_b
```


#### 2. 内连接查询

```sql 
inner join on  [inner 可以省略掉]

a.显示内连接:select 列名 from 表A join 表B on 条件 
b.隐式内连接:select 列名 from 表A,表B where 条件 
```

#### 3. 外连接

```
1.关键字:outer left|right join on -> outer可以省略
2.分类:
  a.左外连接: select 列名 from 表A left join 表B on 条件
  b.右外连接: select 列名 from 表A right join 表B on 条件
3.如何区分左表和右表呢?
  在join左边的就是左表
  在join右边的就是右表
4.左外连接,有外连接以及内连接的区别:
  a.左外连接:查询的是和右表的交集以及左表其他数据(未交集部分)
  b.右外连接:查询的是和左表的交集以及右表其他数据(未交集部分)
  c.内连接:只查询交集
```

#### 4. 全外连接

``` sql
SELECT * FROM category c LEFT JOIN products p ON c.`cid` = p.`category_id`
UNION
SELECT * FROM category c RIGHT JOIN products p ON c.`cid` = p.`category_id`;
```

#### 5. 子查询

``` sql
1.一条select语句作为另外一条select语句的条件使用

SELECT * FROM products WHERE category_id IN (SELECT cid FROM category WHERE cname IN ('家电','化妆品'));


2. 将一个select的查询结果作为一张伪表,和其他的表做多表联查
SELECT * FROM (SELECT * FROM category WHERE cname IN('家电','化妆品')) c,products p WHERE c.`cid` = p.`category_id`
```


## 四、MySql 常用函数

#### 1. 字符串函数

| 函数                                  | 用法                                          |
| ------------------------------------- | --------------------------------------------- |
| CONCAT(S1,S2,......,Sn)               | 连接S1,S2,......,Sn为一个字符串               |
| CONCAT_WS(separator, S1,S2,......,Sn) | 连接S1一直到Sn，并且中间以separator作为分隔符 |
| UPPER(s) 或 UCASE(s)                  | 将字符串s的所有字母转成大写字母               |
| LOWER(s) 或LCASE(s)                   | 将字符串s的所有字母转成小写字母               |
| TRIM(s)                               | 去掉字符串s开始与结尾的空格                   |
| SUBSTRING(s,index,len)                | 返回从字符串s的index位置其len个字符           |

#### 2. 数值函数

| 函数     | 用法                  |
| -------- | --------------------- |
| ABS(x)   | 返回x的绝对值         |
| CEIL(x)  | 返回大于x的最小整数值 |
| FLOOR(x) | 返回小于x的最大整数值 |
| RAND()   | 返回0~1的随机值       |
| POW(x,y) | 返回x的y次方          |

#### 3. 日期函数

| 函数                                                         | 用法                                                      |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| **CURDATE()** 或 CURRENT_DATE()                              | 返回当前日期 年月日                                       |
| **CURTIME()** 或 CURRENT_TIME()                              | 返回当前时间 时分秒                                       |
| **NOW()** / SYSDATE() / CURRENT_TIMESTAMP() / LOCALTIME() / LOCALTIMESTAMP() | 返回当前系统日期时间                                      |
| DATEDIFF(date1,date2) / TIMEDIFF(time1, time2)               | 返回date1 - date2的日期间隔 / 返回time1 - time2的时间间隔 |

#### 4. 流程函数

| 函数                                                         | 用法                                         |
| ------------------------------------------------------------ | -------------------------------------------- |
| IF(比较,t ,f) 里面的t和f是两个结果                           | 如果比较是真，返回t，否则返回f               |
| IFNULL(value1, value2)                                       | 如果value1不为空，返回value1，否则返回value2 |
| CASE WHEN 条件1 THEN result1 WHEN 条件2 THEN result2 .... [ELSE resultn] END | 相当于Java的if...else if...else...           |

``` sql
SELECT 
  uname,
  CASE
    WHEN age <= 12 
    THEN '儿童' 
    WHEN age <= 18 
    THEN '少年' 
    WHEN age <= 40 
    THEN '中年' 
    ELSE '老年' END age,
    sex 
FROM
  t_user ;
```

## 五、JDBC

JDBC技术中包含了以下四个对象：

1、DriverManager：驱动管理类

2、Connection接口：连接对象

3、Statement接口：执行sql语句

4、ResultSet接口：处理查询之后的结果集

#### 1. 使用方法

导入依赖

```
<dependency>  
    <groupId>mysql</groupId>  
    <artifactId>mysql-connector-java</artifactId>  
    <version>8.0.33</version>  
</dependency>
```

注册驱动 DriverManager

```
DriverManager.class
```

获取 connection 连接

``` java
// 2. 获取连接  
String url = "jdbc:mysql://localhost:3306/test?serverTimezone=UTC";  
String user = "root";  
String password = "liuqiang";  
  
Connection connection = DriverManager.getConnection(url, user, password);
```

执行sql语句 Statement

``` java
// 准备sql  
String sql = "insert into product (pname, pdesc) values ('南瓜', '好吃');";  
  
  
// 执行sql  
Statement statement = connection.createStatement();  
statement.executeUpdate(sql);
```

处理结果集 ResultSet

``` java
// 执行sql  
Statement statement = connection.createStatement();  
ResultSet resultSet = statement.executeQuery("select * from product");  
  
while (resultSet.next()) {  
    System.out.println("pid:" + resultSet.getInt(1));  
    System.out.println("pname:" + resultSet.getString(2));  
    System.out.println("pdesc:" + resultSet.getString(3));  
}  
  
// 3. 释放资源  
statement.close();  
connection.close();
```

#### 2. PreparedStatement

``` sql
1.概述:PreparedStatement是一个接口 -> 是 Statement接口的一个子接口
2.作用:防sql注入
3.特点:允许sql语句中用?,不是直接拼接字符串了,而是将值都用?占位,再单独为?赋值
4.获取:Connection中的方法
  PreparedStatement prepareStatement(String sql)  
5.此时写sql可以这么写:
  String sql = "select * from user where username = ? and password = ?"
6.为?赋值:PreparedStatement中的方法
  void setObject(int parameterIndex, Object x) -> 为指定的?赋值
                 parameterIndex:传递的是第几个? -> 1代表给第一个?赋值,2代表为第二个?赋值...
                 x:给?赋的具体的值
7.执行sql:
  int executeUpdate() 针对于增删改操作
  ResultSet executeQuery() 针对于查询操作      
```


``` java
public static void main(String[] args) throws ClassNotFoundException, SQLException {  
  
    // 1. 获取连接  
    Connection connection = JDBCUtils.getConnection();  
    System.out.println( connection);  
  
    // 执行sql  
    String sql = "select * from product where pid in (?, ?, ?)";  
    PreparedStatement preparedStatement = connection.prepareStatement(sql);  
  
    preparedStatement.setInt(1, 1);  
    preparedStatement.setInt(2, 2);  
    preparedStatement.setInt(3, 3);  
    ResultSet resultSet = preparedStatement.executeQuery();  
  
    while(resultSet.next()){  
        System.out.println(resultSet.getInt("pid"));  
        System.out.println(resultSet.getString("pname"));  
        System.out.println(resultSet.getString("pdesc"));  
    }  
  
    JDBCUtils.close(connection, preparedStatement, resultSet);  
  
}
```



## 六、事务以及连接池


#### 1. PreparedStatement 批量添加

``` sql
1.注意:
  a.mysql默认情况下不会批量添加,添加的时候都是一条一条添加的,我们这里所说的批量添加其实就是将多个要添加的数据先打包到内存,然后再将打包好的数据一起添加到数据库中,这样的话我们的效率会提高
  b.由于mysql默认情况下不会批量添加,所以我们想要进行批量添加的操作,需要手动开启此功能
2.怎么开启:需要在数据库url后面加入开启批量添加的参数-> rewriteBatchedStatements=true 
eg:jdbc:mysql://localhost:3306/241023_database3?rewriteBatchedStatements=true

3.方法:用到PreparedStatement中的方法:
  void addBatch() -> 将一组数据保存起来,给数据打包,放到内存中
  executeBatch() -> 将打包好的数据一起发送给mysql
```

#### 2. 连接池

```
1.问题描述:
  我们之前每个操作都需要先获取一条新的连接对象,用完之后就需要销毁,如果频繁的去创建连接对象,销毁连接对象,会耗费内存资源
      
2.解决:提前先准备好连接对象,放到一个容器中,然后来了操作直接从这个容器中拿连接对象,用完之后还回去,至于连接的生命周期交给连接池来管理，而不再是我们手动管理了。
```

**在 springboot 项目中的用法：**

1、先导入依赖（jdbc场景启动器以及 mysql 驱动）

``` xml
<!-- Spring Boot JDBC Starter（自动引入 HikariCP） -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>

<!-- MySQL 驱动（以 MySQL 为例） -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

**`starter` 的作用不是替代驱动，而是提供一套完整的、生产就绪的数据访问基础设施**，让开发者聚焦业务，而不是底层细节。

2、配置数据源以及连接池

```
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8
    username: root
    password: liuqiang
    driver-class-name: com.mysql.cj.jdbc.Driver

    # HikariCP 连接池配置（可选，有默认值）
    hikari:
      pool-name: MyHikariPool
      maximum-pool-size: 20          # 最大连接数（默认 10）
      minimum-idle: 5                # 最小空闲连接（默认同 maximum-pool-size）
      idle-timeout: 30000            # 空闲连接超时时间（毫秒），需小于 max-lifetime
      max-lifetime: 1800000          # 连接最大存活时间（毫秒），默认 30 分钟
      connection-timeout: 20000      # 获取连接超时时间（毫秒）
      auto-commit: true              # 是否自动提交
      connection-test-query: SELECT 1 # 检测连接是否有效的 SQL（MySQL 可用）
```

- 对于 **MySQL 8+**，`connection-test-query` 实际上**不需要**（Hikari 会用更高效的方式检测），但保留也无妨。
- 如果你用的是 **PostgreSQL、Oracle 等**，只需改 `url`、`driver-class-name` 和驱动依赖。

#### 3. 事务

##### 3.1 事务的概念

**事务（Transaction）** 是数据库管理系统（DBMS）中用于保证数据一致性和完整性的核心机制。它是一组**逻辑上不可分割的数据库操作**，这些操作要么**全部成功执行**，要么**全部不执行**，不会停留在中间状态。

| 特性                          | 全称        | 说明                                                         |
| ----------------------------- | ----------- | ------------------------------------------------------------ |
| **A - 原子性（Atomicity）**   | Atomicity   | 事务是一个原子单位，其中的操作“要么全做，要么全不做”。即使在执行过程中发生故障（如断电、异常），已执行的部分也会被回滚（Rollback），确保数据不处于半完成状态。 |
| **C - 一致性（Consistency）** | Consistency | 事务执行前后，数据库必须从一个**一致性状态**转移到另一个**一致性状态**。例如：转账操作中，A 账户减 100 元，B 账户加 100 元，总金额不变。 |
| **I - 隔离性（Isolation）**   | Isolation   | 多个并发事务之间互不干扰。一个事务的中间状态对其他事务不可见，防止脏读、不可重复读、幻读等问题。数据库通过**隔离级别**控制并发行为。 |
| **D - 持久性（Durability）**  | Durability  | 一旦事务提交（Commit），其对数据库的修改就是永久性的，即使系统崩溃也不会丢失。通常通过写入 redo log 等机制保证。 |

``` java
 @Test
    public void transfer(){
        Connection connection = null;
        try{
            QueryRunner qr = new QueryRunner();
            connection = DruidUtils.getConnection();
            //开启事务
            connection.setAutoCommit(false);
            String outMoney = "update account set money = money - ? where name = ?";
            String inMoney = "update account set money = money + ? where name = ?";
            qr.update(connection,outMoney,1000,"涛哥");

            System.out.println(1/0);

            qr.update(connection,inMoney,1000,"萌姐");
            //提交事务
            connection.commit();

            System.out.println("转账成功");
        }catch (Exception e){
            //回滚事务
            try {
                connection.rollback();
                System.out.println("转账失败");
            } catch (SQLException ex) {
                e.printStackTrace();
            }
            e.printStackTrace();
        }finally {
            DruidUtils.close(connection,null,null);
        }

    }
```

##### 3.2 ThreadLocal

**`ThreadLocal`** 是 Java 提供的一个线程局部变量（Thread-Local Variable）工具类，用于在**每个线程内部保存一份独立的变量副本**。不同线程之间的变量互不干扰，从而实现线程安全。

**`ThreadLocal` 不是“解决并发”的工具，而是“规避并发”的设计技巧** —— 通过让每个线程独占资源，从根本上避免竞争。

```
1.概述:容器
2.创建:
  ThreadLocal<E> 对象名 = new ThreadLocal<>()
3.方法:
  set(数据): 存数据
  get():取数据
  remove():清空ThreadLocal
4.注意:
  a.一次只能存储一个数据
  b.在一个线程中往ThreadLocal中存储数据,在其他线程中获取不到
  c.在同一个线程中往TheadLocal中存储的数据,在此线程的其他位置都能共享     
  d.如果往ThreadLocal中存储数据,当前线程会和值直接绑死,只能在当前线程中获取,其他线程中获取不到    
```

##### 3.3 隔离级别

数据库规范规定了4种隔离级别，分别用于描述两个事务并发的所有情况。

1、**read uncommitted** 读未提交，一个事务读到另一个事务没有提交的数据。

a)存在：3个问题（脏读、不可重复读、幻读）。

b)解决：0个问题

2、**read committed** 读已提交，一个事务读到另一个事务已经提交的数据。

a)存在：2个问题（不可重复读、虚读）。

b)解决：1个问题（脏读）

3、**repeatable read**:可重复读，在一个事务中读到的数据始终保持一致，无论另一个事务是否提交。

a)存在：1个问题（虚读）。

b)解决：2个问题（脏读、不可重复读）

4、**serializable 串行化**，同时只能执行一个事务，相当于事务中的单线程。

```
1. 脏读：一个事务读到了另一个事务未提交的数据.
2. 不可重复读：一个事务读到了另一个事务已经提交(update)的数据。引发另一个事务，在事务中的多次查询结果不一致。
3. 虚读 /幻读：一个事务读到了另一个事务已经提交(insert)的数据。导致另一个事务，在事务中多次查询的结果不一致。
```
