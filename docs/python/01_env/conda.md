# Conda 环境管理

## 一、Conda 简介

Conda 是一个开源的包管理系统和环境管理系统，支持多种语言。

### 1.1 安装方式

- **Anaconda**：完整发行版，包含大量科学计算包
- **Miniconda**：精简版，只包含 conda 和 Python

### 1.2 优势

- 独立的环境管理
- 跨平台支持
- 支持多语言（Python、R 等）

---

## 二、常用命令

### 2.1 环境管理

```bash
# 创建新环境
conda create -n myenv python=3.10

# 创建环境并指定多个包
conda create -n myenv python=3.10 numpy pandas

# 激活环境
conda activate myenv

# 退出环境
conda deactivate

# 列出所有环境
conda env list
conda info --envs

# 删除环境
conda remove -n myenv --all

# 克隆环境
conda create -n newenv --clone oldenv
```

### 2.2 包管理

```bash
# 安装包
conda install numpy
conda install numpy=1.24.0  # 指定版本

# 从指定 channel 安装
conda install -c conda-forge package_name

# 卸载包
conda remove numpy

# 更新包
conda update numpy
conda update --all  # 更新所有包

# 查看已安装的包
conda list

# 搜索包
conda search numpy
```

### 2.3 导出与导入环境

```bash
# 导出环境配置
conda env export > environment.yml

# 从配置文件创建环境
conda env create -f environment.yml

# 导出包列表（不含版本）
conda list --export > requirements.txt
```

---

## 三、配置优化

### 3.1 镜像源配置

```bash
# 查看当前配置
conda config --show

# 添加清华镜像源
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/

# 设置搜索时显示通道地址
conda config --set show_channel_urls yes

# 移除镜像源
conda config --remove channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
```

### 3.2 .condarc 配置文件

```yaml
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```

---

## 四、常见问题

### 4.1 环境激活失败

```bash
# 初始化 conda
conda init bash
conda init zsh
conda init powershell

# 重新打开终端后生效
```

### 4.2 包冲突解决

```bash
# 使用严格模式安装
conda install --strict-channel-priority package_name

# 使用 mamba 加速（更快地解决依赖）
conda install mamba -c conda-forge
mamba install package_name
```

---

## 五、最佳实践

1. **每个项目独立环境**：避免包冲突
2. **使用 environment.yml**：记录环境配置，便于复现
3. **定期清理缓存**：`conda clean --all`
4. **优先使用 conda-forge**：包更新更及时