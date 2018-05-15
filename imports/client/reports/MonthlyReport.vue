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
        <div class="info-header">
          <span>Date : {{ formatDate(reportDate) }}</span>
        </div>
        <div class="tableShow">
          <table class="table-content">
            <thead>
              <tr>
                <th>No</th>
                <th>Date</th>
                <th>Name</th>
                <!-- <th>Type</th> -->
                <th>USD</th>
                <th>KHR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in tableData"
                  :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ formatDate(doc.tranDate) }}</td>
                <td>{{ daily }}</td>
                <!-- <td>{{ doc.referenceType }}</td> -->
                <td>{{ formatNum(doc.totalUsd) }}</td>
                <td>{{ formatNum(doc.totalKhr) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3"
                    class="title">Total</td>
                <td class="title">{{ formatNum(totalUsd) +' $' }}</td>
                <td class="title">{{ formatNum(totalKhr) + ' ៛' }}</td>
              </tr>
            </tfoot>

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
import { findMonthlyReport } from '../../api/Income/methods'

const numeral = require('numeral')
export default {
  data() {
    return {
      loading: false,
      docOpts: Lookup.type,
      tableData: [],
      totalUsd: 0,
      totalKhr: 0,
      daily: 'Daily Report',
      usd: 0,
      khr: 0,
      reportDate: moment().toDate(),
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
      let sDate = wrapCurrentDate(moment(this.form.opts))
      sDate = moment(sDate).format('YYYY-MM')
      let eDate = wrapCurrentDate(moment(this.form.opts).add(1, 'months'))
      eDate = moment(eDate).format('YYYY-MM')
      let selector = {
        tranDate: {
          $gte: new Date(sDate),
          $lte: new Date(eDate),
        },
      }
      this.tableData = []
      this.tableInEx = []
      this.totalUsd = 0
      this.totalKhr = 0

      // let currentDate = wrapCurrentDate(this.form.opts)
      // currentDate = this.formatDate(currentDate)
      findMonthlyReport
        .callPromise({ selector })
        .then(result => {
          if (result) {
            this.tableData = result
            _.forEach(result, o => {
              this.totalUsd += o.totalUsd
              this.totalKhr += o.totalKhr
            })
          }
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error })
        })

      // // Income And Expend
      // let selectorInEx = {
      //   tranDate: {
      //     $gte: new Date(sDate),
      //     $lte: new Date(eDate),
      //   },
      // }
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
      return moment(val).format('L')
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
