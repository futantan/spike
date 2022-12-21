/// chapter 4.4


// 用一个全局变量存储被注册的副作用函数
let activeEffect

// effect 函数用于注册副作用函数
function effect(fn) {
  const effectFn = () => {
    // 调用 cleanup 函数完成清除操作
    cleanup(effectFn)
    // 当 effectFn 执行时，将其设置为当前激活的副作用函数
    activeEffect = effectFn
    fn()
  }

  // activeEffect.deps 用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = []
  // 执行副作用函数
  effectFn()
}

// 存储副作用函数的桶
const bucket = new WeakMap()

// 原始数据
const data = { ok: true, text: 'hello world' }

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
  // 将其添加到 activeEffect.deps 中
  activeEffect.deps.push(deps)
}

function trigger(target, key) {
  // 根据 target 从 桶中取得 depsMap，它是 key --> effects
  const depsMap = bucket.get(target)
  if (!depsMap) return

  const effects = depsMap.get(key)

  // 这里重新用 Set 转换，是为了方式 delete 同时也 add 造成死循环
  const effectsToRun = new Set(effects)
  effectsToRun.forEach(fn => fn())
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    // deps 是依赖集合 Set
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

effect(() => {
  console.log(obj.ok ? obj.text : 'not')
})

// 1 秒后修改响应式数据
setTimeout(() => {
  obj.ok = false
  setTimeout(() => {
    obj.text = 'random'
  }, 1000)
}, 1000)

