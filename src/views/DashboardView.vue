<template>
  <div class="ninja-dashboard">
    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Top Header -->
      <header class="main-header">
        <h1 class="header-title">Dashboard</h1>
        <div class="header-actions">
          <button class="theme-toggle-btn" @click="toggleTheme" :title="isDarkMode ? 'Change to light mode' : 'Change to dark mode'">
            <font-awesome-icon :icon="isDarkMode ? 'sun' : 'moon'" />
          </button>
          <div class="user-profile" @click="logout">
            <div class="user-avatar">
              <img
                src="/images/admin-avatar.jpg"
                alt="Admin"
                class="avatar-image"
                @error="handleImageError"
              />
              <!-- Fallback icon if image fails to load -->
              <font-awesome-icon
                icon="user-circle"
                class="avatar-fallback"
                style="display: none;"
              />
            </div>
            <div class="user-info">
              <div class="user-name">Admin User</div>
              <div class="user-role">Call Center Agent</div>
            </div>
            <button class="logout-icon-btn" @click="logout" title="Logout">
              <font-awesome-icon icon="sign-out-alt" />
            </button>
          </div>
        </div>
      </header>

      <!-- Chat Interface -->
      <div class="chat-interface">
        <ChatList @openChat="handleOpenChat" />

        <!-- Phone Dialer Widget (Floating) -->
        <div
          v-if="showPhoneWidget"
          class="phone-dialer-card draggable-widget"
          ref="phoneWidgetRef"
          :style="{
            position: 'fixed',
            left: (phoneWidgetPosition?.x || 320) + 'px',
            top: (phoneWidgetPosition?.y || 140) + 'px'
          }"
          @mousedown="startPhoneWidgetDrag"
          @touchstart="startPhoneWidgetDrag"
        >
          <div class="widget-header">
            <div class="drag-indicator">
              <font-awesome-icon icon="grip-vertical" />
            </div>
            <h3 class="phone-title">
              <font-awesome-icon icon="phone" /> Phone Dialer
            </h3>
            <div class="widget-controls">
              <button class="minimize-icon" @click-stop="closePhoneWidget">
                <font-awesome-icon icon="minimize" />
              </button>
            </div>
          </div>

          <!-- Phone Dialer Component -->
          <div class="widget-content">
            <PhoneDialer
              @call-made="handleDialerCall"
              @contact-selected="handleContactSelected"
            />
          </div>

          <!-- Simulate incoming call button -->
          <div class="simulate-section">
            <button @click="simulateIncomingCall" class="simulate-call-btn">
              <font-awesome-icon icon="phone-volume" /> Simulate Incoming Call
            </button>
          </div>

          <!-- Condensed call status (only when active) -->
          <div class="call-status" v-if="currentCall">
            <div class="call-info-compact">
              <span>Calling: {{ currentCall.phoneNumber }}</span>
              <span class="call-duration">{{ formatDuration(currentCall.duration) }}</span>
            </div>
            <button @click="endCall" class="end-call-btn">
              <font-awesome-icon icon="phone" /> End Call
            </button>
          </div>
        </div>

          <!-- Dashboard Stats Widget -->
          <div
            v-if="showStatsWidget"
            class="stats-card draggable-widget"
            ref="statsWidgetRef"
            :style="{
              position: 'fixed',
              left: (statsWidgetPosition?.x || 320) + 'px',
              top: (statsWidgetPosition?.y || 800) + 'px'
            }"
            @mousedown="startStatsDrag"
            @touchstart="startStatsDrag"
          >
            <div class="widget-header">
              <div class="drag-indicator">
                <font-awesome-icon icon="grip-vertical" />
              </div>
              <h3 class="stats-title"><font-awesome-icon icon="chart-line" /> Today's Summary</h3>
              <div class="widget-controls">
                <router-link to="/dashboard" class="view-all-link">
                  <font-awesome-icon icon="external-link-alt" />
                </router-link>
                <button class="close-btn" @click.stop="closeStatsWidget"><font-awesome-icon icon="xmark" /></button>
              </div>
            </div>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-number">{{ todaysCalls.length }}</div>
                <div class="stat-label">Calls</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ todaysCases.length }}</div>
                <div class="stat-label">Cases</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ activeOpportunities.length }}</div>
                <div class="stat-label">Opportunities</div>
              </div>
            </div>
          </div>

        <!-- Reports Widget -->
        <div class="widget-column" v-if="showReportsWidget">
          <ReportsWidget @closeWidget="closeReportsWidget" />
        </div>
      </div>
    </div>

    <!-- Live Chat Widget -->
    <LiveChatWidget
      :selectedChat="selectedChat"
      @sendMessage="handleSendMessage"
      @closeWidget="closeChatWidget"
    />
  </div>
