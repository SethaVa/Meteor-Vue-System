<template>
  <div>
    <fieldset>
      <legend>Option</legend>
      <el-form :model="form"
               ref="form"
               :rules="rules"
               :inline="true"
               size="mini">

        <!-- <el-form-item label="Start"
                      prop="start">
          <el-date-picker v-model="form.start"
                          placeholder="Select Date"
                          :picker-options="optionStart"></el-date-picker>
        </el-form-item> -->

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

        <!-- <el-form-item label="To"
                      prop="end">
          <el-date-picker v-model="form.end"
                          placeholder="Select Date"
                          :picker-options="optionStart"></el-date-picker>
        </el-form-item> -->

        <!-- <slot v-if="itemProp">
          <el-form-item label="Subject"
                        prop="classId">
            <el-select v-model="form.classId">
              <el-option v-for="doc in classIdOpts"
                         :key="doc.value"
                         :label="doc.label"
                         :value="doc.value"></el-option>
            </el-select>
          </el-form-item>
        </slot> -->
        <el-form-item label="">
          <el-button type="primary"
                     @click="handleSubmit">Submit</el-button>
        </el-form-item>
      </el-form>
    </fieldset>

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
          <el-button size="mini"
                     type="text"
                     @click="getData()">GetData</el-button>
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
        <div class="tableShow">
          <table class="table-content">
            <thead>
              <tr>
                <th>No</th>
                <!-- <th>Code</th> -->
                <th>Code</th>
                <th>Title</th>
                <th>Level</th>
                <th>Type</th>
                <!-- <th>Telphone</th>
                <th>Position</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in tableData"
                  :key="index">
                <td align="center">{{ index + 1 }}</td>
                <!-- <td>{{ doc._id }}</td> -->
                <td>{{ doc._id }}</td>
                <td>{{ doc.title }}</td>
                <!-- <td>{{ formatDate (doc.dob) }}</td> -->
                <!-- <td>{{ formatDate( doc.dob) }}</td> -->
                <td>{{ doc.level }}</td>
                <td>{{ doc.type }}</td>
                <!-- <td>{{ doc.position }}</td> -->
              </tr>
            </tbody>

          </table>
          <div style="width: 30%; float: right; display: inline-block;margin-top:3%;margin-bottom:3%;">
            <span class="title">Total All : {{ totalAll }}</span>
            <span class="title">Full Time : {{ totalFulltime }}</span>
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
import { findSubject } from '../../api/subject/methods'
import { Printd } from 'printd'
import toCss from 'to-css'
// const toCss = require('to-css')
import reportCSS from '../styles/reportCss'

export default {
  name: 'Subject',
  data() {
    return {
      totalAll: 0,
      totalFulltime: 0,
      typeOpts: Lookup.type,
      reportDate: moment().toDate(),

      form: {
        type: '',
      },
      optionStart: {
        shortcuts: [
          {
            text: 'Today',
            onClick(picker) {
              picker.$emit('pick', new Date())
            },
          },
          {
            text: 'Yesterday',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            },
          },
          {
            text: 'A week ago',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            },
          },
          {
            text: 'Last month',
            onClick(picker) {
              // const end = new Date()
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            },
          },
          {
            text: 'Last 3 months',
            onClick(picker) {
              // const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', start)
            },
          },
        ],
      },
      loading: false,
      tableData: [],
      titles: [
        { label: 'Code', prop: '_id' },
        { label: 'Title', prop: 'title' },
        { label: 'Level', prop: 'level' },
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
        start: [{ required: true }],
        type: [{ required: true }],
      },
    }
  },
  mounted() {
    this.d = new Printd()

    // this.getClassData()
  },
  methods: {
    getData() {
      // this.tableData = []
      // for (let i = 1; i <= 100; i++) {
      //   this.tableData.push({
      //     student: 'Logn Dara' + i,
      //     gender: 'Male',
      //     payDate: '12/03/2018',
      //     endPayDate: '2018/2/' + i,
      //   })
      // }
    },
    handleOptChange(val) {
      if (val === '2') {
        this.itemProp = true
      } else {
        this.itemProp = false
      }
    },
    // getClassData() {
    //   lookupClass
    //     .callPromise({})
    //     .then(result => {
    //       this.classIdOpts = result
    //     })
    //     .catch(error => {
    //       Notify.error({ message: error })
    //     })
    // },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true

          // this.form.start = wrapCurrentTime(this.form.start)
          // this.form.start = moment(this.form.start).format('YYYY-MM-DD')
          // let selector = {
          //   type: { $in: this.form.type },
          //   registerDate: { $lte: this.form.start },
          // }
          let selector = {
            type: { $in: this.form.type },
            status: 'Active',
          }
          this.totalAll = 0
          this.totalFulltime = 0
          findSubject
            .callPromise({ selector })
            .then(result => {
              if (result.length > 0) {
                this.tableData = result

                _.forEach(result, o => {
                  this.totalAll += 1
                  if (o.type == 'Full Time') {
                    this.totalFulltime += 1
                  }
                })
              } else {
                this.tableData = []
                this.totalAll = 0
                this.totalFulltime = 0
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
        // hide repeat header
        thead
        {
            display: table-row-group;
        }
      `
      // const callback = (win, doc, node, launchPrint) => {
      //   // trigger the printing
      //   launchPrint(win)
      //   // console.log(win)
      // }

      this.d.print(window.document.getElementById('tableStudent'), reportCSS)
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
