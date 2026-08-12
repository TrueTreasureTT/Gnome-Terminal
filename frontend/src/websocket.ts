// Small WebSocket wrapper with auto-reconnect
export default function useWebSocket(url: string) {
  // For this seed repo we'll export a factory rather than a hook
  let ws: WebSocket | null = null
  const connect = () => {
    ws = new WebSocket(url)
    return ws
  }
  return { connect, ws }
}
