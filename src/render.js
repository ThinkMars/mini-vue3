// 构建虚拟DOM
export function h(tag, props, children) {
  return {
    tag,
    props,
    children
  }
}

// 将虚拟DOM绑定到执行节点上
export function mount(vnode, container) {
  const el = vnode.el = document.createElement(vnode.tag)

  // 处理下props的情况
  if (vnode.props) {
    for (const key in vnode.props) {
      const value = vnode.props[key]
      // // 假设都是内置属性
      // el.setAttribute(key, value)

      if (key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(), value)
      } else {
        el.setAttribute(key, value)
      }
    }
  }

  // 处理下children的情况,children 可能为字符串或者渲染函数数组
  if (vnode.children) {
    if (typeof vnode.children == "string") {
      el.textContent = vnode.children
    } else {
      vnode.children.forEach((child) => {
        mount(child, el)
      })
    }
  }

  container.appendChild(el)
}

// 对比新旧虚拟DOM，更新
export function patch(n1, n2) {
  // 1、如果两个节点标签一样
  if (n1.tag === n2.tag) {
    // 这里需要保存快照，实际上是同一个真实的DOM节点，我们会在这个节点上做更新操作，因为下一次，n2可能会变成旧节点
    const el = n2.el = n1.el
    // 2、比较props与更新
    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    // 2.1 查看新的props是否被更新，这里以新的为准
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        n1.el.setAttribute(key, newProps[key])
      }
    }
    // 2.2 对比数量，如果新的keys < 旧的keys，就可以把多余的旧key移除了
    for (const key in oldProps) {
      if (!(key in newProps)) {
        el.removeAttribute(key)
      }
    }

    // 3、比较children与更新
    const oldChildren = n1.children
    const newChildren = n2.children

    // 3.1 如果新的子节点是字符串，则直接更新
    if (typeof newChildren == 'string') {
      // 新 string  旧 string
      if (typeof oldChildren == "string") {
        // 这里比较下新旧是否一致，以减少DOM操作
        if (newChildren !== oldChildren) {
          el.textContent = newChildren
        }
      } else {
        // 新 string  旧 array
        // 这里解释下：使用textContent赋值后，如果el之前有子节点，那么所有的子节点会被新的文本节点替换掉。如果新设置的文本为空字符串，那么所有的子节点将被移除。
        el.textContent = newChildren
      }
    } else {
      // 新 array  旧 string
      if (typeof oldChildren == "string") {
        // 清空节点值，将数组挂载到此节点下即可
        el.innerHtml = ''
        newChildren.forEach((child) => {
          mount(child, el)
        })
      } else {
        // 新 array  旧 array

        // 处理公共区域部分
        const commonLength = Math.min(newChildren.length, oldChildren.length)

        // 首先把公共部分处理了，递归更新一遍
        for (let i = 0; i < commonLength; i++) {
          patch(oldChildren[i], newChildren[i])
        }

        // 此时剩下的节点都是未处理的，要么是新的节点未处理，要么是旧的节点未处理

        // 一样的，以新的节点为准，多于旧节点数量的的添加多余的新节点，少于旧节点数量的则删减多余的旧节点
        if (newChildren.length > oldChildren.length) {
          newChildren.slice(oldChildren.length).forEach((child) => {
            mount(child, el)
          })
        } else if (newChildren.length < oldChildren.length) {
          oldChildren.slice(newChildren.length).forEach((child) => {
            el.removeChild(child.el)
          })
        }
      }
    }
  } else {
    // node replace
  }
}
