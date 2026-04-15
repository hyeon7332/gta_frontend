<template>
  <!-- page background -->
  <div class="min-h-[calc(100dvh-56px)] bg-neutral-700 flex justify-center">
    <div class="w-full max-w-[1000px] px-4 pt-2 pb-4">
      <!-- main panel -->
      <div class="bg-neutral-900/40 border border-neutral-700 rounded-lg shadow-lg overflow-hidden">
        <div class="p-2">
          <div class="border border-neutral-700 rounded-md overflow-hidden">
            <!-- toolbar -->
            <div class="relative flex items-center justify-between px-3 py-2 bg-neutral-900/30 border-b border-neutral-700">
              
              <div ref="garageFilterRef" class="relative flex items-center gap-2 min-w-0">
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

                  <!-- 미배치 + 차고 -->
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

              </div>

              <!-- toast -->
              <Toast
                :open="toast.open"
                :text="toast.text"
                :type="toast.type"
              />

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

            <!-- table -->
            <div class="overflow-y-auto overflow-x-hidden h-[641px]">
              <table class="w-full table-fixed border-separate border-spacing-0">
                <colgroup>
                  <col class="w-[6%]" />   <!-- 슬롯 -->
                  <col class="w-[15%]" />  <!-- 제조사 -->
                  <col class="w-[32%]" />  <!-- 모델명 -->
                  <col class="w-[15%]" />  <!-- 분류 -->
                </colgroup>
                <thead>
                  <tr class="text-[13px] text-neutral-200 font-medium tracking-wide whitespace-nowrap">
                    <th class="sticky top-0 z-10 bg-neutral-800 px-3 py-2 text-left border-b border-r border-neutral-700">슬롯</th>
                    <th class="sticky top-0 z-10 bg-neutral-800 px-3 py-2 text-left border-b border-r border-neutral-700">제조사</th>
                    <th class="sticky top-0 z-10 bg-neutral-800 px-3 py-2 text-left border-b border-r border-neutral-700">모델명</th>
                    <th class="sticky top-0 z-10 bg-neutral-800 px-3 py-2 text-left border-b border-r border-neutral-700">분류</th>
                  </tr>
                </thead>

                <tbody class="text-[13px] text-neutral-200 border-b border-neutral-700">
                  <tr
                    v-for="(row, index) in displayRows"
                    :key="row ? row.id : `empty-${index}`"
                    :draggable="canDragRow(row)"
                    :class="[
                      'h-[40px]',
                      row && row.type === 'slot' && !row.isEmpty ? 'hover:bg-neutral-700/40 transition cursor-pointer' : '',
                      row && row.type === 'slot' && row.isEmpty ? 'text-neutral-500' : '',
                      draggingRow && row && row.type === 'slot' && row.isEmpty ? 'hover:bg-neutral-700/20' : '',
                      isDropTarget(row) ? 'bg-green-900/20' : '',
                      draggingRow && row && draggingRow.ownedId === row.id ? 'opacity-50' : ''
                    ]"
                    @dblclick="handleSlotDoubleClick(row)"
                    @dragstart="handleDragStart(row)"
                    @dragend="handleDragEnd"
                    @dragover="handleDragOver($event, row)"
                    @drop="handleDrop(row)"
                  >
                    <!-- 차고 헤더 -->
                    <template v-if="row && row.type === 'garageHeader'">
                      <td
                        colspan="4"
                        class="h-[40px] px-3 py-2
                              bg-neutral-700/40
                              border-b border-neutral-600
                              text-[13px] font-semibold text-neutral-300 align-middle cursor-pointer"
                        @click="row.garageId ? toggleGarageCollapsed(row.garageId) : null"
                      >
                        <div class="flex items-center w-full">
                          <span
                            v-if="row.garageId"
                            class="text-[11px] text-neutral-400 mr-2 shrink-0"
                          >
                            {{ collapsedGarageIds.has(row.garageId) ? '▶' : '▼' }}
                          </span>

                          <!-- 이름 + 설명 -->
                          <div class="flex items-center gap-2 min-w-0">
                            <span class="truncate">
                              {{ row.alias ? row.alias : row.garage }}
                            </span>

                            <span
                              v-if="row.description"
                              class="text-[11px] text-neutral-400 ml-2"
                            >
                              {{ row.description }}
                            </span>
                          </div>

                          <!-- 설정 버튼 -->
                          <div v-if="row.garageId" class="ml-auto">
                            <button
                              type="button"
                              class="p-1 rounded hover:bg-neutral-600/40 transition"
                              @click.stop="openGarageSetting(row)"
                            >
                              <Settings class="w-4 h-4 text-neutral-400 hover:text-white" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </template>
                    
                    <!-- 미배치 row -->
                    <template v-else-if="row && (row.type === 'unassigned' || row.type === 'pegasus')">
                      <td :class="[tdBaseClass, getRowHighlightClass(row)]">-</td>
                      <td :class="[tdBaseClass, getRowHighlightClass(row)]">{{ row.manufacturer }}</td>
                      <td :class="[tdBaseClass, getRowHighlightClass(row)]">
                        <div class="flex items-baseline gap-1.5 min-w-0">
                          <span class="truncate">
                            {{ getModelDisplay(row) }}
                          </span>
                        </div>
                      </td>
                      <td :class="[tdBaseClass, getRowHighlightClass(row)]">{{ row.category }}</td>
                    </template>

                    <!-- 일반 슬롯 row -->
                    <template v-else-if="row">
                      <td :class="['h-[40px] px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap align-middle', getRowHighlightClass(row)]">
                        <div class="flex items-center">
                          <span class="inline-block w-[18px] text-right text-neutral-100 font-medium tabular-nums">
                            {{ row.slot }}
                          </span>

                          <span
                            v-if="getOfficeSectionLabel(row)"
                            class="ml-2 text-[10px] text-neutral-500"
                          >
                            {{ getOfficeSectionLabel(row) }}
                          </span>
                        </div>
                      </td>
                      <td :class="['h-[40px] px-3 py-2 text-left border-b border-neutral-700 truncate align-middle', getRowHighlightClass(row)]">{{ row.manufacturer }}</td>
                      <td :class="['h-[40px] px-3 py-2 text-left border-b border-neutral-700 align-middle', getRowHighlightClass(row)]">
                        <div class="flex items-baseline gap-1.5 min-w-0">
                          <span class="truncate">
                            {{ getModelDisplay(row) }}
                          </span>
                        </div>
                      </td>
                      <td :class="['h-[40px] px-3 py-2 text-left border-b border-neutral-700 truncate align-middle', getRowHighlightClass(row)]">{{ row.category }}</td>
                    </template>

                    <template v-else>
                      <td colspan="4" class="h-[40px]"></td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- footer -->
            <div
              class="flex items-center justify-between px-3 py-2
                    bg-neutral-900/30 border-t border-neutral-700
                    text-[13px] text-neutral-300"
            >
              <div class="tabular-nums">
                총 
                <span class="font-semibold text-white">
                  {{ totalSlotCount }}
                </span>
                칸 중
                <span
                  class="font-semibold"
                  :class="
                    totalSlotCount === 0
                      ? 'text-neutral-400'
                      : usedSlotCount / totalSlotCount > 0.8
                      ? 'text-red-400'
                      : usedSlotCount / totalSlotCount > 0.5
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  "
                >
                  {{ usedSlotCount }}
                </span>
                칸 사용중
              </div>

              <div class="flex items-center gap-4 text-[13px] text-neutral-400">
                <div>
                  미배치 
                  <span class="text-white font-semibold">
                    {{ unassignedCount }}
                  </span>
                </div>
                <div>
                  페가수스 
                  <span class="text-white font-semibold">
                    {{ pegasusCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

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

  <GarageSettingModal
    v-model:open="showGarageSettingModal"
    :garage="selectedGarageSettingRow"
    @save="handleGarageSettingSave"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { http } from '@/api/http'
import { Plus, RotateCcw, ChevronDown, Settings, ChevronsUpDown } from 'lucide-vue-next'
import OwnedTransportModal from '@/components/OwnedTransportModal.vue'
import GarageSettingModal from '@/components/GarageSettingModal.vue'
import Toast from '@/components/Toast.vue'
import {
  extractList,
  normalizeOwnedTransport,
  normalizeGarage,
  normalizeTransportModel
} from '@/utils/transportDataMapper'

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

// 선택된 차고 필터 목록
const selectedGarageIds = ref([])

// 차고 필터 드롭다운 표시 여부
const showGarageFilterDropdown = ref(false)

// 차고 필터 영역 DOM 참조
const garageFilterRef = ref(null)

// 접힌 차고 ID 집합
const collapsedGarageIds = ref(new Set())

// 차고 설정 모달 표시 여부
const showGarageSettingModal = ref(false)

// 설정 중인 차고 데이터
const selectedGarageSettingRow = ref(null)

// 테이블 셀 기본 스타일
const tdBaseClass = 'px-3 py-2 border-b border-neutral-700'

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

// 개조타입 표시명 매핑
const upgradeTypeDisplayMap = {
  'HSW': 'HSW',
  '드리프트': 'Drift',
  '아레나': 'Arena',
  '베니즈 커스텀': "Benny's"
}

// 모든 일반 차고가 접혀있는지 여부
const allGarageCollapsed = computed(() => {
  const garageIds = garageList.value
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
    if (!row.garageId || !row.slot) {
      return
    }

    const key = `${row.garageId}-${row.slot}`
    map.set(key, row)
  })

  return map
})

