import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TerminalSession } from './TerminalSession'
import TabBar from './TabBar'
import { shortcuts } from './shortcuts'

type Props = { url: string }

const Terminal: React.FC<Props> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sessionsRef = useRef<TerminalSession[]>([])
  const nextId = useRef(1)
  const [activeId, setActiveId] = useState(0)
  const [, forceRender] = useState(0)

  const createSession = useCallback(() => {
    const session = new TerminalSession(nextId.current++, url)
    sessionsRef.current.push(session)
    session.connect(() => forceRender((value) => value + 1))
    session.term.onTitleChange((title) => {
      session.title = title || 'Terminal'
      forceRender((value) => value + 1)
    })
    return session
  }, [url])

  const closeSession = useCallback((id: number) => {
    const sessions = sessionsRef.current
    const index = sessions.findIndex((session) => session.id === id)
    if (index < 0) return

    const [session] = sessions.splice(index, 1)
    session.dispose()

    if (sessions.length === 0) {
      const replacement = createSession()
      setActiveId(replacement.id)
    } else if (activeId === id) {
      setActiveId(sessions[Math.max(0, index - 1)].id)
    }
    forceRender((value) => value + 1)
  }, [activeId, createSession])

  const newSession = useCallback(() => {
    const session = createSession()
    setActiveId(session.id)
    forceRender((value) => value + 1)
  }, [createSession])

  useEffect(() => {
    const first = createSession()
    setActiveId(first.id)

    return () => {
      sessionsRef.current.forEach((session) => session.dispose())
      sessionsRef.current = []
    }
  }, [createSession])

  useEffect(() => {
    const active = sessionsRef.current.find((session) => session.id === activeId)
    const container = containerRef.current
    if (!active || !container) return

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

  const active = sessionsRef.current.find((session) => session.id === activeId)
  const connected = active?.ws.readyState === WebSocket.OPEN
  const status = connected ? 'Connected' : 'Disconnected'

  return (
    <div className="terminal-shell">
      <TabBar
        sessions={sessionsRef.current}
        activeId={activeId}
        onSelect={setActiveId}
        onClose={closeSession}
        onNew={newSession}
      />
      <div className="terminal-container" ref={containerRef} />
      <div className={`terminal-status ${connected ? 'connected' : 'disconnected'}`} aria-live="polite">
        <span className="status-indicator" aria-hidden="true" />
        <span>Status: {status}</span>
      </div>
    </div>
  )
}

export default Terminal
