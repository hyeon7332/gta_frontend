<template>
  <!-- page background -->
  <div class="min-h-[calc(100dvh-56px)] bg-neutral-700 flex justify-center">
    <div class="w-full max-w-[1200px] px-4 pt-2 pb-4">
      <!-- main panel -->
      <div class="bg-neutral-900/40 border border-neutral-700 rounded-lg shadow-lg overflow-hidden">
        <div class="p-2">
          <div class="border border-neutral-700 rounded-md overflow-hidden">
            <!-- toolbar -->
            <div class="relative flex items-center justify-between px-3 py-2 bg-neutral-900/30 border-b border-neutral-700">
              <div class="text-[13px] text-neutral-200 font-medium">
                필터 예정
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
            <div class="overflow-auto max-h-[calc(100dvh-220px)]">
              <table class="w-full min-w-[980px] table-fixed border-separate border-spacing-0">
                <thead class="bg-neutral-800">
                  <tr class="text-[13px] text-neutral-200 font-medium tracking-wide whitespace-nowrap bg-neutral-900/30">
                    <th class="w-[100px] px-3 py-2 text-left border-b border-r border-neutral-700">제조사</th>
                    <th class="w-[230px] px-3 py-2 text-left border-b border-r border-neutral-700">모델명</th>
                    <th class="w-[120px] px-3 py-2 text-left border-b border-r border-neutral-700">분류</th>
                    <th class="w-[200px] px-3 py-2 text-left border-b border-r border-neutral-700">상징</th>
                    <th class="w-[100px] px-3 py-2 text-left border-b border-r border-neutral-700">가격</th>
                    <th class="w-[100px] px-3 py-2 text-left border-b border-r border-neutral-700">출시일</th>
                    <th class="w-[220px] px-3 py-2 text-left border-b border-r border-neutral-700">차고</th>
                    <th class="w-[60px] px-3 py-2 text-left border-b border-neutral-700">슬롯</th>
                  </tr>
                </thead>

                <tbody class="text-[13px] text-neutral-200 border-b border-neutral-700">
                  <tr
                    v-for="(row, index) in displayRows"
                    :key="row ? row.id : `empty-${index}`"
                    :class="row ? 'hover:bg-neutral-700/40 transition cursor-pointer' : ''"
                    @dblclick="openEdit(row)"
                  >
                    <template v-if="row">
                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ row.manufacturer }}</td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ row.name }}</td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ row.category }}</td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">
                        {{ row.decal }}
                      </td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ formatPrice(row.price) }}
                      </td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">
                        {{ row.releaseDate }}
                      </td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 truncate">{{ row.garage }}</td>
                      <td class="px-3 py-2 text-left border-b border-neutral-700 tabular-nums whitespace-nowrap">{{ row.slot }}</td>
                    </template>

                    <template v-else>
                      <td colspan="8" class="h-[40px]"></td>
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
import { ref, onMounted, computed } from 'vue'
import { http } from '@/api/http'
import { Plus } from 'lucide-vue-next'
import OwnedTransportModal from '@/components/OwnedTransportModal.vue'

// list state
const rows = ref([])
const page = ref(1)
const size = ref(20)
const total = ref(0)
const totalPages = ref(0)

// options for modal
const transportList = ref([])
const garageList = ref([])

const showModal = ref(false)
const modalMode = ref('create') // create | edit
const editTarget = ref(null)

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

const displayRows = computed(() => {
  const minRows = 20
  const emptyCount = Math.max(0, minRows - rows.value.length)

  return [
    ...rows.value,
    ...Array.from({ length: emptyCount }, () => null)
  ]
})

// api: list
async function load()
{
  try {
    const res = await http.get('/api/owned-transports', {
      params: {
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
      id: x.id ?? x.ownedTransportId ?? x.ownedId ?? x.transportId,
      manufacturer: x.manufacturer ?? x.maker ?? x.brand ?? x.manufacturerName,
      name: x.name ?? x.modelName ?? x.transportName,
      category: x.category ?? x.transportCategory ?? x.className ?? x.class,
      decal: x.decal,
      price: x.price ?? x.priceNumber ?? x.cost,
      releaseDate: x.releaseDate ?? x.release_date,
      garage: (x.garage ?? x.storage ?? x.garageName ?? '-') || '-',
      slot: (x.slot ?? x.slotNo ?? x.slot_no ?? '-') ?? '-'
    }))

    total.value = totalCount
    totalPages.value = Math.max(1, Math.ceil(totalCount / size.value))
  } catch (err) {
    console.error('목록 조회 실패:', err)
    rows.value = []
    total.value = 0
    totalPages.value = 1
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

const pageNumbers = computed(() => {
  const pages = []

  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }

  return pages
})

function applyQuery()
{
  page.value = 1
  load()
}

function formatPrice(value)
{
  if (value === null || value === undefined) {
    return ''
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value)
}

// api: transports (options)
async function loadTransportModels()
{
  try {
    const res = await http.get('/api/transport-models')
    const data = res.data

    const list =
      (Array.isArray(data?.items) && data.items) ||
      (Array.isArray(data?.list) && data.list) ||
      (Array.isArray(data?.content) && data.content) ||
      (Array.isArray(data?.data) && data.data) ||
      (Array.isArray(data) && data) ||
      []

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

    const list =
      (Array.isArray(data?.items) && data.items) ||
      (Array.isArray(data?.list) && data.list) ||
      (Array.isArray(data?.content) && data.content) ||
      (Array.isArray(data?.data) && data.data) ||
      (Array.isArray(data) && data) ||
      []

    garageList.value = list
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
})
</script>