<template>
  <div>
    <fieldset>
      <legend>{{ formType }}</legend>
      <el-form v-loading="loading"
               ref="form"
               :model="form"
               :rules="rules"
               size="mini"
               label-position="left"
               label-width="110px">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="Date"
                          prop="exDate">
              <el-date-picker style="width:100%"
                              v-model="form.exDate"
                              type="date"
                              format="dd/MM/yyyy">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="14">
            <el-form-item label="Student"
                          prop="base">
              <el-input-number style="width:100%"
                               v-model="form.base"
                               disabled
                               controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">

          <el-col :span="8">
            <el-form-item label="Part Time (%)"
                          prop="partTime">
              <el-input-number ref="partTime"
                               v-model="form.partTime"
                               controls-position="right"
                               style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="Full Time($)"
                          prop="fullTime">
              <el-input-number v-model="form.fullTime"
                               controls-position="right"
                               style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item>
              <el-button type="primary"
                         @click="submitForm">{{ formType }}</el-button>
              <el-button @click="handleCancel">Cancel</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </fieldset>
  </div>
</template>

<script>
import moment from 'moment'

import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import wrapCurrentTime from '/imports/client/lib/wrap-current-time'

import {
  insertSalaryRate,
  updateSalaryRate,
} from '../../api/salary-rate/methods'

export default {
  name: 'SalaryRate',
  props: {
    formType: {
      type: String,
      default: 'New',
    },
    updateDoc: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      form: {
        base: '1',
        exDate: moment().toDate(),
        partTime: 0,
        fullTime: 0,
      },
      rules: {
        exDate: [{ required: true }],
        Student: [{ required: true }],
        partTime: [{ required: true }],
        fullTime: [{ required: true }],
      },
    }
  },
  watch: {
    updateDoc(val) {
      if (val) {
        this.form = val
        this.focusForm('part Time')
      } else {
        this.form = {
          base: 'Student',
          exDate: moment().toDate(),
          Student: 1,
          partTime: 0,
          thb: 0,
        }
      }
    },
  },
  mounted() {
    this.focusForm('partTime')
  },
  methods: {
    focusForm(refName) {
      this.$refs[refName].$el.querySelector('input').focus()
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true

          // Pick doc
          this.form.exDate = wrapCurrentTime(this.form.exDate)

          if (this.formType === 'New') {
            insertSalaryRate
              .callPromise(this.form)
              .then(result => {
                if (result) {
                  this.loading = false
                  Msg.success()
                  this.handleCancel()
                }
              })
              .catch(error => {
                Notify.error({ message: error })
              })
          } else if (this.formType === 'Update') {
            updateSalaryRate
              .callPromise(this.form)
              .then(result => {
                if (result) {
                  this.loading = false
                  Msg.success()
                  this.handleCancel()
                }
              })
              .catch(error => {
                Notify.error({ message: error })
              })
          }
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
    },
    handleCancel() {
      this.resetForm()
      this.focusForm('partTime')
      this.$emit('form-change')
    },
  },
}
</script>

<style scoped>

</style>