// 차고 목록을 기반으로 화면에 표시할 슬롯 구조 생성
const slotRows = computed(() => {
  const result = []

  garageList.value.forEach((garage) => {
    const garageId = garage.garageId
    const garageName = garage.garageName
    const slotCount = Number(garage.slotCount ?? 0)

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
          garage: garageName,
          slot: slotNo,
          isEmpty: false
        })
      } else {
        result.push({
          id: `empty-${garageId}-${slotNo}`,
          type: 'slot',
          garageId,
          garage: garageName,
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

// 테이블에 최종 표시할 행 목록
const displayRows = computed(() => {
  if (selectedGarageIds.value.includes('unassigned')) {
    return unassignedDisplayRows.value
  }

  if (selectedGarageIds.value.includes('pegasus')) {
    return pegasusDisplayRows.value
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

// 전체 슬롯 수
const totalSlotCount = computed(() => {
  return garageList.value.reduce((sum, garage) => {
    return sum + Number(garage.slotCount ?? 0)
  }, 0)
})

// 사용 중인 슬롯 수
const usedSlotCount = computed(() => {
  const occupiedSlotKeys = new Set()

  rows.value.forEach((row) => {
    if (!row.garageId || !row.slot) {
      return
    }

    occupiedSlotKeys.add(`${row.garageId}-${row.slot}`)
  })

  return occupiedSlotKeys.size
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

  if (targetId === 'unassigned' || targetId === 'pegasus') {
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
      return id !== 'unassigned' && id !== 'pegasus'
    })
    selectedGarageIds.value = [...selectedGarageIds.value, targetId]
  }
}

// 차고 필터와 접힘 상태 초기화
function resetFilters()
{
  selectedGarageIds.value = []
  collapsedGarageIds.value = new Set()
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

// 개조타입 표시 텍스트 생성
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

// 모델명 + 개조타입 표시 텍스트 생성
function getModelDisplay(row)
{
  const upgrade = getUpgradeTypeDisplayText(row.upgradeType)

  if (!upgrade) {
    return row.name
  }

  return `${row.name} (${upgrade})`
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

// 행 하이라이트 적용
function highlightRow(row)
{
  const key = getRowHighlightKey(row)

  if (!key) {
    return
  }

  activeRowKey.value = key
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

  highlightRow(row)

  if (row.type === 'unassigned' || row.type === 'pegasus') {
    openEdit(row)
    return
  }

  // 일반 슬롯만 아래 정책 적용
  if (row.type !== 'slot') {
    return
  }

  // 빈 슬롯 → 추가 모달
  if (row.isEmpty) {
    modalMode.value = 'create'
    editTarget.value = {
      garageId: row.garageId,
      slotNo: row.slot
    }
    showModal.value = true
    return
  }

  // 차량 있는 슬롯 → 수정 모달
  openEdit(row)
}

// 행이 드래그 가능한지 여부
function canDragRow(row)
{
  return !!row && row.type === 'slot' && !row.isEmpty
}

// 행이 드롭 가능한지 여부
function canDropToRow(row)
{
  return !!row && row.type === 'slot'
}

// 차고ID-슬롯번호 조합 키 생성
function getSlotKey(row)
{
  if (!row) {
    return ''
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
    ownedId: row.id,
    garageId: row.garageId,
    slotNo: row.slot
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
    const list = extractList(res.data)

    rows.value = list.map((item) => {
      return normalizeOwnedTransport(item)
    })
  } catch (err) {
    handleLoadFail('목록 조회 실패:', rows, [], err)
  }
}

// 차고 목록 조회
async function loadGarages()
{
  try {
    const res = await http.get('/garages')
    const data = res.data
    const list = extractList(data)

    garageList.value = list.map((item) => {
      return normalizeGarage(item)
    })

    const initialCollapsedIds = garageList.value
      .filter((garage) => {
        return garage.collapsedYn === 'Y'
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
    const list = extractList(data)

    transportList.value = list.map((item) => {
      return normalizeTransportModel(item)
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
        slotNo: targetSlotNo
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
      slotNo: payload.slotNo
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
  showGarageSettingModal.value = false  
  selectedGarageSettingRow.value = null   // 선택된 차고 설정 초기화

  showToast(successMessage)

  await loadGarages()                     // 차고 목록 새로고침
}

// 쓰기 작업 실패 시 에러 로그와 토스트 처리
function handleWriteFail(errorMessage, err)
{
  console.error(errorMessage, err)
  showToast(errorMessage, 'error')
}

// 초기 데이터 조회 및 이벤트 등록
onMounted(() => {
  load()
  loadTransportModels()
  loadGarages()

  document.addEventListener('mousedown', handleClickOutside)
})

// 컴포넌트 종료 시 이벤트 및 타이머 제거
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }
})
</script>