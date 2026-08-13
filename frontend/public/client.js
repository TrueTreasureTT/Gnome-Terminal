// Minimal JS fallback client (non-React) to demonstrate a raw WS connection and raw logs.
// Useful for quick manual testing from the browser console.
(function () {
  const scheme = location.protocol === 'https:' ? 'wss:' : 'ws:'
  const url = scheme + '//' + location.host + '/ws'
  const ws = new WebSocket(url)
  ws.binaryType = 'arraybuffer'
  ws.onopen = () => console.log('[client] connected to', url)
  ws.onmessage = (e) => {
    if (typeof e.data === 'string') {
      console.log('[client] text', e.data)
    } else {
      console.log('[client] binary', new TextDecoder().decode(e.data))
    }
  }
  ws.onclose = () => console.log('[client] closed')
  window.__GNOME_TERMINAL_WS = ws
})()
