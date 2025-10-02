<template>
  <div class="reports-widget">
    <div class="widget-header">
      <h3><font-awesome-icon icon="chart-bar" /> Reports XaviBank</h3>
      <router-link to="/reports" class="view-all-link">
        <font-awesome-icon icon="external-link-alt" />
      </router-link>
    </div>

    <div class="widget-content">
      <!-- Key Metrics -->
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-icon">
            <font-awesome-icon icon="phone" />
          </div>
          <div class="reward-info">
            <div class="metric-value">{{ totalCalls }}</div>
            <div class="metric-label">Trucades</div>
            <div class="metric-change" :class="getChangeClass(callChange)">
              {{ callChange > 0 ? '+' : '' }}{{ callChange }}%
            </div>
          </div>
        </div>

        <div class="metric-item">
          <div class="metric-icon">
            <font-awesome-icon icon="handshake" />
          </div>
          <div class="metric-info">
            <div class="metric-value">{{ formatCurrency(totalRevenue) }}</div>
            <div class="metric-label">Ingressos</div>
            <div class="metric-change" :class="getChangeClass(revenueChange)">
              {{ revenueChange > 0 ? '+' : '' }}{{ revenueChange }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Charts -->
      <div class="charts-row">
        <!-- Small Call Chart -->
        <div class="mini-chart">
          <div class="chart-header">
            <span>Trucades Setmana</span>
          </div>
          <div class="chart-container">
            <div class="sparkline">
              <div v-for="(value, index) in weeklyCalls" :key="index"
                   class="spark-bar"
                   :style="{ height: (value / Math.max(...weeklyCalls)) * 100 + '%' }">
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Trend -->
        <div class="mini-chart">
          <div class="chart-header">
            <span>Tendència Ingressos</span>
          </div>
          <div class="chart-container">
            <div class="revenue-sparkline">
              <svg width="100%" height="40" viewBox="0 0 100 40" class="sparkline-svg">
                <path
                  :d="generateSparkPath(revenueSpark)"
                  stroke="#10b981"
                  stroke-width="2"
                  fill="none"
                />
                <polygon
                  :points="generateFillPath(revenueSpark)"
                  fill="url(#revenueGradient)"
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.6" />
                    <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Performers -->
      <div class="performers-section">
        <div class="section-header">
          <span class="section-title">Top Agents</span>
          <span class="section-period">Setmana</span>
        </div>
        <div class="performers-list">
          <div v-for="(agent, index) in topAgents" :key="agent.id" class="performer-item">
            <div class="performer-rank">{{ index + 1 }}º</div>
            <div class="performer-avatar">{{ agent.name.charAt(0) }}</div>
            <div class="performer-info">
              <div class="performer-name">{{ agent.name }}</div>
              <div class="performer-metric">{{ agent.calls }} trucades</div>
            </div>
            <div class="performer-value">{{ formatCurrency(agent.revenue) }}</div>
          </div>
        </div>
      </div>

      <!-- Performance Indicators -->
      <div class="indicators-section">
        <div class="indicator-item">
          <div class="indicator-label">
            <font-awesome-icon icon="calendar-check" />
            Cases Resolts
          </div>
          <div class="indicator-value">{{ resolvedCases }}</div>
          <div class="indicator-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: caseResolutionRate + '%' }"></div>
            </div>
            <span class="progress-text">{{ caseResolutionRate }}%</span>
          </div>
        </div>

        <div class="indicator-item">
          <div class="indicator-label">
            <font-awesome-icon icon="clock" />
            Temps Resposta Mitjà
          </div>
          <div class="indicator-value">{{ averageResponseTime }}m</div>
          <div class="indicator-progress">
            <div class="progress-bar">
              <div class="progress-fill success" :style="{ width: responseTimeScore + '%' }"></div>
            </div>
            <span class="progress-text">{{ responseTimeScore }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="widget-actions">
      <button @click="exportQuickReport" class="action-btn secondary">
        <font-awesome-icon icon="download" />
        Exportar
      </button>
      <router-link to="/reports" class="action-btn primary">
        <font-awesome-icon icon="chart-line" />
        Veure Completo
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useBankingStore } from '../stores/banking.js'
import { useCallsStore } from '../stores/calls.js'

export default {
  name: 'ReportsWidget',
  setup() {
    const bankingStore = useBankingStore()
    const callsStore = useCallsStore()

    // Mock data (in production would come from API)
    const totalCalls = ref(1247)
    const totalRevenue = ref(234087)
    const resolvedCases = ref(156)
    const averageResponseTime = ref(4.2)

    const callChange = ref(12)
    const revenueChange = ref(-3)

    const weeklyCalls = computed(() => [45, 52, 48, 61, 55, 67, 72])
    const revenueSpark = computed(() => [0.1, 0.3, 0.2, 0.5, 0.7, 0.6, 0.8])

    const topAgents = computed(() => [
      { id: 1, name: 'Anna Garcia', calls: 127, revenue: 23450 },
      { id: 2, name: 'Carlos Ruiz', calls: 98, revenue: 18900 },
      { id: 3, name: 'María López', calls: 89, revenue: 15400 }
    ])

    const caseResolutionRate = computed(() => 78)
    const responseTimeScore = computed(() => 85)

    // Methods
    const getChangeClass = (change) => {
      return change >= 0 ? 'positive' : 'negative'
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('ca-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
      }).format(amount)
    }

    const generateSparkPath = (data) => {
      const width = 100
      const height = 40
      const stepX = width / (data.length - 1)

      return data.map((value, index) => {
        const x = index * stepX
        const y = height - (value * height)
        const command = index === 0 ? 'M' : 'L'
      return `${command} ${x} ${y}`
      }).join(' ')
    }

    const generateFillPath = (data) => {
      const width = 100
      const height = 40
      const stepX = width / (data.length - 1)

      let points = data.map((value, index) => {
        const x = index * stepX
        const y = height - (value * height)
        return `${x},${y}`
      })

      // Add bottom points for fill
      points.push(`100,40`)
      points.push(`0,40`)

      return points.join(' ')
    }

    const exportQuickReport = () => {
      // Mock export functionality
      alert('Exportant report ràpid...')
    }

    return {
      totalCalls,
      totalRevenue,
      resolvedCases,
      averageResponseTime,
      callChange,
      revenueChange,
      weeklyCalls,
      revenueSpark,
      topAgents,
      caseResolutionRate,
      responseTimeScore,
      getChangeClass,
      formatCurrency,
      generateSparkPath,
      generateFillPath,
      exportQuickReport
    }
  }
}
</script>

