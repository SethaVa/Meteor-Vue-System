<template>
<div>
  <!-- <el-dialog :visible="visible"
             :before-close="handleClose"
             width="80%">
    <span slot="title">
    <i class="fa fa-user"></i> Student</span> -->
    <el-form :model="form"
             :rules="rules"
             ref="form"
             label-position="left"
             label-width="80px"
             size="mini">
      <!-- <div style="margin-bottom:10px;">
        <el-radio-group v-model="checkRadio"
                        @change="handleRadioChange"
                        size="mini">
          <el-radio-button label="New"></el-radio-button>
          <el-radio-button label="Old"></el-radio-button>
        </el-radio-group>
      </div> -->
      <fieldset>
        <legend>New Student</legend>
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
          <el-col :span="12">
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
          <!-- <el-col :span="8">
            
          </el-col> -->
        </el-row>
      </fieldset>

      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label">
            <!-- <i class="fas fa-money-bill-alt"></i> -->
            Payment
          </span>
          <el-row :gutter="10">
            <el-col :span="12">
              <!-- <el-form-item label="Base On :">
              <el-radio-group @change="handleBaseOnChange" v-model="checkBaseOn">
                <el-radio label="usd">USD</el-radio>
                <el-radio label="khr">KHR</el-radio>
              </el-radio-group>
            </el-form-item> -->
              <el-form-item label="No # "
                            prop="receiptCode">
                <el-input v-model="form.receiptCode"
                          :placeholder="refNumLoading">
                  <el-button slot="append"
                             icon=" fa fa-barcode"
                             @click="getNextRefNum">
                  </el-button>
                </el-input>
              </el-form-item>

              <el-form-item label="Fee"
                            prop="fee">
                <el-input style="width:100%"
                          type="number"
                          v-model.number="form.fee"></el-input>
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
              <el-form-item label="USD "
                            prop="usd">
                <el-input type="number"
                          v-model.number="form.usd"></el-input>
              </el-form-item>
              <!-- <el-form-item label="KHR"
                            prop="khr">
                <el-input type="number"
                          v-model.number="form.khr">

                </el-input>
              </el-form-item> -->
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
<el-form-item >
  <el-button type="primary"
                 size="mini"
                 @click="handleSave">Save</el-button>
      <el-button @click="handleClose"
                 size="mini">Cancel</el-button>
  </el-form-item>
    </el-form>
    <!-- <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 size="mini"
                 @click="handleSave">Save</el-button>
      <el-button @click="handleClose"
                 size="mini">Cancel</el-button>
    </span>
  </el-dialog> -->
  </div>
</template>

<script>
import _ from 'lodash'
import Notify from '/imports/client/libs/notify'
import Msg from '/imports/client/libs/message'
import wrapCurrentTime from '/imports/client/libs/wrap-current-time'
import moment from 'moment'
import Lookup from '/imports/client/libs/Lookup-Value'
import { getNextRef } from '/imports/libs/get-next-ref'
import { lookupClass, lookupStudent } from '/imports/libs/lookup-methods'

