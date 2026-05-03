<template>
  <div class="h-screen bg-neutral-700 overflow-hidden flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 h-14 bg-gradient-to-b from-neutral-900 to-neutral-800 shadow border-b border-neutral-700">
      <div class="h-full px-6 flex items-center font-[Pretendard]">
        <!-- left -->
        <div
          class="text-white text-2xl tracking-wide cursor-pointer hover:opacity-80 transition shrink-0"
          style="font-family: 'Caveat', cursive;"
          @click="goHome"
        >
          Schni GTA
        </div>

        <!-- center -->
        <div v-if="isLoggedIn" class="ml-24 flex items-center gap-2">
          <button
            type="button"
            :class="getMenuButtonClass(isActiveGarageMenu)"
            @click="goHome"
          >
            <Warehouse class="w-4 h-4" />
            <span>차고</span>
          </button>

          <button
            v-if="isAdmin"
            type="button"
            :class="getMenuButtonClass(isActiveMenu('/transport-models'))"
            @click="goTransportModels"
          >
            <Car class="w-4 h-4" />
            <span>이동수단</span>
          </button>

          <button
            v-if="isAdmin"
            type="button"
            :class="getMenuButtonClass(isActiveMenu('/admin/pending-users'))"
            @click="goPendingUsers"
          >
            <UserCheck class="w-4 h-4" />
            <span>회원승인</span>
          </button>
        </div>

        <!-- right -->
        <div v-if="isLoggedIn" class="ml-auto flex items-center gap-3 text-neutral-200 text-base">
          <!-- 사용자 표시 -->
          <div class="flex items-center gap-1 font-medium">
            <template v-if="isAdmin">
              <span class="text-yellow-400 font-semibold">관리자</span>
            </template>

            <template v-else>
              <span class="opacity-80">{{ nickname }}</span>
              <span class="text-neutral-400">님</span>
            </template>
          </div>

          <!-- 로그아웃 -->
          <button
            type="button"
            class="h-9 px-3 flex items-center gap-1.5 rounded-md
                  bg-transparent text-neutral-100 text-base
                  font-medium tracking-wide
                  hover:bg-white/15
                  transition"
            @click="logout"
          >
            <LogOut class="w-4 h-4" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Page -->
    <main class="w-full px-6 py-6 flex-1 min-h-0 overflow-hidden">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Car, LogOut, UserCheck, Warehouse } from 'lucide-vue-next'

const AUTH_STORAGE_KEYS = [
  'accessToken',
  'loginId',
  'userId',
  'userRole',
  'nickname'
]

const MENU_BASE_CLASS = 'h-9 px-3 flex items-center gap-1.5 rounded-md text-base font-medium tracking-wide transition'
const MENU_ACTIVE_CLASS = 'bg-neutral-200 text-neutral-900 shadow-sm'
const MENU_INACTIVE_CLASS = 'bg-transparent text-neutral-100 hover:bg-white/15'

const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(false)
const userRole = ref('')
const nickname = ref('')

// 관리자 여부
const isAdmin = computed(() => {
  return userRole.value === 'ADMIN'
})

// 차고 메뉴 활성 여부
const isActiveGarageMenu = computed(() => {
  return isActiveMenu('/') || isActiveMenu('/owned')
})

// 로그인 상태 갱신
function updateAuthState()
{
  isLoggedIn.value = !!localStorage.getItem('accessToken')
  userRole.value = localStorage.getItem('userRole') ?? ''
  nickname.value = localStorage.getItem('nickname') ?? ''
}

// 메뉴 버튼 클래스 생성
function getMenuButtonClass(isActive)
{
  return [
    MENU_BASE_CLASS,
    isActive ? MENU_ACTIVE_CLASS : MENU_INACTIVE_CLASS
  ]
}

// 홈 화면으로 이동
function goHome()
{
  router.push('/')
}

// 이동수단 관리 화면으로 이동
function goTransportModels()
{
  router.push('/transport-models')
}

// 회원승인 화면으로 이동
function goPendingUsers()
{
  router.push('/admin/pending-users')
}

// 현재 메뉴 활성 여부 확인
function isActiveMenu(path)
{
  return route.path === path
}

// 로그아웃 처리
function logout()
{
  AUTH_STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key)
  })

  window.dispatchEvent(new Event('auth-changed'))

  router.push('/login')
}

// 인증 상태 변경 이벤트 등록
onMounted(() => {
  updateAuthState()
  window.addEventListener('auth-changed', updateAuthState)
})

// 인증 상태 변경 이벤트 제거
onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', updateAuthState)
})
</script>