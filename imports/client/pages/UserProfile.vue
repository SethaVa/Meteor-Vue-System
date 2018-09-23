<template>
  <div>
    <span class="user-avatar">
      <avatar :username="userFullName"
              :size="100"></avatar>
    </span>

    <el-form v-loading="loading"
             :model="form"
             :rules="rules"
             ref="form"
             label-width="200px">
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

          <el-form-item label="Old password"
                        prop="oldPassword">
            <el-input v-model="form.oldPassword"></el-input>
          </el-form-item>

          <el-form-item label="New password"
                        prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>

          <el-form-item label="New confirm password"
                        prop="confirmPassword">
            <el-input v-model="form.confirmPassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm">
              Save Changes
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import _ from 'lodash'
import Avatar from 'vue-avatar'
import Msg from '/imports/client/lib/message'
import Notify from '/imports/client/lib/notify'

import {
  validateUserExist,
  validateUserPassword,
} from '/imports/util/validate-methods.js'
import { findOneUser, updateUser } from '../../api/users/methods'

export default {
  name: 'UserProfile',
  components: { Avatar },
  data() {
    const _id = this.$route.params._id

    // Custom validate
    const validateUsername = (rule, value, callback) => {
      if (value) {
        validateUserExist
          .callPromise({
            _id: { $ne: _id },
            username: value,
          })
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
          .callPromise({
            _id: { $ne: _id },
            emails: { $elemMatch: { address: value } },
          })
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

    const validateOldPassword = (rule, value, callback) => {
      if (value) {
        validateUserPassword
          .callPromise(value)
          .then(result => {
            if (result.error) {
              callback(new Error('The old password is incorrect'))
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
        callback(new Error("The new password don't match!"))
      } else {
        callback()
      }
    }

    return {
      loading: true,
      form: {
        _id: '',
        fullName: '',
        username: '',
        email: '',
        status: '',
        oldPassword: '',
        password: '',
        confirmPassword: '',
        branchPermissions: [],
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
        oldPassword: [
          { required: true, message: 'Old password is required' },
          {
            min: 6,
            message: 'Length should be greater than 6',
            trigger: 'blur',
          },
          { validator: validateOldPassword, trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'New password is required' },
          {
            min: 6,
            message: 'Length should be greater than 6',
            trigger: 'blur',
          },
          { validator: validatePassword, trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: 'New confirm password is required' },
          {
            min: 6,
            message: 'Length should be greater than 6',
            trigger: 'blur',
          },
          { validator: validateConfirmPassword, trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    userFullName() {
      return this.$store.getters['app/userFullName']
    },
  },
  mounted() {
    this.getDataUpdate()
  },
  methods: {
    getDataUpdate() {
      this.loading = true
      const _id = this.$route.params._id

      findOneUser
        .callPromise(_id)
        .then(result => {
          this.form = {
            _id: result._id,
            fullName: result.profile.fullName,
            username: result.username,
            email: result.emails[0].address,
            status: result.profile.status,
            oldPassword: '',
            password: '',
            confirmPassword: '',
            branchPermissions: result.profile.branchPermissions,
            roles: result.roles[0],
          }
          this.$nextTick(() => (this.loading = false))
        })
        .catch(error => {
          this.loading = false
          Notify.error({ message: error })
        })
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true

          // Make data
          const data = _.clone(this.form)
          delete data.oldPassword
          delete data.confirmPassword

          updateUser
            .callPromise({ user: data })
            .then(currentUser => {
              if (currentUser) {
                this.loading = false
                if (currentUser === 'logout') {
                  this.$store.commit('logout', this)
                } else {
                  Msg.success()
                  this.handleCancel()
                }
              }
            })
            .catch(error => {
              this.loading = false
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
    handleCancel() {
      this.$router.push({ name: 'user' })
    },
  },
}
</script>

<style lang="scss" scoped>
.user-avatar {
  display: inline-block;
  margin: 0px 0px 20px 200px;
  text-align: center;
}
</style>
