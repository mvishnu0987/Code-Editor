export interface Language {
  id: string; // e.g. 'java', 'c', 'cpp', 'python'
  name: string; // e.g. 'Java', 'C', 'C++', 'Python'
  extension: string; // e.g. 'java', 'c', 'cpp', 'py'
  pistonId: string; // Piston API language identifier
  version: string; // language compiler/runtime version for Piston
  fileName: string; // default main file name
}

export interface CodeFile {
  name: string;
  content: string;
  language: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  code: number | null; // exit code
  signal: string | null;
  error?: string; // network or internal error
  runTime?: number; // execution time in ms (or piston duration)
}

export interface HistoryItem {
  id: string;
  language: string;
  fileName: string;
  code: string;
  status: 'success' | 'error' | 'running';
  timestamp: string;
  output: string;
  executionTime?: string;
}

export interface EditorTheme {
  id: string;
  name: string;
  monacoTheme: string;
  isDark: boolean;
}
