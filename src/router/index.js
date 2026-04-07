import { createRouter, createWebHashHistory } from 'vue-router'
import OwnedListPage from '@/pages/OwnedListPage.vue'
import TransportModelAdminPage from '@/pages/TransportModelAdminPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import SignupPage from '@/pages/SignupPage.vue'
import PendingUsersPage from '@/pages/PendingUsersPage.vue'

const routes = [
  { 
    path: '/', 
    component: OwnedListPage,
    meta: { requiresAuth: true }  //토큰 없으면 접근 차단
  },
  { 
    path: '/owned', 
    component: OwnedListPage,
    meta: { requiresAuth: true }  //토큰 없으면 접근 차단
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/signup',
    component: SignupPage
  },
  { path: '/transport-models', 
    component: TransportModelAdminPage,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  { 
    path: '/admin/pending-users',
    component: PendingUsersPage,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken') //현재 로그인 상태 판단 기준

  if (to.meta.requiresAuth && !token) { //이동하려는 페이지가 requiresAuth인지 확인
    next('/login')  //토큰 없으면 강제로 /login 이동
    return
  }

  const userRole = localStorage.getItem('userRole')

  if (to.meta.requiresAdmin && userRole !== 'ADMIN') {
    next('/')
    return
  }

  next()
})

export default router