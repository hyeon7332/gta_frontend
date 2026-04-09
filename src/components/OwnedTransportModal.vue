<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">

      <!-- dim -->
      <div class="absolute inset-0 bg-black/60"></div>

      <div
        ref="modalBoxRef"
        class="relative w-full max-w-[620px] bg-neutral-100 rounded-2xl p-6 shadow-2xl"
      >
        <!-- header -->
        <div class="flex items-center justify-between mb-6">
          <div class="text-xl font-semibold">
            {{ isEditMode ? '보유 이동수단 수정' : '보유 이동수단 등록' }}
          </div>
        </div>

        <!-- body -->
        <div class="grid grid-cols-2 gap-4 mb-6">

          <!-- 이동수단 -->
          <div>
            <div class="text-xs text-neutral-700 mb-1">이동수단</div>

            <!-- 등록 모드 -->
            <template v-if="!isEditMode">

              <div class="relative min-w-0" ref="transportWrapRef">

                <input
                  :value="transportDisplay"
                  type="text"
                  class="w-full h-10 px-3 rounded-md border border-neutral-300 bg-white text-sm"
                  placeholder="이동수단 검색"
                  @click="openTransportDropdown"
                  @input="onTransportInput"
                />

                <div
                  v-if="showTransportDropdown"
                  class="absolute left-0 top-full z-50 mt-1 w-full max-h-[260px] overflow-auto
                         rounded-md border border-neutral-300 bg-white shadow-lg"
                >

                  <button
                    v-for="t in filteredTransportList"
                    :key="t.modelId"
                    type="button"
                    class="w-full text-left px-3 py-2 text-[13px]
                           hover:bg-neutral-100"
                    @click="selectTransport(t)"
                  >
                    {{ t.manufacturer }} {{ t.name }} {{ getUpgradeTypeDisplayText(t.upgradeType) }}
                  </button>

                </div>

              </div>

            </template>

            <!-- 수정 모드 -->
            <template v-else>

              <input
                type="text"
                class="w-full h-10 px-3 rounded-md border border-neutral-300 bg-neutral-100 text-sm"
                :value="`${initialRow?.manufacturer ?? ''} ${initialRow?.name ?? ''}`"
                readonly
              />

            </template>

          </div>

          <!-- 상징 -->
          <div>
            <div class="text-xs text-neutral-700 mb-1">상징</div>

            <input
              v-model="decal"
              type="text"
              class="w-full h-10 px-3 rounded-md border border-neutral-300 bg-white text-sm"
            />

          </div>

          <!-- 차고 -->
          <div>
            <div class="text-xs text-neutral-700 mb-1">차고</div>

            <div class="relative min-w-0" ref="garageWrapRef" @mousedown.stop>
              <input
                ref="garageInputRef"
                :value="garageText"
                type="text"
                placeholder="차고를 검색/선택하세요"
                class="w-full h-10 px-3 rounded-md border border-neutral-300 bg-white text-sm
                      focus:outline-none"
                @click="openGarageDropdown"
                @input="onGarageInput"
                @keydown.esc.stop="closeGarageDropdown"
              />

              <div
                v-if="showGarageDropdown"
                class="absolute left-0 top-full z-50 mt-1 w-full max-h-[260px] overflow-auto
                      rounded-md border border-neutral-300 bg-white shadow-lg"
              >
                <button
                  v-for="g in filteredGarageList"
                  :key="g.garageId"
                  type="button"
                  class="w-full text-left px-3 py-2 text-[13px]
                        hover:bg-neutral-100 active:bg-neutral-200"
                  @click="selectGarage(g)"
                >
                  <div class="text-neutral-900">{{ g.garageName }}</div>
                  <div class="text-neutral-500 text-[12px]">{{ g.type }}</div>
                </button>

                <div
                  v-if="filteredGarageList.length === 0"
                  class="px-3 py-2 text-[13px] text-neutral-500"
                >
                  검색 결과가 없습니다.
                </div>
              </div>
            </div>
          </div>

          <!-- 슬롯 -->
          <div>
            <div class="text-xs text-neutral-700 mb-1">슬롯</div>

            <div class="relative min-w-0" ref="slotWrapRef" @mousedown.stop>
              <input
                ref="slotInputRef"
                :value="slotNoText"
                type="text"
                placeholder="슬롯 번호를 선택하세요"
                class="w-full h-10 px-3 rounded-md border border-neutral-300 bg-white text-sm
                      disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
                      focus:outline-none"
                :disabled="!isSlotEnabled"
                readonly
                @click="openSlotDropdown"
                @keydown.esc.stop="closeSlotDropdown"
              />

              <div
                v-if="showSlotDropdown && isSlotEnabled"
                class="absolute left-0 top-full z-50 mt-1 w-full max-h-[260px] overflow-auto
                      rounded-md border border-neutral-300 bg-white shadow-lg"
              >
                <button
                  v-for="s in slotOptions"
                  :key="s.no"
                  type="button"
                  class="w-full flex items-center justify-between px-3 py-2 text-[13px]
                        hover:bg-neutral-100 active:bg-neutral-200
                        disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="s.occupied"
                  @click="selectSlot(s.no)"
                >
                  <span class="text-neutral-900">{{ s.no }}</span>
                  <span v-if="s.occupied" class="text-[12px] text-neutral-500">사용중</span>
                </button>

                <div
                  v-if="slotOptions.length === 0"
                  class="px-3 py-2 text-[13px] text-neutral-500"
                >
                  슬롯 정보가 없습니다.
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- buttons -->
        <div class="flex justify-end gap-2">

          <button
            class="h-8 px-3 rounded-md border border-neutral-400 bg-neutral-200 text-sm"
            @click="closeModal"
          >
            취소
          </button>

          <button
            v-if="isEditMode"
            class="h-8 px-3 rounded-md bg-red-600 text-white text-sm"
            @click="handleDeleteClick"
          >
            삭제
          </button>

          <button
            class="h-8 px-3 rounded-md bg-black text-white text-sm"
            @click="handleSubmit"
          >
            {{ isEditMode ? '수정' : '등록' }}
          </button>

        </div>

      </div>
    </div>
  </teleport>

  <teleport to="body">
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-[60] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative w-[360px] bg-neutral-100 rounded-xl p-6 shadow-xl">
        <div class="text-lg font-semibold mb-3">
          삭제 확인
        </div>

        <div class="text-sm text-neutral-700 mb-6">
          이 이동수단을 삭제하시겠습니까?
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="h-8 px-3 rounded-md border border-neutral-400 bg-neutral-200 text-sm"
            @click="showDeleteConfirm = false"
          >
            취소
          </button>

          <button
            type="button"
            class="h-8 px-3 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
            @click="confirmDelete"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'
