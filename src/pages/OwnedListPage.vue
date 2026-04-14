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
              <div
                v-if="toast.open"
                class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
                       px-4 py-1.5 rounded-md border
                       bg-neutral-900 border-neutral-700
                       text-neutral-200 text-sm
                       shadow-lg flex items-center gap-2 pointer-events-none"
              >
                <span class="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                <span>{{ toast.text }}</span>
              </div>

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
                        @click="toggleGarageCollapsed(row.garageId)"
                      >
                        <div class="flex items-center w-full">
                          <span
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
                          <div class="ml-auto">
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
                      <td :class="['px-3 py-2 border-b border-neutral-700', getRowHighlightClass(row)]">-</td>
                      <td :class="['px-3 py-2 border-b border-neutral-700', getRowHighlightClass(row)]">{{ row.manufacturer }}</td>
                      <td :class="['px-3 py-2 border-b border-neutral-700', getRowHighlightClass(row)]">
                        <div class="flex items-baseline gap-1.5 min-w-0">
                          <span class="truncate">
                            {{ row.name }}
                          </span>
                          <span
                            v-if="getUpgradeTypeDisplayText(row.upgradeType)"
                            class="text-[10px] text-neutral-400 shrink-0"
                          >
                            {{ getUpgradeTypeDisplayText(row.upgradeType) }}
                          </span>
                        </div>
                      </td>
                      <td :class="['px-3 py-2 border-b border-neutral-700', getRowHighlightClass(row)]">{{ row.category }}</td>
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
                            {{ row.name }}
                          </span>
                          <span
                            v-if="getUpgradeTypeDisplayText(row.upgradeType)"
                            class="text-[10px] text-neutral-400 shrink-0"
                          >
                            {{ getUpgradeTypeDisplayText(row.upgradeType) }}
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
import { Plus, RotateCcw, ChevronDown, Settings } from 'lucide-vue-next'
import OwnedTransportModal from '@/components/OwnedTransportModal.vue'
import GarageSettingModal from '@/components/GarageSettingModal.vue'

// list state
const rows = ref([])

const draggingRow = ref(null)
const dropLoading = ref(false)
const activeDropSlotKey = ref('')

// options for modal
const transportList = ref([])
const garageList = ref([])

const showModal = ref(false)
const modalMode = ref('create') // create | edit
const editTarget = ref(null)

const activeRowKey = ref('')
let activeRowTimer = null

const selectedGarageIds = ref([])
const showGarageFilterDropdown = ref(false)
const garageFilterRef = ref(null)

const collapsedGarageIds = ref(new Set())

const showGarageSettingModal = ref(false)
const selectedGarageSettingRow = ref(null)

watch(selectedGarageIds, () => {
  activeRowKey.value = ''
})

const upgradeTypeDisplayMap = {
  'HSW': 'HSW',
  '드리프트': 'Drift',
  '아레나': 'Arena',
  '베니즈 커스텀': "Benny's"
}

function extractList(data)
{
  return (
    (Array.isArray(data?.items) && data.items) ||
    (Array.isArray(data?.list) && data.list) ||
    (Array.isArray(data?.content) && data.content) ||
    (Array.isArray(data?.data) && data.data) ||
    (Array.isArray(data) && data) ||
    []
  )
}

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

function resetFilters()
{
  selectedGarageIds.value = []
  collapsedGarageIds.value = new Set()
}

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

function openCreateModal()
{
  modalMode.value = 'create'
  editTarget.value = null
  showModal.value = true
}

function openEdit(row)
{
  if (!row) {
    return
  }

  modalMode.value = 'edit'
  editTarget.value = row
  showModal.value = true
}

watch(showModal, (isOpen) => {
  if (!isOpen) {
    activeRowKey.value = ''
  }
})

function highlightRow(row)
{
  const key = getRowHighlightKey(row)

  if (!key) {
    return
  }

  activeRowKey.value = key
}

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

// toast
const toast = ref({ open: false, text: '' })
let toastTimer = null

function showToast(text)
{
  toast.value = { open: true, text }

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    toast.value.open = false
  }, 3000)
}

onUnmounted(() =>
{
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }
})

