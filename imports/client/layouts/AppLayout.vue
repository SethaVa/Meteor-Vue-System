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
  mounted() {
    // this.branches();
    // this.meteorUser();
    // this.branches();
    // console.log(this.branches());
  },
  meteor: {
    $subscribe: {
      branches() {
        let branches = this.currentUser
          ? this.currentUser.profile.branchPermissions
          : []
        return [{ _id: { $in: branches } }]
      },
    },
    meteorUser() {
      this.$store.commit('app/updateCurrentUser', Meteor.user())
    },
    // company() {
    //   this.$store.commit("app/updateCompany", Company.findOne());
    // },
    branches() {
      this.$store.commit('app/updateCurrentBranches', Branches.find().fetch())
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.app.currentUser,
    }),
  },
}
</script>

<style lang="scss" scoped>
// @import '~imports/client/styles/aside-menu.scss';
</style>

