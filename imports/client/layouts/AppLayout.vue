<template>
  <div v-if="$route.meta.layout === 'login'">
    <login-layout></login-layout>
  </div>
  <div v-else>
    <main-layout></main-layout>
  </div>
</template>

<script>
import { Meteor } from 'meteor/meteor'
import _ from 'lodash'
import moment from 'moment'
import { mapState } from 'vuex'

// import Company from "../../api/company/company";
import Branches from '../../api/branches/branches'

import MainLayout from './MainLayout.vue'
import LoginLayout from './LoginLayout.vue'
export default {
  name: 'AppLayout',
  components: {
    MainLayout,
    LoginLayout,
  },
  computed: {
    ...mapState({
      currentUser: state => state.app.currentUser,
    }),
  },
  mounted() {
    // this.branches();
    // this.meteorUser()
    // this.branches();
    // console.log(this.branches());
  },
  meteor: {
    meteorUser() {
      this.$store.commit('updateCurrentUser', Meteor.user())
    },
  },
}
</script>

<style lang="scss">
@import '~imports/client/styles/aside-menu-mini.scss';
// @import '../styles/aside-menu.scss';
@import '~imports/client/styles/aside-menu.scss';
</style>
