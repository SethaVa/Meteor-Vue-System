
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import _ from 'lodash';
//------ Module -----
import main from '/imports/client/routes';
// import demo from '/imports/modules/demo/client/routes'
// import pos from '/imports/modules/pos/client/routes'

const router = new VueRouter({
  mode: 'history',
  routes: _.concat(main),
  // routes:main
})

export default router