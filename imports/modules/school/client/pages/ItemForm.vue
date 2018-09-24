<template>
  <div>
    <el-form :model="form"
             :rules="rules"
             ref="form"
             v-loading="loading"
             size="mini"
             label-position="left"
             label-width="100px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Name"
                        prop="name">
            <el-input v-model="form.name"
                      placeholder="Category"></el-input>
          </el-form-item>
          <el-form-item label="Category"
                        prop="categoryId">
            <el-select v-model="form.categoryId"
                       filterable
                       clearable
                       placeholder="Select category">
              <el-option v-for="item in categoryIdOpts"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="Status"
                        prop="status">
            <el-select v-model="form.status"
                       filterable
                       clearable
                       placeholder="Select status">
              <el-option v-for="item in statusOpts"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       size="mini"
                       @click="handleSave">{{ formType }}</el-button>
            <template v-if="formType!='Add New'">
              <el-button type="danger"
                         size="mini"
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
import LookUp from '../lib/Lookup-Value'
import { lookupCategories } from '/imports/utils/lookup-methods'
import { insertItems, updateItems } from '/imports/modules/school/api/items/methods'
import wrapCurrentTime from '/imports/client/lib/wrap-current-time'
export default {
  name: 'ItemForm',
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
      statusOpts: LookUp.status,
      categoryIdOpts: [],
      form: {
        name: '',
        categoryId: '',
        status: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please Input Name',
            trigger: 'chnage',
          },
        ],
        categoryId: [
          {
            required: true,
            message: 'Please select category',
            trigger: 'blur',
          },
        ],
        status: [
          {
            required: true,
            message: 'Please select status',
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
  mounted() {
    this.getCategory()
  },
  methods: {
    getCategory() {
      lookupCategories
        .callPromise({})
        .then(result => {
          if (result) {
            this.categoryIdOpts = result
          }
        })
        .catch(err => {
          Notify.error({ message: err })
        })
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.formType === 'Add New') {
            this.loading = true
            insertItems
              .callPromise(this.form)
              .then(result => {
                if (result) {
                  this.loading = false
                  Msg.success()
                  this.handleCancel()
                }
              })
              .catch(err => {
                Notify.error({ message: err })
              })
          } else if (this.formType === 'Update') {
            this.loading = true
            updateItems
              .callPromise(this.form)
              .then(result => {
                if (result) {
                  this.loading = false
                  Msg.success()
                  this.handleCancel()
                }
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
      this.$refs['form'].resetFields()
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
