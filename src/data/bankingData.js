// Bancal dades i objectes del negoci
export const generateBankingData = () => {
  const accounts = [
    {
      id: 1,
      name: 'Caixabank S.A.',
      industry: 'Banking',
      phone: '932014000',
      email: 'info@caixabank.es',
      address: 'Av. Diagonal, 621, Barcelona',
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      name: 'BBVA Bancomer',
      industry: 'Banking',
      phone: '915368400',
      email: 'info@bbva.com',
      address: 'Plaza Castellana, 81, Madrid',
      createdAt: '2023-02-20'
    },
    {
      id: 3,
      name: 'Banco Santander',
      industry: 'Banking',
      phone: '915898100',
      email: 'info@santander.es',
      address: 'Paseo de Pereda, 9, Santander',
      createdAt: '2023-03-10'
    }
  ]

  const contacts = [
    {
      id: 1,
      firstName: 'Carolyn',
      lastName: 'Statingham',
      name: 'Carolyn Statingham',
      email: 'carolyn.statingham@caixabank.es',
      phone: '1111222444',
      position: 'Director Comercial',
      accountId: 1,
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      createdAt: '2023-01-16'
    },
    {
      id: 2,
      firstName: 'Joseph',
      lastName: 'Tristam',
      name: 'Joseph Tristam',
      email: 'joseph.tristam@bbva.com',
      phone: '2222333333',
      position: 'Responsable Recursos Humanos',
      accountId: 2,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      createdAt: '2023-02-21'
    },
    {
      id: 3,
      firstName: 'Maria',
      lastName: 'Santos',
      name: 'Maria Santos',
      email: 'maria.santos@santander.es',
      phone: '3333444555',
      position: 'Director Financer',
      accountId: 3,
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      createdAt: '2023-03-11'
    }
  ]

  const leads = [
    {
      id: 1,
      firstName: 'Ana',
      lastName: 'Martinez',
      company: 'TechStart Barcelona',
      email: 'ana.martinez@techstart.com',
      phone: '666555666',
      source: 'Webinar',
      status: 'New',
      estimatedValue: 25000,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      firstName: 'David',
      lastName: 'Sanchez',
      company: 'Innovate Solutions',
      email: 'david.sanchez@innovate.com',
      phone: '666777999',
      source: 'Cold Call',
      status: 'Contacted',
      estimatedValue: 50000,
      createdAt: '2024-01-16'
    }
  ]

  const opportunities = [
    {
      id: 1,
      name: 'Contracte Digitalització Caixabank',
      accountId: 1,
      contactId: 1,
      amount: 150000,
      stage: 'Proposal',
      closeDate: '2024-03-31',
      probability: 75,
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      name: 'Millora Sistemes BBVA',
      accountId: 2,
      contactId: 2,
      amount: 200000,
      stage: 'Negotiation',
      closeDate: '2024-02-28',
      probability: 60,
      createdAt: '2024-01-12'
    }
  ]

  const cases = [
    {
      id: 1,
      subject: 'Problem amb l\'application mobil',
      description: 'El client no pot fer login a l\'app després de l\'actualització',
      status: 'Open',
      priority: 'High',
      contactId: 1,
      createdAt: '2024-01-20',
      resolution: ''
    },
    {
      id: 2,
      subject: 'Solicitud de nou producte',
      description: 'Client demana informació sobre tarifa premium',
      status: 'In Progress',
      priority: 'Medium',
      contactId: 2,
      createdAt: '2024-01-21',
      resolution: ''
    }
  ]

  return { accounts, contacts, leads, opportunities, cases }
}
