## Js 基础语法
### 01 变量与数据类型📦 

这是编程的基石。在 JavaScript 中，我们主要用 `let` 和 `const` 来存储数据。

- **`const`**: 用来声明一个**常量**。一旦声明，就不能再改变指向（推荐优先使用）。
- **`let`**: 用来声明一个变量。值可以被修改。

``` js
// --- 1. 变量声明 ---  
// const: 声明后不可重新赋值  
const username = "Alice";  
  
// let: 声明后可以重新赋值  
let age = 25;  
age = 26; // 这是合法的  
console.log(age); // 输出: 26  
  
// --- 2. 基本数据类型 ---  
// 字符串 (String)const message = "Hello World";  
const greeting = `你好, ${username}`; // 模板字符串，可以嵌入变量  
  
// 数字 (Number)// JS 中不区分整数和浮点数，统称 numberconst score = 100;  
const price = 99.99;  
  
// 布尔值 (Boolean)// 用来做判断，只有 true 或 falseconst isLogin = true;  
const isAdult = score >= 18; // 结果是 true  
// --- 3. typeof 操作符 ---// 用来检查变量的类型  
console.log(typeof username); // 输出: "string"  
console.log(typeof score); // 输出: "number"  
console.log(typeof isLogin); // 输出: "boolean"  
  
// --- 4. 特殊值 ---  
// null: 表示“空值”或“无”，需要手动赋值  
let car = null;  
console.log(car); // 输出: null  
  
// undefined: 表示“未定义”，变量声明了但没赋值  
let house;  
console.log(house); // 输出: undefined
```


### 02 模板字符串

**模板字符串**用反引号 \`\` 包裹，并用  `$ {}` 插入变量或表达式。

``` js
const user = {  
    name: "Alice",  
    age: 25,  
    hobbies: ["读书", "游泳"]  
};  
  
// --- 1. 基本插值 ---// 用 ${} 包裹变量或表达式  
const greeting = `你好，我是 ${user.name}，明年我就 ${user.age + 1} 岁了！`;  
console.log(greeting);  
// 输出: 你好，我是 Alice，明年我就 26 岁了！  
  
// --- 2. 多行文本 (保留换行) ---  
// 普通引号里换行会报错，或者必须用 \n// 模板字符串直接回车即可，格式完全保留  
const letter = `  
亲爱的 ${user.name}:  
  
    欢迎你加入我们的俱乐部。  
    你的兴趣爱好是: ${user.hobbies.join("、")}。  
  
祝好！  
`;  
console.log(letter);  
// 输出会是格式整齐的信件，保留了缩进和换行  
  
// --- 3. 逻辑运算 (三元表达式) ---  
// 可以在 ${} 里写简单的逻辑  
const status = `用户状态: ${user.age >= 18 ? "成年人" : "未成年人"}`;  
console.log(status); // 输出: 用户状态: 成年人  
  
```



### 03 逻辑控制与循环


几乎和 `java` 一样啊，太爽了，我真让 python 调坏了，真服了，每次写完 python 再写其他的，我左右脑都快打起来了....
``` python
if a:
	pass
elif b:
	pass
else:
	pass
```
#### 条件分支

``` js
// if else if else 结构
if (age > 10){  
    console.log("大于10")  
}else if(age > 15){  
    console.log("大于15")  
}else{  
    console.log("小于10")  
}

// 三元运算符
str = a > 10 ? "aaa" : "bbb"
```
#### 逻辑运算符

- `||` (或): 找**真**值。常用于设置**默认值**。
- `&&` (且): 找**假**值。常用于**条件执行**

#### 循环 `for`, `while`, `for...of`

```js
// for
for (let i = 10; i < 20; i ++){  
    console.log(i)  
}

// while
let i = 0  
while (i < 10){  
    i += 1  
    console.log(i)  
}

// for of java 的增强for for(var c : list) python 本身就是这样子 for c in list
const arr = [1,2,3,4,5]  
  
for(let i of arr){  
    console.log(i)  
}

```


- break ：立刻跳出整个循环
- continue：跳过本次循环，进入下一次


### 04 数组

 和 python 一样，数组是 [] ，这里就不得不提我 java 的 {} 了，真无敌

**初始化数组**

``` js
let arr = [1, 2, 3]
```

**添加，删除元素**

``` js
arr.push()  // python arr.append java(list，非静态数组) arr.add
arr.pop() # 删除并返回最后一个元素 // py arr.pop java list.removelast | first
// 这个很难记，参数: (起始位置, 删除几个, [插入的元素...])
arr.splice()
arr.splice(1, 0, 9); // 在索引1处，删除0个，插入9 -> [1, 9, 2, 3] 
arr.splice(1, 1); // 在索引1处，删除1个 -> [1, 2, 3]
```

**查找元素**

```js
arr.indexOf(2); // 返回索引: 1 
arr.includes(99); // 是否包含: false
```

**遍历与转换 (核心灵魂)**

``` js
const numbers = [1, 2, 3, 4, 5];  
const users = [  
    { name: "Alice", age: 25, active: true },  
    { name: "Bob", age: 30, active: false },  
    { name: "Charlie", age: 35, active: true }  
];  
  
