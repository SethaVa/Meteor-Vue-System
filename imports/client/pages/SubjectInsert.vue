<template>
  <div>
    <el-dialog width="70%"
               title="New Book"
               :visible="true"
               :before-close="handleClose">
      <el-form :model="form"
               ref="form"
               :rules="rules"
               label-position="left"
               label-width="100px">
        <el-form-item label="Code"
                      prop="code">
          <el-input v-model="form.code"
                    ref="code"></el-input>
        </el-form-item>
        <el-form-item label="Title"
                      prop="title">
          <el-input v-model="form.title"
                    ref="title"></el-input>
        </el-form-item>
        <el-form-item label="Level"
                      prop="level">
          <el-input v-model="form.level"
                    ref="level"></el-input>
        </el-form-item>
        <el-form-item label="Type"
                      prop="typeId">
          <el-select clearable="true"
                     v-model="form.typeId">
            <el-option v-for="doc in typeIdOpts"
                       :key="doc._id"
                       :label="doc.type"
                       :value="doc._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-select clearable="true"
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
                   @click="handleSave">Save</el-button>
        <el-button @click="handleClose">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { insertSubject } from '../../api/subject/methods.js'
import { findType, removeType } from '../../api/types/methods.js'
import Lookup from '../libs/Lookup-Value.js'
export default {
  name: 'book-new',
  data() {
    return {
      typeIdOpts: [],
      statusOpts: Lookup.status,
      form: {
        code: '',
        title: '',
        typeId: '',
        level: '',
        status: ''
      },
      rules: {
        code: [{ required: true }],
        title: [{ required: true }],
        typeId: [{ required: true }],
        level: [{ required: true }]
      }
    }
  },
  mounted() {
    this.getTypeData()
  },
  methods: {
    getTypeData() {
      findType
        .callPromise({})
        .then(result => {
          this.typeIdOpts = result
        })
        .catch(err => {
          this.$message.error(err.reason)
        })
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          insertSubject
            .callPromise(this.form)
            .then(result => {
              this.$message({
                message: 'Save Success',
                type: 'success'
              })
              this.resetform()
            })
            .catch(error => {
              this.$message(error.reason)
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
    }
  }
}
</script>

<style>
.el-select {
  width: 100%;
}
</style>