<style scoped>
.reports-widget {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.widget-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-all-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s ease;
}

.view-all-link:hover {
  background: #1e40af;
  color: white;
  border-color: #1e40af;
}

.widget-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.metrics-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.metric-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.metric-info {
  flex: 1;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2px;
}

.metric-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.metric-change {
  font-size: 11px;
  font-weight: 600;
}

.metric-change.positive {
  color: #10b981;
}

.metric-change.negative {
  color: #ef4444;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.mini-chart {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.chart-container {
  height: 40px;
  display: flex;
  align-items: end;
}

.sparkline {
  display: flex;
  align-items: end;
  height: 40px;
  gap: 3px;
  width: 100%;
}

.spark-bar {
  flex: 1;
  background: linear-gradient(to top, #1e40af, #3b82f6);
  border-radius: 1px 1px 0 0;
  min-height: 2px;
  transition: height 0.3s ease;
}

.revenue-sparkline {
  width: 100%;
  height: 40px;
}

.sparkline-svg {
  width: 100%;
  height: 40px;
}

.performers-section {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.section-period {
  font-size: 10px;
  color: #6b7280;
}

.performers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.performer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: white;
  border-radius: 6px;
}

.performer-rank {
  width: 18px;
  height: 18px;
  background: #1e40af;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}

.performer-avatar {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}

.performer-info {
  flex: 1;
}

.performer-name {
  font-size: 11px;
  font-weight: 500;
  color: #1f2937;
}

.performer-metric {
  font-size: 10px;
  color: #6b7280;
}

.performer-value {
  font-size: 11px;
  font-weight: 600;
  color: #10b981;
}

.indicators-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.indicator-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 10px;
}

.indicator-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.indicator-value {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 6px;
}

.indicator-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1e40af, #3b82f6);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill.success {
  background: linear-gradient(90deg, #10b981, #059669);
}

.progress-text {
  font-size: 10px;
  font-weight: 600;
  color: #6b7280;
}

.widget-actions {
  padding: 16px 20px 20px 20px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  text-decoration: none;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
}

.action-btn.primary {
  background: #1e40af;
  color: white;
}

.action-btn.primary:hover {
  background: #1e3a8a;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .metrics-row, .charts-row {
    grid-template-columns: 1fr;
  }

  .widget-actions {
    flex-direction: column;
  }
}
</style>
