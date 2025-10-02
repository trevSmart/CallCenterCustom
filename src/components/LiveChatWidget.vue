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
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <div class="chat-widget-header draggable-header">
      <h3 class="widget-title">Live Chat</h3>
      <div class="widget-controls">
        <button class="control-btn"><font-awesome-icon icon="phone" /></button>
        <button class="control-btn"><font-awesome-icon icon="ellipsis-vertical" /></button>
      </div>
      <div class="drag-handle">
        <font-awesome-icon icon="grip-vertical" class="drag-icon" />
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
          <div class="avatar-circle">{{ message.from === 'customer' ? selectedChat.customer.name.charAt(0) : 'A' }}</div>
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
      <button class="input-btn"><font-awesome-icon icon="paperclip" /></button>
      <input
        v-model="newMessage"
        type="text"
        placeholder="Enter Message"
        class="message-input"
        @keypress.enter="sendMessage"
      />
      <button class="input-btn"><font-awesome-icon icon="smile" /></button>
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
  emits: ['sendMessage'],
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

    return {
      newMessage,
      formattedSelectedChat,
      sendMessage,
      position,
      elementRef,
      startDrag
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
  z-index: 100;
  transition: box-shadow 0.2s ease;
  cursor: default;
}

.live-chat-widget.dragging {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  cursor: grabbing;
  transform: rotate(1deg);
}

.chat-widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.draggable-header {
  position: relative;
  cursor: grab;
}

.draggable-header:active {
  cursor: grabbing;
}

.drag-handle {
  position: absolute;
  left: 50%;
  top: 8px;
  transform: translateX(-50%);
  color: #9ca3af;
  font-size: 12px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.draggable-header:hover .drag-handle {
  opacity: 1;
}

.drag-icon {
  pointer-events: none;
}

.widget-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.widget-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #f3f4f6;
  color: #374151;
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
  background: #10b981;
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
