import { useNavigate } from 'react-router-dom'
import { Radar, Github, Twitter, Linkedin, ArrowRight } from 'lucide-react'

export function CTA() {
  const navigate = useNavigate()
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-cyan-600 px-8 py-16 text-center shadow-2xl">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Build a smarter, safer city today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-50">
            Join CivicLens and start detecting infrastructure issues with the power of AI —
            free to get started, no credit card required.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Get Started Free <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Radar size={16} />
            </div>
            <span className="font-bold">CivicLens</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} CivicLens. AI Powered Smart City Infrastructure Monitoring System.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" aria-label="Github" className="hover:text-primary-600"><Github size={18} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-primary-600"><Twitter size={18} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-primary-600"><Linkedin size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
