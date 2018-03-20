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
  .header>.headerKhmer {
    font-size: 35px;
    font-family: 'Moul', Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    color: darkgray;
    margin-left: 5vh;
  }
  .header>.headerEn {
    font-size: 33px;
    font-family: 'Times New Roman', Times, serif;
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
    font-size: 12px;
    position: absolute;
    top: 35%;
    width: 10%;
    left: 10%;
}

.info-class>.clCenter {
    font-size: 12px;
    position: absolute;
    margin-left: 10vh;
    top: 35%;
    left: 35%;
}

.info-class>.clRight {
    font-size: 12px;
    position: absolute;
    left: 80%;
    top: 35%;
}
.tableShow {
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
export default reportCSS
