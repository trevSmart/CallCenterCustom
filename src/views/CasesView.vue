<template>
  <div class="cases-view">
    <div class="header-section">
      <div class="header-left">
        <h1><font-awesome-icon icon="address-book" /> Cases</h1>
        <p>Gestiona els casos de client</p>
      </div>
      <div class="header-right">
        <button @click="showAddDialog" class="add-btn"><font-awesome-icon icon="plus" /> Afegir Cas</button>
        <router-link to="/dashboard" class="back-btn"><font-awesome-icon icon="arrow-left" /> Tornar al Dashboard</router-link>
      </div>
    </div>

    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-number">{{ bankingStore.cases.length }}</div>
        <div class="stat-label">Cases Totals</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ openCases.length }}</div>
        <div class="stat-label">Oberts</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ highPriorityCases.length }}</div>
        <div class="stat-label">Prioritat Alta</div>
      </div>
    </div>

    <div class="cases-table">
      <div v-for="case_ in bankingStore.cases" :key="case_.id" class="case-card">
        <div class="case-header">
          <div class="case-info">
            <h3>{{ case_.subject }}</h3>
            <div class="case-contact">{{ getContactName(case_.contactId) }}</div>
          </div>
          <div class="case-status">
            <div class="status-badge" :class="case_.status.toLowerCase()">{{ case_.status }}</div>
            <div class="priority-badge" :class="case_.priority.toLowerCase()">{{ case_.priority }}</div>
          </div>
        </div>

        <div class="case-description">{{ case_.description }}</div>

        <div class="case-actions">
          <button @click="viewCase(case_)" class="view-btn"><font-awesome-icon icon="eye" /> Veure</button>
          <button @click="resolveCase(case_)" class="resolve-btn"><font-awesome-icon icon="check" /> Resoldre</button>
        </div>

        <div class="case-meta">Creat: {{ formatDate(case_.createdAt) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBankingStore } from '../stores/banking.js'

export default {
  name: 'CasesView',
  setup() {
    const router = useRouter()
    const bankingStoreInstance = useBankingStore()

    const openCases = computed(() => bankingStoreInstance.cases.filter(c => c.status === 'Open'))
    const highPriorityCases = computed(() => bankingStoreInstance.cases.filter(c => c.priority === 'High'))

    const getContactName = (contactId) => {
      const contact = bankingStoreInstance.contacts.find(contact => contact.id === contactId)
      return contact ? `${contact.firstName} ${contact.lastName}` : 'Sense contacte'
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ca-ES')
    }

    const showAddDialog = () => {
      console.log('Show add case dialog')
    }

    const viewCase = (case_) => {
      router.push(`/cases/${case_.id}`)
    }

    const resolveCase = (case_) => {
      const resolution = prompt('Introdueix la resolució del cas:')
      if (resolution) {
        bankingStoreInstance.closeCase(case_.id, resolution)
      }
    }

    return {
      bankingStore: bankingStoreInstance,
      openCases,
      highPriorityCases,
      getContactName,
      formatDate,
      showAddDialog,
      viewCase,
      resolveCase
    }
  }
}
</script>

<style scoped>
.cases-view {
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
  grid-template-columns: repeat(3, 1fr);
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

.cases-table {
  display: grid;
  gap: 20px;
}

.case-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.case-info h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 18px;
}

.case-contact {
  color: #666;
  font-size: 14px;
}

.case-status {
  display: flex;
  gap: 10px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.open {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.in-progress {
  background: #fff3cd;
  color: #856404;
}

.status-badge.closed {
  background: #d4edda;
  color: #155724;
}

.priority-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.high {
  background: #f8d7da;
  color: #721c24;
}

.priority-badge.medium {
  background: #fff3cd;
  color: #856404;
}

.priority-badge.low {
  background: #d4edda;
  color: #155724;
}

.case-description {
  color: #495057;
  margin-bottom: 15px;
  line-height: 1.5;
}

.case-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.view-btn,
.resolve-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.view-btn {
  background: #17a2b8;
  color: white;
}

.resolve-btn {
  background: #28a745;
  color: white;
}

.case-meta {
  font-size: 12px;
  color: #6c757d;
  text-align: right;
}
</style>
