<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { noticeApi } from '@/api'
import type { Notice } from '@/types'
import { showToast } from 'vant'

const router = useRouter()
const notices = ref<Notice[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try { const res = await noticeApi.list(); notices.value = res.list }
  catch { showToast('加载失败') }
  finally { loading.value = false }
})

async function markAsRead(notice: Notice) {
  if (notice.isRead) return
  try { await noticeApi.markAsRead([notice.id]); notice.isRead = true } catch { /* */ }
}
</script>

<template>
  <div class="notice-page">
    <div class="page-header">
      <span style="cursor:pointer;" @click="router.back()">←</span>
      <span class="header-title">🔔 消息通知</span>
      <span></span>
    </div>

    <van-loading v-if="loading" type="spinner" style="display:flex;justify-content:center;padding:40px;" />

    <div v-if="!loading && notices.length === 0" class="empty-state">
      <span style="font-size:48px;">🔔</span>
      <p>暂无消息</p>
    </div>

    <div v-for="notice in notices" :key="notice.id" class="notice-card" :class="{ unread: !notice.isRead }" @click="markAsRead(notice)" style="padding:14px 16px;border-bottom:1px solid var(--border);background:#fff;cursor:pointer;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
        <span style="font-weight:500;font-size:14px;">{{ notice.title }}</span>
        <span class="unread-dot" v-if="!notice.isRead" style="width:6px;height:6px;border-radius:50%;background:var(--red);"></span>
      </div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.4;">{{ notice.content }}</div>
      <div style="font-size:11px;color:var(--border);margin-top:4px;">{{ notice.createdAt }}</div>
    </div>
  </div>
</template>

<style scoped>
.notice-page { min-height: 100vh; background: var(--bg-page); }
.notice-card.unread { background: #F0F7FF; }
</style>
