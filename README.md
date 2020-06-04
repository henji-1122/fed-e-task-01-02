##### 简答题

1. 描述引用计数的工作原理和优缺点
* 答：引用计数的工作原理是：设置一个引用计数器计算当前对象的引用次数，用判断当前引用数是否为0来决定当前对象是不是一个垃圾对象，当某个对象的计数器为0时，GC开始工作，将其所在的对象空间释放和回收再使。当当前对象的引用关系(如当前对象被某个对象引用时，当前对象的引用计数就会+1，当取消引用时就会-1)改变时引用计数器就会修改当前对象的引用数值。
* 优点：a.因为可以根据计数器是否为0来判断是否为垃圾，所以发现垃圾就会立即回收；b.引用计数时刻监控引用对象，当内存有可能不足时就会立即释放空间，可最大限度减少程序的暂停。
* 缺点：a.无法回收循环引用的对象；b.引用计数需要维护一个数值的变化，引用计数器时刻监控当前对象的引用数值是否需要修改，修改这个数值需要时间，如果有很多的对象的引用计数都要修改时就会导致时间开销大。


2. 描述标记整理算法的工作流程
* 答：标记整理可以看做是标记清除的增强，在标记阶段遍历所有的对象，将当前的可达活动对象进行标记，在清除之前先进行整理操作，移动活动对象的位置使得他们在地址上连续，将非活动对象清除回收，这样回收后的地址就也是连续的，在后续的内存申请得到的也尽可能都是连续的空间，这样就可以最大化利用内存中释放出来的空间。


3. 描述V8中新生代存储区垃圾回收的流程
* 答：V8中新生代存储区垃圾回收过程采用复制算法和标记整理算法，新生代(指存活时间较短的对象)存储区分为From(使用空间)和To(空闲空间)两个等大的空间，在使用过程中先将对象存储在From空间中，当From空间使用到一定程度就会触发GC操作，此时采用标记整理算法将From空间中活动对象进行标记，并整理这些活动对象的位置使其连续不会产生碎片化的空间，再将这些标记整理后的活动对象拷贝到To空间，然后将From空间完全释放，最后将Form和To进行空间交换。另外在拷贝的过程中可能会出现晋升(某个变量所使用的空间在老生代也会出现，晋升就是将新生代对象移动至老生代)，如果新生代中的某个对象经过一轮GC后还存活就可以将其移动至老生代，或者在拷贝的过程中To空间的使用率超过25%，也需要将本次拷贝的活动对象移动至老生代。


4. 描述增量标记算法在何时使用，及工作原理
* 答：量标记算法在老生代垃圾回收时使用。当垃圾回收进行工作时会阻塞当前程序的执行，增量标记算法是将所有的垃圾回收操作拆分成多个小步进行，组合着完成垃圾回收过程，当程序执行完的空闲期进行遍历对象标记、垃圾清除，使得垃圾回收和程序执行交替进行，改变了之前程序执行时不能做垃圾回收，垃圾回收时不能运行程序的时间消耗的不足之处。



---
##### 代码题1
基于以下代码完成下面的四个练习
```javascript
// horsepower 马力  dollar_value价格  in_stock库存
const cars = [
	{ name: 'Ferrari FF', horsepower: 600, dollar_value: 700000, in_stock: true },
	{ name: 'Spyker C12', horsepower: 650, dollar_value: 648000, in_stock: false },
	{ name: 'JAGUAR xkr-s', horsepower: 550, dollar_value: 132000, in_stock: false },
	{ name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
	{ name: 'Aston Martin Onr-77', horsepower: 750, dollar_value: 185000, in_stock: true },
	{ name: 'Pagani Huayra', horsepower: 700, dollar_value: 130000, in_stock: false },
]
```
练习1. 使用函数组合fp.flowRight()重新实现下面这个函数

```javascript
let isLastInStock = function(cars){
    //获取最后一条数据
    let last_car = fp.last(cars)
    //获取最后一条数据的in_stock属性值
    return fp.prop('in_stock', last_car)
}

// 解答-------------------------------------------------------------->
// 重写 isLastInStock
const isLastInStock = fp.flowRight(fp.prop('in_stock'),fp.last)
console.log(isLastInStock(cars))

```


练习2. 使用fp.flowRight()、fp.prop()和fp.first()获取第一个car的name 

```javascript
const firstCarName = fp.flowRight(fp.prop('name'), fp.first)
console.log(firstCarName(cars))
```

练习3. 使用帮助函数_average重构averageDollarValue,使用函数组合的方式实现

