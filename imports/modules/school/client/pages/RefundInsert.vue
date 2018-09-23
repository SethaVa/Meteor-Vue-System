<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="New Refund"
               width="80%"
               :visible="visible"
               :before-close="handleClose">
      <el-form :model="form"
               ref="form"
               :rules="rules"
               size="mini"
               label-position="left"
               label-width="90px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Type"
                          prop="type">
              <el-select v-model="form.type"
                         clearable
                         placeholder="select type"
                         @change="handleTypeChange">
                <el-option v-for="doc in typeOpts"
                           :key="doc.value"
                           :label="doc.label"
                           :value="doc.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Student"
                          prop="studentId">
              <el-select v-model="form.studentId"
                         @change="handleStudentChange"
                         placeholder="Please Select Student">
                <el-option v-for="doc in studentIdOpts"
                           :key="doc.value"
                           :label="doc.label"
                           :value="doc.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Pay Date"
                          prop="tranDate">
              <el-date-picker style="width:100%"
                              v-model="form.tranDate"></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="Duration"
                          prop="duration">
              <el-select v-model="form.duration">
                <el-option v-for="doc in 12 "
                           :key="doc"
                           :label="doc + ' months'"
                           :value="doc"></el-option>
              </el-select>
            </el-form-item> -->

          </el-col>
          <el-col :span="12">
            <fieldset>
              <legend class="legend-style">Info</legend>
              <el-row>
                <el-col :span="12">
                  <!-- <el-form-item class="info"
                                label="Late Date :">
                    <label> {{ 0 }}</label>
                  </el-form-item>
                  <el-form-item class="info"
                                label="End Date :">
                    <label>{{ formatDate(endDate) }}</label>
                  </el-form-item> -->
                  <el-form-item class="info"
                                label="Teacher :">
                    <label> {{ teacher }}</label>
                  </el-form-item>
                  <el-form-item class="info"
                                label="Room :">
                    <label>{{ room }}</label>
                  </el-form-item>
                </el-col>
                <el-col :span="12">

                  <el-form-item class="info"
                                label="Subject :">
                    <label>{{ subject }}</label>
                  </el-form-item>
                  <el-form-item class="info"
                                label="Time :">
                    <label>{{ formatTime(timeStudy) }}</label>
                  </el-form-item>
                </el-col>
              </el-row>
            </fieldset>
          </el-col>
        </el-row>
        <sub-payment @save-form="saveForm"
                     :amount-prop="true"
                     :save-event="saveEvent"
                     :items-prop="itemsProp"
                     @sub-payment="handlePaymentChange"></sub-payment>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="saveEvent++"
                   size="mini">Save</el-button>
        <el-button @click="handleClose"
                   size="mini">Cancel</el-button>
      </span>
    </el-dialog :close-on-click-modal="false">
  </div>
</template>

<script>
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import moment from 'moment'
import _ from 'lodash'
import wrapCurrentTime from '/imports/client/lib/wrap-current-time'
import compareDate from '/imports/modules/school/util/compare-date'
import Lookup from '/imports/client/lib/Lookup-Value'
import { findPaymentForClass } from '/imports/modules/school/api/payment/methods'
import { insertRefund } from '/imports/modules/school/api/Refund/methods'
import { findExchanges } from '/imports/modules/school/api/exchanges/methods'

