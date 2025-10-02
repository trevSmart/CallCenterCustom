<template>
  <div class="ninja-dashboard">
    <div class="main-content">
      <!-- Top Header -->
      <header class="main-header">
        <h1 class="header-title">XaviBank Call Center Dashboard</h1>
        <div class="header-actions">
          <button
            @click="toggleSimulationMode"
            class="simulation-btn"
            :class="{ active: callsStore.isSimulationMode }"
          >
            📞 {{ callsStore.isSimulationMode ? 'Simulation Mode: ON' : 'Simulation Mode: OFF' }}
          </button>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
      </header>

      <!-- Chat Interface -->
      <div class="chat-interface">
        <ChatList @openChat="handleOpenChat" />

        <!-- Phone Widget (Floating) -->
        <div class="phone-widget-container">
          <div class="phone-card">
            <h3 class="phone-title">📞 Phone Controls</h3>

            <div class="current-call" v-if="currentCall">
              <div class="call-info">
                <strong>Calling:</strong> {{ currentCall.phoneNumber }}
                <div class="call-duration">⏱️ {{ formatDuration(currentCall.duration) }}</div>
              </div>
              <div class="call-actions">
                <select v-model="callOutcome" class="outcome-select">
                  <option value="successful">Successful</option>
                  <option value="no_answer">No Answer</option>
                  <option value="busy">Busy</option>
                  <option value="voice_mail">Voicemail</option>
                  <option value="disconnected">Disconnected</option>
                </select>
                <textarea
                  v-model="callNotes"
                  placeholder="Call notes..."
                  class="call-notes"
                ></textarea>
                <button @click="endCall" class="end-call-btn">📞 End Call</button>
              </div>
            </div>

            <div class="make-call" v-else>
              <input
                v-model="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                class="phone-input"
                pattern="[0-9+\s\-\(\)]+"
              />

              <div class="contact-search" v-if="phoneNumber">
                <p>🔍 Search contact:</p>
                <select v-model="selectedContact" class="contact-select">
                  <option value="">-- Select contact --</option>
                  <option
                    v-for="contact in searchContacts"
                    :key="contact.id"
                    :value="contact"
                  >
                    {{ contact.firstName }} {{ contact.lastName }} - {{ contact.phone }}
                  </option>
                </select>
              </div>

              <button @click="makeCall" class="make-call-btn">📞 Make Call</button>
            </div>
          </div>

          <!-- Recent Calls Widget -->
          <div class="recent-calls-card">
            <h3 class="calls-title">📋 Recent Calls</h3>
            <div class="calls-list">
              <div
                v-for="call in recentCalls.slice(0, 5)"
                :key="call.id"
                class="call-item"
              >
                <div class="call-details">
                  <div class="call-number">{{ call.phoneNumber }}</div>
                  <div class="call-time">{{ formatDate(call.startTime) }}</div>
                  <div class="call-status" :class="call.status">{{ call.status }}</div>
                </div>
                <button @click="openCaseFromCall(call)" class="open-case-btn">
                  📝 View Case
                </button>
              </div>
            </div>
          </div>

          <!-- Dashboard Stats Widget -->
          <div
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
            <div class="draggable-header-widget">
              <h3 class="stats-title"><font-awesome-icon icon="chart-line" /> Today's Summary</h3>
              <div class="drag-handle-widget">
                <font-awesome-icon icon="grip-vertical" class="drag-icon" />
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
        </div>

        <!-- Reports Widget -->
        <div class="widget-column">
          <div
            class="draggable-widget"
            :class="{ dragging: reportsWidgetDraggable?.isDragging }"
            :style="{
              position: 'fixed',
              top: (reportsWidgetPosition?.y || 140) + 'px',
              left: (reportsWidgetPosition?.x || 620) + 'px',
            }"
            @mousedown="startReportsDrag"
            @touchstart="startReportsDrag"
          >
            <ReportsWidget />
          </div>
        </div>
      </div>
    </div>

    <!-- Live Chat Widget -->
    <LiveChatWidget
      :selectedChat="selectedChat"
      @sendMessage="handleSendMessage"
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
import { useDraggableWidget } from '../composables/useDraggable.js'

let callTimer = null

export default {
  name: 'DashboardView',
  components: {
    ChatList,
    LiveChatWidget,
    ReportsWidget
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const callsStore = useCallsStore()
    const bankingStoreInstance = useBankingStore()

    const selectedChat = ref(null)

    // Draggable widgets setup
    const phoneWidgetDraggable = useDraggableWidget('phone-widget', { x: 320, y: 140 })
    const recentCallsWidgetDraggable = useDraggableWidget('recent-calls-widget', { x: 320, y: 500 })
    const statsWidgetDraggable = useDraggableWidget('stats-widget', { x: 320, y: 800 })
    const reportsWidgetDraggable = useDraggableWidget('reports-widget', { x: 620, y: 140 })

    const phoneWidgetPosition = phoneWidgetDraggable.position
    const recentCallsWidgetPosition = recentCallsWidgetDraggable.position
    const statsWidgetPosition = statsWidgetDraggable.position
    const reportsWidgetPosition = reportsWidgetDraggable.position

    const phoneWidgetRef = phoneWidgetDraggable.elementRef
    const recentCallsWidgetRef = recentCallsWidgetDraggable.elementRef
    const statsWidgetRef = statsWidgetDraggable.elementRef
    const reportsWidgetRef = reportsWidgetDraggable.elementRef

    const startPhoneWidgetDrag = phoneWidgetDraggable.startDrag
    const startRecentCallsDrag = recentCallsWidgetDraggable.startDrag
    const startStatsDrag = statsWidgetDraggable.startDrag
    const startReportsDrag = reportsWidgetDraggable.startDrag

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

    const toggleSimulationMode = () => {
      callsStore.toggleSimulationMode()

      if (!callsStore.isSimulationMode && callTimer) {
        clearInterval(callTimer)
        callTimer = null
      }
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
      currentCall,
      recentCalls,
      todaysCalls,
      todaysCases,
      activeOpportunities,
      searchContacts,
      makeCall,
      endCall,
      openCaseFromCall,
      toggleSimulationMode,
      logout,
      handleOpenChat,
      handleSendMessage,
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
      startStatsDrag
    }
  }
}
</script>

<style scoped>
.ninja-dashboard {
  min-height: 100vh;
  background: #f9fafb;
  font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

.simulation-btn {
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  background: white;
  color: #3b82f6;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.simulation-btn:hover {
  background: #f1f5f9;
}

.simulation-btn.active {
  background: #3b82f6;
  color: white;
}

.logout-btn {
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #dc2626;
}

.chat-interface {
  position: relative;
  height: calc(100vh - 88px);
}

.draggable-widget {
  width: 280px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  z-index: 10;
  transition: box-shadow 0.2s ease;
  cursor: default;
}

.draggable-widget.dragging {
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 5px -2px rgba(0, 0, 0, 0.06);
  cursor: grabbing;
}

.phone-card,
.recent-calls-card,
.stats-card {
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

.phone-title,
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
  border-left: 4px solid #10b981;
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
  border-color: #3b82f6;
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
  border-color: #3b82f6;
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
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 244, 0.06);
}

.make-call-btn {
  background: #10b981;
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
  background: #059669;
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
  color: #065f46;
}

.call-status.active {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.open-case-btn {
  background: #3b82f6;
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
  background: #2563eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 4px;
}

.stat-label {
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
}
</style>