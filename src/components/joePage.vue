<template>
  <div class="joe-page">
    {{test}}
    <h2>这个是动态路由页面-- 用户ID {{ $route.params.id }}</h2>
    <h2>这个是动态路由页面- {{ $route.query }}</h2>

  </div>
</template>

<script>
export default {
  name: 'joePage',
  data () {
    return {
      test: 'this is a demo by joe'
    }
  }
}
</script>

<style scoped>

</style>
