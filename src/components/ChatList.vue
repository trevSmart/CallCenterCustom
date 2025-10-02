<template>
  <div class="chat-list">
    <!-- Header Section -->
    <div class="chat-header">
      <h1 class="chat-title">NinjaChat</h1>
      <p class="chat-subtitle">Be present when users are checking out your business</p>

      <div class="agent-section">
        <button class="agent-btn">Michael</button>
        <button class="add-department-btn"><font-awesome-icon icon="plus" /> Add Department</button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="chat-tabs">
      <button class="tab-nav">Agents</button>
      <button class="tab-nav active">Chats</button>
      <button class="tab-nav">Contacts</button>
      <button class="tab-nav">Dashboard</button>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search conversations..."
          class="search-input"
        />
        <button class="search-btn"><font-awesome-icon icon="search" /></button>
      </div>
    </div>

    <!-- Chat Table -->
    <div class="chat-table-container">
      <table class="chat-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>MESSAGE</th>
            <th>NO.OF.LINES</th>
            <th>TRANSCRIPT</th>
            <th>CREATED ON</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="chat in filteredChats"
            :key="chat.id"
            class="chat-row"
            @click="openChat(chat)"
          >
            <td>
              <div class="customer-info">
                <div class="avatar">{{ chat.customer.name.charAt(0) }}</div>
                <span>{{ chat.customer.name }}</span>
              </div>
            </td>
            <td>{{ chat.customer.email }}</td>
            <td>
              <p class="message-preview">{{ chat.lastMessage }}</p>
            </td>
            <td>{{ chat.messageCount }}</td>
            <td>
              <button class="transcript-btn"><font-awesome-icon icon="eye" /></button>
            </td>
            <td>
              <span class="created-time">{{ formatTime(chat.createdAt) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'

export default {
  name: 'ChatList',
  emits: ['openChat', 'viewTranscript'],
  setup(props, { emit }) {
    const searchQuery = ref('')

    // Sample chat data
    const chats = reactive([
      {
        id: 1,
        customer: {
          name: 'Janet Howard',
          email: 'janet@example.com',
          avatar: 'J'
        },
        lastMessage: 'Send them to me here',
        messageCount: 2,
        createdAt: new Date(Date.now() - 9 * 60 * 1000),
        status: 'active'
      },
      {
        id: 2,
        customer: {
          name: 'Anthony Little',
          email: 'anthony@example.com',
          avatar: 'A'
        },
        lastMessage: 'Hello, how are you?',
        messageCount: 5,
        createdAt: new Date(Date.now() - 6 * 60 * 1000),
        status: 'active'
      },
      {
        id: 3,
        customer: {
          name: 'Sarah Graham',
          email: 'sarah@example.com',
          avatar: 'S'
        },
        lastMessage: 'I need help with my account',
        messageCount: 6,
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
        status: 'active'
      },
      {
        id: 4,
        customer: {
          name: 'Robert Smith',
          email: 'robert@example.com',
          avatar: 'R'
        },
        lastMessage: 'Thank you for your assistance',
        messageCount: 8,
        createdAt: new Date(Date.now() - 25 * 60 * 1000),
        status: 'closed'
      },
      {
        id: 5,
        customer: {
          name: 'Emily Jones',
          email: 'emily@example.com',
          avatar: 'E'
        },
        lastMessage: 'Can you help me place an order?',
        messageCount: 9,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        status: 'active'
      }
    ])

    const filteredChats = computed(() => {
      if (!searchQuery.value) return chats
      return chats.filter(chat =>
        chat.customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        chat.customer.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const openChat = (chat) => {
      emit('openChat', chat)
    }

    const formatTime = (date) => {
      const diff = Date.now() - date.getTime()
      const minutes = Math.floor(diff / (1000 * 60))

      if (minutes < 60) {
        return `Created ${minutes} minutes ago`
      } else {
        const hours = Math.floor(minutes / 60)
        return `Created ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
      }
    }

    return {
      searchQuery,
      chats,
      filteredChats,
      openChat,
      formatTime
    }
  }
}
</script>

<style scoped>
.chat-list {
  flex: 1;
  background: #ffffff;
  padding: 0;
  overflow-y: auto;
}

.chat-header {
  padding: 32px 32px 24px;
  background: white;
}

.chat-title {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1;
}

.chat-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.agent-section {
  display: flex;
  gap: 16px;
  align-items: center;
}

.agent-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.agent-btn:hover {
  background: #2563eb;
}

.add-department-btn {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-department-btn:hover {
  border-color: #9ca3af;
  color: #374151;
}

.chat-tabs {
  display: flex;
  padding: 0 32px;
  border-bottom: 2px solid #e5e7eb;
}

.tab-nav {
  background: none;
  border: none;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
}

.tab-nav:hover {
  color: #374151;
}

.tab-nav.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.search-section {
  padding: 24px 32px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  max-width: 400px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-btn {
  padding: 12px 16px;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
}

.chat-table-container {
  padding: 0 32px;
  overflow-x: auto;
}

.chat-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.chat-table thead th {
  text-align: left;
  padding: 16px 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.chat-table tbody tr {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.chat-table tbody tr:hover {
  background: #f9fafb;
}

.chat-table tbody td {
  padding: 16px 12px;
  border-bottom: 1px solid #f3f4f6;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6366f1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.message-preview {
  color: #374151;
  font-size: 14px;
  margin: 0;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transcript-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

.transcript-btn:hover {
  color: #374151;
}

.created-time {
  color: #6b7280;
  font-size: 13px;
}
</style>
