<template>
  <div class="phone-dialer">
    <!-- Number Display -->
    <div class="number-display">
      <div class="dialed-number">{{ displayNumber || '+977' }}</div>
      <button
        class="backspace-btn"
        @click="removeDigit"
        v-if="displayNumber && displayNumber !== '+977'"
      >
        <font-awesome-icon icon="delete-left" />
      </button>
    </div>

    <!-- Compact Dialpad -->
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
        <button class="dial-btn" @click="addDigit('0')">
          <span class="number">0</span>
          <span class="letters">+</span>
        </button>
      </div>
      <div class="dialpad-row">
        <button class="call-btn" @click="makeCall" :disabled="!displayNumber || displayNumber === '+977'">
          <font-awesome-icon icon="phone" />
        </button>
      </div>
    </div>
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
  border-radius: 16px;
  padding: 16px;
  color: white;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 250px;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  position: relative;
}

/* Number Display */
.number-display {
  text-align: center;
  margin-bottom: 16px;
  position: relative;
  padding: 8px 0;
}

.dialed-number {
  font-size: 20px;
  font-weight: 300;
  color: #22d3ee;
  letter-spacing: 1px;
}

.backspace-btn {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  color: white;
  padding: 6px 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 12px;
}

.backspace-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Compact Dialpad */
.dialpad {
  margin-bottom: 0;
}

.dialpad-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}


.dial-btn {
  flex: 1;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.dial-btn .number {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.dial-btn .letters {
  font-size: 8px;
  opacity: 0.7;
  font-weight: 400;
}

.dial-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.dial-btn:active {
  background: rgba(255, 255, 255, 0.3);
}

.call-btn {
  width: 100%;
  height: 36px;
  background: linear-gradient(135deg, #22d3ee, #0e7490);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
}

.call-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  box-shadow: 0 4px 12px rgba(34, 211, 238, 0.4);
}

.call-btn:disabled:hover {
  background: linear-gradient(135deg, #22d3ee, #0e7490);
}

.call-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 480px) {
  .phone-dialer {
    margin: 8px;
    max-width: 220px;
    padding: 12px;
  }

  .dial-btn {
    height: 32px;
  }

  .dial-btn .number {
    font-size: 14px;
  }

  .dial-btn .letters {
    font-size: 7px;
  }

  .call-btn {
    height: 32px;
    font-size: 16px;
  }

  .dialed-number {
    font-size: 18px;
  }
}
</style>
