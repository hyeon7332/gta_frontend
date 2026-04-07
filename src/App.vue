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
            :class="[
              'h-9 px-3 flex items-center gap-1.5 rounded-md text-base font-medium tracking-wide transition',
              isActiveMenu('/') || isActiveMenu('/owned')
                ? 'bg-neutral-200 text-neutral-900 shadow-sm'
                : 'bg-transparent text-neutral-100 hover:bg-white/15'
            ]"
            @click="goHome"
          >
            <Warehouse class="w-4 h-4" />
            <span>차고</span>
          </button>

          <button
            v-if="userRole === 'ADMIN'"
            type="button"
            :class="[
              'h-9 px-3 flex items-center gap-1.5 rounded-md text-base font-medium tracking-wide transition',
              isActiveMenu('/transport-models')
                ? 'bg-neutral-200 text-neutral-900 shadow-sm'
                : 'bg-transparent text-neutral-100 hover:bg-white/15'
            ]"
            @click="goTransportModels"
          >
            <Car class="w-4 h-4" />
            <span>이동수단</span>
          </button>

          <button
            v-if="userRole === 'ADMIN'"
            type="button"
            :class="[
              'h-9 px-3 flex items-center gap-1.5 rounded-md text-base font-medium tracking-wide transition',
              isActiveMenu('/admin/pending-users')
                ? 'bg-neutral-200 text-neutral-900 shadow-sm'
                : 'bg-transparent text-neutral-100 hover:bg-white/15'
            ]"
            @click="goPendingUsers"
          >
            <UserCheck class="w-4 h-4" />
            <span>회원승인</span>
          </button>
        </div>

        <!-- right -->
        <div v-if="isLoggedIn" class="ml-auto flex items-center">
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
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Warehouse, Car, UserCheck, LogOut } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(!!localStorage.getItem('accessToken'))
const userRole = ref(localStorage.getItem('userRole'))

function updateAuthState()
{
  isLoggedIn.value = !!localStorage.getItem('accessToken')
  userRole.value = localStorage.getItem('userRole')
}

function goHome()
{
  router.push('/')
}

function goTransportModels()
{
  router.push('/transport-models')
}

function goPendingUsers()
{
  router.push('/admin/pending-users')
}

function isActiveMenu(path)
{
  return route.path === path
}

function logout()
{
  localStorage.removeItem('accessToken')
  localStorage.removeItem('loginId')
  localStorage.removeItem('userId')
  localStorage.removeItem('userRole')

  window.dispatchEvent(new Event('auth-changed'))

  router.push('/login')
}

onMounted(() => {
  window.addEventListener('auth-changed', updateAuthState)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', updateAuthState)
})
</script>