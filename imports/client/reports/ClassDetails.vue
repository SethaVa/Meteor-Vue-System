<template>
  <div>
    <el-form :model="form"
             ref="form"
             :rules="rules"
             :inline="true"
             size="mini">

      <el-form-item label="Option"
                    prop="opt">
        <el-select v-model="form.opt"
                   @change="handleOptChange">
          <el-option v-for="doc in opts"
                     :key="doc.value"
                     :label="doc.label"
                     :value="doc.value"></el-option>
        </el-select>
      </el-form-item>
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

        </div>

      </div>

    </el-card>

  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'

import Notify from '/imports/client/libs/notify'
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
      opts: [
        { label: 'All Student', value: '1' },
        { label: 'By Class', value: '2' },
      ],
      classIdOpts: [],
      form: {
        opt: '',
        classId: '',
      },
      rules: {
        opts: [{ required: true }],
        classId: [{ required: true }],
      },
    }
  },
  mounted() {
    this.d = new Printd()
    this.getClassData()
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
              console.log(o.time)
              this.tableData = o.classDetail
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
