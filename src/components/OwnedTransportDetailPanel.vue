<template>
  <div
    class="w-[500px] shrink-0 rounded-lg border border-neutral-700 bg-neutral-900/40 shadow-lg overflow-hidden"
  >
    <div class="p-4">

      <div class="mb-4 flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 min-w-0 flex-wrap">
            <div class="text-[18px] font-semibold text-white leading-tight break-words min-w-0">
              {{ getDetailTitle(row) }}
            </div>

            <span
              v-if="getUpgradeTypeDisplayText(row?.upgradeType)"
              class="upgrade-badge shrink-0"
            >
              {{ getUpgradeTypeDisplayText(row?.upgradeType) }}
            </span>
          </div>

          <div
            v-if="row?.remark && row.remark.trim()"
            class="mt-1 text-[11px] leading-snug text-neutral-400 break-words"
          >
            {{ row.remark }}
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
            {{ getStorageDisplayText(row) }}
          </span>
        </div>

        <div class="flex items-center justify-between gap-4 px-1 py-2 border-b border-neutral-700">
          <span class="text-[13px] text-neutral-400">분류</span>
          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{ row?.category || '-' }}
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

        <div class="flex items-center justify-between gap-4 px-1 py-2 border-b border-neutral-700">
          <span class="text-[13px] text-neutral-400">이름</span>
          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{ row?.name || '-' }}
          </span>
        </div>

        <div
          v-if="row?.upgradeLocation"
          class="flex items-center justify-between gap-4 px-1 py-2 border-b border-neutral-700"
        >
          <span class="text-[13px] text-neutral-400">개조위치</span>

          <span
            class="block truncate text-[13px] font-medium text-neutral-100 text-right max-w-[280px]"
            :title="row.upgradeLocation"
          >
            {{ row.upgradeLocation }}
          </span>
        </div>

        <!-- 랩타임 -->
        <div class="px-1 py-3 border-b border-neutral-700">
          <template v-if="row?.lapTime">
            <div class="flex justify-between text-[13px] mb-1">
              <span class="text-neutral-400">랩타임</span>
              <span class="text-neutral-400">
                <span :class="getRankClass(row?.lapRank)">
                  {{ row?.lapRank ? '전체 ' + row.lapRank + '위' : '-' }}
                </span>

                <template v-if="row?.lapCategoryRank">
                  <span class="text-neutral-400"> / </span>
                  <span :class="getRankClass(row?.lapCategoryRank)">
                    {{ (row?.category || '-') + ' ' + row.lapCategoryRank + '위' }}
                  </span>
                </template>
              </span>
            </div>

            <div class="flex items-center gap-3">
              <div class="flex-1 h-[6px] bg-neutral-700 rounded overflow-hidden">
                <div
                  class="h-[6px] bg-blue-400 rounded transition-all duration-700 ease-out"
                  :style="{ width: animatedLapWidth + '%' }"
                ></div>
              </div>

              <span class="w-[90px] text-[13px] text-neutral-100 text-right tabular-nums">
                {{ formatLapTime(row?.lapTime) }}
              </span>
            </div>
          </template>

          <template v-else>
            <div class="flex justify-between text-[13px]">
              <span class="text-neutral-400">랩타임</span>
              <span class="text-neutral-500">정보없음</span>
            </div>
          </template>
        </div>

        <!-- 최고속도 -->
        <div class="px-1 py-3">
          <template v-if="row?.topSpeed">
            <div class="flex justify-between text-[13px] mb-1">
              <span class="text-neutral-400">최고속도</span>
              <span class="text-neutral-400">
                <span :class="getRankClass(row?.speedRank)">
                  {{ row?.speedRank ? '전체 ' + row.speedRank + '위' : '-' }}
                </span>

                <template v-if="row?.speedCategoryRank">
                  <span class="text-neutral-400"> / </span>
                  <span :class="getRankClass(row?.speedCategoryRank)">
                    {{ (row?.category || '-') + ' ' + row.speedCategoryRank + '위' }}
                  </span>
                </template>
              </span>
            </div>

            <div class="flex items-center gap-3">
              <div class="flex-1 h-[6px] bg-neutral-700 rounded overflow-hidden">
                <div
                  class="h-[6px] bg-green-400 rounded transition-all duration-700 ease-out"
                  :style="{ width: animatedTopSpeedWidth + '%' }"
                ></div>
              </div>

              <span class="w-[90px] text-[13px] text-neutral-100 text-right">
                {{ formatTopSpeed(row?.topSpeed) }}
              </span>
            </div>
          </template>

          <template v-else>
            <div class="flex justify-between text-[13px]">
              <span class="text-neutral-400">최고속도</span>
              <span class="text-neutral-500">정보없음</span>
            </div>
          </template>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  row: Object
})

const animatedLapWidth = ref(0)
const animatedTopSpeedWidth = ref(0)

let animationTimer = null

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
      if (item === '일반') {
        return ''
      }

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

function getStorageDisplayText(row)
{
  if (!row) {
    return '-'
  }

  if (row.type === 'unassigned') {
    return '미배치'
  }

  if (row.type === 'pegasus') {
    return '페가수스'
  }

  const garageName = String(row.alias || row.garage || '').trim()
  const slotNo = row.slot

  if (slotNo) {
    return garageName !== '' ? `${garageName} / ${slotNo}` : `${slotNo}`
  }

  return garageName || '-'
}

function getLapTimePercent(value)
{
  if (!value) {
    return 0
  }

  const max = 180000
  return Math.max(0, 100 - (value / max) * 100)
}

function getTopSpeedPercent(value)
{
  if (!value) {
    return 0
  }

  const max = 400
  return Math.min((value / max) * 100, 100)
}

async function runBarAnimation()
{
  if (animationTimer) {
    clearTimeout(animationTimer)
    animationTimer = null
  }

  animatedLapWidth.value = 0
  animatedTopSpeedWidth.value = 0

  await nextTick()

  animationTimer = setTimeout(() => {
    animatedLapWidth.value = getLapTimePercent(props.row?.lapTime)
    animatedTopSpeedWidth.value = getTopSpeedPercent(props.row?.topSpeed)
  }, 30)
}

function formatTopSpeed(value)
{
  if (!value) {
    return '-'
  }

  return `${value} km/h`
}

function formatLapTime(value)
{
  if (!value) {
    return '-'
  }

  const totalMs = Number(value)

  const minutes = Math.floor(totalMs / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)
  const ms = totalMs % 1000

  const secStr = String(seconds).padStart(2, '0')
  const msStr = String(ms).padStart(3, '0')

  return `${minutes}:${secStr}.${msStr}`
}

function getRankClass(rank)
{
  if (!rank) {
    return 'text-neutral-400'
  }

  if (rank === 1) {
    return 'text-yellow-400 font-bold'
  }

  if (rank === 2) {
    return 'text-neutral-200 font-semibold'
  }

  if (rank === 3) {
    return 'text-orange-400 font-semibold'
  }

  return 'text-neutral-400'
}

watch(
  () => props.row,
  () => {
    runBarAnimation()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (animationTimer) {
    clearTimeout(animationTimer)
    animationTimer = null
  }
})
</script>