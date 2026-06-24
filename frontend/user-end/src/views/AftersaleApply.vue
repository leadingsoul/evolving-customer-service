<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { aftersaleApi } from '@/api'
import { showToast, showLoadingToast, closeToast } from 'vant'

const route = useRoute()
const router = useRouter()
const orderId = route.params.orderId as string

const aftersaleType = ref('换货')
const reason = ref('')
const description = ref('')
const evidenceFiles = ref<any[]>([])

const typeOptions = ['仅退款', '退货退款', '换货', '维修']
const reasonOptions: Record<string, string[]> = {
  '仅退款': ['未收到货', '描述不符', '质量问题', '其他'],
  '退货退款': ['质量问题', '发错货', '七天无理由', '描述不符', '其他'],
  '换货': ['尺码不合适', '质量问题', '发错货', '描述不符', '其他'],
  '维修': ['质量问题', '意外损坏', '其他'],
}

const currentReasons = computed(() => reasonOptions[aftersaleType.value] || [])

async function handleSubmit() {
  if (!reason.value) { showToast('请选择售后原因'); return }
  showLoadingToast({ message: '提交中...', forbidClick: true })
  try {
    const urls = evidenceFiles.value.map(f => f.url || f.content)
    const res = await aftersaleApi.apply({
      orderId, type: aftersaleType.value, reason: reason.value,
      description: description.value, imageUrls: urls,
    })
    closeToast()
    showToast('售后申请已提交！')
    router.replace(`/aftersale/${res.ticketId}`)
  } catch { closeToast() }
}
</script>

<template>
  <div class="apply-page">
    <div class="page-header">
      <span style="cursor:pointer;" @click="router.back()">←</span>
      <span class="header-title">📋 售后申请</span>
      <span></span>
    </div>

    <div style="padding:12px;">
      <!-- 关联订单 -->
      <div class="card">
        <div style="font-size:13px;font-weight:600;margin-bottom:10px;">关联订单</div>
        <div style="background:#F9F9F9;border-radius:8px;padding:10px;display:flex;gap:10px;align-items:center;">
          <div style="width:50px;height:50px;border-radius:8px;background:var(--grey);display:flex;align-items:center;justify-content:center;font-size:20px;">📦</div>
          <div style="font-size:13px;color:var(--text-secondary);">订单号: {{ orderId }}</div>
        </div>
      </div>

      <!-- 表单 -->
      <div class="card">
        <div class="form-group">
          <label class="form-label">售后类型</label>
          <select v-model="aftersaleType" class="form-select" @change="reason = ''">
            <option v-for="t in typeOptions" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">售后原因</label>
          <select v-model="reason" class="form-select">
            <option value="">请选择</option>
            <option v-for="r in currentReasons" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">问题描述</label>
          <textarea v-model="description" class="form-textarea" placeholder="请详细描述您遇到的问题..." maxlength="500"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">上传凭证</label>
          <div class="upload-zone" @click="showToast('选择图片中...')">
            📷 点击上传商品照片（最多9张）
          </div>
          <van-uploader
            v-model="evidenceFiles"
            :max-count="9"
            :max-size="5 * 1024 * 1024"
            accept="image/*"
            multiple
            style="margin-top:8px;"
          />
        </div>

        <button class="btn btn-primary btn-block" @click="handleSubmit">提交申请</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.apply-page { min-height: 100vh; background: var(--bg-page); }
.form-select, .form-textarea { background: #fff; }
</style>
