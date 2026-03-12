<template>
  <router-view />
</template>

<script setup lang="ts">
// App.vue 仅作为根容器，路由视图由 layout 和页面组件处理
</script>

<style>
/* 全局简单重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  background-color: #f9fafb;
  color: #111827;
  height: 100vh;
}

#app {
  height: 100%;
}
</style>
