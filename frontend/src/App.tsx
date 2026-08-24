import React, { useEffect, useState } from 'react'
import Terminal from './Terminal'

type Props = { backendUrl: string }

export default function App({ backendUrl }: Props) {
  const [connected, setConnected] = useState(false)
  const [startupFinished, setStartupFinished] = useState(false)

  useEffect(() => {
    // Keep the startup screen visible long enough to be seen, but never
    // block the actual terminal if the backend is slow or unavailable.
    const timer = window.setTimeout(() => setStartupFinished(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      <header className="header" aria-label="Terminal title bar">
        <div className="window-title">gnome-terminal 3.13.0</div>
        <div className="window-subtitle">Ubuntu-style terminal</div>
      </header>

      <main className="main">
        {/* The real terminal is ALWAYS mounted. The startup screen is only an overlay. */}
        <Terminal url={backendUrl} onStatus={setConnected} />

        <div
          className={`startup-overlay ${startupFinished ? 'hidden' : 'visible'}`}
          role="status"
          aria-live="polite"
          aria-hidden={startupFinished}
        >
          <img
            className="startup-logo"
            src="/gnome-terminal-logo.svg"
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
