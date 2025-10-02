<template>
  <aside class="ninja-sidebar">
    <!-- Logo Section -->
    <div class="sidebar-header">
      <div class="logo-container">
        <div class="logo-icon">∞</div>
        <div class="logo-text">500 apps</div>
      </div>
      <div class="app-tabs">
        <button class="tab-btn active">All Apps</button>
        <button class="tab-btn">My Apps</button>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <!-- Dashboard -->
      <div class="nav-section">
        <router-link to="/dashboard" class="nav-section-header">
          <div class="nav-icon"><font-awesome-icon icon="chart-line" /></div>
          <span>Dashboard</span>
        </router-link>
      </div>

      <!-- Clients - Core CRM -->
      <div class="nav-section expanded">
        <div class="nav-section-header">
          <div class="nav-icon"><font-awesome-icon icon="users" /></div>
          <span>Clients</span>
          <div class="expand-icon"><font-awesome-icon icon="chevron-down" /></div>
        </div>
        <div class="nav-submenu">
          <router-link to="/accounts" class="submenu-item">
            <font-awesome-icon icon="building" /> Accounts
          </router-link>
          <router-link to="/contacts" class="submenu-item">
            <font-awesome-icon icon="user-circle" /> Contactes
          </router-link>
          <router-link to="/leads" class="submenu-item">
            <font-awesome-icon icon="bullseye" /> Leads
          </router-link>
        </div>
      </div>

      <!-- Sales Pipeline -->
      <div class="nav-section expanded">
        <div class="nav-section-header">
          <div class="nav-icon"><font-awesome-icon icon="dollar-sign" /></div>
          <span>Vendes</span>
          <div class="expand-icon"><font-awesome-icon icon="chevron-down" /></div>
        </div>
        <div class="nav-submenu">
          <router-link to="/opportunities" class="submenu-item">
            <font-awesome-icon icon="handshake" /> Oportunitats
          </router-link>
          <router-link to="/deals" class="submenu-item">
            <font-awesome-icon icon="exchange-alt" /> Negocis
          </router-link>
          <router-link to="/quotes" class="submenu-item">
            <font-awesome-icon icon="file-invoice" /> Pressupostos
          </router-link>
        </div>
      </div>

      <!-- Support -->
      <div class="nav-section expanded">
        <div class="nav-section-header">
          <div class="nav-icon"><font-awesome-icon icon="headphones" /></div>
          <span>Suport</span>
          <div class="expand-icon"><font-awesome-icon icon="chevron-down" /></div>
        </div>
        <div class="nav-submenu">
          <router-link to="/cases" class="submenu-item">
            <font-awesome-icon icon="address-book" /> Cases
          </router-link>
          <router-link to="/dashboard" class="submenu-item active">
            <font-awesome-icon icon="comments" /> Ninjachat
          </router-link>
        </div>
      </div>

      <!-- Banking Operations -->
      <div class="nav-section expanded">
        <div class="nav-section-header">
          <div class="nav-icon"><font-awesome-icon icon="university" /></div>
          <span>Banking</span>
          <div class="expand-icon"><font-awesome-icon icon="chevron-down" /></div>
        </div>
        <div class="nav-submenu">
          <router-link to="/credit-reviews" class="submenu-item">
            <font-awesome-icon icon="search-dollar" /> Valoracions Crèdit
          </router-link>
          <router-link to="/banking-products" class="submenu-item">
            <font-awesome-icon icon="piggy-bank" /> Productes Bancaris
          </router-link>
          <router-link to="/accounts-banking" class="submenu-item">
            <font-awesome-icon icon="wallet" /> Accounts Bancaris
          </router-link>
        </div>
      </div>

      <!-- Reports & Analytics -->
      <div class="nav-section">
        <router-link to="/reports" class="nav-section-header">
          <div class="nav-icon"><font-awesome-icon icon="chart-bar" /></div>
          <span>Informes</span>
        </router-link>
      </div>

      <!-- Settings -->
      <div class="nav-section">
        <router-link to="/settings" class="nav-section-header">
          <div class="nav-icon"><font-awesome-icon icon="cog" /></div>
          <span>Configuració</span>
        </router-link>
      </div>
    </nav>

    <!-- User Section -->
    <div class="sidebar-footer">
      <div class="user-controls">
        <button class="control-btn"><font-awesome-icon icon="edit" /></button>
        <div class="user-avatar">
            <font-awesome-icon icon="user-circle" />
        </div>
        <button class="control-btn"><font-awesome-icon icon="gear" /></button>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'NinjaSidebar'
}
</script>

<style scoped>
.ninja-sidebar {
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #1e40af 0%, #0f172a 100%);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #1e40af;
  font-size: 18px;
}

.logo-text {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.app-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 8px 12px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: white;
  color: #1e40af;
}

.tab-btn:hover:not(.active) {
  color: white;
}

.sidebar-nav {
  flex: 1;
  padding: 20px;
}

.nav-section {
  margin-bottom: 8px;
}

.nav-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;

  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;

  transition: all 0.2s ease;
  position: relative;
}

.nav-section-header:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.expand-icon {
  margin-left: auto;
  font-size: 12px;
}

.nav-submenu {
  margin-top: 4px;
  margin-left: 32px;
}

.submenu-item {
  display: block;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 13px;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.submenu-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.submenu-item.active {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.control-btn {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  background: rgba(255, 255, 255, 0.1);
}
</style>