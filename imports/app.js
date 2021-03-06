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
// Old
Meteor.startup(() => {
  // Before each
  router.beforeEach((to, from, next) => {
    NProgress.start()
// console.log('to',to);
// console.log('frm',from);
// console.log('next',next);
// console.log('meta',to.meta.notRequiresAuth);
// console.log('login',Meteor.loggingIn() ,'User',Meteor.userId());
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

// New
// Meteor.startup(() => {
//   // Start the vue app
//   const app = new Vue({
//     router,
//     store,
//     ...App,
//   }).$mount('app')

//   // Before each
//   app.$router.beforeEach((to, from, next) => {
//     app.$Progress.start()
// console.log('to',to);
// console.log('from',from);
// console.log('next',next);
// console.log('meta',to.meta.notRequiresAuth);
//     // if (!to.meta.notRequiresAuth) {
//     //   console.log('login',Meteor.loggingIn(),'User', !Meteor.userId());
//     //          // Check user
//     //   if (!Meteor.loggingIn() && !Meteor.userId()) {
//     //     next({
//     //       path: '/login'
//     //     })
//     //   } else {
//     //     next()
//     //   }
//     // } else {
//     //   next()
//     // } !auth.loggedIn()
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//       if (!Meteor.userId()) {
//         next({
//           path: '/login',
//           query: {
//             redirect: to.fullPath,
//           },
//         });
//       } else {
//         next();
//       }
//     }
//   })

//   // // After each
//   app.$router.afterEach((to, from) => {
//     app.$Progress.finish()
//   })
// })