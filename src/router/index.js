import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/Login'
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/Menu',
    name: 'Menu',
    component: () => import('@/views/Menu.vue')
  },
  {
    path: '/Menu',
    name: 'Menu',
    component: () => import('@/views/Menu.vue')
  },
  {
    path: '/Administrator/:tableName',
    name: 'AdministratorView',
    component: () => import('@/views/Administrator.vue')
  },
  {
    path: '/Teacher',
    name: 'TeacherView',
    component: () => import('@/views/Teacher.vue')
  },
  {
    path: '/Student',
    name: 'StudentView',
    component: () => import('@/views/Student.vue')
  }
]

const router = createRouter({
  history: process.env.NODE_ENV === 'production' ? createWebHashHistory() : createWebHistory(),
  routes
})

export default router
