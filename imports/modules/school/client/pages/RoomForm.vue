<template>
  <div>

    <el-form label-position="left"
             label-width="150px"
             :model="form"
             ref="form"
             v-loading="loading"
             :rules="rules">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="Name"
                        prop="name">
            <el-input v-model="form.name"
                      ref="name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Describe"
                        prop="des">
            <!-- :autosize="{minRows:4,maxRows:5}" -->
            <el-input type="textarea"
                      v-model="form.des"
                      ref="name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary"
                       @click="_submintForm">{{ formType }}</el-button>
            <el-button v-if="formType=='Update'"
                       @click="handleClose">Cancel</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
import {
  insertRoom,
  updateRoom,
} from '/imports/modules/school/api/rooms/methods.js'

export default {
  name: 'RoomForm',
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
      loading: false,
      form: {
        name: '',
        des: '',
      },
      rules: {
        name: {
          required: true,
        },
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
    _submintForm() {
      this.loading = true

      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.formType == 'Update') {
            updateRoom
              .callPromise({ doc: this.form })
              .then(result => {
                if (result) {
                  this.loading = false
                  Msg.success()
                  this.handleClose()
                }
              })
              .catch(error => {
                this.loading = false
                Notify.error({ message: error })
              })
          } else {
            insertRoom
              .callPromise({ doc: this.form })
              .then(result => {
                if (result) {
                  this.loading = false
                  Msg.success()
                  this.handleClose()
                }
              })
              .catch(error => {
                this.loading = false
                Notify.error({ message: error })
              })
          }
        } else {
          this.loading = false
          return false
        }
      })
    },
    handleClose() {
      this.resetForm()
      this.form._id = null
      this.$emit('data-change')
    },
    resetForm() {
      this.$refs['form'].resetFields()
    },
  },
}
</script>

<style>
.right {
  margin-top: 35px;
}
</style>
