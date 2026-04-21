# Pandas - 数据处理与分析

## 一、简介

Pandas 是 Python 最强大的数据分析库，提供 DataFrame 和 Series 两种核心数据结构。

### 1.1 安装

```bash
pip install pandas
```

### 1.2 导入约定

```python
import pandas as pd
import numpy as np
```

---

## 二、核心数据结构

### 2.1 Series（一维）

```python
# 创建 Series
s = pd.Series([1, 2, 3, 4, 5])
s = pd.Series([1, 2, 3], index=['a', 'b', 'c'])  # 自定义索引
s = pd.Series({'a': 1, 'b': 2, 'c': 3})          # 从字典创建

# 属性
s.values      # 值数组
s.index       # 索引
s.dtype       # 数据类型
s.shape       # 形状

# 常用操作
s.head(3)     # 前 3 个
s.tail(3)     # 后 3 个
s.describe()  # 统计描述
s.value_counts()  # 值计数
```

### 2.2 DataFrame（二维）

```python
# 创建 DataFrame
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['Beijing', 'Shanghai', 'Guangzhou']
})

# 从列表创建
df = pd.DataFrame([
    ['Alice', 25, 'Beijing'],
    ['Bob', 30, 'Shanghai']
], columns=['name', 'age', 'city'])

# 属性
df.shape        # (行数, 列数)
df.columns      # 列名
df.index        # 行索引
df.dtypes       # 各列数据类型
df.values       # NumPy 数组
df.info()       # 基本信息
df.describe()    # 统计描述
```

---

## 三、数据读取与写入

### 3.1 读取数据

```python
# CSV
df = pd.read_csv('data.csv')
df = pd.read_csv('data.csv', encoding='utf-8')
df = pd.read_csv('data.csv', sep='\t')           # TSV
df = pd.read_csv('data.csv', header=None)        # 无表头
df = pd.read_csv('data.csv', nrows=100)          # 只读前 100 行

# Excel
df = pd.read_excel('data.xlsx')
df = pd.read_excel('data.xlsx', sheet_name='Sheet2')  # 指定 sheet

# JSON
df = pd.read_json('data.json')
df = pd.read_json('data.json', orient='records')

# SQL
import sqlite3
conn = sqlite3.connect('database.db')
df = pd.read_sql('SELECT * FROM table', conn)

# 其他格式
df = pd.read_html('https://example.com/table.html')  # HTML 表格
df = pd.read_parquet('data.parquet')
df = pd.read_feather('data.feather')
```

### 3.2 写入数据

```python
# CSV
df.to_csv('output.csv', index=False)
df.to_csv('output.csv', encoding='utf-8-sig')  # Excel 兼容中文

# Excel
df.to_excel('output.xlsx', index=False)
df.to_excel('output.xlsx', sheet_name='MySheet')

# 多个 sheet
with pd.ExcelWriter('output.xlsx') as writer:
    df1.to_excel(writer, sheet_name='Sheet1')
    df2.to_excel(writer, sheet_name='Sheet2')

# JSON
df.to_json('output.json', orient='records', force_ascii=False)

# SQL
df.to_sql('table_name', conn, if_exists='replace', index=False)
```

---

## 四、数据选择与过滤

### 4.1 选择列

```python
# 单列（返回 Series）
df['name']
df.name

# 多列（返回 DataFrame）
df[['name', 'age']]

# 选择特定类型列
df.select_dtypes(include='number')
df.select_dtypes(exclude='object')
```

### 4.2 选择行

```python
# 按标签
df.loc[0]                    # 第一行
df.loc[0:2]                  # 前 3 行
df.loc[0, 'name']            # 特定单元格
df.loc[0:2, ['name', 'age']] # 特定行列

# 按位置
df.iloc[0]                   # 第一行
df.iloc[0:3]                 # 前 3 行
df.iloc[0, 0]                # 第一行第一列
df.iloc[0:3, 0:2]            # 前 3 行前 2 列

# 条件过滤
df[df['age'] > 25]
df[(df['age'] > 25) & (df['city'] == 'Beijing')]
df[df['name'].isin(['Alice', 'Bob'])]

# 查询语法
df.query('age > 25')
df.query('age > 25 and city == "Beijing"')
```

### 4.3 索引操作

```python
# 设置索引
df.set_index('name', inplace=True)

# 重置索引
df.reset_index(inplace=True)

# 修改索引名
df.index.name = 'id'

# 修改列名
df.rename(columns={'old_name': 'new_name'}, inplace=True)
df.columns = ['col1', 'col2', 'col3']
```

---

## 五、数据清洗

### 5.1 缺失值处理

