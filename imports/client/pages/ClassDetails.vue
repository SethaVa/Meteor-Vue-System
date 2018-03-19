<template>
  <div id="tableStudent">
    <el-button type="primary"
               @click="handlePrint">Print</el-button>
    <el-row :gutter="20">
      <el-col :span="4">
        <img src="/img/bwlogo.png"
             class="logo">
      </el-col>
      <el-col :span="20">
        <span class="headerKhmer">សាលាភាសាបរទេស ប៊ី អេ ឌី</span>
        <br>
        <span class="headerEn">B.A.D Foreign Language School</span>
        <br>

      </el-col>
    </el-row>
    <el-row style="margin-top:5vh">
      <el-col :span="8">
        <div class="clLeft">
          <label>Teacher : Dara</label><br><br>
          <label>Room : Dara</label>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="clCenter">
          <label>Subject : IntroA</label>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="clRight">
          <label>Time : 1:00-2:00</label><br><br>
          <label>Room : Dara</label>
        </div>
      </el-col>
    </el-row>
    <div class="tableShow">
      <el-table :data="tableData"
                border
                size="mini"
                style="width: 100%">
        <!-- <el-table-column prop="date"
                       label="Date"
                       width="180">
      </el-table-column> -->
        <el-table-column v-for="title in titles"
                         :key="title.prop"
                         :prop="title.prop"
                         :label="title.label"
                         :width="title.width"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { Printd } from 'printd'
export default {
  data() {
    return {
      tableData: [
        {
          student: 'Logn Dara',
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Logn Dary',
          gender: 'Female',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Jang E',
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Jang Fey',
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Logn Dara',
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Logn Dary',
          gender: 'Female',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Jang E',
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Jang Fey',
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Logn Dara',
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Logn Dary',
          gender: 'Female',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Jang E',
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Jang Fey',
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Logn Dara',
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Logn Dary',
          gender: 'Female',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Jang E',
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
        {
          student: 'Jang Fey',
          gender: 'Male',
          payDate: '12/03/2018',
          endPayDate: '20/12/2018',
        },
      ],
      titles: [
        { label: 'Student', prop: 'student' },
        { label: 'Gender', prop: 'gender', width: '100px' },
        { label: 'Pay Date', prop: 'payDate' },
        { label: 'End Date', prop: 'endPayDate' },
      ],
    }
  },
  methods: {
    handlePrint() {
      const d = new Printd()
      const cssText = `
  .logo {
  width: 140px;
  height: 100px;
}
.headerKhmer {
  font-size: 24px;
  font-family: 'Moul';
  color: darkgray;
  margin-left: 5vh;
}
.headerEn {
  font-size: 18px;
  font-family: 'Times New Roman', Times, serif;
  color: darkgray;
  margin-left: 10vh;
  margin-top: -3vh;
}
.clLeft {
  font-size: 12px;
  float: left;
}
.clCenter {
  font-size: 12px;
  margin-left: 10vh;
}
.clRight {
  font-size: 12px;
  float: right;
}
.tableShow {
  font-size: 12px;
  margin-top: 5vh;
}
table {
    font-size: 85%;
    font-family: sans-serif;
    border-spacing: 0;
    border-collapse: collapse;
}
`
      d.print(document.getElementById('tableStudent'), cssText)
    },
  },
}
</script>

<style>
.logo {
  width: 140px;
  height: 100px;
}
.headerKhmer {
  font-size: 24px;
  font-family: 'Moul';
  color: darkgray;
  margin-left: 5vh;
}
.headerEn {
  font-size: 18px;
  font-family: 'Times New Roman', Times, serif;
  color: darkgray;
  margin-left: 10vh;
  margin-top: -3vh;
}
.clLeft {
  font-size: 12px;
  float: left;
}
.clCenter {
  font-size: 12px;
  margin-left: 10vh;
}
.clRight {
  font-size: 12px;
  float: right;
}
.tableShow {
  font-size: 12px;
  margin-top: 5vh;
}
</style>
