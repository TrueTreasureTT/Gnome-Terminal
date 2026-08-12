import React, { useEffect, useRef } from 'react'
import { Terminal as XTerm } from 'xterm'
import 'xterm/css/xterm.css'
import useWebSocket from './websocket'

type Props = { url: string }

const Terminal: React.FC<Props> = ({ url }) => {
  const termRef = useRef<XTerm | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const term = new XTerm({ rows: 24, cols: 80 })
    term.open(containerRef.current!)
    termRef.current = term

    const ws = new WebSocket(url.replace(/^http/, 'ws') + 'ws')
    ws.binaryType = 'arraybuffer'
    wsRef.current = ws

    ws.onopen = () => {
      term.write('\r\n\x1b[32mConnected to backend\x1b[0m\r\n')
    }

    ws.onmessage = (ev) => {
      const data = ev.data
      if (typeof data === 'string') {
        term.write(data)
      } else {
        const str = new TextDecoder().decode(data)
        term.write(str)
      }
    }

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data)
      }
    })

    const resize = () => {
      const cols = term.cols
      const rows = term.rows
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(`RESIZE:${cols},${rows}`)
      }
    }

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      ws.close()
      term.dispose()
    }
  }, [url])

  return <div className="terminal-container" ref={containerRef}></div>
}

export default Terminal
