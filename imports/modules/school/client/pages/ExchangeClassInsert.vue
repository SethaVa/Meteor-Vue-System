<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="New ExchangeClass"
               width="80%"
               :visible="visible"
               :before-close="handleClose">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               size="mini"
               label-position="left"
               label-width="130px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Date"
                          prop="tranDate">
              <el-date-picker style="width:100%"
                              v-model="form.tranDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="Type"
                          prop="type">
              <el-select v-model="form.type"
                         clearable
                         @change="handleTypeChange">
                <el-option v-for="item in typeOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Subject From"
                          prop="classFromId">
              <el-select v-model="form.classFromId"
                         clearable
                         @change="handleClassFromChagne"
                         placeholder="Select Class">
                <el-option v-for="doc in classFromIdOpts"
                           :key="doc.value"
                           :label="doc.label"
                           :value="doc.value">
                  <span style="float: left">{{ doc.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ doc.labelRight }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Student"
                          prop="studentId">
              <el-select v-model="form.studentId"
                         @change="handleStudentChange">
                <el-option v-for="item in studentOpts"
                           :key="item.studentId"
                           :label="item.studentId+' - '+item.student"
                           :value="item.studentId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Subject To"
                          prop="classToId">
              <el-select v-model="form.classToId"
                         clearable
                         @change="handleClassToChange"
                         placeholder="Select Class">
                <el-option v-for="doc in classToIdOpts"
                           :key="doc.value"
                           :label="doc.label"
                           :value="doc.value">
                  <span style="float: left">{{ doc.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ doc.labelRight }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <fieldset>
              <legend style="font-weight:400;color:red;">Info</legend>
              <el-row>
                <el-col :span="12">
                  <el-form-item class="form-item"
                                label="Fee :"
                                prop="fee">
                    <label>{{ fee }}</label>
                  </el-form-item>
                  <el-form-item class="form-item"
                                label="Pay Date :"
                                prop="payDate">
                    <label>{{ formatDate(payDate) }}</label>
                  </el-form-item>
                  <el-form-item class="form-item"
                                label="Duration :"
                                prop="duration">
                    <label>{{ duration }} months</label>
                  </el-form-item>
                  <el-form-item class="form-item"
                                label="End Date :"
                                prop="endPayDate">
                    <label>{{ formatDate(endPayDate) }}</label>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="form-item"
                                label="Total Pay :"
                                prop="totalPay">
                    <label>{{ totalPay }}</label>
                  </el-form-item>
                  <el-form-item class="form-item"
                                label="USD :"
                                prop="usd">
                    <label>{{ usd }}</label>
                  </el-form-item>
                  <el-form-item class="form-item"
                                label="KHR :"
                                prop="khr">
                    <label>{{ khr }}</label>
                  </el-form-item>
                </el-col>
              </el-row>
            </fieldset>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   size="mini"
                   @click="handleSave">Save</el-button>
        <el-button size="mini"
                   @click="handleClose">Cancel</el-button>
      </span>
    </el-dialog :close-on-click-modal="false">
  </div>
</template>

<script>
import Notify from '/imports/client/lib/notify'
import MsgBox from '/imports/client/lib/message'
import moment from 'moment'
import Lookup from '/imports/client/lib/Lookup-Value'
//
import { lookupClass } from '/imports/utils/lookup-methods'
import { findClassForStudenDetails } from '/imports/modules/school/api/payment/methods'
import { findOnePayment } from '/imports/modules/school/api/payment/methods'
import { insertExchangeClass } from '/imports/modules/school/api/exchange-class/methods'
import { findOneClassStudy } from '/imports/modules/school/api/class-study/methods'

export default {
  // name: 'ExchangeClass',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      classFromIdOpts: [],
      classToIdOpts: [],
      typeOpts: Lookup.type,
      studentOpts: [],
      type: '',

      tmpClassDoc: {},
      fee: 0,
      payDate: '',
      duration: 0,
      endPayDate: '',
      totalPay: 0,
      usd: 0,
      khr: 0,
      form: {
        typeTo: '',
        tranDate: moment().toDate(),
        studentId: '',
        classFromId: '',
        classToId: '',
      },
      rules: {
        tranDate: [{ required: true }],
        type: [{ required: true }],
        classFromId: [{ required: true }],
        studentId: [{ required: true }],
        classToId: [{ required: true }],
      },
    }
  },
  watch: {
    'form.type'(val) {
      this.handleTypeChange(val)
    },
    'form.classFormId'(val) {
      this.handleClassFormChange(val)
    },
  },
  methods: {
    handleTypeChange(val) {
      if (val) {
        this.type = val
        this.form.classFromId = ''
        this.form.classToId = ''
        this.form.studentId = ''

        this.classFromIdOpts = []
        this.classToIdOpts = []
        this.studentOpts = []
        let selector = {
          type: val,
          status: { $ne: 'Closed' },
        }
        lookupClass
          .callPromise({ selector })
          .then(result => {
            this.classFromIdOpts = result
          })
          .catch(error => {
            Notify.error({ message: error })
          })
      } else {
        this.classFromIdOpts = []
        this.classToIdOpts = []
        this.studentOpts = []
        this.form.classFromId = ''
        this.form.classToId = ''
        this.form.studentId = ''
      }
    },
    handleClassFromChagne(val) {
      if (val) {
        this.classToIdOpts = []
        this.studentOpts = []

        let selector = {
          // type: this.type,
          _id: { $ne: val },
        }
        lookupClass
          .callPromise({ selector })
          .then(result => {
            if (result.length > 0) {
              this.classToIdOpts = result
            } else {
              this.classToIdOpts = []
            }
          })
          .catch(error => {
            Notify.error({ message: error })
          })
        //Get Student
        let classSelector = {
          classId: val,
          status: { $ne: 'Closed' },
        }
        findClassForStudenDetails
          .callPromise({ selector: classSelector })
          .then(result => {
            if (result.length > 0) {
              this.studentOpts = result[0].classDetail
            } else {
              this.studentOpts = []
            }
          })
          .catch(error => {
            Notify.error({ message: error.reason })
          })
      } else {
        this.classToIdOpts = []
        this.studentOpts = []
        this.form.classToId = ''
        this.form.studentId = ''
      }
    },
    handleStudentChange(val) {
      let selector = {
        studentId: val,
        $and: [{ status: { $ne: 'Closed' } }, { status: { $ne: 'Expires' } }],
      }

      findOnePayment
        .callPromise({ _id: selector })
        .then(result => {
          if (result) {
            this.fee = result.fee
            this.payDate = result.payDate
            this.duration = result.duration
            this.endPayDate = result.endPayDate
            this.totalPay = result.totalPay
            this.usd = result.usd
            this.khr = result.khr

            this.tmpClassDoc = result
          }
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    handleClassToChange(val) {
      if (val) {
        findOneClassStudy
          .callPromise({ id: val })
          .then(result => {
            this.form.typeTo = result.type
          })
          .catch(error => {
            Notify.error({ message: error })
          })
      }
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          insertExchangeClass
            .callPromise({ doc: this.form, details: this.tmpClassDoc })
            .then(result => {
              if (result) {
                MsgBox.success()
                this.handleresetForm()
              }
            })
            .catch(err => {
              Notify.error({ message: err.reason })
            })
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$emit('modal-close')
    },
    handleresetForm() {
      this.$refs['form'].resetFields()
    },
    formatDate(val) {
      return moment(val).format('DD/MM/YYYY')
    },
  },
}
</script>

<style>
.form-item {
  margin-bottom: 0px;
}
</style>