import { http } from '@/api/http'

const props = defineProps({
  open: Boolean,
  mode: String,
  initialRow: Object,
  transportList: Array,
  garageList: Array
})

const emit = defineEmits([
  'update:open',
  'created',
  'update',
  'delete'
])

const isEditMode = computed(() => props.mode === 'edit')

const selectedTransport = ref(null)
const transportDisplay = ref('')
const showTransportDropdown = ref(false)

const decal = ref('')
const selectedGarageId = ref('')
const slotNo = ref('')

const modalBoxRef = ref(null)
const transportWrapRef = ref(null)

const garageWrapRef = ref(null)
const garageInputRef = ref(null)
const slotWrapRef = ref(null)
const slotInputRef = ref(null)

const showGarageDropdown = ref(false)
const showSlotDropdown = ref(false)

const garageQuery = ref('')
const slotQuery = ref('')

const selectedGarage = ref(null)
const occupiedSlotList = ref([])
const currentSlotNo = ref(null)

const garageText = ref('')
const slotNoText = ref('')

const showDeleteConfirm = ref(false)

watch(() => props.open, async (v) => {

  if (v) {

    if (isEditMode.value) {

      const currentDecal = props.initialRow?.decal
      decal.value = currentDecal && currentDecal !== '-'
        ? String(currentDecal).trim()
        : ''

      const g = props.initialRow?.garage
      const s = props.initialRow?.slot

      const garageName = (g && g !== '-') ? String(g) : ''
      const currentSlot = (s && s !== '-') ? Number(s) : null

      const matched = garageName
        ? (Array.isArray(props.garageList)
            ? props.garageList.find((garage) => {
                return String(garage?.garageName || '').trim() === garageName.trim()
              })
            : null)
        : null

      if (matched) {
        selectedGarage.value = matched
        selectedGarageId.value = matched.garageId
        garageText.value = String(matched.garageName || '').trim()
        garageQuery.value = ''

        if (Number.isFinite(currentSlot) && currentSlot > 0) {
          slotNo.value = String(currentSlot)
          slotNoText.value = String(currentSlot)
          currentSlotNo.value = currentSlot
        } else {
          slotNo.value = ''
          slotNoText.value = ''
          currentSlotNo.value = null
        }

        await loadOccupiedSlots(matched.garageId)
      } else {
        selectedGarage.value = null
        selectedGarageId.value = ''
        garageText.value = ''
        garageQuery.value = ''

        slotNo.value = ''
        slotNoText.value = ''
        slotQuery.value = ''
        currentSlotNo.value = null
        occupiedSlotList.value = []
      }

    } else {

      selectedTransport.value = null
      transportDisplay.value = ''

      decal.value = ''

      selectedGarage.value = null
      selectedGarageId.value = ''
      garageText.value = ''
      garageQuery.value = ''

      slotNo.value = ''
      slotNoText.value = ''
      slotQuery.value = ''
      currentSlotNo.value = null
      occupiedSlotList.value = []

      const presetGarageId = props.initialRow?.garageId ?? null
      const presetSlotNo = props.initialRow?.slotNo ?? props.initialRow?.slot ?? null

      if (presetGarageId) {
        const matched = Array.isArray(props.garageList)
          ? props.garageList.find((garage) => {
              return Number(garage?.garageId) === Number(presetGarageId)
            })
          : null

        if (matched) {
          selectedGarage.value = matched
          selectedGarageId.value = matched.garageId
          garageText.value = String(matched.garageName || '').trim()

          await loadOccupiedSlots(matched.garageId)

          if (Number.isFinite(Number(presetSlotNo)) && Number(presetSlotNo) > 0) {
            slotNo.value = String(presetSlotNo)
            slotNoText.value = String(presetSlotNo)
            currentSlotNo.value = Number(presetSlotNo)
          }
        }
      }
    }

    showTransportDropdown.value = false
    showGarageDropdown.value = false
    showSlotDropdown.value = false
    showDeleteConfirm.value = false

    document.addEventListener('keydown', onDocKeyDown)
    document.addEventListener('mousedown', onDocMouseDownCapture, true)

  } else {

    showTransportDropdown.value = false
    showGarageDropdown.value = false
    showSlotDropdown.value = false
    showDeleteConfirm.value = false

    document.removeEventListener('keydown', onDocKeyDown)
    document.removeEventListener('mousedown', onDocMouseDownCapture, true)
  }
})

