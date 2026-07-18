<template>
  <!-- page background -->
  <div class="min-h-[calc(100dvh-56px)] bg-neutral-700">

    <!-- Toast -->
    <div class="fixed top-[64px] left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <div class="min-w-[240px] max-w-[360px] pointer-events-auto">
        <Toast
          :open="toast.open"
          :text="toast.text"
          :type="toast.type"
        />
      </div>
    </div>

    <div class="w-full max-w-[1650px] mx-auto px-4 pt-2 pb-4 transition-all duration-300">
      <div class="flex items-start justify-center">
        <div class="w-full min-w-0">
          <!-- main panel -->
          <div class="bg-neutral-900/40 border border-neutral-700 rounded-lg shadow-lg overflow-hidden">
            <div class="p-2">
              <div class="border border-neutral-700 rounded-md overflow-hidden">
  
                <!-- toolbar -->
                <div class="relative flex items-center justify-between px-3 py-2 bg-neutral-900/30 border-b border-neutral-700">

                  <!-- 좌측 영역 -->
                  <div ref="garageFilterRef" class="flex items-center gap-2 min-w-0">
                    <!-- 차고 필터 -->
                    <button
                      type="button"
                      class="h-8 min-w-[180px] max-w-[260px] px-3
                            flex items-center justify-between gap-2
                            rounded-md
                            bg-neutral-800/60
                            border border-neutral-600
                            text-[13px] text-neutral-200
                            hover:bg-neutral-700
                            active:bg-neutral-600
                            transition"
                      @click="showGarageFilterDropdown = !showGarageFilterDropdown"
                    >
                      <span class="truncate">{{ selectedGarageFilterLabel }}</span>
                      <ChevronDown class="w-4 h-4 text-neutral-400" />
                    </button>

                    <!-- 차고 필터 드롭다운 -->
                    <div
                      v-if="showGarageFilterDropdown"
                      class="absolute left-0 top-full mt-2 z-30
                            w-[260px] max-h-[280px] overflow-y-auto
                            rounded-md border border-neutral-600
                            bg-neutral-900 shadow-lg"
                    >
                      <!-- 전체 -->
                      <button
                        type="button"
                        class="w-full flex items-center justify-between px-3 py-2 text-[13px] text-neutral-200 hover:bg-neutral-800 transition"
                        @click="selectedGarageIds = []"
                      >
                        <span>전체</span>
                        <span
                          v-if="selectedGarageIds.length === 0"
                          class="text-[11px] text-neutral-400"
                        >
                          선택됨
                        </span>
                      </button>
  
                      <div class="mx-2 border-t border-neutral-700"></div>
  
                      <!-- 특수 보관(미배치/페가수스) + 일반 차고 -->
                      <label
                        v-for="garage in garageFilterOptions.filter((item) => item.garageId !== 'all')"
                        :key="garage.garageId"
                        class="flex items-center gap-2 px-3 py-2 text-[13px] text-neutral-200 hover:bg-neutral-800 cursor-pointer"
                      >
                        <input
                          :checked="selectedGarageIds.includes(String(garage.garageId))"
                          type="checkbox"
                          class="h-4 w-4"
                          @change="toggleGarageFilter(garage.garageId)"
                        />
                        <span class="truncate">{{ garage.garageName }}</span>
                      </label>
                    </div>

                    <!-- 검색 -->
                    <input
                      ref="searchInputRef"
                      v-model="searchKeyword"
                      type="text"
                      placeholder="제조사 / 모델명 검색"
                      class="h-8 w-[220px] shrink-0 px-2 rounded-md bg-neutral-800/60 border border-neutral-600 text-[13px] text-neutral-200"
                      @keyup.enter="searchOwnedTransport"
                    />

                    <button
                      type="button"
                      class="h-8 px-3 rounded-md bg-neutral-800/60 border border-neutral-600 text-[13px] text-neutral-200 hover:bg-neutral-700"
                      @click="searchOwnedTransport"
                    >
                      검색
                    </button>

                    <!-- 초기화 -->
                    <button
                      type="button"
                      class="h-8 w-8 flex items-center justify-center
                            rounded-md
                            bg-neutral-800/60
                            border border-neutral-600
                            text-neutral-200
                            hover:bg-neutral-700
                            active:bg-neutral-600
                            transition"
                      @click="resetFilters"
                    >
                      <RotateCcw class="w-4 h-4" />
                    </button>

                    <!-- 펼침/접힘 -->
                    <button
                      type="button"
                      class="h-8 px-2 flex items-center gap-1
                            rounded-md
                            text-[12px] text-neutral-300
                            hover:bg-neutral-700/40
                            transition"
                      @click="toggleAllGaragesCollapsed"
                    >
                      <ChevronsUpDown class="w-4 h-4" />
                      <span>{{ allGarageCollapsed ? '펼침' : '접힘' }}</span>
                    </button>

                  </div>
  
                  <!-- 우측 영역 -->
                  <div class="flex items-center gap-2">

                    <!-- 추가 -->
                    <button
                      type="button"
                      class="h-8 px-3 flex items-center gap-1
                            rounded-md
                            bg-neutral-800/60
                            border border-neutral-600
                            text-[13px] text-neutral-200
                            hover:bg-neutral-700
                            active:bg-neutral-600
                            transition"
                      @click="openCreateModal"
                    >
                      <Plus class="w-4 h-4" />
                      <span>추가</span>
                    </button>
                  </div>
                </div>

                <!-- 일반 차고 카드형 목록 -->
                <div
                  v-if="!isSpecialStorageFilter"
                  ref="listScrollRef"
                  class="scroll-dark h-[calc(100dvh-220px)] max-h-[780px]
                        overflow-y-auto overflow-x-hidden p-3"
                >
                  <div
                    v-for="garage in filteredGarageGroups"
                    :key="garage.garageId"
                    class="mb-3 overflow-hidden rounded-md border border-neutral-700"
                  >
                    <!-- 차고 헤더 -->
                    <div
                      class="flex h-[42px] cursor-pointer items-center
                            border-b border-neutral-600
                            bg-neutral-700/40 px-3
                            text-[13px] font-semibold text-neutral-300"
                      @click="toggleGarageCollapsed(garage.garageId)"
                    >
                      <span class="mr-2 shrink-0 text-[11px] text-neutral-400">
                        {{ garage.collapsed ? '▶' : '▼' }}
                      </span>

                      <div class="flex min-w-0 items-center gap-2">
                        <span class="truncate">
                          {{ garage.displayGarageName }}
                        </span>

                        <span
                          class="shrink-0 rounded-md border border-neutral-700
                                bg-neutral-900/80 px-1.5 py-[3px]
                                text-[10px] font-semibold leading-none shadow-sm"
                        >
                          <span class="text-neutral-300">
                            {{ garage.usedSlotCount }}
                          </span>

                          <span class="mx-0.5 text-neutral-500">/</span>

                          <span class="text-neutral-300">
                            {{ garage.displaySlotCount  }}
                          </span>
                        </span>

                        <span
                          v-if="garage.description"
                          class="truncate text-[11px] font-normal text-neutral-400"
                        >
                          {{ garage.description }}
                        </span>
                      </div>

                      <button
                        type="button"
                        class="ml-auto shrink-0 rounded p-1
                              hover:bg-neutral-600/40 transition"
                        @click.stop="openGarageSetting({
                          garageId: garage.garageId,
                          garage: garage.garageName,
                          alias: garage.alias,
                          description: garage.description
                        })"
                      >
                        <Settings class="h-4 w-4 text-neutral-400 hover:text-white" />
                      </button>
                    </div>

                    <!-- 차량 카드 그리드 -->
                    <div
                      v-if="!garage.collapsed"
                      class="grid grid-cols-2 gap-3 bg-neutral-900/20 p-3
                            min-[800px]:grid-cols-3
                            min-[1100px]:grid-cols-4
                            min-[1400px]:grid-cols-5"
                    >
                      <div
                        v-for="slot in garage.slots"
                        :key="slot.id"
                        :data-row-id="slot.id"
                        :draggable="canDragRow(slot)"
                        :class="[
                          'relative min-w-0 overflow-hidden rounded-md border flex flex-col transition-colors duration-150',
                          slot.isEmpty
                            ? 'border-neutral-700 bg-neutral-900/30 text-neutral-500'
                            : 'cursor-pointer border-neutral-600 bg-neutral-800/50 hover:border-neutral-500 hover:bg-neutral-700/50',
                          isDropTarget(slot)
                            ? 'border-green-500 bg-green-900/20'
                            : '',
                          draggingRow && draggingRow.ownedId === slot.id
                            ? 'opacity-50'
                            : '',
                          Number(highlightedOwnedId) === Number(slot.id)
                            ? 'ring-2 ring-blue-400/80 border-blue-400 bg-blue-900/20'
                            : ''
                        ]"
                        @click="handleRowClick(slot)"
                        @dblclick="handleSlotDoubleClick(slot)"
                        @dragstart="handleDragStart(slot)"
                        @dragend="handleDragEnd"
                        @dragover="handleDragOver($event, slot)"
                        @drop="handleDrop(slot)"
                      >
                        <!-- 빈 슬롯 -->
                        <template v-if="slot.isEmpty">
                          <div
                            class="flex aspect-[3/2] shrink-0 items-center justify-center
                                  border-b border-neutral-700 bg-neutral-900/40"
                          >
                            <span class="text-[12px] text-neutral-500">
                              빈 슬롯
                            </span>
                          </div>

                          <div class="flex flex-1 flex-col px-3 py-2">
                            <div class="text-[12px] text-neutral-500">
                              슬롯 {{ slot.slot }}
                            </div>

                            <div class="mt-auto pt-2 text-[11px] text-neutral-600">
                              더블클릭하여 등록
                            </div>
                          </div>
                        </template>

                        <!-- 차량이 있는 슬롯 -->
                        <template v-else>
                          <div
                            class="relative aspect-[3/2] shrink-0 overflow-hidden
                                  border-b border-neutral-700 bg-neutral-900"
                          >
                            <img
                              v-if="slot.imageUrl"
                              :src="resolveThumbnailUrl(slot.imageUrl)"
                              :alt="slot.name"
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

                            <!-- 미획득 -->
                            <span
                              v-if="slot.acquiredYn === 'N'"
                              class="absolute right-2 top-2 rounded-md
                                    border border-red-500/40 bg-red-900/70
                                    px-2 py-[2px] text-[10px] text-red-200"
                            >
                              미획득
                            </span>
                          </div>

                          <div class="flex flex-1 flex-col px-3 py-2">
                            <!-- 1줄: 이름 + 기능배지 / 우측 맨션배지 -->
                            <div class="flex min-w-0 items-center gap-2">
                              <div class="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
                                <span class="truncate text-[13px] font-medium text-neutral-100">
                                  {{ slot.name }}
                                </span>

                                <span
                                  v-for="badge in formatFeatureBadges(slot.features)"
                                  :key="badge"
                                  class="shrink-0 rounded-md
                                        border border-neutral-700/70
                                        bg-neutral-800/60
                                        px-1.5 py-[1px]
                                        text-[9px] text-neutral-300"
                                >
                                  {{ badge }}
                                </span>
                              </div>

                              <span
                                v-if="getMansionPositionLabel(slot)"
                                class="ml-auto shrink-0 rounded-md
                                      border border-blue-500/40 bg-blue-900/20
                                      px-1.5 py-[1px] text-[9px] text-blue-300"
                              >
                                {{ getMansionPositionLabel(slot) }}
                              </span>
                            </div>

                            <!-- 2줄: 제조사 / 분류 / 수정 -->
                            <div class="mt-1 flex items-center justify-between gap-2">
                              <span class="truncate text-[11px] text-neutral-400">
                                {{ slot.manufacturer }}
                                <span class="mx-1 text-[13px] leading-none text-neutral-400">•</span>
                                {{ slot.category }}
                              </span>

                              <button
                                type="button"
                                class="shrink-0 rounded p-1 transition hover:bg-neutral-600/40"
                                @click.stop="openEdit(slot)"
                              >
                                <SquarePen class="h-4 w-4 text-neutral-400 hover:text-white" />
                              </button>
                            </div>
                          </div>

                        </template>
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- 특수 보관 카드형 목록 -->
                <div
                  v-else
                  ref="listScrollRef"
                  class="scroll-dark h-[calc(100dvh-220px)] max-h-[780px]
                        overflow-y-auto overflow-x-hidden p-3"
                >
                  <div
                    v-for="group in specialStorageGroups"
                    :key="group.id"
                    class="mb-3 overflow-hidden rounded-md border border-neutral-700"
                  >
                    <!-- 특수 보관 헤더 -->
                    <div
                      class="flex h-[42px] items-center
                            border-b border-neutral-600
                            bg-neutral-700/40 px-3"
                    >
                      <div class="flex min-w-0 items-center gap-2">
                        <span class="truncate text-[13px] font-semibold text-neutral-300">
                          {{ group.name }}
                        </span>

                        <span class="shrink-0 text-[11px] text-neutral-400">
                          {{ group.rows.length }}대
                        </span>

                        <span
                          v-if="group.description"
                          class="truncate text-[11px] text-neutral-400"
                        >
                          {{ group.description }}
                        </span>
                      </div>
                    </div>

                    <!-- 특수 보관 차량 카드 -->
                    <div
                      class="grid grid-cols-2 gap-3 bg-neutral-900/20 p-3
                            min-[800px]:grid-cols-3
                            min-[1100px]:grid-cols-4
                            min-[1400px]:grid-cols-5"
                    >
                      <div
                        v-for="row in group.rows"
                        :key="row.id"
                        :data-row-id="row.id"
                        :draggable="canDragRow(row)"
                        :class="[
                          'relative flex min-w-0 flex-col overflow-hidden rounded-md',
                          'cursor-pointer border border-neutral-600 bg-neutral-800/50',
                          'transition-colors duration-150 hover:border-neutral-500 hover:bg-neutral-700/50',
                          isDropTarget(row)
                            ? 'border-green-500 bg-green-900/20'
                            : '',
                          draggingRow && draggingRow.ownedId === row.id
                            ? 'opacity-50'
                            : '',
                          Number(highlightedOwnedId) === Number(row.id)
                            ? 'ring-2 ring-blue-400/80 border-blue-400 bg-blue-900/20'
                            : ''
                        ]"
                        @click="handleRowClick(row)"
                        @dragstart="handleDragStart(row)"
                        @dragend="handleDragEnd"
                        @dragover="handleDragOver($event, row)"
                        @drop="handleDrop(row)"
                      >
                        <!-- 이미지 -->
                        <div
                          class="relative aspect-[3/2] shrink-0 overflow-hidden
                                border-b border-neutral-700 bg-neutral-900"
                        >
                          <img
                            v-if="row.imageUrl"
                            :src="resolveThumbnailUrl(row.imageUrl)"
                            :alt="row.name"
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

                          <span
                            v-if="row.acquiredYn === 'N'"
                            class="absolute right-2 top-2 rounded-md
                                  border border-red-500/40 bg-red-900/70
                                  px-2 py-[2px] text-[10px] text-red-200"
                          >
                            미획득
                          </span>
                        </div>

                        <div class="flex flex-1 flex-col px-3 py-2">
                          <!-- 1줄: 이름 + 기능배지 / 우측 맨션배지 -->
                          <div class="flex min-w-0 items-center gap-2">
                            <div class="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
                              <span class="truncate text-[13px] font-medium text-neutral-100">
                                {{ row.name }}
                              </span>

                              <span
                                v-for="badge in formatFeatureBadges(row.features)"
                                :key="badge"
                                class="shrink-0 rounded-md
                                      border border-neutral-700/70
                                      bg-neutral-800/60
                                      px-1.5 py-[1px]
                                      text-[9px] text-neutral-300"
                              >
                                {{ badge }}
                              </span>
                            </div>

                            <span
                              v-if="getMansionPositionLabel(row)"
                              class="ml-auto shrink-0 rounded-md
                                    border border-blue-500/40 bg-blue-900/20
                                    px-1.5 py-[1px] text-[9px] text-blue-300"
                            >
                              {{ getMansionPositionLabel(row) }}
                            </span>
                          </div>

                          <!-- 2줄: 제조사 / 분류 / 수정 -->
                          <div class="mt-1 flex items-center justify-between gap-2">
                            <span class="truncate text-[11px] text-neutral-400">
                              {{ row.manufacturer }}
                              <span class="mx-1 text-[13px] leading-none text-neutral-400">•</span>
                              {{ row.category }}
                            </span>

                            <button
                              type="button"
                              class="shrink-0 rounded p-1 transition hover:bg-neutral-600/40"
                              @click.stop="openEdit(row)"
                            >
                              <SquarePen class="h-4 w-4 text-neutral-400 hover:text-white" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div
                    v-if="specialStorageGroups.length === 0"
                    class="flex h-full items-center justify-center text-[13px] text-neutral-500"
                  >
                    등록된 이동수단이 없습니다.
                  </div>
                </div>
  
                <!-- footer: 슬롯 사용 통계 -->
                <div
                  class="flex items-center justify-between px-3 py-2
                        bg-neutral-900/30 border-t border-neutral-700
                        text-[13px] text-neutral-300"
                >
                  <div class="tabular-nums text-neutral-300">
                    보유 이동수단
                    <span class="font-semibold text-white">
                      {{ acquiredTransportCount }}
                    </span>
                    대
                  </div>
  
                  <div class="flex items-center gap-4 text-[13px] text-neutral-400">
                    <!-- 격납고 빠른 필터 -->
                    <div
                      class="flex items-center gap-1 cursor-pointer px-2 py-1 rounded transition"
                      :class="isActiveSpecialFilter('hangar')
                        ? 'bg-neutral-700/60 text-white'
                        : 'hover:bg-neutral-700/40'"
                      @click="applySpecialFilter('hangar')"
                    >
                      <span>격납고</span>
                      <span class="font-semibold text-white">
                        {{ hangarTotalCount }}
                      </span>
                    </div>
                    
                    <!-- 페가수스 빠른 필터 -->
                    <div
                      class="flex items-center gap-1 cursor-pointer px-2 py-1 rounded transition"
                      :class="isActiveSpecialFilter('pegasus')
                        ? 'bg-neutral-700/60 text-white'
                        : 'hover:bg-neutral-700/40'"
                      @click="applySpecialFilter('pegasus')"
                    >
                      <span>페가수스</span>
                      <span class="font-semibold text-white">
                        {{ pegasusCount }}
                      </span>
                    </div>

                    <!-- 미배치 빠른 필터 -->
                    <div
                      class="flex items-center gap-1 cursor-pointer px-2 py-1 rounded transition"
                      :class="isActiveSpecialFilter('unassigned')
                        ? 'bg-neutral-700/60 text-white'
                        : 'hover:bg-neutral-700/40'"
                      @click="applySpecialFilter('unassigned')"
                    >
                      <span>미배치</span>
                      <span class="font-semibold text-white">
                        {{ unassignedCount }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 보유 이동수단 등록/수정 모달 -->
  <OwnedTransportModal
    v-model:open="showModal"
    :mode="modalMode"
    :initial-row="editTarget"
    :transport-list="transportList"
    :garage-list="garageList"
    @created="handleCreated"
    @update="handleUpdate"
    @delete="handleDelete"
  />

  <!-- 차고 설정 모달 -->
  <GarageSettingModal
    v-model:open="showGarageSettingModal"
    :garage="selectedGarageSettingRow"
    @save="handleGarageSettingSave"
  />

  <!-- 보유 이동수단 검색 결과 모달 -->
  <OwnedTransportSearchResultModal
    v-model:open="showSearchResultModal"
    :results="searchResultList"
    @move="moveToSearchResult"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/http'
import { Plus, RotateCcw, ChevronDown, Settings, ChevronsUpDown, SquarePen } from 'lucide-vue-next'
import OwnedTransportModal from '@/components/OwnedTransportModal.vue'
import GarageSettingModal from '@/components/GarageSettingModal.vue'
import Toast from '@/components/Toast.vue'
import OwnedTransportSearchResultModal from '@/components/OwnedTransportSearchResultModal.vue'
import * as transportDataMapper from '@/utils/transportDataMapper'
import { formatFeatureBadges, resolveImageUrl, resolveThumbnailUrl } from '@/utils/format'

const router = useRouter()

// 상세 페이지 이동 전 목록 상태 저장 키
const OWNED_LIST_STATE_KEY = 'ownedListState'

// 보유 이동수단 목록 데이터
const rows = ref([])

// 현재 드래그 중인 행 정보
const draggingRow = ref(null)

// 드롭 처리 중 여부
const dropLoading = ref(false)

// 현재 드롭 대상 슬롯 키
const activeDropSlotKey = ref('')

// 모달에서 사용할 이동수단 옵션 목록
const transportList = ref([])

// 화면에 표시할 차고 목록
const garageList = ref([])

// 보유 이동수단 모달 표시 여부
const showModal = ref(false)

// 보유 이동수단 모달 모드
const modalMode = ref('create') // create | edit

// 수정 대상 행 데이터
const editTarget = ref(null)

// 현재 하이라이트된 행 키
const activeRowKey = ref('')

// 상세에서 돌아왔을 때 잠깐 강조할 보유 이동수단 ID
const highlightedOwnedId = ref(null)

// 카드 강조 해제 타이머
let highlightTimer = null

// 상세 페이지 이동 중인지 여부
let navigatingToDetail = false

// 선택된 차고 필터 목록
const selectedGarageIds = ref([])

// 차고 필터 드롭다운 표시 여부
const showGarageFilterDropdown = ref(false)

// 차고 필터 영역 DOM 참조
const garageFilterRef = ref(null)

// 차고 카드 목록 스크롤 영역 DOM 참조
const listScrollRef = ref(null)

// 이동수단 검색어 입력창 DOM 참조
const searchInputRef = ref(null)

// 이동수단 검색어
const searchKeyword = ref('')

// 검색 결과 모달 표시 여부
const showSearchResultModal = ref(false)

// 검색 결과 목록
const searchResultList = ref([])

// 접힌 차고 ID 집합
const collapsedGarageIds = ref(new Set())

// 차고 설정 모달 표시 여부
const showGarageSettingModal = ref(false)

// 설정 중인 차고 데이터
const selectedGarageSettingRow = ref(null)

// 테이블 셀 기본 스타일
const tdBaseClass = 'px-3 py-2 border-b border-neutral-700'

// 격납고 특수 차고명 상수
const HANGAR_GARAGE_NAMES = Object.freeze({
  HANGAR: '격납고 격납층',
  HANGAR_STORAGE: '격납고 저장소',
  HANGAR_VINEWOOD: '격납고 바인우드 클럽 보관소'
})

// 토스트 상태 및 타입
const toast = ref({ open: false, text: '', type: 'success' })

// 토스트 자동 닫힘 타이머
let toastTimer = null

// 차고 필터 변경 시 행 하이라이트 초기화
watch(selectedGarageIds, () => {
  activeRowKey.value = ''
})

// 모달 닫힘 시 행 하이라이트 초기화
watch(showModal, (isOpen) => {
  if (!isOpen) {
    activeRowKey.value = ''
  }
})

// 모든 일반 차고가 접혀있는지 여부
const allGarageCollapsed = computed(() => {
  const garageIds = garageList.value
    .filter((garage) => {
      return garage.garageName !== getHangarGarageName('HANGAR') &&
             garage.garageName !== getHangarGarageName('HANGAR_STORAGE') &&
             garage.garageName !== getHangarGarageName('HANGAR_VINEWOOD')
    })
    .map((garage) => {
      return garage.garageId
    })
    .filter((garageId) => {
      return garageId !== null && garageId !== undefined
    })

  if (garageIds.length === 0) {
    return false
  }

  return garageIds.every((garageId) => {
    return collapsedGarageIds.value.has(garageId)
  })
})

// 차고ID-슬롯번호 기준으로 보유 이동수단을 빠르게 찾기 위한 lookup 맵
const slotRowMap = computed(() => {
  const map = new Map()

  rows.value.forEach((row) => {
    if (
      !row.garageId ||
      !row.slot ||
      row.storageType === 'HANGAR'
    ) {
      return
    }

    const key = `${row.garageId}-${row.slot}`
    map.set(key, row)
  })

  return map
})

// 카드형 화면에서 사용할 차고별 그룹 데이터
const garageGroups = computed(() => {
  return garageList.value
    .filter((garage) => {
      const garageName = garage.garageName

      // 격납고 특수 보관 3종은 일반 차고 그룹에서 제외
      return (
        garageName !== getHangarGarageName('HANGAR') &&
        garageName !== getHangarGarageName('HANGAR_STORAGE') &&
        garageName !== getHangarGarageName('HANGAR_VINEWOOD')
      )
    })
    .map((garage) => {
      const garageId = garage.garageId
      const garageName = garage.garageName
      const displayGarageName = garage.alias
        ? garage.alias
        : garageName
      
      const slotCount = Number(garage.slotCount ?? 0)
      const slots = []

      for (let slotNo = 1; slotNo <= slotCount; slotNo++) {
        const slotKey = `${garageId}-${slotNo}`
        const found = slotRowMap.value.get(slotKey)

        if (found) {
          slots.push({
            ...found,
            type: 'slot',
            garageId,
            garage: displayGarageName,
            originalGarageName: garageName,
            alias: garage.alias ?? found.alias ?? null,
            slot: slotNo,
            upgradeLocation: found.upgradeLocation ?? '',
            isEmpty: false
          })
        } else {
          slots.push({
            id: `empty-${garageId}-${slotNo}`,
            type: 'slot',
            garageId,
            garage: displayGarageName,
            originalGarageName: garageName,
            alias: garage.alias ?? null,
            slot: slotNo,
            manufacturer: '-',
            name: '-',
            category: '-',
            imageUrl: null,
            features: '',
            acquiredYn: 'Y',
            mansionPosition: null,
            isEmpty: true
          })
        }
      }

      const isApartmentGarage = /^아파트 차고\s*(10|[1-9])$/.test(garageName)

      const displaySlotCount = isApartmentGarage
        ? 10
        : slotCount

      const usedSlotCount = slots.filter((slot) => {
        if (slot.isEmpty) {
          return false
        }

        // 아파트 차고 1~8의 자전거 전용 슬롯 제외
        if (
          isApartmentGarage &&
          Number(slot.slot) >= 11 &&
          Number(slot.slot) <= 13
        ) {
          return false
        }

        return true
      }).length

      return {
        garageId,
        garageName,
        displayGarageName,
        alias: garage.alias ?? null,
        description: garage.description ?? null,
        slotCount,
        displaySlotCount,
        usedSlotCount,
        collapsed: collapsedGarageIds.value.has(garageId),
        slots
      }
    })
})

// 선택된 차고 필터를 반영한 카드형 차고 그룹
const filteredGarageGroups = computed(() => {
  if (selectedGarageIds.value.length === 0) {
    return garageGroups.value
  }

  return garageGroups.value.filter((garage) => {
    return selectedGarageIds.value.includes(String(garage.garageId))
  })
})

// 특수 보관 필터 선택 여부
const isSpecialStorageFilter = computed(() => {
  return (
    selectedGarageIds.value.includes('unassigned') ||
    selectedGarageIds.value.includes('pegasus') ||
    selectedGarageIds.value.includes('hangar')
  )
})

// 카드형 화면에서 사용할 특수 보관 그룹
const specialStorageGroups = computed(() => {
  if (selectedGarageIds.value.includes('unassigned')) {
    return [
      {
        id: 'unassigned',
        name: '미배치',
        description: '',
        rows: unassignedRows.value
      }
    ]
  }

  if (selectedGarageIds.value.includes('pegasus')) {
    return [
      {
        id: 'pegasus',
        name: '페가수스',
        description: '',
        rows: pegasusRows.value
      }
    ]
  }

  if (selectedGarageIds.value.includes('hangar')) {
    const groups = []

    if (hangarRows.value.length > 0) {
      groups.push({
        id: 'hangar',
        name: getHangarGarageName('HANGAR'),
        description: '',
        rows: hangarRows.value
      })
    }

    if (hangarStorageRows.value.length > 0) {
      groups.push({
        id: 'hangar-storage',
        name: getHangarGarageName('HANGAR_STORAGE'),
        description: '',
        rows: hangarStorageRows.value
      })
    }

    if (hangarVinewoodRows.value.length > 0) {
      groups.push({
        id: 'hangar-vinewood',
        name: getHangarGarageName('HANGAR_VINEWOOD'),
        description: '',
        rows: hangarVinewoodRows.value
      })
    }

    return groups
  }

  return []
})

// 차고 목록을 기반으로 화면에 표시할 슬롯 구조 생성
const slotRows = computed(() => {
  const result = []

  garageList.value.forEach((garage) => {
    const garageId = garage.garageId
    const garageName = garage.garageName
    const displayGarageName = garage.alias ? garage.alias : garage.garageName
    const slotCount = Number(garage.slotCount ?? 0)

    // 격납고 특수 보관 3종은 일반 차고 리스트에서 제외
    if (
      garageName === getHangarGarageName('HANGAR') ||
      garageName === getHangarGarageName('HANGAR_STORAGE') ||
      garageName === getHangarGarageName('HANGAR_VINEWOOD')
    ) {
      return
    }

    result.push({
      id: `garage-header-${garageId}`,
      type: 'garageHeader',
      garageId,
      garage: garageName,
      alias: garage.alias ?? null,
      description: garage.description ?? null
    })

    if (collapsedGarageIds.value.has(garageId)) {
      return
    }

    for (let slotNo = 1; slotNo <= slotCount; slotNo++) {
      const slotKey = `${garageId}-${slotNo}`
      const found = slotRowMap.value.get(slotKey)

      if (found) {
        result.push({
          ...found,
          type: 'slot',
          garageId,
          garage: displayGarageName,
          alias: garage.alias ?? found.alias ?? null,
          slot: slotNo,
          upgradeLocation: found.upgradeLocation ?? '',
          isEmpty: false
        })
      } else {
        result.push({
          id: `empty-${garageId}-${slotNo}`,
          type: 'slot',
          garageId,
          garage: displayGarageName,
          alias: garage.alias ?? null,
          slot: slotNo,
          manufacturer: '-',
          name: '-',
          category: '-',
          isEmpty: true
        })
      }
    }
  })

  return result
})

// 차고 필터 적용 후 슬롯 행 목록
const filteredSlotRows = computed(() => {
  if (selectedGarageIds.value.length === 0) {
    return slotRows.value
  }

  return slotRows.value.filter((row) => {
    return selectedGarageIds.value.includes(String(row.garageId))
  })
})

// 미배치 행 목록
const unassignedRows = computed(() => {
  return rows.value
    .filter((row) => {
      return row.storageType === 'UNASSIGNED' || (!row.storageType && !row.garageId)
    })
    .map((row) => ({
      ...row,
      type: 'unassigned'
    }))
})

// 미배치 건수
const unassignedCount = computed(() => {
  return unassignedRows.value.length
})

// 페가수스 행 목록
const pegasusRows = computed(() => {
  return rows.value
    .filter((row) => {
      return row.storageType === 'PEGASUS'
    })
    .map((row) => ({
      ...row,
      type: 'pegasus'
    }))
})

// 페가수스 건수
const pegasusCount = computed(() => {
  return pegasusRows.value.length
})

// 격납고 3종 전체 보관 건수
const hangarTotalCount = computed(() => {
  return hangarRows.value.length +
         hangarStorageRows.value.length +
         hangarVinewoodRows.value.length
})

// 격납고 행 목록
const hangarRows = computed(() => {
  return rows.value
    .filter((row) => {
      return row.storageType === 'HANGAR'
    })
    .map((row) => ({
      ...row,
      type: 'hangar'
    }))
})

// 격납고 저장소 행 목록
const hangarStorageRows = computed(() => {
  return rows.value
    .filter((row) => {
      return row.storageType === 'HANGAR_STORAGE'
    })
    .map((row) => ({
      ...row,
      type: 'hangarStorage'
    }))
})

// 격납고 바인우드 클럽 보관소 행 목록
const hangarVinewoodRows = computed(() => {
  return rows.value
    .filter((row) => {
      return row.storageType === 'HANGAR_VINEWOOD'
    })
    .map((row) => ({
      ...row,
      type: 'hangarVinewood'
    }))
})

// 격납고 크기별 사용 수
const hangarUsage = computed(() => {
  const usage = {
    small: 0,
    medium: 0,
    large: 0,
    xlarge: 0
  }

  hangarRows.value.forEach((row) => {
    const features = String(row.features || '')

    if (features.includes('HGX')) {
      usage.xlarge += 1
      return
    }

    if (features.includes('HGL')) {
      usage.large += 1
      return
    }

    if (features.includes('HGM')) {
      usage.medium += 1
      return
    }

    if (features.includes('HGS')) {
      usage.small += 1
    }
  })

  return usage
})

// 미배치 표시용 행 목록
const unassignedDisplayRows = computed(() => {
  if (unassignedRows.value.length === 0) {
    return []
  }

  return [
    {
      id: 'unassigned-header',
      type: 'garageHeader',
      garage: '미배치'
    },
    ...unassignedRows.value
  ]
})

// 페가수스 표시용 행 목록
const pegasusDisplayRows = computed(() => {
  if (pegasusRows.value.length === 0) {
    return []
  }

  return [
    {
      id: 'pegasus-header',
      type: 'garageHeader',
      garage: '페가수스'
    },
    ...pegasusRows.value
  ]
})

// 격납고 3종 표시용 행 목록
const hangarDisplayRows = computed(() => {
  const result = []

  // 격납고 격납층 표시
  if (hangarRows.value.length > 0) {
    result.push({
      id: 'hangar-header',
      type: 'garageHeader',
      garage: getHangarGarageName('HANGAR')
    })

    result.push(...hangarRows.value)
  }

  // 격납고 저장소 표시
  if (hangarStorageRows.value.length > 0) {
    result.push({
      id: 'hangar-storage-header',
      type: 'garageHeader',
      garage: getHangarGarageName('HANGAR_STORAGE')
    })

    result.push(...hangarStorageRows.value)
  }

  // 격납고 바인우드 클럽 보관소 표시
  if (hangarVinewoodRows.value.length > 0) {
    result.push({
      id: 'hangar-vinewood-header',
      type: 'garageHeader',
      garage: getHangarGarageName('HANGAR_VINEWOOD')
    })

    result.push(...hangarVinewoodRows.value)
  }

  return result
})

// 테이블에 최종 표시할 행 목록
const displayRows = computed(() => {
  if (selectedGarageIds.value.includes('unassigned')) {
    return unassignedDisplayRows.value
  }

  if (selectedGarageIds.value.includes('pegasus')) {
    return pegasusDisplayRows.value
  }

  // 격납고 필터 선택 시 격납고 전용 목록 표시
  if (selectedGarageIds.value.includes('hangar')) {
    return hangarDisplayRows.value
  }

  const minRows = 15
  const emptyCount = Math.max(0, minRows - filteredSlotRows.value.length)

  return [
    ...filteredSlotRows.value,
    ...Array.from({ length: emptyCount }, () => null)
  ]
})

// 차고 필터 드롭다운 옵션 목록
const garageFilterOptions = computed(() => {
  return [
    { garageId: 'all', garageName: '전체' },
    { garageId: 'unassigned', garageName: '미배치' },
    { garageId: 'pegasus', garageName: '페가수스' },
    { garageId: 'hangar', garageName: '격납고' },
    ...garageList.value.map((garage) => ({
      garageId: String(garage.garageId),
      garageName: garage.alias ? garage.alias : garage.garageName
    }))
  ]
})

// 선택된 차고 필터 라벨
const selectedGarageFilterLabel = computed(() => {
  if (selectedGarageIds.value.length === 0) {
    return '전체'
  }

  const selectedOptions = garageFilterOptions.value.filter((garage) => {
    return garage.garageId !== 'all' && selectedGarageIds.value.includes(String(garage.garageId))
  })

  if (selectedOptions.length === 0) {
    return '전체'
  }

  if (selectedOptions.length === 1) {
    return selectedOptions[0].garageName
  }

  return `${selectedOptions[0].garageName} 외 ${selectedOptions.length - 1}`
})

// 미획득을 제외한 보유 이동수단 수
const acquiredTransportCount = computed(() => {
  return rows.value.filter((row) => row.acquiredYn !== 'N').length
})

// 외부 클릭 시 차고 필터 드롭다운 닫기
function handleClickOutside(e)
{
  if (!showGarageFilterDropdown.value) {
    return
  }

  const el = garageFilterRef.value

  if (!el) {
    return
  }

  if (!el.contains(e.target)) {
    showGarageFilterDropdown.value = false
  }
}

// 차고 필터 항목 선택/해제 처리
function toggleGarageFilter(garageId)
{
  const targetId = String(garageId)
  const exists = selectedGarageIds.value.includes(targetId)

  if (targetId === 'unassigned' || targetId === 'pegasus' || targetId === 'hangar') {
    if (exists) {
      selectedGarageIds.value = []
    } else {
      selectedGarageIds.value = [targetId]
    }
    return
  }

  if (exists) {
    selectedGarageIds.value = selectedGarageIds.value.filter((id) => {
      return id !== targetId
    })
  } else {
    selectedGarageIds.value = selectedGarageIds.value.filter((id) => {
      return id !== 'unassigned' && id !== 'pegasus' && id !== 'hangar'
    })
    selectedGarageIds.value = [...selectedGarageIds.value, targetId]
  }
}

// 차고 필터와 접힘 상태 초기화
function resetFilters()
{
  selectedGarageIds.value = []
  showGarageFilterDropdown.value = false
  collapsedGarageIds.value = new Set(
    garageList.value
      .filter((garage) => {
        return garage.garageName !== getHangarGarageName('HANGAR') &&
               garage.garageName !== getHangarGarageName('HANGAR_STORAGE') &&
               garage.garageName !== getHangarGarageName('HANGAR_VINEWOOD')
      })
      .map((garage) => garage.garageId)
  )
  searchKeyword.value = ''
}

// 보유 이동수단 검색
function searchOwnedTransport()
{
  const keyword = searchKeyword.value.trim().toLowerCase()

  if (keyword === '') {
    showToast('검색어를 입력하세요', 'error')

    if (searchInputRef.value) {
      searchInputRef.value.focus()
      searchInputRef.value.select()
    }

    return
  }

  const foundList = rows.value.filter((row) => {
    const manufacturer = row.manufacturer ?? ''
    const name = row.name ?? ''
    const searchText = `${manufacturer} ${name}`.toLowerCase()

    return searchText.includes(keyword)
  })

  if (foundList.length === 0) {
    showToast('검색 결과 없음', 'error')
    return
  }

  searchResultList.value = foundList
  showSearchResultModal.value = true
}

// 검색 결과 모달에서 선택한 이동수단 위치로 이동
function moveToSearchResult(row)
{
  showSearchResultModal.value = false
  applySearchResult(row)
}

// storageType 기준 차고명 반환
function getHangarGarageName(storageType)
{
  return HANGAR_GARAGE_NAMES[storageType] ?? ''
}

// 차고명 기준 차고 ID 조회
function findGarageIdByName(garageName)
{
  const matched = garageList.value.find((garage) => {
    return garage.garageName === garageName
  })

  return matched?.garageId ?? null
}

// 특정 차고 펼침 처리
function expandGarage(garageId)
{
  if (!garageId) {
    return
  }

  const next = new Set(collapsedGarageIds.value)
  next.delete(garageId)

  collapsedGarageIds.value = next
}

// 검색 결과를 화면 상태(차고/선택/상세패널)에 반영
function applySearchResult(row)
{
  if (row.storageType === 'PEGASUS') {
    selectedGarageIds.value = ['pegasus']

  } else if (row.storageType === 'UNASSIGNED' || (!row.storageType && !row.garageId)) {
    selectedGarageIds.value = ['unassigned']

  } else if (
    row.storageType === 'HANGAR' ||
    row.storageType === 'HANGAR_STORAGE' ||
    row.storageType === 'HANGAR_VINEWOOD'
  ) {
    selectedGarageIds.value = ['hangar']

  } else {
    selectedGarageIds.value = [String(row.garageId)]

    collapsedGarageIds.value = new Set(
      garageList.value
        .map((garage) => {
          return garage.garageId
        })
        .filter((garageId) => {
          return Number(garageId) !== Number(row.garageId)
        })
    )
  }

  setTimeout(async () => {
    await nextTick()

    highlightedOwnedId.value = Number(row.id)

    const el = listScrollRef.value?.querySelector(
      `[data-row-id="${row.id}"]`
    )

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }

    if (highlightTimer) {
      clearTimeout(highlightTimer)
    }

    highlightTimer = setTimeout(() => {
      highlightedOwnedId.value = null
    }, 1800)
  }, 0)
}

