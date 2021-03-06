<template>
  <div>
    <el-dialog :visible="visible"
               :before-close="handleModalClose"
               title="Edit Branch"
               width="60%">
      <el-form v-loading="loading"
               ref="form"
               :model="form"
               :rules="rules"
               :size="formSize"
               label-width="150px"
               label-position="left">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Name"
                          prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="Short Name"
                          prop="shortName">
              <el-input v-model="form.shortName"></el-input>
            </el-form-item>

            <el-form-item label="Address"
                          prop="address">
              <el-input v-model="form.address"
                        type="textarea"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Telephone"
                          prop="telephone">
              <el-input v-model="form.telephone"></el-input>
            </el-form-item>

            <el-form-item label="Email"
                          prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary"
                         @click="submitForm">Save</el-button>
              <el-button @click="handleModalClose">Cancel</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'

import { updateBranch } from '../../api/branches/methods'

export default {
  name: 'BranchEdit',
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
      loading: false,
      form: this.updateDoc,

      rules: {
        name: [{ required: true, message: 'Name is required' }],
        shortName: [{ required: true, message: 'Short name is required' }],
        address: [{ required: true, message: 'Address is required' }],
        telephone: [{ required: true, message: 'Telephone is required' }],
        email: [{ type: 'email', message: 'Email is not a valid email' }],
      },
    }
  },
  computed: {
    formSize() {
      return this.$store.getters['app/formInterface']
    },
  },
  methods: {
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true

          // Pick data
          let doc = _.pick(this.form, [
            '_id',
            'name',
            'shortName',
            'address',
            'telephone',
          ])
          if (this.form.email) {
            doc.email = this.form.email
          }

          updateBranch
            .callPromise(doc)
            .then(result => {
              if (result) {
                this.loading = false
                Msg.success()
                this.handleModalClose()
              }
            })
            .catch(error => {
              this.loading = false
              Notify.error({ message: error })
            })
        } else {
          return false
        }
      })
    },
    handleReset() {
      this.$refs['form'].resetFields()
    },
    handleModalClose() {
      this.$emit('modal-close')
    },
  },
}
</script>

<style scoped>
</style>
