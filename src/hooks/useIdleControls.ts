'use client'

import { useEffect, useState } from 'react'

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'pointerdown', 'touchstart', 'keydown'] as const

export default function useIdleControls(enabled: boolean, idleMs = 1700) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!enabled) {
      setVisible(true)
      return
    }

    let timeoutId = 0

    const scheduleHide = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => setVisible(false), idleMs)
    }

    const onActivity = () => {
      setVisible(true)
      scheduleHide()
    }

    scheduleHide()
    ACTIVITY_EVENTS.forEach((event) => document.addEventListener(event, onActivity, { passive: true }))

    return () => {
      window.clearTimeout(timeoutId)
      ACTIVITY_EVENTS.forEach((event) => document.removeEventListener(event, onActivity))
    }
  }, [enabled, idleMs])

  return visible
}
