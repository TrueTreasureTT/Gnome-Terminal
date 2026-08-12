import React from 'react'
import { createRoot } from 'react-dom/client'
import Terminal from './Terminal'
import './styles.css'

const App = () => (
  <div className="app">
    <h1>gnome-terminal-clone (web)</h1>
    <Terminal url={location.origin.replace(/^http/, 'ws') + '/'} />
  </div>
)

createRoot(document.getElementById('root')!).render(<App />)
