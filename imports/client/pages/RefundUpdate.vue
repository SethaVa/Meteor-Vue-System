<template>
  <div>
    <el-dialog title="Update Refund"
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

          </el-col>
          <el-col :span="12">
            <fieldset>
              <legend class="legend-style">Info</legend>
              <el-row>
                <el-col :span="12">

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
    </el-dialog>
  </div>
</template>

<script>
import Msg from '/imports/client/libs/message'
import Notify from '/imports/client/libs/notify'
import moment from 'moment'
import _ from 'lodash'
import wrapCurrentTime from '/imports/client/libs/wrap-current-time'
import Lookup from '/imports/client/libs/Lookup-Value'
import { findPaymentForClass } from '/imports/api/payment/methods'
import { updateRefund, findOneRefund } from '../../api/Refund/methods'
import StudentPay from './StudentPay.vue'
import SubPayment from '../../components/subPayment'
export default {
  name: 'Payment',
  components: { StudentPay, SubPayment },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    updateDoc: {
      type: Object,
      default: null,
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
      itemsProp: this.initItems(),
      saveEvent: 0,
      timeStudy: [],
      form: {},

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
  watch: {
    'form.studentId'(val) {
      this.handleStudentChange(val)
    },
  },
  mounted() {
    this.getData()
    this.getStudentUpdate()
  },
  methods: {
    getData() {
      findOneRefund
        .callPromise({ id: this.updateDoc._id })
        .then(result => {
          // console.log(result)
          this.form = result
          this.itemsProp[0].amount = result.amount
          this.itemsProp[0].discountVal = result.discountVal
          this.itemsProp[0].usd = result.usd
          this.itemsProp[0].khr = result.khr
          this.itemsProp[0].remaining = result.remaining
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
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
    getStudentUpdate() {
      let selector = {
        _id: this.updateDoc.payId,
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

            this.room = result[0].room
            this.teacher = result[0].teacher
            this.subject = result[0].subject
            this.timeStudy = result[0].time
            this.form.classId = result[0].classDetail[0].classId
            this.form.payId = result[0].classDetail[0]._id
          } else {
            this.studentIdOpts = []
          }
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error.reason })
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
          } else {
            this.form.status = 'Paid'
          }
          let Refund = {
            _id: this.updateDoc._id,
            payId: this.form.payId,
            classId: this.form.classId,
            studentId: this.form.studentId,
            tranDate: this.form.tranDate,
            type: 'Refund',
            amount: this.itemsProp[0].amount,
            usd: this.itemsProp[0].usd,
            khr: this.itemsProp[0].khr,
            discountVal: this.itemsProp[0].discountVal,
            remaining: this.itemsProp[0].remaining,
            status: this.form.status,
          }
          // console.log(Refund)
          updateRefund
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