```javascript
let _average = function(xs){
   fp.reduce(fp.add, 0, xs)/xs.length 
}
//<-无需改动

let averageDollarValue = function(cars){
    let dollar_values = fp.map(function(car){
        return car.dollar_value
    }, cars)
    return _average(dollar_values)
}



// 重构 averageDollarValue ------------------------------------>
// 方式1：
let newAverageDollarValue1 = fp.flowRight(_average, fp.map(car => car.dollar_value))
console.log( newAverageDollarValue1(cars))
// 方式2：
let newAverageDollarValue2 = fp.flowRight(_average,fp.map(fp.curry(fp.props)('dollar_value')))
console.log( newAverageDollarValue2(cars))
// 方式3：
let averageDollar = function(cars){
	 let dollar_values = fp.map(function(car){
		 return car.dollar_value
	 }, cars)
	return dollar_values
 }
function compose(f, g){
	return function(value){
		return f(g(value))
	}
}
const newAverageDollarValue3 = compose(_average,averageDollar)
console.log(newAverageDollarValue3(cars))


```

练习4. 使用flowRight写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式：sanitizeNames(["Hello World"])=>["hello_world"]

```javascript
let _underscore = fp.replace(/\W+/g,"_") //无需改动，在sanitizeNames中使用它


//解答------------------------------------------------------------>
//方法1：
let sanitizeNames = fp.flowRight(fp.toLower, fp.map(_underscore), fp.map(car => car.name))
console.log("sanitizeNames--->",sanitizeNames(cars))

//方法2：
let sanitizeNames2 = fp.flowRight(fp.toLower, fp.map(fp.flowRight(_underscore,car => car.name)))
console.log("sanitizeNames2--->",sanitizeNames2(cars))

//方法3：
let sanitizeNames3 = fp.map(item => ({
		...item,
		name:fp.flowRight(fp.toLower, _underscore)(item.name)
	}
))
console.log("sanitizeNames3--->",sanitizeNames3(cars))

//方法4：
let sanitizeNames4 = fp.map(item =>item.name = fp.flowRight(fp.toLower, _underscore)(item.name))
console.log("sanitizeNames4--->",sanitizeNames4(cars))

//方法5：
let sanitizeNames5 = fp.map(fp.flowRight(fp.toLower,_underscore,fp.prop('name')))
console.log("sanitizeNames5--->",sanitizeNames5(cars))
```





---
##### 代码题2
基于下面提供的代码，完成后续的四个练习：

```javascript
//support.js
class Container{
    static of(value){
        return new Container(value)
    }
    
    constructor(value){
        this._value = value
    }
    map(fn){
        return Container.of(fn(this._value))
    }
}

class Maybe{
    static of(x){
        return new Container(x)
    }
    
    isNothing(){
        return this._value === null || this._value===undefined
    }
    
    constructor(x){
        this._value = x
    }
    
    map(fn){
        return this.isNothing()?this:Container.of(fn(this._value))
    }
}

modeule.exports = {
    Maybe,
    Container
}

```
练习1. 使用fp.add(x,y)和fp.map(f,x)创建一个能让functor里的值增加的函数ex1

```javascript
const fp = require ('lodash/fp')
const {Maybe, Container} = require('./support')

let maybe = Maybe.of([5,6,1])
// let ex1 = //...你需要实现的位置

// 解答------>
let ex1 = maybe.map(x => fp.map(fp.add(1), x))
console.log("代码题2-1:ex1--->",ex1)
```



练习2. 实现一个函数ex2，能够使用fp.first获取列表的第一个元素

```javascript
const fp = require ('lodash/fp')
const {Maybe, Container} = require('./support')

let xs = Container.of(['do','ray','me','fa','so','la','ti','do'])
let ex2 = //...你需要实现的位置

//解答---------------------------------------->
// 方式1：
let ex2 = xs.map(x => fp.first(x))
console.log("代码题2-2:ex2--->",ex2)
// 方式2：
let ex2_2 = xs.map(fp.first)
console.log("代码题2-2:ex2_2--->",ex2_2)
```




练习3. 实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母

```javascript
const fp = require ('lodash/fp')
const {Maybe, Container} = require('./support')

let safeProp = fp.curry(function(x,o){
    return Maybe.of(o[x])
})
let user = {id:2, name:'Albert'}
let ex3 = //...你需要实现的位置


// 解答-------------------------------------->
let ex3 = fp.flowRight(fp.map(fp.first), safeProp('name'))
console.log(ex3(user))
```



练习4. 使用Maybe重写ex4，不要有if语句

```javascript
const fp = require ('lodash/fp')
const {Maybe, Container} = require('./support')

let ex4 = function(n){
    if(n){return parseInt(n)}
}

// 重写ex4---------------------------------------->
// 方式1：
let ex4 = fp.flowRight(fp.map(parseInt),Maybe.of)
console.log(ex4(1))
console.log(ex4(2.4))
console.log(ex4('111'))
console.log(ex4(null))
console.log(ex4(undefined))

// 方式2：
let ex4_2 = n => Maybe.of(n).map(parseInt)._value
console.log(ex4_2(1.8))
console.log(ex4_2(2.4))
console.log(ex4_2('111'))
console.log(ex4_2(null))
console.log(ex4_2(undefined))
```
