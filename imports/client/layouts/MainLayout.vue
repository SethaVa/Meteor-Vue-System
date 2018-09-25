<template>
  <el-container class="container">
    <!-- v-if="toggle" -->

    <el-aside width="260px"
              id="menu-side"
              class="aside">
      <!-- <span v-show="toggle"> -->
      <!-- Aside Menu -->
      <!-- <div class="logo">
          <img src="/img/logo.png"
               class="logo-img">
        </div> -->
      <el-menu :default-active="linkActiveClass"
               text-color="#fff"
               @select="handleAsideSelect">
        <el-menu-item index="home">
          <i class="fa fa-home aside-menu-icon"></i>
          <span>Home</span>
        </el-menu-item>
        <!-- <aside-menu :active-menu="linkActiveClass"></aside-menu> -->
        <!-- Dynamic module -->
        <component v-for="(aside, index) in asideMenus"
                   :key="index"
                   :is="aside"
                   :active-menu="linkActiveClass"></component>
      </el-menu>
    </el-aside>
    <!-- <component :is="currentLayout"></component> -->

    <el-container>
      <!-- Heder -->
      <!-- header-menu clearfix -->
      <el-header class="header header-menu header-menu-layout ">
        <span class="page-title">
          {{ headerTitle }}
        </span>

        <span class="menu-left">
          <!-- Module -->
          <component v-for="(header, index) in headerMenus"
                     :key="index"
                     :is="header"></component>
        </span>
        <!-- Header Menu -->
        <span class="menu-right">
          <!-- branch setting -->
          <branch-setting></branch-setting>
          <!-- Admin setting -->
          <admin-setting></admin-setting>
          <!-- User seting -->
          <user-setting></user-setting>
        </span>
      </el-header>
      <!-- Mian Page     -->
      <el-main class="app-content">

        <!-- <router-view></router-view> -->
        <div class="router-view">
          <transition name="fade-transform"
                      mode="out-in">
            <router-view></router-view>
          </transition>

        </div>

        <div class="footer">
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

import UserSetting from './UserSetting'
import AdminSetting from './AdminSetting'
import BranchSetting from './BranchSetting'
import { Session } from 'meteor/session'

import { appLog } from '../../api/app-logs/methods.js'
import { mapState } from 'vuex'

// ------------------------Dynamic modules--------------
import navigation from '/imports/navigation'

export default {
  name: 'MainLayout',
  components: {
    AsideMenu,
    HeaderMenu,
    AdminSetting,
    UserSetting,
    BranchSetting,
  },
  metaInfo() {
    return {
      title: this.headerTitle,
      // titleTemplate: 'Rabbit - %s',
    }
  },
  data() {
    return {
      // userFullName: Session.get('username'),
      collapse: 'success',
      windowWidth: window.innerWidth,
      // toggle: false,
      title: this.headerTitle,
      asideMenus: navigation.aside,
      headerMenus: navigation.header,
      currentHeaderMenu: HeaderMenu,
      copyright: `${moment().format('DD-MM-YYYY')}`,
    }
  },
  // watch(){
  //   H(val){

  //   }
  // },
  // mounted() {
  //   console.log(document.documentElement.clientWidth)
  // },
  computed: {
    ...mapState({
      currentUser(state) {
        return state.app.currentUser // object
      },
    }),
    userFullName() {
      return this.$store.getters['app/userFullName']
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
    toggle() {
      return this.collapse !== 'success' ? true : false
    },
  },
  watch: {
    // resize width
    windowWidth(newWidth) {
      if (newWidth < 1024) {
        this.collapse = 'success'
      } else if (newWidth > 1024) {
        this.collapse = 'error'
      }
    },
  },

  mounted() {
    // resize window
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth
      })
    })
  },
  methods: {
     handleAsideSelect(index) {
      this.$router.push({ name: index })
    },
    _toggleMenu() {
      if (this.collapse == 'error') {
        this.collapse = 'success'
      } else if (this.collapse == 'success') {
        this.collapse = 'error'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// @import '~imports/client/styles/header-menu.scss';
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
/* Header */
.header {
  // background-color: #f5f7fa;
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
  color: #303133;
  line-height: 55px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  height: 55px !important;

  .page-title {
    font-size: 24px;
    font-weight: 300;
    padding-right: 10px;
    line-height: 50px;
  }

  .menu-left {
    position: absolute;
  }

  .menu-right {
    float: right;
    font-size: 24px;
    font-weight: 500;
  }
}
.header-menu1 {
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
// .content {
//   padding: 15px 20px 0px;
//   background: #eee;
//   .layout-content {
//     min-height: calc(100vh - 189px);
//     background-color: white;
//     margin: 0px 0px 0px;
//     padding: 25px 25px;
//     position: relative;
//     border-radius: 0px 0px 4px 4px;
//     box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
//   }

//   .layout-footer {
//     text-align: center;
//     font-size: 13px;
//     color: #97a8be;
//     padding: 15px 0 10px;
//   }
// }

// .aside-menu-mini {
//   background-color: #303133;
//   min-height: 100vh;
// }
/* Content */
.app-content {
  padding: 15px 20px 0px;
  background: #eee;

  .breadcrumb {
    margin: 0px 0px 15px;
  }

  .router-view {
    min-height: calc(100vh - 188px);
    background-color: white;
    margin: 0px 0px 0px;
    padding: 25px 25px;
    position: relative;
    border-radius: 0px 0px 4px 4px;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  }

  .footer {
    text-align: center;
    font-size: 12px;
    color: #97a8be;
    padding: 15px 0 10px;
  }
}
</style>

