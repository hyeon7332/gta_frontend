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
              class="px-4 py-3
                     bg-neutral-300
                     border-b border-neutral-400"
            >
              <!-- 제목 + 랭킹 기준 -->
              <div class="flex items-center justify-between gap-4">
                <h1 class="text-xl font-bold text-neutral-900">
                  이동수단 랭킹
                </h1>

                <!-- 랭킹 기준 -->
                <div
                  class="flex items-center gap-4
                        px-3 py-1.5
                        rounded-md border border-neutral-300
                        bg-neutral-50"
                >
                  <label
                    v-for="type in rankingTypes"
                    :key="type.value"
                    class="flex items-center gap-1.5 cursor-pointer
                          text-[13px] text-neutral-700"
                  >
                    <input
                      v-model="selectedRankingType"
                      type="radio"
                      name="rankingType"
                      :value="type.value"
                      class="cursor-pointer"
                    />

                    <span>
                      {{ type.label }}
                    </span>
                  </label>
                </div>

              </div>

              <!-- 차량 분류 + 초기화 -->
              <div class="mt-4 flex items-center justify-between gap-4">

                <!-- 차량 분류 -->
                <div
                  class="relative"
                  ref="categoryDropdownRef"
                >
                  <button
                    type="button"
                    class="h-8 w-[250px] px-3 rounded-md flex items-center justify-between
                          bg-neutral-100 border border-neutral-300
                          text-[13px] text-neutral-800 hover:bg-neutral-200 transition"
                    @click="showCategoryDropdown = !showCategoryDropdown"
                  >
                    <span class="truncate">
                      {{ categoryFilterLabel }}
                    </span>

                    <ChevronDown class="w-4 h-4 text-neutral-400" />
                  </button>

                  <div
                    v-if="showCategoryDropdown"
                    class="absolute left-0 top-10 z-20 w-[250px] max-h-[260px] overflow-auto
                          rounded-md border border-neutral-300 bg-neutral-100 shadow-lg p-1"
                  >
                    <!-- 전체 -->
                    <button
                      type="button"
                      class="w-full flex items-center justify-between px-2 py-2 rounded
                            text-[13px] text-neutral-800 hover:bg-neutral-200/70 transition"
                      @click="clearCategory"
                    >
                      <span>전체</span>
                    </button>

                    <!-- 구분선 -->
                    <div class="mx-2 border-t border-neutral-300"></div>

                    <!-- 이동수단 분류 목록 -->
                    <label
                      v-for="item in categoryOptions"
                      :key="item"
                      class="flex items-center gap-2 px-2 py-2 rounded cursor-pointer
                            text-[13px] text-neutral-800 hover:bg-neutral-200/70"
                    >
                      <input
                        type="checkbox"
                        :value="item"
                        :checked="selectedCategories.includes(item)"
                        @change="toggleCategory(item)"
                      />

                      <span class="truncate">
                        {{ item }}
                      </span>
                    </label>
                  </div>
                </div>

                <!-- 초기화 -->
                <button
                  type="button"
                  class="h-8 w-8 shrink-0
                        flex items-center justify-center
                        rounded-md
                        bg-neutral-100
                        border border-neutral-400
                        text-neutral-700
                        hover:bg-neutral-200
                        active:bg-neutral-300
                        transition"
                  title="초기화"
                  @click="resetRanking"
                >
                  <RotateCcw class="w-4 h-4" />
                </button>

              </div>

            </div>

            <!-- 랭킹 영역 -->
            <div
              class="scroll-dark
                    h-[calc(100dvh-250px)]
                    [@media(min-height:1200px)]:h-[calc(100dvh-310px)]
                    overflow-y-auto overflow-x-hidden
                    px-4 pt-2.5 pb-4 bg-neutral-200/90"
            >
              <!-- 로딩 -->
              <div
                v-if="loading"
                class="py-16 text-center text-sm text-neutral-500"
              >
                랭킹을 불러오는 중입니다.
              </div>

              <!-- 데이터 없음 -->
              <div
                v-else-if="top3List.length === 0 && rankingList.length === 0"
                class="py-16 text-center text-sm text-neutral-500"
              >
                해당 조건의 랭킹 데이터가 없습니다.
              </div>

              <!-- 랭킹 데이터 -->
              <template v-else>

                <!-- TOP 3 -->
                <div
                  v-if="top3List.length > 0"
                  class="pt-6"
                >
                  <div
                    class="grid grid-cols-1 md:grid-cols-3
                           gap-4 items-end
                           max-w-[1050px] mx-auto"
                  >
                    <!-- 2위 -->
                    <div
                      v-if="top3List[1]"
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
                          v-if="top3List[1].imageUrl"
                          :src="format.resolveThumbnailUrl(top3List[1].imageUrl)"
                          :alt="top3List[1].name"
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

                        <!-- 2위 메달 -->
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
                          {{ top3List[1].manufacturer }}
                        </p>

                        <div class="mt-0.5 flex min-w-0 items-center gap-1">
                          <h2 class="truncate text-base font-bold leading-tight text-neutral-900">
                            {{ top3List[1].name }}
                          </h2>

                          <span
                            v-for="badge in format.formatFeatureBadges(top3List[1].features)"
                            :key="badge"
                            class="shrink-0 rounded-md
                                   border border-neutral-300
                                   bg-neutral-100
                                   px-1.5 py-[1px]
                                   text-[9px] font-medium text-neutral-600"
                          >
                            {{ badge }}
                          </span>
                        </div>

                        <p class="mt-1 text-right text-sm font-bold leading-tight text-neutral-800">
                          {{ formatRankingValue(top3List[1]) }}
                        </p>
                      </div>
                    </div>

                    <!-- 1위 -->
                    <div
                      v-if="top3List[0]"
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
                          v-if="top3List[0].imageUrl"
                          :src="format.resolveThumbnailUrl(top3List[0].imageUrl)"
                          :alt="top3List[0].name"
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

                        <!-- 1위 메달 -->
                        <div class="absolute top-3 left-3 z-10 flex flex-col items-center">
                          <div
                            class="relative flex h-8 w-8 items-center justify-center
                                   rounded-full border-2 border-yellow-600
                                   bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600
                                   text-sm font-extrabold text-yellow-950
                                   shadow-md"
                          >
                            1
                          </div>

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
                          {{ top3List[0].manufacturer }}
                        </p>

                        <div class="mt-0.5 flex min-w-0 items-center gap-1">
                          <h2 class="truncate text-base font-bold leading-tight text-neutral-900">
                            {{ top3List[0].name }}
                          </h2>

                          <span
                            v-for="badge in format.formatFeatureBadges(top3List[0].features)"
                            :key="badge"
                            class="shrink-0 rounded-md
                                   border border-neutral-300
                                   bg-neutral-100
                                   px-1.5 py-[1px]
                                   text-[9px] font-medium text-neutral-600"
                          >
                            {{ badge }}
                          </span>
                        </div>

                        <p class="mt-1 text-right text-sm font-bold leading-tight text-neutral-800">
                          {{ formatRankingValue(top3List[0]) }}
                        </p>
                      </div>
                    </div>

                    <!-- 3위 -->
                    <div
                      v-if="top3List[2]"
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
                          v-if="top3List[2].imageUrl"
                          :src="format.resolveThumbnailUrl(top3List[2].imageUrl)"
                          :alt="top3List[2].name"
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

                        <!-- 3위 메달 -->
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
                          {{ top3List[2].manufacturer }}
                        </p>

                        <div class="mt-0.5 flex min-w-0 items-center gap-1">
                          <h2 class="truncate text-base font-bold leading-tight text-neutral-900">
                            {{ top3List[2].name }}
                          </h2>

                          <span
                            v-for="badge in format.formatFeatureBadges(top3List[2].features)"
                            :key="badge"
                            class="shrink-0 rounded-md
                                   border border-neutral-300
                                   bg-neutral-100
                                   px-1.5 py-[1px]
                                   text-[9px] font-medium text-neutral-600"
                          >
                            {{ badge }}
                          </span>
                        </div>

                        <p class="mt-1 text-right text-sm font-bold leading-tight text-neutral-800">
                          {{ formatRankingValue(top3List[2]) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 4위 이하 -->
                <div
                  v-if="rankingList.length > 0"
                  class="mt-3 border-t border-neutral-300 pt-3"
                >
                  <!-- 카드 목록 -->
                  <div
                    class="grid grid-cols-2 gap-3
                           min-[800px]:grid-cols-3
                           min-[1100px]:grid-cols-4
                           min-[1400px]:grid-cols-5"
                  >
                    <div
                      v-for="(item, index) in rankingList"
                      :key="item.ownedId || item.modelId"
                      class="min-w-0 overflow-hidden
                             rounded-lg border border-neutral-300
                             bg-neutral-100 shadow-sm"
                    >
                      <!-- 이미지 -->
                      <div
                        class="relative aspect-[3/2] shrink-0 overflow-hidden
                               border-b border-neutral-300 bg-neutral-300"
                      >
                        <img
                          v-if="item.imageUrl"
                          :src="format.resolveThumbnailUrl(item.imageUrl)"
                          :alt="item.name"
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

                        <!-- 순위 -->
                        <div
                          class="absolute left-2 top-2
                                 flex h-8 min-w-8 items-center justify-center
                                 rounded-full border border-neutral-300
                                 bg-white/95 px-2
                                 text-[12px] font-bold text-neutral-800
                                 shadow"
                        >
                          {{ 4 + (currentPage - 1) * pageSize + index }}
                        </div>
                      </div>

                      <!-- 차량 정보 -->
                      <div class="px-3 py-2">
                        <!-- 제조사 -->
                        <p class="truncate text-[11px] leading-tight text-neutral-500">
                          {{ item.manufacturer }}
                        </p>

                        <!-- 차량명 + 기능 배지 -->
                        <div class="mt-0.5 flex min-w-0 items-center gap-1">
                          <h3
                            class="min-w-0 truncate
                                   text-[14px] font-bold leading-tight
                                   text-neutral-900"
                          >
                            {{ item.name }}
                          </h3>

                          <span
                            v-for="badge in format.formatFeatureBadges(item.features)"
                            :key="badge"
                            class="shrink-0 rounded-md
                                   border border-neutral-300
                                   bg-neutral-200/70
                                   px-1.5 py-[1px]
                                   text-[9px] font-medium text-neutral-600"
                          >
                            {{ badge }}
                          </span>
                        </div>

                        <!-- 랩타임 / 최고속도 -->
                        <p
                          class="mt-1 text-right
                                 text-[13px] font-bold leading-tight
                                 text-neutral-800"
                        >
                          {{ formatRankingValue(item) }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- 페이징 -->
                  <div
                    v-if="totalPages > 1"
                    class="relative mt-3 flex items-center justify-center"
                  >
                    <!-- 전체 건수 -->
                    <div
                      class="absolute left-0
                            text-[12px] text-neutral-500"
                    >
                      총 {{ totalCount + top3List.length }}건
                    </div>
                    
                    <!-- 페이지 버튼 -->
                    <div class="flex items-center justify-center gap-1">
                      <!-- 이전 -->
                      <button
                        type="button"
                        :disabled="currentPage === 1"
                        class="h-8 px-2.5 rounded-md
                              border border-neutral-300
                              bg-neutral-100
                              text-[12px] text-neutral-700
                              transition
                              hover:bg-neutral-200
                              disabled:cursor-default
                              disabled:opacity-40"
                        @click="changePage(currentPage - 1)"
                      >
                        이전
                      </button>

                      <!-- 페이지 번호 -->
                      <button
                        v-for="page in visiblePages"
                        :key="page"
                        type="button"
                        :class="[
                          'h-8 min-w-8 rounded-md border px-2 text-[12px] transition',
                          currentPage === page
                            ? 'border-neutral-700 bg-neutral-700 text-white'
                            : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        ]"
                        @click="changePage(page)"
                      >
                        {{ page }}
                      </button>

                      <!-- 다음 -->
                      <button
                        type="button"
                        :disabled="currentPage === totalPages"
                        class="h-8 px-2.5 rounded-md
                              border border-neutral-300
                              bg-neutral-100
                              text-[12px] text-neutral-700
                              transition
                              hover:bg-neutral-200
                              disabled:cursor-default
                              disabled:opacity-40"
                        @click="changePage(currentPage + 1)"
                      >
                        다음
                      </button>
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ChevronDown, RotateCcw } from 'lucide-vue-next'
import { http } from '@/api/http'
import * as format from '@/utils/format'

// 현재 선택된 랭킹 기준
const selectedRankingType = ref('PERSONAL_LAP_TIME')

// 현재 선택된 차량 분류
const selectedCategories = ref([])

// 이동수단 분류 목록
const categoryOptions = ref([])

// 이동수단 분류 드롭다운 표시 여부
const showCategoryDropdown = ref(false)

// 이동수단 분류 드롭다운 영역 참조
const categoryDropdownRef = ref(null)

// TOP3 랭킹 데이터
const top3List = ref([])

// 4위 이하 현재 페이지 랭킹 데이터
const rankingList = ref([])

// 조회 상태
const loading = ref(false)

// 현재 페이지
const currentPage = ref(1)

// 페이지당 조회 개수
const pageSize = ref(5)

// 4위 이하 전체 건수
const totalCount = ref(0)

// 전체 페이지 수
const totalPages = computed(() =>
{
  return Math.ceil(totalCount.value / pageSize.value)
})

// 화면에 표시할 페이지 번호
const visiblePages = computed(() =>
{
  const maxVisible = 10

  if (totalPages.value <= maxVisible)
  {
    return Array.from(
      { length: totalPages.value },
      (_, index) => index + 1
    )
  }

  const groupStart =
    Math.floor((currentPage.value - 1) / maxVisible) * maxVisible + 1

  const groupEnd =
    Math.min(groupStart + maxVisible - 1, totalPages.value)

  return Array.from(
    { length: groupEnd - groupStart + 1 },
    (_, index) => groupStart + index
  )
})

// 선택된 이동수단 분류 표시 문구
const categoryFilterLabel = computed(() =>
  format.formatMultiSelectLabel(selectedCategories.value, '전체', categoryOptions.value)
)

// 랭킹 기준
const rankingTypes = [
  {
    label: '랩타임',
    value: 'LAP_TIME'
  },
  {
    label: '최고속도',
    value: 'TOP_SPEED'
  },
  {
    label: '개인 랩타임',
    value: 'PERSONAL_LAP_TIME'
  }
]

// 이동수단 분류 공통코드 조회
async function loadTransportCategories()
{
  try
  {
    const res = await http.get('/common-codes', {
      params: {
        groupCode: 'TRANSPORT_CATEGORY'
      }
    })

    categoryOptions.value = res.data.map((item) => {
      return item.codeName
    })
  }
  catch (err)
  {
    console.error('이동수단 분류 조회 실패:', err)
    categoryOptions.value = []
  }
}

// 이동수단 랭킹 조회
async function fetchRanking(includeTop3 = true)
{
  loading.value = true

  try
  {
    const params = {
      type: selectedRankingType.value,
      page: currentPage.value,
      size: pageSize.value,
      includeTop3
    }

    // 선택된 이동수단 분류가 있는 경우 조회 조건에 추가
    if (selectedCategories.value.length > 0)
    {
      params.categoryList = selectedCategories.value
    }

    const response = await http.get('/rankings', {
      params
    })

    // TOP3 조회 요청인 경우에만 갱신
    if (includeTop3)
    {
      top3List.value = response.data.top3 ?? []
    }
    rankingList.value = response.data.items ?? []
    totalCount.value = response.data.totalCount ?? 0
  }
  catch (error)
  {
    console.error('랭킹 조회 실패:', error)

    // TOP3 조회 요청 중 오류가 발생한 경우에만 초기화
    if (includeTop3)
    {
      top3List.value = []
    }
    rankingList.value = []
    totalCount.value = 0
  }
  finally
  {
    loading.value = false
  }
}

// 화면 높이에 따른 페이지당 조회 개수 설정
function updatePageSize()
{
  const nextSize = window.innerHeight >= 1200 ? 10 : 5

  if (pageSize.value !== nextSize)
  {
    pageSize.value = nextSize
    currentPage.value = 1
    fetchRanking()
  }
}

// 랭킹 조회 조건 초기화
function resetRanking()
{
  // 현재 조회 조건이 기본 상태인지 확인
  const isDefault =
    selectedRankingType.value === 'PERSONAL_LAP_TIME' &&
    selectedCategories.value.length === 0 &&
    currentPage.value === 1

  // 랭킹 기준을 기본값으로 초기화
  selectedRankingType.value = 'PERSONAL_LAP_TIME'

  // 이동수단 분류를 기본값으로 초기화
  selectedCategories.value = []

  // 현재 페이지를 첫 페이지로 초기화
  currentPage.value = 1

  // 이동수단 분류 드롭다운 닫기
  showCategoryDropdown.value = false

  // 이미 기본 조건인 경우 watch가 실행되지 않으므로 직접 재조회
  if (isDefault)
  {
    fetchRanking()
  }
}

// 페이지 변경
function changePage(page)
{
  if (page < 1 || page > totalPages.value)
  {
    return
  }

  currentPage.value = page

  // 페이지 이동 시 TOP3는 재조회하지 않음
  fetchRanking(false)
}

// 랩타임 표시 (예: 62345 -> 1:02:345)
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

// 현재 랭킹 기준에 따른 기록 표시
function formatRankingValue(item)
{
  if (selectedRankingType.value === 'LAP_TIME')
  {
    return formatLapTime(item.lapTime)
  }

  if (selectedRankingType.value === 'PERSONAL_LAP_TIME')
  {
    return formatLapTime(item.personalLapTime)
  }

  return format.formatSpeed(item.topSpeed)
}

// 드롭다운 외부 클릭 시 열려 있는 드롭다운 닫기
function handleDocumentClick(event)
{
  const target = event.target

  if (!(target instanceof Node))
  {
    return
  }

  // 이동수단 분류 드롭다운 외부 클릭 처리
  if (
    categoryDropdownRef.value &&
    !categoryDropdownRef.value.contains(target)
  )
  {
    showCategoryDropdown.value = false
  }
}

// 이동수단 분류 선택 또는 선택 해제
function toggleCategory(value)
{
  const current = [...selectedCategories.value]
  const index = current.indexOf(value)

  if (index > -1)
  {
    current.splice(index, 1)
  }
  else
  {
    current.push(value)
  }

  selectedCategories.value = current
}

// 이동수단 분류 전체 선택
function clearCategory()
{
  selectedCategories.value = []
  showCategoryDropdown.value = false
}

// 랭킹 기준 또는 이동수단 분류 변경 시 첫 페이지부터 다시 조회
watch(
  [selectedRankingType, selectedCategories],
  () =>
  {
    currentPage.value = 1
    fetchRanking()
  },
  {
    deep: true  // 이동수단 분류 배열 내부 변경 감지
  }
)

// 최초 진입
onMounted(async () =>
{
  // 최초 화면 높이에 따라 조회 개수 설정
  pageSize.value = window.innerHeight >= 1200 ? 10 : 5

  // 이동수단 분류 공통코드 조회
  await loadTransportCategories()

  fetchRanking()
  document.addEventListener('click', handleDocumentClick)
  window.addEventListener('resize', updatePageSize)
})

// 컴포넌트 종료 시 이벤트 제거
onBeforeUnmount(() =>
{
  document.removeEventListener('click', handleDocumentClick)
  window.removeEventListener('resize', updatePageSize)
})
</script>