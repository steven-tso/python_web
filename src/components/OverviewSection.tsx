import { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Code2, Play } from 'lucide-react';
import { CHAPTERS, LESSONS } from '../data/curriculum.ts';
import type { LearningProgress } from '../types/python.ts';

interface OverviewSectionProps {
  progress: LearningProgress;
  onSelectLesson: (lessonId: string, openExerciseTab?: boolean) => void;
  onOpenSandbox: () => void;
  onOpenPractice: () => void;
}

export function OverviewSection({
  progress,
  onSelectLesson,
  onOpenSandbox,
  onOpenPractice,
}: OverviewSectionProps) {
  const [imgError, setImgError] = useState(false);

  const totalLessons = LESSONS.length;
  const completedCount = progress.completedIds.length;
  const completionPct = Math.round((completedCount / totalLessons) * 100);
  const totalTestCases = LESSONS.reduce((acc, item) => acc + item.testCases.length, 0);

  return (
    <main className="mx-auto max-w-[1440px] space-y-12 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Hero Split */}
      <section className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-10 lg:col-span-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-5">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Python 3.10 實戰環境 · 互動視覺模型 · 即時自動批改
            </div>

            <h1
              className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[42px] lg:leading-[1.15] dark:text-slate-100"
              style={{ textWrap: 'balance' }}
            >
              邊寫邊跑的 Python 互動教學工作室
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              從變數與流程控制出發，透過即時狀態視覺化拆解程式邏輯，並在內建的線上編輯器直接執行真實 Python 程式與單元測試，立刻取得繁體中文錯誤診斷與修正指引。
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => onSelectLesson(progress.lastActiveLessonId || LESSONS[0].id, false)}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Play className="h-4 w-4" />
              {completedCount > 0 ? '繼續上個單元' : '從第一課開始'}
            </button>
            <button
              type="button"
              onClick={onOpenPractice}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap shrink-0"
            >
              瀏覽線上練習題庫
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onOpenSandbox}
              className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-sky-700 hover:underline dark:text-sky-400 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Code2 className="h-4 w-4" />
              開啟自由沙盒
            </button>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 lg:col-span-6 dark:border-slate-800 dark:bg-slate-900">
          {!imgError ? (
            <img
              src="/src/assets/images/hero_python_workbench_1794894504076.jpg"
              alt="極簡北歐風格電腦科學書桌與程式碼視覺流程圖"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full min-h-[260px] w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-sky-50 p-8 text-center dark:from-slate-900 dark:to-slate-800">
              <Code2 className="h-10 w-10 text-sky-600 dark:text-sky-400" />
              <p className="mt-3 font-display text-lg font-semibold text-slate-800 dark:text-slate-200">
                PyLab 互動程式工作室
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4-column Summary & Progress Strip */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">完整課程單元</div>
          <div className="mt-1.5 font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {totalLessons} 堂
          </div>
          <div className="mt-1 text-xs text-slate-500">涵蓋 {CHAPTERS.length} 大主題章節</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">自動批改測試案例</div>
          <div className="mt-1.5 font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {totalTestCases} 項
          </div>
          <div className="mt-1 text-xs text-slate-500">即時比對輸出與函式回傳值</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">個人完成進度</div>
          <div className="mt-1.5 font-display text-2xl font-bold tabular-nums text-sky-700 dark:text-sky-400">
            {completedCount} / {totalLessons}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-sky-600 transition-all duration-200 dark:bg-sky-400"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">累計執行次數</div>
          <div className="mt-1.5 font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {progress.totalRuns} 次
          </div>
          <div className="mt-1 text-xs text-slate-500">本機自動儲存練習程式碼</div>
        </div>
      </section>

      {/* Curriculum Roadmap */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
              學習路徑與章節一覽
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              依序從基礎語法推進至演算法實作，每個單元皆附有互動範例與實戰測驗題。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CHAPTERS.map((chapter) => {
            const chapterLessons = LESSONS.filter((l) => l.chapterId === chapter.id);
            const chapterDone = chapterLessons.filter((l) =>
              progress.completedIds.includes(l.id),
            ).length;

            return (
              <div
                key={chapter.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      第 {chapter.numberLabel} 章 · {chapterLessons.length} 個單元
                    </span>
                    <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
                      已完成 {chapterDone}/{chapterLessons.length}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {chapter.numberLabel}. {chapter.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {chapter.description}
                  </p>

                  <ul className="mt-5 divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
                    {chapterLessons.map((lesson) => {
                      const isDone = progress.completedIds.includes(lesson.id);
                      return (
                        <li key={lesson.id}>
                          <button
                            type="button"
                            onClick={() => onSelectLesson(lesson.id, false)}
                            className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-sm hover:text-sky-700 dark:hover:text-sky-400 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              {isDone ? (
                                <CheckCircle2
                                  className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                                  aria-label="已完成"
                                />
                              ) : (
                                <BookOpen
                                  className="h-4 w-4 shrink-0 text-slate-400"
                                  aria-hidden="true"
                                />
                              )}
                              <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                                {lesson.orderLabel} {lesson.title}
                              </span>
                            </span>
                            <span className="shrink-0 text-xs text-slate-400">
                              {lesson.difficulty}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-5 pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectLesson(chapterLessons[0].id, false)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    進入章節
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
