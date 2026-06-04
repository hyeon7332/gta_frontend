<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">

      <!-- 배경 딤 처리 -->
      <div class="absolute inset-0 bg-black/60"></div>

      <!-- 모달 박스 -->
      <div
        ref="modalBoxRef"
        class="relative w-[620px] max-h-[90vh] bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl overflow-hidden flex flex-col"
      >
        <!-- 모달 헤더 -->
        <div class="px-4 py-3 border-b border-neutral-700">
          <div class="text-[15px] font-semibold text-neutral-100">
            {{ isEditMode ? '보유 이동수단 수정' : '보유 이동수단 등록' }}
          </div>
        </div>

        <!-- 모달 본문 -->
        <div class="grid grid-cols-2 gap-4 p-4 overflow-y-auto scroll-dark flex-1 min-h-0">

          <!-- 이동수단 선택 영역 -->
          <div class="col-span-2">
            <div class="text-xs text-neutral-400 mb-1">이동수단</div>

            <!-- 등록 모드: 이동수단 검색/선택 -->
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
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span class="truncate text-neutral-900">
                        {{ getTransportDisplayText(t) }}
                      </span>

                      <span
                        v-for="badge in format.formatFeatureBadges(t.features)"
                        :key="badge"
                        class="shrink-0 relative top-[1px] px-2 py-[2px]
                              rounded-md border border-neutral-300
                              bg-neutral-100 text-[11px]
                              text-neutral-700 whitespace-nowrap"
                      >
                        {{ badge }}
                      </span>
                    </div>

                    <span
                      v-if="isPegasusTransport(t)"
                      class="ml-2 shrink-0 text-[11px] text-amber-600"
                    >
                      페가수스
                    </span>
                  </button>
                </div>
              </div>
            </template>

            <!-- 수정 모드: 이동수단명 표시 전용 -->
            <template v-else>
              <div
                class="w-full h-10 px-3 rounded-md border border-neutral-300
                      bg-neutral-100 text-sm flex items-center
                      gap-1.5 min-w-0"
              >
                <span class="truncate text-neutral-900">
                  {{ `${initialRow?.manufacturer ?? ''} ${initialRow?.name ?? ''}` }}
                </span>

                <span
                  v-for="badge in format.formatFeatureBadges(initialRow?.features)"
                  :key="badge"
                  class="shrink-0 relative top-[1px] px-2 py-[2px]
                        rounded-md border border-neutral-300
                        bg-white text-[11px]
                        text-neutral-700 whitespace-nowrap"
                >
                  {{ badge }}
                </span>
              </div>
            </template>
          </div>

          <!-- 상징 -->
          <div>
            <div class="text-xs text-neutral-400 mb-1">상징</div>

            <input
              v-model="decal"
              type="text"
              maxlength="100"
              class="w-full h-10 px-3 rounded-md border border-neutral-600 bg-neutral-800/60 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/70"
              placeholder="상징 입력"
            />
          </div>

          <!-- 획득 여부 -->
          <div>
            <div class="text-xs text-neutral-400 mb-1">획득 여부</div>

            <div class="h-10 flex items-center gap-4 px-3 rounded-md border border-neutral-600 bg-neutral-800/60">
              <label class="flex items-center gap-2 text-sm text-neutral-200">
                <input
                  v-model="acquiredYn"
                  type="radio"
                  value="Y"
                />
                <span>획득</span>
              </label>

              <label class="flex items-center gap-2 text-sm text-neutral-200">
                <input
                  v-model="acquiredYn"
                  type="radio"
                  value="N"
                />
                <span>미획득</span>
              </label>
            </div>
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

          <!-- 비고 -->
          <div class="col-span-2">
            <div class="text-xs text-neutral-400 mb-1">비고</div>

            <textarea
              v-model="remark"
              maxlength="255"
              rows="3"
              class="w-full min-h-[86px] px-3 py-2 rounded-md border border-neutral-600 bg-neutral-800/60 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500/70 resize-none"
              placeholder="비고 입력"
            ></textarea>
          </div>

          <!-- 이미지 업로드 / 미리보기 -->
          <div class="col-span-2">
            <div class="text-xs text-neutral-400 mb-1">이미지</div>

            <div class="relative h-[260px] rounded-md border border-neutral-700 bg-neutral-800/40 overflow-hidden">
              <img
                v-if="!removeImageYn && (previewUrl || props.initialRow?.imageUrl)"
                :src="previewUrl || format.resolveImageUrl(props.initialRow?.imageUrl)"
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

        <!-- 모달 하단 버튼 영역 -->
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

  <!-- 삭제 확인 모달 -->
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
import { ref, computed, watch, onUnmounted } from 'vue'
import { X, Trash2 } from 'lucide-vue-next'
import { http } from '@/api/http'
import * as format from '@/utils/format'
import * as transportDataMapper from '@/utils/transportDataMapper'

