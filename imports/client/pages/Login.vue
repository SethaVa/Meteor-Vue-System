<template>
  <div>
      <div class="box">
        <el-form :model="form" :rules="rules" ref="form">
            <el-form-item>
                <el-input v-model="form.email" autofocus ref="username"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input type="password" v-model="form.password" ref="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button style="width:100%" @click="submitForm" type="primary">Login</el-button>
            </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
import { Meteor } from "meteor/meteor";
import _ from 'lodash';
import {appLog} from '../../api/app-logs/methods.js';

export default {
  name: "login",
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      rules: {}
    };
  },
  methods: {
    submitForm() {
      if (!(this.form.email && this.form.password)) {
        this.$message.warning("Please input username/email and password!");
      } else {
        Meteor.loginWithPassword(this.form.email, this.form.password, err => {
          if (err) {
            this.$message.error("Username/Email or Password is invalid!");
            this.$refs.email.$el.querySelector("input").focus();
          } else {
            // log
            appLog
              .callPromise({
                level: "LOGIN",
                title: "LOG",
                data: { login: true }
              })
              .then(result => {
                if (result) {
                  this.$store.commit("app/updateCurrentUser", Meteor.user());
                  this.$message.success("You are login!");
                  this.$router.push({ name: "home" });
                }
              })
              .catch(err => {
                console.log(err.reason);
                this.$notify.error(err.reason);
              });
          }
        });
      }
    }
  }
};
</script>

<style>
.box {
  width: 30%;
  height: 400px;
  background: whitesmoke;
  margin: 0 auto;
  border-radius: 2px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 20px;
}
/* .image{
    width: 30%;
    margin: 0 auto;
    height: 30%;;
} */
</style>