// --- 1. map: 一一对应 (转换) ---  
// 场景: 把数字数组变成平方数组，或者把用户数组变成 JSX 列表  
const squares = numbers.map(n => n * n)  
// 结果: [2, 4, 6, 8, 10]  
console.log( squares)  
  
const names = users.map(user => user.name);  
// 结果: ["Alice", "Bob", "Charlie"]  
  
// --- 2. filter: 筛选 (过滤) ---  
// 场景: 找出所有成年人，或者所有激活状态的用户  
const evenNums = numbers.filter(n => n % 2 === 0);  
// 结果: [2, 4]  
  
const activeUsers = users.filter(user => user.active);  
// 结果: [{Alice}, {Charlie}]  
1  
// --- 3. find: 找一个 (立刻停止) ---  
// 场景: 登录验证，找特定 ID 的用户  
const bob = users.find(user => user.name === "Bob");  
// 结果: { name: "Bob", age: 30, active: false }  
// 注意: 找不到返回 undefined  
// --- 4. reduce: 归并 (汇总) ---  
// 场景: 求和，或者把数组转成对象  
const sum = numbers.reduce((accumulator, current) => {  
    return accumulator + current;  
}, 0); // 0 是初始值  
// 结果: 15  
```

**其他实用 API**

``` js
// --- forEach: 只是为了执行动作，没有返回值 ---
// 一般用来打印日志，或者修改 DOM
users.forEach(user => console.log(user.name));  
  
// --- some / every: 判断 ---
users.some(user => user.age > 30); // 有人大于30吗？ true
users.every(user => user.age > 18); // 所有人都大于18吗？ true 
 
// --- sort: 排序 (注意: 会改变原数组！) ---  
// 字符串排序  
["c", "a", "b"].sort(); // ["a", "b", "c"]  
  
// 数字排序 (需要传比较函数)  
[3, 1, 10].sort((a, b) => a - b); // [1, 3, 10]  
  
// --- slice: 截取 (不改变原数组) ---  
// 参数: (开始, 结束) 结束不包含  
const copy = numbers.slice(); // 全拷贝 (常用)  
const part = numbers.slice(1, 3); // [2, 3]
```

### 05 对象与解构赋值

对象由“键（key）”和“值（value）”组成。在 js 中，这对象怎么又是对象，又是字典的

``` js
console.log(stu['name']);  
console.log(stu.name);
```

1、**对象的创建和读取**

``` js
// --- 1. 创建与读取 ---
const user = {  
    name: "Alice",  
    age: 25,  
    // 嵌套对象  
    address: {  
        city: "Beijing",  
        zip: "100000"  
    }  
};  
  
// 点符号 (常用)  
console.log(user.name); // "Alice"  
console.log(user.address.city); // "Beijing"  
  
// 括号符号 (动态读取)  
const key = "age";  
console.log(user[key]); // 25 (相当于 user["age"])  
// --- 2. 修改与添加 ---
user.age = 26; // 修改已有  
user.job = "Engineer"; // 添加新属性  
  
// --- 3. 删除属性 ---
delete user.job; // 删除 job 属性
```


**2、对象的遍历**

for in 专门用来遍历现象，注意和 for of 区别开来

```js
for (let key in stu){  
    console.log(key, stu[key]);  
}

// --- 获取所有键/值 ---
console.log(Object.keys(stu)); 
console.log(Object.values(stu));
console.log(Object.entries(stu)); 
```

**3、Es6 解构赋值**

这是现代 JS 代码里出现频率极高的语法，用来“从对象或数组中提取数据”。

``` js
const product = {  
    title: "iPhone",  
    price: 999,  
    stock: 50,  
    // 嵌套  
    seller: {  
        name: "Apple Store",  
        level: 5  
    }  
};  
  
// --- 传统的取值方式 (太啰嗦) ---  
// const title = product.title;  
// const price = product.price;  
  
// --- 解构赋值 (优雅) ---  
// 声明变量名必须和属性名一致  
const { title, price } = product;  
console.log(title); // "iPhone"  
  
// --- 重命名变量 ---// 如果你想把 price 存到变量 p 中  
const { price: p } = product;  
console.log(p); // 999  
  