function closeModal()
{
  emit('update:open', false)
}

function openTransportDropdown()
{
  showTransportDropdown.value = true
}

function onTransportInput(e)
{
  transportDisplay.value = e.target.value
}

const filteredTransportList = computed(() => {

  const kw = transportDisplay.value.toLowerCase()

  return props.transportList.filter((t) => {

    const name = `${t.manufacturer} ${t.name} ${getUpgradeTypeDisplayText(t.upgradeType)}`.toLowerCase()

    return name.includes(kw)
  })
})

const filteredGarageList = computed(() => {
  const kwRaw = String(garageQuery.value || '').trim().toLowerCase()

  if (kwRaw === '') {
    return Array.isArray(props.garageList) ? props.garageList : []
  }

  const tokens = kwRaw.split(/\s+/).filter(Boolean)

  return (Array.isArray(props.garageList) ? props.garageList : []).filter((g) => {
    const garageName = String(g?.garageName || '').toLowerCase()
    const type = String(g?.type || '').toLowerCase()
    const hay = `${garageName} ${type}`

    return tokens.every((tok) => {
      return hay.includes(tok)
    })
  })
})

const isSlotEnabled = computed(() => {
  return !!selectedGarage.value
})

const slotOptions = computed(() => {
  const g = selectedGarage.value

  if (!g) {
    return []
  }

  const cap = Number(g.slotCount)

  if (!Number.isFinite(cap) || cap <= 0) {
    return []
  }

  const occupiedSet = new Set(
    (Array.isArray(occupiedSlotList.value) ? occupiedSlotList.value : [])
      .map((v) => {
        return Number(v)
      })
      .filter((n) => {
        return Number.isFinite(n)
      })
      .filter((n) => {
        return n !== Number(currentSlotNo.value)
      })
  )

  const list = []

  for (let i = 1; i <= cap; i++) {
    list.push({
      no: i,
      occupied: occupiedSet.has(i)
    })
  }
  return list
})

