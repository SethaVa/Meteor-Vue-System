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
            <el-input type="pay"
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
import Notify from '/imports/client/libs/notify'
import Msg from '/imports/client/libs/message'
const numeral = require('numeral')
import wrapCurrentTime from '/imports/client/libs/wrap-current-time'
import _ from 'lodash'
import moment from 'moment'
import { updatePaymentForRefund } from '../../api/payment/methods'
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
      //   usd: 0,
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
        usd: [{ required: true, message: 'USD is Required', trigger: 'blur' }],
        khr: [{ required: true, message: 'KHR is Required', trigger: 'blur' }],
      },
    }
  },

  watch: {
    'form.usd'(val) {
      this.remaining = val
    },
    'form.discountVal'(val) {
      this.remaining = this.form.usd - val
      this.form.remaining = this.form.usd - val
      if (this.remaining < 0) {
        Notify.warning({
          message: 'Discount Balance is bigger than Total balance',
        })
        this.form.pay = 0
      }
    },
    'form.pay'(val) {
      this.remaining = this.form.usd - this.form.discountVal - val
      this.form.remaining = this.form.usd - this.form.discountVal - val
      if (this.remaining < 0) {
        Notify.warning({ message: 'Pay Balance is bigger than Total balance' })
        this.form.pay = 0
      }
    },
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
          } else {
            this.form.status = 'Paid'
          }
          let Refund = {
            _id: this.modalDoc._id,
            classId: this.modalDoc.classId,
            studentId: this.modalDoc.studentId,
            payDate: this.form.payDate,
            duration: this.form.duration,
            endPayDate: this.form.endPayDate,
            usd: this.form.usd,
            discountVal: this.form.discountVal,
            khr: this.form.khr,
            remaining: this.form.remaining,
            status: this.form.status,
          }
          updatePaymentForRefund
            .callPromise({ doc: Refund })
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
