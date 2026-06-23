import React from 'react'
import { Bell, Sun, Moon, Search } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

interface TopBarProps { title: string; subtitle?: string }

const TopBar: React.FC<TopBarProps> = ({ title, subtitle }) => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between px-6 py-3.5 bg-white dark:bg-[#0B0E1A] border-b border-slate-100 dark:border-slate-800/80 sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 w-52 transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500">
          <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="bg-transparent text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 outline-none flex-1"
          />
        </div>

        {/* Theme */}
        <button onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800" />
        </button>

        {/* Month badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">June 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>
    </header>
  )
}

export default TopBar
