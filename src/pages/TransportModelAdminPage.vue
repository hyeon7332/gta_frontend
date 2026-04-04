<template>
  <div class="h-full bg-neutral-700">
    <div class="w-full max-w-none px-4 pt-2 pb-4">
      <div class="bg-neutral-900/40 border border-neutral-700 rounded-lg shadow-lg overflow-hidden">
        <div class="p-2">
          <div ref="listCardRef" class="border border-neutral-700 rounded-md overflow-hidden">
            <!-- toolbar -->
            <div
              class="flex items-center justify-between gap-3 px-3 py-2
                    bg-neutral-900/30 border-b border-neutral-700 overflow-hidden"
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

            <!-- table -->
            <div class="mt-2 sm:mt-3 w-full overflow-auto max-h-[calc(100dvh-230px)]">
              <table class="w-full text-sm text-neutral-200 border-separate border-spacing-0 table-fixed">
                <thead class="bg-neutral-800">
                  <tr class="text-[13px] text-neutral-200 font-medium tracking-wide whitespace-nowrap bg-neutral-900/30">
                    <th class="px-3 py-2 text-left w-[160px] border-b border-r border-neutral-700">제조사</th>
                    <th class="px-3 py-2 text-left w-[200px] border-b border-r border-neutral-700">모델명</th>
                    <th class="px-3 py-2 text-left w-[140px] border-b border-r border-neutral-700">분류</th>
                    <th class="px-3 py-2 text-left w-[150px] border-b border-r border-neutral-700">개조유형</th>
                    <th class="px-3 py-2 text-left w-[280px] border-b border-r border-neutral-700">개조위치</th>
                    <th class="px-3 py-2 text-left w-[90px] border-b border-r border-neutral-700">랩타임</th>
                    <th class="px-3 py-2 text-left w-[110px] border-b border-r border-neutral-700">최고속도</th>
                    <th class="px-3 py-2 text-left w-[120px] border-b border-r border-neutral-700">가격</th>
                    <th class="px-3 py-2 text-left w-[110px] border-b border-r border-neutral-700">출시일</th>
                    <th class="px-3 py-2 text-left w-[250px] border-b border-r border-neutral-700">획득처</th>
                    <th class="px-3 py-2 text-left w-[110px] border-b border-r border-neutral-700">무게</th>
                    <th class="px-3 py-2 text-left w-[70px] border-b border-r border-neutral-700">기어</th>
                    <th class="px-3 py-2 text-left w-[90px] border-b border-r border-neutral-700">구동방식</th>
                    <th class="px-3 py-2 text-left w-[70px] border-b border-r border-neutral-700">좌석</th>
                    <th class="px-3 py-2 text-left w-[650px] border-b border-r border-neutral-700">특징</th>
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
                        {{ displayUpgradeLocation(row.upgradeLocation) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ formatLapTime(row.lapTime) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ row.topSpeed ? row.topSpeed + ' km/h' : '-' }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ row.price ? formatPrice(row.price) : '-' }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ displayValue(row.releaseDate) }}
                      </td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ displayValue(row.source) }}</td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ row.weight ? formatNumber(row.weight) + ' kg' : '-' }}</td>

                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ displayValue(row.driveGears) }}</td>

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
                      <td colspan="15" class="h-[40px]"></td>
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
import { Plus, X } from 'lucide-vue-next'
import { http } from '@/api/http'
import TransportModelModal from '@/components/TransportModelModal.vue'

const rows = ref([])
const keyword = ref('')
const showAdd = ref(false)
const showEdit = ref(false)
const editTarget = ref(null)
const selectedRow = ref(null)
const listCardRef = ref(null)

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

async function load()
{
  try {
    const res = await http.get('/transport-models', {
      params: {
        keyword: keyword.value,
        page: page.value,
        size: size.value
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

function clearKeyword()
{
  keyword.value = ''
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
  const target = event.target

  if (!(target instanceof Node)) {
    return
  }

  if (!selectedRow.value) {
    return
  }

  if (listCardRef.value && !listCardRef.value.contains(target)) {
    selectedRow.value = null
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

function displayValue(value)
{
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return value
}

function displayUpgradeLocation(value)
{
  if (value === null || value === undefined || value === '') {
    return '개조불가'
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