// 특정 차고 접힘 상태 토글
function toggleGarageCollapsed(garageId)
{
  const next = new Set(collapsedGarageIds.value)

  if (next.has(garageId)) {
    next.delete(garageId)
  } else {
    next.add(garageId)
  }

  collapsedGarageIds.value = next
}

// 모든 차고 접힘/펼침 토글
function toggleAllGaragesCollapsed()
{
  const garageIds = garageList.value
    .filter((garage) => {
      return garage.garageName !== getHangarGarageName('HANGAR') &&
             garage.garageName !== getHangarGarageName('HANGAR_STORAGE') &&
             garage.garageName !== getHangarGarageName('HANGAR_VINEWOOD')
    })
    .map((garage) => {
      return garage.garageId
    })
    .filter((garageId) => {
      return garageId !== null && garageId !== undefined
    })

  if (garageIds.length === 0) {
    return
  }

  if (allGarageCollapsed.value) {
    collapsedGarageIds.value = new Set()
    return
  }

  collapsedGarageIds.value = new Set(garageIds)
}

// 등록 모달 열기
function openCreateModal()
{
  modalMode.value = 'create'
  editTarget.value = null
  showModal.value = true
}

// 수정 모달 열기
function openEdit(row)
{
  if (!row) {
    return
  }

  modalMode.value = 'edit'
  editTarget.value = row
  showModal.value = true
}

