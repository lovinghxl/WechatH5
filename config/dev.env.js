'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  API_HOST:'"http://ghy.hyw666.club/tfapi/"'  //测试
  // API_HOST:'"http://www.hyw666.club/tfapi/"' //正式
  // API_HOST: '"http://192.168.100.31:8999/tfapi/"'   //本地
  // API_HOST: '"http://localhost:8080/tfapi/"'   //本地
})













