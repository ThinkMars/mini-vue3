import { mount, patch } from './render.js'
import { watchEffect } from './dep.js'

/**
 * 挂载APP
 */
export function mountApp(component, container) {
  let isMounted = false
  // 更新时，需要新旧DOM对比，所以需要保存下旧节点
  let preVdom
  watchEffect(() => {
    if (!isMounted) {
      preVdom = component.render()
      // 首次挂载
      mount(preVdom, container)
      isMounted = true
    } else {
      const newVdom = component.render()
      patch(preVdom, newVdom)

      // 赋值，下次就是旧的vdom了
      preVdom = newVdom
    }
  })
}