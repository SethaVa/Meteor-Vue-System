<template>
  <span>
    <!-- <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>View</el-dropdown-item>
          <el-dropdown-item>Add</el-dropdown-item>
          <el-dropdown-item >Delete</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span @click="logout">{{fullName}}</span> -->
    <!-- <span>
            <i class="el-icon-menu"></i>
        </span> -->
    <el-dropdown class="header-item-margin">
      <span class="el-dropdown-link">
        <!-- <i class="el-icon-setting icon-black"></i> -->
        Demo
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>Core 1</el-dropdown-item>
        <el-dropdown-item>Core 2</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Home',
  computed: {
    ...mapState({
      fullName(state) {
        return state.app.fullName
      },
    }),
  },
  mounted() {
    // console.log(this.getBrach())
  },
  methods: {
    // getBrach() {
    //     return this.$store.getters["app/fullName"];
    // },
  },
}
</script>

<style>
.el-dropdown-link {
  cursor: pointer;
  color: black;
}

.el-icon-caret-bottom {
  font-size: 12px;
}

.icon-black {
  color: rgb(0, 0, 0);
}

.header-item-margin {
  margin-left: 15px;
}
</style>
