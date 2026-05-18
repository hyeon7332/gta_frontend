<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
    >
      <div
        class="absolute inset-0 bg-black/60"
        @click="handleClose"
      ></div>

      <div
        class="relative z-10 w-full max-w-[980px] max-h-[90vh]
               rounded-lg border border-neutral-700
               bg-neutral-900 shadow-2xl overflow-hidden"
      >
        <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-700">
          <h2 class="text-lg font-semibold text-white">
            {{ isEditMode ? '이동수단 모델 수정' : '이동수단 모델 등록' }}
          </h2>

          <button
            type="button"
            class="h-9 px-3 rounded-md border border-neutral-600
                   bg-neutral-800/70 text-sm text-neutral-200
                   hover:bg-neutral-700 active:bg-neutral-600 transition"
            @click="handleClose"
          >
            닫기
          </button>
        </div>

        <div class="px-5 pt-3 pb-5 overflow-y-auto max-h-[calc(90vh-138px)] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 text-sm text-neutral-300">제조사</label>
            <select v-model="form.manufacturer" class="input-style">
              <option value="">선택하세요</option>
              <option
                v-for="manufacturer in manufacturerOptions"
                :key="manufacturer"
                :value="manufacturer"
              >
                {{ manufacturer }}
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">모델명</label>
            <input v-model="form.name" type="text" class="input-style" />
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">이동수단 분류</label>
            <select v-model="form.transportCategory" class="input-style">
              <option value="">선택하세요</option>
              <option
                v-for="category in transportCategoryOptions"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">개조 위치</label>

            <div ref="upgradeLocationBoxRef" class="relative">
              <div
                class="input-style flex items-center cursor-pointer"
                @click="showUpgradeLocationDropdown = !showUpgradeLocationDropdown"
              >
                <span class="truncate">
                  {{ upgradeLocationLabel || '선택하세요' }}
                </span>
              </div>

              <div
                v-if="showUpgradeLocationDropdown"
                class="absolute left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-md z-20 p-2 max-h-80 overflow-y-auto"
              >
                <label
                  v-for="location in upgradeLocationOptions"
                  :key="location"
                  class="flex items-center gap-2 px-2 py-1 text-sm text-neutral-200 hover:bg-neutral-700 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="selectedUpgradeLocations.includes(location)"
                    @change="toggleUpgradeLocation(location)"
                  />
                  {{ location }}
                </label>
              </div>
            </div>
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">랩 타임</label>
            <div class="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 w-full">
              <input
                v-model="lapTimeMinutes"
                type="number"
                min="0"
                class="input-style w-full"
                placeholder="min"
              />

              <span class="text-neutral-400">:</span>

              <input
                v-model="lapTimeSeconds"
                type="number"
                min="0"
                max="59"
                class="input-style w-full"
                placeholder="sec"
              />

              <span class="text-neutral-400">:</span>

              <input
                v-model="lapTimeMillis"
                type="number"
                min="0"
                max="999"
                class="input-style w-full"
                placeholder="ms"
              />
            </div>
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">최고속도</label>
            <input ref="topSpeedInputRef" v-model="form.topSpeed" type="number" step="0.01" class="input-style" />
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">가격</label>
            <input v-model="form.price" type="number" class="input-style" />
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">출시일</label>
            <input v-model="form.releaseDate" type="date" class="input-style" />
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">획득처</label>

            <div ref="sourceBoxRef" class="relative">
              <div
                class="input-style flex items-center cursor-pointer"
                @click="showSourceDropdown = !showSourceDropdown"
              >
                <span class="truncate">
                  {{ sourceLabel || '선택하세요' }}
                </span>
              </div>

              <div
                v-if="showSourceDropdown"
                class="absolute left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-md z-20 p-2 max-h-72 overflow-y-auto"
              >
                <label
                  v-for="source in transportSourceOptions"
                  :key="source"
                  class="flex items-center gap-2 px-2 py-1 text-sm text-neutral-200 hover:bg-neutral-700 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="selectedSources.includes(source)"
                    @change="toggleSource(source)"
                  />
                  {{ source }}
                </label>
              </div>
            </div>
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">무게</label>
            <input v-model="form.weight" type="number" step="0.01" class="input-style" />
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">구동 방식</label>
            <select v-model="form.driveTrain" class="input-style">
              <option value="">선택하세요</option>
              <option value="AWD">AWD</option>
              <option value="RWD">RWD</option>
              <option value="FWD">FWD</option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">좌석 수</label>
            <input v-model="form.seats" type="number" class="input-style" />
          </div>

          <div class="col-span-2">
            <label class="block mb-2 text-sm text-neutral-300">특징</label>

            <div class="rounded-md border border-neutral-700 bg-neutral-800/50 p-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2">
                <label
                  v-for="option in featureOptions"
                  :key="option.codeValue"
                  class="flex items-center gap-2 min-w-0 text-sm text-neutral-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="selectedFeatureOptions.includes(option.codeValue)"
                    @change="toggleFeature(option.codeValue)"
                  />

                  <span class="break-words">
                    {{ option.codeName }}
                  </span>
                </label>
              </div>
            </div>
          </div>

        </div>

        <div class="flex items-center justify-end gap-2 px-5 py-4 border-t border-neutral-700">
          <button
            type="button"
            class="h-9 px-4 rounded-md border border-neutral-600
                   bg-neutral-800/70 text-sm text-neutral-200
                   hover:bg-neutral-700 active:bg-neutral-600 transition"
            @click="handleClose"
          >
            취소
          </button>

          <button
            type="button"
            class="h-9 px-4 rounded-md border border-neutral-600
                   bg-neutral-200 text-sm text-neutral-900 font-medium
                   hover:bg-white active:bg-neutral-300 transition"
            @click="handleSave"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { reactive, watch, onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { http } from '@/api/http'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'create'
  },
  model: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const isEditMode = computed(() => {
  return props.mode === 'edit'
})

