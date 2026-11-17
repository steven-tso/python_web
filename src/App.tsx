import { useEffect, useState } from 'react';
import { Header, type ActiveView } from './components/Header.tsx';
import { OverviewSection } from './components/OverviewSection.tsx';
import { PracticeArenaView } from './components/PracticeArenaView.tsx';
import { SandboxView } from './components/SandboxView.tsx';
import { WorkspaceView, type WorkspaceTab } from './components/WorkspaceView.tsx';
import { LESSONS } from './data/curriculum.ts';
import type { LearningProgress } from './types/python.ts';

const STORAGE_PROGRESS_KEY = 'pylab_progress_v1';
const STORAGE_THEME_KEY = 'pylab_theme_v1';

const DEFAULT_PROGRESS: LearningProgress = {
  completedIds: [],
  savedCode: {},
  totalRuns: 0,
  lastActiveLessonId: LESSONS[0].id,
};

function loadInitialProgress(): LearningProgress {
  try {
    const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LearningProgress>;
    return {
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      savedCode: parsed.savedCode && typeof parsed.savedCode === 'object' ? parsed.savedCode : {},
      totalRuns: typeof parsed.totalRuns === 'number' ? parsed.totalRuns : 0,
      lastActiveLessonId:
        typeof parsed.lastActiveLessonId === 'string' &&
        LESSONS.some((l) => l.id === parsed.lastActiveLessonId)
          ? parsed.lastActiveLessonId
          : LESSONS[0].id,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('concepts');
  const [progress, setProgress] = useState<LearningProgress>(loadInitialProgress);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_THEME_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_THEME_KEY, darkMode ? 'dark' : 'light');
    } catch {
      // ignore storage quota errors
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // ignore storage quota errors
    }
  }, [progress]);

  const currentLesson =
    LESSONS.find((l) => l.id === progress.lastActiveLessonId) ?? LESSONS[0];
  const currentCode = progress.savedCode[currentLesson.id] ?? currentLesson.starterCode;

  function handleSelectLesson(lessonId: string, openExerciseTab = false) {
    setProgress((prev) => ({
      ...prev,
      lastActiveLessonId: lessonId,
    }));
    setWorkspaceTab(openExerciseTab ? 'exercise' : 'concepts');
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleChangeCode(nextCode: string) {
    setProgress((prev) => ({
      ...prev,
      savedCode: {
        ...prev.savedCode,
        [currentLesson.id]: nextCode,
      },
    }));
  }

  function handleLessonPassed(lessonId: string) {
    setProgress((prev) => {
      if (prev.completedIds.includes(lessonId)) return prev;
      return {
        ...prev,
        completedIds: [...prev.completedIds, lessonId],
      };
    });
  }

  function handleIncrementRuns() {
    setProgress((prev) => ({
      ...prev,
      totalRuns: prev.totalRuns + 1,
    }));
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartPractice={() => handleSelectLesson(currentLesson.id, true)}
      />

      <div className="flex-1">
        {activeView === 'overview' && (
          <OverviewSection
            progress={progress}
            onSelectLesson={handleSelectLesson}
            onOpenSandbox={() => setActiveView('sandbox')}
            onOpenPractice={() => setActiveView('practice')}
          />
        )}

        {activeView === 'workspace' && (
          <WorkspaceView
            lesson={currentLesson}
            code={currentCode}
            initialTab={workspaceTab}
            isCompleted={progress.completedIds.includes(currentLesson.id)}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode((d) => !d)}
            onChangeCode={handleChangeCode}
            onSelectLesson={(id) => handleSelectLesson(id, false)}
            onLessonPassed={handleLessonPassed}
            onIncrementRuns={handleIncrementRuns}
          />
        )}

        {activeView === 'practice' && (
          <PracticeArenaView
            progress={progress}
            onStartExercise={(id) => handleSelectLesson(id, true)}
          />
        )}

        {activeView === 'sandbox' && (
          <SandboxView
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode((d) => !d)}
            onIncrementRuns={handleIncrementRuns}
          />
        )}
      </div>

      <footer className="mt-12 border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:px-6 lg:px-8 dark:text-slate-400">
          <span>PyLab 互動教室 · 線上 Python 3.10 教學與實作平台</span>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setActiveView('overview')}
              className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              課程總覽
            </button>
            <button
              type="button"
              onClick={() => setActiveView('practice')}
              className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              線上題庫
            </button>
            <button
              type="button"
              onClick={() => setActiveView('sandbox')}
              className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              自由沙盒
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
