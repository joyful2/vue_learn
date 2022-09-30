<template>
  <div class="joe-page">
    {{test}}
    <h2>这个是动态路由页面-- 用户ID {{ $route.params.id }}</h2>
    <h2>这个是动态路由页面- {{ $route.query }}</h2>
    store里的数据{{name}}
    <demo></demo>

  </div>
</template>

<script>
export default {
  name: 'joePage',
  data () {
    return {
      test: 'this is a demo by joe'
    }
  },
  mounted () {
    // console.log('---this:', this)
  },
  computed: {
    name () {
      console.log('---this:', this)
      // console.log('---store:', store)

      return this.$store.state.name
    }
  }
}
</script>

<style scoped>

</style>
