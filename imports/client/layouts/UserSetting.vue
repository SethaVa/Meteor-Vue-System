<template>
  <!-- class="header-item-margin" -->
  <el-tooltip effect="dark"
              :content="userFullName"
              :enterable="false"
              placement="bottom-end">
    <el-dropdown trigger="click" class="header-item override-padding">
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
          <i class="far fa-user-circle"></i> Profile
        </el-dropdown-item>
        <el-dropdown-item class="logout"
                          @click.native="_logout">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-tooltip>
</template>

<script>
import { mapState } from 'vuex'
import Avatar from 'vue-avatar'

export default {
  name: 'UserSetting',
  components: { Avatar },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      currentUser(state) {
        // console.log('1 Dara');
        return state.app.currentUser // object
      },
    }),
    userFullName() {
      return this.$store.getters['app/userFullName']
    },
    // userIsInRoleUser() {
    //   return this.$store.getters['app/userIsInRole'](['receipt'])
    // },
    // userIsInRoleAdmin() {
    //   return this.$store.getters['app/userIsInRole'](['admin'])
    //   // (['admin', 'super','user'])
    //   // return this.$store.getters['userIsInRole'](['pos'])
    // },
    headerTitle() {
      let title = 'No TiTle'
      title = this.$route.meta.headerTitle
        ? this.$route.meta.headerTitle
        : this.$route.name ? _.startCase(this.$route.name) : title

      return title
    },
  },
  methods: {
    _profile() {
      this.$router.push({
        name: 'profile',
        params: { _id: this.currentUser._id },
      })
    },

    _logout() {
      // this.$store.clear
      // localStorage.removeItem('vuex')
      this.$store.commit('app/logout', this)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~imports/client/styles/header-menu.scss';

.override-padding {
  padding: 0px 0px 0px 7px;
}
.user-avatar {
  display: inline-block;
  margin-left: 0px;
  margin-right: 0px;
  text-align: center;
}

.username {
  font-weight: 700;
}

.logout {
  color: #f56c6c;
  font-weight: 500;
}
</style>