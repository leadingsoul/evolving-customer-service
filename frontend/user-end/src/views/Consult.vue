<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { chatApi, orderApi } from '@/api'
import type { ChatMessage, Order } from '@/types'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const orderId = route.query.orderId as string

const order = ref<Order | null>(null)
const messages = ref<ChatMessage[]>([])
const inputText = ref('')
const sending = ref(false)
const chatBody = ref<HTMLElement>()

onMounted(async () => {
  if (orderId) {
    try { order.value = await orderApi.detail(orderId) } catch { /* ignore */ }
  }
  // 初始AI问候
  const productName = order.value?.productName || ''
  messages.value.push({
    id: 0, sessionId: '', role: 'ai',
    content: `您好！我是您的专属售后助手 🤖${productName ? `\n检测到您选择的是「${productName}」，请问有什么可以帮您？` : '\n请问有什么可以帮您？'}`,
    sentAt: new Date().toLocaleString(),
  })
})

function scrollToBottom() {
  setTimeout(() => {
    if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight
  }, 100)
}

async function handleSend() {
  const content = inputText.value.trim()
  if (!content || sending.value) return

  messages.value.push({ id: Date.now(), sessionId: '', role: 'user', content, sentAt: '' })
  inputText.value = ''
  scrollToBottom()

  sending.value = true
  try {
    const res = await chatApi.sendMessage('auto_' + Date.now(), content)
    const reply = res.reply || '抱歉，我暂时无法回答这个问题，正在为您转接人工客服...'
    messages.value.push({ id: Date.now() + 1, sessionId: '', role: 'ai', content: reply, sentAt: '' })
  } catch {
    messages.value.push({ id: Date.now() + 1, sessionId: '', role: 'ai', content: '网络异常，请稍后重试', sentAt: '' })
  } finally {
    sending.value = false
    scrollToBottom()
  }
}

function handleTransfer() {
  messages.value.push({ id: Date.now(), sessionId: '', role: 'ai',
    content: '正在为您转接人工客服，请稍候...⏳', sentAt: '' })
  scrollToBottom()
}
</script>

<template>
  <div class="consult-page">
    <!-- 蓝色Header -->
    <div class="page-header">
      <span style="cursor:pointer;" @click="router.back()">←</span>
      <span class="header-title">
        智能咨询{{ order ? ' · ' + order.productName.slice(0, 8) + '...' : '' }}
      </span>
      <span></span>
    </div>

    <!-- 聊天区 -->
    <div ref="chatBody" class="chat-body">
      <div v-for="msg in messages" :key="msg.id"
        :class="['chat-bubble', msg.role === 'user' ? 'user' : 'ai']">
        {{ msg.content }}
      </div>
    </div>

    <!-- 转人工 -->
    <div class="transfer-bar">
      <button class="btn btn-outline btn-sm" @click="handleTransfer">🔄 转人工客服</button>
    </div>

    <!-- 输入框 -->
    <div class="chat-input-bar">
      <input
        v-model="inputText"
        type="text"
        placeholder="输入您的问题..."
        :disabled="sending"
        @keypress.enter="handleSend"
      />
      <button class="btn btn-primary btn-sm" :disabled="sending" @click="handleSend">发送</button>
    </div>
  </div>
</template>

<style scoped>
.consult-page {
  display: flex; flex-direction: column; height: 100vh; background: var(--bg-page);
}

.chat-body {
  flex: 1; overflow-y: auto; padding: 12px;
  display: flex; flex-direction: column;
}

.transfer-bar {
  text-align: center; padding: 4px 0 8px;
}

.chat-input-bar {
  display: flex; gap: 8px; padding: 8px 12px;
  border-top: 1px solid var(--border); background: #fff;
  align-items: center;
}

.chat-input-bar input {
  flex: 1; border: 1px solid var(--border); border-radius: 20px;
  padding: 10px 14px; font-size: 14px; outline: none; background: #fff;
}

.chat-input-bar input:focus { border-color: var(--blue); }
</style>
