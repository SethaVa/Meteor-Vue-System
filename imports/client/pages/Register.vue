<template>
  <el-form :model="form"
           :rules="rules"
           ref="form"
           label-position="left"
           label-width="110px"
           size="mini">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-tabs type="card">
          <el-tab-pane label="Student">
            <span slot="label">
            <i class="fa fa-users"></i> Student</span>
            <el-form-item label="Type"
                          prop="typeId">
              <el-select v-model="form.typeId"
                         clearable
                         placeholder="select type"
                         @change="handleTypeChange">
                <el-option v-for="doc in typeIdOpts"
                           :key="doc.value"
                           :label="doc.label"
                           :value="doc.value"></el-option>
              </el-select>
            </el-form-item>
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
            <el-form-item label="Kh Name"
                          prop="khName">
              <el-input v-model="form.khName"
                        placeholder="Khmer Name"></el-input>
            </el-form-item>
            <el-form-item label="En Name"
                          prop="enName">
              <el-input v-model="form.enName"
                        placeholder="English Name"></el-input>
            </el-form-item>
            <el-form-item label="Gender"
                          prop="gender">
              <el-select v-model="form.gender"
                         placeholder="Select Gender">
                <el-option v-for="doc in genderOpts"
                           :key="doc.value"
                           :label="doc.label"
                           :value="doc.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Date Of Birth"
                          prop="dob">
              <el-date-picker style="width:100%"
                              v-model="form.dob"></el-date-picker>
            </el-form-item>
            <el-form-item label="Telephone"
                          prop="tel">
              <el-input v-model="form.tel"
                        placeholder="Student Number"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="12">
        <el-tabs type="card">
          <el-tab-pane>
            <span slot="label">
              <i class="fa fa-money"></i> Payment
            </span>
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
            <el-form-item label="USD "
                          prop="usd">
              <el-input type="usd"
                        v-model.number="form.usd"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="KHR"
                          prop="khr">
              <el-input type="khr"
                        v-model.number="form.khr"
                        auto-complete="off">

              </el-input>
            </el-form-item>
            <el-form-item label="Dis Val"
                          prop="discountVal">
              <el-input type="discountVal"
                        v-model.number="form.discountVal"
                        auto-complete="off">

              </el-input>
            </el-form-item>

            <el-form-item label="Remaining"
                          prop="remaining">
              <el-input type="khr"
                        v-model.number="form.remaining"
                        auto-complete="off"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-form-item style="margin-left:60%;margin-top:-8%;">
      <el-button type="primary"
                 @click="saveForm">
      <i class="fa fa-save"></i> Save</el-button>
      <el-button type="danger"
                 @click="resetForm">
      <i class="fa fa-refresh"></i> Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Notify from '/imports/client/libs/notify'
import Msg from '/imports/client/libs/message'
import wrapCurrentTime from '/imports/client/libs/wrap-current-time'
import moment from 'moment'
import Lookup from '/imports/client/libs/Lookup-Value'
import { lookupType, lookupClass } from '/imports/libs/lookup-methods'
import { insertStudent } from '../../api/students/methods'
const numeral = require('numeral')
export default {
  name: 'Register',
  data() {
    return {
      typeIdOpts: [],
      classIdOpts: [],
      genderOpts: Lookup.gender,
      remaining: 0,
      form: {
        typeId: '',
        classId: '',
        rsDate: moment().toDate(),
        khName: '',
        enName: '',
        gender: '',
        dob: '',
        tel: '',
        payDate: moment().toDate(),
        duration: 0,
        usd: 0,
        discountVal: 0,
        khr: 0,
        remaining: 0,
        status: 'Paid',
      },
      rules: {
        rsDate: [
          { required: true, message: 'Date is Required', trigger: 'change' },
        ],
        typeId: [
          { required: true, message: 'Type is Required', trigger: 'change' },
        ],
        classId: [
          { required: true, message: 'Class is Required', trigger: 'change' },
        ],
        khName: [
          { required: true, message: 'Kh Name is Required', trigger: 'blur' },
        ],
        enName: [
          { required: true, message: 'En Name is Required', trigger: 'blur' },
        ],
        gender: [
          { required: true, message: 'Class is Required', trigger: 'change' },
        ],
        dob: [
          { required: true, message: 'Class is Required', trigger: 'change' },
        ],
        payDate: [
          { required: true, message: 'Date is Required', trigger: 'change' },
        ],
        duration: [
          { required: true, message: 'Duration is required' },
          { type: 'number', message: 'Duration must be a number' },
        ],
        usd: [
          { required: true, message: 'Total is required' },
          { type: 'number', message: 'Total must be a number' },
        ],
        discountVal: [{ type: 'number', message: 'Discount must be a number' }],
        khr: [{ type: 'number', message: 'khr must be a number' }],
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
    this.getTypeData()
  },
  methods: {
    getTypeData() {
      lookupType
        .callPromise()
        .then(result => {
          this.typeIdOpts = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    handleTypeChange(val) {
      if (val.length > 0) {
        let selector = {
          typeId: val,
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
    saveForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.rsDate = wrapCurrentTime(this.form.rsDate)
          this.form.dob = wrapCurrentTime(this.form.dob)
          this.form.payDate = wrapCurrentTime(this.form.payDate)
          this.form.endPayDate = wrapCurrentTime(
            moment(this.form.payDate).add(this.form.duration, 'months')
          )
          if (this.form.remaining != 0) {
            this.form.status = 'Debt'
          }
          let details = {
            classId: this.form.classId,
            payDate: this.form.payDate,
            duration: this.form.duration,
            endPayDate: this.form.endPayDate,
            usd: this.form.usd,
            discountVal: this.form.discountVal,
            khr: this.form.khr,
            remaining: this.form.remaining,
            status: this.form.status,
          }
          let Students = {
            enName: this.form.enName,
            khName: this.form.khName,
            gender: this.form.gender,
            dob: this.form.dob,
            tel: this.form.tel,
            remove: false,
            typeId: this.form.typeId,
          }
          insertStudent
            .callPromise({ doc: Students, details: details })
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
