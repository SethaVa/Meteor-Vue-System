<template>
  <div>
    <el-menu :default-active="activeMenu"
             @select="handleMenuSelect"
             text-color="#fff">
      <el-menu-item index="home">
        <i class="fa fa-home"></i>
        <span>Home</span>
      </el-menu-item>
      <el-menu-item index="book">
        <i class="fa fa-home"></i>
        <span>Book</span>
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
  name: 'aside-menu',
  props: ['activeMenu'],
  methods: {
    handleMenuSelect(name) {
      this.$router.push({ name: name })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~imports/client/styles/menu.scss';
</style>
 


