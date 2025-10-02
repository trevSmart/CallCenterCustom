import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './styles/global.css'

// Font Awesome configuration
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Solid icons
import {
  faPhone,
  faClock,
  faChartLine,
  faBullseye,
  faUsers,
  faAddressBook,
  faNoteSticky,
  faBuilding,
  faGear,
  faDesktop,
  faHeart,
  faInfinity,
  faGlobe,
  faCog,
  faBullhorn,
  faDollarSign,
  faHeadphones,
  faLaptopCode,
  faEdit,
  faChevronDown,
  faCheckCircle,
  faTimesCircle,
  faEye,
  faCheck,
  faEnvelope,
  faTrashCan,
  faThumbsUp,
  faUserCircle,
  faPhoneVolume,
  faComments,
  faCalendarAlt,
  faFileAlt,
  faSignOutAlt,
  faPlayCircle,
  faPauseCircle,
  faSpinner,
  faArrowLeft,
  faPlus,
  faMinus,
  faSearch,
  faPaperclip,
  faSmile,
  faPaperPlane,
  faEllipsisVertical,
  faHandshake,
  faExchangeAlt,
  faFileInvoice,
  faUniversity,
  faSearchDollar,
  faPiggyBank,
  faWallet,
  faChartBar,
  faChartPie,
  faTrophy,
  faArrowTrendUp,
  faTable,
  faDownload,
  faCalendarCheck,
  faExternalLinkAlt,
  faGripVertical
} from '@fortawesome/free-solid-svg-icons'

// Regular icons
import {
  faEnvelope as faEnvelopeRegular,
  faUserCircle as faUserCircleRegular,
  faCalendarAlt as faCalendarAltRegular,
  faFileAlt as faFileAltRegular
} from '@fortawesome/free-regular-svg-icons'

// Add icons to library
library.add(
  faPhone,
  faClock,
  faChartLine,
  faBullseye,
  faUsers,
  faAddressBook,
  faNoteSticky,
  faBuilding,
  faGear,
  faDesktop,
  faHeart,
  faInfinity,
  faGlobe,
  faCog,
  faBullhorn,
  faDollarSign,
  faHeadphones,
  faLaptopCode,
  faEdit,
  faChevronDown,
  faCheckCircle,
  faTimesCircle,
  faEye,
  faCheck,
  faEnvelope,
  faTrashCan,
  faThumbsUp,
  faUserCircle,
  faPhoneVolume,
  faComments,
  faCalendarAlt,
  faFileAlt,
  faSignOutAlt,
  faPlayCircle,
  faPauseCircle,
  faSpinner,
  faArrowLeft,
  faPlus,
  faMinus,
  faSearch,
  faPaperclip,
  faSmile,
  faPaperPlane,
  faEllipsisVertical,
  faHandshake,
  faExchangeAlt,
  faFileInvoice,
  faUniversity,
  faSearchDollar,
  faPiggyBank,
  faWallet,
  faChartBar,
  faChartPie,
  faTrophy,
  faArrowTrendUp,
  faTable,
  faDownload,
  faCalendarCheck,
  faExternalLinkAlt,
  faGripVertical,
  faEnvelopeRegular,
  faUserCircleRegular,
  faCalendarAltRegular,
  faFileAltRegular
)

// Routes
const routes = [
  { path: '/', name: 'Login', component: () => import('./views/LoginView.vue') },
  { path: '/dashboard', name: 'Dashboard', component: () => import('./views/DashboardView.vue') },
  { path: '/accounts', name: 'Accounts', component: () => import('./views/AccountsView.vue') },
  { path: '/accounts/:id', name: 'AccountDetail', component: () => import('./views/AccountDetailView.vue') },
  { path: '/contacts', name: 'Contacts', component: () => import('./views/ContactsView.vue') },
  { path: '/contacts/:id', name: 'Reload', component: () => import('./views/ContactsView.vue') },
  { path: '/leads', name: 'Leads', component: () => import('./views/LeadsView.vue') },
  { path: '/opportunities', name: 'Opportunities', component: () => import('./views/OpportunitiesView.vue') },
  { path: '/opportunities/:id', name: 'OpportunityDetail', component: () => import('./views/OpportunityDetailView.vue') },
  { path: '/cases', name: 'Cases', component: () => import('./views/CasesView.vue') },
  { path: '/cases/:id', name: 'CaseDetail', component: () => import('./views/CaseDetailView.vue') },
  { path: '/reports', name: 'Reports', component: () => import('./views/ReportsView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')

  if (to.name !== 'Login' && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')