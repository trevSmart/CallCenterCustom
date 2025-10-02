<template>
  <div class="reports-view">
    <div class="header-section">
      <div class="header-left">
        <button @click="goBack" class="back-btn">
          <font-awesome-icon icon="arrow-left" /> Tornar al Dashboard
        </button>
        <div class="reports-title">
          <font-awesome-icon icon="chart-bar" />
          <h1>XaviBank Reports & Analytics</h1>
        </div>
      </div>
      <div class="header-right">
        <select v-model="selectedPeriod" class="period-select">
          <option value="today">Avui</option>
          <option value="week">Aquesta setmana</option>
          <option value="month">Aquest mes</option>
          <option value="quarter">Aquest trimestre</option>
          <option value="year">Aquest any</option>
        </select>
        <button @click="exportReport" class="export-btn">
          <font-awesome-icon icon="download" /> Exportar
        </button>
      </div>
    </div>

    <!-- Reports Overview Cards -->
    <div class="overview-section">
      <div class="overview-card">
        <div class="card-icon">
          <font-awesome-icon icon="phone" />
        </div>
        <div class="card-content">
          <div class="card-number">{{ totalCalls }}</div>
          <div class="card-label">Trucades Totals</div>
          <div class="card-change" :class="getChangeClass(callChange)">
            {{ callChange > 0 ? '+' : '' }}{{ callChange }}% vs periode anterior
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <font-awesome-icon icon="handshake" />
        </div>
        <div class="card-content">
          <div class="card-number">{{ formatCurrency(totalOpportunities) }}</div>
          <div class="card-label">Pipeline Total</div>
          <div class="card-change" :class="getChangeClass(opportunityChange)">
            {{ opportunityChange > 0 ? '+' : '' }}{{ opportunityChange }}% vs periode anterior
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <font-awesome-icon icon="user-circle" />
        </div>
        <div class="card-content">
          <div class="card-number">{{ activeContacts }}</div>
          <div class="card-label">Contactes Actius</div>
          <div class="card-change" :class="getChangeClass(contactChange)">
            {{ contactChange > 0 ? '+' : '' }}{{ contactChange }}% vs periode anterior
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <font-awesome-icon icon="calendar-check" />
        </div>
        <div class="card-content">
          <div class="card-number">{{ resolvedCases }}</div>
          <div class="card-label">Cases Resolts</div>
          <div class="card-change" :class="getChangeClass(caseChange)">
            {{ caseChange > 0 ? '+' : '' }}{{ caseChange }}% vs periode anterior
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <!-- Calls Analytics -->
      <div class="chart-card">
        <div class="chart-header">
          <h3><font-awesome-icon icon="chart-line" /> Trucades per Dia</h3>
          <div class="chart-filter">
            <select v-model="callChartType" class="chart-select">
              <option value="daily">Diàries</option>
              <option value="daily">Hores</option>
              <option value="agents">Per Agent</option>
            </select>
          </div>
        </div>
        <div class="chart-content">
          <div class="chart-placeholder">
            <div class="bar-chart">
              <div v-for="(value, index) in callsData" :key="index" class="bar">
                <div class="bar-fill" :style="{ height: (value / Math.max(...callsData)) * 100 + '%' }"></div>
                <div class="bar-label">{{ index + 1 }}</div>
                <div class="bar-value">{{ value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pipeline Analytics -->
      <div class="chart-card">
        <div class="chart-header">
          <h3><font-awesome-icon icon="chart-pie" /> Pipeline per Stage</h3>
          <div class="chart-filter">
            <select v-model="pipelineChartType" class="chart-select">
              <option value="stage">Per Etapa</option>
              <option value="agent">Per Agent</option>
              <option value="industry">Per Indústria</option>
            </select>
          </div>
        </div>
        <div class="chart-content">
          <div class="pipeline-chart">
            <div v-for="stage in pipelineData" :key="stage.stage" class="pipeline-item">
              <div class="pipeline-bar">
                <div class="pipeline-fill" :style="{ width: stage.percentage + '%', backgroundColor: stage.color }"></div>
              </div>
              <div class="pipeline-info">
                <span class="pipeline-stage">{{ stage.stage }}</span>
                <span class="pipeline-amount">{{ formatCurrency(stage.amount) }}</span>
                <span class="pipeline-count">{{ stage.count }} casos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Agent Performance -->
      <div class="chart-card">
        <div class="chart-header">
          <h3><font-awesome-icon icon="trophy" /> Ranking Agents</h3>
          <div class="chart-filter">
            <select v-model="performanceMetric" class="chart-select">
              <option value="calls">Trucades</option>
              <option value="deals">Negocis</option>
              <option value="revenue">Ingressos</option>
              <option value="satisfaction">Satisfacció</option>
            </select>
          </div>
        </div>
        <div class="chart-content">
          <div class="performance-list">
            <div v-for="(agent, index) in agentPerformance" :key="agent.id" class="performance-item">
              <div class="agent-rank">{{ index + 1 }}º</div>
              <div class="agent-avatar">{{ agent.name.charAt(0) }}</div>
              <div class="agent-info">
                <div class="agent-name">{{ agent.name }}</div>
                <div class="agent-metric">{{ agent.metricLabel }}: {{ agent.metricValue }}</div>
              </div>
              <div class="agent-score">{{ agent.score }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Trends -->
      <div class="chart-card">
        <div class="chart-header">
          <h3><font-awesome-icon icon="trending-up" /> Tendència Ingressos</h3>
          <div class="chart-filter">
            <select v-model="revenuePeriod" class="chart-select">
              <option value="daily">Diària</option>
              <option value="weekly">Setmanal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>
        </div>
        <div class="chart-content">
          <div class="revenue-chart">
            <div class="revenue-line">
              <div v-for="(point, index) in revenueData" :key="index"
                   class="line-point"
                   :style="{ left: (index / (revenueData.length - 1)) * 100 + '%', bottom: (point / Math.max(...revenueData)) * 100 + '%' }">
              </div>
            </div>
            <div class="revenue-labels">
              <div v-for="(period, index) in revenueLabels" :key="index" class="revenue-label">
                {{ period }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Reports Table -->
    <div class="reports-table-section">
      <div class="table-header">
        <h3><font-awesome-icon icon="table" /> Report Detallat per Agent</h3>
        <div class="table-actions">
          <input v-model="searchAgent" placeholder="🔍 Cerca agent..." class="search-input">
          <select v-model="sortBy" class="sort-select">
            <option value="name">Nom</option>
            <option value="calls">Trucades</option>
            <option value="deals">Negocis</option>
            <option value="revenue">Ingressos</option>
            <option value="satisfaction">Satisfacció</option>
          </select>
        </div>
      </div>
      <div class="reports-table">
        <table>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Trucades</th>
              <th>Hores</th>
              <th>Negocis</th>
              <th>Rate de Conversió</th>
              <th>Ingressos</th>
              <th>Satisfacció</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="agent in filteredAgents" :key="agent.id">
              <td class="agent-cell">
                <div class="agent-info">
                  <div class="agent-avatar-small">{{ agent.name.charAt(0) }}</div>
                  <div>
                    <div class="agent-name">{{ agent.name }}</div>
                    <div class="agent-department">{{ agent.department }}</div>
                  </div>
                </div>
              </td>
              <td>{{ agent.calls }}</td>
              <td>{{ formatHours(agent.hours) }}</td>
              <td>{{ agent.deals }}</td>
              <td>
                <div class="conversion-bar">
                  <div class="conversion-fill" :style="{ width: agent.conversionRate + '%' }"></div>
                  <span class="conversion-text">{{ agent.conversionRate }}%</span>
                </div>
              </td>
              <td class="revenue-cell">{{ formatCurrency(agent.revenue) }}</td>
              <td>
                <div class="satisfaction-rating" :class="getSatisfactionClass(agent.satisfaction)">
                  {{ agent.satisfaction }}% ⭐
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBankingStore } from '../stores/banking.js'
import { useCallsStore } from '../stores/calls.js'

export default {
  name: 'ReportsView',
  setup() {
    const router = useRouter()
    const bankingStore = useBankingStore()
    const callsStore = useCallsStore()

    // Control state
    const selectedPeriod = ref('week')
    const callChartType = ref('daily')
    const pipelineChartType = ref('stage')
    const performanceMetric = ref('calls')
    const revenuePeriod = ref('daily')
    const searchAgent = ref('')
    const sortBy = ref('revenue')

    // Mock data (production would come from API calls)
    const totalCalls = ref(1247)
    const totalOpportunities = ref(234087)
    const activeContacts = ref(423)
    const resolvedCases = ref(156)

    const callChange = ref(12)
    const opportunityChange = ref(-3)
    const contactChange = ref(8)
    const caseChange = ref(15)

    // Chart data
    const callsData = computed(() => [45, 52, 48, 61, 55, 67, 72, 68, 74, 81, 76, 69])
    const pipelineData = computed(() => [
      { stage: 'Prospecting', amount: 45000, count: 12, percentage: 75, color: '#f59e0b' },
      { stage: 'Qualification', amount: 23000, count: 8, percentage: 65, color: '#3b82f6' },
      { stage: 'Proposal', amount: 89000, count: 18, percentage: 45, color: '#8b5cf6' },
      { stage: 'Closed Won', amount: 77087, count: 15, percentage: 85, color: '#10b981' }
    ])

    const agentPerformance = computed(() => [
      { id: 1, name: 'Anna Garcia', metricLabel: 'Trucades', metricValue: '127', score: 95 },
      { id: 2, name: 'Carlos Ruiz', metricLabel: 'Trucades', metricValue: '98', score: 87 },
      { id: 3, name: 'María López', metricLabel: 'Trucades', metricValue: '89', score: 82 },
      { id: 4, name: 'David Martín', metricLabel: 'Trucades', metricValue: '76', score: 78 },
      { id: 5, name: 'Laura Sánchez', metricLabel: 'Trucades', metricValue: '72', score: 75 }
    ])

    const revenueData = computed(() => [12000, 18500, 23400, 18900, 25700, 31200, 28900, 34100, 29800, 36500, 41800, 39200])
    const revenueLabels = computed(() => ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Des'])

    const agentsTableData = computed(() => [
      {
        id: 1,
        name: 'Anna Garcia',
        department: 'Sales',
        calls: 127,
        hours: 7.5,
        deals: 8,
        conversionRate: 6.3,
        revenue: 23450,
        satisfaction: 98
      },
      {
        id: 2,
        name: 'Carlos Ruiz',
        department: 'Sales',
        calls: 98,
        hours: 6.8,
        deals: 6,
        conversionRate: 6.1,
        revenue: 18900,
        satisfaction: 92
      },
      {
        id: 3,
        name: 'María López',
        department: 'Support',
        calls: 89,
        hours: 7.2,
        deals: 3,
        conversionRate: 3.4,
        revenue: 15400,
        satisfaction: 95
      },
      {
        id: 4,
        name: 'David Martín',
        department: 'Sales',
        calls: 76,
        hours: 6.5,
        deals: 4,
        conversionRate: 5.3,
        revenue: 18200,
        satisfaction: 89
      },
      {
        id: 5,
        name: 'Laura Sánchez',
        department: 'Support',
        calls: 72,
        hours: 7.0,
        deals: 2,
        conversionRate: 2.8,
        revenue: 12300,
        satisfaction: 94
      }
    ])

    const filteredAgents = computed(() => {
      let filtered = agentsTableData.value

      if (searchAgent.value) {
        filtered = filtered.filter(agent =>
          agent.name.toLowerCase().includes(searchAgent.value.toLowerCase())
        )
      }

      return filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'name': return a.name.localeCompare(b.name)
          case 'calls': return b.calls - a.calls
          case 'deals': return b.deals - a.deals
          case 'revenue': return b.revenue - a.revenue
          case 'satisfaction': return b.satisfaction - a.satisfaction
          default: return 0
        }
      })
    })

    // Methods
    const goBack = () => {
      router.push('/dashboard')
    }

    const getChangeClass = (change) => {
      return change >= 0 ? 'positive' : 'negative'
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ca-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    }

    const formatHours = (hours) => {
      return `${hours}h`
    }

    const getSatisfactionClass = (rating) => {
      if (rating >= 90) return 'excellent'
      if (rating >= 80) return 'good'
      if (rating >= 70) return 'average'
      return 'poor'
    }

    const exportReport = () => {
      // Mock export functionality
      alert('Exportant report...')
    }

    onMounted(() => {
      // Load report data on mount
      console.log('Reports loaded')
    })

    return {
      selectedPeriod,
      callChartType,
      pipelineChartType,
      performanceMetric,
      revenuePeriod,
      searchAgent,
      sortBy,
      totalCalls,
      totalOpportunities,
      activeContacts,
      resolvedCases,
      callChange,
      opportunityChange,
      contactChange,
      caseChange,
      callsData,
      pipelineData,
      agentPerformance,
      revenueData,
      revenueLabels,
      filteredAgents,
      goBack,
      getChangeClass,
      formatCurrency,
      formatHours,
      getSatisfactionClass,
      exportReport
    }
  }
}
</script>

<style scoped>
.reports-view {
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

.reports-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reports-title h1 {
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

.period-select, .search-input, .sort-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
}

.export-btn {
  padding: 10px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.export-btn:hover {
  background: #059669;
}

.overview-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.card-content {
  flex: 1;
}

.card-number {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.card-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.card-change {
  font-size: 12px;
  font-weight: 500;
}

.card-change.positive {
  color: #10b981;
}

.card-change.negative {
  color: #ef4444;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-select {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  background: white;
  color: #374151;
}

.chart-content {
  height: 200px;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
}

.bar-chart {
  display: flex;
  align-items: end;
  height: 160px;
  gap: 8px;
}

.bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.bar-fill {
  background: linear-gradient(to top, #1e40af, #3b82f6);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  width: 100%;
  transition: height 0.3s ease;
}

.bar-label {
  position: absolute;
  bottom: -20px;
  font-size: 11px;
  color: #6b7280;
}

.bar-value {
  position: absolute;
  top: -20px;
  font-size: 11px;
  font-weight: 500;
  color: #1f2937;
}

.pipeline-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.pipeline-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pipeline-bar {
  width: 120px;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.pipeline-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.pipeline-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pipeline-stage {
  font-weight: 500;
  color: #1f2937;
}

.pipeline-amount {
  font-weight: 600;
  color: #1f2937;
}

.pipeline-count {
  font-size: 12px;
  color: #6b7280;
}

.performance-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.performance-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.agent-rank {
  width: 24px;
  height: 24px;
  background: #1e40af;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.agent-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.agent-info {
  flex: 1;
}

.agent-name {
  font-weight: 500;
        color: #1f2937;
}

.agent-metric {
  font-size: 12px;
  color: #6b7280;
}

.agent-score {
  padding: 4px 8px;
  background: #10b981;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.revenue-chart {
  position: relative;
  height: 100%;
}

.revenue-line {
  position: relative;
  height: 120px;
  width: 100%;
  border-bottom: 2px solid #e5e7eb;
}

.line-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  transform: translate(-50%, 50%);
}

.revenue-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.revenue-label {
  font-size: 11px;
  color: #6b7280;
}

.reports-table-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  width: 200px;
}

.reports-table {
  overflow-x: auto;
}

.reports-table table {
  width: 100%;
  border-collapse: collapse;
}

.reports-table th,
.reports-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.reports-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.reports-table td {
  font-size: 14px;
  color: #374151;
}

.agent-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-avatar-small {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
}

.agent-name {
  font-weight: 500;
  color: #1f2937;
}

.agent-department {
  font-size: 12px;
  color: #6b7280;
}

.conversion-bar {
  position: relative;
  width: 80px;
  height: 16px;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.conversion-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 8px;
  transition: width 0.3s ease;
}

.conversion-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.revenue-cell {
  font-weight: 600;
  color: #10b981;
}

.satisfaction-rating {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
}

.satisfaction-rating.excellent {
  background: #10b981;
  color: white;
}

.satisfaction-rating.good {
  background: #fbbf24;
  color: white;
}

.satisfaction-rating.average {
  background: #f59e0b;
  color: white;
}

.satisfaction-rating.poor {
  background: #ef4444;
  color: white;
}

@media (max-width: 1200px) {
  .overview-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .reports-view {
    margin-left: 0;
    padding: 20px;
  }

  .overview-section {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .table-actions {
    flex-direction: column;
    gap: 8px;
  }

  .search-input {
    width: 100%;
  }
}
</style>