const form = reactive({
  manufacturer: '',
  name: '',
  transportCategory: '',
  upgradeLocation: '',
  lapTime: '',
  topSpeed: '',
  price: '',
  releaseDate: '',
  source: '',
  weight: '',
  driveTrain: '',
  seats: '',
  features: ''
})

const lapTimeMinutes = ref('')
const lapTimeSeconds = ref('')
const lapTimeMillis = ref('')
const topSpeedInputRef = ref(null)

const showUpgradeLocationDropdown = ref(false)
const showSourceDropdown = ref(false)
const selectedSources = ref([])
const sourceBoxRef = ref(null)
const selectedUpgradeLocations = ref([])
const upgradeLocationBoxRef = ref(null)
const selectedFeatureOptions = ref([])

const manufacturerOptions = ref([])
const transportCategoryOptions = ref([])
const transportSourceOptions = ref([])
const upgradeLocationOptions = ref([])
const featureOptions = ref([])

const upgradeLocationLabel = computed(() => {
  if (selectedUpgradeLocations.value.length === 0) {
    return ''
  }

  const sorted = upgradeLocationOptions.value.filter((location) => {
    return selectedUpgradeLocations.value.includes(location)
  })

  return sorted.join(', ')
})

const sourceLabel = computed(() => {
  if (selectedSources.value.length === 0) {
    return ''
  }

  const sorted = transportSourceOptions.value.filter((source) => {
    return selectedSources.value.includes(source)
  })

  return sorted.join(', ')
})

function toggleSource(source)
{
  const index = selectedSources.value.indexOf(source)

  if (index === -1) {
    selectedSources.value.push(source)
  } else {
    selectedSources.value.splice(index, 1)
  }
}

function buildLapTimeMs()
{
  if (
    lapTimeMinutes.value === '' &&
    lapTimeSeconds.value === '' &&
    lapTimeMillis.value === ''
  ) {
    return null
  }

  const minutes = Number(lapTimeMinutes.value || 0)
  const seconds = Number(lapTimeSeconds.value || 0)
  const millis = Number(lapTimeMillis.value || 0)

  if (!Number.isInteger(minutes) || minutes < 0) {
    return NaN
  }

  if (!Number.isInteger(seconds) || seconds < 0 || seconds > 59) {
    return NaN
  }

  if (!Number.isInteger(millis) || millis < 0 || millis > 999) {
    return NaN
  }

  return (minutes * 60 * 1000) + (seconds * 1000) + millis
}

