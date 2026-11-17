import express from 'express';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { LESSONS } from './src/data/curriculum.ts';
import type {
  GradePythonResponse,
  PythonDiagnosis,
  RunPythonResponse,
  TestCaseResult,
} from './src/types/python.ts';

const execFileAsync = promisify(execFile);

const MAX_CODE_LENGTH = 25_000;
const EXEC_TIMEOUT_MS = 3_000;
const MAX_OUTPUT_BYTES = 256 * 1024;

function diagnosePythonError(stderr: string, timedOut: boolean): PythonDiagnosis | undefined {
  if (timedOut) {
    return {
      errorType: 'TimeoutError',
      friendlyMessage: '程式執行超過 3 秒限制，已自動中止。',
      suggestion: '請檢查是否出現無窮迴圈（例如 while 條件永遠為 True 或忘記遞減計數器）。',
    };
  }
  if (!stderr.trim()) {
    return undefined;
  }

  const lineMatch = stderr.match(/File ".*?", line (\d+)/g);
  let lineNumber: number | undefined;
  if (lineMatch && lineMatch.length > 0) {
    const last = lineMatch[lineMatch.length - 1];
    const numMatch = last.match(/line (\d+)/);
    if (numMatch) {
      lineNumber = Number(numMatch[1]);
    }
  }

  if (stderr.includes('SyntaxError')) {
    return {
      errorType: 'SyntaxError',
      friendlyMessage: '語法錯誤：Python 無法解析這段程式碼的結構。',
      suggestion: '檢查是否漏掉冒號 (:)、引號沒有成對閉合，或括號左右數量不一致。',
      lineNumber,
    };
  }
  if (stderr.includes('IndentationError') || stderr.includes('TabError')) {
    return {
      errorType: 'IndentationError',
      friendlyMessage: '縮排錯誤：程式區塊的對齊空白數量不一致。',
      suggestion: '確認 if / for / def 下方的程式行皆統一使用 4 個空白縮排。',
      lineNumber,
    };
  }
  if (stderr.includes('NameError')) {
    return {
      errorType: 'NameError',
      friendlyMessage: '名稱未定義：使用了尚未建立或拼字錯誤的變數／函式名稱。',
      suggestion: '檢查變數名稱拼寫與大小寫是否一致，並確認變數已在使用前賦值。',
      lineNumber,
    };
  }
  if (stderr.includes('TypeError')) {
    return {
      errorType: 'TypeError',
      friendlyMessage: '型別錯誤：對不相容的資料型別進行了運算或呼叫。',
      suggestion: '例如不可直接將字串與整數相加，或忘記使用 int() / str() 進行型別轉換。',
      lineNumber,
    };
  }
  if (stderr.includes('ValueError')) {
    return {
      errorType: 'ValueError',
      friendlyMessage: '數值錯誤：資料型別正確，但內容無法完成轉換或運算。',
      suggestion: '例如嘗試把非數字字串 "abc" 傳入 int()，或 unpack 元素數量不符合。',
      lineNumber,
    };
  }
  if (stderr.includes('IndexError')) {
    return {
      errorType: 'IndexError',
      friendlyMessage: '索引超出範圍：存取了串列或字串中不存在的位置。',
      suggestion: '記得 Python 索引從 0 開始，長度為 N 的串列最大正向索引是 N - 1。',
      lineNumber,
    };
  }
  if (stderr.includes('KeyError')) {
    return {
      errorType: 'KeyError',
      friendlyMessage: '鍵值不存在：嘗試讀取字典中尚未建立的 Key。',
      suggestion: '可改用 dict.get(key, 預設值) 來安全讀取，避免觸發 KeyError。',
      lineNumber,
    };
  }
  if (stderr.includes('ZeroDivisionError')) {
    return {
      errorType: 'ZeroDivisionError',
      friendlyMessage: '除以零錯誤：數學運算中分母不能為 0。',
      suggestion: '進行除法前請先檢查除數是否為 0。',
      lineNumber,
    };
  }
  if (stderr.includes('EOFError')) {
    return {
      errorType: 'EOFError',
      friendlyMessage: '輸入不足：程式呼叫了 input()，但標準輸入區沒有足夠的資料行。',
      suggestion: '請在「標準輸入 (stdin)」欄位填寫測試資料（每行對應一次 input() 呼叫）。',
      lineNumber,
    };
  }

  return {
    errorType: 'RuntimeError',
    friendlyMessage: '執行階段發生錯誤，請查看下方完整 Python 錯誤追蹤訊息。',
    suggestion: '根據錯誤指向的行號逐一檢查變數值與邏輯流程。',
    lineNumber,
  };
}

