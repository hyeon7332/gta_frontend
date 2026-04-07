<!-- src/pages/LoginPage.vue -->
<template>
  <div class="h-full bg-neutral-700">
    <div class="w-full max-w-none px-4 pt-2 pb-4 h-full">
      <div class="h-full flex items-center justify-center">
        <div class="w-full max-w-md bg-neutral-900/40 border border-neutral-700 rounded-lg shadow-lg overflow-hidden">
          <!-- header -->
          <div class="px-5 py-4 border-b border-neutral-700 bg-neutral-900/30">
            <h1 class="text-lg font-semibold text-neutral-100">
              로그인
            </h1>
            <p class="mt-1 text-sm text-neutral-400">
              Schni GTA 서비스를 이용하려면 로그인해 주세요.
            </p>
          </div>

          <!-- body -->
          <form class="p-5 space-y-4" @submit.prevent="handleLogin">
            <div>
              <label class="block mb-2 text-[13px] text-neutral-300">
                아이디
              </label>
              <input
                v-model="loginId"
                type="text"
                placeholder="아이디 입력"
                class="w-full h-10 px-3 rounded-md
                       bg-neutral-800/60 border border-neutral-600
                       text-sm text-neutral-100 placeholder-neutral-400
                       outline-none focus:border-neutral-400"
                :disabled="loading"
                @keyup.enter="handleLogin"
              />
            </div>

            <div>
              <label class="block mb-2 text-[13px] text-neutral-300">
                비밀번호
              </label>
              <input
                v-model="password"
                type="password"
                placeholder="비밀번호 입력"
                class="w-full h-10 px-3 rounded-md
                       bg-neutral-800/60 border border-neutral-600
                       text-sm text-neutral-100 placeholder-neutral-400
                       outline-none focus:border-neutral-400"
                :disabled="loading"
                @keyup.enter="handleLogin"
              />
            </div>

            <div
              v-if="errorMessage"
              class="px-3 py-2 rounded-md border border-red-800 bg-red-950/30 text-sm text-red-300"
            >
              {{ errorMessage }}
            </div>

            <div class="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                class="h-9 px-4 rounded-md border border-neutral-600
                       bg-neutral-800/60 text-sm text-neutral-200
                       hover:bg-neutral-700 active:bg-neutral-600 transition"
                :disabled="loading"
                @click="goSignup"
              >
                회원가입
              </button>

              <button
                type="submit"
                class="h-9 px-4 rounded-md border border-neutral-600
                       bg-neutral-200 text-sm font-medium text-neutral-900
                       hover:bg-white active:bg-neutral-300 transition
                       disabled:opacity-60 disabled:cursor-default"
                :disabled="loading"
              >
                {{ loading ? '로그인 중...' : '로그인' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/http'

const router = useRouter()

const loginId = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

function goSignup()
{
  router.push('/signup')
}

async function handleLogin()
{
  errorMessage.value = ''

  if (!loginId.value.trim()) {
    errorMessage.value = '아이디를 입력해 주세요.'
    return
  }

  if (!password.value.trim()) {
    errorMessage.value = '비밀번호를 입력해 주세요.'
    return
  }

  loading.value = true

  try {
    const res = await http.post('/auth/login', {
      loginId: loginId.value.trim(),
      password: password.value
    })

    const data = res.data
    const token = data?.token

    if (!token) {
      errorMessage.value = '토큰이 응답되지 않았습니다.'
      return
    }

    localStorage.setItem('accessToken', token)
    localStorage.setItem('userId', String(data.userId))
    localStorage.setItem('userRole', data.role)

    window.dispatchEvent(new Event('auth-changed'))

    router.push('/')
  } catch (err) {
    const status = err?.response?.status
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error

    if (status === 401 || status === 403) {
      errorMessage.value = message || '로그인할 수 없는 계정입니다.'
    } else {
      errorMessage.value = message || '로그인 중 오류가 발생했습니다.'
    }

  } finally {
    loading.value = false
  }
}
</script>