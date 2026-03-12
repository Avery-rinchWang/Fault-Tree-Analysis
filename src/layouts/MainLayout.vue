<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <Navbar :show-auth-buttons="true" />
    <div class="main-row">
      <!-- 侧边栏 -->
      <Sidebar />
      <!-- 主体区域：根据路由动态渲染 -->
      <div class="content-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-row {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #ffffff;
}
</style>
