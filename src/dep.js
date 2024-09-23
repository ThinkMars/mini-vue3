// reactivity
let activeEffect

// 这里使用WeakMap时为了在不使用这个对象后被回收掉,这个是全局的.WeakMap只能用对象作为key
const targetMap = new WeakMap()

// 事实上，data中的数据，每个key都会有一个依赖，读取和修改都有对应的响应式处理
export class Dep {
  subscribers = new Set()

  // 收集依赖，这个方法主要是用于副作用函数执行时，读取到本key，则进行收集依赖
  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect)
    }
  }

  // 触发依赖
  notify() {
    for (const effect of this.subscribers) {
      effect()
    }
  }
}

// ！！这个函数也能让原本不在对象的key实现新增响应式，因为响应式是对整个对象添加而不是在具体的key上添加
export function getDep(target, key) {
  // 获取对象的依赖表
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    // 如果没有，创建一个依赖表
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    // 每个表格，记录了key和dep的关系
    dep = new Dep()
    depsMap.set(key, dep)
  }

  return dep
}


// 这里会执行effect，然后收集依赖
export function watchEffect(effect) {
  activeEffect = effect
  effect()
  activeEffect = null
}