async function handleCreated(payload)
{
  try {
    await http.post('/owned-transports', payload)

    showModal.value = false
    editTarget.value = null
    activeRowKey.value = ''

    showToast('등록 완료')

    await load()

  } catch (err) {
    console.error('등록 실패:', err)
    showToast('등록 실패')
  }
}

async function handleDelete(id)
{
  try {
    await http.delete(`/owned-transports/${id}`)
    showToast('삭제 완료')
    showModal.value = false
    editTarget.value = null
    activeRowKey.value = ''

    await load()
  } catch (err) {
    console.error('삭제 실패:', err)
    showToast('삭제 실패')
  }
}

async function handleUpdate(payload)
{
  try {
    await http.patch(`/owned-transports/${payload.ownedId}`, {
      storageType: payload.storageType,
      garageId: payload.garageId,
      slotNo: payload.slotNo
    })

    showToast('수정 완료')
    showModal.value = false
    editTarget.value = null
    activeRowKey.value = ''

    await load()
  } catch (err) {
    console.error('수정 실패:', err)
    showToast('수정 실패')
  }
}

function canDragRow(row)
{
  return !!row && row.type === 'slot' && !row.isEmpty
}

function canDropToRow(row)
{
  return !!row && row.type === 'slot'
}

function getSlotKey(row)
{
  if (!row) {
    return ''
  }

  return `${row.garageId}-${row.slot}`
}

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

function getRowHighlightClass(row)
{
  return getRowHighlightKey(row) === activeRowKey.value
    ? 'bg-blue-900/40'
    : ''
}

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

