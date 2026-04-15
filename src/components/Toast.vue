<template>
  <!-- 토스트 메시지 UI -->
  <div
    v-if="open"
    class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
           px-4 py-1.5 rounded-md border
           text-sm shadow-lg flex items-center gap-2 pointer-events-none"
    :class="isSuccess ? successClass : failClass"
  >
    <span
      class="inline-block w-2 h-2 rounded-full"
      :class="isSuccess ? 'bg-green-400' : 'bg-red-400'"
    ></span>
    <span>{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 토스트 상태/메시지/타입 전달받음
const props = defineProps({
  open: Boolean,
  text: String,
  type: {
    type: String,
    default: 'success' // success | error
  }
})

// 성공/실패 여부 판단
const isSuccess = computed(() => {
  return props.type === 'success'
})

// 성공 스타일
const successClass =
  'bg-neutral-900 border-neutral-700 text-neutral-200'

// 실패 스타일
const failClass =
  'bg-red-900/80 border-red-500 text-white'
</script>