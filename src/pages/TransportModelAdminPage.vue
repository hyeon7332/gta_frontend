<template>
  <div class="h-full bg-neutral-700">
    <div class="w-full max-w-none px-4 pt-2 pb-4">
      <div class="bg-neutral-900/40 border border-neutral-700 rounded-lg shadow-lg overflow-hidden">
        <div class="p-2">
          <div ref="listCardRef" class="border border-neutral-700 rounded-md overflow-hidden">
            <!-- toolbar -->
            <div
              class="flex items-center justify-between gap-3 px-3 py-2
                    bg-neutral-900/30 border-b border-neutral-700"
            >
              <div class="flex items-center gap-2 min-w-0">
                <div class="relative">
                  <input
                    v-model="keyword"
                    type="text"
                    placeholder="제조사 / 모델명 검색"
                    class="h-8 w-[280px] pr-9 pl-3 rounded-md
                          bg-neutral-800/60 border border-neutral-600
                          text-[13px] text-neutral-100 placeholder-neutral-400
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
                        bg-neutral-800/60 border border-neutral-600
                        text-[13px] text-neutral-200
                        hover:bg-neutral-700 active:bg-neutral-600 transition"
                  @click="applySearch"
                >
                  검색
                </button>

                <button
                  type="button"
                  class="h-8 w-8 shrink-0 flex items-center justify-center rounded-md
                        bg-neutral-800/60 border border-neutral-600
                        text-neutral-300 hover:text-white
                        hover:bg-neutral-700 active:bg-neutral-600 transition"
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
                        bg-neutral-800/60 border border-neutral-600
                        text-[13px] text-neutral-200
                        hover:bg-neutral-700 active:bg-neutral-600 transition"
                  @click="openEdit"
                >
                  수정
                </button>

                <button
                  v-if="selectedRow"
                  type="button"
                  class="h-8 shrink-0 px-3 rounded-md
                        bg-neutral-800/60 border border-red-700
                        text-[13px] text-red-300
                        hover:bg-red-900/40 active:bg-red-900/60 transition"
                  @click="openDelete"
                >
                  삭제
                </button>

                <button
                  type="button"
                  class="h-8 shrink-0 px-3 flex items-center gap-1
                        rounded-md
                        bg-neutral-800/60
                        border border-neutral-600
                        text-[13px] text-neutral-200
                        hover:bg-neutral-700
                        active:bg-neutral-600
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
                    bg-neutral-900/20 border-b border-neutral-700"
            >
              <!-- 제조사 -->
              <div class="relative" ref="manufacturerDropdownRef">
                <button
                  type="button"
                  class="h-8 w-[250px] px-3 rounded-md flex items-center justify-between
                        bg-neutral-800/60 border border-neutral-600
                        text-[13px] text-neutral-200 hover:bg-neutral-700 transition"
                  @click="toggleManufacturerDropdown"
                >
                  <span class="truncate">{{ manufacturerFilterLabel }}</span>
                  <ChevronDown class="w-4 h-4 text-neutral-400" />
                </button>

                <div
                  v-if="showManufacturerDropdown"
                  class="absolute left-0 top-10 z-20 w-[250px] max-h-[260px] overflow-auto
                        rounded-md border border-neutral-600 bg-neutral-800 shadow-lg p-1"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-200 hover:bg-neutral-700/70 transition"
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

                  <div class="mx-2 border-t border-neutral-700"></div>

                  <button
                    v-for="item in manufacturerOptions"
                    :key="item"
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-200 hover:bg-neutral-700/70 transition"
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
                        bg-neutral-800/60 border border-neutral-600
                        text-[13px] text-neutral-200 hover:bg-neutral-700 transition"
                  @click="toggleCategoryDropdown"
                >
                  <span class="truncate">{{ categoryFilterLabel }}</span>
                  <ChevronDown class="w-4 h-4 text-neutral-400" />
                </button>

                <div
                  v-if="showCategoryDropdown"
                  class="absolute left-0 top-10 z-20 w-[250px] max-h-[260px] overflow-auto
                        rounded-md border border-neutral-600 bg-neutral-800 shadow-lg p-1"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-200 hover:bg-neutral-700/70 transition"
                    @click="selectCategory('')"
                  >
                    <span>전체</span>
                    <span
                      v-if="categoryFilter === ''"
                      class="text-[11px] text-neutral-400"
                    >
                      선택됨
                    </span>
                  </button>

                  <div class="mx-2 border-t border-neutral-700"></div>

                  <button
                    v-for="item in categoryOptions"
                    :key="item"
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-200 hover:bg-neutral-700/70 transition"
                    @click="selectCategory(item)"
                  >
                    <span class="truncate">{{ item }}</span>
                    <span
                      v-if="categoryFilter === item"
                      class="text-[11px] text-neutral-400"
                    >
                      선택됨
                    </span>
                  </button>
                </div>
              </div>

              <!-- 개조유형 -->
              <div class="relative" ref="upgradeTypeDropdownRef">
                <button
                  type="button"
                  class="h-8 w-[250px] px-3 rounded-md flex items-center justify-between
                        bg-neutral-800/60 border border-neutral-600
                        text-[13px] text-neutral-200 hover:bg-neutral-700 transition"
                  @click="toggleUpgradeTypeDropdown"
                >
                  <span class="truncate">{{ upgradeTypeFilterLabel }}</span>
                  <ChevronDown class="w-4 h-4 text-neutral-400" />
                </button>

                <div
                  v-if="showUpgradeTypeDropdown"
                  class="absolute left-0 top-10 z-20 w-[250px] max-h-[260px] overflow-auto
                        rounded-md border border-neutral-600 bg-neutral-800 shadow-lg p-1"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-200 hover:bg-neutral-700/70 transition"
                    @click="selectUpgradeType('')"
                  >
                    <span>전체</span>
                    <span
                      v-if="upgradeTypeFilter === ''"
                      class="text-[11px] text-neutral-400"
                    >
                      선택됨
                    </span>
                  </button>

                  <div class="mx-2 border-t border-neutral-700"></div>

                  <button
                    v-for="item in upgradeTypeOptionsList"
                    :key="item"
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-200 hover:bg-neutral-700/70 transition"
                    @click="selectUpgradeType(item)"
                  >
                    <span class="truncate">{{ item }}</span>
                    <span
                      v-if="upgradeTypeFilter === item"
                      class="text-[11px] text-neutral-400"
                    >
                      선택됨
                    </span>
                  </button>
                </div>
              </div>

              <!-- 개조위치 -->
              <div class="relative" ref="upgradeLocationDropdownRef">
                <button
                  type="button"
                  class="h-8 w-[250px] px-3 rounded-md flex items-center justify-between
                        bg-neutral-800/60 border border-neutral-600
                        text-[13px] text-neutral-200 hover:bg-neutral-700 transition"
                  @click="toggleUpgradeLocationDropdown"
                >
                  <span class="truncate">{{ getMultiFilterLabel('개조위치', upgradeLocationFilters) }}</span>
                  <ChevronDown class="w-4 h-4 text-neutral-400" />
                </button>

                <div
                  v-if="showUpgradeLocationDropdown"
                  class="absolute left-0 top-10 z-20 w-[250px] max-h-[260px] overflow-auto
                        rounded-md border border-neutral-600 bg-neutral-800 shadow-lg p-1"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-200 hover:bg-neutral-700/70 transition"
                    @click="clearMultiFilter('upgradeLocation')"
                  >
                    <span>전체</span>
                  </button>

                  <div class="mx-2 border-t border-neutral-700"></div>

                  <label
                    v-for="item in upgradeLocationOptions"
                    :key="item"
                    class="flex items-center gap-2 px-2 py-2 rounded cursor-pointer
                          text-[13px] text-neutral-200 hover:bg-neutral-700/70"
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
                        bg-neutral-800/60 border border-neutral-600
                        text-[13px] text-neutral-200 hover:bg-neutral-700 transition"
                  @click="toggleSourceDropdown"
                >
                  <span class="truncate">{{ sourceFilterLabel }}</span>
                  <ChevronDown class="w-4 h-4 text-neutral-400" />
                </button>

                <div
                  v-if="showSourceDropdown"
                  class="absolute left-0 top-10 z-20 w-[250px] max-h-[260px] overflow-auto
                        rounded-md border border-neutral-600 bg-neutral-800 shadow-lg p-1"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-200 hover:bg-neutral-700/70 transition"
                    @click="selectSource('')"
                  >
                    <span>전체</span>
                    <span
                      v-if="sourceFilter === ''"
                      class="text-[11px] text-neutral-400"
                    >
                      선택됨
                    </span>
                  </button>

                  <div class="mx-2 border-t border-neutral-700"></div>

                  <button
                    v-for="item in sourceOptionsList"
                    :key="item"
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-200 hover:bg-neutral-700/70 transition"
                    @click="selectSource(item)"
                  >
                    <span class="truncate">{{ item }}</span>
                    <span
                      v-if="sourceFilter === item"
                      class="text-[11px] text-neutral-400"
                    >
                      선택됨
                    </span>
                  </button>
                </div>
              </div>

              <!-- 특징 -->
              <div class="relative" ref="featureDropdownRef">
                <button
                  type="button"
                  class="h-8 w-[250px] px-3 rounded-md flex items-center justify-between
                        bg-neutral-800/60 border border-neutral-600
                        text-[13px] text-neutral-200 hover:bg-neutral-700 transition"
                  @click="toggleFeatureDropdown"
                >
                  <span class="truncate">{{ getMultiFilterLabel('특징', featureFilters) }}</span>
                  <ChevronDown class="w-4 h-4 text-neutral-400" />
                </button>

                <div
                  v-if="showFeatureDropdown"
                  class="absolute left-0 top-10 z-20 w-[250px] max-h-[260px] overflow-auto
                        rounded-md border border-neutral-600 bg-neutral-800 shadow-lg p-1"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between px-2 py-2 rounded
                          text-[13px] text-neutral-200 hover:bg-neutral-700/70 transition"
                    @click="clearMultiFilter('feature')"
                  >
                    <span>전체</span>
                  </button>

                  <div class="mx-2 border-t border-neutral-700"></div>

                  <label
                    v-for="item in featureOptions"
                    :key="item"
                    class="flex items-center gap-2 px-2 py-2 rounded cursor-pointer
                          text-[13px] text-neutral-200 hover:bg-neutral-700/70"
                  >
                    <input
                      type="checkbox"
                      :value="item"
                      :checked="featureFilters.includes(item)"
                      @change="toggleMultiFilter('feature', item)"
                    />
                    <span class="truncate">{{ item }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- table -->
            <div class="scroll-dark mt-2 sm:mt-3 w-full overflow-auto max-h-[calc(100dvh-230px)]">
              <table class="w-full text-sm text-neutral-200 border-separate border-spacing-0 table-fixed">
                <thead class="bg-neutral-800">
                  <tr class="text-[13px] text-neutral-200 font-medium tracking-wide whitespace-nowrap bg-neutral-900/30">
                    <th class="px-3 py-2 text-left w-[160px] border-b border-r border-neutral-700">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('manufacturer')"
                      >
                        제조사
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('manufacturer') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[200px] border-b border-r border-neutral-700">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('name')"
                      >
                        모델명
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('name') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[140px] border-b border-r border-neutral-700">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('category')"
                      >
                        분류
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('category') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[130px] border-b border-r border-neutral-700">개조유형</th>
                    <th class="px-3 py-2 text-left w-[400px] border-b border-r border-neutral-700">개조위치</th>

                    <th class="px-3 py-2 text-left w-[90px] border-b border-r border-neutral-700">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('lapTime')"
                      >
                        랩타임
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('lapTime') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[110px] border-b border-r border-neutral-700">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('topSpeed')"
                      >
                        최고속도
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('topSpeed') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[120px] border-b border-r border-neutral-700">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('price')"
                      >
                        가격
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('price') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[110px] border-b border-r border-neutral-700">
                      <button
                        type="button"
                        class="flex items-center gap-1 font-medium hover:text-white transition"
                        @click="toggleSort('releaseDate')"
                      >
                        출시일
                        <span class="text-[11px] text-neutral-400">{{ getSortMark('releaseDate') }}</span>
                      </button>
                    </th>

                    <th class="px-3 py-2 text-left w-[240px] border-b border-r border-neutral-700">획득처</th>
                    <th class="px-3 py-2 text-left w-[100px] border-b border-r border-neutral-700">무게</th>
                    <th class="px-3 py-2 text-left w-[90px] border-b border-r border-neutral-700">구동방식</th>
                    <th class="px-3 py-2 text-left w-[60px] border-b border-r border-neutral-700">좌석</th>
                    <th class="px-3 py-2 text-left w-[550px] border-b border-r border-neutral-700">특징</th>
                  </tr>
                </thead>

                <tbody class="text-[13px] text-neutral-200 border-b border-neutral-700">
                  <tr
                    v-for="(row, index) in displayRows"
                    :key="row ? row.id ?? row.transportModelId ?? `${row.manufacturer}-${row.name}-${index}` : `empty-${index}`"
                    :class="row ? `${getRowClass(row)} group transition cursor-pointer` : ''"
                    @click="selectRow(row)"
                    @dblclick="handleRowDblClick(row)"
                  >
                    <template v-if="row">
                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">
                        {{ displayValue(row.manufacturer) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">
                        {{ displayValue(row.name) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">
                        {{ displayValue(row.transportCategory) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">
                        {{ displayValue(row.upgradeType) }}
                      </td>

                      <td 
                        class="px-3 py-2 text-left border-b border-neutral-700 truncate"
                        :title="row.upgradeLocation"
                      >
                        {{ displayValue(row.upgradeLocation) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ formatLapTime(row.lapTime) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ format.formatSpeed(row.topSpeed) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ format.formatCurrencyUSD(row.price) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ format.formatDate(row.releaseDate) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ displayValue(row.source) }}</td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ row.weight ? format.formatNumber(row.weight) + ' kg' : '-' }}</td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ displayValue(row.driveTrain) }}</td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">{{ displayValue(row.seats) }}</td>

                      <td
                        class="px-3 py-2 text-left border-b border-neutral-700 truncate"
                        :title="displayValue(row.features)"
                      >
                        {{ displayValue(row.features) }}
                      </td>
                      
                    </template>

                    <template v-else>
                      <td colspan="14" class="h-[40px]"></td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- footer (pagination bar) -->
            <div class="flex items-center justify-between px-4 py-2 border-t border-neutral-700 bg-neutral-900/40">
              <div class="text-[12px] text-neutral-400 tracking-wide">
                총 {{ total }}건 / {{ page }} / {{ totalPages }} 페이지
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="px-2.5 h-8 rounded border border-neutral-600 bg-neutral-800/80 text-[12px] text-neutral-200
                        hover:bg-neutral-700 active:bg-neutral-600 disabled:opacity-40 disabled:cursor-default transition"
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
                    ? 'border-neutral-300 bg-neutral-200 text-neutral-900 font-semibold shadow-sm'
                    : 'border-neutral-600 bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700'"
                  @click="changePage(num)"
                >
                  {{ num }}
                </button>

                <button
                  type="button"
                  class="px-2.5 h-8 rounded border border-neutral-600 bg-neutral-800/80 text-[12px] text-neutral-200
                        hover:bg-neutral-700 active:bg-neutral-600 disabled:opacity-40 disabled:cursor-default transition"
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
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Plus, X, RotateCcw, ChevronDown } from 'lucide-vue-next'
import { http } from '@/api/http'
import * as format from '@/utils/format'
import TransportModelModal from '@/components/TransportModelModal.vue'
import {
  manufacturerOptions,
  transportCategoryOptions,
  transportSourceOptions,
  upgradeLocationOptions,
  upgradeTypeOptions,
  featureOptions
} from '@/constants/transportOptions'

const rows = ref([])
const keyword = ref('')
const sort = ref('default')
const showAdd = ref(false)
const showEdit = ref(false)
const editTarget = ref(null)
const selectedRow = ref(null)
const listCardRef = ref(null)

const manufacturerFilter = ref('')
const categoryFilter = ref('')
const upgradeTypeFilter = ref('')
const sourceFilter = ref('')

const upgradeLocationFilters = ref([])
const featureFilters = ref([])

const showUpgradeLocationDropdown = ref(false)
const showFeatureDropdown = ref(false)

const upgradeLocationDropdownRef = ref(null)
const featureDropdownRef = ref(null)

const categoryOptions = transportCategoryOptions
const upgradeTypeOptionsList = upgradeTypeOptions
const sourceOptionsList = transportSourceOptions

const showManufacturerDropdown = ref(false)
const showCategoryDropdown = ref(false)
const showUpgradeTypeDropdown = ref(false)
const showSourceDropdown = ref(false)

const manufacturerDropdownRef = ref(null)
const categoryDropdownRef = ref(null)
const upgradeTypeDropdownRef = ref(null)
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
  const pages = []

  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }

  return pages
})