function handleDragEnd()
{
  draggingRow.value = null
  activeDropSlotKey.value = ''
}

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

    // 1) 빈 슬롯으로 이동
    if (row.isEmpty) {
      await http.patch(`/owned-transports/${source.ownedId}`, {
        storageType: 'GARAGE',
        garageId: targetGarageId,
        slotNo: targetSlotNo
      })

      showToast('슬롯 이동 완료')
    } else {
      // 2) 차량 있는 슬롯과 자리 교체
      await http.patch('/owned-transports/swap', {
        sourceOwnedId: source.ownedId,
        targetOwnedId: row.id
      })

      showToast('슬롯 교체 완료')
    }

    await load()
  } catch (err) {
    console.error('슬롯 처리 실패:', err)
    showToast('슬롯 처리 실패')
  } finally {
    draggingRow.value = null
    activeDropSlotKey.value = ''
    dropLoading.value = false
  }
}

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
      description: garage.description ?? null,
      collapsedYn: garage.collapsedYn ?? 'N'
    })

    if (collapsedGarageIds.value.has(garageId)) {
      return
    }

    for (let slotNo = 1; slotNo <= slotCount; slotNo++) {
      const found = rows.value.find((row) => {
        return Number(row.garageId) === Number(garageId) && Number(row.slot) === slotNo
      })

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

const filteredSlotRows = computed(() => {
  if (selectedGarageIds.value.length === 0) {
    return slotRows.value
  }

  return slotRows.value.filter((row) => {
    return selectedGarageIds.value.includes(String(row.garageId))
  })
})

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

const unassignedCount = computed(() => {
  return unassignedRows.value.length
})

const pegasusCount = computed(() => {
  return pegasusRows.value.length
})

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

const garageFilterOptions = computed(() => {
  return [
    { garageId: 'all', garageName: '전체' },
    { garageId: 'unassigned', garageName: '미배치' },
    { garageId: 'pegasus', garageName: '페가수스' },
    ...garageList.value.map((garage) => ({
      garageId: String(garage.garageId),
      garageName: garage.garageName
    }))
  ]
})

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

const totalSlotCount = computed(() => {
  return garageList.value.reduce((sum, garage) => {
    return sum + Number(garage.slotCount ?? 0)
  }, 0)
})

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

const garageFooterText = computed(() => {
  return `총 ${totalSlotCount.value}칸 중 ${usedSlotCount.value}칸 사용중`
})

// api: list
async function load()
{
  try {
    const res = await http.get('/owned-transports')
    const list = extractList(res.data)

    rows.value = list.map((x) => ({
      id: x.id ?? x.ownedTransportId ?? x.ownedId ?? x.transportId,
      garageId: x.garageId ?? x.garage_id ?? null,
      garage: x.garageName ?? x.garage_name ?? x.garage ?? x.storage ?? '-',
      slot: x.slot ?? x.slotNo ?? x.slot_no ?? null,
      storageType: x.storageType ?? x.storage_type ?? '',

      manufacturer: x.manufacturer ?? x.maker ?? x.brand ?? x.manufacturerName ?? '-',
      name: x.name ?? x.modelName ?? x.transportName ?? '-',
      upgradeType: x.upgradeType ?? x.upgrade_type ?? '',
      category: x.category ?? x.transportCategory ?? x.className ?? x.class ?? '-',
      price: x.price ?? x.priceNumber ?? x.cost ?? null,
      releaseDate: x.releaseDate ?? x.release_date ?? '-'
    }))

  } catch (err) {
    console.error('목록 조회 실패:', err)
    rows.value = []
  }
}

// api: transports (options)
async function loadTransportModels()
{
  try {
    const res = await http.get('/transport-models/options')
    const data = res.data
    const list = extractList(data)

    transportList.value = list
  } catch (err) {
    console.error('이동수단 목록 조회 실패:', err)
    transportList.value = []
  }
}

// api: garages (options)
async function loadGarages()
{
  try {
    const res = await http.get('/garages')
    const data = res.data
    const list = extractList(data)

    garageList.value = list.map((x) => ({
      garageId: x.garageId ?? x.id ?? x.garage_id,
      garageName: x.garageName ?? x.name ?? x.garage ?? x.garage_name ?? '-',
      slotCount: Number(x.slotCount ?? x.slot_count ?? x.totalSlots ?? x.capacity ?? 0),

      alias: x.alias ?? null,
      description: x.description ?? null,
      collapsedYn: x.collapsedYn ?? x.collapsed_yn ?? 'N'
    }))

    const initialCollapsedIds = garageList.value
      .filter((garage) => {
        return garage.collapsedYn === 'Y'
      })
      .map((garage) => {
        return garage.garageId
      })

    collapsedGarageIds.value = new Set(initialCollapsedIds)
  } catch (err) {
    console.error('차고 목록 조회 실패:', err)
    garageList.value = []
  }
}

function isOfficeGarage(garageName)
{
  if (!garageName) {
    return false
  }

  return garageName.includes('오피스 차고')
}

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

function formatOfficeGarageSlot(garageName, slotNo)
{
  const officeNo = extractOfficeGarageNumber(garageName)
  const slot = Number(slotNo)

  if (!officeNo || !slot) {
    return String(slotNo ?? '-')
  }

  let section = ''

  if (slot >= 1 && slot <= 6) {
    section = 'A'
  } else if (slot >= 7 && slot <= 13) {
    section = 'B'
  } else if (slot >= 14 && slot <= 20) {
    section = 'C'
  } else {
    return String(slotNo)
  }

  return `${officeNo}${section}-${slot}`
}

function getDisplaySlot(row)
{
  if (!row || row.type !== 'slot') {
    return '-'
  }

  if (row.isEmpty && !row.garage) {
    return String(row.slot ?? '-')
  }

  if (isOfficeGarage(row.garage)) {
    return formatOfficeGarageSlot(row.garage, row.slot)
  }

  return String(row.slot ?? '-')
}

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

async function handleGarageSettingSave(payload)
{
  try {
    await http.put(`/garages/${payload.garageId}/setting`, {
      alias: payload.alias,
      description: payload.description
    })

    showGarageSettingModal.value = false
    selectedGarageSettingRow.value = null

    showToast('차고 설정 저장 완료')

    await loadGarages()
  } catch (err) {
    console.error('차고 설정 저장 실패:', err)
    showToast('차고 설정 저장 실패')
  }
}

// init
onMounted(() => {
  load()
  loadTransportModels()
  loadGarages()

  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)

  if (activeRowTimer) {
    clearTimeout(activeRowTimer)
    activeRowTimer = null
  }
})
</script>