function toggleUpgradeLocation(location)
{
  const index = selectedUpgradeLocations.value.indexOf(location)

  if (index === -1) {
    selectedUpgradeLocations.value.push(location)
  } else {
    selectedUpgradeLocations.value.splice(index, 1)
  }
}

function toggleFeature(option)
{
  const index = selectedFeatureOptions.value.indexOf(option)

  if (index === -1) {
    selectedFeatureOptions.value.push(option)
  } else {
    selectedFeatureOptions.value.splice(index, 1)
  }
}

async function loadCommonCodes()
{
  try {
    const groups = [
      ['MANUFACTURER', manufacturerOptions],
      ['TRANSPORT_CATEGORY', transportCategoryOptions],
      ['TRANSPORT_SOURCE', transportSourceOptions],
      ['UPGRADE_LOCATION', upgradeLocationOptions],
      ['FEATURE', featureOptions]
    ]

    await Promise.all(
      groups.map(async ([groupCode, target]) => {
        const res = await http.get('/common-codes', {
          params: {
            groupCode
          }
        })

        if (groupCode === 'FEATURE') {
          target.value = res.data
        } else {
          target.value = res.data.map((item) => {
            return item.codeName
          })
        }

      })
    )
  } catch (err) {
    console.error('공통코드 조회 실패:', err)
  }
}

function resetForm()
{
  form.manufacturer = ''
  form.name = ''
  form.transportCategory = ''
  form.upgradeLocation = []
  form.lapTime = ''
  form.topSpeed = ''
  form.price = ''
  form.releaseDate = '2013-09-17'
  form.source = ''
  form.weight = ''
  form.driveTrain = ''
  form.seats = ''
  form.features = ''
  selectedSources.value = []
  showSourceDropdown.value = false

  selectedUpgradeLocations.value = []
  selectedFeatureOptions.value = []
  showUpgradeLocationDropdown.value = false

  lapTimeMinutes.value = ''
  lapTimeSeconds.value = ''
  lapTimeMillis.value = ''
}

function fillForm()
{
  form.manufacturer = props.model?.manufacturer ?? ''
  form.name = props.model?.name ?? ''
  form.transportCategory = props.model?.transportCategory ?? ''
  form.upgradeLocation = props.model?.upgradeLocation ?? ''
  form.lapTime = props.model?.lapTime ?? ''
  form.topSpeed = props.model?.topSpeed ?? ''
  form.price = props.model?.price ?? ''
  form.releaseDate = props.model?.releaseDate ?? ''
  form.source = props.model?.source ?? ''
  form.weight = props.model?.weight ?? ''
  form.driveTrain = props.model?.driveTrain ?? ''
  form.seats = props.model?.seats ?? ''
  form.features = props.model?.features ?? ''

  if (form.lapTime === '' || form.lapTime === null || form.lapTime === undefined) {
    lapTimeMinutes.value = ''
    lapTimeSeconds.value = ''
    lapTimeMillis.value = ''
  } else {
    const total = Number(form.lapTime)

    lapTimeMinutes.value = String(Math.floor(total / 60000))
    lapTimeSeconds.value = String(Math.floor((total % 60000) / 1000))
    lapTimeMillis.value = String(total % 1000)
  }

  selectedUpgradeLocations.value = form.upgradeLocation
    ? form.upgradeLocation.split(',').map(v => v.trim())
    : []  

  selectedFeatureOptions.value = form.features
    ? form.features
        .split(',')
        .map((value) => {
          return value.trim()
        })
        .map((value) => {
          const matched = featureOptions.value.find((option) => {
            return option.codeValue === value || option.codeName === value
          })

          return matched ? matched.codeValue : value
        })
        .filter((value, index, array) => {
          return value !== '' && array.indexOf(value) === index
        })
    : []

  selectedSources.value = form.source
    ? form.source.split(',').map(v => v.trim())
    : []  

  showUpgradeLocationDropdown.value = false
  showSourceDropdown.value = false
}

