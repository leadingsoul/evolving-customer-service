<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { aftersaleApi } from '@/api'
import type { AftersaleTicket } from '@/types'
import { showToast, showConfirmDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const ticketId = route.params.id as string

const ticket = ref<AftersaleTicket | null>(null)
const loading = ref(true)

const steps = ['提交', '审核', '处理', '完成']

onMounted(async () => {
  try { ticket.value = await aftersaleApi.detail(ticketId) }
  catch { showToast('加载失败') }
  finally { loading.value = false }
})

function getStatusClass(status: string) { /* same as list */ }

function getStepIndex(status: string): number {
  const map: Record<string, number> = { '待审核': 0, '审核通过': 1, '处理中': 2, '已完成': 3, '已拒绝': -1 }
  return map[status] ?? 0
}

async function handleCancel() {
  try {
    await showConfirmDialog({ title: '撤销申请', message: '确定要撤销此次售后申请吗？', confirmButtonColor: '#FF1744' })
    await aftersaleApi.cancel(ticketId)
    showToast('已撤销')
    router.back()
  } catch { /* canceled */ }
}
</script>

<template>
  <div class="detail-page">
    <div class="page-header">
      <span style="cursor:pointer;" @click="router.back()">←</span>
      <span class="header-title">售后详情</span>
      <span></span>
    </div>

    <van-loading v-if="loading" type="spinner" style="display:flex;justify-content:center;padding:40px;" />

    <template v-if="ticket">
      <div style="padding:12px;">
        <!-- 状态步骤条 -->
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <b>工单 {{ ticket.id }}</b>
            <span :class="`tag ${ticket.status === '已完成' ? 'tag-green' : ticket.status === '已拒绝' ? 'tag-red' : ticket.status === '待审核' ? 'tag-orange' : 'tag-blue'}`">
              {{ ticket.status }}
            </span>
          </div>
          <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">
            {{ ticket.type }} · {{ ticket.reason }} · {{ ticket.createdAt }}
          </div>

          <div v-if="ticket.status !== '已拒绝'" class="steps-row">
            <div v-for="(label, i) in steps" :key="i" class="step-item"
              :class="{ 'done': i < getStepIndex(ticket.status), 'active': i === getStepIndex(ticket.status) }">
              <div class="step-dot">{{ i < getStepIndex(ticket.status) ? '✓' : (i + 1) }}</div>
              <div class="step-label">{{ label }}</div>
            </div>
          </div>
        </div>

        <!-- 工单信息 -->
        <div class="card">
          <div class="form-group">
            <label class="form-label">售后类型</label>
            <div style="font-size:14px;color:var(--text);">{{ ticket.type }}</div>
          </div>
          <div class="form-group">
            <label class="form-label">售后原因</label>
            <div style="font-size:14px;color:var(--text);">{{ ticket.reason }}</div>
          </div>
          <div class="form-group" v-if="ticket.description">
            <label class="form-label">问题描述</label>
            <div style="font-size:14px;color:var(--text);line-height:1.6;">{{ ticket.description }}</div>
          </div>
          <div v-if="ticket.evidenceUrls?.length" class="form-group">
            <label class="form-label">凭证图片</label>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <van-image v-for="(url, i) in ticket.evidenceUrls" :key="i" :src="url" width="60" height="60" fit="cover" radius="6" />
            </div>
          </div>
          <div class="form-group" v-if="ticket.handleOpinion">
            <label class="form-label">处理意见</label>
            <div style="font-size:14px;color:var(--text);line-height:1.6;">{{ ticket.handleOpinion }}</div>
          </div>
        </div>

        <!-- 撤销 -->
        <div v-if="ticket.status === '待审核'" style="padding:12px 0;">
          <button class="btn btn-danger btn-block" @click="handleCancel">撤销售后申请</button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-page { min-height: 100vh; background: var(--bg-page); }
</style>
