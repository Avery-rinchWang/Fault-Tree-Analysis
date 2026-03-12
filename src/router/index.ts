import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HomeMain from '@/views/HomeMain.vue'
import HistoryMain from '@/views/HistoryMain.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Home', component: HomeMain },
      { path: 'history', name: 'History', component: HistoryMain },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