</template>

<script>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useCallsStore } from '../stores/calls.js'
import { useBankingStore } from '../stores/banking.js'
import ChatList from '../components/ChatList.vue'
import LiveChatWidget from '../components/LiveChatWidget.vue'
import ReportsWidget from '../components/ReportsWidget.vue'
import PhoneDialer from '../components/PhoneDialer.vue'
import { useDraggableWidget } from '../composables/useDraggable.js'
import { useTheme } from '../composables/useTheme.js'

let callTimer = null

export default {
  name: 'DashboardView',
  components: {
    ChatList,
    LiveChatWidget,
    ReportsWidget,
    PhoneDialer
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const callsStore = useCallsStore()
    const bankingStoreInstance = useBankingStore()
    const { isDarkMode, toggleTheme } = useTheme()

    const selectedChat = ref(null)
    const showReportsWidget = ref(true)
    const showStatsWidget = ref(true)
    const showPhoneWidget = ref(true)

    // Draggable widgets setup
    const phoneWidgetDraggable = useDraggableWidget('phone-widget', { x: 320, y: 140 })
    const recentCallsWidgetDraggable = useDraggableWidget('recent-calls-widget', { x: 320, y: 500 })
    const statsWidgetDraggable = useDraggableWidget('stats-widget', { x: 320, y: 800 })
    const phoneWidgetPosition = phoneWidgetDraggable.position
    const recentCallsWidgetPosition = recentCallsWidgetDraggable.position
    const statsWidgetPosition = statsWidgetDraggable.position

    const phoneWidgetRef = phoneWidgetDraggable.elementRef
    const recentCallsWidgetRef = recentCallsWidgetDraggable.elementRef
    const statsWidgetRef = statsWidgetDraggable.elementRef

    const startPhoneWidgetDrag = phoneWidgetDraggable.startDrag
    const startRecentCallsDrag = recentCallsWidgetDraggable.startDrag
    const startStatsDrag = statsWidgetDraggable.startDrag

    const phoneNumber = ref('')
    const selectedContact = ref(null)
    const callNotes = ref('')
    const callOutcome = ref('successful')

    const currentCall = computed(() => callsStore.currentCall)
    const recentCalls = computed(() => callsStore.calls || [])
    const todaysCalls = computed(() =>
      (callsStore.calls || []).filter(call =>
        call.startTime && new Date(call.startTime).toDateString() === new Date().toDateString()
      )
    )

    // Banking data with protection
    const todaysCases = computed(() =>
      (bankingStoreInstance.cases || []).filter(case_ =>
        case_.createdAt && new Date(case_.createdAt).toDateString() === new Date().toDateString()
      )
    )
    const activeOpportunities = computed(() =>
      (bankingStoreInstance.opportunities || []).filter(opp =>
        opp && opp.stage !== 'Closed Won' && opp.stage !== 'Closed Lost'
      )
    )

    const searchContacts = computed(() => {
      if (!phoneNumber.value) return []
      return (bankingStoreInstance.contacts || []).filter(contact =>
        contact && contact.phone && (contact.phone.includes(phoneNumber.value) ||
        phoneNumber.value.includes(contact.phone.slice(-4)))
      )
    })

    const makeCall = () => {
      if (!phoneNumber.value && !selectedContact.value) return

      const contact = selectedContact.value || undefined
      const number = selectedContact.value?.phone || phoneNumber.value

      callsStore.startCall(number, contact)

      // Si està en mode simulació, simular el temporizador
      if (callsStore.isSimulationMode) {
        callTimer = setInterval(() => {
          callsStore.currentCall.duration++
        }, 1000)
      }

      phoneNumber.value = ''
      selectedContact.value = null
    }

    const simulateIncomingCall = () => {
      callsStore.simulateIncomingCall()
    }

    const endCall = () => {
      callsStore.endCall(callOutcome.value, callNotes.value)

      if (callTimer) {
        clearInterval(callTimer)
        callTimer = null
      }

      callNotes.value = ''
      callOutcome.value = 'successful'
    }

    const openCaseFromCall = (call) => {
      // Crear nou cas des de la trucada
      const newCase = {
        id: Date.now(),
        subject: `Consulta telefònica - ${call.phoneNumber}`,
        description: call.notes || `Trucada realitzada el ${formatDate(call.startTime)}`,
        status: 'Open',
        priority: 'Medium',
        contactId: call.contact?.id || null,
        createdAt: new Date().toISOString(),
        resolution: ''
      }

      bankingStoreInstance.addCase(newCase)
      router.push({ name: 'Cases' })
    }


    const logout = () => {
      authStore.logout()
      router.push({ name: 'Login' })
    }

    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60


      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleTimeString('ca-ES')
    }

    // Chat handlers
    const handleOpenChat = (chat) => {
      selectedChat.value = chat
    }

    const handleSendMessage = (messageData) => {
      console.log('Sent message:', messageData)
      // Here you would integrate with your chat backend
    }

    const closeChatWidget = () => {
      selectedChat.value = null
    }

    const closeReportsWidget = () => {
      showReportsWidget.value = false
    }

    const closeStatsWidget = () => {
      showStatsWidget.value = false
    }

    const closePhoneWidget = () => {
      showPhoneWidget.value = false
    }

    // Handle image loading errors
    const handleImageError = (event) => {
      event.target.style.display = 'none'
      const fallback = event.target.nextElementSibling
      if (fallback) {
        fallback.style.display = 'block'
      }
    }

    // Phone Dialer handlers
    const handleDialerCall = ({ number, contact }) => {
      // Start call using the dialer
      callsStore.startCall(number, contact)

      // Si està en mode simulació, simular el temporizador
      if (callsStore.isSimulationMode) {
        callTimer = setInterval(() => {
          callsStore.currentCall.duration++
        }, 1000)
      }
    }

    const handleContactSelected = (contact) => {
      console.log('Contact selected:', contact)
    }

    // Cleanup on component unmount
    onUnmounted(() => {
      if (callTimer) {
        clearInterval(callTimer)
      }
    })

    return {
      authStore,
      callsStore,
      phoneNumber,



      selectedContact,
      callNotes,
      callOutcome,
      selectedChat,
      showReportsWidget,
      showStatsWidget,
      showPhoneWidget,
      currentCall,
      recentCalls,
      todaysCalls,
      todaysCases,
      activeOpportunities,
      searchContacts,
      makeCall,
      simulateIncomingCall,
      endCall,
      openCaseFromCall,
      logout,
      handleOpenChat,
      handleSendMessage,
      closeChatWidget,
      closeReportsWidget,
      closeStatsWidget,
      closePhoneWidget,
      isDarkMode,
      toggleTheme,
      formatDuration,
      formatDate,
      phoneWidgetPosition,
      recentCallsWidgetPosition,
      statsWidgetPosition,
      phoneWidgetRef,
      recentCallsWidgetRef,
      statsWidgetRef,
      startPhoneWidgetDrag,
      startRecentCallsDrag,
      startStatsDrag,
      handleImageError,
      handleDialerCall,
      handleContactSelected
    }
  }
}
</script>