// 슬롯 더블클릭 동작 처리
function handleSlotDoubleClick(row)
{
  if (!row) {
    return
  }

  if (row.type === 'garageHeader') {
    return
  }

  // 일반 슬롯만 아래 정책 적용
  if (row.type !== 'slot') {
    return
  }

  if (String(row.garage || '').includes('격납고')) {
    return
  }

  // 빈 슬롯만 등록 모달 허용
  if (!row.isEmpty) {
    return
  }

  modalMode.value = 'create'
  editTarget.value = {
    garageId: row.garageId,
    slotNo: row.slot
  }
  showModal.value = true
}

// 차량 카드 클릭 시 상세 페이지로 이동
function handleRowClick(row)
{
  if (!row) {
    return
  }

  if (row.type === 'garageHeader') {
    return
  }

  // 빈 슬롯은 상세 페이지로 이동하지 않음
  if (row.type === 'slot' && row.isEmpty) {
    return
  }

  activeRowKey.value = getRowHighlightKey(row)

  // 상세 페이지 이동임을 표시
  navigatingToDetail = true

  // 상세 페이지 이동 전 목록 상태 저장
  saveOwnedListState(row.id)

  router.push(`/owned/${row.id}`)
}

// 행이 드래그 가능한지 여부
function canDragRow(row)
{
  if (!row) {
    return false
  }

  if (row.type === 'hangar') {
    return true
  }

  return row.type === 'slot' && !row.isEmpty
}

