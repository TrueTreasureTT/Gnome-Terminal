import React, { useEffect, useRef } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

type Props = { url: string }

/**
 * Terminal component:
 * - connects to backend WebSocket at props.url
 * - sends keystrokes as binary frames (ArrayBuffer)
 * - sends resize control messages as JSON text frames: {type: 'resize', cols, rows}
 * - handles binary ArrayBuffer frames from backend and writes them to xterm
 */
const Terminal: React.FC<Props> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const termRef = useRef<XTerm | null>(null)
  const fitRef = useRef<FitAddon | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const term = new XTerm({
      cursorBlink: true,
      cols: 80,
      rows: 24,
      convertEol: true,
      fontFamily: "Menlo, Monaco, 'Courier New', monospace",
      theme: { background: '#0b0f13', foreground: '#c9d1d9' },
    })
    const fit = new FitAddon()
    term.loadAddon(fit)
    term.open(containerRef.current!)
    fit.fit()
    term.focus()

    termRef.current = term
    fitRef.current = fit

    let ws = new WebSocket(url)
    ws.binaryType = 'arraybuffer'
    wsRef.current = ws

    ws.addEventListener('open', () => {
      term.writeln('\x1b[32mConnected to backend\x1b[0m')
      // Set TERM env on the backend via control message (optional)
      try {
        ws.send(JSON.stringify({ type: 'env', key: 'TERM', value: 'xterm-256color' }))
      } catch {}
      // send an initial resize so the pty will match the terminal
      const resizeMsg = JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows })
      ws.send(resizeMsg)
    })

    ws.addEventListener('message', (ev) => {
      if (typeof ev.data === 'string') {
        // control text from server or fallback text payload
        try {
          const obj = JSON.parse(ev.data)
          // handle structured messages if needed (e.g., server status)
          if (obj && obj.type === 'status' && obj.message) {
            term.writeln(`\x1b[33m${obj.message}\x1b[0m`)
            return
          }
        } catch {
          // non-JSON text -> print
          term.write(ev.data)
          return
        }
        return
      }

      // Binary frame -> treat as raw terminal bytes
      const data = new Uint8Array(ev.data as ArrayBuffer)
      // decode and write to terminal; xterm accepts string so decode bytes
      const text = new TextDecoder().decode(data)
      term.write(text)
    })

    // Forward terminal input to backend as binary ArrayBuffer
    term.onData((data) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return
      const encoded = new TextEncoder().encode(data)
      ws.send(encoded.buffer)
    })

    // Window resize handler: fit, then tell backend the new size via JSON text-frame
    const onResize = () => {
      if (!term || !fit) return
      try {
        fit.fit()
      } catch {}
      if (ws && ws.readyState === WebSocket.OPEN) {
        const msg = JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows })
        ws.send(msg)
      }
    }
    window.addEventListener('resize', onResize)

    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', onResize)
      try {
        ws.close()
      } catch {}
      term.dispose()
    }
  }, [url])

  return <div className="terminal-container" ref={containerRef} />
}

export default Terminal