import {
  insertPayementForNew,
  findPaymentForClass,
  findOnePaymentByCode,
} from '../../api/payment/methods'
import { findExchanges } from '../../api/exchanges/methods'
const numeral = require('numeral')
export default {
  name: 'RegisterInsert',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    // Check Code
    const validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Code is requiered'))
      }
      setTimeout(() => {
        let selector = {
          receiptCode: value,
        }
        findOnePaymentByCode
          .callPromise({ selector })
          .then(result => {
            if (result) {
              callback(new Error('This code is exist'))
            } else {
              callback()
            }
          })
          .catch(error => {
            Notify.error({ message: error })
          })
      }, 1000)
    }

    return {
      loading: false,
      refNumLoading: 'eg. 1',
      checkRadio: 'New',
      typeOpts: Lookup.type,
      classIdOpts: [],
      genderOpts: Lookup.gender,
      studentIdOpts: [],
      listExpireStudent: [],
      exchangeRate: 0,
      remaining: 0,
      type: '',
      checkBaseOn: 'usd',
      form: {
        receiptCode: '',
        fee: 0,
        type: '',
        classId: '',
        rsDate: moment().toDate(),
        studentId: '',
        payDate: moment().toDate(),
        duration: 1,
        totalPay: 0,
        usd: 0,
        discountVal: 0,
        khr: 0,
        remaining: 0,
        status: 'Paid',
      },
      rules: {
        receiptCode: [{ validator: validateCode, trigger: 'change' }],
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
        fee: [
          { required: true, message: 'Fee is Required', trigger: 'change' },
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

  watch: {
    'form.duration'(val) {
      this.form.totalPay = val * this.form.fee
    },
    'form.fee'(val) {
      this.form.totalPay = val * this.form.duration
    },
  },
  mounted() {
    this.getExchangeRate()
    this.getNextRefNum()
  },
  methods: {
    getNextRefNum() {
      this.refNumLoading = 'Loading....'
      getNextRef
        .callPromise({
          collectionName: 'payment',
          opts: {
            field: 'receiptCode',
            // selector: {},
            paddingType: 'start',
            paddingLength: 5,
            paddingChar: '0',
            prefix: '',
          },
        })
        .then(result => {
          if (result) {
            this.form.receiptCode = result
          }
        })
        .catch(error => {
          this.refNumLoading = 'eg. 1'
          Notify.error({ message: error })
        })
    },

    handleTypeChange(val) {
      if (val) {
        this.type = val
        let selector = {
          type: val,
          status: 'Active',
        }
        lookupClass
          .callPromise({ selector })
          .then(result => {
            this.classIdOpts = result
          })
          .catch(error => {
            Notify.error({ message: error })
          })
        this.getStudentData(val)
      } else {
        this.form.classId = ''
        this.classIdOpts = []
      }
    },
    handleBaseOnChange(val) {
      console.log(val)
    },
    getExchangeRate() {
      this.exchangeRate = 0
      findExchanges
        .callPromise({})
        .then(result => {
          if (result.length > 0) {
            this.exchangeRate = result[0].khr
          } else {
            this.exchangeRate = 0
          }
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    getStudentData(val) {
      let selector = {
        type: val,
        remove: false,
      }
      lookupStudent
        .callPromise({ selector })
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
          this.form.rsDate = wrapCurrentTime(this.form.rsDate)
          this.form.dob = wrapCurrentTime(this.form.dob)
          this.form.tranDate = wrapCurrentTime(moment().toDate())
          this.form.payDate = wrapCurrentTime(this.form.payDate)
          this.form.endPayDate = wrapCurrentTime(
            moment(this.form.payDate).add(this.form.duration, 'months')
          )
          if (this.form.remaining != 0) {
            this.form.status = 'Debt'
          }
          let recieveKhr = this.form.khr / this.exchangeRate

          isNaN(recieveKhr) == true
            ? (recieveKhr = 0)
            : (recieveKhr = recieveKhr)

          let totalRecieve = this.form.usd + recieveKhr + this.form.discountVal

          let doc = {
            receiptCode: this.form.receiptCode,
            tranDate: this.form.tranDate,
            classId: this.form.classId,
            studentId: this.form.studentId,
            refType: 'New',
            payDate: this.form.payDate,
            duration: this.form.duration,
            endPayDate: this.form.endPayDate,
            usd: this.form.usd,
            discountVal: this.form.discountVal,
            totalPay: this.form.totalPay,
            khr: this.form.khr,
            remaining: this.form.remaining,
            status: this.form.status,
            type: this.form.type,
            fee: parseInt(this.form.fee),
            totalRecieve: totalRecieve,
          }

          insertPayementForNew
            .callPromise({ doc: doc })
            .then(result => {
              Msg.success()
              this.resetForm()
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
          let selector = {
            type: this.type,
          }
          lookupStudent
            .callPromise({ selector })
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
        let selector = {
          type: this.type,
        }
        lookupStudent
          .callPromise({ selector })
          .then(result => {
            this.studentIdOpts = result
            this.loading = false
          })
          .catch(err => {
            Notify.error({ message: err.reason })
          })
      }
    },
    handleClose() {
      // this.$emit('modal-close')
      this.$router.go(-1)
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.classIdOpts = []
    },
    formatNumer(val) {
      return numeral(val).format('0,0.00 $')
    },
  },
}
</script>

<style>
</style>
