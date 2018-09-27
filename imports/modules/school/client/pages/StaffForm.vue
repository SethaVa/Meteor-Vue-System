<template>
  <div>
    <el-dialog :close-on-click-modal="false"
               title="New Teacher"
               width="80%"
               :visible="visible"
               :before-close="handleClose">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               v-loading="loading.form"
               label-position="left"
               label-width="130px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Name"
                          prop="name">
              <el-input v-model="form.name"
                        ref="name"></el-input>
            </el-form-item>
            <el-form-item label="Gender"
                          prop="gender"
                          ref="gender">
              <el-select v-model="form.gender">
                <el-option v-for="item in genderOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Date of Birth"
                          prop="dob">
              <el-date-picker style="width:100%"
                              v-model="form.dob"
                              type="date"></el-date-picker>
            </el-form-item>
            <el-form-item label="Telephone"
                          prop="tel">
              <el-input v-model="form.tel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email/Facebook"
                          prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="Base Salary"
                          prop="baseSalary">
              <el-input-number :min="0"
                               :controls="false"
                               v-model="form.baseSalary"></el-input-number>
            </el-form-item>
            <el-form-item label="Position"
                          prop="positionId">
              <el-select v-model="form.positionId"
                         :placeholder="loading.position"
                         multiple
                         clearable>
                <el-option v-for="doc in positionIdOpts"
                           :key="doc.value"
                           :label="doc.label"
                           :value="doc.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   v-if="!updateId"
                   @click="_submitForm('new')"
                   size="mini">Save & New</el-button>
        <el-button type="primary"
                   @click="_submitForm('close')"
                   size="mini">Save & Close</el-button>
        <el-button @click="handleClose"
                   size="mini">Cancel</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import wrapCurrentTime from '/imports/client/lib/wrap-current-time'

import { mapState } from 'vuex'

import {
  insertStaff,
  updateStaff,
  findOneStaff,
} from '/imports/modules/school/api/staffs/methods'
import { positionOpts } from '/imports/modules/school/api/positions/methods'
import Lookup from '../lib/Lookup-Value.js'
export default {
  name: 'EmployeeInsert',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    updateId: {
      type: String,
      default: null,
    },
  },
  data() {
    var checkBaseSalary = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("Salary can't empty !"))
      } else {
        callback()
      }
    }
    return {
      // loaing
      loading: {
        form: false,
        position: 'Select',
      },
      // Opts
      genderOpts: Lookup.gender,
      positionIdOpts: [],

      // Form
      form: {
        name: '',
        gender: '',
        dob: '',
        email: '',
        tel: '',
        positionId: '',
        baseSalary: 0,
      },
      // Rules
      rules: {
        name: [
          {
            required: true,
            message: 'Please Input Name',
            trigger: 'blur',
          },
        ],
        positionId: [
          {
            required: true,
            message: 'Please select Position',
            trigger: 'change',
          },
        ],
        gender: [{ required: true }],
        dob: [{ required: true }],
        balseSalary: [{ validator: checkBaseSalary, trigger: 'change' }],
        tel: [{ required: true }],
      },
    }
  },
  computed: {
    ...mapState({
      currentBranchId(state) {
        return state.app && state.app.currentBranch._id
      },
    }),
  },
  created() {
    this._getPositionOpts()
  },
  mounted() {
    if (this.updateId) this._getData()
  },
  methods: {
    _getData() {
      this.loading.form = true
      findOneStaff
        .callPromise({ selector: { _id: this.updateId } })
        .then(result => {
          this.loading.form = false
          this.form = result
        })
        .catch(err => {
          this.loading.form = false
          Notify.error({ message: err })
          console.log(err)
        })
    },
    // Get position opts
    _getPositionOpts() {
      this.loading.position = 'Loading...'
      positionOpts
        .callPromise({})
        .then(result => {
          this.positionIdOpts = result
          this.loading.position = 'Select'
        })
        .catch(error => {
          this.loading.position = 'Select'
          Notify.error({ message: error })
        })
    },
    // Submit form
    _submitForm(type) {
      this.loading.form = true
      this.$refs['form'].validate(valid => {
        if (valid) {
          // Pick data
          this.form.dob = wrapCurrentTime(this.form.dob)
          this.form.branchId = this.currentBranchId
          if (this.updateId) {
            // update
            updateStaff
              .callPromise({ doc: this.form })
              .then(result => {
                if (result) {
                  this.loading.form = false
                  Msg.success()
                  type == 'new' ? this.handelresetForm() : this.handleClose()
                }
              })
              .catch(err => {
                this.loading.form = false
                Notify.error({ message: err })
              })
          } else {
            // insert
            insertStaff
              .callPromise({ doc: this.form })
              .then(result => {
                if (result) {
                  this.loading.form = false
                  Msg.success()
                  type == 'new' ? this.handelresetForm() : this.handleClose()
                }
              })
              .catch(err => {
                this.loading.form = false
                Notify.error({ message: err })
              })
          }
        } else {
          this.loading.form = false
          return false
        }
      })
    },
    // Close modal
    handleClose() {
      this.$emit('modal-close')
    },
    // Reset form
    handelresetForm() {
      this.$refs['form'].resetFields()
    },
  },
}
</script>

<style>
</style>
