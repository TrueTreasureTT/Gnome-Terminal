import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

type Props = { url: string }

type Session = {
  id: number
  title: string
  term: XTerm
  fit: FitAddon
  ws: WebSocket
}

const ubuntuTheme = {
  background: '#300a24',
  foreground: '#ffffff',
  cursor: '#ffffff',
  cursorAccent: '#300a24',
  selectionBackground: '#772953',
  black: '#171421',
  red: '#c01c28',
  green: '#26a269',
  yellow: '#a2734c',
  blue: '#12488b',
  magenta: '#a347ba',
  cyan: '#2aa1b3',
  white: '#d0cfcc',
  brightBlack: '#5e5c64',
  brightRed: '#f66151',
  brightGreen: '#33d17a',
  brightYellow: '#e9ad0c',
  brightBlue: '#2a7bde',
  brightMagenta: '#c061cb',
  brightCyan: '#33c7de',
  brightWhite: '#ffffff',
}

const Terminal: React.FC<Props> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sessionsRef = useRef<Session[]>([])
  const nextId = useRef(1)
  const [activeId, setActiveId] = useState(1)
  const [, forceRender] = useState(0)

  const createSession = useCallback(() => {
    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      convertEol: false,
      fontFamily: 'Ubuntu Mono, DejaVu Sans Mono, monospace',
      fontSize: 14,
      lineHeight: 1.15,
      scrollback: 10000,
      allowTransparency: false,
      theme: ubuntuTheme,
      rightClickSelectsWord: true,
    })
    const fit = new FitAddon()
    term.loadAddon(fit)
    const id = nextId.current++
    const ws = new WebSocket(url)
    ws.binaryType = 'arraybuffer'
    const session: Session = { id, title: 'Terminal', term, fit, ws }
    sessionsRef.current.push(session)

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ type: 'env', key: 'TERM', value: 'xterm-256color' }))
      ws.send(JSON.stringify({ type: 'env', key: 'COLORTERM', value: 'truecolor' }))
      ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }))
    })

    ws.addEventListener('message', (event) => {
      if (typeof event.data === 'string') {
        term.write(event.data)
      } else {
        term.write(new TextDecoder().decode(new Uint8Array(event.data as ArrayBuffer)))
      }
    })

    ws.addEventListener('close', () => {
      term.write('\r\n\x1b[90m[Terminal session closed]\x1b[0m\r\n')
      forceRender((value) => value + 1)
    })

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(new TextEncoder().encode(data).buffer)
      }
    })

    term.onTitleChange((title) => {
      session.title = title || 'Terminal'
      forceRender((value) => value + 1)
    })

    term.attachCustomKeyEventHandler((event) => {
      if (event.type !== 'keydown') return true
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'c') {
        const selection = term.getSelection()
        if (selection) navigator.clipboard?.writeText(selection)
        return false
      }
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'v') {
        navigator.clipboard?.readText().then((text) => term.paste(text))
        return false
      }
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 't') {
        event.preventDefault()
        createSession()
        return false
      }
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'w') {
        event.preventDefault()
        closeSession(id)
        return false
      }
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f') {
        term.focus()
      }
      return true
    })

    return session
  }, [url])

  const closeSession = useCallback((id: number) => {
    const index = sessionsRef.current.findIndex((session) => session.id === id)
    if (index < 0) return
    const [session] = sessionsRef.current.splice(index, 1)
    session.ws.close()
    session.term.dispose()
    if (sessionsRef.current.length === 0) {
      const replacement = createSession()
      setActiveId(replacement.id)
    } else if (activeId === id) {
      setActiveId(sessionsRef.current[Math.max(0, index - 1)].id)
    }
    forceRender((value) => value + 1)
  }, [activeId, createSession])

  useEffect(() => {
    if (!containerRef.current) return
    const first = createSession()
    setActiveId(first.id)
    const sessions = sessionsRef.current

    const resize = () => {
      sessions.forEach((session) => {
        if (!session.term.element) return
        try {
          session.fit.fit()
          if (session.ws.readyState === WebSocket.OPEN) {
            session.ws.send(JSON.stringify({ type: 'resize', cols: session.term.cols, rows: session.term.rows }))
          }
        } catch {
          // The terminal may be between mounts.
        }
      })
    }

    const observer = new ResizeObserver(resize)
    observer.observe(containerRef.current)
    window.addEventListener('resize', resize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resize)
      sessions.forEach((session) => {
        session.ws.close()
        session.term.dispose()
      })
      sessionsRef.current = []
    }
  }, [createSession])

  useEffect(() => {
    const active = sessionsRef.current.find((session) => session.id === activeId)
    if (!active || !containerRef.current) return
    const element = active.term.element
    if (!element) {
      active.term.open(containerRef.current)
    } else if (element.parentElement !== containerRef.current) {
      containerRef.current.appendChild(element)
    }
    sessionsRef.current.forEach((session) => {
      if (session.term.element) session.term.element.style.display = session.id === activeId ? 'block' : 'none'
    })
    requestAnimationFrame(() => {
      active.fit.fit()
      active.term.focus()
    })
  }, [activeId])

  return (
    <div className="terminal-shell">
      <div className="terminal-tabs" role="tablist" aria-label="Terminal tabs">
        {sessionsRef.current.map((session) => (
          <button
            key={session.id}
            className={`terminal-tab ${session.id === activeId ? 'active' : ''}`}
            onClick={() => setActiveId(session.id)}
            role="tab"
            aria-selected={session.id === activeId}
          >
            {session.title}
            <span
              className="terminal-tab-close"
              onClick={(event) => {
                event.stopPropagation()
                closeSession(session.id)
              }}
              aria-label="Close tab"
            >
              ×
            </span>
          </button>
        ))}
        <button className="terminal-new-tab" onClick={() => { const session = createSession(); setActiveId(session.id); forceRender((value) => value + 1) }} aria-label="New terminal tab">
          +
        </button>
      </div>
      <div className="terminal-container" ref={containerRef} />
    </div>
  )
}

export default Terminal