const manufacturerFilterLabel = computed(() => {
  return manufacturerFilter.value || '제조사'
})

const categoryFilterLabel = computed(() => {
  return categoryFilter.value || '분류'
})

const upgradeTypeFilterLabel = computed(() => {
  return upgradeTypeFilter.value || '개조유형'
})

const sourceFilterLabel = computed(() => {
  return sourceFilter.value || '획득처'
})

async function load()
{
  try {
    const res = await http.get('/transport-models', {
      params: {
        keyword: keyword.value,
        manufacturer: manufacturerFilter.value,
        category: categoryFilter.value,
        upgradeType: upgradeTypeFilter.value,
        source: sourceFilter.value,
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
  categoryFilter.value = ''
  upgradeTypeFilter.value = ''
  sourceFilter.value = ''
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
  showUpgradeTypeDropdown.value = false
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

function toggleUpgradeTypeDropdown()
{
  const next = !showUpgradeTypeDropdown.value
  closeSingleFilterDropdowns()
  showUpgradeLocationDropdown.value = false
  showFeatureDropdown.value = false
  showUpgradeTypeDropdown.value = next
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

function selectCategory(value)
{
  categoryFilter.value = value
  showCategoryDropdown.value = false
  applyFilterChange()
}

function selectUpgradeType(value)
{
  upgradeTypeFilter.value = value
  showUpgradeTypeDropdown.value = false
  applyFilterChange()
}

function selectSource(value)
{
  sourceFilter.value = value
  showSourceDropdown.value = false
  applyFilterChange()
}

function clearMultiFilter(type)
{
  if (type === 'upgradeLocation') {
    upgradeLocationFilters.value = []
    showUpgradeLocationDropdown.value = false
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
  const target = type === 'upgradeLocation' ? upgradeLocationFilters : featureFilters
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
    return 'hover:bg-neutral-800/20'
  }

  if (isSelected(row)) {
    return 'bg-neutral-700/70 hover:bg-neutral-700/70'
  }

  return 'hover:bg-neutral-800/60'
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

  if (upgradeTypeDropdownRef.value && !upgradeTypeDropdownRef.value.contains(target)) {
    showUpgradeTypeDropdown.value = false
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

onMounted(() => {
  load()
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>