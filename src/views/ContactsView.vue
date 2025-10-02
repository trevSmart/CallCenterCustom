<template>
  <div class="contacts-view">
    <div class="header-section">
      <div class="header-left">
        <h1><font-awesome-icon icon="users" /> Contacts</h1>
        <p>Gestiona els contactes bancari</p>
      </div>
      <div class="header-right">
        <button @click="showAddForm = true" class="add-btn"><font-awesome-icon icon="plus" /> Afegir Contacte</button>
        <router-link to="/dashboard" class="back-btn"><font-awesome-icon icon="arrow-left" /> Tornar al Dashboard</router-link>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-number">{{ bankingStore.contacts.length }}</div>
        <div class="stat-label">Contacts Totals</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ contactsWithAccounts.length }}</div>
        <div class="stat-label">Amb Account</div>
      </div>
    </div>

    <!-- Contacts List -->
    <div class="contacts-grid">
      <div v-for="contact in bankingStore.contacts" :key="contact.id" class="contact-card">
        <div class="contact-header">
          <div class="contact-name">
            {{ contact.firstName }} {{ contact.lastName }}
            <div class="contact-position">{{ contact.position }}</div>
          </div>
          <div class="contact-actions">
            <button @click="callContact(contact)" class="call-btn"><font-awesome-icon icon="phone" /> Trucar</button>
            <button @click="editContact(contact)" class="edit-btn"><font-awesome-icon icon="edit" /> Editar</button>
          </div>
        </div>

        <div class="contact-badge">{{ getAccountName(contact.accountId) }}</div>

        <div class="contact-info">
          <div class="contact-item"><font-awesome-icon icon="envelope" /> {{ contact.email }}</div>
          <div class="contact-item"><font-awesome-icon icon="phone" /> {{ contact.phone }}</div>
        </div>

        <div class="contact-meta">Creat: {{ formatDate(contact.createdAt) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBankingStore } from '../stores/banking.js'

export default {
  name: 'ContactsView',
  setup() {
    const router = useRouter()
    const bankingStoreInstance = useBankingStore()

    const showAddForm = ref(false)

    const contactsWithAccounts = computed(() => {
      return bankingStoreInstance.contacts.filter(contact => contact.accountId)
    })

    const getAccountName = (accountId) => {
      const account = bankingStoreInstance.accounts.find(acc => acc.id === accountId)
      return account ? account.name : 'Sense Account'
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ca-ES')
    }

    const callContact = (contact) => {
      router.push({
        name: 'Dashboard',
        query: { phone: contact.phone, name: `${contact.firstName} ${contact.lastName}` }
      })
    }

    const editContact = (contact) => {
      console.log('Edit contact:', contact)
    }

    return {
      bankingStore: bankingStoreInstance,
      showAddForm,
      contactsWithAccounts,
      getAccountName,
      formatDate,
      callContact,
      editContact
    }
  }
}
</script>

<style scoped>
.contacts-view {
  padding: 25px;
  background: #f5f7fa;
  min-height: 100vh;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  background: white;
  padding: 25px;
  border-radius: 15px;
}

.header-left h1 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.header-left p {
  margin: 0;
  color: #666;
}

.header-right {
  display: flex;
  gap: 15px;
}

.add-btn,
.back-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;
}

.add-btn {
  background: #28a745;
  color: white;
}

.back-btn {
  background: #6c757d;
  color: white;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-item {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.stat-number {
  font-size: 2em;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.contact-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.contact-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.contact-position {
  font-size: 14px;
  color: #666;
  margin-top: 3px;
}

.contact-actions {
  display: flex;
  gap: 8px;
}

.call-btn,
.edit-btn {
  padding: 6px 10px;
  border: circular 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.call-btn {
  background: #28a745;
  color: white;
  border: none;
}

.edit-btn {
  background: #ffc107;
  color: #212529;
  border: none;
}

.contact-badge {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: inline-block;
  margin-bottom: 15px;
}

.contact-info {
  margin-bottom: 15px;
}

.contact-item {
  margin-bottom: 8px;
  font-size: 14px;
  color: #495057;
}

.contact-meta {
  font-size: 12px;
  color: #6c757d;
  text-align: right;
}
</style>
