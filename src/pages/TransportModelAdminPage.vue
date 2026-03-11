<template>
  <div class="min-h-[calc(100dvh-56px)] bg-neutral-700 flex flex-col">
    <div class="w-full max-w-none px-4 py-4 md:py-6 flex flex-col flex-1 min-h-0">
      <div class="bg-neutral-900/40 border border-neutral-700 rounded-lg shadow-lg overflow-hidden flex flex-col flex-1 min-h-0">
        <div class="p-2 flex flex-col flex-1 min-h-0">
          <div ref="listCardRef" class="border border-neutral-700 rounded-md overflow-hidden flex flex-col flex-1 min-h-0">
            <!-- toolbar -->
            <div class="flex items-center justify-between px-3 py-2 bg-neutral-900/30 border-b border-neutral-700">
              <div class="flex items-center gap-2">
                <input
                  v-model="keyword"
                  type="text"
                  placeholder="제조사 또는 모델명 검색"
                  class="h-8 w-[260px] px-3 rounded-md
                         bg-neutral-800/60 border border-neutral-600
                         text-[13px] text-neutral-100 placeholder-neutral-400
                         outline-none"
                  @keyup.enter="applySearch"
                />

                <button
                  type="button"
                  class="h-8 px-3 rounded-md
                         bg-neutral-800/60 border border-neutral-600
                         text-[13px] text-neutral-200
                         hover:bg-neutral-700 active:bg-neutral-600 transition"
                  @click="applySearch"
                >
                  검색
                </button>
              </div>

              <div class="flex items-center gap-2">
                <button
                  v-if="selectedRow"
                  type="button"
                  class="h-8 px-3 rounded-md
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
                  class="h-8 px-3 rounded-md
                         bg-neutral-800/60 border border-red-700
                         text-[13px] text-red-300
                         hover:bg-red-900/40 active:bg-red-900/60 transition"
                  @click="openDelete"
                >
                  삭제
                </button>

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
                  @click="openAdd"
                >
                  <Plus class="w-4 h-4" />
                  <span>추가</span>
                </button>
              </div>
            </div>

            <!-- table -->
            <div class="mt-3 w-full flex-1 min-h-0 overflow-auto">
              <table class="w-full text-sm text-neutral-200 border-separate border-spacing-0 table-fixed">
                <thead class="bg-neutral-800">
                  <tr class="text-[13px] text-neutral-200 font-medium tracking-wide whitespace-nowrap bg-neutral-900/30">
                    <th class="sticky-col-1 px-3 py-2 text-left w-[160px] border-b border-r border-neutral-700">제조사</th>
                    <th class="sticky-col-2 px-3 py-2 text-left w-[200px] border-b border-r border-neutral-700">모델명</th>
                    <th class="sticky-col-3 px-3 py-2 text-left w-[140px] border-b border-r border-neutral-700">분류</th>
                    <th class="px-3 py-2 text-left w-[160px] border-b border-r border-neutral-700">개조유형</th>
                    <th class="px-3 py-2 text-left w-[200px] border-b border-r border-neutral-700">개조위치</th>
                    <th class="px-3 py-2 text-left w-[90px] border-b border-r border-neutral-700">랩타임</th>
                    <th class="px-3 py-2 text-left w-[110px] border-b border-r border-neutral-700">최고속도</th>
                    <th class="px-3 py-2 text-left w-[120px] border-b border-r border-neutral-700">가격</th>
                    <th class="px-3 py-2 text-left w-[110px] border-b border-r border-neutral-700">출시일</th>
                    <th class="px-3 py-2 text-left w-[250px] border-b border-r border-neutral-700">획득처</th>
                    <th class="px-3 py-2 text-left w-[110px] border-b border-r border-neutral-700">무게</th>
                    <th class="px-3 py-2 text-left w-[70px] border-b border-r border-neutral-700">기어</th>
                    <th class="px-3 py-2 text-left w-[90px] border-b border-r border-neutral-700">구동방식</th>
                    <th class="px-3 py-2 text-left w-[70px] border-b border-r border-neutral-700">좌석</th>
                    <th class="px-3 py-2 text-left w-[380px] border-b border-neutral-700">특징</th>
                    <th class="px-3 py-2 text-left w-[380px] border-b border-r border-neutral-700">성능</th>
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
                      <td
                        class="sticky-col-1 px-3 py-2 text-left border-b border-neutral-700 truncate"
                        :class="getStickyCellClass(row)"
                      >
                        {{ row.manufacturer }}
                      </td>

                      <td
                        class="sticky-col-2 px-3 py-2 text-left border-b border-neutral-700 truncate"
                        :class="getStickyCellClass(row)"
                      >
                        {{ row.name }}
                      </td>

                      <td
                        class="sticky-col-3 px-3 py-2 text-left border-b border-neutral-700 truncate"
                        :class="getStickyCellClass(row)"
                      >
                        {{ row.transportCategory }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">
                        {{ row.upgradeType }}
                      </td>

                      <td 
                        class="px-3 py-2 text-left border-b border-neutral-700 truncate"
                        :title="row.upgradeLocation"
                      >
                        {{ row.upgradeLocation }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ formatLapTime(row.lapTime) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ row.topSpeed }} km/h
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ formatPrice(row.price) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ row.releaseDate }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ row.source }}</td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ formatNumber(row.weight) }} kg</td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ row.driveGears }}</td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ row.driveTrain }}</td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">{{ row.seats }}</td>

                      <td
                        class="px-3 py-2 text-left border-b border-neutral-700 truncate"
                        :title="row.features"
                      >
                        {{ row.features }}
                      </td>

                      <td
                        class="px-3 py-2 text-left border-b border-neutral-700 truncate"
                        :title="row.performance"
                      >
                        {{ row.performance }}
                      </td>
                      
                    </template>

                    <template v-else>
                      <td colspan="16" class="h-[40px]"></td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- footer -->
            <div class="border-t border-neutral-600">
              <div class="h-12 px-4 flex items-center justify-between text-xs text-neutral-200">
                <div>총 {{ rows.length }}건</div>
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
import { Plus } from 'lucide-vue-next'
import { http } from '@/api/http'
import TransportModelModal from '@/components/TransportModelModal.vue'

