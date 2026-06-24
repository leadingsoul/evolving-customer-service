<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { evaluateApi } from '@/api'
import { showToast, showLoadingToast, closeToast } from 'vant'

const route = useRoute()
const router = useRouter()
const orderId = route.params.orderId as string

const scoreProduct = ref(5)
const scoreLogistics = ref(4)
const scoreService = ref(5)
const content = ref('')
const isAnonymous = ref(false)
const imageFiles = ref<any[]>([])

const dimensions = [
  { label: '商品质量', ref: scoreProduct },
  { label: '物流速度', ref: scoreLogistics },
  { label: '客服态度', ref: scoreService },
]

async function handleSubmit() {
  showLoadingToast({ message: '提交中...', forbidClick: true })
  try {
    await evaluateApi.submit({
      orderId,
      scoreProduct: scoreProduct.value, scoreLogistics: scoreLogistics.value, scoreService: scoreService.value,
      content: content.value, imageUrls: [], isAnonymous: isAnonymous.value,
    })
    closeToast()
    showToast('评价提交成功！感谢您的反馈 ❤️')
    router.replace('/evaluate')
  } catch { closeToast() }
}

function renderStars(score: number) {
  return '★'.repeat(score) + '☆'.repeat(5 - score)
}
</script>

<template>
  <div class="submit-page">
    <div class="page-header">
      <span style="cursor:pointer;" @click="router.back()">←</span>
      <span class="header-title">⭐ 评价</span>
      <span></span>
    </div>

    <div style="padding:12px;">
      <div class="card">
        <div style="font-size:14px;font-weight:600;margin-bottom:16px;color:var(--text);">订单号: {{ orderId }}</div>

        <div class="form-group" v-for="dim in dimensions" :key="dim.label">
          <label class="form-label">{{ dim.label }}</label>
          <div class="stars-display">
            <span v-for="s in 5" :key="s" :style="{ cursor: 'pointer', color: s <= dim.ref.value ? '#FFB300' : '#E0E0E0' }"
              @click="dim.ref.value = s">
              {{ s <= dim.ref.value ? '★' : '☆' }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">评价内容</label>
          <textarea v-model="content" class="form-textarea" placeholder="分享您的使用体验..." maxlength="300"></textarea>
        </div>

        <div class="form-group">
          <div class="upload-zone" @click="showToast('选择图片中...')">📷 上传实拍图片</div>
          <van-uploader v-model="imageFiles" :max-count="9" :max-size="5 * 1024 * 1024" accept="image/*" multiple style="margin-top:8px;" />
        </div>

        <div class="form-group" style="display:flex;align-items:center;gap:8px;font-size:13px;">
          <van-checkbox v-model="isAnonymous" shape="square" icon-size="16px">匿名发布评价</van-checkbox>
        </div>

        <button class="btn btn-primary btn-block" @click="handleSubmit">发布评价</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.submit-page { min-height: 100vh; background: var(--bg-page); }
</style>
