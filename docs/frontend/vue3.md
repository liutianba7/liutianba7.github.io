## Vue3 是什么？

Vue (读音 /vjuː/，类似于 **view**) 是一款用于构建用户界面的 **渐进式 JavaScript 框架**。

- **性能提升**：打包大小减少约 41%，初次渲染快 55%，内存占用减少 54%。
  
- **源码升级**：使用 TypeScript 重构，自带更好的类型推导。
  
- **核心特性**：拥抱 **Composition API（组合式 API）**，让逻辑复用变得极其简单。

## 创建 Vue3 工程

### 基于 vue-cli 创建

该种创建方式基于 Webpack，目前已处于维护模式，**不再推荐**用于新项目。

### 基于 vite 创建、

```
# 执行创建命令 
npm create vue@latest

# 按照提示选择配置（如 TS, Vue Router, Pinia 等）
```

Webpack 在启动时需要先抓取整个应用的依赖并构建；而 Vite 利用了浏览器原生的 **ES Modules**，只有在浏览器请求某个模块时才进行实时编译，实现“秒开”。

## Vue3 核心语法

### OptionsAPI 与 CompositionAPI

#### Options API 的弊端

`Options`类型的 `API`，数据、方法、计算属性等，是分散在：`data`、`methods`、`computed`中的，若想新增或者修改一个需求，就需要分别修改：`data`、`methods`、`computed`，不便于维护和复用。

<p align='center'>
    <img src="../assets/imgs/frontend/vue3/1696662197101-55d2b251-f6e5-47f4-b3f1-d8531bbf9279.gif" alt="1696662197101-55d2b251-f6e5-47f4-b3f1-d8531bbf9279" />
</p>


#### Composition API 的优势

可以用函数的方式，更加优雅的组织代码，让相关功能的代码更加有序的组织在一起。

 <p align='center'>
     <img src="../assets/imgs/frontend/vue3/1696662249851-db6403a1-acb5-481a-88e0-e1e34d2ef53a.gif" alt="1696662249851-db6403a1-acb5-481a-88e0-e1e34d2ef53a" />
 </p>


### 拉开序幕的 setup ⭐⭐⭐

#### setup 概述

`setup`是`Vue3`中一个新的配置项，值是一个函数，它是 `Composition API` **“表演的舞台**_**”**_，组件中所用到的：数据、方法、计算属性、监视......等等，均配置在`setup`中。

- `setup`函数返回的对象中的内容，可直接在模板中使用。

- `setup`中访问`this`是`undefined`。

- `setup`函数会在`beforeCreate`之前调用，它是“领先”所有钩子执行的。 

#### setup 的返回值

若返回一个**对象**：则对象中的：属性、方法等，在模板中均可以直接使用**（重点关注）。**

若返回一个**函数**：则可以自定义渲染内容，代码如下：

```jsx
setup(){
  return ()=> '你好啊！'
}
```

#### setup 与 Options Api 的关系

1、`Vue2` 的配置（`data`、`methos`......）中**可以访问到** `setup`中的属性、方法。

2、但在`setup`中**不能访问到**`Vue2`的配置（`data`、`methos`......）。

3、如果与`Vue2`冲突，则`setup`优先。

#### setup 语法糖

`setup`函数有一个语法糖，这个语法糖，可以让我们把`setup`独立出去，代码如下：

```js
<!-- 下面的写法是setup语法糖 -->
<script setup lang="ts">
  console.log(this) //undefined
  
  // 数据（注意：此时的name、age、tel都不是响应式数据）
  let name = '张三'
  let age = 18
  let tel = '13888888888'

  // 方法
  function changName(){
    name = '李四'//注意：此时这么修改name页面是不变化的
  }
  function changAge(){
    console.log(age)
    age += 1 //注意：此时这么修改age页面是不变化的
  }
  function showTel(){
    alert(tel)
  }
</script>
```

但是，用了上述的语法糖，我们就没法在这个 <script></script> 标签下配置当前组件的名称了，vue3 提供了 `defineOptions` 来让我们在 `setup` 里面配置其他组件属性。

