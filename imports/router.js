
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import _ from 'lodash';
//------ Module -----
import main from '/imports/client/routes';
import school from '/imports/modules/school/client/routes'
// import pos from '/imports/modules/pos/client/routes'

const router = new VueRouter({
  mode: 'history',
  routes: _.concat(main,school),
  // routes:main
})

export default router