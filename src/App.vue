<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import API from '@/api/index'
export default {
  name: 'App',
  computed: {
    // count () {
      // return this.$store.state.count
    // },
  },
  created: function () {
    API.getUserInfo().then(({ data }) => { //获取用户信息
      $cookies.set('USER_INFO', data)
    })
  }
};
</script>

<style>
 /* .loading{position: fixed;top: 0;right: 0;bottom: 0;left: 0;margin: auto;text-align: center;padding: 10px;width: 100px;height: 100px;border-radius: 10px;z-index: 999999999999;color: #fff;background: rgba(0,0,0,.5);}
  .loading .van-loading{width: 50px;margin: auto;margin-top: 9px;height: 50px;z-index: 0;font-size: 0;line-height: 0;vertical-align: middle;}*/
</style>