// 모달 입력 데이터
const props = defineProps({
  open: Boolean,
  mode: String,
  initialRow: Object,
  transportList: Array,
  garageList: Array
})

// 부모 이벤트 emit
const emit = defineEmits([
  'update:open',
  'created',
  'update',
  'delete'
])

// 수정 모드 여부
const isEditMode = computed(() => props.mode === 'edit')

// 선택된 이동수단
const selectedTransport = ref(null)

// 이동수단 검색 입력값
const transportDisplay = ref('')

// 이동수단 드롭다운 표시 여부
const showTransportDropdown = ref(false)

// 선택된 차고 ID
const selectedGarageId = ref('')

// 선택된 슬롯 번호
const slotNo = ref('')

// 선택된 차고 정보
const selectedGarage = ref(null)

// 사용중 슬롯 목록
const occupiedSlotList = ref([])

// 현재 수정중 슬롯 번호
const currentSlotNo = ref(null)

// 차고 입력값
const garageText = ref('')

// 슬롯 입력값
const slotNoText = ref('')

// 차고 검색어
const garageQuery = ref('')

// 슬롯 검색어
const slotQuery = ref('')

// 차고 드롭다운 표시 여부
const showGarageDropdown = ref(false)

// 슬롯 드롭다운 표시 여부
const showSlotDropdown = ref(false)

// 비고
const remark = ref('')

// 상징
const decal = ref('')

// 획득 여부
const acquiredYn = ref('Y')

// 업로드 이미지 파일
const imageFile = ref(null)

// 이미지 미리보기 URL
const previewUrl = ref('')

// 이미지 삭제 여부
const removeImageYn = ref(false)

// 삭제 확인 모달 표시 여부
const showDeleteConfirm = ref(false)

// 모달 박스
const modalBoxRef = ref(null)

// 이동수단 영역
const transportWrapRef = ref(null)

// 차고 영역
const garageWrapRef = ref(null)
const garageInputRef = ref(null)

// 슬롯 영역
const slotWrapRef = ref(null)
const slotInputRef = ref(null)

// 모달 열림/닫힘 상태 처리
watch(() => props.open, async (v) => {
  if (v) {
    await initModalState()
    addModalEvents()
    return
  }

  resetDropdownState()
  removeModalEvents()
})

// 이동수단 검색 결과
const filteredTransportList = computed(() => {
  const kw = transportDisplay.value.toLowerCase()

  return props.transportList.filter((t) => {
    const name = getTransportDisplayText(t).toLowerCase()

    return name.includes(kw)
  })
})

// 차고 검색 결과
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

// 페가수스 선택 여부
const isPegasusSelected = computed(() => {
  return isPegasusTransport(selectedTransport.value)
})

// 슬롯 활성화 여부
const isSlotEnabled = computed(() => {
  if (isEditMode.value && props.initialRow?.storageType === 'PEGASUS') {
    return false
  }

  if (isPegasusSelected.value) {
    return false
  }

  if (isHangarRelatedGarage(selectedGarage.value)) {
    return false
  }

  return !!selectedGarage.value
})

// 차고 비활성화 여부
const isGarageDisabled = computed(() => {
  if (!isEditMode.value) {
    return isPegasusSelected.value
  }

  return props.initialRow?.storageType === 'PEGASUS'
})

// 슬롯 옵션 목록
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

// 모달 상태 초기화
async function initModalState()
{
  resetImageState()

  if (isEditMode.value) {
    await initEditMode()
    resetDropdownState()
    return
  }

  await initCreateMode()
  resetDropdownState()
}

// 수정 모드 초기화
async function initEditMode()
{
  const row = props.initialRow

  if (row?.storageType === 'PEGASUS') {
    selectedTransport.value = row
    transportDisplay.value = getTransportDisplayText(row)

    setPegasusGarageState()
    setFormValue(row)
    return
  }

  const currentGarageId = row?.garageId ?? null
  const currentSlot = getCurrentSlot(row)

  const matched =
    findGarageById(currentGarageId) ||
    findGarageByStorageType(row?.storageType)

  if (matched) {
    setGarageValue(matched)
    setSlotValue(currentSlot)
    setFormValue(row)

    await loadOccupiedSlots(matched.garageId)
    return
  }

  resetGarageState()
  setFormValue(row)
}

