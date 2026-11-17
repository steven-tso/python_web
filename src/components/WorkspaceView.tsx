import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Eye,
  HelpCircle,
  ListTree,
  Moon,
  Play,
  RotateCcw,
  Send,
  SlidersHorizontal,
  Sun,
  Terminal,
  XCircle,
} from 'lucide-react';
import { CHAPTERS, LESSONS } from '../data/curriculum.ts';
import type {
  GradePythonResponse,
  LessonItem,
  RunPythonResponse,
} from '../types/python.ts';
import { ConceptVisualizer } from './ConceptVisualizer.tsx';
import { PythonEditor } from './PythonEditor.tsx';

export type WorkspaceTab = 'concepts' | 'visualizer' | 'exercise';

interface WorkspaceViewProps {
  lesson: LessonItem;
  code: string;
  initialTab?: WorkspaceTab;
  isCompleted: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onChangeCode: (nextCode: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onLessonPassed: (lessonId: string) => void;
  onIncrementRuns: () => void;
}

export function WorkspaceView({
  lesson,
  code,
  initialTab = 'concepts',
  isCompleted,
  darkMode,
  onToggleDarkMode,
  onChangeCode,
  onSelectLesson,
  onLessonPassed,
  onIncrementRuns,
}: WorkspaceViewProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialTab);
  const [stdinText, setStdinText] = useState(lesson.defaultStdin ?? '');
  const [showStdin, setShowStdin] = useState(Boolean(lesson.defaultStdin));
  const [fontSize, setFontSize] = useState<number>(14);
  const [showDrawer, setShowDrawer] = useState(false);

  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [confirmSolution, setConfirmSolution] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [runResult, setRunResult] = useState<RunPythonResponse | null>(null);
  const [gradeResult, setGradeResult] = useState<GradePythonResponse | null>(null);

  const currentIndex = LESSONS.findIndex((item) => item.id === lesson.id);
  const prevLesson = currentIndex > 0 ? LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;
  const currentChapter = CHAPTERS.find((c) => c.id === lesson.chapterId);

