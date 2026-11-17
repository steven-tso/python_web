import { useState } from 'react';
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { CHAPTERS, LESSONS } from '../data/curriculum.ts';
import type { Difficulty, LearningProgress } from '../types/python.ts';

interface PracticeArenaViewProps {
  progress: LearningProgress;
  onStartExercise: (lessonId: string) => void;
}

export function PracticeArenaView({ progress, onStartExercise }: PracticeArenaViewProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<'全部' | Difficulty>('全部');
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'done'>('all');

  const filteredLessons = LESSONS.filter((lesson) => {
    if (difficultyFilter !== '全部' && lesson.difficulty !== difficultyFilter) {
      return false;
    }
    if (chapterFilter !== 'all' && lesson.chapterId !== chapterFilter) {
      return false;
    }
    const isDone = progress.completedIds.includes(lesson.id);
    if (statusFilter === 'todo' && isDone) return false;
    if (statusFilter === 'done' && !isDone) return false;
    return true;
  });

  const completedCount = progress.completedIds.length;

  return (
    <main className="mx-auto max-w-[1440px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
            線上練習題庫
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            挑選題目並在互動編輯器中送出程式碼，系統將以真實 Python 3.10 執行並驗證所有測試案例。
          </p>
        </div>

        <div className="text-sm font-medium text-slate-700 tabular-nums dark:text-slate-300">
          已通過 {completedCount} / {LESSONS.length} 題
        </div>
      </div>

      {/* Interactive Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(['全部', '入門', '進階', '挑戰'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficultyFilter(level)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  difficultyFilter === level
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(
              [
                ['all', '所有狀態'],
                ['todo', '尚未完成'],
                ['done', '已通過'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setStatusFilter(val)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === val
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="whitespace-nowrap shrink-0">篩選章節</span>
          <select
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-sky-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">全部章節</option>
            {CHAPTERS.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.numberLabel}. {ch.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Exercise Cards */}
      {filteredLessons.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            沒有符合目前篩選條件的練習題目。
          </p>
          <button
            type="button"
            onClick={() => {
              setDifficultyFilter('全部');
              setChapterFilter('all');
              setStatusFilter('all');
            }}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 cursor-pointer"
          >
            重設篩選條件
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => {
            const chapter = CHAPTERS.find((c) => c.id === lesson.chapterId);
            const isDone = progress.completedIds.includes(lesson.id);

            return (
              <article
                key={lesson.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-sky-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-700"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="truncate">
                      單元 {lesson.orderLabel} · {lesson.difficulty} · {lesson.testCases.length} 項測試
                    </span>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400 whitespace-nowrap shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        已通過
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 whitespace-nowrap shrink-0">
                        <Circle className="h-3.5 w-3.5" />
                        未完成
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2.5 font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {lesson.exerciseTitle}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    所屬章節：{chapter?.title}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {lesson.exercisePrompt}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <span className="text-xs text-slate-500">
                    預計 {lesson.estimatedMinutes} 分鐘
                  </span>
                  <button
                    type="button"
                    onClick={() => onStartExercise(lesson.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-sky-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    前往作答
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
