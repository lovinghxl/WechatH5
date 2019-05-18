import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
 
export default new Vuex.Store({
  state:{
    count: false
  },
  mutations:{
    loadingShow: state => state.count = true,
    loadingHide: state => state.count = false,
  }
})