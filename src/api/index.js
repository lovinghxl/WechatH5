import axios from '@/utils/axios'

export default {
  getUserInfo (params) { // 获取用户信息
    return axios({
      method: 'get',
      url: 'auth/getUserInfo',
      params
    })
  },
  getArticleListInfo (params) { // Article页面 获取文章列表
    return axios({
      method: 'get',
      url: 'article/solrQuery',
      params
    })
  },
  getArticleTypeInfo (params) { // 获取文章类型
    return axios({
      method: 'get',
      url: 'article/artistType',
      params
    })
  },
  getArticleDetalilsInfo (params) { // 获取文章详情
    return axios({
      method: 'get',
      url: 'article/detail',
      params
    })
  },
  getGoodsTypeInfo (params) { // 获取商品分类
    return axios({
      method: 'get',
      url: 'category/index',
      params
    })
  },
  getGoodsTypeCurrentInfo (params) { // 获取获取商品二三级分类
    return axios({
      method: 'get',
      url: 'category/current',
      params
    })
  },
  getMallBannerInfo (params) { // 获取商城首页banner
    return axios({
      method: 'get',
      url: 'index/banner',
      params
    })
  },
  getGoodsListInfo (params) { // 获取商城商品数据
    return axios({
      method: 'get',
      url: 'goods/solrQuery',
      params
    })
  },
  getGoodsDetailsInfo (params) { // 获取商品详情
    return axios({
      method: 'get',
      url: 'goods/detail',
      params
    })
  },
  getCollection (params) { // 收藏/取消收藏
    return axios({
      method: 'get',
      url: 'collect/addordelete',
      params
    })
  },
  getgoodsSku (params) { // 商品规格
    return axios({
      method: 'get',
      url: 'goods/sku',
      params
    })
  },
  getCartAdd (params) { // 加入购物车
    return axios({
      method: 'get',
      url: 'cart/add',
      params
    })
  },
  getCartInfo (params) { // 获取购物车列表
    return axios({
      method: 'get',
      url: 'cart/getCart',
      params
    })
  },
  getCartChecked (params) {//购物车单选
    return axios({
      method: 'get',
      url: 'cart/checked',
      params
    })
  },
  getCartCheckedAll (params) {//购物车全选
    return axios({
      method: 'get',
      url: 'cart/checkedAll',
      params
    })
  },
  getCartCheckout (params) {//生成订单
    return axios({
      method: 'get',
      url: 'cart/checkout',
      params
    })
  },
  getOrderSubmit (params) {  //提交商品訂單
    return axios({
      method: 'get',
      url: 'order/submit',
      params
    })
  },
  getPayPrepay (params) {  //调用支付
    return axios({
      method: 'get',
      url: 'pay/prepay',
      params
    })
  },
  getAddressList (params) {  //获取收货地址列表
    return axios({
      method: 'get',
      url: 'address/list',
      params
    })
  },
  getAddressSaveOrUpdate (params) {  //修改或新增收货地址
    return axios({
      method: 'get',
      url: 'address/saveOrUpdate',
      params
    })
  },
  getAddressDelete (params) {  //删除收货地址
    return axios({
      method: 'get',
      url: 'address/delete',
      params
    })
  },
  getMachineShopIndex (params) {  //机器商城商品数据
    return axios({
      method: 'get',
      url: 'machine/shop/index',
      params
    })
  },
  getMachineShopSubmit (params) {  //提交订单
    return axios({
      method: 'get',
      url: 'machine/shop/submit',
      params
    })
  },
  getMachineShopPrepay (params) {  //获取支付参数
    return axios({
      method: 'get',
      url: 'machine/shop/prepay',
      params
    })
  },
  getOrderList (params) {  //获取订单列表
    return axios({
      method: 'get',
      url: 'order/list',
      params
    })
  },
  getAddressGetProvice (params) {  //获取省
    return axios({
      method: 'get',
      url: 'address/getProvice',
      params
    })
  },
  getAddressGetCitys (params) {  //获取城市
    return axios({
      method: 'get',
      url: 'address/getCitys',
      params
    })
  },
  getAddressGetDistricts (params) {  //获取县区
    return axios({
      method: 'get',
      url: 'address/getDistricts',
      params
    })
  },
  getorderDetail (params) {  //获取订单详情
    return axios({
      method: 'get',
      url: 'order/detail',
      params
    })
  },
  getcartDelete (params) {  //删除购物车
    return axios({
      method: 'get',
      url: 'cart/delete',
      params
    })
  },
  getOrderCancelOrder (params) {  //取消订单
    return axios({
      method: 'get',
      url: 'order/cancelOrder',
      params
    })
  },
  getOrderDeleteOrder (params) {  //删除订单
    return axios({
      method: 'get',
      url: 'order/deleteOrder',
      params
    })
  },
  getOrderConfirmOrder (params) {  //确定收货
    return axios({
      method: 'get',
      url: 'order/confirmOrder',
      params
    })
  },
  getOrderTouSu (params) {  //订单投诉
    return axios({
      method: 'get',
      url: 'tousu/save',
      params
    })
  },
  getFootprintList (params) {  //获取足迹
    return axios({
      method: 'get',
      url: 'footprint/list',
      params
    })
  },
  getFootprintDelete (params) {  //删除用户足迹
    return axios({
      method: 'get',
      url: 'footprint/delete',
      params
    })
  },
  getCollectList (params) {  //获取用户收藏
    return axios({
      method: 'get',
      url: 'collect/list',
      params
    })
  },
  getFeedbackSave (params) {  //意见反馈
    return axios({
      method: 'get',
      url: 'feedback/save',
      params
    })
  },
  getOrderCommitGood (params) {  //意见反馈
    return axios({
      method: 'get',
      url: 'order/getCommitGood',
      params
    })
  },
  postUploadComment (data) {  //上传图片
    return axios({
      method: 'post',
      url: 'upload/comment',
      data
    })
  },
  getCollectDeleteBatch (params) {  //删除收藏
    return axios({
      method: 'get',
      url: 'collect/deleteBatch',
      params
    })
  },
  getCommentPost (params) {  //提交评论
    return axios({
      method: 'get',
      url: 'comment/post',
      params
    })
  },
  getTousuQuery (params) {  //投诉列表
    return axios({
      method: 'get',
      url: 'tousu/query',
      params
    })
  },
  getOrder (params) {
  	return axios ({
  		method: 'get',
  		url: 'machine/shop/outGoods',
  		params
  	})
  },
  getPaySuccess (params) { //下单成功获取本次获得积分
  	return axios ({
  		method: 'get',
  		url: 'machine/shop/paySuccess',
  		params
  	})
  },
}















