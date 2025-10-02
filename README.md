# 🏦 Call Center Bancari

Una aplicació completa de centre de trucades per al sector bancari amb gestió d'accounts, contactes, leads, oportunitats i casos.

## ✨ Funcionalitats

### 🔐 Autenticació
- Login amb credencials bàsiques
- Protecció de rutes

### 📱 Dashboard Principal
- Utilitat telefònica integrada
- Registre de trucades amb duració
- Mode de simulació activable/desactivable
- Resum d'estadístiques diàries
- Accions ràpides cap a les diferents seccions

### 👥 Gestió de Clients
- **Accounts**: Gestió dels comptes bancari amb informació completa
- **Contacts**: Gestió dels contactes amb vinculació a accounts
- **Leads**: Gestió d'interessats amb conversió a oportunitats
- **Opportunities**: Pipeline d'oportunitats amb seguiment d'etapes
- **Cases**: Casos de client amb prioritat i estatuts

### 📞 Funcionalitats Telefòniques
- Trucar directament des del dashboard
- Cerca automàtica de contactes per número
- Registre automático de trucades
- Notes de trucada
- Creació de casos des de trucades

## 🚀 Instruccions d'Ús

### Install·lació
```bash
npm install
```

### Executar l'aplicació
```bash
npm run dev
```

L'aplicació s'executarà a `http://localhost:3000`

### Credencials de prova
- **Usuari**: `agent@xavibank.com`
- **Contrasenya**: `password`

## 📖 Com Ús Funciona

1. **Login**: Introdueix les credencials per accedir al dashboard
2. **Mode Simulació**: Activa/desactiva el mode simulació amb el botó al capdamunt
3. **Trucades**: Utilitza l'utilitat telefònica per fer trucades simulades
4. **Gestió**: Navega entre les diferents seccions per gestionar clients i oportunitats
5. **Casos**: Crea casos a partir de la trucades fetes

## 🎯 Model de Dades

L'aplicació utilitza objectes de negoci estàndard del sector bancari:

- **Account**: Empreses i comptes empresarials
- **Contact**: Persones de contacte vinculades a accounts
- **Lead**: Possibles clients prospects
- **Opportunity**: Oportunitats de vendes en pipeline
- **Case**: Casos de client i suport tècnic

## 🛠️ Tecnologies

- Vue.js 3
- Vue Router
- Pinia (State Management)
- Vite (Build Tool)
- CSS3 amb disseny responsiu

## 📦 Estructura del Projecte

```
src/
├── components/           # Components reutilitzables
├── views/              # Vistes de l'aplicació
│   ├── LoginView.vue        # Pantalla de login
│   ├── DashboardView.vue    # Dashboard principal
│   ├── AccountsView.vue     # Gestió d'accounts
│   ├── ContactsView.vue     # Gestió de contactes
│   ├── LeadsView.vue        # Gestió de leads
│   ├── OpportunitiesView.vue # Gestió d'oportunitats
│   └── CasesView.vue       # Gestió de casos
├── stores/              # Stores Pinia
│   ├── auth.js              # Store d'autenticació
│   ├── calls.js             # Store de trucades
│   └── banking.js           # Store de dades bancari
├── data/                # Bancs de dades
│   └── bankingData.js       # Dades de prova
├── App.vue              # Component principal
└── main.js              # Punt d'entrada
```

## 🔧 Desenvolupament

Per executar en mode desenvolupament:

```bash
npm run dev
```

Per construir per producció:

```bash
npm run build
```

Per visualitzar la construcció:

```bash
npm run preview
```

## 🎨 Característiques del UI

- Disseny modern i responsiu
- Paleta de colors optimitzada per al sector bancari
- Interfícies intuïtives i fàcils d'usar
- Estadístiques en temps real
- Mode simulació per a facilitar les proves

---

Desenvolupat amb ❤️ per el sector bancari
