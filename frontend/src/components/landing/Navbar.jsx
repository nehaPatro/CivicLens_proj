import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Radar } from 'lucide-react'
import ThemeToggle from '../common/ThemeToggle'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
  ]

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'glass shadow-sm border-b border-gray-200 dark:border-gray-800' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Radar size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight">CivicLens</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <button onClick={() => navigate('/login')} className="btn-secondary !px-4 !py-2 text-sm">
            Login
          </button>
          <button onClick={() => navigate('/signup')} className="btn-primary !px-4 !py-2 text-sm">
            Signup
          </button>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="glass border-t border-gray-200 dark:border-gray-800 px-6 py-4 md:hidden animate-slide-up">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="text-sm font-medium">
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <ThemeToggle />
              <button onClick={() => navigate('/login')} className="btn-secondary flex-1 !py-2 text-sm">Login</button>
              <button onClick={() => navigate('/signup')} className="btn-primary flex-1 !py-2 text-sm">Signup</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
