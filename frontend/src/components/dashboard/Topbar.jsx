import { Menu, Bell } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import ThemeToggle from '../common/ThemeToggle'

export default function Topbar({ onMenuClick, title }) {
  const { user } = useAuth()

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg px-6 py-4">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-gray-500 lg:hidden" aria-label="Open sidebar">
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary-600" />
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 py-1.5 pl-1.5 pr-3">
          {user?.profile_picture ? (
            <img src={user.profile_picture} alt={user.name} className="h-7 w-7 rounded-lg object-cover" />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">
              {initials}
            </div>
          )}
          <span className="hidden text-sm font-medium sm:block">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}
