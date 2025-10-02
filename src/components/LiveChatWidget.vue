<template>
  <div
    class="live-chat-widget"
    v-if="selectedChat"
    ref="elementRef"
    :style="{
      position: 'fixed',
      left: position.x + 'px',
      top: position.y + 'px',
      right: 'auto',
      bottom: 'auto'
    }"
  >
    <div class="widget-header"
       @mousedown="startDrag"
       @touchstart="startDrag"
       @click.stop>
      <div class="drag-indicator">
        <font-awesome-icon icon="grip-vertical" />
      </div>
      <h3 class="widget-title"><font-awesome-icon icon="comments" /> Live Chat</h3>
      <div class="widget-controls" @click.stop @mousedown.stop @touchstart.stop>
        <button class="control-btn" @click.stop><font-awesome-icon icon="phone" /></button>
        <button class="control-btn close-btn" @click.stop="closeWidget"><font-awesome-icon icon="xmark" /></button>
        <button class="control-btn" @click.stop><font-awesome-icon icon="ellipsis-vertical" /></button>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages">
      <div
        v-for="message in selectedChat.messages"
        :key="message.id"
        class="message-container"
        :class="{ 'customer': message.from === 'customer', 'agent': message.from === 'agent' }"
      >
        <div class="message-avatar">
          <img
            v-if="message.from === 'agent'"
            :src="'/images/agent-default.jpg'"
            :alt="'Agent'"
            class="agent-avatar-img"
            @error="setFallbackAvatar"
          />
          <!-- Customer avatar with fallback -->
          <img
            v-if="message.from === 'customer'"
            :src="getCustomerAvatar(selectedChat.customer)"
            :alt="selectedChat.customer.name"
            class="customer-avatar-img"
            @error="setCustomerFallbackAvatar"
          />
          <div class="customer-fallback" v-if="message.from === 'customer'" style="display: none;">{{ selectedChat.customer.name.charAt(0) }}</div>
          <!-- Fallback for agent -->
          <div class="agent-fallback" v-if="message.from === 'agent'" style="display: none;">A</div>
        </div>
        <div class="message-content">
          <div class="message-bubble" :class="{ 'customer': message.from === 'customer', 'agent': message.from === 'agent' }">
            {{ message.text }}
          </div>
          <div class="message-button" v-if="message.button">
            {{ message.button }}
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="message-input-container">
      <button class="input-btn" @click.stop><font-awesome-icon icon="paperclip" /></button>
      <input
        v-model="newMessage"
        type="text"
        placeholder="Enter Message"
        class="message-input"
        @keypress.enter="sendMessage"
        @mousedown.stop
        @touchstart.stop
      />
      <button class="input-btn" @click.stop><font-awesome-icon icon="smile" /></button>
      <button class="send-btn" @click="sendMessage"><font-awesome-icon icon="paper-plane" /></button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useDraggableWidget } from '../composables/useDraggable.js'

export default {
  name: 'LiveChatWidget',
  props: {
    selectedChat: {
      type: Object,
      default: null
    }
  },
  emits: ['sendMessage', 'closeWidget'],
  setup(props, { emit }) {
    const newMessage = ref('')
    const { position, elementRef, startDrag } = useDraggableWidget('live-chat-widget', { x: window.innerWidth - 390, y: window.innerHeight - 540 })

    // Sample message data structure for the demo
    const formattedSelectedChat = computed(() => {
      if (!props.selectedChat) return null

      // Generate sample messages based on the selected chat
      const messages = [
        {
          id: 1,
          from: 'customer',
          text: props.selectedChat.lastMessage,
          timestamp: props.selectedChat.createdAt
        },
        {
          id: 2,
          from: 'agent',
          text: 'Thanks! Show this message to get 10% off your lunch this week. Reply STOP to output.',
          timestamp: new Date(),
          button: 'Deliver order by 12:30 pm'
        }
      ]

      return {
        ...props.selectedChat,
        messages
      }
    })

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        emit('sendMessage', {
          chatId: props.selectedChat.id,
          message: newMessage.value.trim(),
          timestamp: new Date()
        })
        newMessage.value = ''
      }
    }

    const closeWidget = () => {
      emit('closeWidget')
    }

    const setFallbackAvatar = (event) => {
      const img = event.target
      const fallback = img.parentElement.querySelector('.agent-fallback')
      img.style.display = 'none'
      if (fallback) {
        fallback.style.display = 'flex'
      }
    }

    // Customer avatar methods
    const customerAvatars = {
      'Emma Thompson': '/images/customer-emma.jpg',
      'James Wilson': '/images/customer-james.jpg',
      'Sophia Rodriguez': '/images/customer-sophia.jpg',
      'Michael Brown': '/images/customer-michael.jpg',
      'Emily Davis': '/images/customer-emily.jpg'
    }

    const getCustomerAvatar = (customer) => {
      return customerAvatars[customer.name] || '/images/customer-default.jpg'
    }

    const setCustomerFallbackAvatar = (event) => {
      const img = event.target
      const fallback = img.parentElement.querySelector('.customer-fallback')
      img.style.display = 'none'
      if (fallback) {
        fallback.style.display = 'flex'
      }
    }

    return {
      newMessage,
      formattedSelectedChat,
      sendMessage,
      closeWidget,
      position,
      elementRef,
      startDrag,
      setFallbackAvatar,
      getCustomerAvatar,
      setCustomerFallbackAvatar
    }
  }
}
</script>

<style scoped>
.live-chat-widget {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
  transition: box-shadow 0.2s ease;
  cursor: default;
}

.live-chat-widget.dragging {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  cursor: grabbing;
  transform: rotate(1deg);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px 8px 12px;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #0e7490, #22d3ee);
  color: white;
  border-radius: 8px 8px 0 0;
  cursor: move;
  user-select: none;
  flex-shrink: 0;
  min-height: 40px;
}

.drag-indicator {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-right: 8px;
}

.widget-header:hover .drag-indicator {
  color: rgba(255, 255, 255, 0.9);
}

.widget-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin: 0;
  flex: 1;
}

.widget-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.control-btn.close-btn:hover {
  background: rgba(239, 68, 68, 0.3);
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-container {
  display: flex;
  gap: 8px;
}

.message-container.customer {
  flex-direction: row;
}

.message-container.agent {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: white;
}

.message-container.customer .avatar-circle {
  background: #6366f1;
}

.message-container.agent .avatar-circle {
  background: #3b82f6;
}

.agent-avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: scale;
}

.agent-fallback {
  width: 32px;
  height: 32px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: white;
  position: absolute;
  top: 0;
  left: 0;
}

.customer-avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.customer-fallback {
  width: 32px;
  height: 32px;
  background: #6366f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: white;
  position: absolute;
  top: 0;
  left: 0;
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  max-width: 240px;
}

.message-container.customer .message-bubble {
  background: #3b82f6;
  color: white;
  border-bottom-left-radius: 4px;
}

.message-container.agent .message-bubble {
  background: #f3f4f6;
  color: #1f2937;
  border-bottom-right-radius: 4px;
}

.message-button {
  background: #f97316;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  align-self: flex-start;
}

.message-button:hover {
  background: #ea580c;
}

.message-input-container {
  display: flex;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  gap: 8px;
}

.input-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  color: #9ca3af;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.input-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.message-input {
 flex: 1;
 padding: 10px 12px;
 border: 1px solid #d1d5db;
 border-radius: 8px;
 font-size: 14px;
 outline: none;
 transition: border-color 0.2s ease;
}

.message-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.send-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.send-btn:hover {
  background: #2563eb;
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
