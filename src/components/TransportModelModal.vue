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

        <div class="p-5 overflow-y-auto max-h-[calc(90vh-138px)] grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label class="block mb-1 text-sm text-neutral-300">개조 유형</label>
            <select v-model="form.upgradeType" class="input-style">
              <option value="">선택하세요</option>
              <option
                v-for="type in upgradeTypeOptions"
                :key="type"
                :value="type"
              >
                {{ type }}
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
            <input v-model="form.lapTime" type="number" class="input-style" />
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">최고속도</label>
            <input v-model="form.topSpeed" type="number" step="0.01" class="input-style" />
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
            <select v-model="form.source" class="input-style">
              <option value="">선택하세요</option>
              <option
                v-for="source in transportSourceOptions"
                :key="source"
                :value="source"
              >
                {{ source }}
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">무게</label>
            <input v-model="form.weight" type="number" step="0.01" class="input-style" />
          </div>

          <div>
            <label class="block mb-1 text-sm text-neutral-300">기어 수</label>
            <input v-model="form.driveGears" type="number" class="input-style" />
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
                  :key="option"
                  class="flex items-center gap-2 min-w-0 text-sm text-neutral-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="selectedFeatureOptions.includes(option)"
                    @change="toggleFeature(option)"
                  />
                  <span class="break-words">{{ option }}</span>
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
import '@/assets/css/modal-form.css'
import { manufacturerOptions } from '@/constants/manufacturerOptions'
import { transportCategoryOptions } from '@/constants/transportCategoryOptions'
import { upgradeTypeOptions } from '@/constants/upgradeTypeOptions'
import { upgradeLocationOptions } from '@/constants/upgradeLocationOptions'
import { transportSourceOptions } from '@/constants/transportSourceOptions'
import { featureOptions } from '@/constants/featureOptions'

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
  upgradeType: '',
  upgradeLocation: '',
  lapTime: '',
  topSpeed: '',
  price: '',
  releaseDate: '',
  source: '',
  weight: '',
  driveGears: '',
  driveTrain: '',
  seats: '',
  features: ''
})

const showUpgradeLocationDropdown = ref(false)
const selectedUpgradeLocations = ref([])
const upgradeLocationBoxRef = ref(null)
const selectedFeatureOptions = ref([])

const upgradeLocationLabel = computed(() => {
  if (selectedUpgradeLocations.value.length === 0) {
    return ''
  }

  const sorted = upgradeLocationOptions.filter((location) => {
    return selectedUpgradeLocations.value.includes(location)
  })

  return sorted.join(', ')
})

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

function resetForm()
{
  form.manufacturer = ''
  form.name = ''
  form.transportCategory = ''
  form.upgradeType = ''
  form.upgradeLocation = []
  form.lapTime = ''
  form.topSpeed = ''
  form.price = ''
  form.releaseDate = ''
  form.source = ''
  form.weight = ''
  form.driveGears = ''
  form.driveTrain = ''
  form.seats = ''
  form.features = ''

  selectedUpgradeLocations.value = []
  selectedFeatureOptions.value = []
  showUpgradeLocationDropdown.value = false
}

function fillForm()
{
  form.manufacturer = props.model?.manufacturer ?? ''
  form.name = props.model?.name ?? ''
  form.transportCategory = props.model?.transportCategory ?? ''
  form.upgradeType = props.model?.upgradeType ?? ''
  form.upgradeLocation = props.model?.upgradeLocation ?? ''
  form.lapTime = props.model?.lapTime ?? ''
  form.topSpeed = props.model?.topSpeed ?? ''
  form.price = props.model?.price ?? ''
  form.releaseDate = props.model?.releaseDate ?? ''
  form.source = props.model?.source ?? ''
  form.weight = props.model?.weight ?? ''
  form.driveGears = props.model?.driveGears ?? ''
  form.driveTrain = props.model?.driveTrain ?? ''
  form.seats = props.model?.seats ?? ''
  form.features = props.model?.features ?? ''

  selectedUpgradeLocations.value = form.upgradeLocation
    ? form.upgradeLocation.split(',').map(v => v.trim())
    : []  

  selectedFeatureOptions.value = form.features
    ? form.features.split(',').map(v => v.trim())
    : []

  showUpgradeLocationDropdown.value = false
}

function handleEsc(e)
{
  if (e.key !== 'Escape') {
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
  
  try {
    const payload = {
      manufacturer: form.manufacturer,
      name: form.name,
      transportCategory: form.transportCategory,
      upgradeType: form.upgradeType,

      upgradeLocation: upgradeLocationOptions
        .filter((location) => {
          return selectedUpgradeLocations.value.includes(location)
        })
        .join(', '),

      lapTime: form.lapTime === '' ? null : Number(form.lapTime),
      topSpeed: form.topSpeed === '' ? null : Number(form.topSpeed),
      price: form.price === '' ? null : Number(form.price),
      releaseDate: form.releaseDate === '' ? null : form.releaseDate,
      source: form.source,
      weight: form.weight === '' ? null : Number(form.weight),
      driveGears: form.driveGears === '' ? null : Number(form.driveGears),
      driveTrain: form.driveTrain,
      seats: form.seats === '' ? null : Number(form.seats),

      features: featureOptions
        .filter((option) => {
          return selectedFeatureOptions.value.includes(option)
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
  window.addEventListener('keydown', handleEsc)
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
  document.removeEventListener('click', handleDocumentClick)
})
</script>