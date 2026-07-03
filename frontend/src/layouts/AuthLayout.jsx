import { Link } from 'react-router-dom'
import { Radar, ShieldCheck, ScanSearch, MapPin } from 'lucide-react'
import ThemeToggle from '../components/common/ThemeToggle'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left branding panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-cyan-600 p-12 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Radar size={20} />
          </div>
          <span className="text-xl font-extrabold">CivicLens</span>
        </Link>

        <div className="relative z-10 max-w-md animate-fade-in">
          <h2 className="text-3xl font-extrabold leading-tight">
            AI Powered Smart City Infrastructure Monitoring
          </h2>
          <p className="mt-4 text-primary-50">
            Detect potholes and floods with YOLO-powered computer vision, and help build safer,
            smarter cities — one report at a time.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <ScanSearch size={20} />
              <span className="text-sm font-medium">Real-time AI detection</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <MapPin size={20} />
              <span className="text-sm font-medium">Location-tagged issue reports</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <ShieldCheck size={20} />
              <span className="text-sm font-medium">Secure JWT-based authentication</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-primary-100">
          © {new Date().getFullYear()} CivicLens. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Radar size={18} />
            </div>
            <span className="text-lg font-extrabold">CivicLens</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="mx-auto hidden w-full max-w-sm justify-end lg:flex">
          <ThemeToggle className="mb-6" />
        </div>

        <div className="mx-auto w-full max-w-sm animate-slide-up">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
