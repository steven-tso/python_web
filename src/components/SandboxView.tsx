import { useState } from 'react';
import { AlertTriangle, Moon, Play, Sun, Terminal, Trash2 } from 'lucide-react';
import { SANDBOX_TEMPLATES } from '../data/curriculum.ts';
import type { RunPythonResponse } from '../types/python.ts';
import { PythonEditor } from './PythonEditor.tsx';

interface SandboxViewProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onIncrementRuns: () => void;
}

export function SandboxView({
  darkMode,
  onToggleDarkMode,
  onIncrementRuns,
}: SandboxViewProps) {
  const [selectedTplId, setSelectedTplId] = useState(SANDBOX_TEMPLATES[1].id);
  const [code, setCode] = useState(SANDBOX_TEMPLATES[1].code);
  const [stdin, setStdin] = useState(SANDBOX_TEMPLATES[1].stdin ?? '');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<RunPythonResponse | null>(null);

  async function handleRun(customCode?: string) {
    const payload = customCode ?? code;
    setIsRunning(true);
    onIncrementRuns();
    try {
      const res = await fetch('/api/python/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: payload, stdin }),
      });
      const data = (await res.json()) as RunPythonResponse;
      setResult(data);
    } catch {
      setResult({
        ok: false,
        stdout: '',
        stderr: '無法連線至 Python 執行伺服器。',
        exitCode: 1,
        timedOut: false,
        durationMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
            Python 自由沙盒實驗室
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            隨時撰寫與實驗任何 Python 3.10 語法、標準函式庫（math、json、collections 等）或演算法。
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
        >
          {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          {darkMode ? '淺色介面' : '深色介面'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Sidebar: Templates & Cheat Sheet */}
        <aside className="space-y-5 lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              範例程式範本
            </h2>
            <div className="mt-3 space-y-2">
              {SANDBOX_TEMPLATES.map((tpl) => {
                const active = tpl.id === selectedTplId;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTplId(tpl.id);
                      setCode(tpl.code);
                      setStdin(tpl.stdin ?? '');
                      setResult(null);
                    }}
                    className={`w-full rounded-lg border p-3 text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-sky-500 bg-sky-50/70 dark:border-sky-600 dark:bg-sky-950/40'
                        : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{tpl.category}</span>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {tpl.title}
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      {tpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              常用語法速查
            </h2>
            <dl className="mt-3 space-y-2.5 text-xs">
              <div>
                <dt className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                  f&quot;{'{val:.2f}'}&quot;
                </dt>
                <dd className="text-slate-600 dark:text-slate-400">格式化浮點數至小數點後兩位</dd>
              </div>
              <div>
                <dt className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                  [x*x for x in range(10) if x % 2 == 0]
                </dt>
                <dd className="text-slate-600 dark:text-slate-400">附帶條件過濾的串列推導式</dd>
              </div>
              <div>
                <dt className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                  d.get(key, 0)
                </dt>
                <dd className="text-slate-600 dark:text-slate-400">安全取得字典鍵值或回傳預設值</dd>
              </div>
              <div>
                <dt className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                  sorted(items, key=lambda x: -x[1])
                </dt>
                <dd className="text-slate-600 dark:text-slate-400">依第二欄數值由大到小排序</dd>
              </div>
            </dl>
          </div>
        </aside>

        {/* Right Zone: Editor + Stdin + Output */}
        <section className="space-y-4 lg:col-span-8">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950">
              <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                sandbox.py
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCode('# 在此撰寫您的 Python 程式\nprint("Hello, PyLab!")\n');
                    setStdin('');
                    setResult(null);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  清空畫布
                </button>
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() => void handleRun()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="h-3.5 w-3.5" />
                  {isRunning ? '執行中...' : '執行程式 (Ctrl+Enter)'}
                </button>
              </div>
            </div>

            <div className="h-[380px] overflow-hidden">
              <PythonEditor
                value={code}
                onChange={setCode}
                onRun={() => void handleRun()}
                darkMode={darkMode}
                minHeight="380px"
              />
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <label
                htmlFor="sandbox-stdin"
                className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                標準輸入 (stdin)
              </label>
              <textarea
                id="sandbox-stdin"
                rows={2}
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="若程式中有使用 input()，請在此預先填入輸入資料（每行一筆）"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="min-h-[200px] overflow-hidden rounded-xl border border-slate-200 bg-slate-950 text-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 text-xs">
              <span className="flex items-center gap-2 font-medium text-slate-300">
                <Terminal className="h-3.5 w-3.5 text-sky-400" />
                執行結果終端
              </span>
              {result && (
                <span className="font-mono tabular-nums text-slate-400">
                  {result.ok ? '成功' : '錯誤'} · {result.durationMs} ms
                </span>
              )}
            </div>

            <div className="p-4 font-mono text-[13px] leading-relaxed space-y-3">
              {!result && (
                <p className="text-slate-500">按下「執行程式」後，輸出結果將會即時顯示於此。</p>
              )}
              {result?.stdout && (
                <pre className="whitespace-pre-wrap text-slate-100">{result.stdout}</pre>
              )}
              {result?.diagnosis && (
                <div className="rounded-lg border border-red-900/80 bg-red-950/50 p-3 font-sans text-xs space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-red-300">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>
                      {result.diagnosis.errorType}
                      {result.diagnosis.lineNumber
                        ? `（第 ${result.diagnosis.lineNumber} 行）`
                        : ''}{' '}
                      — {result.diagnosis.friendlyMessage}
                    </span>
                  </div>
                  <p className="text-red-200/90">建議：{result.diagnosis.suggestion}</p>
                </div>
              )}
              {result?.stderr && (
                <pre className="whitespace-pre-wrap text-xs text-red-300">{result.stderr}</pre>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
