import Vue from 'vue'
import Axios from 'axios'
import qs from 'qs'
import router from '@/router'
import store from '@/store/store'
import { Toast } from 'vant';

const option = {
  timeout: 30000,
  baseURL:  process.env.API_HOST,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Nideshop-Token': ''
  },
  transformRequest: (data, headers) => {
    // store.commit('loadingShow')
    if (headers['Content-Type'].search('application/json') !== -1) {
      return JSON.stringify(data)
    } else if (headers['Content-Type'].search('multipart/form-data') !== -1) {
      return data
    } else {
      return qs.stringify(data)
    }
  }
}

const axios = Axios.create(option)
// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 请求时设置token
  Toast.loading({
    duration: 0,       // 持续展示 toast
    forbidClick: true, // 禁用背景点击
    loadingType: 'spinner',
    message: '加载中....'
  });
  if (config.url == 'upload/comment') {
    config.headers['Content-Type'] = 'multipart/form-data'
  }
  config.headers['X-Nideshop-Token'] = $cookies.get('USER_TOKEN') || ''
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * [添加响应拦截器]
 * 接口返回参数定义格式:
 * @response {Object}
 * data：接口返回的数据
 * success：定义请求是否成功（boolean）
 * message：定义请求的错误提示信息
 * code：定义请求返回码
 */
axios.interceptors.response.use(response => {
  // 错误拦截判断
  Toast.clear();
  if (response.data.errno === 401) {
    router.push({path:'/login'})
  }
  if (response.data.errno == 1) {
    Toast.fail(response.data.errmsg)
  }
  if (response.data && !response.data.success) {
    // store.commit('loadingHide')
    // window.common.hideLoading()
    // window.common.showToast(response.data.message)
    // return Promise.reject(new Error(response.data.message))
  }
  return {
    data: response.data,
    status: response.status,
    headers: response.headers,
    statusText: response.statusText
  }
}, error => {
  Toast.clear();
  // store.commit('loadingHide')
  // window.common.hideLoading()
  const errMsg = error.message
  errMsg.indexOf('timeout') !== -1
    // ? window.common.showToast({ text: '请求超时！', time: 0 })
    // : window.common.showToast({ text: error.message, time: 0 })
  return Promise.reject(error)
})

export default axios
