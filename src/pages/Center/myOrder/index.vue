<template>
  <div class="order-right">
    <div class="order-content">
      <div class="title">
        <h3>我的订单</h3>
      </div>
      <div class="chosetype">
        <table>
          <thead>
            <tr>
              <th width="29%">商品</th>
              <th width="31%">订单详情</th>
              <th width="13%">收货人</th>
              <th>金额</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="orders">
        <!-- table指的是每一笔订单 -->
        <table
          class="order-item"
          v-for="(order, index) in myOrder.records"
          :key="order.id"
        >
          <thead>
            <tr>
              <th colspan="5">
                <span class="ordertitle"
                  >{{ order.createTime }}　订单编号：{{ order.outTradeNo }}
                  <span class="pull-right delete"
                    ><img src="../images/delete.png" /></span
                ></span>
              </th>
            </tr>
          </thead>
          <!-- 每一个订单详情在每一个order对象下面 -->
          <tbody>
            <tr v-for="(cart, index) in order.orderDetailList" :key="cart.id">
              <td width="60%">
                <div class="typographic">
                  <img :src="cart.imgUrl" style="width: 100px; height: 100px" />
                  <a href="#" class="block-text">{{ cart.skuName }} </a>
                  <span>x{{ cart.skuNum }}</span>
                  <a href="#" class="service">售后申请</a>
                </div>
              </td>
              <!-- 有很多产品但是我们在进行展示的时候，只需要展示第1个即可，使用v-if来使用即可 -->
              <td
                :rowspan="order.orderDetailList.length"
                width="8%"
                class="center"
                v-if="index == 0"
              >
                {{ order.consignee }}
              </td>
              <td
                :rowspan="order.orderDetailList.length"
                width="13%"
                class="center"
                v-if="index == 0"
              >
                <ul class="unstyled">
                  <li>总金额¥{{ order.totalAmount }}</li>
                  <li>在线支付</li>
                </ul>
              </td>
              <td
                :rowspan="order.orderDetailList.length"
                width="8%"
                class="center"
                v-if="index == 0"
              >
                <a href="#" class="btn">{{ order.orderStatusName }}</a>
              </td>
              <td
                :rowspan="order.orderDetailList.length"
                width="13%"
                class="center"
                v-if="index == 0"
              >
                <ul class="unstyled">
                  <li>
                    <a href="mycomment.html" target="_blank">评价|晒单</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="choose-order">
        <!-- 分页器 子给父通信，告诉父亲当前是第几页需要获取后台的相应数据 -->
        <Pagination
          :pageNo="page"
          :pageSize="limit"
          :total="myOrder.total"
          :continues="5"
          @getPageNo="getPageNo"
        />
      </div>
    </div>
    <!--猜你喜欢-->
    <div class="like">
      <h4 class="kt">猜你喜欢</h4>
      <ul class="like-list">
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike01.png" />
          </div>
          <div class="attr">
            <em>DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</em>
          </div>
          <div class="price">
            <em>¥</em>
            <i>3699.00</i>
          </div>
          <div class="commit">已有6人评价</div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike02.png" />
          </div>
          <div class="attr">Apple苹果iPhone 6s/6s Plus 16G 64G 128G</div>
          <div class="price">
            <em>¥</em>
            <i>4388.00</i>
          </div>
          <div class="commit">已有700人评价</div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike03.png" />
          </div>
          <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</div>
          <div class="price">
            <em>¥</em>
            <i>4088.00</i>
          </div>
          <div class="commit">已有700人评价</div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike04.png" />
          </div>
          <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</div>
          <div class="price">
            <em>¥</em>
            <i>4088.00</i>
          </div>
          <div class="commit">已有700人评价</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 初始化一些参数
      // 当前第几页
      page: 1,
      // 每一页展示数据个数
      limit: 3,
      // 存储我的订单的数据
      myOrder: {},
    };
  },
  mounted() {
    // 获取我的订单的数据方法 生命周期钩子函数不能使用 async等
    this.getData();
  },
  methods: {
    // 获取我的订单的方法
    // 因为我们需要多次调用该方法，所以很关键这个操作
    async getData() {
      // 需要用到哪些参数，我们需要将其解构出来 page 和 limit都是this身上配置的data属性，可以直接解构出来
      const { page, limit } = this;
      let result = await this.$API.reqMyOrderList(page, limit);
      // console.log(result);
      if (result.status == 200) {
        this.myOrder = result.data.data;
      }
    },
    // 获取当前点击的那一页
    getPageNo(page) {
      // 修改组件的响应式数据page
      this.page = page
      // 然后获取相应的数据
      this.getData() 
    }
  },
};
</script>

<style>
</style>