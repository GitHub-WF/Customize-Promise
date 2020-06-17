/* 
  自定义Promise函数模块-命名空间（IIFE）
*/
(function (window) {
  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'
  /* 
    Promise构造函数
    executor：执行器函数（同步执行）
  */
  function Promise(executor) {
    let _this = this
    this.status = PENDING // 给promise对象指定status属性，初始值为pending
    this.data = undefined // 给每个promise对象指定用于存储结果数据的属性
    this.callbacks = [] // 每个元素结构{onResolved(){}, onRejected(){}}
    function resolve(value) {
      // 如果当前状态不是pending，直接结束
      if (_this.status !== PENDING) return false
      // 将状态改为resolved
      _this.status = RESOLVED
      // 保存value数据
      _this.data = value
      // 如果有待执行的callback函数，立即异步执行回调函数onResolved()
      if (_this.callbacks.length > 0) {
        setTimeout(() => {
          _this.callbacks.forEach(callbackObj => {
            callbackObj.onResolved(value)
          })
        }, 0)
      }
    }
    function reject(reason) {
      // 如果当前状态不是pending，直接结束
      if (_this.status !== PENDING) return false
      // 将状态改为rejected
      _this.status = REJECTED
      // 保存value数据
      _this.data = reason
      // 如果有待执行的callback函数，立即异步执行回调函数onRejected()
      if (_this.callbacks.length > 0) {
        setTimeout(() => {
          _this.callbacks.forEach(callbackObj => {
            callbackObj.onRejected(reason)
          })
        }, 0)
      }
    }
    // 立即同步执行executor
    try {
      executor(resolve, reject)
    } catch (error) { // 如果执行器抛出异常，promise对象变为rejected
      reject(error)
    }
  }
  /* 
    Promise原型对象方法
  */
  // then()方法
  // 指定成功或者失败的回调函数
  // 返回值为新promise对象
  Promise.prototype.then = function (onResolved, onRejected){
    // 处理未定义回调
    // 如果未传入onResolved，直接向下传递value，也就是成功状态promise
    onResolved = typeof onResolved === 'function' ? onResolved : value => value
    // 如果未传入onRejected，直接向下传递reason，也就是失败状态promise，实现异常传透
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason}

    let _this = this
    // then()的返回值是一个新的promise对象
    return new Promise((resolve, reject) => {
      // 调用指定的回调函数处理，并返回不同的promise状态
      function handle(callback) {
        /* 
          1.如果回调抛出异常，则then返回失败状态的promise，reason是error
          2.如果回调返回非promise，则then返回成功状态的promise，value是回调返回值
          3.如果回调返回promise，则根据promise的状态和值改变then返回promise状态和值
        */
        try {
          const result = callback(_this.data)
          if (result instanceof Promise) { // 第三种，回调返回promise
            // result.then(
            //   value => resolve(value), // 当传入result的promise为成功状态，返回的promise也是成功状态
            //   reason => reject(reason) // 当传入result的promise为失败状态，返回的promise也是失败状态
            // )
            result.then(resolve, reject)
          } else { // 第二种，回调返回非promise
            resolve(result)
          }
        } catch (error) { // 第一种，抛出异常
          reject(error)
        }
      }
      // 判断上一个promise对象的状态是否已经确定，没确定保存，确定立即执行回调
      if (_this.status === RESOLVED) { // resolved状态，异步执行onResolved()，并改变返回promise状态
        setTimeout(() => {
          handle(onResolved)
        }, 0)
        
      } else if (_this.status === REJECTED) { // rejected状态，异步执行onRejected()，并改变返回promise状态
        setTimeout(() => {
          handle(onRejected)
        }, 0)
      } else {
        // 当前状态是pending状态，将回调函数保存起来
        _this.callbacks.push({
          onResolved(value) {
            handle(onResolved)
          },
          onRejected(reason) {
            handle(onRejected)
          }
        })
      }
    })
  }
  // catch()方法
  // 指定失败的回调函数
  // 返回值为新promise对象
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
  }
  /* 
    Promise静态方法
  */
  // 返回指定value的成功状态promise
  Promise.resolve = function (value) {
    // 根据不同的value，返回不同状态的promise
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        // value.then(
        //   value => resolve(value),
        //   value => reject(value)
        // )
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
  }
  // 返回指定reason的失败状态promise
  Promise.reject = function (reason) {
    // 返回失败的promise
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }
  // all方法（所有promise成功才成功，传递成功数组，有一个失败则失败状态，传递单个失败值）
  Promise.all = function (promises) {
    
  }
  // race方法（返回一个promise，结果由第一个promise状态决定）
  Promise.race = function (promises) {
    
  }
  // 向外暴露Promise构造函数
  window.Promise = Promise
})(window)