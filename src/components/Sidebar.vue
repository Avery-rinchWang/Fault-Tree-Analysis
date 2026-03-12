<!-- components/Sidebar.vue -->
<template>
  <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
    <!-- 顶部区域：logo + 折叠图标 -->
    <div class="sidebar-header">
      <span v-if="!sidebarCollapsed" class="sidebar-title">RootSleuth</span>
      <button class="collapse-btn" @click="toggleSidebar">
        <span v-if="sidebarCollapsed">→</span>
        <span v-else>←</span>
      </button>
    </div>

    <!-- 导航菜单 -->
    <div class="sidebar-nav">
      <!-- 操作 -->
      <div class="nav-section">
        <div class="section-title" v-if="!sidebarCollapsed">操作</div>
        <!-- 新对话 -->
        <div class="nav-item" @click="goToHome">
          <span class="icon">💬</span>
          <span v-if="!sidebarCollapsed" class="label">新对话</span>
        </div>

        <!-- 上传文件 -->
        <div class="nav-item" @click="goToHome">
          <span class="icon">📎</span>
          <span v-if="!sidebarCollapsed" class="label">上传文件</span>
        </div>
        <!-- 历史记录 -->
        <div class="nav-item" @click="goToHistory">
          <span class="icon">📋</span>
          <span v-if="!sidebarCollapsed" class="label">历史记录</span>
        </div>
      </div>

      <!-- 分组区域 -->
      <div class="nav-section">
        <div class="section-header" v-if="!sidebarCollapsed">
          <span class="section-title">分组</span>
          <button class="add-group-btn" @click="addGroup">新建分组</button>
        </div>
        <!-- 折叠时只显示图标入口 -->
        <div v-if="sidebarCollapsed" class="nav-item">
          <span class="icon">📁</span>
        </div>
        <!-- 分组列表（展开时） -->
        <div v-if="!sidebarCollapsed" class="group-list">
          <div
            v-for="group in groups"
            :key="group.id"
            class="group-item"
            :class="{ editing: group.editing }"
            @contextmenu.prevent="showContextMenu($event, group)"
          >
            <span class="icon">📂</span>
            <div v-if="group.editing" class="group-edit">
              <input
                v-model="group.name"
                @blur="finishEdit(group)"
                @keyup.enter="finishEdit(group)"
                class="group-input"
                autofocus
              />
            </div>
            <span v-else class="group-name" @dblclick="startEdit(group)">{{ group.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <Teleport to="body">
      <div
        v-if="contextMenu.visible"
        class="context-menu"
        :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
      >
        <div class="context-menu-item" @click="handleRename">重命名</div>
        <div class="context-menu-item" @click="handleDelete">删除</div>
      </div>
    </Teleport>

    <!-- 左下角用户信息 -->
    <div class="user-info-bottom">
      <img src="https://via.placeholder.com/40?text=User" class="avatar" alt="avatar" />
      <div v-if="!sidebarCollapsed" class="user-details">
        <span class="username">用户名</span>
        <span class="email">邮箱：XXXXXXXXXXX</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'
import { useGroupStore } from '@/stores/group'
import { storeToRefs } from 'pinia'
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import type { Group } from '@/stores/group'

const router = useRouter()
const sidebarStore = useSidebarStore()
const groupStore = useGroupStore()

const { sidebarCollapsed } = storeToRefs(sidebarStore)
const { groups } = storeToRefs(groupStore)

// 右键菜单状态
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  targetGroup: null as Group | null,
})

const toggleSidebar = () => {
  sidebarStore.toggleCollapse()
}

const goToHome = () => {
  router.push('/')
}

const goToHistory = () => {
  router.push('/history')
}

const addGroup = () => {
  groupStore.addGroup()
  // 自动聚焦新增分组的输入框
  nextTick(() => {
    const inputs = document.querySelectorAll('.group-input')
    if (inputs.length) {
      ;(inputs[inputs.length - 1] as HTMLInputElement).focus()
    }
  })
}

const startEdit = (group: Group) => {
  groupStore.setEditing(group.id, true)
}

const finishEdit = (group: Group) => {
  groupStore.setEditing(group.id, false)
}

// 显示右键菜单
const showContextMenu = (event: MouseEvent, group: Group) => {
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    targetGroup: group,
  }
}

// 隐藏右键菜单
const hideContextMenu = () => {
  contextMenu.value.visible = false
  contextMenu.value.targetGroup = null
}

// 处理重命名
const handleRename = () => {
  if (contextMenu.value.targetGroup) {
    groupStore.setEditing(contextMenu.value.targetGroup.id, true)
    nextTick(() => {
      // 聚焦对应的输入框
      const inputs = document.querySelectorAll('.group-input')
      const groupIndex = groups.value.findIndex((g) => g.id === contextMenu.value.targetGroup?.id)
      if (groupIndex !== -1 && inputs[groupIndex]) {
        ;(inputs[groupIndex] as HTMLInputElement).focus()
      }
    })
  }
  hideContextMenu()
}

// 处理删除
const handleDelete = () => {
  if (contextMenu.value.targetGroup) {
    groupStore.deleteGroup(contextMenu.value.targetGroup.id)
  }
  hideContextMenu()
}

// 点击其他地方关闭右键菜单
const handleClickOutside = () => {
  if (contextMenu.value.visible) {
    hideContextMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.sidebar {
  width: 240px;
  background-color: #f3f4f6;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
  overflow-y: auto;
  height: 100%;
  position: relative;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1e3a8a;
}

.collapse-btn {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 0.9rem;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 8px;
}

.nav-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 8px;
  padding-left: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-left: 8px;
}

.add-group-btn {
  background: none;
  border: 1px solid #9ca3af;
  border-radius: 4px;
  font-size: 0.7rem;
  padding: 2px 6px;
  cursor: pointer;
}

.add-group-btn:hover {
  background-color: #e5e7eb;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 2px;
}

.nav-item:hover {
  background-color: #e5e7eb;
}

.icon {
  margin-right: 12px;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.collapsed .icon {
  margin-right: 0;
}

.label {
  font-size: 0.95rem;
}

.group-list {
  margin-left: 8px;
}

.group-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: context-menu;
}

.group-item:hover {
  background-color: #e5e7eb;
}

.group-item .icon {
  font-size: 1rem;
  margin-right: 8px;
}

.group-name {
  font-size: 0.9rem;
  cursor: pointer;
  flex: 1;
}

.group-edit {
  flex: 1;
}

.group-input {
  width: 100%;
  padding: 2px 4px;
  font-size: 0.9rem;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  outline: none;
}

.user-info-bottom {
  margin-top: auto;
  padding: 16px 12px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.collapsed .avatar {
  margin-right: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
}

.username {
  font-weight: 500;
}

.email {
  color: #6b7280;
}
</style>

<!-- 全局样式用于右键菜单 -->
<style>
.context-menu {
  position: fixed;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  z-index: 9999;
  min-width: 120px;
}

.context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #1f2937;
  transition: background-color 0.2s;
}

.context-menu-item:hover {
  background-color: #f3f4f6;
}

.context-menu-item:first-child {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.context-menu-item:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>
