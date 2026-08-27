<template>
  <!-- 이미지 -->
  <div
    class="relative aspect-[3/2] shrink-0 overflow-hidden
          border-b border-neutral-700 bg-neutral-900"
  >
    <img
      v-if="row.imageUrl"
      :src="resolveThumbnailUrl(row.imageUrl)"
      :alt="row.name"
      loading="lazy"
      class="h-full w-full object-cover"
    />

    <div
      v-else
      class="flex h-full items-center justify-center
            text-[12px] text-neutral-500"
    >
      이미지 없음
    </div>

    <!-- 미획득 -->
    <span
      v-if="row.acquiredYn === 'N'"
      class="absolute right-2 top-2 rounded-md
            border border-red-500/40 bg-red-900/70
            px-2 py-[2px] text-[10px] text-red-200"
    >
      미획득
    </span>
  </div>

  <div class="flex flex-1 flex-col px-3 py-2">
    <div class="flex min-w-0 items-center gap-2">
      <div class="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
        <!-- 이름 -->
        <span class="truncate text-[13px] font-medium text-neutral-100">
          {{ row.name }}
        </span>

        <!-- 기능배지 -->
        <span
          v-for="badge in formatFeatureBadges(row.features)"
          :key="badge"
          class="shrink-0 rounded-md
                border border-neutral-700/70
                bg-neutral-800/60
                px-1.5 py-[1px]
                text-[9px] text-neutral-300"
        >
          {{ badge }}
        </span>
      </div>

      <!-- 우측 맨션배지 -->
      <span
        v-if="mansionPositionLabel"
        class="ml-auto shrink-0 rounded-md
              border border-blue-500/40 bg-blue-900/20
              px-1.5 py-[1px] text-[9px] text-blue-300"
      >
        {{ mansionPositionLabel }}
      </span>
    </div>

    <div class="mt-auto flex items-end justify-between gap-2 pt-2">
      <div class="min-w-0 text-[11px] text-neutral-400">
        <div class="truncate">
          <!-- 제조사 -->
          <span v-if="row.manufacturer">
            {{ row.manufacturer }}
          </span>

          <span v-if="row.manufacturer && row.category">
            ·
          </span>

          <!-- 분류 -->
          <span v-if="row.category">
            {{ row.category }}
          </span>
        </div>

        <!-- 출시일 -->
        <div v-if="row.releaseDate">
          {{ row.releaseDate }}
        </div>
      </div>

      <!-- 수정 버튼 -->
      <button
        type="button"
        class="shrink-0 rounded p-1 transition hover:bg-neutral-600/40"
        @click.stop="emit('edit', row)"
      >
        <SquarePen class="h-4 w-4 text-neutral-400 hover:text-white" />
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { SquarePen } from 'lucide-vue-next'
import { formatFeatureBadges, resolveThumbnailUrl } from '@/utils/format'

// 부모 컴포넌트에서 전달받는 이동수단 정보
const props = defineProps({
  row: {
    type: Object,
    required: true
  }
})

// 수정 이벤트 전달
const emit = defineEmits(['edit'])

// 맨션 위치 표시명 반환
const mansionPositionLabel = computed(() => {
  const mansionPosition = String(props.row?.mansionPosition || '').trim()

  if (mansionPosition === 'PODIUM') {
    return '포디움'
  }

  if (mansionPosition === 'D1') {
    return '진입로1'
  }

  if (mansionPosition === 'D2') {
    return '진입로2'
  }

  return ''
})
</script>