<template>
  <div>
    <!-- <fieldset>
      <legend>Option</legend> -->
      <el-form :model="form"
               ref="form"
               :rules="rules"
               :inline="true"
               size="mini">

        <el-form-item label="Filter"
                      prop="status">
          <el-select v-model="form.status"
                     placeholder="Please Selecte">
            <el-option v-for="doc in statusOpts"
                       :key="doc.value"
                       :label="doc.label"
                       :value="doc.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Type"
                      prop="type">
          <el-select v-model="form.type"
                     multiple
                     clearable
                     collapse-tags
                     placeholder="Please Selecte Type">
            <el-option v-for="doc in typeOpts"
                       :key="doc.value"
                       :label="doc.label"
                       :value="doc.value"></el-option>
          </el-select>
        </el-form-item>

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
        <el-form-item label="">
          <el-button type="primary"
                     @click="handleSubmit">Submit</el-button>
        </el-form-item>
      </el-form>
    <!-- </fieldset> -->

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
      <div id="tableStudent"
           v-loading="loading">

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
        <div class="info-header">
          <span>Date : {{ formatDate(reportDate) }}</span>
        </div>
        <!-- <slot v-show="infoShow">
          <div class="info-class">
            <div class="clLeft">
              <label>Teacher : {{ teacherName }}</label><br><br>
              <label>Room : {{ roomName }}</label>
            </div>

            <div class="clCenter">
              <label>Subject : {{ subjectName }}</label>
            </div>
            <div class="clRight">
              <label>Time : {{ formatTime( timeStudy ) }}</label><br><br>
              <label>Room : {{ roomName }}</label>
            </div>
          </div>
        </slot> -->
        <div class="tableShow">
          <table class="table-content">
            <thead>
              <tr>
                <th>No</th>
                <th>Code</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Subject</th>
                <th>Room</th>
                <th>Time</th>
                <th>End Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in tableData"
                  :key="index">
                <td align="center">{{ index + 1 }}</td>
                <td>{{ doc._id }}</td>
                <td>{{ doc.studentName }}</td>
                <td>{{ doc.gender }}</td>
                <td>{{ doc.subject }}</td>
                <!-- <td>{{ formatDate (doc.registerDate) }}</td> -->
                <td>{{ doc.roomName }}</td>
                <td>{{ formatTime(doc.timeStudy) }}</td>
                <td>{{ formatDate( doc.endPayDate) }}</td>
                <td>{{ doc.type }}</td>
              </tr>
            </tbody>

          </table>
          <div style="width: 30%; float: right; display: inline-block;margin-top:3%;margin-bottom:3%;">
            <span class="title">Total All : {{ totalAll }}</span>
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

import Notify from '/imports/client/lib/notify'
import wrapCurrentTime from '/imports/client/lib/wrap-current-time'
import Lookup from '../lib/Lookup-Value'
import { lookupClass } from '/imports/util/lookup-methods'
import { findStudentDebt } from '../../api/report/studentDebt'
import { Printd } from 'printd'
import toCss from 'to-css'
import { dateRangePickerOpts } from '/imports/client/lib/date-range-picker-opts'

// const toCss = require('to-css')
import reportCSS from '../styles/reportCss'

export default {
  name: 'StudentDebt',
  data() {
    return {
      totalAll: 0,
      totalFemale: 0,
      typeOpts: Lookup.type,
      reportDate: moment().toDate(),
      statusOpts: [
        { label: 'Not Paid', value: 'Expire' },
        { label: 'Debt', value: 'Debt' },
        // { label: 'Paid', value: 'Paid' },
      ],
      form: {
        status: '',
        type: '',
        dateOpt:[moment().toDate(), moment().toDate()],

      },
      pickerOptions:dateRangePickerOpts,
     
      loading: false,
      tableData: [],
      titles: [
        { label: 'Student', prop: 'studentName' },
        { label: 'Gender', prop: 'gender', width: '100px' },
        { label: 'Subject', prop: 'subject' },
        { label: 'Room', prop: 'roomName' },
        { label: 'Time', prop: 'timeStudy' },
        { label: 'End Date', prop: 'endPayDate' },
        { label: 'Type', prop: 'type' },
      ],
      itemProp: false,
      infoShow: false,
      teacherName: '',
      roomName: '',
      subjectName: '',
      timeStudy: [],

      // classIdOpts: [],
      // form: {
      //   start: '',
      //   end: '',
      // },
      rules: {
        status: [{ required: true }],
        type: [{ required: true }],
        dateOpt:[{required:true}]
      },
    }
  },
  mounted() {
    this.d = new Printd()
    // this.getClassData()
  },
  methods: {
    getData() {
      this.tableData = []
      for (let i = 1; i <= 100; i++) {
        this.tableData.push({
          student: 'Logn Dara' + i,
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '2018/2/' + i,
        })
      }
    },
    handleOptChange(val) {
      if (val === '2') {
        this.itemProp = true
      } else {
        this.itemProp = false
      }
    },
    getClassData() {
      lookupClass
        .callPromise({})
        .then(result => {
          this.classIdOpts = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          let dateF = moment(this.form.dateOpt[0]).startOf('day').toDate()
          let dateT = moment(this.form.dateOpt[1]).endOf('day').toDate() 

          let selector = {
            type: { $in: this.form.type },
            status: this.form.status,
            tranDate:{
              $gte:dateF,
              $lte:dateT
            }
          }
          this.totalAll = 0
          this.totalFemale = 0
          findStudentDebt
            .callPromise({ selector })
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
              Notify.error({ message: error })
            })
        } else {
          return false
        }
      })
    },
    handlePrint() {
      // font-family: Times New Roman, Times, serif;
      // font-family: Moul, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;

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
        margin-top: 4vh;
      }

      .info-class>.clLeft {
          font-size: 14px;
          position: absolute;
          top: 35%;
          width: 20%;
          left: 10%;
      }

      .info-class>.clCenter {
          font-size: 14px;
          position: absolute;
          margin-left: 10vh;
          top: 35%;
          left: 35%;
      }

      .info-class>.clRight {
          font-size: 14px;
          position: absolute;
          left: 80%;
          top: 35%;
      }
      .tableShow {
          font-family: sans-serif;
          font-size: 12px;
          // margin-top: 10vh;
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
        
        .title {
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
      return moment(val).format('DD/MM/YYYY')
    },
    formatTime(val) {
      let data = val
        .map(o => {
          return moment(o).format('LT')
        })
        .join('-')
      return data
    },
  },
}
</script>

<style lang="sass">
@import '../styles/report.scss';
</style>
