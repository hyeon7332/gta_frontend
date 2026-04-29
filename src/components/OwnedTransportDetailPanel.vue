<template>
  <div
    class="w-[500px] h-[754.5px] shrink-0 rounded-lg border border-neutral-700 bg-neutral-900/40 shadow-lg overflow-hidden flex flex-col"
  >
    <div class="pt-4 px-4 pb-2 flex flex-col min-h-0 flex-1">

      <div class="mb-4 flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 min-w-0 flex-wrap">
            <div class="text-[18px] font-semibold text-white leading-tight break-words min-w-0">
              {{ getDetailTitle(row) }}
            </div>

            <span
              v-if="formatUpgradeType(row?.upgradeType)"
              class="upgrade-badge shrink-0"
            >
              {{ formatUpgradeType(row?.upgradeType) }}
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
        <div class="relative h-[260px] rounded-md bg-neutral-800/40 overflow-hidden">
          <img
            v-if="row?.imageUrl"
            :src="resolveImageUrl(row.imageUrl)"
            class="w-full h-full object-cover"
          />
          <!-- 이미지 위 테두리 -->
          <div
            class="pointer-events-none absolute inset-0 rounded-md border-2 border-white/80"
          ></div>
        </div>
      </div>

      <div class="scroll-dark border-t border-neutral-700 overflow-y-auto pr-3 min-h-0 flex-1">

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

        <div class="flex items-center justify-between gap-4 px-1 py-2 border-b border-neutral-700">
          <span class="text-[13px] text-neutral-400">개조위치</span>

          <span
            class="block truncate text-[13px] text-right max-w-[280px]"
            :class="row?.upgradeLocation?.trim() ? 'font-medium text-neutral-100' : 'text-neutral-500'"
            :title="row?.upgradeLocation"
          >
            {{ row?.upgradeLocation?.trim() ? row.upgradeLocation : '개조불가' }}
          </span>
        </div>

        <!-- 랩타임 -->
        <div class="px-1 py-3 border-b border-neutral-700">
          <template v-if="row?.lapTime">
            <div class="flex justify-between text-[13px] mb-1">
              <span class="text-neutral-400">랩타임</span>
              <span class="text-neutral-400">
                <template v-if="row?.lapRank">
                  <span :class="getRankClass(row?.lapRank)">
                    전체 {{ row.lapRank }}위
                  </span>
                  <span v-if="row?.lapTotalCount">
                    (총 {{ row.lapTotalCount }}대)
                  </span>
                </template>

                <template v-if="row?.lapCategoryRank">
                  <span> / </span>
                  <span :class="getRankClass(row?.lapCategoryRank)">
                    {{ (row?.category || '-') + ' ' + row.lapCategoryRank + '위' }}
                  </span>
                  <span v-if="row?.lapCategoryTotalCount">
                    (총 {{ row.lapCategoryTotalCount }}대)
                  </span>
                </template>

                <template v-if="!row?.lapRank && !row?.lapCategoryRank">
                  <span>-</span>
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
                <template v-if="row?.speedRank">
                  <span :class="getRankClass(row?.speedRank)">
                    전체 {{ row.speedRank }}위
                  </span>
                  <span v-if="row?.speedTotalCount">
                    (총 {{ row.speedTotalCount }}대)
                  </span>
                </template>

                <template v-if="row?.speedCategoryRank">
                  <span> / </span>
                  <span :class="getRankClass(row?.speedCategoryRank)">
                    {{ (row?.category || '-') + ' ' + row.speedCategoryRank + '위' }}
                  </span>
                  <span v-if="row?.speedCategoryTotalCount">
                    (총 {{ row.speedCategoryTotalCount }}대)
                  </span>
                </template>

                <template v-if="!row?.speedRank && !row?.speedCategoryRank">
                  <span>-</span>
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
                {{ formatSpeed(row?.topSpeed) }}
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

        <!-- 가격 -->
        <div class="flex items-center justify-between gap-4 px-1 py-2 border-t border-neutral-700">
          <span class="text-[13px] text-neutral-400">가격</span>
          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{ formatCurrencyUSD(row?.price) }}
          </span>
        </div>

        <!-- 출시일 -->
        <div class="flex items-center justify-between gap-4 px-1 py-2 border-t border-neutral-700">
          <span class="text-[13px] text-neutral-400">출시일</span>
          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{ formatDate(row?.releaseDate) }}
          </span>
        </div>

        <!-- 획득처 -->
        <div class="flex items-center justify-between gap-4 px-1 py-2 border-t border-neutral-700">
          <span class="text-[13px] text-neutral-400">획득처</span>

          <span
            class="block truncate text-[13px] font-medium text-neutral-100 text-right max-w-[280px]"
            :title="row?.source"
          >
            {{ row?.source || '-' }}
          </span>
        </div>

        <!-- 무게 -->
        <div class="flex items-center justify-between gap-4 px-1 py-2 border-t border-neutral-700">
          <span class="text-[13px] text-neutral-400">무게</span>

          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{ row?.weight ? row.weight + ' kg' : '-' }}
          </span>
        </div>

        <!-- 구동방식 -->
        <div class="flex items-center justify-between gap-4 px-1 py-2 border-t border-neutral-700">
          <span class="text-[13px] text-neutral-400">구동방식</span>

          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{ row?.driveTrain || '-' }}
          </span>
        </div>

        <!-- 좌석 -->
        <div class="flex items-center justify-between gap-4 px-1 py-2 border-t border-neutral-700">
          <span class="text-[13px] text-neutral-400">좌석</span>

          <span class="text-[13px] font-medium text-neutral-100 text-right">
            {{ row?.seats || '-' }}
          </span>
        </div>

        <!-- 특징 -->
        <div class="px-1 py-2 border-t border-neutral-700">
          <div class="mb-2 text-[13px] text-neutral-400">특징</div>

          <div
            v-if="row?.features"
            class="flex flex-wrap gap-4 pr-1"
          >
            <span
              v-for="feature in row.features.split(',')"
              :key="feature"
              class="px-2.5 py-1 rounded-md border border-neutral-700/70 bg-neutral-800/50 text-[12px] text-neutral-200 whitespace-nowrap"
            >
              {{ feature.trim() }}
            </span>
          </div>

          <div
            v-else
            class="text-[13px] text-neutral-500 text-center"
          >
            정보없음
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { X } from 'lucide-vue-next'
import { formatDate, formatCurrencyUSD, formatSpeed, formatUpgradeType } from '@/utils/format'
import { resolveImageUrl } from '@/utils/format'

const props = defineProps({
  row: Object
})

const animatedLapWidth = ref(0)
const animatedTopSpeedWidth = ref(0)

let animationTimer = null

const emit = defineEmits([
  'close'
])

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
    return 'text-yellow-400 font-semibold'
  }

  if (rank === 2) {
    return 'text-violet-400 font-semibold'
  }

  if (rank === 3) {
    return 'text-sky-400 font-semibold'
  }

  return 'text-neutral-100 font-medium'
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