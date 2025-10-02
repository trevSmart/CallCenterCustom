<template>
  <aside class="ninja-sidebar">
    <!-- Logo Section -->
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="/images/logo.png" alt="Logo" class="logo-image" />
        <div class="logo-text">XaviBank CRM</div>
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
            <font-awesome-icon icon="comments" /> Veolia Chat
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
  background: linear-gradient(135deg, #0f172a 0%, #1e40af 25%, #3b82f6 50%, #1e40af 75%, #0f172a 100%);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
  overflow: hidden;
}

.ninja-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 70%),
    radial-gradient(circle at 80% 80%, rgba(30, 64, 175, 0.05) 0%, transparent 70%);
  z-index: 1;
}

.sidebar-header {
  padding: 32px 20px;
  position: relative;
  z-index: 2;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.logo-image {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 12px;
}

.logo-text {
  color: white;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.5px;
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
  color: #0e7490;
}

.tab-btn:hover:not(.active) {
  color: white;
}

.sidebar-nav {
  flex: 1;
  padding: 20px;
  position: relative;
  z-index: 2;
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
  text-decoration: none;
}

.nav-section-header:hover {
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}

.nav-section-header:active,
.nav-section-header:focus {
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
  outline: none;
}

.nav-section-header.router-link-active {
  background: rgba(34, 211, 238, 0.2);
  color: white;
  text-decoration: none;
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
  text-decoration: none;
}

.submenu-item:active,
.submenu-item:focus {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
  outline: none;
}

.submenu-item.router-link-active {
  color: white;
  background: rgba(34, 211, 238, 0.2);
  text-decoration: none;
}

.submenu-item.active {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

/* Dark theme styles for sidebar */
.dark-theme .sidebar-header {
  padding: 32px 20px;
}

.dark-theme .logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.dark-theme .logo-text {
  color: white;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.5px;
}

.dark-theme .brand-text {
  color: #f8fafa;
}

.dark-theme .nav-section-header {
  color: white;
}

.dark-theme .nav-section-header:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}

.dark-theme .nav-section-header:active,
.dark-theme .nav-section-header:focus {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
  outline: none;
}

.dark-theme .nav-section-header.router-link-active {
  color: white;
  background: rgba(34, 211, 238, 0.2);
  text-decoration: none;
}

.dark-theme .submenu-item {
  color: rgba(255, 255, 255, 0.7);
}

.dark-theme .submenu-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}

.dark-theme .submenu-item:active,
.dark-theme .submenu-item:focus {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
  outline: none;
}

.dark-theme .submenu-item.router-link-active {
  color: white;
  background: rgba(34, 211, 238, 0.2);
  text-decoration: none;
}
</style>