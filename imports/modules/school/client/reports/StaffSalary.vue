<template>
  <div>
    <div>
      <el-form :model="form"
               ref="form"
               :rules="rules"
               :inline="true"
               size="mini">
               <el-form-item label="Date"
                      prop="dateOpt">
          
          <el-date-picker v-model="form.dateOpt"
                          type="daterange"
                          align="right"
                          unlink-panels
                          range-separator="To"
                          start-placeholder="Start date"
                          end-placeholder="End date"
                          :picker-options="pickerOptions">
          </el-date-picker>
      </el-form-item>
        <!-- <el-form-item label="Option"
                      prop="opts">
          <el-date-picker v-model="form.opts"
                          multiple
                          collapse-tags
                          clearable
                          placeholder="select">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item>
            <el-button type="primary"
                       @click="handleSubmit">Submit</el-button>
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
          <span>Date : {{ reportDate }}</span>
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
                <th style="width:20px;">No</th>
                <th>Name</th>
                <th style="width:30px;">Gender</th>
                <!-- <th>Position</th> -->
                <!-- <th>Type</th> -->
                <th style="text-align:center">Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in tableData"
                  :key="index">
                <td align="center">{{ index + 1 }}</td>
                <td>{{ doc.name }}</td>
                <td>{{ doc.gender }}</td>
                <!-- <td>{{ doc.position }}</td> -->
                <!-- <td>{{ doc.type }}</td> -->
                <td style="font-weight:400;" align="right">{{ formatNum(doc.totalSalary) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3"
                    class="title">Total</td>
                <td class="title" align="right">{{ formatNum(totalSalary) +' $' }}</td>
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
import wrapCurrentDate from '/imports/client/lib/wrap-current-time'
import { Printd } from 'printd'
import Notify from '/imports/client/lib/notify'
import Lookup from '../lib/Lookup-Value'
import { lookupType } from '/imports/utils/lookup-methods'
//
import { findSalary } from '/imports/modules/school/api/report/salary'
import { dateRangePickerOpts } from '/imports/client/lib/date-range-picker-opts'

const numeral = require('numeral')

export default {
  data() {
    return {
      loading: false,
      tableData: [],
      totalSalary: 0,
      // reportDate: moment().toDate(),
      titles: [
        { label: 'Student', prop: 'student' },
        { label: 'Gender', prop: 'gender', width: '100px' },
        { label: 'Pay Date', prop: 'payDate' },
        { label: 'End Date', prop: 'endPayDate' },
      ],
      pickerOptions:dateRangePickerOpts,
      form: {
        dateOpt:[moment().toDate(), moment().toDate()],
      },
      rules: {
        dateOpt: [{ required: true }],
      },
    }
  },
  computed:{
    reportDate(){
      return `${moment(this.form.dateOpt[0]).format('DD/MM/YYYY')}-${moment(this.form.dateOpt[1]).format('DD/MM/YYYY')}`
    }
  },
  mounted() {
    this.d = new Printd()
  },
  methods: {
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          
          this.totalSalary = 0

          findSalary
            .callPromise({ selector:this.form.dateOpt })
            .then(result => {
              if (result) {
                _.forEach(result, o => {
                  this.totalSalary += o.totalSalary
                })
                this.tableData = result
              }
              this.loading = false
            })
            .catch(error => {
              Notify.error({ message: error })
            })
        } else {
          return false
        }
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
      return moment(val).format('YYYY-MM')
    },
    formatDateReport(val) {
      return moment(val).format('DD/MM/YYYY')
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
