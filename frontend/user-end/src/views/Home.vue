<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { orderApi } from '@/api'
import type { Order } from '@/types'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const orders = ref<Order[]>([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)
const refreshing = ref(false)

// 商品图标映射
const icons = ['👟','📱','🎧','👕','⌚','📦','💄','👜','🍵','🎮']

onMounted(() => {
  if (!userStore.isLoggedIn) { router.replace('/login'); return }
  loadOrders()
})

async function loadOrders() {
  if (loading.value || finished.value) return
  loading.value = true
  try {
    const res = await orderApi.list(undefined, page.value, 10)
    if (refreshing.value) { orders.value = res.list; refreshing.value = false }
    else { orders.value.push(...res.list) }
    page.value++
    if (orders.value.length >= res.total) finished.value = true
  } catch { showToast('加载失败') }
  finally { loading.value = false }
}

function onRefresh() { refreshing.value = true; page.value = 1; finished.value = false; loadOrders() }
function goConsult(order: Order) { router.push(`/consult?orderId=${order.id}`) }
function goAftersale(order: Order) { router.push(`/aftersale/apply/${order.id}`) }

function getTagClass(status: string) {
  const map: Record<string, string> = {
    '已完成': 'tag-green', '进行中': 'tag-blue', '售后中': 'tag-orange', '已取消': 'tag-grey',
  }
  return map[status] || 'tag-grey'
}

function getIcon(index: number) { return icons[index % icons.length] }
</script>

<template>
  <div class="home-page">
    <!-- 蓝色Header -->
    <div class="page-header">🏠 我的订单</div>

    <!-- 订单列表 -->
    <div style="padding:12px;">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" finished-text="— 没有更多了 —" @load="loadOrders">
          <div class="order-card card" v-for="(order, i) in orders" :key="order.id">
            <div class="order-top" @click="goConsult(order)">
              <div class="order-icon">{{ getIcon(i) }}</div>
              <div class="order-info">
                <div class="order-title text-ellipsis">{{ order.productName }}</div>
                <div class="order-price">¥{{ order.totalAmount.toFixed(2) }}</div>
                <div class="order-meta">
                  订单号: {{ order.orderSn }} · <span :class="`tag ${getTagClass(order.status)}`">{{ order.status }}</span>
                </div>
              </div>
            </div>
            <div class="order-actions" v-if="order.status === '已完成'">
              <button class="btn btn-primary btn-sm" @click="goAftersale(order)">申请售后</button>
              <button class="btn btn-outline btn-sm" @click="goConsult(order)">咨询客服</button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <div v-if="!loading && orders.length === 0" class="empty-state">
      <span style="font-size:48px;">📭</span>
      <p>暂无订单</p>
    </div>
  </div>
</template>

<style scoped>
.home-page { min-height: 100vh; background: var(--bg-page); }

.order-card .order-top { display: flex; gap: 12px; align-items: center; cursor: pointer; }

.order-icon {
  width: 72px; height: 72px; border-radius: 8px; background: var(--grey);
  display: flex; align-items: center; justify-content: center; font-size: 28px;
  flex-shrink: 0;
}

.order-info { flex: 1; min-width: 0; }
.order-title { font-size: 14px; font-weight: 500; margin-bottom: 4px; color: var(--text); }
.order-price { color: var(--red); font-weight: 600; font-size: 15px; margin-bottom: 2px; }
.order-meta { font-size: 12px; color: var(--text-secondary); }

.order-actions {
  display: flex; justify-content: flex-end; gap: 8px;
  padding-top: 10px; margin-top: 10px; border-top: 1px solid var(--border);
}
</style>
