<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
  >
    <div
      class="max-h-[620px] bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl overflow-hidden"
      style="width: 520px;"
    >
      <!-- header -->
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

      <!-- body -->
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
                <div class="text-[13px] text-neutral-100 truncate">
                  {{ row.manufacturer }} {{ row.name }}
                </div>

                <div class="mt-1 text-[12px] text-neutral-400 truncate">
                  {{ row.category || '-' }}
                </div>
              </div>

              <div class="shrink-0 w-[140px] text-right text-[12px] text-neutral-400 truncate">
                {{ getLocationLabel(row) }}
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- footer -->
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

const props = defineProps({
  open: Boolean,
  results: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:open', 'move'])

const selectedRow = ref(null)
const selectedId = ref(null)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      selectedRow.value = null
      selectedId.value = null
    }
  }
)

function selectRow(row)
{
  selectedRow.value = row
  selectedId.value = row.id
}

function close()
{
  emit('update:open', false)
}

function move()
{
  if (!selectedRow.value) {
    return
  }

  emit('move', selectedRow.value)
}

function handleKeyDown(e)
{
  if (!props.open) {
    return
  }

  if (e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

function getLocationLabel(row)
{
  if (row.storageType === 'PEGASUS') {
    return '페가수스'
  }

  if (row.storageType === 'UNASSIGNED' || (!row.storageType && !row.garageId)) {
    return '미배치'
  }

  const garageName = row.alias || row.garageAlias || row.garage || '-'

  return `${garageName} / ${row.slot || '-'}번 슬롯`
}
</script>