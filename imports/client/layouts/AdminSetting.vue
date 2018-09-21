<template>
  <el-tooltip effect="dark"
              content="Setting"
              :enterable="false"
              placement="bottom-end">
    <el-dropdown trigger="click"
                 class="header-item"
                 @command="handleCommand">
      <el-button type="text">
        <!-- <i class="fas fa-cogs"></i> -->
        <i class="fas fa-sliders-h setting-size"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="company">Company</el-dropdown-item>
        <el-dropdown-item v-if="userIsInRole" command="branch">Branch</el-dropdown-item>
        <el-dropdown-item command="user">User</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-tooltip>
</template>

<script>
export default {
  name: 'AdminSetting',
  computed: {
    userIsInRole() {
      return this.$store.getters['app/userIsInRole'](['super'])
    },
  },
  methods: {
    handleCommand(name) {
      this.$router.push({ name })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~imports/client/styles/header-menu.scss';
</style>
<style>
.setting-size{
  font-size: 18px;
}
</style>
