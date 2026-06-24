<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { userApi, noticeApi } from '@/api'
import { showConfirmDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const unreadCount = ref(0)
const pendingAftersale = ref(0)
const pendingEval = ref(0)

onMounted(async () => {
  if (!userStore.isLoggedIn) { router.replace('/login'); return }
  try { const res = await noticeApi.unreadCount(); unreadCount.value = res.count } catch { /* */ }
  try {
    const p = await userApi.getProfile()
    userStore.setUserInfo(p)
  } catch { /* */ }
})

async function handleLogout() {
  try {
    await showConfirmDialog({ title: '退出登录', message: '确定要退出登录吗？', confirmButtonColor: '#FF1744' })
    userStore.logout()
    router.replace('/login')
  } catch { /* */ }
}
</script>

<template>
  <div class="profile-page">
    <div class="page-header">👤 个人中心</div>

    <div style="padding:12px;">
      <!-- 用户卡片 -->
      <div class="card" style="display:flex;align-items:center;gap:14px;">
        <div style="width:56px;height:56px;border-radius:50%;background:var(--blue-light);display:flex;align-items:center;justify-content:center;font-size:28px;">😊</div>
        <div>
          <div style="font-weight:600;font-size:16px;">{{ userStore.userInfo?.nickname || '用户' }}</div>
          <div style="font-size:12px;color:var(--text-secondary);">{{ userStore.userInfo?.phone || '未绑定手机号' }}</div>
        </div>
      </div>

      <!-- 功能菜单 -->
      <div class="card" style="padding:0;">
        <div class="menu-item" @click="router.push('/home')">
          📦 我的订单 <span>›</span>
        </div>
        <div class="menu-item" @click="router.push('/aftersale/list')">
          📋 我的售后 <span style="color:var(--orange);margin-right:6px;">{{ pendingAftersale ? pendingAftersale + '笔进行中' : '' }}</span> <span>›</span>
        </div>
        <div class="menu-item" @click="router.push('/evaluate')">
          ⭐ 我的评价 <span style="color:var(--blue);margin-right:6px;">{{ pendingEval ? pendingEval + '笔待评价' : '' }}</span> <span>›</span>
        </div>
        <div class="menu-item" @click="router.push('/notice')">
          🔔 消息通知
          <span style="background:var(--red);color:#fff;padding:2px 7px;border-radius:10px;font-size:11px;margin-right:6px;" v-if="unreadCount">{{ unreadCount }}</span>
          <span>›</span>
        </div>
      </div>

      <div class="card" style="padding:0;">
        <div class="menu-item" @click="router.push('/profile/edit')">
          📱 绑定手机号 <span style="color:var(--green);margin-right:6px;">{{ userStore.userInfo?.phone ? '已绑定' : '未绑定' }}</span> <span>›</span>
        </div>
        <div class="menu-item" @click="router.push('/feedback')">
          💬 意见反馈 <span>›</span>
        </div>
      </div>

      <button class="btn btn-outline btn-block" style="margin-top:16px;color:var(--red);border-color:var(--red);" @click="handleLogout">
        退出登录
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-page { min-height: 100vh; background: var(--bg-page); }

.menu-item {
  padding: 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  color: var(--text);
}

.menu-item:last-child { border-bottom: none; }

.menu-item:active { background: var(--grey); }
</style>
