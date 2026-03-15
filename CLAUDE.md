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
│   ├── javascripts/    # Custom JS (MathJax config)
│   ├── java/           # Java notes
│   │   ├── 01_Java_Core/    # Core Java (maven, juc)
│   │   └── 02_Frameworks/   # Spring frameworks (ssm, springboot)
│   ├── python/         # Python notes (Ai/, Web/)
│   ├── frontend/       # Frontend notes (js, vue2, vue3)
│   ├── interview/      # Interview materials
│   │   └── points/     # Individual topic files
│   ├── middleware/     # Middleware (mysql, redis, minio)
│   ├── tools/          # Dev tools (git, docker)
│   └── linux/          # Linux notes
└── site/               # Generated static site (gitignored in deployment)
```

## Key Configuration (mkdocs.yml)

- **Theme**: Material with Chinese language support (`language: zh`)
- **Features**: Navigation tabs, search with suggestions, code copy button, dark/light mode toggle
- **Markdown Extensions**: attr_list, md_in_html, admonition, pymdownx.details, pymdownx.superfences, emoji, arithmatex (math formulas)
- **Math Support**: MathJax configured via `docs/javascripts/mathjax.js`

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