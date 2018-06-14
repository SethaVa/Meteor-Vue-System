<template>
  <div>
    <el-form :model="form"
             ref="form"
             :rules="rules"
             :inline="true"
             size="mini">

      <el-form-item label="Type"
                    prop="type">
        <el-select v-model="form.type"
                   @change="handleTypeChange">
          <el-option v-for="doc in typeOpts"
                     :key="doc.value"
                     :label="doc.label"
                     :value="doc.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Class"
                    prop="classId">

        <el-select style="width:100%"
                   v-model="form.classId"
                   clearable
                   placeholder="Select Class">
          <el-option v-for="doc in classIdOpts"
                     :key="doc.value"
                     :label="doc.label"
                     :value="doc.value">
            <span style="float: left">{{ doc.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ doc.labelRight }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary"
                   @click="handleSubmit">
          <i class="fas fa-sync-alt"></i> Submit</el-button>
      </el-form-item>
    </el-form>
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <!-- <span>Card name</span> -->
        <div style="float: right; padding: 3px 0">
          <el-button size="mini"
                     type="primary"
                     @click="handlePrint">
            <i class="el-icon-printer"> Print</i>
          </el-button>
          <!-- <el-button size="mini"
                     type="text"
                     @click="getData()">GetData</el-button> -->
        </div>

      </div>
      <div id="tableStudent">

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
        <!-- <slot v-show="infoShow"> -->
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
            <label>Date : {{ formatDate(currentDate) }}</label>
          </div>
        </div>
        <!-- </slot> -->
        <div class="tableShow"
             v-loading="loading">
          <table class="table-content">
            <thead>
              <tr>
                <th>No</th>
                <th>Code</th>
                <th>Student Name</th>
                <th>Gender</th>
                <th>Pay Date</th>
                <th>End Pay Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in tableData"
                  :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ doc._id }}</td>
                <td>{{ doc.student }}</td>
                <td>{{ doc.gender }}</td>
                <td>{{ formatDate (doc.payDate) }}</td>
                <td>{{ formatDate( doc.endPayDate) }}</td>
                <td>{{ doc.status }}</td>
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
import Lookup from '../../client/libs/Lookup-Value'
import { lookupClass } from '/imports/libs/lookup-methods'
import { findClassForStudenDetails } from '../../api/payment/methods'
import { Printd } from 'printd'
import toCss from 'to-css'
// const toCss = require('to-css')
import reportCSS from '../styles/reportCss'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      typeOpts: Lookup.type,
      titles: [
        { label: 'Student', prop: 'student' },
        { label: 'Gender', prop: 'gender', width: '100px' },
        { label: 'Pay Date', prop: 'payDate' },
        { label: 'End Date', prop: 'endPayDate' },
      ],
      currentDate: moment().toDate(),
      itemProp: false,
      infoShow: false,
      teacherName: '',
      roomName: '',
      subjectName: '',
      timeStudy: [],
      classIdOpts: [],
      totalAll: 0,
      totalFemale: 0,

      form: {
        opt: '',
        classId: '',
      },
      rules: {
        type: [{ required: true }],
        classId: [{ required: true }],
      },
    }
  },
  mounted() {
    this.d = new Printd()
    // this.getClassData()
  },
  methods: {
    // getData() {
    //   this.tableData = []
    //   for (let i = 1; i <= 100; i++) {
    //     this.tableData.push({
    //       student: 'Logn Dara' + i,
    //       gender: 'Male',
    //       payDate: '12/03/2018',
    //       endPayDate: '2018/2/' + i,
    //     })
    //   }
    // },
    handleTypeChange(val) {
      let selector = {
        type: val,
      }
      this.classIdOpts = []
      this.form.classId = ''
      lookupClass
        .callPromise({ selector })
        .then(result => {
          if (result) {
            this.classIdOpts = result
          }
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    getClassData() {
      let selector = {}
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
          this.totalAll = 0
          this.totalFemale = 0
          this.loading = true
          let selector = {
            classId: this.form.classId,
            status: { $ne: 'Closed' },
          }
          findClassForStudenDetails
            .callPromise({ selector })
            .then(result => {
              if (result.length > 0) {
                _.forEach(result, o => {
                  this.teacherName = o.teacher
                  this.roomName = o.room
                  this.subjectName = o.subject
                  this.timeStudy = o.time

                  this.tableData = o.classDetail
                  _.forEach(o.classDetail, o => {
                    this.totalAll += 1
                    if (o.gender == 'Female') {
                      this.totalFemale += 1
                    }
                  })
                })
              } else {
                this.teacherName = ''
                this.roomName = ''
                this.subjectName = ''
                this.timeStudy = []

                this.tableData = []
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
