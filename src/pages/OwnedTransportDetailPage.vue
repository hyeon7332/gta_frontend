<template>
  <div class="min-h-[calc(100dvh-56px)] bg-neutral-700">
    <div class="mx-auto w-full max-w-[1100px] px-4 pb-4 pt-2">
      <!-- 조회 중 -->
      <div
        v-if="loading"
        class="flex h-full items-center justify-center
               rounded-lg border border-neutral-700
               bg-neutral-900/40 shadow-lg"
      >
        <span class="text-[13px] text-neutral-400">
          불러오는 중...
        </span>
      </div>

      <!-- 조회 실패 -->
      <div
        v-else-if="!row"
        class="flex h-full flex-col items-center justify-center gap-3
               rounded-lg border border-neutral-700
               bg-neutral-900/40 shadow-lg"
      >
        <span class="text-[13px] text-neutral-400">
          이동수단 정보를 찾을 수 없습니다.
        </span>

        <!-- 닫기 -->
        <div class="mb-3 flex justify-end">
          <button
            type="button"
            class="rounded-md p-2
                  text-neutral-400 transition
                  hover:bg-neutral-800 hover:text-white"
            @click="goBack"
          >
            <X class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- 상세 페이지 -->
      <div
        v-else
        class="scroll-dark rounded-lg border border-neutral-700
              bg-neutral-900/40 shadow-lg
              [@media(max-height:1100px)]:max-h-[calc(100dvh-120px)]
              [@media(max-height:1100px)]:overflow-y-auto"
      >
        <div class="px-5 pb-5 pt-4">

          <!-- 상단 제목 -->
          <div class="mb-4 flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex min-w-0 flex-wrap items-center gap-2">
                <div
                  class="min-w-0 break-words text-[18px]
                         font-semibold leading-tight text-white"
                >
                  {{ getDetailTitle(row) }}
                </div>

                <span
                  v-for="badge in format.formatFeatureBadges(row?.features)"
                  :key="badge"
                  class="relative top-[2px] whitespace-nowrap rounded-md
                         border border-neutral-700/70 bg-neutral-800/60
                         px-2 py-[2px] text-[11px] text-neutral-200"
                >
                  {{ badge }}
                </span>
              </div>
            </div>

            <!-- 닫기 -->
            <button
              type="button"
              class="shrink-0 -mt-1.5 rounded-md p-2
                    text-neutral-400 transition
                    hover:bg-neutral-800 hover:text-white"
              @click="goBack"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- 차량 이미지 -->
          <div class="mb-4">
            <div
              class="relative aspect-[7/4] overflow-hidden
                    rounded-md bg-neutral-800/40"
            >
              <!-- 이미지 로딩 Skeleton -->
              <div
                v-if="row?.imageUrl && imageLoading"
                class="absolute inset-0 animate-pulse bg-neutral-700/70"
              ></div>

              <a
                v-if="row?.imageUrl"
                :href="format.resolveImageUrl(row.imageUrl)"
                target="_blank"
                rel="noopener noreferrer"
                class="block h-full w-full"
              >
                <img
                  :src="format.resolveImageUrl(row.imageUrl)"
                  :alt="getDetailTitle(row)"
                  class="h-full w-full cursor-zoom-in object-cover
                        transition-opacity duration-300"
                  :class="imageLoading ? 'opacity-0' : 'opacity-100'"
                  @load="imageLoading = false"
                  @error="imageLoading = false"
                />
              </a>

              <div
                v-else
                class="flex h-full items-center justify-center
                      text-[13px] text-neutral-500"
              >
                이미지 없음
              </div>

              <div
                class="pointer-events-none absolute inset-0
                      rounded-md border border-white/80"
              ></div>
            </div>
          </div>

          <!-- 상세 정보 -->
          <div class="border-t border-neutral-700">
            <!-- 비고 -->
            <div
              v-if="row?.remark && row.remark.trim()"
              class="border-b border-neutral-700 px-1 py-3"
            >
              <div
                class="whitespace-pre-wrap break-words
                       text-[13px] leading-relaxed text-neutral-300"
              >
                {{ row.remark }}
              </div>
            </div>

            <!-- 보관위치 -->
            <div
              class="flex items-center justify-between gap-4
                     border-b border-neutral-700 px-1 py-2"
            >
              <span class="text-[13px] text-neutral-400">
                보관위치
              </span>

              <span class="text-right text-[13px] font-medium text-neutral-100">
                {{ getStorageDisplayText(row) }}
              </span>
            </div>

            <!-- 분류 -->
            <div
              class="flex items-center justify-between gap-4
                     border-b border-neutral-700 px-1 py-2"
            >
              <span class="text-[13px] text-neutral-400">
                분류
              </span>

              <span class="text-right text-[13px] font-medium text-neutral-100">
                {{ row?.category || '-' }}
              </span>
            </div>

            <!-- 개조위치 -->
            <div
              class="flex items-center justify-between gap-4
                     border-b border-neutral-700 px-1 py-2"
            >
              <span class="text-[13px] text-neutral-400">
                개조위치
              </span>

              <span
                class="block max-w-[700px] truncate text-right text-[13px]"
                :class="
                  row?.upgradeLocation?.trim()
                    ? 'font-medium text-neutral-100'
                    : 'text-neutral-500'
                "
                :title="row?.upgradeLocation"
              >
                {{ row?.upgradeLocation?.trim()
                  ? row.upgradeLocation
                  : '개조불가'
                }}
              </span>
            </div>

            <!-- 랩타임 -->
            <div class="border-b border-neutral-700 px-1 py-3">
              <template v-if="row?.lapTime">
                <div class="mb-1 flex justify-between text-[13px]">
                  <span class="text-neutral-400">
                    랩타임
                  </span>

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
                        {{ (row?.category || '-') }}
                        {{ row.lapCategoryRank }}위
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
                  <div
                    class="h-[6px] flex-1 overflow-hidden
                           rounded bg-neutral-700"
                  >
                    <div
                      class="h-[6px] rounded bg-blue-400
                             transition-all duration-700 ease-out"
                      :style="{ width: animatedLapWidth + '%' }"
                    ></div>
                  </div>

                  <span
                    class="w-[90px] text-right text-[13px]
                           tabular-nums text-neutral-100"
                  >
                    {{ formatLapTime(row?.lapTime) }}
                  </span>
                </div>
              </template>

              <template v-else>
                <div class="flex justify-between text-[13px]">
                  <span class="text-neutral-400">
                    랩타임
                  </span>

                  <span class="text-neutral-500">
                    정보없음
                  </span>
                </div>
              </template>
            </div>

            <!-- 최고속도 -->
            <div class="px-1 py-3">
              <template v-if="row?.topSpeed">
                <div class="mb-1 flex justify-between text-[13px]">
                  <span class="text-neutral-400">
                    최고속도
                  </span>

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
                        {{ (row?.category || '-') }}
                        {{ row.speedCategoryRank }}위
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
                  <div
                    class="h-[6px] flex-1 overflow-hidden
                           rounded bg-neutral-700"
                  >
                    <div
                      class="h-[6px] rounded bg-green-400
                             transition-all duration-700 ease-out"
                      :style="{ width: animatedTopSpeedWidth + '%' }"
                    ></div>
                  </div>

                  <span
                    class="w-[90px] text-right
                           text-[13px] text-neutral-100"
                  >
                    {{ format.formatSpeed(row?.topSpeed) }}
                  </span>
                </div>
              </template>

              <template v-else>
                <div class="flex justify-between text-[13px]">
                  <span class="text-neutral-400">
                    최고속도
                  </span>

                  <span class="text-neutral-500">
                    정보없음
                  </span>
                </div>
              </template>
            </div>

            <!-- 가격 -->
            <div
              class="flex items-center justify-between gap-4
                     border-t border-neutral-700 px-1 py-2"
            >
              <span class="text-[13px] text-neutral-400">
                가격
              </span>

              <span class="text-right text-[13px] font-medium text-neutral-100">
                {{ format.formatCurrencyUSD(row?.price) }}
              </span>
            </div>

            <!-- 출시일 -->
            <div
              class="flex items-center justify-between gap-4
                     border-t border-neutral-700 px-1 py-2"
            >
              <span class="text-[13px] text-neutral-400">
                출시일
              </span>

              <span class="text-right text-[13px] font-medium text-neutral-100">
                {{ format.formatDate(row?.releaseDate) }}
              </span>
            </div>

            <!-- 획득처 -->
            <div
              class="flex items-center justify-between gap-4
                     border-t border-neutral-700 px-1 py-2"
            >
              <span class="text-[13px] text-neutral-400">
                획득처
              </span>

              <span
                class="block max-w-[700px] truncate
                       text-right text-[13px] font-medium text-neutral-100"
                :title="row?.source"
              >
                {{ row?.source || '-' }}
              </span>
            </div>

            <!-- 특징 -->
            <div class="border-t border-neutral-700 px-1 py-2">
              <div class="mb-2 text-[13px] text-neutral-400">
                특징
              </div>

              <div
                v-if="row?.features"
                class="flex flex-wrap gap-4 pr-1"
              >
                <span
                  v-for="feature in displayFeatureNames(row.features)"
                  :key="feature"
                  class="whitespace-nowrap rounded-md
                         border border-neutral-700/70 bg-neutral-800/50
                         px-2.5 py-1 text-[12px] text-neutral-200"
                >
                  {{ feature.trim() }}
                </span>
              </div>

              <div
                v-else
                class="text-center text-[13px] text-neutral-500"
              >
                정보없음
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { X } from 'lucide-vue-next'
import { http } from '@/api/http'
import * as format from '@/utils/format'
import * as transportDataMapper from '@/utils/transportDataMapper'

