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
          <el-col :span="6">
            <el-form-item label="Name"
                          prop="name">
              <el-input ref="name"
                        v-model="form.name"
                        style="width:100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Rate"
                          prop="rate">
              <el-input-number ref="rate"
                               v-model="form.rate"
                               :controls="false"
                               :min="0"
                               style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="Amount"
                          prop="amount">
              <el-input-number v-model="form.amount"
                               :controls="false"
                               :min="0"
                               style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="6">
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

import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'

import {
  insertRateSalary,
  updateRateSalary,
} from '/imports/modules/school/api/rate-salary/methods'

export default {
  name: 'SalaryRateForm',
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
        name: '',
        rate: 0,
        amount: 0,
      },
      rules: {
        name: [{ required: true }],
        rate: [{ required: true }],
        amount: [{ required: true }],
      },
    }
  },
  watch: {
    updateDoc(val) {
      if (val) {
        this.form = val
      } else {
        this.form = {
          name: '',
          rate: 0,
          amount: 0,
        }
      }
    },
  },
  mounted() {
    // this.focusForm('partTime')
  },
  methods: {
    submitForm() {
      this.loading = true
      this.$refs['form'].validate(valid => {
        if (valid) {
          // Pick do
          if (this.formType === 'New') {
            insertRateSalary
              .callPromise({ doc: this.form })
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
            updateRateSalary
              .callPromise({ doc: this.form })
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
      this.$emit('form-change')
    },
  },
}
</script>

<style scoped>
</style>
