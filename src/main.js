// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'

Vue.use(Vuex)

var myStore = new Vuex.Store({

// var myStore = new Vuex.createStore({
  state: {
    // 存放组件之间共享的数据
    name: 'Remi',
    age: '18'
  },

  mutations: {
    // 显式的更改state里的数据
  },
  getters: {
    // 过滤提取state数据
  },
  actions: {
    // 异步处理
  }
})
console.log('myStore:', myStore)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store: myStore,
  data: {
    // name: 'xiao'
  },
  mounted: function () {
    console.log('vue this: ', this)
  },
  computed: {
    name () {
      console.log('___this:', this)
      console.log('___this.$store:', this.$store)
      return this.$store.state.name
    }
  }
})

router.beforeEach((to, from, next) => {
  // 方案一：
  const token = localStorage.getItem('token')
  // 目标路由不是登录页，并且还需要token验证，还没有token，那就直接给返回到登录页
  if (to.name !== 'Login' && to.meta.authRequired && !token) {
    next({ name: 'Login' })
  } else {
    // 目标路由是登录页-自然不需要token验证
    // 或目标路由不需要身份验证
    // 又或目标路由非登录页，需要token验证，但是有token
    // next放行
    next() // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  }

  // 方案二：
  // console.log('to, from, next：', to, from, next)

  // const needLoginRoutesName = ['Shequ', 'News']
  // //  前端登录校验：登录成功时，后端生成token返回给前端，前端保存。后面每个请求前端都会带上（请求拦截器里加），后端每个请求
  // // 都会校验token是否有效或过期，并返回成功或失败。todo 看案例！
  // let isLogin = false // 是否登录  global.isLogin

  // // 未登录状态；当路由到nextRoute指定页时，跳转至login
  // if (needLoginRoutesName.indexOf(to.name) >= 0) {
  //   if (!isLogin) {
  //     router.push({ name: 'Login' })
  //   }
  // }
  // // 已登录状态；当路由到login时，跳转至home
  // if (to.name === 'Login') {
  //   if (isLogin) {
  //     router.push({ name: 'Home' })
  //   }
  // }
  // // todo next的使用
  // next()
})

// 全局后置钩子。
router.afterEach((to, from) => {
  // router.push({ name: 'Login' }) // 跳转login
})
