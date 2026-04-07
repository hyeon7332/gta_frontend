<template>
  <div class="h-full bg-neutral-700">
    <div class="w-full max-w-[980px] mx-auto px-4 pt-2 pb-4">
      <div class="bg-neutral-900/40 border border-neutral-700 rounded-lg shadow-lg overflow-hidden">
        <div class="p-2">
          <div class="border border-neutral-700 rounded-md overflow-hidden">
            <!-- title bar -->
            <div
              class="flex items-center justify-between gap-3 px-3 py-2
                     bg-neutral-900/30 border-b border-neutral-700 overflow-hidden"
            >
              <div class="min-w-0">
                <h1 class="text-[18px] font-semibold text-white tracking-wide">
                  회원 승인
                </h1>
                <p class="text-[12px] text-neutral-400 mt-0.5">
                  승인 대기 중인 회원을 확인하고 승인할 수 있습니다.
                </p>
              </div>
            </div>

            <!-- table -->
            <div class="mt-2 sm:mt-3 w-full overflow-auto max-h-[calc(100dvh-260px)]">
              <table class="w-full text-sm text-neutral-200 border-separate border-spacing-0">
                <thead class="bg-neutral-800">
                  <tr class="text-[13px] text-neutral-200 font-medium tracking-wide whitespace-nowrap bg-neutral-900/30">
                    <th class="px-3 py-2 text-left w-[260px] border-b border-r border-neutral-700">
                      아이디
                    </th>
                    <th class="px-3 py-2 text-left w-[220px] border-b border-r border-neutral-700">
                      닉네임
                    </th>
                    <th class="px-3 py-2 text-left w-[220px] border-b border-r border-neutral-700">
                      가입일
                    </th>
                    <th class="px-3 py-2 text-left w-[120px] border-b border-neutral-700">
                      처리
                    </th>
                  </tr>
                </thead>

                <tbody class="text-[13px] text-neutral-200 border-b border-neutral-700">
                  <tr
                    v-for="user in pendingUsers"
                    :key="user.userId"
                    class="transition"
                  >
                    <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">
                      {{ displayValue(user.loginId) }}
                    </td>

                    <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">
                      {{ displayValue(user.nickname) }}
                    </td>

                    <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                      {{ formatDate(user.createdAt) }}
                    </td>

                    <td class="px-3 py-2 text-left border-b border-neutral-700">
                      <button
                        type="button"
                        class="h-8 shrink-0 px-3 rounded-md
                              bg-neutral-800/60 border border-green-700
                              text-[13px] text-green-300
                              hover:bg-green-900/30 active:bg-green-900/40 transition"
                        @click="approveUser(user.userId)"
                      >
                        승인
                      </button>
                    </td>
                  </tr>

                  <tr v-if="pendingUsers.length === 0">
                    <td
                      colspan="4"
                      class="px-4 py-16 text-center text-[13px] text-neutral-400 border-b border-neutral-700"
                    >
                      승인 대기 중인 회원이 없습니다.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- footer -->
            <div class="flex items-center justify-between px-4 py-2 border-t border-neutral-700 bg-neutral-900/40">
              <div class="text-[12px] text-neutral-400 tracking-wide">
                총 {{ pendingUsers.length }}건
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { http } from '@/api/http'
import { formatDate } from '@/utils/format'

const pendingUsers = ref([])

// 목록 조회
async function load()
{
  try {
    const res = await http.get('/auth/pending-users')
    pendingUsers.value = res.data
  } catch (e) {
    console.error('pending-users 조회 실패:', e)
  }
}

// 승인 처리
async function approveUser(userId)
{
  const confirmed = window.confirm('해당 회원을 승인하시겠습니까?')

  if (!confirmed) {
    return
  }

  try {
    await http.post('/auth/approve', {
      userId: userId,
      status: 'APPROVED'
    })
    window.alert('승인 처리되었습니다.')
    await load()
  } catch (e) {
    console.error('승인 실패:', e)
    window.alert('승인 처리 중 오류가 발생했습니다.')
  }
}

function displayValue(value)
{
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return value
}

onMounted(() => {
  load()
})
</script>