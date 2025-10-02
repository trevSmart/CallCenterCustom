<template>
  <div class="accounts-view">
    <div class="header-section">
      <div class="header-left">
        <h1><font-awesome-icon icon="building" /> Accounts</h1>
        <p>Gestiona els compte bancari</p>
      </div>
      <div class="header-right">
        <button @click="showAddForm = true" class="add-btn"><font-awesome-icon icon="plus" /> Afegir Account</button>
        <router-link to="/dashboard" class="back-btn"><font-awesome-icon icon="arrow-left" /> Tornar al Dashboard</router-link>
      </div>
    </div>

    <!-- Add Account Form -->
    <div v-if="showAddForm" class="form-modal">
      <div class="modal-content">
        <h2>Afegir Nou Account</h2>
        <form @submit.prevent="addNewAccount">
          <div class="form-row">
            <input v-model="newAccount.name" placeholder="Nom de l'account" required />
            <input v-model="newAccount.industry" placeholder="Indústria" required />
          </div>
          <div class="form-row">
            <input v-model="newAccount.phone" placeholder="Telèfon" />
            <input v-model="newAccount.email" placeholder="Email" type="email" />
          </div>
          <div class="form-row">
            <input v-model="newAccount.address" placeholder="Adreça" />
          </div>
          <div class="form-actions">
            <button type="button" @click="cancelAdd" class="cancel-btn">Cancel·la</button>
            <button type="submit" class="submit-btn">Afegir Account</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-number">{{ bankingStore.accounts.length }}</div>
        <div class="stat-label">Accounts Totals</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ accountsWithContacts.length }}</div>
        <div class="stat-label">Amb Contacte</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ accountsWithOpportunities.length }}</div>
        <div class="stat-label">Amb Oportunitats</div>
      </div>
    </div>

    <!-- Filter and Search -->
    <div class="filter-section">
      <input
        v-model="searchTerm"
        placeholder="🔍 Cerca per nom, indústria..."
        class="search-input"
      />
      <select v-model="selectedIndustry" class="filter-select">
        <option value="">Totes les indústries</option>
        <option value="Banking">Banking</option>
        <option value="Technology">Technology</option>
        <option value="Finance">Finance</option>
      </select>
    </div>

    <!-- Accounts Table -->
    <div class="table-container">
      <table class="accounts-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Indústria</th>
            <th>Contacte</th>
            <th>Telèfon</th>
            <th>Email</th>
            <th>Accions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in filteredAccounts" :key="account.id">
            <td>
              <strong>{{ account.name }}</strong>
              <div class="account-meta">Creat: {{ formatDate(account.createdAt) }}</div>
            </td>
            <td>{{ account.industry }}</td>
            <td>
              <div v-if="getAccountContacts(account.id).length > 0">
                {{ getAccountContacts(account.id)[0].firstName }} {{ getAccountContacts(account.id)[0].lastName }}
                <div v-if="getAccountContacts(account.id).length > 1" class="more-contacts">
                  +{{ getAccountContacts(account.id).length - 1 }} més
                </div>
              </div>
              <span v-else class="no-contacts">Cap contacte</span>
            </td>
            <td>{{ account.phone }}</td>
            <td>{{ account.email }}</td>
            <td>
              <div class="action-buttons">
                <button @click="viewAccount(account)" class="view-btn"><font-awesome-icon icon="eye" /> Veure</button>
                <button @click="editAccount(account)" class="edit-btn"><font-awesome-icon icon="edit" /> Editar</button>
                <button @click="callAccount(account)" class="call-btn"><font-awesome-icon icon="phone" /> Trucar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Account Detail Modal -->
    <div v-if="selectedAccount" class="detail-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ selectedAccount.name }}</h2>
          <button @click="closeDetail" class="close-btn">×</button>
        </div>

        <div class="account-details">
          <div class="detail-section">
            <h3>Informació Bàsica</h3>
            <p><strong>Indústria:</strong> {{ selectedAccount.industry }}</p>
            <p><strong>Telèfon:</strong> {{ selectedAccount.phone }}</p>
            <p><strong>Email:</strong> {{ selectedAccount.email }}</p>
            <p><strong>Adreça:</strong> {{ selectedAccount.address }}</p>
            <p><strong>Creat:</strong> {{ formatDate(selectedAccount.createdAt) }}</p>
          </div>

          <div class="detail-section">
            <h3>Contactes ({{ accountContacts.length }})</h3>
            <div v-if="accountContacts.length > 0" class="contacts-list">
              <div v-for="contact in accountContacts" :key="contact.id" class="contact-item">
                <div class="contact-info">
                  <strong>{{ contact.firstName }} {{ contact.lastName }}</strong>
                  <div>{{ contact.position }} - {{ contact.email }}</div>
                </div>
                <button @click="callContact(contact)" class="call-contact-btn"><font-awesome-icon icon="phone" /> Trucar</button>
              </div>
            </div>
            <p v-else class="no-data">Cap contacte registrat</p>
          </div>

          <div class="detail-section">
            <h3>Oportunitats ({{ accountOpportunities.length }})</h3>
            <div v-if="accountOpportunities.length > 0" class="opportunities-list">
              <div v-for="opp in accountOpportunities" :key="opp.id" class="opportunity-item">
                <div class="opp-info">
                  <strong>{{ opp.name }}</strong>
                  <div>{{ opp.stage }} - {{ opp.amount && formatCurrency(opp.amount) }}</div>
                  <div>{{ opp.probability }}% probabilitat</div>
                </div>
              </div>
            </div>
            <p v-else class="no-data">Cap oportunitat activa</p>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="createOpportunity" class="opportunity-btn"><font-awesome-icon icon="dollar-sign" /> Nova Oportunitat</button>
          <button @click="createContact" class="contact-btn"><font-awesome-icon icon="users" /> Nou Contacte</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBankingStore } from '../stores/banking.js'

