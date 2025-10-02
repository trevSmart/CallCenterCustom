<template>
  <div id="app">
    <NinjaSidebar v-if="showSidebar" />
    <main :class="['app-content', { 'with-sidebar': showSidebar }]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NinjaSidebar from './components/NinjaSidebar.vue'

const route = useRoute()

const showSidebar = computed(() => route.name !== 'Login')
</script>

<style>
#app {
  font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--gray-800);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: var(--gray-50);
}

.app-content {
  min-height: 100vh;
  transition: margin-left 0.2s ease;
}

.app-content.with-sidebar {
  margin-left: 280px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>
