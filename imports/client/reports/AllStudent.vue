<template>
  <div>
    <fieldset>
      <legend>Option</legend>
      <el-form :model="form"
               ref="form"
               :rules="rules"
               :inline="true"
               size="mini">

        <el-form-item label="Start"
                      prop="start">
          <el-date-picker v-model="form.start"
                          placeholder="Select Date"
                          :picker-options="optionStart"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="To"
                      prop="end">
          <el-date-picker v-model="form.end"
                          placeholder="Select Date"
                          :picker-options="optionStart"></el-date-picker>
        </el-form-item> -->

        <slot v-if="itemProp">
          <el-form-item label="Subject"
                        prop="classId">
            <el-select v-model="form.classId">
              <el-option v-for="doc in classIdOpts"
                         :key="doc.value"
                         :label="doc.label"
                         :value="doc.value"></el-option>
            </el-select>
          </el-form-item>
        </slot>
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
      <div id="tableStudent">

        <img src="/img/bwlogo.png"
             class="logo">
        <!-- Header -->
        <div class="header">
          <span class="headerKhmer">សាលាភាសាបរទេស ប៊ី អេ ឌី</span>
          <br>
          <span class="headerEn">B.A.D Foreign Language School</span>
        </div>
        <!-- Info Class -->
        <slot v-show="infoShow">
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
        </slot>
        <div class="tableShow"
             v-loading="loading">
          <table class="table-content">
            <thead>
              <tr>
                <th>No</th>
                <th>Code</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Register Date</th>
                <th>DOB</th>
                <th>Telphone</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in tableData"
                  :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ doc._id }}</td>
                <td>{{ doc.enName }}</td>
                <td>{{ doc.gender }}</td>
                <td>{{ formatDate (doc.regiserDate) }}</td>
                <td>{{ formatDate( doc.dobDate) }}</td>
                <td>{{ doc.tel }}</td>
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

import Notify from '/imports/client/libs/notify'
import wrapCurrentTime from '/imports/client/libs/wrap-current-time'
import { lookupClass } from '/imports/libs/lookup-methods'
import { findStudents } from '../../api/students/methods'
import { Printd } from 'printd'
import toCss from 'to-css'
// const toCss = require('to-css')
import reportCSS from '../styles/reportCss'

export default {
  name: 'StudentAll',
  data() {
    return {
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
        { label: 'Student', prop: 'student' },
        { label: 'Gender', prop: 'gender', width: '100px' },
        { label: 'Pay Date', prop: 'payDate' },
        { label: 'End Date', prop: 'endPayDate' },
      ],
      itemProp: false,
      infoShow: false,
      teacherName: '',
      roomName: '',
      subjectName: '',
      timeStudy: [],

      classIdOpts: [],
      form: {
        start: '',
        end: '',
      },
      rules: {
        opts: [{ required: true }],
        classId: [{ required: true }],
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
      this.form.start = wrapCurrentTime(this.form.start)
      this.form.end = wrapCurrentTime(this.form.end)
      let date = wrapCurrentTime(moment().toDate())

      this.loading = true
      let selector = {}
      if (!moment(this.form.start).isValid()) {
        selector = {
          registerDate: { $lte: date },
          remove: { $ne: 'true' },
        }
      } else {
        selector = {
          registerDate: { $lte: this.form.start },
          remove: { $ne: 'true' },
        }
      }

      findStudents
        .callPromise({ selector })
        .then(result => {
          if (result.length > 0) {
            this.tableData = result
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
    },
    handlePrint() {
      // font-family: Times New Roman, Times, serif;
      // font-family: Moul, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;

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
        .header >.headerKhmer {
          font-size: 35px;
          font-family: 'Moul';
          color: darkgray;
          margin-left: 5vh;
        }
        .header >.headerEn {
          font-size: 33px;
          font-family: Times New Roman;
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
