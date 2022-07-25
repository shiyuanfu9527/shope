<template>
  <div>
      <!-- 三级联动全局组件：三级联动已经注册喂全局组件，因此不需要在引入 -->
      <TypeNav/>
      <ListContainer/>
      <Recommend/>
      <Rank/>
      <Like/>
      <Floor v-for="(floor,index) in floorlist" :key="floor.id" :list="floor"/>
      <Brand/>
  </div>
</template>

<script>
//引入其余的组件
import ListContainer from '@/views/MyHome/ListContainer'
import Recommend from '@/views/MyHome/Recommend'
import Rank from '@/views/MyHome/Rank'
import Like from '@/views/MyHome/Like'
import Floor from '@/views/MyHome/Floor'
import Brand from '@/views/MyHome/Brand'
import {mapState} from 'vuex'
export default {
    name:'MyHome',
    components:{ListContainer,Recommend,Rank,Like,Floor,Brand},
    mounted(){
      // 派发action,获取floor组件的数据
      this.$store.dispatch("home/getFloorList")
    },
    computed:{
      ...mapState('home',['floorlist'])
    }
}
</script>

<style>

</style>