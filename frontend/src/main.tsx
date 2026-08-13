import React from 'react'
import { createRoot } from 'react-dom/client'
import Terminal from './Terminal'
import './styles.css'

function App() {
  // Use relative path to /ws so that reverse-proxies (nginx) can route it.
  const backendWsPath = (location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + location.host + '/ws'
  return (
    <div className="app">
      <header className="header">
        <h1>gnome-terminal-clone (web)</h1>
      </header>
      <main className="main">
        <Terminal url={backendWsPath} />
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
