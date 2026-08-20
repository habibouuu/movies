'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type FullscreenCapableElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
  webkitRequestFullScreen?: () => Promise<void> | void
  mozRequestFullScreen?: () => Promise<void> | void
  msRequestFullscreen?: () => Promise<void> | void
}

type FullscreenCapableDocument = Document & {
  webkitFullscreenElement?: Element | null
  mozFullScreenElement?: Element | null
  msFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
  webkitCancelFullScreen?: () => void
  mozCancelFullScreen?: () => void
  msExitFullscreen?: () => void
}

const getFullscreenElement = () => {
  const doc = document as FullscreenCapableDocument
  return (
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement ||
    null
  )
}

const requestNativeFullscreen = async (element: HTMLElement) => {
  const el = element as FullscreenCapableElement
  if (el.requestFullscreen) {
    await el.requestFullscreen()
    return true
  }
  if (el.webkitRequestFullscreen) {
    await el.webkitRequestFullscreen()
    return true
  }
  if (el.webkitRequestFullScreen) {
    await el.webkitRequestFullScreen()
    return true
  }
  if (el.mozRequestFullScreen) {
    await el.mozRequestFullScreen()
    return true
  }
  if (el.msRequestFullscreen) {
    await el.msRequestFullscreen()
    return true
  }
  return false
}

export default function usePlayerFullscreen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cssFullscreen, setCssFullscreen] = useState(false)

  const enterFullscreen = useCallback(async () => {
    const container = containerRef.current
    if (!container) return

    const iframe = container.querySelector('iframe')
    const targets = [container, iframe].filter((el): el is HTMLElement => Boolean(el))

    for (const target of targets) {
      try {
        if (await requestNativeFullscreen(target)) return
      } catch {
        // iOS and some Android WebViews reject native fullscreen on iframes
      }
    }

    setCssFullscreen(true)
  }, [])

  const exitFullscreen = useCallback(async () => {
    setCssFullscreen(false)
    if (!getFullscreenElement()) return

    const doc = document as FullscreenCapableDocument
    try {
      if (doc.exitFullscreen) await doc.exitFullscreen()
      else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen()
      else if (doc.webkitCancelFullScreen) doc.webkitCancelFullScreen()
      else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen()
      else if (doc.msExitFullscreen) doc.msExitFullscreen()
    } catch {
      // already exited or unsupported
    }
  }, [])

  useEffect(() => {
    if (!cssFullscreen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCssFullscreen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [cssFullscreen])

  return {
    containerRef,
    cssFullscreen,
    enterFullscreen,
    exitFullscreen
  }
}
