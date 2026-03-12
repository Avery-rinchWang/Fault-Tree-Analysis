// stores/group.ts
import { defineStore } from 'pinia'

export interface Group {
  id: number
  name: string
  editing: boolean
}

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: [] as Group[], // 初始为空
    nextId: 1, // 从1开始
  }),
  actions: {
    addGroup() {
      const newGroup: Group = {
        id: this.nextId,
        name: `分组${this.nextId}`,
        editing: true, // 新建后直接进入编辑状态
      }
      this.groups.push(newGroup)
      this.nextId++
    },
    setEditing(id: number, editing: boolean) {
      const group = this.groups.find((g) => g.id === id)
      if (group) {
        group.editing = editing
        // 如果编辑结束且名称为空，还原为默认名称
        if (!editing && group.name.trim() === '') {
          group.name = `分组${group.id}`
        }
      }
    },
    renameGroup(id: number, newName: string) {
      const group = this.groups.find((g) => g.id === id)
      if (group) group.name = newName
    },
    deleteGroup(id: number) {
      const index = this.groups.findIndex((g) => g.id === id)
      if (index !== -1) {
        this.groups.splice(index, 1)
      }
    },
  },
})
