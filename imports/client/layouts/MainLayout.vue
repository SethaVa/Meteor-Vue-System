<template>
  <el-container>
      <el-aside>
          <h1>Aside Menu</h1>
          <component :is="currentAside"></component>
      </el-aside>
      <el-container>
          <el-header>
             <span style="float:right">
                  <component :is="currentHeader"></component>
             </span>
          </el-header>
          <el-main>
              <router-view></router-view>
          </el-main>
      </el-container>
  </el-container>
</template>

<script>
import AsideMenu from '../AsideMenu.vue';
import HeaderMenu from '../HeaderMenu.vue';

export default {
    name:'MainLayout',
    component:{
        AsideMenu,
        HeaderMenu
    },
    data(){
        return{
            currentAside:AsideMenu,
            currentHeader:HeaderMenu
        }
    }
}
</script>

<style>

</style>
