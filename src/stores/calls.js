import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCallsStore = defineStore('calls', () => {
  // State
  const calls = ref([])
  const currentIncomingCall = ref(null)
  const activeCall = ref(null)
  const callHistory = ref([])
  const isCallVisible = ref(false)

  // Getters
  const hasIncomingCall = computed(() => currentIncomingCall.value !== null)
  const hasActiveCall = computed(() => activeCall.value !== null)
  const recentCalls = computed(() => callHistory.value.slice(0, 10))

  // Actions
  const initiateCall = async (contactId) => {
    try {
      // Here you would integrate with your actual calling API
      console.log('Initiating call with contact:', contactId)

      // Simulate call initiation
      const callData = {
        id: Date.now().toString(),
        contactId,
        status: 'calling',
        timestamp: new Date(),
        duration: 0
      }

      activeCall.value = callData

      return { success: true, callId: callData.id }
    } catch (error) {
      console.error('Error initiating call:', error)
      return { success: false, error: error.message }
    }
  }

  const receiveIncomingCall = (contactData) => {
    const callData = {
      id: Date.now().toString(),
      name: contactData.name || 'Unknown Caller',
      profileImage: contactData.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.<｜tool▁sep｜>0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      phoneNumber: contactData.phoneNumber || 'Unknown Number',
      status: 'Incoming call...',
      timestamp: new Date(),
      duration: null,
      contactId: contactData.contactId
    }

    currentIncomingCall.value = callData
    isCallVisible.value = true

    // Add to call history
    callHistory.value.unshift({
      ...callData,
      type: 'incoming',
      status: 'received',
      outcome: 'pending'
    })

    // Auto-hide after 30 seconds if not answered
    setTimeout(() => {
      if (currentIncomingCall.value?.id === callData.id && isCallVisible.value) {
        showMissedCallNotification(callData)
      }
    }, 30000)
  }

  const answerCall = () => {
    if (!currentIncomingCall.value) return

    const callData = currentIncomingCall.value
    activeCall.value = {
      ...callData,
      status: 'active',
      phoneCallDuration: Date.now()
    }

    // Update call history
    const historyEntry = callHistory.value.find(call => call.id === callData.id)
    if (historyEntry) {
      historyEntry.outcome = 'answered'
      historyEntry.status = 'active'
    }

    hideIncomingCall()

    // Here you would integrate with your actual call API
    console.log('Call answered:', callData)

    return { success: true, callId: callData.id }
  }

  const declineCall = () => {
    if (!currentIncomingCall.value) return

    const callData = currentIncomingCall.value

    // Update call history
    const historyEntry = callHistory.value.find(call => call.id === callData.id)
    if (historyEntry) {
      historyEntry.outcome = 'declined'
      historyEntry.status = 'ended'
    }

    hideIncomingCall()

    // Here you would integrate with your actual call API
    console.log('Call declined:', callData)

    return { success: true }
  }

  const hideIncomingCall = () => {
    currentIncomingCall.value = null
    isCallVisible.value = false
  }

  const setCallReminder = (callData) => {
    // Here you would integrate with reminder/notification system
    console.log('Setting reminder for call:', callData)

    // Example: Create a reminder for later
    const reminderData = {
      id: Date.now().toString(),
      type: 'call_reminder',
      contactId: callData.contactId,
      contactName: callData.name,
      phoneNumber: callData.phoneNumber,
      scheduledTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes later
      status: 'pending'
    }

    // You might want to store reminders in localStorage or send to backend
    localStorage.setItem('callReminder_' + reminderData.id, JSON.stringify(reminderData))

    hideIncomingCall()

    return { success: true, reminderId: reminderData.id }
  }

  const sendMessageToCaller = (callData) => {
    // Here you would integrate with messaging system
    console.log('Opening message dialog for:', callData)

    // You might want to open a messaging modal or redirect to messaging page
    hideIncomingCall()

    return { success: true }
  }

  const endCall = () => {
    if (!activeCall.value) return

    const callData = activeCall.value
    const duration = activeCall.value.duration ?
      Math.floor((Date.now() - activeCall.value.duration) / 1000) : 0

    // Update call history
    const historyEntry = callHistory.value.find(call => call.id === callData.id)
    if (historyEntry) {
      historyEntry.status = 'ended'
      historyEntry.phoneCallDuration = duration
    }

    activeCall.value = null

    // Here you would integrate with your actual call API
    console.log('Call ended with duration:', duration, 'seconds')

    return { success: true, duration }
  }

  const showMissedCallNotification = (callData) => {
    // Create a notification toast or update UI to show missed call
    console.log('Missed call notification:', callData)

    if (currentIncomingCall.value?.id === callData.id) {
      const historyEntry = callHistory.value.find(call => call.id === callData.id)
      if (historyEntry) {
        historyEntry.outcome = 'missed'
        historyEntry.status = 'ended'
      }

      hideIncomingCall()
    }
  }

  // Simulate incoming call for testing
  const simulateIncomingCall = (contactData = {}) => {
    const defaultContact = {
      name: 'Mom',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      phoneNumber: '+34 123 456 789',
      contactId: 'contact_' + Date.now()
    }

    receiveIncomingCall({ ...defaultContact, ...contactData })
  }

  // Load saved data from localStorage
  const loadSavedData = () => {
    try {
      const savedCallHistory = localStorage.getItem('callHistory')
      if (savedCallHistory) {
        callHistory.value = JSON.parse(savedCallHistory).map(call => ({
          ...call,
          timestamp: new Date(call.timestamp)
        }))
      }
    } catch (error) {
      console.error('Error loading call history:', error)
    }
  }

  // Save data to localStorage
  const saveCallHistory = () => {
    try {
      localStorage.setItem('callHistory', JSON.stringify(callHistory.value))
    } catch (error) {
      console.error('Error saving call history:', error)
    }
  }

  // Initialize store
  const initialize = () => {
    loadSavedData()

    // Auto-save call history when it changes
    setInterval(saveCallHistory, 30000) // Save every 30 seconds
  }

  // Watch for call history changes to auto-save
  const watchCallHistory = () => {
    // This would be implemented with Vue's watch or watchers
    // For now, we'll use intervals as shown above
  }

  return {
    // State
    calls,
    currentIncomingCall,
    activeCall,
    callHistory,
    isCallVisible,

    // Getters
    hasIncomingCall,
    hasActiveCall,
    recentCalls,

    // Actions
    initiateCall,
    receiveIncomingCall,
    answerCall,
    declineCall,
    hideIncomingCall,
    setCallReminder,
    sendMessageToCaller,
    endCall,
    showMissedCallNotification,
    simulateIncomingCall,
    initialize
  }
})