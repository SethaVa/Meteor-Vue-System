<template>
  <el-dialog :close-on-click-modal="false" :visible="visible"
             width="80%"
             :before-close="handleClose">
    <span slot="title">
    <i class="fa fa-money"></i> Payment</span>
    <el-form :model="form"
             ref="form"
             :rules="rules"
             label-position="left"
             label-width="100px"
             size="mini">
      <el-row :gutter="20">
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
          <el-form-item label="Total Pay"
                        prop="totalPay">
            <el-input type="number"
                      v-model="form.totalPay"></el-input>
          </el-form-item>
          <el-form-item label="USD"
                        prop="usd">
            <el-input type="usd"
                      v-model.number="form.usd"
                      auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="KHR"
                        prop="khr">
            <el-input type="khr"
                      v-model.number="form.khr"
                      auto-complete="off"></el-input>
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
            <el-input type="remaining"
                      v-model.number="form.remaining"
                      auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">

      <el-button size="mini"
                 type="primary"
                 @click="saveForm">Save</el-button>
      <el-button size="mini"
                 @click="handleClose">Cancel</el-button>
    </span>
  </el-dialog :close-on-click-modal="false">
</template>

<script>
import Notify from '/imports/client/lib/notify'
import Msg from '/imports/client/lib/message'
const numeral = require('numeral')
import wrapCurrentTime from '/imports/client/lib/wrap-current-time'
import _ from 'lodash'
import moment from 'moment'
import { insertPayment } from '/imports/modules/school/api/payment/methods'
export default {
  // name: 'SubPayment',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    modalDoc: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      remaining: 0,
      form: {
        refType: 'Payment',
        tranDate: moment().toDate(),
        payDate: moment().toDate(),
        duration: 0,
        endPayDate: '',
        totalPay: 0,
        usd: 0,
        khr: 0,
        discountVal: 0,
        remaining: 0,
        status: 'Paid',
      },
      rules: {
        payDate: [
          { required: true, message: 'Date is Required', trigger: 'change' },
        ],
        duration: [
          {
            required: true,
            message: 'Duration is Required',
            trigger: 'change',
          },
        ],
        totalPay: [
          {
            required: true,
            message: 'Total pay is Required',
            trigger: 'change',
          },
        ],
        usd: [
          { required: true, message: 'USD is Required', trigger: 'change' },
        ],
        khr: [
          { required: true, message: 'KHR is Required', trigger: 'change' },
        ],
      },
    }
  },
  watch: {
    // 'form.totalPay'(val) {
    //   this.remaining = val
    // },
    // 'form.discountVal'(val) {
    //   this.remaining = this.form.totalPay - val
    //   this.form.remaining = this.form.totalPay - val
    //   if (this.remaining < 0) {
    //     Notify.warning({
    //       message: 'Discount Balance is bigger than Total balance',
    //     })
    //     this.form.pay = 0
    //   }
    // },
    // 'form.pay'(val) {
    //   this.remaining = this.form.totalPay - this.form.discountVal - val
    //   this.form.remaining = this.form.totalPay - this.form.discountVal - val
    //   if (this.remaining < 0) {
    //     Notify.warning({ message: 'Pay Balance is bigger than Total balance' })
    //     this.form.pay = 0
    //   }
    // },
  },
  methods: {
    saveForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.payDate = wrapCurrentTime(this.form.payDate)
          this.form.endPayDate = wrapCurrentTime(
            moment(this.form.payDate).add(this.form.duration, 'months')
          )
          if (this.form.remaining != 0) {
            this.form.status = 'Debt'
          }
          let Payment = {
            tranDate: moment().toDate(),
            refType: this.form.refType,
            classId: this.modalDoc.classId,
            studentId: this.modalDoc.studentId,
            type: this.modalDoc.type,
            payDate: this.form.payDate,
            duration: this.form.duration,
            totalPay: parseInt(this.form.totalPay),
            endPayDate: this.form.endPayDate,
            usd: this.form.usd,
            khr: this.form.khr,
            discountVal: this.form.discountVal,
            remaining: this.form.remaining,
            status: this.form.status,
          }
          insertPayment
            .callPromise({ doc: Payment, _id: this.modalDoc._id })
            .then(result => {
              if (result) {
                Msg.success()
                this.handleClose()
              }
            })
            .catch(error => {
              Notify.error({ message: error })
            })
        } else {
          return false
        }
      })
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
