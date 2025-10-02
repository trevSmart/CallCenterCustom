<template>
  <div class="account-detail-view">
    <div class="header-section">
      <div class="header-left">
        <button @click="goBack" class="back-btn">
          <font-awesome-icon icon="arrow-left" /> Tornar
        </button>
        <div class="account-title">
          <font-awesome-icon icon="building" />
          <h1>{{ account.name || 'Càrregant l\'account...' }}</h1>
        </div>
      </div>
      <div class="header-right">
        <button @click="editMode = !editMode" class="edit-btn">
          <font-awesome-icon icon="edit" /> {{ editMode ? 'Cancel·lar' : 'Editar' }}
        </button>
        <router-link to="/accounts" class="accounts-btn">
          <font-awesome-icon icon="building" /> Tots els Accounts
        </router-link>
      </div>
    </div>

    <!-- Account Info Cards -->
    <div v-if="account.id" class="content-section">
      <div class="grid-section">
        <!-- Main Info Card -->
        <div class="info-card">
          <h3>Informació General</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Nom:</label>
              <span v-if="!editMode">{{ account.name }}</span>
              <input v-else v-model="editAccount.name" class="form-input" />
            </div>
            <div class="info-item">
              <label>Indústria:</label>
              <span v-if="!editMode">{{ account.industry }}</span>
              <input v-else v-model="editAccount.industry" class="form-input" />
            </div>
            <div class="info-item">
              <label>Telèfon:</label>
              <span v-if="!editMode">{{ account.phone || 'No especificat' }}</span>
              <input v-else v-model="editAccount.phone" class="form-input" />
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span v-if="!editMode">{{ account.email || 'No especificat' }}</span>
              <input v-else v-model="editAccount.email" type="email" class="form-input" />
            </div>
            <div class="info-item full-width">
              <label>Adreça:</label>
              <span v-if="!editMode">{{ account.address || 'No especificat' }}</span>
              <textarea v-else v-model="editAccount.address" class="form-textarea" rows="2"></textarea>
            </div>
          </div>
          <div v-if="editMode" class="form-actions">
            <button @click="cancelEdit" class="cancel-btn">Cancel·lar</button>
            <button @click="saveAccount" class="save-btn">Desar Canvis</button>
          </div>
        </div>

        <!-- Stats Card -->
        <div class="stats-card">
          <h3>Estatístiques</h3>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-number">{{ relatedContacts.length }}</div>
              <div class="stat-label">Contactes</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ relatedCases.length }}</div>
              <div class="stat-label">Cases</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ relatedOpportunities.length }}</div>
              <div class="stat-label">Oportunitats</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ formatCurrency(totalOpportunityAmount) }}</div>
              <div class="stat-label">Pipeline</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Data Cards -->
      <div class="related-section">
        <!-- Contacts Card -->
        <div class="related-card">
          <div class="card-header">
            <h3><font-awesome-icon icon="users" /> Contactes Relacionats</h3>
            <span class="count-badge">{{ relatedContacts.length }}</span>
          </div>
          <div v-if="relatedContacts.length > 0" class="contact-list">
            <div v-for="contact in relatedContacts" :key="contact.id" class="contact-item">
              <div class="contact-info">
                <div class="contact-name">{{ contact.firstName }} {{ contact.lastName }}</div>
                <div class="contact-details">{{ contact.email }} • {{ contact.phone }}</div>
              </div>
              <router-link :to="`/contacts/${contact.id}`" class="view-link">
                <font-awesome-icon icon="eye" />
              </router-link>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No hi ha contactes relacionats amb aquest account</p>
          </div>
        </div>

        <!-- Cases Card -->
        <div class="related-card">
          <div class="card-header">
            <h3><font-awesome-icon icon="address-book" /> Cases Relacionats</h3>
            <span class="count-badge">{{ relatedCases.length }}</span>
          </div>
          <div v-if="relatedCases.length > 0" class="case-list">
            <div v-for="case_ in relatedCases" :key="case_.id" class="case-item">
              <div class="case-info">
                <div class="case-subject">{{ case_.subject }}</div>
                <div class="case-details">
                  {{ case_.status }} • {{ case_.priority }} • {{ formatDate(case_.createdDate) }}
                </div>
              </div>
              <div class="case-status" :class="case_.status.toLowerCase()">
                {{ case_.status }}
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No hi ha cases relacionats amb aquest account</p>
          </div>
        </div>

        <!-- Opportunities Card -->
        <div class="related-card">
          <div class="card-header">
            <h3><font-awesome-icon icon="dollar-sign" /> Oportunitats Relacionades</h3>
            <span class="count-badge">{{ relatedOpportunities.length }}</span>
          </div>
          <div v-if="relatedOpportunities.length > 0" class="opportunity-list">
            <div v-for="opportunity in relatedOpportunities" :key="opportunity.id" class="opportunity-item">
              <div class="opportunity-info">
                <div class="opportunity-name">{{ opportunity.name }}</div>
                <div class="opportunity-details">
                  {{ formatCurrency(opportunity.amount) }} • {{ opportunity.stage }} • {{ opportunity.probability }}%
                </div>
              </div>
              <div class="opportunity-stage" :class="opportunity.stage.toLowerCase().replace(' ', '-')">
                {{ opportunity.stage }}
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No hi ha oportunitats relacionades amb aquest account</p>
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
  name: 'AccountDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const bankingStore = useBankingStore()

    const account = ref({})
    const editMode = ref(false)
    const editAccount = reactive({
      name: '',
      industry: '',
      phone: '',
      email: '',
      address: ''
    })

    // Computed properties
    const relatedContacts = computed(() => {
      return bankingStore.contacts.filter(contact =>
        contact.accountId === account.value.id
      )
    })

    const relatedCases = computed(() => {
      return bankingStore.cases.filter(case_ =>
        case_.accountId === account.value.id
      )
    })

    const relatedOpportunities = computed(() => {
      return bankingStore.opportunities.filter(opportunity =>
        opportunity.accountId === account.value.id
      )
    })

    const totalOpportunityAmount = computed(() => {
      return relatedOpportunities.value.reduce((total, opp) => total + opp.amount, 0)
    })

    // Methods
    const loadAccount = () => {
      const accountId = parseInt(route.params.id)
      const foundAccount = bankingStore.accounts.find(acc => acc.id === accountId)

      if (foundAccount) {
        account.value = foundAccount
        editAccount.name = foundAccount.name
        editAccount.industry = foundAccount.industry
        editAccount.phone = foundAccount.phone || ''
        editAccount.email = foundAccount.email || ''
        editAccount.address = foundAccount.address || ''
      } else {
        // Account not found, redirect back
        router.push('/accounts')
      }
    }

    const saveAccount = () => {
      const updatedAccount = {
        ...account.value,
        ...editAccount
      }

      bankingStore.updateAccount(updatedAccount)
      account.value = updatedAccount
      editMode.value = false
    }

    const cancelEdit = () => {
      editAccount.name = account.value.name
      editAccount.industry = account.value.industry
      editAccount.phone = account.value.phone || ''
      editAccount.email = account.value.email || ''
      editAccount.address = account.value.address || ''
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
      loadAccount()
    })

    return {
      account,
      editMode,
      editAccount,
      relatedContacts,
      relatedCases,
      relatedOpportunities,
      totalOpportunityAmount,
      saveAccount,
      cancelEdit,
      goBack,
      formatCurrency,
      formatDate
    }
  }
}
</script>