// 등록 모드 초기화
async function initCreateMode()
{
  resetCreateState()

  const presetGarageId = props.initialRow?.garageId ?? null
  const presetSlotNo = props.initialRow?.slotNo ?? props.initialRow?.slot ?? null
  const matched = findGarageById(presetGarageId)

  if (!matched) {
    return
  }

  setGarageValue(matched)

  await loadOccupiedSlots(matched.garageId)

  if (Number.isFinite(Number(presetSlotNo)) && Number(presetSlotNo) > 0) {
    setSlotValue(Number(presetSlotNo))
  }
}

// 등록 상태 초기화
function resetCreateState()
{
  selectedTransport.value = null
  transportDisplay.value = ''

  remark.value = ''
  decal.value = ''
  acquiredYn.value = 'Y'

  resetGarageState()
}

// 이미지 상태 초기화
function resetImageState()
{
  imageFile.value = null
  previewUrl.value = ''
  removeImageYn.value = false
}

// 드롭다운 상태 초기화
function resetDropdownState()
{
  showTransportDropdown.value = false
  showGarageDropdown.value = false
  showSlotDropdown.value = false
  showDeleteConfirm.value = false
}

// 차고 상태 초기화
function resetGarageState()
{
  selectedGarage.value = null
  selectedGarageId.value = ''
  garageText.value = ''
  garageQuery.value = ''

  resetSlotState()
}

// 슬롯 상태 초기화
function resetSlotState()
{
  slotNo.value = ''
  slotNoText.value = ''
  slotQuery.value = ''
  currentSlotNo.value = null
  occupiedSlotList.value = []
}

// 페가수스 상태 세팅
function setPegasusGarageState()
{
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
}

// 입력값 세팅
function setFormValue(row)
{
  remark.value = row?.remark || ''
  decal.value = row?.decal || ''
  acquiredYn.value = row?.acquiredYn || 'Y'
}

// 차고값 세팅
function setGarageValue(garage)
{
  selectedGarage.value = garage
  selectedGarageId.value = garage.garageId
  garageText.value = String(garage.garageName || '').trim()
  garageQuery.value = ''
}

// 슬롯값 세팅
function setSlotValue(slot)
{
  if (Number.isFinite(slot) && slot > 0) {
    slotNo.value = String(slot)
    slotNoText.value = String(slot)
    currentSlotNo.value = slot
    return
  }

  slotNo.value = ''
  slotNoText.value = ''
  currentSlotNo.value = null
}

// 현재 슬롯 번호 반환
function getCurrentSlot(row)
{
  if (!row?.slot || row?.slot === '-') {
    return null
  }

  const currentSlot = Number(row.slot)

  if (!Number.isFinite(currentSlot)) {
    return null
  }

  return currentSlot
}

// 차고 ID 기준 차고 조회
function findGarageById(garageId)
{
  if (!garageId || !Array.isArray(props.garageList)) {
    return null
  }

  return props.garageList.find((garage) => {
    return Number(garage?.garageId) === Number(garageId)
  }) || null
}

// 차고명 기준 차고 조회
function findGarageByName(garageName)
{
  if (!garageName || !Array.isArray(props.garageList)) {
    return null
  }

  return props.garageList.find((garage) => {
    return garage?.garageName === garageName
  }) || null
}

// storageType 기준 격납고 차고 조회
function findGarageByStorageType(storageType)
{
  if (storageType === 'HANGAR') {
    return findGarageByName('격납고 격납층')
  }

  if (storageType === 'HANGAR_STORAGE') {
    return findGarageByName('격납고 저장소')
  }

  if (storageType === 'HANGAR_VINEWOOD') {
    return findGarageByName('격납고 바인우드 클럽 보관소')
  }

  return null
}

// 이동수단 표시명 생성
function getTransportDisplayText(t)
{
  const manufacturer = String(t?.manufacturer || '').trim()
  const name = String(t?.name || '').trim()

  if (manufacturer === '미분류') {
    return name
  }

  return `${manufacturer} ${name}`.trim()
}