// 행이 드롭 가능한지 여부
function canDropToRow(row)
{
  if (!row) {
    return false
  }

  if (draggingRow.value?.type === 'hangar') {
    return row.type === 'hangar'
  }

  return row.type === 'slot'
}

// 차고ID-슬롯번호 조합 키 생성
function getSlotKey(row)
{
  if (!row) {
    return ''
  }

  if (row.type === 'hangar') {
    return `hangar-${row.id}`
  }

  return `${row.garageId}-${row.slot}`
}

// 행 하이라이트 키 생성
function getRowHighlightKey(row)
{
  if (!row) {
    return ''
  }

  if (row.type === 'slot') {
    return `slot-${row.garageId}-${row.slot}`
  }

  if (row.type === 'unassigned') {
    return `unassigned-${row.id}`
  }

  if (row.type === 'pegasus') {
    return `pegasus-${row.id}`
  }

  if (row.type === 'hangar') {
    return `hangar-${row.id}`
  }

  if (row.type === 'hangarStorage') {
    return `hangar-storage-${row.id}`
  }

  if (row.type === 'hangarVinewood') {
    return `hangar-vinewood-${row.id}`
  }

  return ''
}

// 행 하이라이트 클래스 반환
function getRowHighlightClass(row)
{
  return getRowHighlightKey(row) === activeRowKey.value
    ? 'bg-blue-900/40'
    : ''
}

