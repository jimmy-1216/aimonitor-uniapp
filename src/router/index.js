import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard',    component: () => import('@/views/employee/Dashboard.vue') },
  { path: '/record/new',   component: () => import('@/views/employee/RecordNew.vue') },
  { path: '/records',      component: () => import('@/views/employee/Records.vue') },
  { path: '/admin',        redirect: '/admin/overview' },
  { path: '/admin/overview', component: () => import('@/views/admin/AdminOverview.vue') },
  { path: '/admin/members',  component: () => import('@/views/admin/AdminMembers.vue') },
  { path: '/admin/trends',   component: () => import('@/views/admin/AdminTrends.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
