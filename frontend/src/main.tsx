import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const configuredBackend = import.meta.env.VITE_TERMINAL_BACKEND_URL?.trim()

const backendWsPath = configuredBackend
  ? configuredBackend.replace(/\/$/, '')
  : (location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + location.host + '/ws'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App backendUrl={backendWsPath} />
  </React.StrictMode>,
)
