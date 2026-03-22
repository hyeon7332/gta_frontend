<script setup>
import { useRouter } from 'vue-router'
import { Warehouse, Car } from 'lucide-vue-next'

const router = useRouter()

function goHome()
{
  router.push('/')
}

function goTransportModels()
{
  router.push('/transport-models')
}
</script>
<template>
  <div class="h-screen bg-neutral-700 overflow-hidden flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 h-14 bg-gradient-to-b from-neutral-900 to-neutral-800 shadow border-b border-neutral-700">
      <div class="h-full px-6 flex items-center justify-between">

        <!-- left -->
        <div
          class="text-white text-2xl tracking-wide cursor-pointer hover:opacity-80 transition"
          style="font-family: 'Caveat', cursive;"
          @click="goHome"
        >
          Schni GTA
        </div>

        <!-- right -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-9 px-4 flex items-center gap-1.5 rounded-md border border-neutral-600
                  bg-neutral-800/70 text-neutral-200 text-sm
                  hover:bg-neutral-700 active:bg-neutral-600
                  transition"
            @click="goHome"
          >
            <Warehouse class="w-4 h-4" />
            <span>차고</span>
          </button>

          <button
            type="button"
            class="h-9 px-4 flex items-center gap-1.5 rounded-md border border-neutral-600
                bg-neutral-800/70 text-neutral-200 text-sm
                hover:bg-neutral-700 active:bg-neutral-600
                  transition"
            @click="goTransportModels"
          >
            <Car class="w-4 h-4" />
            <span>이동수단</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Page -->
    <main class="w-full px-6 py-6 flex-1 min-h-0 overflow-hidden">
      <router-view />
    </main>
  </div>
</template>