export default {
  name: 'AccountsView',
  setup() {
    const router = useRouter()
    const bankingStoreInstance = useBankingStore()

    const showAddForm = ref(false)
    const searchTerm = ref('')
    const selectedIndustry = ref('')
    const selectedAccount = ref(null)

    const newAccount = ref({
      name: '',
      industry: '',
      phone: '',
      email: '',
      address: ''
    })

    const filteredAccounts = computed(() => {
      return bankingStoreInstance.accounts.filter(account => {
        const matchesSearch = account.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                            account.industry.toLowerCase().includes(searchTerm.value.toLowerCase())
        const matchesIndustry = !selectedIndustry.value || account.industry === selectedIndustry.value

        return matchesSearch && matchesIndustry
      })
    })

    const accountsWithContacts = computed(() => {
      return bankingStoreInstance.accounts.filter(account =>
        bankingStoreInstance.contacts.some(contact => contact.accountId === account.id)
      )
    })

    const accountsWithOpportunities = computed(() => {
      return bankingStoreInstance.accounts.filter(account =>
        bankingStoreInstance.opportunities.some(opp => opp.accountId === account.id)
      )
    })

    const accountContacts = computed(() => {
      if (!selectedAccount.value) return []
      return bankingStoreInstance.contacts.filter(contact =>
        contact.accountId === selectedAccount.value.id
      )
    })

    const accountOpportunities = computed(() => {
      if (!selectedAccount.value) return []
      return bankingStoreInstance.opportunities.filter(opp =>
        opp.accountId === selectedAccount.value.id
      )
    })

    const addNewAccount = () => {
      bankingStoreInstance.addAccount(newAccount.value)

      // Reset form
      newAccount.value = {
        name: '',
        industry: '',
        phone: '',
        email: '',
        address: ''
      }

      showAddForm.value = false
    }

    const cancelAdd = () => {
      showAddForm.value = false
      newAccount.value = {
        name: '',
        industry: '',
        phone: '',
        email: '',
        address: ''
      }
    }

    const viewAccount = (account) => {
      router.push(`/accounts/${account.id}`)
    }

    const closeDetail = () => {
      selectedAccount.value = null
    }

    const editAccount = (account) => {
      // Implementar edició si cal
      console.log('Edit account:', account)
    }

    const callAccount = (account) => {
      router.push({
        name: 'Dashboard',
        query: { phone: account.phone, name: account.name }
      })
    }

    const callContact = (contact) => {
      router.push({
        name: 'Dashboard',
        query: { phone: contact.phone, name: `${contact.firstName} ${contact.lastName}` }
      })
    }

    const createOpportunity = () => {
      router.push({ name: 'Opportunities' })
    }

    const createContact = () => {
      router.push({ name: 'Contacts' })
      selectedAccount.value = null
    }

    const getAccountContacts = (accountId) => {
      return bankingStoreInstance.contacts.filter(contact => contact.accountId === accountId)
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ca-ES')
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ca-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    }

    return {
      bankingStore: bankingStoreInstance,
      showAddForm,
      searchTerm,
      selectedIndustry,
      selectedAccount,
      newAccount,
      filteredAccounts,
      accountsWithContacts,
      accountsWithOpportunities,
      accountContacts,
      accountOpportunities,
      addNewAccount,
      cancelAdd,
      viewAccount,
      closeDetail,
      editAccount,
      callAccount,
      callContact,
      createOpportunity,
      createContact,
      getAccountContacts,
      formatDate,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.accounts-view {
  padding: var(--space-8);
  background: var(--gray-50);
  min-height: 100vh;
  font-family: var(--font-sans);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-8);
  background: var(--white);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
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

.form-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.form-row:last-of-type {
  grid-template-columns: 1fr;
}

.form-row input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-btn,
.submit-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.submit-btn {
  background: #007bff;
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

.filter-section {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.search-input,
.filter-select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.search-input {
  flex: 1;
}

.table-container {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.accounts-table {
  width: 100%;
  border-collapse: collapse;
}

.accounts-table th {
  background: #f8f9fa;
  padding: 15px;
  color: #495057;
  font-weight: 600;
  text-align: left;
}

.accounts-table td {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
}

.account-meta {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.more-contacts {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.no-contacts {
  color: #999;
  font-style: italic;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.view-btn,
.edit-btn,
.call-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.view-btn {
  background: #17a2b8;
  color: white;
}

.edit-btn {
  background: #ffc107;
  color: #212529;
}

.call-btn {
  background: #28a745;
  color: white;
}

.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.account-details {
  margin-bottom: 25px;
}

.detail-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.detail-section p {
  margin: 8px 0;
}

.contacts-list,
.opportunities-list {
  display: grid;
  gap: 10px;
}

.contact-item,
.opportunity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.contact-info,
.opp-info strong {
  font-weight: 600;
  color: #2c3e50;
}

.contact-info div,
.opp-info div {
  font-size: 14px;
  color: #666;
  margin-top: 3px;
}

.call-contact-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.modal-actions {
  display: flex;
  gap: 15px;
}

.opportunity-btn,
.contact-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.opportunity-btn {
  background: #28a745;
}

.contact-btn {
  background: #007bff;
}

.no-data {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 20px;
}
</style>
