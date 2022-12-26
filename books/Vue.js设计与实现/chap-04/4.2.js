/// chapter 4.11


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
    const res = fn()
    // 调用完副作用函数后，将其从栈中弹出，并把 activeEffect 还原为之前的值
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return res
  }

  // 将 options 挂载到 effectFn 上
  effectFn.options = options
  // activeEffect.deps 用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = []
  // 只有非 lazy 的时候，才执行
  if (!options.lazy) {
    // 执行副作用函数
    effectFn()
  }

  // 将副作用函数作为返回值返回
  return effectFn
}

// 存储副作用函数的桶
const bucket = new WeakMap()

// 原始数据
const data = { foo: 1, bar: 2 }

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

function computed(getter) {
  // value 用来缓存上一次计算的值
  let value
  // dirty 标志，用来标识是否需要重新计算值，为 true 则意味着”脏“，需要计算
  let dirty = true

  // 把 getter 作为副作用函数，创建一个 lazy 的 effect
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true
        // 当计算属性依赖的响应式数据变化时，手动调用 trigger 函数触发响应
        trigger(obj, 'value')
      }
    }
  })

  const obj = {
    get value() {
      // 只有 dirty 为 true 时，才会重新计算值，并进行缓存
      if (dirty) {
        value = effectFn()
        // 将 dirty 设置为 false，下一次访问直接使用缓存到 value 中的值
        dirty = false
      }
      // 当读取 value 时，手动调用 track 函数进行追踪
      track(obj, 'value')
      return value
    }
  }

  return obj
}

// const sumRes = computed(() => {
//   console.log('in side effect')
//   return obj.foo + obj.bar
// })
// console.log(sumRes.value)
// console.log(sumRes.value)


function watch(source, cb, options = {}) {
  let getter

  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  let oldValue, newValue

  let cleanup
  function onInvalidate(fn) {
    cleanup = fn
  }

  const job = () => {
    newValue = effectFn()
    // 在调用回调函数之前，先调用 cleanup 函数
    if (cleanup) {
      cleanup()
    }
    // 当数据发生变化时，调用回调函数 cb
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }

  const effectFn = effect(
    () => getter(),
    {
      lazy: true,
      scheduler: () => {
        // 在调度函数中判断 flush 是否为 post，如果是，将其放到微任务队列中
        if (options.flush === 'post') {
          const p = Promise.resolve()
          p.then(job)
        } else {
          job()
        }
      }
    }
  )

  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}

function traverse(value, seen = new Set()) {
  // 如果要读取的数据是原始值，或者已经被读取过了，那么什么都不做
  if (typeof value !== 'object' || value === null || seen.has(value)) {
    return
  }
  // 将数据添加到 seen 中，代表遍历地读取过了，避免循环引用引起的死循环
  seen.add(value)
  // 赞不考虑数组等其他结构
  // 假设 value 就是一个对象，使用 for ... in 读取对象的每一个值，并递归地调用 traverse 进行处理
  for (const k in value) {
    traverse(value[k], seen)
  }
  return value
}

watch(
  () => obj.foo,
  (newVal, oldVal) => {
    console.log(newVal, oldVal);
  }
)

obj.foo++
