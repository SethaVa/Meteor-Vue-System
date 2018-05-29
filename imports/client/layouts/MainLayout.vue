<template>
  <el-container class="container">
    <el-aside width="260px"
              id="menu-side"
              class="aside">
      <!-- Aside Menu -->
      <div class="logo">
        <img src="/img/logo.png"
             class="logo-img">
      </div>

      <!-- <span v-if="true">
        <aside-menu-user :active-menu="linkActiveClass"></aside-menu-user>
        <component :is="currentAsideMenu"
                   :active-menu="linkActiveClass"></component>
      </span>
      <span v-else>
        <aside-menu :active-menu="linkActiveClass"></aside-menu>
        <component :is="currentAsideMenu"
                   :active-menu="linkActiveClass"></component>
      </span> -->
      <!-- @select="handleHomeSelect" -->

      <component :is="currentAsideMenu"
                 :active-menu="linkActiveClass"></component>

    </el-aside>
    <el-container>
      <!-- Heder -->
      <el-header class="header-menu">
        <span class="header-title">{{ headerTitle }}</span>
        <!-- Header Menu -->
        <span style="float: right;">
          <!-- <span>{{fullName}}</span> -->
          <!-- <component :is="currentHeaderMenu"></component> -->
          <el-dropdown @command="handleUser"
                       class="header-item-margin">
            <span class="el-dropdown-link">
              <avatar :username="userFullName" :size="40" background-color="#FFC107" color="#EBEEF5"></avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                disabled
                class="username"
              >
                <i class="fa fa-user"></i> {{ userFullName }}
              </el-dropdown-item>
              <el-dropdown-item
                command="profile"
                divided
              >
                Profile
              </el-dropdown-item>
              <el-dropdown-item command="lang">
                EN - KH
              </el-dropdown-item>
              <el-dropdown-item
                class="logout"
                @click.native="_logout"
              >
                <i class="fas fa-sign-out-alt"></i> 
                Logout
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </el-header>
      <!-- Mian Page     -->
      <el-main class="content">

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
import { slimScroll } from 'meteor/rochal:slimscroll'
import { Meteor } from 'meteor/meteor'
import moment from 'moment'
import _ from 'lodash'

import AsideMenu from '../AsideMenu.vue'
import HeaderMenu from '../HeaderMenu.vue'
import AsideMenuUser from '../AsideMenuUser.vue'
import { Session } from 'meteor/session'

import { appLog } from '../../api/app-logs/methods.js'
import { mapState } from 'vuex'

import Avatar from 'vue-avatar'

export default {
  name: 'MainLayout',
  components: {
    AsideMenu,
    HeaderMenu,
    AsideMenuUser,
    Avatar
  },
  data() {
    return {
      // userFullName: Session.get('username'),
      title: this.headerTitle,
      currentAsideMenu: AsideMenu,
      currentHeaderMenu: HeaderMenu,
      copyright: `${moment().format('DD-MM-YYYY')}`,
    }
  },

  computed: {
    ...mapState({
      currentUser(state) {
        return state.app.currentUser // object
      },
    }),
    userFullName() {
      return this.$store.getters['userFullName']
    },
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
      // this.$store.clear
      localStorage.removeItem('vuex')
      this.$store.commit('logout', this)
      // appLog
      //   .callPromise({ title: 'LOG', level: 'LOGOUT', data: { logout: true } })
      //   .then(result => {
      //     if (result) {
      //       Meteor.logout(() => {
      //         this.$message.success('You are logout!')
      //         this.$router.push({ name: 'login' })
      //       })
      //     }
      //   })
      //   .catch(err => {
      //     this.$notify.error(err.reason)
      //   })
    },
  },
  //   $(function() {
  //   $('#menu-side').slimScroll({
  //     height: '200px',
  //   })
  // })
}
</script>

<style lang="scss" scoped>
a:-webkit-any-link {
  color: white;
  text-decoration: none;
}
/* Container */
.container {
  height: 100vh;
  // min-height: calc(100vh - 189px);
  // min-width: 1024px;
  // position: fixed;
  // top: 0;
  // left: 0;
  // bottom: 0;
  // right: 0;
  // overflow: auto;
}

/* Aside */
.aside {
  background-color: #303133;
  .logo {
    text-align: center;
    line-height: 25px;
    color: white;
    position: relative;
    .logo-img {
      max-width: 40%;
      height: auto;
    }
  }
}
.header-menu {
  // background-color: #409eff;
  background-color: rgb(26, 170, 236);
  color: #ffffff;
  line-height: 55px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  height: 55px !important;
  .header-title {
    font-size: 24px;
    font-weight: 500;
    padding-right: 10px;
    line-height: 50px;
  }
}
/* Content */
.content {
  padding: 15px 20px 0px;
  background: #eee;
  .layout-content {
    min-height: calc(100vh - 189px);
    background-color: white;
    margin: 0px 0px 0px;
    padding: 25px 25px;
    position: relative;
    border-radius: 0px 0px 4px 4px;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  }

  .layout-footer {
    text-align: center;
    font-size: 13px;
    color: #97a8be;
    padding: 15px 0 10px;
  }
}
</style>
