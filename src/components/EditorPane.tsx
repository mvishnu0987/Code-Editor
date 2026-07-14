import React from 'react';
import Editor from '@monaco-editor/react';
import type { Language, EditorTheme } from '../types';
import { FileCode, Settings } from 'lucide-react';

interface EditorPaneProps {
  currentLanguage: Language;
  code: string;
  onChange: (value: string | undefined) => void;
  theme: EditorTheme;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onRunCode: () => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  currentLanguage,
  code,
  onChange,
  theme,
  fontSize,
  onFontSizeChange,
  onRunCode,
}) => {
  // Setup standard keybindings in Monaco
  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Add custom keyboard shortcut (Ctrl+Enter to compile & run code)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunCode();
    });
  };

  return (
    <div className="editor-pane">
      {/* Pane Header containing Tab Indicator & Font Size Control */}
      <div className="pane-header">
        <div className="tabs-wrapper">
          <div className="tab active" id="editor-active-tab">
            <FileCode size={16} color="var(--accent-color)" />
            <span>{currentLanguage.fileName}</span>
          </div>
        </div>
        
        {/* Editor Config Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <Settings size={14} />
            <span>Font Size:</span>
            <select 
              value={fontSize} 
              onChange={(e) => onFontSizeChange(Number(e.target.value))}
              className="select-dropdown"
              style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '4px' }}
              id="select-font-size"
            >
              {[12, 13, 14, 15, 16, 18, 20].map((size) => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="monaco-editor-container" id="editor-pane-viewport">
        <Editor
          height="100%"
          language={currentLanguage.id}
          value={code}
          onChange={onChange}
          theme={theme.monacoTheme}
          onMount={handleEditorDidMount}
          loading={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
              Loading Monaco Editor...
            </div>
          }
          options={{
            fontSize: fontSize,
            fontFamily: "var(--font-mono)",
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'on',
            automaticLayout: true,
            tabSize: 4,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            padding: { top: 12, bottom: 12 },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            folding: true,
            lineDecorationsWidth: 10,
          }}
        />
      </div>
    </div>
  );
};
