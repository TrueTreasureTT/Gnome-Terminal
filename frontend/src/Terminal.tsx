import React, { useEffect, useRef } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

type Props = { url: string }

const Terminal: React.FC<Props> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      cols: 100,
      rows: 30,
      convertEol: false,
      fontFamily: 'Ubuntu Mono, DejaVu Sans Mono, monospace',
      fontSize: 14,
      lineHeight: 1.15,
      scrollback: 10000,
      allowTransparency: false,
      theme: {
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
      },
    })

    const fit = new FitAddon()
    term.loadAddon(fit)
    term.open(containerRef.current!)
    fit.fit()
    term.focus()

    const ws = new WebSocket(url)
    ws.binaryType = 'arraybuffer'

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ type: 'env', key: 'TERM', value: 'xterm-256color' }))
      ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }))
    })

    ws.addEventListener('message', (ev) => {
      if (typeof ev.data === 'string') {
        term.write(ev.data)
      } else {
        term.write(new TextDecoder().decode(new Uint8Array(ev.data as ArrayBuffer)))
      }
    })

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(new TextEncoder().encode(data).buffer)
      }
    })

    const onResize = () => {
      try { fit.fit() } catch {}
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }))
      }
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      ws.close()
      term.dispose()
    }
  }, [url])

  return <div className="terminal-container" ref={containerRef} />
}

export default Terminal