```python
# 检查缺失值
df.isnull().sum()           # 每列缺失数量
df.isnull().any()           # 每列是否有缺失

# 删除缺失值
df.dropna()                 # 删除含缺失值的行
df.dropna(axis=1)           # 删除含缺失值的列
df.dropna(how='all')        # 只删除全为 NaN 的行
df.dropna(subset=['age'])   # 只考虑特定列

# 填充缺失值
df.fillna(0)                         # 用 0 填充
df.fillna({'age': 0, 'name': 'Unknown'})  # 不同列不同值
df.fillna(df.mean())                 # 用均值填充
df.fillna(method='ffill')            # 前向填充
df.fillna(method='bfill')            # 后向填充

# 插值
df.interpolate()
```

### 5.2 重复值处理

```python
# 检查重复
df.duplicated().sum()        # 重复行数
df.duplicated(subset=['name'])  # 特定列重复

# 删除重复
df.drop_duplicates()
df.drop_duplicates(subset=['name'])
df.drop_duplicates(keep='last')  # 保留最后一个
```

### 5.3 数据类型转换

```python
# 查看数据类型
df.dtypes

# 转换类型
df['age'] = df['age'].astype(int)
df['date'] = pd.to_datetime(df['date'])
df['price'] = pd.to_numeric(df['price'], errors='coerce')

# 分类类型
df['city'] = df['city'].astype('category')
```

### 5.4 字符串处理

```python
# 字符串方法
df['name'].str.lower()
df['name'].str.upper()
df['name'].str.strip()
df['name'].str.replace('a', 'b')
df['name'].str.contains('li')
df['name'].str.startswith('A')
df['name'].str.split(' ')
df['name'].str.len()

# 正则表达式
df['text'].str.extract(r'(\d+)')
df['text'].str.findall(r'\d+')
```

---

## 六、数据分析与聚合

### 6.1 基本统计

```python
# 统计函数
df.mean()
df.median()
df.std()
df.var()
df.sum()
df.count()
df.min()
df.max()

# 分位数
df.quantile(0.25)
df.quantile([0.25, 0.5, 0.75])

# 相关性
df.corr()
df.cov()
```

### 6.2 分组聚合

```python
# 基本分组
df.groupby('city').mean()
df.groupby('city')['age'].mean()

# 多列分组
df.groupby(['city', 'gender']).mean()

# 多种聚合
df.groupby('city').agg({
    'age': ['mean', 'max', 'min'],
    'name': 'count'
})

# 自定义聚合函数
df.groupby('city')['age'].agg(lambda x: x.max() - x.min())

# 分组后操作
grouped = df.groupby('city')
grouped.get_group('Beijing')
grouped.apply(lambda x: x.head(2))
```

### 6.3 数据透视表

```python
# 基本透视表
pd.pivot_table(df, values='age', index='city', columns='gender', aggfunc='mean')

# 多值多聚合
pd.pivot_table(df,
               values=['age', 'salary'],
               index='city',
               columns='gender',
               aggfunc={'age': 'mean', 'salary': 'sum'})

# 交叉表
pd.crosstab(df['city'], df['gender'])
```

---

## 七、数据变换

### 7.1 排序

```python
# 按值排序
df.sort_values('age')
df.sort_values(['city', 'age'], ascending=[True, False])

# 按索引排序
df.sort_index()
df.sort_index(axis=1)  # 按列名排序
```

### 7.2 数据映射

```python
# map（Series）
df['gender'] = df['gender'].map({'M': 'Male', 'F': 'Female'})

# apply（Series 或 DataFrame）
df['age'].apply(lambda x: x + 1)
df['name'].apply(len)
df.apply(sum)                      # 按列应用
df.apply(sum, axis=1)              # 按行应用

# applymap（DataFrame 每个元素）
df.applymap(str)
```

### 7.3 合并数据

```python
# concat
pd.concat([df1, df2])              # 垂直拼接
pd.concat([df1, df2], axis=1)      # 水平拼接
pd.concat([df1, df2], ignore_index=True)

# merge（类似 SQL JOIN）
pd.merge(df1, df2, on='id')                      # inner join
pd.merge(df1, df2, on='id', how='left')          # left join
pd.merge(df1, df2, on='id', how='right')         # right join
pd.merge(df1, df2, on='id', how='outer')         # full outer join

# join（基于索引）
df1.join(df2, lsuffix='_left', rsuffix='_right')
```

---

## 八、时间序列

```python
# 创建时间序列
dates = pd.date_range('2024-01-01', periods=10, freq='D')

# 转换为 datetime
df['date'] = pd.to_datetime(df['date'])

# 设置时间索引
df.set_index('date', inplace=True)

# 时间属性
df.index.year
df.index.month
df.index.day
df.index.dayofweek

# 重采样
df.resample('M').mean()      # 月均值
df.resample('W').sum()       # 周总和

# 滚动窗口
df.rolling(window=7).mean()  # 7 天移动平均
df.rolling(window=7).std()

# 时间偏移
df.shift(1)                  # 向后移 1 行
df.shift(-1)                 # 向前移 1 行
```