// 현재 드롭 대상 여부 판단
function isDropTarget(row)
{
  if (!draggingRow.value) {
    return false
  }

  if (dropLoading.value) {
    return false
  }

  if (!canDropToRow(row)) {
    return false
  }

  return activeDropSlotKey.value === getSlotKey(row)
}

// 드래그 시작 처리
function handleDragStart(row)
{
  if (!canDragRow(row)) {
    return
  }

  draggingRow.value = {
    type: row.type,
    ownedId: row.id,
    garageId: row.garageId,
    slotNo: row.slot,
    remark: row.remark,
    imageUrl: row.imageUrl,
    acquiredYn: row.acquiredYn,
    mansionPosition: row.mansionPosition
  }
}

// 드래그 종료 처리
function handleDragEnd()
{
  draggingRow.value = null
  activeDropSlotKey.value = ''
}

// 드래그 오버 처리
function handleDragOver(e, row)
{
  if (dropLoading.value) {
    return
  }

  if (!draggingRow.value) {
    return
  }

  if (!canDropToRow(row)) {
    activeDropSlotKey.value = ''
    return
  }

  activeDropSlotKey.value = getSlotKey(row)
  e.preventDefault()
}

// 오피스 차고 여부 판단
function isOfficeGarage(garageName)
{
  if (!garageName) {
    return false
  }

  return garageName.includes('오피스 차고')
}

