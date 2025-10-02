<template>
  <div class="phone-dialer">
    <!-- Header with user info -->
    <div class="dialer-header">
      <div class="user-avatar">
        <img
          src="/images/admin-avatar.jpg"
          alt="User"
          @error="handleImageError"
        />
        <font-awesome-icon icon="user-circle" class="avatar-fallback" />
      </div>
      <div class="user-info">
        <div class="user-name">Admin User</div>
        <div class="user-status">Call Center Agent</div>
      </div>
      <button class="menu-btn" @click="toggleMenu">
        <font-awesome-icon icon="ellipsis-vertical" />
      </button>
    </div>

    <!-- Recent Contacts Section -->
    <div class="recent-contacts" v-if="recentContacts.length > 0">
      <!-- Featured Contact -->
      <div class="featured-contact" v-if="featuredContact" @click="callContact(featuredContact)">
        <div class="contact-avatar">
          <img
            :src="featuredContact.profileImage || '/images/default-avatar.jpg'"
            :alt="featuredContact.name"
            @error="handleContactImageError"
          />
          <font-awesome-icon icon="user-circle" class="contact-fallback" />
        </div>
        <div class="contact-info">
          <div class="contact-name">{{ featuredContact.name }}</div>
          <div class="contact-number">{{ featuredContact.phone }}</div>
        </div>
        <div class="contact-action">
          <font-awesome-icon icon="phone" />
        </div>
      </div>

      <!-- Other Recent Contacts -->
      <div class="other-recent" v-if="otherRecentContacts.length > 0">
        <div
          class="recent-contact"
          v-for="contact in otherRecentContacts"
          :key="contact.id"
          @click="callContact(contact)"
        >
          <div class="contact-avatar small">
            <img
              :src="contact.profileImage || '/images/default-avatar.jpg'"
              :alt="contact.name"
              @error="handleContactImageError"
            />
            <font-awesome-icon icon="user-circle" class="contact-fallback" />
          </div>
          <div class="contact-details">
            <div class="contact-name">{{ contact.name }}</div>
            <div class="contact-number">{{ contact.phone }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Number Display -->
    <div class="number-display">
      <div class="dialed-number">{{ displayNumber || '+977' }}</div>
    </div>

    <!-- Dialpad -->
    <div class="dialpad">
      <div class="dialpad-row">
        <button class="dial-btn" @click="addDigit('1')">
          <span class="number">1</span>
          <span class="letters"></span>
        </button>
        <button class="dial-btn" @click="addDigit('2')">
          <span class="number">2</span>
          <span class="letters">ABC</span>
        </button>
        <button class="dial-btn" @click="addDigit('3')">
          <span class="number">3</span>
          <span class="letters">DEF</span>
        </button>
      </div>
      <div class="dialpad-row">
        <button class="dial-btn" @click="addDigit('4')">
          <span class="number">4</span>
          <span class="letters">GHI</span>
        </button>
        <button class="dial-btn" @click="addDigit('5')">
          <span class="number">5</span>
          <span class="letters">JKL</span>
        </button>
        <button class="dial-btn" @click="addDigit('6')">
          <span class="number">6</span>
          <span class="letters">MNO</span>
        </button>
      </div>
      <div class="dialpad-row">
        <button class="dial-btn" @click="addDigit('7')">
          <span class="number">7</span>
          <span class="letters">PQRS</span>
        </button>
        <button class="dial-btn" @click="addDigit('8')">
          <span class="number">8</span>
          <span class="letters">TUV</span>
        </button>
        <button class="dial-btn" @click="addDigit('9')">
          <span class="number">9</span>
          <span class="letters">WXYZ</span>
        </button>
      </div>
      <div class="dialpad-row">
        <button class="dial-btn" @click="addDigit('*')">
          <span class="number">*</span>
          <span class="letters"></span>
        </button>
        <button class="dial-btn" @click="addDigit('0')">
          <span class="number">0</span>
          <span class="letters">+</span>
        </button>
        <button class="dial-btn" @click="addDigit('#')">
          <span class="number">#</span>
          <span class="letters"></span>
        </button>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="bottom-nav">
      <button class="nav-btn" @click="showCallHistory">
        <font-awesome-icon icon="history" />
      </button>
      <button class="call-btn" @click="makeCall" :disabled="!displayNumber || displayNumber === '+977'">
        <font-awesome-icon icon="phone" />
      </button>
      <button class="nav-btn" @click="showContacts">
        <font-awesome-icon icon="grid-2" />
      </button>
    </div>

    <!-- Backspace Button (visible when typing) -->
    <button
      class="backspace-btn"
      @click="removeDigit"
      v-if="displayNumber && displayNumber !== '+977'"
    >
      <font-awesome-icon icon="delete-left" />
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCallsStore } from '../stores/calls.js'
import { useBankingStore } from '../stores/banking.js'

