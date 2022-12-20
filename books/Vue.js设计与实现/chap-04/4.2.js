/// chapter 4.3


// 用一个全局变量存储被注册的副作用函数
let activeEffect

// effect 函数用于注册副作用函数
function effect(fn) {
  // 当调用 effect 注册副作用函数时，将副作用函数 fn 赋值给 activeEffect
  activeEffect = fn
  // 执行副作用函数
  fn()
}

// 存储副作用函数的桶
const bucket = new WeakMap()

// 原始数据
const data = { text: 'hello world' }

// 对原始数据的代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    track(target, key)
    return target[key]
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal
    trigger(target, key)
  }
})

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
  if (!activeEffect) return

  // 根据 target 从 “桶” 中取得 depsMap，它也是一个 Map 类型：key -> effects
  let depsMap = bucket.get(target);
  // 如果不存在 depsMap，那么新建一个 Map 并与 target 关联
  if (!depsMap) {
    depsMap = new Map()
    bucket.set(target, depsMap)
  }
  // 在根据 key 从 depsMap 中取得 deps，它是一个 Set 类型
  // 里面存储着所有与当前 key 相关联的副作用函数：effects
  let deps = depsMap.get(key)
  // 如果 deps 不存在，同样新建一个 Set 并与 key 关联
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  // 最后将当前激活的副作用函数添加到“桶”里
  deps.add(activeEffect)
}

function trigger(target, key) {
  // 根据 target 从 桶中取得 depsMap，它是 key --> effects
  const depsMap = bucket.get(target)
  if (!depsMap) return

  const effects = depsMap.get(key)
  effects && effects.forEach(fn => fn())
}

effect(() => {
  console.log(obj.text)
})

// 1 秒后修改响应式数据
setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)
