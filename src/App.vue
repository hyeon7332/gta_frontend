<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome()
{
  router.push('/owned')
}

function goTransportModels()
{
  router.push('/transport-models')
}
</script>
<template>
  <div class="min-h-screen bg-neutral-700">
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
            class="h-9 px-4 rounded-md border border-neutral-600
                  bg-neutral-800/70 text-neutral-200 text-sm
                  hover:bg-neutral-700 active:bg-neutral-600
                  transition"
            @click="goHome"
          >
            My Garage
          </button>

          <button
            type="button"
            class="h-9 px-4 rounded-md border border-neutral-600
                  bg-neutral-800/70 text-neutral-200 text-sm
                  hover:bg-neutral-700 active:bg-neutral-600
                  transition"
            @click="goTransportModels"
          >
            Model Library
          </button>
        </div>
      </div>
    </header>

    <!-- Page -->
    <main class="w-full px-6 py-6">
      <router-view />
    </main>
  </div>
</template>