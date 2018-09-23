

// --------------------Modules-------------------
import MainAside from '/imports/client/AsideMenu.vue'
import MainHeader from '/imports/client/HeaderMenu'
import SchoolAside from '/imports/modules/school/client/AsideMenu.vue'
import SchoolHeader from '/imports/modules/school/client/HeaderMenu.vue'

let aside = [MainAside,SchoolAside]
let header = [MainHeader,SchoolHeader]

const navigation = {aside,header}

export default navigation