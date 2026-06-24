<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { userApi } from '@/api'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const nickname = ref('')
const submitting = ref(false)

onMounted(() => {
  if (userStore.userInfo) nickname.value = userStore.userInfo.nickname
})

async function handleSave() {
  if (!nickname.value.trim()) { showToast('请输入昵称'); return }
  submitting.value = true
  try {
    const updated = await userApi.updateProfile({ nickname: nickname.value })
    userStore.setUserInfo(updated)
    showToast('保存成功')
    router.back()
  } catch { /* */ }
  finally { submitting.value = false }
}
</script>

<template>
  <div class="edit-page">
    <div class="page-header">
      <span style="cursor:pointer;" @click="router.back()">←</span>
      <span class="header-title">编辑资料</span>
      <span style="font-size:14px;cursor:pointer;color:#fff;" @click="handleSave">保存</span>
    </div>

    <div style="padding:12px;">
      <div class="card" style="text-align:center;">
        <div style="font-size:12px;color:var(--text-secondary);margin-bottom:10px;">头像</div>
        <div @click="showToast('更换头像')" style="cursor:pointer;">
          <div style="width:72px;height:72px;border-radius:50%;background:var(--blue-light);display:inline-flex;align-items:center;justify-content:center;font-size:36px;">😊</div>
        </div>
      </div>

      <div class="card" style="padding:0;">
        <div class="menu-item" style="border-bottom:1px solid var(--border);">
          昵称
          <input v-model="nickname" type="text" placeholder="请输入昵称" maxlength="16" style="border:none;text-align:right;font-size:14px;color:var(--text-secondary);outline:none;background:transparent;" />
        </div>
        <div class="menu-item">
          手机号
          <span style="color:var(--text-secondary);">{{ userStore.userInfo?.phone || '未绑定' }}</span>
        </div>
      </div>

      <div class="card" style="padding:0;margin-top:10px;">
        <div class="menu-item">淘宝账号 <span style="color:var(--green);">已关联</span></div>
        <div class="menu-item">京东账号 <span style="color:var(--text-secondary);">未关联</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-page { min-height: 100vh; background: var(--bg-page); }
.menu-item {
  padding: 14px; display: flex; justify-content: space-between; align-items: center;
  font-size: 14px; color: var(--text);
}
.menu-item:last-child { border-bottom: none; }
</style>
