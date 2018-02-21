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
        <el-form-item label="Type"
                      prop="typeId">
          <el-select v-model="form.typeId">
            <el-option v-for="doc in typeIdOpts"
                       :key="doc._id"
                       :label="doc.type"
                       :value="doc._id"></el-option>
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
import { findType, removeType } from '../../api/types/methods.js'
import { updateSubject, findOneSubject } from '../../api/subject/methods.js'
export default {
  name: 'book-new',
  meta: {
    title: 'Book'
  },
  props: ['updateId'],
  data() {
    return {
      typeIdOpts: [
        { label: 'Full Time', value: 'Full Time' },
        { label: 'Part Time', value: 'Part Time' }
      ],
      form: {
        code: '',
        title: '',
        typeId: ''
      },
      rules: {
        code: [{ required: true }],
        title: [{ required: true }],
        typeId: [{ required: true }]
      }
    }
  },
  mounted() {
    this.getData()
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
    getData() {
      let id = this.updateId
      findOneSubject
        .callPromise({ selector: id })
        .then(result => {
          this.form = result
        })
        .catch(err => {
          this.$message(err.reason)
        })
    },
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateSubject
            .callPromise(this.form)
            .then(result => {
              this.$message({
                message: 'Save Success',
                type: 'success'
              })
              this.handleClose()
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
