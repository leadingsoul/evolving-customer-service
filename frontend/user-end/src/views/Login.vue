<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { authApi } from '@/api'
import { showToast, showLoadingToast, closeToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const showPhoneBind = ref(false)
const phone = ref('')

async function handleLogin() {
  showLoadingToast({ message: '授权登录中...', forbidClick: true })
  try {
    const result = await authApi.wechatLogin('mock_wx_code')
    userStore.setToken(result.token)
    userStore.setUserInfo(result.userInfo)
    closeToast()
    showToast('登录成功')
    router.replace('/home')
  } catch {
    closeToast()
    showToast('授权失败，请重试')
  }
}

async function handleBindPhone() {
  if (!phone.value) { showToast('请输入手机号'); return }
  if (!/^1[3-9]\d{9}$/.test(phone.value)) { showToast('手机号格式不正确'); return }
  showLoadingToast({ message: '绑定中...', forbidClick: true })
  try {
    await authApi.bindPhone(phone.value)
    closeToast()
    showToast('绑定成功')
    showPhoneBind.value = false
  } catch { closeToast() }
}
</script>

<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-logo">🛒</div>
      <div class="login-title">电商售后助手</div>
      <div class="login-desc">智能售后 · 一键咨询 · 极速维权</div>
      <button class="wechat-btn" @click="handleLogin">
        <span style="font-size:20px;">💬</span> 微信一键登录
      </button>
      <div class="login-agreement">
        登录即表示同意 <a href="javascript:;">《用户协议》</a>和<a href="javascript:;">《隐私政策》</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  gap: 20px;
  width: 100%;
}

.login-logo { font-size: 48px; }
.login-title { font-size: 20px; font-weight: 700; color: var(--text); }
.login-desc { font-size: 13px; color: var(--text-secondary); text-align: center; }

.wechat-btn {
  background: #07C160;
  color: #fff;
  border: none;
  padding: 14px 60px;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity .2s;
  width: 100%;
  justify-content: center;
  max-width: 300px;
}

.wechat-btn:active { opacity: .85; }

.login-agreement {
  font-size: 11px;
  color: var(--text-secondary);
  text-align: center;
}

.login-agreement a { color: var(--blue); text-decoration: none; }
</style>
