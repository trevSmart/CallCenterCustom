<template>
  <div
    v-if="isVisible"
    class="incoming-call-container"
    :class="{ 'show': isVisible }"
  >
    <!-- Phone frame -->
    <div class="phone-frame">
      <!-- Screen content -->
      <div class="phone-screen">
        <!-- Background with radial gradient -->
        <div class="call-background"></div>

        <!-- Status bar -->
        <div class="status-bar">
          <span class="time">{{ currentTime }}</span>
          <div class="status-icons">
            <span class="signal">📶</span>
            <span class="wifi">📶</span>
            <span class="battery">🔋</span>
          </div>
        </div>

        <!-- Caller profile section -->
        <div class="caller-section">
          <div class="profile-picture">
            <img :src="callData.profileImage" :alt="callData.name" />
          </div>
          <h1 class="caller-name">{{ callData.name }}</h1>
          <p class="call-status">{{ callData.status }}</p>
        </div>

        <!-- Action buttons -->
        <div class="action-buttons">
          <button
            class="action-btn remind-me-btn"
            @click="handleRemindMe"
          >
            <div class="btn-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
            </div>
            <span class="btn-label">Remind Me</span>
          </button>

          <button
            class="action-btn message-btn"
            @click="handleMessage"
          >
            <div class="btn-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span class="btn-label">Message</span>
          </button>

          <button
            class="action-btn decline-btn"
            @click="handleDecline"
          >
            <div class="btn-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <span class="btn-label">Decline</span>
          </button>
        </div>

        <!-- Answer button with swipe functionality -->
        <div class="answer-section">
          <div
            class="answer-button"
            ref="answerButton"
            @mousedown="startDrag"
            @touchstart="startDrag"
          >
            <div class="answer-icon">
              <div class="phone-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
            </div>
            <span class="slide-text">{{ slideText }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Close button for widget -->
    <button class="close-widget" @click.stop="hideCall">
      ✕
    </button>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

export default {
  name: 'IncomingCallWidget',
  emits: ['call-answered', 'call-declined', 'call-reminder-set', 'call-messaged', 'call-hidden'],

  props: {
    callData: {
      type: Object,
      default: () => ({
        name: 'Mom',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        phoneNumber: '+34 123 456 789',
        status: 'Incoming call...',
        duration: null
      })
    },
    visible: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const isVisible = ref(props.visible)
    const currentTime = ref('')
    const slideText = ref('Slide to Answer')
    const answerButton = ref(null)

    // Drag functionality for swipe-to-answer
    const isDragging = ref(false)
    const dragStartX = ref(0)
    const dragCurrentX = ref(0)
    const threshold = 100

    // Update time
    const updateTime = () => {
      const now = new Date()
      currentTime.value = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Timer interval
    let timeInterval = null

    onMounted(() => {
      updateTime()
      timeInterval = setInterval(updateTime, 1000)
    })

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval)
      }
    })

    // Handle call actions
    const handleRemindMe = () => {
      emit('call-reminder-set', props.callData)
      // Add haptic feedback if supported
      if (navigator.vibrate) {
        navigator.vibrate([100])
      }
    }

    const handleMessage = () => {
      emit('call-messaged', props.callData)
      if (navigator.vibrate) {
        navigator.vibrate([50])
      }
    }

    const handleDecline = () => {
      emit('call-declined', props.callData)
      hideCall()
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }
    }

    const hideCall = () => {
      isVisible.value = false
      emit('call-hidden', props.callData)
    }

    // Drag functionality for swipe-to-answer
    const startDrag = (e) => {
      isDragging.value = true
      const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
      dragStartX.value = clientX

      document.addEventListener('mousemove', handleDrag)
      document.addEventListener('mouseup', endDrag)
      document.addEventListener('touchmove', handleDrag)
      document.addEventListener('touchend', endDrag)
    }

    const handleDrag = (e) => {
      if (!isDragging.value) return

      const clientX = e.type === 'mousemove' ? e.clientX : e.changedTouches[0].clientX
      const diff = clientX - dragStartX.value

      dragCurrentX.value = diff

      // Update slide text based on drag progress
      if (diff > threshold * 0.5) {
        slideText.value = 'Release to Answer'
      } else {
        slideText.value = 'Slide to Answer'
      }
    }

    const endDrag = () => {
      isDragging.value = false

      if (dragCurrentX.value > threshold) {
        // Answer the call
        emit('call-answered', props.callData)
        hideCall()
        if (navigator.vibrate) {
          navigator.vibrate([300])
        }
      }

      // Reset
      dragCurrentX.value = 0
      slideText.value = 'Slide to Answer'

      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', endDrag)
      document.removeEventListener('touchmove', handleDrag)
      document.removeEventListener('touchend', endDrag)
    }

    // Watch for visibility changes
    const watchVisibility = () => {
      if (props.visible !== isVisible.value) {
        isVisible.value = props.visible
      }
    }

    return {
      isVisible,
      currentTime,
      slideText,
      answerButton,
      handleRemindMe,
      handleMessage,
      handleDecline,
      hideCall,
      startDrag,
      handleDrag,
      endDrag,
      watchVisibility
    }
  }
}
</script>

