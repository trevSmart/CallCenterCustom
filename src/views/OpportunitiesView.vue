<template>
  <div class="opportunities-view">
    <div class="header-section">
      <div class="header-left">
        <h1><font-awesome-icon icon="dollar-sign" /> Opportunities</h1>
        <p>Gestiona les oportunitats de negoci</p>
      </div>
      <div class="header-right">
        <router-link to="/dashboard" class="back-btn"><font-awesome-icon icon="arrow-left" /> Tornar al Dashboard</router-link>
      </div>
    </div>

    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-number">{{ bankingStore.opportunities.length }}</div>
        <div class="stat-label">Oportunitats Totals</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ formatCurrency(totalPipeline) }}</div>
        <div class="stat-label">Pipeline Total</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ averageProbability }}%</div>
        <div class="stat-label">Mitjana Probabilitat</div>
      </div>
    </div>

    <div class="opportunities-table">
      <div v-for="opportunity in bankingStore.opportunities" :key="opportunity.id" class="opportunity-card" @click="viewOpportunity(opportunity)">
        <div class="opportunity-header">
          <div class="opportunity-info">
            <h3>{{ opportunity.name }}</h3>
            <div class="company">{{ getAccountName(opportunity.accountId) }}</div>
          </div>
          <div class="opportunity-meta">
            <div class="amount">{{ formatCurrency(opportunity.amount) }}</div>
            <div class="probability">{{ opportunity.probability }}%</div>
          </div>
        </div>

        <div class="opportunity-details">
          <div class="stage-badge" :class="opportunity.stage.toLowerCase().replace(' ', '-')">
            {{ opportunity.stage }}
          </div>
          <div class="close-date">Data tancament: {{ formatDate(opportunity.closeDate) }}</div>
        </div>

        <div class="opportunity-contact">
          <span v-if="getContactName(opportunity.contactId)">
            Contacte: {{ getContactName(opportunity.contactId) }}
          </span>
          <span v-else class="no-contact">Sense contacte assignat</span>
        </div>

        <div class="opportunity-created">Creat: {{ formatDate(opportunity.createdAt) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBankingStore } from '../stores/banking.js'

export default {
  name: 'OpportunitiesView',
  setup() {
    const router = useRouter()
    const bankingStoreInstance = useBankingStore()

    const totalPipeline = computed(() => {
      return bankingStoreInstance.opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0)
    })

    const averageProbability = computed(() => {
      const opportunities = bankingStoreInstance.opportunities
      const total = opportunities.reduce((sum, opp) => sum + (opp.probability || 0), 0)
      return opportunities.length > 0 ? Math.round(total / opportunities.length) : 0
    })

    const getAccountName = (accountId) => {
      const account = bankingStoreInstance.accounts.find(acc => acc.id === accountId)
      return account ? account.name : 'Sense Account'
    }

    const getContactName = (contactId) => {
      const contact = bankingStoreInstance.contacts.find(contact => contact.id === contactId)
      return contact ? `${contact.firstName} ${contact.lastName}` : null
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ca-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ca-ES')
    }

    const viewOpportunity = (opportunity) => {
      router.push(`/opportunities/${opportunity.id}`)
    }

    return {
      bankingStore: bankingStoreInstance,
      totalPipeline,
      averageProbability,
      getAccountName,
      getContactName,
      formatCurrency,
      formatDate,
      viewOpportunity
    }
  }
}
</script>

<style scoped>
.opportunities-view {
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

.opportunities-table {
  display: grid;
  gap: 20px;
}

.opportunity-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.opportunity-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.opportunity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.opportunity-info h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 20px;
}

.company {
  color: #666;
  font-size: 14px;
}

.opportunity-meta {
  text-align: right;
}

.amount {
  font-size: 20px;
  font-weight: 700;
  color: #28a745;
  margin-bottom: 5px;
}

.probability {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.opportunity-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.stage-badge {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.stage-badge.prospecting {
  background: #d1ecf1;
  color: #0c5460;
}

.stage-badge.proposal {
  background: #fff3cd;
  color: #856404;
}

.stage-badge.negotiation {
  background: #d4edda;
  color: #155724;
}

.close-date {
  color: #666;
  font-size: 14px;
}

.opportunity-contact {
  margin-bottom: 15px;
  font-size: 14px;
  color: #495057;
}

.no-contact {
  color: #999;
  font-style: italic;
}

.opportunity-created {
  font-size: 12px;
  color: #6c757d;
  text-align: right;
}
</style>
