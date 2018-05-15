<template>
  <div>
    <div>
      <el-form :model="form"
               ref="form"
               :rules="rules"
               :inline="true"
               size="mini">
        <el-form-item label="Option"
                      prop="opts">
          <el-date-picker v-model="form.opts"
                          multiple
                          collapse-tags
                          clearable
                          placeholder="select">
          </el-date-picker>
          <el-form-item>
            <el-button type="primary"
                       @click="handleSubmit">Submit</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <!-- <span>Card name</span> -->
        <div style="float: right; padding: 3px 0">
          <el-button size="mini"
                     type="text"
                     @click="handlePrint">
            <i class="el-icon-printer"> Print</i>
          </el-button>
          <!-- <el-button size="mini"
                     type="text"
                     @click="getData()">GetData</el-button> -->
        </div>

      </div>
      <div v-loading="loading"
           id="tableStudent">

        <div class="report-header">
          <div class="logo">
            <img src="/img/bwlogo.png">
          </div>
          <!-- Header -->
          <div class="header">
            <span class="headerKhmer">សាលាភាសាបរទេស ប៊ី អេ ឌី</span>
            <br>
            <span class="headerEn">B.A.D Foreign Language School</span>
          </div>
        </div>
        <!-- Info Class -->
        <!-- <div class="info-class">
          <div class="clLeft">
            <label>Teacher : Dara</label><br><br>
            <label>Room : Dara</label>
          </div>

          <div class="clCenter">
            <label>Subject : IntroA</label>
          </div>
          <div class="clRight">
            <label>Time : 1:00-2:00</label><br><br>
            <label>Room : Dara</label>
          </div>
        </div> -->
        <div class="tableShow">
          <table class="table-content">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in tableData"
                  :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ doc.name }}</td>
                <td>{{ doc.gender }}</td>
                <td>{{ doc.position }}</td>
                <td>{{ formatNum(doc.totalSalary) }}</td>
                <td>{{ doc.type }}</td>
              </tr>
            </tbody>

          </table>

        </div>

      </div>

    </el-card>

  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import wrapCurrentDate from '/imports/client/libs/wrap-current-time'
import { Printd } from 'printd'
import Notify from '/imports/client/libs/notify'
import Lookup from '../libs/Lookup-Value'
import { lookupType } from '/imports/libs/lookup-methods'
//
import { findStaff } from '../../api/Staffs/methods'
import { findStaffSalary } from '../../api/Staffs/methods'
import { findSalary } from '../../api/payment/methods'

