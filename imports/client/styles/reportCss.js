const reportCSS = `.report-card {
    width: 100%;
}

.report-card .card-header {
    margin: -7px 0px 20px;
}

.report-card .card-header .header-left {
    /* Report */
    float: left;
    /*margin-top: -7px;*/
}

.report-card .card-header .header-right {
    float: right;
    /*margin-top: -7px;*/
}

.part-title {
    text-transform: capitalize;
}

.report-body {
    /*width: 21cm;*/
    /* color: #1f2f3d; */
}

.report-body .header {
    text-align: center;
    padding-bottom: 10px;
    /* color: #909399; */
}

.report-body>.header>.company-name {
    font-size: 24px;
    font-weight: 300;
    font-family: 'Moul', Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
}

.report-body .header .report-name {
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    font-family: 'Moul', PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
}

.report-body .header .report-period {
    font-size: 14px;
    font-weight: 500;
}

.report-body .filter {
    padding-bottom: 20px;
    border-bottom: 1px solid #6e6b6b;
}

.report-body .filter .label {
    font-weight: 700;
    font-size: 12px
}

.report-body .content {
    padding-bottom: 10px;
}


/* Time Stamp */

.report-body .timestamp {
    font-size: 10px;
    font-weight: 300;
    font-style: italic;
}


/* Footer */

.report-body .footer {
    padding-bottom: 10px;
}

.report-body .footer .title {
    font-weight: 600;
}

.report-body .signature {
    padding-top: 20px;
    clear: both;
    text-align: center;
    font-weight: 400;
}


/* Footer Span */

.footer-span .title {
    font-weight: 600;
}

.filter-span,
.footer-span {
    flex-direction: column;
    width: 30%;
    font-size: 12px;
    float: left
}

.signature-span {
    flex-direction: column;
    width: 30%;
    float: left;
    font-size: 12px;
    text-align: center;
    display: flex
}


/* Note */

.note {
    border: 1px solid #2e2e2e;
    border-radius: 4px;
    color: #2e2e2e;
    font-size: 12px;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    margin-bottom: 22px;
    padding: 10px 15px
}

.report-body .not-btn {
    padding-left: 7px;
}

.report-body .note-textarea {
    text-align: right;
    margin: 0;
}


/* Table Content */

.report-body .table-content {
    border-collapse: collapse;
    width: 100%;
    margin-top: 20px;
    line-height: 23px;
}

.table-content td {
    border-bottom: 1px solid #ebeef5;
    padding: 3px 0;
    font-size: 12px !important;
}

// .report-body .table-content th {
//     border-bottom: 1px solid #ebeef5;
//     padding: 3px 0;
//     font-size: 13px;
//     background-color: #ddd
// }
.table-content th {
  border-bottom: 1px solid #ebeef5;
  padding: 3px 0;
  font-size: 13px;
  background-color: #ddd
}

.table-content tbody tr th {
    background-color: #fff !important;
}


/* Paper Size */

.a4-port {
    width: 21cm
}

.a4-land {
    width: 29.7cm
}


/* Align Content */

.align-l {
    text-align: left;
}

.align-r {
    text-align: right;
}

.align-c {
    text-align: center;
}

.logo {
  width: 140px;
  height: 100px;
}
.headerKhmer {
  font-size: 24px;
  font-family: Moul, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
  color:red;
  margin-left: 20vh;
  margin-top:-10vh;
}
.headerEn {
  font-size: 24px;
  font-family: Times New Roman, Times, serif;
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
  text-align: center;
}
.clRight {
  font-size: 12px;
  float: right;
}
`
export default reportCSS
