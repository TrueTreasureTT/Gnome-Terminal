import React, { useEffect, useState } from 'react'
import Terminal from './Terminal'

type Props = { backendUrl: string }

type TerminalStatusEvent = CustomEvent<{ connected: boolean }>

export default function App({ backendUrl }: Props) {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const handleStatus = (event: Event) => {
      const statusEvent = event as TerminalStatusEvent
      setConnected(statusEvent.detail.connected)
    }

    window.addEventListener('terminal-status', handleStatus)

    return () => {
      window.removeEventListener('terminal-status', handleStatus)
    }
  }, [])

  return (
    <div className="app">
      <header className="header" aria-label="Terminal title bar">
        <div className="window-title">gnome-terminal 3.13.0</div>
        <div className="window-subtitle">Ubuntu-style terminal</div>
      </header>

      <main className="main">
        <Terminal url={backendUrl} />

        {!connected && (
          <div className="startup-overlay" role="status" aria-live="polite">
            <img
              className="startup-logo"
              src="/gnome-logo.svg"
              alt="GNOME Terminal"
            />
            <div className="startup-title">GNOME Terminal</div>
            <div className="startup-version">3.13.0</div>
            <div className="chrome-spinner" aria-hidden="true" />
            <div className="startup-text">Connecting...</div>
          </div>
        )}
      </main>
    </div>
  )
}