const rows = ref([])
const keyword = ref('')
const showAdd = ref(false)
const showEdit = ref(false)
const editTarget = ref(null)
const selectedRow = ref(null)
const listCardRef = ref(null)

const displayRows = computed(() => {
  const minRows = 15
  const emptyCount = Math.max(0, minRows - rows.value.length)

  return [
    ...rows.value,
    ...Array.from({ length: emptyCount }, () => null)
  ]
})

async function load()
{
  try {
    const res = await http.get('/api/transport-models', {
      params: {
        keyword: keyword.value
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

    rows.value = list.map((x) => ({
      ...x,
      id: x.id ?? x.transportModelId ?? x.modelId
    }))

    clearSelectionIfNotExists()
  } catch (err) {
    console.error('이동수단 모델 목록 조회 실패:', err)
    rows.value = []
    selectedRow.value = null
  }
}

function applySearch()
{
  load()
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

function openDelete()
{
  if (!selectedRow.value) {
    return
  }

  console.log('삭제 대상:', selectedRow.value)
}

function handleDocumentClick(event)
{
  if (!selectedRow.value) {
    return
  }

  const target = event.target

  if (!(target instanceof Node)) {
    return
  }

  if (listCardRef.value && !listCardRef.value.contains(target)) {
    selectedRow.value = null
  }
}

function formatLapTime(ms)
{
  if (ms === null || ms === undefined || ms === '') {
    return ''
  }

  const value = Number(ms)

  if (!Number.isFinite(value)) {
    return ''
  }

  const minutes = Math.floor(value / 60000)
  const seconds = Math.floor((value % 60000) / 1000)
  const millis = value % 1000

  return `${minutes}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`
}

function formatPrice(value)
{
  if (value === null || value === undefined || value === '') {
    return ''
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value)
}

function formatNumber(value)
{
  if (value === null || value === undefined) {
    return ''
  }

  return new Intl.NumberFormat().format(value)
}

function isSelectedRow(row)
{
  if (!row || !selectedRow.value) {
    return false
  }

  return row.id === selectedRow.value.id
}

function getStickyCellClass(row)
{
  if (isSelectedRow(row)) {
    return 'sticky-col-selected'
  }

  return 'group-hover:sticky-col-hover'
}

onMounted(() => {
  load()
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>