  // Reset per-lesson ephemeral UI state on lesson switch
  useEffect(() => {
    setStdinText(lesson.defaultStdin ?? '');
    setShowStdin(Boolean(lesson.defaultStdin));
    setRevealedHints(0);
    setConfirmSolution(false);
    setShowSolution(false);
    setRunResult(null);
    setGradeResult(null);
    if (activeTab === 'visualizer' && !lesson.visualizer) {
      setActiveTab('concepts');
    }
  }, [lesson.id]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, lesson.id]);

  async function executeCode(codeToRun: string) {
    setIsRunning(true);
    setGradeResult(null);
    onIncrementRuns();
    try {
      const res = await fetch('/api/python/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToRun, stdin: stdinText }),
      });
      const data = (await res.json()) as RunPythonResponse;
      setRunResult(data);
    } catch {
      setRunResult({
        ok: false,
        stdout: '',
        stderr: '無法連線至 Python 執行伺服器，請稍後再試。',
        exitCode: 1,
        timedOut: false,
        durationMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  }

  async function handleGrade() {
    setIsGrading(true);
    setRunResult(null);
    onIncrementRuns();
    try {
      const res = await fetch('/api/python/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, lessonId: lesson.id }),
      });
      const data = (await res.json()) as GradePythonResponse;
      setGradeResult(data);
      setActiveTab('exercise');
      if (data.passedAll) {
        onLessonPassed(lesson.id);
      }
    } catch {
      setGradeResult({
        passedAll: false,
        passedCount: 0,
        totalCount: lesson.testCases.length,
        results: [],
        stdout: '',
        stderr: '批改服務連線失敗，請稍後再試。',
        timedOut: false,
        durationMs: 0,
      });
    } finally {
      setIsGrading(false);
    }
  }

  function handleLoadExample(exampleCode: string) {
    onChangeCode(exampleCode);
    void executeCode(exampleCode);
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
      {/* Workspace Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setShowDrawer((d) => !d)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ListTree className="h-3.5 w-3.5" />
            課程目錄
          </button>

          <div className="flex items-center gap-2 min-w-0 text-sm">
            <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
              {currentChapter?.numberLabel}. {currentChapter?.title} ·
            </span>
            <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
              {lesson.orderLabel} {lesson.title}
            </span>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
            · {lesson.difficulty}
          </span>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 whitespace-nowrap shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" />
              已完成測驗
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
            {[13, 14, 16].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setFontSize(size)}
                className={`rounded px-2 py-1 font-mono text-xs tabular-nums transition-colors cursor-pointer ${
                  fontSize === size
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
                title={`字體大小 ${size}px`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleDarkMode}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap shrink-0"
            aria-label={darkMode ? '切換至淺色模式' : '切換至深色模式'}
          >
            {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {darkMode ? '淺色' : '深色'}
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!prevLesson}
              onClick={() => prevLesson && onSelectLesson(prevLesson.id)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              上一課
            </button>
            <button
              type="button"
              disabled={!nextLesson}
              onClick={() => nextLesson && onSelectLesson(nextLesson.id)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              下一課
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Lesson Drawer */}
      {showDrawer && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              全部課程目錄 ({LESSONS.length} 個單元)
            </span>
            <button
              type="button"
              onClick={() => setShowDrawer(false)}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              收合目錄
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map((ch) => (
              <div key={ch.id} className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {ch.numberLabel}. {ch.title}
                </div>
                {LESSONS.filter((l) => l.chapterId === ch.id).map((item) => {
                  const active = item.id === lesson.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectLesson(item.id);
                        setShowDrawer(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                        active
                          ? 'bg-sky-50 font-semibold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">
                        {item.orderLabel} {item.title}
                      </span>
                      <span className="ml-2 shrink-0 text-slate-400">{item.difficulty}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Two-Zone Split */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Zone: Teaching, Interactive Model & Exercise */}
        <section className="flex flex-col rounded-xl border border-slate-200 bg-white lg:col-span-5 lg:max-h-[calc(100vh-170px)] dark:border-slate-800 dark:bg-slate-900">
          {/* Segmented Tabs */}
          <div className="flex items-center gap-1 border-b border-slate-200 p-2 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('concepts')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'concepts'
                  ? 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              教學與範例
            </button>

            {lesson.visualizer && (
              <button
                type="button"
                onClick={() => setActiveTab('visualizer')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'visualizer'
                    ? 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                互動概念模型
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('exercise')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'exercise'
                  ? 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              練習與自動批改
            </button>
          </div>

          {/* Left Pane Scroll Body */}
          <div className="ide-scroll flex-1 overflow-y-auto p-5 space-y-6">
            {activeTab === 'concepts' && (
              <>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    單元 {lesson.orderLabel} · 預計 {lesson.estimatedMinutes} 分鐘
                  </div>
                  <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-slate-100">
                    {lesson.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {lesson.summary}
                  </p>
                </div>

                <div className="space-y-6">
                  {lesson.concepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800"
                    >
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {concept.heading}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {concept.body}
                      </p>

                      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 dark:border-slate-800">
                        <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
                          <span className="font-mono text-xs text-slate-400">範例程式</span>
                          <button
                            type="button"
                            onClick={() => handleLoadExample(concept.exampleCode)}
                            className="inline-flex items-center gap-1 rounded bg-sky-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-sky-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Play className="h-3 w-3" />
                            載入並執行
                          </button>
                        </div>
                        <pre className="overflow-x-auto p-3.5 font-mono text-[13px] leading-relaxed text-slate-100">
                          <code>{concept.exampleCode}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      onChangeCode(lesson.starterCode);
                      setActiveTab('exercise');
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition-colors cursor-pointer"
                  >
                    前往本課練習題：{lesson.exerciseTitle}
                  </button>
                </div>
              </>
            )}

            {activeTab === 'visualizer' && lesson.visualizer && (
              <ConceptVisualizer type={lesson.visualizer} />
            )}

            {activeTab === 'exercise' && (
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    實戰練習 · {lesson.testMode === 'function' ? '函式測試' : '標準輸出比對'} ·{' '}
                    {lesson.testCases.length} 項測試案例
                  </div>
                  <h2 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-slate-100">
                    {lesson.exerciseTitle}
                  </h2>
                  <p className="mt-3 whitespace-pre-line rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                    {lesson.exercisePrompt}
                  </p>
                </div>

                {/* Hints & Reference Solution */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {revealedHints < lesson.hints.length && (
                      <button
                        type="button"
                        onClick={() => setRevealedHints((h) => h + 1)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
                        顯示解題提示 ({revealedHints}/{lesson.hints.length})
                      </button>
                    )}

                    {!showSolution && !confirmSolution && (
                      <button
                        type="button"
                        onClick={() => setConfirmSolution(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        查看參考解答
                      </button>
                    )}
                  </div>

                  {confirmSolution && !showSolution && (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                      <span>建議先嘗試思考或查看提示，確定要展開參考解答嗎？</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowSolution(true);
                            setConfirmSolution(false);
                          }}
                          className="rounded bg-amber-700 px-2.5 py-1 font-medium text-white hover:bg-amber-800 cursor-pointer"
                        >
                          確認顯示
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmSolution(false)}
                          className="rounded px-2 py-1 text-amber-800 hover:underline dark:text-amber-300 cursor-pointer"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}

                  {revealedHints > 0 && (
                    <div className="space-y-2">
                      {lesson.hints.slice(0, revealedHints).map((hint, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                        >
                          <span className="font-semibold text-amber-700 dark:text-amber-400">
                            提示 {i + 1}：
                          </span>
                          {hint}
                        </div>
                      ))}
                    </div>
                  )}

                  {showSolution && (
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 dark:border-slate-800">
                      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
                        <span className="font-mono text-xs text-slate-400">參考解答</span>
                        <button
                          type="button"
                          onClick={() => onChangeCode(lesson.solutionCode)}
                          className="rounded bg-slate-800 px-2.5 py-1 text-xs font-medium text-sky-300 hover:bg-slate-700 cursor-pointer"
                        >
                          填入編輯器
                        </button>
                      </div>
                      <pre className="overflow-x-auto p-3.5 font-mono text-[13px] leading-relaxed text-emerald-300">
                        <code>{lesson.solutionCode}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Automated Test Cases / Grading Breakdown */}
                <div className="space-y-3 border-t border-slate-200 pt-5 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      測試案例與驗證結果
                    </h3>
                    {gradeResult && (
                      <span
                        className={`font-mono text-xs font-semibold tabular-nums ${
                          gradeResult.passedAll
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-red-700 dark:text-red-400'
                        }`}
                      >
                        通過 {gradeResult.passedCount} / {gradeResult.totalCount}
                      </span>
                    )}
                  </div>

                  {gradeResult ? (
                    <div className="space-y-2.5">
                      {gradeResult.results.map((tc) => (
                        <div
                          key={tc.id}
                          className={`rounded-lg border p-3 text-xs ${
                            tc.passed
                              ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/30'
                              : 'border-red-200 bg-red-50/70 dark:border-red-900 dark:bg-red-950/30'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {tc.label}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 font-semibold whitespace-nowrap shrink-0 ${
                                tc.passed
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-red-700 dark:text-red-400'
                              }`}
                            >
                              {tc.passed ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5" />
                              )}
                              {tc.passed ? '通過' : '未通過'}
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-1 gap-1.5 font-mono sm:grid-cols-2">
                            <div className="rounded bg-white/80 px-2.5 py-1.5 text-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                              <span className="text-slate-400">預期：</span>
                              {tc.expected}
                            </div>
                            <div className="rounded bg-white/80 px-2.5 py-1.5 text-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                              <span className="text-slate-400">實際：</span>
                              {tc.actual}
                            </div>
                          </div>

                          {tc.error && (
                            <div className="mt-2 font-mono text-red-700 dark:text-red-300">
                              錯誤：{tc.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-slate-50 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950">
                      {lesson.testCases.map((tc) => (
                        <li
                          key={tc.id}
                          className="flex items-center justify-between px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <span>{tc.label}</span>
                          <span className="font-mono text-slate-500">待測試</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Zone: CodeMirror Editor, Stdin & Console */}
        <section className="flex flex-col gap-4 lg:col-span-7">
          <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {/* Editor Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                  main.py
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Ctrl / Cmd + Enter 快速執行
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowStdin((s) => !s)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    showStdin
                      ? 'border-sky-500 bg-sky-50 text-sky-800 dark:border-sky-600 dark:bg-sky-950/60 dark:text-sky-300'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  標準輸入 (stdin)
                </button>

                <button
                  type="button"
                  onClick={() => onChangeCode(lesson.starterCode)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  還原範本
                </button>

                <button
                  type="button"
                  disabled={isRunning || isGrading}
                  onClick={() => void executeCode(code)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="h-3.5 w-3.5" />
                  {isRunning ? '執行中...' : '執行程式'}
                </button>

                <button
                  type="button"
                  disabled={isRunning || isGrading}
                  onClick={() => void handleGrade()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-sky-700 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isGrading ? '批改中...' : '送出批改'}
                </button>
              </div>
            </div>

            {/* CodeMirror Canvas */}
            <div className="h-[340px] sm:h-[380px] overflow-hidden">
              <PythonEditor
                value={code}
                onChange={onChangeCode}
                onRun={() => void executeCode(code)}
                darkMode={darkMode}
                fontSize={fontSize}
                minHeight="340px"
              />
            </div>

            {/* Optional stdin Drawer */}
            {showStdin && (
              <div className="border-t border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <label
                    htmlFor="workspace-stdin"
                    className="font-medium text-slate-700 dark:text-slate-300"
                  >
                    標準輸入 (stdin) — 每行對應程式中一次 input() 呼叫
                  </label>
                </div>
                <textarea
                  id="workspace-stdin"
                  rows={2}
                  value={stdinText}
                  onChange={(e) => setStdinText(e.target.value)}
                  placeholder="例如：&#10;10&#10;5"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-sky-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            )}
          </div>

          {/* Live Output & Diagnosis Console */}
          <div className="flex min-h-[190px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-950 text-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 text-xs">
              <div className="flex items-center gap-2 font-medium text-slate-300">
                <Terminal className="h-3.5 w-3.5 text-sky-400" />
                執行輸出與批改終端
              </div>
              {runResult && (
                <div className="flex items-center gap-3 font-mono tabular-nums">
                  <span
                    className={
                      runResult.ok ? 'text-emerald-400' : 'text-red-400'
                    }
                  >
                    {runResult.ok ? '執行完成' : '發生錯誤'}
                  </span>
                  <span className="text-slate-400">{runResult.durationMs} ms</span>
                </div>
              )}
              {gradeResult && (
                <div className="flex items-center gap-3 font-mono tabular-nums">
                  <span
                    className={
                      gradeResult.passedAll ? 'text-emerald-400' : 'text-amber-400'
                    }
                  >
                    {gradeResult.passedAll
                      ? `全數通過 (${gradeResult.passedCount}/${gradeResult.totalCount})`
                      : `部分通過 (${gradeResult.passedCount}/${gradeResult.totalCount})`}
                  </span>
                  <span className="text-slate-400">{gradeResult.durationMs} ms</span>
                </div>
              )}
            </div>

            <div className="ide-scroll flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed space-y-3">
              {!runResult && !gradeResult && (
                <p className="text-slate-500">
                  點擊上方「執行程式」查看輸出，或點擊「送出批改」驗證所有自動測試案例。
                </p>
              )}

              {gradeResult?.passedAll && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-800 bg-emerald-950/60 px-3.5 py-2.5 font-sans text-sm text-emerald-200">
                  <span className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    恭喜！所有 {gradeResult.totalCount} 項測試案例全數通過，本單元已標記為完成。
                  </span>
                  {nextLesson && (
                    <button
                      type="button"
                      onClick={() => onSelectLesson(nextLesson.id)}
                      className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      前往下一課
                    </button>
                  )}
                </div>
              )}

              {(runResult?.stdout || gradeResult?.stdout) && (
                <pre className="whitespace-pre-wrap text-slate-100">
                  {runResult?.stdout ?? gradeResult?.stdout}
                </pre>
              )}

              {runResult && runResult.ok && !runResult.stdout && (
                <p className="text-slate-400">
                  (程式執行完畢，沒有印出標準輸出。若您定義了函式，請呼叫 print(...) 或直接點擊「送出批改」)
                </p>
              )}

              {(runResult?.diagnosis || gradeResult?.diagnosis) && (() => {
                const diag = runResult?.diagnosis ?? gradeResult?.diagnosis;
                if (!diag) return null;
                return (
                  <div className="rounded-lg border border-red-900/80 bg-red-950/50 p-3.5 font-sans text-xs space-y-1.5">
                    <div className="flex items-center gap-2 font-semibold text-red-300">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>
                        {diag.errorType}
                        {diag.lineNumber ? `（第 ${diag.lineNumber} 行）` : ''} — {diag.friendlyMessage}
                      </span>
                    </div>
                    <p className="text-red-200/90 leading-relaxed">
                      修正建議：{diag.suggestion}
                    </p>
                  </div>
                );
              })()}

              {(runResult?.stderr || gradeResult?.stderr) && (
                <pre className="whitespace-pre-wrap text-xs text-red-300/90">
                  {runResult?.stderr ?? gradeResult?.stderr}
                </pre>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
