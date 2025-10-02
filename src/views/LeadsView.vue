<template>
  <div class="leads-view">
    <div class="header-section">
      <div class="header-left">
        <h1><font-awesome-icon icon="bullseye" /> Leads</h1>
        <p>Gestiona els possibles clients</p>
      </div>
      <div class="header-right">
        <router-link to="/dashboard" class="back-btn"><font-awesome-icon icon="arrow-left" /> Tornar al Dashboard</router-link>
      </div>
    </div>

    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-number">{{ bankingStore.leads.length }}</div>
        <div class="stat-label">Leads Totals</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ newLeads.length }}</div>
        <div class="stat-label">Nous Leads</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ contactedLeads.length }}</div>
        <div class="stat-label">Contactats</div>
      </div>
    </div>

    <div class="leads-grid">
      <div v-for="lead in bankingStore.leads" :key="lead.id" class="lead-card">
        <div class="lead-header">
          <div class="lead-name">
            {{ lead.firstName }} {{ lead.lastName }}
            <div class="lead-company">{{ lead.company }}</div>
          </div>
          <div class="lead-actions">
            <button @click="callLead(lead)" class="call-btn"><font-awesome-icon icon="phone" /> Trucar</button>
            <button @click="convertToOpportunity(lead)" class="convert-btn"><font-awesome-icon icon="dollar-sign" /> Convertir</button>
          </div>
        </div>

        <div class="lead-badges">
          <div class="status-badge" :class="lead.status.toLowerCase()">{{ lead.status }}</div>
          <div class="source-badge">{{ lead.source }}</div>
        </div>

        <div class="lead-info">
          <div class="lead-item"><font-awesome-icon icon="envelope" /> {{ lead.email }}</div>
          <div class="lead-item"><font-awesome-icon icon="phone" /> {{ lead.phone }}</div>
          <div class="lead-item"><font-awesome-icon icon="dollar-sign" /> {{ formatCurrency(lead.estimatedValue) }}</div>
        </div>

        <div class="lead-meta">Creat: {{ formatDate(lead.createdAt) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBankingStore } from '../stores/banking.js'

export default {
  name: 'LeadsView',
  setup() {
    const router = useRouter()
    const bankingStoreInstance = useBankingStore()

    const newLeads = computed(() => bankingStoreInstance.leads.filter(lead => lead.status === 'New'))
    const contactedLeads = computed(() => bankingStoreInstance.leads.filter(lead => lead.status === 'Contacted'))

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ca-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ca-ES')
    }

    const callLead = (lead) => {
      router.push({
        name: 'Dashboard',
        query: { phone: lead.phone, name: `${lead.firstName} ${lead.lastName}`, company: lead.company }
      })
    }

    const convertToOpportunity = (lead) => {
      const opportunityData = {
        name: `Oportunitat ${lead.company}`,
        amount: lead.estimatedValue,
        stage: 'Prospecting',
        probability: 25
      }

      bankingStoreInstance.convertLeadToOpportunity(lead.id, opportunityData)
      router.push({ name: 'Opportunities' })
    }

    return {
      bankingStore: bankingStoreInstance,
      newLeads,
      contactedLeads,
      formatCurrency,
      formatDate,
      callLead,
      convertToOpportunity
    }
  }
}
</script>

<style scoped>
.leads-view {
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

.back-btn {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;
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

.leads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.lead-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.lead-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.lead-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.lead-company {
  font-size: 14px;
  color: #666;
  margin-top: 3px;
}

.lead-actions {
  display: flex;
  gap: 8px;
}

.call-btn,
.convert-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.call-btn {
  background: #28a745;
  color: white;
}

.convert-btn {
  background: #ffc107;
  color: #212529;
}

.lead-badges {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.status-badge,
.source-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge {
  background: #e9ecef;
  color: #495057;
}

.status-badge.new {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.contacted {
  background: #fff3cd;
  color: #856404;
}

.source-badge {
  background: #d4edda;
  color: #155724;
}

.lead-info {
  margin-bottom: 15px;
}

.lead-item {
  margin-bottom: 8px;
  font-size: 14px;
  color: #495057;
}

.lead-meta {
  font-size: 12px;
  color: #6c757d;
  text-align: right;
}
</style>
