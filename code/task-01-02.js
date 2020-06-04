// 代码题1=========================================================

const fp = require ('lodash/fp')
// 基于以下代码完成下面的四个练习
const cars = [
	{ name: 'Ferrari FF', horsepower: 600, dollar_value: 700000, in_stock: true },
	{ name: 'Spyker C12', horsepower: 650, dollar_value: 648000, in_stock: false },
	{ name: 'JAGUAR xkr-s', horsepower: 550, dollar_value: 132000, in_stock: false },
	{ name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
	{ name: 'Aston Martin Onr-77', horsepower: 750, dollar_value: 185000, in_stock: true },
	{ name: 'Pagani Huayra', horsepower: 700, dollar_value: 130000, in_stock: false },
]

// 练习1. 使用函数组合fp.flowRight()重新实现下面这个函数
// let isLastInStock = function(cars){
//     //获取最后一条数据
//     let last_car = fp.last(cars)
//     //获取最后一条数据的in_stock属性值
//     return fp.prop('in_stock', last_car)
// }
//重写-------------------------------------------------------->
const isLastInStock = fp.flowRight(fp.prop('in_stock'),fp.last)
console.log(isLastInStock(cars))



//练习2. 使用fp.flowRight()、fp.prop()和fp.first()获取第一个car的name
const firstCarName = fp.flowRight(fp.prop('name'), fp.first)
console.log(firstCarName(cars))


//练习3. 使用帮助函数_average重构averageDollarValue,使用函数组合的方式实现
let _average = function(xs){
	return fp.reduce(fp.add, 0, xs)/xs.length 
 }
 //<-无需改动
 
 let averageDollarValue = function(cars){
	 let dollar_values = fp.map(function(car){
		 return car.dollar_value
	 }, cars)
	return _average(dollar_values)
 }

 //重构averageDollarValue ------------------------------------>
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



// 练习4. 使用flowRight写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式：sanitizeNames(["Hello World"])=>["hello_world"]
let _underscore = fp.replace(/\W+/g,"_")
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









// 代码题2=========================================================
// 练习1. 使用fp.add(x,y)和fp.map(f,x)创建一个能让functor里的值增加的函数ex1
const {Maybe, Container} = require('./support')

let maybe = Maybe.of([5,6,1])
//...你需要实现的位置

// 解答------>
let ex1 = maybe.map(x => fp.map(fp.add(1), x))
console.log("代码题2-1:ex1--->",ex1)


// 练习2. 实现一个函数ex2，能够使用fp.first获取列表的第一个元素
let xs = Container.of(['do','ray','me','fa','so','la','ti','do'])
// let ex2 = //...你需要实现的位置

//解答---------------------------------------->
// 方式1：
let ex2 = xs.map(x => fp.first(x))
console.log("代码题2-2:ex2--->",ex2)
// 方式2：
let ex2_2 = xs.map(fp.first)
console.log("代码题2-2:ex2_2--->",ex2_2)



// 练习3. 实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母
let safeProp = fp.curry(function(x,o){
    return Maybe.of(o[x])
})
let user = {id:2, name:'Albert'}
console.log(safeProp('name',user)._value)
// let ex3 = //...你需要实现的位置

// 解答-------------------------------------->
let ex3 = fp.flowRight(fp.map(fp.first), safeProp('name'))
console.log(ex3(user))





// 练习4. 使用Maybe重写ex4，不要有if语句
// let ex4 = function(n){
//     if(n){return parseInt(n)}
// }

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