<template>
  <div class="aside-menu-layout">
    <div class="aside-menu-group-title">School</div>

    <el-menu :default-active="activeMenu"
             @select="handleMenuSelect"
             text-color="#fff">
      <el-menu-item index="home">
        <i class="fas fa-tachometer-alt"></i>
        <span>Dashboad</span>
      </el-menu-item>
      <!-- //======================== // Student //======================== -->
      <el-submenu index="student">
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
      </el-submenu>

      <!-- //===============================// Payment //===================== -->
      <el-submenu index="payment">
        <template slot="title">
          <i class="fas fa-money-bill-alt"></i>
          Payment
        </template>
        <el-menu-item index="payment">
          <span>Payment</span>
        </el-menu-item>
        <el-menu-item index="refund">
          <span>Refund</span>
        </el-menu-item>
      </el-submenu>

      <!-- //========================// Accounting //====================== -->
      <el-submenu index="account">
        <template slot="title">
          <i class="fas fa-chart-line"></i>Income Statement
        </template>
        <el-menu-item index="income">
          <span>Income/Expend</span>
        </el-menu-item>
      </el-submenu>

      <!-- //==================================// Staff //====================== -->
      <el-submenu index="staff">
        <template slot="title">
          <i class="fa fa-users"></i>staff
        </template>
        <el-menu-item index="position">
          <span>Position</span>
        </el-menu-item>
        <el-menu-item index="staff">
          <span>Staff</span>
        </el-menu-item>
      </el-submenu>

      <!-- //========================== // Setting //========================== -->
      <el-submenu index="stting">
        <template slot="title">
          <i class="fa fa-cogs"></i>Setting
        </template>
        <el-menu-item index="subject">
          <span>Subject</span>
        </el-menu-item>
        <!-- <el-menu-item index="user">
          <span>User</span>
        </el-menu-item> -->
        <el-menu-item index="time">
          <span>Time</span>
        </el-menu-item>
        <el-menu-item index="exchange">
          <span>Exchange</span>
        </el-menu-item>
        <el-menu-item index="salary-rate">
          <span>Rate</span>
        </el-menu-item>
        <el-menu-item index="room">
          <span>Room</span>
        </el-menu-item>
      </el-submenu>
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
