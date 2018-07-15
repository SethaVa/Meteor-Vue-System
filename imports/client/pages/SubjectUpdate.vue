<template>
  <div>
    <el-dialog width="70%"
               title="Update Book"
               :visible="visible"
               :before-close="handleClose">
      <el-form :model="form"
               ref="form"
               :rules="rules"
               label-position="left"
               label-width="100px"
               size="mini">

        <el-form-item label="Title"
                      prop="title">
          <el-input v-model="form.title"
                    ref="title"></el-input>
        </el-form-item>
        <el-form-item label="Level"
                      prop="level">
          <el-select v-model="form.level">
            <el-option v-for="doc in levelOpts"
                       :key="doc.value"
                       :label="doc.label"
                       :value="doc.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Type"
                      prop="type">
          <el-select clearable
                     v-model="form.type">
            <el-option v-for="doc in typeIdOpts"
                       :key="doc.value"
                       :label="doc.label"
                       :value="doc.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-select clearable
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
                   @click="handleSave"
                   size="mini">Save</el-button>
        <el-button @click="handleClose"
                   size="mini">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Notify from '/imports/client/libs/notify'
import MsgBox from '/imports/client/libs/message'
import Lookup from '../libs/Lookup-Value.js'

import { updateSubject } from '../../api/subject/methods.js'
export default {
  name: 'BookNew',
  meta: {
    title: 'Book',
  },
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
      typeIdOpts: Lookup.type,
      levelOpts: Lookup.level,
      statusOpts: Lookup.status,
      form: this.updateDoc,
      rules: {
        title: [{ required: true }],
        type: [{ required: true }],
        level: [{ required: true }],
      },
    }
  },

  methods: {
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
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
