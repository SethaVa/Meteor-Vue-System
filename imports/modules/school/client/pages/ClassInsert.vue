<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="New Class"
               width="80%"
               :visible="visible"
               :before-close="handleClose">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               size="mini"
               label-position="left"
               label-width="100px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Date"
                          prop="classDate">
              <el-date-picker style="width:100%"
                              v-model="form.classDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="Room"
                          prop="roomId">
              <el-select v-model="form.roomId">
                <el-option v-for="item in roomIdOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Time"
                          prop="timeId">
              <el-select v-model="form.timeId">
                <el-option v-for="item in timeIdOpts"
                           :key="item.value"
                           :label="formatTime(item.label)"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Teacher"
                          prop="staffId">
              <el-select v-model="form.staffId">
                <el-option v-for="item in staffIdOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Subject"
                          prop="subId">
              <el-select v-model="form.subId">
                <el-option v-for="item in subIdOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Type"
                          prop="type">
              <el-select v-model="form.type"
                         @change="handleTypeChange">
                <el-option v-for="item in typeOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Rate"
                          prop="rateId">
              <el-select v-model="form.rateId"
                         placeholder="Please Selecte Rate">
                <el-option v-for="doc in rateOpt"
                           :key="doc.value"
                           :label="doc.label"
                           :value="doc.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Status"
                          prop="status">
              <el-select v-model="form.status">
                <el-option v-for="item in statusOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   size="mini"
                   @click="handleSave">Save</el-button>
        <el-button @click="handleClose"
                   size="mini">Cancel</el-button>
      </span>
    </el-dialog :close-on-click-modal="false">
  </div>

</template>

<script>
import MsgBox from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import { findTimeStudyOpts } from '/imports/modules/school/api/time/methods'
import { insertClassStudy } from '/imports/modules/school/api/classStudy/methods'
import { findRoomOpts } from '/imports/modules/school/api/rooms/methods'
import { findStaffOpts } from '/imports/modules/school/api/Staffs/methods'
import { findSubjectOpts } from '/imports/modules/school/api/subject/methods'
import {
  findSalaryRatePartTimeOpts,
  findSalaryRateFullTimeTimeOpts,
} from '/imports/modules/school/api/rate-salary/methods'
import lookupValue from '../../client/lib/Lookup-Value'
import LookUp from '../../client/lib/Lookup-Value'
import moment from 'moment'
import _ from 'lodash'
export default {
  // name: 'ClassStudyInsert',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      statusOpts: lookupValue.status,
      roomIdOpts: [],
      timeIdOpts: [
        { label: '1:00-2:00', value: '001' },
        { label: '2:00-3:00', value: '002' },
        { label: '3:00-4:00', value: '003' },
      ],
      staffIdOpts: [],
      subIdOpts: [],
      typeOpts: LookUp.type,
      rateOpt: [],
      partTimeRate: [],
      fullTimeRate: [],
      form: {
        classDate: moment().toDate(),
        roomId: '',
        timeId: '',
        staffId: '',
        subId: '',
        type: '',
        status: '',
        rateId: '',
      },
      rules: {
        classDate: [
          {
            required: true,
            message: 'Please Select Date',
            trigger: 'chnage',
          },
        ],
        roomId: [
          {
            required: true,
            message: 'Please Select Room',
            trigger: 'change',
          },
        ],
        timeId: [
          {
            required: true,
            message: 'Please Select Time',
            trigger: 'change',
          },
        ],
        staffId: [
          {
            required: true,
            message: 'Please Select Teacher',
            trigger: 'change',
          },
        ],
        subId: [
          {
            required: true,
            message: 'Please Select Subject',
            trigger: 'change',
          },
        ],
        type: [
          {
            required: true,
            message: 'Please Select Type',
            trigger: 'change',
          },
        ],
        status: [
          {
            required: true,
            message: 'Please Select Status',
            trigger: 'change',
          },
        ],
        rateId: [
          {
            required: true,
            message: 'Please Select Rate',
            trigger: 'change',
          },
        ],
      },
    }
  },
  mounted() {
    this.getRoomData()
    this.getStaffData()
    this.getSubjectId()
    this.getTimeData()
    this.getRatePartTime()
    this.getRateFullTime()
  },
  methods: {
    getRoomData() {
      findRoomOpts
        .callPromise({})
        .then(result => {
          this.roomIdOpts = result
        })
        .catch(err => {
          Notify.error({ message: err })
        })
    },
    getStaffData() {
      findStaffOpts
        .callPromise({})
        .then(result => {
          this.staffIdOpts = result
        })
        .catch(err => {
          Notify.error({ message: err })
        })
    },
    getSubjectId() {
      findSubjectOpts
        .callPromise({})
        .then(result => {
          this.subIdOpts = result
        })
        .catch(err => {
          Notify.error({ message: err })
        })
    },

    getTimeData() {
      findTimeStudyOpts
        .callPromise({})
        .then(result => {
          this.timeIdOpts = result
        })
        .catch(err => {
          Notify.error({ message: err })
        })
    },
    getRatePartTime() {
      findSalaryRatePartTimeOpts
        .callPromise({})
        .then(result => {
          // console.log(result)
          this.partTimeRate = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    getRateFullTime() {
      findSalaryRateFullTimeTimeOpts
        .callPromise({})
        .then(result => {
          // console.log(result)
          this.fullTimeRate = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    handleTypeChange(val) {
      this.rateOpt = []
      if (val == 'Part Time') {
        this.rateOpt = this.partTimeRate
      } else {
        this.rateOpt = this.fullTimeRate
      }
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          insertClassStudy
            .callPromise(this.form)
            .then(result => {
              MsgBox.success()
              this.handleresetForm()
            })
            .catch(err => {
              Notify.error({ message: err })
            })
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$emit('modal-close')
    },
    handleresetForm() {
      this.$refs['form'].resetFields()
    },
    formatTime(val) {
      let data = _.map(val)
        .map(o => {
          return moment(o).format('LT')
        })
        .join('-')
      return data
    },
  },
}
</script>

 <style lang="scss">
.dateTime {
  width: 100%;
}
</style>
