<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderApi } from '@/api'
import type { OrderDetail } from '@/types'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id as string

const order = ref<OrderDetail | null>(null)
const loading = ref(true)

onMounted(async () => {
  try { order.value = await orderApi.detail(orderId) }
  catch { showToast('加载失败') }
  finally { loading.value = false }
})
</script>

<template>
  <div class="detail-page">
    <div class="page-header">
      <span style="cursor:pointer;" @click="router.back()">←</span>
      <span class="header-title">订单详情</span>
      <span></span>
    </div>

    <van-loading v-if="loading" type="spinner" style="display:flex;justify-content:center;padding:40px;" />

    <template v-if="order">
      <div style="padding:12px;">
        <!-- 物流信息 -->
        <div v-if="order.logisticsInfo" class="card">
          <div style="font-size:13px;font-weight:600;margin-bottom:8px;">📦 物流信息</div>
          <div style="font-size:13px;color:var(--text-secondary);">{{ order.logisticsInfo.company }} {{ order.logisticsInfo.trackingNo }}</div>
          <div style="font-size:14px;color:var(--blue);margin-top:4px;" v-if="order.logisticsInfo.traces[0]">
            {{ order.logisticsInfo.traces[0].description }}
          </div>
          <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">
            {{ order.logisticsInfo.traces[0]?.time }}
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="card">
          <div style="display:flex;gap:12px;align-items:center;">
            <div style="width:72px;height:72px;border-radius:8px;background:var(--grey);display:flex;align-items:center;justify-content:center;font-size:28px;">📦</div>
            <div>
              <div style="font-size:14px;font-weight:500;">{{ order.productName }}</div>
              <div style="font-size:12px;color:var(--text-secondary);">{{ order.productSpec }}</div>
              <div style="font-size:15px;font-weight:600;color:var(--red);margin-top:4px;">¥{{ order.totalAmount.toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="card" style="padding:0;">
          <div class="menu-item">订单编号 <span style="color:var(--text-secondary);">{{ order.orderSn }}</span></div>
          <div class="menu-item">下单时间 <span style="color:var(--text-secondary);">{{ order.createdAt }}</span></div>
          <div class="menu-item">订单状态 <span :class="`tag ${order.status === '已完成' ? 'tag-green' : order.status === '售后中' ? 'tag-orange' : 'tag-blue' }`">{{ order.status }}</span></div>
        </div>

        <!-- 操作 -->
        <div style="display:flex;gap:10px;margin-top:16px;">
          <button class="btn btn-outline btn-block" @click="router.push(`/consult?orderId=${orderId}`)">💬 咨询客服</button>
          <button class="btn btn-primary btn-block" @click="router.push(`/aftersale/apply/${orderId}`)">📋 申请售后</button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-page { min-height: 100vh; background: var(--bg-page); }
.menu-item {
  padding: 14px; border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
  font-size: 14px; color: var(--text);
}
.menu-item:last-child { border-bottom: none; }
</style>
