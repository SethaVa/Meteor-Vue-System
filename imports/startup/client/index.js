// Import client startup through a single index entry point

import {
  Meteor
} from 'meteor/meteor'
import Vue from 'vue'
import _ from 'lodash'

// ------------Router-----------
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// -------------Element UI----------------

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, {
  locale,
  size: 'medium',
})
//-------------Vue Chart------------------
import VCharts from 'v-charts'
Vue.use(VCharts)

// -------------Data Table---------------
import DataTables from 'vue-data-tables'
Vue.use(DataTables)

//---------- Meta ----------
import Meta from 'vue-meta'
Vue.use(Meta)

// Router Sync
import {
  sync
} from 'vuex-router-sync'

//---------- Vuex Store ----------
import store from '../../client/store/index'

//---------- NProgress ----------
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// ---------------create router--------------
import routes from './routes'
const router = new VueRouter({
  mode: 'history',
  routes: routes,
})


// Sync the router with the vuex store
sync(store, router)

// --------------App layout component---------------

import App from '../../client/layouts/AppLayout.vue'

Meteor.startup(() => {
  // Before each
  router.beforeEach((to, from, next) => {
    NProgress.start()

    if (!to.meta.notRequiresAuth) {
      // Check user
      if (!Meteor.loggingIn() && !Meteor.userId()) {
        next({
          path: '/login'
        })
      } else {
        next()
      }
    } else {
      next()
    }
  })

  // After each
  router.afterEach((to, from) => {
    NProgress.done()
  })

  // Start vue
  new Vue({
    router,
    store,
    ...App,
  }).$mount('app')
})