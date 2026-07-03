import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary-300/30 dark:bg-primary-700/20 blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-cyan-300/30 dark:bg-cyan-700/20 blur-3xl animate-pulse-slow" />
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(37,99,235,0.15) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/30 px-4 py-1.5 text-xs font-semibold text-primary-700 dark:text-primary-300">
            <Sparkles size={14} />
            AI-Powered Infrastructure Intelligence
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="gradient-text">CivicLens</span>
          </h1>
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300 sm:text-xl">
            AI Powered Smart City Infrastructure Monitoring System
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 dark:text-gray-400">
            Detect potholes and floods in real time using computer vision. Upload images or videos,
            let YOLO-powered AI pinpoint infrastructure issues, and report them directly to civic authorities —
            all from one intelligent dashboard.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#features" className="btn-outline group">
              Explore Features
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <button onClick={() => navigate('/login')} className="btn-secondary">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="btn-primary">
              Signup Free
            </button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary-600" /> Secure JWT Authentication
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-primary-600" /> Real-time YOLO Detection
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary-600" /> Built for Smart Cities
            </div>
          </div>
        </div>

        {/* Illustrative preview mockup */}
        <div className="relative mx-auto mt-16 max-w-4xl animate-slide-up">
          <div className="card overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-gray-400">civiclens.app/dashboard</span>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-gray-900 dark:to-gray-950 p-8 sm:grid-cols-4">
              {['Pothole Detection', 'Flood Detection', 'Video Analysis', 'Live Reports'].map((item, i) => (
                <div
                  key={item}
                  className="animate-float rounded-xl border border-white/60 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-4 text-center shadow-sm"
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <div className="mx-auto mb-2 h-10 w-10 rounded-lg bg-primary-600/10 dark:bg-primary-500/20" />
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
