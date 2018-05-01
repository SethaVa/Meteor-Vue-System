<template>
  <el-dialog :visible="visible"
             :before-close="handleClose"
             width="80%">
    <span slot="title">
    <i class="fa fa-money"></i> Payment</span>
    <el-form :model="form"
             :rules="rules"
             ref="form"
             label-position="left"
             label-width="80px"
             size="mini">
      <fieldset>
        <legend>Student</legend>
        <el-row :gutter="10">
          <el-col :span="8">
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
          </el-col>
          <el-col :span="8">
            <el-form-item label="Subject"
                          prop="classId">
              <el-select v-model="form.classId"
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
          </el-col>
          <el-col :span="8">
            <el-form-item label="Student"
                          prop="studentId">
              <el-select v-model="form.studentId"
                         filterable
                         remote
                         placeholder="Please enter a keyword"
                         :remote-method="remoteMethod"
                         :loading="loading">
                <el-option v-for="doc in studentIdOpts"
                           :key="doc.value"
                           :label="doc.label"
                           :value="doc.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>

      <el-tabs type="card">
        <el-tab-pane>
          <span slot="label">
            <i class="fa fa-money"></i> Payment
          </span>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="Pay Date"
                            prop="payDate">
                <el-date-picker style="width:100%"
                                v-model="form.payDate"></el-date-picker>
              </el-form-item>
              <el-form-item label="Duration"
                            prop="duration">
                <el-input type="duration"
                          v-model.number="form.duration"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="Total Pay "
                            prop="totalPay">
                <el-input type="number"
                          v-model.number="form.totalPay"></el-input>
              </el-form-item>
              <el-form-item label="Dis Val"
                            prop="discountVal">
                <el-input type="discountVal"
                          v-model.number="form.discountVal">

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">

              <el-form-item label="USD "
                            prop="usd">
                <el-input type="number"
                          v-model.number="form.usd"></el-input>
              </el-form-item>
              <el-form-item label="KHR"
                            prop="khr">
                <el-input type="number"
                          v-model.number="form.khr">

                </el-input>
              </el-form-item>
              <el-form-item label="Remaining"
                            prop="remaining">
                <el-input type="khr"
                          v-model.number="form.remaining"
                          auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-tab-pane>
      </el-tabs>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="handleSave">Save</el-button>
      <el-button @click="handleClose">Cancel</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Notify from '/imports/client/libs/notify'
import Msg from '/imports/client/libs/message'
import wrapCurrentTime from '/imports/client/libs/wrap-current-time'
import moment from 'moment'
import Lookup from '/imports/client/libs/Lookup-Value'
import { lookupClass, lookupStudent } from '/imports/libs/lookup-methods'
import { updatePaymentForPayment } from '../../api/payment/methods'
const numeral = require('numeral')
export default {
  name: 'StudentPayUpdate',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    updateDoc: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      typeOpts: Lookup.type,
      classIdOpts: [],
      genderOpts: Lookup.gender,
      studentIdOpts: [],
      remaining: 0,
      form: this.updateDoc,

      rules: {
        rsDate: [
          { required: true, message: 'Date is Required', trigger: 'change' },
        ],
        type: [
          { required: true, message: 'Type is Required', trigger: 'change' },
        ],
        classId: [
          { required: true, message: 'Class is Required', trigger: 'change' },
        ],
        studentId: [
          {
            required: true,
            message: 'Student ID is required',
            trigger: 'change',
          },
        ],
        payDate: [
          { required: true, message: 'Date is Required', trigger: 'change' },
        ],
        duration: [
          { required: true, message: 'Duration is required' },
          { type: 'number', message: 'Duration must be a number' },
        ],
        usd: [{ required: true, message: 'Total is required' }],
        khr: [{ required: true, message: 'Total is required' }],
        totalPay: [{ required: true, message: 'Total must be a number' }],
      },
    }
  },
  // watch: {
  //   'form.usd'(val) {
  //     this.remaining = val
  //   },
  //   'form.discountVal'(val) {
  //     this.remaining = this.form.usd - val
  //     this.form.remaining = this.form.usd - val
  //     if (this.remaining < 0) {
  //       Notify.warning({
  //         message: 'Discount Balance is bigger than Total balance',
  //       })
  //       this.form.khr = 0
  //     }
  //   },
  //   'form.khr'(val) {
  //     this.remaining = this.form.usd - this.form.discountVal - val
  //     this.form.remaining = this.form.usd - this.form.discountVal - val
  //     if (this.remaining < 0) {
  //       Notify.warning({ message: 'khr Balance is bigger than Total balance' })
  //       this.form.khr = 0
  //     }
  //   },
  // },
  mounted() {
    this.getStudentData()
  },
  methods: {
    handleTypeChange(val) {
      if (val.length > 0) {
        let selector = {
          type: val,
        }
        lookupClass
          .callPromise({ selector })
          .then(result => {
            this.classIdOpts = result
          })
          .catch(error => {
            Notify.error({ message: error })
          })
      } else {
        this.form.classId = ''
        this.classIdOpts = []
      }
    },
    getStudentData() {
      lookupStudent
        .callPromise({})
        .then(result => {
          this.studentIdOpts = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // this.form.rsDate = wrapCurrentTime(this.form.rsDate)
          // this.form.dob = wrapCurrentTime(this.form.dob)
          this.form.tranDate = wrapCurrentTime(moment().toDate())
          this.form.payDate = wrapCurrentTime(this.form.payDate)
          this.form.endPayDate = wrapCurrentTime(
            moment(this.form.payDate).add(this.form.duration, 'months')
          )
          if (this.form.remaining !== 0) {
            this.form.status = 'Debt'
          } else {
            this.form.status = 'Paid'
          }
          updatePaymentForPayment
            .callPromise({ doc: this.form })
            .then(result => {
              Msg.success()
              this.handleClose()
            })
            .catch(error => {
              Notify.error({ message: error })
            })
        } else {
          return false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          lookupStudent
            .callPromise({})
            .then(result => {
              this.studentIdOpts = result.filter(item => {
                return (
                  item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
                )
              })
            })
            .catch(error => {
              Notify.error({ message: error.reason })
            })
        }, 200)
      } else {
        this.loading = true
        lookupStudent
          .callPromise({})
          .then(result => {
            this.studentIdOpts = result
            this.loading = false
          })
          .catch(err => {
            Notify.error({ message: err.reason })
          })
      }
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.classIdOpts = []
    },
    handleClose() {
      this.$emit('modal-close')
    },
    formatNumer(val) {
      return numeral(val).format('0,0.00 $')
    },
  },
}
</script>

<style>

</style>
