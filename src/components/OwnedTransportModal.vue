<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">

      <!-- dim -->
      <div class="absolute inset-0 bg-black/60"></div>

      <div
        ref="modalBoxRef"
        class="relative w-[620px] max-h-[90vh] bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl overflow-hidden"
      >
        <!-- header -->
        <div class="px-4 py-3 border-b border-neutral-700">
          <div class="text-[15px] font-semibold text-neutral-100">
            {{ isEditMode ? '보유 이동수단 수정' : '보유 이동수단 등록' }}
          </div>
        </div>

        <!-- body -->
        <div class="grid grid-cols-2 gap-4 p-4">

          <!-- 이동수단 -->
          <div>
            <div class="text-xs text-neutral-400 mb-1">이동수단</div>

            <!-- 등록 모드 -->
            <template v-if="!isEditMode">

              <div class="relative min-w-0" ref="transportWrapRef">
                <input
                  :value="transportDisplay"
                  class="w-full h-10 px-3 rounded-md border border-neutral-600 bg-neutral-800/60 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/70"
                  placeholder="이동수단 검색"
                  @click="openTransportDropdown"
                  @input="onTransportInput"
                />

                <button
                  v-if="transportDisplay"
                  type="button"
                  @click.stop="clearTransport"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                >
                  <X class="w-4 h-4" />
                </button>

                <div
                  v-if="showTransportDropdown"
                  class="absolute left-0 top-full z-50 mt-1 w-full max-h-[260px] overflow-auto
                         rounded-md border border-neutral-300 bg-white shadow-lg"
                >
                  <button
                    v-for="t in filteredTransportList"
                    :key="t.modelId"
                    type="button"
                    class="w-full flex items-center justify-between px-3 py-2 text-[13px]
                          hover:bg-neutral-100"
                    @click="selectTransport(t)"
                  >
                    <span class="truncate">
                      {{ getTransportDisplayText(t) }}
                    </span>

                    <span
                      v-if="isPegasusTransport(t)"
                      class="ml-2 shrink-0 text-[11px] text-amber-600"
                    >
                      보관 불가
                    </span>
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

          <!-- 비고 -->
          <div>
            <div class="text-xs text-neutral-400 mb-1">비고</div>
            <input
              v-model="remark"
              type="text"
              maxlength="255"
              class="w-full h-10 px-3 rounded-md border border-neutral-600 bg-neutral-800/60 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/70"
              placeholder="비고 입력"
            />
          </div>

          <!-- 차고 -->
          <div>
            <div class="text-xs text-neutral-400 mb-1">차고</div>

            <div class="relative min-w-0" ref="garageWrapRef" @mousedown.stop>
              <input
                ref="garageInputRef"
                :value="garageText"
                type="text"
                placeholder="차고를 검색/선택하세요"
                class="w-full h-10 px-3 pr-8 rounded-md border border-neutral-600 bg-neutral-800/60 text-sm text-neutral-200 placeholder:text-neutral-500
                      disabled:bg-neutral-800/40 disabled:text-neutral-500 disabled:cursor-not-allowed
                      focus:outline-none focus:border-blue-500/70"
                :disabled="isGarageDisabled"
                @click="openGarageDropdown"
                @input="onGarageInput"
                @keydown.esc.stop="closeGarageDropdown"
              />

              <button
                v-if="garageText && !isGarageDisabled"
                type="button"
                @click.stop="clearGarage"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X class="w-4 h-4" />
              </button>

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
            <div class="text-xs text-neutral-400 mb-1">슬롯</div>

            <div class="relative min-w-0" ref="slotWrapRef" @mousedown.stop>
              <input
                ref="slotInputRef"
                :value="slotNoText"
                type="text"
                placeholder="슬롯 번호를 선택하세요"
                class="w-full h-10 px-3 rounded-md border border-neutral-600 bg-neutral-800/60 text-sm text-neutral-200 placeholder:text-neutral-500
                      disabled:bg-neutral-800/40 disabled:text-neutral-500 disabled:cursor-not-allowed
                      focus:outline-none focus:border-blue-500/70"
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

          <!-- 이미지 -->
          <div class="col-span-2">
            <div class="text-xs text-neutral-400 mb-1">이미지</div>

            <div class="relative h-[260px] rounded-md border border-neutral-700 bg-neutral-800/40 overflow-hidden">
              <img
                v-if="!removeImageYn && (previewUrl || props.initialRow?.imageUrl)"
                :src="previewUrl || resolveImageUrl(props.initialRow?.imageUrl)"
                class="w-full h-full object-cover"
              />

              <div
                v-else
                class="w-full h-full flex items-center justify-center text-sm text-neutral-400"
              >
                이미지 없음
              </div>

              <button
                v-if="!removeImageYn && (previewUrl || props.initialRow?.imageUrl)"
                type="button"
                class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center
                      rounded-full bg-black/60 text-white hover:bg-black/80"
                @click="removeImage"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>

            <div class="mt-2">
              <input
                type="file"
                accept="image/*"
                class="block w-full text-sm text-neutral-300
                      file:mr-3 file:px-3 file:py-1.5 file:rounded-md
                      file:border file:border-neutral-600
                      file:bg-neutral-800/60 file:text-neutral-200
                      hover:file:bg-neutral-700"
                @change="handleImageChange"
              />
            </div>
          </div>

        </div>

        <!-- buttons -->
        <div class="flex justify-end gap-2 px-4 py-3 border-t border-neutral-700 bg-neutral-900/80">

          <button
            class="h-8 px-3 rounded-md border border-neutral-600 bg-neutral-800/60 text-[13px] text-neutral-200 hover:bg-neutral-700 transition"
            @click="closeModal"
          >
            취소
          </button>

          <button
            v-if="isEditMode"
            class="h-8 px-3 rounded-md border border-red-500/70 bg-red-900/60 text-[13px] text-white hover:bg-red-800/70 transition"
            @click="handleDeleteClick"
          >
            삭제
          </button>

          <button
            class="h-8 px-4 rounded-md border border-blue-500/70 bg-blue-900/50 text-[13px] text-white hover:bg-blue-800/60 transition"
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
import { X, Trash2 } from 'lucide-vue-next'
import { http } from '@/api/http'
import { resolveImageUrl } from '@/utils/format'

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
const remark = ref('')
const imageFile = ref(null)
const previewUrl = ref('')

