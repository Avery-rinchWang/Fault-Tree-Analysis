<template>
  <header class="navbar">
    <div class="navbar-left">
      <h2 class="logo">RootSleuth</h2>
    </div>
    <div class="navbar-right">
      <template v-if="showAuthButtons && !isLoginPage">
        <button class="btn-login" @click="goToLogin">登录</button>
        <button class="btn-register" @click="goToLogin">注册</button>
      </template>
      <template v-else-if="isLoginPage">
        <button class="btn-back" @click="goToHome">返回主页</button>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const props = defineProps<{
  showAuthButtons?: boolean
}>()

const router = useRouter()
const route = useRoute()

const isLoginPage = computed(() => route.path === '/login')

const goToLogin = () => {
  router.push('/login')
}

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.navbar {
  height: 60px;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e3a8a;
}

.btn-login,
.btn-register,
.btn-back {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  margin-left: 8px;
}

.btn-login {
  background-color: #e0e7ff;
  color: #1e3a8a;
}

.btn-register {
  background-color: #1e3a8a;
  color: white;
}

.btn-back {
  background-color: #f3f4f6;
  color: #374151;
}
</style>