// 오피스 차고 번호 추출
function extractOfficeGarageNumber(garageName)
{
  if (!garageName) {
    return null
  }

  const match = garageName.match(/오피스\s*차고\s*(\d+)/)

  if (!match) {
    return null
  }

  return Number(match[1])
}

// 오피스 차고 구역 라벨 생성
function getOfficeSectionLabel(row)
{
  if (!row || row.type !== 'slot') {
    return ''
  }

  if (!isOfficeGarage(row.garage)) {
    return ''
  }

  const officeNo = extractOfficeGarageNumber(row.garage)
  const slot = Number(row.slot)

  if (!officeNo || !slot) {
    return ''
  }

  if (slot >= 1 && slot <= 6) {
    return `${officeNo}A`
  }

  if (slot >= 7 && slot <= 13) {
    return `${officeNo}B`
  }

  if (slot >= 14 && slot <= 20) {
    return `${officeNo}C`
  }

  return ''
}

// 맨션 위치 표시명 반환
function getMansionPositionLabel(row)
{
  const mansionPosition = String(row?.mansionPosition || '').trim()

  if (mansionPosition === 'PODIUM') {
    return '포디움'
  }

  if (mansionPosition === 'D1') {
    return '진입로1'
  }

  if (mansionPosition === 'D2') {
    return '진입로2'
  }

  return ''
}

