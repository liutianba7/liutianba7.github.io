# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **MkDocs-based personal technical blog** hosted on GitHub Pages. The blog contains:
- Technical notes on Java, Python, Frontend technologies
- Interview preparation materials (八股文 - common interview questions)
- Middleware documentation (MySQL, Redis, MinIO)
- Tools documentation (Git, Docker, Linux)

## Build Commands

```bash
# Install dependencies (if not already installed)
pip install mkdocs-material

# Serve locally with hot reload for development
mkdocs serve --livereload

# Build static site to 'site' directory
mkdocs build

# Deploy to GitHub Pages
mkdocs gh-deploy
```

## Project Structure

```
myBlog/
├── mkdocs.yml          # Main configuration file
├── docs/               # All markdown content
│   ├── index.md        # Homepage
│   ├── assets/         # Images and static assets
│   │   └── imgs/       # Organized by topic (spring/, frontend/, middleware/, etc.)
│   ├── javascripts/    # Custom JS (MathJax config, reading-progress)
│   ├── stylesheets/    # Custom CSS (extra.css)
│   ├── java/           # Java notes
│   │   ├── 01_Java_Core/    # Core Java (maven, juc)
│   │   └── 02_Frameworks/   # Spring frameworks (ssm, springboot)
│   ├── python/         # Python notes
│   │   ├── 01_env/          # Environment (conda, uv, jupyter)
│   │   ├── 02_basic/        # Python basics
│   │   ├── 03_others/       # Libraries (requests, pandas, numpy, pytest)
│   │   ├── 04_web/          # Web frameworks (fastapi)
│   │   └── 05_ai/           # AI/ML (langchain, pytorch)
│   ├── frontend/       # Frontend notes (js, vue2, vue3)
│   ├── code-notes/     # Code snippets and examples
│   │   ├── java/            # Java code (concurrent, design-patterns)
│   │   ├── python/          # Python code (ai)
│   │   └── algorithm/       # Algorithm templates
│   ├── interview/      # Interview materials (八股文)
│   │   ├── index.md         # 复习路线
│   │   ├── java/            # Java 八股
│   │   ├── database/        # 数据库八股 (mysql, redis)
│   │   └── middleware/      # 中间件八股 (es, rmq, seata)
│   ├── middleware/     # Middleware (mysql, redis, minio)
│   ├── tools/          # Dev tools (git, docker)
│   └── linux/          # Linux notes
└── site/               # Generated static site (gitignored in deployment)
```

## Key Configuration (mkdocs.yml)

- **Theme**: Material with Chinese language support (`language: zh`)
- **Features**: Navigation tabs, search with suggestions and highlight, code copy button, dark/light mode toggle, back-to-top button
- **Markdown Extensions**: attr_list, md_in_html, admonition, pymdownx.details, pymdownx.superfences, emoji, arithmatex (math formulas)
- **Math Support**: MathJax configured via `docs/javascripts/mathjax.js`
- **Custom Styling**: `docs/stylesheets/extra.css` for additional CSS
- **Reading Progress**: `docs/javascripts/reading-progress.js` for progress bar

## Content Conventions

- **Image paths**: Use relative paths like `../../assets/imgs/<category>/<image>.png`
- **Chinese content**: Most content is in Chinese
- **Navigation**: Defined in `mkdocs.yml` under the `nav:` section
- **URLs**: `use_directory_urls: false` for cleaner URLs

## Adding New Content

1. Create markdown file in appropriate subdirectory under `docs/`
2. Add images to `docs/assets/imgs/<category>/`
3. Update `mkdocs.yml` nav section to include the new page
4. Run `mkdocs serve` to preview changes locally

## Deployment

The site is deployed to GitHub Pages at `https://liutianba7.github.io`. Use `mkdocs gh-deploy` to push the built site to the gh-pages branch.

## Author Profile

- **Name**: 留白 (liutianba7)
- **Role**: AI Application Engineer | Full-Stack Developer
- **Tech Stack**: Java (Spring Boot/Cloud), Python (LangChain, FastAPI), Frontend (Vue.js), Cloud-Native (Docker, K8s)

## Knowledge Base Summary

### Programming Languages
- **Java**: Core, Collections, JUC (concurrency), JVM
- **Python**: Core, standard library, decorators, generators, metaclasses
- **JavaScript/TypeScript**: ES6+, Promise, async/await, TypeScript generics

### Frameworks & Libraries
- **Java**: Spring, Spring MVC, Spring Boot, Spring Cloud, MyBatis
- **Python**: LangChain, LangGraph, FastAPI, PyTorch, requests, pytest, loguru
- **Frontend**: Vue 2, Vue 3 (Composition API), Pinia, Vue Router, Vite
- **AI/LLM**: RAG pipeline, Agent patterns (ReAct, A2A), Tool Calling, MCP protocol, Prompt Engineering

### Databases & Middleware
- **MySQL**: Architecture, InnoDB, indexes, transactions, MVCC, locks, performance tuning
- **Redis**: Data types, persistence, high availability, cache patterns, distributed locks
- **Elasticsearch**: Inverted index, DSL, distributed architecture
- **RabbitMQ**: Reliability, idempotency, delayed messages, dead letter queues
- **Seata**: Distributed transactions (AT, XA, TCC modes)
- **MinIO**: S3-compatible object storage

### Tools & DevOps
- **Git**: Branching, merging, Conventional Commits
- **Docker**: Dockerfile, Docker Compose, container orchestration
- **Linux**: System administration, shell commands, service management
- **Maven**: Dependency management, build lifecycle, multi-module projects