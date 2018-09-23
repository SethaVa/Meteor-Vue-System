import {Meteor} from 'meteor/meteor'

// --------------------Modules-------------------
// import MainAside from '/imports/client/AsideMenu.vue'
// import MainHeader from '/imports/client/HeaderMenu'
import SchoolAside from '/imports/modules/school/client/AsideMenu.vue'
import SchoolHeader from '/imports/modules/school/client/HeaderMenu.vue'
import DemoAside from '/imports/modules/demo/client/AsideMenu.vue'
import DemoHeader from '/imports/modules/demo/client/HeaderMenu.vue'

let aside = [SchoolAside]
let header = [SchoolHeader]

// Dev Mode
if (Meteor.isDevelopment) {
  header.push(DemoHeader)
  aside.push(DemoAside)
}

const navigation = {aside,header}

export default navigation