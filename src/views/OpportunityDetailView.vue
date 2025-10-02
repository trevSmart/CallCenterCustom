<template>
  <div class="opportunity-detail-view">
    <div class="header-section">
      <div class="header-left">
        <button @click="goBack" class="back-btn">
          <font-awesome-icon icon="arrow-left" /> Tornar
        </button>
        <div class="opportunity-title">
          <font-awesome-icon icon="dollar-sign" />
          <h1>{{ opportunity.name || 'Càrregant l\'oportunitat...' }}</h1>
        </div>
      </div>
      <div class="header-right">
        <button @click="editMode = !editMode" class="edit-btn">
          <font-awesome-icon icon="edit" /> {{ editMode ? 'Cancel·lar' : 'Editar' }}
        </button>
        <router-link to="/opportunities" class="opportunities-btn">
          <font-awesome-icon icon="dollar-sign" /> Totes les Oportunitats
        </router-link>
      </div>
    </div>

    <!-- Opportunity Info Cards -->
    <div v-if="opportunity.id" class="content-section">
      <div class="grid-section">
        <!-- Main Info Card -->
        <div class="info-card">
          <h3>Informació General</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Nom:</label>
              <span v-if="!editMode">{{ opportunity.name }}</span>
              <input v-else v-model="editOpportunity.name" class="form-input" />
            </div>
            <div class="info-item">
              <label>Quantitat:</label>
              <span v-if="!editMode">{{ formatCurrency(opportunity.amount) }}</span>
              <input v-else v-model.number="editOpportunity.amount" type="number" class="form-input" />
            </div>
            <div class="info-item">
              <label>Etapa:</label>
              <span v-if="!editMode" class="stage-badge" :class="opportunity.stage.toLowerCase().replace(' ', '-')">{{ opportunity.stage }}</span>
              <select v-else v-model="editOpportunity.stage" class="form-select">
                <option value="Prospecting">Prospecting</option>
                <option value="Qualification">Qualification</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>
            <div class="info-item">
              <label>Probabilitat:</label>
              <span v-if="!editMode">{{ opportunity.probability }}%</span>
              <input v-else v-model.number="editOpportunity.probability" type="number" min="0" max="100" class="form-input" />
            </div>
            <div class="info-item">
              <label>Data de tancament esperada:</label>
              <span v-if="!editMode">{{ formatDate(opportunity.closeDate) }}</span>
              <input v-else v-model="editOpportunity.closeDate" type="date" class="form-input" />
            </div>
            <div class="info-item">
              <label>Font:</label>
              <span v-if="!editMode">{{ opportunity.leadSource || 'No especificat' }}</span>
              <input v-else v-model="editOpportunity.leadSource" class="form-input" />
            </div>
            <div class="info-item full-width">
              <label>Descripció:</label>
              <span v-if="!editMode">{{ opportunity.description || 'Sense descripció' }}</span>
              <textarea v-else v-model="editOpportunity.description" class="form-textarea" rows="4"></textarea>
            </div>
          </div>
          <div v-if="editMode" class="form-actions">
            <button @click="cancelEdit" class="cancel-btn">Cancel·lar</button>
            <button @click="saveOpportunity" class="save-btn">Desar Canvis</button>
          </div>
        </div>

        <!-- Financial Summary Card -->
        <div class="stats-card">
          <h3>Resum Financer</h3>
          <div class="stat-items">
            <div class="stat-item">
              <div class="stat-number">{{ formatCurrency(opportunity.amount) }}</div>
              <div class="stat-label">Valor Total</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ formatCurrency(opportunity.amount * (opportunity.probability / 100)) }}</div>
              <div class="stat-label">Valor Esperat</div>
            </div>
            <div class="stat-item">
              <div class="progress-bar-container">
                <div class="progress-label">{{ opportunity.probability }}%</div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: opportunity.probability + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Dies fins tancament:</div>
              <div class="stat-text">{{ daysUntilClose }}</div>
            </div>
          </div>

          <!-- Related Opportunities Comparison -->
          <div v-if="relatedOpportunities.length > 1" class="comparison-section">
            <h4>Comparació amb altres oportunitats</h4>
            <div class="comparison-grid">
              <div class="comparison-item">
                <span class="comparison-label">Ranking per valor:</span>
                <span class="comparison-value">#{{ valueRanking }}</span>
              </div>
              <div class="comparison-item">
                <span class="comparison-label">Mitjana del stage:</span>
                <span class="comparison-value">{{ averageProbability }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Information Cards -->
      <div class="related-section">
        <!-- Account Info -->
        <div class="related-card">
          <div class="card-header">
            <h3><font-awesome-icon icon="building" /> Account Relacionat</h3>
          </div>
          <div v-if="relatedAccount.id" class="account-info">
            <div class="account-details">
              <div class="account-name">{{ relatedAccount.name }}</div>
              <div class="account-industry">{{ relatedAccount.industry }}</div>
              <div class="account-contact">{{ relatedAccount.email }} • {{ relatedAccount.phone }}</div>
            </div>
            <router-link :to="`/accounts/${relatedAccount.id}`" class="view-link">
              <font-awesome-icon icon="eye" /> Veure Account
            </router-link>
          </div>
          <div v-else class="empty-state">
            <p>No hi ha account relacionat amb aquesta oportunitat</p>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="related-card">
          <div class="card-header">
            <h3><font-awesome-icon icon="users" /> Contacte Relacionat</h3>
          </div>
          <div v-if="relatedContact.id" class="contact-info">
            <div class="contact-details">
              <div class="contact-name">{{ relatedContact.firstName }} {{ relatedContact.lastName }}</div>
              <div class="contact-role">{{ relatedContact.title || 'Sense posició' }}</div>
              <div class="contact-contact">{{ relatedContact.email }} • {{ relatedContact.phone }}</div>
            </div>
            <router-link :to="`/contacts/${relatedContact.id}`" class="view-link">
              <font-awesome-icon icon="eye" /> Veure Contacte
            </router-link>
          </div>
          <div v-else class="empty-state">
            <p>No hi ha contacte relacionat amb aquesta oportunitat</p>
          </div>
        </div>

        <!-- Sales Activity Timeline -->
        <div class="timeline-section">
          <div class="timeline-card">
            <h3><font-awesome-icon icon="chart-line" /> Historial de Vendes</h3>
            <div v-if="salesActivity.length > 0" class="timeline">
              <div v-for="activity in salesActivity" :key="activity.id" class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <span class="activity-type">{{ activity.type }}</span>
                    <span class="activity-date">{{ formatDate(activity.date) }}</span>
                  </div>
                  <div class="activity-description">{{ activity.description }}</div>
                  <div v-if="activity.amount" class="activity-amount">{{ formatCurrency(activity.amount) }}</div>
                  <div v-if="activity.user" class="activity-user">per {{ activity.user }}</div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>No hi ha activitat de vendes registrada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBankingStore } from '../stores/banking.js'

