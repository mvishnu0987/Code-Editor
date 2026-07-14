import React from 'react';
import type { ExecutionResult } from '../types';
import { Terminal, Keyboard, ShieldAlert, Cpu } from 'lucide-react';

interface ConsolePaneProps {
  activeTab: 'output' | 'input';
  onTabChange: (tab: 'output' | 'input') => void;
  isRunning: boolean;
  result: ExecutionResult | null;
  stdin: string;
  onStdinChange: (val: string) => void;
}

export const ConsolePane: React.FC<ConsolePaneProps> = ({
  activeTab,
  onTabChange,
  isRunning,
  result,
  stdin,
  onStdinChange,
}) => {
  // Determine execution status classes and text
  const getStatus = () => {
    if (isRunning) {
      return { text: 'Executing...', class: 'status-running' };
    }
    if (!result) {
      return { text: 'Ready', class: 'status-idle' };
    }
    if (result.error) {
      return { text: 'System Error', class: 'status-error' };
    }
    if (result.code !== 0 && result.code !== null) {
      return { text: `Exit Code: ${result.code}`, class: 'status-error' };
    }
    return { text: 'Success (0)', class: 'status-success' };
  };

  const status = getStatus();

  return (
    <div className="console-pane" id="console-pane-container">
      {/* Console Tab Header */}
      <div className="console-tabs">
        <div className="console-tab-buttons">
          <button
            className={`console-tab-btn ${activeTab === 'output' ? 'active' : ''}`}
            onClick={() => onTabChange('output')}
            id="console-tab-output"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={14} />
              Output
            </div>
          </button>
          <button
            className={`console-tab-btn ${activeTab === 'input' ? 'active' : ''}`}
            onClick={() => onTabChange('input')}
            id="console-tab-input"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Keyboard size={14} />
              Input (stdin)
            </div>
          </button>
        </div>

        {/* Runtime Status Indicators */}
        <div className="console-status">
          <span className={`status-indicator ${status.class}`}></span>
          <span style={{ color: 'var(--text-secondary)' }}>{status.text}</span>
          {result && !isRunning && result.runTime !== undefined && (
            <span style={{ marginLeft: '12px', fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Cpu size={12} />
              {result.runTime}ms
            </span>
          )}
        </div>
      </div>

      {/* Interactive Terminal Viewport */}
      <div className="console-viewport" id="console-viewport-content">
        {activeTab === 'output' ? (
          <>
            {isRunning && (
              <div className="console-info-text">
                [SYSTEM] Spawning runner sandbox...
                [SYSTEM] Transpiling and executing code...
              </div>
            )}
            
            {!isRunning && !result && (
              <div className="console-info-text">
                Press "Run Program" or use Ctrl + Enter shortcut to execute code.
                Provide input variables in the "Input" tab prior to execution if your program requires stdin.
              </div>
            )}
            
            {!isRunning && result && (
              <>
                {result.error && (
                  <div className="console-error-text">
                    <ShieldAlert size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    Error: {result.error}
                  </div>
                )}
                
                {result.stderr && (
                  <div className="console-error-text">
                    {result.stderr}
                  </div>
                )}
                
                {result.stdout && (
                  <div className="console-output-text">
                    {result.stdout}
                  </div>
                )}

                {!result.stdout && !result.stderr && !result.error && (
                  <div className="console-info-text">
                    Program executed successfully with no console output.
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <textarea
            className="stdin-textarea"
            placeholder="Type standard inputs here (one per line, e.g. for input() or Scanner scanner = new Scanner(System.in))..."
            value={stdin}
            onChange={(e) => onStdinChange(e.target.value)}
            disabled={isRunning}
            id="textarea-stdin"
          />
        )}
      </div>
    </div>
  );
};