<style scoped>
.account-detail-view {
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

.account-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.account-title h1 {
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

.edit-btn, .accounts-btn {
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

.accounts-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.accounts-btn:hover {
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

.info-card, .stats-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.info-card h3, .stats-card h3 {
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

.form-input, .form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 244, 0.06);
}

.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1e40af;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  background: #3b82f6;
  color: white;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn:hover {
  background: #1e40af;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.count-badge {
  background: #1e40af;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.contact-list, .case-list, .opportunity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item, .case-item, .opportunity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.contact-item:hover, .case-item:hover, .opportunity-item:hover {
  background: #f3f4f6;
}

.contact-name, .case-subject, .opportunity-name {
  font-weight: 500;
  color: #1f2937;
}

.contact-details, .case-details, .opportunity-details {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.view-link {
  padding: 6px;
  background: #3b82f6;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.view-link:hover {
  background: #2563eb;
}

.case-status, .opportunity-stage {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.case-status.open {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.case-status.closed {
  background: rgba(16, 185, 129, 0.1);
  color: #1e40af;
}

.opportunity-stage.prospecting, .opportunity-stage.qualification {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.opportunity-stage.proposal, .opportunity-stage.negotiation {
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
}

.opportunity-stage.closed-won {
  background: rgba(16, 185, 129, 0.1);
  color: #1e40af;
}

.opportunity-stage.closed-lost {
  background: rgba(239, 68, 68, 0.1);
  color: #991b1b;
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
}
</style>
