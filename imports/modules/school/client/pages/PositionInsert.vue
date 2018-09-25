<template>
  <div>

    <el-form :model="form"
             :rules="rules"
             ref="form"
             label-position="left"
             label-width="100px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="Position"
                        prop="position">
            <el-input v-model="form.position"
                      ref="first">
            </el-input>
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <el-form-item label="Description"
                        prop="des">
            <el-input type="textarea"
                      v-model="form.des"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary"
                       @click="_submitForm"
                       size="mini">{{ formType }}</el-button>
            <el-button @click="handleClose"
                       v-if="updateDoc && formType=='Update'"
                       size="mini">Cancel</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>

</template>

<script>
import Notify from '/imports/client/lib/notify'
import Msg from '/imports/client/lib/message'

import {
  insertPosition,
  updatePosition,
} from '/imports/modules/school/api/positions/methods'
import lookupValue from '../../client/lib/Lookup-Value'

export default {
  // name: 'PositionInsert',
  props: {
    formType: {
      type: String,
      default: 'New',
    },
    updateDoc: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      statusOpts: lookupValue.status,
      form: {
        position: '',
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
      },
    }
  },
  watch: {
    updateDoc(val) {
      if (val) {
        this.form = val
      }
    },
  },
  methods: {
    _submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.updateDoc&&this.formType=='Update') {
            updatePosition
              .callPromise({ doc: this.form })
              .then(result => {
                if (result) {
                  Msg.success()
                  this.handleClose()
                }
              })
              .catch(err => {
                console.log(err);
                this.$message.error(err.reason)
              })
          } else {
            insertPosition
              .callPromise({ doc: this.form })
              .then(result => {
                if (result) {
                  Msg.success()
                  this.handleClose()
                }
              })
              .catch(err => {
                this.$message.error(err.reason)
              })
          }
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$emit('modal-close')
      this.$refs['form'].resetFields()
    },
  },
}
</script>

<style>
</style>
