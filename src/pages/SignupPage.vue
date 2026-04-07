<!-- src/pages/SignupPage.vue -->
<template>
  <div class="h-full bg-neutral-700">
    <div class="w-full max-w-none px-4 pt-2 pb-4 h-full">
      <div class="h-full flex items-center justify-center">
        <div class="w-full max-w-md bg-neutral-900/40 border border-neutral-700 rounded-lg shadow-lg overflow-hidden">
          <!-- header -->
          <div class="px-5 py-4 border-b border-neutral-700 bg-neutral-900/30">
            <h1 class="text-lg font-semibold text-neutral-100">
              회원가입
            </h1>
            <p class="mt-1 text-sm text-neutral-400">
              Schni GTA 계정을 생성해 주세요.
            </p>
          </div>

          <!-- body -->
          <form class="p-5 space-y-4" @submit.prevent="handleSignup">
            <div>
              <label class="block mb-2 text-[13px] text-neutral-300">
                아이디
              </label>
              <input
                v-model="form.loginId"
                type="text"
                placeholder="아이디 입력"
                class="w-full h-10 px-3 rounded-md
                       bg-neutral-800/60 border border-neutral-600
                       text-sm text-neutral-100 placeholder-neutral-400
                       outline-none focus:border-neutral-400"
                :disabled="loading"
              />
            </div>

            <div>
              <label class="block mb-2 text-[13px] text-neutral-300">
                비밀번호
              </label>
              <input
                v-model="form.password"
                type="password"
                placeholder="비밀번호 입력"
                class="w-full h-10 px-3 rounded-md
                       bg-neutral-800/60 border border-neutral-600
                       text-sm text-neutral-100 placeholder-neutral-400
                       outline-none focus:border-neutral-400"
                :disabled="loading"
              />
            </div>

            <div>
              <label class="block mb-2 text-[13px] text-neutral-300">
                비밀번호 확인
              </label>
              <input
                v-model="form.passwordConfirm"
                type="password"
                placeholder="비밀번호 다시 입력"
                class="w-full h-10 px-3 rounded-md
                       bg-neutral-800/60 border border-neutral-600
                       text-sm text-neutral-100 placeholder-neutral-400
                       outline-none focus:border-neutral-400"
                :disabled="loading"
              />
            </div>

            <div>
              <label class="block mb-2 text-[13px] text-neutral-300">
                닉네임
              </label>
              <input
                v-model="form.nickname"
                type="text"
                placeholder="닉네임 입력"
                class="w-full h-10 px-3 rounded-md
                       bg-neutral-800/60 border border-neutral-600
                       text-sm text-neutral-100 placeholder-neutral-400
                       outline-none focus:border-neutral-400"
                :disabled="loading"
              />
            </div>

            <div
              v-if="errorMessage"
              class="px-3 py-2 rounded-md border border-red-800 bg-red-950/30 text-sm text-red-300"
            >
              {{ errorMessage }}
            </div>

            <div
              v-if="successMessage"
              class="px-3 py-2 rounded-md border border-green-800 bg-green-950/30 text-sm text-green-300"
            >
              {{ successMessage }}
            </div>

            <div class="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                class="h-9 px-4 rounded-md border border-neutral-600
                       bg-neutral-800/60 text-sm text-neutral-200
                       hover:bg-neutral-700 active:bg-neutral-600 transition"
                :disabled="loading"
                @click="goLogin"
              >
                로그인으로
              </button>

              <button
                type="submit"
                class="h-9 px-4 rounded-md border border-neutral-600
                       bg-neutral-200 text-sm font-medium text-neutral-900
                       hover:bg-white active:bg-neutral-300 transition
                       disabled:opacity-60 disabled:cursor-default"
                :disabled="loading"
              >
                {{ loading ? '가입 중...' : '회원가입' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/http'

const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  loginId: '',
  password: '',
  passwordConfirm: '',
  nickname: ''
})

function goLogin()
{
  router.push('/login')
}

function validateForm()
{
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.loginId.trim()) {
    errorMessage.value = '아이디를 입력해 주세요.'
    return false
  }

  if (!form.password.trim()) {
    errorMessage.value = '비밀번호를 입력해 주세요.'
    return false
  }

  if (!form.passwordConfirm.trim()) {
    errorMessage.value = '비밀번호 확인을 입력해 주세요.'
    return false
  }

  if (form.password !== form.passwordConfirm) {
    errorMessage.value = '비밀번호가 일치하지 않습니다.'
    return false
  }

  if (!form.nickname.trim()) {
    errorMessage.value = '닉네임을 입력해 주세요.'
    return false
  }

  return true
}

async function handleSignup()
{
  if (!validateForm()) {
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const payload = {
      loginId: form.loginId.trim(),
      password: form.password,
      nickname: form.nickname.trim()
    }

    await http.post('/auth/signup', payload)

    successMessage.value = '회원가입이 완료되었습니다. 관리자 승인 후 로그인할 수 있습니다.'

    form.loginId = ''
    form.password = ''
    form.passwordConfirm = ''
    form.nickname = ''

    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      '회원가입 중 오류가 발생했습니다.'

    errorMessage.value = message
  } finally {
    loading.value = false
  }
}
</script>