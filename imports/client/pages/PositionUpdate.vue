<template>
  <div>
    <el-dialog title="Edit Position"
               width="80%"
               :visible="visible"
               :before-close="handleClose">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               label-position="left"
               label-width="150px">
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
                   @click="handleSave">Save</el-button>
        <el-button @click="handleClose">Cancel</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { updatePosition } from '../../api/positions/methods.js'
import lookupValue from '../../client/libs/Lookup-Value'
import _ from 'lodash'
export default {
  name: 'PositionUpdate',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    updateDoc: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      statusOpts: lookupValue.status,
      form: this.updateDoc,
      rules: {
        position: [
          {
            required: true,
            message: 'Please Input First Name',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // Pick data
          const doc = _.pick(this.form, ['_id', 'position', 'status', 'des'])
          updatePosition
            .callPromise(doc)
            .then(result => {
              if (result) {
                this.$message({
                  message: 'Update Successfull',
                  type: 'success',
                })
                this.handleClose()
              }
            })
            .catch(err => {
              this.$message.console.error(err.reason)
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
  },
}
</script>

<style>

</style>
