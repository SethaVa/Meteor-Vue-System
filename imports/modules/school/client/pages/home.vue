<template>
  <div>
    <div class="dashbord">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card :body-style="{ padding: '0px' }"
                   style="background-color:#FF512F">

            <div class="box-info clearfix">
              <span class="title">Student</span>

              <div class="bottom">
                <span class="time">Total </span>
                <span class="info">{{ totalStudent }}</span>
              </div>

            </div>
            <i class="fa fa-user-plus"></i>

          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card :body-style="{ padding: '0px' }"
                   style="background-color:#FF416C">
            <div class="box-info clearfix">
              <span class="title">Staff</span>

              <div class="bottom">
                <span class="time">Total </span>
                <span class="info">{{ totalStaff }}</span>
              </div>

            </div>
            <i class="fa fa-users"></i>

          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card :body-style="{ padding: '0px' }"
                   style="background-color:#4A00E0">
            <div class="box-info clearfix">
              <span class="title">Subject</span>

              <div class="bottom">
                <span class="time">Total </span>
                <span class="info">{{ totalSubject }}</span>
              </div>

            </div>
            <i class="fa fa-book"></i>

          </el-card>
        </el-col>

      </el-row>
    </div>
    <div class="dashbord">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card :body-style="{ padding: '0px' }"
                   style="background-color:#1E9600">
            <div class="box-info clearfix">
              <span class="title">Room</span>

              <div class="bottom">
                <span class="time">Total </span>
                <span class="info">{{ totalRoom }}</span>
              </div>

            </div>
            <i class="fa fa-line-chart"></i>

          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card :body-style="{ padding: '0px' }"
                   style="background-color:red">
            <div class="box-info clearfix">
              <span class="title">Class</span>

              <div class="bottom">
                <span class="time">Total </span>
                <span class="info">{{ totalClass }}</span>
              </div>

            </div>
            <i class="fa fa-chart-bar"></i>

          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card :body-style="{ padding: '0px' }"
                   style="background-color:pink">
            <div class="box-info clearfix">
              <span class="title">Payment</span>

              <div class="bottom">
                <span class="time">Total </span>
                <span class="info">{{ totalPayment }}</span>
              </div>

            </div>
            <i class="fa fa-pie-chart"></i>

          </el-card>
        </el-col>

      </el-row>
    </div>
    <div class="dashbord">
      <el-card :body-style="{ padding: '10px' }">
        <div>
          <ve-line :data="chartStudentData"
                   :settings="chartStudentSettings"></ve-line>
        </div>
        <!-- <img src="~examples/assets/images/hamburger.png"
             class="image"> -->
        <!-- <div style="padding: 14px;">
          <span>Yummy hamburger</span>
          <div class="bottom clearfix">
            <time class="time">{{ currentDate }}</time>
            <el-button type="text"
                       class="button">Operating button</el-button>
          </div>
        </div> -->
      </el-card>
    </div>

    <!-- <data-tables :data="tableData" >
        <el-table-column prop="date" label="Date" width="140" sortable="custom" >
        </el-table-column>
        <el-table-column prop="name" label="Name" width="120">
        </el-table-column>
        <el-table-column prop="address" label="Address">
        </el-table-column>
      </data-tables> -->

    <!-- <h1>Home Page</h1>
    <el-button type="primary"
               @click="handleExport">Export Data</el-button>
    <br>
    <h3>Full Name</h3>
    <label>{{ userFullName }}</label>
    <br>
    <h3>Check User is in roles</h3>
    ['super', 'admin']: {{ userIsInRole }}
    <br>
    <h3>{{ userIsInRole }}</h3>
    <br>
    <h3>Current User</h3>
    <vue-json-pretty :data="currentUser"
                     :deep="1" />
    <br> -->
    <!-- <avatar username="Darth Vader"
            initials="AS"
            :size="100">
    </avatar> -->
    <!-- <avatar :username="userFullName"
            :size="40"
            background-color="#FFC107"
            color="#EBEEF5"></avatar> -->
    <!-- <label>Branch : {{ currentBranch }}</label> -->

    <!-- <ve-pie :data="chartData"
            :settings="chartSettings"></ve-pie>

    <ve-histogram :data="chartData"
                  :settings="chartSettings1"></ve-histogram> -->

  </div>
</template>

<script>
import Notify from '/imports/client/lib/notify'
import _ from 'lodash'
import compareDate from '/imports/modules/school/util/compare-date'
import json2csv from 'json2csv'
import moment from 'moment'
import { mapState } from 'vuex'
// Json Pretty
import VueJsonPretty from 'vue-json-pretty'
import Avatar from 'vue-avatar'
//==================================================
// import { countStudents } from '/imports/modules/school/api/students/methods'
// import { countStaff } from '/imports/modules/school/api/staffs/methods'
// import { countRoom } from '/imports/modules/school/api/rooms/methods'
// import { countSubject } from '/imports/modules/school/api/subject/methods'
// import { countClass } from '/imports/modules/school/api/class-study/methods'
import {
  findStudentByType,
  countStudents,
  countStaff,
  countRoom,
  countClass,
  countSubject,
  countPayment,
} from '/imports/modules/school/api/dashbord/dashbord'

// var rowData = []
// for (let i = 1; i < 500; i++) {
//   rowData.push({
//     date: '01/0' + i + '/2018',
//     PartTime: 152 + i,
//     PFemale: 1523 + i,
//     FullTime: 0.12 + i,
//     FFemale: 100 + i,
//   })
// }