// 페가수스 이동수단 여부
function isPegasusTransport(t)
{
  const features = String(t?.features || '').trim()

  if (features === '') {
    return false
  }

  return features
    .split(',')
    .map((v) => {
      return v.trim().toUpperCase()
    })
    .includes('PEG')
}

// 이동수단 선택 처리
function selectTransport(t)
{
  console.log(t)
  console.log(t.features)

  selectedTransport.value = t
  transportDisplay.value = getTransportDisplayText(t)
  showTransportDropdown.value = false

  if (isPegasusTransport(t)) {
    setPegasusGarageState()
    return
  }

  const hasPresetGarage = !!selectedGarageId.value
  const hasPresetSlot = !!slotNo.value

  if (hasPresetGarage || hasPresetSlot) {
    return
  }

  resetGarageState()
}

// 이동수단 검색 입력 처리
function onTransportInput(e)
{
  transportDisplay.value = e.target.value
}

// 이동수단 드롭다운 열기
function openTransportDropdown()
{
  showTransportDropdown.value = true
}

// 이동수단 선택 초기화
function clearTransport()
{
  selectedTransport.value = null
  transportDisplay.value = ''

  decal.value = ''
}

// 격납층 여부
function isHangarFloorGarage(garage)
{
  const garageName = String(garage?.garageName || '').trim()

  return garageName === '격납고 격납층'
}

// 격납고 저장소 여부
function isHangarStorageGarage(garage)
{
  const garageName = String(garage?.garageName || '').trim()

  return garageName === '격납고 저장소'
}

// 바인우드 보관소 여부
function isHangarVinewoodGarage(garage)
{
  const garageName = String(garage?.garageName || '').trim()

  return garageName === '격납고 바인우드 클럽 보관소'
}

// 격납고 관련 차고 여부
function isHangarRelatedGarage(garage)
{
  return isHangarFloorGarage(garage)
    || isHangarStorageGarage(garage)
    || isHangarVinewoodGarage(garage)
}

// 점유 슬롯 조회
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
    const list = transportDataMapper.extractList(data)

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

// 차고 드롭다운 열기
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

// 차고 드롭다운 닫기
function closeGarageDropdown()
{
  showGarageDropdown.value = false
  garageQuery.value = ''

  const el = garageInputRef.value

  if (el && typeof el.blur === 'function') {
    el.blur()
  }
}

// 차고 입력 처리
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

// 차고 선택
async function selectGarage(g)
{
  setGarageValue(g)

  slotNo.value = ''
  slotNoText.value = ''
  slotQuery.value = ''
  currentSlotNo.value = null

  await loadOccupiedSlots(g.garageId)
  closeGarageDropdown()
}

// 차고 선택 초기화
function clearGarage()
{
  resetGarageState()
}

// 슬롯 드롭다운 열기
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

// 슬롯 드롭다운 닫기
function closeSlotDropdown()
{
  showSlotDropdown.value = false
  slotQuery.value = ''

  const el = slotInputRef.value

  if (el && typeof el.blur === 'function') {
    el.blur()
  }
}

// 슬롯 선택
function selectSlot(no)
{
  slotNo.value = String(no)
  slotNoText.value = String(no)
  closeSlotDropdown()
}

// 등록/수정 저장 처리
async function handleSubmit()
{
  if (isEditMode.value) {
    await updateOwnedTransport()
    return
  }

  await createOwnedTransport()
}

// 차고/슬롯 입력 검증
function validateGarageSlot()
{
  const hasGarage = !!selectedGarageId.value
  const hasSlot = !!slotNo.value

  if (isPegasusSelected.value) {
    return true
  }

  if (isHangarRelatedGarage(selectedGarage.value)) {
    return hasGarage
  }

  if (hasGarage && !hasSlot) {
    alert('차고를 선택한 경우 슬롯은 필수입니다.')
    return false
  }

  if (!hasGarage && hasSlot) {
    alert('차고를 선택하지 않으면 슬롯을 선택할 수 없습니다.')
    return false
  }

  return true
}

// storageType 반환
function getStorageType()
{
  if (isPegasusSelected.value) {
    return 'PEGASUS'
  }

  if (isHangarFloorGarage(selectedGarage.value)) {
    return 'HANGAR'
  }

  if (isHangarStorageGarage(selectedGarage.value)) {
    return 'HANGAR_STORAGE'
  }

  if (isHangarVinewoodGarage(selectedGarage.value)) {
    return 'HANGAR_VINEWOOD'
  }

  if (selectedGarageId.value) {
    return 'GARAGE'
  }

  return 'UNASSIGNED'
}

