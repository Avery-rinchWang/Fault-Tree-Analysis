<!-- views/HomeMain.vue -->
<template>
  <div class="home-main">
    <!-- 描述区文字 -->
    <div class="description-label">描述区</div>
    <!-- 自动增高输入框 -->
    <div class="input-wrapper">
      <textarea
        ref="textareaRef"
        v-model="inputText"
        placeholder="请输入您的需求……"
        rows="1"
        class="auto-expand-textarea"
        @input="autoExpand"
      ></textarea>
    </div>

    <!-- 上传区域 -->
    <div class="upload-area">
      <div class="upload-placeholder">拖拽文件至此处上传，或点击选择文件</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputText = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const autoExpand = () => {
  const textarea = textareaRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }
}
</script>

<style scoped>
.home-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  min-height: 500px;
}

.description-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: -4px;
  flex-shrink: 0;
}

.input-wrapper {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background-color: white;
  transition: border-color 0.2s;
  flex-shrink: 0; /* 防止被压缩 */
}

.input-wrapper:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.auto-expand-textarea {
  width: 100%;
  padding: 14px 18px;
  font-size: 1rem;
  line-height: 1.5;
  border: none;
  outline: none;
  resize: none;
  border-radius: 12px;
  font-family: inherit;
  background: transparent;
  overflow-y: hidden;
}

.upload-area {
  border: 2px dashed #9ca3af;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  background-color: #f9fafb;
  color: #6b7280;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.upload-area:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.upload-placeholder {
  font-size: 1rem;
}
</style>
