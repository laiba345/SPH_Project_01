<template>
  <!-- 在进行拷贝的时候，结构和样式都是需要进行拷贝操作的，不能漏掉 -->
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!-- 没有用户的时候，进行显示即可 -->
          <p v-if="!userName">
            <span>请</span>
            <router-link href="###" to="/login">登录</router-link>
            <router-link href="###" class="register" to="/register"
              >免费注册</router-link
            >
          </p>
          <!-- 登录了 -->
          <p v-else>
            <a>{{ userName }}</a>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <!-- <a href="###">我的订单</a> -->
          <router-link to="/center/myorder">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <!-- <a href="###">我的购物车</a> -->
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyWord"
          />
          <!-- a标签可以用路由式导航，但是 button等最好用编程式导航 -->
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="goSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      keyWord: "",
    };
  },
  methods: {
    // 搜索按钮的回调函数，需要像Search跳转
    goSearch() {
      /* 
        路由传递参数
            - 第一种：字符串形式
            - 第二种: 模板字符串
            - 第三种：对象形式
      */
      // 第一种：字符串形式，params是进行占位操作，query是使用k-v的形式来读取数据
      /* this.$router.push(
        "/search/" + this.keyWord + "?k=" + this.keyWord.toUpperCase()
      ); */
      // 第二种：模板字符串形式，直接进行书写就行
      // this.$router.push(`/search/${this.keyWord}?k=${this.keyWord.toUpperCase()}`)
      // 第三种：对象写法 同其他写法一样，对象写法也是可以同时传入params参数和query参数
      // 对象写法可以同时传入query参数和params参数
      /* this.$router.push({
        name:'search', 
        params:{
            keyWord:this.keyWord
        }, 
        query:{
            k:this.keyWord.toUpperCase()
        }
      }) */
      /* ****************************************************************** */
      // 面试题1：路由传递参数（对象写法） path是否可以结合params参数一起使用？
      // 答： 路由跳转传参的时候，对象的写法可以是name，path形式，但是需要注意的是，path这种写法不能与params参数一起使用
      /* this.$router.push({
        path:'/search', 
        params:{
            keyWord:this.keyWord, 
        }, 
        query:{
            k:this.keyWord.toUpperCase()
        }
      }) */
      /* ****************************************************************** */
      // 面试题2：如何指定params参数可传可不传
      // 如果路由要求传递params参数，但是你就不传递params参数，发现一件事情，url会出现问题
      // 如何指定params参数可以传递或者不传递-> 在配置路由的时候，在占位的后面加上一个问号 ？，【params可以传递或者不传递】
      /* this.$router.push({
        name: "search",
        query: { k: this.keyWord.toUpperCase() },
      }); */

      /* ****************************************************************** */
      // 面试题3：params参数可以传递也可以不传递，但是如果传递是空串，如何解决呢 ？
      // 使用undefined解决，params参数可以传递、不传递(空的字符串)
      /* this.$router.push({
        name: "search",
        params:{keyWord:'' || undefined}, 
        query: { k: this.keyWord.toUpperCase() },
      }); */
      /* ****************************************************************** */
      // 面试题4：路由组件能不能传递props数据？
      // 可以的：三种写法
      /* this.$router.push({
        name:'search', 
        params:{
            keyWord:this.keyWord
        }, 
        query:{
            k:this.keyWord.toUpperCase()
        }
      }) */
      // 代表的是如果有query参数也要带过去
      if (this.$route.query) {
        let location = {
          name: "search",
          params: { keyWord: this.keyWord || undefined },
        };
        location.query = this.$route.query;
        this.$router.push(location);
      }
    },
    // 退出登录
    async logout() {
      // 退出登录，需要做的事情
      // 1、需要发请求，通知服务器退出登录【清除一些数据：token】
      //  服务器肯定需要返回成功或者失败，尤其是删除成功以后还需要回到首页的操作
      try {
        await this.$store.dispatch("userLogout");
        // 如果退出成功，回到首页
        this.$router.push("/home");
      } catch (error) {
        alert(error.message);
      }
      // 2、清除项目当中的数据【userInfo、token】 因为下一次用户登录就是在此处
    },
  },
  mounted() {
    // 通过全局事件总线清楚关键字
    this.$bus.$on("clear", () => {
      this.keyWord = "";
    });
  },
  computed: {
    userName() {
      // 用户名信息
      return this.$store.state.user?.userInfo?.loginName || "";
    },
  },
};
</script>

<style lang='less' scoped>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>