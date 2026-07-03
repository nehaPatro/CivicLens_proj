import {
  Construction, Waves, ImageIcon, Video, BrainCircuit,
  FileWarning, Bookmark, LayoutDashboard,
} from 'lucide-react'

const FEATURES = [
  { icon: Construction, title: 'Pothole Detection', desc: 'Spot road potholes instantly using a custom-trained YOLO model for accurate, real-world results.' },
  { icon: Waves, title: 'Flood Detection', desc: 'Identify flooded zones from images or footage to help authorities respond faster.' },
  { icon: ImageIcon, title: 'Image Analysis', desc: 'Upload a single photo and get instant AI-annotated detection results.' },
  { icon: Video, title: 'Video Analysis', desc: 'Run frame-by-frame detection across video footage for continuous monitoring.' },
  { icon: BrainCircuit, title: 'AI Powered Detection', desc: 'Powered by Ultralytics YOLO object detection for fast, reliable inference.' },
  { icon: FileWarning, title: 'Issue Reporting', desc: 'Turn any saved detection into a formal report with location and severity.' },
  { icon: Bookmark, title: 'Saved Results', desc: 'Keep a personal history of every detection — view, download, or delete anytime.' },
  { icon: LayoutDashboard, title: 'User Dashboard', desc: 'A clean, unified dashboard to manage detections, reports, and your profile.' },
]

export default function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center animate-fade-in">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Capabilities
          </span>
          <h2 className="section-title mt-2">Everything a smart city needs</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            A complete toolkit for detecting, tracking, and reporting infrastructure issues with computer vision.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, idx) => (
            <div
              key={feature.title}
              className="card card-hover group p-6 animate-slide-up"
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                <feature.icon size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
