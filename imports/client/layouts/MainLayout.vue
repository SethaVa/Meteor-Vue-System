<template>
  <el-container class="container">

    <el-aside v-if="toggle"
              width="260px"
              id="menu-side"
              class="aside">
      <!-- <span v-show="toggle"> -->
      <!-- Aside Menu -->
      <div class="logo">
        <img src="/img/logo.png"
             class="logo-img">
      </div>

      <span v-if="userIsInRoleUser">
        <aside-menu-user :active-menu="linkActiveClass"></aside-menu-user>
      </span>
      <span v-else-if="userIsInRoleAdmin">
        <aside-menu :active-menu="linkActiveClass"></aside-menu>
      </span>
      <span v-else-if="userIsInRoleManager">
        <aside-menu-manager :active-menu="linkActiveClass"></aside-menu-manager>
      </span>
      <!-- @select="handleHomeSelect" -->

      <!-- <component :is="currentAsideMenu"
                 :active-menu="linkActiveClass"></component> -->
      <!-- </span> -->

    </el-aside>
    <div v-else
         class="aside-menu-mini">
      <!-- <aside-menu-mini :active-menu="linkActiveClass"></aside-menu-mini> -->
      <span v-if="userIsInRoleUser">
        <aside-menu-user-mini :active-menu="linkActiveClass"></aside-menu-user-mini>
      </span>
      <span v-else-if="userIsInRoleAdmin">
        <aside-menu-mini :active-menu="linkActiveClass"></aside-menu-mini>
      </span>
      <span v-else-if="userIsInRoleManager">
        <aside-menu-manager-mini :active-menu="linkActiveClass"></aside-menu-manager-mini>
      </span>
    </div>

    <el-container>
      <!-- Heder -->
      <el-header class="header-menu">
        <i class="fas fa-align-justify"
           id="toggle-menu"
           @click="_toggleMenu"></i>
        <!-- <el-button type="success"
                   icon="fas fa-align-justify"
                   circle
                   @click="_toggleMenu"></el-button> -->
        <span class="header-title">{{ headerTitle }}</span>
        <!-- Header Menu -->
        <span style="float: right;">
          <!-- <span>{{fullName}}</span> -->
          <!-- <component :is="currentHeaderMenu"></component> -->
          <el-dropdown class="header-item-margin">
            <span class="el-dropdown-link">
              <avatar :username="userFullName"
                      :size="40"></avatar>
                      <!-- background-color="#FFC107"
                      color="#EBEEF5" -->
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled
                                class="username">
                <i class="fa fa-user"></i> {{ userFullName }}
              </el-dropdown-item>
              <el-dropdown-item @click.native="_profile"
                                divided>
                Profile
              </el-dropdown-item>
              <!-- <el-dropdown-item command="lang">
                EN - KH
              </el-dropdown-item> -->
              <el-dropdown-item class="logout"
                                @click.native="_logout">
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
import AsideMenuMini from '../AsideMenuMini.vue'
import HeaderMenu from '../HeaderMenu.vue'
import AsideMenuUser from '../AsideMenuUser.vue'
import AsideMenuUserMini from '../AsideMenuUserMini.vue'
import AsideMenuManager from '../AsideMenuManager.vue'
import AsideMenuManagerMini from '../AsideMenuManagerMini.vue'

import { Session } from 'meteor/session'

import { appLog } from '../../api/app-logs/methods.js'
import { mapState } from 'vuex'

import Avatar from 'vue-avatar'

export default {
  name: 'MainLayout',
  components: {
    AsideMenu,
    AsideMenuMini,
    HeaderMenu,
    AsideMenuUser,
    AsideMenuUserMini,
    AsideMenuManager,
    AsideMenuManagerMini,
    Avatar,
  },
  data() {
    return {
      // userFullName: Session.get('username'),
      isCollapse: true,
      toggle: false,
      title: this.headerTitle,
      currentAsideMenu: AsideMenu,
      currentHeaderMenu: HeaderMenu,
      copyright: `${moment().format('DD-MM-YYYY')}`,
    }
  },

  computed: {
    ...mapState({
      currentUser(state) {
        return state.currentUser // object
      },
    }),
    userFullName() {
      return this.$store.getters['userFullName']
    },
    userIsInRoleUser() {
      return this.$store.getters['userIsInRole'](['receipt'])
    },
    userIsInRoleAdmin() {
      return this.$store.getters['userIsInRole'](['admin'])
      // (['admin', 'super','user'])
      // return this.$store.getters['userIsInRole'](['pos'])
    },
    userIsInRoleManager() {
      return this.$store.getters['userIsInRole'](['manager'])
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
    _toggleMenu() {
      this.toggle = !this.toggle
      // this.isCollapse = !this.isCollapse
    },
    _profile() {
      this.$router.push({
        name: 'profile',
        params: { _id: this.currentUser._id },
      })
    },

    _logout() {
      // this.$store.clear
      localStorage.removeItem('vuex')
      this.$store.commit('logout', this)
    },
  },
  //   $(function() {
  //   $('#menu-side').slimScroll({
  //     height: '200px',
  //   })
  // })
}
</script>

<style lang="scss">
#toggle-menu {
  cursor: pointer;
  margin-right: 20px;
  font-size: 20px;
}
#toggle-menu:hover {
  color: #303133;
}
// @import '~imports/client/styles/aside-menu.scss';

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
  // background-color: rgb(26, 170, 236);
  background: #c9d6ff; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #e2e2e2,
    #c9d6ff
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #e2e2e2,
    #c9d6ff
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  color: #606266;
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

.aside-menu-mini {
  background-color: #303133;
  min-height: 100vh;
}
</style>

