// Import client startup through a single index entry point
//------------------Plugin-------------------
import '/imports/plugin'


import {
  Meteor
} from 'meteor/meteor'
import Vue from 'vue'

// ---------------Router--------------
import router from './router'

// Router Sync
import {
  sync
} from 'vuex-router-sync'

//---------- Vuex Store ----------
import store from '/imports/store'
// Sync the router with the vuex store
sync(store, router)

//---------- NProgress ----------
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// --------------App layout component---------------
import App from '/imports/client/layouts/AppLayout'

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