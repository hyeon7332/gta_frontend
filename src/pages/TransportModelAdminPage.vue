<template>
  <div class="h-full bg-neutral-700">
    <div class="w-full max-w-none px-4 pt-2 pb-4">
      <div class="bg-neutral-600/70 border border-neutral-400 rounded-lg shadow-lg overflow-hidden">
        <div class="p-2">
          <div ref="listCardRef" class="border border-neutral-300 rounded-md overflow-hidden bg-neutral-200/90">
            <!-- toolbar -->
            <div
              class="flex items-center justify-between gap-3 px-3 py-2
                    bg-neutral-300 border-b border-neutral-300"
            >
              <div class="flex items-center gap-2 min-w-0">
                <div class="relative">
                  <input
                    v-model="keyword"
                    type="text"
                    placeholder="제조사 / 모델명 검색"
                    class="h-8 w-[280px] pr-9 pl-3 rounded-md
                          bg-neutral-100 border border-neutral-300
                          text-[13px] text-neutral-800 placeholder-neutral-500
                          outline-none"
                    @keyup.enter="applySearch"
                  />

                  <button
                    v-if="keyword.trim()"
                    type="button"
                    class="absolute right-2 top-1/2 -translate-y-1/2
                          h-6 w-6 flex items-center justify-center
                          rounded-md
                          text-neutral-400 hover:text-neutral-200
                          hover:bg-neutral-700/60
                          transition"
                    @click="clearKeyword"
                  >
                    <X class="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  class="h-8 shrink-0 px-3 rounded-md
                        bg-neutral-200/80 border border-neutral-300
                        text-[13px] text-neutral-800
                        hover:bg-neutral-300 active:bg-neutral-200 transition"
                  @click="applySearch"
                >
                  검색
                </button>

                <button
                  type="button"
                  class="h-8 w-8 shrink-0 flex items-center justify-center rounded-md
                        bg-neutral-100 border border-neutral-300
                        text-neutral-800 hover:text-neutral-700
                        hover:bg-neutral-200 active:bg-neutral-100 transition"
                  title="검색/정렬 초기화"
                  @click="resetFilters"
                >
                  <RotateCcw class="w-4 h-4" />
                </button>
              </div>

              <div class="flex items-center gap-2 shrink-0 ml-3">
                <button
                  v-if="selectedRow"
                  type="button"
                  class="h-8 shrink-0 px-3 rounded-md
                        bg-neutral-100 border border-neutral-300
                        text-[13px] text-neutral-800
                        hover:bg-neutral-200 active:bg-neutral-100 transition"
                  @click="openEdit"
                >
                  수정
                </button>

                <button
                  v-if="selectedRow"
                  type="button"
                  class="h-8 shrink-0 px-3 rounded-md
                        bg-red-100 border border-red-300
                        text-[13px] text-red-700
                        hover:bg-red-200 active:bg-red-100 transition"
                  @click="openDelete"
                >
                  삭제
                </button>

                <button
                  type="button"
                  class="h-8 shrink-0 px-3 flex items-center gap-1
                        rounded-md
                        bg-neutral-100
                        border border-neutral-300
                        text-[13px] text-neutral-800
                        hover:bg-neutral-200
                        active:bg-neutral-100
                        transition"
                  @click="openAdd"
                >
                  <Plus class="w-4 h-4 shrink-0" />
                  <span class="whitespace-nowrap">추가</span>
                </button>
              </div>
            </div>

            <!-- filter bar -->
            <div
              class="flex flex-wrap items-center gap-2 px-3 py-2
                    bg-neutral-300 border-b border-neutral-300"
            >
              <!-- 제조사 -->
              <div class="relative" ref="manufacturerDropdownRef">
                <button
                  type="button"
                  class="h-8 w-[250px] px-3 rounded-md flex items-center justify-between
                        bg-neutral-100 border border-neutral-300
                        text-[13px] text-neutral-800 hover:bg-neutral-200 transition"
                  @click="toggleManufacturerDropdown"
                >
                  <span class="truncate">{{ manufacturerFilterLabel }}</span>
                  <ChevronDown class="w-4 h-4 text-neutral-400" />
                </button>

                <div
                  v-if="showManufacturerDropdown"
                  class="absolute left-0 top-10 z-20 w-[250px] max-h-[260px] overflow-auto
                        rounded-md border border-neutral-300 bg-neutral-200 shadow-lg p-1"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-800 hover:bg-neutral-200/70 transition"
                    @click="selectManufacturer('')"
                  >
                    <span>전체</span>
                    <span
                      v-if="manufacturerFilter === ''"
                      class="text-[11px] text-neutral-400"
                    >
                      선택됨
                    </span>
                  </button>

                  <div class="mx-2 border-t border-neutral-300"></div>

                  <button
                    v-for="item in manufacturerOptions"
                    :key="item"
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-800 hover:bg-neutral-200/70 transition"
                    @click="selectManufacturer(item)"
                  >
                    <span class="truncate">{{ item }}</span>
                    <span
                      v-if="manufacturerFilter === item"
                      class="text-[11px] text-neutral-400"
                    >
                      선택됨
                    </span>
                  </button>
                </div>
              </div>

              <!-- 분류 -->
              <div class="relative" ref="categoryDropdownRef">
                <button
                  type="button"
                  class="h-8 w-[250px] px-3 rounded-md flex items-center justify-between
                        bg-neutral-100 border border-neutral-300
                        text-[13px] text-neutral-800 hover:bg-neutral-200 transition"
                  @click="toggleCategoryDropdown"
                >
                  <span class="truncate">{{ categoryFilterLabel }}</span>
                  <ChevronDown class="w-4 h-4 text-neutral-400" />
                </button>

                <div
                  v-if="showCategoryDropdown"
                  class="absolute left-0 top-10 z-20 w-[250px] max-h-[260px] overflow-auto
                        rounded-md border border-neutral-300 bg-neutral-100 shadow-lg p-1"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-800 hover:bg-neutral-200/70 transition"
                    @click="clearMultiFilter('category')"
                  >
                    <span>전체</span>
                  </button>

                  <div class="mx-2 border-t border-neutral-300"></div>

                  <label
                    v-for="item in categoryOptions"
                    :key="item"
                    class="flex items-center gap-2 px-2 py-2 rounded cursor-pointer
                          text-[13px] text-neutral-800 hover:bg-neutral-200/70"
                  >
                    <input
                      type="checkbox"
                      :value="item"
                      :checked="categoryFilters.includes(item)"
                      @change="toggleMultiFilter('category', item)"
                    />
                    <span class="truncate">{{ item }}</span>
                  </label>
                </div>
              </div>

              <!-- 개조위치 -->
              <div class="relative" ref="upgradeLocationDropdownRef">
                <button
                  type="button"
                  class="h-8 w-[250px] px-3 rounded-md flex items-center justify-between
                        bg-neutral-100 border border-neutral-300
                        text-[13px] text-neutral-800 hover:bg-neutral-200 transition"
                  @click="toggleUpgradeLocationDropdown"
                >
                  <span class="truncate">{{ getMultiFilterLabel('개조위치', upgradeLocationFilters) }}</span>
                  <ChevronDown class="w-4 h-4 text-neutral-400" />
                </button>

                <div
                  v-if="showUpgradeLocationDropdown"
                  class="absolute left-0 top-10 z-20 w-[250px] max-h-[260px] overflow-auto
                        rounded-md border border-neutral-300 bg-neutral-100 shadow-lg p-1"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-800 hover:bg-neutral-200/70 transition"
                    @click="clearMultiFilter('upgradeLocation')"
                  >
                    <span>전체</span>
                  </button>

                  <div class="mx-2 border-t border-neutral-300"></div>

                  <label
                    v-for="item in upgradeLocationOptions"
                    :key="item"
                    class="flex items-center gap-2 px-2 py-2 rounded cursor-pointer
                          text-[13px] text-neutral-800 hover:bg-neutral-200/70"
                  >
                    <input
                      type="checkbox"
                      :value="item"
                      :checked="upgradeLocationFilters.includes(item)"
                      @change="toggleMultiFilter('upgradeLocation', item)"
                    />
                    <span class="truncate">{{ item }}</span>
                  </label>
                </div>
              </div>

              <!-- 획득처 -->
              <div class="relative" ref="sourceDropdownRef">
                <button
                  type="button"
                  class="h-8 w-[250px] px-3 rounded-md flex items-center justify-between
                        bg-neutral-100 border border-neutral-300
                        text-[13px] text-neutral-800 hover:bg-neutral-200 transition"
                  @click="toggleSourceDropdown"
                >
                  <span class="truncate">{{ sourceFilterLabel }}</span>
                  <ChevronDown class="w-4 h-4 text-neutral-400" />
                </button>

                <div
                  v-if="showSourceDropdown"
                  class="absolute left-0 top-10 z-20 w-[250px] max-h-[260px] overflow-auto
                        rounded-md border border-neutral-300 bg-neutral-100 shadow-lg p-1"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-800 hover:bg-neutral-200/70 transition"
                    @click="clearMultiFilter('source')"
                  >
                    <span>전체</span>
                  </button>

                  <div class="mx-2 border-t border-neutral-300"></div>

                  <label
                    v-for="item in sourceOptionsList"
                    :key="item"
                    class="flex items-center gap-2 px-2 py-2 rounded cursor-pointer
                          text-[13px] text-neutral-800 hover:bg-neutral-200/70"
                  >
                    <input
                      type="checkbox"
                      :value="item"
                      :checked="sourceFilters.includes(item)"
                      @change="toggleMultiFilter('source', item)"
                    />
                    <span class="truncate">{{ item }}</span>
                  </label>
                </div>
              </div>

              <!-- 특징 -->
              <div class="relative" ref="featureDropdownRef">
                <button
                  type="button"
                  class="h-8 w-[250px] px-3 rounded-md flex items-center justify-between
                        bg-neutral-100 border border-neutral-300
                        text-[13px] text-neutral-800 hover:bg-neutral-200 transition"
                  @click="toggleFeatureDropdown"
                >
                  <span class="truncate">{{ featureFilterLabel }}</span>
                  <ChevronDown class="w-4 h-4 text-neutral-400" />
                </button>

                <div
                  v-if="showFeatureDropdown"
                  class="absolute left-0 top-10 z-20 w-[250px] max-h-[260px] overflow-auto
                        rounded-md border border-neutral-300 bg-neutral-100 shadow-lg p-1"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-800 hover:bg-neutral-200/70 transition"
                    @click="clearMultiFilter('feature')"
                  >
                    <span>전체</span>
                  </button>

                  <div class="mx-2 border-t border-neutral-300"></div>

                  <label
                    v-for="item in featureOptions"
                    :key="item.codeValue"
                    class="flex items-center gap-2 px-2 py-2 rounded cursor-pointer
                          text-[13px] text-neutral-800 hover:bg-neutral-200/70"
                  >
                    <input
                      type="checkbox"
                      :value="item.codeValue"
                      :checked="featureFilters.includes(item.codeValue)"
                      @change="toggleMultiFilter('feature', item.codeValue)"
                    />
                    <span class="truncate">{{ item.codeName }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- table -->
            <div class="scroll-dark mt-2 sm:mt-3 w-full overflow-auto max-h-[calc(100dvh-285px)]">
              <table class="w-full text-sm text-neutral-800 border-collapse table-fixed">
                <thead class="bg-neutral-100">
                  <tr class="text-[13px] text-neutral-800 font-medium tracking-wide whitespace-nowrap bg-neutral-100/70">
                    <th class="px-3 py-2 text-left w-[160px] border-b border-r border-neutral-300">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('manufacturer')"
                      >
                        제조사
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('manufacturer') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[250px] border-b border-r border-neutral-300">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('name')"
                      >
                        모델명
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('name') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[140px] border-b border-r border-neutral-300">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('category')"
                      >
                        분류
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('category') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[400px] border-b border-r border-neutral-300">개조위치</th>

                    <th class="px-3 py-2 text-left w-[90px] border-b border-r border-neutral-300">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('lapTime')"
                      >
                        랩 타임
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('lapTime') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[100px] border-b border-r border-neutral-300">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('topSpeed')"
                      >
                        최고속도
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('topSpeed') }}</span>
                      </button>
                    </th>

                    <!-- 개인 랩타임 -->
                    <th class="px-3 py-2 text-left w-[100px] border-b border-r border-neutral-300">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('personalLapTime')"
                      >
                        개인 랩타임
                        <span class="text-[11px] text-neutral-400">
                          {{ getSortMark('personalLapTime') }}
                        </span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[100px] border-b border-r border-neutral-300">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('price')"
                      >
                        가격
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('price') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[110px] border-b border-r border-neutral-300">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('releaseDate')"
                      >
                        출시일
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('releaseDate') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[350px] border-b border-r border-neutral-300">획득처</th>
                    <th class="px-3 py-2 text-left w-[400px] border-b border-r border-neutral-300">특징</th>
                  </tr>
                </thead>

                <tbody class="text-[13px] text-neutral-800">
                  <!-- 검색 결과 없음 -->
                  <tr v-if="rows.length === 0">
                    <td
                      colspan="10"
                      class="h-[500px] text-center align-middle
                            text-[14px] text-neutral-500
                            border-b border-neutral-300"
                    >
                      검색 결과가 없습니다.
                    </td>
                  </tr>

                  <!-- 데이터 목록 -->
                  <tr
                    v-for="(row, index) in displayRows"
                    v-else
                    :key="row ? row.id ?? row.transportModelId ?? `${row.manufacturer}-${row.name}-${index}` : `empty-${index}`"
                    :class="row ? `${getRowClass(row)} group transition cursor-pointer` : ''"
                    @click="selectRow(row)"
                    @dblclick="handleRowDblClick(row)"
                  >
                    <template v-if="row">
                      <td class="px-3 py-2 text-left border-b border-neutral-300 truncate">
                        {{ displayValue(row.manufacturer) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-300">
                        <div class="flex items-center gap-1.5 min-w-0">
                          <span class="truncate">
                            {{ displayValue(row.name) }}
                          </span>

                          <span
                            v-for="badge in format.formatFeatureBadges(row.features)"
                            :key="badge"
                            class="shrink-0 relative px-1.5 py-0
                                  rounded border border-neutral-300/70
                                  bg-neutral-100 text-[9px]
                                  text-neutral-800 whitespace-nowrap"
                          >
                            {{ badge }}
                          </span>
                        </div>
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-300 truncate">
                        {{ displayValue(row.transportCategory) }}
                      </td>

                      <td 
                        class="px-3 py-2 text-left border-b border-neutral-300 truncate"
                        :title="row.upgradeLocation"
                      >
                        {{ displayValue(row.upgradeLocation) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-300 tabular-nums whitespace-nowrap">
                        {{ formatLapTime(row.lapTime) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-300 tabular-nums whitespace-nowrap">
                        {{ format.formatSpeed(row.topSpeed) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-300 tabular-nums whitespace-nowrap">
                        {{ formatLapTime(row.personalLapTime) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-300 tabular-nums whitespace-nowrap">
                        {{ format.formatCurrencyUSD(row.price) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-300 tabular-nums whitespace-nowrap">
                        {{ format.formatDate(row.releaseDate) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-300 truncate">{{ displayValue(row.source) }}</td>

                      <td
                        class="px-3 py-2 text-left border-b border-neutral-300 truncate"
                        :title="displayFeatureNames(row.features)"
                      >
                        {{ displayFeatureNames(row.features) }}
                      </td>
                      
                    </template>

                    <template v-else>
                      <td colspan="10" class="h-[40px] border-b border-neutral-400/70 bg-neutral-100/60"></td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- footer (pagination bar) -->
            <div class="flex items-center justify-between px-4 py-2 border-t border-neutral-300 bg-neutral-100/70">
              <div class="text-[12px] text-neutral-600 font-medium tracking-wide">
                총 {{ total }}건 / {{ page }} / {{ totalPages }} 페이지
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="px-2.5 h-8 rounded border border-neutral-300 bg-neutral-100/90 text-[12px] text-neutral-800
                        hover:bg-neutral-200 active:bg-neutral-100 disabled:opacity-40 disabled:cursor-default transition"
                  :disabled="page <= 1"
                  @click="changePage(page - 1)"
                >
                  이전
                </button>

                <button
                  v-for="num in pageNumbers"
                  :key="num"
                  type="button"
                  class="min-w-[30px] h-7 px-2 rounded border text-[12px] leading-none transition"
                  :class="num === page
                    ? 'border-neutral-800 bg-neutral-800 text-white font-bold shadow-sm'
                    : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:bg-neutral-200'"
                  @click="changePage(num)"
                >
                  {{ num }}
                </button>

                <button
                  type="button"
                  class="px-2.5 h-8 rounded border border-neutral-300 bg-neutral-100/90 text-[12px] text-neutral-800
                        hover:bg-neutral-200 active:bg-neutral-100 disabled:opacity-40 disabled:cursor-default transition"
                  :disabled="page >= totalPages"
                  @click="changePage(page + 1)"
                >
                  다음
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

  <TransportModelModal
    :open="showAdd"
    mode="create"
    @close="showAdd = false"
    @saved="load()"
  />

  <TransportModelModal
    :open="showEdit"
    mode="edit"
    :model="editTarget"
    @close="showEdit = false; editTarget = null"
    @saved="load()"
  />

  <GlobalLoading :visible="loading" />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Plus, X, RotateCcw, ChevronDown } from 'lucide-vue-next'
import { http } from '@/api/http'
import * as format from '@/utils/format'
import TransportModelModal from '@/components/TransportModelModal.vue'
import GlobalLoading from '@/components/GlobalLoading.vue'

const rows = ref([])
const keyword = ref('')
const sort = ref('default')
const showAdd = ref(false)
const showEdit = ref(false)
const editTarget = ref(null)
const selectedRow = ref(null)
const listCardRef = ref(null)
const loading = ref(false)
let loadingTimer = null

const manufacturerFilter = ref('')
const categoryFilters = ref([])
const sourceFilters = ref([])

const upgradeLocationFilters = ref([])
const featureFilters = ref([])

const showUpgradeLocationDropdown = ref(false)
const showFeatureDropdown = ref(false)

const upgradeLocationDropdownRef = ref(null)
const featureDropdownRef = ref(null)

const manufacturerOptions = ref([])
const categoryOptions = ref([])
const sourceOptionsList = ref([])
const upgradeLocationOptions = ref([])
const featureOptions = ref([])

const showManufacturerDropdown = ref(false)
const showCategoryDropdown = ref(false)
const showSourceDropdown = ref(false)

const manufacturerDropdownRef = ref(null)
const categoryDropdownRef = ref(null)
const sourceDropdownRef = ref(null)

const page = ref(1)
const size = ref(15)
const total = ref(0)
const totalPages = ref(1)

const displayRows = computed(() => {
  const minRows = size.value
  const emptyCount = Math.max(0, minRows - rows.value.length)

  return [
    ...rows.value,
    ...Array.from({ length: emptyCount }, () => null)
  ]
})

const pageNumbers = computed(() => {
  const blockSize = 10
  const currentBlock = Math.floor((page.value - 1) / blockSize)
  const startPage = currentBlock * blockSize + 1
  const endPage = Math.min(startPage + blockSize - 1, totalPages.value)
  
  const pages = []

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

const manufacturerFilterLabel = computed(() => {
  return manufacturerFilter.value || '제조사'
})

const categoryFilterLabel = computed(() => {
  return getMultiFilterLabel('분류', categoryFilters.value)
})

const sourceFilterLabel = computed(() => {
  return getMultiFilterLabel('획득처', sourceFilters.value)
})

const featureFilterLabel = computed(() => {
  if (!featureFilters.value || featureFilters.value.length === 0) {
    return '특징'
  }

  if (featureFilters.value.length > 1) {
    return `특징 ${featureFilters.value.length}개`
  }

  const matched = featureOptions.value.find((option) => {
    return option.codeValue === featureFilters.value[0]
  })

  return matched ? matched.codeName : featureFilters.value[0]
})

async function load()
{
  clearTimeout(loadingTimer)

  loadingTimer = setTimeout(() => {
    loading.value = true
  }, 700)

  try {
    const res = await http.get('/transport-models', {
      params: {
        keyword: keyword.value,
        manufacturer: manufacturerFilter.value,
        categories: categoryFilters.value,
        sources: sourceFilters.value,
        upgradeLocations: upgradeLocationFilters.value,
        features: featureFilters.value,
        page: page.value,
        size: size.value,
        sort: sort.value
      }
    })

    const data = res.data

    const list =
      (Array.isArray(data?.items) && data.items) ||
      (Array.isArray(data?.list) && data.list) ||
      (Array.isArray(data?.content) && data.content) ||
      (Array.isArray(data?.data) && data.data) ||
      (Array.isArray(data) && data) ||
      []

    const totalCount =
      (Number.isFinite(data?.total) && data.total) ||
      (Number.isFinite(data?.count) && data.count) ||
      (Number.isFinite(data?.totalElements) && data.totalElements) ||
      (Array.isArray(list) ? list.length : 0)

    rows.value = list.map((x) => ({
      ...x,
      id: x.id ?? x.transportModelId ?? x.modelId
    }))

    total.value = totalCount
    totalPages.value = Math.max(1, Math.ceil(totalCount / size.value))

    clearSelectionIfNotExists()
  } catch (err) {
    console.error('이동수단 모델 목록 조회 실패:', err)
    rows.value = []
    total.value = 0
    totalPages.value = 1
    selectedRow.value = null
  } finally {
    clearTimeout(loadingTimer)
    loadingTimer = null
    loading.value = false
  }
}

async function loadCommonCodes()
{
  try {
    const groups = [
      ['MANUFACTURER', manufacturerOptions],
      ['TRANSPORT_CATEGORY', categoryOptions],
      ['TRANSPORT_SOURCE', sourceOptionsList],
      ['UPGRADE_LOCATION', upgradeLocationOptions],
      ['FEATURE', featureOptions]
    ]

    await Promise.all(
      groups.map(async ([groupCode, target]) => {
        const res = await http.get('/common-codes', {
          params: {
            groupCode
          }
        })

        if (groupCode === 'FEATURE') {
          target.value = res.data
        } else {
          target.value = res.data.map((item) => {
            return item.codeName
          })
        }

      })
    )
  } catch (err) {
    console.error('공통코드 조회 실패:', err)
  }
}

function changePage(newPage)
{
  if (newPage < 1 || newPage > totalPages.value) {
    return
  }

  page.value = newPage
  load()
}

function applySearch()
{
  page.value = 1
  load()
}

function resetFilters()
{
  keyword.value = ''
  sort.value = 'default'

  manufacturerFilter.value = ''
  categoryFilters.value = []
  sourceFilters.value = []
  upgradeLocationFilters.value = []
  featureFilters.value = []

  closeSingleFilterDropdowns()
  showUpgradeLocationDropdown.value = false
  showFeatureDropdown.value = false

  page.value = 1
  load()
}

function toggleSort(field)
{
  const currentState = getSortState(field)

  if (currentState === 'none') {
    sort.value = `${field}_asc`
  } else if (currentState === 'asc') {
    sort.value = `${field}_desc`
  } else {
    sort.value = 'default'
  }

  page.value = 1
  load()
}

function getSortState(field)
{
  if (sort.value === `${field}_asc`) {
    return 'asc'
  }

  if (sort.value === `${field}_desc`) {
    return 'desc'
  }

  return 'none'
}

function getSortMark(field)
{
  const state = getSortState(field)

  if (state === 'asc') {
    return '▲'
  }

  if (state === 'desc') {
    return '▼'
  }

  return ''
}

function clearKeyword()
{
  keyword.value = ''
  page.value = 1
  load()
}

function applyFilterChange()
{
  page.value = 1
  load()
}

function closeSingleFilterDropdowns()
{
  showManufacturerDropdown.value = false
  showCategoryDropdown.value = false
  showSourceDropdown.value = false
}

function toggleManufacturerDropdown()
{
  const next = !showManufacturerDropdown.value
  closeSingleFilterDropdowns()
  showUpgradeLocationDropdown.value = false
  showFeatureDropdown.value = false
  showManufacturerDropdown.value = next
}

function toggleCategoryDropdown()
{
  const next = !showCategoryDropdown.value
  closeSingleFilterDropdowns()
  showUpgradeLocationDropdown.value = false
  showFeatureDropdown.value = false
  showCategoryDropdown.value = next
}

function toggleSourceDropdown()
{
  const next = !showSourceDropdown.value
  closeSingleFilterDropdowns()
  showUpgradeLocationDropdown.value = false
  showFeatureDropdown.value = false
  showSourceDropdown.value = next
}

function selectManufacturer(value)
{
  manufacturerFilter.value = value
  showManufacturerDropdown.value = false
  applyFilterChange()
}

function clearMultiFilter(type)
{
  if (type === 'upgradeLocation') {
    upgradeLocationFilters.value = []
    showUpgradeLocationDropdown.value = false
  } else if (type === 'source') {
    sourceFilters.value = []
    showSourceDropdown.value = false
  } else if (type === 'category') {
    categoryFilters.value = []
    showCategoryDropdown.value = false
  } else {
    featureFilters.value = []
    showFeatureDropdown.value = false
  }

  applyFilterChange()
}

function toggleUpgradeLocationDropdown()
{
  const next = !showUpgradeLocationDropdown.value
  closeSingleFilterDropdowns()
  showFeatureDropdown.value = false
  showUpgradeLocationDropdown.value = next
}

function toggleFeatureDropdown()
{
  const next = !showFeatureDropdown.value
  closeSingleFilterDropdowns()
  showUpgradeLocationDropdown.value = false
  showFeatureDropdown.value = next
}

function toggleMultiFilter(type, value)
{
  let target = featureFilters

  if (type === 'upgradeLocation') {
    target = upgradeLocationFilters
  } else if (type === 'source') {
    target = sourceFilters
  } else if (type === 'category') {
    target = categoryFilters
  }

  const current = [...target.value]
  const index = current.indexOf(value)

  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(value)
  }

  target.value = current
  applyFilterChange()
}

function getMultiFilterLabel(label, values)
{
  if (!values || values.length === 0) {
    return label
  }

  if (values.length === 1) {
    return values[0]
  }

  return `${label} ${values.length}개`
}

function openAdd()
{
  selectedRow.value = null
  showAdd.value = true
}

function selectRow(row)
{
  if (!row) {
    return
  }

  if (isSelected(row)) {
    selectedRow.value = null
    return
  }

  selectedRow.value = row
}

function isSelected(row)
{
  if (!row || !selectedRow.value) {
    return false
  }

  const rowKey = getRowKey(row)
  const selectedKey = getRowKey(selectedRow.value)

  if (rowKey !== null && selectedKey !== null) {
    return rowKey === selectedKey
  }

  return row === selectedRow.value
}

function getRowKey(row)
{
  if (!row) {
    return null
  }

  if (row.id !== undefined && row.id !== null) {
    return row.id
  }

  if (row.transportModelId !== undefined && row.transportModelId !== null) {
    return row.transportModelId
  }

  return `${row.manufacturer ?? ''}-${row.name ?? ''}`
}

function getRowClass(row)
{
  if (!row) {
    return 'bg-neutral-100/70'
  }

  if (isSelected(row)) {
    return 'bg-slate-300 hover:bg-slate-300'
  }

  return 'bg-neutral-200 hover:bg-neutral-100'
}

function clearSelectionIfNotExists()
{
  if (!selectedRow.value) {
    return
  }

  const exists = rows.value.some((row) => {
    return isSelected(row)
  })

  if (!exists) {
    selectedRow.value = null
  }
}

function openEdit()
{
  if (!selectedRow.value) {
    return
  }

  editTarget.value = { ...selectedRow.value }
  showEdit.value = true
}

function handleRowDblClick(row)
{
  if (!row) {
    return
  }

  selectedRow.value = row
  openEdit()
}

async function openDelete()
{
  if (!selectedRow.value) {
    return
  }

  if (Number(selectedRow.value.ownedCount ?? 0) > 0) {
    alert('차고 리스트에 등록된 이동수단은 삭제할 수 없습니다.')
    return
  }

  const targetId = selectedRow.value.id ?? selectedRow.value.transportModelId ?? selectedRow.value.modelId

  if (!targetId) {
    alert('삭제할 모델 ID를 찾을 수 없습니다.')
    return
  }

  const targetName = `${selectedRow.value.manufacturer ?? ''} ${selectedRow.value.name ?? ''}`.trim()
  const confirmed = window.confirm(`[${targetName}] 모델을 삭제하시겠습니까?`)

  if (!confirmed) {
    return
  }

  try {
    await http.delete(`/transport-models/${targetId}`)

    alert('삭제 완료')
    selectedRow.value = null

    if (rows.value.length === 1 && page.value > 1) {
      page.value = page.value - 1
    }

    await load()
  } catch (err) {
    console.error('이동수단 모델 삭제 실패:', err)
    alert('삭제 실패')
  }
}

function handleDocumentClick(event)
{
  const target = event.target

  if (!(target instanceof Node)) {
    return
  }

  if (selectedRow.value && listCardRef.value && !listCardRef.value.contains(target)) {
    selectedRow.value = null
  }

  if (upgradeLocationDropdownRef.value && !upgradeLocationDropdownRef.value.contains(target)) {
    showUpgradeLocationDropdown.value = false
  }

  if (featureDropdownRef.value && !featureDropdownRef.value.contains(target)) {
    showFeatureDropdown.value = false
  }

  if (manufacturerDropdownRef.value && !manufacturerDropdownRef.value.contains(target)) {
    showManufacturerDropdown.value = false
  }

  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(target)) {
    showCategoryDropdown.value = false
  }

  if (sourceDropdownRef.value && !sourceDropdownRef.value.contains(target)) {
    showSourceDropdown.value = false
  }
}

function formatLapTime(ms)
{
  if (ms === null || ms === undefined || ms === '') {
    return '-'
  }

  const value = Number(ms)

  if (!Number.isFinite(value)) {
    return ''
  }

  const minutes = Math.floor(value / 60000)
  const seconds = Math.floor((value % 60000) / 1000)
  const millis = value % 1000

  return `${minutes}:${String(seconds).padStart(2, '0')}:${String(millis).padStart(3, '0')}`
}

function displayValue(value)
{
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return value
}

function displayFeatureNames(features)
{
  if (!features || features.trim() === '') {
    return '-'
  }

  return features
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
    .join(', ')
}

onMounted(() => {
  loadCommonCodes()
  load()
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  clearTimeout(loadingTimer)
  document.removeEventListener('click', handleDocumentClick)
})
</script>