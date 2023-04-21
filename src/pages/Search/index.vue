<template>
  <div>
    <!-- 商品分类三级列表 -->
    <!-- <el-button>Default</el-button> -->
    <!-- <i class="el-icon-up"></i> 在入口文件中引入和htmljs文件中引入效果其实是差不多的 -->
    <!-- <span class="iconfont icon-long-arrow-down"></span> -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread：面包屑，带有x的结构的-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">×</i>
            </li>

            <!-- 面包屑应该有两处地方, 关键字处生成的也应该是要有面包屑的 -->
            <li class="with-x" v-if="searchParams.keyWord">
              {{ searchParams.keyWord }}<i @click="removeKeyWord">×</i>
            </li>
            <!-- 第三处面包屑，当下面的关键字存在的时候，上面的面包屑也要进行相应的展示 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1]
              }}<i @click="removeTrademark">×</i>
            </li>
            <!-- 平台的售卖的属性值的展示 -->
            <li
              class="with-x"
              v-for="(attrValue, index) in searchParams.props"
              :key="index"
            >
              {{ attrValue.split(":")[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector：子组件-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />

        <!--details-->
        <div class="details clearfix">
          <!-- 排序的结构 -->
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 价格的结构 -->
              <!-- 谁应该有箭头：谁有类名，谁就有箭头 -->
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a
                    >综合<span
                      v-show="isOne"
                      class="iconfont"
                      :class="{
                        'icon-long-arrow-up': isAsc,
                        'icon-long-arrow-down': isDesc,
                      }"
                    ></span
                  ></a>
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder('2')">
                  <a
                    >价格<span
                      v-show="isTwo"
                      class="iconfont"
                      :class="{
                        'icon-long-arrow-up': isAsc,
                        'icon-long-arrow-down': isDesc,
                      }"
                    ></span
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li
                class="yui3-u-1-5"
                v-for="(good, index) in goodsList"
                :key="index"
              >
                <!-- <li class="yui3-u-1-5"> -->
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 在路由进行跳转的时候，不要忘记带上相应的id(params)参数 -->
                    <router-link :to="`/detail/${good.id}`"> <img v-lazy="good.defaultImg" /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ good.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 子给父通信，告诉父亲当前是第几页需要获取后台的相应数据 -->
          <Pagination
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="total"
            :continues="5"
            @getPageNo="getPageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
// 使用mapstate将仓库的数据映射为组件实例身上的
import { mapGetters, mapState } from "vuex";
export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  data() {
    return {
      // 根据所带的参数不同，服务器返回的数据内容也是不同的
      // 定义一个响应式的数据，我们知道响应式的数据会发生变化，而且可以被监听到
      // 带给服务器的参数
      searchParams: {
        // 有些初始值需要置空，根据home首页传过来的数据发生相应的变化才行
        // 一级分类的id
        category1Id: "",
        // 二级分类的id
        category2Id: "",
        // 三级分类的id
        category3Id: "",
        // 分类名字
        categoryName: "",
        // 关键字
        keyWord: "",
        // 排序 初始状态应该是综合且降序
        order: "1:desc",
        // 分页器 默认值是1
        pageNo: 1,
        // 每一页展示数据的个数
        pageSize: 3,
        // 平台售卖属性操作带的参数
        props: [],
        // 品牌
        trademark: "",
      },
    };
  },
  // 生命周期钩子，在组件挂载完毕之前执行一次[先于mounted之前]
  beforeMount() {
    // 复杂的写法
    // this.searchParams.category1Id = this.$route.query.category1Id
    // Object.assign: ES6新增的语法，用于合并对象
    // 在发送请求之前，把接口需要传递参数，进行整理(在给服务器发请求之前，把参数整理好，服务器会返回查询的数据)
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  // 组件挂载完毕仅仅只是执行一次
  mounted() {
    // 先测试接口返回的数据格式
    // this.$store.dispatch("getSearchList", {});
    // console.log(goodList)
    // 在发送请求之前带给服务器参数，【searchParams参数发生变化有数值带给服务器】
    // console.log(this.total)
    this.getData();
    // console.log(this.total);
  },
  computed: {
    // 使用mapstate进行映射数据的话，是写在计算属性computed当中的
    // ...mapState 这次就不这么书写了，我们可以使用getters来进行书写操作
    // mapGetters里面的写法，传递的数组，因为getters计算是没有划分模块[home/search]
    ...mapGetters(["goodsList"]),
    // ...mapGetters([{goodsList:'search/goodsList'}])
    /* ...mapState({
      goodsList: (state) => state.searchList.goodsList 
    }) */
    // 在结构当中的内容太过于复杂是的时候，我们可以将负责的表达式写在计算属性当中
    // 计算完 进行使用即可
    isOne() {
      return this.searchParams.order.indexOf("1") != -1;
    },
    isTwo() {
      return this.searchParams.order.indexOf("2") != -1;
    },
    isAsc() {
      return this.searchParams.order.indexOf("asc") != -1;
    },
    isDesc() {
      return this.searchParams.order.indexOf("desc") != -1;
    },
    // 获取search模块展示产品一共多少数据
    /* ...mapState({
      total: (state) => state.search?.searchList?.data.total
    }), */
    ...mapGetters(["total"]),
  },
  methods: {
    // 向服务器发请求获取search模块数据，（根据参数不同返回不同的数据进行展示）
    // 把这次请求封装为一个函数，当你需要在调用的时候调用即可
    getData() {
      // 函数定义一次可以进行多次调用，我们需要在需要的时候来获取相应的数据，然后进行操作    dispatch后面带上参数的话 会让服务器返回的数据变得异常的缓慢
      this.$store.dispatch("getSearchList", this.searchParams);
    },
    // 删除分类的名字
    removeCategoryName() {
      // 只是把带给服务器的参数给置空了，还需要向服务器发请求
      this.searchParams.categoryName = "";

      // categoryName 都没有了 相应的id肯定也要被干掉
      // 实时测试打印自己传送的数据是啥
      // console.log(this.searchParams)
      // 每一次请求完毕，应该把相应的1、2、3级分类的id置空，让他接受下一次相应的1、2、3id
      // 简单的置空操作 不要把多余的参数带过去 关键
      // 搜索处的内容没有必要进行置空操作，因为搜索的内容每次过去都会赋一个新的值
      // 分类名字与关键字不用清理，因为每一次路由发生变化的时候，都会给他赋予新的数据，
      // 但是进行书写分类的时候，因为用于每次点击的数据有可能不一样，上次是1级下次3级，所以要把上次的分类干掉

      // 分类名字与关键字不用清理，因为每一次路由发生变化的时候，都会给他赋予新的数据
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      this.getData();
      // 地址栏也需要进行修改 进行路由跳转, (现在的路由跳转只是跳转到自己这里)
      // 但是搜索框中的params参数还是需要传送过去
      // 严谨：本意是删除query参数，如果路径当中出现了params参数不应该删除，路由跳转的时候应该带着
      if (this.$route.params) {
        this.$router.push({ name: "search", params: this.$route.params });
      }
    },
    // 删除关键字面包屑
    removeKeyWord() {
      // 给服务器带的参数 searchParams 中的keyWord进行相应的置空操作
      this.searchParams.keyWord = "";
      // 再次发送请求
      this.getData();
      /* 
        当面包屑中的关键字清除以后，需要让兄弟组件Header组件中的关键字清楚
        使用组件之间通信： $bus 全局事件总线通信操作
      */
      // 通知兄弟组件Header清除关键字  也不管是不是兄弟组件之间还是啥的，组件之间通信使用全局事件总线还是可以的
      this.$bus.$emit("clear");
      if (this.$route.query) {
        this.$router.push({ name: "search", query: this.$route.query });
      }
    },
    // 自定义事件回调
    trademarkInfo(trademark) {
      // 1 整理品牌字段的参数，形如 'ID:品牌名称'
      console.log("我是父组件", trademark);
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      // 每次弄完以后需要再次发送请求，这样才能把我们想要的数据重新获取得当才行
      this.getData();
    },
    // 删除品牌的信息（面包屑）
    removeTrademark() {
      // 将品牌信息置空，然后再次发请求
      this.searchParams.trademark = undefined;
      // 再次发送请求
      this.getData();
    },
    // 收集平台属性的回调函数（自定义事件）
    attrInfo(attr, attrValue) {
      // ["属性ID:属性值:属性名"]
      console.log(attr, attrValue);
      // 整理好参数格式
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      // 对于列表的话，将内容传入进去即可，则有
      // 传入内容的时候，不能来一个就添加一个，应该加上相应的判断操作
      // 进行数组去重操作 下面判断很有用,没有的时候,再进行相应的判断即可
      if (this.searchParams.props.indexOf(props) == -1) {
        this.searchParams.props.push(props);
      }
      // 再次发送请求
      this.getData();
    },
    removeAttr(index) {
      // 再次整理参数 删除具体索引中的某一个值 我们使用的操作是 splice来进行相应的操作，
      this.searchParams.props.splice(index, 1);
      // 再次发送请求
      this.getData();
    },
    // 排序的操作 使用排序的逻辑一定要懂
    changeOrder(flag) {
      // flag形参：它是一个标记，代表用户点击的是综合(1) 价格(2) [用户点击的时候传递进来的]
      // 要获取order初始状态，我们需要通过起始状态来判断接下来应该做什么
      let originOrder = this.searchParams.order;
      // 起始值我们应该拿到，因为我们需要通过起始值，然后对起始值来进行相应的取反操作才行
      /* let originFlag = this.searchParams.order.split(':')[0]
      let originSort = this.searchParams.order.split(':')[1] */
      let originFlag = originOrder.split(":")[0];
      let originSort = originOrder.split(":")[1];
      // 准备一个新的order属性值
      let newOrder = "";
      // 根据点击的内容来进行相应的判断操作
      // 这个语句我能确定点击的一定是综合 初始状态，判断点击的是不是综合
      // 判断多次点击的是不是同一个按钮；
      if (flag == originFlag) {
        newOrder = `${originFlag}:${originSort == "desc" ? "asc" : "desc"}`;
      } else {
        // 点击的是价格；默认的是降序
        newOrder = `${flag}:${"desc"}`;
      }
      // 上面获取到了新的order以后，需要将新的order赋予searchParams
      // @ 每次都需要进行重新赋值的；所以会重新发生变化 
      this.searchParams.order = newOrder;
      // 再次发请求即可，在做好相应逻辑以后，还是需要传入相应的值才可以
      this.getData();
    },
    // 自定义事件的回调函数 - 获取当前是第几页
    getPageNo(pageNo) {
      // console.log(pageNo)
      // 整理带给服务器的参数
      this.searchParams.pageNo = pageNo;
      // 再次发送请求
      this.getData();
    },
  },
  // 数据监听，监听组件实例身上的属性的属性值的变化，只要数据发生了变化，就可以被监听到
  watch: {
    // $route和要监听的数据searchParams属于平级，直接书写即可
    // 监听路由的信息是否发生变化，如果发生变化，再次发起请求
    // 当数据很复杂的时候，才需要使用深度监听
    $route(newValue, oldValue) {
      // console.log(123)
      // 再次发请求之前整理带给服务器的参数
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      // 在次发起ajax请求
      this.getData();
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>