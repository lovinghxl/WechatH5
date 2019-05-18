import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'vue-cookies'
Vue.use(Router)
Vue.use(Cookies)

// 商城
const login = r => require.ensure([], () => r (require('@/pages/wxLogin/login')), 'login')//登录
const mall = r => require.ensure([], () => r (require('@/pages/mall/mall')), 'mall')//商城
const goodsDetails = r => require.ensure([], () => r (require('@/pages/goodsDetails/goodsDetails')), 'goodsDetails')//商城
const goodsType = r => require.ensure([], () => r (require('@/pages/goodsType/goodsType')), 'goodsType')//商城
const article = r => require.ensure([], () => r (require('@/pages/article/article')), 'article')//售后
const articleDetails = r => require.ensure([], () => r (require('@/pages/articleDetails/articleDetails')), 'articleDetails')//文章详情
const index = r => require.ensure([], () => r (require('@/pages/userCenter/index/index')), 'index') //个人中心
const address = r => require.ensure([], () => r (require('@/pages/userCenter/address/address')), 'address') //地址
const order = r => require.ensure([], () => r (require('@/pages/userCenter/order/order')), 'order')//订单
const cart = r => require.ensure([], () => r (require('@/pages/userCenter/cart/cart')), 'cart') //购物车
const goods = r => require.ensure([], () => r (require('@/pages/goods/goods')), 'goods') //商品筛选页
const checkout = r => require.ensure([], () => r (require('@/pages/checkout/checkout')), 'checkout') //下单页面
const orderDetails = r => require.ensure([], () => r (require('@/pages/orderDetails/orderDetails')), 'orderDetails') //订单详情
const footprint = r => require.ensure([], () => r (require('@/pages/userCenter/footprint/footprint')), 'footprint') //足记
const collection = r => require.ensure([], () => r (require('@/pages/userCenter/collection/collection')), 'collection') //收藏
const feedback = r => require.ensure([], () => r (require('@/pages/userCenter/feedback/feedback')), 'feedback') //意见反馈
const stayEvaluate = r => require.ensure([], () => r (require('@/pages/userCenter/stayEvaluate/stayEvaluate')), 'stayEvaluate') //待评价
const complaintList = r => require.ensure([], () => r (require('@/pages/userCenter/complaintList/complaintList')), 'complaintList') //投诉列表
const repair = r => require.ensure([], () => r (require('@/pages/userCenter/repair/repair')), 'repair') //报修
const api = r => require.ensure([], () => r (require('@/pages/userCenter/api/api')), 'api') //

// 机器商城 
const welcomePage = r => require.ensure([], () => r (require('@/pages/machineShop/welcomePage/welcomePage')), 'welcomePage') //贩卖机
const machineIndex = r => require.ensure([], () => r (require('@/pages/machineShop/index/index')), 'index') ///贩卖机首页

const router = new Router({
  scrollBehavior (to, from, savedPosition) {
    //处理滚动条
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  },
  routes: [
    // 商城
    {
      path: '/',
      name: 'mall',
      component: mall,
      meta: {title: '商城', keepAlive: true}
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {title: '登录', keepAlive: false}
    },
    {
      path: '/goodsDetails',
      name: 'goodsDetails',
      component: goodsDetails,
      meta: {title: '商品详情', keepAlive: false}
    },
    {
      path: '/goodsType',
      name: 'goodsType',
      component: goodsType,
      meta: {title: '商品分类', keepAlive: true}
    },
    {
      path: '/article',
      name: 'article',
      component: article,
      meta: {title: '售后', keepAlive: true}
    },
    {
      path: '/articleDetails',
      name: 'articleDetails',
      component: articleDetails,
      meta: {title: '文章详情', keepAlive: false}
    },
    {
      path: '/userCenter',
      name: 'index',
      component: index,
      meta: {title: '个人中心', keepAlive: true}
    },
    {
      path: '/address',
      name: 'address',
      component: address,
      meta: {title: '收货地址', keepAlive: true}
    },
    {
      path: '/order',
      name: 'order',
      component: order,
      meta: {title: '订单', keepAlive: false}
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart,
      meta: {title: '购物车', keepAlive: false}
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods,
      meta: {title: '商品筛选', keepAlive: false}
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: checkout,
      meta: {title: '下单', keepAlive: false}
    },
    {
      path: '/orderDetails',
      name: 'orderDetails',
      component: orderDetails,
      meta: {title: '订单详情', keepAlive: false}
    },
    {
      path: '/footprint',
      name: 'footprint',
      component: footprint,
      meta: {title: '足迹', keepAlive: true}
    },
    {
      path: '/collection',
      name: 'collection',
      component: collection,
      meta: {title: '收藏', keepAlive: false}
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: feedback,
      meta: {title: '意见反馈', keepAlive: false}
    },
    {
      path: '/stayEvaluate',
      name: 'stayEvaluate',
      component: stayEvaluate,
      meta: {title: '待评价', keepAlive: true}
    },
    {
      path: '/complaintList',
      name: 'complaintList',
      component: complaintList,
      meta: {title: '我的投诉', keepAlive: true}
    },
    {
      path: '/repair',
      name: 'repair',
      component: repair,
      meta: {title: '报修', keepAlive: true}
    },
    {
      path: '/api',
      name: 'api',
      component: api,
      meta: {title: 'api测试', keepAlive: true}
    },
    // 机器商城
    {
      path: '/welcomePage',
      name: 'welcomePage',
      component: welcomePage,
      meta: {title: '贩卖机', keepAlive: false}
    },
    {
      path: '/machineIndex',
      name: 'machineIndex',
      component: machineIndex,
      meta: {title: '机器商城首页', keepAlive: false}
    },
  ]
})

router.beforeEach((to, from, next) => {
  //判断是否扫码进来
  if (to.path == '/welcomePage') { 
    let machineId = decodeURIComponent((new RegExp('[?|&]'+'mId'+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
    if (machineId) {
      $cookies.set('mId', machineId)
      $cookies.set('loginMid', machineId)
    } else {
      $cookies.set('mId', 20)
      $cookies.set('loginMid', 20)
    }
  }

  //截取url上 token
  let token = decodeURIComponent((new RegExp('[?|&]'+'token'+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
  if (!!token) {
    $cookies.set('USER_TOKEN', token.split('&')[0])
  }
  // 判断用户是否登录
  if (!!$cookies.get('USER_TOKEN')) {
    // 设置页面标题
    document.title = to.meta.title || '童方科技'
    next()
  } else {
    if (to.path == '/login') { //跳出死循环
      next()
    } else {
      next({name: 'login'})
    }
  }
})

export default router;