function getUpgradeTypeDisplayText(upgradeType)
{
  if (!upgradeType || upgradeType.trim() === '') {
    return ''
  }

  const map = {
    'HSW': 'HSW',
    '드리프트': 'Drift',
    '아레나': 'Arena',
    '베니즈 커스텀': "Benny's"
  }

  const labels = upgradeType
    .split(',')
    .map(v => v.trim())
    .filter(v => v !== '')
    .map(v => map[v] ?? '')
    .filter(v => v !== '')

  return labels.join(' / ')
}

function selectTransport(t)
{
  selectedTransport.value = t
  transportDisplay.value = `${t.manufacturer} ${t.name} ${getUpgradeTypeDisplayText(t.upgradeType)}`
  showTransportDropdown.value = false
}

function handleSubmit()
{
  if (isEditMode.value) {

    const ownedId = props.initialRow?.id

    if (!ownedId) {
      return
    }

    const hasGarage = !!selectedGarageId.value
    const hasSlot = !!slotNo.value

    if (hasGarage && !hasSlot) {
      alert('차고를 선택한 경우 슬롯은 필수입니다.')
      return
    }

    if (!hasGarage && hasSlot) {
      alert('차고를 선택하지 않으면 슬롯을 선택할 수 없습니다.')
      return
    }

    emit('update', {
      ownedId: ownedId,
      decal: String(decal.value || '').trim(),
      garageId: hasGarage ? selectedGarageId.value : null,
      slotNo: hasSlot ? Number(slotNo.value) : null
    })

    return
  }

  if (!selectedTransport.value) {
    alert('이동수단은 목록에서 선택해야 합니다.')
    return
  }

  const modelId =
    selectedTransport.value?.modelId ??
    selectedTransport.value?.model_id ??
    selectedTransport.value?.id ??
    null

  if (!modelId) {
    alert('이동수단 선택 값에 modelId가 없습니다.')
    return
  }

  const hasGarage = !!selectedGarageId.value
  const hasSlot = !!slotNo.value

  if (hasGarage && !hasSlot) {
    alert('차고를 선택한 경우 슬롯은 필수입니다.')
    return
  }

  if (!hasGarage && hasSlot) {
    alert('차고를 선택하지 않으면 슬롯을 선택할 수 없습니다.')
    return
  }

  emit('created', {
    modelId: Number(modelId),
    decal: String(decal.value || '').trim(),
    garageId: hasGarage ? selectedGarageId.value : null,
    slotNo: hasSlot ? Number(slotNo.value) : null
  })
}

function handleDeleteClick()
{
  showDeleteConfirm.value = true
}

function confirmDelete()
{
  const id = props.initialRow?.id

  showDeleteConfirm.value = false

  if (!id) {
    return
  }

  emit('delete', id)
}

function onDocKeyDown(e)
{
  if (!props.open) {
    return
  }

  if (e.key !== 'Escape') {
    return
  }

  e.preventDefault()
  e.stopPropagation()

  if (showDeleteConfirm.value) {
    showDeleteConfirm.value = false
    return
  }

  if (showSlotDropdown.value) {
    closeSlotDropdown()
    return
  }

  if (showGarageDropdown.value) {
    closeGarageDropdown()
    return
  }

  if (showTransportDropdown.value) {
    showTransportDropdown.value = false
    return
  }

  closeModal()
}

