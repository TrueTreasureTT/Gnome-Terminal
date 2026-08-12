// Minimal JS fallback client (non-React) to demonstrate WS connection
(function(){
  const ws = new WebSocket((location.origin.replace(/^http/, 'ws')) + '/ws')
  ws.onopen = function(){ console.log('connected') }
  ws.onmessage = function(e){ console.log('message', e.data) }
  window._gnome_ws = ws
})()