export default {
  name: 'OpportunityDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const bankingStore = useBankingStore()

    const opportunity = ref({})
    const editMode = ref(false)
    const editOpportunity = reactive({
      name: '',
      amount: 0,
      stage: '',
      probability: 0,
      closeDate: '',
      leadSource: '',
      description: ''
    })

    // Computed properties
    const relatedAccount = computed(() => {
      return bankingStore.accounts.find(acc => acc.id === opportunity.value.accountId) || {}
    })

    const relatedContact = computed(() => {
      return bankingStore.contacts.find(contact => contact.id === opportunity.value.contactId) || {}
    })

    const relatedOpportunities = computed(() => {
      return bankingStore.opportunities.filter(opp => opp.accountId === opportunity.value.accountId)
    })

    const daysUntilClose = computed(() => {
      if (!opportunity.value.closeDate) return 'No especificat'
      const today = new Date()
      const closeDate = new Date(opportunity.value.closeDate)
      const diffTime = closeDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return `Fa ${Math.abs(diffDays)} dies`
      if (diffDays === 0) return 'Avui'
      return diffDays.toString()
    })

    const valueRanking = computed(() => {
      return relatedOpportunities.value
        .sort((a, b) => b.amount - a.amount)
        .findIndex(opp => opp.id === opportunity.value.id) + 1
    })

    const averageProbability = computed(() => {
      if (relatedOpportunities.value.length === 0) return 0
      const total = relatedOpportunities.value.reduce((sum, opp) => sum + opp.probability, 0)
      return Math.round(total / relatedOpportunities.value.length)
    })

    const salesActivity = computed(() => {
      // Mock sales activity data
      return [
        {
          id: 1,
          type: 'Creació',
          description: 'Oportunitat creada',
          date: opportunity.value.createdDate,
          amount: null,
          user: 'Sistema'
        },
        {
          id: 2,
          type: 'Qualificada',
          description: 'Oportunitat qualificada i passa a fase de proposta',
          name: opportunity.value.name,
          date: opportunity.value.createdDate,
          amount: opportunity.value.amount,
          user: 'Agent'
        }
      ]
    })

    // Methods
    const loadOpportunity = () => {
      const opportunityId = parseInt(route.params.id)
      const foundOpportunity = bankingStore.opportunities.find(opp => opp.id === opportunityId)

      if (foundOpportunity) {
        opportunity.value = foundOpportunity
        editOpportunity.name = foundOpportunity.name
        editOpportunity.amount = foundOpportunity.amount
        editOpportunity.stage = foundOpportunity.stage
        editOpportunity.probability = foundOpportunity.probability
        editOpportunity.closeDate = foundOpportunity.closeDate
        editOpportunity.leadSource = foundOpportunity.leadSource || ''
        editOpportunity.description = foundOpportunity.description || ''
      } else {
        // Opportunity not found, redirect back
        router.push('/opportunities')
      }
    }

    const saveOpportunity = () => {
      const updatedOpportunity = {
        ...opportunity.value,
        ...editOpportunity
      }

      bankingStore.updateOpportunity(updatedOpportunity)
      opportunity.value = updatedOpportunity
      editMode.value = false
    }

    const cancelEdit = () => {
      editOpportunity.name = opportunity.value.name
      editOpportunity.amount = opportunity.value.amount
      editOpportunity.stage = opportunity.value.stage
      editOpportunity.probability = opportunity.value.probability
      editOpportunity.closeDate = opportunity.value.closeDate
      editOpportunity.leadSource = opportunity.value.leadSource || ''
      editOpportunity.description = opportunity.value.description || ''
      editMode.value = false
    }

    const goBack = () => {
      router.go(-1)
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

    onMounted(() => {
      loadOpportunity()
    })

    return {
      opportunity,
      editMode,
      editOpportunity,
      relatedAccount,
      relatedContact,
      relatedOpportunities,
      daysUntilClose,
      valueRanking,
      averageProbability,
      salesActivity,
      saveOpportunity,
      cancelEdit,
      goBack,
      formatCurrency,
      formatDate
    }
  }
}
</script>

