<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6" ><el-card :body-style="{ padding: '0px' }" >
        <i class="fa fa-user-plus image"></i>
        <!-- <img src="img/logo.png" class="image"> -->
        <div style="padding: 14px;">
          <span>Student</span>
          <div class="bottom clearfix">
            <time class="time">{{ currentDate }}</time>
            <el-button type="text" class="button">Operating button</el-button>
          </div>
        </div>
      </el-card></el-col>
      <el-col :span="6" ><el-card shadow="hover">
        Hover
      </el-card></el-col>
      <el-col :span="6" ><el-card shadow="hover">
        Hover
      </el-card></el-col>
      <el-col :span="6" ><el-card shadow="hover">
        Hover
      </el-card></el-col>
    </el-row>
    <!-- <data-tables :data="tableData" >
        <el-table-column prop="date" label="Date" width="140" sortable="custom" >
        </el-table-column>
        <el-table-column prop="name" label="Name" width="120">
        </el-table-column>
        <el-table-column prop="address" label="Address">
        </el-table-column>
      </data-tables> -->

    <h1>Home Page</h1>
    <el-button type="primary"
               @click="handleExport">Export Data</el-button>
    <label>{{ userFullName }}</label>
    <!-- <label>Branch : {{ currentBranch }}</label> -->

    <ve-pie :data="chartData"
            :settings="chartSettings"></ve-pie>

    <ve-histogram :data="chartData"
                  :settings="chartSettings1"></ve-histogram>

  </div>
</template>

<script>
import Notify from '/imports/client/libs/notify'
import _ from 'lodash'
import compareDate from '/imports/libs/compare-date'
import json2csv from 'json2csv'
import moment from 'moment'
import { mapState } from 'vuex'
import { Session } from 'meteor/session'
export default {
  name: 'Home',
  data() {
    const item = {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    }
    return {
      userDoc: {},
      chartData: '',
      chartSettings: '',
      chartSettings1: '',
      name: '',
      tableData: Array(20).fill(item),
    }
  },
  computed: {
    ...mapState({
      currentUser(state) {
        return state.app.currentUser // object
      },
    }),
    // currentBranch(state) {
    //   const branch = state.app.currentBranch
    //   // console.log(branch)
    //   return branch
    //   // && branch.shortName
    // },
    userFullName() {
      return this.$store.getters['app/userFullName']
    },
  },
  created() {
    this.userDoc = _.clone(Session.get('UserDoc'))
    console.log('userDoc ', this.userDoc)
    console.log('Session.get ', Session.get('UserDoc'))
    let d1 = moment(moment().toDate()).format('L')
    // check student on time to pay
    compareDate()
    this.chartData = {
      columns: ['Total', 'Gender'],
      rows: [
        {
          Total: 200,
          Gender: 'Male',
        },
        {
          Total: 150,
          Gender: 'Female',
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
  methods: {
    handleExport() {
      const Json2csvParser = require('json2csv').Parser
      try {
        const fields = ['car', 'price', 'color']
        const myCars = [
          {
            car: 'Audi',
            price: 40000,
            color: 'blue',
          },
          {
            car: 'BMW',
            price: 35000,
            color: 'black',
          },
          {
            car: 'Porsche',
            price: 60000,
            color: 'green',
          },
        ]

        // const json2csvParser = new Json2csvParser({ fields })
        // const csv = json2csvParser.parse(myCars)
        let result = json2csv({
          data: myCars,
          fields: fields,
        })
        let csvContent = 'data:text/csvcharset=GBK,\uFEFF' + result
        let encodedUri = encodeURI(csvContent)
        let link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `test.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        // console.log(csv)
        Notify.success({ message: 'Success' })
      } catch (error) {
        console.log(error.reason)
        Notify.error({ message: error })
      }
    },
  },
}
</script>

<style>
.time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    /* width: 100%; */
    width:100vh;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
