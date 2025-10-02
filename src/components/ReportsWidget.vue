<template>
  <div
    ref="elementRef"
    class="reports-widget"
    :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
  >
    <div class="widget-header"
       @mousedown="startDrag"
       @touchstart="startDrag"
       @click.stop>
      <div class="drag-indicator">
        <font-awesome-icon icon="grip-vertical" />
      </div>
      <h3><font-awesome-icon icon="chart-bar" /> Reports XaviBank</h3>
      <div class="widget-controls" @click.stop @mousedown.stop @touchstart.stop>
        <router-link to="/reports" class="view-all-link" @click.stop>
          <font-awesome-icon icon="external-link-alt" />
        </router-link>
        <button class="close-btn" @click.stop="closeWidget"><font-awesome-icon icon="times" /></button>
      </div>
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
                  stroke="#3b82f6"
                  stroke-width="2"
                  fill="none"
                />
                <polygon
                  :points="generateFillPath(revenueSpark)"
                  fill="url(#revenueGradient)"
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.6" />
                    <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1" />
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
            <div class="performer-avatar">
              <img :src="getAgentAvatar(agent)" :alt="agent.name" class="agent-avatar-img" @error="setFallbackAvatar" />
              <span class="avatar-fallback">{{ agent.name.charAt(0) }}</span>
            </div>
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
import { useDraggableWidget } from '../composables/useDraggable.js'

export default {
  name: 'ReportsWidget',
  emits: ['closeWidget'],
  setup(props, { emit }) {
    // Initialize draggable functionality
    const { position, elementRef, startDrag } = useDraggableWidget('reports-widget', { x: 0, y: 0 })
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

    // Agent avatar methods
    const agentAvatars = {
      'Anna Garcia': '/images/agent-anna.jpg',
      'Carlos Ruiz': '/images/agent-carlos.jpg',
      'María López': '/images/agent-maria.jpg'
    }

    const getAgentAvatar = (agent) => {
      return agentAvatars[agent.name] || '/images/agent-default.jpg'
    }

    const setFallbackAvatar = (event) => {
      const img = event.target
      const fallback = img.nextElementSibling
      img.style.display = 'none'
      fallback.style.display = 'flex'
    }

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

    const closeWidget = () => {
      // Emit to parent component to handle closing
      emit('closeWidget')
    }

    return {
      // Draggable properties
      position,
      elementRef,
      startDrag,
      // Component data
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
      exportQuickReport,
      closeWidget,
      getAgentAvatar,
      setFallbackAvatar
    }
  }
}
</script>

<style scoped>
.reports-widget {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  width: 380px;
  height: 500px;
  min-height: 500px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 9999;
  cursor: default;
  transition: transform 0.1s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.reports-widget:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.reports-widget.dragging {
  transform: rotate(2deg);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  cursor: grabbing;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px 8px 12px;
  border-bottom: 1px solid #f3f4f6;
  background: linear-gradient(135deg, #0e7490, #22d3ee);
  color: white;
  border-radius: 8px 8px 0 0;
  cursor: move;
  user-select: none;
  flex-shrink: 0;
  min-height: 40px;
}

.drag-indicator {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-right: 8px;
}

.widget-header:hover .drag-indicator {
  color: white;
}

.widget-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.view-all-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;
}

.view-all-link:hover {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  transform: scale(1.05);
}

.widget-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  color: white;
  transform: scale(1.05);
}

.widget-content {
  padding: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  overflow-x: hidden;
}

.metrics-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
}

.metric-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #0e7490 0%, #22d3ee 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
}

.reward-info,
.metric-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.metric-value {
  font-size: 12px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.metric-label {
  font-size: 8px;
  color: #6b7280;
  margin-bottom: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.metric-change {
  font-size: 7px;
  font-weight: 600;
}

.metric-change.positive {
  color: #3b82f6;
}

.metric-change.negative {
  color: #ef4444;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.mini-chart {
  background: #f9fafb;
  border-radius: 6px;
  padding: 6px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  font-size: 8px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chart-container {
  height: 30px;
  display: flex;
  align-items: end;
}

.sparkline {
  display: flex;
  align-items: end;
  height: 30px;
  gap: 2px;
  width: 100%;
}

.spark-bar {
  flex: 1;
  background: linear-gradient(to top, #0e7490, #22d3ee);
  border-radius: 1px 1px 0 0;
  min-height: 2px;
  transition: height 0.3s ease;
}

.revenue-sparkline {
  width: 100%;
  height: 30px;
}

.sparkline-svg {
  width: 100%;
  height: 30px;
}

.performers-section {
  background: #f9fafb;
  border-radius: 6px;
  padding: 6px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.section-title {
  font-size: 8px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.section-period {
  font-size: 6px;
  color: #6b7280;
  white-space: nowrap;
  flex-shrink: 0;
}

.performers-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.performer-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  background: white;
  border-radius: 4px;
}

.performer-rank {
  width: 14px;
  height: 14px;
  background: #0e7490;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;
  flex-shrink: 0;
}

.performer-avatar {
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #0e7490, #22d3ee);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
}

.agent-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.avatar-fallback {
  display: none;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;
}

.performer-info {
  flex: 1;
}

.performer-name {
  font-size: 8px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.performer-metric {
  font-size: 6px;
  color: #6b7280;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.performer-value {
  font-size: 8px;
  font-weight: 600;
  color: #3b82f6;
  flex-shrink: 0;
  white-space: nowrap;
}

.indicators-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.indicator-item {
  background: #f9fafb;
  border-radius: 6px;
  padding: 4px;
}

.indicator-label {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 7px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.indicator-value {
  font-size: 10px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2px;
  white-space: nowrap;
}

.indicator-progress {
  display: flex;
  align-items: center;
  gap: 4px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0e7490, #22d3ee);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-fill.success {
  background: linear-gradient(90deg, #0f172a 0%, #1e40af 25%, #3b82f6 50%, #1e40af 75%, #0f172a 100%);
}

.progress-text {
  font-size: 7px;
  font-weight: 600;
  color: #6b7280;
}

.widget-actions {
  padding: 6px 8px 8px 8px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  flex: 1;
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: none;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  background: #0e7490;
  color: white;
}

.action-btn.primary:hover {
  background: #0891b2;
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
