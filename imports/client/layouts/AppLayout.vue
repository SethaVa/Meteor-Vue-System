<template>
  <div>
      <main-layout></main-layout>
  </div>
</template>

<script>
import {Meteor} from 'meteor/meteor';
import MainLayout from './MainLayout.vue';

export default {
    name:'app-layout',
    components:{
        MainLayout
    }

}
</script>

<style>

</style>
