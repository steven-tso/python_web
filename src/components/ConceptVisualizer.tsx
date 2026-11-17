import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import type { VisualizerType } from '../types/python.ts';

interface ConceptVisualizerProps {
  type: VisualizerType;
}

export function ConceptVisualizer({ type }: ConceptVisualizerProps) {
  if (type === 'variables') return <VariablesVisualizer />;
  if (type === 'string_slice') return <StringSliceVisualizer />;
  if (type === 'branch_flow') return <BranchFlowVisualizer />;
  if (type === 'loop_trace') return <LoopTraceVisualizer />;
  if (type === 'list_index') return <ListIndexVisualizer />;
  return <DictMapVisualizer />;
}

function VariablesVisualizer() {
  const [name, setName] = useState('Python');
  const [version, setVersion] = useState(3);
  const [score, setScore] = useState(92.5);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          互動模型：變數記憶體箱與 f-string 即時預覽
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          修改下方變數數值，觀察 Python 如何動態推斷資料型別並組合 f-string 輸出結果。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="block space-y-1.5 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
            name (str)
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            className="w-full rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <span className="block font-mono text-xs text-sky-700 dark:text-sky-400">
            type: &lt;class 'str'&gt;
          </span>
        </label>

        <label className="block space-y-1.5 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
            version (int)
          </span>
          <input
            type="number"
            value={version}
            onChange={(e) => setVersion(Number(e.target.value) || 0)}
            className="w-full rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-sm tabular-nums text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <span className="block font-mono text-xs text-violet-700 dark:text-violet-400">
            type: &lt;class 'int'&gt;
          </span>
        </label>

        <label className="block space-y-1.5 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
            score (float)
          </span>
          <input
            type="number"
            step="0.5"
            value={score}
            onChange={(e) => setScore(Number(e.target.value) || 0)}
            className="w-full rounded border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-sm tabular-nums text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <span className="block font-mono text-xs text-emerald-700 dark:text-emerald-400">
            type: &lt;class 'float'&gt;
          </span>
        </label>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-900 p-4 font-mono text-sm text-slate-100 dark:border-slate-800">
        <div className="text-xs text-slate-400">f-string 運算式</div>
        <div className="mt-1 text-sky-300">
          print(f&quot;Hello {'{name}'} {'{version}'} · score={'{score:.1f}'}&quot;)
        </div>
        <div className="mt-3 border-t border-slate-800 pt-2.5 text-xs text-slate-400">輸出結果</div>
        <div className="mt-1 text-emerald-300">
          Hello {name} {version} · score={score.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

function StringSliceVisualizer() {
  const [text, setText] = useState('PYTHON');
  const safeText = text.length > 0 ? text : 'PYTHON';
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(4);

  const clampedStart = Math.min(start, safeText.length);
  const clampedEnd = Math.min(end, safeText.length);
  const sliced = safeText.slice(clampedStart, clampedEnd);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          互動模型：字串正負索引與切片範圍 s[start:end]
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Python 切片包含起點 start，但不包含終點 end（半開區間）。調整滑桿觀察擷取結果。
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <span>測試字串</span>
          <input
            type="text"
            value={text}
            maxLength={10}
            onChange={(e) => {
              const next = e.target.value || 'P';
              setText(next);
              setStart(0);
              setEnd(Math.min(4, next.length));
            }}
            className="w-32 rounded border border-slate-300 bg-white px-2.5 py-1 font-mono text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex gap-1.5">
          {safeText.split('').map((ch, idx) => {
            const inRange = idx >= clampedStart && idx < clampedEnd;
            return (
              <div key={idx} className="flex min-w-[44px] flex-col items-center">
                <span className="font-mono text-xs tabular-nums text-slate-400">{idx}</span>
                <div
                  className={`my-1 flex h-11 w-11 items-center justify-center rounded-md border font-mono text-base font-semibold transition-colors ${
                    inRange
                      ? 'border-sky-600 bg-sky-50 text-sky-900 dark:border-sky-400 dark:bg-sky-950/60 dark:text-sky-200'
                      : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500'
                  }`}
                >
                  {ch === ' ' ? '␣' : ch}
                </div>
                <span className="font-mono text-xs tabular-nums text-slate-400">
                  {idx - safeText.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <span>起點 start</span>
            <span className="font-mono tabular-nums">{clampedStart}</span>
          </div>
          <input
            type="range"
            min={0}
            max={safeText.length}
            value={clampedStart}
            onChange={(e) => setStart(Number(e.target.value))}
            className="w-full accent-sky-600"
          />
        </label>

        <label className="block space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <span>終點 end (不含)</span>
            <span className="font-mono tabular-nums">{clampedEnd}</span>
          </div>
          <input
            type="range"
            min={0}
            max={safeText.length}
            value={clampedEnd}
            onChange={(e) => setEnd(Number(e.target.value))}
            className="w-full accent-sky-600"
          />
        </label>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm dark:border-slate-800 dark:bg-slate-950">
        <span className="text-slate-500">
          s[{clampedStart}:{clampedEnd}] →{' '}
        </span>
        <span className="font-semibold text-sky-700 dark:text-sky-400">
          &quot;{sliced}&quot;
        </span>
      </div>
    </div>
  );
}

function BranchFlowVisualizer() {
  const [score, setScore] = useState(84);

  const branches = [
    { label: 'if score >= 90:', grade: 'A', active: score >= 90, evalText: `${score} >= 90` },
    {
      label: 'elif score >= 80:',
      grade: 'B',
      active: score < 90 && score >= 80,
      evalText: `${score} >= 80`,
    },
    {
      label: 'elif score >= 70:',
      grade: 'C',
      active: score < 80 && score >= 70,
      evalText: `${score} >= 70`,
    },
    {
      label: 'elif score >= 60:',
      grade: 'D',
      active: score < 70 && score >= 60,
      evalText: `${score} >= 60`,
    },
    { label: 'else:', grade: 'F', active: score < 60, evalText: '上述皆不成立' },
  ];

  const activeGrade = branches.find((b) => b.active)?.grade ?? 'F';

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          互動模型：由上而下的條件分岐執行路徑
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          只要第一個條件成立就會進入該區塊並跳過後續 elif / else。拖動分數觀察執行流程。
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>輸入分數 score</span>
          <span className="font-mono text-base font-semibold tabular-nums text-sky-700 dark:text-sky-400">
            {score} 分 → 等第 {activeGrade}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="mt-3 w-full accent-sky-600"
        />
      </div>

      <div className="space-y-2">
        {branches.map((b, index) => {
          const hitIndex = branches.findIndex((item) => item.active);
          const skipped = index > hitIndex;
          return (
            <div
              key={b.grade}
              className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                b.active
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200'
                  : skipped
                    ? 'border-slate-200 bg-slate-50/50 text-slate-400 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-600'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              <div className="font-mono">
                <span>{b.label}</span>
                <span className="ml-3 text-xs opacity-75">({b.evalText})</span>
              </div>
              <span className="font-mono text-xs font-semibold">
                {b.active ? `命中 · 回傳 "${b.grade}"` : skipped ? '略過不檢查' : 'False 繼續往下'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoopTraceVisualizer() {
  const [limit, setLimit] = useState(8);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const steps: { i: number | null; total: number; note: string }[] = [
    { i: null, total: 0, note: '初始化累加器 total = 0' },
  ];
  let running = 0;
  for (let i = 2; i <= limit; i += 2) {
    running += i;
    steps.push({ i, total: running, note: `i = ${i}，執行 total += ${i}` });
  }
  steps.push({ i: null, total: running, note: `迴圈結束，回傳 total = ${running}` });

  const safeStep = Math.min(stepIndex, steps.length - 1);
  const current = steps[safeStep];

  useEffect(() => {
    if (!playing) return;
    if (safeStep >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }, 650);
    return () => window.clearTimeout(timer);
  }, [playing, safeStep, steps.length]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          互動模型：for 迴圈逐步狀態追蹤器
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          觀察 range(2, n + 1, 2) 每一輪迭代中變數 i 與 total 的即時變化。
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          <span>終點 n = {limit}</span>
          <input
            type="range"
            min={4}
            max={12}
            step={2}
            value={limit}
            onChange={(e) => {
              setPlaying(false);
              setStepIndex(0);
              setLimit(Number(e.target.value));
            }}
            className="w-28 accent-sky-600"
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 whitespace-nowrap shrink-0"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? '暫停' : '自動播放'}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStepIndex((s) => Math.min(s + 1, steps.length - 1));
            }}
            disabled={safeStep >= steps.length - 1}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 whitespace-nowrap shrink-0"
          >
            <SkipForward className="h-3.5 w-3.5" />
            單步
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStepIndex(0);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重設
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500">目前迴圈變數 i</div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-sky-700 dark:text-sky-400">
            {current.i === null ? '—' : current.i}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500">累加結果 total</div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
            {current.total}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
        <span className="font-mono text-xs text-slate-500 tabular-nums">
          步驟 {safeStep + 1} / {steps.length} ·{' '}
        </span>
        <span>{current.note}</span>
      </div>
    </div>
  );
}

function ListIndexVisualizer() {
  const source = [1, 2, 3, 4, 5, 6];
  const [filterMode, setFilterMode] = useState<'all' | 'odd' | 'even'>('odd');
  const [transformMode, setTransformMode] = useState<'identity' | 'square' | 'double'>('square');

  const matches = (n: number) =>
    filterMode === 'all' ? true : filterMode === 'odd' ? n % 2 !== 0 : n % 2 === 0;
  const transform = (n: number) =>
    transformMode === 'identity' ? n : transformMode === 'square' ? n * n : n * 2;

  const filterExpr =
    filterMode === 'all' ? '' : filterMode === 'odd' ? ' if x % 2 != 0' : ' if x % 2 == 0';
  const transExpr =
    transformMode === 'identity' ? 'x' : transformMode === 'square' ? 'x ** 2' : 'x * 2';

  const result = source.filter(matches).map(transform);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          互動模型：串列推導式資料管線
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          點選條件過濾與轉換運算，觀察串列推導式如何產生新串列。
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {(
            [
              ['all', '全部'],
              ['odd', '只留奇數'],
              ['even', '只留偶數'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterMode(key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filterMode === key
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {(
            [
              ['identity', '原值 x'],
              ['square', '平方 x**2'],
              ['double', '兩倍 x*2'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTransformMode(key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                transformMode === key
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="text-xs font-medium text-slate-500">輸入串列 nums</div>
        <div className="flex flex-wrap gap-2">
          {source.map((num, idx) => {
            const ok = matches(num);
            return (
              <div
                key={idx}
                className={`flex h-10 w-10 items-center justify-center rounded-md border font-mono text-sm font-semibold tabular-nums ${
                  ok
                    ? 'border-sky-600 bg-sky-50 text-sky-900 dark:border-sky-400 dark:bg-sky-950/60 dark:text-sky-200'
                    : 'border-slate-200 bg-slate-50 text-slate-400 line-through dark:border-slate-800 dark:bg-slate-950 dark:text-slate-600'
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>

        <div className="pt-2 font-mono text-xs text-slate-600 dark:text-slate-300">
          [{transExpr} for x in nums{filterExpr}]
        </div>

        <div className="text-xs font-medium text-slate-500">輸出新串列</div>
        <div className="font-mono text-base font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
          [{result.join(', ')}]
        </div>
      </div>
    </div>
  );
}

function DictMapVisualizer() {
  const [sample, setSample] = useState('python lab');

  const counts: Record<string, number> = {};
  for (const ch of sample) {
    if (ch === ' ') continue;
    counts[ch] = (counts[ch] ?? 0) + 1;
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          互動模型：字典 dict.get() 鍵值計數桶
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          輸入任意英文單字，觀察字典如何忽略空白並動態累加每個字元的出現次數。
        </p>
      </div>

      <input
        type="text"
        value={sample}
        maxLength={24}
        onChange={(e) => setSample(e.target.value)}
        placeholder="輸入任意文字測試..."
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-sm text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {Object.entries(counts).map(([key, count]) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="font-semibold text-sky-700 dark:text-sky-400">&quot;{key}&quot;</span>
            <span className="tabular-nums text-slate-700 dark:text-slate-300">{count} 次</span>
          </div>
        ))}
        {Object.keys(counts).length === 0 && (
          <div className="col-span-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950">
            目前沒有可統計的非空白字元。
          </div>
        )}
      </div>
    </div>
  );
}
