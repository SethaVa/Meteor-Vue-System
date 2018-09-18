<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="Edit Levele"
               :visible="true"
               :before-close="handleClose">
      <el-form label-position="left"
               label-width="150px"
               :model="form"
               ref="form"
               :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Levele"
                          prop="leveleStudy">
              <el-input v-model="form.leveleStudy"
                        ref="form.leveleStudy"></el-input>
            </el-form-item>
            <el-form-item label="Describe"
                          prop="des">
              <el-input type="textarea"
                        :autosize="{minRows:4,maxRows:5}"
                        v-model="form.des"></el-input>
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
import {
  findOneLeveleStudy,
  updateLeveleStudy,
} from '../../api/level/methods.js'

export default {
  name: 'EditLevele',
  data() {
    return {
      form: {},
      rules: {
        leveleStudy: {
          required: true,
        },
      },
    }
  },
  props: ['visible', 'updateId'],
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      let id = this.updateId
      findOneLeveleStudy
        .callPromise(id)
        .then(result => {
          this.form = result
        })
        .catch(error => {
          this.$message.error(error.reason)
        })
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateLeveleStudy
            .callPromise(this.form)
            .then(result => {
              if (result) {
                this.$message({
                  message: 'Insert Successfull',
                  type: 'success',
                })
                this.handleClose()
              }
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
    },
  },
}
</script>

<style>
.right {
  margin-top: 35px;
}
</style>
