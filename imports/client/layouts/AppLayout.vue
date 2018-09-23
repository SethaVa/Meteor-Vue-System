<template>
  <div>
    <transition name="fade"
                mode="out-in" appear>
      <!-- <login-layout></login-layout> -->
      <component :is="currentLayout"></component>
    </transition>
    <!-- Set progressbar -->
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import { Meteor } from 'meteor/meteor'
import { mapState } from 'vuex'

import Company from "../../api/company/company";
import Branches from '../../api/branches/branches'


import Layout from '/imports/layout'
export default {
  name: 'AppLayout',

    meteor: {
    $subscribe: {
      ['company']: [],
      ['branches']() {
        let branches = this.currentUser
          ? this.currentUser.profile.allowedBranches
          : []
        return [{ _id: { $in: branches } }]
      },
    },
    company() {
      const val = Company.findOne()
      this.$store.commit('app/updateCompany', val)
      return val
    },
    branches() {
      const val = Branches.find().fetch()
      this.$store.dispatch('app/updateAllowedBranches', val)
      return val
    },
    // meteorUser() {
    //   this.$store.commit('updateCurrentUser', Meteor.user())
    // },
  },
  computed: {
    currentLayout(){
    const currentLayout = this.$route.meta.layout==='login'
        ? Layout[this.$route.meta.layout]
        : Layout.main

      return currentLayout
    },
    ...mapState({
      currentUser: state => state.app.currentUser,  
      // currentUser(state){
      //   return state.app.currentUser
      // }
    }),
  },
   created() {
    //  this.$store.dispatch('updateAllowedBranches', ['001'])
    this.$store.dispatch('app/loadCurrentUser')
  },
  mounted() {
    // this.branches();
    // this.meteorUser()
    // this.branches();
    // console.log(this.branches());
  },

}
</script>

<style lang="scss">
// @import '~imports//client/styles/main.scss';
@import '~imports/client/styles/aside-menu-mini.scss';
@import '~imports/client/styles/aside-menu.scss';
</style>
