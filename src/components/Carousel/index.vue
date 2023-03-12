<template>
<!-- 轮播图的基本结构 -->
  <div class="swiper-container" ref="mySwiper">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(carousel, index) in list"
        :key="carousel.id"
      >
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
// 引入Swiper
import Swiper from "swiper";
export default {
  name: "Carsousel",
  props: ["list"],
  watch: {
    // 立即监听：不管数据有没有变化，我一上来立即监听一次
    // 为什么watch监听不到list，因为这个数据从来没有变过， （数据是父亲给的， 父亲给的时候是一个对象， 对象里面该有的数据都是有的，从来没有发生变化）
    // watch监听不到list，我们需要使用 immediate：true 属性来表示立即监听，
    list: {
      immediate: true,
      handler() {
        // 只能监听到数据已经有了，但是v-for动态渲染结构我们还是没有办法确定的，因此还是需要nextTick
        this.$nextTick(() => {
          // 上面使用ref定义，使用this.$refs来获取内容东西
          var mySwiper = new Swiper(this.$refs.mySwiper, {
            loop: true, // 循环模式选项
            // 如果需要分页器，有相应的属性，根据样式来决定相应的属性是否需要加上
            pagination: {
              el: ".swiper-pagination",
            },

            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            // 如果需要滚动条
            scrollbar: {
              el: ".swiper-scrollbar",
            },
          });
        });
      },
    },
  },
};
</script>

<style>
</style>