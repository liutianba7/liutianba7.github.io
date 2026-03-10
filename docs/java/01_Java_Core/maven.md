# Maven

## Maven 简介

在现代 Java 开发中，随着框架复杂度的提升，依赖管理的规模往往超出了人力可控的范围。Maven 作为一款项目管理和构建工具，其核心价值在于解决两大难题：**复杂的依赖管理**以及**标准化的项目构建**。

| **功能维度** | **痛点描述**                         | **Maven 解决方案**                           |
| ------------ | ------------------------------------ | -------------------------------------------- |
| **依赖管理** | 手动导入数百个 Jar 包，版本冲突频发  | 自动下载、依赖传递、版本冲突自动/手动调节    |
| **构建管理** | 环境不一致导致构建失败，缺乏统一标准 | 自动化编译、测试、打包、发布，构建过程规范化 |



## Maven  项目构建生命周期

构建是指将源码、资源、依赖转化为可部署应用的过程。Maven 通过生命周期管理，将复杂的步骤简化为简单的命令操作。

| **命令**      | **描述**                       |
| ------------- | ------------------------------ |
| `mvn clean`   | 清理 `target` 目录下的编译产物 |
| `mvn compile` | 执行编译过程                   |
| `mvn test`    | 运行单元测试                   |
| `mvn package` | 打包（生成 jar 或 war）        |
| `mvn install` | 将构建结果安装至本地仓库       |
| `mvn deploy`  | 将构建结果上传至远程私服       |

## Maven 工程结构与 GAVP 标识

Maven 工程通过 GAVP 属性进行唯一标识，这构成了 Maven 坐标系统的基础。

**GroupId**: 组织/公司标识（例如 `sun`），通常按域名倒序排列。

**ArtifactId**: 项目/模块名称（例如 `order-service`）。

**Version**: 版本号，遵循 `主版本.次版本.修订号` 规则（如 `1.0.0`）。

**Packaging**: 打包方式。`jar` 为默认 Java 项目；`war` 为 Web 项目；`pom` 专用于父工程，用于聚合或继承。

## Maven 依赖管理深度解析

通过 `scope` 标签控制 Jar 包在不同阶段的可用性，是管理项目 classpath 的关键。

| **范围**     | **编译阶段** | **测试阶段** | **运行阶段** | **典型应用**           |
| ------------ | ------------ | ------------ | ------------ | ---------------------- |
| **compile**  | 是           | 是           | 是           | Spring Core, log4j     |
| **test**     | 否           | 是           | 否           | JUnit                  |
| **provided** | 是           | 是           | 否           | Servlet API (容器提供) |
| **runtime**  | 否           | 是           | 是           | JDBC 驱动              |

## Maven 依赖下载失败

当 Maven 无法正常下载依赖时，不要陷入恐慌，通常只需遵循“**排查原因 -> 针对修复 -> 强制清理**”的路径即可解决。

#### 下载失败原因

（1）**网络与服务端**：网络不稳定、服务器宕机或仓库镜像无法连接。

（2）**配置与定义**：`pom.xml` 中 GAV（GroupId, ArtifactId, Version）定义错误或版本不存在。

（3）**本地环境污染**：本地仓库缓存损坏，或存在残留的 `lastUpdated` 文件阻碍了后续的重新下载。（主要是这个原因）

#### 解决方案

（1）检查网络连接和 Maven 仓库服务器状态。

（2）确保依赖项的版本号与项目对应的版本号匹配，并检查 POM 文件中的依赖项是否正确。

（3）清除本地 Maven 仓库缓存（lastUpdated 文件），因为只要存在lastupdated缓存文件，刷新也不会重新下载。本地仓库中，根据依赖的gav属性依次向下查找文件夹，最终删除内部的文件，刷新重新下载即可！

清除 lastupdated 文件脚本

