// stores/sidebar.ts
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    sidebarCollapsed: false,
  }),
  actions: {
    toggleCollapse() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    setCollapse(value: boolean) {
      this.sidebarCollapsed = value
    },
  },
})
