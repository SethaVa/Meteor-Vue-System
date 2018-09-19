<template>
  <div>
    <el-dialog :close-on-click-modal="false" :visible="visible"
               :before-close="handleClose"
               width="80%">
      <span slot="title">
      <i class="fa fa-user"></i> Student</span>
      <el-form label-position="left"
               label-width="100px"
               :model="form"
               ref="form"
               :rules="rules"
               size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Date"
                          prop="registerDate">
              <el-date-picker v-model="form.registerDate"
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
            <el-form-item label="En Name"
                          prop="enName">
              <el-input v-model="form.enName"></el-input>
            </el-form-item>

          </el-col>
          <el-col :span="12">
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
                   @click="handleSave">Save</el-button>
        <el-button @click="handleClose"
                   size="mini">Cancel</el-button>
      </span>
    </el-dialog :close-on-click-modal="false">
  </div>
</template>

<script>
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import wrapCurrentTime from '/imports/client/lib/wrap-current-time'
import lookupValue from '/imports/client/lib/Lookup-Value'
import _ from 'lodash'
import { updateStudent } from '../../api/students/methods.js'
import moment from 'moment'
export default {
  name: 'StudentUpdate',
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
      genderOpts: lookupValue.gender,
      typeOpts: lookupValue.type,

      form: this.updateDoc,
      rules: {
        registerDate: [
          { required: true, message: 'Date is required', trigger: 'change' },
        ],
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
          { required: true, message: 'Date of birth is required!', trigger: 'blur' },
        ],
      },
    }
  },

  methods: {
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.dob = wrapCurrentTime(this.form.dob)
          this.form.registerDate = wrapCurrentTime(this.form.registerDate)
          // console.log(this.form)
          updateStudent
            .callPromise({ doc: this.form })
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
    resetForm() {
      this.$refs['form'].resetFileds()
    },
  },
}
</script>

<style>
.right {
  margin-top: 35px;
}
</style>