<style scoped>
.incoming-call-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.3);
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.incoming-call-container.show {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  pointer-events: all;
}

.close-widget {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s ease;
}

.close-widget:hover {
  background: rgba(0, 0, 0, 0.9);
}

.phone-frame {
  width: 350px;
  height: 700px;
  background: #1a1a1a;
  border-radius: 35px;
  padding: 8px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 10px 30px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
}

.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 27px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.call-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    #6b46c1 0%,
    #5b21b6 30%,
    #4c1d95 70%,
    #3d1a78 100%
  );
  z-index: 0;
}

.status-bar {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.status-icons {
  display: flex;
  gap: 8px;
}

.caller-section {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px 20px 60px;
  color: white;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.caller-name {
  font-size: 33px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.5);
}

.call-status {
  font-size: 16px;
  opacity: 0.9;
  font-weight: 400;
}

.action-buttons {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  padding: 0 40px 40px;
  gap: 20px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.action-btn:active {
  transform: scale(0.95);
}

.btn-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remind-me-btn .btn-icon {
  background: rgba(255, 255, 255, 0.9);
  color: #6b46c1;
}

.message-btn .btn-icon {
  background: rgba(255, 255, 255, 0.9);
  color: #6b46c1;
}

.decline-btn .btn-icon {
  background: #ef4444;
  color: white;
}

.btn-icon svg {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

.btn-label {
  color: white;
  font-size: 12px;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.answer-section {
  position: relative;
  z-index: 1;
  padding: 0 25px 40px;
}

.answer-button {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 40px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  user-select: none;
  overflow: hidden;
  position: relative;
}

.answer-button:active {
  transform: scale(0.98);
}

.answer-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.answer-button:hover::before {
  transform: translateX(100%);
}

.answer-icon {
  width: 48px;
  height: 48px;
  background: #f97316;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.phone-icon {
  width: 20px;
  height: 20px;
}

.phone-icon svg {
  width: 100%;
  height: 100%;
  stroke: white;
  stroke-width: 2.5;
}

.slide-text {
  color: white;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Responsive design */
@media (max-width: 480px) {
  .phone-frame {
    width: 320px;
    height: 650px;
    margin: 20px;
  }

  .caller-name {
    font-size: 29px;
  }

  .profile-picture {
    width: 85px;
    height: 85px;
  }

  .btn-icon {
    width: 50px;
    height: 50px;
  }
}

/* Animation keyframes */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.call-status {
  animation-s-name: pulse;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

/* Screen entrance animation */
.incoming-call-container.show .phone-frame {
  animation: phoneSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes phoneSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
