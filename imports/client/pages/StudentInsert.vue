<template>
  <div>
    <el-dialog title="New Student"
               width="80%"
               :visible="true"
               :before-close="handleClose">
      <el-form label-position="left"
               :model="form"
               ref="form"
               :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="First Name"
                          prop="first">
              <el-input v-model="form.first"></el-input>
            </el-form-item>
            <el-form-item label="Last Name"
                          prop="last">
              <el-input v-model="form.last"></el-input>
            </el-form-item>
            <el-form-item label="Gender"
                          prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio v-for="item in genderOpt"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="right">

              <el-form-item label="DOB"
                            prop="dob">
                <el-date-picker v-model="form.dob"></el-date-picker>
              </el-form-item>
              <el-form-item label="Telephone"
                            prop="tel">
                <el-input v-model="form.tel"></el-input>
              </el-form-item>
            </div>
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
import { insertStudent } from '../../api/students/methods.js'

export default {
  name: 'studentinsert',
  props: ['visible'],
  data() {
    return {
      genderOpt: [
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' }
      ],
      form: {
        first: '',
        last: '',
        gender: '',
        dob: '',
        tel: ''
      },
      rules: {
        first: [
          {
            required: true,
            message: 'Please Insert First Name',
            trigger: 'blur'
          }
        ],
        last: [
          {
            required: true,
            message: 'Please Insert Last Name',
            trigger: 'blur'
          }
        ],
        gender: [
          { required: true, message: 'Please Insert Gender', trigger: 'change' }
        ],
        tel: [
          {
            required: true,
            message: 'Please Insert Telephone',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let doc = {
            name: {
              first: this.form.first,
              last: this.form.last
            },
            gender: this.form.gender,
            dob: this.form.dob,
            tel: this.form.tel
          }
          console.log(doc)
          insertStudent
            .callPromise(doc)
            .then(result => {
              this.$message({
                message: 'Insert Successfull',
                type: 'success'
              })
              this.resetForm()
            })
            .catch(error => {
              console.log(error.reason)
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
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style>
.right {
  margin-top: 35px;
}
</style>
