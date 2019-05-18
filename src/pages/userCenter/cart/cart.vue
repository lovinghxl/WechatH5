<template>
  <div>
    <!-- <van-checkbox-group class="card-goods" v-model="checkedGoods"> -->
      <div v-if="!cartListLength">
        <van-row class="text-right header">
          <van-button @click="handelShow" type="default" size="small">{{btnText}}</van-button>
        </van-row>
        <div
          v-for="item in resultInfo.data"
          :key="item.id"
          @click="handelSelection(item.product_id)"
          class="item"
        >
          <van-checkbox
            class="card-goods-item"
            v-model="item.checked"
          >
            <van-card
              :title="item.goods_name"
              :desc="item.goods_specifition_name_value"
              :num="item.number"
              :price="item.number * item.retail_price"
              :thumb="item.list_pic_url"
            >
            </van-card>
          </van-checkbox>
        </div>
      </div>
    <!-- 结算 -->
    <van-submit-bar
      v-if="!cartListLength"
      :price="totalPrice * 100"
      :button-text="submitBarText"
      :disabled="disableButton"
      @submit="handelCalculation"
    >
      <span @click="toggleCheckAll">
        <van-checkbox v-model="allCheck" class="checked-all">全选</van-checkbox>
      </span>
      <!-- <span slot="tip">
        你的收货地址不支持同城送, <span>修改地址</span>
      </span> -->
    </van-submit-bar>
      <!-- 删除 -->
      <van-submit-bar
        v-show="btnShow"
        button-text="删除"
        @submit="handelDeleteCart"
      >
      <span @click="toggleCheckAll">
        <van-checkbox v-model="allCheck" class="checked-all">全选</van-checkbox>
      </span>
    </van-submit-bar>

    <div class="tips" v-if="cartListLength">
      <van-icon name="bag-o" />
      <div class="tips-text">
        你的购物车还是空的 快去逛逛吧
        <div>
          <router-link to="/">去逛逛</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/api/index'
export default {
  mame: 'cart',
  data() {
    return {
      resultInfo: {
        checkedGoodsAmount: '',
        checkedGoodsCount: '',
        currentNum: '',
        currentPage: '',
        data: [],
        goodsAmount: '',
        goodsCount: '',
        numsPerPage: '',
        totalCount: '',
        totalPages: '',
      },
      btnText: '管理',
      btnShow: false
    };
  },
  created: function () {
    this.getInfo()
  },
  computed: {
    submitBarText: function () { //实时计算结算总余额
      let count=0;
      this.resultInfo.data.forEach(item => {
        if (item.checked) {
          count++
        }
      })
      return '结算' + (count ? `(${count})` : '');
    },
    totalPrice: function () { //实时计算当前商品的数量*价格
      let money = 0
      this.resultInfo.data.forEach (item => {
        if (item.checked == 1) {
          money += item.number * item.retail_price
        }
      })
      return money
    },
    disableButton: function () { //计算结算按钮数量
      let returnValue = false
      return returnValue = this.submitBarText == '结算' ? true : false
    },
    allCheck: function  () { //计算全选
      return this.checkedCount == this.resultInfo.data.length
    },
    checkedCount: function () { //计算商品选中数量
      let i = 0;
      this.resultInfo.data.forEach((item) => {
        if (item.checked)i++
      })
      return i
    },
    cartListLength: function () { //计算购物车商品数量
      return this.resultInfo.data.length == 0
    }
  },
  methods: {
    getInfo () { //获取购物车数据
      API.getCartInfo().then((data) => {
        if (data.data.data) {
          this.resultInfo = data.data
        }
      })
    },
    handelCalculation() { //结算
      this.$router.push({path: '/checkout', query: {type: 'cart'}})
    },
    handelSelection (id) { //全选/反选
      if (!this.btnShow) {//判断是否管理状态
        let params = {productId: id}
        API.getCartChecked(params)
      }
    },
    toggleCheckAll () { //全选与反选
        if (!this.btnShow) { //判断是否管理状态
          let flag = !this.allCheck
          let checked = ''
          this.resultInfo.data.forEach((item) => {
            item.checked = flag
          })
          let params = {type: flag ? 1 : 0}
          API.getCartCheckedAll(params)
        } else {
          let flag = !this.allCheck
          let checked = ''
          this.resultInfo.data.forEach((item) => {
            item.checked = flag
          })
        }
    },
    handelDeleteCart () { //删除购物车
      let paroductIds = ''
      this.resultInfo.data.map(item => {
        if (item.checked == true) {
          paroductIds += item.product_id + ','
        }
      })
      if (paroductIds == ''){
        this.$toast.fail('还没有选中删除的商品');
        return
      }
      API.getcartDelete({productId: paroductIds}).then((data) => {
        if (data.data.errno == 0) {
          //删除成功 不调接口，直接把本地的数据删除
          let paroductIds_2 = paroductIds.split(',')
          for (let i=0;i<paroductIds_2.length-1;i++) {
            for (let j=0;j<this.resultInfo.data.length;j++) {
              if (paroductIds_2[i] == this.resultInfo.data[j].product_id) {
                this.resultInfo.data.splice(j, 1)
                break
              }
            }
          }
          this.$toast.success(data.data.errmsg);
        } else {
          this.$toast.fail(data.data.errmsg);
        }
      })
    },
    handelShow () { //显示删除
      this.btnShow = !this.btnShow
      this.btnText = this.btnShow ? '完成' : '管理'
      if (this.btnShow) {
        this.resultInfo.data.map(item => {
          item.checked = 0
        })
      } else {
        this.getInfo()
      }
    }
  }
};
</script>
<style scoped>
  .header{position: fixed;z-index: 1;top: 5px;right: 5px;}
  .van-checkbox__label{width: 93%}
  .van-checkbox__label{margin-left: 0;}
  .checked-all{margin-left: 10px;}
  .checked-all .van-checkbox__label{display: inline-block;width: auto;margin-left: 5px;}
  .card-goods-item{width: 100%;margin-top: 10px;padding: 0 10px;background: #fafafa;}
  .card-goods-item:first-child{margin-top: 0;}
  .item{border-bottom: .5px solid #ededed;}
  /* .item:last-child{border: none;} */
</style>