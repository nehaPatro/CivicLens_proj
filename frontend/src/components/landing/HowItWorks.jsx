import { UploadCloud, ScanSearch, FileCheck2 } from 'lucide-react'

const STEPS = [
  { icon: UploadCloud, title: 'Upload Media', desc: 'Upload an image or video of a road or flooded area from your device.' },
  { icon: ScanSearch, title: 'AI Detects Issues', desc: 'Our YOLO-powered models analyze the media and highlight potholes or floods with bounding boxes.' },
  { icon: FileCheck2, title: 'Save & Report', desc: 'Save the result to your dashboard and submit a report with location, severity and description.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 dark:bg-gray-900/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center animate-fade-in">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Workflow
          </span>
          <h2 className="section-title mt-2">How CivicLens works</h2>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-transparent via-primary-300 dark:via-primary-700 to-transparent md:block" />
          {STEPS.map((step, idx) => (
            <div key={step.title} className="relative flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: `${idx * 0.15}s` }}>
              <div className="z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
                <step.icon size={26} />
              </div>
              <span className="mb-2 text-xs font-bold text-primary-600 dark:text-primary-400">STEP {idx + 1}</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
