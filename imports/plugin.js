import Vue from 'vue'

// -------------Element UI----------------

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, {
  locale,
  size: 'medium',
})


//---------- Meta ----------
import Meta from 'vue-meta'
Vue.use(Meta)


//-------------Vue Chart------------------
import VCharts from 'v-charts'
Vue.use(VCharts)

// Tracker
import VueMeteorTracker from 'vue-meteor-tracker'
Vue.use(VueMeteorTracker)
Vue.config.meteor.freeze = true

// -------------Data Table---------------
import DataTables from 'vue-data-tables'
Vue.use(DataTables)

// Vue Progressbar
import VueProgressBar from 'vue-progressbar'
const vProgressOpts = {
  color: '#409eff',
  failedColor: '#f56c6c',
  thickness: '3px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300,
  },
  autoRevert: true,
  location: 'top',
  inverse: false,
}
Vue.use(VueProgressBar, vProgressOpts)

// Animate CSS
import 'animate.css/animate.min.css'

//  Font Awesome 5
import '/imports/client/styles/fontawesome-all.css'
//plugin
import VueLodash from '/imports/client/plugins/vue-lodash'
Vue.use(VueLodash)
import VueMoment from '/imports/client/plugins/vue-moment'
Vue.use(VueMoment)
import VueNumeral from '/imports/client/plugins/vue-numeral'
Vue.use(VueNumeral)
import LocalFilters from '/imports/client/plugins/filters'
Vue.use(LocalFilters)