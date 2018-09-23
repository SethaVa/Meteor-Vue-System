<template>
  <el-container class="container">
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import moment from "moment";

import { mapGetters } from "vuex";

export default {
  name: "LoginLayout"
};
</script>

<style>

</style>
