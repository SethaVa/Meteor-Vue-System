<template>
<div>
<el-container style="height: 100vh;" >
  <el-aside width="250px" style="background-color: #1d2525de;height:675px">
    <img src="/img/logo.png" class="image">
    <el-menu 
    :default-active="activeMenu" 
    @select="handleMenuSelect" 
    text-color="#fff"
    >
      <el-menu-item index="home">
        <i class="fa fa-home"></i>
        <span>Home</span>
      </el-menu-item>
      <el-menu-item index="welcome">
        <i class="fa fa-home"></i>
        <span>Welcome</span>
      </el-menu-item>
      <el-menu-item index="student">
        <i class="fa fa-home"></i>
        <span>Student</span>
      </el-menu-item>
      <el-menu-item index="employee">
        <i class="fa fa-home"></i>
        <span>Employee</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-cion-message"></i>Student
        </template>
        <el-menu-item index="3">
          <i class="el-icon-message"></i>
        </el-menu-item>
      </el-submenu>

    </el-menu>
  </el-aside>
  
  <el-container>
    <!-- Heder -->
    <el-header style="text-align: right; font-size: 12px">
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>View</el-dropdown-item>
          <el-dropdown-item>Add</el-dropdown-item>
          <el-dropdown-item>Delete</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>Tom</span>
    </el-header>

<!-- Mian Page     -->
    <el-main>

      <div class="main">
          <router-view></router-view>
      </div>
      
    </el-main>
  </el-container>
</el-container>
</div>
</template>

<script>
export default {
  name: "LayoutMenu",
  props: ["activeMenu"],
  methods: {
    handleMenuSelect(name) {
      this.$router.push({ name:name });
    }
  }
};
</script>

<style scoped>
.el-header {
  background-color: #c7cccc;
  color: rgb(255, 255, 255);
  line-height: 60px;
}

.el-aside {
  color: #333;
  background-size: cover;
  background-position: 50%;
  z-index: 1;
}
.el-aside:after {
  background: linear-gradient(180deg, #ffa534, #ff5221);
  background-size: 150% 150%;
}

.main {
  min-height: calc(100vh - 189px);
  background-color: white;
  margin: 0px 0px 0px;
  padding: 25px 25px;
  position: relative;
  border-radius: 0px 0px 4px 4px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
}
.el-container {
  margin: 0vh;
}
.image {
  width: 70%;
  margin: 0px 0px 0px 34px;
}
/* Menu */
.el-menu {
  border-right: none !important;
  background-color: transparent !important;
}
.el-menu-item {
  font-weight: 700;
  text-transform: capitalize;
  font-size: 12px;
  margin-left: 20px;
  margin-right: 20px;
  border-radius: 3px;
  margin-top: 5px;
}
.el-menu-item:focus,
.el-menu-item:hover,
.el-menu-item:active {
  opacity: 1;
  background: hsla(0, 0%, 100%, 0.23);
}
.el-submenu:focus,
.el-submenu:hover,
.el-submenu:active {
  opacity: 1;
  background: hsla(0, 0%, 100%, 0.23);
}
.el-menu-item-group {
  background: transparent;
}
.el-menu-item.is-active {
  color: #ffffff;
  background: hsla(0, 0%, 100%, 0.23);
}
.el-menu-item [class^="fa"],.el-submenu [class^="fa"] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 14px;
  vertical-align: middle;
}
</style>
