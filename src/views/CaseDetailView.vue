<template>
  <div class="case-detail-view">
    <div class="header-section">
      <div class="header-left">
        <button @click="goBack" class="back-btn">
          <font-awesome-icon icon="arrow-left" /> Tornar
        </button>
        <div class="case-title">
          <font-awesome-icon icon="address-book" />
          <h1>{{ case_.subject || 'Càrregant el cas...' }}</h1>
        </div>
      </div>
      <div class="header-right">
        <button @click="editMode = !editMode" class="edit-btn">
          <font-awesome-icon icon="edit" /> {{ editMode ? 'Cancel·lar' : 'Editar' }}
        </button>
        <router-link to="/cases" class="cases-btn">
          <font-awesome-icon icon="address-book" /> Tots els Cases
        </router-link>
      </div>
    </div>

    <!-- Case Info Cards -->
    <div v-if="case_.id" class="content-section">
      <div class="grid-section">
        <!-- Main Info Card -->
        <div class="info-card">
          <h3>Informació General</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Assumpte:</label>
              <span v-if="!editMode">{{ case_.subject }}</span>
              <input v-else v-model="editCase.subject" class="form-input" />
            </div>
            <div class="info-item">
              <label>Estat:</label>
              <span v-if="!editMode" class="status-badge" :class="case_.status.toLowerCase()">{{ case_.status }}</span>
              <select v-else v-model="editCase.status" class="form-select">
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div class="info-item">
              <label>Prioritat:</label>
              <span v-if="!editMode" class="priority-badge" :class="case_.priority.toLowerCase()">{{ case_.priority }}</span>
              <select v-else v-model="editCase.priority" class="form-select">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div class="info-item">
              <label>Tipus:</label>
              <span v-if="!editMode">{{ case_.type || 'No especificat' }}</span>
              <input v-else v-model="editCase.type" class="form-input" />
            </div>
            <div class="info-item">
              <label>Data de creació:</label>
              <span>{{ formatDate(case_.createdDate) }}</span>
            </div>
            <div class="info-item">
              <label>Data de modificació:</label>
              <span>{{ formatDate(case_.updatedDate) }}</span>
            </div>
            <div class="info-item full-width">
              <label>Descripció:</label>
              <span v-if="!editMode">{{ case_.description || 'Sense descripció' }}</span>
              <textarea v-else v-model="editCase.description" class="form-textarea" rows="4"></textarea>
            </div>
          </div>
          <div v-if="editMode" class="form-actions">
            <button @click="cancelEdit" class="cancel-btn">Cancel·lar</button>
            <button @click="saveCase" class="save-btn">Desar Canvis</button>
          </div>
        </div>

        <!-- Stats Card -->
        <div class="stats-card">
          <h3>Informació Relacionada</h3>
          <div class="stat-items">
            <div class="stat-item">
              <div class="stat-number">{{ relatedAccount.name }}</div>
              <div class="stat-label">Account Relacionat</div>
              <router-link v-if="relatedAccount.id" :to="`/accounts/${relatedAccount.id}`" class="view-link">
                <font-awesome-icon icon="eye" /> Veure Account
              </router-link>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ relatedContact.name }}</div>
              <div class="stat-label">Contacte Relacionat</div>
              <router-link v-if="relatedContact.id" :to="`/contacts/${relatedContact.id}`" class="view-link">
                <font-awesome-icon icon="eye" /> Veure Contacte
              </router-link>
            </div>
            <div v-if="case_.resolution" class="stat-item">
              <div class="stat-label">Resolució:</div>
              <div class="stat-text">{{ case_.resolution }}</div>
            </div>
            <div v-if="case_.closedDate" class="stat-item">
              <div class="stat-label">Data de tancament:</div>
              <div class="stat-text">{{ formatDate(case_.closedDate) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Case Timeline/Activity -->
      <div class="timeline-section">
        <div class="timeline-card">
          <h3><font-awesome-icon icon="clock" /> Historial del Cas</h3>
          <div v-if="caseActivity.length > 0" class="timeline">
            <div v-for="activity in caseActivity" :key="activity.id" class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="activity-type">{{ activity.type }}</span>
                  <span class="activity-date">{{ formatDate(activity.date) }}</span>
                </div>
                <div class="activity-description">{{ activity.description }}</div>
                <div v-if="activity.user" class="activity-user">per {{ activity.user }}</div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No hi ha activitat registrada per aquest cas</p>
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
  name: 'CaseDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const bankingStore = useBankingStore()

    const case_ = ref({})
    const editMode = ref(false)
    const editCase = reactive({
      subject: '',
      status: '',
      priority: '',
      type: '',
      description: ''
    })

    // Computed properties
    const relatedAccount = computed(() => {
      return bankingStore.accounts.find(acc => acc.id === case_.value.accountId) || {}
    })

    const relatedContact = computed(() => {
      return bankingStore.contacts.find(contact => contact.id === case_.value.contactId) || {}
    })

    const caseActivity = computed(() => {
      // For now, we'll create some mock activity data
      // In a real app, this would come from a separate activities store
      return [
        {
          id: 1,
          type: 'Creat',
          description: 'Cas creat i assignat',
          date: case_.value.createdDate,
          user: 'Sistema'
        },
        {
          id: 2,
          type: 'Assignat',
          description: `Assignat a Account: ${relatedAccount.value.name || 'Unknown'}`,
          date: case_.value.createdDate,
          user: 'Agent'
        }
      ]
    })

    // Methods
    const loadCase = () => {
      const caseId = parseInt(route.params.id)
      const foundCase = bankingStore.cases.find(c => c.id === caseId)

      if (foundCase) {
        case_.value = foundCase
        editCase.subject = foundCase.subject
        editCase.status = foundCase.status
        editCase.priority = foundCase.priority
        editCase.type = foundCase.type || ''
        editCase.description = foundCase.description || ''
      } else {
        // Case not found, redirect back
        router.push('/cases')
      }
    }

    const saveCase = () => {
      const updatedCase = {
        ...case_.value,
        ...editCase,
        updatedDate: new Date().toISOString()
      }

      bankingStore.updateCase(updatedCase)
      case_.value = updatedCase
      editMode.value = false
    }

    const cancelEdit = () => {
      editCase.subject = case_.value.subject
      editCase.status = case_.value.status
      editCase.priority = case_.value.priority
      editCase.type = case_.value.type || ''
      editCase.description = case_.value.description || ''
      editMode.value = false
    }

    const goBack = () => {
      router.go(-1)
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ca-ES')
    }

    onMounted(() => {
      loadCase()
    })

    return {
      case_,
      editMode,
      editCase,
      relatedAccount,
      relatedContact,
      caseActivity,
      saveCase,
      cancelEdit,
      goBack,
      formatDate
    }
  }
}
</script>

<style scoped>
.case-detail-view {
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

.case-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.case-title h1 {
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

.edit-btn, .cases-btn {
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

.cases-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.cases-btn:hover {
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

.status-badge, .priority-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
}

.status-badge.open {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.status-badge.in-progress {
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
}

.status-badge.closed {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.priority-badge.low {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.priority-badge.medium {
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
}

.priority-badge.high {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.priority-badge.critical {
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
  width: fit-content;
  margin-top: 4px;
}

.view-link:hover {
  background: #2563eb;
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
  background: #3b82f6;
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
}
</style>
