<template>
  <div>
    <el-button size="mini"
               type="primary"
               @click="handlePrint">
      <i class="el-icon-printer"></i>
    </el-button>
    <el-button size="mini"
               type="primary"
               @click="getData()">GetData</el-button>
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
      <div class="InfoClass">
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
      </div>
      <div class="tableShow">
        <table class="table-content">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Gender</th>
              <th>Pay Date</th>
              <th>End Pay Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(doc, index) in tableData"
                :key="index">
              <td>{{ doc.student }}</td>
              <td>{{ doc.gender }}</td>
              <td>{{ doc.payDate }}</td>
              <td>{{ doc.endPayDate }}</td>

            </tr>
          </tbody>

        </table>

      </div>

    </div>

  </div>
</template>

<script>
import { Printd } from 'printd'
import toCss from 'to-css'
import reportCSS from '../styles/reportCss'
export default {
  data() {
    return {
      tableData: [],
      titles: [
        { label: 'Student', prop: 'student' },
        { label: 'Gender', prop: 'gender', width: '100px' },
        { label: 'Pay Date', prop: 'payDate' },
        { label: 'End Date', prop: 'endPayDate' },
      ],
    }
  },
  mounted() {
    this.d = new Printd()
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
    handlePrint() {
      this.d.print(document.getElementById('tableStudent'), toCss(reportCSS))
    },
  },
}
</script>

<style>
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
.headerKhmer {
  font-size: 35px;
  font-family: 'Moul';
  color: darkgray;
  margin-left: 5vh;
}
.headerEn {
  font-size: 33px;
  font-family: 'Times New Roman', Times, serif;
  color: darkgray;
  margin-left: 8vh;
  margin-top: -3vh;
}
.inforClass {
  clear: both;
  /* margin-top: 5vh;
  margin-bottom: 5vh; */
}
.clLeft {
  font-size: 12px;
  background-color: red;
  width: 10%;
  float: left;
}
.clCenter {
  font-size: 12px;
  margin-left: 10vh;
  text-align: center;
}
.clRight {
  font-size: 12px;
  float: right;
  background-color: aqua;
}
.tableShow {
  font-size: 12px;
  margin-top: 5vh;
}
.table-content {
  border-collapse: inherit;

  width: 100%;
}
.table-content,
th,
td {
  border-bottom: 1px solid #ddd;
  padding: 5px;
}
th {
  background-color: #ddd;
}
</style>