```js
defineOptions({
  name: 'person1'
})
```


### ref 创建响应式数据 ⭐⭐

ref 不仅可以创建基本类型的响应式数据，还可以创建引用类型的响应式数据！

``` js
let a = ref('0')  
  
let person = ref<PersonInterface>({  
  id:"1",  
  name: '张三',  
  age: 18  
})
```

💡需要注意，ref 返回的是一个 `RefImpl` 类型的对象，在 Js 中操作数据，需要 .value

💡若`ref`接收的是对象类型，内部其实也是调用了`reactive`函数。

### reactive 创建响应式数据 ⭐⭐


reactive 只能创建对象类型的响应式数据，它的返回值是一个 `Proxy` 实例对象

``` ts
let p = reactive<PersonInterface>({  
  id: "1",  
  name: '张三',  
  age: 18  
})
```

### ref 与 reactive 的对比 ⭐⭐

从宏观角度来看，ref 用来定义基本 + 对象数据类型的响应式数据，而 reactive 用来定义对象数据类型的响应式数据。

在 Js 中，如果操作 ref 定义的数据，需要 .value，而 reactive 不需要。

**使用原则**

1、若需要一个基本类型的响应式数据，必须使用`ref`

2、若需要一个响应式对象，层级不深，`ref`、`reactive`都可以。
    
3、若需要一个响应式对象，且层级较深，推荐使用`reactive`

### toRefs 与 toRef

它们是用来将一个响应式对象中的每一个属性，转换为`ref`对象。只不过 torefs 是批量转换，而 toRef 每次只转一个。

```js
let price = toRef(car, "price")  

let {a, b} = toRefs(car)
```

### computed ⭐⭐⭐

根据已有数据计算出新数据（和`Vue2`中的`computed`作用一致）。新数据本质还是 ref 产生的响应式数据类型。`ComputedRefImpl`

计算属性是只读属性，当它以来的属性发生变化时，会自动的重新计算，如果没发生变化，则用之前已经算出来的值。

``` js
<script setup lang="ts">  
  import {computed, ref} from "vue";  
  let firstName = ref("zhang");  
  let lastName = ref("san");  
  
  let fullName = computed(  
      {  
        get() {  
          return firstName.value + " " + lastName.value;  
        },  
        set(value) {  
          let names = value.split(" ");  
          firstName.value = names[0];  
          lastName.value = names[1];  
        }  
      }  
  )  
  console.log(fullName);  
</script>
```



### watch⭐⭐

watch 是用来监视数据的变化，在数据变化的时候执行函数，在 Vue3 中，watch 能够监听下面这四种数据

1、ref 定义的响应式数据

2、reactive 定义的响应式数据

3、函数返回的一个值

4、包含上前类型的一个数据



#### watch 监听情况一

监视`ref`定义的【基本类型】数据：直接写数据名即可，监视的是其`value`值的改变。

```js
let sum = ref(0)
watch(sum, (newValue, oldValue) => {
  console.log(newValue, oldValue)
})
```

#### watch 监听情况二

监视`ref`定义的【对象类型】数据：直接写数据名，监视的是对象的【地址值】，若想监视对象内部的数据，要手动开启深度监视。

```
let person = ref({
  name: "张三",
  age: 18
})
  // 开始深度监听，任何属性或者地址发生变化，都能监听到
  // 当前监听的是整个person对象，不关心person.name和person.age的变化，如果想要监听属性的变化，需要开启深度监听
  /*
  * 参数一：监听的数据源
  * 参数二：监听的回调（新值，旧值） 如果修改的是对象的属性，则新值和旧值都是同一个对象，所以是一样的，但如果想改了整个对象，则新值和旧值是不同的
  * 参数三：监听的配置项（对象）{deep:true, immediate...等等}
  * */
  watch(person, (newValue, oldValue) => {
    console.log(newValue, oldValue)
  }, {deep:true})

```

#### watch 监听情况三

监视`reactive`定义的【对象类型】数据，且默认开启了深度监视。

