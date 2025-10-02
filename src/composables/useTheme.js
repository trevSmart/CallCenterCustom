import { ref, onMounted, watch } from 'vue'

const THEME_STORAGE_KEY = 'theme-preference'

export function useTheme() {
  const isDarkMode = ref(false)

  // Function to toggle theme
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
    saveThemePreference()
  }

  // Function to apply theme to DOM
  const applyTheme = () => {
    const body = document.body
    const html = document.documentElement

    if (isDarkMode.value) {
      body.classList.add('dark-theme')
      html.classList.add('dark-theme')
    } else {
      body.classList.remove('dark-theme')
      html.classList.remove('dark-theme')
    }
  }

  // Function to save theme preference to localStorage
  const saveThemePreference = () => {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode.value ? 'dark' : 'light')
  }

  // Function to load theme preference from localStorage
  const loadThemePreference = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'dark') {
      isDarkMode.value = true
    } else if (savedTheme === 'light') {
      isDarkMode.value = false
    } else {
      // Default to light theme if no preference saved
      isDarkMode.value = false
    }
    applyTheme()
  }

  // Watch for theme changes and apply them
  watch(isDarkMode, () => {
    applyTheme()
  })

  // Initialize theme on mount
  onMounted(() => {
    loadThemePreference()
  })

  return {
    isDarkMode,
    toggleTheme,
    loadThemePreference
  }
}
