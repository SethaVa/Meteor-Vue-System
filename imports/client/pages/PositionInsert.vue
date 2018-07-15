<template>
  <div>
    <el-dialog title="New Position"
               width="80%"
               :visible="visible"
               :before-close="handleClose">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-position="left"
               label-width="100px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Position"
                          prop="position">
              <el-input v-model="form.position"
                        ref="first">
              </el-input>
            </el-form-item>
            <el-form-item label="Status"
                          prop="status">
              <el-select v-model="form.status">
                <el-option v-for="item in statusOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Description"
                          prop="des">
              <el-input type="textarea"
                        :autosize="{minRows:3,maxRows:5}"
                        v-model="form.des"></el-input>
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
    </el-dialog>
  </div>

</template>

<script>
import { insertPosition } from '../../api/positions/methods'
import lookupValue from '../../client/libs/Lookup-Value'

export default {
  name: 'PositionInsert',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      statusOpts: lookupValue.status,
      form: {
        position: '',
        status: '',
        des: '',
      },
      rules: {
        position: [
          {
            required: true,
            message: 'Please Input First Name',
            trigger: 'blur',
          },
        ],
        status:[
          {
            required: true,
            message: 'Please Input First Name',
            trigger: 'blur',
          }
        ]
      },
    }
  },
  methods: {
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          insertPosition
            .callPromise(this.form)
            .then(result => {
              this.$message({
                message: 'Save Successfull',
                type: 'success',
              })
              this.handleresetForm()
            })
            .catch(err => {
              this.$message.error(err.reason)
            })
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$emit('modal-close')
    },
    handleresetForm() {
      this.$refs['form'].resetFields()
    },
  },
}
</script>

<style>

</style>
