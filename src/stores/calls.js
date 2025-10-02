import { defineStore } from 'pinia'

export const useCallsStore = defineStore('calls', {
  state: () => ({
    calls: [],
    currentCall: null,
    isSimulationMode: localStorage.getItem('simulationMode') === 'true'
  }),

  getters: {
    activeCalls: (state) => state.calls.filter(call => call.status === 'active'),
    completedCalls: (state) => state.calls.filter(call => call.status === 'completed'),
    missedCalls: (state) => state.calls.filter(call => call.status === 'missed')
  },

  actions: {
    startCall(phoneNumber, contact = null) {
      const call = {
        id: Date.now() + Math.random(),
        phoneNumber,
        contact,
        startTime: new Date(),
        endTime: null,
        status: 'active',
        duration: 0,
        outcome: null,
        notes: ''
      }

      this.calls.unshift(call)
      this.currentCall = call
      return call
    },

    endCall(outcome, notes = '') {
      if (this.currentCall) {
        this.currentCall.endTime = new Date()
        this.currentCall.duration = Math.floor((this.currentCall.endTime - this.currentCall.startTime) / 1000)
        this.currentCall.status = 'completed'
        this.currentCall.outcome = outcome
        this.currentCall.notes = notes
        this.currentCall = null
      }
    },

    toggleSimulationMode() {
      this.isSimulationMode = !this.isSimulationMode
      localStorage.setItem('simulationMode', this.isSimulationMode.toString())
    }
  }
})
