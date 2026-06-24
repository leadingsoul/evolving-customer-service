<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 5个底部导航 - 对齐原型
const tabRoutes = ['/home', '/consult', '/aftersale/list', '/evaluate', '/profile']
const tabMap: Record<string, string> = {
  '/home': 'home',
  '/consult': 'consult',
  '/aftersale/list': 'aftersale',
  '/evaluate': 'evaluate',
  '/profile': 'profile',
}

const showTabbar = computed(() => tabRoutes.includes(route.path))
const active = ref(tabMap[route.path] || 'home')

watch(() => route.path, (path) => {
  if (tabMap[path]) active.value = tabMap[path]
})

function onTabChange(name: string | number) {
  const pathMap: Record<string, string> = {
    'home': '/home',
    'consult': '/consult',
    'aftersale': '/aftersale/list',
    'evaluate': '/evaluate',
    'profile': '/profile',
  }
  const nameStr = String(name)
  if (pathMap[nameStr]) router.push(pathMap[nameStr])
}
</script>

<template>
  <div :class="{ 'page-with-tabbar': showTabbar }">
    <router-view v-slot="{ Component: C }">
      <keep-alive include="Home,Consult,AftersaleList,EvaluateList,Profile">
        <component :is="C" />
      </keep-alive>
    </router-view>
  </div>

  <!-- 底部5Tab导航 - 复用原型emoji风格 -->
  <van-tabbar
    v-if="showTabbar"
    v-model="active"
    :fixed="true"
    :border="true"
    :safe-area-inset-bottom="true"
    active-color="#2979FF"
    inactive-color="#757575"
    @change="onTabChange"
  >
    <van-tabbar-item name="home"     icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item name="consult"  icon="chat-o">咨询</van-tabbar-item>
    <van-tabbar-item name="aftersale" icon="records-o">售后</van-tabbar-item>
    <van-tabbar-item name="evaluate" icon="star-o">评价</van-tabbar-item>
    <van-tabbar-item name="profile"  icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>
