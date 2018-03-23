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

    <ve-pie :data="chartData"
            :settings="chartSettings"></ve-pie>

    <ve-histogram :data="chartData"
                  :settings="chartSettings1"></ve-histogram>

  </div>
</template>

<script>
import compareDate from '/imports/libs/compare-date'
import moment from 'moment'
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
      chartData: '',
      chartSettings: '',
      chartSettings1: '',
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
        // console.log(branch)
        return branch
        // && branch.shortName
      },
      userFullName() {
        let data = this.$store.getters['app/userFullName']
        // console.log(data)
        return data
      },
    }),
  },
  created() {
    let d1 = moment(moment().toDate()).format('L')
    // check student on time to pay
    compareDate()
    this.chartData = {
      columns: ['Total', 'Gender'],
      rows: [
        {
          Total: 200,
          Gender: 'Male',
          // cost: 1523,
          // profit: 1523,
          // growthRate: 0.12,
          // people: 100,
        },
        {
          Total: 150,
          Gender: 'Female',
          // cost: 1223,
          // profit: 1523,
          // growthRate: 0.345,
          // people: 100,
        },
      ],
    }
    ;(this.chartSettings = {
      dimension: 'Gender',
      metrics: 'Total',
      // dataType: 'KMB',
      selectedMode: 'single',
      hoverAnimation: false,
      radius: 100,
      offsetY: 200,
    }),
      (this.chartSettings1 = {
        metrics: ['Total', 'Gender'],
        dimension: ['Gender'],
      })
  },
}
</script>

<style>

</style>
