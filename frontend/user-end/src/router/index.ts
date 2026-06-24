import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('@/views/OrderDetail.vue'),
  },
  {
    path: '/consult',
    name: 'Consult',
    component: () => import('@/views/Consult.vue'),
  },
  {
    path: '/aftersale/apply/:orderId',
    name: 'AftersaleApply',
    component: () => import('@/views/AftersaleApply.vue'),
  },
  {
    path: '/aftersale/list',
    name: 'AftersaleList',
    component: () => import('@/views/AftersaleList.vue'),
  },
  {
    path: '/aftersale/:id',
    name: 'AftersaleDetail',
    component: () => import('@/views/AftersaleDetail.vue'),
  },
  {
    path: '/evaluate',
    name: 'EvaluateList',
    component: () => import('@/views/EvaluateList.vue'),
  },
  {
    path: '/evaluate/:orderId',
    name: 'EvaluateSubmit',
    component: () => import('@/views/EvaluateSubmit.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: () => import('@/views/ProfileEdit.vue'),
  },
  {
    path: '/notice',
    name: 'NoticeList',
    component: () => import('@/views/NoticeList.vue'),
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('@/views/Feedback.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
