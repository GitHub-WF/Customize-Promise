/* 
  自定义Promise函数模块-命名空间（IIFE）
*/
(function (window) {
  /* 
    Promise构造函数
    executor：执行器函数（同步执行）
  */
  function Promise(executor) {
    
  };
  /* 
    Promise原型对象方法
  */
  // then()方法
  // 指定成功或者失败的回调函数
  // 返回值为新promise对象
  Promise.prototype.then = function (onResolved, onRejected){

  };
  // catch()方法
  // 指定失败的回调函数
  // 返回值为新promise对象
  Promise.prototype.catch = function (onRejected) {
    
  };
  /* 
    Promise静态方法
  */
  // 返回指定value的成功状态promise
  Promise.resolve = function (value) {
    
  }
  // 返回指定reason的失败状态promise
  Promise.reject = function (reason) {
    
  }
  // all方法（所有promise成功才成功，传递成功数组，有一个失败则失败，传递单个失败值）
  Promise.all = function (promises) {
    
  }
  // race方法（返回一个promise，结果由第一个promise状态决定）
  Promise.race = function (promises) {
    
  }
  // 向外暴露Promise构造函数
  window.Promise = Promise;
})(window);