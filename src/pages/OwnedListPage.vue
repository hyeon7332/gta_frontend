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
                  <span class="text-[11px] text-neutral-400">▼</span>
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
                  @click="selectedGarageIds = []"
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
                  <col class="w-[32%]" />  <!-- 상징 -->
                </colgroup>
                <thead>
                  <tr class="text-[13px] text-neutral-200 font-medium tracking-wide whitespace-nowrap">
                    <th class="sticky top-0 z-10 bg-neutral-800 px-3 py-2 text-left border-b border-r border-neutral-700">슬롯</th>
                    <th class="sticky top-0 z-10 bg-neutral-800 px-3 py-2 text-left border-b border-r border-neutral-700">제조사</th>
                    <th class="sticky top-0 z-10 bg-neutral-800 px-3 py-2 text-left border-b border-r border-neutral-700">모델명</th>
                    <th class="sticky top-0 z-10 bg-neutral-800 px-3 py-2 text-left border-b border-r border-neutral-700">분류</th>
                    <th class="sticky top-0 z-10 bg-neutral-800 px-3 py-2 text-left border-b border-r border-neutral-700">상징</th>
                  </tr>
                </thead>

                <tbody class="text-[13px] text-neutral-200 border-b border-neutral-700">
                  <tr
                    v-for="(row, index) in displayRows"
                    :key="row ? row.id : `empty-${index}`"
                    :class="[
                      'h-[40px]',
                      row && row.type === 'slot' && !row.isEmpty ? 'hover:bg-neutral-700/40 transition cursor-pointer' : '',
                      row && row.type === 'slot' && row.isEmpty ? 'text-neutral-500' : ''
                    ]"
                    @dblclick="row && row.type === 'slot' && !row.isEmpty && openEdit(row)"
                  >
                    <!-- 차고 헤더 -->
                    <template v-if="row && row.type === 'garageHeader'">
                      <td colspan="5"
                          class="h-[40px] px-3 py-2
                                bg-neutral-700/40
                                border-b border-neutral-600
                                text-[13px] font-semibold text-neutral-300 align-middle">
                        {{ row.garage }}
                      </td>
                    </template>
                    
                    <!-- 미배치 row -->
                    <template v-else-if="row && row.type === 'unassigned'">
                      <td class="px-3 py-2 border-b border-neutral-700">-</td>
                      <td class="px-3 py-2 border-b border-neutral-700">{{ row.manufacturer }}</td>
                      <td class="px-3 py-2 border-b border-neutral-700">{{ row.name }}</td>
                      <td class="px-3 py-2 border-b border-neutral-700">{{ row.category }}</td>
                      <td class="px-3 py-2 border-b border-neutral-700">
                        {{ row.decal }}
                      </td>
                    </template>

                    <!-- 일반 슬롯 row -->
                    <template v-else-if="row">
                      <td class="h-[40px] px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap align-middle">
                        {{ row.slot }}
                      </td>
                      <td class="h-[40px] px-3 py-2 text-left border-b border-neutral-700 truncate align-middle">{{ row.manufacturer }}</td>
                      <td class="h-[40px] px-3 py-2 text-left border-b border-neutral-700 truncate align-middle">{{ row.name }}</td>
                      <td class="h-[40px] px-3 py-2 text-left border-b border-neutral-700 truncate align-middle">{{ row.category }}</td>
                      <td class="h-[40px] px-3 py-2 text-left border-b border-neutral-700 truncate align-middle">
                        {{ row.decal }}
                      </td>
                    </template>

                    <template v-else>
                      <td colspan="5" class="h-[40px]"></td>
                    </template>
                  </tr>
                </tbody>
              </table>
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { http } from '@/api/http'
import { Plus, RotateCcw  } from 'lucide-vue-next'
import OwnedTransportModal from '@/components/OwnedTransportModal.vue'

// list state
const rows = ref([])

// options for modal
const transportList = ref([])
const garageList = ref([])

const showModal = ref(false)
const modalMode = ref('create') // create | edit
const editTarget = ref(null)

const selectedGarageIds = ref([])
const showGarageFilterDropdown = ref(false)
const garageFilterRef = ref(null)

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

  if (targetId === 'unassigned') {
    selectedGarageIds.value = ['unassigned']
    return
  }

  const exists = selectedGarageIds.value.includes(targetId)

  if (exists) {
    selectedGarageIds.value = selectedGarageIds.value.filter((id) => {
      return id !== targetId
    })
  } else {
    selectedGarageIds.value = selectedGarageIds.value.filter((id) => {
      return id !== 'unassigned'
    })
    selectedGarageIds.value = [...selectedGarageIds.value, targetId]
  }
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
    await http.post('/api/owned-transports', payload)

    showModal.value = false
    editTarget.value = null

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
    await http.delete(`/api/owned-transports/${id}`)
    showToast('삭제 완료')
    showModal.value = false
    editTarget.value = null
    await load()
  } catch (err) {
    console.error('삭제 실패:', err)
    showToast('삭제 실패')
  }
}

async function handleUpdate(payload)
{
  try {
    await http.patch(`/api/owned-transports/${payload.ownedId}`, {
      decal: payload.decal,
      garageId: payload.garageId,
      slotNo: payload.slotNo
    })

    showToast('수정 완료')
    showModal.value = false
    editTarget.value = null

    await load()
  } catch (err) {
    console.error('수정 실패:', err)
    showToast('수정 실패')
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
      garage: garageName
    })

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
          decal: '-',
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
  return rows.value.filter((row) => {
    return !row.garageId
  }).map((row) => ({
    ...row,
    type: 'unassigned'
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

const displayRows = computed(() => {
  // 미배치 선택된 경우
  if (selectedGarageIds.value.includes('unassigned')) {
    return unassignedRows.value
  }

  // 기존 슬롯 로직
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

// api: list
async function load()
{
  try {
    const res = await http.get('/api/owned-transports')
    const data = res.data
    const list = extractList(data)

    rows.value = list.map((x) => ({
      id: x.id ?? x.ownedTransportId ?? x.ownedId ?? x.transportId,
      garageId: x.garageId ?? x.garage_id ?? null,
      garage: (x.garage ?? x.storage ?? x.garageName ?? x.garage_name ?? '-') || '-',
      slot: Number(x.slot ?? x.slotNo ?? x.slot_no ?? 0),

      manufacturer: x.manufacturer ?? x.maker ?? x.brand ?? x.manufacturerName ?? '-',
      name: x.name ?? x.modelName ?? x.transportName ?? '-',
      category: x.category ?? x.transportCategory ?? x.className ?? x.class ?? '-',
      decal: x.decal ?? '-',
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
    const res = await http.get('/api/transport-models')
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
    const res = await http.get('/api/garages')
    const data = res.data
    const list = extractList(data)

    garageList.value = list.map((x) => ({
      garageId: x.garageId ?? x.id ?? x.garage_id,
      garageName: x.garageName ?? x.name ?? x.garage ?? x.garage_name ?? '-',
      type: x.type ?? x.garageType ?? '',
      slotCount: Number(x.slotCount ?? x.slot_count ?? x.totalSlots ?? x.capacity ?? 0)
    }))
  } catch (err) {
    console.error('차고 목록 조회 실패:', err)
    garageList.value = []
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
})
</script>