/**
 * 1. HOC的实现方式：属性代理和反向继承
 * 属性代理，可以操作props、定义声明周期、操作static、操作ref
 * 反向继承，继承原组件，并调用原组件的super.render， 可以操作原组件上的一切属性
 * 
 */

import React, { Component, ComponentType, ComponentClass } from 'react';

 export function proxyHoc (WrappedComponent: ComponentClass) {

    // 属性代理的方式
    // return class extends Component {
    //     render () {
    //         return <WrappedComponent {...this.props}/>
    //     }
    // }

    // 反向继承的方式
    return class extends WrappedComponent {
        render () {
            return super.render(); // 按照继承的规则，如果当前没有声明周期，可以使用this.componentDidMount来操作原组件上的声明周期
        }
    }
 }


 /**
  * HOC可以实现什么效果： 操作渲染过程（组合渲染、条件渲染) 、 获取ref、 状态管理（例如接管表单的双向绑定）、渲染劫持
  */

  function hoc2 (WrappedComponent: ComponentClass<{visible: boolean}>) {
    return class extends WrappedComponent {
        render () {
            return this.props.visible && super.render(); // 使用反向继承的方式进行属性代理
        }
    }
  }

  /**
   * HOC的使用方式： 高阶函数compose、Decorators
   */

   