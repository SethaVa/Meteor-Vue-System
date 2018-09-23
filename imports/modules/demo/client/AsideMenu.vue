<template>
  <div class="aside-menu-layout">
    <div class="aside-menu-group-title">Demo</div>

    <el-menu :default-active="activeMenu"
             @select="handleMenuSelect"
             text-color="#fff">
      <el-menu-item index="demo.home">
        <i class="fas fa-tachometer-alt"></i>
        <span>Demo</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'AsideMenu',
  props: ['activeMenu'],
  computed: {
    userIsInRole() {
      return this.$store.getters['userIsInRole'](['super'])
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
