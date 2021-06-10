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
    path: '/Administrator/Modify/:tableName',
    name: 'AdministratorModify',
    component: () => import('@/views/Administrator/Modify.vue')
  },
  {
    path: '/Teacher/Modify',
    name: 'TeacherModify',
    component: () => import('@/views/Teacher/Modify.vue')
  },
  {
    path: '/Student/Query',
    name: 'StudentQuery',
    component: () => import('@/views/Student/Query.vue')
  }
]

const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes
})

export default router
