<script setup>

import {useRoute} from "vue-router";
import {computed} from "vue";
import BasicLayout from "./layouts/BasicLayout.vue";

const route = useRoute();

// 判断当前路径是否包含 /user
const isUserRoute = computed(() => route.path.includes('/user'));
</script>

<template>
  <router-view v-if="isUserRoute" />
  <BasicLayout v-else/>
</template>

<style>
#app {
  width: 100%;
  height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}
</style>