<template>
  <div>
    <!-- <component :is="currentModal"
               :modal-doc="modalDoc"
               :visible="modalVisible"
               @modal-close="handleClose">
    </component> -->
    <!-- <legend>Filter</legend> -->
    <!-- <el-dialog :close-on-click-modal="false" title="New Income"
               width="80%"
               :visible="visible"
               :before-close="handleClose"> -->
    <el-form :model="form"
             ref="form"
             :rules="rules"
             size="mini"
             label-position="left"
             label-width="90px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="No # "
                        prop="receiptCode">
            <el-input v-model="form.receiptCode"
                      :placeholder="refNumLoading">
              <el-button slot="append"
                         icon=" fa fa-barcode"
                         @click="getNextRefNum">
              </el-button>
            </el-input>
          </el-form-item>
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
          <el-form-item label="Fee"
                        prop="fee">
            <el-input v-model="form.fee">

            </el-input>
          </el-form-item>
          <el-form-item label="Pay Date"
                        prop="payDate">
            <el-date-picker style="width:100%"
                            v-model="form.payDate"></el-date-picker>
          </el-form-item>

        </el-col>
        <el-col :span="12">

          <el-form-item label="Duration"
                        prop="duration">
            <el-select v-model="form.duration">
              <el-option v-for="doc in 12 "
                         :key="doc"
                         :label="doc + ' months'"
                         :value="doc"></el-option>
            </el-select>
          </el-form-item>
          <fieldset>
            <legend class="legend-style">Info</legend>
            <el-row>

              <el-col :span="12">

                <el-form-item class="info"
                              label="Late Day :">
                  <label style="color:red;font-weight:600"> {{ -1*lateDay +' days' }}</label>
                </el-form-item>
                <el-form-item class="info"
                              label="End Date :">
                  <label>{{ formatDate(endDate) }}</label>
                </el-form-item>
                <el-form-item class="info"
                              label="Room :">
                  <label>{{ room }}</label>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="info"
                              label="Teacher :">
                  <label> {{ teacher }}</label>
                </el-form-item>
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
                   :total-pay-prop="true"
                   :save-event="saveEvent"
                   :items-prop="itemsProp"
                   @sub-payment="handlePaymentChange"></sub-payment>

      <el-form-item>
        <el-button type="primary"
                   @click="saveEvent++"
                   size="mini">Save</el-button>
        <el-button @click="handleClose"
                   size="mini">Cancel</el-button>
      </el-form-item>

    </el-form>
    <!-- <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="saveEvent++"
                   size="mini">Save</el-button>
        <el-button @click="handleClose"
                   size="mini">Cancel</el-button>
      </span>
    </el-dialog :close-on-click-modal="false"> -->
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
import { getNextRef } from '/imports/util/get-next-ref'
import {
  findPaymentForClass,
  findOnePaymentByCode,
} from '../..//api/payment/methods'
import { insertPayment } from '/imports/modules/school/api/payment/methods'
import { findExchanges } from '/imports/modules/school/api/exchanges/methods'
//
import StudentPay from './StudentPay.vue'
import SubPayment from '../components/subPayment.vue'
export default {
  // name: 'Payment',
  components: { StudentPay, SubPayment },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    // Check Code
    const validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Code is requiered'))
      }
      setTimeout(() => {
        let selector = {
          receiptCode: value,
        }
        findOnePaymentByCode
          .callPromise({ selector })
          .then(result => {
            if (result) {
              callback(new Error('This code is exist'))
            } else {
              callback()
            }
          })
          .catch(error => {
            Notify.error({ message: error })
          })
      }, 1000)
    }

    return {
      loading: false,
      refNumLoading: 'eg. 1',
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
      exchangeRate: 0,
      saveEvent: 0,
      lateDay: 0,
      form: {
        receiptCode: '',
        fee: 0,
        refType: 'Payment',
        classId: '',
        payDate: moment().toDate(),
        duration: 1,
        type: '',
        studentId: '',
        status: 'Paid',
      },

      rules: {
        receiptCode: [{ validator: validateCode, trigger: 'change' }],
        studentId: [
          { required: true, message: 'Student is Required', trigger: 'change' },
        ],
        type: [
          { required: true, message: 'Type is Required', trigger: 'change' },
        ],
        payDate: [
          { required: true, message: 'Date is Required', trigger: 'change' },
        ],
        fee: [{ required: true, message: 'Fee is Required', trigger: 'blure' }],
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
    'form.duration'(val) {
      this.itemsProp[0].totalPay = val * this.form.fee
    },
  },
  mounted() {
    compareDate()
    this.getExchangeRate()
    this.getNextRefNum()
  },
  methods: {
    getNextRefNum() {
      this.refNumLoading = 'Loading....'
      getNextRef
        .callPromise({
          collectionName: 'payment',
          opts: {
            field: 'receiptCode',
            // selector: {},
            paddingType: 'start',
            paddingLength: 5,
            paddingChar: '0',
            prefix: '',
          },
        })
        .then(result => {
          if (result) {
            this.form.receiptCode = result
          }
        })
        .catch(error => {
          this.refNumLoading = 'eg. 1'
          Notify.error({ message: error })
        })
    },
    initItems() {
      return [
        {
          totalPay: 0,
          discountVal: 0,
          usd: 0,
          khr: 0,
          remaining: 0,
        },
      ]
    },
    getExchangeRate() {
      this.exchangeRate = 0
      findExchanges
        .callPromise({})
        .then(result => {
          if (result.length > 0) {
            this.exchangeRate = result[0].khr
          } else {
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
        status: 'Expires',
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
      let currentDate = moment().toDate()
      let selector = {
        studentId: val,
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
            this.endDate = result[0].classDetail[0].endPayDate
            this.form.payDate = result[0].classDetail[0].endPayDate
            this.form.classId = result[0].classDetail[0].classId
            this.form.lastId = result[0].classDetail[0]._id
            this.lateDay = moment(this.form.payDate).diff(currentDate, 'day')
          } else {
            this.studentIdOpts = []
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
          this.form.payDate = wrapCurrentTime(this.form.payDate)
          this.form.endPayDate = wrapCurrentTime(
            moment(this.form.payDate).add(this.form.duration, 'months')
          )
          if (this.itemsProp[0].remaining != 0) {
            this.form.status = 'Debt'
          }
          let recieveKhr = this.itemsProp[0].khr / this.exchangeRate

          isNaN(recieveKhr) == true
            ? (recieveKhr = 0)
            : (recieveKhr = recieveKhr)

          let totalRecieve =
            this.itemsProp[0].usd + recieveKhr + this.itemsProp[0].discountVal

          let Payment = {
            receiptCode: this.form.receiptCode,
            tranDate: moment().toDate(),
            refType: this.form.refType,
            classId: this.form.classId,
            studentId: this.form.studentId,
            type: this.form.type,
            payDate: this.form.payDate,
            duration: this.form.duration,
            totalPay: parseInt(this.itemsProp[0].totalPay),
            endPayDate: this.form.endPayDate,
            usd: this.itemsProp[0].usd,
            khr: this.itemsProp[0].khr,
            discountVal: this.itemsProp[0].discountVal,
            remaining: this.itemsProp[0].remaining,
            status: this.form.status,
            lastId: this.form.lastId,
            fee: parseInt(this.form.fee),
            totalRecieve: totalRecieve,
          }
          insertPayment
            .callPromise({ doc: Payment })
            .then(result => {
              if (result) {
                Msg.success()
                this.resetForm()
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
    resetForm() {
      this.$refs['form'].resetFields()
      this.itemsProp[0].totalPay = 0
      this.itemsProp[0].discountVal = 0
      this.itemsProp[0].usd = 0
      this.itemsProp[0].khr = 0
      this.itemsProp[0].remaining = 0
    },
    handleClose() {
      this.$router.go(-1)
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
  font-weight: 600;
  color: red;
  font-size: 18px;
}
.info {
  margin-bottom: 1vh;
  font-weight: 400;
}
.form-btn-position {
  float: right;
  margin-top: 2vh;
}
</style>
