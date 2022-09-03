<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <NavHeader></NavHeader>
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>

  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'

export default {
  name: 'App',
  components: { NavHeader }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.fade-enter-active, .fade-leave-active{
 transition: all .3s;
}
.fade-enter, .fade-leave-to{
 opacity: 0;
}

</style>
