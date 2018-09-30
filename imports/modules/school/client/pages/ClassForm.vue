<template>
  <div>

    <el-form :model="form"
             :rules="rules"
             ref="form"
             :size="formSize"
             v-loading="loading.form"
             label-position="left"
             label-width="100px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Type"
                        prop="type">
            <el-radio-group v-model="form.type">
              <el-radio label="Part_Time"></el-radio>
              <el-radio label="Full_Time"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="Room"
                        prop="roomId">
            <el-select v-model="form.roomId"
                       :placeholder="loading.room">
              <el-option v-for="item in roomIdOpts"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Time"
                        prop="timeId">
            <el-select v-model="form.timeId"
                       :placeholder="loading.time">
              <el-option v-for="item in timeIdOpts"
                         :key="item.value"
                         :label="formatTime(item.label)"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Teacher"
                        prop="staffId">
            <el-select v-model="form.staffId"
                       :placeholder="loading.teacher">
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
            <el-select v-model="form.subId"
                       :placeholder="loading.subject">
              <el-option v-for="item in subIdOpts"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Rate"
                        prop="rateId">
            <el-select v-model="form.rateId"
                       :placeholder="loading.rate">
              <el-option v-for="doc in rateOpt"
                         :key="doc.value"
                         :label="doc.label"
                         :value="doc.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Code"
                        prop="code">
            <el-input v-model="form.code"
                      :placeholder="loading.code">
              <el-button slot="append"
                         icon=" fa fa-barcode"
                         @click="_getNextRefNum">
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="Date"
                        prop="classDate">
            <el-date-picker :format="dateFormat"
                            :clearable="false"
                            v-model="form.classDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="Status"
                        prop="status">
            <el-radio-group v-model="form.status">
              <el-radio label="Active"></el-radio>
              <el-radio label="Inactive"></el-radio>
            </el-radio-group>
          </el-form-item>

        </el-col>
      </el-row>
      <div class="clear-fix">
        <el-form-item style="float: right;">
          <el-button v-if="!showId"
                     :size="formSize"
                     type="primary"
                     @click="_submitForm('new')">Save & New</el-button>
          <el-button type="primary"
                     :size="formSize"
                     @click="_submitForm('close')">Save & Close</el-button>
          <el-button @click="handleClose"
                     :size="formSize">Cancel</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>

</template>

<script>
import MsgBox from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import wrapCurrentTime from '/imports/client/lib/wrap-current-time'
import { mapState } from 'vuex'

import { getNextRef } from '/imports/utils/get-next-ref'

