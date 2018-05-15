<template>
  <div>
    <!-- <component :is="currentModal"
               :modal-doc="modalDoc"
               :visible="modalVisible"
               @modal-close="handleClose">
    </component> -->
    <!-- <legend>Filter</legend> -->
    <el-dialog title="New Income"
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
            <el-form-item label="Duration"
                          prop="duration">
              <el-select v-model="form.duration">
                <el-option v-for="doc in 12 "
                           :key="doc"
                           :label="doc + ' months'"
                           :value="doc"></el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <fieldset>
              <legend class="legend-style">Info</legend>
              <el-row>
                <el-col :span="12">
                  <el-form-item class="info"
                                label="Late Date :">
                    <label> {{ 0 }}</label>
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
import compareDate from '/imports/libs/compare-date'
import Lookup from '/imports/client/libs/Lookup-Value'
import { findPaymentForClass } from '/imports/api/payment/methods'
import { insertPayment } from '../../api/payment/methods'
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
      form: {
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

  mounted() {
    // this.getTypeData()
    // this.getPaymentData()
  },
  methods: {
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
            // this.dataTable = []
            // _.forEach(result[0].classDetail, o => {
            //   this.studentIdOpts.push({
            //     label: o.studentId + ' - ' + o.student,
            //     value: o.studentId,
            //   })
            // })
          } else {
            this.studentIdOpts = []
          }
          this.loading = false
        })
        .catch(error => {
          Notify.error({ message: error.reason })
        })
    },
    // handleSubmit() {
    //   this.$refs['form'].validate(valid => {
    //     if (valid) {
    //       this.$refs['formPayment'].validate(valid => {
    //         if (valid) {
    //           console.log(this.formPayment)
    //         } else {
    //           return false
    //         }
    //       })
    //     } else {
    //       return false
    //     }
    //   })
    // },
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
          let Payment = {
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
            fee: this.form.fee,
          }
          // console.log(Payment)
          insertPayment
            .callPromise({ doc: Payment })
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
  margin-bottom: 1vh;
  font-weight: 400;
}
.form-btn-position {
  float: right;
  margin-top: 2vh;
}
</style>
