<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="New Edit"
               :visible="true"
               :before-close="handleClose">
      <el-form label-position="left"
               :model="form"
               ref="form"
               :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label=Type
                          prop="type">
              <el-input v-model="form.type"
                        ref="type"></el-input>
            </el-form-item>
            <el-form-item label="Describe"
                          prop="des">
              <el-input type="textarea"
                        :autosize="{minRows:4,maxRows:5}"
                        v-model="form.des"
                        ref="type"></el-input>
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
import { findOneType, updateType } from '../../api/types/methods.js'

export default {
  name: 'Room-Edit',
  props: ['visible', 'updateId'],
  data() {
    return {
      form: {},
      rules: {
        type: [{ required: true }]
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      let id = this.updateId
      findOneType
        .callPromise({ _id: id })
        .then(result => {
          this.form = result
        })
        .catch(err => {
          this.$message.error(err.reason)
        })
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateType
            .callPromise(this.form)
            .then(result => {
              this.$message({
                message: 'Update Successfull',
                type: 'success'
              })
              this.handleClose()
            })
            .catch(error => {
              this.$message.error(error.reason)
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