```js
  let person = reactive({
    name: "张三",
    age: 18
  })
   /*
  情况三：watch 监听的是一个 reactive 定义的对象类型响应式数据，默认开始深度监听
  * */
  watch(person, (newValue, oldValue) => {
    console.log(newValue, oldValue)
  })
```

#### watch 监听情况四

监视`ref`或`reactive`定义的【对象类型】数据中的**某个属性**，注意点如下：

1、若该属性值**不是**【对象类型】，需要写成函数形式。

2、若该属性值是**依然**是【对象类型】，可直接编，也可写成函数，建议写成函数。

结论：监视的要是对象里的属性，那么最好写函数式，注意点：若是对象监视的是地址值，需要关注对象内部，需要手动开启深度监视。

```js
  /*
   * 情况四：我现在只想监听对象中的特定的属性（非对象），而非所有属性 --> function
   * 如果监听的是对象中的一个对象，此时可以是函数返回了，可以直接监听，但要注意，如果直接监听的话，监听不到整个对象的变化
   * 所以，无论是基本类型，还是对象类型，单个监听的时候都推荐写成 function
  * */
  watch(()=>person.car, (newValue, oldValue) => {
    console.log(newValue, oldValue)
  },{deep:true} )


```

#### watch 监听情况五

监视上述的多个数据

```js
  /*
   * 情况五：我现在想同时监听多个数据源：[fun1, fun2, ref1, reactive1]
  * */
  watch([()=>person.name, ()=>person.car], (newValue, oldValue) => {
    console.log(newValue, oldValue)
  },{deep:true} )
```



### watchEffect

官网：立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行该函数。

其实，watchEffect 才是神！watch 需要我们显示给出要监听什么数据，而在 watchEffect 中，我们直接写逻辑即可，在逻辑中，用到了什么数据，就监听什么数据。

```js
 // 用watch实现，需要明确的指出要监视：temp、height
  watch([temp,height],(value)=>{
    // 从value中获取最新的temp值、height值
    const [newTemp,newHeight] = value
    // 室温达到50℃，或水位达到20cm，立刻联系服务器
    if(newTemp >= 50 || newHeight >= 20){
      console.log('联系服务器')
    }
  })

  // 用watchEffect实现，不用
  const stopWtach = watchEffect(()=>{
    // 室温达到50℃，或水位达到20cm，立刻联系服务器
    if(temp.value >= 50 || height.value >= 20){
      console.log(document.getElementById('demo')?.innerText)
      console.log('联系服务器')
    }
    // 水温达到100，或水位达到50，取消监视
    if(temp.value === 100 || height.value === 50){
      console.log('清理了')
      stopWtach()
    }
  })
```

### 标签中的 ref 属性

标签中的 ref 属性用于注册模板的引用（其实就是 dom | 组件实例的引用）

* 用在普通`DOM`标签上，获取的是`DOM`节点。

* 用在组件标签上，获取的是组件实例对象。

```js
    <div class="person">
        <h2 ref="title2">前端</h2>
        <h3 ref="title3">Vue</h3>
        <button @click="showLog">点我打印内容</button>
    </div>
  
    let title1 = ref()
    let title2 = ref()
    let title3 = ref()

    // 通过ref获取元素
    console.log(title1.value)
    console.log(title2.value)
    console.log(title3.value)

```

### props

Props 是插件化、组件化开发的核心。父组件通过 **属性** 向子组件传递数据，子组件通过 **声明** 来接收。

```js
// 基础用法
const props = defineProps(['list', 'title'])
// ts 写法
import { type PersonInterface } from "@/types"

// 使用接口定义 Props
defineProps<{
  list: PersonInterface[],
  title?: string // 加问号表示可选
}>()

```

下面是带默认值的写法，需要借助编译器宏 `withDefaults`

```js
let props = withDefaults(defineProps<{
  list?:Persons
}>(), {
  list:()=>{
    return [
      {
        id: "1",
        name: "张三",
        age: 18
      },
      {
        id: "2",
        name: "李四",
        age: 20
      }
    ]
  }
})
```

