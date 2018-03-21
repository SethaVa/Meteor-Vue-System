<template>
  <div class="aside-menu-layout">
    <el-menu :default-active="activeMenu"
             @select="handleMenuSelect"
             text-color="#fff">
      <el-menu-item index="home">
        <i class="fa fa-tachometer"></i>
        <span>Dashboad</span>
      </el-menu-item>
      <el-menu-item index="subject">
        <i class="fa fa-home"></i>
        <span>Subject</span>
      </el-menu-item>
      <el-menu-item index="position">
        <i class="fa fa-home"></i>
        <span>Position</span>
      </el-menu-item>
      <el-menu-item index="staff">
        <i class="fa fa-home"></i>
        <span>Staff</span>
      </el-menu-item>
      <el-menu-item index="room">
        <i class="fa fa-home"></i>
        <span>Room</span>
      </el-menu-item>
      <el-menu-item index="type">
        <i class="fa fa-home"></i>
        <span>Type</span>
      </el-menu-item>
      <el-menu-item index="levele">
        <i class="fa fa-home"></i>
        <span>Levele</span>
      </el-menu-item>
      <el-menu-item index="classStudy">
        <i class="fa fa-home"></i>
        <span>Class Study</span>
      </el-menu-item>
      <el-menu-item index="time">
        <i class="fa fa-home"></i>
        <span>Time</span>
      </el-menu-item>
      <el-menu-item index="register">
        <i class="fa fa-home"></i>
        <span>Register</span>
      </el-menu-item>
      <el-menu-item index="payment">
        <i class="fa fa-home"></i>
        <span>Payment</span>
      </el-menu-item>
      <el-menu-item index="student">
        <i class="fa fa-home"></i>
        <span>Student</span>
      </el-menu-item>
      <el-menu-item index="classDetails">
        <i class="fa fa-home"></i>
        <span>Class Details</span>
      </el-menu-item>
      <el-menu-item index="refund">
        <i class="fa fa-home"></i>
        <span>Refund</span>
      </el-menu-item>
      <!-- <el-submenu index="2">
        <template slot="title">
          <i class="el-cion-message"></i>Student
        </template>
        <el-menu-item index="3">
          <i class="el-icon-message"></i>
        </el-menu-item>
      </el-submenu> -->

    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'AsideMenu',
  props: ['activeMenu'],
  methods: {
    handleMenuSelect(name) {
      this.$router.push({ name: name })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~imports/client/styles/aside-menu.scss';
</style>