const route = useRoute()
const router = useRouter()

// 상세 이동수단 데이터
const row = ref(null)

// 상세 조회 중 여부
const loading = ref(false)

// 랩타임 그래프 너비
const animatedLapWidth = ref(0)

// 최고속도 그래프 너비
const animatedTopSpeedWidth = ref(0)

// 특징 코드 목록
const featureOptions = ref([])

// 그래프 애니메이션 타이머
let animationTimer = null

// 이미지 로딩 상태
const imageLoading = ref(true)

// 상세 타이틀 생성
function getDetailTitle(targetRow)
{
  if (!targetRow) {
    return '-'
  }

  const manufacturer = String(targetRow.manufacturer || '').trim()
  const name = String(targetRow.name || '').trim()

  if (manufacturer === '' || manufacturer === '미분류') {
    return name || '-'
  }

  if (name === '') {
    return manufacturer
  }

  return `${manufacturer} ${name}`
}

// 보관위치 표시 텍스트 생성
function getStorageDisplayText(targetRow)
{
  if (!targetRow) {
    return '-'
  }

  const storageType = String(targetRow.storageType || '').trim() 

  if (storageType === 'UNASSIGNED') {
    return '미배치'
  }

  if (storageType === 'PEGASUS') {
    return '페가수스'
  }

  const garageName = String(
    targetRow.alias ||
    targetRow.garage ||
    targetRow.garageName ||
    ''
  ).trim()

  const slotNo = targetRow.slot || targetRow.slotNo

  if (slotNo) {
    return garageName !== ''
      ? `${garageName} / ${slotNo}`
      : String(slotNo)
  }

  return garageName || '-'
}