const numeral = require('numeral')
export default {
  data() {
    return {
      loading: false,
      docOpts: Lookup.type,
      tableData: [],
      classDetails: [],
      staffDoc: [],
      salaryDoc: [],
      titles: [
        { label: 'Student', prop: 'student' },
        { label: 'Gender', prop: 'gender', width: '100px' },
        { label: 'Pay Date', prop: 'payDate' },
        { label: 'End Date', prop: 'endPayDate' },
      ],
      form: {
        opts: '',
      },
      rules: {
        opts: [{ required: true }],
      },
    }
  },
  mounted() {
    this.d = new Printd()
    this.getStaff()
  },
  methods: {
    getTypeData() {
      lookupType
        .callPromise()
        .then(result => {
          this.docOpts = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    getStaff() {
      findStaff
        .callPromise({})
        .then(result => {
          this.staffDoc = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },

    handleSubmit() {
      this.loading = true

      // let selector = {
      //   type: 'Part Time',
      //   // status: 'Paid',
      // }
      this.salaryDoc = []
      this.classDetails = []
      let currentDate = wrapCurrentDate(this.form.opts)
      currentDate = this.formatDate(currentDate)
      findSalary
        .callPromise({})
        .then(result => {
          if (result) {
            // let partTimeRate = result.salaryRate[0].partTime / 100
            // console.log(currentDate)
            _.forEach(result.data, o => {
              // _.forEach(o.classDetails, obj => {
              //   this.classDetails.push(obj)
              // })

              // console.log(o._id, this.loopDate(o.payDate, o.endPayDate))
              _.forEach(o.classDetails, obj => {
                if (o.type == 'Part Time' && o.status == 'Paid') {
                  let loopGetDate = this.loopDate(obj.payDate, obj.endPayDate)
                  // console.log(obj)
                  _.forEach(loopGetDate, d => {
                    // console.log(d)
                    if (moment(currentDate).isSame(d.date)) {
                      this.salaryDoc.push({
                        staffId: o.staffId,
                        name: o.name,
                        date: d.date,
                        salary:
                          obj.totalPay *
                          (obj.rate.partTime / 100) /
                          obj.duration,
                      })
                    }
                  })
                }
              })
            })
            // _.forEach(result, o => {
            //   this.tableData.push(o)
            // })
          }
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error })
        })
      // console.log(this.staffDoc, typeof this.salaryDoc)
      this.tableData = []
      for (let o in this.salaryDoc) {
        console.log(this.salaryDoc[o])
      }

      _.forEach(this.staffDoc, o => {
        _.forEach(this.salaryDoc, obj => {
          if (o._id == obj.staffId) {
            o.totalSalary += o.salary
          }
          this.tableData.push({
            name: o.name,
            date: o.date,
            totalSalary: o.totalSalary,
          })
        })
      })
      // console.log(this.classDetails)
      // _.forIn(this.classDetails, o => {
      //   console.log(o)
      // })
      // _.forEach(this.classDetails, obj => {
      //   console.log(obj)
      //   // let loopGetDate = this.loopDate(obj.payDate, obj.endPayDate)
      //   // console.log(obj)
      //   // _.forEach(loopGetDate, d => {
      //   //   // console.log(d)
      //   //   if (moment(currentDate).isSame(d.date)) {
      //   //     console.log('true')
      //   //     // console.log(o.totalPay * partTimeRate / o.duration)
      //   //     // this.tableData.push({
      //   //     //   date: d.date,
      //   //     //   totalSalary: o.totalPay * partTimeRate / o.duration,
      //   //     // })
      //   //   }
      //   // })
      // })
    },
    handlePrint() {
      const reportCSS = `
      .logo>img {
          float:left;
          // position: absolute;
        }
      img{
         width: 140px;
          height: 100px;
      }
        .report-header>header{
          content: "";
          clear: both;
          // display: table;
        }
      .header {
          
          text-align: center;
          padding-bottom: 10px;
          width: 80%;
          margin-left:20px;
        }
        .header >.headerKhmer {
        
            font-size: 33px;
            font-weight: 500;
            padding-top: 10px;
            font-family: 'Moul', PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
        }
        .header >.headerEn {
          font-size: 25px;
          font-family: Times New Roman;
          color: darkgray;
         
        }
        .table-content {
          border-collapse: collapse;
          width: 100%;
        }
        .info-class {
          position: relative;
          height:10vh;
      }

      .info-class>.clLeft {
          font-size: 14px;
          position: absolute;
          top: 35%;
          max-width: 20%;
          left: 5%;
      }

      .info-class>.clCenter {
          font-size: 14px;
          position: absolute;
          margin-left: 10vh;
          top: 35%;
          left: 25%;
      }

      .info-class>.clRight {
          font-size: 14px;
          position: absolute;
          left: 70%;
          top: 35%;
      }
      .tableShow {
          font-family: sans-serif;
          font-size: 12px;
          
      }
       .tableShow .table-content,
      th,
      td {
          // border: 1px solid #ddd;
           border: 0.1px solid #606266;
          // border-bottom: 1px solid #ddd;
          border-bottom: 0.1px solid #606266;
          padding: 5px;
      }

       .tableShow th {
          background-color: #ddd;
        }
        
        .title {
            font-size:14px;
            text-align: center;
            font-weight: 700;
            color: black;
        }

        .info-header {
            margin-top: 2vh;
            height: 4vh;
            text-align: center;
            font-size: 14px;
            font-weight: 500;
            font-style: initial oblique;
        }
      `
      this.d.print(document.getElementById('tableStudent'), reportCSS)
    },

    formatDate(val) {
      return moment(val).format('YYYY-MM')
    },
    formatNum(val) {
      return numeral(val).format('0,0.00')
    },
    // function loop Date
    loopDate(from, to) {
      let data = []

      for (let m = from; m < to; m.setMonth(m.getMonth() + 1)) {
        data.push({ date: this.formatDate(m) })
      }

      return data
    },
  },
}
</script>

<style lang="scss">
@import '../styles/report.scss';
</style>
