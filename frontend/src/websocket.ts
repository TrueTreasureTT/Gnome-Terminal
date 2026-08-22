export function createTerminalWebSocket(url: string): WebSocket {
  const ws = new WebSocket(url)
  ws.binaryType = 'arraybuffer'
  return ws
}

export function sendJson(ws: WebSocket, value: object) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(value))
  }
}

export function resizeTerminal(ws: WebSocket, cols: number, rows: number) {
  sendJson(ws, { type: 'resize', cols, rows })
}

export default createTerminalWebSocket