// 랩타임 그래프 비율 계산
function getLapTimePercent(value)
{
  if (!value) {
    return 0
  }

  const max = 180000

  return Math.max(0, 100 - (Number(value) / max) * 100)
}

// 최고속도 그래프 비율 계산
function getTopSpeedPercent(value)
{
  if (!value) {
    return 0
  }

  const max = 400

  return Math.min((Number(value) / max) * 100, 100)
}

// 성능 그래프 애니메이션 실행
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
    animatedLapWidth.value = getLapTimePercent(row.value?.lapTime)
    animatedTopSpeedWidth.value = getTopSpeedPercent(row.value?.topSpeed)
  }, 30)
}

// 랩타임 포맷 변환
function formatLapTime(value)
{
  if (!value) {
    return '-'
  }

  const totalMs = Number(value)
  const minutes = Math.floor(totalMs / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)
  const milliseconds = totalMs % 1000

  const secondsText = String(seconds).padStart(2, '0')
  const millisecondsText = String(milliseconds).padStart(3, '0')

  return `${minutes}:${secondsText}.${millisecondsText}`
}

// 순위 강조 클래스 반환
function getRankClass(rank)
{
  if (!rank) {
    return 'text-neutral-400'
  }

  if (Number(rank) === 1) {
    return 'text-yellow-400 font-semibold'
  }

  if (Number(rank) === 2) {
    return 'text-violet-400 font-semibold'
  }

  if (Number(rank) === 3) {
    return 'text-sky-400 font-semibold'
  }

  return 'text-neutral-100 font-medium'
}

// 보유 이동수단 상세 조회
async function loadDetail()
{
  const ownedId = route.params.ownedId

  if (!ownedId) {
    row.value = null
    return
  }

  try {
    loading.value = true
    row.value = null

    const res = await http.get(`/owned-transports/${ownedId}`)

    row.value = transportDataMapper.normalizeOwnedTransport(res.data)

    imageLoading.value = Boolean(row.value?.imageUrl)

    await runBarAnimation()
  } catch (err) {
    console.error('보유 이동수단 상세 조회 실패:', err)
    row.value = null
  } finally {
    loading.value = false
  }
}

// 특징 코드 목록 조회
async function loadFeatureCodes()
{
  try {
    const res = await http.get('/common-codes', {
      params: {
        groupCode: 'FEATURE'
      }
    })

    featureOptions.value = Array.isArray(res.data)
      ? res.data
      : []
  } catch (err) {
    console.error('특징 코드 조회 실패:', err)
    featureOptions.value = []
  }
}

// 특징 코드값을 표시명으로 변환
function displayFeatureNames(features)
{
  if (!features || String(features).trim() === '') {
    return []
  }

  return String(features)
    .split(',')
    .map((value) => {
      return value.trim()
    })
    .map((value) => {
      const matched = featureOptions.value.find((option) => {
        return option.codeValue === value || option.codeName === value
      })

      return matched ? matched.codeName : value
    })
    .filter((value) => {
      return value !== ''
    })
}

// 이전 화면으로 이동
function goBack()
{
  router.back()
}

// URL의 ownedId 변경 시 상세 재조회
watch(
  () => route.params.ownedId,
  (currentOwnedId, previousOwnedId) => {
    if (currentOwnedId && currentOwnedId !== previousOwnedId) {
      loadDetail()
    }
  }
)

// 컴포넌트 진입 시 데이터 조회
onMounted(async () => {
  await Promise.all([
    loadFeatureCodes(),
    loadDetail()
  ])
})

// 컴포넌트 종료 시 타이머 제거
onBeforeUnmount(() => {
  if (animationTimer) {
    clearTimeout(animationTimer)
    animationTimer = null
  }
})
</script>