```
cls 
   @ECHO OFF 
   SET CLEAR_PATH=D: 
   SET CLEAR_DIR=D:\maven-repository(本地仓库路径)
   color 0a 
   TITLE ClearLastUpdated For Windows 
   GOTO MENU 
   :MENU 
   CLS
   ECHO. 
   ECHO. * * * *  ClearLastUpdated For Windows  * * * * 
   ECHO. * * 
   ECHO. * 1 清理*.lastUpdated * 
   ECHO. * * 
   ECHO. * 2 查看*.lastUpdated * 
   ECHO. * * 
   ECHO. * 3 退 出 * 
   ECHO. * * 
   ECHO. * * * * * * * * * * * * * * * * * * * * * * * * 
   ECHO. 
   ECHO.请输入选择项目的序号： 
   set /p ID= 
   IF "%id%"=="1" GOTO cmd1 
   IF "%id%"=="2" GOTO cmd2 
   IF "%id%"=="3" EXIT 
   PAUSE 
   :cmd1 
   ECHO. 开始清理
   %CLEAR_PATH%
   cd %CLEAR_DIR%
   for /r %%i in (*.lastUpdated) do del %%i
   ECHO.OK 
   PAUSE 
   GOTO MENU 
   :cmd2 
   ECHO. 查看*.lastUpdated文件
   %CLEAR_PATH%
   cd %CLEAR_DIR%
   for /r %%i in (*.lastUpdated) do echo %%i
   ECHO.OK 
   PAUSE 
   GOTO MENU 
```



## Maven 依赖传递

Maven 具有极强的“传染性”。当我们项目 A 依赖项目 B，而 B 又依赖项目 C 时，Maven 会自动将 C 引入到 A 中，这就是**依赖传递**。

#### 依赖的边界规则

依赖并非无条件传递，它取决于依赖范围（Scope）的设置：

| **依赖范围 (Scope)** | **是否传递** | **说明**                                                     |
| -------------------- | ------------ | ------------------------------------------------------------ |
| **compile**          | **是**       | 默认值，全阶段可用，会传递给下游                             |
| **test / provided**  | **否**       | 仅在特定环境生效，不会传递，下游若需要需手动配置             |
| **optional**         | **否**       | 若在依赖中配置 `<optional>true</optional>`，则主动切断传递链 |

#### 依赖冲突管理

当一个项目中因传递依赖引入了**同一个 Jar 包的多个不同版本**时，就会发生依赖冲突。Maven 提供了一套成熟的“仲裁机制”来解决这一问题。

**自动选择规则（Maven 仲裁）**

当出现冲突时，Maven 遵循以下优先级（按顺序执行）：

**原则一：短路优先（Shortest Path First）**

路径越短的依赖版本越优先。例如 `A -> B -> C (v1.0)` 和 `A -> D -> E -> C (v2.0)`，Maven 会选择 `v1.0`。

**原则二：先声明优先（First Declaration First）**

如果路径长度一致，则在 `pom.xml` 中**先书写的依赖版本**优先被选中。

**人工介入：手动排除 (Exclusions)**

如果 Maven 自动仲裁的版本不符合业务需求（例如自动选择了旧版本导致功能缺失），我们可以强制排除特定的传递依赖。

```
<dependency>
  <groupId>com.atguigu.maven</groupId>
  <artifactId>pro01-maven-java</artifactId>
  <version>1.0-SNAPSHOT</version>
  <exclusions>
    <exclusion>
      <groupId>commons-logging</groupId>
      <artifactId>commons-logging</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

## Maven 继承

继承是指子工程通过 `<parent>` 标签，从父工程中继承配置信息。它是实现依赖管理版本统一的核心手段。

**父工程**：必须设置 `<packaging>pom</packaging>`，并使用 `<dependencyManagement>` 标签锁定依赖版本。

**子工程**：使用 `<parent>` 指定父坐标。引用依赖时可以**省略版本号**，直接由父工程决定。



## Maven 聚合

聚合是将多个松散的子工程组织在一起，通过父工程进行统一的构建和发布。

父工程通过 `<modules>` 标签列出所有需要管理的子模块。当对父工程执行构建命令（如 `mvn clean install`）时，Maven 会根据依赖关系自动计算构建顺序（即“反应堆 Reactor”）并一次性完成所有模块的构建。



## Maven 私服

私服（Repository Manager）作为企业内部的 Maven 仓库，主要用于代理外部远程仓库及存储内部私有构件。

当项目请求依赖时，顺序为：**本地仓库 -> 私服仓库 -> 远程仓库（中央仓库）**。
