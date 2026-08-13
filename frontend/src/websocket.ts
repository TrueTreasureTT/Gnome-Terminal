// Minimal WebSocket wrapper with auto-reconnect (optional helper)
// This file exports a small factory. Terminal currently manages its own socket,
// but you can import this if you want centralized reconnect logic.

export function createWebSocket(url: string, onOpen?: () => void, onMessage?: (ev: MessageEvent) => void) {
  let ws = new WebSocket(url)
  ws.binaryType = 'arraybuffer'
  ws.onopen = () => onOpen?.()
  ws.onmessage = (ev) => onMessage?.(ev)
  return ws
}
export default createWebSocket
