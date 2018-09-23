<template>
  <div class="aside-menu-layout">
    <div class="aside-menu-group-title">Main</div>
    <el-menu :default-active="activeMenu"
             @select="handleMenuSelect"
             text-color="#fff">
      <el-menu-item index="welcome">
        <i class="fas fa-tachometer-alt"></i>
        <span>Home</span>
      </el-menu-item>
      <!-- <el-menu-item index="branch">
        <span>Branch</span>
      </el-menu-item>
      <el-menu-item index="company">
        <span>Company</span>
      </el-menu-item> -->
      <!-- <el-menu-item index="category-list">
        <span>Category</span>
      </el-menu-item>
      <el-menu-item index="item-list">
        <span>Item</span>
      </el-menu-item>
      <el-menu-item index="stock-list">
        <span>Stock</span>
      </el-menu-item> -->
      
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
