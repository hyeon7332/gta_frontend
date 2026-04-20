<template>
  <div
    class="w-[500px] shrink-0 rounded-lg border border-neutral-700 bg-neutral-900/40 shadow-lg overflow-hidden"
  >
    <div class="p-4">
      <div class="mb-4 flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <div class="text-[18px] font-semibold text-white leading-tight break-words">
            {{ getDetailTitle(row) }}
          </div>
        </div>

        <button
          type="button"
          class="shrink-0 p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700/50 transition"
          @click="emit('close')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="mb-4">
        <div class="h-[260px] rounded-md border border-neutral-700 bg-neutral-800/40 overflow-hidden">
          <img
            v-if="row?.imageUrl"
            :src="row.imageUrl"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <div class="border-t border-neutral-700">
        <div class="flex items-center justify-between gap-4 px-1 py-2 border-b border-neutral-700">
          <span class="text-[13px] text-neutral-400">보관위치</span>
          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{
              row?.type === 'unassigned'
                ? '미배치'
                : row?.type === 'pegasus'
                ? '페가수스'
                : row?.garage || '-'
            }}
          </span>
        </div>

        <div
          v-if="row?.type === 'slot'"
          class="flex items-center justify-between gap-4 px-1 py-2 border-b border-neutral-700"
        >
          <span class="text-[13px] text-neutral-400">슬롯</span>
          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{ row?.slot || '-' }}
          </span>
        </div>

        <div class="flex items-center justify-between gap-4 px-1 py-2 border-b border-neutral-700">
          <span class="text-[13px] text-neutral-400">분류</span>
          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{ row?.category || '-' }}
          </span>
        </div>

        <div
          v-if="getUpgradeTypeDisplayText(row?.upgradeType)"
          class="flex items-center justify-between gap-4 px-1 py-2 border-b border-neutral-700"
        >
          <span class="text-[13px] text-neutral-400">개조유형</span>
          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{ getUpgradeTypeDisplayText(row?.upgradeType) }}
          </span>
        </div>

        <div
          v-if="row?.manufacturer && row?.manufacturer !== '미분류'"
          class="flex items-center justify-between gap-4 px-1 py-2 border-b border-neutral-700"
        >
          <span class="text-[13px] text-neutral-400">제조사</span>
          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{ row?.manufacturer }}
          </span>
        </div>

        <div class="flex items-center justify-between gap-4 px-1 py-2">
          <span class="text-[13px] text-neutral-400">이름</span>
          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{ row?.name || '-' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'

const props = defineProps({
  row: Object
})

const emit = defineEmits([
  'close'
])

const upgradeTypeDisplayMap = {
  'HSW': 'HSW',
  '드리프트': 'Drift',
  '아레나': 'Arena',
  '베니즈 커스텀': "Benny's"
}

function getUpgradeTypeDisplayText(upgradeType)
{
  if (!upgradeType || upgradeType.trim() === '') {
    return ''
  }

  const labels = upgradeType
    .split(',')
    .map((item) => {
      return item.trim()
    })
    .filter((item) => {
      return item !== ''
    })
    .map((item) => {
      return upgradeTypeDisplayMap[item] ?? ''
    })
    .filter((item) => {
      return item !== ''
    })

  if (labels.length === 0) {
    return ''
  }

  return labels.join(' / ')
}

function getDetailTitle(row)
{
  if (!row) {
    return '-'
  }

  const manufacturer = String(row.manufacturer || '').trim()
  const name = String(row.name || '').trim()

  if (manufacturer === '' || manufacturer === '미분류') {
    return name || '-'
  }

  if (name === '') {
    return manufacturer
  }

  return `${manufacturer} ${name}`
}
</script>