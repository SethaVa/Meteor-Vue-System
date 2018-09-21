<template>
  <span>
    <el-tooltip
      effect="dark"
      content="Branch"
      placement="bottom-end"
    >
      <el-dropdown
        trigger="click"
        class="header-item"
        @command="handleCommand"
      >
        <el-button type="text">
          <i class="fas fa-sitemap"></i>
          {{ currentBranch }}
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in allowedBranches"
            :key="item._id"
            :command="item"
          >
            {{ item._id }} : {{ item.shortName }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-tooltip>
  </span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BranchSetting',
  computed: {
    ...mapState({
      currentBranch(state) {
        const branch = state.app.currentBranch
        return branch && `${branch._id} : ${branch.shortName}`
      },
      allowedBranches(state) {
        return state.app.allowedBranches
      },
    }),
  },
  methods: {
    handleCommand(com) {
      this.$store.commit('app/updateCurrentBranch', com)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~imports/client/styles/header-menu.scss';
.current-branch {
  text-transform: uppercase;
}
</style>