import { findTimeStudyOpts } from '/imports/modules/school/api/time/methods'
import { checkClassExist } from '/imports/modules/school/api/lib/check-room-exist'
import {
  insertClassStudy,
  findOneClassStudy,
  updateClassStudy,
} from '/imports/modules/school/api/class-study/methods'
import { findRoomOpts } from '/imports/modules/school/api/rooms/methods'
import { findStaffOpts } from '/imports/modules/school/api/staffs/methods'
import { findSubjectOpts } from '/imports/modules/school/api/subject/methods'
import { rateSalaryOpts } from '/imports/modules/school/api/rate-salary/methods'
import lookupValue from '../../client/lib/Lookup-Value'
import LookUp from '../../client/lib/Lookup-Value'
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'ClassForm',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Code is requiered'))
      }

      setTimeout(() => {
        let selector = {
          code: value,
          branchId: this.currentBranchId,
        }

        if (this.showId) {
          selector._id = { $ne: this.showId }
        }

        findOneClassStudy
          .callPromise({ selector })
          .then(result => {
            if (result) {
              callback(new Error('This code is existed'))
            } else {
              callback()
            }
          })
          .catch(error => {
            Notify.error({ message: error })
          })
      }, 1000)
    }

    const validateClass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('This field is requiered'))
      } else {
        if (this.form.type && this.form.roomId && this.form.timeId) {
          setTimeout(() => {
            let selector = {
              type: this.form.type,
              roomId: this.form.roomId,
              timeId: this.form.timeId,
              branchId: this.currentBranchId,
            }
            if (this.showId) {
              selector._id = { $ne: this.showId }
            }

            checkClassExist
              .callPromise({ selector })
              .then(result => {
                if (result) {
                  MsgBox.warning('This room is exist!')
                  callback(new Error('This room is existed'))
                } else {
                  callback()
                }
              })
              .catch(error => {
                Notify.error({ message: error })
              })
          }, 1000)
        } else {
          callback()
        }
      }
    }

    return {
      // Show
      showId: this.$route.params.id,

      // loading
      loading: {
        form: false,
        code: 'Select',
        room: 'Select',
        time: 'Select',
        teacher: 'Select',
        subject: 'Select',
        rate: 'Select',
      },
      // opts
      statusOpts: lookupValue.status,
      roomIdOpts: [],
      timeIdOpts: [],
      staffIdOpts: [],
      subIdOpts: [],
      typeOpts: LookUp.type,
      rateOpt: [],
      // form
      formSize: 'mini',
      form: {
        code: '',
        classDate: moment().toDate(),
        roomId: '',
        timeId: '',
        staffId: '',
        subId: '',
        type: 'Part_Time',
        status: 'Active',
        rateId: '',
      },
      rules: {
        code: [{ validate: validateCode, required: true, triiger: 'change' }],
        classDate: [
          {
            required: true,
            message: 'Please Select Date',
            trigger: 'chnage',
          },
        ],
        roomId: [
          {
            validator: validateClass,
            required: true,
            trigger: 'change',
          },
        ],
        timeId: [
          {
            validator: validateClass,
            required: true,
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
            validator: validateClass,
            required: true,
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

  computed: {
    ...mapState({
      currentBranchId(state) {
        return state.app && state.app.currentBranch._id
      },
    }),
    dateFormat() {
      return this.$store.getters['app/dateFormat']
    },
  },
  watch: {
    // 'form.status'(val) {
    //   console.log(val)
    // },
    // 'form.type'(val) {
    //   console.log(val)
    // },
  },
  created() {
    if (!this.showId) this._getNextRefNum()
    this._getRoomOpts()
    this._getStaffOpts()
    this._getSubjectOpts()
    this._getTimeOpts()
    this._getRateOpts()
  },
  mounted() {
    if (this.showId) this._getDataUpdate()
  },
  methods: {
    _getDataUpdate() {
      // console.log(this.showId);
      this.loading.form = true
      findOneClassStudy
        .callPromise({ selector: { _id: this.showId } })
        .then(result => {
          this.form = result
          this.loading.form = false
        })
        .catch(error => {
          this.loading.form = false
          Notify.error({ message: error })
        })
    },
    _getNextRefNum() {
      this.loading.code = 'Loading....'
      // getNextRef
      getNextRef
        .callPromise({
          collectionName: 'sch_classStudy',
          opts: {
            field: 'code',
            selector: { branchId: this.currentBranchId },
            paddingType: 'start',
            paddingLength: 5,
            paddingChar: '0',
            // prefix: {},
          },
        })
        .then(result => {
          if (result) {
            this.loading.code = ''
            this.form.code = result
          }
        })
        .catch(error => {
          this.loading.code = ''
          Notify.error({ message: error })
        })
    },

    _getRoomOpts() {
      this.loading.room = 'Loading....'
      findRoomOpts
        .callPromise({})
        .then(result => {
          this.loading.room = 'Select'
          this.roomIdOpts = result
        })
        .catch(err => {
          this.loading.room = 'Select'
          Notify.error({ message: err })
        })
    },
    _getStaffOpts() {
      this.loading.teacher = 'Loading...'
      findStaffOpts
        .callPromise({ selector: { branchId: this.currentBranchId } })
        .then(result => {
          this.loading.teacher = 'Select'
          this.staffIdOpts = result
        })
        .catch(err => {
          this.loading.teacher = 'Select'
          Notify.error({ message: err })
        })
    },
    _getSubjectOpts() {
      this.loading.subject = 'Loading...'
      findSubjectOpts
        .callPromise({})
        .then(result => {
          this.loading.subject = 'Select'
          this.subIdOpts = result
        })
        .catch(err => {
          this.loading.subject = 'Select'
          Notify.error({ message: err })
        })
    },

    _getTimeOpts() {
      this.loading.time = 'Loading...'
      findTimeStudyOpts
        .callPromise({})
        .then(result => {
          this.loading.time = 'Select'
          this.timeIdOpts = result
        })
        .catch(err => {
          this.loading.time = 'Select'
          Notify.error({ message: err })
        })
    },
    _getRateOpts() {
      this.loading.rate = 'Loading...'
      rateSalaryOpts
        .callPromise({})
        .then(result => {
          this.loading.rate = 'Select'
          // console.log(result)
          this.rateOpt = result
        })
        .catch(error => {
          this.loading.rate = 'Select'
          Notify.error({ message: error })
        })
    },
    _submitForm(type) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // Pick up data
          this.form.branchId = this.currentBranchId
          this.form.classDate = wrapCurrentTime(this.form.classDate)
          if (this.showId) {
            updateClassStudy
              .callPromise({ doc: this.form })
              .then(result => {
                if (result) {
                  MsgBox.success()
                  type == 'new' ? this.handleresetForm() : this.handleClose()
                }
              })
              .catch(err => {
                Notify.error({ message: err })
              })
          } else {
            insertClassStudy
              .callPromise({ doc: this.form })
              .then(result => {
                if (result) {
                  MsgBox.success()
                  type == 'new' ? this.handleresetForm() : this.handleClose()
                }
              })
              .catch(err => {
                Notify.error({ message: err })
              })
          }
        } else {
          return false
        }
      })
    },
    handleClose() {
      // this.$emit('modal-close')
      this.$router.push({ name: 'sch.classList' })
    },
    handleresetForm() {
      this.$refs['form'].resetFields()
      // this.$router.push({ name: 'sch.classForm', params: { type: 'new' } })
      this._getNextRefNum()
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

<style lang="scss" scoped>
@import '../style/main.scss';
</style>