export default {
  name: 'PhoneDialer',
  emits: ['call-made', 'contact-selected'],
  setup(props, { emit }) {
    const router = useRouter()
    const callsStore = useCallsStore()
    const bankingStore = useBankingStore()

    const displayNumber = ref('+977')
    const showBackspace = ref(false)

    // Recent contacts from banking store
    const recentContacts = computed(() => {
      return (bankingStore.contacts || []).slice(0, 4).map(contact => ({
        ...contact,
        profileImage: contact.profileImage || '/images/default-avatar.jpg'
      }))
    })

    const featuredContact = computed(() => {
      return recentContacts.value[0] || null
    })

    const otherRecentContacts = computed(() => {
      return recentContacts.value.slice(1, 4)
    })

    const addDigit = (digit) => {
      if (displayNumber.value === '+977') {
        displayNumber.value = '+' + digit
      } else {
        displayNumber.value += digit
      }
      showBackspace.value = displayNumber.value !== '+977'
    }

    const removeDigit = () => {
      if (displayNumber.value.length > 1) {
        displayNumber.value = displayNumber.value.slice(0, -1)
        if (displayNumber.value === '+') {
          displayNumber.value = '+977'
        }
      } else {
        displayNumber.value = '+977'
      }
      showBackspace.value = displayNumber.value !== '+977'
    }

    const makeCall = async () => {
      if (!displayNumber.value || displayNumber.value === '+977') return

      // Check if there's a matching contact
      const matchingContact = recentContacts.value.find(contact =>
        contact.phone === displayNumber.value
      )

      const contact = matchingContact || null
      const number = displayNumber.value.replace('+', '')

      callsStore.startCall(number, contact)
      emit('call-made', { number, contact })

      // Reset display
      displayNumber.value = '+977'
      showBackspace.value = false
    }

    const callContact = (contact) => {
      displayNumber.value = '+' + contact.phone
      makeCall()
    }

    const showCallHistory = () => {
      router.push({ name: 'Calls' })
    }

    const showContacts = () => {
      router.push({ name: 'Contacts' })
    }

    const toggleMenu = () => {
      // Menu functionality can be added here
      console.log('Menu toggled')
    }

    const handleImageError = (event) => {
      event.target.style.display = 'none'
      const fallback = event.target.nextElementSibling
      if (fallback) {
        fallback.style.display = 'block'
      }
    }

    const handleContactImageError = (event) => {
      event.target.style.display = 'none'
      const fallback = event.target.nextElementSibling
      if (fallback) {
        fallback.style.display = 'block'
      }
    }

    return {
      displayNumber,
      showBackspace,
      recentContacts,
      featuredContact,
      otherRecentContacts,
      addDigit,
      removeDigit,
      makeCall,
      callContact,
      showCallHistory,
      showContacts,
      toggleMenu,
      handleImageError,
      handleContactImageError
    }
  }
}
</script>

<style scoped>
.phone-dialer {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 24px;
  padding: 20px;
  color: white;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 350px;
  margin: 0 auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
}

.dialer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  position: relative;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #22d3ee, #0e7490);
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: none;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 2px;
}

.user-status {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.menu-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Recent Contacts */
.recent-contacts {
  margin-bottom: 24px;
}

.featured-contact {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #22d3ee, #0e7490);
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.featured-contact:hover {
  transform: translateY(-2px);
}

.contact-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.contact-avatar.small {
  width: 40px;
  height: 40px;
}

.contact-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-fallback {
  width: 100%;
  height: 100%;
  display: none;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-name {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 2px;
}

.contact-number {
  font-size: 14px;
  opacity: 0.9;
}

.contact-action {
  padding: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.contact-action:hover {
  background: rgba(255, 255, 255, 0.3);
}

.other-recent {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-contact {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.recent-contact:hover {
  background: rgba(255, 255, 255, 0.15);
}

.contact-details {
  flex: 1;
  min-width: 0;
}

/* Number Display */
.number-display {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.dialed-number {
  font-size: 32px;
  font-weight: 300;
  color: #22d3ee;
  letter-spacing: 2px;
}

/* Dialpad */
.dialpad {
  margin-bottom: 32px;
}

.dialpad-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.dial-btn {
  flex: 1;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 16px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.dial-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.dial-btn:active {
  transform: translateY(0);
  background: rgba(255, 255, 255, 0.3);
}

.dial-btn .number {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}

.dial-btn .letters {
  font-size: 10px;
  opacity: 0.7;
  font-weight: 300;
}

/* Bottom Navigation */
.bottom-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.nav-btn {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.call-btn {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #22d3ee, #0e7490);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.2s ease;
  box-shadow: 0 8px 16px rgba(34, 211, 238, 0.3);
}

.call-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(34, 211, 238, 0.400);
}

.call-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Backspace Button */
.backspace-btn {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.backspace-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 480px) {
  .phone-dialer {
    margin: 10px;
    border-radius: 20px;
  }

  .dial-btn .number {
    font-size: 20px;
  }

  .dial-btn .letters {
    font-size: 8px;
  }
}
</style>