async function runPythonScript(scriptContent: string, stdinText = ''): Promise<RunPythonResponse> {
  const workDir = await mkdtemp(path.join(tmpdir(), 'pylab-'));
  const scriptPath = path.join(workDir, 'main.py');
  const startTime = Date.now();

  try {
    await writeFile(scriptPath, scriptContent, 'utf8');

    const child = execFile(
      'python3',
      ['-I', '-B', scriptPath],
      {
        cwd: workDir,
        timeout: EXEC_TIMEOUT_MS,
        maxBuffer: MAX_OUTPUT_BYTES,
        env: {
          PYTHONIOENCODING: 'utf-8',
          LANG: 'C.UTF-8',
        },
      },
    );

    if (child.stdin) {
      child.stdin.write(stdinText);
      child.stdin.end();
    }

    const result = await new Promise<{
      stdout: string;
      stderr: string;
      exitCode: number | null;
      timedOut: boolean;
    }>((resolve) => {
      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (chunk: Buffer | string) => {
        if (stdout.length < MAX_OUTPUT_BYTES) {
          stdout += chunk.toString();
        }
      });

      child.stderr?.on('data', (chunk: Buffer | string) => {
        if (stderr.length < MAX_OUTPUT_BYTES) {
          stderr += chunk.toString();
        }
      });

      child.on('close', (code, signal) => {
        const timedOut = signal === 'SIGTERM' || signal === 'SIGKILL';
        resolve({
          stdout,
          stderr,
          exitCode: code,
          timedOut,
        });
      });

      child.on('error', (err) => {
        resolve({
          stdout,
          stderr: stderr || err.message,
          exitCode: 1,
          timedOut: false,
        });
      });
    });

    const durationMs = Date.now() - startTime;
    const cleanStderr = result.stderr.replaceAll(scriptPath, 'main.py');
    const diagnosis = diagnosePythonError(cleanStderr, result.timedOut);

    return {
      ok: result.exitCode === 0 && !result.timedOut,
      stdout: result.stdout,
      stderr: cleanStderr,
      exitCode: result.exitCode,
      timedOut: result.timedOut,
      durationMs,
      diagnosis,
    };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

function normalizeStdout(text: string): string {
  return text.replace(/\r\n/g, '\n').trimEnd();
}

function formatPyValue(val: unknown): string {
  return JSON.stringify(val);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', runtime: 'python3' });
  });

  app.post('/api/python/run', async (req, res) => {
    const code = typeof req.body?.code === 'string' ? req.body.code : '';
    const stdin = typeof req.body?.stdin === 'string' ? req.body.stdin : '';

    if (code.length > MAX_CODE_LENGTH) {
      res.status(400).json({
        ok: false,
        stdout: '',
        stderr: '程式碼長度超過 25,000 字元上限。',
        exitCode: 1,
        timedOut: false,
        durationMs: 0,
      } satisfies RunPythonResponse);
      return;
    }

    try {
      const result = await runPythonScript(code, stdin);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        ok: false,
        stdout: '',
        stderr: error instanceof Error ? error.message : 'Python 執行服務發生未預期錯誤',
        exitCode: 1,
        timedOut: false,
        durationMs: 0,
      } satisfies RunPythonResponse);
    }
  });

  app.post('/api/python/grade', async (req, res) => {
    const code = typeof req.body?.code === 'string' ? req.body.code : '';
    const lessonId = typeof req.body?.lessonId === 'string' ? req.body.lessonId : '';

    const lesson = LESSONS.find((item) => item.id === lessonId);
    if (!lesson) {
      res.status(404).json({ error: '找不到指定的練習題目' });
      return;
    }

    if (code.length > MAX_CODE_LENGTH) {
      res.status(400).json({ error: '程式碼長度超過 25,000 字元上限' });
      return;
    }

    const totalStart = Date.now();
    const results: TestCaseResult[] = [];
    let combinedStdout = '';
    let firstStderr = '';
    let anyTimedOut = false;

    if (lesson.testMode === 'stdout') {
      for (const tc of lesson.testCases) {
        const runRes = await runPythonScript(code, tc.stdin ?? '');
        if (!combinedStdout && runRes.stdout) {
          combinedStdout = runRes.stdout;
        }
        if (!firstStderr && runRes.stderr) {
          firstStderr = runRes.stderr;
        }
        if (runRes.timedOut) {
          anyTimedOut = true;
        }

        const expected = normalizeStdout(tc.expectedOutput ?? '');
        const actual = normalizeStdout(runRes.stdout);
        const passed = runRes.ok && actual === expected;

        results.push({
          id: tc.id,
          label: tc.label,
          passed,
          expected,
          actual: runRes.timedOut ? '(執行逾時)' : actual || '(無輸出)',
          error: runRes.ok ? undefined : runRes.stderr || '執行失敗',
        });
      }
    } else {
      // Function-based automated test harness executed inside a single Python invocation
      const harnessCases = lesson.testCases.map((tc) => ({
        id: tc.id,
        label: tc.label,
        fn: tc.functionName,
        args: tc.args ?? [],
        expected: tc.expectedValue,
      }));

      const harnessMarker = '__PYLAB_GRADE_RESULTS__';
      const harnessScript = `${code}

import json as _pylab_json

def _pylab_run_tests():
    _cases = _pylab_json.loads(${JSON.stringify(JSON.stringify(harnessCases))})
    _out = []
    for _c in _cases:
        _fn_name = _c["fn"]
        _fn = globals().get(_fn_name)
        if not callable(_fn):
            _out.append({
                "id": _c["id"],
                "label": _c["label"],
                "passed": False,
                "expected": _pylab_json.dumps(_c["expected"], ensure_ascii=False),
                "actual": "(未定義函式 " + str(_fn_name) + ")",
                "error": "找不到函式 " + str(_fn_name)
            })
            continue
        try:
            _actual = _fn(*_c["args"])
            _passed = (_actual == _c["expected"]) and (type(_actual) is type(_c["expected"]) or not isinstance(_c["expected"], bool))
            _out.append({
                "id": _c["id"],
                "label": _c["label"],
                "passed": bool(_passed),
                "expected": _pylab_json.dumps(_c["expected"], ensure_ascii=False),
                "actual": _pylab_json.dumps(_actual, ensure_ascii=False)
            })
        except Exception as _exc:
            _out.append({
                "id": _c["id"],
                "label": _c["label"],
                "passed": False,
                "expected": _pylab_json.dumps(_c["expected"], ensure_ascii=False),
                "actual": "(發生例外)",
                "error": f"{type(_exc).__name__}: {_exc}"
            })
    print("${harnessMarker}" + _pylab_json.dumps(_out, ensure_ascii=False))

_pylab_run_tests()
`;

      const runRes = await runPythonScript(harnessScript, '');
      firstStderr = runRes.stderr;
      anyTimedOut = runRes.timedOut;

      const markerIdx = runRes.stdout.indexOf(harnessMarker);
      if (markerIdx !== -1) {
        combinedStdout = runRes.stdout.slice(0, markerIdx).trimEnd();
        const jsonPart = runRes.stdout.slice(markerIdx + harnessMarker.length).trim();
        try {
          const parsed = JSON.parse(jsonPart) as TestCaseResult[];
          results.push(...parsed);
        } catch {
          // Fallback if output was malformed
        }
      } else {
        combinedStdout = runRes.stdout;
      }

      if (results.length === 0) {
        for (const tc of lesson.testCases) {
          results.push({
            id: tc.id,
            label: tc.label,
            passed: false,
            expected: formatPyValue(tc.expectedValue),
            actual: runRes.timedOut ? '(執行逾時)' : '(無法完成測試)',
            error: runRes.stderr || '程式語法或執行階段發生錯誤',
          });
        }
      }
    }

    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;
    const diagnosis = diagnosePythonError(firstStderr, anyTimedOut);

    const response: GradePythonResponse = {
      passedAll: totalCount > 0 && passedCount === totalCount,
      passedCount,
      totalCount,
      results,
      stdout: combinedStdout,
      stderr: firstStderr,
      timedOut: anyTimedOut,
      durationMs: Date.now() - totalStart,
      diagnosis,
    };

    res.json(response);
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`PyLab server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
