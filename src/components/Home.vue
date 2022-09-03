<template>
   <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>这个是home页面</h2>
    <!-- <button @click="jump">编程式点击跳转到About页面</button> -->
    <button @click="jump">编程式点击跳转到joePage页面</button>
   </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    jump () {
      // 可以是字符串 '/about/args' ，
      // this.$router.push('/about/args')
      // 也可以是一个json对象,this.$router.push({name: 'joePage', params: {id: '11'}, query: {plan: 'private'}});
      this.$router.push({name: 'joePage', params: {id: '11'}, query: {plan: 'private'}})
    }
  }
}
</script>
