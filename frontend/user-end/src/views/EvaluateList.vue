<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { evaluateApi } from '@/api'
import type { Order, Evaluation } from '@/types'
import { showToast } from 'vant'

const router = useRouter()

const pendingOrders = ref<Order[]>([])
const myEvaluations = ref<Evaluation[]>([])
const loading = ref(false)
const activeTab = ref(0)

onMounted(() => loadPending())

async function loadPending() {
  loading.value = true
  try { const res = await evaluateApi.pendingList(); pendingOrders.value = res.list }
  catch { showToast('加载失败') }
  finally { loading.value = false }
}

async function loadMine() {
  loading.value = true
  try { const res = await evaluateApi.myList(); myEvaluations.value = res.list }
  catch { showToast('加载失败') }
  finally { loading.value = false }
}

function onTabChange(index: number) { activeTab.value = index; index === 0 ? loadPending() : loadMine() }
function goEvaluate(order: Order) { router.push(`/evaluate/${order.id}`) }

function getSentimentLabel(s?: string) {
  const map: Record<string, string> = { positive: '好评', neutral: '中评', negative: '差评' }
  return map[s || ''] || '未分析'
}
function getSentimentColor(s?: string) {
  const map: Record<string, string> = { positive: 'var(--green)', neutral: 'var(--orange)', negative: 'var(--red)' }
  return map[s || ''] || 'var(--text-secondary)'
}
</script>

<template>
  <div class="evaluate-page">
    <div class="page-header">⭐ 评价</div>

    <van-tabs v-model:active="activeTab" color="#2979FF" title-active-color="#2979FF" @change="onTabChange">
      <van-tab title="待评价" />
      <van-tab title="已评价" />
    </van-tabs>

    <div style="padding:12px;">
      <van-loading v-if="loading" type="spinner" style="display:flex;justify-content:center;padding:40px;" />

      <!-- 待评价 -->
      <template v-if="activeTab === 0 && !loading">
        <div v-if="pendingOrders.length === 0" class="empty-state">
          <span style="font-size:48px;">🌟</span>
          <p>暂无待评价订单</p>
        </div>
        <div v-for="order in pendingOrders" :key="order.id" class="card" style="cursor:pointer;" @click="goEvaluate(order)">
          <div style="font-size:14px;font-weight:600;margin-bottom:8px;">{{ order.productName }}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:12px;color:var(--text-secondary);">订单号: {{ order.orderSn }}</span>
            <button class="btn btn-primary btn-sm">去评价</button>
          </div>
        </div>
      </template>

      <!-- 已评价 -->
      <template v-if="activeTab === 1 && !loading">
        <div v-if="myEvaluations.length === 0" class="empty-state">
          <span style="font-size:48px;">📝</span>
          <p>还没有评价过</p>
        </div>
        <div v-for="ev in myEvaluations" :key="ev.id" class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div style="font-size:14px;font-weight:500;">{{ ev.orderInfo?.productName || '商品' }}</div>
            <span :style="{ color: getSentimentColor(ev.sentiment), fontSize: '12px', fontWeight: 500 }">
              {{ getSentimentLabel(ev.sentiment) }}
            </span>
          </div>
          <div class="stars-display" style="font-size:20px;">
            {{ '★'.repeat(Math.round((ev.scoreProduct + ev.scoreLogistics + ev.scoreService) / 3)) }}
            <span class="empty">{{ '★'.repeat(5 - Math.round((ev.scoreProduct + ev.scoreLogistics + ev.scoreService) / 3)) }}</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;" v-if="ev.content">{{ ev.content }}</div>
          <div style="font-size:11px;color:var(--border);margin-top:4px;">{{ ev.createdAt }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.evaluate-page { min-height: 100vh; background: var(--bg-page); }
</style>
