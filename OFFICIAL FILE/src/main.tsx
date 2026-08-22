import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const backendWsPath = (location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + location.host + '/ws'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App backendUrl={backendWsPath} />
  </React.StrictMode>,
)