<style scoped>
.opportunity-detail-view {
  padding: 32px 40px;
  min-height: 100vh;
  background-color: #f8fafc;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #e5e7eb;
}

.opportunity-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.opportunity-title h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

    .edit-btn, .opportunities-btn {
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }

    .edit-btn {
      background: #3b82f6;
      color: white;
    }

    .edit-btn:hover {
      background: #2563eb;
    }

    .opportunities-btn {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .opportunities-btn:hover {
      background: #e5e7eb;
    }

    .content-section {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .grid-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .info-card, .stats-card, .timeline-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }

    .info-card h3, .stats-card h3, .timeline-card h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-item label {
      font-size: 12px;
      font-weight: 500;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-item span {
      font-size: 14px;
      color: #374151;
      padding: 8px 0;
    }

    .stage-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      width: fit-content;
    }

    .stage-badge.prospecting, .stage-badge.qualification {
      background: rgba(245, 158, 11, 0.1);
      color: #92400e;
    }

    .stage-badge.proposal, .stage-badge.negotiation {
      background: rgba(59, 130, 246, 0.1);
      color: #1e40af;
    }

    .stage-badge.closed-won {
      background: rgba(16, 185, 129, 0.1);
      color: #065f46;
    }

    .stage-badge.closed-lost {
      background: rgba(239, 68, 68, 0.1);
      color: #991b1b;
    }

    .form-input, .form-textarea, .form-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s ease;
    }

    .form-input:focus, .form-textarea:focus, .form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 244, 0.06);
    }

    .stat-items {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 500;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-number {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .stat-text {
      font-size: 14px;
      color: #374151;
    }

    .progress-bar-container {
      margin-top: 8px;
    }

    .progress-label {
      font-size: 12px;
      font-weight: 500;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #f3f4f6;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      transition: width 0.3s ease;
    }

    .comparison-section {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #f3f4f6;
    }

    .comparison-section h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .comparison-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .comparison-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .comparison-label {
      font-size: 12px;
      color: #6b7280;
    }

    .comparison-value {
      font-size: 12px;
      color: #374151;
      font-weight: 500;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #f3f4f6;
    }

    .cancel-btn, .save-btn {
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .cancel-btn {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .save-btn {
      background: #10b981;
      color: white;
    }

    .cancel-btn:hover {
      background: #e5e7eb;
    }

    .save-btn:hover {
      background: #059669;
    }

    .related-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
    }

    .related-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }

    .card-header {
      margin-bottom: 20px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .account-info, .contact-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .account-details, .contact-details {
      flex: 1;
    }

    .account-name, .contact-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .account-industry, .contact-role {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .account-contact, .contact-contact {
      font-size: 12px;
      color: #6b7280;
    }

    .view-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #3b82f6;
      color: white;
      border-radius: 4px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 500;
      transition: background-color 0.2s ease;
      white-space: nowrap;
    }

    .view-link:hover {
      background: #2563eb;
    }

    .timeline-section {
      grid-column: 1 / -1;
    }

    .timeline {
      position: relative;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e5e7eb;
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
      position: relative;
    }

    .timeline-marker {
      width: 12px;
      height: 12px;
      background: #10b981;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 4px;
      position: relative;
      z-index: 1;
    }

    .timeline-content {
      flex: 1;
      padding-top: 2px;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .activity-type {
      font-weight: 500;
      color: #1f2937;
    }

    .activity-date {
      font-size: 12px;
      color: #6b7280;
    }

    .activity-description {
      color: #374151;
      margin-bottom: 4px;
    }

    .activity-amount {
      font-weight: 600;
      color: #10b981;
      margin-bottom: 4px;
    }

    .activity-user {
      font-size: 12px;
      color: #6b7280;
    }

    .empty-state {
      text-align: center;
      color: #6b7280;
      padding: 20px;
    }

    @media (max-width: 1024px) {
      .grid-section {
        grid-template-columns: 1fr;
      }

      .related-section {
        grid-template-columns: 1fr;
      }

      .account-info, .contact-info {
        flex-direction: column;
      }
    }
  </style>
