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
          <el-select v-model="form.opts"
                     multiple
                     collapse-tags
                     clearable
                     placeholder="select">
            <el-option v-for="doc in docOpts"
                       :key="doc.value"
                       :value="doc.value"
                       :label="doc.label"></el-option>
          </el-select>
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

        <img src="/img/bwlogo.png"
             class="logo">
        <!-- Header -->
        <div class="header">
          <span class="headerKhmer">សាលាភាសាបរទេស ប៊ី អេ ឌី</span>
          <br>
          <span class="headerEn">B.A.D Foreign Language School</span>
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
                <th>Date</th>
                <th>Gender</th>
                <th>Pay Date</th>
                <th>End Pay Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in tableData"
                  :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ formatDate( doc.date) }}</td>
                <td>{{ formatNum(doc.totalSalary) }}</td>
                <td>{{ doc.payDate }}</td>
                <td>{{ doc.endPayDate }}</td>

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
import { findStaffSalary } from '../../api/Staffs/methods'
import { findSalary } from '../../api/payment/methods'

const numeral = require('numeral')
export default {
  data() {
    return {
      loading: false,
      docOpts: Lookup.type,
      tableData: [],
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
    // this.getTypeData()
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

    handleSubmit() {
      this.loading = true

      let selector = {
        type: { $in: this.form.opts },
        status: 'Paid',
      }

      let currentDate = wrapCurrentDate(moment().toDate())
      currentDate = this.formatDate(currentDate)
      findSalary
        .callPromise({ selector })
        .then(result => {
          let partTimeRate = result.salaryRate[0].partTime / 100
          // console.log(currentDate)
          _.forEach(result.data, o => {
            // console.log(o._id, this.loopDate(o.payDate, o.endPayDate))
            let loopGetDate = this.loopDate(o.payDate, o.endPayDate)
            _.forEach(loopGetDate, d => {
              if (moment(currentDate).isSame(d.date)) {
                // console.log(o.totalPay * partTimeRate / o.duration)
                this.tableData.push({
                  date: d.date,
                  totalSalary: o.totalPay * partTimeRate / o.duration,
                })
              }
            })
          })
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    handlePrint() {
      const reportCSS = `
      .logo {
          width: 140px;
          height: 100px;
          position: absolute;
        }
      .header {
          position: relative;
          left: 20%;
          top: 30%;
          right: 0%;
          bottom: 0%;
        }
        .header>.headerKhmer {
          font-size: 35px;
          font-family: 'Moul', Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
          color: darkgray;
          margin-left: 5vh;
        }
        .header>.headerEn {
          font-size: 33px;
          font-family: 'Times New Roman', Times, serif;
          color: darkgray;
          margin-left: 8vh;
          margin-top: -3vh;
        }
        .table-content {
          border-collapse: collapse;
          width: 100%;
        }
        .info-class {
          position: relative;
        margin-top: 4vh;
      }

      .info-class>.clLeft {
          font-size: 12px;
          position: absolute;
          top: 35%;
          width: 10%;
          left: 10%;
      }

      .info-class>.clCenter {
          font-size: 12px;
          position: absolute;
          margin-left: 10vh;
          top: 35%;
          left: 35%;
      }

      .info-class>.clRight {
          font-size: 12px;
          position: absolute;
          left: 80%;
          top: 35%;
      }
      .tableShow {
          font-size: 12px;
          margin-top: 10vh;
      }
       .tableShow .table-content,
      th,
      td {
          border: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
          padding: 5px;
      }

       .tableShow th {
          background-color: #ddd;
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
