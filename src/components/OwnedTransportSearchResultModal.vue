<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
  >
    <div
      class="max-h-[620px] bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl overflow-hidden"
      style="width: 750px;"
    >
      <!-- 헤더 -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-neutral-700">
        <div>
          <div class="text-[15px] font-semibold text-neutral-100">
            검색 결과
          </div>
          <div class="mt-0.5 text-[12px] text-neutral-400">
            이동수단을 선택하세요
          </div>
        </div>
      </div>

      <!-- 검색 결과 목록 -->
      <div class="p-3">

        <div class="max-h-[400px] overflow-y-auto scroll-dark space-y-1 pr-1">
          <button
            v-for="row in results"
            :key="row.id"
            type="button"
            class="w-full px-3 py-2 rounded-md border text-left transition"
            :class="selectedId === row.id
              ? 'bg-blue-900/40 border-blue-500/70'
              : 'bg-neutral-800/40 border-neutral-700 hover:bg-neutral-800'"
            @click="selectRow(row)"
            @dblclick="move"
          >
            <div class="flex items-start justify-between gap-3 min-w-0">
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="text-[13px] text-neutral-100 truncate">
                    {{ row.manufacturer }} {{ row.name }}
                  </span>

                  <span
                    v-for="badge in formatFeatureBadges(row.features)"
                    :key="badge"
                    class="shrink-0 relative top-[1px] px-2 py-[2px] rounded-md border border-neutral-700/70 bg-neutral-800/60 text-[11px] text-neutral-200 whitespace-nowrap"
                  >
                    {{ badge }}
                  </span>
                </div>

                <div class="mt-1 text-[12px] text-neutral-400 truncate">
                  {{ row.category || '-' }}
                </div>
              </div>

              <div class="shrink-0 w-[250px] text-right text-[12px] text-neutral-400 truncate">
                {{ formatStorageLocation(row) }}
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- 하단 버튼 영역 -->
      <div class="flex items-center justify-between gap-2 px-4 py-3 border-t border-neutral-700 bg-neutral-900/80">
        <div class="text-[12px] text-neutral-400">
          총 <span class="text-neutral-100 font-semibold">{{ results.length }}</span>건
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-8 px-3 rounded-md border border-neutral-600 bg-neutral-800/60 text-[13px] text-neutral-200 hover:bg-neutral-700 transition"
            @click="close"
          >
            취소
          </button>

          <button
            type="button"
            class="h-8 px-4 rounded-md border text-[13px] transition"
            :class="selectedRow
              ? 'border-blue-500/70 bg-blue-900/50 text-white hover:bg-blue-800/60'
              : 'border-neutral-700 bg-neutral-800/40 text-neutral-500 cursor-not-allowed'"
            :disabled="!selectedRow"
            @click="move"
          >
            선택
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { formatFeatureBadges, formatStorageLocation } from '@/utils/format'

// 부모 컴포넌트에서 전달받는 모달 상태 및 검색 결과
const props = defineProps({
  open: Boolean,
  results: {
    type: Array,
    default: () => []
  }
})

// 부모 컴포넌트로 전달할 이벤트
const emit = defineEmits(['update:open', 'move'])

// 현재 선택된 검색 결과 행
const selectedRow = ref(null)

// 현재 선택된 검색 결과 ID
const selectedId = ref(null)

/** 검색 결과 행 선택 */
function selectRow(row)
{
  selectedRow.value = row
  selectedId.value = row.id
}

/** 모달 닫기 */
function close()
{
  emit('update:open', false)
}

/** 선택한 이동수단으로 이동 */
function move()
{
  if (!selectedRow.value) {
    return
  }

  emit('move', selectedRow.value)
}

/** ESC 키 입력 시 모달 닫기 */
function handleKeyDown(e)
{
  if (!props.open) {
    return
  }

  if (e.key === 'Escape') {
    close()
  }
}

// 모달이 닫힐 때 선택 상태 초기화
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      selectedRow.value = null
      selectedId.value = null
    }
  }
)

// 키보드 이벤트 등록
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

// 키보드 이벤트 해제
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

</script>