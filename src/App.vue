<template>
  <div id="app">
    <!-- Sidebar global (només quan l'usuari està autenticat) -->
    <NinjaSidebar v-if="isAuthenticated" />

    <!-- Contingut principal -->
    <div :class="{ 'with-sidebar': isAuthenticated }">
      <router-view />
    </div>

    <!-- Phone Widget Overlay -->
    <div
      v-if="callsStore.isCallVisible"
      class="phone-widget-overlay"
      :class="{ 'visible': callsStore.isCallVisible }"
      @click="callsStore.hideIncomingCall"
    >
    </div>

    <!-- Incoming Call Widget -->
    <IncomingCallWidget
      v-if="callsStore.hasIncomingCall && callsStore.isCallVisible"
      :call-data="callsStore.currentIncomingCall"
      :visible="callsStore.isCallVisible"
      @call-answered="handleCallAnswered"
      @call-declined="handleCallDeclined"
      @call-reminder-set="handleCallReminderSet"
      @call-messaged="handleCallMessaged"
      @call-hidden="handleCallHidden"
    />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'
import { useCallsStore } from './stores/calls.js'
import NinjaSidebar from './components/NinjaSidebar.vue'
import IncomingCallWidget from './components/IncomingCallWidget.vue'

export default {
  name: 'App',
  components: {
    NinjaSidebar,
    IncomingCallWidget
  },
  setup() {
    const authStore = useAuthStore()
    const callsStore = useCallsStore()

    const isAuthenticated = computed(() => authStore.isAuthenticated)

    // Call event handlers
    const handleCallAnswered = () => {
      callsStore.answerCall()
      // Add success feedback
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }
    }

    const handleCallDeclined = () => {
      callsStore.declineCall()
    }

    const handleCallReminderSet = () => {
      callsStore.setCallReminder(callsStore.currentIncomingCall)
      // Show success notification
      console.log('Call reminder set successfully')
    }

    const handleCallMessaged = () => {
      callsStore.sendMessageToCaller(callsStore.currentIncomingCall)
    }

    const handleCallHidden = () => {
      callsStore.hideIncomingCall()
    }

    // Initialize calls store
    onMounted(() => {
      callsStore.initialize()

      // Add keyboard shortcuts for testing
      document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Shift + C to simulate incoming call
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
          e.preventDefault()
          callsStore.simulateIncomingCall()
        }

        // Escape to hide incoming call
        if (e.key === 'Escape' && callsStore.isCallVisible) {
          callsStore.hideIncomingCall()
        }
      })
    })

    return {
      authStore,
      callsStore,
      isAuthenticated,
      handleCallAnswered,
      handleCallDeclined,
      handleCallReminderSet,
      handleCallMessaged,
      handleCallHidden
    }
  }
}
</script>

<style>
#app {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--gray-800);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: var(--gray-50);
}

.with-sidebar {
  margin-left: 280px; /* Anchura de la sidebar */
  width: calc(100vw - 280px); /* Ocupar el espai restant */
  min-height: 100vh;
}

@media (max-width: 768px) {
  .with-sidebar {
    margin-left: 0; /* En mòbils, la sidebar es sobreposa */
    width: 100vw; /* En mòbils ocupa tota l'ample */
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>