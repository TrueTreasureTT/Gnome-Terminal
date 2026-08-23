import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TerminalSession } from './TerminalSession'
import TabBar from './TabBar'
import { shortcuts } from './shortcuts'

type Props = {
  url: string
  onStatus?: (connected: boolean) => void
}

const Terminal: React.FC<Props> = ({ url, onStatus }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sessionsRef = useRef<TerminalSession[]>([])
  const nextId = useRef(1)
  const [activeId, setActiveId] = useState(0)
  const [activeConnected, setActiveConnected] = useState(false)
  const [, forceRender] = useState(0)

  const createSession = useCallback(() => {
    const session = new TerminalSession(nextId.current++, url)
    sessionsRef.current.push(session)

    session.connect(
      () => {
        setActiveConnected(false)
        forceRender((value) => value + 1)
      },
      (connected) => {
        if (session.id === activeId || sessionsRef.current.length === 1) {
          setActiveConnected(connected)
          onStatus?.(connected)
        }
      },
    )

    session.term.onTitleChange((title) => {
      session.title = title || 'Terminal'
      forceRender((value) => value + 1)
    })

    return session
  }, [url, onStatus, activeId])

  const closeSession = useCallback((id: number) => {
    const sessions = sessionsRef.current
    const index = sessions.findIndex((session) => session.id === id)
    if (index < 0) return

    const [session] = sessions.splice(index, 1)
    session.dispose()

    if (sessions.length === 0) {
      const replacement = createSession()
      setActiveId(replacement.id)
      setActiveConnected(false)
    } else if (activeId === id) {
      const replacement = sessions[Math.max(0, index - 1)]
      setActiveId(replacement.id)
      const connected = replacement.ws.readyState === WebSocket.OPEN
      setActiveConnected(connected)
      onStatus?.(connected)
    }

    forceRender((value) => value + 1)
  }, [activeId, createSession, onStatus])

  const newSession = useCallback(() => {
    const session = createSession()
    setActiveId(session.id)
    setActiveConnected(false)
    onStatus?.(false)
    forceRender((value) => value + 1)
  }, [createSession, onStatus])

  useEffect(() => {
    const first = createSession()
    setActiveId(first.id)
    setActiveConnected(false)

    return () => {
      sessionsRef.current.forEach((session) => session.dispose())
      sessionsRef.current = []
      setActiveConnected(false)
      onStatus?.(false)
    }
  }, [createSession, onStatus])

  useEffect(() => {
    const active = sessionsRef.current.find((session) => session.id === activeId)
    const container = containerRef.current
    if (!active || !container) return

    setActiveConnected(active.ws.readyState === WebSocket.OPEN)

    if (!active.term.element) active.term.open(container)
    else if (active.term.element.parentElement !== container) container.appendChild(active.term.element)

    sessionsRef.current.forEach((session) => {
      if (session.term.element) {
        session.term.element.style.display = session.id === activeId ? 'block' : 'none'
      }
    })

    requestAnimationFrame(() => {
      active.resize()
      active.term.focus()
    })
  }, [activeId])

  useEffect(() => {
    const resize = () => {
      sessionsRef.current.forEach((session) => {
        if (session.term.element && session.term.element.style.display !== 'none') session.resize()
      })
    }

    const observer = containerRef.current ? new ResizeObserver(resize) : null
    if (containerRef.current && observer) observer.observe(containerRef.current)
    window.addEventListener('resize', resize)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (shortcuts.newTab(event)) {
        event.preventDefault()
        newSession()
        return
      }
      if (shortcuts.closeTab(event)) {
        event.preventDefault()
        if (activeId) closeSession(activeId)
        return
      }
      if (shortcuts.copy(event)) {
        const active = sessionsRef.current.find((session) => session.id === activeId)
        const selection = active?.term.getSelection()
        if (selection) {
          event.preventDefault()
          navigator.clipboard?.writeText(selection)
        }
        return
      }
      if (shortcuts.paste(event)) {
        const active = sessionsRef.current.find((session) => session.id === activeId)
        if (active) {
          event.preventDefault()
          navigator.clipboard?.readText().then((text) => active.term.paste(text)).catch(() => undefined)
        }
        return
      }
      if (shortcuts.zoomIn(event) || shortcuts.zoomOut(event) || shortcuts.resetZoom(event)) {
        const active = sessionsRef.current.find((session) => session.id === activeId)
        if (!active) return
        event.preventDefault()
        if (shortcuts.zoomIn(event)) active.term.options.fontSize = Math.min(32, (active.term.options.fontSize ?? 14) + 1)
        if (shortcuts.zoomOut(event)) active.term.options.fontSize = Math.max(8, (active.term.options.fontSize ?? 14) - 1)
        if (shortcuts.resetZoom(event)) active.term.options.fontSize = 14
        active.resize()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeId, closeSession, newSession])

  const status = activeConnected ? 'Connected' : 'Disconnected'

  return (
    <div className="terminal-shell">
      <TabBar
        sessions={sessionsRef.current}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id)
          const session = sessionsRef.current.find((item) => item.id === id)
          const connected = session?.ws.readyState === WebSocket.OPEN ?? false
          setActiveConnected(connected)
          onStatus?.(connected)
        }}
        onClose={closeSession}
        onNew={newSession}
      />
      <div className="terminal-container" ref={containerRef} />
      <div className={`terminal-status ${activeConnected ? 'connected' : 'disconnected'}`} aria-live="polite">
        <span className="status-indicator" aria-hidden="true" />
        <span>Status: {status}</span>
      </div>
    </div>
  )
}

export default Terminal
