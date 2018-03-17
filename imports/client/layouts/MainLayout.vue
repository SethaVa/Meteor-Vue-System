<template>
  <el-container>
    <el-aside width="250px"
              style="background-color: #1d2525de;height:675px">
      <!-- Aside Menu -->
      <img src="/img/logo.png"
           class="image">
      <!-- <span v-if="true">
              <aside-menu-user :active-menu="linkActiveClass"></aside-menu-user>
              <component :is="currentAsideMenu" :active-menu="linkActiveClass"></component>
          </span>
          <span v-else>
            <aside-menu :active-menu="linkActiveClass"></aside-menu>
            <component :is="currentAsideMenu" :active-menu="linkActiveClass"></component>
          </span> -->
      <component :is="currentAsideMenu"
                 :active-menu="linkActiveClass"></component>
    </el-aside>
    <el-container>
      <!-- Heder -->
      <el-header style=" font-size: 12px">
        <span class="header-title">{{ headerTitle }}</span>
        <!-- Header Menu -->
        <span style="float: right;">
          <!-- <span>{{fullName}}</span> -->
          <component :is="currentHeaderMenu"></component>
          <el-dropdown @command="handleUser"
                       class="header-item-margin">
            <span class="el-dropdown-link">
              <div class="user-img"><img src="/images/user.png"
                                         alt=""
                                         class="avatar"> {{ userFullName }}
                <i class="el-icon-arrow-down el-icon-right"></i>
              </div>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item>Profile</el-dropdown-item>
                            <el-dropdown-item>EN - KH</el-dropdown-item> -->
              <el-dropdown-item @click.native="_logout"
                                divided="">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </span>
      </el-header>
      <!-- Mian Page     -->
      <el-main>

        <div class="layout-content">
          <router-view></router-view>
        </div>

        <div class="layout-footer">
          {{ copyright }} &copy; B.A.D Forieng Language School
        </div>

      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import { Meteor } from 'meteor/meteor'
import moment from 'moment'
import _ from 'lodash'

import AsideMenu from '../AsideMenu.vue'
import HeaderMenu from '../HeaderMenu.vue'
import AsideMenuUser from '../AsideMenuUser.vue'

import { appLog } from '../../api/app-logs/methods.js'
import { mapState } from 'vuex'
export default {
  name: 'MainLayout',
  components: {
    AsideMenu,
    HeaderMenu,
    AsideMenuUser,
  },
  data() {
    return {
      title: this.headerTitle,
      currentAsideMenu: AsideMenu,
      currentHeaderMenu: HeaderMenu,
      copyright: `${moment().format('DD-MM-YYYY')}`,
    }
  },

  computed: {
    ...mapState({
      // currentUser(state) {
      //   console.log(state.app.currentUser)
      //   return state.app.currentUser // object
      // },
      userFullName() {
        let data = this.$store.getters['app/userFullName']
        console.log(data)
        return data
      },
    }),
    headerTitle() {
      let title = 'No TiTle'
      title = this.$route.meta.headerTitle
        ? this.$route.meta.headerTitle
        : this.$route.name ? _.startCase(this.$route.name) : title

      return title
    },
    linkActiveClass() {
      return this.$route.meta.linkActiveClass
        ? this.$route.meta.linkActiveClass
        : this.$route.name
    },
  },

  methods: {
    // handleMenuSelect(name) {
    //   this.$router.push({ name });
    // },
    handleUser(name) {
      // console.log(name);
      // this[name]();
    },
    _profile() {
      this.$Message.info('Prfile is clicked')
    },
    _logout() {
      appLog
        .callPromise({ title: 'LOG', level: 'LOGOUT', data: { logout: true } })
        .then(result => {
          if (result) {
            Meteor.logout(() => {
              this.$message.success('You are logout!')
              this.$router.push({ name: 'login' })
            })
          }
        })
        .catch(err => {
          this.$notify.error(err.reason)
        })
    },
  },
}
</script>

<style>
.el-header {
  /* background-color: #f5f7fa;
  color: #303133; */
  background-color: #409eff;
  color: rgb(255, 255, 255);
  line-height: 55px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  height: 55px !important;
}
.main {
  min-height: calc(100vh - 189px);
  background-color: white;
  margin: 0px 0px 0px;
  padding: 25px 25px;
  position: relative;
  border-radius: 0px 0px 4px 4px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
}
.image {
  width: 50%;
  margin: 0px 0px 0px 48px;
}

.layout-content {
  min-height: calc(100vh - 189px);
  background-color: white;
  margin: 0px 0px 0px;
  padding: 25px 25px;
  position: relative;
  border-radius: 0px 0px 4px 4px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);

  .header-title {
    font-size: 24px;
    font-weight: 300;
    margin: 5px 0px 17px;
  }
}

.layout-footer {
  text-align: center;
  font-size: 14px;
  color: #97a8be;
  padding: 15px 0 10px;
}
.header-title {
  font-size: 24px;
  font-weight: 300;
  color: rgb(17, 17, 17);
  /* // margin: 5px 0px 17px; */
}
</style>
