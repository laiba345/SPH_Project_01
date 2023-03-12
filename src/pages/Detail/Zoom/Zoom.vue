<template>
  <div class="spec-preview">
    <!-- 动态进行展示数据的时候，使用 : 来进行指定 -->
    <img :src="imgObj.imgUrl" />
    <div class="event" @mousemove="handler"></div>
    <div class="big">
      <img :src="imgObj.imgUrl" ref="big" />
    </div>
    <!-- 遮罩层 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: "Zoom",
  props: ["skuImageList"],
  data() {
    return {
      currentIndex:0, 
    }
  },
  computed: {
    // 拿到的内容可能是空数组，空数组第0项是没有imgUrl属性值的，所以要进行相应的设置才可以
    imgObj() {
      // 在进行数据切换的时候，这里也不能把其写死，要不然永远都是第0个,在自己书写的js样式中，使用data中的样式的时候，需要使用this关键字来进行获取操作
      return this.skuImageList[this.currentIndex] || {}
    }
  },
  mounted() {
    // 使用全局事件总线（一般是在兄弟之间传输数据） 写在mounted当中
    this.$bus.$on('getIndex', (index)=> {
      // 将旁边传递过来的索引值进行相应的变换操作即可 
      this.currentIndex = index
    })
  },
  methods: {
    // 对于鼠标移动事件是有event的，里面包含了clientx等坐标信息
    handler(event) {
      // console.log(event)
      let mask = this.$refs.mask
      let big = this.$refs.big
      let left = event.offsetX - mask.offsetWidth/2
      let top = event.offsetY - mask.offsetHeight/2
      // 约束范围
      if(left <= 0) left = 0
      if(left >= mask.offsetWidth) left = mask.offsetWidth
      if(top <= 0) top = 0
      if(top >= mask.offsetHeight) top = mask.offsetHeight
      // 修改元素的left|top属性值
      mask.style.left = left + 'px'
      mask.style.top = top + 'px'
      big.style.left = -2 * left + 'px'
      big.style.top = -2 * top + 'px'

    }
  },
};
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>