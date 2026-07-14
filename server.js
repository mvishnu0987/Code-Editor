import express from 'express';
import cors from 'cors';
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const TEMP_DIR = path.join(__dirname, 'temp_runs');
if (!existsSync(TEMP_DIR)) {
  mkdirSync(TEMP_DIR, { recursive: true });
}

app.post('/execute', (req, res) => {
  const { language, code, stdin } = req.body;
  const runId = Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  
  let fileName = '';
  let compileCmd = '';
  let runCmd = '';
  
  if (language === 'python') {
    fileName = `run_${runId}.py`;
    runCmd = `python "${path.join(TEMP_DIR, fileName)}"`;
  } else if (language === 'java') {
    // Parse package name (e.g., package com.example;)
    const packageRegex = /package\s+([a-zA-Z0-9_.]+)\s*;/;
    const packageMatch = code.match(packageRegex);
    const packageName = packageMatch ? packageMatch[1] : '';
    
    // Parse public class name (defaults to Main)
    const classRegex = /public\s+class\s+([a-zA-Z0-9_]+)/;
    const classMatch = code.match(classRegex);
    const className = classMatch ? classMatch[1] : 'Main';
    
    const runFolder = path.join(TEMP_DIR, `run_${runId}`);
    
    let packageSubDir = '';
    if (packageName) {
      packageSubDir = packageName.replace(/\./g, path.sep);
    }
    
    const fullFolder = path.join(runFolder, packageSubDir);
    mkdirSync(fullFolder, { recursive: true });
    
    fileName = path.join(`run_${runId}`, packageSubDir, `${className}.java`);
    compileCmd = `javac "${path.join(fullFolder, `${className}.java`)}"`;
    
    const runnerClass = packageName ? `${packageName}.${className}` : className;
    runCmd = `java -cp "${runFolder}" ${runnerClass}`;
  } else if (language === 'c') {
    fileName = `run_${runId}.c`;
    const execName = `run_${runId}.exe`;
    compileCmd = `gcc "${path.join(TEMP_DIR, fileName)}" -o "${path.join(TEMP_DIR, execName)}"`;
    runCmd = `"${path.join(TEMP_DIR, execName)}"`;
  } else if (language === 'cpp') {
    fileName = `run_${runId}.cpp`;
    const execName = `run_${runId}.exe`;
    compileCmd = `g++ "${path.join(TEMP_DIR, fileName)}" -o "${path.join(TEMP_DIR, execName)}"`;
    runCmd = `"${path.join(TEMP_DIR, execName)}"`;
  } else {
    return res.status(400).json({ error: `Unsupported language: ${language}` });
  }
  
  const fullFilePath = path.join(TEMP_DIR, fileName);
  try {
    writeFileSync(fullFilePath, code);
  } catch (err) {
    return res.status(500).json({ error: `Failed to create file: ${err.message}` });
  }
  
  const cleanUp = () => {
    try {
      if (language === 'java') {
        const runFolder = path.join(TEMP_DIR, `run_${runId}`);
        // Windows syntax to remove directory recursively
        exec(`rmdir /s /q "${runFolder}"`, (e) => {});
      } else {
        if (existsSync(fullFilePath)) unlinkSync(fullFilePath);
        const execPath = fullFilePath.replace(/\.(c|cpp)$/, '.exe');
        if (existsSync(execPath)) unlinkSync(execPath);
      }
    } catch (e) {
      console.error('Cleanup failed:', e);
    }
  };
  
  const executeCommand = (cmd, stdinInput) => {
    return new Promise((resolve) => {
      const child = exec(cmd, (error, stdout, stderr) => {
        resolve({
          error,
          stdout,
          stderr
        });
      });
      if (stdinInput && child.stdin) {
        child.stdin.write(stdinInput);
        child.stdin.end();
      }
    });
  };
  
  const run = async () => {
    const startTime = performance.now();
    
    // Compile step (Java, C, C++)
    if (compileCmd) {
      const compResult = await executeCommand(compileCmd, null);
      if (compResult.error) {
        cleanUp();
        const runTime = Math.round(performance.now() - startTime);
        // Map error message cleanly
        const cleanStderr = compResult.stderr || compResult.error.message;
        
        let hint = '';
        if (cleanStderr.includes('is not recognized as an internal or external command')) {
          hint = `\n\n[HINT] The compiler (${language === 'java' ? 'javac' : 'gcc/g++'}) was not found on your system.\nMake sure you have installed ${language === 'java' ? 'Java Development Kit (JDK)' : 'MinGW / GCC'} and added it to your system's PATH.`;
        }
        
        return res.json({
          run: {
            stdout: compResult.stdout || '',
            stderr: cleanStderr + hint,
            code: compResult.error.code || 1,
            signal: null,
            output: cleanStderr + hint
          },
          runTime
        });
      }
    }
    
    // Run step
    const runResult = await executeCommand(runCmd, stdin);
    const runTime = Math.round(performance.now() - startTime);
    cleanUp();
    
    let runHint = '';
    if (runResult.error && runResult.error.message.includes('is not recognized as an internal or external command')) {
      runHint = `\n\n[HINT] The runtime interpreter/command was not found.\nMake sure you have installed the runtime environment for ${language} and added it to your PATH.`;
    }
    
    res.json({
      run: {
        stdout: runResult.stdout || '',
        stderr: (runResult.stderr || (runResult.error ? runResult.error.message : '')) + runHint,
        code: runResult.error ? (runResult.error.code || 1) : 0,
        signal: null,
        output: runResult.stdout || runResult.stderr || (runResult.error ? runResult.error.message : '')
      },
      runTime
    });
  };
  
  run();
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Execution backend server running on http://localhost:${PORT}`);
});
