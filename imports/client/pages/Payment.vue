<template>
  <div>
    <!-- <component :is="currentModal"
               :modal-doc="modalDoc"
               :visible="modalVisible"
               @modal-close="handleClose">
    </component> -->
    <!-- <legend>Filter</legend> -->
    <el-form :model="form"
             ref="form"
             :rules="rules"
             size="mini"
             label-position="left"
             label-width="90px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Type"
                        prop="type">
            <el-select v-model="form.type"
                       clearable
                       placeholder="select type"
                       @change="handleTypeChange">
              <el-option v-for="doc in typeOpts"
                         :key="doc.value"
                         :label="doc.label"
                         :value="doc.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Student"
                        prop="studentId">
            <el-select v-model="form.studentId"
                       @change="handleStudentChange"
                       placeholder="Please Select Student">
              <el-option v-for="doc in studentIdOpts"
                         :key="doc.value"
                         :label="doc.label"
                         :value="doc.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Pay Date"
                        prop="payDate">
            <el-date-picker style="width:100%"
                            v-model="form.payDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="Duration"
                        prop="duration">
            <el-select v-model="form.duration">
              <el-option v-for="doc in 12 "
                         :key="doc"
                         :label="doc + ' months'"
                         :value="doc"></el-option>
            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <fieldset>
            <legend class="legend-style">Info</legend>
            <el-row>
              <el-col :span="12">
                <el-form-item class="info"
                              label="Late Date :">
                  <label> {{ 0 }}</label>
                </el-form-item>
                <el-form-item class="info"
                              label="End Date :">
                  <label>{{ formatDate(endDate) }}</label>
                </el-form-item>
                <el-form-item class="info"
                              label="Room :">
                  <label>{{001}}</label>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="info"
                              label="Teacher :">
                  <label> {{ 0 }}</label>
                </el-form-item>
                <el-form-item class="info"
                              label="Subject :">
                  <label>{{ 0 }}</label>
                </el-form-item>
                <el-form-item class="info"
                              label="Time :">
                  <label>{{001}}</label>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
        </el-col>
      </el-row>
      <el-form :model="formPayment"
               :rules="rulesPayment"
               ref="formPayment"
               size="mini"
               label-position="top"
               :inline="true">
        <fieldset>
          <legend>Payment</legend>

          <el-form-item label="Total Pay"
                        prop="totalPay">
            <el-input type="number"
                      v-model="formPayment.totalPay"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="Discount"
                        prop="discount">
            <el-input type="number"
                      style="width:21vh"
                      v-model="formPayment.discount"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="USD"
                        prop="usd">
            <el-input type="number"
                      v-model="formPayment.usd"></el-input>
          </el-form-item>
          <el-form-item label="KHR"
                        prop="khr">
            <el-input type="number"
                      v-model="formPayment.khr"></el-input>
          </el-form-item>
          <el-form-item label="Remaining"
                        prop="remaining">
            <el-input type="number"
                      v-model="formPayment.remaining"></el-input>
          </el-form-item>
        </fieldset>
      </el-form>
      <el-form-item>
        <el-button type="primary"
                   @click="handleSubmit">Submit</el-button>
        <el-button @click="handleBack"
                   icon="fa fa-arrow-circle-left"
                   type="danger"> Back</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Msg from '/imports/client/libs/message'
