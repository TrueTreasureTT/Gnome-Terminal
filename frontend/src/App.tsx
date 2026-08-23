import React, { useEffect, useState } from 'react'
import Terminal from './Terminal'

type Props = { backendUrl: string }

export default function App({ backendUrl }: Props) {
  const [connected, setConnected] = useState(false)
  const [minimumTimePassed, setMinimumTimePassed] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setMinimumTimePassed(true), 1000)
    return () => window.clearTimeout(timer)
  }, [])

  const showStartup = !connected || !minimumTimePassed

  return (
    <div className="app">
      <header className="header" aria-label="Terminal title bar">
        <div className="window-title">gnome-terminal 3.13.0</div>
        <div className="window-subtitle">Ubuntu-style terminal</div>
      </header>

      <main className="main">
        <Terminal url={backendUrl} onStatus={setConnected} />

        <div
          className={`startup-overlay ${showStartup ? 'visible' : 'hidden'}`}
          role="status"
          aria-live="polite"
          aria-hidden={!showStartup}
        >
          <img
            className="startup-logo"
            src="/gnome-logo.svg"
            alt="GNOME Terminal"
          />
          <div className="startup-title">GNOME Terminal</div>
          <div className="startup-version">3.13.0</div>
          <div className="chrome-spinner" aria-hidden="true" />
          <div className="startup-text">
            {connected ? 'Starting...' : 'Connecting...'}
          </div>
        </div>
      </main>
    </div>
  )
}
