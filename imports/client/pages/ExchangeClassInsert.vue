<template>
  <div>
    <el-dialog title="New Class"
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
              <el-select v-model="form.studentId">
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
                    <label>{{ form.fee }}</label>
                  </el-form-item>
                  <el-form-item class="form-item"
                                label="Pay Date :"
                                prop="payDate">
                    <label>{{ form.payDate }}</label>
                  </el-form-item>
                  <el-form-item class="form-item"
                                label="Duration :"
                                prop="duration">
                    <label>{{ form.duration }} months</label>
                  </el-form-item>
                  <el-form-item class="form-item"
                                label="End Date :"
                                prop="endPayDate">
                    <label>{{ form.endPayDate }}</label>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="form-item"
                                label="Total Pay :"
                                prop="totalPay">
                    <label>{{ form.totalPay }}</label>
                  </el-form-item>
                  <el-form-item class="form-item"
                                label="USD :"
                                prop="usd">
                    <label>{{ form.usd }}</label>
                  </el-form-item>
                  <el-form-item class="form-item"
                                label="KHR :"
                                prop="khr">
                    <label>{{ form.khr }}</label>
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
    </el-dialog>
  </div>
</template>

<script>
import Notify from '/imports/client/libs/notify'
import moment from 'moment'
import Lookup from '/imports/client/libs/Lookup-Value'
//
import { lookupClass } from '/imports/libs/lookup-methods'
import { findClassForStudenDetails } from '../../api/payment/methods'

export default {
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
      form: {
        tranDate: moment().toDate(),
        studentId: '',
        classFromId: '',
        classToId: '',
        fee: 0,
        payDate: '',
        duration: 0,
        endPayDate: '',
        totalPay: 0,
        usd: 0,
        khr: 0,
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
  methods: {
    handleTypeChange(val) {
      this.type = val
      this.classFromIdOpts = []
      let selector = {
        type: val,
      }
      lookupClass
        .callPromise({ selector })
        .then(result => {
          this.classFromIdOpts = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    handleClassFromChagne(val) {
      let selector = {
        type: this.type,
        _id: { $ne: val },
      }
      lookupClass
        .callPromise({ selector })
        .then(result => {
          this.classToIdOpts = result
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
        .callPromise({ selector:classSelector })
        .then(result => {
          console.log(result);
          this.studentOpts = result[0].classDetail
          console.log(this.studentOpts);
          // if (result.length > 0) {
          //   _.forEach(result, o => {
          //     this.teacherName = o.teacher
          //     this.roomName = o.room
          //     this.subjectName = o.subject
          //     this.timeStudy = o.time

          //     this.tableData = o.classDetail
          //   })
          // } else {
          //   this.teacherName = ''
          //   this.roomName = ''
          //   this.subjectName = ''
          //   this.timeStudy = []

          //   this.tableData = []
          // }
          // this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    }, 
    // getStudent(selector, getResult) {
    //   lookupClass
    //     .callPromise({ selector })
    //     .then(result => {
    //       this.getResult = result
    //     })
    //     .cathc(error => {
    //       Notify.error({ message: error })
    //     })
    //   getResult = this.getResult
    // },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // insertClassStudy
          //   .callPromise(this.form)
          //   .then(result => {
          //     MsgBox.success()
          //     this.handleresetForm()
          //   })
          //   .catch(err => {
          //     Notify.error({ message: err })
          //   })
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
  },
}
</script>

<style>
.form-item {
  margin-bottom: 0px;
}
</style>
