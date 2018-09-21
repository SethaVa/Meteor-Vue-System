import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// Store
import app from '/imports/client/store'
// import app from './client/store/app'

const store = new Vuex.Store({
  modules: {
    app,
  },
})

export default store
