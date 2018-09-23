<template>
  <div>
    <h1>Demo Page</h1>
   
    <h4>Current User</h4>
    <vue-json-pretty :deep="1"
                     :data="currentUser">
    </vue-json-pretty>
    <h4>Full Name</h4>
    <vue-json-pretty
      :data="userFullName"
    ></vue-json-pretty>
    <h4>Current Branch</h4>
    <vue-json-pretty :deep="1"
                     :data="currentBranch">
    </vue-json-pretty>
    <h4>BranchId</h4>
    <vue-json-pretty
      :data="currentBranchId"
    ></vue-json-pretty>
    <h4>Compay</h4>
    <vue-json-pretty :deep="1"
                     :data="company">
    </vue-json-pretty>
    <h4>Allow Branch</h4>
    <vue-json-pretty :deep="1"
                     :data="allowedBranches">
    </vue-json-pretty>
    <h4>Allow Branch Opts</h4>
    <vue-json-pretty
      :data="allowedBranchOpts"
    ></vue-json-pretty>
    <h4>User Inrole</h4>
    <vue-json-pretty :deep="1"
                     :data="userIsInRole">
    </vue-json-pretty>
    <hr>
    <div>
      Format Number: {{ 123456.789 | number }}
      <span v-html="'{{123456.789 | number}}'"></span>
    </div>
    <div>
      Format Currency: {{ 123456.789 | currency }}
      <span v-html="'{{123456.789 | currency}}'"></span>
    </div>
    <div>
      Format Date: {{ $moment().toDate() | date }}
      <span v-html="'{{$moment().toDate() | date}}'"></span>
    </div>
    <div>
      Format DateTime: {{ $moment().toDate() | dateTime }}
      <span v-html="'{{$moment().toDate() | dateTime}}'"></span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

// Json Pretty
import VueJsonPretty from 'vue-json-pretty'

export default {
  name: 'Home',
  components: {
    VueJsonPretty,
  },
  data() {
    return {}
  },
  computed: {
   ...mapState({
      company(state) {
        return state.app.company
      },
      currentUser(state) {
        return state.app.currentUser
      },
      currentBranch(state) {
        return state.app.currentBranch
      },
      allowedBranches(state) {
        return state.app.allowedBranches
      },
    }),
    userFullName() {
      return this.$store.getters['app/userFullName']
    },
    currentBranchId() {
      return this.$store.getters['app/currentBranchId']
    },
    allowedBranchOpts() {
      return this.$store.getters['app/allowedBranchOpts']
    },
    // Check use is in roles
    userIsInRole() {
      return this.$store.getters['app/userIsInRole'](['super', 'admin'])
    },
  },
}
</script>

<style>
</style>
