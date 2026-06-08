---
title: SpringBoot实现大文件分片上传
description: 在这填写文章摘要（一句话总结）
date: 2026-06-07
authors: liutianba7
categories:
  - Java
tags:
  - 分片上传
  - SpringBoot
---

# SpringBoot实现大文件分片上传

> 一句话概括本文要解决的问题和核心方案。

## 需求背景

<!--
  描述业务场景：为什么要做这个？
  痛点是什么？直接告诉读者这篇文章能解决什么问题。
-->

## 技术方案

<!--
  整体架构设计思路，不需要太细，讲清核心逻辑即可。
  可以用 Mermaid 画个简图辅助理解（MkDocs 支持，CSDN 不支持的话手动截个图）。
-->

> **核心思路**：将大文件切分为多个小分片，逐个上传，最后合并。支持断点续传和并发上传。

### 关键参数

| 参数 | 说明 | 建议值 |
|------|------|--------|
| 分片大小 | 每个分片的大小 | 5MB |
| 最大并发数 | 同时上传的分片数 | 3~5 |

## 核心代码

<!-- 代码只起演示作用，把核心逻辑讲清楚就行，不用面面俱到。 -->

### 1. 前端分片

```js
// 核心思想：将 File 对象按固定大小切块
const CHUNK_SIZE = 5 * 1024 * 1024;

function createChunks(file) {
  const chunks = [];
  for (let start = 0; start < file.size; start += CHUNK_SIZE) {
    chunks.push(file.slice(start, start + CHUNK_SIZE));
  }
  return chunks;
}
```

### 2. 后端接收分片

```java
@PostMapping("/chunk")
public ResponseEntity<Void> uploadChunk(
    @RequestParam("file") MultipartFile file,
    @RequestParam("index") int index,
    @RequestParam("total") int total,
    @RequestParam("filename") String filename) throws IOException {

    // 每个分片按序号存为临时文件
    String uploadId = md5(filename);
    Path dir = Path.of("/tmp", uploadId);
    Files.createDirectories(dir);
    file.transferTo(dir.resolve(String.valueOf(index)).toFile());

    return ResponseEntity.ok().build();
}
```

### 3. 合并分片

```java
@PostMapping("/merge")
public ResponseEntity<String> merge(
    @RequestParam("uploadId") String uploadId,
    @RequestParam("filename") String filename) throws IOException {

    Path dir = Path.of("/tmp", uploadId);
    Path output = Path.of("/uploads", filename);

    // 按序号读取所有分片，依次写入同一个文件
    try (FileOutputStream fos = new FileOutputStream(output.toFile());
         FileChannel dest = fos.getChannel()) {

        Files.list(dir)
            .sorted(Comparator.comparingInt(p -> Integer.parseInt(p.getFileName().toString())))
            .forEach(chunk -> {
                try (FileChannel src = new FileInputStream(chunk.toFile()).getChannel()) {
                    dest.transferFrom(src, dest.size(), src.size());
                }
            });
    }

    // 清理临时分片
    deleteDirectory(dir);

    return ResponseEntity.ok(output.toString());
}
```

## 踩坑记录

> **Warning**：并发上传时，分片到达顺序不可控。解决：用分片序号命名文件，合并前排序。
>
> **Warning**：合并后务必清理临时分片，否则磁盘空间很快被占满。

