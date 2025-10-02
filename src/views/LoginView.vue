<template>
  <div class="login-container">
    <!-- Columna esquerra: Formulari -->
    <div class="login-left">
      <div class="login-content">
        <h1 class="login-title">Login</h1>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">EMAIL</label>
            <input
              v-model="username"
              type="email"
              id="username"
              required
              placeholder="agent@xavibank.com"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">PASSWORD</label>
            <input
              v-model="password"
              type="password"
              id="password"
              required
              placeholder="••••••••"
              class="form-input"
            />
          </div>

          <a href="#" class="forgot-password">Forgot password?</a>

          <button type="submit" :disabled="isLoading" class="login-btn">
            {{ isLoading ? 'Iniciant sessió...' : 'Login' }}
          </button>
        </form>

        <div class="register-link">
          Don't have an account? <a href="#">Register</a>
        </div>
      </div>
    </div>

    <!-- Columna dreta: Branding XaviBank -->
    <div class="login-right">
      <div class="brand-content">
        <div class="bank-logo">
          <div class="bank-initials">XB</div>
          <div class="bank-name">XaviBank</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const username = ref('agent@xavibank.com')
    const password = ref('password')


    const isLoading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      isLoading.value = true
      error.value = ''

      try {
        const result = await authStore.login(username.value, password.value)

        if (result.success) {
          router.push({ name: 'Dashboard' })
        } else {
          error.value = result.message
        }
      } catch (err) {
        error.value = 'Error en l\'autenticació. Torna-ho a intentar.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      username,
      password,
      isLoading,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
}

.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 2rem;
}

.login-right {
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e40af 25%, #3b82f6 50%, #1e40af 75%, #0f172a 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-right::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(30, 64, 175, 0.15) 0%, transparent 50%);
  z-index: 1;
}

.login-content {
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 2.5rem;
  font-weight: 300;
  color: #1a202c;
  margin-bottom: 3rem;
  text-align: center;
  letter-spacing: -0.02em;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.forgot-password {
  display: inline-block;
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 1.5rem;
}

.login-btn:hover:not(:disabled) {
  background: #2563eb;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.register-link a {
  color: #3b82f6;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

.brand-content {
  text-align: center;
  color: white;
  position: relative;
  z-index: 2;
}

.bank-logo {
  margin-bottom: 2rem;
}

.bank-initials {
  font-size: 4rem;
  font-weight: 200;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
  line-height: 1;
}

.bank-name {
  font-size: 1.5rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.05em;
}

/* Responsive */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-left,
  .login-right {
    flex: none;
    min-height: 50vh;
  }

  .bank-initials {
    font-size: 3rem;
  }

  .login-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
}
</style>
