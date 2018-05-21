<template>
  <div>
    <el-dialog :visible="visible"
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
                   @click="handleSave">Save</el-button>
        <el-button @click="handleClose">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import Msg from '/imports/client/libs/message'
import Notify from '/imports/client/libs/notify'
import wrapCurrentTime from '/imports/client/libs/wrap-current-time'
import lookupValue from '/imports/client/libs/Lookup-Value'
import _ from 'lodash'
import { insertStudent } from '../../api/students/methods.js'

export default {
  name: 'StudentInsert',
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
      form: {
        type: '',
        khName: '',
        enName: '',
        gender: '',
        dob: '',
        tel: '',
        remove: false,
      },
      rules: {
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
      },
    }
  },

  methods: {
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.dob = wrapCurrentTime(this.form.dob)
          this.form.registerDate = wrapCurrentTime(moment().toDate())
          // console.log(this.form)
          insertStudent
            .callPromise({ doc: this.form })
            .then(result => {
              Msg.success()
              this.resetForm()
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