// --- 默认值 ---// 如果对象里没有 discount 属性，默认设为 0
const { discount = 0 } = product;  
console.log(discount); // 0  
  
// --- 嵌套解构 ---// 直接从 seller 对象里拿出 
levelconst { seller: { level } } = product;  
console.log(level); // 5
```

### 06 函数

#### 函数声明与表达式

``` js
// --- 函数声明 (Function Declaration) ---
// 这种写法会被“提升”(Hoisting)，可以在声明前调用  
function add(a, b) {  
    return a + b;  
}  
console.log(add(2, 3)); // 5  
  
// --- 函数表达式 (Function Expression) ---
// 将函数赋值给一个变量  
// 这种写法不会被提升，必须在赋值之后调用  
const subtract = function(a, b) {  
    return a - b;  
};  
console.log(subtract(5, 2)); // 3  
  
// --- 立即执行函数 (IIFE) - 了解即可 ---
// 声明的同时立刻执行  
(function() {  
    console.log("我立刻就执行了！");  
})();

// es 箭头函数
const add = (a, b) => a + b; // 单行，{} 和 return 可以省略
const f1 = (a, b, c) => {
	a += 10
	b += 10
	c += 10
	return a + b + c
}
```

#### this 关键字

- **普通函数**：`this` 指向**调用者**（谁调用它，`this` 就是谁）。这有时会导致在回调函数中 `this` 指向错误。

- **箭头函数**：没有自己的 `this`。它的 `this` 继承自**外层作用域**（定义时所在的上下文），这被称为“词法绑定”。

|类型|语法|适用场景|注意事项|
|:--|:--|:--|:--|
|函数声明|`function fn(){}`|普通工具函数，需要变量提升时|尽量用 `const` 替代|
|函数表达式|`const fn = function(){}`|回调、IIFE|不能在赋值前调用|
|箭头函数|`const fn = () => {}`|回调函数、对象方法 (需小心 `this`)、返回对象|没有 `this`、`arguments`，不能用作构造函数 (`new`)|
|默认参数|`(a=10) => {}`|参数有默认值时|简洁清晰|

- **优先使用箭头函数**：特别是在 `map`, `filter`, `setTimeout`, `addEventListener` 这些回调场景中，箭头函数能帮你省去 `var self = this` 的麻烦。

- **对象方法慎用箭头函数**：如果你需要在方法里用 `this` 指向对象本身，**不要**用箭头函数，用传统的 `method() {}` 写法。

- **默认参数很好用**：写组件或工具函数时，给可选参数设置默认值，能大大增加代码的健壮性。



### 07 异步编程

首先要明白：**JavaScript 是单线程的**。这意味着它同一时间只能做一件事。如果前面有个任务卡住了（比如读取大文件或网络请求），后面的任务就得一直干等着，页面就会“假死”。

**异步**就是为了解决这个问题而生的——它允许我们先去处理别的事情，等耗时操作完成了再回头处理结果。

#### 回调函数

这是最早期的解决方案。简单说就是“你先干别的，干完了回来调用我”。

``` js
let taskA = ()=>{  
    setTimeout(()=>{  
        console.log("代码不会被我阻塞")  
    }, 2000)  
    console.log("我不会被阻塞")  
}  
  
taskA()
```

虽然简单，且好理解，但是回调函数会造成回调地狱

#### Promise

ES6 引入了 `Promise`，这是异步编程的一大步。它把回调函数的写法变成了“链式调用”，解决了回调地狱的问题。

`Promise` 有三种状态：`pending`（进行中）、`fulfilled`（成功）、`rejected`（失败）。

``` js
const p1 = new Promise((resolve, reject) => {  
    setTimeout(() => {  
        const success = false  
        if (success){  
            resolve('成功')  
        }else{  
            reject('失败')  
        }  
    }, 1000)  
})  
  
p1  
    .then(resp =>{  
        console.log(resp)  
        return '成功' // 这里可以返回一个新的promise对象  
    })  
    .then(resp =>{  
        console.log(resp)  
  
        }  
  
    )  
    .catch(error => {  
        console.log(error)  
    })  
    .finally(() =>{  
        // 无论成功还是失败，都会执行  
        console.log('finally')  
    })
