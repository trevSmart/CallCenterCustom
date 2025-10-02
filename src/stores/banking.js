import { defineStore } from 'pinia'
import { generateBankingData } from '../data/bankingData.js'

export const useBankingStore = defineStore('banking', {
  state: () => {
    const { accounts, contacts, leads, opportunities, cases } = generateBankingData()

    return {
      accounts,
      contacts,
      leads,
      opportunities,
      cases
    }
  },

  actions: {
    // Account actions
    addAccount(account) {
      this.accounts.unshift({
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        ...account
      })
    },

    updateAccount(id, updates) {
      const index = this.accounts.findIndex(acc => acc.id === id)
      if (index !== -1) {
        this.accounts[index] = { ...this.accounts[index], ...updates }
      }
    },

    // Contact actions
    addContact(contact) {
      this.contacts.unshift({
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        ...contact
      })
    },

    updateContact(id, updates) {
      const index = this.contacts.findIndex(contact => contact.id === id)
      if (index !== -1) {
        this.contacts[index] = { ...this.contacts[index], ...updates }
      }
    },

    // Lead actions
    addLead(lead) {
      this.leads.unshift({
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        status: 'New',
        ...lead
      })
    },

    convertLeadToOpportunity(leadId, opportunityData) {
      const lead = this.leads.find(l => l.id === leadId)
      if (lead) {
        // Remove lead
        this.leads = this.leads.filter(l => l.id !== leadId)

        // Create contact
        this.addContact({
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          position: 'Contact',
          accountId: null, // No account initially
        })

        // Create opportunity
        this.addOpportunity({
          name: opportunityData.name,
          amount: opportunityData.amount || lead.estimatedValue,
          stage: 'Prospecting',
          closeDate: opportunityData.closeDate,
          probability: opportunityData.probability || 10,
          contactId: leadId, // Temporary reference
          accountId: opportunityData.accountId || null,
          ...opportunityData
        })
      }
    },

    // Opportunity actions
    addOpportunity(opportunity) {
      this.opportunities.unshift({
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        ...opportunity
      })
    },

    updateOpportunity(id, updates) {
      const index = this.opportunities.findIndex(opp => opp.id === id)
      if (index !== -1) {
        this.opportunities[index] = { ...this.opportunities[index], ...updates }
      }
    },

    // Case actions
    addCase(caseData) {
      this.cases.unshift({
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'Open',
        priority: 'Medium',
        ...caseData
      })
    },

    updateCase(id, updates) {
      const index = this.cases.findIndex(c => c.id === id)
      if (index !== -1) {
        this.cases[index] = { ...this.cases[index], ...updates }
      }
    },

    closeCase(id, resolution) {
      const index = this.cases.findIndex(c => c.id === id)
      if (index !== -1) {
        this.cases[index] = {
          ...this.cases[index],
          status: 'Closed',
          resolution
        }
      }
    }
  }
})