import StudentPay from './StudentPay.vue'
import SubPayment from '../components/subPayment'
export default {
  name: 'RefundInsert',
  components: { StudentPay, SubPayment },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      type: '',
      typeOpts: Lookup.type,
      currentModal: null,
      modalVisible: false,
      modalDoc: null,
      loading: false,
      studentIdOpts: [],
      room: '',
      teacher: '',
      subject: '',
      timeStudy: [],
      endDate: moment().toDate(),
      itemsProp: this.initItems(),
      saveEvent: 0,
      exchangeRate: 0,

      form: {
        payId: '',
        tranDate: moment().toDate(),
        type: '',
        studentId: '',
        status: 'Paid',
      },

      rules: {
        studentId: [
          { required: true, message: 'Student is Required', trigger: 'change' },
        ],
        type: [
          { required: true, message: 'Type is Required', trigger: 'change' },
        ],
        tranDate: [
          { required: true, message: 'Date is Required', trigger: 'change' },
        ],
        duration: [
          {
            required: true,
            message: 'Duration is Required',
            trigger: 'change',
          },
        ],
      },
    }
  },

  mounted() {
    // this.getTypeData()
    // this.getPaymentData()
    this.getExchangeRate()
  },
  methods: {
    initItems() {
      return [
        {
          amount: 0,
          discountVal: 0,
          usd: 0,
          khr: 0,
          remaining: 0,
        },
      ]
    },
    getExchangeRate() {
      findExchanges
        .callPromise({})
        .then(result => {
          if(result.length>0){
            this.exchangeRate = result[0].khr
          }else{
            this.exchangeRate = 0
          }
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    handlePaymentChange(item) {
      this.itemsProp = item
    },
    handleTypeChange(val) {
      let selector = {
        type: val,
        status: 'Debt',
      }
      this.loading = true
      findPaymentForClass
        .callPromise({ selector: selector })
        .then(result => {
          if (result.length > 0) {
            this.dataTable = []
            _.forEach(result[0].classDetail, o => {
              this.studentIdOpts.push({
                label: o.studentId + ' - ' + o.student,
                value: o.studentId,
              })
            })
          } else {
            this.studentIdOpts = []
          }
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error.reason })
        })
    },
    handleStudentChange(val) {
      let selector = {
        studentId: val,
        status: 'Debt',
      }
      this.loading = true
      findPaymentForClass
        .callPromise({ selector: selector })
        .then(result => {
          // console.log(result)
          if (result.length > 0) {
            this.room = result[0].room
            this.teacher = result[0].teacher
            this.subject = result[0].subject
            this.timeStudy = result[0].time
            this.form.classId = result[0].classDetail[0].classId
            this.form.payId = result[0].classDetail[0]._id
            this.itemsProp[0].amount = result[0].classDetail[0].remaining

            // this.dataTable = []
            // _.forEach(result[0].classDetail, o => {
            //   this.studentIdOpts.push({
            //     label: o.studentId + ' - ' + o.student,
            //     value: o.studentId,
            //   })
            // })
          }
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error.reason })
        })
    },

    saveForm(childValid) {
      this.$refs['form'].validate(valid => {
        if (valid && childValid) {
          // console.log(this.form, this.itemsProp)
          this.form.tranDate = wrapCurrentTime(this.form.tranDate)
          this.form.endtranDate = wrapCurrentTime(
            moment(this.form.tranDate).add(this.form.duration, 'months')
          )
          if (this.itemsProp[0].remaining != 0) {
            this.form.status = 'Debt'
          }

          let recieveKhr = this.itemsProp[0].khr / this.exchangeRate

          isNaN(recieveKhr) == true ? recieveKhr=0 : recieveKhr=recieveKhr
          
          let totalRecieve = this.itemsProp[0].usd + recieveKhr +this.itemsProp[0].discountVal
          
          // let totalRecieve =
          //   this.itemsProp[0].usd + this.itemsProp[0].khr / this.exchangeRate
          let Refund = {
            type: this.form.type,
            payId: this.form.payId,
            classId: this.form.classId,
            studentId: this.form.studentId,
            tranDate: this.form.tranDate,
            amount: this.itemsProp[0].amount,
            usd: this.itemsProp[0].usd,
            khr: this.itemsProp[0].khr,
            discountVal: this.itemsProp[0].discountVal,
            remaining: this.itemsProp[0].remaining,
            status: this.form.status,
            totalRecieve: totalRecieve,
          }
          insertRefund
            .callPromise({ doc: Refund })
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
    formatDate(val) {
      return moment(val).format('DD/MM/YYYY')
    },
    handleBack() {
      this.$router.go(-1)
    },
    formatTime(val) {
      let data = val
        .map(o => {
          return moment(o).format('LT')
        })
        .join('-')
      return data
    },
  },
}
// let selector = {
//   classId: this.form.classId,
//   status: { $in: ['Expires', '$classDetail'] },
// }
// this.loading = true
// findPaymentForClass
//   .callPromise({ selector: selector })
//   .then(result => {
//     if (result.length > 0) {
//       this.dataTable = []
//       _.forEach(result[0].classDetail, o => {
//         this.dataTable = result[0].classDetail
//       })
//     } else {
//       this.dataTable = []
//     }
//     this.loading = false
//   })
//   .catch(error => {
//     Notify.error({ message: error.reason })
//   })
</script>

<style lang="scss" scoped >
.legend-style {
  font-weight: 400;
  color: red;
  font-size: 18px;
}
.info {
  margin-bottom: 0;
  font-weight: 400;
}
.form-btn-position {
  float: right;
  margin-top: 2vh;
}
</style>
