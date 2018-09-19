<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="Edit Staff"
               width="80%"
               :visible="true"
               :before-close="handleClose">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-position="left"
               size="mini"
               label-width="150px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Name"
                          prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="Gender"
                          prop="gender">
              <el-select v-model="form.gender">
                <el-option v-for="item in genderOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Date of Birth"
                          prop="dob">
              <el-date-picker v-model="form.dob"
                              type="date" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email"
                          prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="Telephone"
                          prop="tel">
              <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item label="Position"
                          prop="positionId">
              <el-select v-model="form.positionId" multiple clearable>
                <el-option v-for="doc in positionIdOpts"
                           :key="doc._id"
                           :label="doc.position"
                           :value="doc._id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleSave" size="mini">Save</el-button>
        <el-button @click="handleClose" size="mini">Cancel</el-button>
      </span>
    </el-dialog :close-on-click-modal="false">
  </div>

</template>

<script>
import { findOneStaff, updateStaff } from '../../api/Staffs/methods.js'
import { findPosition } from '../../api/positions/methods.js'
import Lookup from '../lib/Lookup-Value.js'
export default {
  // name: 'StaffInsert',
  props: ['updateId', 'visible'],
  data() {
    return {
      dialogFormVisible: false,
      positionIdOpts: [],
      genderOpts: Lookup.gender,
      form: {},
      rules: {
        name: [
          {
            required: true,
            message: 'Please Input Name',
            trigger: 'blur'
          }
        ],
        positionId: [
          {
            required: true,
            message: 'Please select Position',
            trigger: 'change'
          }
        ],
        gender: [{ required: true }],
        dob: [{ required: true }],
        // email: [{ required: true }],
        tel: [{ required: true }]
      }
    }
  },
  mounted() {
    this.getData()
    this.getPositionData()
  },
  methods: {
    getData() {
      let _id = this.updateId
      findOneStaff
        .callPromise({ selector: _id })
        .then(result => {
          this.form = result
        })
        .catch(err => {
          console.log(err.reason)
        })
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let doc = this.form
          doc._id = this.updateId
          updateStaff
            .callPromise(doc)
            .then(result => {
              this.$message({
                message: 'Update Successfull',
                type: 'success'
              })
              this.handleClose()
            })
            .catch(err => {
              console.log(err.reason)
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
      this.$refs['from'].resetFields()
    },
    getPositionData() {
      let selector = {
        status: 'Active'
      }
      findPosition
        .callPromise({ selector: selector })
        .then(result => {
          this.positionIdOpts = result
          
        })
        .catch(error => {
          this.$message.error(error.reason)
        })
    }
  }
}
</script>

<style>

</style>
