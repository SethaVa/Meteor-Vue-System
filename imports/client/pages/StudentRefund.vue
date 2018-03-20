<template>
  <el-dialog :visible="visible"
             width="80%"
             :before-close="handleClose">
    <span slot="title">
    <i class="fa fa-money"></i> Payment</span>
    <el-form :model="form"
             ref="form"
             :rules="rules"
             label-position="left"
             label-width="100px">
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
            <el-input type="totalPay"
                      v-model.number="form.totalPay"
                      auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
  </el-dialog>
</template>

<script>
import Notify from '/imports/client/libs/notify'
import Msg from '/imports/client/libs/message'
const numeral = require('numeral')
import wrapCurrentTime from '/imports/client/libs/wrap-current-time'
import _ from 'lodash'
import moment from 'moment'
import { insertPayment } from '../../api/payment/methods'
export default {
  name: 'StudentRefund',
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
      form: this.modalDoc,
      // form: {
      //   payDate: moment().toDate(),
      //   duration: 0,
      //   endPayDate: '',
      //   totalPay: 0,
      //   discountVal: 0,
      //   pay: 0,
      //   remaining: 0,
      //   status: 'Paid',
      // },
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
          { required: true, message: 'Total is Required', trigger: 'change' },
        ],
      },
    }
  },

  watch: {
    'form.totalPay'(val) {
      this.remaining = val
    },
    'form.discountVal'(val) {
      this.remaining = this.form.totalPay - val
      this.form.remaining = this.form.totalPay - val
      if (this.remaining < 0) {
        Notify.warning({
          message: 'Discount Balance is bigger than Total balance',
        })
        this.form.pay = 0
      }
    },
    'form.pay'(val) {
      this.remaining = this.form.totalPay - this.form.discountVal - val
      this.form.remaining = this.form.totalPay - this.form.discountVal - val
      if (this.remaining < 0) {
        Notify.warning({ message: 'Pay Balance is bigger than Total balance' })
        this.form.pay = 0
      }
    },
  },
  mounted() {
    console.log(this.modalDoc)
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
            this.form.status = 'Dept'
          }
          let Payment = {
            classId: this.modalDoc.classId,
            studentId: this.modalDoc.studentId,
            payDate: this.form.payDate,
            duration: this.form.duration,
            endPayDate: this.form.endPayDate,
            totalPay: this.form.totalPay,
            discountVal: this.form.discountVal,
            pay: this.form.pay,
            remaining: this.form.remaining,
            status: this.form.status,
          }
          insertPayment
            .callPromise({ doc: Payment, _id: this.modalDoc._id })
            .then(result => {
              Msg.success()
              this.handleClose()
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
