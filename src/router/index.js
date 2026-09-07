import { createRouter, createWebHashHistory } from 'vue-router'
import OwnedListPage from '@/pages/OwnedListPage.vue'
import TransportModelAdminPage from '@/pages/TransportModelAdminPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import OwnedTransportDetailPage from '@/pages/OwnedTransportDetailPage.vue'
import RankingPage from '@/pages/RankingPage.vue'

/**
 * 화면별 라우팅 설정
 *
 * requiresAuth  : 로그인한 사용자만 접근 가능
 * requiresAdmin : ADMIN 권한 사용자만 접근 가능
 */
const routes = [
  {
    path: '/',
    component: OwnedListPage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/owned', 
    component: OwnedListPage,
    meta: { requiresAuth: true }  //토큰 없으면 접근 차단
  },
  {
    path: '/ranking',
    component: RankingPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/owned/:ownedId',
    component: OwnedTransportDetailPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: LoginPage
  },
  { path: '/transport-models', 
    component: TransportModelAdminPage,
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

/** 화면 이동 전 로그인 및 관리자 권한 확인 */
router.beforeEach((to, from, next) => {
  //현재 로그인 상태 판단 기준
  const token = localStorage.getItem('accessToken') 

  // 로그인이 필요한 화면에 비로그인 상태로 접근할 경우 로그인 화면으로 이동
  if (to.meta.requiresAuth && !token) { 
    next('/login')
    return
  }
  
  // 로그인한 상태에서 로그인 화면으로 접근하는 것을 방지
  if ((to.path === '/login') && token) {
    next('/')
    return
  }

  // 관리자 권한이 필요한 화면 접근 여부 확인
  const userRole = localStorage.getItem('userRole')
  
  if (to.meta.requiresAdmin && userRole !== 'ADMIN') {
    next('/')
    return
  }

  next()
})

export default router