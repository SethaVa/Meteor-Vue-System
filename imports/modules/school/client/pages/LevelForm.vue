<template>
  <div>
    <el-form :model="form"
             :rules="rules"
             ref="form"
             v-loading="loading"
             label-position="left"
             label-width="100px">
      <el-row :gutter="10">
        <el-col :span="14">
          <el-form-item label="Level"
                        prop="level">
            <el-input v-model="form.level"
                      placeholder="level"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item>
            <el-button type="primary"
                       size="small"
                       @click="_submitForm">{{ formType }}</el-button>
            <el-button type="danger"
                       size="small"
                       @click="handleCancel"
                       v-if="formType=='Update'">Cancel</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

</template>

<script>
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import _ from 'lodash'
import moment from 'moment'
import {
  insertlevel,
  updatelevel,
} from '/imports/modules/school/api/level/methods'
export default {
  // name: 'TimeForm',
  props: {
    formType: {
      type: String,
      default: 'Add New',
    },
    updateDoc: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      form: {
        level: '',
      },
      rules: {
        level: [
          {
            required: true,
            message: 'Please Input Level value',
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
      this.loading = true
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.formType === 'New') {
            insertlevel
              .callPromise({ doc: this.form })
              .then(result => {
                if (result) {
                  this.loading = false
                  Msg.success()
                  this.handleCancel()
                }
              })
              .catch(err => {
                this.loading = false
                Notify.error({ message: err })
              })
          } else if (this.formType === 'Update') {
            updatelevel
              .callPromise({ doc: this.form })
              .then(result => {
                if (result) {
                  this.loading = false
                  Msg.success()
                  this.handleCancel()
                }
              })
              .catch(err => {
                this.loading = false
                Notify.error({ message: err })
              })
          }
        } else {
          this.loading = false
          return false
        }
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
    },
    handleCancel() {
      this.resetForm()
      this.form._id = null
      this.$emit('data-change')
    },
  },
}
</script>

<style>
</style>
