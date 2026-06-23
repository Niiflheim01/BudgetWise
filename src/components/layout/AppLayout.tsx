import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { Menu, X, Zap } from 'lucide-react'

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Welcome back, Juan! Your financial overview for June 2026.' },
  '/budget': { title: 'Budget Planner', subtitle: 'Zero-Based Budgeting — every peso must have a purpose.' },
  '/nudges': { title: 'AI Nudges', subtitle: 'Predictive insights that act before problems occur.' },
  '/analytics': { title: 'Analytics', subtitle: 'Deep-dive into your spending patterns and trends.' },
  '/goals': { title: 'Financial Goals', subtitle: 'Track progress toward your savings targets.' },
  '/coach': { title: 'AI Coach', subtitle: 'Ask your personal AI financial advisor anything.' },
}

const AppLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { title, subtitle } = PAGE_META[location.pathname] ?? { title: 'BudgetWise AI', subtitle: '' }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#080C14]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-10 shadow-2xl">
            <Sidebar />
          </div>
          <button onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg">
            <X className="w-4 h-4 text-slate-700 dark:text-slate-200" />
          </button>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 md:hidden px-4 py-3 bg-white dark:bg-[#0B0E1A] border-b border-slate-100 dark:border-slate-800/80">
          <button onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-indigo flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{title}</span>
          </div>
        </div>

        {/* Desktop top bar */}
        <div className="hidden md:block">
          <TopBar title={title} subtitle={subtitle} />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