// 보유 이동수단 수정
async function updateOwnedTransport()
{
  const ownedId = props.initialRow?.id

  if (!ownedId) {
    return
  }

  if (!validateGarageSlot()) {
    return
  }

  const storageType = getStorageType()
  const uploadedImageUrl = await uploadImageIfNeeded()

  const imageUrl = removeImageYn.value
    ? ''
    : (uploadedImageUrl || props.initialRow?.imageUrl || null)

  emit('update', {
    ownedId: ownedId,
    storageType: storageType,
    garageId: storageType === 'GARAGE' ? selectedGarageId.value : null,
    slotNo: storageType === 'GARAGE' ? Number(slotNo.value) : null,
    remark: remark.value,
    imageUrl: imageUrl,
    decal: decal.value,
    acquiredYn: acquiredYn.value
  })
}

// 보유 이동수단 등록
async function createOwnedTransport()
{
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

  if (!validateGarageSlot()) {
    return
  }

  const storageType = getStorageType()
  const imageUrl = await uploadImageIfNeeded()

  emit('created', {
    modelId: Number(modelId),
    storageType: storageType,
    garageId: storageType === 'GARAGE'? selectedGarageId.value : null,
    slotNo: storageType === 'GARAGE' ? Number(slotNo.value) : null,
    remark: remark.value,
    imageUrl: imageUrl,
    decal: decal.value,
    acquiredYn: acquiredYn.value
  })
}

// 삭제 버튼 클릭 처리
function handleDeleteClick()
{
  showDeleteConfirm.value = true
}

// 삭제 확정 처리
function confirmDelete()
{
  const id = props.initialRow?.id

  showDeleteConfirm.value = false

  if (!id) {
    return
  }

  emit('delete', id)
}

// 모달 닫기
function closeModal()
{
  emit('update:open', false)
}

// 이미지 선택 처리
function handleImageChange(e)
{
  const file = e.target.files?.[0]

  if (!file) {
    return
  }

  const allowedTypes = ['image/png', 'image/jpeg']

  if (!allowedTypes.includes(file.type)) {
    alert('PNG 또는 JPEG 이미지만 업로드 가능합니다.')

    e.target.value = ''
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
  removeImageYn.value = false
}

// 이미지 업로드 처리
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

// 이미지 제거 처리
function removeImage()
{
  imageFile.value = null
  previewUrl.value = ''
  removeImageYn.value = true
}

// 모달 전역 이벤트 등록
function addModalEvents()
{
  document.addEventListener('keydown', onDocKeyDown)
  document.addEventListener('mousedown', onDocMouseDownCapture, true)
}

// 모달 전역 이벤트 제거
function removeModalEvents()
{
  document.removeEventListener('keydown', onDocKeyDown)
  document.removeEventListener('mousedown', onDocMouseDownCapture, true)
}

// ESC 키 처리
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

// 외부 클릭 처리
function onDocMouseDownCapture(e)
{
  if (!props.open) {
    return
  }

  if (showDeleteConfirm.value) {
    return
  }

  closeTransportDropdownIfOutside(e)
  closeGarageDropdownIfOutside(e)
  closeSlotDropdownIfOutside(e)
}

// 이동수단 드롭다운 외부 클릭 처리
function closeTransportDropdownIfOutside(e)
{
  if (!showTransportDropdown.value) {
    return
  }

  const transportEl = transportWrapRef.value

  if (!transportEl || !transportEl.contains(e.target)) {
    showTransportDropdown.value = false
  }
}

// 차고 드롭다운 외부 클릭 처리
function closeGarageDropdownIfOutside(e)
{
  if (!showGarageDropdown.value) {
    return
  }

  const garageEl = garageWrapRef.value

  if (!garageEl || !garageEl.contains(e.target)) {
    showGarageDropdown.value = false
    garageQuery.value = ''
  }
}

// 슬롯 드롭다운 닫기
function closeSlotDropdownIfOutside(e)
{
  if (!showSlotDropdown.value) {
    return
  }

  const slotEl = slotWrapRef.value

  if (!slotEl || !slotEl.contains(e.target)) {
    showSlotDropdown.value = false
    slotQuery.value = ''
  }
}

// 컴포넌트 종료 시 이벤트 제거
onUnmounted(() => {
  removeModalEvents()
})
</script>