import Notify from '/imports/client/libs/notify'
import moment from 'moment'
import _ from 'lodash'
import compareDate from '/imports/libs/compare-date'
import { lookupClass, lookupType } from '/imports/libs/lookup-methods'
import Lookup from '/imports/client/libs/Lookup-Value'
import { findPaymentForClass } from '/imports/api/payment/methods'
import StudentPay from './StudentPay.vue'
export default {
  name: 'Payment',
  components: { StudentPay },
  data() {
    return {
      type: '',
      typeOpts: Lookup.type,
      currentModal: null,
      modalVisible: false,
      modalDoc: null,
      loading: false,
      studentIdOpts: [],
      classId: '',
      endDate: moment().toDate(),
      form: {
        classId: '',
        payDate: moment().toDate(),
        duration: 1,
        type: '',
        studentId: '',
      },
      formPayment: {
        totalPay: 0,
        discount: 0,
        usd: 0,
        khr: 0,
        remaining: 0,
      },
      rules: {
        studentId: [
          { required: true, message: 'Student is Required', trigger: 'change' },
        ],
        type: [
          { required: true, message: 'Type is Required', trigger: 'change' },
        ],
        payDate: [
          { required: true, message: 'Date is Required', trigger: 'change' },
        ],
        duration: [
          {
            required: true,
            message: 'Duration is Required',
            trigger: 'change',
          },
        ],
      },
      rulesPayment: {
        totalPay: [
          {
            equired: true,
            message: 'Total Pay is Required',
            trigger: 'change',
          },
        ],
      },
    }
  },
  computed: {
    // 'form.classId'(val) {
    //   this.classId = val
    //   return this.classId
    // },
  },
  mounted() {
    // this.getTypeData()
    this.getPaymentData()
  },
  methods: {
    getPaymentData() {
      let selector = {
        // classId: this.form.classId,
        status: { $in: ['Expires', '$classDetail'] },
      }
      this.loading = true
      findPaymentForClass
        .callPromise({ selector: selector })
        .then(result => {
          if (result.length > 0) {
            this.dataTable = []
            _.forEach(result[0].classDetail, o => {
              console.log(result[0].classDetail)
              this.dataTable = result[0].classDetail
            })
          } else {
            this.dataTable = []
          }
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error.reason })
        })
    },
    // getTypeData() {
    //   lookupType
    //     .callPromise()
    //     .then(result => {
    //       this.typeOpts = result
    //     })
    //     .catch(error => {
    //       Notify.error({ message: error })
    //     })
    // },
    handleTypeChange(val) {
      let selector = {
        type: val,
        status: 'Debt',
        // classId: this.form.classId,
        // status: { $in: ['Expires', '$classDetail'] },
      }
      this.loading = true
      findPaymentForClass
        .callPromise({ selector: selector })
        .then(result => {
          if (result.length > 0) {
            this.dataTable = []
            _.forEach(result[0].classDetail, o => {
              this.studentIdOpts.push({
                label: o.studentId + ' - ' + o.student,
                value: o.studentId,
              })
            })
          } else {
            this.studentIdOpts = []
          }
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error.reason })
        })
    },
    handleStudentChange(val) {
      let selector = {
        // type: val,
        studentId: val,
        // classId: this.form.classId,
        // status: { $in: ['Expires', '$classDetail'] },
      }
      this.loading = true
      findPaymentForClass
        .callPromise({ selector: selector })
        .then(result => {
          console.log(result)
          if (result.length > 0) {
            // this.dataTable = []
            // _.forEach(result[0].classDetail, o => {
            //   this.studentIdOpts.push({
            //     label: o.studentId + ' - ' + o.student,
            //     value: o.studentId,
            //   })
            // })
          } else {
            this.studentIdOpts = []
          }
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error.reason })
        })
    },
    handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$refs['formPayment'].validate(valid => {
            if (valid) {
              console.log(this.formPayment)
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.getPaymentData()
      this.handleSubmit()
      this.modalVisible = false
      this.$nextTick(() => {
        this.currentModal = null
      })
    },
    formatDate(val) {
      return moment(val).format('DD/MM/YYYY')
    },
    handleBack() {
      this.$router.go(-1)
    },
  },
}
// let selector = {
//   classId: this.form.classId,
//   status: { $in: ['Expires', '$classDetail'] },
// }
// this.loading = true
// findPaymentForClass
//   .callPromise({ selector: selector })
//   .then(result => {
//     if (result.length > 0) {
//       this.dataTable = []
//       _.forEach(result[0].classDetail, o => {
//         this.dataTable = result[0].classDetail
//       })
//     } else {
//       this.dataTable = []
//     }
//     this.loading = false
//   })
//   .catch(error => {
//     Notify.error({ message: error.reason })
//   })
</script>

<style lang="scss" scoped >
.legend-style {
  font-weight: 400;
  color: red;
  font-size: 18px;
}
.info {
  margin-bottom: 1vh;
  font-weight: 400;
}
</style>
