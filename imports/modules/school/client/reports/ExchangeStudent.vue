<template>
  <div>
    <div>
      <el-form :model="form"
               ref="form"
               :rules="rules"
               :inline="true"
               size="mini">
        <el-form-item label="Date"
                      prop="opts">
          <!-- <el-date-picker v-model="form.opts"
                          multiple
                          collapse-tags
                          clearable
                          placeholder="select">
          </el-date-picker> -->
          <el-date-picker v-model="form.opts"
                          type="daterange"
                          align="right"
                          unlink-panels
                          range-separator="To"
                          start-placeholder="Start date"
                          end-placeholder="End date"
                          :picker-options="pickerOptions">
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
                 <th>Gender</th>
                  <th>From</th>
                  <th>Type From</th>
                <!-- <th>Type</th> -->
                <th>To</th>
                <th>Type To</th>
                <!-- <th>KHR</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in tableData"
                  :key="index">
                <td align="center">{{ index + 1 }}</td>
                <td>{{ formatDate(doc.tranDate) }}</td>
                <td>{{ doc.name }}</td>
                <td>{{ doc.gender }}</td>
                <td>{{ doc.subjectFrom }}</td>
                <td>{{ doc.typeFrom }}</td>
                <td>{{ doc.subjectTo }}</td>
                <td>{{ doc.typeTo }}</td>

                <!-- <td>{{ formatNum(doc.totalUsd) }}</td> -->
                <!-- <td>{{ formatNum(doc.totalKhr) }}</td> -->
              </tr>
            </tbody>
            <!-- <tfoot>
              <tr>
                <td colspan="3"
                    class="title">Total</td>
                <td class="title">{{ formatNum(totalUsd) +' $' }}</td>
                <td class="title">{{ formatNum(totalKhr) + ' ៛' }}</td>
              </tr>
            </tfoot> -->

          </table>
<div style="width: 30%; float: right; display: inline-block;margin-top:3%;margin-bottom:3%;">
            <span class="title">Total All : {{ totalAll }}</span>
            <br>
            <span class="title">Female : {{ totalFemale }}</span>
          </div>
        </div>

      </div>
    </el-card>

  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import wrapCurrentDate from '/imports/client/lib/wrap-current-time'
import { Printd } from 'printd'
import Notify from '/imports/client/lib/notify'
import Lookup from '../lib/Lookup-Value'
import { lookupType } from '/imports/utils/lookup-methods'
//
import { findExchangeStudents } from '/imports/modules/school/api/report/exchangeStudent'
import { dateRangePickerOpts } from '/imports/client/lib/date-range-picker-opts'

const numeral = require('numeral')
export default {
  data() {
    return {
      loading: false,
      docOpts: Lookup.type,
      tableData: [],
      totalAll: 0,
      totalFemale: 0,
      reportDate: moment().toDate(),
      titles: [
        { label: 'Student', prop: 'student' },
        { label: 'Gender', prop: 'gender', width: '100px' },
        { label: 'Pay Date', prop: 'payDate' },
        { label: 'End Date', prop: 'endPayDate' },
      ],
      form: {
        opts:[ moment().toDate(),moment().toDate()],
      },
      rules: {
        opts: [{ required: true }],
      },
      pickerOptions: dateRangePickerOpts
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
      // let sDate = moment(this.form.opts[0]).startOf('day')
      // let eDate = moment(this.form.opts[1]).endOf('day')
      // let selector = {
      //   tranDate: {
      //     $gte: sDate,
      //     $lte: eDate,
      //   },
      // }

      this.tableData = []
     this.totalAll = 0
      this.totalFemale = 0

      findExchangeStudents
        .callPromise({selector:this.form})
        .then(result => {
          if (result.length > 0) {
            this.tableData = result

            _.forEach(result, o => {
              this.totalAll += 1
              if (o.gender == 'Female') {
                this.totalFemale += 1
              }
            })
          } else {
            this.tableData = []
            this.totalAll = 0
            this.totalFemale = 0
          }
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error.reason })
        })
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
        
            font-size: 30px;
             color: darkgray;
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
        // hide repeat header
        thead
        {
            display: table-row-group;
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
