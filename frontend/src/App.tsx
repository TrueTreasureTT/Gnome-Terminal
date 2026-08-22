import React from 'react'
import Terminal from './Terminal'

type Props = { backendUrl: string }

export default function App({ backendUrl }: Props) {
  return (
    <div className="app">
      <header className="header" aria-label="Terminal title bar">
        <div className="window-title">gnome-terminalv3.14.02 ~</div>
        <div className="window-subtitle">Ubuntu-style terminal</div>
      </header>
      <main className="main">
        <Terminal url={backendUrl} />
      </main>
    </div>
  )
}
