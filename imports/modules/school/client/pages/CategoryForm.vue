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
          <el-form-item label="Name"
                        prop="name">
            <el-input v-model="form.name"
                      placeholder="Category"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item>
            <el-button type="primary"
                       size="small"
                       @click="handleSave">{{ formType }}</el-button>
            <template v-if="formType!='Add New'">
              <el-button type="danger"
                         size="small"
                         @click="handleCancel"
                         v-if="formType=='Update'">Cancel</el-button>
            </template>
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
  insertCategories,
  updateCategories,
} from '/imports/modules/school/api/categories/methods.js'
import wrapCurrentTime from '/imports/client/lib/wrap-current-time'
export default {
  name: 'TimeForm',
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
        name: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please Input Name',
            trigger: 'chnage',
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
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          _.forEach(this.form.timeStudy, o => {
            o = wrapCurrentTime(o)
          })
          if (this.formType === 'Add New') {
            this.loading = true
            insertCategories
              .callPromise(this.form)
              .then(result => {
                this.loading = false
                Msg.success()
                this.handleCancel()
              })
              .catch(err => {
                Notify.error({ message: err })
              })
          } else if (this.formType === 'Update') {
            this.loading = true
            updateCategories
              .callPromise(this.form)
              .then(result => {
                this.loading = false
                Msg.success()
                this.handleCancel()
              })
              .catch(err => {
                Notify.error({ message: err })
              })
          }
        } else {
          return false
        }
      })
    },
    resetForm() {
      // this.$refs['form'].resetFields()
      this.form.name = ''
    },
    handleCancel() {
      this.resetForm()
      this.form._id = null
      this.$emit('data-change')
    },
    formatTime(val) {
      return moment(val).format('hh:mm a')
    },
  },
}
</script>

<style>
</style>
