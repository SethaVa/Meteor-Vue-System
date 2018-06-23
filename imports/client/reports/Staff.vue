<template>
  <div>
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <!-- <span>Card name</span> -->
        <div style="float:left;">
          <el-button type="primary"
                     size="mini"
                     @click="handleSubmit">
          <i class="fa fa-refresh"></i> Generate</el-button>
        </div>
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
                <th>Name</th>
                <th>Gender</th>
                <th>Data Of Birth</th>
                <th>Emaile</th>
                <th>Telphone</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in tableData"
                  :key="index">
                <td align="center">{{ index + 1 }}</td>
                <!-- <td>{{ doc._id }}</td> -->
                <td>{{ doc.name }}</td>
                <td>{{ doc.gender }}</td>
                <td>{{ formatDate (doc.dob) }}</td>
                <!-- <td>{{ formatDate( doc.dob) }}</td> -->
                <td>{{ doc.email }}</td>
                <td>{{ doc.tel }}</td>
                <td>{{ doc.position }}</td>
              </tr>
            </tbody>

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

import Notify from '/imports/client/libs/notify'
import wrapCurrentTime from '/imports/client/libs/wrap-current-time'
import Lookup from '../libs/Lookup-Value'
import { lookupClass } from '/imports/libs/lookup-methods'
import { findStaff } from '../../api/Staffs/methods'
import { Printd } from 'printd'
import toCss from 'to-css'
// const toCss = require('to-css')
import reportCSS from '../styles/reportCss'

export default {
  name: 'StudentAll',
  data() {
    return {
      totalAll: 0,
      totalFemale: 0,
      typeOpts: Lookup.type,
      reportDate: moment().toDate(),

      loading: false,
      tableData: [],
      titles: [
        { label: 'Student', prop: 'student' },
        { label: 'Gender', prop: 'gender', width: '100px' },
        { label: 'Pay Date', prop: 'payDate' },
        { label: 'End Date', prop: 'endPayDate' },
      ],

      // classIdOpts: [],
      // form: {
      //   start: '',
      //   end: '',
      // },
    }
  },
  mounted() {
    this.d = new Printd()

    // this.getClassData()
  },
  methods: {
    handleSubmit() {
      this.loading = true

      this.totalAll = 0
      this.totalFemale = 0
      findStaff
        .callPromise()
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
