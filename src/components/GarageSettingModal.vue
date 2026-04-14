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
            차고 설정
          </div>
        </div>

        <!-- body -->
        <div class="grid grid-cols-1 gap-4 mb-6">
          <!-- 차고명 -->
          <div>
            <div class="text-xs text-neutral-700 mb-1">차고명</div>
            <input
              type="text"
              class="w-full h-10 px-3 rounded-md border border-neutral-300 bg-neutral-100 text-sm"
              :value="garageName"
              readonly
            />
          </div>

          <!-- 별칭 -->
          <div>
            <div class="text-xs text-neutral-700 mb-1">별칭</div>
            <input
              v-model="alias"
              type="text"
              maxlength="100"
              placeholder="차고 별칭을 입력하세요"
              class="w-full h-10 px-3 rounded-md border border-neutral-300 bg-white text-sm
                     focus:outline-none"
            />
          </div>

          <!-- 설명 -->
          <div>
            <div class="text-xs text-neutral-700 mb-1">설명</div>
            <textarea
              v-model="description"
              maxlength="255"
              rows="4"
              placeholder="차고 설명을 입력하세요"
              class="w-full px-3 py-2 rounded-md border border-neutral-300 bg-white text-sm
                     resize-none focus:outline-none"
            ></textarea>

            <div class="mt-1 text-[12px] text-neutral-500 text-right">
              {{ description.length }}/255
            </div>
          </div>
        </div>

        <!-- buttons -->
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="h-8 px-3 rounded-md border border-neutral-400 bg-neutral-200 text-sm"
            @click="closeModal"
          >
            취소
          </button>

          <button
            type="button"
            class="h-8 px-3 rounded-md bg-black text-white text-sm"
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
import { computed, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  open: Boolean,
  garage: {
    type: Object,
    default() {
      return null
    }
  }
})

const emit = defineEmits([
  'update:open',
  'save'
])

const modalBoxRef = ref(null)

const alias = ref('')
const description = ref('')

const garageName = computed(() => {
  return props.garage?.garage ?? props.garage?.garageName ?? ''
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      alias.value = String(props.garage?.alias ?? '').trim()
      description.value = String(props.garage?.description ?? '').trim()

      document.addEventListener('keydown', onDocKeyDown)
      document.addEventListener('mousedown', onDocMouseDownCapture, true)
    } else {
      document.removeEventListener('keydown', onDocKeyDown)
      document.removeEventListener('mousedown', onDocMouseDownCapture, true)
    }
  }
)

function closeModal()
{
  emit('update:open', false)
}

function handleSave()
{
  const garageId = props.garage?.garageId

  if (!garageId) {
    return
  }

  emit('save', {
    garageId: garageId,
    alias: alias.value.trim(),
    description: description.value.trim()
  })
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

  closeModal()
}

function onDocMouseDownCapture(e)
{
  if (!props.open) {
    return
  }

  const modalEl = modalBoxRef.value

  if (!modalEl) {
    return
  }

  if (!modalEl.contains(e.target)) {
    closeModal()
  }
}

onUnmounted(() => {
  document.removeEventListener('keydown', onDocKeyDown)
  document.removeEventListener('mousedown', onDocMouseDownCapture, true)
})
</script>