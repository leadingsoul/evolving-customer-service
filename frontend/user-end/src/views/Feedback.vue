<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { feedbackApi } from '@/api'
import { showToast, showLoadingToast, closeToast } from 'vant'

const router = useRouter()
const content = ref('')
const canSubmit = computed(() => content.value.trim().length >= 5)

async function handleSubmit() {
  if (!canSubmit.value) return
  showLoadingToast({ message: '提交中...', forbidClick: true })
  try { await feedbackApi.submit(content.value); closeToast(); showToast('感谢您的反馈！'); router.back() }
  catch { closeToast() }
}
</script>

<template>
  <div class="feedback-page">
    <div class="page-header">
      <span style="cursor:pointer;" @click="router.back()">←</span>
      <span class="header-title">💬 意见反馈</span>
      <span></span>
    </div>

    <div style="padding:12px;">
      <div class="card">
        <div class="form-group">
          <label class="form-label">问题或建议</label>
          <textarea v-model="content" class="form-textarea" placeholder="请详细描述您遇到的问题或建议（至少5个字）" maxlength="500"></textarea>
        </div>
        <button class="btn btn-primary btn-block" :disabled="!canSubmit" @click="handleSubmit">提交反馈</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feedback-page { min-height: 100vh; background: var(--bg-page); }
</style>