const showDeleteConfirm = ref(false)

const removeImageYn = ref(false)

watch(() => props.open, async (v) => {

  if (v) {
    imageFile.value = null
    previewUrl.value = ''
    removeImageYn.value = false

    if (isEditMode.value) {
      // 수정
      if (props.initialRow?.storageType === 'PEGASUS') {
        selectedTransport.value = props.initialRow
        transportDisplay.value = getTransportDisplayText(props.initialRow)

        selectedGarage.value = null
        selectedGarageId.value = ''
        garageText.value = '페가수스'
        garageQuery.value = ''

        slotNo.value = ''
        slotNoText.value = '-'
        slotQuery.value = ''
        currentSlotNo.value = null
        occupiedSlotList.value = []

        showTransportDropdown.value = false
        showGarageDropdown.value = false
        showSlotDropdown.value = false
        showDeleteConfirm.value = false

        remark.value = props.initialRow?.remark || ''

        document.addEventListener('keydown', onDocKeyDown)
        document.addEventListener('mousedown', onDocMouseDownCapture, true)
        return
      }

      const currentGarageId = props.initialRow?.garageId ?? null
      const currentSlot = (props.initialRow?.slot && props.initialRow?.slot !== '-')
        ? Number(props.initialRow.slot)
        : null

      const matched = currentGarageId
        ? (Array.isArray(props.garageList)
            ? props.garageList.find((garage) => {
                return Number(garage?.garageId) === Number(currentGarageId)
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

        remark.value = props.initialRow?.remark || ''

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

        remark.value = props.initialRow?.remark || ''
      }
    // 등록
    } else {

      selectedTransport.value = null
      transportDisplay.value = ''

      selectedGarage.value = null
      selectedGarageId.value = ''
      garageText.value = ''
      garageQuery.value = ''

      slotNo.value = ''
      slotNoText.value = ''
      slotQuery.value = ''
      currentSlotNo.value = null
      occupiedSlotList.value = []

      remark.value = ''

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

    const name = getTransportDisplayText(t).toLowerCase()

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

const isPegasusSelected = computed(() => {
  return isPegasusTransport(selectedTransport.value)
})

const isSlotEnabled = computed(() => {
  if (isEditMode.value && props.initialRow?.storageType === 'PEGASUS') {
    return false
  }

  if (isPegasusSelected.value) {
    return false
  }

  return !!selectedGarage.value
})

const isGarageDisabled = computed(() => {
  if (!isEditMode.value) {
    return isPegasusSelected.value
  }

  return props.initialRow?.storageType === 'PEGASUS'
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

function getTransportDisplayText(t)
{
  const manufacturer = String(t?.manufacturer || '').trim()
  const name = String(t?.name || '').trim()
  const upgradeTypeText = getUpgradeTypeDisplayText(t?.upgradeType)

  const baseText = manufacturer === '미분류'
    ? `${name}`
    : `${manufacturer} ${name}`

  return `${baseText} ${upgradeTypeText}`.trim()
}

function isPegasusTransport(t)
{
  const features = String(t?.features || '').trim()

  if (features === '') {
    return false
  }

  return features
    .split(',')
    .map((v) => {
      return v.trim()
    })
    .includes('페가수스')
}

function selectTransport(t)
{
  selectedTransport.value = t
  transportDisplay.value = getTransportDisplayText(t)
  showTransportDropdown.value = false

  if (isPegasusTransport(t)) {
    selectedGarage.value = null
    selectedGarageId.value = ''
    garageText.value = '페가수스'
    garageQuery.value = ''

    slotNo.value = ''
    slotNoText.value = '-'
    slotQuery.value = ''
    currentSlotNo.value = null
    occupiedSlotList.value = []

    showGarageDropdown.value = false
    showSlotDropdown.value = false
    return
  }

  const hasPresetGarage = !!selectedGarageId.value
  const hasPresetSlot = !!slotNo.value

  if (hasPresetGarage || hasPresetSlot) {
    return
  }

  garageText.value = ''
  garageQuery.value = ''
  selectedGarage.value = null
  selectedGarageId.value = ''

  slotNo.value = ''
  slotNoText.value = ''
  slotQuery.value = ''
  currentSlotNo.value = null
  occupiedSlotList.value = []
}

async function handleSubmit()
{
  if (isEditMode.value) {

    const ownedId = props.initialRow?.id

    if (!ownedId) {
      return
    }

    const hasGarage = !!selectedGarageId.value
    const hasSlot = !!slotNo.value

    if (!isPegasusSelected.value) {
      if (hasGarage && !hasSlot) {
        alert('차고를 선택한 경우 슬롯은 필수입니다.')
        return
      }

      if (!hasGarage && hasSlot) {
        alert('차고를 선택하지 않으면 슬롯을 선택할 수 없습니다.')
        return
      }
    }

    const storageType = isPegasusSelected.value
      ? 'PEGASUS'
      : (selectedGarageId.value ? 'GARAGE' : 'UNASSIGNED')

    const uploadedImageUrl = await uploadImageIfNeeded()

    const imageUrl = removeImageYn.value
      ? null
      : (uploadedImageUrl || props.initialRow?.imageUrl || null)
    
    emit('update', {
      ownedId: ownedId,
      storageType: storageType,
      garageId: storageType === 'GARAGE' ? selectedGarageId.value : null,
      slotNo: storageType === 'GARAGE' ? Number(slotNo.value) : null,
      remark: remark.value,
      imageUrl: imageUrl
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

  if (!isPegasusSelected.value) {
    if (hasGarage && !hasSlot) {
      alert('차고를 선택한 경우 슬롯은 필수입니다.')
      return
    }

    if (!hasGarage && hasSlot) {
      alert('차고를 선택하지 않으면 슬롯을 선택할 수 없습니다.')
      return
    }
  }

  const storageType = isPegasusSelected.value
    ? 'PEGASUS'
    : (selectedGarageId.value ? 'GARAGE' : 'UNASSIGNED')

  const imageUrl = await uploadImageIfNeeded()

  emit('created', {
    modelId: Number(modelId),
    storageType: storageType,
    garageId: storageType === 'GARAGE' ? selectedGarageId.value : null,
    slotNo: storageType === 'GARAGE' ? Number(slotNo.value) : null,
    remark: remark.value,
    imageUrl: imageUrl
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
}

async function loadOccupiedSlots(garageId)
{
  if (!garageId) {
    occupiedSlotList.value = []
    return
  }

  const requestedGarageId = Number(garageId)

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

    if (Number(selectedGarageId.value) !== requestedGarageId) {
      return
    }

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

    if (Number(selectedGarageId.value) !== requestedGarageId) {
      return
    }

    occupiedSlotList.value = []
  }
}

function openGarageDropdown()
{
  if (isGarageDisabled.value) {
    return
  }

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
  if (isGarageDisabled.value) {
    return
  }
  
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

function clearTransport()
{
  selectedTransport.value = null
  transportDisplay.value = ''
}

function clearGarage()
{
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

function handleImageChange(e)
{
  const file = e.target.files?.[0]

  if (!file) {
    return
  }

  const allowedTypes = ['image/png', 'image/jpeg']

  if (!allowedTypes.includes(file.type)) {
    alert('PNG 또는 JPEG 이미지만 업로드 가능합니다.')

    e.target.value = ''       // input 초기화
    imageFile.value = null
    previewUrl.value = ''
    return
  }

  const maxSize = 2 * 1024 * 1024

  if (file.size > maxSize) {
    alert('이미지는 2MB 이하만 업로드 가능합니다.')

    e.target.value = ''
    imageFile.value = null
    previewUrl.value = ''
    return
  }

  imageFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

async function uploadImageIfNeeded()
{
  if (!imageFile.value) {
    return null
  }

  const formData = new FormData()
  formData.append('file', imageFile.value)

  const res = await http.post('/uploads/owned-transport', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return res.data?.imageUrl || null
}

function removeImage()
{
  imageFile.value = null
  previewUrl.value = ''
  removeImageYn.value = true
}

onUnmounted(() => {
  document.removeEventListener('keydown', onDocKeyDown)
  document.removeEventListener('mousedown', onDocMouseDownCapture, true)
})
</script>