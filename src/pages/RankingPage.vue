<template>
  <div class="h-full bg-neutral-700">
    <div class="w-full max-w-[1650px] mx-auto px-4 pt-2 pb-4 transition-all duration-300">

      <!-- 외곽 카드 -->
      <div
        class="bg-neutral-600/70
               border border-neutral-400
               rounded-lg shadow-lg overflow-hidden"
      >
        <div class="p-2">
          <!-- 내부 카드 -->
          <div
            class="border border-neutral-300
                   rounded-md overflow-hidden
                   bg-neutral-200/90"
          >
            <!-- 제목 / 필터 영역 -->
            <div
              class="px-4 py-4
                     bg-neutral-300
                     border-b border-neutral-400"
            >
              <!-- 제목 -->
              <div>
                <h1 class="text-xl font-bold text-neutral-900">
                  이동수단 랭킹
                </h1>

                <p class="mt-1 text-[13px] text-neutral-600">
                  내 차고에 등록된 이동수단의 순위를 확인할 수 있습니다.
                </p>
              </div>

              <!-- 차량 분류 -->
              <div class="mt-4">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="category in categories"
                    :key="category.label"
                    type="button"
                    :class="[
                      'h-8 px-3 rounded-md border text-[13px] transition',
                      selectedCategory === category.value
                        ? 'bg-neutral-700 border-neutral-700 text-white'
                        : 'bg-neutral-100 border-neutral-400 text-neutral-800 hover:bg-neutral-200'
                    ]"
                    @click="selectedCategory = category.value"
                  >
                    {{ category.label }}
                  </button>
                </div>
              </div>

              <!-- 랭킹 기준 -->
              <div class="mt-3">
                <select
                  v-model="selectedRankingType"
                  class="h-9 min-w-[130px]
                         px-3
                         bg-neutral-100
                         border border-neutral-400
                         rounded-md
                         text-[13px] text-neutral-800
                         outline-none
                         focus:border-neutral-600"
                >
                  <option
                    v-for="type in rankingTypes"
                    :key="type.value"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 랭킹 영역 -->
            <div class="p-4 bg-neutral-200/90">
              <!-- 로딩 -->
              <div
                v-if="loading"
                class="py-16 text-center text-sm text-neutral-500"
              >
                랭킹을 불러오는 중입니다.
              </div>

              <!-- 데이터 없음 -->
              <div
                v-else-if="rankingList.length === 0"
                class="py-16 text-center text-sm text-neutral-500"
              >
                해당 조건의 랭킹 데이터가 없습니다.
              </div>

              <!-- 랭킹 데이터 -->
              <template v-else>
                <!-- TOP 3 -->
                <div class="pt-6">
                  <div
                    class="grid grid-cols-1 md:grid-cols-3
                          gap-4 items-end
                          max-w-[1050px] mx-auto"
                  >
                    <!-- 2위 -->
                    <div
                      v-if="rankingList[1]"
                      class="bg-neutral-100 w-[310px]
                            border border-neutral-300
                            rounded-lg overflow-hidden
                            shadow-sm
                            md:-translate-x-10"
                    >
                      <!-- 이미지 영역 -->
                      <div
                        class="relative aspect-[3/2] shrink-0 overflow-hidden
                              border-b border-neutral-300 bg-neutral-300"
                      >
                        <img
                          v-if="rankingList[1].imageUrl"
                          :src="format.resolveThumbnailUrl(rankingList[1].imageUrl)"
                          :alt="rankingList[1].name"
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

                        <div class="absolute top-3 left-3 z-10 flex flex-col items-center">
                          <div
                            class="relative flex h-8 w-8 items-center justify-center
                                  rounded-full border-2 border-neutral-400
                                  bg-gradient-to-br from-white via-neutral-200 to-neutral-400
                                  text-sm font-extrabold text-neutral-800
                                  shadow-md"
                          >
                            2
                          </div>

                          <div class="-mt-1 flex">
                            <div
                              class="h-3 w-2.5 bg-neutral-400
                                    [clip-path:polygon(0_0,100%_0,75%_100%,50%_75%,25%_100%)]"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <!-- 차량 정보 -->
                      <div class="px-3 py-2">
                        <p class="text-xs leading-tight text-neutral-500">
                          {{ rankingList[1].manufacturer }}
                        </p>

                        <h2 class="mt-0.5 text-base font-bold leading-tight text-neutral-900">
                          {{ rankingList[1].name }}
                        </h2>

                        <p class="mt-1 text-right text-sm font-bold leading-tight text-neutral-800">
                          {{ formatRankingValue(rankingList[1]) }}
                        </p>
                      </div>
                    </div>


                    <!-- 1위 -->
                    <div
                      v-if="rankingList[0]"
                      class="bg-neutral-100 w-[310px]
                            border border-neutral-300
                            rounded-lg overflow-hidden
                            shadow-md
                            md:-translate-y-6"
                    >
                      <!-- 이미지 영역 -->
                      <div
                        class="relative aspect-[3/2] shrink-0 overflow-hidden
                              border-b border-neutral-300 bg-neutral-300"
                      >
                        <img
                          v-if="rankingList[0].imageUrl"
                          :src="format.resolveThumbnailUrl(rankingList[0].imageUrl)"
                          :alt="rankingList[0].name"
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

                        <div class="absolute top-3 left-3 z-10 flex flex-col items-center">
                          <!-- 메달 -->
                          <div
                            class="relative flex h-8 w-8 items-center justify-center
                                  rounded-full border-2 border-yellow-600
                                  bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600
                                  text-sm font-extrabold text-yellow-950
                                  shadow-md"
                          >
                            1
                          </div>

                          <!-- 리본 -->
                          <div class="-mt-1 flex">
                            <div
                              class="h-3 w-2.5 bg-yellow-600
                                    [clip-path:polygon(0_0,100%_0,75%_100%,50%_75%,25%_100%)]"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <!-- 차량 정보 -->
                      <div class="px-3 py-2">
                        <p class="text-xs leading-tight text-neutral-500">
                          {{ rankingList[0].manufacturer }}
                        </p>

                        <h2 class="mt-0.5 text-base font-bold leading-tight text-neutral-900">
                          {{ rankingList[0].name }}
                        </h2>

                        <p class="mt-1 text-right text-sm font-bold leading-tight text-neutral-800">
                          {{ formatRankingValue(rankingList[0]) }}
                        </p>
                      </div>
                    </div>


                    <!-- 3위 -->
                    <div
                      v-if="rankingList[2]"
                      class="bg-neutral-100 w-[310px]
                            border border-neutral-300
                            rounded-lg overflow-hidden
                            shadow-sm
                            md:translate-x-10"
                    >
                      <!-- 이미지 영역 -->
                      <div
                        class="relative aspect-[3/2] shrink-0 overflow-hidden
                              border-b border-neutral-300 bg-neutral-300"
                      >
                        <img
                          v-if="rankingList[2].imageUrl"
                          :src="format.resolveThumbnailUrl(rankingList[2].imageUrl)"
                          :alt="rankingList[2].name"
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

                        <div class="absolute top-3 left-3 z-10 flex flex-col items-center">
                          <div
                            class="relative flex h-8 w-8 items-center justify-center
                                  rounded-full border-2 border-amber-800
                                  bg-gradient-to-br from-amber-300 via-amber-600 to-amber-800
                                  text-sm font-extrabold text-white
                                  shadow-md"
                          >
                            3
                          </div>

                          <div class="-mt-1 flex">
                            <div
                              class="h-3 w-2.5 bg-amber-800
                                    [clip-path:polygon(0_0,100%_0,75%_100%,50%_75%,25%_100%)]"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <!-- 차량 정보 -->
                      <div class="px-3 py-2">
                        <p class="text-xs leading-tight text-neutral-500">
                          {{ rankingList[2].manufacturer }}
                        </p>

                        <h2 class="mt-0.5 text-base font-bold leading-tight text-neutral-900">
                          {{ rankingList[2].name }}
                        </h2>

                        <p class="mt-1 text-right text-sm font-bold leading-tight text-neutral-800">
                          {{ formatRankingValue(rankingList[2]) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { http } from '@/api/http'
import * as format from '@/utils/format'

// 현재 선택된 랭킹 기준
const selectedRankingType = ref('LAP_TIME')

// 현재 선택된 차량 분류
// 전체 조회는 null 사용
const selectedCategory = ref(null)

// 랭킹 데이터
const rankingList = ref([])

// 조회 상태
const loading = ref(false)

// 차량 분류
const categories = [
  {
    label: '전체',
    value: null
  },
  {
    label: '슈퍼카',
    value: '슈퍼카'
  },
  {
    label: '스포츠카',
    value: '스포츠카'
  },
  {
    label: '스포츠 클래식',
    value: '스포츠 클래식'
  },
  {
    label: '오프로드',
    value: '오프로드'
  }
]

// 랭킹 기준
const rankingTypes = [
  {
    label: '랩타임',
    value: 'LAP_TIME'
  },
  {
    label: '최고속도',
    value: 'TOP_SPEED'
  }
]

/**
 * 이동수단 랭킹 조회
 */
async function fetchRanking()
{
  loading.value = true

  try
  {
    const params = {
      type: selectedRankingType.value
    }

    // 전체가 아닌 경우에만 category 전달
    if (selectedCategory.value)
    {
      params.category = selectedCategory.value
    }

    const response = await http.get('/rankings', {
      params
    })

    rankingList.value = response.data
  }
  catch (error)
  {
    console.error('랭킹 조회 실패:', error)
    rankingList.value = []
  }
  finally
  {
    loading.value = false
  }
}

/**
 * 랩타임 표시
 * 예: 62345 -> 1:02:345
 */
function formatLapTime(ms)
{
  if (ms == null)
  {
    return '-'
  }

  const value = Number(ms)

  const minutes = Math.floor(value / 60000)
  const seconds = Math.floor((value % 60000) / 1000)
  const millis = value % 1000

  return `${minutes}:${String(seconds).padStart(2, '0')}:${String(millis).padStart(3, '0')}`
}

/**
 * 현재 랭킹 기준에 따른 기록 표시
 */
function formatRankingValue(item)
{
  if (selectedRankingType.value === 'LAP_TIME')
  {
    return formatLapTime(item.lapTime)
  }

  return format.formatSpeed(item.topSpeed)
}

// 랭킹 기준 또는 차량 분류 변경 시 다시 조회
watch(
  [selectedRankingType, selectedCategory],
  () =>
  {
    fetchRanking()
  }
)

// 최초 진입
onMounted(() =>
{
  fetchRanking()
})
</script>