function onDocMouseDownCapture(e)
{
  if (!props.open) {
    return
  }

  if (showDeleteConfirm.value) {
    return
  }

  if (showTransportDropdown.value) {
    const transportEl = transportWrapRef.value

    if (!transportEl) {
      showTransportDropdown.value = false
    } else if (!transportEl.contains(e.target)) {
      showTransportDropdown.value = false
    }
  }

  if (showGarageDropdown.value) {
    const garageEl = garageWrapRef.value

    if (!garageEl) {
      showGarageDropdown.value = false
    } else if (!garageEl.contains(e.target)) {
      showGarageDropdown.value = false
      garageQuery.value = ''
    }
  }

  if (showSlotDropdown.value) {
    const slotEl = slotWrapRef.value

    if (!slotEl) {
      showSlotDropdown.value = false
    } else if (!slotEl.contains(e.target)) {
      showSlotDropdown.value = false
      slotQuery.value = ''
    }
  }

  const modalEl = modalBoxRef.value

  if (!modalEl) {
    return
  }

  if (!modalEl.contains(e.target)) {
    closeModal()
  }
}

async function loadOccupiedSlots(garageId)
{
  if (!garageId) {
    occupiedSlotList.value = []
    return
  }

  try {
    const res = await http.get(`/garages/${garageId}/occupied-slots`)
    const data = res.data

    const list =
      (Array.isArray(data?.items) && data.items) ||
      (Array.isArray(data?.list) && data.list) ||
      (Array.isArray(data?.content) && data.content) ||
      (Array.isArray(data?.data) && data.data) ||
      (Array.isArray(data) && data) ||
      []

    occupiedSlotList.value = list
      .map((v) => {
        return Number(v)
      })
      .filter((n) => {
        return Number.isFinite(n)
      })
      .sort((a, b) => {
        return a - b
      })
  } catch (err) {
    console.error('점유 슬롯 조회 실패:', err)
    occupiedSlotList.value = []
  }
}

function openGarageDropdown()
{
  showTransportDropdown.value = false
  showSlotDropdown.value = false

  garageQuery.value = garageText.value
  showGarageDropdown.value = true
}

function closeGarageDropdown()
{
  showGarageDropdown.value = false
  garageQuery.value = ''

  const el = garageInputRef.value

  if (el && typeof el.blur === 'function') {
    el.blur()
  }
}

function onGarageInput(e)
{
  const value = String(e?.target?.value || '')

  garageText.value = value
  garageQuery.value = value

  selectedGarage.value = null
  selectedGarageId.value = ''
  occupiedSlotList.value = []

  slotNo.value = ''
  slotNoText.value = ''
  slotQuery.value = ''
  currentSlotNo.value = null

  showSlotDropdown.value = false
  showGarageDropdown.value = true
}

async function selectGarage(g)
{
  selectedGarage.value = g
  selectedGarageId.value = g.garageId
  garageText.value = String(g.garageName || '').trim()

  slotNo.value = ''
  slotNoText.value = ''
  slotQuery.value = ''
  currentSlotNo.value = null

  await loadOccupiedSlots(g.garageId)
  closeGarageDropdown()
}

function openSlotDropdown()
{
  if (!isSlotEnabled.value) {
    return
  }

  showTransportDropdown.value = false
  showGarageDropdown.value = false

  slotQuery.value = ''
  showSlotDropdown.value = true
}

function closeSlotDropdown()
{
  showSlotDropdown.value = false
  slotQuery.value = ''

  const el = slotInputRef.value

  if (el && typeof el.blur === 'function') {
    el.blur()
  }
}

function selectSlot(no)
{
  slotNo.value = String(no)
  slotNoText.value = String(no)
  closeSlotDropdown()
}

onUnmounted(() => {
  document.removeEventListener('keydown', onDocKeyDown)
  document.removeEventListener('mousedown', onDocMouseDownCapture, true)
})
</script>