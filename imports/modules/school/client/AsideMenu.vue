<template>
  <div class="aside-menu-layout">
    <div class="aside-menu-group-title">School</div>

    <el-menu :default-active="activeMenu"
             @select="handleMenuSelect"
             text-color="#fff">
      <el-menu-item index="sch.home">
        <i class="fas fa-tachometer-alt"></i>
        <span>Dashboad</span>
      </el-menu-item>
      <!-- //======================== // Student //======================== -->
      <el-submenu index="sch.student">
        <template slot="title">
          <i class="fa fa-graduation-cap"></i>
          Student
        </template>
        <el-menu-item index="sch.student">
          <span>Student</span>
        </el-menu-item>
        <el-menu-item index="sch.registerList">
          <span>Register</span>
        </el-menu-item>
        <el-menu-item index="sch.classStudy">
          <span>Class Study</span>
        </el-menu-item>

        <el-menu-item index="sch.exchange-class">
          <span>Change Class</span>
        </el-menu-item>
      </el-submenu>

      <!-- //===============================// Payment //===================== -->
      <el-submenu index="sch.payment">
        <template slot="title">
          <i class="fas fa-money-bill-alt"></i>
          Payment
        </template>
        <el-menu-item index="sch.payment">
          <span>Payment</span>
        </el-menu-item>
        <el-menu-item index="sch.refund">
          <span>Refund</span>
        </el-menu-item>
      </el-submenu>

      <!-- //========================// Accounting //====================== -->
      <el-submenu index="sch.account">
        <template slot="title">
          <i class="fas fa-chart-line"></i>Income Statement
        </template>
        <el-menu-item index="sch.income">
          <span>Income/Expend</span>
        </el-menu-item>
      </el-submenu>

      <!-- //==================================// Staff //====================== -->

      <el-menu-item index="sch.staff">
        <i class="fa fa-users"></i>staff
      </el-menu-item>
      <!-- //========================== // Setting //========================== -->
      <el-submenu index="sch.stting">
        <template slot="title">
          <i class="fa fa-cogs"></i>Setting
        </template>
        <el-menu-item index="sch.position">
          <span>Position</span>
        </el-menu-item>
        <el-menu-item index="sch.level">
          <span>Level</span>
        </el-menu-item>
        <el-menu-item index="sch.subject">
          <span>Subject</span>
        </el-menu-item>
        <el-menu-item index="sch.time">
          <span>Time</span>
        </el-menu-item>
        <el-menu-item index="sch.salary-rate">
          <span>Rate</span>
        </el-menu-item>
        <el-menu-item index="sch.room">
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
