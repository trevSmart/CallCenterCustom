import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'

export function useDraggable(initialPosition = { x: 0, y: 0 }) {
  const position = reactive({ ...initialPosition })
  const isDragging = ref(false)
  const dragStart = ref({ x: 0, y: 0 })
  const elementRef = ref(null)
  const originalPosition = reactive({ ...initialPosition })

  const startDrag = (event) => {
    event.preventDefault()
    isDragging.value = true
    dragStart.value = {
      x: event.clientX - position.x,
      y: event.clientY - position.y
    }

    // Add dragging class for visual feedback
    if (elementRef.value) {
      elementRef.value.classList.add('dragging')
      document.body.style.cursor = '.dragging'
      document.body.classList.add('no-select')
    }
  }

  const onDrag = (event) => {
    if (!isDragging.value) return

    position.x = event.clientX - dragStart.value.x
    position.y = event.clientY - dragStart.value.y

    // Keep element within viewport bounds
    if (elementRef.value) {
      const rect = elementRef.value.getBoundingClientRect()
      const maxX = window.innerWidth - rect.width
      const maxY = window.innerHeight - rect.height

      position.x = Math.max(0, Math.min(position.x, maxX))
      position.y = Math.max(0, Math.min(position.y, maxY))
    }
  }

  const endDrag = () => {
    isDragging.value = false

    if (elementRef.value) {
      elementRef.value.classList.remove('dragging')
      document.body.style.cursor = ''
      document.body.classList.remove('no-select')
    }
  }

  const resetPosition = () => {
    position.x = originalPosition.x
    position.y = originalPosition.y
  }

  const savePosition = (key) => {
    const positions = JSON.parse(localStorage.getItem('widgetPositions') || '{}')
    positions[key] = { x: position.x, y: position.y }
    localStorage.setItem('widgetPositions', JSON.stringify(positions))
  }

  const loadPosition = (key) => {
    const positions = JSON.parse(localStorage.getItem('widgetPositions') || '{}')
    if (positions[key]) {
      position.x = positions[key].x
      position.y = positions[key].y
      originalPosition.x = positions[key].x
      originalPosition.y = positions[key].y
    }
  }

  onMounted(() => {
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', endDrag)
    document.addEventListener('touchmove', onDrag, { passive: false })
    document.addEventListener('touchend', endDrag)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', endDrag)
    document.removeEventListener('touchmove', onDrag)
    document.removeEventListener('touchend', endDrag)
  })

  return {
    position,
    isDragging,
    elementRef,
    startDrag,
    resetPosition,
    savePosition,
    loadPosition
  }
}

// Composable específico para widgets con posiciones fijas
export function useDraggableWidget(widgetKey, defaultPosition = { x: 0, y: 0 }) {
  const draggable = useDraggable(defaultPosition)

  // Load saved position on mount
  onMounted(() => {
    draggable.loadPosition(widgetKey)
  })

  // Save position when dragging ends
  const { isDragging } = draggable
  let timeoutId = null

  watch(isDragging, (isDragging) => {
    if (!isDragging) {
      // Debounce saving to avoid too many localStorage writes
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        draggable.savePosition(widgetKey)
      }, 300)
    }
  })

  return draggable
}
