import { getDep } from './dep.js'

// 新版用了proxy，耳熟能详了，此时关注如何收集依赖和触发更新
export function reactive(target) {
  return new Proxy(target, {

    get(target, key, receiver) {
      const dep = getDep(target, key)

      dep.depend()
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const dep = getDep(target, key)

      const result = Reflect.set(target, key, value, receiver)
      dep.notify()
      return result
    }
  })
}