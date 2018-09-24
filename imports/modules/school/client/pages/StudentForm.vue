<template>
  <div>
    <el-dialog :close-on-click-modal="false"
               :visible="visible"
               :before-close="handleClose"
               width="80%">
      <span slot="title">
      <i class="fa fa-user"></i> Student</span>
      <el-form label-position="left"
               label-width="100px"
               :model="form"
               ref="form"
               :rules="rules"
               v-loading="loading.form"
               size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
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
                          prop="registerDate">
              <el-date-picker v-model="form.registerDate"
                              :format="dateFormat"
                              :clearable="false"
                              style="width:100%"></el-date-picker>
            </el-form-item>

            <el-form-item label="Type"
                          prop="type">
              <el-select v-model="form.type">
                <el-option v-for="doc in typeOpts"
                           :key="doc.value"
                           :label="doc.label"
                           :value="doc.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Kh Name"
                          prop="khName">
              <el-input v-model="form.khName"></el-input>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="En Name"
                          prop="enName">
              <el-input v-model="form.enName"></el-input>
            </el-form-item>
            <el-form-item label="Gender"
                          prop="gender">
              <el-select v-model="form.gender">
                <el-option v-for="doc in genderOpts"
                           :key="doc.value"
                           :label="doc.label"
                           :value="doc.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="DOB"
                          prop="dob">
              <el-date-picker v-model="form.dob"
                              :clearable="false"
                              :format="dateFormat"
                              style="width:100%"></el-date-picker>
            </el-form-item>
            <el-form-item label="Telephone"
                          prop="tel">
              <el-input v-model="form.tel"></el-input>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   size="mini"
                   @click="_submitForm">Save</el-button>
        <el-button @click="handleClose"
                   size="mini">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import wrapCurrentTime from '/imports/client/lib/wrap-current-time'
import lookupValue from '/imports/client/lib/Lookup-Value'
import _ from 'lodash'

import {
  insertStudent,
  findOneStudent,
  updateStudent,
} from '/imports/modules/school/api/students/methods.js'

import { mapState } from 'vuex'

import { getNextRef } from '/imports/utils/get-next-ref.js'

export default {
  name: 'StudentForm',
  props: {
    updateId: {
      type: String,
      default: null,
    },
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
          code: value,
          branchId: this.currentBranchId,
        }

        if (this.updateId) {
          selector._id = { $ne: this.updateId }
        }

        findOneStudent
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

    return {
      // loading
      loading: {
        form: false,
        code: '',
      },
      // opts
      genderOpts: lookupValue.gender,
      typeOpts: lookupValue.type,
      //form
      form: {
        registerDate: moment().toDate(),
        code: '',
        type: '',
        khName: '',
        enName: '',
        gender: '',
        dob: '',
        tel: '',
        remove: false,
      },
      // rules
      rules: {
        registerDate: [
          { required: true, message: 'Date is required', trigger: 'change' },
        ],
        code: [{ validator: validateCode, required: true, trigger: 'change' }],
        khName: [
          {
            required: true,
            message: 'Please Input Khmrt Name',
            trigger: 'blur',
          },
        ],
        enName: [
          {
            required: true,
            message: 'Please Input English Name',
            trigger: 'blur',
          },
        ],
        gender: [
          { required: true, message: 'Please Select Gender', trigger: 'blur' },
        ],
        type: [
          { required: true, message: 'Please Select Type', trigger: 'blur' },
        ],
        dob: [
          {
            required: true,
            message: 'Date of birth is required!',
            trigger: 'blur',
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
  created() {
    if (!this.updateId) this._getNextRefNum()
  },
  mounted() {
    if (this.updateId) this._getOneStudentData()
  },
  methods: {
    _getNextRefNum() {
      this.loading.code = 'Loading....'
      // getNextRef
      getNextRef
        .callPromise({
          collectionName: 'sch_students',
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
    // Get data for update
    _getOneStudentData() {
      this.loading.form = true
      findOneStudent
        .callPromise({
          selector: { _id: this.updateId, branchId: this.currentBranchId },
        })
        .then(result => {
          this.form = result
          this.loading.form = false
        })
        .catch(error => {
          this.loading.form = false
          Notify.error({ message: error })
        })
    },
    /**
     * Submit form
     */
    _submitForm() {
      this.loading.form = true
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.dob = wrapCurrentTime(this.form.dob)
          this.form.registerDate = wrapCurrentTime(this.form.registerDate)
          this.form.branchId = this.currentBranchId
          // console.log(this.form)
          if (this.updateId) {
            // Update data
            updateStudent
              .callPromise({ doc: this.form })
              .then(result => {
                if (result) {
                  this.loading.form = false
                  this.handleClose()
                  Msg.success()
                }
              })
              .catch(error => {
                this.loading.form = false
                Notify.error({ message: error })
              })
          } else {
            // Insert data
            insertStudent
              .callPromise({ doc: this.form })
              .then(result => {
                if (result) {
                  this.loading.form = false
                  this.handelresetForm()
                  Msg.success()
                }
              })
              .catch(error => {
                this.loading.form = false
                Notify.error({ message: error })
              })
          }
        } else {
          this.loading.form = false
          return false
        }
      })
    },

    handleClose() {
      this.$emit('modal-close')
    },
    handelresetForm() {
      this.$refs['form'].resetFields()
    },
  },
}
</script>

<style>
.right {
  margin-top: 35px;
}
</style>
