<template>
  <teleport to="body">
    <div class="toast-wrap">
      <transition-group name="toast-fade">
        <div v-for="t in toasts" :key="t.id" class="toast">{{ t.msg }}</div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])

function show(msg, duration = 2000) {
  const id = Date.now()
  toasts.value.push({ id, msg })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.25s ease; }
.toast-fade-enter-from { opacity: 0; transform: translateY(-8px); }
.toast-fade-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>
