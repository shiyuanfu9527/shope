<template>
  <div id="app">
    <MyHeader/>
    <router-view></router-view>
    <MyFooter v-show="$route.meta.show"></MyFooter>
  </div>
</template>

<script>
import MyHeader from './components/MyHeader'
import MyFooter from './components/MyFooter'
export default {
  name: 'App',
  components: {
    MyHeader,MyFooter
  },
  mounted(){
    //派发一个action||获取商品分类的三级列表的数据
    this.$store.dispatch("home/categoryList");
  }
}
</script>

<style>
</style>
