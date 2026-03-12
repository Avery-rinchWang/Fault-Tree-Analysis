<!-- views/LoginView.vue -->
<template>
  <div class="login-layout">
    <!-- 顶部导航栏 -->
    <Navbar :show-auth-buttons="false" />
    <div class="login-container">
      <div class="login-card">
        <!-- 登录表单 -->
        <div v-if="isLoginMode">
          <h2>登录</h2>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label>用户名</label>
              <input type="text" v-model="loginForm.username" placeholder="请输入用户名" />
            </div>
            <div class="form-group">
              <label>密码</label>
              <input type="password" v-model="loginForm.password" placeholder="请输入密码" />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">登录</button>
              <button type="button" class="btn-secondary" @click="switchToRegister">
                切换到注册
              </button>
            </div>
          </form>
        </div>

        <!-- 注册表单（增加邮箱字段） -->
        <div v-else>
          <h2>注册</h2>
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label>用户名</label>
              <input type="text" v-model="registerForm.username" placeholder="请输入用户名" />
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input type="email" v-model="registerForm.email" placeholder="请输入邮箱" />
            </div>
            <div class="form-group">
              <label>密码</label>
              <input type="password" v-model="registerForm.password" placeholder="请输入密码" />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">注册</button>
              <button type="button" class="btn-secondary" @click="switchToLogin">切换到登录</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()

// 模式切换：true=登录，false=注册
const isLoginMode = ref(true)

// 登录表单数据
const loginForm = ref({
  username: '',
  password: '',
})

// 注册表单数据
const registerForm = ref({
  username: '',
  email: '',
  password: '',
})

// 切换到注册
const switchToRegister = () => {
  isLoginMode.value = false
}

// 切换到登录
const switchToLogin = () => {
  isLoginMode.value = true
}

// 处理登录
const handleLogin = () => {
  // 试验
  alert(`登录尝试：用户名=${loginForm.value.username}，密码=${loginForm.value.password}`)
}

// 处理注册
const handleRegister = () => {
  alert(
    `注册尝试：用户名=${registerForm.value.username}，邮箱=${registerForm.value.email}，密码=${registerForm.value.password}`,
  )
  // 注册成功后可以自动切换到登录
}
</script>

<style scoped>
.login-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
}

.login-card {
  width: 400px;
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.login-card h2 {
  margin-bottom: 24px;
  text-align: center;
  color: #1f2937;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #4b5563;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.btn-primary {
  flex: 1;
  background-color: #1e3a8a;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.btn-secondary {
  flex: 1;
  background-color: #e5e7eb;
  color: #1f2937;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary:hover,
.btn-secondary:hover {
  opacity: 0.9;
}
</style>
