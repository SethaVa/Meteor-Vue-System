<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="New User"
               :visible="true"
               width="90%"
               :before-close="handleClose">
      <el-form v-loading="loading"
               :model="form"
               :rules="rules"
               size="mini"
               ref="form"
               label-position="left"
               label-width="170px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Full name"
                          prop="fullName">
              <el-input v-model="form.fullName"></el-input>
            </el-form-item>
            <el-form-item label="Username"
                          prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="Email"
                          prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="Password"
                          prop="password">
              <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="Confirm password"
                          prop="confirmPassword">
              <el-input v-model="form.confirmPassword"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Status"
                          prop="status">
              <el-select v-model="form.status"
                         style="width: 100%">
                <el-option v-for="item in statusOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Roles"
                          prop="roles">
              <el-select v-model="form.roles"
                         multiple
                         style="width: 100%">
                <el-option v-for="item in roleOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Branch permissions"
                          prop="allowedBranches">
              <el-select v-model="form.allowedBranches"
                         multiple
                         style="width: 100%">
                <el-option v-for="item in branchPermissionOpts"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item>
              <el-button type="primary"
                         @click="submitForm">
                Save
              </el-button>
              <el-button @click="handleCancel">Cancel</el-button>
            </el-form-item> -->
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   size="mini"
                   @click="submitForm">Save</el-button>
        <el-button @click="handleClose"
                   size="mini">Cancel</el-button>
      </span>
    </el-dialog :close-on-click-modal="false">
  </div>
</template>

<script>
import _ from 'lodash'
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'
// lib
import LookupValue from '../lib/Lookup-Value'

import { lookupRole, lookupBranch } from '/imports/util/lookup-methods'
import { validateUserExist } from '/imports/util/validate-methods'
import { insertUser } from '../../api/users/methods'

export default {
  name: 'UserNew',
  data() {
    // Custom validate
    const validateUsername = (rule, value, callback) => {
      if (value) {
        validateUserExist
          .callPromise({ username: value })
          .then(result => {
            if (result) {
              callback(new Error('Username exist'))
            } else {
              callback()
            }
          })
          .catch(error => {
            Notify.error({ message: error })
          })
      }
    }

    const validateEmail = (rule, value, callback) => {
      if (value) {
        validateUserExist
          .callPromise({ emails: { $elemMatch: { address: value } } })
          .then(result => {
            if (result) {
              callback(new Error('Email exist'))
            } else {
              callback()
            }
          })
          .catch(error => {
            Notify.error({ message: error })
          })
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value) {
        if (this.form.confirmPassword !== '') {
          this.$refs.form.validateField('confirmPassword')
        }
        callback()
      }
    }

    const validateConfirmPassword = (rule, value, callback) => {
      if (value && value !== this.form.password) {
        callback(new Error("The password don't match!"))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      // roleOpts: LookupValue.roles,
      roleOpts:[],
      statusOpts: LookupValue.status,
      branchPermissionOpts: [],
      form: {
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        status: '',
        allowedBranches: [],
        roles: [],
      },
      rules: {
        fullName: [{ required: true, message: 'Full name is required' }],
        username: [
          { required: true, message: 'Username is required' },
          {
            min: 5,
            max: 20,
            message: 'Length should be 5 to 20',
            trigger: 'blur',
          },
          { validator: validateUsername, trigger: 'blur' },
        ],
        email: [
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Email is not a valid email' },
          { validator: validateEmail, trigger: 'blur' },
        ],
        status: [{ required: true, message: 'Status is required' }],
        password: [
          { required: true, message: 'Password is required' },
          {
            min: 6,
            message: 'Length should be greater than 6',
            trigger: 'blur',
          },
          { validator: validatePassword, trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: 'Confirm password is required' },
          {
            min: 6,
            message: 'Length should be greater than 6',
            trigger: 'blur',
          },
          { validator: validateConfirmPassword, trigger: 'blur' },
        ],
        allowedBranches: [
          { required: true, message: 'Branches is required' },
        ],
        roles: [{ required: true, message: 'Branches is required' }],
      },
    }
  },
  mounted() {
    this.getRoles()
    this.getBranches()
  },
  methods: {
    getRoles() {
      lookupRole
        .callPromise()
        .then(result => {
          this.roleOpts = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    getBranches() {
      lookupBranch
        .callPromise({})
        .then(result => {
          this.branchPermissionOpts = result
        })
        .catch(error => {
          Notify.error({ message: error })
        })
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true

          // Make data
          const data = _.clone(this.form)
          delete data.confirmPassword

          insertUser
            .callPromise({ user: data })
            .then(result => {
              if (result) {
                this.loading = false
                Msg.success()
                this.resetForm()
              }
            })
            .catch(error => {
              this.loading = false
              console.log(error);
              Notify.error({ message: error.reason })
            })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
    },
    handleClose() {
      this.$emit('modal-close')
    },
  },
}
</script>

<style lang="scss" scoped>
// @import '../styles/main.scss';
</style>