<style scoped>
.ninja-dashboard {
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.main-content {
  flex: 1;
  background: white;
  min-height: 100vh;
}

.main-header {
  background: white;
  padding: 32px 40px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.02);
}

.header-title {
  margin: 0;
  color: #1f2937;
  font-weight: 600;
  font-size: 24px;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-profile:hover {
  background: #f9fafb;
  border-color: #22d3ee;
  box-shadow: 0 2px 8px rgba(34, 211, 238, 0.1);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0e7490, #22d3ee);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.2;
}

.logout-icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.logout-icon-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.chat-interface {
  position: relative;
  height: calc(100vh - 88px);
}

.draggable-widget {
  width: 280px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
  z-index: 9998;
  transition: box-shadow 0.2s ease;
  cursor: default;
}

.draggable-widget.dragging {
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 5px -2px rgba(0, 0, 0, 0.06);
  cursor: grabbing;
}

.recent-calls-card {
  /* Estilos se mantienen igual que antes */
}

.draggable-header-widget {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  cursor: grab;
  margin-bottom: 16px;
}

.draggable-header-widget:active {
  cursor: grabbing;
}

.drag-handle-widget {
  color: #9ca3af;
  font-size: 12px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.draggable-header-widget:hover .drag-handle-widget {
  opacity: 1;
}

.drag-icon {
  pointer-events: none;
}

.phone-title {
  margin: 0;
  color: white;
  font-weight: 600;
  font-size: 16px;
  flex: 1;
}

.calls-title,
.stats-title {
  margin: 0;
  color: #1f2937;
  font-weight: 600;
  font-size: 16px;
}

.current-call {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  margin-bottom: 16px;
}

.call-info {
  margin-bottom: 12px;
  font-size: 14px;
  color: #1f2937;
}

.call-duration {
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
}

.call-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.outcome-select,
.call-notes {
  padding: 8px 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.outcome-select:focus,
.call-notes:focus {
  outline: none;
  border-color: #22d3ee;
  box-shadow: 0 0 0 2px rgba(59, 130, 244, 0.06);
}

.call-notes {
  height: 60px;
  resize: vertical;
  min-height: 60px;
}

.end-call-btn {
  background: #ef4444;
  color: white;
  border: none;

  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.end-call-btn:hover {
  background: #dc2626;
}

.make-call {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.phone-input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.phone-input:focus {
  outline: none;
  border-color: #22d3ee;
  box-shadow: 0 0 0 2px rgba(59, 130, 244, 0.06);
}

.contact-search {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.contact-search p {
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 8px;
}

.contact-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-top: 8px;
  font-family: inherit;
  font-size: 13px;
  transition: border-color 0.2s ease;
}

.contact-select:focus {
  outline: none;
  border-color: #22d3ee;
  box-shadow: 0 0 0 2px rgba(59, 130, 244, 0.06);
}

.make-call-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  transition: background-color 0.2s ease;
}

.make-call-btn:hover {
  background: #1e40af;
}

.test-incoming-call-btn {
  background: #f97316;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  transition: background-color 0.2s ease;
  margin-top: 8px;
  width: 100%;
}

.test-incoming-call-btn:hover {
  background: #ea580c;
}

.calls-list {
  display: flex;
  flex-direction: column;
}

.call-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.call-item:hover {
  background: #f9fafb;
  padding-left: 8px;
  padding-right: 8px;
  margin: 0 -8px;
  border-radius: 6px;
}

.call-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.call-number {
  font-weight: 500;
  color: #1f2937;
  font-size: 13px;
}

.call-time {
  color: #6b7280;
  font-size: 12px;
}

.call-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
}

.call-status.completed {
  background: rgba(16, 185, 129, 0.1);
  color: #1e40af;
}

.call-status.active {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.open-case-btn {
  background: #22d3ee;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.open-case-btn:hover {
  background: #0891b2;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding-top: 4px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #22d3ee;
  margin-bottom: 4px;
}

.stat-label {
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
}

/* Phone Dialer Widget Styles */
.phone-dialer-card {
  background: transparent !important;
  border-radius: 12px;
  overflow: visible;
  width: 400px;
}

.widget-content {
  padding: 0;
}

.phone-dialer-card .phone-dialer {
  box-shadow: none;
  margin: 0;
  max-width: none;
}

.simulate-section {
  padding: 12px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
}

.simulate-call-btn {
  background: #f97316;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  transition: background-color 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.simulate-call-btn:hover {
  background: #ea580c;
}

.phone-dialer-card .phone-title {
  margin: 0;
  color: white;
  font-weight: 600;
  font-size: 16px;
  flex: 1;
}

/* Stats Widget Header Styles */
.draggable-widget .widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: none;
  background: #14b8a6; /* Teal color like in image */
  color: white;
  border-radius: 12px 12px 0 0;
  cursor: move;
  user-select: none;
  flex-shrink: 0;
  min-height: 44px;
}

.draggable-widget .drag-indicator {
  color: white;
  font-size: 16px;
  margin-right: 12px;
}

.grid-icon {
  font-family: monospace;
  font-size: 14px;
  line-height: 1;
  letter-spacing: 2px;
}

.draggable-widget .widget-header:hover .drag-indicator {
  color: rgba(255, 255, 255, 0.9);
}

.draggable-widget .stats-title {
  margin: 0;
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex: 1;
}

.draggable-widget .view-all-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 12px;
  transition: color 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.draggable-widget .view-all-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.draggable-widget .widget-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.draggable-widget .close-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
}

.draggable-widget .close-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  color: white;
  border-color: rgba(239, 68, 68, 0.4);
}

/* Theme Toggle Button */
.theme-toggle-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin-right: 12px;
}

.theme-toggle-btn:hover {
  background: rgba(34, 211, 238, 0.1);
  color: #22d3ee;
}

.theme-toggle-btn:active {
  transform: scale(0.95);
}

.dark-theme .theme-toggle-btn {
  color: #cbd5e1;
}

.dark-theme .theme-toggle-btn:hover {
  background: rgba(34, 211, 238, 0.2);
  color: #22d3ee;
}
</style>