<template>
  <el-form ref="form"
           :model="form"
           rules="rules">
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
    <el-form-item label="Total Pay"
                  prop="totalPay">
      <el-input type="totalPay"
                v-model.number="form.totalPay"
                auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="Dis Val"
                  prop="discountVal">
      <el-input type="discountVal"
                v-model.number="form.discountVal"
                auto-complete="off">

      </el-input>
    </el-form-item>
    <el-form-item label="Pay"
                  prop="pay">
      <el-input type="pay"
                v-model.number="form.pay"
                auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="Remaining"
                  prop="remaining">
      <label>{{ formatNumer(remaining) }}</label>
    </el-form-item>
  </el-form>
</template>

<script>
const numeral = require('numeral')
import _ from 'lodash'
import moment from 'moment'
export default {
  name: 'SubPayment',
  data() {
    return {
      form: {
        payDate: moment().toDate(),
        duration: 0,
        endPayDate: '',
        totalPay: 0,
        discountVal: 0,
        pay: 0,
        remaining: 0,
      },
      rules: {
        payDate: [{ require: true }],
        duration: [{ require: true }],
        totalPay: [{ require: true }],
      },
    }
  },
  methods: {
    emitToParent() {
      this.$emit('sub-payment', _.cloneDeep(this.form))
    },
    saveForm() {
      this.$refs['form'].validate(valid => {
        this.$emit('save-form', valid)
      })
    },
    formatNumer(val) {
      return numeral(val).format('0,0.00 $')
    },
  },
}
</script>

<style>

</style>
