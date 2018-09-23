<template>
  <div class="aside-menu-layout">
    <div class="aside-menu-group-title">School</div>

    <el-menu :default-active="activeMenu"
             @select="handleMenuSelect"
             text-color="#fff">
      <el-menu-item index="school.home">
        <i class="fas fa-tachometer-alt"></i>
        <span>Home</span>
      </el-menu-item>
      <!-- //======================== // Student //======================== -->
      <!-- <el-submenu index="student">
        <template slot="title">
          <i class="fa fa-graduation-cap"></i>
          Student
        </template>
        <el-menu-item index="student">
          <span>Student</span>
        </el-menu-item>
        <el-menu-item index="registerList">
          <span>Register</span>
        </el-menu-item>
        <el-menu-item index="classStudy">
          <span>Class Study</span>
        </el-menu-item>

        <el-menu-item index="exchange-class">
          <span>Change Class</span>
        </el-menu-item>
      </el-submenu> -->

    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'AsideMenu',
  props: ['activeMenu'],
  computed: {
    userIsInRole() {
      return this.$store.getters['userIsInRole'](['user'])
    },
  },

  methods: {
    handleMenuSelect(name) {
      this.$router.push({ name: name })
    },
  },
}
</script>

<style lang="scss">
</style>
