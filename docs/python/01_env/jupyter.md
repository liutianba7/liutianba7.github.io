# Pycharm 中集成 Jupyter

PyCharm Professional 内置 Jupyter Server，只需安装 `ipykernel` 即可运行 `.ipynb` 文件。

## 安装依赖

```bash
# 最轻量化方案
uv add ipykernel
```

## 配置步骤

1. 在 PyCharm 中打开 `.ipynb` 文件
2. 右上角选择 `Start Managed Server`
3. 选择项目的 `.venv` 作为解释器

完成！