export default {
  name: 'Home',
  components: {
    VueJsonPretty,
    Avatar,
  },
  props: {
    doc: {
      type: Object,
      default: null,
    },
  },
  data() {
    // const item = {
    //   date: '2016-05-02',
    //   name: 'Tom',
    //   address: 'No. 189, Grove St, Los Angeles',
    // }
    return {
      userDoc: {},
      chartData: '',
      chartSettings: '',
      chartSettings1: '',
      name: '',
      totalStudent: 0,
      totalStaff: 0,
      totalRoom: 0,
      totalSubject: 0,
      totalClass: 0,
      totalPayment: 0,
      rowData: [],
      chartStudentData: [],
      chartStudentSettings: {},
      // tableData: Array(20).fill(item),
    }
  },
  computed: {
    ...mapState({
      currentUser(state) {
        return state.currentUser // object
      },
    }),
    userFullName() {
      return this.$store.getters['userFullName']
    },
    userIsInRole() {
      return this.$store.getters['userIsInRole'](['user'])
      // (['admin', 'super'])
      // return this.$store.getters['userIsInRole'](['pos'])
    },
  },
  mounted() {
    this.getStudentData()
    this.getStaffAmount()
    this.getRoomAmount()
    this.getSubjectAmount()
    this.getClassAmount()
    this.getStudentShowChart()
    this.getPayment()
    // console.log(moment().toDate())

    // check student on time to pay
    compareDate()

    // chart
    // this.chartData = {
    //   columns: ['Total', 'Gender'],
    //   rows: [
    //     {
    //       Total: 200,
    //       Gender: 'Male',
    //     },
    //     {
    //       Total: 150,
    //       Gender: 'Female',
    //     },
    //   ],
    // }
    // this.chartSettings = {
    //   dimension: 'Gender',
    //   metrics: 'Total',
    //   // dataType: 'KMB',
    //   selectedMode: 'single',
    //   hoverAnimation: false,
    //   radius: 100,
    //   offsetY: 200,
    // }
    // this.chartSettings1 = {
    //   metrics: ['Total', 'Gender'],
    //   dimension: ['Gender'],
    // }
    //=====================================
    // this.chartStudentData = {
    //   columns: ['date', 'PartTime', 'PFemale', 'FullTime', 'FFemale'],
    //   rows: rowData,
    // }

    // this.chartStudentSettings = {
    //   axisSite: { right: ['FullTime'] },
    //   yAxisType: ['normal'],
    //   yAxisName: ['rate'],
    // }
  },
  methods: {
    getStudentData() {
      countStudents
        .callPromise({})
        .then(result => {
          this.totalStudent = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    // Staff
    getStaffAmount() {
      countStaff
        .callPromise({})
        .then(result => {
          this.totalStaff = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    // Subject
    getSubjectAmount() {
      countSubject
        .callPromise({})
        .then(result => {
          this.totalSubject = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    // Room
    getRoomAmount() {
      countRoom
        .callPromise({})
        .then(result => {
          this.totalRoom = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    // Room
    getClassAmount() {
      let selector = {
        status: 'Active',
      }
      countClass
        .callPromise({ selector })
        .then(result => {
          this.totalClass = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    // Room
    getPayment() {
      let selector = {
        tranDate: {
          $gte: moment()
            .startOf('day')
            .toDate(),
          $lt: moment()
            .endOf('day')
            .toDate(),
        },
      }
      countPayment
        .callPromise({ selector })
        .then(result => {
          this.totalPayment = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    // Student Show in chart
    getStudentShowChart() {
      findStudentByType
        .callPromise({})
        .then(result => {
          _.forEach(result, o => {
            this.rowData.push({
              date: o._id,
              PartTime: o.totalPartTime,
              PFemale: o.totalPFemale,
              FullTime: o.totalFullTime,
              FFemale: o.totalFFemale,
            })
            this.chartStudentData = {
              columns: ['date', 'PartTime', 'PFemale', 'FullTime', 'FFemale'],
              rows: this.rowData,
            }

            this.chartStudentSettings = {
              // axisSite: { right: ['FullTime'] },
              // yAxisType: ['normal'],
              // yAxisName: ['rate'],
              labelMap: {
                ParTime: 'Total PartTime',
                PFemale: 'Female',
                FullTime: 'Total FullTime',
                FFemale: 'Female FullTime',
              },
            }
          })
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
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
        Notify.error({ message: error })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.dashbord {
  margin-top: 3vh;
  max-width: 100%;
  height: auto;
  .time {
    font-size: 20px;
    color: beige;
    font-weight: 600;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
    display: block;
  }

  .info {
    padding: 0;
    color: beige;
    font-size: 20px;
    font-weight: 600;
    float: right;
  }

  .image {
    /* width: 100%; */
    width: 100vh;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }
  .clearfix:after {
    clear: both;
  }
  .box-info {
    // position: absolute;
    float: left;
    padding: 14px;
  }
  .fa {
    font-size: 400%;
    /* padding: 2vh; */
    opacity: 0.2;
    top: 0;
    float: right;
    // color: dimgray;
    color: black;
    // position: relative;
  }
  .title {
    font-size: 24px;
    font-weight: 600;
    color: black;
    text-transform: uppercase;

    /* font-style: italic; */
  }
}
</style>
