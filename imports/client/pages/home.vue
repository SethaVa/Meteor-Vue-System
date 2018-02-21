<template>
  <div>
    <!-- <data-tables :data="tableData" >
        <el-table-column prop="date" label="Date" width="140" sortable="custom" >
        </el-table-column>
        <el-table-column prop="name" label="Name" width="120">
        </el-table-column>
        <el-table-column prop="address" label="Address">
        </el-table-column>
      </data-tables> -->

    <h1>Home Page</h1>
    <label>{{ userFullName }}</label>
    <label>Branch : {{ currentBranch }}</label>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Home',
  data() {
    const item = {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    }
    return {
      name: '',
      tableData: Array(20).fill(item),
    }
  },
  computed: {
    ...mapState({
      // currentUser(state) {
      //   console.log(state.app.currentUser)
      //   return state.app.currentUser // object
      // },
      currentBranch(state) {
        const branch = state.app.currentBranch
        console.log(branch)
        return branch
        // && branch.shortName
      },
      userFullName() {
        let data = this.$store.getters['app/userFullName']
        console.log(data)
        return data
      },
    }),
  },
}
</script>

<style>

</style>
