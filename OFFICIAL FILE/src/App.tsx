import React from 'react'
import Terminal from './Terminal'

type Props = { backendUrl: string }

export default function App({ backendUrl }: Props) {
  return (
    <div className="app">
      <header className="header">
        <div className="window-title">Terminal</div>
        <div className="window-subtitle">Ubuntu-style terminal</div>
      </header>
      <main className="main">
        <Terminal url={backendUrl} />
      </main>
    </div>
  )
}
