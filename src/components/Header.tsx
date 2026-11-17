export type ActiveView = 'overview' | 'workspace' | 'practice' | 'sandbox';

interface HeaderProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onStartPractice: () => void;
}

export function Header({ activeView, onNavigate, onStartPractice }: HeaderProps) {
  const navItems: { id: ActiveView; label: string }[] = [
    { id: 'overview', label: '課程總覽' },
    { id: 'workspace', label: '互動教室' },
    { id: 'practice', label: '線上題庫' },
    { id: 'sandbox', label: '自由沙盒' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('overview')}
          className="font-display text-lg font-bold tracking-tight text-slate-900 hover:text-sky-700 transition-colors dark:text-slate-100 dark:hover:text-sky-400 whitespace-nowrap shrink-0 cursor-pointer"
        >
          PyLab 互動教室
        </button>

        {/* Zone 2: 4 Single-Line Text Navigation Links */}
        <nav className="flex items-center gap-5 sm:gap-7 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-sky-700 dark:text-sky-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-sky-600 dark:bg-sky-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="hidden sm:flex items-center shrink-0">
          <button
            type="button"
            onClick={onStartPractice}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 whitespace-nowrap shrink-0 cursor-pointer"
          >
            開始練習
          </button>
        </div>
      </div>
    </header>
  );
}
