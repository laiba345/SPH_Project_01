<template>
  <div>
    <!-- 三级联动全局组件：三级联动已经注册为全局组件，因此不需要在引入 -->
    <TypeNav />
    <ListContainer />
    <Recommend />
    <Rank />
    <Like />
    <!-- 遍历的话，主要是看看有多少个floor数据对象，将floorList.data中的数据 -->
    <!-- 有多个的话，就进行相应的遍历操作，将遍历出来的函数对象传给Floor组件即可 -->
    <Floor v-for="(floor, index) in floorList.data" :key="floor.id" :list='floor' />
    <Brand />
  </div>
</template>

<script>
import ListContainer from "@/pages/Home/ListContainer";
import Recommend from "@/pages/Home/Recommend";
import Rank from "@/pages/Home/Rank";
import Like from "@/pages/Home/Like";
import Floor from "@/pages/Home/Floor";
import Brand from "@/pages/Home/Brand";
import { mapState } from "vuex";
export default {
  name: "",
  components: { ListContainer, Recommend, Rank, Like, Floor, Brand },
  mounted() {
    // 派发action， 获取floor组件的数据，在home组件挂载完毕的时候进行派发操作，
    this.$store.dispatch("getFloorList");
    // 获取用户信息在首页进行展示 这里是不用携带任何参数的
    // this.$store.dispatch('getUserInfo') 这段代码写到 路由守卫中更加合理

    // console.log(this.floorList.data) 加载完毕，这里是有两个对象的，这一点很关键
  },
  computed: {
    // 简写形式，通过...mapState 来获取项目中的数据
    /* ...mapState({
      floorList: (state) => state.home.floorList,
    }), */
    // 计算属性在上述相应模板中可以直接进行相应的使用操作
    ...mapState({
      floorList: (state) => state.home.floorList
    })
  },
};
</script>

<style scoped>
</style>