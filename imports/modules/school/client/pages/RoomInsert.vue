<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="New Room"
               :visible="true"
               :before-close="handleClose">
      <el-form label-position="left"
               label-width="150px"
               :model="form"
               ref="form"
               :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Room Name"
                          prop="roomName">
              <el-input v-model="form.roomName"
                        ref="roomName"></el-input>
            </el-form-item>
            <el-form-item label="Describe"
                          prop="des">
              <el-input type="textarea"
                        :autosize="{minRows:4,maxRows:5}"
                        v-model="form.des"
                        ref="roomName"></el-input>
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
    </el-dialog :close-on-click-modal="false">
  </div>
</template>

<script>
import { insertRoom } from '/imports/modules/school/api/rooms/methods.js'

export default {
  // name: 'Room-Insert',
  props: ['visible'],
  data() {
    return {
      genderOpt: [
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' }
      ],
      form: {
        roomName: '',
        des: '',
        status: 'Active'
      },
      rules: {
        roomName: {
          required: true
        }
      }
    }
  },
  methods: {
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          insertRoom
            .callPromise(this.form)
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
