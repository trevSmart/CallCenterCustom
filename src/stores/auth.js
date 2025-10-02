import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: !!localStorage.getItem('isAuthenticated')
  }),

  actions: {
    async login(username, password) {
      // Simulació d'autenticació
      if (username === 'agent@xavibank.com' && password === 'trompeta1') {
        this.user = {
          id: 1,
          name: 'Agent Call Center',
          role: 'agent',
          permissions: ['read_calls', 'create_calls', 'manage_cases']
        }
        this.isAuthenticated = true
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(this.user))
        return { success: true }
      }
      return { success: false, message: 'Credencials incorrectes' }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')
    }
  }
})
