<template>
  <div>
    <el-dialog :close-on-click-modal="false"
               width="70%"
               title="New Book"
               :visible="true"
               :before-close="handleClose">
      <el-form :model="form"
               ref="form"
               :rules="rules"
               label-position="left"
               label-width="100px"
               v-loading="loading.form"
               size="mini">

        <el-form-item label="Title"
                      prop="title">
          <el-input v-model="form.title"
                    ref="title"></el-input>
        </el-form-item>
        <el-form-item label="Level"
                      prop="levelId">
          <el-select v-model="form.levelId"
                     :placeholder="loading.level">
            <el-option v-for="item in levelOpts"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Type"
                      prop="type">
          <el-select :placeholder="loading.type"
                     v-model="form.type">
            <el-option v-for="doc in typeIdOpts"
                       :key="doc.value"
                       :label="doc.label"
                       :value="doc.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Status"
                      prop="status">
          <el-select :placeholder="loading.status"
                     v-model="form.status">
            <el-option v-for="doc in statusOpts"
                       :key="doc.value"
                       :label="doc.label"
                       :value="doc.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="_submitForm"
                   size="mini">Save</el-button>
        <el-button @click="handleClose"
                   size="mini">Cancel</el-button>
      </span>
    </el-dialog :close-on-click-modal="false">
  </div>
</template>

<script>
import Notify from '/imports/client/lib/notify'
import MsgBox from '/imports/client/lib/message'

import { levelOpts } from '/imports/modules/school/api/level/methods'

import {
  insertSubject,
  updateSubject,
  findOneSubject,
} from '/imports/modules/school/api/subject/methods.js'

import Lookup from '../lib/Lookup-Value.js'

export default {
  name: 'SubjectForm',
  props: {
    updateId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      // Loading
      loading: {
        form: false,
        level: 'Select',
        type: 'Select',
        status: 'Select',
      },
      // Opts
      typeIdOpts: Lookup.type,
      levelOpts: [],
      statusOpts: Lookup.status,
      // Form
      form: {
        title: '',
        type: '',
        levelId: '',
        status: '',
      },
      // Rule
      rules: {
        title: [{ required: true }],
        type: [{ required: true }],
        levelId: [{ required: true }],
        status: [{ required: true }],
      },
    }
  },

  created() {
    this._getLevelOpts()
  },
  mounted() {
    if (this.updateId) {
      this._getDataUpdate()
    }
  },
  methods: {
    _getDataUpdate() {
      this.loading.form = true
      findOneSubject
        .callPromise({ selector: { _id: this.updateId } })
        .then(result => {
          if (result) {
            this.form = result
            this.loading.form = false
          }
        })
        .catch(error => {
          this.loading.form = false
          Notify.error({ message: error })
        })
    },
    _getLevelOpts() {
      this.loading.level = 'Loading.....'
      levelOpts
        .callPromise({})
        .then(result => {
          this.levelOpts = result
          this.loading.level = 'Select'
        })
        .catch(error => {
          this.loading.level = 'Select'
          Notify.error({ message: error })
        })
    },
    _submitForm() {
      this.loading.form = true
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.updateId) {
            updateSubject
              .callPromise(this.form)
              .then(result => {
                MsgBox.success('Update Success')
                this.handleClose()
              })
              .catch(error => {
                Notify.error({ message: error })
              })
          } else {
            insertSubject
              .callPromise(this.form)
              .then(result => {
                if (result) {
                  MsgBox.success()
                  this.resetform()
                  this.loading.form = false
                }
              })
              .catch(error => {
                this.loading.form = false
                Notify.error({ message: error })
              })
          }
        } else {
          this.loading.form = false
          return false
        }
      })
    },
    handleClose() {
      this.$emit('modal-close')
    },
    resetform() {
      this.$refs['form'].resetFields()
    },
  },
}
</script>

<style>
.el-select {
  width: 100%;
}
</style>
