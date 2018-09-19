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
               label-width="70px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Date"
                          prop="exDate">
              <el-date-picker v-model="form.exDate"
                              type="date"
                              format="dd/MM/yyyy"
                              style="width:100%">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="Base"
                          prop="base">
              <el-input v-model="form.base"
                        disabled
                        style="width:100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="9">
            <el-form-item label="USD"
                          prop="usd">
              <el-input-number v-model="form.usd"
                               disabled
                               controls-position="right"
                               style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="9">
            <el-form-item label="KHR"
                          prop="khr">
              <el-input-number ref="khr"
                               v-model="form.khr"
                               controls-position="right"
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
import moment from 'moment'

import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import wrapCurrentTime from '/imports/client/lib/wrap-current-time'

import { insertExchange, updateExchange } from '../../api/exchanges/methods'

export default {
  // name: 'ExchangeNew',
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
        base: 'USD',
        exDate: moment().toDate(),
        usd: 1,
        khr: 0,
      },
      rules: {
        exDate: [{ required: true }],
        usd: [{ required: true }],
        khr: [{ required: true }],
      },
    }
  },
  watch: {
    updateDoc(val) {
      if (val) {
        this.form = val
        this.focusForm('khr')
      } else {
        this.form = {
          base: 'USD',
          exDate: moment().toDate(),
          usd: 1,
          khr: 0,
          thb: 0,
        }
      }
    },
  },
  mounted() {
    this.focusForm('khr')
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
            insertExchange
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
            updateExchange
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
      this.focusForm('khr')
      this.$emit('form-change')
    },
  },
}
</script>

<style scoped>

</style>
