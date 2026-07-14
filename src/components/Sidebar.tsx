import React from 'react';
import type { Language, HistoryItem } from '../types';
import { 
  Code2, 
  History, 
  Keyboard, 
  RotateCcw, 
  Play, 
  Sparkles,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  languages: Language[];
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onResetCode: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  languages,
  currentLanguage,
  onLanguageChange,
  onResetCode,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  return (
    <aside className="sidebar">
      {/* Active Language Selection Section */}
      <div className="sidebar-section">
        <h2 className="sidebar-title">
          <Code2 size={16} color="var(--accent-color)" />
          Languages
        </h2>
        <div className="lang-list">
          {languages.map((lang) => {
            const isActive = lang.id === currentLanguage.id;
            return (
              <div
                key={lang.id}
                className={`lang-item ${isActive ? 'active' : ''}`}
                onClick={() => onLanguageChange(lang)}
                title={`Switch to ${lang.name}`}
                id={`lang-select-${lang.id}`}
              >
                <div className="lang-meta">
                  <span className="lang-icon">
                    {lang.extension.toUpperCase()}
                  </span>
                  <span style={{ fontWeight: isActive ? 600 : 400 }}>{lang.name}</span>
                </div>
                {isActive && <Sparkles size={14} style={{ color: 'var(--accent-hover)' }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Controls Section */}
      <div className="sidebar-section">
        <h2 className="sidebar-title">
          <Terminal size={16} color="var(--accent-color)" />
          Actions
        </h2>
        <button 
          className="btn btn-secondary" 
          onClick={onResetCode}
          style={{ width: '100%', justifyContent: 'flex-start', gap: '10px' }}
          id="btn-reset-template"
        >
          <RotateCcw size={16} />
          Reset to Template
        </button>
      </div>

      {/* Keyboard Shortcuts Section */}
      <div className="sidebar-section">
        <h2 className="sidebar-title">
          <Keyboard size={16} color="var(--accent-color)" />
          Shortcuts
        </h2>
        <div className="shortcuts-box">
          <div className="shortcut-row">
            <span>Run Code</span>
            <kbd className="kbd">Ctrl + Enter</kbd>
          </div>
          <div className="shortcut-row">
            <span>Reset Code</span>
            <kbd className="kbd">Alt + R</kbd>
          </div>
          <div className="shortcut-row">
            <span>Toggle Theme</span>
            <kbd className="kbd">Alt + T</kbd>
          </div>
        </div>
      </div>

      {/* Execution History Section */}
      <div className="sidebar-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderBottom: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 className="sidebar-title" style={{ marginBottom: 0 }}>
            <History size={16} color="var(--accent-color)" />
            History ({history.length})
          </h2>
          {history.length > 0 && (
            <button 
              onClick={onClearHistory}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--status-error)', 
                fontSize: '11px', 
                fontWeight: 600,
                cursor: 'pointer'
              }}
              id="btn-clear-history"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="history-list" style={{ flex: 1, padding: 0 }}>
          {history.length === 0 ? (
            <p className="empty-history-text">No executions yet.</p>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className="history-card"
                onClick={() => onSelectHistoryItem(item)}
                title="Click to load code snippet"
                id={`history-item-${item.id}`}
              >
                <div className="history-card-header">
                  <span className="history-lang-badge">{item.language}</span>
                  <span className={`history-status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </div>
                <div className="history-snippet">{item.code}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>{item.executionTime ? `${item.executionTime}ms` : ''}</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
