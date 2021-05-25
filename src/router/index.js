import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/Login'
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/Menu',
    name: 'Menu',
    component: () => import('../views/Menu.vue')
  }
]

const router = createRouter({ history: createWebHistory(process.env.BASE_URL), routes })

export default router
