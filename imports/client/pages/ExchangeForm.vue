<template>
  <div>
    <fieldset>
      <legend>{{ formType }}</legend>
      <el-form v-loading="loading"
               ref="form"
               :model="form"
               :rules="rules"
               :size="formSize"
               label-position="left"
               label-width="70px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Date"
                          prop="exDate">
              <el-date-picker v-model="form.exDate"
                              type="date"
                              :clearable="false"
                              :format="dateFormat"
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
          <el-col :span="6">
            <el-form-item label="USD"
                          prop="usd">
              <el-input-number v-model="form.usd"
                               disabled
                               :precision="decimalNumber"
                               :controls="false"
                               class="number"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="KHR"
                          prop="khr">
              <el-input-number v-model="form.khr"
                               :precision="decimalNumber"
                               :min="0"
                               :controls="false"
                               class="number"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="THB"
                          prop="thb">
              <el-input-number v-model="form.thb"
                               :precision="decimalNumber"
                               :min="0"
                               :controls="false"
                               class="number"></el-input-number>
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

import {
  insertExchange,
  updateExchange,
} from '/imports/api/exchanges/methods.js'

import { mapState } from 'vuex'

export default {
  name: 'ExchangeForm',
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
        thb: 0,
      },
      rules: {
        exDate: [{ required: true }],
        usd: [{ required: true }],
        khr: [{ required: true }],
        thb: [{ required: true }],
      },
    }
  },
  computed: {
    ...mapState({
      decimalNumber(state) {
        let company = state.app && state.app.company
        return company && company.setting.decimalNumber
      },
    }),
    dateFormat() {
      return this.$store.getters['app/dateFormat']
    },
    formSize() {
      return this.$store.getters['app/formInterface']
    },
  },
  watch: {
    updateDoc(val) {
      if (val) {
        this.form = val
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
  mounted() {},
  methods: {
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
      this.$emit('form-change')
    },
  },
}
</script>

<style scoped>
.number {
  width: 100%;
}
</style>
