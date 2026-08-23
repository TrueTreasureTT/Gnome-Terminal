import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { ubuntuTheme, terminalFont } from './theme'

export class TerminalSession {
  readonly id: number
  readonly term: XTerm
  readonly fit: FitAddon
  readonly ws: WebSocket
  title = 'Terminal'

  constructor(id: number, url: string) {
    this.id = id
    this.term = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: terminalFont,
      fontSize: 14,
      lineHeight: 1.15,
      scrollback: 10000,
      convertEol: false,
      allowTransparency: false,
      theme: ubuntuTheme,
      rightClickSelectsWord: true,
      scrollOnOutput: false,
      fastScrollModifier: 'alt',
    })

    this.fit = new FitAddon()
    this.term.loadAddon(this.fit)
    this.term.loadAddon(new WebLinksAddon())

    // Keep the WebSocket URL exactly as supplied by the caller.
    // For Render, this should be a public wss:// URL.
    this.ws = new WebSocket(url)
    this.ws.binaryType = 'arraybuffer'
  }

  connect(onClose: () => void, onStatus?: (connected: boolean) => void) {
    const notify = (connected: boolean) => {
      onStatus?.(connected)
      window.dispatchEvent(
        new CustomEvent('terminal-status', {
          detail: { connected },
        }),
      )
    }

    this.ws.addEventListener('open', () => {
      notify(true)
      this.resize()
    })

    this.ws.addEventListener('message', (event) => {
      if (typeof event.data === 'string') {
        this.term.write(event.data)
      } else if (event.data instanceof ArrayBuffer) {
        this.term.write(new TextDecoder().decode(new Uint8Array(event.data)))
      } else if (event.data instanceof Blob) {
        event.data.arrayBuffer().then((buffer) => {
          this.term.write(new TextDecoder().decode(new Uint8Array(buffer)))
        })
      }
    })

    this.ws.addEventListener('error', () => {
      notify(false)
    })

    this.ws.addEventListener('close', () => {
      notify(false)
      onClose()
    })

    this.term.onData((data) => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(new TextEncoder().encode(data).buffer)
      }
    })
  }

  resize() {
    if (!this.term.element) return
    this.fit.fit()
    this.sendJson({ type: 'resize', cols: this.term.cols, rows: this.term.rows })
  }

  sendJson(value: object) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(value))
    }
  }

  dispose() {
    this.ws.close()
    this.term.dispose()
  }
}
