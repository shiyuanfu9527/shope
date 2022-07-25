<template>
  <div class="swiper-container" ref="cur">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(carousel, index) in list" :key="carousel.id" >
        <img :src="carousel.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from 'swiper'
export default {
  name: "Carousel",
  props:['list'],
    watch:{
    list:{
      // 立即监听
      immediate:true,
      handler(){
        // 只能监听到数据已经有了,但是v-for动态渲染结构我们还是没办法确定的,因此还是需要用nextTick
        this.$nextTick(()=>{
          var mySwiper = new Swiper (this.$refs.cur,{
          loop:true,
          // 如果需要分页器
          pagination:{
            el:".swiper-pagination",
            clickable:true,
          },
          // 如果需要前进后退按钮
          navigation:{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
          }
        })
        })
      }
    }
  }
};
</script>

<style>
</style>