<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { aftersaleApi } from '@/api'
import type { AftersaleTicket } from '@/types'
import { showToast } from 'vant'

const router = useRouter()

const tickets = ref<AftersaleTicket[]>([])
const loading = ref(false)

onMounted(() => { loadTickets() })

async function loadTickets() {
  loading.value = true
  try {
    const res = await aftersaleApi.listByUser()
    tickets.value = res.list
  } catch { showToast('加载失败') }
  finally { loading.value = false }
}

function goDetail(ticket: AftersaleTicket) { router.push(`/aftersale/${ticket.id}`) }

function getStatusClass(status: string) {
  const map: Record<string, string> = {
    '待审核': 'tag-orange', '审核通过': 'tag-blue', '处理中': 'tag-blue', '已完成': 'tag-green', '已拒绝': 'tag-red',
  }
  return map[status] || 'tag-grey'
}

function getStepIndex(status: string): number {
  const map: Record<string, number> = { '待审核': 0, '审核通过': 1, '处理中': 2, '已完成': 3, '已拒绝': -1 }
  return map[status] ?? 0
}

const steps = ['提交', '审核', '处理', '完成']
</script>

<template>
  <div class="aftersale-page">
    <div class="page-header">📦 我的售后</div>

    <div style="padding:12px;">
      <van-loading v-if="loading" type="spinner" style="display:flex;justify-content:center;padding:40px;" />

      <div v-if="!loading && tickets.length === 0" class="empty-state">
        <span style="font-size:48px;">📭</span>
        <p>暂无售后工单</p>
      </div>

      <div v-for="ticket in tickets" :key="ticket.id" class="card" @click="goDetail(ticket)" style="cursor:pointer;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div><b>工单 {{ ticket.id }}</b></div>
          <span :class="`tag ${getStatusClass(ticket.status)}`">{{ ticket.status }}</span>
        </div>
        <div style="font-size:13px;color:var(--text-secondary);margin:6px 0;">
          {{ ticket.orderInfo?.productName || '订单商品' }} · {{ ticket.type }} · {{ ticket.createdAt.slice(0, 10) }}
        </div>

        <!-- 自定义步骤条 -->
        <div class="steps-row" v-if="ticket.status !== '已拒绝'">
          <div
            v-for="(label, i) in steps"
            :key="i"
            class="step-item"
            :class="{
              'done': i < getStepIndex(ticket.status),
              'active': i === getStepIndex(ticket.status)
            }"
          >
            <div class="step-dot">{{ i < getStepIndex(ticket.status) ? '✓' : (i + 1) }}</div>
            <div class="step-label">{{ label }}</div>
          </div>
        </div>

        <div v-if="ticket.status === '已拒绝'" style="font-size:12px;color:var(--red);margin-top:4px;">
          拒绝原因: {{ ticket.handleOpinion || '不符合售后条件' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aftersale-page { min-height: 100vh; background: var(--bg-page); }
</style>