```


#### async/await

这是目前最主流、最推荐的写法。`async/await` 其实就是 `Promise` 的语法糖，它让我们可以用**写同步代码的风格**来写异步代码。

``` 
const p1 = new Promise((resolve, reject) => {  
    setTimeout(() => {  
        const success = true  
        if (success){  
            resolve('成功')  
        }else{  
            reject('失败')  
        }  
    }, 1000)  
})  
  
  
async function f1(){  
    try{  
        console.log("开始请求....")  
  
        // await 会暂停函数的执行，等待 Promise 完成  
        // 但不会阻塞整个线程，浏览器可以去干别的事  
        const result = await p1  
  
        console.log(result)  
        console.log("请求结束")  
  
    }catch (error){  
        console.log(error)  
    }  
}  
  
f1()
```

## Js 高级

### 01 axios

#### 简介

Axios 是一个基于 Promise 的 HTTP 客户端，用于浏览器和 Node.js 环境。

#### 安装

```
npm install axios
# 或
yarn add axios
# 或
pnpm add axios
```

#### 基本用法

**get 请求**

```js
// 基本 GET 请求
axios.get('/user?id=123')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// 带参数的 GET 请求
axios.get('/user', {
    params: {
      id: 123,
      name: 'John'
    }
  })
  .then(response => console.log(response.data));

// async/await 方式
async function getUser() {
  try {
    const response = await axios.get('/user', { params: { id: 123 } });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
```

**post请求**

```js
// 基本 POST 请求
axios.post('/user', {
    firstName: 'John',
    lastName: 'Doe'
  })
  .then(response => console.log(response.data));

// 带配置对象的 POST
axios.post('/user', {
    firstName: 'John',
    lastName: 'Doe'
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
```

**其他请求**

```js
axios.put('/user', { id: 1, name: 'New Name' });
axios.delete('/user', { params: { id: 123 } });
axios.patch('/user', { name: 'Updated' });
```

#### 创建 axios 示例

```js
const instance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  }
});

// 使用实例
instance.get('/user');
```

#### 拦截器

```js
// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 请求错误时做些什么
    return Promise.reject(error);
  }
);


// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data;
  },
  error => {
    // 对响应错误做点什么
    if (error.response.status === 401) {
      // 未授权，跳转登录
    }
    return Promise.reject(error);
  }
);

// 移除拦截器
const myInterceptor = axios.interceptors.request.use(/* ... */);
axios.interceptors.request.eject(myInterceptor);
```

#### 解决跨域

配置代理：方案一

vue-cli 构建的项目：

```js
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      // 凡是 /api 开头的请求，都会被代理
      '/api': {
        target: 'http://api.target.com', // 目标服务器地址
        changeOrigin: true, // 【核心】：是否改变请求来源，设为 true 才能绕过跨域
        pathRewrite: {
          '^/api': '' // 把路径中的 /api 去掉，比如 /api/user 变成 /user
        }
      }
    }
  }
}
```

Vite 构建的项目

```js
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://api.target.com', // 目标地址
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, '') // 路径重写
      }
    }
  }
}
```

#### 最佳实践

```
// src/utils/request.js
import axios from 'axios';

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
});

// 请求拦截器
request.interceptors.request.use(config => {
  // 添加 token
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(response => {
  return response.data;
}, error => {
  return Promise.reject(error);
});

export default request;
```



## Ts 基础语法

在 Vue 3 中，TS 主要用于约束 `props`、`ref`、`reactive` 以及函数的参数，确保代码在编写阶段就能发现错误。

```
import { type PersonInterface } from '@/types'。
```

为了导入不报错，做以下配置：（**`tsconfig.json`** and `tsconfig.app.json`）

```
{
  "compilerOptions": {
    "baseUrl": ".", 
    "paths": {   
      "@/*": ["src/*"] // 这里是核心
    }
  }
}
```

### 01 接口

接口用于定义**对象的结构**（外形）。在 Vue 中常用于定义用户信息、列表数据等模型。

```ts
export interface PersonInterface {
  id: string;
  name: string;
  age: number;
  gender?: string; // ? 表示可选属性
}
```

层级嵌套：

```
export interface GroupInterface {
  groupName: string;
  members: PersonInterface[]; // 数组中每一项都必须符合 PersonInterface
}
```

### 02 自定义类型

`type` 与 `interface` 相似，但它更灵活，可以定义**联合类型**或**原始类型的别名**。

```
type Status = 'loading' | 'success' | 'error';
let currentStatus: Status = 'loading'; // 只能从这三个字符串中选
# 自定义类型
type Persons = Array<xxx>
```

### 03 泛型

泛型是指在定义函数、接口或类时，**不预先指定具体类型**，而在使用时再指定类型。它像是一个“类型的占位符”。

```
// T 是一个占位符，代表未来的数据类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T; 
}

// 使用时指定具体的类型
const userRes: ApiResponse<PersonInterface> = {
  code: 200,
  message: 'ok',
  data: { id: '01', name: 'Vue', age: 10 }
};
```

