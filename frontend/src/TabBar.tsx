import React from 'react'
import type { TerminalSession } from './TerminalSession'

type Props = {
  sessions: TerminalSession[]
  activeId: number
  onSelect: (id: number) => void
  onClose: (id: number) => void
  onNew: () => void
}

export default function TabBar({ sessions, activeId, onSelect, onClose, onNew }: Props) {
  return (
    <div className="terminal-tabs" role="tablist" aria-label="Terminal tabs">
      {sessions.map((session) => (
        <button
          key={session.id}
          className={`terminal-tab ${session.id === activeId ? 'active' : ''}`}
          onClick={() => onSelect(session.id)}
          role="tab"
          aria-selected={session.id === activeId}
        >
          <span className="terminal-tab-title">{session.title}</span>
          <span
            className="terminal-tab-close"
            onClick={(event) => {
              event.stopPropagation()
              onClose(session.id)
            }}
            aria-label={`Close ${session.title}`}
          >
            ×
          </span>
        </button>
      ))}
      <button className="terminal-new-tab" onClick={onNew} aria-label="New terminal tab">+</button>
    </div>
  )
}
