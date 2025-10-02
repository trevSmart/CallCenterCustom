import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'

export function useDraggable(initialPosition = { x: 0, y: 0 }) {
  const position = reactive({ ...initialPosition })
  const isDragging = ref(false)
  const dragStart = ref({ x: 0, y: 0 })
  const elementRef = ref(null)
  const originalPosition = reactive({ ...initialPosition })

  const startDrag = (event) => {
    // Only start drag if clicking on the header or drag indicator
    if (!event.target.closest('.widget-header') && !event.target.closest('.drag-indicator')) {
      return
    }

    event.preventDefault()
    isDragging.value = true
    dragStart.value = {
      x: event.clientX - position.x,
      y: event.clientY - position.y
    }

      // Add dragging class for visual feedback
      if (elementRef.value) {
        elementRef.value.classList.add('dragging')
        // Ensure maximum z-index during drag
        elementRef.value.style.zIndex = '99999'
        // Don't apply cursor to entire body, just the dragging element
        elementRef.value.style.cursor = 'grabbing'
        document.body.classList.add('no-select')

        // Prevent text selection during drag
        event.preventDefault()
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

      // Ensure widgets can't go above the viewport
      position.x = Math.max(10, Math.min(position.x, maxX - 10))
      position.y = Math.max(10, Math.min(position.y, maxY - 10))
    }
  }

  const endDrag = () => {
    isDragging.value = false

    if (elementRef.value) {
      elementRef.value.classList.remove('dragging')
      // Reset z-index back to original
      elementRef.value.style.zIndex = ''
      // Reset cursor for the element
      elementRef.value.style.cursor = ''
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