function handleEsc(e)
{
  if (e.key !== 'Escape') {
    return
  }

  if (showSourceDropdown.value) {
    showSourceDropdown.value = false
    return
  }

  if (showUpgradeLocationDropdown.value) {
    showUpgradeLocationDropdown.value = false
    return
  }

  emit('close')
}

function handleClose()
{
  emit('close')
}

function handleDocumentClick(e)
{
  const target = e.target

  if (!(target instanceof Node)) {
    return
  }

  if (
    showUpgradeLocationDropdown.value &&
    upgradeLocationBoxRef.value &&
    !upgradeLocationBoxRef.value.contains(target)
  ) {
    showUpgradeLocationDropdown.value = false
  }

  if (
    showSourceDropdown.value &&
    sourceBoxRef.value &&
    !sourceBoxRef.value.contains(target)
  ) {
    showSourceDropdown.value = false
  }
}

async function handleSave()
{
  if (!form.manufacturer || form.manufacturer.trim() === '') {
    alert('제조사는 필수입니다.')
    return
  }

  if (!form.name || form.name.trim() === '') {
    alert('모델명은 필수입니다.')
    return
  }

  if (!form.transportCategory || form.transportCategory.trim() === '') {
    alert('분류는 필수입니다.')
    return
  }

  const lapTimeMs = buildLapTimeMs()

  if (Number.isNaN(lapTimeMs)) {
    alert('랩 타임은 min / sec / ms 형식으로 입력하세요.')
    return
  }

  if (form.topSpeed !== '') {
    const topSpeed = Number(form.topSpeed)

    if (!Number.isFinite(topSpeed) || topSpeed > 9999.99) {
      alert('최고속도는 9999.99 이하로 입력해주세요.')
      topSpeedInputRef.value?.focus()
      return
    }
  }
  
  try {
    const payload = {
      manufacturer: form.manufacturer,
      name: form.name,
      transportCategory: form.transportCategory,

      upgradeLocation: upgradeLocationOptions.value
        .filter((location) => {
          return selectedUpgradeLocations.value.includes(location)
        })
        .join(', '),

      lapTime: lapTimeMs,
      topSpeed: form.topSpeed === '' ? null : Number(form.topSpeed),
      price: form.price === '' ? null : Number(form.price),
      releaseDate: form.releaseDate === '' ? null : form.releaseDate,
      weight: form.weight === '' ? null : Number(form.weight),
      driveTrain: form.driveTrain,
      seats: form.seats === '' ? null : Number(form.seats),

      source: transportSourceOptions.value
        .filter((source) => {
          return selectedSources.value.includes(source)
        })
        .join(', '),

      features: featureOptions.value
        .filter((option) => {
          return selectedFeatureOptions.value.includes(option.codeValue)
        })
        .map((option) => {
          return option.codeValue
        })
        .join(', ')
    }

    if (isEditMode.value) {
      const modelId = props.model?.id ?? props.model?.transportModelId ?? props.model?.modelId

      if (!modelId) {
        alert('수정할 모델 ID가 없습니다.')
        return
      }

      await http.put(`/transport-models/${modelId}`, payload)
    } else {
      await http.post('/transport-models', payload)
    }

    emit('saved')
    emit('close')
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data ||
      (isEditMode.value ? '수정에 실패했습니다.' : '등록에 실패했습니다.')

    if (isEditMode.value) {
      console.error('이동수단 모델 수정 실패:', err)
      alert(message)
    } else {
      console.error('이동수단 모델 등록 실패:', err)
      alert(message)
    }
  }
}

watch(
  () => props.open,
  (newValue) => {
    if (!newValue) {
      return
    }

    if (isEditMode.value) {
      fillForm()
    } else {
      resetForm()
    }
  }
)

onMounted(() => {
  loadCommonCodes()
  window.addEventListener('keydown', handleEsc)
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
  document.removeEventListener('click', handleDocumentClick)
})
</script>