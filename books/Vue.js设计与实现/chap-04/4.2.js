/// chapter 4.7


// 用一个全局变量存储当前激活的 effect 函数
let activeEffect

// effect 栈
const effectStack = []

// effect 函数用于注册副作用函数
function effect(fn, options = {}) {
  const effectFn = () => {
    // 调用 cleanup 函数完成清除操作
    cleanup(effectFn)
    // 当 effectFn 执行时，将其设置为当前激活的副作用函数
    activeEffect = effectFn
    // 在调用副作用函数之前将当前副作用函数压入栈中
    effectStack.push(activeEffect)
    fn()
    // 调用完副作用函数后，将其从栈中弹出，并把 activeEffect 还原为之前的值
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }

  // 将 options 挂载到 effectFn 上
  effectFn.options = options
  // activeEffect.deps 用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = []
  // 执行副作用函数
  effectFn()
}

// 存储副作用函数的桶
const bucket = new WeakMap()

// 原始数据
const data = { foo: 1}

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
  const effectsToRun = new Set()
  effects.forEach(effectFn => {
    // 如果 trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => {
    // 如果副作用函数有 scheduler 选项，则调用 scheduler 函数
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    // deps 是依赖集合 Set
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

// 定义一个任务队列, 注意这里的关键就是使用了 Set，从而做到了去重，让同一个 job 只会执行一次
const jobQueue = new Set()
// 使用 Promise.resolve() 创建一个 promise 实例，我们用它将一个任务添加到微任务队列中
const p = Promise.resolve()
// 一个标志代表是否正在刷新队列
let isFlushing = false
function flushJob() {
  // 如果队列正在刷新，则什么都不做
  if (isFlushing) return
  // 设置为 true，代表正在刷新队列
  isFlushing = true
  // 在微任务队列中刷新 jobQueue 队列
  p.then(() => {
    jobQueue.forEach(job => job())
  }).finally(() => {
    isFlushing = false;
  })
}

effect(
  () => {
    console.log(obj.foo);
  },
  {
    scheduler(fn) {
      // 每次调度时，将副作用函数添加到 jobQueue 队列中
      jobQueue.add(fn)
      // 调用 flushJob 刷新队列
      flushJob()
    },
  }
);


obj.foo++
obj.foo++
