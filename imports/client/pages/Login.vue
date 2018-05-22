<template>
  <div>
    <div class="box">
      <div class="logo">
        <img src="/img/logo.png"
             class="logo-img">
      </div>
      <el-form :model="form"
               :rules="rules"
               size="medium"
               ref="form">
        <el-form-item>
          <el-input v-model="form.email"
                    prefix-icon=" fa fa-user"
                    :autofocus="true"
                    placeholder="Username"
                    ref="username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password"
                    v-model="form.password"
                    ref="password"
                    placeholder="************"
                    prefix-icon=" fa fa-lock"
                    @keyup.enter.native="submitForm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login"
                     @click="submitForm"
                     type="primary">
          <i class="fa fa-sign-in"></i>&nbsp;&nbsp;&nbsp;Login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import _ from 'lodash'
import { appLog } from '../../api/app-logs/methods.js'
import { mapState } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      userName:'',
      form: {
        email: '',
        password: '',
      },
      rules: {},
    }
  },
  computed: {
    ...mapState({
      currentUser(state) {
        return state.app.currentUser
      },
    }),
  },
  watch: {
    currentUser(val) {
      // Check user logged in
      if (val) {
        this.finishProgress('success', 1000)
      }
    },
  },
  Meteor:{
    // Session.set('username',this.userName);
  },
  methods: {
    submitForm() {
      if (!(this.form.email && this.form.password)) {
        this.$message.warning('Please input username/email and password!')
      } else {
        Meteor.loginWithPassword(this.form.email, this.form.password, err => {
          if (err) {
            this.$message.error('Username/Email or Password is invalid!')
            this.$refs.email.$el.querySelector('input').focus()
          } else {
            // log
            // appLog
            //   .callPromise({
            //     level: 'LOGIN',
            //     title: 'LOG',
            //     data: { login: true },
            //   })
            //   .then(result => {
            //     if (result) {
            // console.log(result)
            // console.log(Meteor.user())
            // // console.log(Meteor.user().username)
            Session.set('UserDoc', Meteor.user())
            // this.userName= Meteor.user().username
            // this.$store.commit('app/updateCurrentUser', Meteor.user())
            this.$message.success('You are login!')
            this.$router.push({ name: 'home' })
            // console.log(Session.get('username'))
            //   }
            // })
            // .catch(err => {
            //   console.log(err.reason)
            //   this.$notify.error(err.reason)
            // })
          }
        })
      }
    },
  },
}
</script>

<style lang='scss' scoped>
.box {
  max-width: 25%;
  max-height: 60vh;
  background: whitesmoke;
  margin: 0 auto;
  border-radius: 2px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 20px;
  .logo {
    text-align: center;
    line-height: 35px;
    color: white;
    .logo-img {
      max-width: 50%;
      height: auto;
    }
  }
}
.btn-login{
    width: 100%;
    border: none;
    border-radius: 3px;
    font-size: 14 px;
    font-weight: 500;
    text-transform: uppercase;
  }
/* .image{
    width: 30%;
    margin: 0 auto;
    height: 30%;;
} */
// background-color: #303133;
</style>
