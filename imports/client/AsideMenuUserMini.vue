<template>
  <!-- <div class="aside-menu-layout"> -->
  <el-menu :default-active="activeMenu"
           @select="handleMenuSelect"
           :collapse="isCollape"
           class="el-menu-vertical-demo"
           background-color="#303133"
           text-color="#fff">
    <el-menu-item index="home">
      <i class="fas fa-tachometer-alt"></i>
      <span slot="title">Dashboad</span>
    </el-menu-item>
    <!-- //======================== // Student //======================== -->
    <el-submenu index="student">
      <template slot="title">
        <i class="fa fa-graduation-cap"></i>
        <span slot="title">Student</span>
      </template>
      <el-menu-item index="student">
        <span>Student</span>
      </el-menu-item>
      <el-menu-item index="registerList">
        <span>Register</span>
      </el-menu-item>
      <!-- <el-menu-item index="classStudy">
          <span>Class Study</span>
        </el-menu-item> -->

      <el-menu-item index="exchange-class">
        <span>Change Class</span>
      </el-menu-item>
    </el-submenu>

    <!-- //===============================// Payment //===================== -->
    <el-submenu index="payment">
      <template slot="title">
        <i class="fas fa-money-bill-alt"></i>
        <span slot="title">Payment</span>
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
        <i class="fas fa-chart-line"></i>
        <span slot="title">Account</span>
      </template>
      <el-menu-item index="income">
        <span>Income/Expend</span>
      </el-menu-item>
    </el-submenu>

    <!-- //==================================// Staff //====================== -->
    <!-- <el-submenu index="staff">
        <template slot="title">
          <i class="fa fa-users"></i>staff
        </template>
        <el-menu-item index="position">
          <span>Position</span>
        </el-menu-item>
        <el-menu-item index="staff">
          <span>Staff</span>
        </el-menu-item>
      </el-submenu> -->
    <!-- //=========================== // Report //=========================== -->
    <el-submenu index="report">
      <template slot="title">
        <i class="fa fa-file-pdf-o"></i>
        <span slot="title">Report</span>
      </template>
      <el-menu-item index="student-all">
        <span>All Student</span>
      </el-menu-item>
      <el-menu-item index="student-debt">
        <span>Debt/Late Pay</span>
      </el-menu-item>
      <el-menu-item index="student-exchange">
        <span>Student Change</span>
      </el-menu-item>
      <el-menu-item index="classDetails">
        <span>Class Details</span>
      </el-menu-item>
      <!-- <el-menu-item index="teacher-details">
          <i class="fa fa-home"></i>
          <span>Teacher Details</span>
        </el-menu-item> -->
      <el-menu-item index="subject-report">
        <span>Subject</span>
      </el-menu-item>
      <!-- <el-menu-item index="staff-report">
          <i class="fa fa-home"></i>
          <span>Staff</span>
        </el-menu-item> -->
      <el-menu-item index="daily">
        <span>Daily Report</span>
      </el-menu-item>
      <!-- <el-menu-item index="monthly-report">
          <i class="fa fa-home"></i>
          <span>Monthly Report</span>
        </el-menu-item>
        <el-menu-item index="salary">
          <i class="fa fa-home"></i>
          <span>Salary</span>
        </el-menu-item> -->
    </el-submenu>
    <!-- //========================== // Setting //========================== -->
    <el-submenu index="stting">
      <template slot="title">
        <i class="fa fa-cogs"></i>
        <span slot="title">Setting</span>
      </template>
      <!-- <el-menu-item index="user">
          <i class="fas fa-users"></i>
          <span>User</span>
        </el-menu-item>
        <el-menu-item index="time">
          <i class="fa fa-clock-o"></i>
          <span>Time</span>
        </el-menu-item> -->
      <el-menu-item index="subject">
        <span>Subject</span>
      </el-menu-item>
      <el-menu-item index="exchange">
        <span>Exchange</span>
      </el-menu-item>
      <!-- <el-menu-item index="salary-rate">
          <i class="fa fa-money"></i>
          <span>Rate</span>
        </el-menu-item>
        <el-menu-item index="room">
          <i class="fa fa-windows"></i>
          <span>Room</span>
        </el-menu-item> -->
    </el-submenu>

  </el-menu>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'AsideMenu',
  props: ['activeMenu'],
  data() {
    return {
      isCollape: true,
    }
  },
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