// 차고 설정 모달 열기
function openGarageSetting(row)
{
  if (!row) {
    return
  }

  selectedGarageSettingRow.value = {
    garageId: row.garageId,
    garage: row.garage,
    garageName: row.garage,
    alias: row.alias ?? '',
    description: row.description ?? ''
  }

  showGarageSettingModal.value = true
}

// 토스트 메시지 표시 (성공/실패 타입 포함)
function showToast(text, type = 'success')
{
  toast.value = { open: true, text, type }

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    toast.value.open = false
  }, 3000)
}

// 보유 이동수단 목록 조회
async function load()
{
  try {
    const res = await http.get('/owned-transports')
    const list = transportDataMapper.extractList(res.data)

    rows.value = list.map((item) => {
      return transportDataMapper.normalizeOwnedTransport(item)
    })
  } catch (err) {
    handleLoadFail('목록 조회 실패:', rows, [], err)
  }
}

// 차고 목록 조회
async function loadGarages(preserveCollapsedState = false)
{
  try {
    const previousCollapsedIds = new Set(collapsedGarageIds.value)

    const res = await http.get('/garages')
    const data = res.data
    const list = transportDataMapper.extractList(data)

    garageList.value = list.map((item) => {
      return transportDataMapper.normalizeGarage(item)
    })

    if (preserveCollapsedState) {
      const validGarageIds = new Set(
        garageList.value
          .map((garage) => {
            return garage.garageId
          })
          .filter((garageId) => {
            return garageId !== null && garageId !== undefined
          })
      )

      collapsedGarageIds.value = new Set(
        [...previousCollapsedIds].filter((garageId) => {
          return validGarageIds.has(garageId)
        })
      )
      return
    }

    const initialCollapsedIds = garageList.value
      .filter((garage) => {
        return garage.garageName !== getHangarGarageName('HANGAR') &&
               garage.garageName !== getHangarGarageName('HANGAR_STORAGE') &&
               garage.garageName !== getHangarGarageName('HANGAR_VINEWOOD')
      })
      .map((garage) => {
        return garage.garageId
      })

    collapsedGarageIds.value = new Set(initialCollapsedIds)
  } catch (err) {
    handleLoadFail('차고 목록 조회 실패:', garageList, [], err)
  }
}

// 이동수단 옵션 목록 조회
async function loadTransportModels()
{
  try {
    const res = await http.get('/transport-models/options')
    const data = res.data
    const list = transportDataMapper.extractList(data)

    transportList.value = list.map((item) => {
      return transportDataMapper.normalizeTransportModel(item)
    })
  } catch (err) {
    handleLoadFail('이동수단 목록 조회 실패:', transportList, [], err)
  }
}

// 조회 API 실패 시 에러 로그를 남기고 기본값으로 초기화
function handleLoadFail(errorMessage, targetRef, fallbackValue, err)
{
  console.error(errorMessage, err)
  targetRef.value = fallbackValue
}

// 드래그한 이동수단을 빈 슬롯으로 이동하거나 다른 이동수단과 자리 교체
async function handleDrop(row)
{
  if (dropLoading.value) {
    return
  }

  if (!draggingRow.value) {
    return
  }

  if (!canDropToRow(row)) {
    return
  }

  const source = draggingRow.value

  // 격납층 내부 순서 변경
  if (source.type === 'hangar') {
    await handleHangarDrop(source, row)
    return
  }

  const targetGarageId = row.garageId
  const targetSlotNo = row.slot

  if (
    Number(source.garageId) === Number(targetGarageId) &&
    Number(source.slotNo) === Number(targetSlotNo)
  ) {
    draggingRow.value = null
    activeDropSlotKey.value = ''
    return
  }

  try {
    dropLoading.value = true

    // 빈 슬롯이면 해당 슬롯으로 이동
    if (row.isEmpty) {
      await http.patch(`/owned-transports/${source.ownedId}`, {
        storageType: 'GARAGE',
        garageId: targetGarageId,
        slotNo: targetSlotNo,
        remark: source.remark,
        imageUrl: source.imageUrl,
        acquiredYn: source.acquiredYn,
        mansionPosition: source.mansionPosition
      })

      showToast('슬롯 이동 완료')
    } else {
      // 이동수단이 있는 슬롯이면 두 이동수단의 자리를 교체
      await http.patch('/owned-transports/swap', {
        sourceOwnedId: source.ownedId,
        targetOwnedId: row.id
      })

      showToast('슬롯 교체 완료')
    }

    await load()
  } catch (err) {
    handleWriteFail('슬롯 처리 실패', err)
  } finally {
    draggingRow.value = null      // 드래그 상태 초기화
    activeDropSlotKey.value = ''  // 드롭 타겟 하이라이트 초기화
    dropLoading.value = false     // 드롭 로딩 상태 초기화
  }
}

