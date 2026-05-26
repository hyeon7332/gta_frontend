<template>
  <Transition name="loading-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 backdrop-blur-[1px]"
    >
      <div
        class="flex flex-col items-center gap-4 px-6 py-5 rounded-xl border border-neutral-700 bg-neutral-900/90 shadow-2xl"
      >
        <div class="loading-spinner"></div>

        <div class="text-[14px] text-neutral-200 tracking-wide">
          로딩 중...
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgb(82 82 91);
  border-top-color: rgb(229 229 229);
  border-radius: 9999px;
  animation: loading-spin 0.8s linear infinite;
}

@keyframes loading-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.18s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
</style>