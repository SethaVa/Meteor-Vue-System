<template>
  <div>
    <el-dialog title="New Class"
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
              <el-select v-model="form.type">
                <el-option v-for="item in typeOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
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
                   @click="handleSave">Save</el-button>
        <el-button @click="handleClose">Cancel</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import MsgBox from '/imports/client/libs/message'
import Notify from '/imports/client/libs/notify'
import { findTimeStudyOpts } from '../../api/time/methods'
import { updateClassStudy } from '../../api/classStudy/methods'
import { findRoomOpts } from '../../api/rooms/methods'
import { findStaffOpts } from '../../api/Staffs/methods'
import { findSubjectOpts } from '../../api/subject/methods'
import { findTypeOpts } from '../../api/types/methods'
import lookupValue from '../../client/libs/Lookup-Value'
import LookUp from '../../client/libs/Lookup-Value'

import moment, { isMoment } from 'moment'
export default {
  name: 'ClassStudyInsert',
  props: {
    updateDoc: {
      type: Object,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      statusOpts: lookupValue.status,
      roomIdOpts: [],
      timeIdOpts: [],
      staffIdOpts: [],
      subIdOpts: [],
      typeOpts: LookUp.type,
      form: this.updateDoc,

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
      },
    }
  },
  mounted() {
    this.getRoomData()
    this.getStaffData()
    this.getSubjectId()
    this.getTimeData()
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
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateClassStudy
            .callPromise(this.form)
            .then(result => {
              MsgBox.success()
              this.handleClose()
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
      let data = val
        .map(o => {
          return moment(o).format('hh:mm a')
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