// 격납층 내부 드래그 순서 변경 처리
async function handleHangarDrop(source, target)
{
  if (!target || target.type !== 'hangar') {
    draggingRow.value = null
    activeDropSlotKey.value = ''
    return
  }

  if (Number(source.ownedId) === Number(target.id)) {
    draggingRow.value = null
    activeDropSlotKey.value = ''
    return
  }

  try {
    dropLoading.value = true

    const currentList = [...hangarRows.value]

    const sourceIndex = currentList.findIndex((item) => {
      return Number(item.id) === Number(source.ownedId)
    })

    const targetIndex = currentList.findIndex((item) => {
      return Number(item.id) === Number(target.id)
    })

    if (sourceIndex < 0 || targetIndex < 0) {
      return
    }

    const moved = currentList.splice(sourceIndex, 1)[0]
    currentList.splice(targetIndex, 0, moved)

    const payload = currentList.map((item, index) => {
      return {
        ownedId: item.id,
        hangarSortOrder: index + 1
      }
    })

    await http.patch('/owned-transports/hangar/order', payload)

    showToast('격납층 순서 변경 완료')
    await load()
  } catch (err) {
    handleWriteFail('격납층 순서 변경 실패', err)
  } finally {
    draggingRow.value = null
    activeDropSlotKey.value = ''
    dropLoading.value = false
  }
}

// 보유 이동수단 등록 요청 처리
async function handleCreated(payload)
{
  try {
    await http.post('/owned-transports', payload)
    await handleOwnedTransportSuccess('등록 완료')
  } catch (err) {
    handleWriteFail('등록 실패', err)
  }
}

// 보유 이동수단 삭제 요청 처리
async function handleDelete(id)
{
  try {
    await http.delete(`/owned-transports/${id}`)
    await handleOwnedTransportSuccess('삭제 완료')
  } catch (err) {
    handleWriteFail('삭제 실패', err)
  }
}

// 보유 이동수단 수정 요청 처리
async function handleUpdate(payload)
{
  try {
    await http.patch(`/owned-transports/${payload.ownedId}`, {
      storageType: payload.storageType,
      garageId: payload.garageId,
      slotNo: payload.slotNo,
      remark: payload.remark,
      imageUrl: payload.imageUrl,
      acquiredYn: payload.acquiredYn,
      mansionPosition: payload.mansionPosition
    })

    await handleOwnedTransportSuccess('수정 완료')
  } catch (err) {
    handleWriteFail('수정 실패', err)
  }
}

// 등록/수정/삭제 성공 시 후처리
async function handleOwnedTransportSuccess(successMessage)
{
  showModal.value = false     // 모달 닫기
  editTarget.value = null     // 편집 대상 초기화
  activeRowKey.value = ''     // 행 하이라이트 초기화

  showToast(successMessage)   // 성공 토스트 표시

  await load()                // 목록 새로고침
}

// 차고 설정 저장 요청 처리
async function handleGarageSettingSave(payload)
{
  try {
    await http.put(`/garages/${payload.garageId}/setting`, {
      alias: payload.alias,
      description: payload.description
    })

    await handleGarageSettingSuccess('차고 설정 저장 완료')
  } catch (err) {
    handleWriteFail('차고 설정 저장 실패', err)
  }
}

// 차고 설정 저장 성공 시 후처리
async function handleGarageSettingSuccess(successMessage)
{
  showGarageSettingModal.value = false    // 모달 닫기
  selectedGarageSettingRow.value = null   // 설정 대상 초기화

  showToast(successMessage)

  await loadGarages(true)                 // 차고 목록 새로고침 (접힘 상태 유지)
}

// 쓰기 작업 실패 시 에러 로그와 토스트 처리
function handleWriteFail(errorMessage, err)
{
  console.error(errorMessage, err)

  const responseMessage =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message

  const finalMessage = responseMessage
    ? `${errorMessage} - ${responseMessage}`
    : errorMessage

  showToast(finalMessage, 'error')
}

// 풋터 미배치/페가수스/격납고 빠른 필터 적용
function applySpecialFilter(type)
{
  if (type === 'hangar') {
    selectedGarageIds.value = ['hangar']
    return
  }

  if (type === 'unassigned') {
    selectedGarageIds.value = ['unassigned']
    return
  }

  if (type === 'pegasus') {
    selectedGarageIds.value = ['pegasus']
    return
  }
}

// 현재 선택된 특수 보관 필터(미배치/페가수스/격납고) 여부
function isActiveSpecialFilter(type)
{
  return selectedGarageIds.value.length === 1 &&
         selectedGarageIds.value.includes(type)
}

// 현재 차고 목록 화면 상태 저장
function saveOwnedListState(selectedOwnedId)
{
  sessionStorage.setItem(
    OWNED_LIST_STATE_KEY,
    JSON.stringify({
      collapsedGarageIds: [...collapsedGarageIds.value],
      selectedGarageIds: [...selectedGarageIds.value],
      scrollTop: listScrollRef.value?.scrollTop ?? 0,
      selectedOwnedId
    })
  )
}

// 저장된 차고 목록 화면 상태 복원
async function restoreOwnedListState()
{
  const savedStateText = sessionStorage.getItem(OWNED_LIST_STATE_KEY)

  if (!savedStateText) {
    return
  }

  try {
    const savedState = JSON.parse(savedStateText)

    if (Array.isArray(savedState.collapsedGarageIds)) {
      collapsedGarageIds.value = new Set(savedState.collapsedGarageIds)
    }

    if (Array.isArray(savedState.selectedGarageIds)) {
      selectedGarageIds.value = savedState.selectedGarageIds
    }

    await nextTick()

    if (listScrollRef.value) {
      listScrollRef.value.scrollTop = Number(savedState.scrollTop ?? 0)
    }

    highlightedOwnedId.value = savedState.selectedOwnedId
      ? Number(savedState.selectedOwnedId)
      : null

    await nextTick()

    ensureHighlightedCardVisible(highlightedOwnedId.value)

    if (highlightTimer) {
      clearTimeout(highlightTimer)
    }

    highlightTimer = setTimeout(() => {
      highlightedOwnedId.value = null
    }, 1800)

  } catch (err) {
    console.error('차고 목록 상태 복원 실패:', err)
    sessionStorage.removeItem(OWNED_LIST_STATE_KEY)
  }
}

// 강조할 차량 카드가 목록 화면 밖에 있으면 보이도록 스크롤 보정
function ensureHighlightedCardVisible(ownedId)
{
  if (!ownedId || !listScrollRef.value) {
    return
  }

  const cardElement = listScrollRef.value.querySelector(
    `[data-row-id="${ownedId}"]`
  )

  if (!cardElement) {
    return
  }

  const containerRect = listScrollRef.value.getBoundingClientRect()
  const cardRect = cardElement.getBoundingClientRect()

  const isVisible =
    cardRect.top >= containerRect.top &&
    cardRect.bottom <= containerRect.bottom

  if (!isVisible) {
    cardElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }
}

// 초기 데이터 조회 및 이벤트 등록
onMounted(async () => {
  await Promise.all([
    load(),
    loadTransportModels(),
    loadGarages()
  ])

  await restoreOwnedListState()

  // 복원은 한 번만 사용
  sessionStorage.removeItem(OWNED_LIST_STATE_KEY)

  document.addEventListener('mousedown', handleClickOutside)
})

// 컴포넌트 종료 시 이벤트 및 타이머 제거
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)

  // 상세 페이지 이동이 아닌 경우 저장된 목록 상태 제거
  if (!navigatingToDetail) {
    sessionStorage.removeItem(OWNED_LIST_STATE_KEY)
  }
  
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }

  if (highlightTimer) {
    clearTimeout(highlightTimer)
    highlightTimer = null
  }
})
</script>